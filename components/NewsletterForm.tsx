import { useContext } from "react";
import { INewsletterItem } from "@/lib/types";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import { BACKGROUNDS, BLACK, PageContext } from "@investigativedata/style";

export default function NewsletterForm({
  action,
  listUid,
}: React.PropsWithChildren<INewsletterItem>) {
  const { currentColor } = useContext(PageContext);
  return (
    <form action={action} method="post">
      <Stack
        spacing={1}
        direction="row"
        // justifyContent="space-between"
        alignSelf="center"
        sx={{ w: "100%" }}
      >
        <Input placeholder="email@example.org" required name="email" />
        <input type="hidden" name="l" value={listUid} />
        <Button
          color="success"
          type="submit"
          sx={{
            color: BACKGROUNDS[currentColor],
            backgroundColor: BLACK,
            "&:hover": {
              backgroundColor: BLACK,
            },
            "&:active": (theme) => ({
              backgroundColor: theme.colorSchemes.dark.palette.text,
            }),
          }}
        >
          Subscribe
        </Button>
      </Stack>
    </form>
  );
}
