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


def total(category):
    return sum(e[2] for e in expenses if e[3] == category)


def status(category, budget):
    spent = total(category)
    left = budget - spent
    used = spent / budget * 100
    if used > 100:
        return f"{category}: over budget by {-left}"
    elif used >= 80:
        return f"{category}: careful, {left} left"
    return f"{category}: on track, {left} left"


def report():
    for category, budget in BUDGETS.items():
        print(status(category, budget))


while True:
    match input("expense> ").split():
        case ["add", amount, category]:
            expenses.append(("2026-10-06", "added", Decimal(amount), category))
            print("added", amount, "to", category)
        case ["list", category]:
            for row in [e for e in expenses if e[3] == category]:
                print(*row)
        case ["report"]:
            report()
        case ["quit"]:
            break
        case _:
            print("commands: add AMOUNT CATEGORY, list CATEGORY, report, quit")
