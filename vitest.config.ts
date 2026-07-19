import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Separate from vite.config.ts (which is dev/build-server specific) so
// `vitest` doesn't need to spin up the dev proxy. Runs in the "node"
// environment, matching how scripts/prerender.mjs actually executes
// entry-server.tsx at build time — no jsdom, no browser globals.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
  },
});
