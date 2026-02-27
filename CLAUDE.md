# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Deploying changes

There is no build step. Files are **baked into the Docker image** at build time — `docker restart` alone does nothing. Every change requires:

```bash
docker build -t workloop-website .
docker stop workloop-website && docker rm workloop-website
docker run -d --name workloop-website -p 3000:3000 workloop-website
```

To run locally without Docker:
```bash
npm install
npm start        # serves on http://localhost:3000
```

## Architecture

A minimal Express server (`server.js`) with one purpose: serve static files from `public/` and handle a single API route.

```
server.js              — Express app: static serving + POST /api/contact
public/
  index.html           — Homepage
  about.html           — Team & company story
  services.html        — Pricing & service packages
  blog.html            — Blog listing
  contact.html         — Contact page (also has the form)
  css/styles.css       — Single stylesheet, sections numbered 1–34
  js/main.js           — Single script, no framework, no bundler
```

**`POST /api/contact`** — validates name/email/message, logs submission to stdout. No email integration yet; responses are hardcoded Norwegian strings.

## CSS conventions

`styles.css` is organised into numbered comment blocks (e.g. `/* ── 7. Hero */`). New sections should be appended before the `@media` blocks at the bottom and given the next number. CSS custom properties are defined in `:root` at the top — always use them (`var(--blue-600)`, `var(--t)`, etc.) rather than raw values.

## JS conventions

`main.js` is a single IIFE with no dependencies. Scroll-reveal animations work by adding `.animate-on-scroll` to any element in HTML — the IntersectionObserver in `main.js` adds `.visible` when it enters the viewport. Animated counters use `<span class="stat-number" data-target="30">` and animate on scroll. The FAQ accordion toggles `.open` on `.faq-item`.

## HTML conventions

All pages share the same navbar and footer markup. The navbar CTA button is `<a href="/contact.html" class="btn btn-primary btn-sm">Kontakt</a>`. The active nav link is set dynamically by `main.js` based on `window.location.pathname` — no need to manage it manually. All content is in Norwegian (Bokmål).
