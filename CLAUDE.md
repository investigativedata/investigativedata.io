# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Installation
make install         # Create .venv + pip install requirements.txt

# Development
make fetch           # Fetch Directus content → content/ + data/
make dev             # Fetch + zola serve (http://localhost:1111)

# Production
make build           # Fetch + zola build → public/
make publish         # Build + deploy to S3

# Utilities
make clean           # Remove content/, data/*.json, public/
make serve           # Serve static build locally (python http.server)
```

## Architecture Overview

This is a Zola static site. A Python pre-build script (`build.py`) fetches content from a headless Directus CMS at `https://cms.investigativedata.net`, converts markdown to HTML, and writes colocated JSON data files that Zola templates consume via `load_data()`.

### Build Pipeline

```
build.py → Directus API → content/*.md + data/*.json → zola build → public/
```

1. **Fetch** all pages, articles, site config from Directus
2. **Process** each content block: resolve asset URLs, convert markdown→HTML
3. **Write** Zola content files (`.md` frontmatter + `.json` data)
4. **Build** with Zola (compiles SCSS, renders templates)

### Content Model

Pages contain Screens, which contain Content arrays. Content types: heroes, mdx, typography, images, files, cards, projects, animations, profiles, newsletters.

**Routing:**
- `/` — Homepage (slug "index")
- `/<slug>/` — Pages (supports multi-segment paths like `solutions/aleph`)
- `/blog/` — Article listing
- `/blog/YYYY/MM/slug/id` — Individual articles (exact URLs preserved via Zola `path` frontmatter)

### Python Build System (`build/`)

- **`directus.py`** — Directus REST API client (httpx). Fetches pages, articles, site config, menu pages.
- **`assets.py`** — Recursively resolves Directus file IDs to full asset URLs (`https://assets.investigativedata.org/cms/`).
- **`converter.py`** — Markdown→HTML conversion per content type. Mirrors the per-collection rendering from the old `serializeMdx()`.
- **`content.py`** — Generates Zola `content/` files. Handles leaf pages (colocated `data.json`), parent pages (section `_index.md` + `data/page_*.json`), blog articles, and blog section.
- **`build.py`** — Entry point. Fetches all data first, then cleans and generates.

**Key detail:** Pages that are parents of other pages (e.g. `solutions` has children `solutions/aleph`) become Zola sections (`_index.md`) with their data stored in `data/page_<slug>.json` instead of colocated. The `page-section.html` template handles these.

### Zola Templates (`templates/`)

- **`base.html`** — HTML shell, loads `data/site.json` for header/footer/nav
- **`index.html`** — Homepage, loads `data/homepage.json`
- **`page.html`** — Leaf pages, loads colocated `data.json`
- **`page-section.html`** — Parent pages (sections), loads from `data/page_*.json`
- **`section.html`** — Blog listing, loads `data/blog_articles.json`
- **`blog-article.html`** — Single article with content blocks
- **`macros/content.html`** — Content block dispatcher + per-type rendering macros (hero, mdx, typography, image, card, project, profile, newsletter, file, animation)
- **`partials/header.html`** — Fixed header with nav + burger button
- **`partials/footer.html`** — Footer with links

### SCSS (`sass/`)

Design tokens and component styles ported from the old `@investigativedata/style` package. BEM naming. Zola compiles SCSS automatically (`compile_sass = true` in `config.toml`).

**Color variants:** white, black, orange, green, yellow, purple. Applied via `.screen--bg-*` and `.bg--*` classes. Dark mode via `.darc-mode` class.

**Key partials:** `_variables.scss` (all design tokens), `_base.scss` (reset + typography defaults), `_screen.scss` (section layout), `_hero.scss`, `_card.scss`, `_button.scss`, `_header.scss`, `_drawer.scss`.

### Vanilla JS (`static/js/main.js`)

~55 lines total:
1. **Drawer toggle** — burger button opens/closes mobile nav drawer
2. **Scroll-based background color** — reads `data-background-color` attributes on sections, updates `.page-wrapper` class on scroll to match current section's color

### Configuration

**Environment Variables:**
- `DIRECTUS_URL` — CMS API endpoint (default: `https://cms.investigativedata.net`)
- `DIRECTUS_API_TOKEN` — API access token
- `DIRECTUS_SITE` — Site identifier for content filtering (default: `dataresearchcenter.org`)
- `ASSETS_BASE_URL` — Base URL for file assets (default: `https://assets.investigativedata.org/cms/`)

**`config.toml`:** Zola config with `base_url`, `compile_sass = true`, search index disabled.

**`requirements.txt`:** httpx, markdown, python-slugify, tomli-w.
