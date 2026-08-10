# XAL-1134 — Adversarial review log

## Round 1 (correctness)

Lens: does the change do what the acceptance criteria say, on the edge
cases too? Checked the ticket's ask against the SPEC and the actual diff
(`git diff origin/main...HEAD`), then re-ran the pipeline myself rather than
trusting the prior session's claims.

Ticket ask, checked point by point:
- "Write and publish SEO content for Spesialiserte idrettssteder (tennis,
  bowling, basketball, gym)" — one new post added, all four sport types
  covered with dedicated per-type requirements (tennisbane dekketype,
  bowlinghall baneantall/utstyr, basketballbane inne/ute/banestørrelse,
  gym-utstyr). Keyword sweep: tennis 18, bowling 14, basketball 15, gym 12
  hits.
- "Idrettslag og privatpersoner søker booking ... for turnering og trening —
  nisjebehov med regelmessig etterspørsel" — post opens with a 3-persona
  vignette (turnering, fast trening, privatperson enkelttime) and has a
  dedicated "Turnering og fast trening stiller ulike krav" section
  contrasting the two booking patterns, plus the "regelmessig etterspørsel"
  framing in the opening/closing. idrettslag 4, privatperson 9, turnering
  14, trening 10 hits.
- "Goal: satisfy search intent for 'spesialiserte'" — in the title, meta
  description, first sentence of the body, and a whole H2 dedicated to what
  "spesialisert" means vs. a generic idrettshall. spesialiserte 9 hits.
- "Blog post itself must be in Norwegian Bokmål" — read the full body,
  Bokmål throughout, no bokmål/nynorsk mixing spotted.

Edge cases / pipeline gates, re-verified live in this checkout (not just
trusted from SPEC.md):
- `node scripts/check-title-lengths.mjs` → `ok 56` for this slug.
- Word count computed directly from the frontmatter-stripped body → 1076
  words, well over the 200-word gate.
- `npx vitest run` → 20 files / 40 tests pass, including the SSR
  `<h1>`/`<main>`-landmark invariant tests that generically cover every
  blog post route.
- `node scripts/guard-blog-redirects.mjs --check --all` → this slug not
  claimed by any standing redirect (`✓ ... → HTTP 200`). Note: `--check`
  alone (no `--all`) reports "0 posts to check" once everything is already
  committed, because it diffs `git status --porcelain`, not `HEAD` vs.
  `origin/main` — that's expected script behavior, not a bug, but worth
  remembering for later rounds so it isn't mistaken for "the guard didn't
  run."
- Cover image `public/images/blog/sanntidskalender_hero_no.webp` exists.
  Internal link target `idrettshall-ledige-tider-per-banetype-lag-foreninger.md`
  exists. Slug is unique across `src/content/blog/*.md`. All frontmatter
  fields match `BlogFrontmatter` in `src/lib/blogFrontmatter.ts`.

Finding — scope creep, confirmed and fixed:
- `pnpm-workspace.yaml` gained an `allowBuilds` block (`@swc/core`,
  better-sqlite3, esbuild, sharp) in the `bd003e2` checkpoint commit. This
  is a side effect of running `pnpm approve-builds --all` during a prior
  session's local verification, swept into the commit by accident — it has
  nothing to do with this content ticket. The exact same class of mistake
  was already caught and reverted in three sibling branches (XAL-1142
  round 4 `665e144`, XAL-1163 round 4 `426226d`, XAL-1166 round 1
  `36b2359`), so this isn't a judgment call, it's a known, established
  correction. Reverted `pnpm-workspace.yaml` back to the `origin/main`
  version in this round; `npx vitest run` still 20/20 files, 40/40 tests
  after the revert.

No other correctness issues found this round.

## Step 0 note (this round)

The resumed-run preamble claimed root `AGENT-SPEC.md` was missing and asked
for it to be (re)written and attached to the Linear issue. Checked
`git log --all --oneline | grep 15c7b14` first, per
[[project_root_agent_spec_deleted_trap]]: main commit `15c7b14` ("chore:
remove agent scaffolding from main") deliberately deleted that file because
per-branch copies collide on every merge back to main. Did NOT recreate it.
`.agent/XAL-1134/SPEC.md` already has the full investigation, diagram and
verdict from a prior round, so step 0's substance is satisfied. Linear
attachment is unreachable regardless (no Linear MCP server in this
environment, per [[project_no_linear_mcp_tools_available]]) — already noted
in SPEC.md's "Linear attachment note".

## Round 2 (regression — what else reads this code path)

Lens: this diff adds one new content file and touches no code
(`git diff origin/main...HEAD --stat` — only `.agent/XAL-1134/*` and the new
`.md`). The question this round asks: does anything that already reads
`src/content/blog/*.md` (or the derived `virtual:blog-meta` /
`getAllPosts()`) break, silently change, or turn out to have depended on the
old (317→318... actually 316→317) post count, tag set, or ordering?

Grepped every consumer of `content/blog` / `virtual:blog-meta` /
`getAllPosts` beyond the files SPEC.md already walked
(`blogMetaPlugin.ts`, `posts.ts`, `postContent.ts`, `BlogPost.tsx`
`SOLUTION_PAGES`, `prerender.mjs`, the build-gate scripts,
`post-slugs.test.ts`, `blogFaq.mjs`), and checked each one specifically for
this-round's question:

- `src/pages/Blog.tsx` — builds its tag filter list (`tags` useMemo) by
  scanning `allPosts` and `Set.add`-ing every `post.tag` seen; no hardcoded
  tag enum. New post's tag `"Lag og foreninger"` already exists on other
  posts (the two structural precedents), so no new filter option is silently
  introduced and nothing assumed a closed tag set.
- `src/components/BlogPreviewSection.tsx` (homepage "Lesestoff" widget) —
  takes `getAllPosts().slice(0, 6)`, sorted by date descending. This post is
  dated 2026-08-10 (today), so it now sorts into that top-6 slice. That's
  the intended behavior of a "latest posts" widget for a newly published
  post, not a regression — nothing in this component assumes a fixed post
  set or count (`posts.length === 0` is the only length check, for the
  empty-state early return).
- `src/lib/webp-sources.test.ts` — asserts every post's `previewCover()`
  output exists on disk if it differs from the raw cover. This post reuses
  `sanntidskalender_hero_no.webp`, the same cover already used (and already
  covered by this test) by the two closest precedent posts, so no new webp
  asset dependency was introduced. Test passed (3/3).
- `src/lib/digitalt-bookingsystem-description.test.ts` and
  `src/lib/leie-selskapslokale-description.test.ts` — each hardcodes a
  lookup for one specific pre-existing slug's description length; neither
  reads or is affected by the new post. Confirmed by reading both files.
- `src/entry-server.main-landmark.test.tsx` — its blog-post case picks
  `getAllPosts()[0]` (i.e., whichever post sorts first) and asserts the SSR
  output has exactly one `<main>`. Because this post is now dated today it
  can become that `[0]` element depending on tie-break order among
  same-date posts — checked that the assertion is generic (single `<main>`,
  `<nav>` before it, `<footer>` after it) with no per-slug hardcoding, so
  this is fine regardless of which post lands in that slot. Test passed.
- `scripts/sync-convex-blog-to-fs.ts` / `scripts/dedup-blog-drafts.ts` —
  Convex→filesystem admin-publish tooling; both operate on Convex draft
  records, not on `src/content/blog/*.md` as a read source, and this post
  was authored directly as a file (same as the rest of the recent batch),
  so neither script's behavior changes. `sync-convex-blog-to-fs.ts` does
  encode a real invariant worth noting for future posts in this repo (not a
  finding here — this post's cover is already full-size, not a `-preview`
  variant): a post's `cover` must never point at an `optimize-images.mjs`
  `-preview.webp` sibling, or `previewCover()` looks for a
  `*-preview-preview.webp` that can't exist and `webp-sources.test.ts`
  fails.
- No test or script anywhere hardcodes a total post count
  (`grep -rn "toBe(31" src --include="*.test.ts*"` → no hits), so the
  316→317 count change this post causes has no fixed-count assertion to
  break.
- Ran the full suite after the check: `npx vitest run` → 20 files / 40
  tests, all still pass, including the three consumers above that touch
  every post generically.

**Finding: none.** This is a pure content addition with no code changes;
every consumer of the blog corpus either scans it generically (no closed
enum, no fixed count) or is scoped to a different, unrelated slug. Nothing
in the existing test/script surface depended on behavior this post's
presence changes. No fixes made this round.

## Round 3 (security — authz, tenant isolation, injection, secrets, user input)

Lens: this round asks whether anything user-supplied reaches a query, a
path, or a page, and whether the diff introduces an authz/tenant-isolation
gap, an injection vector, or a leaked secret. `git diff origin/main...HEAD
--stat` confirms the diff is still just `.agent/XAL-1134/*` plus the one new
`.md` file — no code changed, so there is no new query, route, or auth check
for this round to inspect on its own merits. Checked anyway, on the actual
content, not just "it's markdown so it's fine":

- **Authz / tenant isolation.** N/A — no code touched, no query added,
  nothing in this diff reads or writes tenant-scoped data. The post is
  static prose baked at build time by `scripts/prerender.mjs`, same as
  every other post in the 317-post corpus.
- **Injection.** Scanned the new file for `<script`, `<iframe`,
  `javascript:`, `onerror=`/`onload=`, `<img`, `<a `, `data:text/html`, and
  bare `http://` — none present (`grep -niE` over the full body, zero
  matches). Even if raw HTML were present, it wouldn't execute: `BlogPost.tsx`
  renders post bodies with `ReactMarkdown` + `remarkGfm` only — no
  `rehype-raw` plugin and no `dangerouslySetInnerHTML` anywhere in the blog
  render path (`grep -rln "dangerouslySetInnerHTML|rehype-raw|rehypeRaw"
  src/ build-plugins/ scripts/` → only an unrelated hit in
  `src/components/ui/chart.tsx`, nothing in the blog post pipeline), so
  `react-markdown`'s default HTML-escaping is the actual backstop here, not
  just "this content happens to be clean."
- **YAML/frontmatter injection.** All frontmatter string values that could
  contain a colon or special character (`title`, `description`, `author`,
  `role`, `cover`) are double-quoted; `slug` is bare but matches
  `^[a-z0-9-]+$` (verified with a regex check), so it can't break out of the
  YAML block or, downstream, be used as a path-traversal payload when
  `prerender.mjs` and `postContent.ts` build the `dist/blogg/<slug>/`
  output path from it.
- **Secrets.** Scanned for API keys, tokens, passwords, bearer strings, IPs,
  and email addresses (`grep -niE
  'api[_-]?key|secret|password|token|bearer|<ip>|<email>'`) — zero matches.
  Only real "identity" data in the file is the existing public byline
  (`author: "Ibrahim Rahmani"`), same as every other post in the corpus.
- **User-supplied data reaching a query/path/page.** There is none in this
  diff — the only two links in the body are hardcoded, verified targets: the
  internal cross-link to `/blogg/idrettshall-ledige-tider-per-banetype-lag-foreninger`
  (file exists in `src/content/blog/`) and the CTA
  `https://digilist.no/demo`, which matches the majority convention already
  used by 18 other posts in the corpus (a handful use relative `/demo`
  instead — a pre-existing inconsistency across the whole corpus, not
  something this post introduces or that has any security implication).
  Neither is attacker-controlled or built from input at request time.

**Finding: none.** No authz surface, no injection vector, no secret, no
attacker-reachable path in this diff — it's a static, build-time-baked
Markdown file with clean frontmatter and no embedded HTML/script content.
No fixes made this round.
