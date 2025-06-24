import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "~/App.jsx";
import theme from "~/theme.js";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import { ConfirmProvider } from "material-ui-confirm";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <ConfirmProvider
        defaultOptions={{
          allowClose: false,
          dialogProps: { maxWidth: "xs" },
          cancellationButtonProps: { color: "inherit" },
          confirmationButtonProps: { color: "success", variant: "outlined" },
        }}
      >
        <CssBaseline />
        <App />
        <ToastContainer position="bottom-left" theme="colored" />
      </ConfirmProvider>
    </ThemeProvider>
  </StrictMode>
);
