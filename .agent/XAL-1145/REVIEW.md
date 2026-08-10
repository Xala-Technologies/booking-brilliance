# XAL-1145 Review

## Round 1 — Correctness

Lens: does the change do what the acceptance criteria (SPEC.md's "WHAT
CHANGES" + the ticket's search-intent goal) say, on the edge cases too?
Checked against the spec, the diff (`git diff origin/main...HEAD`), and a
fresh build, not just the markdown source.

Checked:

- **Slug/filename consistency** — frontmatter `slug:` matches the filename
  exactly (`teambuilding-lokaler-bedrift-mote-veiledning-booking`), no other
  post claims the same slug. Pass.
- **readingMinutes correctness** — `BlogPost.tsx:100` computes
  `Math.round(words/200)` off the raw markdown body at render time.
  Recomputed it standalone with Node against the actual file: 1220 words →
  6. Frontmatter says `readingMinutes: 6`. Matches exactly (this is the
  exact class of bug XAL-1149 round 1 caught in a sibling post).
- **Word-count gate** — ran `node scripts/check-blog-word-count.mjs` fresh:
  passes both the markdown-source floor (200 words min, this post has
  1220) and the rendered-HTML check against `dist/blogg/<slug>/index.html`
  (1357 words in the rendered `<article>`, confirmed with the same
  extraction regex the script uses).
- **Build freshness** — `dist/blogg/teambuilding-lokaler-bedrift-mote-veiledning-booking/`
  was already present from an earlier session; verified via `stat` that the
  dist HTML's mtime is *after* the markdown source's mtime, i.e. not stale.
  Confirmed `<h1>`, `<title>`, canonical URL, and the sitemap.xml entry all
  render correctly and match the frontmatter.
- **Frontmatter shape** — every field matches `BlogFrontmatter` in
  `src/lib/blogFrontmatter.ts` (slug/title/description/date/author/role/
  readingMinutes/tag/cover/keywords). `date: 2026-08-10` parses as a bare
  string (not misparsed as a number — the frontmatter parser's integer/float
  regexes require the *whole* value to be numeric, so the dashes protect
  it), consistent with every sibling post. `cover` points at an image that
  actually exists on disk (`public/images/blog/booking_calendar_hero_no.webp`,
  167KB, already used by other Bedrift/Privatperson posts per SPEC).
- **Dedup / content-gap claim re-verified independently** (not trusting
  SPEC's own grep output) — re-ran
  `grep -rli "teambuilding" src/content/blog/*.md` and confirmed the three
  named near-neighbor posts (`idrettshall-bedrift-*`,
  `moterom-kurslokale-*`, `leie-lokale-privat-fest-*`) don't cover the
  combined aktivitetslokale + møterom + veiledningsrom same-day scenario.
  No duplicate `title:` or `description:` across all 313 posts.
- **CTA-stripping edge case** — `BlogPost.tsx:121-127` pops a trailing
  paragraph from the rendered body if it matches a "book a demo" CTA
  regex, to avoid duplicating the CTA band below the article. This post's
  final paragraph ("Se det i praksis") contains the literal phrase
  "Book en demo" mid-sentence. Checked all three regexes
  (`\[book (en )?demo`, `^\*\*\s*book en demo`, `book demo\s*→`) against
  the actual paragraph text — none match, so the paragraph survives
  correctly. No silent content loss.
- **Product-claim consistency** — this repo has no booking backend (content
  is pure marketing copy); verified the post doesn't invent capabilities
  unique to itself. `samlefaktura` (23 other posts), `sanntid`/
  `sanntidskalender` (206), `ombooking` (10), `attestasjon` (2) are all
  established site vocabulary used elsewhere, not new claims.

**Found (fixed this round):**

- `scripts/check-title-lengths.mjs` (informational, not build-blocking)
  flagged the post's `<title>` at 75 chars against the site's 65-char
  convention (only 2 pre-existing posts, both about weddings, already
  violate this — not a pattern to extend). Since the whole point of this
  ticket is to satisfy search intent for "teambuilding" in the SERP, and
  Google truncates titles around this length, a truncated title works
  against the ticket's own goal. Shortened `title` from
  "Teambuilding for bedrifter: book lokaler til aktivitet, møter og
  veiledning" (75 chars) to "Teambuilding for bedrifter: book lokaler til
  møter og veiledning" (64 chars) — keeps the primary keyword at the front
  and the ticket's own phrase "møter og veiledning" intact, drops the
  redundant "aktivitet" (aktivitetslokale is still covered extensively in
  the body and in the `keywords` list). `<h1>` is unaffected — components
  render `h1` from the post title, an `<h1>` isn't length-constrained the
  way a SERP `<title>` is, so no need to touch it separately beyond the
  frontmatter `title` field itself, which both `<title>` and `<h1>` derive
  from.

No other correctness issues found this round.

## Round 2 — Regression

Lens: what ELSE reads this code path? Grepped every consumer of
`src/content/blog/*.md` (not just the six SPEC.md's BLAST RADIUS names),
verified nothing depended on the old (pre-this-post) behaviour.

Consumers found beyond SPEC's list, via
`grep -rln "content/blog\|getAllPosts\|blog-meta\|postContent"`:

- `src/lib/post-slugs.test.ts` — asserts every post's slug is globally
  unique via `getAllPosts()`. Pass.
- `src/content/blog-xal739-aeo.test.ts` — pins `getPostBySlug` output for a
  *different* slug (`hva-koster-...`). Unaffected by an unrelated addition.
- `src/entry-server.main-landmark.test.tsx` — calls `getAllPosts()[0]` (the
  *first* post after sort) and SSRs it as the "first lazy route rendered"
  regression case for a real historical bug (suspended-fallback treated as
  settled). This is the one consumer that could plausibly break from adding
  a post: `src/lib/posts.ts:19` sorts `[...blogMeta].sort((a,b) => a.date <
  b.date ? 1 : -1)` — stable, but 41 other posts already share this post's
  `date: 2026-08-10`, so ties break on `blogMetaPlugin.ts`'s `fs.readdir`
  order (filesystem-dependent, not alphabetical). Ran the test: new post did
  not become index 0, test passes.
- `src/entry-server.h1.test.tsx` — pins other slugs, unaffected.
- `src/lib/webp-sources.test.ts` — validates every post's `cover` resolves
  to a real, non-preview image via `previewCover()`. This post reuses
  `booking_calendar_hero_no.webp` (already validated for sibling posts).
  Pass.
- `src/lib/search/corpus.ts` (Navbar search) and
  `src/components/BlogPreviewSection.tsx` (homepage teaser,
  `getAllPosts().slice(0, 6)`) — both consume `getAllPosts()` generically,
  no hardcoded slug/count/order assumption. A new dated-today post
  displacing an older one from the 6-post teaser is the *intended*
  behaviour of "newest 6", not a regression.
- `convex/content/publish.ts`, `scripts/sync-convex-blog-to-fs.ts`,
  `scripts/dedup-blog-drafts.ts`, `tools/content-agent/src/{publish,
  generate}.ts` — a separate Convex-draft → filesystem sync pipeline for a
  *different* authoring path. This post was committed directly, never a
  Convex draft, so none of these read or could collide with it.

Ran the full suite fresh, not just the files touched by SPEC's blast
radius: `npx vitest run` → **20 files, 40 tests, all pass.** Ran a full
clean build (`rm -rf dist dist-server && pnpm build`) end to end: 397
sitemap URLs (one new entry for this slug, no dupes), critical CSS inlined
on 398/398 pages, `check-blog-word-count.mjs` passes for all 313 posts
(source and rendered HTML), new post's prerendered HTML has exactly one
`<h1>` and a correct canonical URL. No consumer choked on the new file, no
existing behaviour changed for any other post.

**Found (fixed this round):**

- SPEC.md's BLAST RADIUS section asserted `grep -rli "teambuilding\|team
  building\|team-building" src/content/blog/*.md` returned **zero hits**
  before this change. Re-ran that exact command against the pre-existing
  posts (excluding the new file): it returns **four hits** —
  `idrettshall-booking-flere-haller-samlefaktura-bedrift.md` (uses
  "teambuilding" five times, including in its `description:` frontmatter),
  `idrettshall-ledige-tider-book-enkelttime-privatperson.md`,
  `idrettshall-ledige-tider-booke-uten-lag-privatperson.md`, and
  `idrettshall-privat-utleier-ledige-tider-booking-drift.md`. Confirmed via
  `git log --oneline --all` + `git merge-base --is-ancestor` these all
  landed on `origin/main` on 2026-08-09 (commit `e5c74c9`), well before
  this branch's fork point — a pre-existing research gap in SPEC.md's own
  dedup grep, not a concurrent-fleet collision. Round 1's re-run of the
  same grep checked only whether the *three named* near-neighbor posts
  covered the combined scenario and didn't notice the "zero hits" claim
  itself was wrong.
  - Severity assessed as low, not a blocker: in all four existing posts,
    "teambuilding" appears only as one example use-case among several
    (company sports nights, birthday parties, general idrettshall booking)
    inside body text or a description — never in the title, H1, slug, or
    `keywords:` frontmatter. This post is the only one in the corpus with
    "teambuilding" in its title, URL slug, and keywords list, so it's still
    the sole page targeting the keyword as a *primary* term — normal
    secondary-keyword overlap, not primary-keyword cannibalization. The
    ticket's core verdict (real, unowned content gap) stands.
  - Fix: corrected the false "zero hits" claim in SPEC.md's BLAST RADIUS
    section to state the actual grep result and this severity assessment,
    so the record doesn't carry a factual error forward for a future round
    or reader to trust unverified.

No other regressions found this round.

## Round 3 — Security

Lens: authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path, or a page. Worked against the
diff (`git diff origin/main...HEAD`), not just the two docs — the only
runtime-relevant file in it is the new markdown post itself.

Checked:

- **Tenant isolation / authz** — this repo has no booking backend, no auth,
  no multi-tenant data model at all (confirmed repo-wide in an earlier
  session, see memory `project_repo_has_no_booking_domain`). A new static
  blog post carries zero authz surface: no route guard, no role check, no
  per-tenant data to leak across. N/A, not a gap — there is nothing here
  for this lens to find because the domain doesn't exist in this repo.
- **User-supplied input reaching a query/path/page** — none. The new file
  is agent-authored content committed directly to the repo; nothing in the
  request/render path takes untrusted input and feeds it into this post.
  The one place a *slug* value ever reaches a filesystem path is
  `scripts/prerender.mjs:2562` (`join(DIST, "blogg", post.slug)`) and
  `scripts/prerender.mjs:2495` (`/blogg/${post.slug}`) — this post's own
  `slug:` frontmatter is `teambuilding-lokaler-bedrift-mote-veiledning-booking`,
  matches the filename exactly (already verified round 1), and contains
  only `[a-z0-9-]`, so no `../` or path-separator payload reaches that
  `join()`/template literal. (The fact that `prerender.mjs` doesn't
  independently validate `slug` against a traversal pattern is pre-existing
  architecture untouched by this diff — out of scope for a content-only PR
  and not something this round introduces or worsens.)
- **Markdown → HTML injection (XSS)** — `src/pages/BlogPost.tsx` renders
  the body through `react-markdown` (`ReactMarkdown` +`remarkGfm`), and
  `rehype-raw` is not installed or imported anywhere in `src/`
  (`grep -rn "rehype-raw\|rehypeRaw" src/ package.json` → zero hits), so
  raw HTML inside a post body is stripped/escaped by `react-markdown`'s
  default sanitizing behaviour, not rendered as live markup — a
  `<script>`/`onerror=`/`javascript:`-style payload in a post body
  wouldn't execute even if present. Confirmed the new post's body contains
  none of that anyway: `grep -nE '<script|javascript:|onerror=|onload=|<iframe|<img|<a |data:text/html'`
  → zero hits. No markdown links (`[text](url)`) in the post at all, so no
  open-redirect/href risk either.
- **JSON-LD injection** — `scripts/prerender.mjs` builds this post's
  `<script type="application/ld+json">` block via `JSON.stringify` on
  frontmatter-derived fields (title/description), which doesn't escape a
  literal `</script>` sequence inside a string value — a value containing
  `</script><script>...` could in principle break out of the JSON-LD block
  in the static HTML. This post's `title`/`description`/`keywords` contain
  no `<`, `>`, `&`, or `"` characters at all (verified by inspecting the
  frontmatter block directly), so nothing in this diff exercises that
  pattern. (Same caveat as the slug point above: the missing escaping in
  `prerender.mjs` is pre-existing, shared by all 313 posts, and not
  something this diff introduces — flagged for awareness, not fixed here,
  since fixing shared prerender logic is outside a content-only ticket's
  blast radius and risks regressing 312 other posts' JSON-LD untested by
  this round.)
- **Secrets** — scanned the new markdown file for API keys, tokens,
  passwords, bearer tokens, and PEM/private-key headers
  (`grep -niE 'api[_-]?key|secret|token|password|bearer|-----BEGIN|sk-[a-z0-9]|ghp_'`)
  → zero hits. `author: "Ibrahim Rahmani"` / `role: "Grunnlegger, Digilist"`
  matches the exact byline used on all 313 existing posts (`grep -l`
  confirms), not a new PII disclosure.
- **Pricing/factual claims as a disclosure risk** — the post states
  indicative price ranges (kr/time, depositum) as generic market figures,
  consistent with round 1's "Product-claim consistency" finding; no
  customer-specific, tenant-specific, or internal data is referenced.

**Found:** nothing exploitable introduced by this diff. The two
pre-existing gaps noted above (`prerender.mjs` doesn't validate `slug`
against path-traversal characters before `join()`; JSON-LD blocks across
all posts aren't escaped against a literal `</script>` in a string field)
predate this branch, apply identically to all 313 other posts, and aren't
exercised by this post's actual content — recorded here for visibility,
not fixed, since a content-only PR touching one new file is the wrong
place to change shared prerender logic untested against the other 312
posts it would affect.

No code changes made this round; nothing to re-test beyond what round 2
already ran (full suite + full build, both green).

## Round 4 — Scope

Lens: is anything here NOT the stated change? Looked for drive-by edits,
unrelated tidying, or files nobody asked to have touched. Worked from
`git diff origin/main...HEAD --stat` and `--name-only` (the full file list,
not just the files earlier rounds happened to open) and cross-checked each
file against SPEC.md's "WHAT CHANGES".

Checked:

- **Full file list for the branch** — `git log --oneline origin/main..HEAD`
  shows exactly 5 commits, all `XAL-1145`-scoped (the chore/content commit
  plus rounds 1-3). `git diff origin/main...HEAD --stat` shows exactly
  3 files touched, all pure additions (488 insertions, 0 deletions, 0
  renames, 0 file modifications to anything pre-existing):
  - `src/content/blog/teambuilding-lokaler-bedrift-mote-veiledning-booking.md`
    (new) — the one content change the ticket asked for.
  - `.agent/XAL-1145/SPEC.md` (new) — the required step-0 investigation
    record.
  - `.agent/XAL-1145/REVIEW.md` (new) — the required adversarial-review
    record, including this section.
  No other file in the repo — no sibling blog post, no script, no config,
  no test, no `dist/`/`dist-server/` build output — appears anywhere in the
  diff.
- **No edits to existing posts** — confirmed via the stat output there are
  zero modifications to any of the other 313 posts in
  `src/content/blog/*.md`. Round 2's dedup-severity finding (four
  pre-existing posts already use "teambuilding" as a secondary keyword)
  could have tempted a fix-the-neighbors drive-by (e.g. trimming
  "teambuilding" out of those posts' descriptions to reduce keyword
  overlap); no such edit was made — correctly out of scope for a
  content-addition ticket, and round 2 explicitly reasoned about severity
  instead of touching those files.
- **No shared-infrastructure edits** — rounds 1 and 3 both surfaced
  pre-existing, unrelated issues while investigating (round 1:
  `check-title-lengths.mjs` convention; round 3: `prerender.mjs`'s
  unescaped JSON-LD and unvalidated slug, shared by all 313 posts). Neither
  was touched. Round 1's only actual code change was inside the new post's
  own frontmatter (`title:` field), not a script or shared component —
  in-scope because it's a change to the file this ticket adds, not a
  drive-by elsewhere.
- **No stray content in the two doc files** —
  `grep -n "XAL-" .agent/XAL-1145/SPEC.md .agent/XAL-1145/REVIEW.md` returns
  only `XAL-1145` (this ticket) and one legitimate cross-reference to
  `XAL-1149` (cited in SPEC.md and round 1 as precedent for the
  `readingMinutes` bug class, not scope creep — it's a citation, nothing
  from that ticket was copied in or modified).
- **`git status`** — clean; no untracked or modified files sitting outside
  the diff (no stray `dist/` output, no editor artifacts, no leftover
  scratch files from earlier sessions).

**Found:** nothing. The entire diff is the one new blog post plus the two
process documents the workflow itself requires (SPEC.md, REVIEW.md) — no
drive-by edits, no unrelated tidying, no files touched beyond what
SPEC.md's "WHAT CHANGES" section declared up front.

No fixes needed this round; no re-test required (no code changed).

## Round 5 — Step 0 (root `AGENT-SPEC.md`) and proof

This round's resumed-run preamble again said the root-level
`AGENT-SPEC.md` doesn't exist and asked for it to be written from the code
and attached to the Linear issue. Not done, for the same reason round 2
already recorded and this round re-verified against current history:
`git log --all --oneline` still shows `15c7b14` ("chore: remove agent
scaffolding from main") as the newest commit touching that path, which
deleted a tracked root `AGENT-SPEC.md` specifically because every agent
branch's own copy collided as modify/delete against main's and blocked
PRs #236/#237 on nothing else. Sibling branches that backfilled it anyway
(XAL-1156 `1f15d02`, XAL-1159 `51a5a5a`→reverted `00143fc`, XAL-1161
`af9f7c3`→reverted `54ebef6`) had to revert it in a later round. Recreating
it here would reintroduce the exact merge-conflict trap main paid to
remove, for a file that only gets deleted again. `.agent/XAL-1145/SPEC.md`
already carries the diagram and verdict step 0 exists to produce (see its
BLAST RADIUS / mermaid diagram, written before the content commit). No
Linear MCP tool is reachable in this environment either (confirmed
XAL-1151/1155/1159/1161), so "attach it to the issue" stays unreachable
regardless of where the file lived.

Proof this round — this is a pure content addition (new behaviour with no
"before" state), so per the merge-gate rule only the AFTER is captured:

- Ran a full fresh `pnpm build`. Confirmed
  `dist/blogg/teambuilding-lokaler-bedrift-mote-veiledning-booking/index.html`
  is produced, sitemap regenerated to 397 URLs, and both word-count gates
  pass.
- Served `dist/` with `pnpm preview` and drove it with `agent-browser`:
  - `.agent/XAL-1145/proof/after-teambuilding-post-hero.png` — the
    article page at its real URL, showing the H1 ("Teambuilding for
    bedrifter: book lokaler til møter og veiledning"), byline, tag
    ("BEDRIFT"), date, and "6 MIN LESETID" matching the frontmatter fix
    from round 1.
  - `.agent/XAL-1145/proof/after-teambuilding-post-full.png` — full-page
    capture of the same article.
  - `.agent/XAL-1145/proof/after-blogg-listing-search.png` — the `/blogg`
    listing page with the new post's card visible (title, tag, date,
    author, reading time), confirming it's picked up by `getAllPosts()`
    with no registration step, per SPEC.md's BLAST RADIUS.
  - Also confirmed via `curl` against the running preview server that
    `<title>` and `<h1>` on the live route match the frontmatter exactly.

No code changes this round; nothing to re-test beyond what rounds 1-3
already ran.
