import { IProjectItem } from "@/lib/types";
import Image from "next/image";
import { AspectRatio } from "@mui/joy";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { styled } from "@mui/joy/styles";
import { Card, theme } from "@investigativedata/style";
import { getFileUrl } from "@/lib/directus";

const Tag = styled(Chip)({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.common.black,
});

export default function Project(props: React.PropsWithChildren<IProjectItem>) {
  const action = (
    <>
      {props.caseStudyUrl && (
        <Button
          color="primary"
          component="a"
          href={props.caseStudyUrl}
          size="md"
        >
          Read our case study
        </Button>
      )}
      <Button component="a" href={props.url} size="md">
        View project
      </Button>
    </>
  );

  return (
    <Card action={action} sx={{ alignItems: "start" }}>
      <Stack direction="row" flexWrap="wrap" gap={1} paddingBottom={1}>
        {props.tags.map((t) => (
          <Tag key={t} variant="solid" size="sm">
            {t}
          </Tag>
        ))}
        {props.date_published && (
          <Chip
            sx={{ alignSelf: "flex-end" }}
            variant="outlined"
            color="primary"
            size="sm"
          >
            {new Date(props.date_published).toLocaleDateString()}
          </Chip>
        )}
      </Stack>
      <Stack gap={1}>
        <AspectRatio sx={{ maxWidth: "100%" }}>
          <Image
            src={getFileUrl(props.image)}
            fill={true}
            alt={`Screenshot of project ${props.title}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AspectRatio>
        <Typography paddingTop={1} level="h3">
          {props.partner}
        </Typography>
        <Typography level="h2">{props.title}</Typography>
        <article>{props.renderedDescription}</article>
      </Stack>
    </Card>
  );
}
