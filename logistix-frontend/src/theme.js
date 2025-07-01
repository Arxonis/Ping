// src/theme.js
import { alpha, createTheme } from "@mui/material/styles";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: "#0d6efd",
      light: "#d3e6ff",
      dark: "#084bcc",
    },
    background: {
      default: mode === "light" ? "#f6f8fb" : "#121212",
      paper: mode === "light" ? "#ffffff" : "#1e1e1e",
    },
    text: {
      primary: mode === "light" ? "#213547" : "#e0e0e0",
      secondary: mode === "light" ? "#64748b" : "#a0aec0",
    },
    divider: mode === "light" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)",
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { borderRadius: 0 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRadius: 0 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
          // En mode clair : zébrures très légères
          "&:nth-of-type(odd)": {
            backgroundColor:
              theme.palette.mode === "light"
                ? alpha(theme.palette.primary.light, 0.1)
                : "transparent",
          },
          // En mode sombre : plus aucune zébrure
          ...(theme.palette.mode === "dark" && {
            "&:nth-of-type(odd)": { backgroundColor: "transparent" },
          }),
        }),
      },
    },
  },
});

export const lightTheme = createTheme(getDesignTokens("light"));
export const darkTheme = createTheme(getDesignTokens("dark"));
export default lightTheme;