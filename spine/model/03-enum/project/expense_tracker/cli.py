"""The command line: expense-tracker COMMAND [ARGUMENTS]."""
import argparse
from collections import Counter

from .categorise import recategorise
from .models import Category, Expense
from .money import InvalidAmount, parse_amount
from .report import TODAY, recent, recurring, report
from .store import load, save
lazy from . import bank    # loaded on first use: only import needs it


def parser():
    p = argparse.ArgumentParser(prog="expense-tracker",
                                description="Where Ana's money goes.")
    commands = p.add_subparsers(dest="command", required=True)
    add = commands.add_parser("add", help="add an expense")
    add.add_argument("amount")
    add.add_argument("category", type=Category, choices=list(Category))
    add.add_argument("note", nargs="*")
    month = commands.add_parser("report", help="a month against its budgets")
    month.add_argument("--month", default=TODAY.isoformat()[:7])
    commands.add_parser("list", help="one category").add_argument("category")
    commands.add_parser("recent", help="the last N days").add_argument(
        "days", type=int)
    for name in ["import", "categorise", "payees", "top", "recurring"]:
        commands.add_parser(name)
    return p


def run(args, expenses):
    """One command. Returns True when it changed the expenses."""
    match args.command:
        case "add":
            try:
                amount = parse_amount(args.amount)
            except InvalidAmount as error:
                print("not added:", error)
                return False
            note = " ".join(args.note) or "added by hand"
            new = Expense(TODAY.isoformat(), note, amount, args.category)
            expenses.append(new)
            print("added", amount, "to", args.category)
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
        case "recurring":
            for description, amount, gaps in recurring(expenses):
                print(f"{description} {amount}, every {gaps} days")
    return False


def main(argv=None):
    expenses = load()
    if run(parser().parse_args(argv), expenses):
        save(expenses)
