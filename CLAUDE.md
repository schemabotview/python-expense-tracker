# CLAUDE.md — python-expense-tracker

> Workspace rules, pipeline and standard commands: `../CLAUDE.md`. Source of truth:
> `COURSE-PLAN.md`. This file is only what is true HERE.

## Identity

| | |
|---|---|
| teaches | Python, by building `expense-tracker`: a first script → a tested, packaged CLI and web API |
| cast | Ana (her spending); project path normalised to `/home/ana/expense-tracker` |
| reference repo | **python-ct** (same course design on a data pipeline) — port its infra, do not reinvent. This repo is in turn the reference for java, sql, spark, data-science and aws |
| engine / shell | graphl-flow 0.11.0, shell 1.1.0, pinned exactly; no `overrides` |
| toolchain | CPython 3.15.1 (+ `3.15.1t` for thread measurements), `scripts/install-python.sh` (also the cloud setup script) |
| frames | IDE frame v2 (`src/scenes/frame.ts`), concept scenes |

## Status

All 11 courses (72 sections) authored 2026-10-26: replayed on 3.15.1 (70 spine steps), rendered at
4K, checked, looked at. Narrated and recorded 2026-10-27: 72 wavs, every course at 3840×2160, the
film (`npm run film` → 1:50:32, 72 chapters). Awaiting the owner's review of the whole course.

**2026-11-06: ported to IDE frame v2** (COURSE-PLAN Decision 6). All 64 IDE sections, every
course, are on v2; the 8 concept scenes are unchanged. 17 narrations were edited (listed in
Decision 6); their wavs were regenerated via Colab.

**2026-11-07: re-recorded on v2.** All 72 wavs match the current narration; every segment was
rebuilt (the segment cache keys on audio, not layout, so the v1 cache was deleted first), every
course at 3840×2160 with the 2.4 s loop, and the film rebuilt (`npm run film` → 1:50:26, 72 chapters).

| # | Course | Sections | Status |
| --- | --- | --- | --- |
| 1 | `intro` | 2 | authored, narrated, recorded 4K on v2 (concept frames: unchanged by v2) |
| 2 | `start` | 6 | authored, narrated, recorded 4K on v2 |
| 3 | `hold` | 9 | authored, narrated, recorded 4K on v2 |
| 4 | `decide` | 11 | authored, narrated, recorded 4K on v2 |
| 5 | `save` | 6 | authored, narrated, recorded 4K on v2 |
| 6 | `report` | 7 | authored, narrated, recorded 4K on v2 |
| 7 | `command` | 4 | authored, narrated, recorded 4K on v2 |
| 8 | `model` | 9 | authored, narrated, recorded 4K on v2 |
| 9 | `trust` | 6 | authored, narrated, recorded 4K on v2 |
| 10 | `connect` | 7 | authored, narrated, recorded 4K on v2 |
| 11 | `ship` | 5 | authored, narrated, recorded 4K on v2 |

## Commands

`npm run check:spine` replays every step on 3.15.1. Install Python first with
`scripts/install-python.sh`: it places the two binaries by name, because copying one tree over the
other silently swaps them.

## Spine

`spine/<course>/<NN-step>/` = `project/` (the app at that step) + `session.txt` + `step.json`;
scenes import them with `?raw`. Every step has exactly one of `first`, `from` + `changes` (the
section's real diff, checked), or `lab` (the real output a concept scene shows: Course 1 and every
full-scene detour; `src/scenes/lab.ts` `outputOf` cuts one command's output from it).

- Experiments go in the REPL, never into `main.py`.
- Timings are rounded and tied to the build. A `volatile` step is compared with digits and `0x…`
  addresses masked, so its numbers change on every `--write`: a scene reads such a value with a
  regex over `session.txt`.
- From Course 9 on, steps `pip install --group dev` (mypy 2.4.0, pytest 9.1.1, ruff 0.17.2, pinned
  in `pyproject.toml`): the replay needs network, and `spine.py` keeps pip's real cache across steps.

## Frames

**Every IDE section is on IDE frame v2 (COURSE-PLAN Decision 6).** `src/scenes/
frame.ts` `ideFrame2` builds graphl-flow 0.11's shared frame: compact explorer | editor over
terminal (72 columns) | side pane TITLED with the section's mental model (`model`). Editor and
terminal share 26 rows: the terminal takes exactly its transcript's rows (at least 6), the editor
the rest, so only the divider between them moves from frame to frame. It windows the editor around
the highlighted lines (a hand-picked `show` is used only when that span does not fit, and is then
grown to fill the editor), wraps the 80-column sessions at draw time (the spine is untouched), marks tracebacks, and
THROWS (naming the scene) when a transcript or a highlight does not fit. Its workbench id is
`ide-bench`; v1's (`ide.ts` `ideFrame`, no longer used by any scene) is `workbench`, and the checks
still hold each kind to its own rules:

| | v1 (`ide.ts`, courses not yet ported) | v2 (`frame.ts`) |
|---|---|---|
| side pane | untitled, ≥ one edge/plot/table, captions ≤ 3 bullets, filled ≥ 2/3 | titled; one diagram (edges or a plot), ≤ 1 table outside it, no bullets, filled ≥ 1/2 |
| fit | one fit across v1 frames, every pane at the same pixels | one fit across v2 frames, explorer and side pane at the same pixels |

The v2 explorer is 175px: the venv is one muted folder, without v1's note, and from Course 10 on
`pkgtree.ts` `folded()` closes every folder that holds nothing active or new, or the tree outgrows
the frame. A highlight spread over a long file may not fit a short editor: give `show`
explicit ranges (each skipped run costs a fold row, a line over 71 columns costs two), and anchor
`lineOf` at the right definition (`lineOf(code, text, from)`) when a name repeats in the file.
A plot in the side pane is `compact` with `w: SIDE_W - 34`, and its x labels must fit (~6 chars for
six bars). **Every IDE side pane carries a diagram**, never a bullet list. No edges between
panes. A detour (◆) is a side-pane diagram when it pictures the code on screen, and a full concept
scene (its own section, real output inside it) when it is a canonical big picture that cannot fit the
side pane at ≥ 24px; see `COURSE-PLAN.md`. python-ct's authoring notes apply (no obstacle avoidance,
valid icon keys). Heads on one face must sit ≥ 10px apart (check-render fails it): aim a fan-in at a
TALL node. `node scripts/check-render.mjs <course>` checks one course.


## Invariants

- The app is standard library only; dev tools (mypy, pytest, ruff) arrive in Course 9, pinned.

## Gotchas

- A long REPL traceback through library frames can race the next typed line in the pty: show such
  a failure through the app, or through a short frame of our own code.
