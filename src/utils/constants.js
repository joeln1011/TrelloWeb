let apiRoot = "";
const buildMode = import.meta.env?.BUILD_MODE || "dev";

if (buildMode === "dev") {
  apiRoot = "http://localhost:8017";
}
if (buildMode === "production") {
  apiRoot = "https://trelloapi-512x.onrender.com";
}

export const API_ROOT = apiRoot;
  