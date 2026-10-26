# expense-tracker: where Ana's money goes
from decimal import Decimal

print("expense-tracker: starting")
NOT_ASKED = sentinel("NOT_ASKED")

today = [
    ("2026-10-01", "Café Lumen", Decimal("4.50"), "food"),
    ("2026-10-01", "Noodle Bar", Decimal("12.99"), "food"),
    ("2026-10-01", "Metro", Decimal("2.80"), "transport"),
]
date, description, amount, category = today[0]
print(f"{date}  {description}  {amount}  {category}")

budgets = {
    "food": Decimal("300"),
    "transport": Decimal("80"),
    "fun": Decimal("60"),
}
budgets["rent"] = Decimal("950")
print("food budget:", budgets["food"], "| categories:", len(budgets))
