import { INewsletterItem } from "@/lib/types";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";

export default function NewsletterForm({
  action,
  listUid,
}: React.PropsWithChildren<INewsletterItem>) {
  return (
    <form action={action} method="post">
      <Stack
        spacing={1}
        direction="row"
        justifyContent="space-between"
        alignSelf="center"
        sx={{ w: "100%" }}
      >
        <Input placeholder="email@example.org" required name="email" />
        <input type="hidden" name="l" value={listUid} />
        <Button color="success" type="submit">
          Subscribe
        </Button>
      </Stack>
    </form>
  );
}
