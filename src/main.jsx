import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "~/App.jsx";
import theme from "~/theme.js";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <ToastContainer position="bottom-left" theme="colored" />
    </ThemeProvider>
  </StrictMode>
);
