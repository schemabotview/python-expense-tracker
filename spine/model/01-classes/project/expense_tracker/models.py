"""The app's own types."""


class Expense:
    """One thing Ana paid for."""

    def __init__(self, date, description, amount, category):
        self.date = date
        self.description = description
        self.amount = amount
        self.category = category
