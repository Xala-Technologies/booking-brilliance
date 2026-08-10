# XAL-1115 review log

## Round 1 — CORRECTNESS

Lens: does the change do what the acceptance criteria in `.agent/XAL-1115/SPEC.md`
say, including edge cases? Checked the diff against `origin/main`
(`.agent/XAL-1115/SPEC.md` + `pnpm-workspace.yaml` + the new post — 259 lines
total), then re-ran every gate the acceptance criteria name, then read the
post itself line by line for internal consistency.

### What I checked

- **Build/test gates named in the acceptance criteria**, run directly rather
  than trusted from the SPEC's prose:
  - `node scripts/check-title-lengths.mjs` → `ok   60
    bryllupsmottak-bankettsaler-storre-selskaper-hoy-kontraktverdi.md`
    (title renders at 60 chars, under the 65 cap).
  - `node scripts/check-blog-word-count.mjs` → all 324 posts (323 + this one)
    pass both the raw-markdown and the rendered-`dist/blogg` word-count gates.
  - `npx vitest run src/lib/post-slugs.test.ts` → pass (slug is unique).
  - `npx vitest run` (full suite) → 20 files, 40 tests, all green, including
    `entry-server.h1.test.tsx` and `entry-server.main-landmark.test.tsx`.
  - `pnpm lint` → 0 errors (40 pre-existing warnings in unrelated files, none
    touched by this diff).
  - Confirmed `dist/blogg/bryllupsmottak-bankettsaler-storre-selskaper-hoy-kontraktverdi/index.html`
    exists and its rendered `<h1>` matches the frontmatter `title` exactly.
- **Internal links** the SPEC claims "verified to resolve": grepped each
  target slug (`bryllupslokale-typer-gard-hotell-selskapslokale-ute`,
  `bryllupslokale-utleier-pris-booking-kontrakt`,
  `spesiallokaler-niche-utleie-teaterscene-kjeller`,
  `utleieobjekt-veiviser-steg-for-steg`) against `src/content/blog/*.md` — all
  four exist. The CTA link style (`https://digilist.no/demo` vs relative
  `/demo`) matches the majority house style (31 posts vs 4).
- **Duplication claim** ("no existing post covers bankettsal/bryllupsmottak
  as a distinct topic"): re-ran the SPEC's own greps independently rather
  than trusting them. `bryllupsmottak` — zero other hits, confirmed. But
  `grep -liE "bankettsal|banquet"` turns up **one file the SPEC missed**:
  `bryllupslokale-filtrer-stil-uteareal-tilgjengelighet.md` uses the word
  once, describing a hotel's "ferdig oppdekket bankettsal" as one bullet in a
  style comparison for couples. Read it — it's a single incidental mention in
  a consumer-facing venue-style post, not a treatment of banquet capacity or
  owner economics, so it doesn't actually duplicate this post. The SPEC's
  "zero hits" claim for that grep was imprecise, but the underlying
  distinctness claim in the acceptance criteria holds. Not worth a content
  change; flagging so the SPEC's evidence trail is accurate for whoever reads
  it next.
- **POST_FAQ registration**: the new post has a "Vanlige spørsmål" section but
  no entry in `src/content/blogFaq.mjs`. Checked whether this is required —
  it isn't: only 7 of 47 posts with a FAQ section have a `POST_FAQ` entry
  (it's what drives FAQPage JSON-LD, opt-in and rare). No finding.
- **Numeric self-consistency of the content itself** (this is the
  acceptance-criteria's core claim — "higher average contract value" — so a
  wrong number here is a correctness bug in the substance of the post, not
  just prose quality): read every kroner figure in the post and checked they
  compose correctly.

### Finding (fixed)

The intro (paragraph 1) claimed the **full contract** (venue + catering + bar
+ lodging combined) "ofte passerer 150 000–300 000 kroner". Section 2 then
computes **catering alone**, before venue rental is even added
("kuvertprisen... 225 000–350 000 kroner, før lokaleleien er lagt til") — a
sub-component of the total that already meets or exceeds the intro's stated
total-contract ceiling. A reader doing the arithmetic the post itself walks
through would find the pieces don't add up to the headline number, which
undermines the exact economic argument ("higher contract value") the
acceptance criteria require the post to make credibly.

**Fix:** changed the intro's total-contract range from "150 000–300 000
kroner" to "300 000–500 000 kroner" in
`src/content/blog/bryllupsmottak-bankettsaler-storre-selskaper-hoy-kontraktverdi.md`
— now consistent with catering-alone (225k–350k) plus venue/bar/lodging on
top, and still consistent with the "300 000-kroners bryllupshelg" deposit
example later in the post (now sits near the low end of the range instead of
above the stated ceiling).

**Fix:** corrected the SPEC's grep evidence in
`.agent/XAL-1115/SPEC.md` — noted the one incidental `bankettsal` mention in
`bryllupslokale-filtrer-stil-uteareal-tilgjengelighet.md` that the original
"zero hits" claim missed, and why it doesn't affect the distinctness
conclusion.

### Not fixed / not findings

- `pnpm-workspace.yaml`'s `allowBuilds` addition (from the checkpoint commit)
  is environment setup (`pnpm approve-builds --all`, per
  `project_pnpm_build_needs_approve_builds` in memory), not scope creep by
  the content change — left as-is.
- Package minimum-guest figures ("100–150 gjester" for pricing tiers vs.
  "120–150" for the bankettsal definition threshold in the FAQ) are two
  different concepts — a package's minimum can legitimately sit below the
  categorization threshold — not a contradiction.

All gates re-run green after the fix: `npx vitest run` (40/40),
`node scripts/check-blog-word-count.mjs`, `node scripts/check-title-lengths.mjs`,
`pnpm lint` (0 errors).

## Round 2 — REGRESSION

Lens: what else reads this code path — not just the files this diff touched,
but every consumer of the blog pipeline — and did anything depend on
behaviour this new file changes? Grepped every consumer named in
`.agent/XAL-1115/SPEC.md`'s blast-radius section plus a few it didn't name,
then re-ran the full test suite to confirm.

### What I checked

- **`src/lib/blogFrontmatter.ts`** — `tag` is a plain untyped `string`, no
  enum/union to violate. `tag: "Utleier"` needs no registration anywhere.
- **`src/pages/BlogPost.tsx` `relatedSolutions()`** — regex-matches
  slug+title+tag+keywords against `SOLUTION_PAGES`. The new post's hay
  contains "bryllupsmottak" (matches the `bryllup|fest|selskap` pattern) →
  correctly links to `/bruksomrader/selskapslokaler`. No crash, no false
  match on the other four solution-page patterns.
- **`sidebarRelated` (same-tag backfill) and `related` (latest-3 strip)** —
  both walk `getAllPosts()` with no count assumptions the new post could
  violate; `Array.prototype.sort` is stable so the several other posts
  sharing this post's `date: 2026-08-10` don't collide or throw, just keep
  glob order among ties (cosmetic, pre-existing for every same-date batch).
- **`src/lib/search/corpus.ts`** — blog items are mapped dynamically from
  `getAllPosts()`, keyed by slug (unique, confirmed round 1). No fixed list
  to update, no ID collision.
- **`public/sitemap.xml`** (git-tracked, 19 URLs) vs. `dist/sitemap.xml`
  (regenerated by `scripts/prerender.mjs` from every post at build time,
  confirmed at `scripts/prerender.mjs:2599-2706`) — the tracked file is a
  small hand-curated subset that doesn't include the sibling posts
  (`spesiallokaler-niche-utleie-*`, `studio-fotografi-*`) either, so not
  including this post there isn't a gap this diff introduces.
- **`scripts/indexnow-submit.mjs`** — manually invoked, static
  `DEFAULT_PATHS` list, not wired to the build or to `content/blog/*`; the
  new post doesn't need an entry there any more than the sibling posts have
  one.
- **No hardcoded tag lists** in `src/pages/Blog.tsx` / `BlogPreview.tsx` /
  `BlogPreviewSection.tsx` that would need a new case for `"Utleier"` (tags
  render dynamically from whatever `getAllPosts()` returns).
- **`src/content/blogFaq.mjs` / `POST_FAQ`** — re-confirmed round 1's finding
  that registration is opt-in and rare; no consumer assumes every post with
  a "Vanlige spørsmål" section has an entry.
- **`author`/`role` fields** — passed straight through to the byline
  component (`BlogPost.tsx:154-155,209-210`), no author registry/bio lookup
  keyed by name to break.
- **Routing** (`src/App.tsx:353-362`) — `/blogg/:slug` is a single generic
  route; the new slug doesn't start with `preview` (the one reserved
  prefix), so no collision with `/blogg/preview/:draftId`.
- **Full test suite**: `npx vitest run` → 20 files, 40 tests, all green,
  including `entry-server.heading-outline.test.tsx`,
  `entry-server.h1.test.tsx`, `entry-server.main-landmark.test.tsx`,
  `post-slugs.test.ts`, and the two other hardcoded-post description tests
  (untouched, still pass).

### Finding (not a regression — pre-existing, confirmed, not fixed)

`BlogPost.tsx`'s trailing-CTA stripper (`isCta`, lines 118-127) removes the
*last paragraph* of an article's body if it contains a `[Book en demo`
link, on the theory that the styled CTA band below the article
(`BlogPost.tsx:385-419`) already provides one and an in-article copy would
be a duplicate. This new post's closing section follows the same house
style as its siblings — `## <heading>` immediately followed by one prose
paragraph that ends with `[Book en demo](https://digilist.no/demo)` — so
that whole closing paragraph gets stripped, leaving the `<h2>` rendered with
no body text under it. Verified in the actual build output:
`dist/blogg/bryllupsmottak-bankettsaler-storre-selskaper-hoy-kontraktverdi/index.html`
has `<h2 id="book-en-demo-og-se-bankettsalen-bookbar-i-sanntid">...</h2>`
directly followed by the "Relevante løsninger" aside, no `<p>` in between.

I checked whether this new post caused it or just inherited it: the already
*live* sibling post `spesiallokaler-niche-utleie-teaterscene-kjeller.md`
(shipped in an earlier PR, `content(XAL-1128)`) has the byte-for-byte same
structure and exhibits the identical empty-heading rendering in its own
`dist/blogg/.../index.html`. This is shared `BlogPost.tsx` behaviour that
already affects production posts before this branch existed — not something
this diff's content changed or regressed. Fixing it would mean changing
`isCta` or the house style for the whole ~40-post family sharing this
pattern, which is out of scope for a single content-gap ticket and would
need its own review. Left as-is; not fixed, noted for whoever next touches
`BlogPost.tsx` or the closing-CTA convention.

### Not fixed / not findings

- Nothing else in this round produced a finding — every consumer grepped
  above reads the new post exactly the way it reads all 323 existing ones,
  with no special-casing anywhere that this file could fall outside of.

No code changes this round (the one finding is pre-existing and out of
scope, per above). All gates re-verified green: `npx vitest run` (40/40).

## Round 3 — SECURITY

Lens: authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path, or a page. Read the full diff
(`git diff origin/main...HEAD` — 4 files, 448 insertions, no deletions: the
new post, `pnpm-workspace.yaml`'s `allowBuilds` block, and the two `.agent`
docs) and traced every place its content actually lands at runtime.

### What I checked

- **Authz / tenant isolation** — not applicable to this diff. It adds a
  static Markdown file to a public, unauthenticated marketing blog; no
  database, session, role, or tenant-scoped code path is touched. Confirmed
  by the diff stat itself (content + one config file only, no `src/`
  application code changed).
- **Rendering pipeline / stored-content XSS** — `src/pages/BlogPost.tsx`
  renders post bodies with `react-markdown` + `remark-gfm` only; no
  `rehype-raw` plugin is registered anywhere in the tree (`grep -rn
  "rehype-raw|rehypeRaw" src/ vite.config.ts` — no hits), so raw HTML inside
  a post body is escaped as text, not executed, regardless of what the
  Markdown contains. Confirmed the new post has no embedded HTML, no
  `javascript:`/`data:` URLs, and no unusual link syntax — every link is a
  plain `https://` or an internal `/blogg/<slug>`, `/bookingsystem-utleie`
  path.
  `title`/`description`/byline fields are interpolated into JSX (auto-escaped
  by React) and into JSON-LD (`JSON.stringify`'d, same pattern as all 323
  existing posts) — the new post's frontmatter is plain prose with no quotes,
  angle brackets, or script-breaking characters, so it doesn't exercise
  whatever systemic JSON-in-`<script>` escaping behavior the blog engine has
  one way or the other. Not a finding: pre-existing engine behavior common to
  every post, not something this diff introduces or is uniquely exposed to.
- **Frontmatter parsing** (`src/lib/blogFrontmatter.ts`) — read in full.
  `parseFrontmatter` is a hand-rolled regex line parser: no `eval`, no
  `new Function`, no YAML/JS deserializer with an object-injection surface.
  Values are only ever cast with `as string`/`as number`, never executed.
- **Path-shaped sink for a content-controlled field**: `post.slug` is the one
  frontmatter value that ends up directly inside a filesystem path,
  `join(DIST, "blogg", post.slug)` in `scripts/prerender.mjs:2562`, with no
  character-set validation anywhere in the pipeline before that join — only
  a uniqueness check (`src/lib/post-slugs.test.ts`), never a path-traversal
  check. That's a real latent gap in the *pipeline* (a `slug: "../../evil"`
  in some future post's frontmatter would prerender outside `dist/blogg/`),
  but it is not introduced by this diff and not exploitable by it: this
  post's `slug` is
  `bryllupsmottak-bankettsaler-storre-selskaper-hoy-kontraktverdi`, lowercase
  ASCII/digits/hyphens only, matching the filename and the convention every
  other one of the 323 existing posts already follows. Fixing pipeline-wide
  slug sanitization is out of scope for a single content-gap ticket (same
  call round 2 made for the pre-existing `isCta` stripper bug) — noted here
  for whoever next touches `prerender.mjs` or the frontmatter contract.
- **Secrets** — `git diff origin/main...HEAD | grep -iE
  "api[_-]?key|secret|token|password|BEGIN (RSA|PRIVATE)|ghp_|sk-"` → no
  hits. `pnpm-workspace.yaml`'s `allowBuilds` block only lists four known
  package names (`@swc/core`, `better-sqlite3`, `esbuild`, `sharp`) with
  boolean values — an explicit lifecycle-script allowlist (narrows what pnpm
  will run post-install), not a new capability grant or a credential.
- **External links / domain spoofing** — the post's one external link is
  `https://digilist.no/demo`, the same production domain and CTA target used
  by 31 of 35 other posts (confirmed in round 1); no lookalike domain, no
  redirect-through-third-party pattern.

### Findings

None. This diff has no application code surface for authz, tenant
isolation, or injection to act on — it is a static content file plus a
build-tooling config change. The one latent issue found (unsanitized `slug`
reaching a filesystem path in `prerender.mjs`) is a pre-existing, pipeline-
wide gap this diff does not introduce and is not exploitable through, so
nothing was fixed this round.

All gates re-verified green: `npx vitest run` (40/40),
`node scripts/check-blog-word-count.mjs`, `node scripts/check-title-lengths.mjs`,
`pnpm lint` (0 errors).

Also confirmed at the start of this round: `.agent/XAL-1115/SPEC.md` already
exists (written by the session that made the `content(XAL-1115)` commit) and
already contains the mermaid diagram, blast radius, and acceptance criteria
— step 0 was in fact completed earlier, despite this round's prompt
asserting otherwise. Per `project_root_agent_spec_deleted_trap.md` in
memory, the per-branch `.agent/XAL-1115/SPEC.md` is the correct location (a
root `AGENT-SPEC.md` was deliberately removed from `main` because per-branch
copies collide on merge), so no new file was created. Linear attachment
remains blocked on the pre-confirmed absence of Linear MCP tools in this
environment (recorded in the SPEC's own "Linear attachment status" section).
