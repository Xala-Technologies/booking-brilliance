# XAL-1161 — Adversarial Review Log

## Round 1 — Correctness

**Lens:** does the change do what the acceptance criteria say, on the edge
cases too? Read `.agent/XAL-1161/SPEC.md`, then
`git diff origin/main...HEAD`, then the tests, then traced every consumer of
the touched fields by hand (not just re-trusting SPEC's claims).

**Checked:**

- Frontmatter fix (`lastUpdated` → `updated`): grepped both parsers
  (`src/lib/blogFrontmatter.ts:72-73`, `scripts/prerender.mjs:203` and its
  `dateModified: post.updated || post.date` use at line 2507) — both read
  `updated`, neither ever read `lastUpdated`. The fix is real, not cosmetic.
- Three new/changed link targets (`/bruksomrader/idrettshaller-gymsaler`,
  `/bruksomrader/moterom`, `/bookingsystem-utleie`) — confirmed all three are
  live `<Route>`s in `src/App.tsx:305,378-379`.
- New "I korte trekk" bullet claims cross-checked against the article body
  for internal consistency: "under 2 uker" (body line 53, same number),
  "15+ utleiere og kommuner" (body line 31, "over 15"), "eneste av de fire
  med ID-porten" (comparison table, cols confirm Digilist=Ja, Airbnb/Hygglo/
  norgesbooking.no=Nei) — no contradictions.
- `faqQuestion`/`faqAnswer` frontmatter fields vs. the actual FAQPage JSON-LD
  source (`blogFaq.mjs`): confirmed unchanged, still matches; SPEC's claim
  that these two frontmatter fields are cosmetic dead weight verified
  independently (not just trusted).
- Markdown structural risk: new content uses `**bold**` lead-ins, a bullet
  list, two inline links, and a standalone link-paragraph CTA. Renderer is
  `react-markdown` + `remark-gfm` (`BlogPost.tsx:2-3`) — all standard,
  supported syntax. The in-article TOC extractor
  (`BlogPost.tsx:67, regex ^##\s+`) only matches real `##` headings, so the
  new `**I korte trekk:**` bold line can't leak into the TOC — verified by
  reading the regex, not assumed.
- Title/meta length: new title is 65 chars, new description 148 chars.
  Sampled length across the full `src/content/blog/*.md` corpus (240+
  files) — the vast majority already run 60-90 char titles and 140-210 char
  descriptions, so this is consistent with the site's existing convention,
  not a regression against it.
- Test suite: targeted (`blogFaq.test.ts`, `entry-server.h1.test.tsx`) and
  full (`npx vitest run`) — 17 files / 36 tests, all green. `npx tsc
  --noEmit` — clean. Confirmed neither `entry-server.h1.test.tsx` nor
  `blog-xal739-aeo.test.ts` hardcodes this post's old title/slug (they pin
  different posts), so the title rewrite can't have silently broken a
  pinned assertion elsewhere.
- Scope: diff touches only the one `.md` file plus `.agent/`/`AGENT-GOAL.md`
  scaffolding — no edits to `scripts/prerender.mjs`, `src/entry-server.tsx`,
  or `pnpm-workspace.yaml`, matching the ticket's explicit "minimal and
  conflict-free" constraint.

**Findings: none.** Every claim in SPEC.md's "WHAT CHANGES" and "BLAST
RADIUS" sections was re-derived independently from the code (not just
re-read from the SPEC) and held up. No correctness defects found this
round.

**Changes made this round:** none — nothing to fix.

## Round 2 — Regression

**Lens:** what ELSE reads this code path, beyond the files the diff itself
touches? Grepped every consumer of the touched markdown file's slug and
fields (`title`, `description`, `updated`, body text), not just the ones
already named in SPEC.md, and checked each one against the old vs. new
values for anything that could have silently depended on the old copy.

**Consumers traced (via `getAllPosts()` / `virtual:blog-meta` and direct
slug grep):**

- `src/lib/posts.ts` — sorts posts by `date` (unchanged: `2026-08-07`), not
  `updated`. Confirmed no other file sorts/filters by `.updated` except the
  two `dateModified` JSON-LD sites already named in SPEC.md
  (`BlogPost.tsx:153`, `prerender.mjs:2507`) — the frontmatter fix can't
  have reordered anything.
- `src/components/BlogPreviewSection.tsx` (homepage teaser, top 6 posts)
  and `src/pages/Blog.tsx` (blog listing/search) — both render `post.title`
  / `post.description` directly as plain strings with no length assertion
  or fixed-line-count layout logic that the old copy's length happened to
  satisfy; new title (67 chars) and description (148 chars) are close in
  length to the old ones (69 / ~200 chars), so no new overflow behavior.
- `src/lib/search/corpus.ts` (sitewide search index) — maps `getAllPosts()`
  generically into search items; no pinned string for this slug's title or
  description. Picks up the new copy automatically, which is desirable
  (better search snippet), not a regression.
- `src/entry-server.main-landmark.test.tsx` — uses `getAllPosts()[0]` as
  "first post rendered" and asserts on landmark *structure* only (one
  `<main>`, nav before it, footer after), never on this post's specific
  title/description text. Unaffected regardless of whether this post is
  first (sort key `date` didn't change).
- `src/lib/post-slugs.test.ts` (slug-uniqueness guard) and
  `src/lib/leie-selskapslokale-description.test.ts` (a *different* post's
  meta-description length guard) — grepped, neither references this slug.
- `src/content/blog-xal739-aeo.test.ts` — grepped, pins a different slug
  (`hva-koster-det-a-leie-selskapslokale-eller-moterom`), not this one.
- No `.snap` snapshot files exist in the repo; no sitemap test exists that
  pins post content. `git grep` for the old title string
  ("leie lokale, hytte eller utstyr i Norge (2026)") turns up only inside
  `.agent/XAL-1163/SPEC.md` (a doc, not code — see below), confirming
  nothing executable hardcoded the old title.

**Cross-ticket dependency found and checked — XAL-1163 (merged to `main`,
PR #242, now in this branch's history via the earlier merge commit):**
that ticket's entire "no code work needed" verdict rests on this same
page's FAQPage JSON-LD citing the AEO target query
("beste nettside for å leie lokale, hytte eller utstyr i Norge") verbatim,
sourced from `blogFaq.mjs`'s `POST_FAQ[slug]` entry and asserted by
`blogFaq.test.ts`. Read XAL-1163's SPEC in full to check whether XAL-1161
could invalidate it: its own blast-radius section names the mechanism as
`POST_FAQ` → `BlogPost.tsx`/`SEO.tsx` (client) and `prerender.mjs` (static)
→ FAQPage JSON-LD, entirely independent of the post's `title` field (which
it only mentions as background context, not as load-bearing evidence).
XAL-1161 does not touch `blogFaq.mjs` or the body's `## Vanlige spørsmål`
section (confirmed by diff and by Round 1), and `blogFaq.test.ts` still
passes — so the AEO citation mechanism XAL-1163 relies on is intact.
Noted for the record since it's the kind of overlap this lens exists to
catch: the new H1/title ("Beste nettside for å leie lokale, hytte og
utstyr: 4 alternativer") no longer contains the literal phrase "i Norge"
that XAL-1163's target query does, but the exact-match text XAL-1163
actually depends on (URL slug, `keywords` frontmatter, and the FAQ
question/answer pair) is all untouched, so this is a title/H1-only
divergence from the literal query string, not a break of the citation
mechanism.

**Verification re-run this round:** `npx vitest run` — 17 files / 36 tests,
all still passing (re-ran fresh, not reusing Round 1's cached result).
`npx tsc --noEmit` — clean.

**Findings: none.** No consumer outside the files SPEC.md already named
depended on the old title/description/updated values in a way this change
breaks. The one cross-ticket dependency found (XAL-1163's AEO verdict) was
checked in full and confirmed unaffected — its load-bearing mechanism
(FAQPage JSON-LD) doesn't touch the fields this branch changed.

**Changes made this round:** none — nothing to fix.
