import WarningIcon from "@mui/icons-material/Warning";
import Alert from "@mui/joy/Alert";
import Typography from "@mui/joy/Typography";

export default function PreviewAlert() {
  return (
    <Alert
      sx={{
        alignItems: "flex-start",
        zIndex: 1001,
        position: "fixed",
        width: "100%",
        height: "40px",
      }}
      startDecorator={<WarningIcon />}
      variant="soft"
      color="primary"
    >
      <div>
        <Typography level="body-sm" color="primary">
          <strong>Preview</strong> This is a development preview version of our
          website. Content may be inaccurate. Please visit our official page{" "}
          <a href="https://investigativedata.io">investigativedata.io</a>
        </Typography>
      </div>
    </Alert>
  );
}
