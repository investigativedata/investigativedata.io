import slugify from "slugify";
import { IScreen } from "@/lib/types";
import { IPageMenuItem } from "@investigativedata/style";
import Page from "@/components/Page";
import { PREVIEW } from "@/config";
import { getMenuPages, getPage, getPages } from "@/lib/directus";

const getPageMenu = (screens: IScreen[]): IPageMenuItem[] =>
  screens
    .filter(({ item }) => !!item.anchor)
    .map(({ item }) => ({ label: item.name, href: `#${slugify(item.name)}` }));

export default async function SlugPage({
  params,
}: {
  params: { slug: string[] };
}) {
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
