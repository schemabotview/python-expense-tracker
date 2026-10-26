# python-expense-tracker

**Learn Python by building an expense tracker.** A GraphL concept app: one application, `expense-tracker`,
grows from a five-line script to a tested, packaged command (`expense-tracker report --month 2026-10`) and a
small web API. Every Python feature is taught at the moment the app needs it, in real, executed
code. Scenes render with `@graphlearning/graphl-flow`; the app shell is `@graphlearning/shell`.

Published as **one video: "Learn Python by building an expense tracker: full course, beginner to
professional"** (~2 h 25 min, 11 courses).

**Status:** the pilot (Course 2, `start`) is authored. Scope, sections and diagrams are in
[`COURSE-PLAN.md`](COURSE-PLAN.md); authoring rules and per-course status are in [`CLAUDE.md`](CLAUDE.md).

## Run it

```sh
npm install
npm run dev          # http://localhost:5173  ·  routes are #/<course>-<section>
```

## Verify a change

```sh
scripts/install-python.sh                             # once: CPython 3.15.1 and 3.15.1t in /usr/local
npm run build && npx tsc --noEmit && npm run check    # check: content + 4K render
npm run check:spine                                   # replays every step on 3.15.1
npm run shots -- <course>                             # 4K PNGs in out/shots/, then look at them
```

## Layout

```
src/content/<course>/    one file per section + the course index
src/scenes/<course>/     declarative scenes (never x/y)
src/scenes/ide.ts        the one IDE frame every IDE section uses
src/scenes/lab.ts        a lab command's real output, for concept scenes
spine/<course>/<step>/   the app as real files, one cumulative snapshot per step
scripts/                 spine.py, check-content, check-render, registry, shots, install-python.sh
```
