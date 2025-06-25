let apiRoot = "";
// eslint-disable-next-line no-undef
if (process.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8017";
}
// eslint-disable-next-line no-undef
if (process.env.BUILD_MODE === "production") {
  apiRoot = "https://trelloapi-512x.onrender.com";
}

export const API_ROOT = apiRoot;
