# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A [Zensical](https://zensical.org/) (mkdocs-material successor) site that
also serves as the **shared design + project template** for downstream DARC
websites. Content is plain markdown under `docs/`. The same `mkdocs.yml`
runs under `mkdocs serve` (using mkdocs-material) too — both packages live
in the same `.venv`.

## Commands

```bash
zensical serve           # http://localhost:8000 (live reload)
zensical build           # → ./site

# alternative runtime — same config, drop-in
mkdocs serve
mkdocs build
```

## Architecture

```
docs/
  index.md                 # markdown pages
  reference.md             # authoring reference (every component, copy-pasteable)
  typography.md
  stylesheets/
    darc-zensical.css      # SHARED design system (synced upstream — see Note below)
    tokens.css             # project-specific tokens (semantic neutrals, accents,
                           #   spacing, stroke, radii, shadows, transitions)
    components.css         # custom components: .screen, .hero, .btn, .grid.cards
                           #   modifiers, profile cards, kbd chips, global img frame
    site.css               # layout chrome — drawer, header, footer, scroll-color
                           #   body classes, typography pin-overrides
    extra.css              # last-mile site overrides (kept small)
  javascripts/
    scroll-color.js        # per-section bg swap on scroll, light-scheme only
  overrides/               # zensical/material template overrides
    main.html              # block site_nav swap: TOC left, nav as right overlay
    partials/
      header.html          # 3-column header (site name | logo | actions+burger)
      footer.html          # vanilla .md-footer-meta with column links
      logo.html            # per-scheme logo (Neg in dark, Pos in light)
      copyright.html       # DARC attribution
      .icons/lucide        # → symlink into installed zensical's lucide set (or copy)
mkdocs.yml                 # site_name, palette, plugins, markdown_extensions, nav
main.py                    # NOT used (no macros plugin)
```

Note: `darc-zensical.css` is the shared cross-project design layer — keep it
in sync with the upstream `zensical-theme-darc` repo and avoid putting
project-specific tweaks here.

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

See `docs/reference.md` for copy-pasteable snippets and links to upstream
Zensical primitives where relevant.

## Layout chrome

- **Header**: 3-column grid (`md-header__title` | centered `md-logo` | actions
  group with palette / search / source / burger). Always-visible burger.
- **Drawer**: `.md-sidebar--primary` repurposed as a right-side overlay panel
  (24rem max-width, offset hard shadow at `--stroke-width`, slides in via the
  existing `#__drawer` checkbox). Renders the stock `partials/nav.html`
  inside, restyled flat with hover-only underline.
- **TOC**: `.md-sidebar--secondary` moved to the LEFT at desktop widths.
- **Footer**: vanilla `.md-footer-meta` from zensical-darc, plus a small
  flexbox column layout for our two link rows.

## Scroll-color

`docs/javascripts/scroll-color.js` toggles `bg--{color}` on `<body>` and
`md-header--bg-{color}` on `.md-header` as `data-background-color` sections
cross the viewport midpoint.

**Light mode only** — dark mode (`data-md-color-scheme="slate"`) keeps the
darc-zensical palette regardless of which section is active. The JS still
toggles classes uniformly; the CSS gate is in `site.css`:
`body[data-md-color-scheme="default"].bg--*`.

## Conventions

- `markdown` attribute on every wrapper `<div>` / `<section>` is required to
  keep Python-Markdown parsing inside HTML.
- `<br>` for line breaks inside headings (markdown's two-trailing-spaces and
  `\` rules don't apply in headings).
- Body text in light mode is `--color-black` (#1a1a1a) at weight 500;
  dark mode is `--color-white` at weight 400. Pinned in `site.css`.
- Inline `<a>` color inherits — no orange accent. Underline stays as the
  affordance.
- Icon shortcodes (`:lucide-x:`, `:material-x:`, `:simple-x:`,
  `:octicons-x:`, `:fontawesome-x:`) resolve via `pymdownx.emoji` configured
  with `zensical.extensions.emoji.{twemoji,to_svg}` in `mkdocs.yml`. Lucide
  is the default UI set.

## Customising for a downstream site

Edit only:

- `mkdocs.yml` — `site_name`, `site_url`, `repo_url`, `nav`, `theme.logo`,
  `extra.logo_light`, `extra.social`.
- `docs/stylesheets/extra.css` — site-specific CSS overrides.
- `docs/*.md` — pages.

Do **not** modify `darc-zensical.css` — it ships from the upstream
`zensical-theme-darc` repo and stays in sync across DARC sites.
