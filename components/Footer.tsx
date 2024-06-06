import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        pt: "1rem",
        pb: "1rem",
        backgroundColor: "transparent",
        display: "flex",
        position: "absolute",
        bottom: 0,
      }}
    >
      <Container maxWidth="xl" style={{ backgroundColor: "inherit" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Stack direction="row" gap={8}>
            <Typography level="body-sm">
              <Link href="/contact">Contact & Impress</Link>
            </Typography>
            <Typography level="body-sm">
              <Link href="/legal">Legal</Link>
            </Typography>
          </Stack>
          <span>
            <Typography level="body-sm">
              <strong>investigraph</strong> was funded by{" "}
              <Link href="https://www.media-lab.de/en/offering/media-tech-lab/">
                Media Tech Lab Bayern
              </Link>
              , <strong>Secure Research Hub</strong> was funded by{" "}
              <Link href="https://www.miz-babelsberg.de/">MIZ Babelsberg</Link>
            </Typography>
          </span>
        </Stack>
      </Container>
    </Box>
  );
}