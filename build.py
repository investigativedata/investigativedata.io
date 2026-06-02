#!/usr/bin/env python3
"""Fetch Directus content and generate mkdocs `docs/` markdown.

Pages → `docs/*.md` (reference.md component syntax).
Articles → `docs/blog/posts/*.md` for the mkdocs-material blog plugin.
Also prints the legacy→new redirect map for the mkdocs-redirects plugin.
"""

import json

from build.content import (
    clean,
    generate_article,
    generate_blog_index,
    generate_page,
    legacy_redirect,
)
from build.directus import get_article, get_articles, get_page, get_pages


def main():
    print("Fetching pages…")
    page_bases = get_pages()

    print("Fetching articles…")
    articles = [get_article(a["id"]) for a in get_articles()]

    print("Cleaning generated output…")
    clean()

    for base in page_bases:
        data = get_page(base["slug"])
        if data:
            print(f"  page → {base['slug']}")
            generate_page(data)

    for article in articles:
        print(f"  post → {article.get('title')}")
        generate_article(article)

    generate_blog_index()

    redirects = [r for r in (legacy_redirect(a) for a in articles) if r]
    if redirects:
        print("\nmkdocs.yml → plugins → redirects → redirect_maps:")
        for old, new in redirects:
            print(f"  {json.dumps(old)}: {json.dumps(new)}")

    print("\nDone!")


if __name__ == "__main__":
    main()
