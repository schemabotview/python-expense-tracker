# Learn Python by building an expense tracker: full course, beginner to professional — plan

**Status: v1 plan, awaiting owner review (2026-10-26).** Nothing is authored yet.

## The idea

One application, `expense-tracker`, a personal expense tracker. It grows from a five-line script to a tested,
packaged command and a small web API. Every Python feature is taught **when the app first needs
it**. Background topics (what Python is, how it runs code, memory) appear as short detours at the
moment they answer a question on screen. They are never front-loaded.

Why an expense tracker:

- **Everyone understands it.** Everyone has spent money, so there is no domain to explain.
- **It is useful.** A learner can run it on their own bank export, so the result is theirs.
- **It grows the way Python is used**: a script → a command-line tool → a web service.
- **Each need pulls in a feature**: money needs `Decimal`, bank exports need files, CSV and
  encodings, categorising needs regex, budgets need dicts, storage needs classes and protocols,
  exchange rates need `asyncio`. Nothing is taught for its own sake.

## Packaging for YouTube

**One video: "Learn Python by building an expense tracker: full course, beginner to professional"**
covers all 11 courses, 69 sections, ~2 h 20 min, as one continuous story: the app grows from
its first line to a shipped tool, with no break in the middle.

A course is one YouTube chapter group and the owner's review unit. A section (90–150 s) is one
chapter, titled *concept: what the app gets* (e.g. "Dictionaries: budgets per category").
The video opens with the finished app running (the payoff first). It is published only when all 11
courses are recorded. Each section can also go out as a Short (portrait, `record-reels`).

## Python: 3.15, pinned to 3.15.1

Same pin as python-ct (`3.15.1`, and `3.15.1t` where threads are measured). Every output is run.
3.15 features used: UTF-8 default (5.4), `frozendict` (3.8), `sentinel` (3.4), unpacking in
comprehensions (4.6), `lazy import` (7.3), free-threaded build (10.5).

## The app: `expense-tracker`

One name everywhere: the folder, the project in `pyproject.toml` and the command are
`expense-tracker`; the importable package is `expense_tracker` (Python names cannot contain `-`,
taught in 7.2 and 11.2).

Ana's spending. Data is synthetic and owned: `data/bank/bank-2026-MM.csv` exports
(`date,description,amount,currency`) and `data/budgets.json` (food, transport, rent, bills,
shopping, fun). The bad rows are real: `12,50` as an amount, a missing date, a duplicate
transaction, a refund (negative), a file saved as Latin-1 (`Café Müller`), and EUR spending that needs a rate.
Money is a `Decimal` from its first appearance, then a `Money` object (Course 8).

```
expense-tracker/
  .venv/                                                              (2)
  main.py               the script a beginner runs                   (2 → 7, then a shim)
  data/expenses.json    what the app saves                           (5)
  data/budgets.json     limits per category                          (5)
  data/bank/*.csv       bank exports to import                       (5)
  expense_tracker/
    __init__.py, __main__.py                                         (7)
    cli.py              argparse: add / list / import / report       (7)
    categorise.py       regex rules: "AMZN MKTP*…" → shopping         (6)
    report.py           monthly report, terminal bar chart           (6)
    models.py           Expense, Category (Enum), Budget             (8)
    money.py            Money: a value object                        (8)
    store.py            Store protocol: JsonStore, SqliteStore       (8)
    rates.py            exchange rates, async                        (10)
    api.py              a small JSON web API                         (11)
  tests/                                                             (9 →)
  pyproject.toml        project, dev tools, the `expense-tracker` command (7 → 11)
```

| After course | The app can… |
| --- | --- |
| 2 Start | print one expense |
| 3 Hold | hold a month of expenses and budgets in code |
| 4 Decide | total, check budgets, take commands in a loop, reject bad input |
| 5 Save | save/load its data; import a real bank CSV, reporting bad rows |
| 6 Report | auto-categorise, report by category/month, spot recurring bills |
| 7 Command | run as `expense-tracker add 12.50 food` / `expense-tracker report --month 2026-10` |
| 8 Model | classes everywhere; JSON or SQLite storage behind one protocol |
| 9 Trust | typed, tested, logged |
| 10 Connect | fetch exchange rates concurrently; measured |
| 11 Ship | configured, installable, and served as a web API |

## The courses

Detours are marked ◆. Side pane = the diagram (every IDE section carries one).

**1. `intro` · Python, and what we'll build · 2**

| # | Section | Frame | Side pane |
| --- | --- | --- | --- |
| 1 | What Python is, and where it's used | concept | Python → automation, web, data, ML, with a real tool on each |
| 2 | What we'll build | concept | **the app map**: script → command → web API; the finished report |

**2. `start` · The first script · 5**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | A folder and a venv | `python3.15 -m venv .venv` | system Python ← `.venv`, separate `site-packages` |
| 2 | `main.py` | print one expense | file → interpreter → stdout |
| 3 | ◆ What `python main.py` does | `dis` in the REPL | source → bytecode → VM → output |
| 4 | The REPL beside the editor | try `12.50 + 3.20`, then write it down | read → eval → print → loop |
| 5 | Reading errors | a `SyntaxError`, then a `NameError` | traceback anatomy, last line first |

**3. `hold` · Hold the data · 9**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Names and objects ◆ the heap | `amount`, `category` | names → objects; a rebind moves an arrow |
| 2 | Numbers, and why money is a `Decimal` | `0.1 + 0.2`; amounts become `Decimal` | what `0.1` stores vs `Decimal("0.1")` |
| 3 | Strings | descriptions: slicing, `.upper()`, f-strings | the string as indexed cells |
| 4 | `None` and sentinels | "no note" vs "not given" | three states, three branches |
| 5 | Lists | a month of expenses | list slots → expense objects |
| 6 | Tuples and unpacking | `date, desc, amount = row` | one tuple, three names |
| 7 | Dictionaries | budgets by category; an expense as a dict | hash table: keys → buckets → values |
| 8 | Sets and `frozendict` | categories seen; frozen defaults | `in` on a set vs a list; a refused write |
| 9 | Aliasing and copying ◆ refcounts | edit a "copy", the original changes | two names, one list; shallow vs deep |

**4. `decide` · Make decisions, repeat, react · 10**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Expressions | a month total; precedence | expression tree |
| 2 | `if` / `elif` / `else` | over budget? warning / ok | decision chart, one path lit |
| 3 | `for` loops | total per category | cursor down the list, name rebound |
| 4 | `while` and `input()` | a command loop until `quit` | the loop with its exits |
| 5 | `match` | dispatch `add` / `list` / `report` | the command against each case |
| 6 | Comprehensions | food spending in one line (3.15 unpacking) | comprehension ↔ the loop it means |
| 7 | Functions ◆ the call stack | `add_expense()`, `total()` | a frame pushed, popped |
| 8 | Arguments and the mutable default | `tags=[]` bug | two calls, one default list |
| 9 | Scope | LEGB; a global budget | namespaces, the lookup for one name |
| 10 | Exceptions | `Decimal("abc")` → ask again; raise `InvalidAmount` | the exception travelling up a frame |

**5. `save` · Save it, import the bank · 6**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Files and `with` | save expenses to a text file | open → write → close, `with` on error |
| 2 | JSON | `expenses.json`; `Decimal` as a string | Python types → JSON, the one that needs a decision |
| 3 | `pathlib` | `data/`, every file in `data/bank/` | a `Path`, its parts, the glob's matches |
| 4 | Text and encodings | 3.15 UTF-8 default; the Latin-1 export | bytes → decode → `str`, `0xE9` two ways |
| 5 | CSV | import a bank export | header → dict keys, line → dict |
| 6 | Validating rows | keep good, report bad, skip duplicates | rows tagged ok / rejected with reason |

**6. `report` · Categorise and report · 7**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Regular expressions | `"AMZN MKTP*…"` → shopping | the pattern taken apart, a match lit |
| 2 | Grouping, `Counter`, `defaultdict` | spend per category | rows dropping into buckets |
| 3 | Sorting and `lambda` | top 5 expenses | plot: spend by category, sorted |
| 4 | Dates and times | this month, last 30 days | plot: spend per day across October |
| 5 | Recurring bills | same payee, monthly → flagged | result: the recurring list |
| 6 | Generators | a year of exports, one row at a time | the generator's frame paused at `yield` |
| 7 | Formatting the report | format specs; a terminal bar chart | one spec taken apart |

**7. `command` · A real command · 4**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Modules ◆ what `import` runs | split `main.py`; `lazy import` | import graph, `sys.modules` |
| 2 | Packages and `__main__` | `expense_tracker/`; `python -m expense_tracker`; why `_` not `-` | two ways in, one guard |
| 3 | `argparse` | `expense-tracker add 12.50 food`, `… report` | argv → parser → the call it makes |
| 4 | The whole app | import → categorise → report, end to end | **the app map**, the stages built so far lit |

**8. `model` · Model it with classes · 9**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Classes | `Expense`: `__init__`, `self` | instance → class; attrs vs methods |
| 2 | Dataclasses | `Expense` as a dataclass | what `@dataclass` generated |
| 3 | `Enum` | `Category` replaces strings | members, values, the typo it prevents |
| 4 | Properties and invariants | amount must be non-zero | construction → accepted / `ValueError` |
| 5 | A value object | `Money`: frozen, `__add__`, currency-aware | `a + b` makes a new object |
| 6 | Container dunders | `Budget` with `__len__`, `__iter__`, `__contains__` | `len(b)` → `__len__` … |
| 7 | Inheritance | `TrackerError` → `InvalidAmount`, `UnknownCategory` | the hierarchy; which `except` catches which |
| 8 | Protocols and polymorphism | `Store`: `JsonStore`, `SqliteStore` | one protocol, two stores |
| 9 | Context managers | SQLite transaction: commit or roll back | enter → work → exit, both paths |

**9. `trust` · Make it trustworthy · 6**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Type hints and mypy | mypy finds a real bug | functions with typed in/out edges |
| 2 | `pytest` | tests for `Money` and categorise | test → unit → assert |
| 3 | Fixtures and parametrisation | every bad bank row, one test | one test fanned into cases |
| 4 | Fakes | an in-memory `Store`; a fixed clock | real and fake both satisfy `Store` |
| 5 | Logging | `logging` instead of `print` | logger → handler → file / stderr |
| 6 | Decorators and closures | `@timed` | wrapper + closure cell |

**10. `connect` · Talk to the network, measure it · 6**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | HTTP | one EUR rate from a local stub API (`urllib`) | request → response → `Money` |
| 2 | `asyncio` | every rate at once | event loop, suspended tasks |
| 3 | Measure first | `cProfile` on a year import | profile top rows |
| 4 | CPU- vs I/O-bound | the question that picks the tool | where time goes in each |
| 5 | Threads, the GIL, free-threaded 3.15t | categorise a year on both builds | plot: wall time, 1 vs 4 threads |
| 6 | Processes | one process per export file | pool, workers, results gathered |

The rate API is a stdlib `http.server` stub the step starts locally: replays stay deterministic.

**11. `ship` · Ship it · 5**

| # | Section | Step | Side pane |
| --- | --- | --- | --- |
| 1 | Configuration | `tomllib` config, env vars, precedence | default ← file ← env ← flag |
| 2 | Packaging | wheel; project `expense-tracker`, package `expense_tracker`, entry point; fresh-venv install | pyproject → wheel → command |
| 3 | A web API | `http.server`: `GET /report`, `POST /expenses` | request → handler → store → JSON |
| 4 | The finished app | the whole tree | the app map, every class on its stage |
| 5 | Where next | FastAPI/Django (web), pandas/PySpark (data, the Spark series) | each part of the app → its tool at scale |

## How a section teaches

Objective → mental model (side pane) → the code and its real result → a failure or alternative →
bridge. One step per section; failure is its own step with a real traceback. Narration explains,
never reads code aloud. A detour ◆ is ≤ 120 s and returns to the app.

## Build order

1. Owner review of this plan.
2. Infra: port python-ct's frame template (`ide.ts`), `spine.py`, checks and registry; an app-map
   scene; data files.
3. Course 2 as the pilot → owner review.
4. Courses 1, 3–11 one at a time, each reviewed on its rendered routes, then narrated.
5. Record all 11 courses → assemble and publish the one video.

## Decisions

1. App: `expense-tracker` (package `expense_tracker`), a personal expense tracker.
2. Standard library only for the app; mypy, pytest, ruff as dev tools from Course 9.
3. One video, one continuous story: 11 courses, no parts or acts.
4. Background is just-in-time (◆ detours), never a front-loaded course.
