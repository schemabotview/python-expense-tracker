from decimal import Decimal

import pytest

from expense_tracker import rates
from expense_tracker.bank import validate
from expense_tracker.errors import TrackerError
from expense_tracker.models import Category
from expense_tracker.money import Money

GOOD = {"date": "2026-10-06", "description": "TESCO STORES 2041",
        "amount": "23.85", "currency": "GBP"}


@pytest.fixture
def seen():
    return set()    # a fresh one for every test that asks for it


@pytest.mark.parametrize("change, reason", [
    ({"amount": "12,50"}, "not a number"),
    ({"date": ""}, "no date"),
    ({"amount": "-15.99"}, "more than zero"),
])
def test_a_bad_row_is_refused(change, reason, seen):
    with pytest.raises(TrackerError, match=reason):
        validate(GOOD | change, seen)


def test_a_good_row_is_categorised(seen):
    assert validate(GOOD, seen).category is Category.FOOD


def test_the_same_row_twice_is_a_duplicate(seen):
    validate(GOOD, seen)
    with pytest.raises(TrackerError, match="duplicate"):
        validate(GOOD, seen)


def test_a_foreign_row_is_converted_to_pounds(seen, monkeypatch):
    monkeypatch.setattr(rates, "rate", lambda currency: Decimal("0.86"))
    expense = validate(GOOD | {"amount": "48.00", "currency": "EUR"}, seen)
    assert expense.amount == Money(Decimal("41.28"))
