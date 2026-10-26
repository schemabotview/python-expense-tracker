from expense_tracker.categorise import categorise
from expense_tracker.models import Category


def test_amazon_is_shopping():
    assert categorise("AMZN MKTP UK*2K4") is Category.SHOPPING


def test_an_unknown_shop_is_other():
    assert categorise("BAKERY") is Category.OTHER
