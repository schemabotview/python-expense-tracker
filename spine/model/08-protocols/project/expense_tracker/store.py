"""Where the data lives: Ana's expenses file and her bank exports."""
import csv
import json
import sqlite3
from contextlib import closing
from decimal import Decimal
from pathlib import Path
from typing import Protocol

from .models import Category, Expense
from .money import Money

DATA = Path("data")
SAVED = DATA / "expenses.json"
DATABASE = DATA / "expenses.db"
BANK = DATA / "bank"

TABLE = """CREATE TABLE IF NOT EXISTS expenses
           (date TEXT, description TEXT, amount TEXT, currency TEXT,
            category TEXT)"""


class Store(Protocol):
    """Anything that can load and save expenses. No base class needed."""

    def load(self): ...

    def save(self, expenses): ...


def expense(date, description, amount, currency, category):
    return Expense(date, description, Money(Decimal(amount), currency),
                   Category(category))


def fields(e):
    return (e.date, e.description, str(e.amount.amount), e.amount.currency,
            str(e.category))


class JsonStore:
    def __init__(self, path=SAVED):
        self.path = path

    def load(self):
        with self.path.open() as file:
            return [expense(r["date"], r["description"], r["amount"],
                            r.get("currency", "GBP"), r["category"])
                    for r in json.load(file)]

    def save(self, expenses):
        names = ["date", "description", "amount", "currency", "category"]
        rows = [dict(zip(names, fields(e))) for e in expenses]
        with self.path.open("w") as file:
            json.dump(rows, file, indent=2, ensure_ascii=False)


class SqliteStore:
    def __init__(self, path=DATABASE):
        self.path = path

    def load(self):
        with closing(sqlite3.connect(self.path)) as db:
            db.execute(TABLE)
            return [expense(*row) for row in db.execute(
                "SELECT * FROM expenses ORDER BY date")]

    def save(self, expenses):
        with closing(sqlite3.connect(self.path)) as db:
            db.execute(TABLE)
            db.execute("DELETE FROM expenses")
            db.executemany("INSERT INTO expenses VALUES (?, ?, ?, ?, ?)",
                           [fields(e) for e in expenses])
            db.commit()


def read_export(path):
    """The export's text, and the encoding it turned out to be in."""
    try:
        return path.read_text(), "utf-8"    # UTF-8: the 3.15 default
    except UnicodeDecodeError:
        return path.read_text(encoding="latin-1"), "latin-1"


def bank_rows():
    """Every row of every export, one at a time: never all in memory."""
    for path in sorted(BANK.glob("*.csv")):
        text, encoding = read_export(path)
        for line, row in enumerate(csv.DictReader(text.splitlines()), start=2):
            yield path.name, line, row
