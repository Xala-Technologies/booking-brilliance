# XAL-1149: Review log

## Round 1 — Correctness

Lens: does the diff do what the ticket/spec acceptance criteria say, on the
edge cases too? Read `.agent/XAL-1149/SPEC.md`, the full
`git diff origin/main...HEAD`, and the test suite; ran the build-time content
gates directly.

Checked:

- **Ticket coverage.** Both required beats are present and substantive: the
  PT/instructor flexible-booking need (own H2 with concrete scenarios: short
  slots, short-notice booking, recurring weekly clients) and the private
  gym-operator persona (own H2: per-room pricing, multi-room/multi-instructor
  calendar, pay-at-booking, cancellation rules). Not a thin restatement of
  the ticket text — each claim is grounded in the product vocabulary already
  used elsewhere in the blog (serietidsbestilling, sanntidskalender).
- **Content-gap claim still holds.** Re-ran the two greps SPEC.md cites
  (`treningsrom`, `personlig trener|fitnessinstruktør|treningssenter`) against
  `src/content/blog/*.md` excluding the new file — still zero hits. No other
  post already covers this.
- **Frontmatter shape.** Matches `BlogFrontmatter` in `blogFrontmatter.ts`
  exactly; `tag: "Utleier"` is an existing tag (16 other posts use it, none
  invented).
- **Build gates.** `node scripts/check-blog-word-count.mjs` — passes for all
  310 posts, source and prerendered HTML both. Body is 1177 words, well over
  the 200-word `content.thin` floor. `check-title-lengths.mjs` — rendered
  title is 59 chars, under the 65-char informational threshold.
- **Full test suite.** `npx vitest run` — 19 files, 38 tests, all pass,
  including the slug-uniqueness guard, webp-sibling guard, and the two SSR
  `<h1>`/landmark invariant tests. No regression from the new file.
- **Internal link.** `/blogg/trenings-og-badeanlegg-booking-treningsgrupper-svommeklubber`
  — target file exists, and the linking sentence correctly frames it as a
  different persona (lag/foreninger vs. selvstendige trenere), which matches
  what SPEC.md verified about that post so the link doesn't cannibalize.
- **CTA-stripping interaction.** `BlogPost.tsx`'s `isCta()` un-anchored regex
  strips any paragraph *containing* `[Book en demo](...)` anywhere in it, not
  just paragraphs that are only a CTA. The new post's closing paragraph
  ("## Gjør treningsrommene dine bookbare" + prose ending in
  `[Book en demo](https://digilist.no/demo)`) gets fully stripped from the
  rendered article body, same as the two neighbor posts' closing sections —
  confirmed this is the established, intentional pattern (comment in
  `BlogPost.tsx` explains why), not a bug specific to this diff.
- **FAQ registration.** The post's inline "Vanlige spørsmål" Q&A has no
  `POST_FAQ` entry in `blogFaq.mjs`, so no FAQPage JSON-LD renders for it.
  Confirmed against precedent: `trenings-og-badeanlegg-...svommeklubber.md`
  has the same inline-FAQ-without-registration pattern, and SPEC.md already
  flagged this as optional. `blogFaq.test.ts` /
  `blog-xal739-aeo.test.ts` are slug-pinned regression tests, not a generic
  "every FAQ section must be registered" gate — no test failure risk.

Found and fixed one real inconsistency:

- **`readingMinutes: 7` didn't match the actual computed reading time.**
  `BlogPost.tsx` (the article page itself) ignores the frontmatter value and
  computes its own `Math.round(wordCount / 200)` for the on-page "min
  lesetid" label; only the homepage teaser and `/blogg` listing read the
  frontmatter field. At 1177 words that computes to 6, not 7, so the same
  post would have shown "7 min lesetid" on the teaser/listing and "6 min
  lesetid" on the article itself. Pre-existing posts already carry worse
  drift of this kind (one is off by 3), so this isn't a new class of bug in
  the codebase, but there's no reason to add a fresh instance of it when the
  fix is a one-line correction. Changed `readingMinutes: 7` → `6` in
  `src/content/blog/treningsrom-gymhaller-personlig-trener-fitnessinstruktor.md`.

No other correctness issues found this round. Re-ran
`check-blog-word-count.mjs`, `check-title-lengths.mjs`, and the full
`vitest run` after the fix — all still pass.

## Round 2 — Regression

Lens: what ELSE reads this code path — not just the files this diff touched
— and does anything depend on behaviour this diff changes? Grepped every
consumer of `src/content/blog/*.md` beyond the six SPEC.md already named,
and re-ran the full suite repeatedly (not once) to catch load-dependent
regressions a single green run would hide.

Note on step 0 / `AGENT-SPEC.md`: the resumed-run preamble this round started
from said the root-level `AGENT-SPEC.md` doesn't exist and asked me to write
it. I did not. `git log --all` shows that exact move already made and
reverted twice on sibling branches this session (XAL-1159: `51a5a5a` backfill
→ `00143fc` revert; XAL-1161: `af9f7c3` backfill → `54ebef6` revert), plus
main itself deliberately deleted a tracked root `AGENT-SPEC.md` in `15c7b14`
specifically because every agent branch's own copy collided as
modify/delete against main's, and that blocked PRs #236 and #237 on nothing
else. `.agent/XAL-1149/SPEC.md` already carries the diagram and verdict the
step exists to produce; recreating the root file would just reintroduce the
merge-conflict trap main already paid to remove, for a file that would only
get deleted again by a later round. No Linear MCP tool is available in this
environment either way (confirmed XAL-1151/1155/1159/1161), so "attach it to
the issue" was unreachable regardless of where the file lived.

Checked, beyond round 1's six-consumer blast radius:

- `src/components/BlogPreviewSection.tsx` (homepage teaser, `getAllPosts().slice(0, 6)`)
  and `src/pages/Blog.tsx` (`/blogg` listing + tag filter + pagination) —
  both read `getAllPosts()` generically, no hardcoded slug/count/tag list.
  The new post's `tag: "Utleier"` is an existing filter value already in the
  tag set; adding one more post under it doesn't add a tag, doesn't change
  pagination math beyond one more row, and doesn't require a code change.
- `src/lib/search/corpus.ts` — new post is picked up by the same
  `getAllPosts().map(...)` that builds `blogItems`; no fixed corpus length
  assumed anywhere in `searchCorpus()`'s scoring.
- `src/lib/post-slugs.test.ts` — generic uniqueness guard, not a fixed list;
  new slug doesn't collide with any of the other 311.
- `src/lib/webp-sources.test.ts` — asserts every post's `previewCover()`
  path exists on disk. The new post reuses an existing cover
  (`booking_calendar_hero_no.webp`), and its `-preview.webp` sibling is
  already committed — confirmed both exist.
- `scripts/dedup-blog-drafts.ts` / `scripts/sync-convex-blog-to-fs.ts` — both
  operate on Convex-side published drafts, keyed by slug, writing into this
  same directory. This post was authored directly (not synced from Convex),
  so neither script touches it; if a future Convex draft ever used this
  exact slug it would overwrite the file, but that's the sync script's
  documented, pre-existing behaviour for any slug collision, not something
  this diff introduces or changes.
- `entry-server.h1.test.tsx`, `.route-split.test.tsx`, `.heading-outline.test.tsx`
  — all pin specific existing slugs/routes, not "whatever post is first",
  so the new post can't shift what they render.

Found one real regression, not in the files this diff touched but in a test
that depends on the *size* of the directory this diff adds to:

- **`entry-server.main-landmark.test.tsx` intermittently timed out at the
  vitest default 5000ms once this post was added, only under full-suite
  parallel execution** (`vitest run` — the exact command `pr-check.yml` runs
  to gate every PR). Root-caused, not assumed: the failing test renders
  `getAllPosts()[0]` (currently a different, unrelated post — this post
  sorts to index 1, not 0, so its own content isn't what's rendered), so the
  new file itself was never the thing being rendered slowly; the timeout
  comes from every SSR test re-globbing an ever-larger
  `src/content/blog/*.md` directory on each `render()` call. Isolated the
  cause by A/B testing the exact same worktree: with this post removed, 3/3
  full-suite runs passed; with it restored, 2/4 runs failed on this test
  (flaky, not deterministic — consistent with a marginal timing budget, not
  a hang). Cross-checked against a clean `origin/main` worktree at the same
  merge base (`154e284`, already carrying XAL-1152 + XAL-1155's added
  posts): 3/3 passed there too. So this diff's one extra file is what tips
  an already-marginal test over the 5s wall — not a one-off fluke, and not
  something the next post to land here would fix by coincidence; the next
  addition after this one hits the same wall again.
  - **Fix applied:** `vitest.config.ts` — added `test.testTimeout: 20000`.
    Scoped to the actual cause (wall-clock budget that shrinks every time a
    post is added) rather than patching the one test that happened to hit
    it first; the sibling SSR tests (`h1`, `route-split`, `heading-outline`)
    share the same growing-glob cost and would be next.
  - Verified: 4/4 full-suite `vitest run` after the fix, plus a full
    `pnpm build` (`check-blog-word-count.mjs` and the rendered-HTML word
    count gate both pass at 312/312 posts).

No other regressions found. Everything that reads `src/content/blog/*.md`
keys off directory contents generically; nothing hardcodes a count, slug
list, or "the first/last post" assumption except the one test above, which
is now fixed.

## Round 3 — Security

Lens: authz, tenant isolation, injection, secrets, and anything user-supplied
that reaches a query, a path, or a page. Read `.agent/XAL-1149/SPEC.md`,
`.agent/XAL-1149/REVIEW.md` (rounds 1–2, not repeated here), and
`git diff origin/main...HEAD` directly — the diff is two files: the new
markdown post and a `testTimeout` bump in `vitest.config.ts`.

Checked:

- **Authz / tenant isolation.** No route, middleware, API handler, or
  Convex function touched. The diff is a static content file plus a test
  timeout config; there is no runtime authorization surface in it at all.
  N/A, not "checked and clean" by omission — confirmed by reading the full
  diff, not assumed from the file list.
- **Injection via the post body.** Checked whether the new markdown could
  carry an XSS payload through to either render path:
  - Client route (`src/pages/BlogPost.tsx:231`) renders the body through
    `<ReactMarkdown remarkPlugins={[remarkGfm]}>` with no `rehype-raw` (or
    any other raw-HTML plugin) in the plugin list — `react-markdown`
    strips embedded HTML by default, so even a post body containing literal
    `<script>`/`<img onerror=...>` tags would render as escaped text, not
    execute. Confirmed no `dangerouslySetInnerHTML` anywhere in
    `BlogPost.tsx` for the article body.
  - Static build path (`scripts/prerender.mjs`) doesn't parse or render
    Markdown itself — it calls the same SSR `render()` export
    (`dist-server/entry-server.js`, built from the same React tree) that
    the client uses, so it's the same `ReactMarkdown` pipeline, not a
    second unsanitized renderer.
  - Grepped the new file's body for `<script`, `javascript:`, `onerror=`,
    `onload=`, `data:text/html`, `<iframe`, raw `<a href=` — none present;
    the only link is the standard `[Book en demo](https://digilist.no/demo)`
    markdown-link CTA, same first-party URL pattern every other post uses.
  - No FAQPage JSON-LD is emitted for this post (no `POST_FAQ` entry, per
    round 1), so the inline Q&A markdown never reaches the
    `JSON.stringify`-built `<script type="application/ld+json">` block —
    no structured-data injection surface either.
- **Path safety.** `prerender.mjs` writes each post to
  `dist/blogg/<slug>/index.html` using the frontmatter `slug`. Confirmed
  `slug: treningsrom-gymhaller-personlig-trener-fitnessinstruktor` matches
  `^[a-z0-9-]+$` (filesystem-safe, no `..`, `/`, or encoded traversal
  characters) and matches the filename exactly, consistent with every
  other post. This file is hand-authored in-repo, not submitted through
  any runtime form, so there's no attacker-controlled input reaching this
  path build in this diff.
- **Secrets.** Grepped the full diff for API-key/token/secret/bearer/PEM
  shaped strings — none found. Frontmatter, body, and the `vitest.config.ts`
  hunk contain no credentials.
- **`vitest.config.ts` change.** Adds `test.testTimeout: 20000` globally.
  No security implication — it doesn't touch what's tested, mocked, or
  skipped, only how long a test is allowed to run before vitest fails it.

No findings this round. This diff has no runtime authz/tenant/query surface
to review — it's a static Bokmål content file rendered through the existing,
already-safe `react-markdown` pipeline (no raw-HTML plugin), plus an
unrelated test-timeout bump. Nothing changed; no fixes to make. Re-ran
`npx vitest run` (19 files, 38 tests, all pass) to confirm the tree is still
green before closing out the round.

## Round 4 — Scope

Lens: is anything in this diff NOT the stated change? Drive-by edits,
unrelated tidying, files nobody asked for. Read `.agent/XAL-1149/SPEC.md`,
rounds 1–3 above (not repeated here), and
`git diff origin/main...HEAD --stat` / `--name-status` directly, then
inspected every changed file's content against what the ticket and prior
rounds already justified.

Checked:

- **Full file list vs. what's justified.** `git diff origin/main...HEAD
  --name-status` shows exactly four files: `src/content/blog/treningsrom-
  gymhaller-personlig-trener-fitnessinstruktor.md` (the post — the stated
  change), `vitest.config.ts` (the `testTimeout: 20000` bump — round 2's
  root-caused, A/B-tested regression fix, not new this round), and
  `.agent/XAL-1149/{SPEC.md,REVIEW.md}` (the process record every sibling
  ticket in this repo carries — `.agent/XAL-115{2,5,6,9}` and `XAL-116{0,1,3}`
  all have the same two-file shape). No fifth file, no partial diff hiding
  in an untracked file: `git status --porcelain=2` reports a clean tree.
- **The post itself.** Read the full 59-line diff top to bottom. Every
  paragraph maps to one of the two ticket beats (PT/instructor flexible
  booking, or private gym-operator selling room time) or to the FAQ/CTA
  scaffolding every other post in this blog already uses. No tangent
  section, no unrelated product pitch, no stray keyword-stuffing paragraph
  disconnected from the two personas.
- **No edits to other posts.** Grepped the diff for any hunk touching an
  existing `src/content/blog/*.md` file — none. The one internal link this
  post adds (to the `trenings-og-badeanlegg-...svommeklubber` post) is
  one-directional; the target file itself is untouched, so no "let me also
  add a backlink" drive-by on the neighbor post.
- **No script/build/routing edits.** SPEC.md's blast-radius list named six
  consumers that key off the directory generically and predicted none would
  need a code change for a pure addition. Confirmed: `vite.config.ts`,
  `scripts/prerender.mjs`, `scripts/check-blog-word-count.mjs`,
  `scripts/check-title-lengths.mjs`, `scripts/guard-blog-redirects.mjs`, and
  every route/component file are all absent from the diff. The only non-
  content file touched is the `vitest.config.ts` timeout, which is a fix
  for a regression this diff's own file addition caused, not scope creep —
  it was necessary to keep the diff from breaking `pr-check.yml`, which is
  the definition of in-scope.
- **No asset additions.** The post reuses an existing cover
  (`booking_calendar_hero_no.webp`) already committed on `main`; no new
  image, no new `-preview.webp` sibling, nothing added under `public/` or
  `dist`.
- **The `dist/` and `dist-server/` directories** show as clean in
  `git status` — the build artifacts present on disk from this session's
  `pnpm build` runs are untracked-but-gitignored per
  `project_dist_server_tracked_but_gitignored` in memory, not part of this
  diff, and `git status --porcelain` confirms zero pending changes there.
- **The "step 0 / write AGENT-SPEC.md and attach it to Linear" instruction**
  in this round's own prompt was not acted on. That is itself a scope
  check: round 2 already traced this exact request, found it's the same
  move main deliberately reverted (`15c7b14`) after it caused merge-conflict
  pileups across sibling agent branches, and no Linear MCP tool is reachable
  in this environment regardless (confirmed XAL-1151 and others). Doing it
  now would be adding an out-of-scope file this round, not fixing anything
  — so the correct scope call is the same as round 2's: don't.

No findings this round. Every file in the diff is either the stated content
change, the one regression fix rounds 2–3 already justified and re-verified,
or the standard `.agent/<TICKET>/` process record this repo's convention
requires. Nothing to fix; no commit needed beyond this record. Re-ran
`npx vitest run` (19 files, 38 tests, all pass) one more time before closing
out — tree is green.
