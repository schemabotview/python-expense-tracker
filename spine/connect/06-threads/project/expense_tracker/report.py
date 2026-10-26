"""Budgets, and what Ana's spending says about them."""
from collections import defaultdict
from collections.abc import Iterator
from datetime import date, timedelta
from decimal import Decimal

from .models import Category, Expense
from .timing import timed
from .money import Money

TODAY = date(2026, 10, 16)    # the course's "today", fixed so every run agrees
WARN_AT = 80    # percent of a budget: past this, the report says careful


class Budget:
    """Monthly limits by category: a container to len, loop over and ask."""

    def __init__(self, limits: dict[Category, Decimal]) -> None:
        self._limits = frozendict(limits)

    def __len__(self) -> int:
        return len(self._limits)

    def __iter__(self) -> Iterator[Category]:
        return iter(self._limits)

    def __contains__(self, category: object) -> bool:
        return category in self._limits

    def __getitem__(self, category: Category) -> Decimal:
        return self._limits[category]


BUDGET = Budget({
    Category.FOOD: Decimal("300"), Category.TRANSPORT: Decimal("80"),
    Category.FUN: Decimal("60"), Category.RENT: Decimal("950"),
    Category.BILLS: Decimal("120"), Category.SHOPPING: Decimal("100"),
})


def spent_by_category(expenses: list[Expense],
                      month: str) -> dict[Category, Money]:
    totals: dict[Category, Money] = defaultdict(Money)    # starts at Money(0)
    for expense in expenses:
        if expense.month == month:
            totals[expense.category] += expense.amount
    return totals


def recent(expenses: list[Expense], days: int) -> list[Expense]:
    since = TODAY - timedelta(days=days)
    return [e for e in expenses if date.fromisoformat(e.date) > since]


def recurring(
        expenses: list[Expense]) -> Iterator[tuple[str, Money, list[int]]]:
    """Same payee, same amount, about a month apart: a bill or subscription."""
    seen = defaultdict(list)
    for e in expenses:
        seen[(e.description, e.amount)].append(date.fromisoformat(e.date))
    for (description, amount), days in seen.items():
        days.sort()
        gaps = [(b - a).days for a, b in zip(days, days[1:])]
        if gaps and all(25 <= gap <= 35 for gap in gaps):
            yield description, amount, gaps


def status(category: Category, budget: Decimal, spent: Money) -> str:
    used = spent.amount / budget * 100
    bar = "#" * min(10, int(used // 10))
    flag = "over" if used > 100 else "careful" if used >= WARN_AT else ""
    return (f"{category:<10}{spent:>9.2f}{budget:>9.2f}  "
            f"{bar:<10}{used:>5.0f}% {flag}")


@timed
def report(expenses: list[Expense], month: str) -> None:
    print(f"{month:<10}{'spent':>9}{'budget':>9}  {'used':<10}")
    totals = spent_by_category(expenses, month)
    for category in sorted(BUDGET, key=lambda c: totals[c], reverse=True):
        print(status(category, BUDGET[category], totals[category]))
