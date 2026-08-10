# XAL-1155: Deep review log

Change under review: one new blog post,
`src/content/blog/lokalesok-definisjoner-lokaletyper-priser.md` (Norwegian
Bokmål, targets "lokalesøk"), an additive entry in `src/content/blogFaq.mjs`,
and a pinning test `src/content/blog-xal1155-lokalesok-faq.test.ts`. No
shared build/render script (`scripts/prerender.mjs`, `src/entry-server.tsx`,
`scripts/verify-live.mjs`) was touched at any point.

## Round 1 — correctness / regression / security / scope

Four parallel agents, each told to REFUTE the change over the actual file
contents and `git diff 8f95f8e..HEAD`.

**Correctness** — found three real defects:
1. "Kulturhus" appeared as a member of two categories the post presented as
   mutually exclusive ("Selskapslokaler" and "Forsamlingslokaler og saler")
   in the "Hvilke lokaletyper finnes?" list — self-defeating for a post whose
   job is disambiguating terminology.
2. The FAQ answer claimed "selskapslokale er en undergruppe av [forsamlings-
   lokale]" (a strict subset relationship), which neither matched the post's
   own parallel-category list nor was backed by either linked source post
   (`hva-er-et-forsamlingslokale.md` never mentions selskapslokale;
   `selskapslokaler-typer-og-hvordan-velge.md` never mentions
   forsamlingslokale).
3. The glossary bolded "Lokaletype" but referred back to it in the same
   sentence as "Lokaltypen" — an inline spelling inconsistency.
   Everything else checked out: all 6 internal links resolved against real
   slugs, all price figures matched their source post, frontmatter matched
   `blogFrontmatter.ts`'s shape, no markdown syntax breakage.

**Regression** — no issues. Confirmed `POST_FAQ` consumers
(`BlogPost.tsx`, `prerender.mjs`) do keyed lookups, not iteration, so one
more key is a safe no-op elsewhere; `tag`/`cover`/`readingMinutes` are
untyped and unrestricted; word-count and slug-uniqueness checks pass; the
real `dist/sitemap.xml` is rebuilt from `posts.map()` at build time (the
tracked `public/sitemap.xml` is a separate, smaller, hand-maintained file
that isn't what ships), so no manual sitemap edit was needed.

**Security** — no issues. No raw HTML/script tags/unusual URI schemes in the
markdown; `BlogPost.tsx` renders via `ReactMarkdown` with only `remark-gfm`
(no `rehype-raw`, so raw HTML wouldn't render even if present); FAQ text
reaches JSON-LD via `JSON.stringify`, not string concatenation, so
Norwegian characters and en-dashes can't break out of the `<script
type="application/ld+json">` tag; no secrets/PII; no new dependency.

**Scope** — no issues. Only the 3 files above (+ `AGENT-SPEC.md`) touched;
`scripts/prerender.mjs` / `src/entry-server.tsx` / `scripts/verify-live.mjs`
diff empty; no opportunistic refactor; the new test file follows the
repo's own established one-slug-pinning-test pattern
(`blogFaq.test.ts`, `blog-xal739-aeo.test.ts`) rather than duplicating it;
content stays at overview depth, deferring to the existing deep-dive posts
instead of re-litigating them.

**Changed:** rewrote the "Forsamlingslokale" glossary bullet to describe it
as the broader, kommunal umbrella term (matching the source post) instead of
a flat definition; split "Kulturhus og saler" out as its own bullet so
kulturhus stopped appearing in two buckets; rewrote the FAQ answer (both in
the post body and in `blogFaq.mjs`) to drop the unsupported subset claim;
fixed "Lokaltypen" → "Lokaletypen". Re-ran the full suite (37/37 pass) and a
full production build (352 pages, all green) after the fix.

## Round 2 — correctness / regression / security / scope

**Correctness** — found that the round-1 fix reintroduced a contradiction:
the "Hvilke lokaletyper finnes?" list now excluded kulturhus from
"Selskapslokaler" (split into its own "Kulturhus og saler" bucket), but the
round-1-fixed FAQ answer still called "grendehus og kulturhus" examples of
selskapslokaler — kulturhus was simultaneously excluded from and included in
"selskapslokaler" within the same article. Also flagged: "samfunnshus" was
introduced in the glossary's forsamlingslokale bullet but never appeared in
the lokaletyper list — an orphaned term.

**Regression** — no new issues. Reran `pnpm exec vitest run` (37/37) and
`pnpm run build` (352 pages) fresh with real output, confirmed
`postContent.ts` picks up the new body via the same glob as the frontmatter
loader, confirmed the related-posts widget just does date-sorted same-tag
matching (no snapshot/count test could break from one more post), and
traced that the new post's FAQ is correctly excluded from `llms-full.txt`
by design (that AI-crawler feed is built solely from `src/content/faq.ts`,
never from `POST_FAQ` — confirmed this is repo-wide pre-existing
architecture, not something this change broke).

**Security** — no issues. Rebuilt and grepped the actual rendered
`dist/blogg/.../index.html`: JSON-LD blocks parse as valid JSON, `<script>`
tag counts balanced, no raw `<`/`>` leaking into text, å/ø/æ/– render intact
with no mojibake. Confirmed `/blogg/:slug` routing does a `Map.get` against
a build-time allowlist (never a filesystem read from the URL param), so
path traversal is structurally impossible regardless of slug content.

**Scope** — no issues. Confirmed each follow-up commit stayed within the
same 2 files, confirmed the post still matches AGENT-SPEC.md's stated scope
exactly, and compared brand-mentions against 3 sibling posts — the new post
has exactly 1 Digilist mention (no CTA), lighter than every sibling checked.

**Changed:** restructured the "Hvilke lokaletyper finnes?" section to stop
treating "Selskapslokaler" as a building-type bucket at all — it's now
"Grendehus, samfunnshus og festsaler" (folding samfunnshus in, fixing the
orphan) plus a closing sentence: "Selskapslokale er altså ikke en egen
bygningskategori, men en bruksbetegnelse på lokaler." Reworded the FAQ
answer (post body + `blogFaq.mjs`, kept in lockstep) to match this framing
instead of asserting a subset relationship. Reran the suite (37/37) and
build (352 pages) after the fix.

## Round 3 — correctness / regression / security / scope

**Correctness** — the round-2 restructuring held up: the "altså" conclusion
now follows validly from the enumerated list (selskapslokale is absent from
it, therefore not a category), and the framing doesn't contradict either
source post. Found one remaining, non-blocking gap: "private festlokaler og
hoteller" got its own price tier and its own "hva følger med" bullet
elsewhere in the post, but had no matching entry in the "Hvilke lokaletyper
finnes?" list itself.

**Regression** — no issues. Fresh `pnpm exec vitest run` (37/37),
fresh `pnpm run build` (352 pages, `dist/blogg/.../index.html` at 99,871
bytes, in line with siblings), `node scripts/verify-live.mjs --self-test`
passed, manually re-read both the `.md` and `blogFaq.mjs` side by side to
confirm the two round-2 fix commits kept them character-for-character in
sync (not just trusting the test). Flagged as a minor cosmetic nit (not
blocking): `readingMinutes: 7` was low for the post's current ~1271-word
body relative to this repo's typical reading speed.

**Security** — no issues, re-checked the specific text changed in the two
most recent commits, rebuilt and grepped the final HTML to confirm the
reworded FAQ text renders as plain text only where expected (visible body +
FAQPage JSON-LD `text` field, nothing else), and re-diffed `blogFaq.mjs`
against its neighboring entries to rule out a stray brace/comma.

**Scope** — no issues. Total churn across all fix commits stayed small
(a handful of reworded sentences); one commit subject came in at 69
characters (`fix(XAL-1155): resolve lokaletype overlap and forsamlingslokale
claim`), one over this repo's 68-char convention — noted, not rewritten,
since these are local unpushed commits and rewriting a 3-commit chain for a
single character carried more risk than benefit. `AGENT-GOAL.md` still
present, correctly not yet deleted.

**Changed:** added a "Private festlokaler, gårder og hoteller" bullet to
the "Hvilke lokaletyper finnes?" list so every price tier mentioned later in
the post has a matching category earlier; bumped `readingMinutes` from 7 to
8 to match the current word count. Reran the suite (37/37) and build (352
pages) after the fix.

## Round 4 — correctness / regression / security / scope

Final pass, each lens re-reading the current state fresh rather than
diffing against prior rounds.

**Correctness** — read the whole post top to bottom as if for the first
time: it flows definition → terms → lokaletyper → what's included → price →
how to search → FAQ, with no leftover contradiction or orphaned reference.
The 6-bullet lokaletyper list and its closing disambiguation sentence now
hang together; all 7 internal links resolve; all price figures still match
`hva-koster-det-a-leie-selskapslokale-eller-moterom.md` exactly; the FAQ
(post body + `blogFaq.mjs`) matches word-for-word; no typos, double spaces,
or duplicated words found. No new issues.

**Regression** — fresh `pnpm exec vitest run` (37/37) and fresh
`pnpm run build` (352 pages), confirmed the built HTML contains the latest
edit ("Private festlokaler, gårder og hoteller" found in the rendered
output, proving the build wasn't stale), confirmed `git status` clean and
no other blog post was ever touched across the full commit range. Noted
(pre-existing, not a regression): the on-page reading-time widget computes
its own estimate from word count and ignores the `readingMinutes`
frontmatter field entirely — verified the same mismatch exists on an
unrelated, untouched sibling post.

**Security** — final full read of both files fresh: zero raw HTML/scripts/
unusual URI schemes, all 8 links relative `/blogg/<slug>` paths to real
posts, `blogFaq.mjs` entry is valid JS with no unescaped quotes or HTML
entities (`node --check` + the pinning test both pass), git history shows
only the expected 5 commits touching only the expected files, and the
content itself is generic public information with no internal/infra
exposure.

**Scope** — final check: file list unchanged (post, `blogFaq.mjs`, test,
`AGENT-SPEC.md`), shared render scripts still untouched across the entire
range, and the final post text still reads as a summary-with-links-out
rather than a competing full guide against either
`hva-koster-det-a-leie-selskapslokale-eller-moterom.md` or
`hva-er-et-forsamlingslokale.md`. `AGENT-GOAL.md` still present (deleted
only immediately before opening the PR). 5 commits total touching 4 files —
still a single, tightly-scoped content PR.

**Changed:** nothing — round 4 found no new issues on any of the four
lenses, confirming the change is ready to ship.

## Proof

`proof/after-lokalesok-post.png` — full-page screenshot of
`http://localhost:4181/blogg/lokalesok-definisjoner-lokaletyper-priser`
served from a production build (`pnpm run preview`) with `agent-browser`,
showing the published title, the full article body end to end (definitions,
lokaletyper, hva følger med, priser, søk, FAQ), and the site chrome. This is
net-new content (the URL didn't exist before this change), so there is no
"before" state to capture — per the workflow's proof rules, only the AFTER
is required for behaviour that didn't previously exist.

Command output backing the review, captured verbatim during the final
round: `pnpm exec vitest run` → `Test Files 17 passed (17)` /
`Tests 37 passed (37)`; `pnpm run build` → `Pre-rendered 352 pages +
sitemap.` / `✓ All 268 blog posts have at least 200 words in the markdown
source.` / `✓ All 268 blog posts render at least 200 words in
dist/blogg/*/index.html.`; `node scripts/verify-live.mjs --self-test` →
`verify-live self-test: all parser checks passed.`
