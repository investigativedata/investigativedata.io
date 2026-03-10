# investigativedata.io

Static website built with [Zola](https://www.getzola.org/). Content is fetched from a headless [Directus](https://directus.io/) CMS via a Python pre-build script.

## Prerequisites

- [Zola](https://www.getzola.org/documentation/getting-started/installation/) (static site generator)
- Python 3.10+
- Environment variables:
  - `DIRECTUS_API_TOKEN` — API token for the Directus CMS
  - `NEXT_PUBLIC_DIRECTUS_SITE` — Site identifier (default: `openaleph.org`)

## Setup

```bash
make install    # Create .venv and install Python dependencies
```

## Development

```bash
make dev        # Fetch content from Directus + start Zola dev server (http://localhost:1111)
```

## Build

```bash
make build      # Fetch content + build static site → public/
make serve      # Serve the built site locally (python http.server)
```

## Deploy

```bash
make publish    # Build + sync public/ to S3
```

## Other commands

```bash
make fetch      # Only fetch content from Directus → content/ + data/
make clean      # Remove generated content/, data/*.json, and public/
```

## Architecture

```
build.py → Directus API → content/*.md + data/*.json → zola build → public/
```

1. **Python fetcher** (`build/`) fetches pages, articles, and site config from Directus, resolves asset URLs, converts markdown to HTML, and writes Zola content files.
2. **Zola** compiles SCSS, renders Tera templates, and outputs a static site.
3. **Vanilla JS** (~50 lines) handles the mobile drawer toggle and scroll-based background color transitions.
