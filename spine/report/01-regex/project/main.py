# expense-tracker: where Ana's money goes
import csv
import json
import re
from decimal import Decimal, InvalidOperation
from pathlib import Path

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
            "quit"]
RULES = [    # (pattern, category): the first that matches wins
    (re.compile(r"TESCO|PRET|CAF[EÉ]|MARKET"), "food"),
    (re.compile(r"^TFL|TRAIN|METRO"), "transport"),
    (re.compile(r"NETFLIX|SPOTIFY|CINEMA|CONCERT"), "fun"),
    (re.compile(r"^AMZN MKTP"), "shopping"),
    (re.compile(r"WATER|ENERGY|COUNCIL"), "bills"),
]

def total(category):
    return sum(e[2] for e in expenses if e[3] == category)


def status(category, budget):
    spent = total(category)
    left = budget - spent
    used = spent / budget * 100
    if used > 100:
        return f"{category}: over budget by {-left}"
    elif used >= WARN_AT:
        return f"{category}: careful, {left} left"
    return f"{category}: on track, {left} left"


def report():
    for category, budget in BUDGETS.items():
        print(status(category, budget))


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


def import_bank():
    seen = {(d, t, a) for d, t, a, c in expenses}
    for path in sorted(BANK.glob("*.csv")):
        good = 0
        for line, row in enumerate(read_rows(path), start=2):
            try:
                expenses.append(validate(row, seen))
                good += 1
            except ValueError as error:
                print(f"  {path.name} line {line}: {error}")
        print(path.name, good, "imported")


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
            report()
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
