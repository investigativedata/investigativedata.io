import React from "react";
import { TContent } from "@/lib/types";
import Image from "next/image";
import AspectRatio from "@mui/joy/AspectRatio";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { Hero } from "@investigativedata/style";
import { getFileUrl } from "@/lib/directus";
import Card from "./Card";
import Project from "./Project";

export default function Content(data: TContent): React.ReactNode {
  if (data.collection === "heroes") {
    let action;
    if (!!data.item.mediaSrc) {
      data.item.mediaSrc = getFileUrl(data.item.mediaSrc);
    }
    if (!!data.item.actionLabel && !!data.item.actionHref) {
      action = (
        <Button
          component="a"
          href={data.item.actionHref}
          sx={{
            backgroundColor: "inherit",
            "&:hover": {
              backgroundColor: "inherit",
            },
            "&:active": (theme) => ({
              backgroundColor: theme.colorSchemes.dark.palette.text,
            }),
          }}
        >
          {data.item.actionLabel}
        </Button>
      );
    }
    return (
      // @ts-ignore
      <Hero {...data.item} action={action} teaser={data.item.renderedTeaser} />
    );
  }
  if (data.collection === "mdx")
    return <Stack gap={2}>{data.item.renderedContent}</Stack>;
  if (data.collection === "typography") {
    if (data.item.dangerouslySetInnerHtml && data.item.children) {
      const { children, ...props } = data.item;
      return (
        <Typography {...props}>
          <span dangerouslySetInnerHTML={{ __html: children }} />
        </Typography>
      );
    }
    return <Typography {...data.item} />;
  }
  if (data.collection === "images")
    return (
      <Stack>
        <AspectRatio
          sx={{
            width: data.item.width || "100%",
            alignSelf: data.item.position,
          }}
          variant={data.item.shadow ? "outlined" : "plain"}
          ratio={data.item.ratio}
        >
          <Image
            fill={true}
            src={getFileUrl(data.item.src)}
            alt={data.item.alt}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AspectRatio>
        {data.item.renderedDescription && (
          <span style={{ paddingTop: 16 }}>
            {data.item.renderedDescription}
          </span>
        )}
      </Stack>
    );
  if (data.collection === "projects") return <Project {...data.item} />;
  if (data.collection === "cards") return <Card {...data.item} />;
}
