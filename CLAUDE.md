# CLAUDE.md — python-expense-tracker

> Workspace invariants live in the workspace `CLAUDE.md`. This file is only what is true here.

## What this repo is

A GraphL concept app: **learn Python by building an expense tracker**, `expense-tracker`, from a first
script to a tested, packaged CLI and web API, in real, executed code. A **section** is
`(scene, narration)`: one full-screen 16:9 frame, one chapter of the video.

**`COURSE-PLAN.md` is the source of truth**: courses, sections, the app's growth, each side-pane
diagram, and the packaging (one video). Author from it; change it first, never drift from it.

Engine `@graphlearning/graphl-flow` (^0.3.0), shell `@graphlearning/shell` (^1.0.1), both published
and pinned. Shell 1.0.2 (peer `^0.3.0`) is not on npm yet, so `package.json` `overrides` lets 1.0.1
take engine 0.3.0 (no API change); when 1.0.2 is published, pin `^1.0.2` and drop the override. Sister repo: **python-ct**, which has the same course design on a data pipeline.
Port its infra; do not reinvent it.

## Status

Plan drafted 2026-10-26. **Infra done** (ported from python-ct: IDE template, `spine.py`, checks,
registry, shots) and the **pilot, Course 2 `start`**: authored, replayed, rendered and looked at,
awaiting owner review; no audio yet. The app map (1.2, 7.4) is built with Course 1.

| # | Course | Sections | Status |
| --- | --- | --- | --- |
| 1 | `intro` | 2 | not started |
| 2 | `start` | 6 | pilot authored, awaiting owner review; no audio yet |
| 3 | `hold` | 9 | authored; no audio yet |
| 4 | `decide` | 11 | authored; no audio yet |
| 5 | `save` | 6 | authored; no audio yet |
| 6 | `report` | 7 | authored; no audio yet |
| 7 | `command` | 4 | not started |
| 8 | `model` | 9 | not started |
| 9 | `trust` | 6 | not started |
| 10 | `connect` | 7 | not started |
| 11 | `ship` | 5 | not started |

## Route contract

`#/` catalog; `#/<courseId>-<sectionId>` a section; `?capture=1` and `window.__scene.plan()` come
from the shell. Do not reimplement the shell.

## Python: 3.15.1, every output run

Pinned to CPython 3.15.1 (and `3.15.1t` for thread measurements). Install with
`scripts/install-python.sh` (also usable as the cloud environment's setup script): it places the two
binaries by name because copying one tree over the other silently swaps them. Every banner, traceback and printed value is replayed, never typed. Timings are rounded
and tied to the build; CPython-specific behaviour is labelled CPython.

## The spine

`spine/<course>/<NN-step>/` = `project/` (the app at that step) + `session.txt` + `step.json`.
Scenes import them with `?raw`. Every step has exactly one of `first`, `from` + `changes` (the
section's real diff, checked), or `lab` (the real output a concept scene shows: Course 1 and every full-scene
detour; `src/scenes/lab.ts` `outputOf` cuts one command's output from it). Experiments go in the REPL,
never into `main.py`. Paths are normalised to `/home/ana/expense-tracker`. Highlights are found by
text (`lineOf`), never typed as line numbers.

## Frames

Port python-ct's IDE template unchanged: explorer | editor (80 × 23) over terminal (13 lines) |
fixed side pane. **Every IDE side pane carries a diagram** (memory, stack, flow, class, plot or
result table), not a bullet list. No edges between panes. A detour (◆) is a side-pane diagram when it
pictures the code on screen, and a full concept scene (its own section, real output inside it) when
it is a canonical big picture that cannot fit the side pane at ≥ 24px; see `COURSE-PLAN.md`. Concept scenes are authored wide for 16:9.
python-ct's authoring notes apply (no obstacle avoidance, valid icon keys). On engine 0.3 a fan-in of
3+ arrows no longer flips a head, but heads on one face must sit ≥ 10px apart (check-render fails it):
aim a fan-in at a TALL node.

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
