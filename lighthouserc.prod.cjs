/**
 * Lighthouse CI performance budget for the live status page, run nightly
 * against production (https://digilist.no/status/) rather than as a
 * per-PR gate.
 *
 * Why nightly-against-prod instead of blocking every PR: a locally/CI-tuned
 * median threshold on a `vite preview` build goes red on unrelated PRs
 * whenever a shared runner has a busy day — the perf number moves with
 * runner load, not with the diff being reviewed. Running against the real
 * deployed site on a schedule measures what users actually get, decoupled
 * from any single PR's CI run, and can assert the actual XAL-320 target
 * (0.90) instead of a threshold padded for runner noise. See
 * `lighthouserc.cjs` for the per-PR build (no live-network budget there
 * anymore) and the PR history on XAL-320 for the runner-variance evidence
 * that motivated this split.
 *
 * Run locally:
 *   pnpm exec lhci autorun --config=lighthouserc.prod.cjs
 */
module.exports = {
  ci: {
    collect: {
      url: ["https://digilist.no/status/"],
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
