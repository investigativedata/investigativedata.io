import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Article from "@/components/Article";
import { DEFAULT_TITLE, PREVIEW } from "@/config";
import { getArticle, getArticles, getMenuPages } from "@/lib/directus";
import { makeSlug } from "@/lib/util";

type IParams = {
  readonly slug: string[];
};

const getArticleId = (params: IParams): string => {
  const id = params.slug.at(-1);
  if (!id) return notFound();
  return id;
};

export async function generateMetadata(props: {
  params: Promise<IParams>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = getArticleId(params);
  const data = await getArticle(id);
  return {
    title: `${data.title} – ${DEFAULT_TITLE}`,
    description: data.teaser,
  };
}

export default async function ArticlePage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const id = getArticleId(params);
  const data = await getArticle(id);
  const menu = await getMenuPages();
  return <Article data={data} menu={menu} previewMode={PREVIEW} />;
}

export async function generateStaticParams() {
  const pages = await getArticles();
  return pages.map((data) => makeSlug(data));
}
