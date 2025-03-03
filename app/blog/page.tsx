import type { Metadata } from "next";
import ArticleList from "@/components/ArticleList";
import { getArticles, getMenuPages } from "@/lib/directus";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const menu = await getMenuPages();
  const articles = await getArticles();
  return <ArticleList menu={menu} articles={articles} />;
}
