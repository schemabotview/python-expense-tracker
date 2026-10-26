from datetime import date
from decimal import Decimal

from expense_tracker import cli, report
from expense_tracker.models import Category, Expense
from expense_tracker.money import Money


class FakeStore:
    """A Store that lives in memory: the same shape, no files touched."""

    def __init__(self, expenses):
        self.expenses, self.saved = expenses, None

    def __enter__(self):
        return self

    def __exit__(self, kind, error, traceback):
        return False

    def load(self):
        return list(self.expenses)

    def save(self, expenses):
        self.saved = expenses


def test_add_saves_through_the_store(monkeypatch, capsys):
    fake = FakeStore([])
    monkeypatch.setitem(cli.STORES, "json", lambda: fake)
    cli.main(["add", "3.20", "food", "bakery"])
    assert [e.description for e in fake.saved] == ["bakery"]
    assert capsys.readouterr().out == "added 3.20 GBP to food\n"


def test_a_refused_add_saves_nothing(monkeypatch):
    fake = FakeStore([])
    monkeypatch.setitem(cli.STORES, "json", lambda: fake)
    cli.main(["add", "12,50", "food"])
    assert fake.saved is None


def test_recent_counts_back_from_today(monkeypatch):
    monkeypatch.setattr(report, "TODAY", date(2026, 10, 10))
    old = Expense("2026-09-01", "old", Money(Decimal("1")), Category.FUN)
    new = Expense("2026-10-09", "new", Money(Decimal("2")), Category.FUN)
    assert report.recent([old, new], 7) == [new]
