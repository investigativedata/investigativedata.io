import type { Metadata } from "next";
import slugify from "slugify";
import { IScreen } from "@/lib/types";
import { permanentRedirect } from "next/navigation";
import { IPageMenuItem } from "@investigativedata/style";
import Page from "@/components/Page";
import { DEFAULT_TITLE, PREVIEW } from "@/config";
import { getMenuPages, getPage, getPages } from "@/lib/directus";

type IParams = {
  readonly slug?: string[];
};

export async function generateMetadata({
  params,
}: {
  params: IParams;
}): Promise<Metadata> {
  const data = await getPage(params.slug || ["index"]);
  return {
    title: `${data.title} – ${DEFAULT_TITLE}`,
    description: data.description,
  };
}

const getPageMenu = (screens: IScreen[]): IPageMenuItem[] =>
  screens
    .filter(({ item }) => !!item.anchor)
    .map(({ item }) => ({ label: item.name, href: `#${slugify(item.name)}` }));

export default async function SlugPage({
  params,
}: {
  params: { slug: string[] };
}) {
  if (params.slug.length === 1 && params.slug[0] === "index") {
    return permanentRedirect("/");
  }

  const data = await getPage(params.slug);
  const menu = await getMenuPages();
  const pageMenu = getPageMenu(data.screens);
  return (
    <Page data={data} menu={menu} pageMenu={pageMenu} previewMode={PREVIEW} />
  );
}

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.map(({ slug }) => ({ slug: slug.split("/") }));
}
