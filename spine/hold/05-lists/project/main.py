# expense-tracker: where Ana's money goes
from decimal import Decimal

print("expense-tracker: starting")
NOT_ASKED = sentinel("NOT_ASKED")

date = "2026-10-01"
description = "Café Lumen"
amount = Decimal("4.50")
category = "food"
note = None            # asked, and Ana left it blank
receipt = NOT_ASKED    # never asked for
print(f"{date}  {description}  {amount}  {category}")

today = [amount, Decimal("12.99")]
today.append(Decimal("2.80"))
print(len(today), "expenses today, total", sum(today))
