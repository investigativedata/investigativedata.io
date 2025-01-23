import type { Metadata } from "next";
import Page from "@/components/Page";
import { DEFAULT_TITLE, PREVIEW } from "@/config";
import { getMenuPages, getPage } from "@/lib/directus";

type IParams = {
  readonly slug?: string[];
};

export async function generateMetadata(
  props: {
    params: Promise<IParams>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const data = await getPage(params.slug || ["index"]);
  return {
    title: `${data.title} – ${DEFAULT_TITLE}`,
    description: data.description,
  };
}

export default async function Home() {
  const data = await getPage(["index"]);
  const menu = await getMenuPages();
  return (
    <Page showSection={false} menu={menu} data={data} previewMode={PREVIEW} />
  );
}
