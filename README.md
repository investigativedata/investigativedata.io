# investigativedata.io

Shared design system + project template for DARC's downstream websites,
built with [Zensical](https://zensical.org/) (the mkdocs-material successor).

Content lives as plain markdown under `docs/`. The site theme, custom
components, and configuration in this repo are the starting point that
each downstream site forks or extends.

## Setup

```bash
pip install zensical
```

## Development

```bash
zensical serve     # → http://localhost:8000 (live reload)
```

## Build

```bash
zensical build     # → ./site
```

## Layout

```
docs/
  index.md                    # pages, written in markdown
  reference.md                # component authoring reference
  stylesheets/
    tokens.css                # project-specific design tokens
    components.css            # custom components (.hero, .grid.cards, .btn, …)
    site.css                  # layout, header/footer, scroll-color hooks
    extra.css                 # last-mile site overrides
  javascripts/
    scroll-color.js           # per-section background swap on scroll
  overrides/                  # zensical template overrides (header, footer, main)
mkdocs.yml                    # zensical config (site name, nav, palette, plugins)
```

## Authoring

See [`docs/reference.md`](docs/reference.md) for copy-pasteable markdown for
every component (hero, card grid, profile cards, buttons, forms, admonitions,
icons, etc.) and links to the underlying Zensical primitives.

## Customising downstream

For a downstream site, edit:

- `mkdocs.yml` – `site_name`, `site_url`, `nav`, `theme.logo`, social links
- `docs/stylesheets/extra.css` – site-specific CSS overrides
- `docs/*.md` – pages

  
`https://dataresearchcenter.github.io/zensical-theme-darc/stylesheets/darc-zensical.css` (from https://github.com/dataresearchcenter/zensical-theme-darc) is the shared design layer and stays in
sync upstream – do not put project-specific tweaks there.
