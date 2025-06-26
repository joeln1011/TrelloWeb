export const FIELD_REQUIRED_MESSAGE = "This field is required";
export const EMAIL_RULE = /^\S+@\S+\.\S+$/;
export const EMAIL_RULE_MESSAGE = "Email is not valid";
export const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,256}$/;
export const PASSWORD_RULE_MESSAGE =
  "Password must be at least 8 characters long and contain at least one letter and one number";
export const PASSWORD_CONFIRMATION_MESSAGE = "Passwords do not match";
export const LIMIT_COMMON_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOW_COMMON_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return "File cannot be blank.";
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return "Maximum file size is 10MB.";
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return "File type is not supported. Only accepted types are: png, jpg, jpeg.";
  }
  return null;
};
