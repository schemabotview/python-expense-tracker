# Thumbnails

`film.png` — the chosen thumbnail for the single full-course video
(`scripts/out/film.mp4`). Built from a real scene, not an illustration:

```sh
LOGO_SVG=public/favicon.svg npm run thumb -- report --section 6 \
  --title "Build an expense tracker" --kicker "PYTHON · FULL COURSE" \
  --out output/thumbnails/film.png
```

`report --section 6` is *Formatting the report*: the editor shows the code and the
terminal below it shows October's real report — the `#` bars, `160% over`,
`96% careful`. The template renders the LEFT 58% of the scene, so a scene whose
payoff sits on the right (the app map in `intro`/`ship`) gets clipped; that is why
this one was picked over `film-a` / `film-b`.

`film-a.png`, `film-b.png`, `film-c.png` — candidates kept for comparison
(`film.png` is a copy of `film-c.png`).

`01-*.png`, `02-*.png`, `03-*.png` — earlier illustrative samples from an image
generation tool, NOT screenshots of the app. See `prompts.txt`.
