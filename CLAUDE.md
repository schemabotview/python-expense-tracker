# CLAUDE.md — python-expense-tracker

> Workspace invariants live in the workspace `CLAUDE.md`. This file is only what is true here.

## What this repo is

A GraphL concept app: **learn Python by building an expense tracker**, `expense-tracker`, from a first
script to a tested, packaged CLI and web API, in real, executed code. A **section** is
`(scene, narration)`: one full-screen 16:9 frame, one chapter of the video.

**`COURSE-PLAN.md` is the source of truth**: courses, sections, the app's growth, each side-pane
diagram, and the packaging (one video). Author from it; change it first, never drift from it.

Engine `@graphlearning/graphl-flow` (^0.2.0), shell `@graphlearning/shell` (^1.0.1), both published
and pinned. Sister repo: **python-ct**, which has the same course design on a data pipeline.
Port its infra; do not reinvent it.

## Status

Plan drafted 2026-10-26, awaiting owner review. Nothing authored; no app scaffold yet.

| # | Course | Sections | Status |
| --- | --- | --- | --- |
| 1 | `intro` | 2 | not started |
| 2 | `start` | 5 | not started (pilot) |
| 3 | `hold` | 9 | not started |
| 4 | `decide` | 10 | not started |
| 5 | `save` | 6 | not started |
| 6 | `report` | 7 | not started |
| 7 | `command` | 4 | not started |
| 8 | `model` | 9 | not started |
| 9 | `trust` | 6 | not started |
| 10 | `connect` | 6 | not started |
| 11 | `ship` | 5 | not started |

## Route contract

`#/` catalog; `#/<courseId>-<sectionId>` a section; `?capture=1` and `window.__scene.plan()` come
from the shell. Do not reimplement the shell.

## Python: 3.15.1, every output run

Pinned to CPython 3.15.1 (and `3.15.1t` for thread measurements), installed as in python-ct's
`CLAUDE.md`. Every banner, traceback and printed value is replayed, never typed. Timings are rounded
and tied to the build; CPython-specific behaviour is labelled CPython.

## The spine

`spine/<course>/<NN-step>/` = `project/` (the app at that step) + `session.txt` + `step.json`.
Scenes import them with `?raw`. Every step has exactly one of `first`, `from` + `changes` (the
section's real diff, checked), or `lab` (Course 1 concept labs only). Experiments go in the REPL,
never into `main.py`. Paths are normalised to `/home/ana/expense-tracker`. Highlights are found by
text (`lineOf`), never typed as line numbers.

## Frames

Port python-ct's IDE template unchanged: explorer | editor (80 × 23) over terminal (13 lines) |
fixed side pane. **Every IDE side pane carries a diagram** (memory, stack, flow, class, plot or
result table), not a bullet list. No edges between panes. A detour (◆) is a side-pane diagram when it
pictures the code on screen, and a full concept scene (its own section, real output inside it) when
it is a canonical big picture that cannot fit the side pane at ≥ 24px; see `COURSE-PLAN.md`. Concept scenes are authored wide for 16:9.
python-ct's authoring notes (no obstacle avoidance, ≤ 2 arrows into one node across a gap, valid
icon keys) apply as written.

## Checks, before handing over

```sh
npm run build && npx tsc --noEmit && npm run check   # check-content + check-render (4K)
npm run check:spine
npm run shots -- <course>                            # then LOOK
```

Checks are a floor, not proof.

## Invariants

- Never write `x`/`y`; scenes are declarative.
- Stylesheets in order: graphl-flow, shell, `./theme.css` last.
- No `file:` installs committed.
- Narration: `.tts` → `.wav` via Colab + Chatterbox only. Audio at `public/audio/<course>/<id>.wav`.
- The app is standard library only. Dev tools (mypy, pytest, ruff) arrive in Course 9, pinned.
- `SiteHeader` on the catalog page only.

## Working agreement

Author a whole course (scenes, spine, narration), render it, look, then hand over the routes. No
silent scaffolding. Say what was built, verified and left out.
