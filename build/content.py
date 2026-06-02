"""Generate Zola content/ files from Directus data."""

import json
import os
import re
import shutil
from pathlib import Path

import tomli_w

from build.assets import get_file_url, resolve_file_urls
from build.converter import convert_content
from build.directus import ASSETS_BASE_URL

CONTENT_DIR = Path("content")
DATA_DIR = Path("data")


def _js_slugify(text: str) -> str:
    """Match npm ``slugify`` package default behavior: replace whitespace with
    ``-``, preserve ASCII punctuation, strip emojis and other non-ASCII."""
    text = re.sub(r"\s+", "-", text.strip())
    # Keep only ASCII characters (letters, digits, punctuation) like JS slugify
    text = re.sub(r"[^\x20-\x7E]", "", text)
    # Clean up leading/trailing/duplicate dashes left by removed chars
    text = re.sub(r"-{2,}", "-", text).strip("-")
    return text


def _write_file(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def _write_json(path: Path, data):
    _write_file(path, json.dumps(data, indent=2, ensure_ascii=False, default=str))


def _frontmatter(fm: dict) -> str:
    """Serialize TOML frontmatter wrapped in +++."""
    toml_str = tomli_w.dumps(fm)
    return f"+++\n{toml_str}+++\n"


def _process_screens(screens: list[dict]) -> list[dict]:
    """Process all screens: resolve assets and convert markdown."""
    result = []
    for screen_wrapper in screens:
        collection = screen_wrapper.get("collection", "screens")
        item = screen_wrapper.get("item", {})
        if not isinstance(item, dict):
            continue

        item = resolve_file_urls(item)

        if "content" in item and isinstance(item["content"], list):
            processed_content = []
            for block in item["content"]:
                if isinstance(block, dict):
                    block = resolve_file_urls(block)
                    block = convert_content(block)
                    processed_content.append(block)
            item["content"] = processed_content

        result.append({"collection": collection, "item": item})
    return result


def _find_parent_slugs(all_slugs: set[str]) -> set[str]:
    """Find slugs that are prefixes of other slugs (i.e. they have children)."""
    parents = set()
    for slug in all_slugs:
        parts = slug.split("/")
        for i in range(1, len(parts)):
            parents.add("/".join(parts[:i]))
    return parents


def generate_page(page_data: dict, parent_slugs: set[str]):
    """Generate Zola content files for a single page."""
    slug = page_data.get("slug", "")
    if not slug:
        return

    screens = _process_screens(page_data.get("screens", []))
    color = page_data.get("color", "white")

    data_payload = {"color": color, "screens": screens}
    is_parent = slug in parent_slugs

    if slug == "index":
        # Homepage — _index.md is a section, so store data in data/ dir
        fm = {"title": page_data.get("title", "Home"), "template": "index.html"}
        _write_file(CONTENT_DIR / "_index.md", _frontmatter(fm))
        _write_json(DATA_DIR / "homepage.json", data_payload)
    elif is_parent:
        # This page has children — must be a section (_index.md)
        # Store data in data/ dir since sections can't have colocated data
        page_dir = CONTENT_DIR / slug
        safe_name = slug.replace("/", "_")
        fm = {
            "title": page_data.get("title", slug),
            "template": "page-section.html",
            "transparent": True,
            "extra": {"data_file": f"data/page_{safe_name}.json"},
        }
        _write_file(page_dir / "_index.md", _frontmatter(fm))
        _write_json(DATA_DIR / f"page_{safe_name}.json", data_payload)
    else:
        # Leaf page — use index.md with colocated data.json
        slug_parts = slug.split("/")
        if len(slug_parts) > 1:
            # Ensure parent sections exist (transparent ones for intermediates
            # that don't have their own Directus page)
            for i in range(1, len(slug_parts)):
                parent = CONTENT_DIR / "/".join(slug_parts[:i])
                index = parent / "_index.md"
                if not index.exists():
                    pfm = {"title": slug_parts[i - 1], "transparent": True}
                    _write_file(index, _frontmatter(pfm))

        page_dir = CONTENT_DIR / slug
        fm = {
            "title": page_data.get("title", slug),
            "template": "page.html",
        }
        _write_file(page_dir / "index.md", _frontmatter(fm))
        _write_json(page_dir / "data.json", data_payload)


def _make_article_slug(article: dict) -> str:
    """Generate URL slug matching makeSlug() from lib/util.ts."""
    published = article.get("published_at", "")
    year = published[:4]
    month = published[5:7]
    title_slug = _js_slugify(article.get("title", "untitled"))
    article_id = article.get("id", "")
    return f"blog/{year}/{month}/{title_slug}/{article_id}"


def _make_article_dir_slug(article: dict) -> str:
    """Generate a filesystem-safe directory name for the article."""
    title_slug = _js_slugify(article.get("title", "untitled"))
    article_id = article.get("id", "")
    return f"{title_slug}-{article_id}"


def generate_article(article_data: dict):
    """Generate Zola content files for a single article."""
    article_id = article_data.get("id", "")
    if not article_id:
        return

    article_data = resolve_file_urls(article_data)

    # Process content blocks
    content_blocks = []
    for block in article_data.get("content", []) or []:
        if isinstance(block, dict):
            block = resolve_file_urls(block)
            block = convert_content(block)
            content_blocks.append(block)

    dir_slug = _make_article_dir_slug(article_data)
    article_dir = CONTENT_DIR / "blog" / dir_slug
    url_path = _make_article_slug(article_data)

    published = article_data.get("published_at", "")
    date_str = published[:10] if published else ""

    fm = {
        "title": article_data.get("title", ""),
        "template": "blog-article.html",
        "path": url_path,
    }
    if date_str:
        fm["date"] = date_str

    hero_image = article_data.get("heroImage")
    article_image = article_data.get("articleImage")

    data_payload = {
        "id": article_id,
        "title": article_data.get("title", ""),
        "titleShort": article_data.get("titleShort"),
        "subtitle": article_data.get("subtitle"),
        "teaser": article_data.get("teaser"),
        "teaserShort": article_data.get("teaserShort"),
        "published_at": published,
        "tags": article_data.get("tags", []),
        "heroImage": hero_image,
        "articleImage": article_image,
        "content": content_blocks,
    }

    _write_file(article_dir / "index.md", _frontmatter(fm))
    _write_json(article_dir / "data.json", data_payload)


def generate_blog_section(articles: list[dict]):
    """Generate the blog listing section."""
    blog_dir = CONTENT_DIR / "blog"

    fm = {
        "title": "Blog",
        "template": "section.html",
        "sort_by": "date",
    }
    _write_file(blog_dir / "_index.md", _frontmatter(fm))

    # Resolve article listing data for section template
    articles_data = []
    for a in articles:
        a = resolve_file_urls(a)
        articles_data.append({
            "id": a.get("id"),
            "title": a.get("title"),
            "titleShort": a.get("titleShort"),
            "subtitle": a.get("subtitle"),
            "teaser": a.get("teaser"),
            "teaserShort": a.get("teaserShort"),
            "published_at": a.get("published_at"),
            "heroImage": a.get("heroImage"),
            "url": "/" + _make_article_slug(a) + "/",
        })

    _write_json(DATA_DIR / "blog_articles.json", articles_data)


def generate_site_data(site: dict, menu_pages: list[dict]):
    """Generate data/site.json with site config and menu."""
    logo_url = get_file_url(site.get("logo"), ASSETS_BASE_URL)
    data = {
        "name": site.get("name", ""),
        "title": site.get("title", ""),
        "description": site.get("description", ""),
        "logo": logo_url,
        "darc": site.get("darc", False),
        "menu": [{"slug": p["slug"], "title": p["title"]} for p in menu_pages],
    }
    _write_json(DATA_DIR / "site.json", data)


def clean():
    """Remove generated directories."""
    if CONTENT_DIR.exists():
        shutil.rmtree(CONTENT_DIR)
    site_json = DATA_DIR / "site.json"
    if site_json.exists():
        site_json.unlink()
