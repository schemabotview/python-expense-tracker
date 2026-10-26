import inspect
import sys
from decimal import Decimal

expenses = [("2026-10-01", "Café Lumen", Decimal("4.50"), "food")]


def total(category):
    frames = [f.function for f in inspect.stack()]
    print("stack, top first:", frames)
    print("names in total's frame:", list(sys._getframe().f_locals))
    print("refcount of the list:", sys.getrefcount(expenses))
    return sum(e[2] for e in expenses if e[3] == category)


def report():
    spent = total("food")
    print("food:", spent)


report()
