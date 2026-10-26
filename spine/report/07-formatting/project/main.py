# expense-tracker: where Ana's money goes
import csv
import json
import re
from collections import Counter, defaultdict
from datetime import date, timedelta
from decimal import Decimal, InvalidOperation
from pathlib import Path

TODAY = date(2026, 10, 16)    # the course's "today", fixed so every run agrees
WARN_AT = 80    # percent of a budget: past this, the report says careful
BUDGETS = frozendict(
    food=Decimal("300"), transport=Decimal("80"), fun=Decimal("60"),
    rent=Decimal("950"), bills=Decimal("120"), shopping=Decimal("100"),
)
added = 0    # expenses added this session
DATA = Path("data")
SAVED = DATA / "expenses.json"
BANK = DATA / "bank"
COMMANDS = ["add", "list", "report", "save", "exports", "import", "categorise",
            "payees", "top", "recent", "recurring", "quit"]
RULES = [    # (pattern, category): the first that matches wins
    (re.compile(r"TESCO|PRET|CAF[EÉ]|MARKET"), "food"),
    (re.compile(r"^TFL|TRAIN|METRO"), "transport"),
    (re.compile(r"NETFLIX|SPOTIFY|CINEMA|CONCERT"), "fun"),
    (re.compile(r"^AMZN MKTP"), "shopping"),
    (re.compile(r"WATER|ENERGY|COUNCIL"), "bills"),
]

def spent_by_category(month):
    totals = defaultdict(Decimal)    # a missing category starts at Decimal(0)
    for day, description, amount, category in expenses:
        if day.startswith(month):
            totals[category] += amount
    return totals


def recent(days):
    since = TODAY - timedelta(days=days)
    return [e for e in expenses if date.fromisoformat(e[0]) > since]


def status(category, budget, spent):
    used = spent / budget * 100
    bar = "#" * min(10, int(used // 10))
    flag = "over" if used > 100 else "careful" if used >= WARN_AT else ""
    return (f"{category:<10}{spent:>9.2f}{budget:>9.2f}  "
            f"{bar:<10}{used:>5.0f}% {flag}")


def report(month):
    print(f"{month:<10}{'spent':>9}{'budget':>9}  {'used':<10}")
    totals = spent_by_category(month)
    for category in sorted(BUDGETS, key=lambda c: totals[c], reverse=True):
        print(status(category, BUDGETS[category], totals[category]))


class InvalidAmount(ValueError):
    """An amount that is not a positive number of money."""


def parse_amount(text):
    try:
        amount = Decimal(text)
    except InvalidOperation:
        raise InvalidAmount(f"not a number: {text!r}") from None
    if amount <= 0:
        raise InvalidAmount(f"must be more than zero: {text}")
    return amount


def add_expense(amount, category, description="added by hand",
                date="2026-10-06"):
    global added
    expenses.append((date, description, amount, category))
    added += 1
    return len(expenses)


def load():
    with SAVED.open() as file:
        rows = json.load(file)
    return [(r["date"], r["description"], Decimal(r["amount"]), r["category"])
            for r in rows]


def save():
    rows = [{"date": d, "description": t, "amount": str(a), "category": c}
            for d, t, a, c in expenses]
    with SAVED.open("w") as file:
        json.dump(rows, file, indent=2, ensure_ascii=False)


def read_export(path):
    """The export's text, and the encoding it turned out to be in."""
    try:
        return path.read_text(), "utf-8"    # UTF-8: the 3.15 default
    except UnicodeDecodeError:
        return path.read_text(encoding="latin-1"), "latin-1"


def read_rows(path):
    text, encoding = read_export(path)
    return list(csv.DictReader(text.splitlines()))


def categorise(description):
    for pattern, category in RULES:
        if pattern.search(description):
            return category
    return "other"


def recategorise():
    changed = 0
    for i, (date, description, amount, category) in enumerate(expenses):
        if category == "other" and (new := categorise(description)) != "other":
            expenses[i] = (date, description, amount, new)
            changed += 1
    return changed


def recurring():
    """Same payee, same amount, about a month apart: a bill or subscription."""
    seen = defaultdict(list)
    for day, description, amount, category in expenses:
        seen[(description, amount)].append(date.fromisoformat(day))
    for (description, amount), days in seen.items():
        days.sort()
        gaps = [(b - a).days for a, b in zip(days, days[1:])]
        if gaps and all(25 <= gap <= 35 for gap in gaps):
            yield description, amount, gaps


class InvalidRow(ValueError):
    """A bank row the app will not import, and why."""


def validate(row, seen):
    if not row["date"]:
        raise InvalidRow("no date")
    if row["currency"] != "GBP":
        raise InvalidRow(f"in {row['currency']}: needs a rate")
    amount = parse_amount(row["amount"])
    key = (row["date"], row["description"], amount)
    if key in seen:
        raise InvalidRow("a duplicate")
    seen.add(key)
    description = row["description"]
    return (row["date"], description, amount, categorise(description))


def bank_rows():
    """Every row of every export, one at a time: never all in memory."""
    for path in sorted(BANK.glob("*.csv")):
        text, encoding = read_export(path)
        for line, row in enumerate(csv.DictReader(text.splitlines()), start=2):
            yield path.name, line, row


def import_bank():
    seen = {(d, t, a) for d, t, a, c in expenses}
    good = 0
    for name, line, row in bank_rows():
        try:
            expenses.append(validate(row, seen))
            good += 1
        except ValueError as error:
            print(f"  {name} line {line}: {error}")
    print(good, "imported")


expenses = load()


while True:
    match input("expense> ").split():
        case ["add", amount, category, *words]:
            try:
                note = " ".join(words)
                count = add_expense(parse_amount(amount), category, note)
            except InvalidAmount as error:
                print("not added:", error)
            else:
                print("added", amount, "to", category, "| expenses:", count)
        case ["list", category]:
            for row in [e for e in expenses if e[3] == category]:
                print(*row)
        case ["report"]:
            report(TODAY.isoformat()[:7])
        case ["report", month]:
            report(month)
        case ["recent", days]:
            last = recent(int(days))
            spent = sum(e[2] for e in last)
            print(len(last), "expenses,", spent, "in", days, "days")
        case ["recurring"]:
            for description, amount, gaps in recurring():
                print(f"{description} {amount}, every {gaps} days")
        case ["top"]:
            biggest = sorted(expenses, key=lambda e: e[2], reverse=True)
            for date, description, amount, category in biggest[:3]:
                print(date, description, amount, category)
        case ["payees"]:
            payees = Counter(description for _, description, _, _ in expenses)
            for payee, count in payees.most_common(3):
                print(f"{payee}: {count} times")
        case ["save"]:
            save()
            print("saved", len(expenses), "expenses to", SAVED)
        case ["exports"]:
            for path in sorted(BANK.glob("*.csv")):
                text, encoding = read_export(path)
                print(path.name, encoding, len(text.splitlines()), "lines")
        case ["categorise"]:
            print("categorised", recategorise(), "expenses")
        case ["import"]:
            import_bank()
            save()
        case ["quit"]:
            if added:
                print("added this session:", added)
            break
        case _:
            print("commands:", ", ".join(COMMANDS))
