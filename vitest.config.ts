import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { blogMetaPlugin } from "./build-plugins/blogMetaPlugin";

export default defineConfig({
  plugins: [react(), blogMetaPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    // infra/ is in here because nothing else checks it: it is shell and nginx
    // config, which neither tsc nor eslint reads, so a broken deploy script or
    // a CSP that blocks the site's own search would ship green (XAL-1010).
    //
    // `server/` is plain ESM with no dependencies, because it is deployed to
    // the VPS as loose files run by bare `node` — no build, no node_modules, no
    // tsx. It still gets tested here rather than nowhere.
    include: [
      "src/**/*.test.{ts,tsx}",
      "infra/**/*.test.ts",
      "server/**/*.test.mjs",
    ],
    // SSR tests (entry-server.*.test.tsx) render the full route tree, which
    // re-globs src/content/blog/*.md on every call. The blog corpus keeps
    // growing (new post = new file), so wall-clock render time drifts up
    // over time — vitest's 5s default started flaking under full-suite
    // parallel load well before any single render was actually hung.
    testTimeout: 20000,
  },
});
