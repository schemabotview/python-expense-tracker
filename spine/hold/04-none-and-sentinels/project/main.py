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
month = date[:7]
print(f"{date}  {description}  {amount}  {category}")
print("note:", note is not None, "| receipt asked:", receipt is not NOT_ASKED)

lunch = Decimal("12.99")
print("Today so far:", amount + lunch)
