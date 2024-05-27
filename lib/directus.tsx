import { authentication, createDirectus, readItems, rest } from "@directus/sdk";
import { IPage, IPageBase, TContent } from "@/lib/types";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Typography from "@mui/joy/Typography";
import {
  DIRECTUS_API_TOKEN,
  DIRECTUS_DEFAULT_PAGE_FILTER,
  DIRECTUS_URL,
} from "@/config";
import MDX_COMPONENTS from "./markdown";

const directus = createDirectus(DIRECTUS_URL)
  .with(rest())
  .with(authentication());
directus.setToken(DIRECTUS_API_TOKEN);

export default directus;

export function getFileUrl(fileId: string): string {
  if (fileId.indexOf("http") > -1) return fileId;
  return `${DIRECTUS_URL}/assets/${fileId}`;
}

const cleanProps = (props: TContent): TContent => {
  const {
    status,
    user_created,
    user_updated,
    date_created,
    date_updated,
    ...item
  } = props.item;
  // @ts-ignore
  return { ...props, item };
};

function serializeMdx(child: TContent): TContent {
  const { collection, item } = cleanProps(child);
  if (collection === "mdx" && item.content) {
    item.renderedContent = (
      <MDXRemote source={item.content} components={MDX_COMPONENTS} />
    );
  }
  if (collection === "heroes" && item.teaser) {
    item.renderedTeaser = (
      <MDXRemote
        source={item.teaser.toString()}
        components={{
          ...MDX_COMPONENTS,
          p: (props: React.PropsWithChildren) => <span>{props.children}</span>,
        }}
      />
    );
  }
  if (collection === "projects" && item.description) {
    item.renderedDescription = (
      <MDXRemote
        source={item.description}
        components={{
          ...MDX_COMPONENTS,
          p: (props: React.PropsWithChildren) => (
            <Typography level="body-md">{props.children}</Typography>
          ),
        }}
      />
    );
  }
  if (collection === "images" && item.description) {
    item.renderedDescription = (
      <MDXRemote
        source={item.description}
        components={{
          ...MDX_COMPONENTS,
          p: (props: React.PropsWithChildren) => (
            <Typography level="body-sm">{props.children}</Typography>
          ),
        }}
      />
    );
  }
  // @ts-ignore
  return { ...child, item, collection };
}

export async function getMenuPages(): Promise<IPageBase[]> {
  return (await directus.request(
    readItems("pages", {
      filter: {
        ...DIRECTUS_DEFAULT_PAGE_FILTER,
        menu: {
          _eq: true,
        },
      },
      fields: ["slug", "title", "description"],
    }),
  )) as IPageBase[];
}

export async function getPages(): Promise<IPageBase[]> {
  return (await directus.request(
    readItems("pages", {
      filter: DIRECTUS_DEFAULT_PAGE_FILTER,
      fields: ["slug", "title", "description"],
    }),
  )) as IPageBase[];
}

export async function getPage(slug: string[]): Promise<IPage> {
  const pages: IPage[] = (await directus.request(
    readItems("pages", {
      filter: {
        ...DIRECTUS_DEFAULT_PAGE_FILTER,
        slug: {
          _eq: slug.join("/"),
        },
      },
      fields: [
        "*",
        {
          screens: [
            "collection",
            "item.id",
            "item.name",
            "item.anchor",
            "item.background",
            "item.backgroundImage",
            "item.content",
            "item.content.collection",
            "item.content.item.*",
            "item.maxWidth",
            "item.fullHeight",
          ],
        },
      ],
    }),
  )) as IPage[];
  if (pages.length === 1) {
    const page = pages[0];
    for (const screen of page.screens) {
      if (screen.item.content) {
        screen.item.content = screen.item.content.map(serializeMdx);
      }
    }
    return page;
  }
  notFound();
}
