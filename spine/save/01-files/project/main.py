# expense-tracker: where Ana's money goes
from decimal import Decimal, InvalidOperation

WARN_AT = 80    # percent of a budget: past this, the report says careful
BUDGETS = frozendict(
    food=Decimal("300"), transport=Decimal("80"),
    fun=Decimal("60"), rent=Decimal("950"),
)
added = 0    # expenses added this session
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
    elif used >= WARN_AT:
        return f"{category}: careful, {left} left"
    return f"{category}: on track, {left} left"


def report():
    for category, budget in BUDGETS.items():
        print(status(category, budget))


class InvalidAmount(ValueError):
    """An amount that is not a positive number of money."""


def parse_amount(text):
    try:
        amount = Decimal(text)
    except InvalidOperation:
        raise InvalidAmount(f"not a number: {text!r}") from None
    if amount <= 0:
        raise InvalidAmount(f"must be more than zero: {text}")
    return amount


def add_expense(amount, category, description="added by hand",
                date="2026-10-06"):
    global added
    expenses.append((date, description, amount, category))
    added += 1
    return len(expenses)


def save_text(path):
    with open(path, "w") as file:
        for date, description, amount, category in expenses:
            file.write(f"{date}|{description}|{amount}|{category}\n")


while True:
    match input("expense> ").split():
        case ["add", amount, category, *words]:
            try:
                note = " ".join(words)
                count = add_expense(parse_amount(amount), category, note)
            except InvalidAmount as error:
                print("not added:", error)
            else:
                print("added", amount, "to", category, "| expenses:", count)
        case ["list", category]:
            for row in [e for e in expenses if e[3] == category]:
                print(*row)
        case ["report"]:
            report()
        case ["save"]:
            save_text("expenses.txt")
            print("saved", len(expenses), "expenses to expenses.txt")
        case ["quit"]:
            if added:
                print("added this session:", added)
            break
        case _:
            print("commands: add, list, report, save, quit")
