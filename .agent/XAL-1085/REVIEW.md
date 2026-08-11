# XAL-1085 — Review log

## Round 1 (lens: correctness)

**Question:** does the diff do what SPEC.md's acceptance criteria say, including
the edge cases (FAQ verbatim match, slug uniqueness, cross-link validity, build
gates)?

**Checked:**
- `.agent/XAL-1085/SPEC.md` already existed and was already committed (in
  `9ce7321`) with a full diagram and blast-radius section — step 0 from the
  resume instructions was in fact already done in an earlier session; nothing
  to redo there. `REVIEW.md` did not exist yet, so this is genuinely round 1.
- FAQ verbatim match: programmatically diffed the post's `## Vanlige spørsmål`
  body against `POST_FAQ["dans-og-kunstnerstudier-atelier-for-opplaering"]` in
  `src/content/blogFaq.mjs` (all 4 Q&A pairs) — exact match, both directions.
  (`blogFaq.test.ts` only pins one specific legacy slug, so this pairing isn't
  test-enforced; verified by hand instead.)
- Slug uniqueness: grepped every `.md` for the new slug — only one hit.
- All four cross-linked slugs
  (`kunstner-verksteder-studio-dansesaler-kreative-lokaler`,
  `leie-ovingsrom-musikk-dans-studio`,
  `spesiallokaler-niche-utleie-teaterscene-kjeller`,
  `booking-spesialiserte-trening-kunstnerlokaler`) resolve to real files; link
  markdown syntax (`/blogg/<slug>`) matches the pattern used elsewhere.
- Frontmatter fields all present and correctly typed per
  `BlogFrontmatter`/`extractFrontmatter` in `blogFrontmatter.ts`; `tag:
  "Privatperson"` is a real tag used elsewhere; `cover` image exists in
  `public/images/blog/`; `date: 2026-08-11` matches today and sibling posts
  published the same day; `keywords` leads with the bare target term `"dans"`
  per spec.
- Product-feature claims in the body (`serietidsbestilling`,
  `sammenhengende reservasjon`) aren't invented — both terms are used
  consistently across 11 other existing posts, so the new post isn't
  asserting a feature nothing else claims.
- `pnpm vitest run src/lib/post-slugs.test.ts src/content/blogFaq.test.ts` —
  3/3 pass.
- `node scripts/check-title-lengths.mjs` — new post: `ok 56` chars, within
  the 65-char budget.
- Full `pnpm build` — prerender succeeds (415 pages), word-count gate passes
  for all 330 posts including the new one, sitemap regenerated. Confirmed
  `dist/blogg/dans-og-kunstnerstudier-atelier-for-opplaering/index.html`
  exists, contains `FAQPage` JSON-LD, and contains the FAQ answer text.

**Found:** nothing. No correctness defects on any of the above — content,
frontmatter, cross-links, FAQ wiring, and build gates all match what the
spec/acceptance criteria require, including the edge cases (verbatim FAQ
match, slug collision, cross-link existence, title/word-count budgets).

**Changed:** nothing (no fixes needed this round).

## Round 2 (lens: regression)

**Question:** what ELSE reads this code path besides the files edited? Grep
every consumer of `src/content/blog/*.md` and `blogFaq.mjs`, not just
`BlogPost.tsx`/`blogFaq.test.ts`, and check nothing depended on the old
behaviour (i.e. the world *without* this slug).

**Checked every consumer, not just the ones the diff touches:**

- `src/lib/posts.ts` / `virtual:blog-meta`, `src/lib/postContent.ts` — glob
  over `src/content/blog/*.md`, no per-post registry; new file is picked up
  by construction, confirmed already in round 1's `pnpm build`.
- `src/lib/search/corpus.ts::getSearchCorpus()` — maps `getAllPosts()` into
  search index items with no allowlist; new post is auto-searchable. Its
  `faqItems` come from `src/content/faq.ts::allFAQEntries()`, a **separate**
  site-wide FAQ system, untouched by this diff — confirmed the two FAQ
  systems (`blogFaq.mjs` per-post JSON-LD vs. `faq.ts` site FAQ page) don't
  overlap, so there's no risk of the new `POST_FAQ` entry leaking into
  `/faq`.
- `src/pages/BlogPost.tsx` sidebar `sidebarRelated` (line 110-117) — filters
  `getAllPosts()` by `p.tag === post.tag`, no hardcoded list. New post
  (`tag: "Privatperson"`) now participates in that filter for itself and for
  every *other* Privatperson post's sidebar — this is the intended dynamic
  behaviour, not a regression; nothing hardcoded a "3 posts" or "N tags"
  expectation anywhere that this would break.
- `src/pages/Blog.tsx` — tag list (`allPosts.forEach(p => set.add(p.tag))`)
  and count strings (`${allPosts.length} ARTIKLER`) are both derived from
  `getAllPosts().length`, not a hardcoded 330/331; no update needed, no
  drift risk.
- `scripts/verify-live.mjs::findDuplicateTitles` — groups posts by rendered
  `<title>` and fails on any group with >1 slug. Diffed the new title
  `"Dans- og kunstnerstudier: atelier for opplæring og øving"` (56 chars,
  renders verbatim per `check-title-lengths.mjs`'s >50-char rule) against
  every other post's `title` frontmatter — no collision.
- `src/content/blogFaq.test.ts` — re-read closely: it pins only one legacy
  slug (`beste-nettside-leie-lokale-hytte-utstyr-norge`) verbatim, it does
  **not** iterate all `POST_FAQ` keys generically, so it can't catch a
  malformed new entry — this was already known (spec/round 1 flagged it and
  verified the new entry by hand instead), re-confirmed by reading the test
  file directly rather than trusting the summary.
- `scripts/auto-publish-blogs.ts`, `dedup-blog-drafts.ts`,
  `diag-blog-drafts.ts` — greped for `readdir`/frontmatter handling; these
  operate on a separate Convex-backed drafts pipeline, not
  `src/content/blog/*.md` directly, so they don't touch a post that was
  committed straight to the repo. No interaction.
- No RSS feed exists in this repo (checked) — nothing to regenerate.
- Grepped the whole repo for the new slug string and the four cross-linked
  slugs: the only hits are the new post itself, `blogFaq.mjs`, and the
  cross-linked files it points *to* — none of those four files were
  modified to link back, consistent with SPEC's one-direction linking
  decision (avoids touching already-shipped files). No stale reference to
  the old world (i.e. no code assumed this slug's absence).
- Full `pnpm vitest run` (not just the two files round 1 targeted): **21
  test files, 45 tests, all pass** — including SSR `<h1>`/main-landmark
  tests, route-split tests, and every other post's slug/FAQ tests. No
  regression anywhere in the suite.

**Found:** nothing. Every consumer of blog content is either fully dynamic
(glob/`getAllPosts()`-driven, no registry to forget) or scoped/pinned to
slugs unrelated to this one. The two FAQ systems don't cross-contaminate.
No hardcoded counts, titles, or slug lists anywhere depended on this slug's
prior non-existence.

**Changed:** nothing (no fixes needed this round).

## Round 3 (lens: security)

**Question:** authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path or a page. This repo has no
booking/tenant domain (confirmed repeatedly, see
`project_repo_has_no_booking_domain.md`), so the lens narrows to what a
content-only diff can actually introduce: markdown→HTML injection (XSS),
JSON-LD script-injection, unsafe link handling, secrets, and path-traversal
via the new slug.

**Checked:**
- **XSS via markdown rendering:** `src/pages/BlogPost.tsx` renders post
  bodies with `<ReactMarkdown remarkPlugins={[remarkGfm]}>` and no
  `rehype-raw` plugin anywhere in the tree (grepped the whole repo for
  `rehype-raw`/`dangerouslySetInnerHTML` in the blog render path — zero
  hits). react-markdown without `rehype-raw` does not render raw HTML nodes,
  it escapes them, so even if the new post's body contained literal HTML
  tags they would print as text, not execute. The new post's body is plain
  Markdown prose/links/lists only — no raw HTML in it regardless.
- **Static prerender uses the same renderer:** `scripts/prerender.mjs`
  doesn't run a second, separate markdown-to-HTML converter — it drives
  `renderBody(route)` against the real client route (confirmed: no
  `markdown-it`/`marked` import, no independent HTML-from-markdown step),
  so the prerendered `dist/blogg/<slug>/index.html` goes through the exact
  same escaping as the client render. No divergent, less-safe path for the
  static build.
- **JSON-LD injection:** `scripts/prerender.mjs:2556` builds the per-post
  `<script type="application/ld+json">` block via
  `JSON.stringify(postLDBlocks)`. `JSON.stringify` escapes quotes/backslashes
  correctly, so the four new Q&A pairs in `blogFaq.mjs` can't break out of
  the JSON value. Checked the theoretical `</script>`-inside-a-JSON-string
  script-breakout class separately: neither `JSON.stringify` nor anything
  else in `prerender.mjs` escapes a literal `</script>` substring inside a
  JSON-LD value anywhere in this codebase (pre-existing gap across all ~330
  posts, not introduced by this diff) — moot here regardless, since neither
  the new post body nor the new FAQ entries contain that substring
  (`grep -c "</script"` on both new/changed files: 0).
- **Link safety:** the new post's only external link is
  `https://digilist.no/demo` (absolute, own domain) — matches the pattern
  used in 37 other existing posts, not a stray absolute URL to a third
  party. The custom `a` renderer in `BlogPost.tsx` doesn't set
  `target="_blank"` for any link (chat-intent hrefs become buttons, everything
  else is a plain in-tab `<a>`), so there's no reverse-tabnabbing surface
  (`rel="noopener"` moot without `target="_blank"`) — pre-existing sitewide
  behavior, unaffected by and unrelated to this diff.
- **Secrets:** grepped the new post and the `blogFaq.mjs` addition for
  `secret|api[_-]key|token|password|BEGIN.*PRIVATE` (case-insensitive) —
  zero hits. Author byline (`Ibrahim Rahmani` / `Grunnlegger, Digilist`)
  matches the same public byline used on 330 other posts, not a leaked
  identity or internal detail.
- **Path traversal via slug:** `slug: dans-og-kunstnerstudier-atelier-for-opplaering`
  is plain lowercase-ASCII-and-hyphens, used directly by `prerender.mjs` to
  build `join(DIST, "blogg", post.slug)` (line 2572) and by the router to
  build `/blogg/<slug>`. No `..`, no `/`, no encoded characters — can't
  escape the `dist/blogg/` directory or the `/blogg/` route namespace.
- **Tenant/authz:** confirmed again (per memory, this is not the first time)
  that this repo has no tenant model, no auth-gated data, and no query layer
  a post could reach into — a Markdown file in `src/content/blog/` is
  first-party committed content picked up by a build-time glob, not
  user-submitted data crossing a trust boundary. Nothing in this diff reads
  a request parameter, a database row, or another tenant's data.

**Found:** nothing that's a defect in this diff. One latent, sitewide gap
noted for completeness (no `</script>`-substring escaping in the shared
JSON-LD serializer), but it predates this ticket by ~330 posts, isn't
triggered by any content this diff adds, and fixing a shared serializer is
out of scope for a single-post content ticket — flagging it here rather than
inventing a same-diff fix.

**Changed:** nothing (no fixes needed this round).

## Round 4 (lens: scope)

**Question:** is anything in this diff NOT the stated change? Drive-by
edits, unrelated tidying, files nobody asked to be touched — checked every
commit on the branch individually, not just the final combined diff, since
scope creep can hide inside an intermediate commit that a squashed diff
would mask.

**Checked:**
- `git diff origin/main...HEAD --name-status`: exactly four files —
  `.agent/XAL-1085/REVIEW.md` (A), `.agent/XAL-1085/SPEC.md` (A),
  `src/content/blog/dans-og-kunstnerstudier-atelier-for-opplaering.md` (A),
  `src/content/blogFaq.mjs` (M). No fifth file, no deletions, no renames.
- `git status` / `git status --porcelain`: clean working tree, no untracked
  files, no leftover `pnpm-workspace.yaml` diff from local `pnpm
  approve-builds` (the specific stray-edit pattern SPEC.md flagged as a
  recurring risk from XAL-1099/1115/1127/1129/1086 — didn't recur here).
- Read every individual commit's `--stat` (`9ce7321`, `08a67a8`, `c3c8d23`,
  `bc22e6e`, `0c4e65e`): each one touches only the file(s) its own commit
  message claims — the content commit adds exactly the new post + the
  `blogFaq.mjs` entry + `SPEC.md`, each review-round commit adds only its
  own section to `REVIEW.md`. No commit smuggles an incidental change under
  a review-round message.
- `blogFaq.mjs` diff: pure addition, one new top-level key
  (`"dans-og-kunstnerstudier-atelier-for-opplaering"`) appended after the
  existing last entry. No existing `POST_FAQ` key touched, reordered, or
  reformatted.
- New post body: re-read end to end against SPEC's stated angle
  (danseinstruktør + kunstner-kursholder + teatergruppe as recurring
  group-leader bookers, teatergruppe's fixed-premiere-date sub-angle). Every
  section stays on that persona/booking-mechanics topic — no scope-widening
  into pricing tables, generic booking-flow explainers, or room-typology
  detail that the spec explicitly said to cross-link instead of duplicate.
  Exactly four cross-links, matching the four SPEC named
  (`kunstner-verksteder-studio-dansesaler-kreative-lokaler`,
  `leie-ovingsrom-musikk-dans-studio`,
  `spesiallokaler-niche-utleie-teaterscene-kjeller`,
  `booking-spesialiserte-trening-kunstnerlokaler`) — no extra, unplanned
  cross-links added.
- Confirmed the hub post `booking-spesialiserte-trening-kunstnerlokaler.md`
  was **not** edited to add a fifth cross-link back to the new post — matches
  SPEC's explicit one-direction-linking decision (avoid touching an
  already-shipped file), not an oversight.
- No `.claude/`, `AGENTS.md`, CI config, `package.json`, lockfile, or any
  other repo-wide file appears in the diff — nothing outside the blog
  content surface was touched.
- Re-ran `pnpm vitest run src/lib/post-slugs.test.ts
  src/content/blogFaq.test.ts` after the scope check: 3/3 still pass, no
  drift since round 1/2's full-suite runs.

**Found:** nothing. The diff is exactly the four files SPEC.md declared it
would be, each commit's content matches its own message, and the post's
content stays inside the persona/angle SPEC scoped it to with no
unplanned cross-links or drive-by edits anywhere in the branch.

**Changed:** nothing (no fixes needed this round).

## Round 5 — visual proof

New behaviour (a page that didn't exist before), so there is no "before"
state to capture — only the after.

- Started `pnpm dev:client` (Vite, `http://localhost:8080`) and used
  `agent-browser` to open
  `http://localhost:8080/blogg/dans-og-kunstnerstudier-atelier-for-opplaering`
  directly (client-side route, no server changes needed to serve it).
- Confirmed via `agent-browser get title` / `get text h1`: document title
  and `<h1>` both read
  *"Dans- og kunstnerstudier: atelier for opplæring og øving"* — the route
  resolves to the new post, not a 404/fallback.
- Full-page screenshot saved to
  [`proof/blog-post-full.png`](proof/blog-post-full.png) (1265×6941px).
  Visually confirms, top to bottom: title + intro, the `Privatperson` tag,
  hero illustration, full body (all sections from SPEC's persona angle —
  "Tre grupper som underviser og øver i samme type rom",
  "Sammenhengende blokk fram mot en fast dato", "Forutsigbarhet på tvers av
  flere ukedager"), the four cross-links rendered as real anchors
  (kunstner-verksteder-studio-dansesaler-kreative-lokaler,
  leie-ovingsrom-musikk-dans-studio,
  spesiallokaler-niche-utleie-teaterscene-kjeller,
  booking-spesialiserte-trening-kunstnerlokaler), the "Vanlige spørsmål om
  dans- og kunstnerstudier" FAQ section with all four Q&A pairs rendered as
  visible text (not just JSON-LD), and the sidebar "MER LESESTOFF"/"RELATERTE
  ARTIKLER" picking the new post up dynamically. No layout breakage, no
  missing images, no raw markdown leaking into the rendered HTML.
- Stopped the dev server after capture (`pkill -f vite`); no server left
  running.
- Linear attachment: MCP Linear tools remain unreachable this session
  (confirmed again via `ToolSearch`, matches
  `project_no_linear_mcp_tools_available.md` / XAL-1151) — `proof/blog-post-full.png`
  is committed to the branch instead of attached to the issue directly.

**Changed:** nothing (no fixes needed this round; proof-only addition).
