# expense-tracker: where Ana's money goes
import json
from decimal import Decimal, InvalidOperation
from pathlib import Path

WARN_AT = 80    # percent of a budget: past this, the report says careful
BUDGETS = frozendict(
    food=Decimal("300"), transport=Decimal("80"),
    fun=Decimal("60"), rent=Decimal("950"),
)
added = 0    # expenses added this session
DATA = Path("data")
SAVED = DATA / "expenses.json"
BANK = DATA / "bank"

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
        case ["quit"]:
            if added:
                print("added this session:", added)
            break
        case _:
            print("commands: add, list, report, save, exports, quit")
