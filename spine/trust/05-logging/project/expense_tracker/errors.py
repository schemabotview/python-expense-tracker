"""Everything the app refuses to do, as one family of exceptions."""


class TrackerError(Exception):
    """Something the app will not do, with a reason it can print."""


class InvalidAmount(TrackerError, ValueError):
    """An amount that is not a positive number of money."""


class InvalidRow(TrackerError):
    """A bank row the app will not import, and why."""


class UnknownCategory(TrackerError):
    """A category name that is not a Category."""

    def __init__(self, text):
        super().__init__(f"unknown category: {text!r}")
        self.text = text
