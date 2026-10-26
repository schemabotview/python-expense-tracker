"""Exchange rates, asked for over HTTP."""
import asyncio
import json
import urllib.error
import urllib.request
from decimal import Decimal

from .errors import TrackerError
from .money import Money

RATES_URL = "http://127.0.0.1:8765/rates"    # stub/rates_server.py


class NoRate(TrackerError):
    """The rate service has no rate for this currency."""


def rate(currency: str) -> Decimal:
    """What one unit of currency is worth in GBP."""
    try:
        with urllib.request.urlopen(f"{RATES_URL}/{currency}", timeout=5) as r:
            data = json.load(r)
    except urllib.error.HTTPError as error:
        raise NoRate(f"no rate for {currency}: HTTP {error.code}") from None
    return Decimal(data["rate"])


def to_gbp(money: Money) -> Money:
    if money.currency == "GBP":
        return money
    pounds = (money.amount * rate(money.currency)).quantize(Decimal("0.01"))
    return Money(pounds, "GBP")


async def rates_at_once(currencies: list[str]) -> list[Decimal]:
    """Ask for every rate at once: the waits overlap instead of adding up."""
    asks = [asyncio.to_thread(rate, c) for c in currencies]    # not started yet
    return await asyncio.gather(*asks)
