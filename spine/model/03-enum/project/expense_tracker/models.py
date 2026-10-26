"""The app's own types."""
from dataclasses import dataclass
from decimal import Decimal
from enum import StrEnum


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
