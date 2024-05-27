import Page from "@/components/Page";
import { PREVIEW } from "@/config";
import { getMenuPages, getPage } from "@/lib/directus";

export default async function Home() {
  const data = await getPage(["index"]);
  const menu = await getMenuPages();
  return (
    <Page showSection={false} menu={menu} data={data} previewMode={PREVIEW} />
  );
}
