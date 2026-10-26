"""Where the data lives: Ana's expenses file and her bank exports."""
import csv
import logging
import json
import sqlite3
from decimal import Decimal
from pathlib import Path
from collections.abc import Iterator
from typing import Protocol

from .models import Category, Expense
from .money import Money

log = logging.getLogger(__name__)
DATA = Path("data")
SAVED = DATA / "expenses.json"
DATABASE = DATA / "expenses.db"
BANK = DATA / "bank"

TABLE = """CREATE TABLE IF NOT EXISTS expenses
           (date TEXT, description TEXT, amount TEXT, currency TEXT,
            category TEXT)"""


class Store(Protocol):
    """Anything that can load and save expenses. No base class needed."""

    def __enter__(self): ...

    def __exit__(self, kind, error, traceback): ...

    def load(self) -> list[Expense]: ...

    def save(self, expenses: list[Expense]) -> None: ...


def expense(date: str, description: str, amount: str, currency: str,
            category: str) -> Expense:
    return Expense(date, description, Money(Decimal(amount), currency),
                   Category(category))


def fields(e: Expense) -> tuple[str, str, str, str, str]:
    return (e.date, e.description, str(e.amount.amount), e.amount.currency,
            str(e.category))


class JsonStore:
    def __init__(self, path=SAVED):
        self.path = path

    def __enter__(self):
        return self

    def __exit__(self, kind, error, traceback):
        return False

    def load(self):
        with self.path.open() as file:
            rows = json.load(file)
        log.debug("loaded %d expenses from %s", len(rows), self.path)
        return [expense(r["date"], r["description"], r["amount"],
                        r.get("currency", "GBP"), r["category"]) for r in rows]

    def save(self, expenses):
        names = ["date", "description", "amount", "currency", "category"]
        rows = [dict(zip(names, fields(e))) for e in expenses]
        with self.path.open("w") as file:
            json.dump(rows, file, indent=2, ensure_ascii=False)


class SqliteStore:
    """with SqliteStore() as store: one transaction, committed or undone."""

    def __init__(self, path=DATABASE):
        self.path = path

    def __enter__(self):
        self.db = sqlite3.connect(self.path)
        self.db.execute(TABLE)
        return self

    def __exit__(self, kind, error, traceback):
        if error is None:
            self.db.commit()
        else:
            self.db.rollback()    # nothing half-saved
        self.db.close()
        return False    # an error still goes on up

    def load(self):
        return [expense(*row) for row in self.db.execute(
            "SELECT * FROM expenses ORDER BY date")]

    def save(self, expenses):
        self.db.execute("DELETE FROM expenses")
        self.db.executemany("INSERT INTO expenses VALUES (?, ?, ?, ?, ?)",
                            [fields(e) for e in expenses])


def read_export(path: Path) -> tuple[str, str]:
    """The export's text, and the encoding it turned out to be in."""
    try:
        return path.read_text(), "utf-8"    # UTF-8: the 3.15 default
    except UnicodeDecodeError:
        return path.read_text(encoding="latin-1"), "latin-1"


def bank_rows() -> Iterator[tuple[str, int, dict[str, str]]]:
    """Every row of every export, one at a time: never all in memory."""
    for path in sorted(BANK.glob("*.csv")):
        text, encoding = read_export(path)
        for line, row in enumerate(csv.DictReader(text.splitlines()), start=2):
            yield path.name, line, row
