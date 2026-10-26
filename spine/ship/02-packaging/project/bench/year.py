"""A year of bank rows: made up, but the same on every run (seeded)."""
import random

SHOPS = ["TESCO STORES 2041", "PRET A MANGER", "TFL TRAVEL CH",
         "AMZN MKTP UK*2K4", "NETFLIX.COM", "THAMES WATER", "CAFE NERO",
         "SPOTIFY", "BOOTS 1123", "SHELL ENERGY", "CORNER MARKET",
         "NATIONAL RAIL"]


def year_rows(per_month=5000):
    rng = random.Random(2026)
    for month in range(1, 13):
        for _ in range(per_month):
            day = rng.randint(1, 28)
            yield {"date": f"2026-{month:02}-{day:02}",
                   "description": f"{rng.choice(SHOPS)} {rng.randint(1, 999)}",
                   "amount": f"{rng.randint(100, 9999) / 100:.2f}",
                   "currency": "GBP"}
