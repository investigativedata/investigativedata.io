# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

The **production website for [dataresearchcenter.org](https://dataresearchcenter.org)**
(the Data and Research Center, DARC), built with [MkDocs](https://www.mkdocs.org/)
+ [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/). Content is
plain markdown under `docs/`, built and deployed to S3 by GitHub Actions on push to
`main`.

This is **no longer a shared template** for downstream DARC sites — other sites
clone this repo. Only the design layer (`darc-zensical.css`) is shared upstream.
Zensical (the mkdocs-material successor) can still run the same `mkdocs.yml` as a
drop-in, but the production toolchain and the blog/optimize/redirects plugins are
Material's — prefer `mkdocs`.

## Commands

```bash
pip install -r requirements.txt        # deps: mkdocs-material[imaging], mkdocs-redirects, …

mkdocs serve     # http://localhost:8000 (live reload)
mkdocs build     # → ./site

CI=true mkdocs build                   # also runs the image `optimize` plugin (needs `pngquant`)
```

## Architecture

```
docs/
  index.md               # pages (markdown)
  what-we-do.md  who-we-are.md  projects.md  contact.md
  blog/                  # mkdocs-material blog plugin (index.md + posts/)
  reference.md           # authoring reference (every component, copy-pasteable)
  typography.md
  assets/                # images (profiles, projects, blogs)
  stylesheets/           # darc-zensical.css is loaded from upstream URL — NOT stored here
    tokens.css           # project tokens (neutrals, accents, spacing, stroke, radii, shadows)
    components.css       # .screen, .hero, .btn, .grid.cards modifiers, profile cards, chips
    site.css             # layout chrome — drawer, header, footer, scroll-color, typography, list markers
    extra.css            # last-mile site overrides (kept small)
  javascripts/
    scroll-color.js      # per-section bg swap on scroll, light-scheme only
  overrides/             # Material template overrides
    main.html            # block site_nav swap: TOC left, nav as right overlay drawer
    partials/            # header.html (3-col), footer.html, logo.html, copyright.html
    .icons/lucide        # local lucide SVGs (Material ships material/fontawesome/octicons/simple)
mkdocs.yml               # theme, palette, plugins (meta, blog, search, optimize, redirects), nav, markdown_extensions
requirements.txt
.github/workflows/publish.yml   # CI: build (+ optimize) and sync ./site to S3
```

Note: `darc-zensical.css` is the shared cross-DARC design layer, loaded at build
time from the upstream
[`zensical-theme-darc`](https://github.com/dataresearchcenter/zensical-theme-darc)
repo via `extra_css` (there is **no local copy**). Keep it in sync upstream; don't
put project-specific tweaks there — use the local layers.

## Build & deploy

The `optimize` image plugin (`mkdocs.yml`) is `enabled: !ENV [CI, false]` — it runs
only in CI (and `cache: false`, to dodge a warm-cache race), needing the `pngquant`
binary (PNG) and Pillow (JPG, via `mkdocs-material[imaging]`). Push to `main` runs
`.github/workflows/publish.yml`: `mkdocs build`, then sync `./site` to S3.

## Design system

Tokens are layered:

1. `darc-zensical.css` (upstream) — `--oa-*` palette, `--font-sans`,
   `--font-mono`, scheme tokens (`--bg`, `--text`, `--md-*-color`),
   admonition + code highlight colors per scheme.
2. `tokens.css` (project) — semantic aliases (`--color-black`, `--color-white`),
   marketing section accents (`--bg-{white,black,green,orange,yellow,purple}`),
   spacing scale (`--xs`, `--s`, `--l`, `--xl`), `--stroke-width: 3px`,
   `--radius-{card,chip-sm}`, `--shadow-button{,-light}`, transitions.
3. `components.css` + `site.css` — apply tokens to elements.

**Single border weight everywhere**: `var(--stroke-width)` (3px). To rescale
globally, change the one line in `tokens.css`.

## Components

Every component is plain markdown + a small wrapper class. No macros, no
Python plugins.

| Component | Class(es) |
|---|---|
| Section / screen | `.screen` + `.screen--bg-{color}` + optional `.screen--full-height` |
| Hero (landing) | `.hero.hero--landing` (single column, Sligoil-mono h1) |
| Hero (2-col w/ media) | `.hero` containing one inner `<div markdown>` (content) and one image — order swaps sides |
| Buttons | `.btn` (secondary outline) + `.btn.btn--primary` (filled inverse) |
| Card grid | `<div class="grid cards" markdown>` + markdown list |
| Card full-width | `{ .card--full }` on a list item |
| Profile cards | add `profiles` to the grid: `<div class="grid cards profiles" markdown>` |
| Tag chips | `<kbd>` |
| Form / input | plain `<form>` + `<input>` (generic CSS) |
| Inline text utils | `.muted`, `.dim` |
| Image opt-outs | `{.no-border}`, `{.no-shadow}` |

See `docs/reference.md` for copy-pasteable snippets.

## Layout chrome

- **Padding:** all horizontal padding lives on `main.md-main` (so wrapped
  `.screen` pages and plain-markdown pages like the blog match). `.screen`
  sections carry no padding; stacked sections are separated by a gap. Material's
  content-container inset is neutralized in `components.css`.
- **Header**: 3-column grid (`md-header__title` | centered `md-logo` | actions
  group with palette / search / source / burger). Always-visible burger.
- **Drawer**: `.md-sidebar--primary` repurposed as a right-side overlay panel
  (`max-width: min(22rem, 85vw)`, offset hard shadow, slides in via the
  `#__drawer` checkbox). Always rendered (`main.html` ignores `hide: navigation`,
  which the blog plugin sets on posts). `site.css` has a mobile media block that
  re-flattens Material's mobile nav (static layout, no item borders/box-shadow,
  drops the integrated TOC).
- **TOC**: `.md-sidebar--secondary` moved to the LEFT at desktop widths.
- **Footer**: vanilla `.md-footer-meta` plus a small flexbox column layout.

## Scroll-color

`docs/javascripts/scroll-color.js` toggles `bg--{color}` on `<body>` and
`md-header--bg-{color}` on `.md-header` as `data-background-color` sections
cross the viewport midpoint.

**Light mode only** — dark mode (`data-md-color-scheme="slate"`) keeps the
darc-zensical palette regardless of which section is active. The CSS gate is in
`site.css`: `body[data-md-color-scheme="default"].bg--*`. (The palette is
currently slate-only.)

## Conventions

- `markdown` attribute on every wrapper `<div>` / `<section>` is required to
  keep Python-Markdown parsing inside HTML.
- `<br>` for line breaks inside headings (markdown's two-trailing-spaces and
  `\` rules don't apply in headings).
- Body text in light mode is `--color-black` (#1a1a1a) at weight 500;
  dark mode is `--color-white` at weight 400. Pinned in `site.css`.
- Headings `h2`–`h4` are bold (700) — pinned in `site.css` (Material defaults
  them to a thin ~300/400).
- Inline `<a>` in content (`.md-content a`) inherits color and gets a 2px
  underline; `.btn`, header permalinks and post-title `.toclink` opt out.
- Body unordered-list bullets render a custom check-mark SVG (`site.css`);
  card grids and task lists are excluded.
- Icons: UI chrome (menu, search, social) uses the **Material** set
  (`theme.icon`, `extra.social`). Shortcodes (`:lucide-x:`, `:material-x:`,
  `:simple-x:`, `:octicons-x:`, `:fontawesome-x:`) resolve via `pymdownx.emoji`
  with `material.extensions.emoji.{twemoji,to_svg}`. **Lucide** isn't shipped by
  Material — it's bundled locally in `docs/overrides/.icons/lucide/` and
  registered via the emoji `custom_icons` option, so `:lucide-*:` still works.

## For other DARC sites

This repo is no longer an upstream template — clone it as a starting point. To
adapt a clone, edit `mkdocs.yml` (`site_name`, `site_url`, `repo_url`, `nav`,
logos, `extra.social`), `docs/*.md`, and `docs/stylesheets/extra.css`. Don't
modify the upstream `darc-zensical.css` design layer (it's loaded by URL).
