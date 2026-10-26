"""The app's own types."""
from dataclasses import dataclass
from decimal import Decimal


@dataclass
class Expense:
    """One thing Ana paid for."""
    date: str
    description: str
    amount: Decimal
    category: str
