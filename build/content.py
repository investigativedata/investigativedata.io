"""Generate mkdocs `docs/` markdown from Directus data.

Pages (homepage + sub-pages) become plain markdown built from the component
syntax documented in `docs/reference.md` (screens, heroes, card grids, …).
Articles become posts for the mkdocs-material blog plugin under
`docs/blog/posts/`. No `data.json`, no pre-rendered HTML — just markdown.
"""

import json
import re
import shutil
import textwrap
import unicodedata
from pathlib import Path

from build.assets import resolve_file_urls

DOCS_DIR = Path("docs")
BLOG_DIR = DOCS_DIR / "blog"
POSTS_DIR = BLOG_DIR / "posts"

# Hand-authored pages we must never overwrite or delete.
PROTECTED_PAGES = {"reference.md", "typography.md"}

# CMS bookkeeping fields stripped from every item before rendering.
_NOISE = {
    "status", "sort", "id", "page",
    "user_created", "user_updated", "date_created", "date_updated",
}

# Marketing section background colors supported by `.screen--bg-*`.
_SCREEN_BG = {"white", "black", "green", "orange", "yellow", "purple"}

# Strip JSX/MDX component tags (`<Component …>` / `</Component>` / `<Component/>`).
# Lowercase HTML tags like <br> are kept.
_JSX_TAG_RE = re.compile(r"</?[A-Z][A-Za-z0-9]*(?:\s[^>]*)?\s*/?>")


# --------------------------------------------------------------------------- #
# small helpers
# --------------------------------------------------------------------------- #
def _write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def _clean(item: dict) -> dict:
    return {k: v for k, v in item.items() if k not in _NOISE} if isinstance(item, dict) else {}


def _strip_jsx(text: str) -> str:
    return _JSX_TAG_RE.sub("", str(text or ""))


def _slugify(text: str) -> str:
    """Lowercase ASCII slug for new blog URLs (matches the plugin's intent)."""
    text = unicodedata.normalize("NFKD", str(text)).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def _frontmatter(meta: dict) -> str:
    lines = ["---"]
    for k, v in meta.items():
        if v is None or v == "":
            continue
        if isinstance(v, list):
            lines.append(f"{k}:")
            lines += [f"  - {i}" for i in v]
        elif isinstance(v, bool):
            lines.append(f"{k}: {'true' if v else 'false'}")
        elif k == "date":
            lines.append(f"{k}: {v}")  # unquoted → parsed as a YAML date
        else:
            lines.append(f"{k}: {json.dumps(str(v), ensure_ascii=False)}")
    lines.append("---")
    return "\n".join(lines) + "\n"


def _heading(level: str, text: str, default: str = "##") -> str:
    hashes = default
    if isinstance(level, str) and level[:1] == "h" and level[1:].isdigit():
        hashes = "#" * int(level[1:])
    # markdown headings can't span lines — use <br> for hard breaks.
    return f"{hashes} {str(text).strip().replace(chr(10), '<br>')}"


def _buttons(item: dict) -> str:
    parts = []
    al, ah = item.get("actionLabel"), item.get("actionHref")
    pl, ph = item.get("primaryActionLabel"), item.get("primaryActionHref")
    if al and ah:
        parts.append(f"[{al}]({ah}){{.btn}}")
    if pl and ph:
        parts.append(f"[{pl}]({ph}){{.btn .btn--primary}}")
    return " ".join(parts)


def _card(paragraphs: list[str]) -> str:
    """Format paragraphs as a `grid cards` list item (`-   ` + 4-space body)."""
    block = "\n\n".join(p for p in paragraphs if p and p.strip())
    indented = textwrap.indent(block, "    ")
    return "-   " + indented[4:]


# --------------------------------------------------------------------------- #
# block renderers → markdown (reference.md components)
# --------------------------------------------------------------------------- #
def _hero(item: dict) -> str:
    tagline = item.get("tagLine")
    title = item.get("title") or ""
    teaser = _strip_jsx(item.get("teaser") or "").strip()
    btns = _buttons(item)
    media = item.get("mediaSrc")
    level = item.get("titleLevel") or ("h1" if item.get("landing") else "h2")

    content = [p for p in (
        f"**{tagline}**" if tagline else "",
        _heading(level, title, default="#" if item.get("landing") else "##"),
        teaser,
        btns,
    ) if p]

    if item.get("landing"):
        body = "\n\n".join(content)
        return f'<div class="hero hero--landing" markdown>\n\n{body}\n\n</div>'

    if media:
        ratio = item.get("mediaRatio") or "4/3"
        attrs = ([] if item.get("mediaBorder") else [".no-border"]) + [f'style="aspect-ratio:{ratio}"']
        img = f'![]({media}){{{" ".join(attrs)}}}'
        inner = "\n\n".join(content)
        block = f"<div markdown>\n\n{inner}\n\n</div>"
        children = f"{block}\n\n{img}" if item.get("mediaRight") else f"{img}\n\n{block}"
        return f'<div class="hero" markdown>\n\n{children}\n\n</div>'

    # No media, not landing — simplify to a stacked content block.
    return "\n\n".join(content)


def _mdx(item: dict) -> str:
    return _strip_jsx(item.get("content") or "").strip()


def _typography(item: dict) -> str:
    text = str(item.get("children") or "").strip()
    return _heading(item.get("level") or "h2", text) if text else ""


def _project_card(it: dict) -> str:
    title = it.get("title") or ""
    paras = []
    if it.get("image"):
        paras.append(f"![{title}]({it['image']}){{.no-shadow}}")
    tags = it.get("tags")
    if isinstance(tags, list) and tags:
        paras.append(" ".join(f"<kbd>{t}</kbd>" for t in tags))
    paras.append(f"__{title}__")
    meta = " – ".join(x for x in (it.get("partner"), it.get("date_published")) if x)
    if meta:
        paras.append(f"*{meta}*")
    desc = _strip_jsx(it.get("description") or "").strip()
    if desc:
        paras.append(desc)
    btns = []
    if it.get("caseStudy") and it.get("caseStudyUrl"):
        btns.append(f"[Read case study]({it['caseStudyUrl']}){{.btn}}")
    if it.get("url"):
        btns.append(f"[View project]({it['url']}){{.btn .btn--primary}}")
    if btns:
        paras.append(" ".join(btns))
    return _card(paras)


def _profile_card(it: dict) -> str:
    name = it.get("name") or ""
    paras = []
    if it.get("image"):
        paras.append(f"![{name}]({it['image']})")
    name_line = f"__{name}__"
    if it.get("pronouns"):
        name_line += f' <span class="muted">{it["pronouns"]}</span>'
    paras.append(name_line)
    if it.get("title"):
        paras.append(f"*{it['title']}*")
    bio = _strip_jsx(it.get("content") or "").strip()
    if bio:
        paras.append(bio)
    btns = []
    if it.get("email"):
        btns.append(f"[:material-email: Email](mailto:{it['email']}){{.btn}}")
    if it.get("website"):
        btns.append(f"[:material-web: Website]({it['website']}){{.btn}}")
    if btns:
        paras.append(" ".join(btns))
    return _card(paras)


def _grid(cards: list[str], modifier: str = "") -> str:
    cls = "grid cards" + (f" {modifier}" if modifier else "")
    body = "\n\n".join(cards)
    return f'<div class="{cls}" markdown>\n\n{body}\n\n</div>'


def _render_blocks(blocks: list[dict]) -> list[str]:
    """Render a screen's content blocks, grouping consecutive grid blocks."""
    out: list[str] = []
    i, n = 0, len(blocks)
    while i < n:
        col = blocks[i].get("collection")

        if col in ("projects", "profiles"):
            group = []
            while i < n and blocks[i].get("collection") == col:
                group.append(_clean(blocks[i].get("item") or {}))
                i += 1
            if col == "projects":
                out.append(_grid([_project_card(it) for it in group]))
            else:
                out.append(_grid([_profile_card(it) for it in group], "profiles"))
            continue

        item = _clean(blocks[i].get("item") or {})
        if col == "heroes":
            out.append(_hero(item))
        elif col == "mdx":
            out.append(_mdx(item))
        elif col == "typography":
            out.append(_typography(item))
        else:
            # Unknown block — fall back to any markdown-ish text it carries.
            out.append(_strip_jsx(item.get("content") or item.get("children") or "").strip())
        i += 1
    return [b for b in out if b and b.strip()]


def _screen_open(screen: dict) -> str:
    bg = (screen.get("background") or "white").lower()
    if bg not in _SCREEN_BG:
        bg = "white"
    classes = ["screen", f"screen--bg-{bg}"]
    if screen.get("fullHeight"):
        classes.append("screen--full-height")
    return f'<section class="{" ".join(classes)}" data-background-color="{bg}" markdown>'


# --------------------------------------------------------------------------- #
# page + post generation
# --------------------------------------------------------------------------- #
def generate_page(page_data: dict) -> None:
    slug = page_data.get("slug", "")
    if not slug:
        return
    page_data = resolve_file_urls(page_data)

    sections = []
    for wrapper in page_data.get("screens") or []:
        screen = wrapper.get("item") or {}
        if not isinstance(screen, dict):
            continue
        blocks = _render_blocks(screen.get("content") or [])
        if not blocks:
            continue
        body = "\n\n".join(blocks)
        sections.append(f"{_screen_open(screen)}\n\n{body}\n\n</section>")

    fm = _frontmatter({"title": page_data.get("title", slug), "hide": ["toc"]})
    path = DOCS_DIR / ("index.md" if slug == "index" else f"{slug}.md")
    _write(path, fm + "\n" + "\n\n\n".join(sections))


def _post_filename(article: dict) -> str:
    date = (article.get("published_at") or "")[:10]
    slug = _slugify(article.get("title") or "untitled")
    return f"{date}-{slug}.md" if date else f"{slug}.md"


def generate_article(article: dict) -> None:
    article = resolve_file_urls(article)
    title = article.get("title") or ""
    date = (article.get("published_at") or "")[:10]

    parts = []
    for block in article.get("content") or []:
        if block.get("collection") == "mdx":
            parts.append(_mdx(_clean(block.get("item") or {})))
        else:
            parts.extend(_render_blocks([block]))
    body = "\n\n".join(p for p in parts if p and p.strip())

    meta = {"date": date, "slug": _slugify(title)}
    # The blog plugin titles a post from its first H1; only set `title:` when the
    # body doesn't already provide one.
    if not body.lstrip().startswith("#"):
        meta["title"] = title

    _write(POSTS_DIR / _post_filename(article), _frontmatter(meta) + "\n" + body)


def _js_slugify(text: str) -> str:
    """Reproduce the pre-migration (Zola/Next) slug: whitespace→'-', keep ASCII
    punctuation, drop non-ASCII. Used only to rebuild legacy blog URLs."""
    text = re.sub(r"\s+", "-", str(text).strip())
    text = re.sub(r"[^\x20-\x7E]", "", text)
    return re.sub(r"-{2,}", "-", text).strip("-")


def legacy_redirect(article: dict) -> tuple[str, str] | None:
    """(old_url_as_md_path, new_post_src_path) for the mkdocs-redirects map.

    Old URL was `/blog/{year}/{month}/{js-slug}/{id}/`; the redirects plugin
    resolves the new post's `.md` src_path to its current blog-plugin URL.
    """
    published, aid = article.get("published_at") or "", article.get("id") or ""
    if not (published and aid):
        return None
    old = f"blog/{published[:4]}/{published[5:7]}/{_js_slugify(article.get('title') or '')}/{aid}.md"
    return old, f"blog/posts/{_post_filename(article)}"


def generate_blog_index() -> None:
    fm = _frontmatter({"title": "Blog"})
    body = "# Blog\n\nNews and updates from the Data and Research Center."
    _write(BLOG_DIR / "index.md", fm + "\n" + body)


def clean() -> None:
    """Remove generated content; leave hand-authored pages and assets intact."""
    if POSTS_DIR.exists():
        shutil.rmtree(POSTS_DIR)
