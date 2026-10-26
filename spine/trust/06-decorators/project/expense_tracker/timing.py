"""@timed: log how long a function took, without touching its code."""
import functools
import logging
import time
from collections.abc import Callable

log = logging.getLogger(__name__)


def timed[**P, R](function: Callable[P, R]) -> Callable[P, R]:
    @functools.wraps(function)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        start = time.perf_counter()
        try:
            return function(*args, **kwargs)
        finally:    # also when it raises
            took = (time.perf_counter() - start) * 1000
            log.debug("%s took %.1f ms", function.__name__, took)
    return wrapper
