# XAL-1086 Review Log

## Round 1

**Lens: correctness — does the diff do what the acceptance criteria say, on edge cases too.**

Read `.agent/XAL-1086/SPEC.md`, then `git diff origin/main...HEAD`, then ran the
tests. Checked against the ticket's acceptance criteria: Norwegian Bokmål
post targeting "arrangement" search intent, covering arrangører renting
specialized eventlokaler for underholdning/kulturelle arrangement as a
private, high-engagement segment.

Checks performed:
- Frontmatter parses correctly against `src/lib/blogFrontmatter.ts`
  (`parseFrontmatter`/`extractFrontmatter`): quoted `tag`, bracketed
  `keywords` array, unquoted `date` — all match the parser's regexes, traced
  by hand.
- `npx vitest run` — full suite, 21 files / 45 tests, all green (includes
  `post-slugs.test.ts`, which would catch a slug collision).
- `npx tsc --noEmit` — clean, no output.
- `pnpm build` — full prerender succeeds (414 pages), the new post's page
  builds at `dist/blogg/eventlokaler-arrangement-underholdning-kulturarrangement-arrangorer/index.html`
  with correct `<title>`, single `<h1>` matching the post title, and correct
  meta description; the route is in `dist/sitemap.xml`; the ≥200-word
  markdown-source and rendered-body checks in the build output both pass for
  all 329 posts (including this one).
- All three internal cross-links the SPEC promised
  (`/blogg/billettlosning-pamelding-offentlig-arrangement`,
  `/blogg/spesiallokaler-niche-utleie-teaterscene-kjeller`,
  `/blogg/sal-for-kulturarrangementer-og-seminarer`) resolve to real files
  and appear correctly rendered in the prerendered HTML.
- The new `tag: "Arrangør"` value renders as a filter chip on
  `dist/blogg/index.html` (Blog.tsx's dynamic tag derivation confirmed
  working, no registration needed, as SPEC claimed).
- Content substance checked against the ticket's three required angles: (a)
  arrangør persona distinct from citizen/private-individual/venue-owner —
  present, own section; (b) eventlokale requirements specific to
  underholdning/kultur (scene, lyd/lys, kapasitet stående/sittende,
  skjenkebevilling, garderobe, lasterampe) — present, own section; (c)
  private-market framing vs. kommunal søknadsprosess — present, own section;
  (d) høyt kundeengasjement / repeat-booking angle — present, own section
  with concrete asks (rask gjenbestilling, lagrede spesifikasjoner, oversikt
  på tvers av lokaler). All four ticket-required angles are covered, each
  with its own heading, not just mentioned in passing.

**Finding: scope creep in `pnpm-workspace.yaml`.** The `dbbc50c` "wip
checkpoint" commit (from a prior interrupted session) added an `allowBuilds`
block to `pnpm-workspace.yaml` (`@swc/core`, `better-sqlite3`, `esbuild`,
`sharp` → `true`), almost certainly a side effect of running
`pnpm approve-builds --all` locally (see
[[project_pnpm_build_needs_approve_builds]]). This directly contradicts
SPEC.md's own "No code changes — content-only addition" and "BLAST RADIUS"
claims, which don't mention this file at all — the diff didn't match what
the SPEC said it would be. This is the same recurring pattern already
reverted on sibling tickets XAL-1099, XAL-1115, XAL-1127, and XAL-1129
(confirmed via `git log --all --oneline -- pnpm-workspace.yaml`) — a
shared-config edit unrelated to the ticket, picked up by an
`improvements-agent` checkpoint commit running in the same worktree.

**Fix applied:** reverted `pnpm-workspace.yaml` to `origin/main`'s version
(`git checkout origin/main -- pnpm-workspace.yaml`), restoring the diff to
content-only as SPEC.md describes. Re-ran `npx vitest run` (21/21 files, 45/45
tests, still green) and `npx tsc --noEmit` (clean) after the revert to
confirm the local `allowBuilds` grant wasn't load-bearing for anything this
ticket touches. Committed separately.

No other correctness issues found this round — content, frontmatter, links,
build, and tests all check out against the ticket's acceptance criteria.
