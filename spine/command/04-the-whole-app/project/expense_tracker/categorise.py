"""Filing a bank description under a category."""
import re

RULES = [    # (pattern, category): the first that matches wins
    (re.compile(r"TESCO|PRET|CAF[EÉ]|MARKET"), "food"),
    (re.compile(r"^TFL|TRAIN|METRO"), "transport"),
    (re.compile(r"NETFLIX|SPOTIFY|CINEMA|CONCERT"), "fun"),
    (re.compile(r"^AMZN MKTP"), "shopping"),
    (re.compile(r"WATER|ENERGY|COUNCIL"), "bills"),
]


def categorise(description):
    for pattern, category in RULES:
        if pattern.search(description):
            return category
    return "other"


def recategorise(expenses):
    changed = 0
    for i, (date, description, amount, category) in enumerate(expenses):
        if category == "other" and (new := categorise(description)) != "other":
            expenses[i] = (date, description, amount, new)
            changed += 1
    return changed
