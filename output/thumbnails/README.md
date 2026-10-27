# Thumbnails

`film.png` — the thumbnail for the single full-course video (`scripts/out/film.mp4`).
A copy of `film-dark.png`. Rebuild any variant with:

```sh
npm run thumb:film -- --theme dark --rows fun,food,transport,bills,shopping \
  --out output/thumbnails/film-dark.png
```

Variants kept for comparison: `film-dark.png` (shipped), `film-navy.png`,
`film-light.png` (stands out in a dark feed, but blue reads softer than yellow).

## Why not `npm run thumb` (the shell's `graphl-thumb`)

That template is a **per-course** poster: 58% of a scene plus a text panel. A scene is a
16:9 video frame, and cropped to 58% it turns to unreadable mush at the ~168px wide the
YouTube mobile feed actually renders — which is the only size that decides a thumbnail.
`scripts/thumb-film.mjs` uses poster grammar instead: few elements, enormous type, one
focal object. Every change was checked by downscaling to 168px, not by looking at 1280px.

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

`thumb-film.mjs` parses the report out of `spine/ship/04-the-finished-app/session.txt` —
the same replayed output the scenes use — and fails if a requested row is not in it. So the
thumbnail cannot drift from the recorded course, and nothing on it is typed by hand. The
renderer also asserts no element overflows its box, so a clipped label fails the build
instead of shipping.
