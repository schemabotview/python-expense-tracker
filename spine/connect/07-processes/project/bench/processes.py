"""The same work as bench/threads.py, on 1 process, then 4."""
import time
from concurrent.futures import ProcessPoolExecutor

from bench.threads import descriptions, work


def seconds(processes):
    size = len(descriptions) // processes
    chunks = [descriptions[i * size:(i + 1) * size] for i in range(processes)]
    start = time.perf_counter()
    with ProcessPoolExecutor(processes) as pool:
        list(pool.map(work, chunks))
    return time.perf_counter() - start


if __name__ == "__main__":
    one, four = seconds(1), seconds(4)
    print(f"1 process {one:.2f} s, 4 processes {four:.2f} s, {one / four:.1f}x")
