# expense-tracker: where Ana's money goes
from decimal import Decimal

print("expense-tracker: starting")

date = "2026-10-01"
description = "Café Lumen"
amount = Decimal("4.50")
category = "food"
print(date, description, amount, category)

lunch = Decimal("12.99")
print("Today so far:", amount + lunch)
