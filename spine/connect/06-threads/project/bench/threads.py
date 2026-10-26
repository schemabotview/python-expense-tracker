"""Categorise a year of descriptions, 20 times over, on 1 thread, then 4."""
import sys
import time
from concurrent.futures import ThreadPoolExecutor

from bench.year import year_rows
from expense_tracker.categorise import categorise

descriptions = [row["description"] for row in year_rows()] * 20


def work(chunk):
    return [categorise(d) for d in chunk]


def seconds(threads):
    size = len(descriptions) // threads
    chunks = [descriptions[i * size:(i + 1) * size] for i in range(threads)]
    start = time.perf_counter()
    with ThreadPoolExecutor(threads) as pool:
        list(pool.map(work, chunks))
    return time.perf_counter() - start


if __name__ == "__main__":
    gil = "on " if sys._is_gil_enabled() else "off"
    one, four = seconds(1), seconds(4)
    print(f"GIL {gil}: 1 thread {one:.2f} s, 4 threads {four:.2f} s,"
          f" {one / four:.1f}x")
