from decimal import Decimal

import pytest

from expense_tracker.errors import InvalidAmount
from expense_tracker.money import Money, parse_amount


def test_adding_money_makes_new_money():
    total = Money(Decimal("4.50")) + Money(Decimal("12.99"))
    assert total == Money(Decimal("17.49"))


def test_two_currencies_do_not_add():
    with pytest.raises(ValueError, match="cannot add EUR to GBP"):
        Money(Decimal("4.50")) + Money(Decimal("48.00"), "EUR")


def test_sum_starts_from_zero():
    one, two = Money(Decimal("1")), Money(Decimal("2"))
    assert sum([one, two]) == Money(Decimal("3"))


def test_a_comma_is_not_a_number():
    with pytest.raises(InvalidAmount):
        parse_amount("12,50")
