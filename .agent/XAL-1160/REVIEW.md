# XAL-1160 — Review log

## Round 1 — CORRECTNESS

Lens: does the change do what the acceptance criteria say — sharper
title/meta, clearer value proposition, internal links, and depth, to lift
CTR at position 17.2 — including on edge cases the SPEC didn't check?

### What I checked

- Every concrete number in the new "I korte trekk" box against the
  article's own sections it claims to summarize: "3 ressurstyper" (bullet
  list under "Hvilke ressurser kan bookes digitalt" has exactly 3 items),
  "4 brukergrupper" (bullet list under "Hvem bruker digitale
  bookingsystemer" has exactly 4 items), "6 steg" (numbered list under
  "Hvordan fungerer ... i praksis" has exactly 6 items). All three numbers
  are accurate, not invented.
- Both new internal link targets (`/bruksomrader/moterom`,
  `/bruksomrader/idrettshaller-gymsaler`) against `src/App.tsx` — both are
  live routes (lines 378-379).
- The title-length suffix logic in `BlogPost.tsx:133` and
  `prerender.mjs:2532` (both append " · Digilist" / " – Digilist" only
  when `title.length <= 50`) — new title is 54 chars, so both paths
  correctly stay suffix-free, matching the SPEC's claim.
- The frontmatter regex parsers in both `blogFrontmatter.ts` (used by the
  live SPA) and `scripts/prerender.mjs` (used by the static prerender)
  against the new title/description strings — the en-dash and question
  mark in the title, and the added `updated` field, parse cleanly in both;
  confirmed by reading the regexes by hand, not just trusting the SPEC's
  claim.
- Full `npx vitest run` (17 files / 36 tests, all green) and re-read of
  `npx tsc --noEmit` output — clean.
- Word-count delta between old and new markdown body (934 → 1000 words,
  +66) against the unchanged `readingMinutes: 7` — not enough added
  content to plausibly cross a minute boundary at any reasonable
  words-per-minute assumption; leaving it at 7 was correct, not an
  oversight.
- Norwegian Bokmål grammar/spelling of every added or edited sentence
  (intro clause, 4-line stats box, restructured "Neste steg" section) —
  read line by line, no typos or grammatical errors found.

### What I found

**Meta description is 224 characters — 64 over this repo's own ~160-char
SERP-truncation budget, and worse than the description it replaced.**

The new `description` frontmatter field
(`src/content/blog/digitalt-bookingsystem-hva-er-det.md:4`) is 224
characters long. The description it replaced was 164 characters — already
at the edge, but the new one is 37% longer, not shorter. This repo has
prior, confirmed incidents of exactly this failure mode: `XAL-787` (cited
in `src/pages/UtstyrFestutstyr.test.ts:8`) and a second post
(`leie-selskapslokale-bryllup-fest`) both have standing regression tests —
`src/lib/leie-selskapslokale-description.test.ts` and the Fredrikstad case
in `src/content/lokalerByer.test.ts` — that assert
`description.length < 160` specifically because Google truncates past
that point. This branch's own change works directly against the ticket's
goal: a SERP snippet that gets cut off mid-sentence with an ellipsis is
not "mer attraktiv" than a shorter, complete one. At a ~155-160 char
truncation point, the "6 steg" hook (the new title's whole selling point)
narrowly survives, but the sentence is chopped off mid-word
("...bekreftet reservas…"), which looks worse in the SERP than a
description that ends cleanly. This is a real defect against the
acceptance criteria, not a nitpick — it's the same bug class this
codebase has already paid to fix twice.

No other correctness issues found. The numbers, links, suffix logic,
frontmatter parsing (both parsers), tests, and prose all check out.

### What I changed

- Shortened `description` in
  `src/content/blog/digitalt-bookingsystem-hva-er-det.md` from 224 to 157
  characters, keeping the "6 steg" hook intact and ending on a complete
  sentence instead of a mid-clause cutoff.
- Added `src/lib/digitalt-bookingsystem-description.test.ts`, mirroring
  the existing `leie-selskapslokale-description.test.ts` pattern, to
  regression-guard this specific post's description against the same
  160-char truncation failure going forward.
- Re-ran `npx vitest run` (18 files / 37 tests, all green) and
  `npx tsc --noEmit` (clean) after the fix.

## Round 2 — REGRESSION

Lens: what ELSE reads this code path — not just the files this branch
edited, but every consumer of the touched slug/fields, and anything that
might have depended on the *old* title/description/frontmatter shape?

### What I checked

- Grepped every `.ts`/`.tsx`/`.mjs`/`.js`/`.json` file for the literal
  slug `digitalt-bookingsystem-hva-er-det` and for the exact old title
  string — only hits are the new description test (this branch) and the
  one inbound link from `bookingsystem-og-plattformer-for-utleiere.md`
  (already noted in SPEC §4, confirmed still resolves — the link text
  doesn't embed the target's title, so it's unaffected by the title
  change).
- `src/lib/search/corpus.ts` (`getSearchCorpus`) — not mentioned in the
  SPEC's blast-radius section at all, so treated it as unverified. It maps
  every post's `title`/`description` straight into `SearchItem.title`/
  `.subtitle` with no length assumption or slicing. The two render sites,
  `src/components/GlobalSearch.tsx:280-285` and
  `src/components/chatbot/ResultCards.tsx:47-48`, clip with CSS
  (`truncate`, `line-clamp-1/2`), not character counts — so the new
  56-char title and 157-char description (both similar in length to the
  old 60/164-char pair) render fine; this path was never at risk but
  wasn't independently confirmed before.
- `scripts/indexnow-submit.mjs` — static `DEFAULT_PATHS` list, this slug
  isn't in it (never was) — no interaction with this branch.
- `public/llms.txt` / `public/llms-full.txt` — confirmed these are
  hand-curated static files, not generated from `src/content/blog/*.md`
  at build time (`scripts/prerender.mjs` only appends a FAQ-corpus chapter
  to `llms-full.txt` from `src/content/faq.ts`, unrelated to blog posts).
  This slug isn't listed in either file, before or after — no drift to
  cause.
- Every consumer of the new `updated` frontmatter field: `BlogPost.tsx:153`
  and `prerender.mjs:2507` both only feed it into `dateModified` for
  `Article` JSON-LD (SPEC already covered this). Checked the two places
  that could plausibly *also* read it and would change behaviour if they
  did — `src/pages/Blog.tsx` (listing sort/filter) and
  `src/components/BlogPreviewSection.tsx` (teaser card date) — both use
  `post.date` only, never `post.updated`. So adding `updated` doesn't
  reorder the blog index or change the visible teaser date; it only
  changes `dateModified` in structured data, as intended.
- `src/lib/posts.ts:19` — `getAllPosts()` sorts by `date` (unchanged:
  `2026-07-27`), not `updated` — confirmed the new `updated` field can't
  silently move this post's position in `getAllPosts()`, which matters
  because `src/entry-server.main-landmark.test.tsx:30` renders whatever
  `getAllPosts()[0]` happens to be. Order is unaffected, so that test's
  target route is unaffected by this branch.
- Checked for a global (all-posts) description-length test that the new
  per-slug test in Round 1 might duplicate or conflict with — none exists;
  only two per-slug tests exist (`leie-selskapslokale-description.test.ts`,
  this branch's new `digitalt-bookingsystem-description.test.ts`), same
  pattern, no collision.
- `scripts/prerender.mjs`'s `patchHTML()` (lines 2292-2352) — the actual
  string substitution that writes `meta.title`/`meta.description` into
  `<title>`, `<meta name="description">`, `og:title/description`,
  `twitter:title/description` via `String.prototype.replace(regex,
  templateString)`. Verified the new title/description contain no `$`
  (which `.replace`'s string-replacement form treats specially as a
  pattern token) and no `"` or `<`/`>` that could break out of the
  attribute or tag — confirmed by direct inspection of both strings, not
  just by trusting Round 1's regex-parsing check (parsing in ≠ substituting
  out). This branch is also the first post in the repo to use an en-dash
  (`–`) in a title (`grep '^title:.*–' src/content/blog/*.md` — only this
  file matches) — traced it through `patchHTML()` and confirmed
  `String.prototype.replace` has no special handling for `–`, so it's
  inert in this context.
- Re-ran `npx vitest run` after all of the above — 18 files / 37 tests,
  all green, unchanged from Round 1's post-fix state.

### What I found

No regressions. Every consumer this branch's changed fields (`title`,
`description`, `updated`, body markdown) flow through — including three
(`corpus.ts`/search, `Blog.tsx`/listing sort, `patchHTML()`'s actual
substitution logic) that the SPEC's blast-radius section either didn't
name or only checked one layer of (regex parsing, not string
substitution) — was traced independently and confirmed unaffected by both
the old and new content.

### What I changed

Nothing — no defects found under this lens. No commit from this round.

## Round 3 — SECURITY

Lens: authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path, or a page.

### What I checked

- Full diff (`git diff origin/main...HEAD`) file by file: `.agent/XAL-1160/
  REVIEW.md` and `SPEC.md` (docs, no runtime surface), `AGENT-GOAL.md`
  (deleted scaffolding, no runtime surface), `src/content/blog/
  digitalt-bookingsystem-hva-er-det.md` (the actual content change), and
  `src/lib/digitalt-bookingsystem-description.test.ts` (new test, static
  assertion only) — confirmed this branch has zero code-path changes, only
  static markdown content and its frontmatter.
- Grepped the diff itself for credential-shaped strings (`api[_-]?key`,
  `token`, `secret`, `password`, `bearer`, `authorization:`) — the only
  hits are the words "secret"/"token" appearing in prose (a checklist
  template line and Round 2's own description of `.replace()`'s special
  `$`-token handling), not actual secret values.
- Grepped the new markdown body for raw-HTML/script injection vectors
  (`<script`, `javascript:`, `data:text/html`, `onerror=`, `onclick=`,
  `<iframe`, `<img ... src=`) — none present. The new content is plain
  markdown prose, a bullet list, and standard `[text](/path)` links.
- Re-checked (independently of Round 2's regex-parsing pass) the two
  frontmatter fields that flow into `scripts/prerender.mjs`'s
  `patchHTML()` `String.prototype.replace(regex, templateString)` call —
  grepped `title:`/`description:` for `$`, `<`, `>` (all three have
  special meaning to `.replace`'s string-replacement form or would break
  out of an HTML attribute/tag) — none present in either field.
- Traced how `title`/`description` reach `Article` JSON-LD in
  `src/components/SEO.tsx:371` — `script.textContent =
  JSON.stringify(blocks)`. `JSON.stringify` escapes quotes/backslashes
  itself and the result is assigned via `.textContent` (not
  `dangerouslySetInnerHTML`/`innerHTML`), so there's no string-concatenation
  or raw-HTML-injection path here regardless of what characters the
  description contains.
- Confirmed this repo has no tenant/authz model for content to leak
  across (blog posts are public, unauthenticated, statically prerendered
  — no session, no RBAC check, no per-tenant data anywhere in this file
  or its consumers) — consistent with prior confirmed findings that this
  repo is marketing/content-ops only with no booking/tenant domain.
- Confirmed nothing in this change is user-supplied at request time: the
  title, description, stats-box numbers, and both new internal links
  (`/bruksomrader/moterom`, `/bruksomrader/idrettshaller-gymsaler`) are
  hardcoded strings the agent wrote into the `.md` file at commit time,
  not values interpolated from a query string, route param, form field,
  or any other request-time input — so there is no injection surface for
  an actual attacker to control here, as opposed to a hypothetical one.
- Checked `react-markdown`'s config at the one render site
  (`BlogPost.tsx`, `remarkGfm` only, confirmed by Round 1/2) for a
  `rehype-raw`-style plugin that would let raw HTML through — none is
  configured, so even if the markdown source did contain an HTML tag it
  would render as escaped text, not execute. This is pre-existing
  configuration, unchanged by this branch, checked here only to confirm
  the new content isn't exploiting a gap that happens to exist.
- New test file (`digitalt-bookingsystem-description.test.ts`) — asserts
  only a `string.length` bound on data already resolved via
  `getAllPosts()`; no dynamic input, no secrets, no filesystem/network
  access beyond what the existing test harness already does.

### What I found

No security issues. This branch has no authz/tenant surface (none exists
in this repo), no injection surface (all new strings are static,
attacker-uncontrolled, and pass through `JSON.stringify`/textContent or a
regex-substitution path already confirmed clean of the specific
metacharacters that matter to it), and no secrets.

### What I changed

Nothing — no defects found under this lens. No commit from this round.
