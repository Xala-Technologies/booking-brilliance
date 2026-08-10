# XAL-1119 Review Log

## Round 1

**Lens: correctness — does the change satisfy the acceptance criteria in
`.agent/XAL-1119/SPEC.md`, including edge cases, and is nothing claimed in
the SPEC actually false?**

### What I checked

- Step 0 sanity: `.agent/XAL-1119/SPEC.md` already exists and already
  contains a "Linear attachment status" section (no Linear MCP tools
  available, consistent with the standing memory note on XAL-1151). The
  "AGENT-SPEC.md does not exist" framing in this round's prompt refers to the
  root-level file, which was deleted on `main` on purpose (per memory:
  `project_root_agent_spec_deleted_trap.md`) — recreating it would be wrong.
  Nothing to do for step 0.
- Ran `node scripts/check-blog-word-count.mjs` — passes, 323/323 posts
  (includes the new one) over 200 words both in source and rendered
  `<article>`.
- Ran `node scripts/check-title-lengths.mjs` — new post's rendered title is
  61 chars (`ok 61 studio-fotografi-videografi-privatproduksjon-booking.md`),
  under the 65-char threshold.
- Ran `npx vitest run` — full suite, 20 files / 40 tests, all green,
  including `src/lib/post-slugs.test.ts` (new slug is unique).
- Ran `npx eslint` on the new `.md` file — ignored (no markdown config),
  matching the SPEC's own claim that Markdown isn't linted. No `.ts`/`.tsx`
  files were touched by this diff, so `pnpm lint` is a non-issue.
- Verified every internal link target actually exists as a file/route:
  `/blogg/spesiallokaler-niche-utleie-teaterscene-kjeller`,
  `/blogg/kunstner-verksteder-studio-dansesaler-kreative-lokaler`,
  `/blogg/utleieobjekt-veiviser-steg-for-steg` (all present in
  `src/content/blog/`), `/bookingsystem-utleie` (routed in `src/App.tsx:305`),
  and the `/blogg/:slug` route itself (`src/App.tsx:362`).
- Verified the cover image `public/images/blog/booking_calendar_hero_no.webp`
  exists on disk (it does — reused asset, no new binary needed).
- Checked frontmatter against `BlogFrontmatter`/`parseFrontmatter` in
  `src/lib/blogFrontmatter.ts` — all fields (slug, title, description, date,
  author, role, readingMinutes, tag, cover, keywords array) parse correctly;
  no keyword contains a comma that would break the naive `[a, b, c]` split.
- Checked the acceptance criterion "distinct from
  `kunstner-verksteder-...` and `spesiallokaler-niche-utleie-...`, no
  duplication" by reading `spesiallokaler-niche-utleie-teaterscene-kjeller.md`
  in full: it explicitly excludes fotostudio ("ikke et fotostudio med hvit
  cyc-vegg") and covers character-driven/atmospheric spaces. No overlap with
  the new post's cyc-wall/lighting-rig/greenscreen/soundproofing content.
  Claim holds.
- Checked the product-feature claims in the post (enkeltøkt booking,
  serietidsbestilling for recurring weekly slots, exclusive-period booking
  for productions, differentiated pricing per booking type) against how the
  same claims are phrased in ~8 sibling posts (idrettshaller, yoga-wellness,
  spesialiserte idrettssteder, undervisningslokaler, treningsrom, etc.) — the
  wording and the underlying feature set matches the established site-wide
  convention exactly. Not a new or unverified claim.
- Checked whether the new post should have an entry in
  `src/content/blogFaq.mjs` for its "Vanlige spørsmål" section (used for
  FAQPage JSON-LD). Confirmed via the file's own comment ("opt-in — only
  posts that actually carry a matching section... should have an entry
  here") and by sampling: 46 posts have a "## Vanlige spørsmål" heading,
  only 7 have a `blogFaq.mjs` entry, and *none* of the last 8 posts in this
  same content-gap family (including the two posts this one is explicitly
  extending) have one either. Not registering the new post is consistent
  with the established pattern, not a gap introduced by this change.
- Checked the SPEC's acceptance-criteria checkboxes are left unchecked
  (`- [ ]`) — confirmed this matches the sibling XAL-1123 SPEC.md (already
  merged via PR #257), which also ships with unchecked boxes. Established
  convention, not a defect.
- Computed word count (1140 words) and meta description length (155 chars)
  directly — both comfortably within normal ranges, consistent with the
  `readingMinutes: 6` claim and other posts' meta descriptions.

### Findings

None. Every acceptance criterion in the SPEC is met, all automated gates
(word count, title length, vitest, lint) pass, every internal link resolves,
every product-feature claim matches the established site-wide convention,
and the "distinct from sibling posts" claim was independently verified by
reading the referenced posts rather than trusting the SPEC's own assertion.

### Changes made this round

None — no correctness defects found, so nothing to fix. Diff is unchanged
from before this round; `git status` is clean at the end of this session
beyond this REVIEW.md addition.

## Round 2

**Lens: regression — what ELSE reads the blog-content pipeline besides the
files the SPEC's blast-radius section already names, and did anything depend
on behaviour this diff could plausibly disturb? The diff itself only adds one
new file (`src/content/blog/studio-fotografi-videografi-privatproduksjon-booking.md`)
plus the two `.agent/XAL-1119/` docs — no existing code was touched — so the
question is purely "does any consumer choke on, or silently mishandle, the
new file," not "did an edit break an existing call site."

### What I checked

- Re-grepped every file that reads `content/blog\|getAllPosts\|virtual:blog-meta\|postContent`
  across `src` and `scripts` (20 hits) — a superset of the SPEC's own
  blast-radius list — and read the ones round 1 hadn't already exercised
  directly: `src/pages/BlogPost.tsx` (`relatedSolutions`, `sidebarRelated`,
  `extractHeadings`/TOC), `scripts/prerender.mjs`'s FAQPage/Article
  JSON-LD block, `src/lib/search/corpus.ts`.
- `relatedSolutions()` in `BlogPost.tsx:31-53` regex-matches
  slug+title+tag+keywords against 5 `SOLUTION_PAGES` categories
  (kommune/idrettshall/møterom/selskapslokale/kulturhus) and falls back to a
  generic "Booking av lokaler og møterom" link if none match. The new post's
  haystack (studio/fotografi/videografi/booking/content/greenscreen/podcast)
  matches none of the 5 categories, so it hits the pre-existing fallback —
  same code path every non-matching post already takes, not a new failure
  mode, and it renders a valid link either way.
- `sidebarRelated` in `BlogPost.tsx:110-117` backfills same-tag posts then
  newest-others, deduped by slug — pure function over `getAllPosts()`, no
  fixed-size assumption that a new post could violate.
- FAQPage schema (`scripts/prerender.mjs:2518-2529`): opt-in via
  `POST_FAQ[post.slug]`; the new post's `## Vanlige spørsmål` section has no
  matching `src/content/blogFaq.mjs` entry, so `faqLD` is `null` and it's
  silently skipped — same opt-in gap round 1 already found and accepted as
  established convention (not re-litigating it; noting it here only because
  the regression lens needs to confirm the *skip path itself* still works,
  i.e. `postFaq ? {...} : null` doesn't throw or emit malformed JSON-LD for
  an unregistered slug — confirmed, prerender ran clean, see below).
- `src/lib/search/corpus.ts` builds `SearchItem[]` from `getAllPosts()` with
  no length caps or per-post keyword-count assumptions; the new post's 8
  keywords (vs. sibling posts' typical 5-8) is within the existing range.
- **`public/sitemap.xml`** (tracked static file, not the build-generated
  `dist/sitemap.xml`) — checked whether this content-only diff was expected
  to update it. It contains only 19 URLs total (10 `/blogg/` URLs, all from
  the `bryllupslokale`/`leie-selskapslokale` family, last touched in PR #208
  / XAL-715) against 323 actual posts, and does **not** contain the new
  slug. Confirmed via `git show` on the two most recent sibling merges
  (577c836 XAL-1123, 0d2297e XAL-1127) that neither of them touched
  `public/sitemap.xml` either — it's a pre-existing, sitewide-stale legacy
  file that no content post in this family updates; `dist/sitemap.xml`
  (regenerated at build time by `scripts/prerender.mjs:2599-2705`) is the
  one that actually stays in sync, and it does contain the new slug (1 hit).
  Not a regression introduced by this diff.
- Re-ran the full gate suite to confirm nothing regressed for any *other*
  post as a side effect of the new file: `npx vitest run` — 20 files / 40
  tests green, including `src/entry-server.h1.test.tsx` and
  `src/entry-server.main-landmark.test.tsx` (generic SSR structural tests,
  not post-specific — round 1's log didn't call these out by name).
  `node scripts/check-blog-word-count.mjs` — 323/323 pass. `node
  scripts/check-title-lengths.mjs` — new post still 61/65 chars; the 137
  other posts already over 65 chars are pre-existing and this check is
  informational-only (exits 0 regardless).
- `scripts/dedup-blog-drafts.ts`, `scripts/sync-convex-blog-to-fs.ts` (the
  two files in the consumer grep round 1's blast-radius section didn't
  quote in full) — read both; they operate on the separate Convex-backed
  draft table via `ConvexHttpClient`, keyed by draft IDs, never touch
  `src/content/blog/*.md` directly. Confirmed unaffected, matching the
  SPEC's claim.

### Findings

None. Every other consumer of the blog pipeline reads the new post through
the same glob/`getAllPosts()` machinery every existing post already goes
through — nothing hardcodes a post count, a fixed slug list, or an
assumption the new file violates. The one static artifact that doesn't
auto-include the new post (`public/sitemap.xml`) is confirmed pre-existing,
sitewide staleness untouched by every recent sibling PR, not something this
diff regressed.

### Changes made this round

None — no regressions found, nothing to fix. `git status` is clean at the
end of this session beyond this REVIEW.md addition.

## Round 3

**Lens: security — authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path, or a page.**

### What I checked

- Confirmed step 0 (SPEC + diagram) was already done in round 1: the root
  `AGENT-SPEC.md` this round's prompt asked about is the file deleted on
  `main` on purpose (per memory `project_root_agent_spec_deleted_trap.md`);
  the per-issue `.agent/XAL-1119/SPEC.md` already exists, already has the
  mermaid diagram, and already documents that no Linear MCP tools are
  available to attach it. Nothing new to do here.
- Confirmed the diff's actual blast radius via `git diff origin/main...HEAD
  --stat`: one new Markdown post plus the two `.agent/XAL-1119/` docs — zero
  application code touched. No route handler, API endpoint, database query,
  auth check, or tenant-scoping logic is anywhere in this diff, so the
  classic authz/tenant-isolation questions don't have a surface to attach to
  here; this is a static-content-only change picked up by a build-time glob.
- **Frontmatter parsing** (`src/lib/blogFrontmatter.ts:parseFrontmatter`):
  hand-rolled regex/line parser, no `eval`, no `Function()`, no YAML library
  with unsafe-load semantics. Verified the new post's frontmatter block
  parses cleanly against it — quoted strings for `title`/`description`
  don't contain embedded unescaped quotes that could desync the naive
  `startsWith('"') && endsWith('"')` stripping, and the `keywords` array
  entries contain no commas that would break the naive `split(",")`.
- **Markdown rendering** (`src/pages/BlogPost.tsx`): uses `react-markdown` +
  `remark-gfm` with no `rehype-raw` plugin and no `dangerouslySetInnerHTML`
  anywhere in the render path — raw HTML in Markdown source is rendered as
  literal text, not parsed as HTML, so even if the post body contained a
  `<script>` tag it would not execute. Confirmed the new post's body
  contains no raw HTML, no `javascript:`/`data:` URIs, and no markdown-link
  syntax pointing anywhere but relative `/blogg/...`, `/bookingsystem-utleie`,
  and `https://digilist.no/demo` — the last of these matches the exact URL
  convention already used by 5+ sibling posts (grepped), not a new or
  suspicious domain.
- **JSON-LD injection**: `scripts/prerender.mjs` builds all structured-data
  blocks via `JSON.stringify(...)` (`ldHTML`, `articleScript` at lines 2276
  and 2546), which correctly escapes quotes/newlines — no string
  concatenation building JSON by hand anywhere in that path. Moot for this
  post specifically anyway, since (per round 2) its FAQ section has no
  matching `src/content/blogFaq.mjs` entry, so it never reaches the FAQPage
  JSON-LD branch at all.
- **Secrets**: grepped the full diff (`git diff origin/main...HEAD`) for
  `key|secret|token|password|api[_-]?key|ssh|BEGIN ` — the only hits are the
  substring "key" inside the word "keyword" in the SPEC/REVIEW prose
  (round 1/2's own commentary about the `keywords` frontmatter field).
  Nothing resembling a credential, connection string, or private key
  anywhere in the new content.
- **Path/slug safety**: the new slug
  (`studio-fotografi-videografi-privatproduksjon-booking`) contains only
  `[a-z0-9-]`, matches the filename exactly, and is consumed only as an
  object key / route param inside code already exercised by 300+ existing
  posts — no path-traversal characters (`../`, `%2e%2e`, backslashes) for
  `extractFrontmatter`'s filename fallback or the `/blogg/:slug` route to
  mishandle.
- **User-supplied input**: there is none in this diff. The post is
  agent-authored static content, not data submitted by an end user, so there
  is no untrusted-input boundary being crossed into a query, path, or page —
  the "user-supplied" half of this lens's question doesn't apply to a
  content-only PR by construction.

### Findings

None. This diff has no application code, no auth/tenant logic, no
hand-built HTML/JSON-LD string concatenation, no secrets, and no
attacker-controlled input — the frontmatter parser and Markdown renderer it
flows through are both safe by construction (regex-based parsing with no
eval; `react-markdown` with no raw-HTML passthrough) for content the agent
itself authored. Nothing to fix.

### Changes made this round

None — no security defects found. `git status` is clean at the end of this
session beyond this REVIEW.md addition.
