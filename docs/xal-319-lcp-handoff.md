# XAL-319 handoff — closing the LCP acceptance criterion

PR #106 fixes the one real gap this repo's build can affect (missing cache
headers on static assets) and confirms the `/status` LCP element is text,
not an image — but it does **not** reproduce or explain the ticket's
reported field number (LCP 3.57s). Do not close XAL-319 on this PR alone;
the work below is what's still needed.

## What's confirmed

- **Local build**: Lighthouse (mobile, devtools throttling) against a
  locally-built and statically-served copy of this branch measures LCP
  ~0.9s. The LCP element is the intro paragraph under the H1, both of
  which render from prerendered HTML + inlined critical CSS before any JS
  runs.
- **Currently live `https://status.digilist.no/status/`**: an independent
  Lighthouse run (same method, run from this environment) against the
  live URL measured LCP ~1.2s, CLS 0.001, 0 assets flagged by
  `uses-long-cache-ttl`. Raw output is pasted in the PR body.

## What's NOT confirmed — and why this doesn't close the ticket

- **The 1.2s prod number does not validate this PR's changes.** The live
  page's HTML references font-family names (`Public Sans`, `JetBrains
  Mono`, `Fraunces`) that don't match this branch's self-hosted font
  system (`Inter`, `IBM Plex Mono`, `Newsreader` — see `src/fonts.css`),
  and the live HTML has zero `.woff2` references at all. That means
  production is currently serving an **older build** than this branch,
  possibly older than the critical-CSS-inlining fix this PR's write-up
  assumes is already live. The 1.2s measurement reflects whatever's
  deployed today, not this PR's code or even necessarily current `main`.
- **The reported 3.57s has never been reproduced**, on any build, from
  this environment or otherwise. It may be a stale measurement, a
  real-user-monitoring/field number (CrUX-style, which differs from a
  synthetic Lighthouse run by construction), or specific to a network
  condition (e.g. actual end-user geography/TTFB to the Hostinger VPS)
  that a synthetic run from wherever this agent runs can't reproduce.
- **This repo's build has no way to measure real end-user LCP.** There's
  no RUM/field-data collection wired up for `/status` (or anywhere else
  in this codebase, as far as this investigation found).

## Follow-up work to actually close XAL-319

1. After a maintainer deploys the current `main` (or this branch, once
   merged) to the VPS, re-run Lighthouse against
   `https://status.digilist.no/status/` and confirm the font-family names
   in the served HTML match `src/fonts.css` (i.e. the live page is
   actually running the code being measured).
2. Apply `server/nginx.snippet.conf` on the VPS (manual step — see the
   file header) and re-verify with `curl -I` per the PR's evidence
   section, so the cache-header fix is confirmed on the real serving path
   rather than assumed from the local build.
3. Pull the field LCP number for `/status` from a real-user-monitoring
   source (e.g. Chrome UX Report / PageSpeed Insights "Field Data" tab
   for `status.digilist.no`, or whatever RUM tool the org uses) to
   compare against the ticket's reported 3.57s. A synthetic Lighthouse
   run — local or against prod — is not evidence for or against a
   field-reported metric.
4. If the field number is still above 2.5s after step 1–2 land, the gap
   is outside this repo (VPS network path, DNS, TLS handshake cost, etc.)
   and needs its own investigation — not a page-level fix.

Only once step 3 shows a field LCP under 2.5s (or explains why the
reported number was stale) should XAL-319 be closed as resolved.
