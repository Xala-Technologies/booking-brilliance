# XAL-1159 Review Log

## Round 1 — Correctness

**Lens:** does the diff do what `.agent/XAL-1159/SPEC.md` says, including the
edge cases — title/meta actually surfacing "Airbnb", keywords/FAQ/JSON-LD
wiring, the internal link route, and the two independent render paths (live
SPA vs. static `prerender.mjs`) staying consistent?

**What I checked:**

- Diffed every changed file (`beste-nettside-leie-lokale-hytte-utstyr-norge.md`,
  `bookingsystem-og-plattformer-for-utleiere.md`, `blogFaq.mjs`) against each
  bullet in SPEC.md §3 ("WHAT CHANGES") line by line — title, meta
  description, keywords array, depth paragraph, new FAQ entry, inbound link.
  All six match the spec's stated content verbatim; nothing claimed-but-not-
  done, nothing done-but-unclaimed.
- Traced the new FAQ entry (5th `POST_FAQ[slug]` item) through both render
  paths: live SPA (`BlogPost.tsx:161` → `SEO.tsx` `faq` prop) and static
  prerender (`scripts/prerender.mjs:2518` `POST_FAQ[post.slug].map(...)`,
  no length cap) — confirmed no hardcoded entry-count limit that would drop
  a 5th question from the `FAQPage` JSON-LD.
- Checked the title-length branch that decides whether `" · Digilist"` /
  `" – Digilist"` gets appended (`BlogPost.tsx:132`,
  `prerender.mjs:2531-2532`): new title is 63 chars, both branches take the
  `> 50` path and skip the suffix identically, so live and static titles
  stay in sync (this was a real risk — the two parsers are independent code
  paths per SPEC.md §2).
- Verified the new keywords entry (`"airbnb hytte utstyr"`) actually flows
  into `Article` JSON-LD via `BlogPost.tsx:158` → `SEO.tsx:318`, and
  confirmed (per SPEC.md's own note) it has no effect on
  `relatedSolutions()` matching since none of its regexes match
  hytte/utstyr/airbnb.
- Confirmed the new inbound link's target (`/blogg/beste-nettside-leie-
  lokale-hytte-utstyr-norge`) resolves via the `/blogg/:slug` wildcard route
  (`App.tsx:362`), and that the source paragraph
  (`bookingsystem-og-plattformer-for-utleiere.md:46`) still reads
  grammatically with the link spliced in.
- Confirmed XAL-1161's prior work on the same file (title's stats box "I
  korte trekk", CTA link to `/bookingsystem-utleie`) is untouched — this
  change doesn't clobber the sibling ticket's edits, per SPEC.md's explicit
  concern about that.
- Ran `npx vitest run` (full suite, 17 files / 36 tests, includes
  `blogFaq.test.ts` which pins `POST_FAQ[slug][0].question` and asserts
  every question/answer string `toContain`-matches the raw markdown body)
  — all green. Ran `npx tsc --noEmit` — clean.

**Findings:** none. Every spec claim matches the actual diff, both render
paths stay consistent, the FAQ test's body-mirror assertion holds for the
new 5th entry, and the full test suite + typecheck are green. No fixes
applied this round.

## Round 2 — Regression: what else reads this code path?

**Lens:** the diff touches `beste-nettside-leie-lokale-hytte-utstyr-norge.md`
(title/description/keywords/body), `blogFaq.mjs` (new `POST_FAQ` entry), and
`bookingsystem-og-plattformer-for-utleiere.md` (new inbound link). Round 1
verified these against SPEC.md's own stated blast radius. This round instead
grepped every consumer of the touched *fields* (slug, `keywords`, `POST_FAQ`)
site-wide — not just the files SPEC.md already named — to see if anything
outside that stated radius depended on the old values.

**What I checked:**

- Grepped the slug (`beste-nettside-leie-lokale-hytte-utstyr-norge`) across
  the whole repo, not just `src/content/blog/*.md`: only the post itself,
  `blogFaq.mjs`, `blogFaq.test.ts`, and the one new inbound link reference
  it. No sitemap, redirect map, or route config hardcodes it elsewhere.
- Grepped every consumer of `POST_FAQ` (`scripts/prerender.mjs`,
  `src/pages/BlogPost.tsx`, `src/content/blogFaq.test.ts`) plus one more
  round 1 didn't mention: `src/content/blog-xal739-aeo.test.ts`. Read it —
  it pins a *different* slug
  (`hva-koster-det-a-leie-selskapslokale-eller-moterom`) and a different
  query entirely (XAL-739's AEO answer page). Unaffected by this diff;
  confirmed it still passes.
- Grepped every consumer of a post's `keywords` field beyond
  `SEO.tsx`/`relatedSolutions()` (which SPEC.md already covered):
  `src/pages/Blog.tsx:59` folds `p.keywords` into the blog listing page's
  client-side search haystack, and `src/lib/search/corpus.ts:106` folds it
  into the site-wide command-palette search corpus. Both now additionally
  match "airbnb hytte utstyr" search terms for this post — additive,
  expected, not a regression (no test pins either list's exact contents for
  this slug).
- Checked `src/lib/chatbot/rag.ts`, which also scores by `entry.keywords` —
  confirmed it reads `FAQ_CATEGORIES` from `src/content/faq.ts`, a wholly
  separate FAQ dataset from `blogFaq.mjs`'s `POST_FAQ`. Not touched by this
  diff.
- Checked `scripts/prerender.mjs`'s `llms-full.txt` FAQ-corpus generator
  (lines 2570-2596) — also sourced from `src/content/faq.ts`
  (`FAQ_CATEGORIES`/`allFAQ`), not `POST_FAQ`. Not touched by this diff.
- Checked `BlogPost.tsx`'s TOC extractor (`extractHeadings`,
  `src/pages/BlogPost.tsx:69`, regex `^##\s+(.+?)\s*$`) — matches only `##`
  (H2), not `###` (H3). The new FAQ entry is a `###` heading, consistent
  with the existing 4, so it does not appear in the in-article TOC — same
  as its siblings, not a regression.
- Checked `scripts/verify-live.mjs`'s duplicate-`<title>` guard
  (`findDuplicateTitles`, rule `title.duplicate`) against the new title
  "Digilist vs. Airbnb: beste nettside for lokale, hytte og utstyr" —
  grepped every `title:` frontmatter value across `src/content/blog/*.md`
  for exact duplicates; none found. Also confirmed `expectedTitle()` does
  no truncation that could collapse two different long titles into one
  (it only conditionally appends a `" — Digilist"` suffix), so no
  collision risk beyond an exact match. Ran `node scripts/verify-live.mjs
  --self-test` — its offline parser self-check passes.
- Checked `src/lib/post-slugs.test.ts` (guards against two files resolving
  to the same slug) — this diff doesn't add or rename any file/slug, so
  unaffected; still passes.
- Re-ran the full suite after this lens: `npx vitest run` — 17 files / 36
  tests, all green.

**Findings:** none. Every other consumer of the touched slug, `keywords`,
and `POST_FAQ` fields either doesn't reach this post at all, or picks up
the new values in a way that's additive and expected rather than breaking
an existing invariant (test-pinned or otherwise). No fixes applied this
round.

## Round 3 — Security: authz, tenant isolation, injection, secrets

**Lens:** does anything in this diff touch access control or tenant
boundaries, introduce an injection vector (markdown/JS/JSON-LD), leak a
secret, or route unsanitized/user-supplied input into a query, a path, or
a page?

**What I checked:**

- Confirmed the full diff's actual code surface: two blog markdown files
  (`beste-nettside-leie-lokale-hytte-utstyr-norge.md`,
  `bookingsystem-og-plattformer-for-utleiere.md`) and one data file
  (`blogFaq.mjs`), all edited with static, agent-authored Norwegian prose.
  No route, middleware, API handler, database query, or auth/session code
  is touched — so there is no authz or tenant-isolation surface in this
  diff at all (this repo has no multi-tenant or booking domain to begin
  with, per prior confirmed findings in this worktree).
- Checked the new frontmatter (`title`, `description`, `keywords`) and the
  new `blogFaq.mjs` entry for characters that could break out of their
  containing syntax: no unescaped `"`, no backtick, no `<script`, no HTML
  tags, no `</script>` sequence anywhere in the new content (grepped for
  `<`, `` ` ``, and `script` across the changed `.md` file — only hits are
  the word "description:" line itself, nothing structural). The new
  `blogFaq.mjs` object uses plain double-quoted JS strings with no
  embedded quotes, consistent with `tsc`/vitest already passing.
- Traced how this content actually reaches the page to check for an
  injection vector independent of this diff's specific text: JSON-LD in
  the live path is built via `script.textContent = JSON.stringify(blocks)`
  (`src/components/SEO.tsx:371`) — `textContent`, not `innerHTML`, so even
  hostile input couldn't inject markup. The static prerender path
  (`scripts/prerender.mjs:2276`, `:2546`) instead string-interpolates
  `JSON.stringify(...)` directly into an HTML template literal for the
  `<script>` tag, which does NOT escape a literal `</script>` sequence —
  a real HTML-injection pattern in general, but (a) pre-existing in
  `prerender.mjs`, not introduced or widened by this diff, (b) explicitly
  out of scope per this ticket's own SPEC.md and the shared-file warning
  every SEO branch is bound by, and (c) not reachable here since none of
  the new title/description/FAQ text contains `</script>` or any HTML
  metacharacter. Not fixing it in this branch — flagging it as a
  pre-existing systemic gap worth its own one-off ticket, per the SPEC's
  own escalation guidance for exactly this situation.
- Checked the new inbound link's href
  (`/blogg/beste-nettside-leie-lokale-hytte-utstyr-norge`): a hardcoded
  relative path to an existing internal route, not derived from any
  user-supplied or external input — no open-redirect or path-traversal
  surface.
- Grepped the entire diff for secret-shaped strings (`api[_-]?key`,
  `secret`, `token`, `password`, `bearer`, AWS key prefixes, PEM headers)
  — the only hit is the literal placeholder text `_secrets, RBAC,
  injection, dependencies_` inside the deleted `AGENT-GOAL.md` template,
  not an actual credential.
- Confirmed `AGENT-SPEC.md` (new) and the deleted `AGENT-GOAL.md` contain
  only planning prose already reviewed under SPEC.md's own content in
  round 1; no environment values, tokens, or internal URLs beyond the
  already-public `digilist.no`/Linear links carried over from the prior
  ticket's file.

**Findings:** none introduced by this diff. The one latent issue found
(`prerender.mjs`'s un-escaped `</script>` interpolation in JSON-LD output)
predates this branch, isn't touched or made worse here, is out of this
ticket's explicit scope, and isn't triggered by any string in this diff.
No fixes applied this round; no code changes needed.

## Round 4 — Scope: is anything here NOT the stated change?

**Lens:** walk every file in `git diff origin/main...HEAD --stat` and ask
whether it's part of "strengthen the existing ranking page for CTR/
position" per SPEC.md §3, or a drive-by — unrelated tidying, opportunistic
refactor, or a file nobody asked to touch.

**What I checked:**

- Diffed the three content files line-by-line against SPEC.md §3's six
  bullets (title, meta description, keywords, depth paragraph, FAQ entry,
  inbound link): every changed line in
  `beste-nettside-leie-lokale-hytte-utstyr-norge.md`,
  `bookingsystem-og-plattformer-for-utleiere.md`, and `blogFaq.mjs` maps to
  exactly one bullet, nothing extra — confirms round 1's line-by-line check
  still holds after two more rounds of edits (none — rounds 1-3 made no
  code changes).
- The remaining four changed paths — `.agent/XAL-1159/SPEC.md`,
  `.agent/XAL-1159/REVIEW.md`, `AGENT-GOAL.md` (deleted), `AGENT-SPEC.md`
  (added, 191 lines) — are process scaffolding, not content. The first two
  are this ticket's own required artefacts (in scope by definition). The
  other two needed checking against repo convention:
  - `AGENT-GOAL.md`'s deletion happened in commit `0c14514`
    (`chore(XAL-1159): ...`), authored by `digilist-improvements-agent`
    *before* any content or review commit on this branch — standard
    orchestrator branch-prep (same pattern as the repo's many prior
    `chore: drop agent scaffolding from the PR` commits), not something
    introduced by this session's work. Left as-is.
  - `AGENT-SPEC.md` was added at the repo root by this branch's own
    `docs(XAL-1159): backfill AGENT-SPEC.md` commit (`51a5a5a`). This is a
    **real scope violation**, and not a novel one: the identical mistake
    was already made and reverted on the sibling XAL-1161 branch
    (`af9f7c3` added it, `54ebef6`'s round-4 scope review removed it,
    citing that main deliberately deleted `AGENT-SPEC.md` in `15c7b14`
    specifically because "every agent branch that dropped its own copy
    conflicted as modify/delete — PRs #236 and #237 were both blocked on
    exactly this and nothing else," and that per-run artefacts belong in
    `.agent/<ISSUE>/`, not the repo root). `AGENT-SPEC.md`'s content here
    is a word-for-word paraphrase of `.agent/XAL-1159/SPEC.md` (diffed the
    two: same structure, same facts, cosmetic wording differences only) —
    pure duplication with zero new information, reintroducing the exact
    conflict pattern main's maintainers already fixed once.

**Findings:**

1. `AGENT-SPEC.md` (root) — out of scope, duplicate of
   `.agent/XAL-1159/SPEC.md`, recreates a modify/delete merge-conflict
   pattern main's maintainers explicitly eliminated (`15c7b14`) and that
   was already independently re-introduced and reverted on the sibling
   XAL-1161 branch (`af9f7c3` → `54ebef6`). **Fix:** delete it from this
   branch, matching the XAL-1161 precedent exactly.

**What I changed:** removed `AGENT-SPEC.md`. No other file touched —
`AGENT-GOAL.md`'s deletion predates this session's work and is out of this
round's remit (owned by the PR-opening step, confirmed by the XAL-1161
precedent's own note to that effect). Re-ran `npx vitest run` and
`npx tsc --noEmit` after the removal (the file carried no code, so no
change expected, confirmed both still green).
