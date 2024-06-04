import { ICardItem } from "@/lib/types";
import { Button } from "@mui/joy";
import { Card } from "@investigativedata/style";
import { getFileUrl } from "@/lib/directus";

export default function StyledCard({
  renderedContent,
  actionHref,
  actionLabel,
  icon,
  title,
}: ICardItem) {
  const action =
    actionHref && actionLabel ? (
      <Button component="a" href={actionHref}>
        {actionLabel}
      </Button>
    ) : null;
  return (
    <Card action={action} title={title} icon={icon && getFileUrl(icon)}>
      <span>{renderedContent}</span>
    </Card>
  );
}
