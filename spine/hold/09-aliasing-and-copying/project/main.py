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

DEFAULT_BUDGETS = frozendict(
    food=Decimal("300"), transport=Decimal("80"),
    fun=Decimal("60"), rent=Decimal("950"),
)
budgets = dict(DEFAULT_BUDGETS)    # Ana's own copy: she may change it
seen = {today[0][3], today[1][3], today[2][3]}
print("categories used:", sorted(seen), "| has fun:", "fun" in seen)

october = {"2026-10-01": today}    # a month: each day maps to its expenses
