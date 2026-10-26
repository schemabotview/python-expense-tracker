"""Money: parsing an amount that Ana typed, or her bank wrote."""
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation

from .errors import InvalidAmount


def parse_amount(text: str) -> Decimal:
    try:
        amount = Decimal(text)
    except InvalidOperation:
        raise InvalidAmount(f"not a number: {text!r}") from None
    if amount <= 0:
        raise InvalidAmount(f"must be more than zero: {text}")
    return amount


@dataclass(frozen=True, order=True)
class Money:
    """An amount in one currency. Adding two currencies is a mistake."""
    amount: Decimal = Decimal("0")
    currency: str = "GBP"

    def __add__(self, other: "Money") -> "Money":
        if other.currency != self.currency:
            raise ValueError(f"cannot add {other.currency} to {self.currency}")
        return Money(self.amount + other.amount, self.currency)

    def __radd__(self, other: int) -> "Money":    # sum() starts from 0
        return self if other == 0 else NotImplemented

    def __format__(self, spec: str) -> str:    # f"{money:>9.2f}"
        return format(self.amount, spec)

    def __str__(self) -> str:
        return f"{self.amount} {self.currency}"
