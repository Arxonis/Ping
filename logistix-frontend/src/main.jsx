// src/main.jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import ColorModeProvider from "./context/ColorModeContext";

const qc = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <ColorModeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ColorModeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
