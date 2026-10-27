# Thumbnails

`film.png` — the thumbnail for the single full-course video (`scripts/out/film.mp4`).
A copy of `film-dark.png`. Rebuild any variant with:

```sh
npm run thumb:film -- --theme dark --source uses --mark logo --out output/thumbnails/film-dark.png
```

Variants kept for comparison: `film-dark.png` (shipped), `film-navy.png`,
`film-light.png` (stands out in a dark feed, but blue reads softer than yellow),
`film-glyph.png` (the permission-free mark, below), `film-repl.png` and
`film-report.png` (the other sources, below).

## The mark: the real Python logo, with its TM

The cover carries the genuine PSF two-snake logo, vendored unaltered at
[`public/vendor/python-logo-notext.svg`](../../public/vendor/python-logo-notext.svg) and
accompanied by the ™ the PSF's policy asks for (theme-aware, so it is actually visible on the
light variant too).

**This is a trademark question, and it is not fully settled by anything in this repo.** The PSF
Trademark Usage Policy allows non-commercial promotion of Python and nominative use — "stating
accurately that software is written in the Python programming language … is always allowed" —
but it also says "any other commercial uses require prior written permission from PSF."

A monetised YouTube channel is a commercial use. So:

- The logo here is unaltered, carries its ™, and is used nominatively to name the language the
  course teaches. The course's identity is the GraphL wordmark and the FULL COURSE badge, and
  the cover does not suggest the PSF produced or endorsed it.
- **If the video is monetised, ask the PSF Trademarks Committee first.** The full reasoning and
  the exact policy quotations are in
  [`public/vendor/NOTICE-python-logo.txt`](../../public/vendor/NOTICE-python-logo.txt).
- If permission is not sought or not granted, rebuild with the repo's own mark:

  ```sh
  npm run thumb:film -- --mark glyph
  ```

  which draws `>>>`, the REPL prompt — the most recognisable thing on a Python screen, owned by
  nobody. That is `film-glyph.png`, kept ready for exactly this reason.

Note that the sister repos answer differently, and correctly so. The data-science repo carries
the real **pandas** logo outright, because pandas publishes it under BSD-3-Clause — a copyright
licence that grants the use. The Spark repo carries **no** project mark at all, because the ASF
permits a third-party project logo essentially only as a hyperlink to its own site. Copyright
and trademark are different questions and every project answers for itself; do not copy any of
these three decisions across without reading that project's policy.

## The three sources, all real

`--source uses` (default, shipped) renders the course's own scene. The six use cases, their
subtitles and their icons are read out of `src/scenes/intro/index.ts` through the same
`scripts/registry.mjs` the content checks use — so the cover shows **the course's list, not a
retyped one**: edit the scene and the thumbnail follows. If that scene ever stops having a
group with id `uses`, the render fails rather than falling back to something invented.

The icons are the app's too: lucide's geometry (ISC) read straight out of
`node_modules/lucide-react` for `workflow`, `terminal`, `globe` and `brain`, and graphl-flow's
own bundled brand paths for `pandas` and `jupyter`. Those two keep their brand colours — white
and Jupyter orange — exactly as the scene renders them; the rest take the group's `store` tone.

This card has **no `$` command line**, because there is no command behind it. An earlier draft
had one, which would have been the first invented thing on any of these three covers.

`--source repl` renders `spine/hold/02-decimal/session.txt` — §3.2, the `0.1 + 0.2` float
surprise and the `Decimal` that fixes it. It is the stronger *hook* of the two at feed size: a
long red `0.30000000000000004` reads at 168px where six small rows become texture. Kept as
`film-repl.png` if the use-case grid underperforms.

One line of that session is left out: `Decimal(0.1)` prints 55 digits, which cannot be set in
poster type without shrinking the card to nothing. Lines whose output exceeds `MAX_OUT` are
**omitted rather than truncated**, so nothing shown is ever altered — the cover just shows fewer
steps than the session ran. If the float surprise or its fix were ever among the omitted lines,
the render fails instead of quietly dropping the point of the card.

`--source report` renders `spine/ship/04-the-finished-app/session.txt`: the real
`expense-tracker report`, spent against budget per category, with `fun` 160% over.

## The colours are the engine's

The use-case icons, the REPL's prompts, the surprise and the fix all take their colours from
`@graphlearning/graphl-flow`'s own tone palette — the same six the scenes use — copied into
`TONE` in `scripts/thumb-film.mjs`: `store` `#37b877` for the prompts and the correct answer,
`consume` `#f0656f` for the float result, `neutral` for echoed output.

## Why not `npm run thumb` (the shell's `graphl-thumb`)

That template is a **per-course** poster: 58% of a scene plus a text panel. A scene is a
16:9 video frame, and cropped to 58% it turns to unreadable mush at the ~168px wide the
YouTube mobile feed actually renders — which is the only size that decides a thumbnail.
`scripts/thumb-film.mjs` uses poster grammar instead: few elements, enormous type, one
focal object. Every change was checked by downscaling to 168px, not by looking at 1280px.
At that size the shipped cover keeps LEARN / PYTHON, the logo, the badge and "What people build
with it"; the six rows below become texture. That is the trade this cover makes — breadth over a
single hook — and `film-repl.png` is the alternative if the grid underperforms.

## Why not the generated samples

`01-build-this.png`, `02-zero-to-app.png`, `03-python-by-building.png` are illustrative
images from an image-generation tool, not screenshots (see `prompts.txt`). They are more
striking, but they advertise an app this course does not build:

| they show | the course actually builds |
| --- | --- |
| `python expense_tracker.py` | `expense-tracker report` — Course 7 teaches why it is `-m`/a package |
| Food £240, Transport £85, Total £495 | fun 96.29, food 93.99, transport 76.80, bills 32.40, shopping 15.99 |
| "% of Total" | spent vs **budget** — the point of the app |
| a 1/2/3/4 numbered menu | an argparse CLI and an `expense>` loop |

A thumbnail that promises a different app buys clicks and loses retention, and YouTube
weights retention far above CTR.

## Where the numbers come from

`thumb-film.mjs` parses everything out of a spine `session.txt` — the same replayed output the
scenes use — and fails if a requested row, or the float surprise, is not in it. So the
thumbnail cannot drift from the recorded course, and nothing on it is typed by hand. The
renderer also asserts no element overflows its box, so a clipped label fails the build instead
of shipping, and the headline splits one word per line and shrinks against the left column's
max width rather than running off the canvas.
