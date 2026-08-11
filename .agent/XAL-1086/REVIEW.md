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

## Round 2

**Lens: regression — what else reads this code path, and does anything
depend on behaviour this diff changes.**

The diff is content-only (one new `.md` file). Since no shared code changed,
the question is whether the new post's *data* (frontmatter values, new tag,
cover reuse) breaks an invariant some other consumer already relies on.
Grepped every reader of blog frontmatter/content independently, not just the
ones SPEC.md already listed, and re-checked SPEC's BLAST RADIUS claims
against the actual code rather than trusting them:

- **`post.tag` consumers** (`BlogPost.tsx`, `Blog.tsx`, `search/corpus.ts`,
  `BlogPreviewSection.tsx`) — grepped for any hardcoded switch/map keyed by
  known tag strings (`"Utleier"`, `"Privatperson"`, `"Innbygger"`,
  `"Plattform"`) that a brand-new `"Arrangør"` value could miss a branch of
  (e.g. a color-per-tag lookup with no default). Found none — tag is
  rendered as plain text everywhere, `Blog.tsx`'s filter-chip list is built
  from `allPosts.forEach` with no enum. Confirms SPEC's claim, verified
  independently rather than taken on faith.
- **`BlogPost.tsx`'s `sidebarRelated`** (`p.tag === post.tag` same-tag
  match, lines 108–117) — reads every OTHER post too, not just the new one,
  so this is a real "what else reads this" check. Since `"Arrangør"` is a
  brand-new tag value, this new post will have zero same-tag matches and
  fall back to the newest-others backfill already coded for that case — no
  crash, no empty sidebar, and no *other* post's sidebar changes because the
  match is keyed off `post.tag === post.tag`, never triggered by a foreign
  post looking for `"Arrangør"` matches it doesn't have. Not a regression.
- **`cover: "/images/blog/booking_calendar_hero_no.webp"` reuse** — checked
  `webp-sources.test.ts`, which iterates `getAllPosts()` and asserts every
  `previewCover()`-derived webp sibling exists on disk. This cover is
  already used by two existing posts and that test was green before this
  diff (round 1 confirmed 45/45), so reuse doesn't introduce a new asset
  path to validate. Re-ran after confirming — still green.
- **RSS/feed generation** — grepped for `rss`/`feed.xml`/`Atom` across
  `src` and `scripts`; no feed reads blog posts, only a match on an
  unrelated component name. Nothing to check.
- **`scripts/prerender.mjs`** — re-read its frontmatter parse and
  `og:description`/`twitter:description`/`<meta name="description">`
  emission (lines ~190–215) to confirm `fm.description` is written
  *verbatim*, byte-for-byte, no truncation, no ellipsis. This is the actual
  finding this round:

**Finding: the new post's `description` frontmatter is 183 characters,**
over the ~160-char budget the codebase already treats as a hard constraint
for exactly this reason. Two standing tests —
`digitalt-bookingsystem-description.test.ts` and
`leie-selskapslokale-description.test.ts` — exist *because* XAL-787 hit
Google/social truncation on an over-length meta description, but both tests
only assert against one hardcoded slug each. Every other post, including
this new one, reads the same `scripts/prerender.mjs` code path with no
guard. This is precisely the "what else reads this" regression this lens
was asked to find: the invariant the codebase already learned the hard way
(XAL-787) applies here too, and nothing enforces it for posts outside those
two hardcoded slugs. Confirmed via `node -e` character count: 183, title
line unaffected (50 chars, fine).

**Fix applied:** shortened the frontmatter `description` to under 160
characters while keeping the same keyword coverage ("arrangement",
"eventlokaler") and CTA framing. Old (183 chars): "Arrangører som booker
eventlokaler til konsert og kulturarrangement har andre behov enn en
privatperson. Se hva et godt eventlokale krever, og hvorfor rask
gjenbestilling teller mest." New (under 160 chars, verified by the same
`node -e` count): "Arrangører som booker eventlokaler til konsert og
kulturarrangement har andre behov enn en privatperson. Se hva et godt
eventlokale krever." Re-ran `npx vitest run` (still 21/21 files, 45/45
tests — the two existing description-length tests don't cover this slug so
they wouldn't have failed either way, but nothing else regressed) and
`npx tsc --noEmit` (clean) after the edit.

No other regression risk found this round — every code path that reads
blog-post data was traced to a real consumer and checked against this
post's actual frontmatter values, not just against SPEC's description of
them.

## Round 3

**Lens: security — authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path or a page.**

Re-confirmed the actual diff scope first (`git diff origin/main...HEAD
--stat`): three files, `.agent/XAL-1086/SPEC.md`, `.agent/XAL-1086/REVIEW.md`,
and the one new post markdown file — no `.ts`/`.tsx`/`.mjs` touched. That
already rules out most of this lens's usual targets (no query built, no auth
check added or removed, no route handler). This repo also has no
booking/tenant domain at all ([[project_repo_has_no_booking_domain]]), so
there is no multi-tenant data model for a content change to leak across.
Checked anyway, specifically for this diff:

- **Injection into the static-HTML pipeline.** Traced how `scripts/
  prerender.mjs` embeds blog frontmatter into the prerendered page
  (`patchHTML`, ~line 2295 onward): `meta.title` and `meta.description` are
  interpolated into `<title>`, `<meta name="title" content="...">`,
  `og:title`/`og:description`, `twitter:title`/`twitter:description`, and
  into JSON-LD, with **no HTML-attribute escaping** — unlike the `keywords`
  meta tag a few lines below it, which explicitly does
  `.replace(/"/g, "&quot;")` before interpolating. A frontmatter `title` or
  `description` containing a literal `"` would break out of the attribute
  and inject arbitrary markup into every prerendered page that value
  touches. This is a real gap, but it's pre-existing shared infrastructure
  (`scripts/prerender.mjs`, used by all 329 posts, not code this ticket
  added or was asked to touch) — fixing it here would be the same kind of
  scope creep round 1 already reverted once
  (`pnpm-workspace.yaml`). Checked this post's own frontmatter values
  specifically: `title`, `description`, `author`, `role`, `tag` — none
  contain a `"`, `<`, or `>` character (verified with
  `grep -nE "<script|<iframe|javascript:|onerror=|onload="` — zero matches),
  so this diff does not trigger the gap. Flagging as a follow-up ticket
  candidate (add the same `&quot;` escaping used for `keywords` to `title`/
  `description`), not fixing it in this diff.
- **Markdown body → rendered page.** `BlogPost.tsx` renders the body via
  `ReactMarkdown` with only `remarkGfm` (confirmed in SPEC.md, re-checked no
  `rehype-raw` or similar is registered anywhere in the repo), so raw HTML
  in a post body renders as inert text, not markup — grepped the new post
  for `<script`, `<iframe`, `javascript:`, `onerror=`, `onload=`, raw `<a `/
  `<img` tags: zero matches. Nothing in the body attempts raw HTML.
- **Links.** All three internal links (`/blogg/billettlosning-pamelding-
  offentlig-arrangement`, `/blogg/spesiallokaler-niche-utleie-teaterscene-
  kjeller`, `/blogg/sal-for-kulturarrangementer-og-seminarer`) are relative
  paths to existing posts, already confirmed to resolve in round 1's build
  check. No external links (`grep -nE "https?://"` — zero matches), so no
  unvetted outbound domain, no `rel="noopener"` gap to worry about.
- **Path/slug.** `slug` is a static frontmatter value matching the filename,
  consumed by `scripts/prerender.mjs` as `/blogg/${post.slug}` with no
  sanitization anywhere in that path — but it's author-written at commit
  time, not runtime user input, and contains only `[a-z0-9-]`. No traversal
  characters (`../`, `/`, `\`), so no path-escape risk even if it were
  attacker-influenced.
- **Secrets.** Grepped the new file for `api[_-]?key|token|password|secret|
  sk-|AKIA` (case-insensitive) — zero matches. Nothing else in the diff
  (SPEC.md, REVIEW.md) contains credential-shaped strings either.
- **Tenant isolation / authz.** N/A — confirmed via
  [[project_repo_has_no_booking_domain]] there is no tenant model, session,
  or auth check in this codebase for a content-only diff to bypass or leak
  across.

**No fix applied this round.** Nothing in this diff itself is exploitable —
the one real finding (missing attribute-escaping in `prerender.mjs` for
`title`/`description`) is a pre-existing repo-wide gap outside this
ticket's blast radius, not something this diff introduced or that current
frontmatter values trigger. Re-ran `npx vitest run` after the review pass
(still 21/21 files, 45/45 tests) to confirm the working tree is unchanged
and green.

## Round 4

**Lens: scope — is anything here NOT the stated change? Drive-by edits,
unrelated tidying, files nobody asked you to touch.**

Re-pulled the full diff (`git diff origin/main...HEAD --name-status`) and
`git status` fresh this round, rather than trusting round 1's characterization
of it, since round 1's own finding was exactly a scope-creep file that had
snuck into an earlier checkpoint commit — the question this round asks is
whether anything similar happened again in rounds 2 or 3's "fix applied"
commits, or is still sitting in the working tree.

Checked:
- **`git diff origin/main...HEAD --name-status`** — exactly three files:
  `.agent/XAL-1086/SPEC.md` (A), `.agent/XAL-1086/REVIEW.md` (A), and the one
  new post `src/content/blog/eventlokaler-arrangement-underholdning-
  kulturarrangement-arrangorer.md` (A). No `.ts`/`.tsx`/`.mjs`/config file
  anywhere in the diff. This is the same three-file shape SPEC.md's own
  "No code changes — content-only addition" and BLAST RADIUS section
  describe — the diff matches what it claims to be.
- **`pnpm-workspace.yaml`** — explicitly re-diffed against `origin/main`
  (`git diff origin/main...HEAD -- pnpm-workspace.yaml`): empty. Round 1's
  revert of the `allowBuilds` scope-creep held; nothing re-added it in
  rounds 2 or 3's fix commits.
- **`git status`** — clean working tree, nothing untracked or staged outside
  the committed diff. No stray temp files, no leftover `dist/` artifacts, no
  second draft of the post.
- **Round 2 and round 3's own "fix applied" edits** — round 2's description
  trim and round 3's (declined) fix were both re-checked to confirm they
  landed *inside* the one post file they were about, not as a drive-by
  touch to `scripts/prerender.mjs` or another shared file. Confirmed: round 2's
  diff is contained to the post's `description:` frontmatter line, and round 3
  made no code edit at all (correctly deferred the `prerender.mjs` escaping
  gap to a follow-up ticket rather than fixing it inline, which would itself
  have been scope creep on this ticket).
- **New tag value (`"Arrangør"`)** — no new registration, enum, or config
  file was added or touched to support it (already confirmed in round 2 that
  `Blog.tsx` derives tags dynamically), so introducing a new tag value did
  not require, and did not receive, any drive-by edit elsewhere.
- **Cover image reuse** — no new image asset was added; the post reuses an
  existing cover already present in `dist`/`public`, so there's no
  accompanying binary-file scope creep to check for.

**No findings this round.** The diff is exactly the three files the ticket's
own SPEC describes, nothing outside `.agent/XAL-1086/` and the one new
content file was touched by this branch's commits, and both prior rounds'
fixes stayed contained to the file they were fixing. `npx vitest run`
re-confirmed green (21/21 files, 45/45 tests) after this pass; no code
changed so no fix commit was needed this round.
