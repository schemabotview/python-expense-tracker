"""Budgets, and what Ana's spending says about them."""
from collections import defaultdict
from datetime import date, timedelta
from decimal import Decimal

TODAY = date(2026, 10, 16)    # the course's "today", fixed so every run agrees
WARN_AT = 80    # percent of a budget: past this, the report says careful
BUDGETS = frozendict(
    food=Decimal("300"), transport=Decimal("80"), fun=Decimal("60"),
    rent=Decimal("950"), bills=Decimal("120"), shopping=Decimal("100"),
)


def spent_by_category(expenses, month):
    totals = defaultdict(Decimal)    # a missing category starts at Decimal(0)
    for expense in expenses:
        if expense.date.startswith(month):
            totals[expense.category] += expense.amount
    return totals


def recent(expenses, days):
    since = TODAY - timedelta(days=days)
    return [e for e in expenses if date.fromisoformat(e.date) > since]


def recurring(expenses):
    """Same payee, same amount, about a month apart: a bill or subscription."""
    seen = defaultdict(list)
    for e in expenses:
        seen[(e.description, e.amount)].append(date.fromisoformat(e.date))
    for (description, amount), days in seen.items():
        days.sort()
        gaps = [(b - a).days for a, b in zip(days, days[1:])]
        if gaps and all(25 <= gap <= 35 for gap in gaps):
            yield description, amount, gaps


def status(category, budget, spent):
    used = spent / budget * 100
    bar = "#" * min(10, int(used // 10))
    flag = "over" if used > 100 else "careful" if used >= WARN_AT else ""
    return (f"{category:<10}{spent:>9.2f}{budget:>9.2f}  "
            f"{bar:<10}{used:>5.0f}% {flag}")


def report(expenses, month):
    print(f"{month:<10}{'spent':>9}{'budget':>9}  {'used':<10}")
    totals = spent_by_category(expenses, month)
    for category in sorted(BUDGETS, key=lambda c: totals[c], reverse=True):
        print(status(category, BUDGETS[category], totals[category]))
