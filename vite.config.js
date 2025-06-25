import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  define: {
    // eslint-disable-next-line no-undef
    "process.env": process.env,
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
});
