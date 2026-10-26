"""Importing bank rows: keep the good, report the bad."""
import logging

from .categorise import categorise
from .errors import InvalidRow, TrackerError
from .models import Expense
from .money import Money, parse_amount
from .timing import timed

log = logging.getLogger(__name__)    # "expense_tracker.bank"
Seen = set[tuple[str, str, Money]]    # a type alias: what validate remembers
from .store import bank_rows


def validate(row: dict[str, str], seen: Seen) -> Expense:
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


@timed
def import_bank(expenses: list[Expense]) -> None:
    seen = {(e.date, e.description, e.amount) for e in expenses}
    good = 0
    for name, line, row in bank_rows():
        try:
            expenses.append(validate(row, seen))
            good += 1
        except TrackerError as error:
            log.warning("%s line %d: %s", name, line, error)
    print(good, "imported")
