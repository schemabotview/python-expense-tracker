"""Profile validating a year of bank rows: where does the time go?"""
import cProfile
import pstats

from bench.year import year_rows
from expense_tracker.bank import validate

WATCH = ["validate", "search", "hash", "categorise", "parse_amount",
         "__post_init__"]

rows = list(year_rows())
seen: set = set()
profile = cProfile.Profile()
profile.enable()
for row in rows:
    validate(row, seen)
profile.disable()

stats = pstats.Stats(profile)
own = {}    # function name -> seconds spent in it, not in what it called
for (file, line, name), (_, calls, tottime, _, _) in stats.stats.items():
    if name.startswith("<method '"):    # <method 'search' of 're.Pattern' …>
        name = name.split("'")[1]
    else:    # <built-in method builtins.hash>, or a plain function name
        name = name.strip("<>").rsplit(".", 1)[-1]
    own[name] = own.get(name, 0) + tottime
print(f"{len(rows)} rows in {stats.total_tt:.2f} s. Own time, by function:")
for name in WATCH:
    print(f"  {name:<14} {own.get(name, 0) / stats.total_tt:4.0%}")
