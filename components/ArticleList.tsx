"use client";

import { IArticleBase, IPageBase } from "@/lib/types";
import Button from "@mui/joy/Button";
import { Hero, Screen } from "@investigativedata/style";
import { PageLayout } from "@/components/Page";
import { PREVIEW } from "@/config";
import { getFileUrl } from "@/lib/directus";
import { makeSlug } from "@/lib/util";

const ArticleItem = (a: IArticleBase) => {
  const href = makeSlug(a).join("/");
  const action = (
    <Button component="a" href={href}>
      Read
    </Button>
  );
  return (
    <Hero
      key={a.id}
      title={a.titleShort || a.title}
      teaser={a.teaserShort || a.teaser}
      tagLine={new Date(a.published_at).toLocaleString()}
      action={action}
      mediaSrc={getFileUrl(a.heroImage.src)}
      mediaRatio={a.heroImage.ratio}
      mediaBorder={a.heroImage.shadow}
      marginBottom="none"
    />
  );
};

export default function ArticleList({
  articles,
  menu,
}: {
  articles: IArticleBase[];
  menu: IPageBase[];
}) {
  return (
    <PageLayout title="Blog" menu={menu} previewMode={PREVIEW}>
      <Screen maxWidth="lg">
        {articles.map((a) => (
          <ArticleItem key={a.id} {...a} />
        ))}
      </Screen>
    </PageLayout>
  );
}
