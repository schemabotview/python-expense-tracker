"""Settings, from four places, each overriding the one before it:
built-in defaults, then expense-tracker.toml, then the environment, then a flag.
A secret (an API key, say) belongs in the environment, never in a file in git.
"""
import os
import tomllib
from pathlib import Path

DEFAULTS = {"store": "json", "data": "data"}
FILE = Path("expense-tracker.toml")
PREFIX = "EXPENSE_TRACKER_"


def settings(flags: dict[str, str | None]) -> dict[str, tuple[str, str]]:
    """Every setting's value, and where that value came from."""
    found = {name: (value, "default") for name, value in DEFAULTS.items()}
    if FILE.exists():
        with FILE.open("rb") as file:    # tomllib reads bytes
            for name, value in tomllib.load(file).items():
                found[name] = (value, str(FILE))
    for name in DEFAULTS:
        if (value := os.environ.get(PREFIX + name.upper())) is not None:
            found[name] = (value, PREFIX + name.upper())
    for name, flag in flags.items():
        if flag is not None:
            found[name] = (flag, f"--{name}")
    return found
