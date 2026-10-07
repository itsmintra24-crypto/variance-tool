# /ˈstōik/ — brand home

Static, dependency-free brand site. Live at https://itsmintra24-crypto.github.io/variance-tool/stoic/ (GitHub Pages publishes `main` automatically).

| Page | URL | Purpose |
| --- | --- | --- |
| `index.html` | `/stoic/` | Brand homepage: philosophy, pillars, manifesto, origin story, the Log, the 30-day Standard |
| `links.html` | `/stoic/links.html` | **Link-in-bio** — put this URL in every social profile |
| `brand.html` | `/stoic/brand.html` | Identity guide: marks, colour, type, voice, downloadable social assets |
| `privacy.html` | `/stoic/privacy.html` | Privacy note |

## Edit your social links

Open `social.js` and fill in `url` (and `handle`) for each account. Empty entries are hidden. The homepage "Do it anyway" section and the links page both read from it.

```js
{ name: "Instagram", handle: "@yourhandle", url: "https://instagram.com/yourhandle" },
```

## Brand assets (`brand/`)

- `avatar-st-obsidian.png`, `avatar-st-bone.png`, `avatar-wordmark.png` — 1080×1080 profile pictures (circle-crop safe)
- `banner-x.png` 1500×500, `banner-linkedin.png` 1584×396, `banner-youtube.png` 2560×1440
- `story.png` 1080×1920 story / wallpaper
- `st-on-obsidian.svg`, `st-on-bone.svg` — monogram vectors
- `../og.png` — 1200×630 link preview

## Notes

- Products are planned for a later phase, so there's no shop, waitlist or sign-up form.
- `main.js` handles scroll reveals and the Standard tracker (saved in the visitor's browser only).
- Custom domain: easiest once the site has its own repository. Then replace the `github.io/variance-tool/stoic/` URLs in the page `<head>`s and `sitemap.xml`.
