# /ˈstōik/ LOG carousel generator

Renders each daily LOG as PNG slides in the brand template, in two sizes:

- `stoic/brand/carousel-log-NNN-<n>.png`: 1080×1350, Instagram
- `stoic/brand/tiktok-log-NNN-<n>.png`: 1080×1920, TikTok (text kept clear of the app's buttons)

## Make a LOG

```sh
cd stoik-log
npm install                      # once per checkout
node render.js logs/log-002.json ../stoic/brand
```

Needs Node and Playwright with Chromium. Fonts (Barlow Condensed, Inter, Noto Sans Thai) come from `npm install` and are embedded at render time.

## The source file

One JSON file per LOG in `logs/`. `logs/log-001.json` is the reference.

| Field | Meaning |
| --- | --- |
| `slug` | `log-NNN`, used in the file names |
| `no` | `LOG NNN`, shown on the slides |
| `date`, `topic`, `figure` | Not shown. Used to avoid repeating a theme or a philosopher |
| `stamp` | Short label after "THE LOG ·" in the header, usually the philosopher's name |
| `handle` | Shown bottom right |
| `slides` | The slides, in order. Use as many as the story needs, no more |

Every array entry is one line on the slide. Lines never wrap by themselves, so the line breaks are the writer's choice. The script stops with an error if a line is wider than the frame (about 34 Thai characters or 24 English characters of body text) or a slide has too many lines. Headlines shrink to fit, so keep each headline line near 10 characters to keep them large.

Slide types:

| `type` | Fields | Look |
| --- | --- | --- |
| `hook` | `en`, `th` | LOG number, large English headline, Thai line below, "SWIPE" footer |
| `thai` | `th`, `th2` | Thai body text. `th` lines are bright, `th2` lines are muted |
| `text` | `en`, `en2`, `th` | English body text (bright then muted) with a smaller Thai translation |
| `turn` | `en`, `th` | Short rule, very large English headline, Thai line |
| `shift` | `from`, `to` | "แทนที่จะคิดว่า" (muted) over "ให้คิดว่า" (bright) |
| `closing` | `en`, `th`, optional `pre`, `sub`, `cta`, `ctaTh` | Optional muted English lead-in (`pre`), large English statement, Thai line, wordmark footer |
