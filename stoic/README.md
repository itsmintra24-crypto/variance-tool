# /ˈstōik/ — brand site

Static, dependency-free site. Open `index.html` in a browser, or serve the folder:

```
cd stoic && python3 -m http.server 8000
```

- `index.html` — page structure, following the brand homepage order (Hero → What you control → Built, not rushed → 001 / Foundation → Do it anyway), plus pillars, product system, archive, manifesto, origin story, Log and the 30-day Standard.
- `styles.css` — design tokens (Obsidian / Bone / Stone / Graphite / Oxide), Barlow Condensed + Inter.
- `main.js` — scroll reveals, waitlist toggles, the Standard checklist (saved in localStorage), sign-up form.

## Launch

- **Hosting:** `.github/workflows/deploy-stoic.yml` publishes this folder to GitHub Pages on every push to `main`. One-time setup: repo **Settings → Pages → Source: GitHub Actions**. Live at https://itsmintra24-crypto.github.io/variance-tool/
- **Email sign-ups:** paste your form endpoint (e.g. a Formspree form URL) into `data-endpoint` on `#join-form` in `index.html`. Until then the form collects nothing and says sign-ups open soon.
- **Custom domain:** add it under Settings → Pages, then replace `https://itsmintra24-crypto.github.io/variance-tool/` in `index.html` (canonical and social tags), `robots.txt` and `sitemap.xml`.
- **Privacy:** `privacy.html` is a plain-language starting point. Review it, and name your email provider once chosen.

To swap in real assets:
- **Training image**: replace the SVG inside `.frame-art` with an `<img>` (full-bleed, `object-fit: cover`).
- **Product photos**: replace the SVG in each `.product-visual`.
- **Share image**: `og.png` (1200×630).
- **ST monogram**: defined once as `<symbol id="st">` at the top of `index.html`.
