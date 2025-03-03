import Chip from "@mui/joy/Chip";
import { styled } from "@mui/joy/styles";
import { theme } from "@investigativedata/style";

export const Tag = styled(Chip)({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.common.black,
});
