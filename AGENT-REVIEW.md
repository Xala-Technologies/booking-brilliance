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
