# dataresearchcenter.org

Production website for the **Data and Research Center (DARC)** —
<https://dataresearchcenter.org>.

Built with [MkDocs](https://www.mkdocs.org/) + [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).
Content is plain markdown under `docs/`, built and deployed to S3 on every push to
`main`.

> **Other DARC sites:** clone this repo as a starting point. It is no longer a
> shared upstream template/boilerplate — only the design layer is shared
> (see [Design system](#design-system)).

## Setup

```bash
python -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
```

## Develop & build

```bash
mkdocs serve        # http://localhost:8000 (live reload)
mkdocs build        # → ./site
```

Image optimization (the `optimize` plugin) runs in CI only — it's gated on
`CI=true`. To run it locally you also need the `pngquant` binary (`apt install
pngquant` / `brew install pngquant`); Pillow comes from `requirements.txt`:

```bash
CI=true mkdocs build
```

## Layout

```
docs/
  *.md                   pages (what-we-do, who-we-are, projects, contact, index)
  blog/                  blog plugin: index + posts/
  reference.md           component authoring reference
  stylesheets/           tokens · components · site · extra
  javascripts/           scroll-color.js
  overrides/             Material template overrides (header, footer, main, nav)
mkdocs.yml               theme, nav, markdown_extensions, plugins
requirements.txt
.github/workflows/publish.yml   build (+ optimize) and sync ./site to S3
```

## Authoring

[`docs/reference.md`](docs/reference.md) has copy-pasteable markdown for every
component — screens, heroes, card grids, profile cards, buttons, chips,
admonitions, icons.

## Design system

The shared, cross-DARC design layer is `darc-zensical.css`, loaded at build time
from [`zensical-theme-darc`](https://github.com/dataresearchcenter/zensical-theme-darc).
Keep project-specific styling out of it — use the local layers instead:

- `docs/stylesheets/tokens.css` — design tokens (colors, spacing, stroke, radii)
- `docs/stylesheets/components.css` — `.screen`, `.hero`, `.grid.cards`, `.btn`, profile cards
- `docs/stylesheets/site.css` — layout chrome (drawer, header, footer, typography, list markers)
- `docs/stylesheets/extra.css` — last-mile overrides
