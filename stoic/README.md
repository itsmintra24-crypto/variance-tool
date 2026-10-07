# /ˈstōik/ — brand site

Static, dependency-free site. Open `index.html` in a browser, or serve the folder:

```
cd stoic && python3 -m http.server 8000
```

- `index.html` — page structure, following the brand homepage order (Hero → What you control → Built, not rushed → 001 / Foundation → Do it anyway), plus pillars, product system, archive, manifesto, origin story, Log and the 30-day Standard.
- `styles.css` — design tokens (Obsidian / Bone / Stone / Graphite / Oxide), Barlow Condensed + Inter.
- `main.js` — scroll reveals, waitlist toggles, the Standard checklist (saved in localStorage), sign-up form.

## Launch

- **Hosting:** the repo's GitHub Pages (deploy from `main`) publishes this folder automatically on every push. Live at https://itsmintra24-crypto.github.io/variance-tool/stoic/
- **Email sign-ups:** paste your form endpoint (e.g. a Formspree form URL) into `data-endpoint` on `#join-form` in `index.html`. Until then the form collects nothing and says sign-ups open soon.
- **Custom domain:** add it under Settings → Pages, then replace `https://itsmintra24-crypto.github.io/variance-tool/stoic/` in `index.html` (canonical and social tags) and `sitemap.xml`. A custom domain is easiest once the site has its own repository, so it doesn't take over the variance tool's Pages URL.
- **Privacy:** `privacy.html` is a plain-language starting point. Review it, and name your email provider once chosen.

To swap in real assets:
- **Training image**: replace the SVG inside `.frame-art` with an `<img>` (full-bleed, `object-fit: cover`).
- **Product photos**: replace the SVG in each `.product-visual`.
- **Share image**: `og.png` (1200×630).
- **ST monogram**: defined once as `<symbol id="st">` at the top of `index.html`.
