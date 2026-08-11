# XAL-1099 — Review log

## Round 1 — CORRECTNESS

Lens: does the diff do what the acceptance criteria say, on the edge cases
too? Checked SPEC.md against `git diff origin/main...HEAD`, then read the
new post body in full, then ran the tests that touch blog content.

### What I checked

- Frontmatter shape against `src/lib/blogFrontmatter.ts` (`parseFrontmatter`
  / `extractFrontmatter`): all required fields present, `keywords` as a
  bracketed array parses correctly, `date` parses to ISO.
- Frontmatter shape against `scripts/prerender.mjs` `loadBlogPosts()`'s
  separate regex parser (used for `<title>`/meta/Article JSON-LD at build
  time): title with an embedded colon inside the quoted value still parses
  correctly (`[^"]+` doesn't care about colons, only quotes); date, author,
  tag, cover all extract cleanly.
- `description` length: 151 chars, under the ~160-char truncation point
  pinned by `src/lib/digitalt-bookingsystem-description.test.ts`'s pattern.
- `tag: "IT-leder"` — free-form string (not an enforced enum), and matches
  an existing convention used 26 times across other posts.
- All four cross-linked slugs
  (`bookingsystem-integrasjoner-kalender-epost-notifikasjoner`,
  `endre-kansellere-booking-selv-paaminnelser`,
  `sanntidskalender-kommunal-booking`, `brukerstyring-og-tilgangskontroll`)
  and both linked pages (`/bookingsystem-kommune`, `/bookingsystem-utleie`,
  both registered routes in `src/App.tsx`) resolve to real files/routes —
  no dead links.
- Cover image (`digital_booking_importance_hero_no.webp`) exists in
  `public/images/blog/`, reused as the SPEC said (no new asset).
- Body uses `##` headings only (no bare `# H1`), matching the sibling-post
  convention where `post.title` renders the page's H1 separately
  (`BlogPost.tsx:200`) — avoids the duplicate/missing-H1 class of bug this
  repo has hit before.
- `readingMinutes: 7` vs actual body word count (1353 words / ~200wpm ≈
  6.8 min) — consistent, not a stale guess.
- Target keyword "bokingsystem" (one *b*) appears in the title, the first
  sentence, and the keywords array — satisfies the stated search-intent
  goal.
- Ran `post-slugs.test.ts` and `blogFaq.test.ts` — both pass; no slug
  collision.

### Findings

1. **Scope creep: `pnpm-workspace.yaml` was modified and committed, but
   this is a content-only ticket.** The wip checkpoint commit (`079e35a`)
   added an `allowBuilds` block (`@swc/core`, `better-sqlite3`, `esbuild`,
   `sharp`) that isn't present on `origin/main` and has nothing to do with
   the blog post. It's a local-environment byproduct (running
   `pnpm approve-builds --all`, see memory note on this repo needing that
   before `pnpm build`) that got swept into a commit instead of staying
   local. SPEC.md's own "WHAT CHANGES" section says "No code changes —
   this is a content-only addition," so this contradicts the plan of
   record. **Fixed**: reverted `pnpm-workspace.yaml` to match
   `origin/main`.

2. **SPEC.md drift: the "WHAT CHANGES" section claims the post body
   "includes one mermaid diagram of the admin-configuration →
   adoption-outcome relationship," but the shipped post has no mermaid
   block.** Checked why: `BlogPost.tsx` renders body markdown through
   `ReactMarkdown` with only `remarkGfm` (`BlogPost.tsx:2-3, 231-235`) — no
   mermaid plugin anywhere in the repo (`grep -l '```mermaid'
   src/content/blog/*.md` → zero other posts use it either). A ```mermaid
   fenced block in the post body would render as an inert code listing, not
   a diagram — so *not* putting it there was the right call; the diagram
   that exists is in SPEC.md's own BLAST RADIUS section, documenting the
   pipeline, not the post. But the SPEC sentence itself is now a false
   claim about what got shipped, which will mislead the next
   session/reviewer reading it as the record. **Fixed**: corrected that
   sentence in SPEC.md to state the diagram is architecture documentation
   in SPEC.md, not post content, and say why (no mermaid renderer wired
   up).

No correctness defects found in the post content itself — frontmatter,
links, word count vs. reading time, and SEO keyword placement all check
out. Both findings above are about the diff carrying things the SPEC didn't
actually authorize (an unrelated infra file) or no longer accurately
describes (the mermaid claim), not about the article being wrong.

## Round 2 — REGRESSION

Lens: what ELSE reads this code path — every consumer of blog content, not
just the ones SPEC.md's BLAST RADIUS section already named — and does
anything depend on behaviour this new file changes?

### What I checked

Grepped every file under `src/`, `scripts/`, `build-plugins/` for
`getAllPosts`, `virtual:blog-meta`, and `content/blog` to build a complete
consumer list, independent of what SPEC.md already claimed. Found six
consumers SPEC.md's BLAST RADIUS section did *not* mention:

- `src/entry-server.main-landmark.test.tsx`
- `src/lib/webp-sources.test.ts`
- `src/lib/leie-selskapslokale-description.test.ts`
- `scripts/guard-blog-redirects.mjs`
- `scripts/dedup-blog-drafts.ts`
- `scripts/sync-convex-blog-to-fs.ts`

The first three run in the test suite and touch `getAllPosts()` directly, so
they're real regression surface. The other three are fleet/Convex-side
scripts that don't read the committed file at all (they read from Convex,
or grep git-changed files) — checked their logic to confirm and moved on.

**The one genuine behavioural change**: the new post is dated `2026-08-11`,
one day newer than every other post in `src/content/blog/` (all `2026-08-10`
or older — confirmed via `grep -h "^date:" src/content/blog/*.md | sort -r`).
Since `getAllPosts()` sorts by date descending, this post is now
`getAllPosts()[0]` — the "first" post. Two consumers key off exactly that:

- `src/entry-server.main-landmark.test.tsx` renders `getAllPosts()[0]` by
  route as its regression case for a past SSR bug (a still-suspended lazy
  route being misread as "settled", shipping HTML with no `<main>`). That
  test now exercises *this* post's route instead of whatever was previously
  newest — a real change in which content the regression test happens to
  cover, not a code change, but worth surfacing since it's exactly the kind
  of implicit coupling a content-only diff can silently break.
- `src/components/BlogPreviewSection.tsx` (`getAllPosts().slice(0, 6)`,
  homepage teaser) will now surface this post first on the homepage. No
  test pins specific slugs there, so nothing to fix, just confirming it's
  expected.

`src/lib/webp-sources.test.ts` iterates *every* post's cover via
`previewCover()` and asserts the webp sibling exists on disk — the new
post's cover (`digital_booking_importance_hero_no.webp`, reused, no new
asset per SPEC) is already covered by an earlier post using the same file,
so this was never at risk, but it's in the consumer set so I ran it anyway.
`src/lib/leie-selskapslokale-description.test.ts` filters `getAllPosts()`
by a specific unrelated slug — structurally identical to
`digitalt-bookingsystem-description.test.ts` (already checked in Round 1)
and unaffected by an unrelated post being added to the array.

`scripts/guard-blog-redirects.mjs` is the sharpest miss risk here: it
probes each *changed* blog slug against the live site for a standing
server-side 301 (a slug "claimed" by an earlier content-consolidation
redirect) and deletes the file if so — exactly the failure class that
silently reddened every deploy on 2026-07-23 per its own header comment.
It isn't wired into this repo's CI (`grep -rl content:guard .github` →
nothing; it's a manual `pnpm content:guard` / fleet-runner step, not a git
hook here), so it doesn't run automatically in this session, and probing
production from here isn't something to do speculatively. Ran its
`--self-test` (offline parser unit-checks) to confirm the parsing logic
itself isn't broken by anything in this diff — passed. The slug
`bokingsystem-funksjonalitet-admin-paaminnelser-kalender-brukerkontroll` is
new and specific enough that a pre-existing consolidation redirect claiming
it is unlikely, but this is the one thing in the regression surface that
genuinely can't be fully verified offline — flagging it rather than
asserting it's fine.

`scripts/dedup-blog-drafts.ts` operates on Convex draft records, not
committed files — checked its `MANGLED` slug set, the new slug isn't in it
and the script doesn't touch `src/content/blog/*.md` at all.
`scripts/sync-convex-blog-to-fs.ts` only *writes* to `src/content/blog/`
from Convex; it doesn't read the existing files as input, so it has nothing
to regress against.

Ran the full consumer-relevant test set plus the whole unit suite:
`entry-server.main-landmark.test.tsx`, `webp-sources.test.ts`,
`post-slugs.test.ts`, `digitalt-bookingsystem-description.test.ts`,
`leie-selskapslokale-description.test.ts`, `blogFaq.test.ts`, and then the
full `vitest run` — 20 files, 40 tests, all passed, including the
`getAllPosts()[0]`-dependent SSR landmark test now exercising this post's
route end-to-end.

### Findings

No regressions. The only behavioural change from adding this file — it
becoming `getAllPosts()[0]` because it's the newest-dated post — was
already covered by an existing generic test (not slug-specific), and that
test passes against this post's actual rendered HTML. No fix needed; no
code or content change made this round.

## Round 3 — SECURITY

Lens: authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path, or a page.

### What I checked

This diff has no code changes (confirmed via `git diff origin/main...HEAD
--stat`: only `.agent/XAL-1099/{SPEC,REVIEW}.md` and one new content
Markdown file). There is no authz surface, no tenant boundary, and no
query of any kind touched by adding one static blog post, so most of this
lens doesn't apply by construction. What's left to check for a
content-only diff is narrower: does the new content itself carry anything
that becomes dangerous once it passes through the rendering/prerender
pipeline, and does that pipeline handle it safely.

- **Secrets**: grepped the new file's diff for key/token/secret/credential
  patterns (`sk-`, `api[_-]?key`, `token`, `password`, `secret`, `bearer`,
  AWS-key shape, PEM headers) — zero matches. Content is prose plus a
  frontmatter block; nothing resembling a credential.
- **Injection into the frontmatter parsers**: `scripts/prerender.mjs`
  parses frontmatter with a hand-rolled regex (`loadBlogPosts`, `kv =
  line.match(...)`), and `src/lib/blogFrontmatter.ts` does the same for
  the client build. Both are naive string/regex parsers, not a schema
  validator, so a frontmatter value containing an unescaped `"` or a
  literal newline could corrupt parsing or smuggle extra fields. Checked
  every frontmatter value in the new post character-by-character: `title`,
  `description`, `author`, `role`, `tag`, `cover`, and every entry in
  `keywords` — none contain a `"`, backslash, angle bracket, or newline.
  Clean.
- **XSS surface at render time**: `BlogPost.tsx` renders the Markdown body
  through `ReactMarkdown` with only the `remarkGfm` plugin — no
  `rehype-raw` (confirmed by grepping the repo, same finding Round 1 made
  for a different reason). That means even if the body *did* contain raw
  `<script>`/`<img onerror>` HTML, it would render as literal text, not
  execute. The new post's body contains no raw HTML tags at all, only
  Markdown syntax (headings, bold, links, list items) — verified by
  reading the full body.
- **XSS surface at prerender time (the one adjacent finding)**: unlike the
  client-side render path, `scripts/prerender.mjs` builds the static
  `<head>` by string-substituting `meta.title` and `meta.description`
  directly into `<title>`, `<meta name="title">`, `<meta
  name="description">`, `og:title`, and `og:description` attribute values
  (`prerender.mjs:2292-2339`) with **no HTML-escaping** — a value
  containing `"` would break out of the attribute, and one containing
  `</title>` or similar would inject markup into the prerendered HTML that
  ships to every visitor and every crawler. Notably, the adjacent
  `<meta name="keywords">` substitution *does* escape (`.replace(/"/g,
  "&quot;")` at line 2323) — so the gap is specific to `title` and
  `description`, not the whole pipeline, suggesting it was patched for
  keywords (probably because those are partly fed from
  `DISCOVERED_KEYWORDS`, an external/live source) but never extended to
  title/description. This is a real gap, but it is **pre-existing across
  every one of the ~130+ posts already in the repo**, not introduced by
  this diff, and the fix belongs in the shared prerender script, not in a
  content-only PR that doesn't touch code. Checked whether this specific
  post's `title`/`description` trip it: both are plain prose with no `"`,
  `<`, or `>` anywhere (verified above) — this post ships safely through
  the gap without triggering it. Flagging for a future ticket against
  `prerender.mjs`, not fixing here: fixing it would mean editing a shared
  script outside this ticket's scope, on a branch whose only sanctioned
  change is one Markdown file, for a gap this post doesn't exercise.
- **Authz / tenant isolation**: not applicable — there is no per-tenant or
  per-role data path anywhere in this diff. The post's own content
  *discusses* role-based access control (`brukerkontroll` — roles like
  saksbehandler/driftsleder/lagkoordinator) as its subject matter, but
  that's prose describing a product capability, not code that implements
  or checks one.
- **User-supplied input reaching a query/path/page**: none. The slug,
  frontmatter, and body are all author-written and committed to Git, not
  derived from a request, a form, or an external API at request time.
  Confirmed both discovery mechanisms are filesystem directory scans
  (`fs.readdir` / `import.meta.glob`), not string-built paths from any
  untrusted input.

### Findings

No security defects in this diff. One adjacent, pre-existing gap noted
above (unescaped `title`/`description` interpolation in
`scripts/prerender.mjs`'s prerender step) — real, but not caused by this
change, not exercised by this post's actual content, and out of scope to
fix on a content-only ticket. No fix made this round; re-ran the
consumer-relevant test set (`post-slugs.test.ts`, `blogFaq.test.ts`,
`entry-server.main-landmark.test.tsx`, `webp-sources.test.ts` — 9 tests,
all pass) to confirm the tree is still green going into Round 4.
