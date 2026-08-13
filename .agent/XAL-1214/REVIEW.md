# XAL-1214 — Review

## Round 1 (lens: CORRECTNESS)

**What this lens checked:** whether the delivered change (currently just
`.agent/XAL-1214/SPEC.md`, per `git diff origin/main...HEAD --stat`) actually
does what the acceptance criteria say — including on edge cases — by
independently re-deriving every factual claim in SPEC.md from the code and
from a live run, rather than trusting the write-up.

**What it did, concretely:**
- Read `src/lib/i18n.ts` in full (`browserLanguages`, `preferredLocale`,
  `TRANSLATED_PATHS`, `shouldAutoRedirect`, `shouldOfferSwitch`) and confirmed
  every quoted behaviour and doc-comment claim in SPEC.md against the actual
  source — line numbers, guard conditions (`window` vs `navigator`), and the
  homepage-only (`path !== "/" && path !== "/en"`) restriction all match.
- Read `src/components/LocaleRouter.tsx` end to end and confirmed it mounts
  once (checked `src/App.tsx:523`), redirects via `navigate(..., {replace:
  true})` only when `shouldAutoRedirect` returns non-null, and otherwise shows
  the dismissible switch-banner — matches SPEC.md's description exactly.
- Grepped `src/components/Navbar.tsx` and confirmed the nav array has
  `{ label: "Blogg", to: "/blogg" }` for Norwegian and `{ label: "Blog", to:
  "/en/blog" }` for English, keyed off `localeFromPath(location.pathname)` —
  URL-derived, not browser-derived, as claimed.
- Confirmed `src/lib/i18n.test.ts:120` has the named
  `shouldAutoRedirect — a visitor in the UK gets English` test asserting
  exactly the `{pathname:"/", preferred:"en", stored:null} → "/en"` case SPEC
  cites.
- Inspected the fleet's `playwright.config.ts` — no `locale` override on any
  project, all use `devices["Desktop Chrome"]` verbatim, so Playwright's
  default `navigator.language = "en-US"` applies, as SPEC claims.
- **Re-ran the actual failing test live**: `cd
  /root/xaheen-agent-fleet/tools/e2e-agent && npx playwright test
  --project=regression -g "home page loads with an h1 and primary
  navigation"` against `https://digilist.no` — reproduced the exact reported
  error. The saved `error-context.md` snapshot shows the rendered page is
  `/en` with `navigation "Main navigation"` containing `link "Blog": /url:
  /en/blog` and no "Blogg" text anywhere — a byte-for-byte match of SPEC's
  reproduction table.
- Checked `visitPublicPage`/`trackPageHealth` in the fleet's
  `helpers/page-health.ts`: it already asserts `h1, h2` visible and a clean
  console before the failing line runs, and that assertion passed (only line
  16, the `/blogg/i` link check, failed). So the test's own title ("loads
  with an h1 and primary navigation") is misleading — the h1 half is fine;
  only the nav-link-text half fails. SPEC's narrower framing ("blog-link
  failure", not "missing h1/nav") is the accurate one, not the ticket title.
- Confirmed `pnpm e2e:test` does not exist in `package.json` (no `"e2e` key),
  consistent with SPEC directing reproduction at the fleet repo directly.

**Finding:** SPEC.md's technical diagnosis is fully correct — every claim
independently re-verified against source and a live reproduction, no
discrepancies found. This is not a code defect in this repository.

**Finding (process/acceptance-criteria gap):** the task's acceptance criteria
say "run full test/build and open a PR." No PR exists for this branch (`gh pr
list --head <branch> --state all` returns empty). Checked precedent for how
this repo handles zero-code-change "not actually a bug" verdicts: PR #218
(`chore(XAL-956): confirm barnebursdag lokale content already live`, also a
no-source-change finding) was opened and then closed, with a body documenting
what was checked, why nothing was fixed, and how it was verified. XAL-1214 is
the same shape of ticket and has no matching PR — this is a real gap against
both the explicit task instruction and the established project convention,
not a nitpick.

**Fixed this round:** opened a PR for this branch with a body modeled on the
#218 precedent (what was checked, why no code changes, proof of
reproduction), so the finding is on record and closeable the same way.
