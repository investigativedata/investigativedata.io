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
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={{ xs: 2, sm: 8 }}
            textAlign={{ xs: "center", sm: "inherit" }}
          >
            <Typography level="body-sm">
              <Link href="/contact">Contact & Legal Notice</Link>
            </Typography>
            <Typography level="body-sm">
              <Link href="/legal">Legal Documents</Link>
            </Typography>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={{ xs: 0, sm: 1 }}
            textAlign={{ xs: "center", sm: "inherit" }}
          >
            <Typography level="body-sm">
              <strong>investigraph</strong> was funded by{" "}
              <Link href="https://www.media-lab.de/en/offering/media-tech-lab/">
                Media Tech Lab Bayern
              </Link>
            </Typography>
            <Typography level="body-sm">
              <strong>Secure Research Hub</strong> was funded by{" "}
              <Link href="https://www.miz-babelsberg.de/">MIZ Babelsberg</Link>
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
