"use client";

import { IArticle, IPageBase } from "@/lib/types";
import Image from "next/image";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { MediaScreen, Screen, SectionHeader } from "@investigativedata/style";
import { getFileUrl } from "@/lib/directus";
import Content from "./Content";
import { PageLayout } from "./Page";
import { Tag } from "./common";

export default function Article({
  data,
  menu,
  previewMode,
}: {
  data: IArticle;
  menu: IPageBase[];
  previewMode?: boolean;
}): React.ReactNode {
  return (
    <PageLayout title="Blog" menu={menu} previewMode={previewMode}>
      {data.articleImage && (
        <MediaScreen>
          <Image
            fill
            src={getFileUrl(data.articleImage.backgroundImage)}
            alt=""
          />
        </MediaScreen>
      )}
      <Screen maxWidth="md">
        <Stack direction="row" flexWrap="wrap" gap={1} paddingBottom={1}>
          {data.tags?.map((t) => (
            <Tag key={t} variant="solid" size="sm">
              {t}
            </Tag>
          ))}
        </Stack>
        <SectionHeader title={data.title} tagLine={data.subtitle} />
        {data.teaser && <Typography fontWeight={700}>{data.teaser}</Typography>}
        <Typography level="body-md" paddingBottom={8}>
          Published at {new Date(data.published_at).toLocaleString()}
        </Typography>
        {data.content?.map((c) => <Content key={c.item.id} {...c} />)}
      </Screen>
    </PageLayout>
  );
}
