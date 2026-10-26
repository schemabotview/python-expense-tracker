"""Importing bank rows: keep the good, report the bad."""
from .categorise import categorise
from .models import Expense
from .money import Money, parse_amount
from .store import bank_rows


class InvalidRow(ValueError):
    """A bank row the app will not import, and why."""


def validate(row, seen):
    if not row["date"]:
        raise InvalidRow("no date")
    if row["currency"] != "GBP":
        raise InvalidRow(f"in {row['currency']}: needs a rate")
    amount = Money(parse_amount(row["amount"]), row["currency"])
    key = (row["date"], row["description"], amount)
    if key in seen:
        raise InvalidRow("a duplicate")
    seen.add(key)
    description = row["description"]
    return Expense(row["date"], description, amount, categorise(description))


def import_bank(expenses):
    seen = {(e.date, e.description, e.amount) for e in expenses}
    good = 0
    for name, line, row in bank_rows():
        try:
            expenses.append(validate(row, seen))
            good += 1
        except ValueError as error:
            print(f"  {name} line {line}: {error}")
    print(good, "imported")
