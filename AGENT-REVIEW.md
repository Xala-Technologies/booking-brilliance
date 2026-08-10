# XAL-1166: Deep review log

Change under review: `src/components/ThemedVideo.tsx:65` `preload="auto"` →
`preload="metadata"`, plus `src/components/ThemedVideo.test.tsx` (new) and
`AGENT-SPEC.md`. Diff taken against `origin/main...HEAD`.

Note on this file: it previously contained the review log for XAL-1151 (a
different, already-merged ticket — `adaa250`/#239 on `main`), carried over
unchanged by the `Merge remote-tracking branch 'origin/main'` commit on this
branch. That content didn't pertain to this diff, so it has been replaced
here rather than appended to, to avoid mixing two unrelated tickets' review
logs in one file.

## Round 1 — correctness

Lens: does the diff do what the four acceptance criteria in `AGENT-GOAL.md`
say, including edge cases — not a style/security/scope pass (those are
later rounds).

**Criterion 1 (single-line attribute change, no other ThemedVideo behavior
change)** — verified true for `ThemedVideo.tsx` itself: the diff to that
file is exactly the one `preload` attribute. But `AGENT-SPEC.md`'s own "WHAT
CHANGES" section asserted "One attribute, one line" / "no ... caller
change" while the actual `git diff origin/main...HEAD` also touched
`pnpm-workspace.yaml`, adding a repo-wide `allowBuilds` block
(`@swc/core`, `better-sqlite3`, `esbuild`, `sharp`) — undocumented anywhere
in the spec, unrelated to the ticket (it's a `pnpm approve-builds`
convenience for fresh checkouts, not something this ticket asked for), and
a real scope violation of `AGENT-GOAL.md`'s "smallest valid change ...
no hidden dependency" delivery rule. It doesn't affect `ThemedVideo`
directly, but it's a security-adjacent change (it blanket-trusts native
postinstall scripts for the whole workspace) that has no business riding
along with a one-line Lighthouse fix.

**Criterion 2 (Lighthouse trace, devtools-throttled, before/after
Performance score)** — the trace itself used the correct mode
(`--throttling-method=devtools`, matching PR #107's finding that simulate
mode is noisy on this VPS). Not yet recorded in an actual PR description
since no PR exists yet at this stage — expected, not a defect of the code.

**Criterion 3 (H1 stays the LCP element; CLS does not regress from its
current ~0.001-0.101 range)** — the H1-stays-LCP half holds up: both
before/after `PerformanceObserver` readings in `AGENT-SPEC.md` show the
`<h1>` as the LCP element, consistent with `HeroSection.tsx:76-79` and
`docs/xal-316-lcp-handoff.md`. The CLS half did not hold up as originally
written. I reproduced the measurement myself (`npx lighthouse` against the
current `dist/` build already running on `localhost:4173`, same
`--throttling-method=devtools` flag, `CHROME_PATH` pointed at the cached
puppeteer Chrome): CLS = 0.159, matching `AGENT-SPEC.md`'s reported
0.155-0.16. That number is real, not fabricated — but it is 15-160x
`docs/xal-316-lcp-handoff.md`'s documented baseline for this identical VPS
and methodology (CLS 0.001-0.010, median 0.001) and outside the ticket's
own "current ~0.001-0.101" framing. `AGENT-SPEC.md` had asserted this was
"the pre-existing ~0.155-0.16 baseline" — a baseline that is not documented
anywhere in the repo. I pulled the Lighthouse `layout-shifts` audit to check
the underlying claim ("an unrelated CTA-button layout shift, not the video
or the H1"): ~88% of the 0.159 (0.1407) does come from the CTA-button row
shifting, confirming "not the video." But the H1 itself also appears in the
shift list (~0.024, from the rotating first word changing width), so "not
the H1" was not quite accurate either. Since this reproduces identically
regardless of the `preload` value (both sides of `AGENT-SPEC.md`'s
before/after table show ~0.155-0.16), it predates and is unrelated to this
one-line change — not something this narrow ticket should fix — but writing
it off as an established "baseline" without evidence understated a real,
live discrepancy against XAL-316's own numbers.

**Criterion 4 (all existing tests pass)** — confirmed: `npx vitest run` →
17 files / 36 tests green, `npx tsc --noEmit` clean, both re-verified after
this round's fixes.

### What I changed after round 1
- Reverted `pnpm-workspace.yaml` to `origin/main`'s version, removing the
  undocumented `allowBuilds` block — out of scope for this ticket, not
  mentioned in `AGENT-SPEC.md`'s stated "one attribute, one line" change.
- Reworded `AGENT-SPEC.md`'s CLS paragraph to state plainly that 0.155-0.16
  is unexplained against the documented XAL-316 baseline (0.001-0.010)
  rather than asserting it as a known "pre-existing baseline," to correct
  the CTA-button-only claim with the H1's smaller contribution, and to flag
  it as a follow-up-ticket candidate rather than resolved.
- Re-ran `npx vitest run` (17 files / 36 tests, all green) and
  `npx tsc --noEmit` (clean) after both edits.

## Round 2 — regression

Lens: what ELSE reads this code path — not just the two files this branch
edited — and did anything depend on the old `preload="auto"` behavior?
Grepped every consumer of `ThemedVideo`, `HeroSection`, `preload`, and the
hero video's own asset paths across the repo (not just `src/`), re-read the
component for event listeners or ref reads that could assume eager-loaded
video state, and checked whether the hero's layout depends on the video's
intrinsic dimensions.

**`ThemedVideo` has exactly one caller** — `grep -rn "ThemedVideo" --include
"*.ts" --include "*.tsx" src/` returns only `HeroSection.tsx:11` (import)
and `HeroSection.tsx:183` (JSX call), plus the new test file. No other
component instantiates it, so there is no second call site that could have
relied on the old `preload="auto"` value.

**`HeroSection` has exactly one caller** — only `src/pages/Index.tsx:92`
renders `<HeroSection />`, on the `/` route. No other page pulls in this
video, so the blast radius is confirmed single-route, matching
`AGENT-SPEC.md`'s claim.

**No sibling component was touched or needed to be** — `VideoPlaceholder.tsx`
(used by `Leie.tsx`, `Billettsystem.tsx`, `MarketplaceHub.tsx`,
`UseCasePage.tsx`) also sets `preload: "auto"` on an autoplaying video, but
it is a distinct, unrelated component on different routes — not a second
instance of the code this ticket targets, and the ticket names only
`ThemedVideo.tsx:65`. Confirmed it doesn't import from or share logic with
`ThemedVideo.tsx` (separate file, separate props, no shared helper). Leaving
it untouched is correct scope, not a missed spot.

**No hidden dependency on eager video loading inside `ThemedVideo.tsx`
itself** — re-read the whole component: no `ref` on the `<video>`, no
`loadeddata`/`canplaythrough`/`durationchange` listener, nothing reads
`video.readyState` or `video.duration`. The only state is the `mounted`
flag driving the light/dark variant swap, which is independent of how much
of the media has downloaded. So there's no code path that silently assumed
`preload="auto"`'s eager fetch to become "ready" sooner.

**No CLS regression path via lost intrinsic dimensions** — the concern
worth checking: does `preload="metadata"` (vs `"auto"`) delay when the
browser knows the video's width/height, and could that reflow the hero
layout? No — `HeroSection.tsx:183` passes `style={{ aspectRatio: "16 / 9"
}}` directly on `ThemedVideo`, so the box size is fixed by CSS before any
frame of the video loads, regardless of `preload` value. This independently
confirms round 1's finding that the ~0.155-0.16 CLS reading is unrelated to
this change (CTA row + H1 rotating word, not the video) — there's no
mechanism by which downgrading `preload` could touch layout at all here.

**No build/prerender-time special-casing of the video** — `grep -n
"video\|webm\|mp4"` in `scripts/prerender.mjs` matches nothing but an
unrelated FAQ answer string ("videomøteutstyr"); the prerender script has
no logic keyed off the video's preload attribute or asset paths (unlike the
hero *image*, which does get a build-time `<link rel="preload">` injected —
a different code path, and per the comment at `HeroSection.tsx:76-79` that
one is deliberately left alone by this ticket).

**No test suite, CI config, or e2e harness references the old behavior** —
no Playwright/e2e directory exists in this repo (the real e2e suite lives
in the separate fleet tool per prior confirmed finding), no
`.github` workflow or `lighthouserc` config references `preload` or
`ThemedVideo`, and the only test touching this component is the new
`ThemedVideo.test.tsx` added by this branch itself — so there was no
existing test pinned to `preload="auto"` that this change could have
silently broken (would have shown up as a vitest failure either way, and
`npx vitest run` was re-verified green this round).

### What I changed after round 2
Nothing — this lens found no regression. Re-ran `npx vitest run` (17 files
/ 36 tests, all green) and `npx tsc --noEmit` (clean) to confirm the branch
is still in the same state round 1 left it.

## Round 3 — security

Lens: authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path, or a page. Not correctness
(round 1) or regression (round 2) again — this round asks whether the diff
opens any new attack surface, not whether it works or breaks something
else.

**Full current diff re-confirmed narrow** — `git diff origin/main...HEAD
--stat` shows exactly five files: `AGENT-GOAL.md` (new, agent scaffolding),
`AGENT-REVIEW.md` (this file), `AGENT-SPEC.md`, `src/components/ThemedVideo.test.tsx`
(new), `src/components/ThemedVideo.tsx` (2 lines: 1 changed, 1 unchanged
context). `pnpm-workspace.yaml` — the `allowBuilds` scope-creep round 1
flagged and reverted — stays reverted; `git status --short` is clean, so
nothing round 1/2 fixed has crept back.

**Authz / tenant isolation** — not applicable. `digilist.no` marketing
pages (`Index.tsx` → `HeroSection.tsx` → `ThemedVideo.tsx`) are
unauthenticated, public, single-tenant static/prerendered content; no
session, role, org-scoping, or `app.digilist.no` API call exists anywhere
in this render path. The `preload` attribute is a browser resource hint
with no server round-trip of its own — changing its value can't cross a
tenant boundary that doesn't exist on this page.

**Injection** — checked every value that reaches the DOM through this
diff. `HeroSection.tsx:183-197` passes `ThemedVideo` two `Variant` objects
(`webm`/`mp4`/`poster`) as hardcoded string literals under `/videos/...`
and a hardcoded `ariaLabel` — no template interpolation, no data read from
a URL param, query string, CMS field, or API response. Inside
`ThemedVideo.tsx`, those same literals flow straight into `<source src=...>`
and the `poster`/`aria-label` attributes via JSX (React-escaped, not
`dangerouslySetInnerHTML`, no `href`/`src` built by string concatenation).
The one line this ticket changes, `preload="metadata"`, is a fixed string
literal, not a variable — there is no user-controllable input anywhere on
this component's call path, so there's no injection surface to widen or
close.

**Secrets** — `grep -niE
"api[_-]?key|secret|token|password|authorization|bearer"` across
`AGENT-SPEC.md`, `AGENT-REVIEW.md`, and both `ThemedVideo` files: zero
hits. No `.env`, credential, or infra endpoint appears in any file this
branch touches.

**Paths** — all three asset paths per variant (`webm`, `mp4`, `poster`)
are literal strings under `/videos/`, defined once at the single call site
(`HeroSection.tsx:183-197`) and never constructed from a runtime value, so
there's no path-traversal or open-redirect surface introduced or affected
by this change.

**Dependencies** — no `package.json`/lockfile edit in this diff (confirmed
via the `--stat` above); the `pnpm-workspace.yaml` `allowBuilds` block
round 1 removed (which would have blanket-trusted native postinstall
scripts across the workspace) has not reappeared.

### What I changed after round 3
Nothing — this lens found no security issue. The diff has no auth/tenant
code, no user-supplied value reaching a query/path/page, and no secrets;
`preload="metadata"` is a static attribute on a static, hardcoded resource
list. Re-ran `npx vitest run` (17 files / 36 tests, all green) and `npx tsc
--noEmit` (clean) to confirm the branch is unchanged from round 2's state.
