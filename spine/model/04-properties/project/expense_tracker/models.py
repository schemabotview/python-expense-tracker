"""The app's own types."""
from dataclasses import dataclass
from decimal import Decimal
from enum import StrEnum

from .money import InvalidAmount


class Category(StrEnum):
    """The only categories there are: a typo is an error, not a new one."""
    FOOD = "food"
    TRANSPORT = "transport"
    FUN = "fun"
    RENT = "rent"
    BILLS = "bills"
    SHOPPING = "shopping"
    OTHER = "other"


@dataclass
class Expense:
    """One thing Ana paid for."""
    date: str
    description: str
    amount: Decimal
    category: Category

    def __post_init__(self):    # runs after the generated __init__
        if self.amount <= 0:
            raise InvalidAmount(f"must be more than zero: {self.amount}")

    @property
    def month(self):
        return self.date[:7]
