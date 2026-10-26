# expense-tracker: where Ana's money goes
from collections import Counter

from categorise import recategorise
from money import InvalidAmount, parse_amount
from report import TODAY, recent, recurring, report
from store import load, save
lazy import bank    # only the import command needs it: loaded on first use

COMMANDS = ["add", "list", "report", "save", "import", "categorise",
            "payees", "top", "recent", "recurring", "quit"]
expenses = load()
added = 0    # expenses added this session

while True:
    match input("expense> ").split():
        case ["add", amount, category, *words]:
            try:
                amount = parse_amount(amount)
            except InvalidAmount as error:
                print("not added:", error)
                continue
            note = " ".join(words) or "added by hand"
            expenses.append((TODAY.isoformat(), note, amount, category))
            added += 1
            print("added", amount, "to", category)
        case ["list", category]:
            for row in [e for e in expenses if e[3] == category]:
                print(*row)
        case ["report"]:
            report(expenses, TODAY.isoformat()[:7])
        case ["report", month]:
            report(expenses, month)
        case ["save"]:
            save(expenses)
            print("saved", len(expenses), "expenses")
        case ["import"]:
            bank.import_bank(expenses)
            save(expenses)
        case ["categorise"]:
            print("categorised", recategorise(expenses), "expenses")
        case ["payees"]:
            payees = Counter(e[1] for e in expenses)
            for payee, count in payees.most_common(3):
                print(f"{payee}: {count} times")
        case ["top"]:
            biggest = sorted(expenses, key=lambda e: e[2], reverse=True)
            for date, description, amount, category in biggest[:3]:
                print(date, description, amount, category)
        case ["recent", days]:
            last = recent(expenses, int(days))
            spent = sum(e[2] for e in last)
            print(len(last), "expenses,", spent, "in", days, "days")
        case ["recurring"]:
            for description, amount, gaps in recurring(expenses):
                print(f"{description} {amount}, every {gaps} days")
        case ["quit"]:
            if added:
                print("added this session:", added)
            break
        case _:
            print("commands:", ", ".join(COMMANDS))
