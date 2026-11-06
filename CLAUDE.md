# CLAUDE.md — python-expense-tracker

> Workspace invariants live in the workspace `CLAUDE.md`. This file is only what is true here.

## What this repo is

A GraphL concept app: **learn Python by building an expense tracker**, `expense-tracker`, from a first
script to a tested, packaged CLI and web API, in real, executed code. A **section** is
`(scene, narration)`: one full-screen 16:9 frame, one chapter of the video.

**`COURSE-PLAN.md` is the source of truth**: courses, sections, the app's growth, each side-pane
diagram, and the packaging (one video). Author from it; change it first, never drift from it.

Engine `@graphlearning/graphl-flow` 0.11.0 and shell `@graphlearning/shell` 1.1.0, pinned exactly; no
`overrides`. Sister repo: **python-ct**, which has the same course design on a data pipeline.
Port its infra; do not reinvent it.

## Status

All 11 courses (72 sections) authored 2026-10-26: replayed on 3.15.1 (70 spine steps), rendered
at 4K, checked, and looked at. Narrated and recorded 2026-10-27: all 72 wavs in, every course
captured at 3840x2160, and combined into the single YouTube film (`npm run film` -> 1 h 50 min).
Awaiting the owner's review of the whole course.

**2026-11-06: ported to IDE frame v2** (COURSE-PLAN Decision 5). All 64 IDE sections, every
course, are on v2; the 8 concept scenes are unchanged. 17 narrations were edited (listed in
Decision 5): their wavs predate the edit and must be regenerated. Then every course is re-recorded,
because the frame changed. The audio and recording columns below describe the v1 recording.

| # | Course | Sections | Status |
| --- | --- | --- | --- |
| 1 | `intro` | 2 | authored, narrated, recorded 4K (concept frames: unchanged by v2) |
| 2 | `start` | 6 | authored, narrated, recorded 4K |
| 3 | `hold` | 9 | authored, narrated, recorded 4K |
| 4 | `decide` | 11 | authored, narrated, recorded 4K |
| 5 | `save` | 6 | authored, narrated, recorded 4K |
| 6 | `report` | 7 | authored, narrated, recorded 4K |
| 7 | `command` | 4 | authored, narrated, recorded 4K |
| 8 | `model` | 9 | authored, narrated, recorded 4K |
| 9 | `trust` | 6 | authored, narrated, recorded 4K |
| 10 | `connect` | 7 | authored, narrated, recorded 4K |
| 11 | `ship` | 5 | authored, narrated, recorded 4K |

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

A `volatile` step (timings, memory addresses) is compared with digits and `0x…` addresses masked, so
its numbers change on every `--write`: a scene must READ such a value from the session (a regex
over `session.txt`), never type it, and narration says "a fraction of a millisecond", not a number.
From Course 9 on, steps `pip install --group dev` (mypy 2.4.0, pytest 9.1.1, ruff 0.17.2, pinned in
`pyproject.toml`): the replay needs network, and `spine.py` keeps pip's real cache across steps.
A long REPL traceback through library frames can race the next typed line in the pty: show such a
failure through the app, or through a short frame of our own code.

## Frames

**Every IDE section is on IDE frame v2 (COURSE-PLAN Decision 5).** `src/scenes/
frame.ts` `ideFrame2` builds graphl-flow 0.11's shared frame: compact explorer | editor (`code` 18
rows / `run` 9) over terminal (8 / 17 rows, 72 columns) | side pane TITLED with the section's mental
model (`model`). It picks the variant from the transcript, windows the editor around the highlighted
lines, wraps the 80-column sessions at draw time (the spine is untouched), marks tracebacks, and
THROWS (naming the scene) when a transcript or a highlight does not fit. Its workbench id is
`ide-bench`; v1's (`ide.ts` `ideFrame`, no longer used by any scene) is `workbench`, and the checks
still hold each kind to its own rules:

| | v1 (`ide.ts`, courses not yet ported) | v2 (`frame.ts`) |
|---|---|---|
| side pane | untitled, ≥ one edge/plot/table, captions ≤ 3 bullets, filled ≥ 2/3 | titled; one diagram (edges or a plot), ≤ 1 table outside it, no bullets, filled ≥ 1/2 |
| fit | one fit across v1 frames, every pane at the same pixels | one fit across v2 frames, explorer and side pane at the same pixels |

The v2 explorer is 175px: the venv is one muted folder, without v1's note, and from Course 10 on
`pkgtree.ts` `folded()` closes every folder that holds nothing active or new, or the tree outgrows
the frame. A highlight spread over a long file does not fit the 9-row `run` editor: give `show`
explicit ranges (each skipped run costs a fold row, a line over 71 columns costs two), and anchor
`lineOf` at the right definition (`lineOf(code, text, from)`) when a name repeats in the file.
A plot in the side pane is `compact` with `w: SIDE_W - 34`, and its x labels must fit (~6 chars for
six bars). **Every IDE side pane carries a diagram**, never a bullet list. No edges between
panes. A detour (◆) is a side-pane diagram when it pictures the code on screen, and a full concept
scene (its own section, real output inside it) when it is a canonical big picture that cannot fit the
side pane at ≥ 24px; see `COURSE-PLAN.md`. python-ct's authoring notes apply (no obstacle avoidance,
valid icon keys). Heads on one face must sit ≥ 10px apart (check-render fails it): aim a fan-in at a
TALL node. `node scripts/check-render.mjs <course>` checks one course.

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
