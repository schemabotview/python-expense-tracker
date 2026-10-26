"""Two jobs, timed two ways: wall-clock time, and CPU time."""
import time

from bench.year import year_rows
from expense_tracker.categorise import categorise
from expense_tracker.rates import rate


def measure(label, job):
    wall, cpu = time.perf_counter(), time.process_time()
    job()
    wall, cpu = time.perf_counter() - wall, time.process_time() - cpu
    print(f"{label:<30} wall {wall:5.2f} s   CPU {cpu:5.2f} s")


descriptions = [row["description"] for row in year_rows()]
measure("5 rates, one by one (I/O)", lambda: [rate(c) for c in
        ["EUR", "USD", "CHF", "JPY", "SEK"]])
measure("categorise 60,000 rows (CPU)", lambda: [categorise(d) for d in
        descriptions])
