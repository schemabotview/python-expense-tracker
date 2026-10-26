"""The app's own types."""
from dataclasses import dataclass
from enum import StrEnum

from .errors import InvalidAmount, UnknownCategory
from .money import Money


class Category(StrEnum):
    """The only categories there are: a typo is an error, not a new one."""
    FOOD = "food"
    TRANSPORT = "transport"
    FUN = "fun"
    RENT = "rent"
    BILLS = "bills"
    SHOPPING = "shopping"
    OTHER = "other"

    @classmethod
    def parse(cls, text):
        try:
            return cls(text.lower())
        except ValueError:
            raise UnknownCategory(text) from None


@dataclass
class Expense:
    """One thing Ana paid for."""
    date: str
    description: str
    amount: Money
    category: Category

    def __post_init__(self):    # runs after the generated __init__
        if self.amount.amount <= 0:
            raise InvalidAmount(f"must be more than zero: {self.amount}")

    @property
    def month(self):
        return self.date[:7]
