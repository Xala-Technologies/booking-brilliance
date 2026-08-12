# XAL-1084 — Review log

## Round 1 — CORRECTNESS

**Lens:** Does the shipped change do what the acceptance criteria (SPEC.md
"WHAT CHANGES") say, including edge cases the happy-path read would miss?
Read SPEC.md, then `git diff origin/main...HEAD` in full, then ran the actual
test/build gates rather than trusting the diff by eye.

**Checked, with evidence:**

- **Step 0 status** — `.agent/XAL-1084/SPEC.md` already exists (179 lines,
  committed in `b7baec4`, before this session started) with a full "how it
  works now" read of the consumer chain and a mermaid diagram. The resume
  prompt's premise ("AGENT-SPEC.md does NOT exist") was stale; step 0 was in
  fact already done in an earlier session. Nothing to redo here.
- **Real gap claim** — re-verified: no existing post combines "spesialiserte"
  with the kultur/underholdning venue category and the
  niche-market/lower-competition argument. The listed adjacent posts
  (eventlokaler-arrangement..., sal-for-kulturarrangementer...,
  spesiallokaler-niche-utleie..., spesialiserte-idrettssteder...,
  kunstner-verksteder..., leie-ovingsrom..., dans-og-kunstnerstudier...,
  booking-spesialiserte-trening-kunstnerlokaler...) confirmed to cover
  adjacent-but-distinct angles, matching the SPEC's characterization.
- **Slug uniqueness** — `grep` confirms `spesialiserte-lokaler-kultur-underholdning`
  appears in exactly one `.md` file; `post-slugs.test.ts` passes.
- **Word count gate** (the real acceptance gate, wired into `pnpm build`) —
  markdown source is 1132 words (>> 200 min). Ran a full `pnpm build`: prerender
  succeeded for all 417 pages, and both word-count checks
  ("All 331 blog posts have at least 200 words in the markdown source" /
  "...render at least 200 words in dist/blogg/*/index.html") passed,
  confirming the content survives SSR and isn't a Suspense-fallback stub.
- **Title length** — `check-title-lengths.mjs` reports 60/65 chars for this
  slug specifically (`ok 60 spesialiserte-lokaler-kultur-underholdning.md`).
  The script's overall "139/331 exceed 65 chars" output is pre-existing
  baseline noise across the whole corpus, unrelated to this post.
- **FAQ verbatim match** — extracted the live `FAQPage` JSON-LD from
  `dist/blogg/spesialiserte-lokaler-kultur-underholdning/index.html` after
  build and diffed it question-by-question against both the markdown's
  `## Vanlige spørsmål` section and the new `POST_FAQ[...]` entry in
  `blogFaq.mjs`: all four Q&A pairs match verbatim across all three places.
  `blogFaq.test.ts` and the full `npx vitest run` (21 files / 45 tests) pass.
- **Cross-links resolve** — all three linked slugs
  (`eventlokaler-arrangement-underholdning-kulturarrangement-arrangorer`,
  `spesiallokaler-niche-utleie-teaterscene-kjeller`,
  `spesialiserte-idrettssteder-tennis-bowling-basketball-gym`) exist as real
  files. Per SPEC, links are outward-only (no reverse links added to the
  shipped sibling posts) — confirmed this is the stated, deliberate policy,
  not an oversight.
- **Frontmatter correctness** — `tag: "Utleier"` matches the existing tag
  vocabulary (grepped all tags in use). `cover` path
  (`/images/blog/booking_calendar_hero_no.webp`) exists in `public/`,
  `dist/`, and `dist-server/`. `author`/`role` match the convention used by
  every recent sibling post. `date: 2026-08-11` matches the session's actual
  date, ISO format, parses correctly via `blogFrontmatter.ts`.
- **H1 / SSR** — prerendered HTML has exactly one `<h1>` matching the
  frontmatter title.
- **Linear attachment step** — SPEC already documents Linear MCP tools were
  unreachable this session (confirmed again this round via ToolSearch — no
  Linear tool surfaced). Matches the standing, repeatedly-confirmed
  `project_no_linear_mcp_tools_available.md` finding. SPEC stays committed
  under `.agent/XAL-1084/` as the fallback record, per that memory's guidance.

**Findings: none.** Every acceptance criterion in SPEC.md's "WHAT CHANGES"
section is met, the real build/test gates (not just the diff) pass, and the
FAQ/cross-link/frontmatter details that are easy to get subtly wrong on a
content-only change all check out under direct verification.

**Changes made this round:** none — nothing to fix. No commit needed since
the tree was already clean and no files were modified during this review.

## Round 2 — REGRESSION

**Lens:** what ELSE reads this code path? Grepped every consumer of
`src/content/blog/*.md` and `blogFaq.mjs` beyond what SPEC.md's "BLAST
RADIUS" section already listed, and checked nothing depended on the old
behaviour (fewer posts, no `"Utleier"`-tagged 2026-08-11 entry, etc.).

**Consumers found beyond SPEC.md's list, checked individually:**

- `src/lib/search/corpus.ts` — sitewide search corpus. Only imports
  `getAllPosts()`/frontmatter; a new post is just one more searchable item,
  no hardcoded post list or count to update.
- `src/components/BlogPreviewSection.tsx` (homepage teaser, `.slice(0, 6)`)
  and `src/pages/Blog.tsx` (blog index + tag filter) — both derive their tag
  list dynamically (`allPosts.forEach(p => set.add(p.tag))`), so the
  pre-existing `"Utleier"` tag needs no registration; both already render
  every other `"Utleier"`-tagged post today.
- `src/lib/posts.ts` sort (`[...blogMeta].sort((a,b) => a.date < b.date ? 1 : -1)`)
  — new post's `date: 2026-08-11` sorts it toward the front of
  `getAllPosts()`. Checked whether anything assumes a stable "first post":
  `src/entry-server.main-landmark.test.tsx` reads `getAllPosts()[0]`
  dynamically (not a pinned slug) specifically so it doesn't care which post
  is newest — confirmed still green.
- `src/lib/webp-sources.test.ts` ("BlogPreviewSection cover previews") —
  iterates every post's `previewCover(cover)` and asserts the `-preview.webp`
  sibling exists on disk. The new post reuses the same shared cover
  (`booking_calendar_hero_no.webp`) as ~19 other posts; confirmed
  `booking_calendar_hero_no-preview.webp` already exists in `public/images/blog/`.
- `src/pages/BlogPost.tsx` `relatedSolutions()` — regex-matches
  slug+title+tag+keywords against 5 solution pages
  (kommune/idrettshall/møterom/selskapslokale/kulturhus) to render 1-2
  contextual "solution" links, falling back to a generic
  `/booking-av-lokaler-og-moterom` link if nothing matches. The new post's
  hay (slug/title/tag/keywords only, not body text) doesn't hit any of the 5
  regexes — e.g. `/kulturhus|kantine|konferanse|kultursal|arrangement/i`
  needs one of those literal substrings, and the post has "kultur" but never
  "kulturhus"/"kultursal"/"arrangement" in its frontmatter fields. This is
  the designed fallback path, not a crash or broken match — confirmed by
  reading the function, not a regression, but noted as a missed
  cross-link opportunity (not fixed: fixing it would mean tuning a shared
  regex used by ~300 other posts, out of scope for a content-only ticket).
- `scripts/dedup-blog-drafts.ts`, `scripts/sync-convex-blog-to-fs.ts` —
  operate on the Convex drafts table, not on committed `.md` files; this
  post was never staged there, so these scripts have nothing to do with it.
- `scripts/verify-live.mjs` — has a cross-post exact-title duplicate check
  (`findDuplicateTitles`). Confirmed the new title `"Spesialiserte lokaler
  for kultur og underholdning"` doesn't exact-match any of the ~330 other
  post titles (nearest is `"Spesialiserte idrettssteder: tennis, bowling,
  basketball"`, a different string). This script hits the live site, isn't
  wired into `pnpm build`, so it's informational only, but the check passes
  on the source.
- `scripts/indexnow-submit.mjs` — has a hardcoded `DEFAULT_PATHS` list from
  the 2026-07 launch; doesn't include this or any other individual blog post
  by default, it's a manual operator tool, not a build gate. Not a
  regression: no post has ever needed adding here.

**Full test suite re-run:** `npx vitest run` — 21 files / 45 tests, all pass
(same result as Round 1, re-confirmed after this round's read-only
investigation).

**Findings: none.** Every consumer beyond the ones SPEC.md already named
either ignores the new post safely (dynamic tag/search lists), handles it
via an existing generic guard (webp-sources test, duplicate-title check), or
degrades gracefully via a designed fallback (`relatedSolutions`). Nothing
depended on the pre-change post count, order, or tag set.

**Changes made this round:** none — no code or content touched, nothing to
fix. No new commit (tree unchanged).

## Round 3 — SECURITY

**Lens:** authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path or a page. Read the full
`git diff origin/main...HEAD` (only 4 files: this REVIEW.md, SPEC.md, the new
`.md` post, and the `POST_FAQ` addition to `blogFaq.mjs`) with an attacker's
eye rather than a correctness eye.

**Checked, with evidence:**

- **Authz / tenant isolation** — not applicable. Confirmed (again) this repo
  has no booking/product domain, no auth, no multi-tenant data model
  (`project_repo_has_no_booking_domain.md`). The diff touches only a static
  markdown file and a static JS object keyed by slug; there is no session,
  role, or tenant boundary for a content file to cross.
- **Secrets** — grepped the full diff for key/token/secret/password/bearer/
  AKIA/`sk-` patterns: none found. No `.env`, credential, or config file
  touched.
- **XSS via the new markdown body** — read the rendering pipeline
  (`src/pages/BlogPost.tsx`): `ReactMarkdown` is used with only `remarkGfm`,
  no `rehype-raw` / `allowDangerousHtml`, so raw HTML in markdown source is
  rendered as escaped text, not injected as DOM — confirmed this is the
  actual pipeline, not assumed. The new post's body also independently
  contains zero raw HTML tags or script-like content on inspection, so this
  isn't tested only by the framework default.
- **Link safety** — every link in the new post's body is either a relative
  internal `/blogg/<slug>` path to a post confirmed to exist (Round 1), or
  `https://digilist.no/demo`, the same absolute CTA URL used verbatim by 27
  other posts (`grep -c` confirmed). No `javascript:`/`data:` URIs, no
  attacker-controlled redirect target.
- **Meta-tag injection (the one real latent vector found)** — traced how
  frontmatter reaches the rendered `<head>`: `scripts/prerender.mjs`
  interpolates `meta.title` and `meta.description` directly into
  `<meta content="${...}">` attribute strings **without escaping `"`**
  (lines ~2302-2362) — unlike the adjacent `keywords` meta tag, which does
  escape (`.replace(/"/g, "&quot;")`, line 2333). A title or description
  containing a `"` would break out of the attribute and inject arbitrary
  markup into that route's `<head>`. This is pre-existing code, untouched by
  this diff, so it is not a new vulnerability — but it *is* a vector this
  specific change feeds input into, so I checked whether this post's content
  triggers it: `title`, `description`, and every string in `keywords` in the
  new frontmatter were inspected character-by-character — none contain `"`,
  `<`, or `>`. **Does not trigger the latent bug.** FAQ question/answer text
  (the other new user-visible strings, from `blogFaq.mjs`) reaches the page
  exclusively via `JSON.stringify()` (both `src/components/SEO.tsx:371` and
  `scripts/prerender.mjs:2556`), which escapes correctly regardless of quote
  characters — confirmed safe by construction, not just by this post's
  content happening to be clean.
  Not fixed: the escaping gap in `prerender.mjs`'s title/description
  handling is a real latent bug (any future post whose title/description
  contains a `"` breaks `<head>` on the route derived from that vulnerable
  regex-replace), but it is pre-existing, untouched by this diff, and
  touching a regex-replace shared by all ~331 posts' meta tags is out of
  scope for a content-only ticket — same "don't fix shared infrastructure
  from a content ticket" policy Round 2 applied to `relatedSolutions()`.
  Worth a follow-up ticket, not a blocker here.
- **Slug / path safety** — slug `spesialiserte-lokaler-kultur-underholdning`
  is lowercase-alphanumeric-and-hyphens only (re-confirmed), matches the
  filename exactly, and is used only as a plain object key
  (`POST_FAQ[slug]`) and a route segment already validated unique by
  `post-slugs.test.ts` (Round 1) — no path-traversal or prototype-pollution
  shaped key (`__proto__`, `constructor`, etc.) possible from this value.
- **User-supplied input** — none. Every string in this diff (post body,
  frontmatter, FAQ Q&A) is static content authored this session and
  committed to the repo; nothing here is runtime user input reaching a
  query, a file path, or a page. The only "reaches a page" path is the
  build-time render pipeline audited above.

**Findings: none that require a fix in this diff.** One pre-existing latent
meta-tag escaping gap in `scripts/prerender.mjs` was found and confirmed
*not* triggered by this post's actual content; it's flagged above for a
future ticket rather than fixed here, consistent with this ticket's
content-only scope.

**Changes made this round:** none — no code or content touched. No new
commit needed (tree unchanged); full test suite not re-run since nothing was
modified.

## Round 4 — SCOPE

**Lens:** is anything in this diff NOT the stated change? Drive-by edits,
unrelated tidying, files nobody asked to touch. Also re-checked the resume
prompt's premise ("AGENT-SPEC.md does NOT exist — step 0 was never
finished") against the actual state of the worktree, since Round 1 already
flagged that premise as stale once.

**Checked, with evidence:**

- **Step 0 premise, re-verified:** `.agent/XAL-1084/SPEC.md` exists (179
  lines, committed in `b7baec4`), with the required "how it works now" read
  and mermaid diagram already in it. Linear MCP tools are still unreachable
  this session (confirmed again via `ToolSearch` — no Linear tool surfaced),
  matching the standing `project_no_linear_mcp_tools_available.md` finding,
  so the SPEC stays committed under `.agent/XAL-1084/` instead of attached
  to the issue, per that memory's guidance and per Round 1's identical
  conclusion. Nothing to redo.
- **`git diff origin/main...HEAD --stat`** (merge-base confirmed to be
  `e54e3b5`, exactly `origin/main`'s tip): only 4 files touched —
  `.agent/XAL-1084/REVIEW.md`, `.agent/XAL-1084/SPEC.md`,
  `src/content/blog/spesialiserte-lokaler-kultur-underholdning.md`, and
  `src/content/blogFaq.mjs`. No file outside `.agent/XAL-1084/` +
  `src/content/blog/` + `blogFaq.mjs` is touched anywhere in the branch's
  history relative to `origin/main`.
- **`src/content/blogFaq.mjs` diff read in full:** the change is a pure
  append — one new `POST_FAQ["spesialiserte-lokaler-kultur-underholdning"]`
  key added after the last existing entry. No existing key is edited,
  reordered, or reformatted. No incidental whitespace/lint reflow of the
  surrounding file.
- **New post file:** entirely new content, nothing to have scope-crept
  within it — no edits to any other file were needed to add it (confirmed by
  SPEC's blast-radius read in Round 1/2: `postContent.ts`/`posts.ts` auto-glob
  every `.md` file, no registry to touch).
- **The three cross-linked sibling posts** (`eventlokaler-...`,
  `spesiallokaler-niche-utleie-...`, `spesialiserte-idrettssteder-...`) are
  linked *from* the new post but are not themselves present in the diff —
  confirmed no reverse-link edits or any other touch landed in those files,
  matching SPEC's stated outward-only-links policy.
- **`git status --porcelain`** — empty, no untracked or modified files left
  in the working tree beyond what's already committed.
- **Branch history sanity check:** `e23f908` ("chore(XAL-1084): Content gap:
  Spesialiserte lokaler for kultur og underholdning...") is unique to this
  branch (not present in `origin/main` nor any other branch), so it's
  in-scope prior work on this same ticket, not foreign history merged in by
  accident. The `d32ff6a` merge commit itself introduces no diff of its own
  (three-dot diff against `origin/main` already accounts for it cleanly —
  stat above shows only the 4 expected files).

**Findings: none.** The diff is exactly what SPEC.md's "WHAT CHANGES" and
"BLAST RADIUS" sections describe: one new blog post, one new FAQ entry keyed
to its slug, and this ticket's own `.agent/XAL-1084/` process record. No
drive-by edits, no unrelated tidying, no files touched outside that stated
scope.

**Changes made this round:** none — no code or content touched beyond this
REVIEW.md entry itself.
