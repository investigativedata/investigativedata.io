"""Directus REST API client — mirrors lib/directus.tsx fetch logic."""

import os

import httpx

DIRECTUS_URL = os.environ.get("DIRECTUS_URL", "https://cms.investigativedata.net")
DIRECTUS_API_TOKEN = os.environ.get("DIRECTUS_API_TOKEN", "")
DIRECTUS_SITE = os.environ.get(
    "NEXT_PUBLIC_DIRECTUS_SITE",
    os.environ.get("DIRECTUS_SITE", "investigativedata.io"),
)
ASSETS_BASE_URL = os.environ.get(
    "ASSETS_BASE_URL", "https://assets.investigativedata.org/cms/"
)

_SITE_FILTER = {"site": {"name": {"_eq": DIRECTUS_SITE}}}

_client: httpx.Client | None = None


def _get_client() -> httpx.Client:
    global _client
    if _client is None:
        _client = httpx.Client(
            base_url=DIRECTUS_URL,
            headers={"Authorization": f"Bearer {DIRECTUS_API_TOKEN}"},
            timeout=30,
        )
    return _client


def _request(collection: str, params: dict) -> list[dict]:
    """GET /items/{collection} with query params."""
    resp = _get_client().get(f"/items/{collection}", params=params)
    resp.raise_for_status()
    return resp.json()["data"]


def _encode_filter(filt: dict, prefix: str = "filter") -> dict:
    """Recursively flatten a nested filter dict into Directus bracket notation."""
    out: dict = {}
    for k, v in filt.items():
        key = f"{prefix}[{k}]"
        if isinstance(v, dict):
            out.update(_encode_filter(v, key))
        else:
            out[key] = v
    return out


def _encode_fields(fields: list[str]) -> dict:
    return {f"fields[{i}]": f for i, f in enumerate(fields)}


def get_site() -> dict:
    """Fetch site config — readItem("sites", DIRECTUS_SITE)."""
    resp = _get_client().get(f"/items/sites/{DIRECTUS_SITE}")
    resp.raise_for_status()
    return resp.json()["data"]


def get_pages() -> list[dict]:
    """Fetch all pages (base fields only)."""
    params = {
        **_encode_filter(_SITE_FILTER),
        **_encode_fields(["slug", "title", "description"]),
    }
    return _request("pages", params)


def get_page(slug: str) -> dict | None:
    """Fetch a single page with full screen/content nesting."""
    filt = {**_SITE_FILTER, "slug": {"_eq": slug}}
    params = {
        **_encode_filter(filt),
        **_encode_fields([
            "*",
            "screens.collection",
            "screens.item",
            "screens.item.*",
            "screens.item.*.*",
            "screens.item.*.*.*",
        ]),
    }
    pages = _request("pages", params)
    if pages:
        return pages[0]
    return None


def get_articles() -> list[dict]:
    """Fetch article listing (base fields + hero image)."""
    params = {
        **_encode_filter(_SITE_FILTER),
        **_encode_fields([
            "id",
            "title",
            "titleShort",
            "subtitle",
            "teaser",
            "teaserShort",
            "published_at",
            "heroImage.*",
        ]),
        "sort": "-published_at",
    }
    return _request("articles", params)


def get_article(article_id: str) -> dict:
    """Fetch a single article with all content blocks."""
    resp = _get_client().get(
        f"/items/articles/{article_id}",
        params={
            **_encode_filter(_SITE_FILTER),
            **_encode_fields(["*", "articleImage.*", "content.*", "content.item.*"]),
        },
    )
    resp.raise_for_status()
    return resp.json()["data"]


def get_menu_pages() -> list[dict]:
    """Fetch pages marked for navigation menu."""
    filt = {**_SITE_FILTER, "menu": {"_eq": "true"}}
    params = {
        **_encode_filter(filt),
        **_encode_fields(["slug", "title", "description"]),
    }
    return _request("pages", params)
