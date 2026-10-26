"""Filing a bank description under a category."""
import re

from .models import Category

RULES = [    # (pattern, category): the first that matches wins
    (re.compile(r"TESCO|PRET|CAF[EÉ]|MARKET"), Category.FOOD),
    (re.compile(r"^TFL|TRAIN|METRO"), Category.TRANSPORT),
    (re.compile(r"NETFLIX|SPOTIFY|CINEMA|CONCERT"), Category.FUN),
    (re.compile(r"^AMZN MKTP"), Category.SHOPPING),
    (re.compile(r"WATER|ENERGY|COUNCIL"), Category.BILLS),
]


def categorise(description):
    for pattern, category in RULES:
        if pattern.search(description):
            return category
    return Category.OTHER


def recategorise(expenses):
    changed = 0
    for expense in expenses:
        if expense.category is Category.OTHER:
            expense.category = categorise(expense.description)
            changed += expense.category is not Category.OTHER
    return changed
