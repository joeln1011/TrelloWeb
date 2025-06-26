import Alert from "@mui/material/Alert";

// This component displays an error alert for a specific field in a form.
function FieldErrorAlert({ errors, fieldName }) {
  if (!errors || !errors[fieldName]) {
    return null;
  }
  return (
    <Alert
      severity="error"
      sx={{ mt: "0.7em", ".MuiAlert-message": { overflow: "hidden" } }}
    >
      {errors[fieldName]?.message}
    </Alert>
  );
}
export default FieldErrorAlert;
