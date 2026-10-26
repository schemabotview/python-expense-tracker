# expense-tracker: where Ana's money goes
from decimal import Decimal

print("expense-tracker: starting")

BUDGETS = frozendict(
    food=Decimal("300"), transport=Decimal("80"),
    fun=Decimal("60"), rent=Decimal("950"),
)
expenses = [
    ("2026-10-01", "Café Lumen", Decimal("4.50"), "food"),
    ("2026-10-01", "Noodle Bar", Decimal("12.99"), "food"),
    ("2026-10-01", "Metro", Decimal("2.80"), "transport"),
    ("2026-10-02", "Cinema Nova", Decimal("11.50"), "fun"),
    ("2026-10-03", "Corner Market", Decimal("46.20"), "food"),
    ("2026-10-04", "Train to Porto", Decimal("68.40"), "transport"),
    ("2026-10-05", "Concert tickets", Decimal("64.00"), "fun"),
]

totals = {}
for date, description, amount, category in expenses:
    totals[category] = totals.get(category, 0) + amount
for category, spent in totals.items():
    left = BUDGETS[category] - spent
    used = spent / BUDGETS[category] * 100
    if used > 100:
        print(f"{category}: over budget by {-left}")
    elif used >= 80:
        print(f"{category}: careful, {left} left")
    else:
        print(f"{category}: on track, {left} left")
