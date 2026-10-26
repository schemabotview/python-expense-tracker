"""The command line: expense-tracker COMMAND [ARGUMENTS]."""
import argparse
import asyncio
import logging
import time
from collections import Counter
from pathlib import Path

from .categorise import recategorise
from .api import serve
from .config import settings
from .errors import TrackerError
from .models import Category, Expense
from .money import Money, parse_amount
from .rates import rate, rates_at_once
from .report import TODAY, recent, recurring, report
from .store import JsonStore, SqliteStore, Store
lazy from . import bank    # loaded on first use: only import needs it

STORES: dict[str, type[Store]] = {"json": JsonStore,
                                  "sqlite": SqliteStore}
FILES = {"json": "expenses.json", "sqlite": "expenses.db"}


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="expense-tracker",
                                description="Where Ana's money goes.")
    p.add_argument("--store", choices=STORES)
    p.add_argument("-v", "--verbose", action="store_true", help="details")
    commands = p.add_subparsers(dest="command", required=True)
    add = commands.add_parser("add", help="add an expense")
    add.add_argument("amount")
    add.add_argument("category")
    add.add_argument("note", nargs="*")
    month = commands.add_parser("report", help="a month against its budgets")
    month.add_argument("--month", default=TODAY.isoformat()[:7])
    commands.add_parser("list", help="one category").add_argument("category")
    commands.add_parser("recent", help="the last N days").add_argument(
        "days", type=int)
    commands.add_parser("rate", help="a currency in GBP").add_argument(
        "currency")
    many = commands.add_parser("rates", help="several currencies in GBP")
    many.add_argument("currencies", nargs="+")
    many.add_argument("--one-by-one", action="store_true")
    web = commands.add_parser("serve", help="the JSON web API")
    web.add_argument("--port", type=int, default=8766)
    web.add_argument("--idle", type=float, help="stop after IDLE quiet seconds")
    for name in ["import", "categorise", "payees", "top", "recurring",
                 "config"]:
        commands.add_parser(name)
    return p


def run(args: argparse.Namespace, expenses: list[Expense]) -> bool:
    """One command. Returns True when it changed the expenses."""
    match args.command:
        case "add":
            try:
                amount = Money(parse_amount(args.amount))
                category = Category.parse(args.category)
            except TrackerError as error:
                print("not added:", error)
                return False
            note = " ".join(args.note) or "added by hand"
            expenses.append(Expense(TODAY.isoformat(), note, amount, category))
            print("added", amount, "to", category)
            return True
        case "list":
            for e in [e for e in expenses if e.category == args.category]:
                print(e.date, e.description, e.amount, e.category)
        case "report":
            report(expenses, args.month)
        case "import":
            bank.import_bank(expenses)
            return True
        case "categorise":
            print("categorised", recategorise(expenses), "expenses")
            return True
        case "payees":
            payees = Counter(e.description for e in expenses)
            for payee, count in payees.most_common(3):
                print(f"{payee}: {count} times")
        case "top":
            biggest = sorted(expenses, key=lambda e: e.amount, reverse=True)
            for e in biggest[:3]:
                print(e.date, e.description, e.amount, e.category)
        case "recent":
            last = recent(expenses, args.days)
            spent = sum(e.amount for e in last)
            print(len(last), "expenses,", spent, "in", args.days, "days")
        case "rate":
            try:
                print(f"1 {args.currency} = {rate(args.currency)} GBP")
            except TrackerError as error:
                print(error)
        case "rates":
            start = time.perf_counter()
            if args.one_by_one:
                found = [rate(c) for c in args.currencies]
            else:
                found = asyncio.run(rates_at_once(args.currencies))
            took = time.perf_counter() - start
            print("  ".join(f"{c} {r}" for c, r in zip(args.currencies, found)))
            print(f"{len(found)} rates in {took:.1f} s")
        case "recurring":
            for description, amount, gaps in recurring(expenses):
                print(f"{description} {amount}, every {gaps} days")
    return False


def main(argv: list[str] | None = None) -> None:
    args = parser().parse_args(argv)
    level = logging.DEBUG if args.verbose else logging.WARNING
    logging.basicConfig(level=level,
                        format="%(levelname)s %(name)s: %(message)s")
    found = settings({"store": args.store})
    if args.command == "serve":
        return serve(args.port, args.idle)
    if args.command == "config":
        for name, (value, source) in found.items():
            print(f"{name:<6} = {value:<7} from {source}")
        return
    kind, data = found["store"][0], Path(found["data"][0])
    with STORES[kind](data / FILES[kind]) as store:    # either: same methods
        expenses = store.load()
        if run(args, expenses):
            store.save(expenses)
