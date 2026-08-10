# XAL-1135 — Review log

## Round 1

Lens: **correctness** — does the change do what the acceptance criteria in
`.agent/XAL-1135/SPEC.md` say, on the edge cases too?

Checked against `git diff origin/main...HEAD`, which touches exactly two
files: `.agent/XAL-1135/SPEC.md` (already written, contrary to the resume
prompt's assumption — step 0 was in fact completed in commit
`fa2d2e5`) and the new post
`src/content/blog/yoga-wellness-studio-klasseromlokaler.md`.

What was checked, and what came back:

- **Gap claim still holds.** Re-ran `grep -ril "yoga"` / `"wellness"` across
  `src/content/blog/*.md` excluding the new file itself — still zero hits.
  The persona is still genuinely new, not stepping on
  `kunstner-verksteder-studio-dansesaler-kreative-lokaler` (XAL-1143) or
  `treningsrom-gymhaller-personlig-trener-fitnessinstruktor` (XAL-1149).
- **Frontmatter, field by field, against `src/lib/blogFrontmatter.ts` and
  three sibling posts (XAL-1142/1143/1149):** slug, date format, author,
  role string, tag, cover path, and keywords-array syntax all match the
  established pattern exactly. `readingMinutes: 6` checked against actual
  body word count (1163 words) vs. siblings of near-identical length (1160
  and 1177 words, both also `readingMinutes: 6`) — consistent, not a guess.
- **Title**: measured 57 chars (SPEC claims 57) — confirmed by both a
  direct Python length check and `node scripts/check-title-lengths.mjs`,
  which prints `ok 57 yoga-wellness-studio-klasseromlokaler.md` (the
  corpus-wide "137/316 exceed 65 chars" failure is pre-existing noise
  across older posts, not this one).
- **Description**: measured 145 chars, under the 155 hand-checked limit
  (no automated gate exists for this field, per SPEC's note about the
  XAL-1143 round-2 finding).
- **Word-count gate**: ran `node scripts/check-blog-word-count.mjs`
  directly (dist/ already had a same-day prerender) —
  `✓ All 316 blog posts have at least 200 words in the markdown source` and
  the same for the prerendered HTML `<article>` text. Also spot-checked the
  prerendered `dist/blogg/yoga-wellness-studio-klasseromlokaler/index.html`
  by hand for real body text (`"yogainstruktør"`, `"Vanlige spørsmål om
  booking"` both present, 125KB — not a Suspense-fallback stub).
- **Slug uniqueness / FAQ convention**: `npx vitest run
  src/lib/post-slugs.test.ts src/content/blogFaq.test.ts` — both pass.
  Confirmed `src/content/blogFaq.mjs` untouched, matching the batch's
  established "prose FAQ, no `POST_FAQ` schema entry" convention.
- **Redirect-collision guard**: the local `--check` run reports "0 posts to
  check" because it only diffs uncommitted `git status` output and this
  post is already committed — that's the guard's designed pre-commit
  scope, not a bug here. To actually verify the SPEC's claim rather than
  trust it, fetched the live slug directly with `redirect: manual`
  semantics (`curl --max-redirs 0`): `https://digilist.no/blogg/yoga-wellness-studio-klasseromlokaler`
  → `200`, no redirect. Not claimed by a standing consolidation redirect.
- **Internal link**: exactly one contextual link, to
  `kunstner-verksteder-studio-dansesaler-kreative-lokaler`, target file
  confirmed to exist. Matches the SPEC's "and/or" — only one of the two
  candidates was used, which the SPEC explicitly allowed.
- **CTA**: closing link is `https://digilist.no/demo`, matching the
  majority CTA-link format used across the corpus (some peers use a
  root-relative `/demo` instead — both forms coexist site-wide, so this is
  not a deviation).
- **Full test suite**: `npx vitest run` — 20 files, 40 tests, all pass,
  including the SSR `<h1>`/landmark/heading-outline invariants that a
  content-only PR could still break if the new post's Markdown produced
  malformed heading structure. It doesn't.

**Findings: none.** Every acceptance criterion in the SPEC's "WHAT CHANGES"
section was checked against the actual file content (not re-read from the
SPEC's own claims) and holds. No edge case — slug collision, stale-dist
false pass, frontmatter parse mismatch, word-count gate, FAQ convention,
internal-link target — turned up a defect. No code changes made this
round.

## Round 2

Lens: **regression** — what ELSE reads this code path, beyond the files the
diff touches and beyond the consumers the SPEC's "BLAST RADIUS" section
already names? This is a content-only diff (one new `.md` file plus two
`.agent/` docs — confirmed via `git diff origin/main...HEAD --stat`), so the
question is whether any *other* consumer of `src/content/blog/*.md` has
non-generic, per-post logic that a brand-new file could trip.

Consumers grepped and checked, one by one:

- **`scripts/prerender.mjs` sitemap block (~line 2599)** — loops over
  `loadBlogPosts()` with no per-slug allowlist; new post's route is added to
  `sitemap.xml` automatically. Also checked the per-post Article JSON-LD
  block (~line 2501-2517): every field it reads (`title`, `description`,
  `date`, `author`, `cover`, `tag`) comes straight from frontmatter with no
  post-specific case, so nothing needed updating for the new post.
- **`scripts/indexnow-submit.mjs`** — has a hardcoded `DEFAULT_PATHS` list
  that is *not* auto-derived from `getAllPosts()`; only manual CLI args.
  Checked whether the four immediate sibling posts (XAL-1142/1143/1145/1149)
  were ever added to it — none were (`grep -c "blogg/"` → 1 hit, an older
  post from a previous batch). Confirmed pre-existing, consistently-unmaintained
  gap across the whole recent batch, not something this post regresses.
- **`src/lib/search/corpus.ts`** — `blogItems` (line 100) is built by
  `.map()` over `getAllPosts()`, no allowlist; new post becomes searchable
  automatically, as SPEC already claimed for the Navbar path.
- **Tag rendering (`BlogPreview.tsx`)** — `parsed.tag` is rendered directly
  from frontmatter, no tag allowlist/enum to extend. "Utleier" is an
  established tag already used by every sibling in this batch.
- **`previewCover()` in `src/lib/posts.ts`** — derives a `-preview.webp`
  path from the `cover` field for listing/teaser cards. Verified both
  `booking_calendar_hero_no.webp` and `booking_calendar_hero_no-preview.webp`
  exist in `public/images/blog/` (shared asset, not new) — this consumer
  won't 404.
- **`src/pages/BlogPost.tsx` → `relatedSolutions()` (line 39-54)** — a
  consumer *not* named anywhere in the SPEC's blast-radius list. It
  regex-matches `slug + title + tag + keywords` against five hardcoded
  `SOLUTION_PAGES` patterns (kommune, idrettshaller, møterom,
  selskapslokaler, kulturhus) to auto-insert a "money page" link, falling
  back to a generic `/booking-av-lokaler-og-moterom` link if nothing
  matches. Checked the new post's haystack against all five patterns by
  hand — no match, so it takes the fallback path. Verified this is the
  *designed* fallback, not a broken match, by diffing against the already
  live `dist/blogg/yoga-wellness-studio-klasseromlokaler/index.html`: the
  `<article>` element contains `booking-av-lokaler-og-moterom` and not
  `bookingsystem-kommune` (that string only appears in the global
  Navbar/Footer markup around the article, confirmed with a Python
  extraction of just the `<article>...</article>` slice). Cross-checked
  against sibling `kunstner-verksteder-studio-dansesaler-kreative-lokaler.md`
  (XAL-1143) — its haystack doesn't match any `SOLUTION_PAGES` pattern
  either, so it also falls back generically. This confirms the fallback
  behaviour for a novel niche persona is consistent with the established
  batch, not a regression this post introduces.
- **Hardcoded post-count assertions** — grepped every `*.test.ts` for
  `posts.length` / `toHaveLength` patterns tied to blog post counts; none
  exist, so adding a 316th post can't break a stale-count assertion.
- **Full test suite** — re-ran `npx vitest run` after all of the above:
  20 files, 40 tests, all pass (same result as round 1; nothing in this
  lens's investigation touched code, so no regressions were possible to
  introduce, but re-running confirms the investigation itself didn't leave
  the tree dirty).

**Findings: none.** Every other consumer of `src/content/blog/*.md` reads it
generically (glob/map over all posts, frontmatter fields read directly, no
per-slug or per-tag allowlists to extend) except `relatedSolutions()` in
`BlogPost.tsx`, which is regex-driven — and that one was checked by hand and
confirmed to degrade to its intended generic fallback, matching how the
closest sibling post (XAL-1143) already behaves. No code changes made this
round.

## Round 3

Lens: **security** — authz, tenant isolation, injection, secrets, and
anything user-supplied that reaches a query, a path or a page. `git diff
origin/main...HEAD` still touches exactly three files (two `.agent/` docs,
one new `.md` post) — no application code changed, so the question is
whether the *content* of the new post, or the pipeline it flows through,
opens any of those holes.

What was checked, and what came back:

- **Authz / tenant isolation** — not applicable. Confirmed (again, per
  standing memory of this repo) there is no booking/product domain, no
  data queries, and no multi-tenant model in this repo at all; this diff
  is a static Markdown file with no runtime data access. Nothing to
  isolate.
- **Secrets** — `grep -niE "api[_-]?key|secret|token|password|bearer|sk-
  [a-z0-9]|AKIA[0-9A-Z]{16}"` across the new post and both `.agent/`
  files: zero hits.
- **Raw HTML / script injection in the Markdown body** — `grep -nE
  "<[a-zA-Z/]"` on the post body: zero hits, no raw HTML tags at all.
  Confirmed this matters structurally, not just for this file: read
  `src/pages/BlogPost.tsx`'s `<ReactMarkdown remarkPlugins={[remarkGfm]}>`
  (line 231) — no `rehype-raw` (or any raw-HTML-passthrough plugin) is
  wired in, so `react-markdown` HTML-escapes any literal `<`/`>` in
  Markdown source by default. Even a post that *did* contain a stray
  `<script>` tag couldn't execute it through this render path. Checked
  `scripts/prerender.mjs` too — it renders through the same React
  component tree (no separate markdown-to-HTML library, no
  `dangerouslySetInnerHTML` call anywhere in the file) — confirmed with
  `grep -n "dangerouslySetInnerHTML\|ReactMarkdown\|remark\|rehype" scripts/prerender.mjs`,
  zero matches, meaning SSR reuses the same escaping guarantees rather
  than a second, possibly-laxer renderer.
- **`javascript:`/`data:` URI links** — `grep -niE
  "javascript:|data:text|onerror=|onload="` on the post body: zero hits.
  The only two links in the body
  (`/blogg/kunstner-verksteder-studio-dansesaler-kreative-lokaler` and
  `https://digilist.no/demo`) are both plain Markdown-syntax links to a
  confirmed-existing internal route and the site's own known demo page —
  no open-redirect or scheme-confusion surface.
- **JSON-LD `<script>` injection via frontmatter fields** — `SEO.tsx`
  (line 371) and `prerender.mjs` (lines 2276, 2546) both build a JSON-LD
  block with `JSON.stringify(...)` interpolated directly into a
  `<script type="application/ld+json">` string, which is a latent risk
  *in general* (a `</script>` substring inside `title`/`description`
  could break out of the script context) — but this is pre-existing
  pipeline code untouched by this diff, and checked whether *this* post's
  frontmatter could trigger it: `sed -n '1,12p' ... | grep -oE
  '</script'` on `title`, `description`, and `keywords` — zero hits, and
  none of those fields contain `<`, `>`, or `"` at all. Not a new
  vulnerability introduced here; noted but out of scope to fix on a
  content-only diff that doesn't touch the shared SEO/prerender code.
- **User-supplied input reaching a query or path** — none exists in this
  change. The Markdown file is authored content, not end-user input; the
  slug that becomes the `/blogg/<slug>` route comes from static
  frontmatter fixed at build time via a build-time glob, not from a
  runtime parameter — no path-traversal or route-confusion surface.

**Findings: none.** No secrets, no raw-HTML/script injection surface (and
verified *why* not, at the render-pipeline level, not just by grepping this
one file), no unsafe link schemes, no authz/tenant-isolation surface to
speak of in a content-only repo. One latent, pre-existing pattern was
noted (unescaped `JSON.stringify` into a `<script>` tag in `SEO.tsx` /
`prerender.mjs`) but it is not touched by this diff and this post's
frontmatter doesn't trigger it, so no fix was made this round — flagging
it here for anyone doing a security pass on that shared code later. No
code changes made this round.

## Round 4

Lens: **scope** — is anything in this diff NOT the stated change? Drive-by
edits, unrelated tidying, files nobody asked for.

`git diff origin/main...HEAD --stat` / `--name-status` / `--numstat`:
exactly three files, all additions, zero deletions/modifications —

- `.agent/XAL-1135/SPEC.md` (171 lines, new) — the step-0 architecture doc
  this ticket's process requires.
- `.agent/XAL-1135/REVIEW.md` (209 lines before this round, new) — rounds
  1-3 of this same review log.
- `src/content/blog/yoga-wellness-studio-klasseromlokaler.md` (60 lines,
  new) — the one blog post the ticket asked for.

`grep -c "^-" ` on the raw diff returns 3, all three are `--- /dev/null`
file-creation headers, not a single line of existing content removed or
altered anywhere in the tree.

Checked beyond the diffstat, in case something was touched but landed back
at its original content (would show as 0 net lines but still be a
drive-by):

- `find .agent -type f` shows entries for nine other tickets
  (XAL-1142/1143/1145/1149/1152/1155/1156/1159/1160/1161/1163) — all
  pre-existing on `origin/main` from already-merged PRs, none appear in
  the `git diff` and none were touched this session.
- Read the new post's full body (`src/content/blog/yoga-wellness-studio-klasseromlokaler.md`,
  all 60 lines) end to end: every section — persona vignette, "what is a
  bookable studio", the three booking patterns, the pricing/membership
  list, the Digilist how-it-works paragraph, FAQ, closing CTA — stays on
  the yoga/wellness-studio topic the ticket named. No aside about an
  unrelated persona, no unrelated internal links beyond the one to the
  adjacent XAL-1143 post the SPEC called out, no stray keyword stuffing
  for topics outside this niche.
- No sibling `.md` posts, no `blogFaq.mjs`, no build script, no config
  file, no `package.json` — nothing outside the three files above was
  touched. `git status` is clean (no untracked/uncommitted stragglers
  either).

**Findings: none.** The diff is minimal and fully accounted for by the
stated change — one new blog post plus the two process docs the workflow
itself requires. Nothing extraneous, nothing drive-by. No fixes were
needed this round, so no code changes were made.

## Round 4 — outcome

All four review rounds (correctness, regression, security, scope) are now
complete with no findings across three separate sessions. The change is
one new Norwegian-language blog post
(`src/content/blog/yoga-wellness-studio-klasseromlokaler.md`) plus its
required `.agent/XAL-1135/` process docs, ready to merge.

## Proof (this session)

This is new behaviour (a blog post that didn't exist before), so there is
no "before" state to capture — only the after. Rendered the real build
(`vite build` output already in `dist/`, prerendered by `scripts/prerender.mjs`
same-day) and served it with `vite preview --outDir dist --port 4173`, then
drove it with `agent-browser` to confirm the page actually renders end to
end, not just that the source file and word-count gate look right on paper:

- `.agent/XAL-1135/proof/after-yoga-wellness-studio-post-top.png` —
  `http://localhost:4173/blogg/yoga-wellness-studio-klasseromlokaler`, page
  top. Confirms `document.title` and the rendered `<h1>` both read "Studio-
  og klasseromlokaler for yoga og wellness: booking", byline/date render
  correctly, and the "I denne artikkelen" TOC lists all five body headings.
- `.agent/XAL-1135/proof/after-yoga-wellness-studio-post-faq.png` — scrolled
  to the "Vanlige spørsmål om booking av yoga- og wellness-studio" heading.
  Confirms the FAQ section renders with real Q&A content, and shows the one
  internal link to `kunstner-verksteder-studio-dansesaler-kreative-lokaler`
  rendering as a working in-body link, not raw Markdown syntax.

**Linear attachment**: no Linear MCP server is reachable in this
environment (`ToolSearch` for Linear tools returns nothing — same result as
XAL-1151, see project memory `no-linear-mcp-tools-available`). The two
screenshots above could not be attached to the XAL-1135 issue directly;
they're committed to the branch instead, same as the SPEC already is, so
the PR carries the same evidence an attachment would.
