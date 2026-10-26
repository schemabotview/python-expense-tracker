import pytest

from expense_tracker.bank import validate
from expense_tracker.errors import TrackerError
from expense_tracker.models import Category

GOOD = {"date": "2026-10-06", "description": "TESCO STORES 2041",
        "amount": "23.85", "currency": "GBP"}


@pytest.fixture
def seen():
    return set()    # a fresh one for every test that asks for it


@pytest.mark.parametrize("change, reason", [
    ({"amount": "12,50"}, "not a number"),
    ({"date": ""}, "no date"),
    ({"amount": "-15.99"}, "more than zero"),
    ({"currency": "EUR"}, "needs a rate"),
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
