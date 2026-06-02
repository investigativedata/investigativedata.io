"""Markdown/MDX → HTML conversion — mirrors serializeMdx() from lib/directus.tsx."""

import re

import markdown

_md = markdown.Markdown(extensions=[
    "tables",
    "fenced_code",
    "attr_list",
    "codehilite",
], extension_configs={
    "codehilite": {"css_class": "highlight", "guess_lang": False},
})

# Regex to strip JSX component tags like <Component prop="val">...</Component> or <Component />
_JSX_TAG_RE = re.compile(r"</?[A-Z][A-Za-z0-9]*(?:\s[^>]*)?\s*/?>")


def _render_md(text: str) -> str:
    """Render markdown to HTML, stripping any JSX tags first."""
    _md.reset()
    cleaned = _JSX_TAG_RE.sub("", text)
    return _md.convert(cleaned)


def _strip_p_wrapper(html: str) -> str:
    """Strip wrapping <p>...</p> tags for inline content."""
    html = html.strip()
    if html.startswith("<p>") and html.endswith("</p>"):
        html = html[3:-4]
    return html


def convert_content(block: dict) -> dict:
    """Process a content block, rendering markdown fields to HTML.

    Mirrors the per-collection rendering from serializeMdx() in lib/directus.tsx.
    Adds rendered_* fields to the item dict.
    """
    collection = block.get("collection", "")
    item = block.get("item", {})
    if not isinstance(item, dict):
        return block

    item = _clean_props(item)

    if collection == "mdx" and item.get("content"):
        item["rendered_content"] = _render_md(item["content"])

    elif collection == "heroes" and item.get("teaser"):
        html = _render_md(str(item["teaser"]))
        item["rendered_teaser"] = f"<span>{_strip_p_wrapper(html)}</span>"

    elif collection == "projects" and item.get("description"):
        html = _render_md(item["description"])
        # Wrap paragraphs with body-s class
        item["rendered_description"] = html.replace("<p>", '<p class="body-s">')

    elif collection == "images" and item.get("description"):
        html = _render_md(item["description"])
        item["rendered_description"] = html.replace("<p>", '<p class="body-xs">')

    elif collection == "cards" and item.get("content"):
        html = _render_md(item["content"])
        item["rendered_content"] = html.replace("<p>", '<p class="body-s">')

    elif collection == "animations" and item.get("content"):
        html = _render_md(item["content"])
        item["rendered_content"] = f"<span>{_strip_p_wrapper(html)}</span>"

    elif collection == "profiles" and item.get("content"):
        item["rendered_content"] = _render_md(item["content"])

    return {"collection": collection, "item": item}


def _clean_props(item: dict) -> dict:
    """Remove CMS metadata fields — mirrors cleanProps() in lib/directus.tsx."""
    skip = {"status", "user_created", "user_updated", "date_created", "date_updated"}
    return {k: v for k, v in item.items() if k not in skip}
