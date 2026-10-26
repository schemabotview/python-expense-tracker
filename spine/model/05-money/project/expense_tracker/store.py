"""Where the data lives: Ana's expenses file and her bank exports."""
import csv
import json
from decimal import Decimal
from pathlib import Path

from .models import Category, Expense
from .money import Money

DATA = Path("data")
SAVED = DATA / "expenses.json"
BANK = DATA / "bank"


def load():
    with SAVED.open() as file:
        rows = json.load(file)
    return [Expense(r["date"], r["description"],
                    Money(Decimal(r["amount"]), r.get("currency", "GBP")),
                    Category(r["category"])) for r in rows]


def save(expenses):
    rows = [{"date": e.date, "description": e.description,
             "amount": str(e.amount.amount), "currency": e.amount.currency,
             "category": e.category} for e in expenses]
    with SAVED.open("w") as file:
        json.dump(rows, file, indent=2, ensure_ascii=False)


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
