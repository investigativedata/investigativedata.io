# Directus → MkDocs migration (`build/` + `build.py`)

**Temporary tooling — handoff doc.** This pipeline seeds the one-time migration of
DARC content from the old Directus-driven site into this MkDocs site. It is *not*
part of the production project: `README.md` / `CLAUDE.md` deliberately don't mention
it, and once the migration is finished `build.py` + `build/` get deleted.

> ⚠️ **`build.py` is a one-shot seeder, not a repeatable build.** It emits markdown
> that references **remote** Directus asset URLs. After generation, pages were
> **hand-finished** (images downloaded/inlined, resized, optimized, format-converted;
> some content tweaked). **Re-running `build.py` overwrites those hand edits** with
> freshly generated remote-URL versions. Regenerate a page only when you intend to
> redo its hand-finish.

## Status — where the migration got to

Generated and then hand-finished:

- Pages: `docs/index.md`, `what-we-do.md`, `who-we-are.md`, `projects.md`, `contact.md`
- Blog: `docs/blog/index.md` + 4 posts in `docs/blog/posts/`
- Redirect map (legacy → new blog URLs) computed and pasted into `mkdocs.yml`
  (`plugins → redirects`) for the 4 existing posts.

Hand-finished after generation (see [Hand-finish workflow](#hand-finish-workflow)):
images inlined under `docs/assets/{profiles,projects,blogs}/`, resized, optimized,
and format-converted; `projects.md` card titles changed to `##` headings.

## Run

```bash
DIRECTUS_API_TOKEN=… python build.py
```

Env vars (`build/directus.py`):

| var | default | notes |
|---|---|---|
| `DIRECTUS_API_TOKEN` | — | **required** (read token for the CMS) |
| `DIRECTUS_URL` | `https://cms.investigativedata.net` | Directus instance |
| `DIRECTUS_SITE` | `dataresearchcenter.org` | all queries filter on this site name |
| `ASSETS_BASE_URL` | `https://assets.investigativedata.org/cms/` | file-id → URL prefix |

`build.py` flow: fetch pages + articles → `clean()` (removes `docs/blog/posts/`) →
`generate_page()` per page → `generate_article()` per article → `generate_blog_index()`
→ prints the `redirect_maps` block to paste into `mkdocs.yml`.

## Architecture

| file | role |
|---|---|
| `build.py` | orchestration / entry point |
| `build/directus.py` | Directus REST client (`get_pages`, `get_page`, `get_articles`, `get_article`); site-filtered, bracket-encoded filters/fields |
| `build/assets.py` | `resolve_file_urls()` recursively turns Directus file-id fields (`src`, `image`, `mediaSrc`, `heroImage`, …) into `ASSETS_BASE_URL`+id URLs |
| `build/content.py` | the renderer — Directus screens/blocks → markdown using the `docs/reference.md` component syntax |

(`build/converter.py`, the old markdown→HTML renderer, was deleted — content is kept
as raw markdown now.)

## Directus data model

- **page**: `slug`, `title`, `screens[]`. Each screen is `{collection: "screens", item: {...}}`
  with `name`, `background` (`white|black|green|orange|yellow|purple`), `fullHeight`,
  and `content[]` (the blocks).
- **content blocks** — each `{collection, item}`; collections seen in live data:
  - `heroes`: `title`, `teaser` (markdown, may contain `<br>` + links), `tagLine`,
    `actionLabel`/`actionHref` (secondary button), `primaryActionLabel`/`primaryActionHref`
    (primary button), `mediaSrc`, `mediaRight`, `mediaBorder`, `mediaRatio`, `titleLevel`, `landing`
  - `mdx`: `content` (markdown)
  - `typography`: `children` (text), `level` (`h1`–`h6`)
  - `projects`: `title`, `description` (md), `partner`, `date_published`, `tags[]`,
    `image`, `url`, `caseStudy`, `caseStudyUrl`
  - `profiles`: `name`, `pronouns`, `title`, `content` (bio md), `email`, `website`, `image`
- **article** (blog): `id`, `title`, `titleShort`/`subtitle`/`teaser`/`teaserShort`,
  `published_at`, `tags`, `heroImage`, `articleImage`, `content[]` (all `mdx` blocks so far).

## Rendering map (Directus → `reference.md` component)

| Directus | output markdown |
|---|---|
| screen | `<section class="screen screen--bg-{bg}[ screen--full-height]" data-background-color="{bg}" markdown>` |
| `heroes` (landing) | `.hero.hero--landing` (tagline, `#` title, teaser, buttons) |
| `heroes` (has `mediaSrc`) | 2-column `.hero` (content `<div markdown>` + image; sides per `mediaRight`) |
| `heroes` (no media) | stacked tagline / heading / teaser / buttons |
| `mdx` | raw markdown (capitalized JSX tags stripped) |
| `typography` | markdown heading at `level` |
| consecutive `projects` | one `<div class="grid cards">` of project cards |
| consecutive `profiles` | one `<div class="grid cards profiles">` of profile cards |

Pages → `docs/index.md` (homepage) / `docs/{slug}.md`, each with `hide: toc`
front matter. Articles → `docs/blog/posts/{YYYY-MM-DD}-{slug}.md` with `date` +
`slug` front matter (and `title` only if the body has no leading `#`). `legacy_redirect()`
reproduces the pre-migration URL (`blog/{yyyy}/{mm}/{js-slug}/{id}.md`) → new post path.

## Hand-finish workflow

`build.py` output references remote asset URLs and raw CMS content. For each
migrated page the following was done by hand and must be repeated for any newly
migrated content:

1. **Inline images** — download each `https://assets.investigativedata.org/cms/<id>`
   into `docs/assets/{profiles,projects,blogs}/<friendly-name>.<ext>` and rewrite the
   markdown ref to `./assets/...` (relative to the page).
2. **Resize** — `python scripts/resize_assets.py` (caps profiles 600px / projects 1600px).
   The `optimize` plugin then compresses at build (CI only).
3. **Convert formats** — WebP/AVIF and photographic PNGs aren't handled well by the
   pipeline; convert to JPG and update refs. Watch for **mislabeled** files (JPEG with a
   `.png` extension — `file <img>` to check; `damascus1/2.png` were such cases).
4. **Fix CMS content quirks** (below).

## Known content quirks (from the CMS, not the renderer)

- `contact` page impressum is authored as `typography` `h2` blocks → renders as giant
  headings. Fix in Directus or post-edit.
- `projects` content links to `/solutions/aleph/` pages that don't exist in this site.
- Hero teasers hardcode old blog URLs → handled by the `redirects` plugin.

## TODO for takeover

- [ ] Verify every Directus page/article for `dataresearchcenter.org` is migrated
      (current: `index` + 4 sub-pages + 4 posts — re-check the CMS for more).
- [ ] For any newly migrated page, run the [hand-finish workflow](#hand-finish-workflow)
      and add any new legacy→new redirects to `mkdocs.yml`.
- [ ] Address the content quirks above (ideally in Directus).
- [ ] **When done:** `git rm -r build.py build/`, drop `httpx` (and `zensical` if the
      drop-in isn't used) from `requirements.txt`. The `redirect_maps` in `mkdocs.yml`
      are static now and stay.
