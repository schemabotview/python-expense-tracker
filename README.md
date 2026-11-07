# python-expense-tracker

**Learn Python by building an expense tracker** — a GraphL concept app (graphl.in/python-expense-tracker).
One application, `expense-tracker`, grows from a five-line script to a tested, packaged command
(`expense-tracker report --month 2026-10`) and a small web API. Every Python feature is taught at the
moment the app needs it, in real, executed code. Published as one film: **"Learn Python by building
an expense tracker: full course, beginner to professional"** (11 courses, 72 sections, 1 h 50 min).

**Status:** all 11 courses authored, narrated, recorded at 4K and cut into the film; awaiting the
owner's review. Plan: [`COURSE-PLAN.md`](COURSE-PLAN.md) · Rules and status: [`CLAUDE.md`](CLAUDE.md) ·
Workspace pipeline: `../CLAUDE.md`.

## Run

```sh
scripts/install-python.sh                  # once: CPython 3.15.1 and 3.15.1t in /usr/local
npm install
npm run dev                                # http://localhost:5173 · #/<course>-<section>
npm run check                              # content + 4K render
```

## Layout

```
src/content/<course>/    one file per section + the course index
src/scenes/<course>/     declarative scenes (never x/y)
src/scenes/frame.ts      IDE frame v2, the one frame every IDE section uses
src/scenes/lab.ts        a lab command's real output, for concept scenes
spine/<course>/<step>/   the app as real files, one cumulative snapshot per step
scripts/                 spine.py, check-content, check-render, registry, shots, install-python.sh
```
