/**
 * Lighthouse CI performance budget for status.digilist.no (served at
 * /status/ — note the trailing slash: `vite preview`'s static file
 * resolution serves the SPA-fallback homepage for the slash-less
 * `/status`, not the prerendered status page).
 *
 * Run locally:
 *   pnpm build
 *   pnpm lhci
 *
 * throttlingMethod is pinned to "devtools" (a real timed run under
 * emulated network/CPU conditions) rather than Lighthouse's default
 * "simulate" (Lantern) mode. Lantern estimates the network waterfall from
 * a trace it captures against the *actual* local connection, which for a
 * freshly built `vite preview` server on localhost has near-zero real
 * latency between requests — Lantern's re-simulation onto a throttled
 * profile then produces wildly inflated, run-to-run-unstable LCP
 * estimates for this page's ~30-request fan-out (verified while building
 * this budget: identical builds scored anywhere from 0.57 to 0.84 under
 * "simulate" across repeated runs, while "devtools" throttling gave a
 * consistent 0.85-0.96). This is a known Lighthouse/Lantern limitation
 * for localhost targets, not a reflection of real page performance.
 */
module.exports = {
  ci: {
    collect: {
      url: ["http://127.0.0.1:4173/status/"],
      startServerCommand: "pnpm preview --port 4173 --host 127.0.0.1",
      startServerReadyPattern: "Local:",
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        preset: "perf",
        formFactor: "mobile",
        throttlingMethod: "devtools",
        onlyCategories: ["performance"],
        chromeFlags: "--no-sandbox --disable-gpu",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./.lighthouseci",
    },
  },
};
