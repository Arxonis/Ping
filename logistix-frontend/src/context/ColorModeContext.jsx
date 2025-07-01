// src/context/ColorModeContext.jsx
import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { createContext, useMemo, useState } from "react";
import { darkTheme, lightTheme } from "../theme";

export const ColorModeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
});

export default function ColorModeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
