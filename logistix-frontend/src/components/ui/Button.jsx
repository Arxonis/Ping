import { Button as MuiButton } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Button = styled(MuiButton)(({ theme }) => ({
  borderRadius: 32,
  paddingBlock: theme.spacing(1.6),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  width: "100%",
  maxWidth: 340,
  transition: "transform .2s, box-shadow .2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px -6px rgba(13,110,253,.45)",
  },
}));
