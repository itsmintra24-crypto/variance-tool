# /ˈstōik/ — brand site

Static, dependency-free site. Open `index.html` in a browser, or serve the folder:

```
cd stoic && python3 -m http.server 8000
```

- `index.html` — page structure, following the brand homepage order (Hero → What you control → Built, not rushed → 001 / Foundation → Do it anyway), plus pillars, product system, archive, manifesto, origin story, Log and the 30-day Standard.
- `styles.css` — design tokens (Obsidian / Bone / Stone / Graphite / Oxide), Barlow Condensed + Inter.
- `main.js` — scroll reveals, waitlist toggles, the Standard checklist (saved in localStorage), sign-up form.

To swap in real assets:
- **Training image**: replace the SVG inside `.frame-art` with an `<img>` (full-bleed, `object-fit: cover`).
- **Product photos**: replace the SVG in each `.product-visual`.
- **Sign-up**: the form in `#join` only validates on the page. Connect it to your email provider in `main.js`.
- **ST monogram**: defined once as `<symbol id="st">` at the top of `index.html`.
