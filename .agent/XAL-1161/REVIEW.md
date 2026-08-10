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

## Round 3 — Security

**Lens:** authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path, or a page. Read the full diff
(`git diff origin/main...HEAD`), then traced every place the changed
strings (title, description, body markdown, new links) actually flow to,
rather than assuming a content-only diff is automatically safe.

**Checked:**

- **Injection surface of the new content itself:** new title/description
  strings contain no quotes, angle brackets, or other HTML-special
  characters that could break out of an attribute or tag context. Not
  attacker-controlled either way — authored by this session, same trust
  level as the rest of the corpus.
- **Markdown → HTML rendering path:** `BlogPost.tsx` renders body markdown
  via `react-markdown` + `remark-gfm` only — grepped for `rehype-raw` and
  `dangerouslySetInnerHTML` across `scripts/prerender.mjs`,
  `src/pages/BlogPost.tsx`, `src/components/SEO.tsx`: none present. Raw
  HTML embedded in markdown is not rendered as HTML by this pipeline, so
  even hostile markdown body content couldn't inject a script tag through
  this post. The new content added this round (bullet list, bold lead-ins,
  two inline links, one CTA link) is all plain, supported Markdown/GFM
  syntax — nothing exercises an unusual renderer path.
- **`SEO.tsx` meta-tag injection:** `setMeta()` (`SEO.tsx:99-106`) sets
  content via `element.setAttribute("content", content)` — a DOM API, not
  string concatenation into an HTML template — so it's immune to
  attribute-breakout injection regardless of what's in `title`/
  `description`. JSON-LD blocks are built as plain JS objects and
  serialized (consistent with `prerender.mjs`'s pattern below), which
  escapes correctly.
- **`prerender.mjs` `patchHTML()` (static path) — pre-existing gap, not
  introduced by this diff:** `title`/`description` are spliced into the
  static `<title>`, `<meta name="title">`, and `<meta name="description">`
  tags via raw `.replace()` string interpolation
  (`scripts/prerender.mjs:2286-2296`) with **no HTML-escaping**, unlike the
  adjacent `keywords` merge three lines below it which explicitly does
  `.replace(/"/g, "&quot;")` before interpolating. Confirmed this function
  is unchanged by this branch (diff touches only the one `.md` file) and
  that the new title/description values contain no `"`/`<`/`>` characters,
  so nothing breaks out of the tag today. Flagging as a pre-existing
  latent gap for whoever next edits `patchHTML()` or a post whose
  title/description might contain a quote — not a defect of this diff,
  and not fixed here since it's out of this ticket's file scope
  (`scripts/prerender.mjs` is explicitly out of scope per SPEC.md's
  "WHAT CHANGES" section, and touching shared prerender code is exactly
  the cross-branch conflict risk the ticket warns against).
- **New internal links / CTA route:** `/bruksomrader/idrettshaller-gymsaler`,
  `/bruksomrader/moterom`, `/bookingsystem-utleie` — all three confirmed as
  public, unauthenticated marketing routes in `src/App.tsx:305,378-379`
  (`<BookingsystemUtleie>`, `<UseCaseMoterom>`, `<UseCaseIdrettshaller>`).
  None cross into `/dashboard`, `/admin`, or any authenticated/tenant-scoped
  surface — no privilege or tenant-boundary concern.
- **Tenant isolation / authz:** not applicable — this diff touches no
  query, no API call, no auth-gated route, no tenant-scoped data. It's a
  static content file consumed by two read-only rendering paths (client SPA
  and build-time prerender), neither of which takes user input at request
  time for this route.
- **Secrets:** grepped the full diff (including `.agent/`,
  `AGENT-GOAL.md`, `AGENT-SPEC.md` scaffolding added this branch) for
  key/token/secret/password/bearer patterns — only hit is the literal
  string "Security considerations" in a checklist template header, not an
  actual secret.

**Verification re-run this round:** `npx vitest run` — 17 files / 36 tests,
all still passing. `npx tsc --noEmit` — clean.

**Findings: none.** This diff has no authz, tenant-isolation, injection, or
secrets surface — it's a static-content edit to one blog post's
frontmatter and body, rendered through paths that don't interpolate raw
HTML from markdown and don't string-concat the changed fields into
attribute contexts (client path uses `setAttribute`; the one raw-concat
site, `patchHTML()`, is pre-existing, untouched by this diff, and not
triggered by the new content's character set). Noted the `patchHTML()`
escaping gap for future awareness; not fixing it here as it's outside this
ticket's file scope and not exploitable by this diff's actual content.

**Changes made this round:** none — nothing to fix.
