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

  const Content = (
    <>
      <Stack direction="row" gap={1}>
        {props.tags.map((t) => (
          <Tag key={t} variant="solid" size="sm">
            {t}
          </Tag>
        ))}
      </Stack>
      <Stack gap={1}>
        <AspectRatio>
          <Image
            src={getFileUrl(props.image)}
            fill={true}
            alt={`Screenshot of project ${props.title}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AspectRatio>
        <Typography level="h3">{props.partner}</Typography>
        <Typography level="h2">{props.title}</Typography>
        <article>{props.renderedDescription}</article>
      </Stack>
    </>
  );

  return props.caseStudy ? (
    <Card action={action} sx={{ alignItems: "start" }}>
      {Content}
    </Card>
  ) : (
    <Stack gap={2} sx={{ alignItems: "start" }}>
      {Content}
      {action}
    </Stack>
  );
}
