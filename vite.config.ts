import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // HashRouter means this only affects asset URLs, not routing. Defaults to
  // root ("/") for a custom-domain deployment; set VITE_BASE_PATH to
  // "/maxie-apps-homepage/" (repo name) if serving from a project Pages URL
  // instead of a custom domain.
  base: process.env.VITE_BASE_PATH || "/",
});
