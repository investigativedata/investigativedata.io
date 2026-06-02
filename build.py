#!/usr/bin/env python3
"""Entry point: fetch Directus content, generate Zola content files."""

from build.content import (
    _find_parent_slugs,
    clean,
    generate_article,
    generate_blog_section,
    generate_page,
    generate_site_data,
)
from build.directus import get_article, get_articles, get_menu_pages, get_page, get_pages, get_site


def main():
    # Phase 1: Fetch all data from Directus
    print("Fetching site config...")
    site = get_site()
    menu_pages = get_menu_pages()

    print("Fetching pages...")
    page_bases = get_pages()
    all_slugs = {p["slug"] for p in page_bases}
    parent_slugs = _find_parent_slugs(all_slugs)

    pages_data = {}
    for page_base in page_bases:
        slug = page_base["slug"]
        print(f"  Fetching page: {slug}")
        data = get_page(slug)
        if data:
            pages_data[slug] = data

    print("Fetching articles...")
    articles = get_articles()
    articles_data = {}
    for article_base in articles:
        article_id = article_base["id"]
        title = article_base.get("title", article_id)
        print(f"  Fetching article: {title}")
        articles_data[article_id] = get_article(article_id)

    # Phase 2: Clean and generate
    print("Cleaning output directories...")
    clean()

    print(f"Generating {len(pages_data)} pages...")
    for slug, page_data in pages_data.items():
        print(f"  → {slug}")
        generate_page(page_data, parent_slugs)

    print(f"Generating {len(articles_data)} articles...")
    for article_id, article_data in articles_data.items():
        print(f"  → {article_data.get('title', article_id)}")
        generate_article(article_data)

    print("Generating blog section...")
    generate_blog_section(articles)

    print("Generating site data...")
    generate_site_data(site, menu_pages)

    print("Done!")


if __name__ == "__main__":
    main()
