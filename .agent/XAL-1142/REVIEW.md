# XAL-1142 — Adversarial Review

## Round 1 — Correctness

**Lens:** Does the change do what the acceptance criteria say, including edge
cases? Read `.agent/XAL-1142/SPEC.md`, the diff (`git diff origin/main...HEAD`),
and exercised the actual build/test pipeline rather than trusting the SPEC's
claims at face value.

**Checked:**

1. **Frontmatter shape vs `BlogFrontmatter`/`parseFrontmatter`**
   (`src/lib/blogFrontmatter.ts`) — all required fields present, `date:
   2026-08-10` parses through the hand-rolled parser and
   `new Date(...).toISOString().slice(0,10)` round-trip correctly (no quotes,
   not misparsed as a number since it contains dashes), `keywords` is a
   valid bracketed/quoted array, `tag: "Utleier"` matches an existing tag
   value used across 30+ other posts (not a new/misspelled one).
2. **Cover image exists on disk** — `/images/blog/accessibility_hero_no.webp`
   resolves under `public/images/blog/`, confirmed also present in `dist/`
   and `dist-server/` after build (reused from the WCAG post as SPEC.md
   claims, not a dangling reference).
3. **Internal link target is real** — `/blogg/universell-utforming-wcag-kommunal-booking`
   matches that post's actual `slug:` frontmatter field.
4. **Slug/filename consistency and uniqueness** — filename, frontmatter
   `slug:`, and the only occurrence of that slug in `src/content/blog/*.md`
   all agree.
5. **Build-time gates, run for real (not assumed from SPEC.md's prose):**
   - `pnpm test` (vitest): 20 files / 40 tests pass, including the
     SSR `<h1>` invariant test and the `<main>`-landmark test — this new
     post doesn't trip either.
   - `scripts/check-title-lengths.mjs`: no complaint (title is 55 chars,
     well under the 65-char threshold it flags).
   - `scripts/check-blog-word-count.mjs`: **initially failed for all 315
     posts** (not just this one) when run against a stale `dist-server`
     bundle left over on disk from the prior interrupted session — the
     first `<article>` tag in the stale HTML belonged to a leaked
     homepage `HeroSection` customer-logo card, not `BlogPost.tsx`'s
     article, so the script's regex measured the wrong content and
     reported ~4 words everywhere. Rebuilt `dist-server` + `dist` from
     clean source (`vite build --ssr ...` → `vite build` →
     `prerender.mjs`) and reran: **passes cleanly, this post included**
     (title, `<h1>`, meta description, canonical URL, and sitemap entry
     all correct in the freshly rendered
     `dist/blogg/tilgjengelighet-lokaler-nedsatt-funksjonsevne/index.html`).
     Confirmed this was stale build output, not a regression, by building
     `origin/main` in a scratch worktree with the same `node_modules` and
     observing normal (~90–99KB) page sizes there too, matching this
     branch's own output once rebuilt clean. `dist/`/`dist-server/` are
     gitignored working-tree artifacts, not something this diff commits.
6. **Content/legal accuracy** — the post cites the current Norwegian law
   name (*likestillings- og diskrimineringsloven*) for the universal-design
   duty and TEK17 §12 for physical building minimums, consistent with
   current legislation (the older, repealed *diskriminerings- og
   tilgjengelighetsloven* name only appears in SPEC.md's grep search
   terms, not in the published post itself — correct).
7. **FAQ block** — matches the exact `**Question?** Answer` pattern used by
   sibling gap-fill posts (checked against
   `treningsrom-gymhaller-personlig-trener-fitnessinstruktor.md`); correctly
   left unregistered in `src/content/blogFaq.mjs`, matching how XAL-1143/
   1145/1149 shipped.
8. **`pnpm-workspace.yaml` `allowBuilds` addition** — unrelated to the
   ticket's content goal but harmless and consistent with this repo's
   known "approve-builds before first build" requirement; not a
   correctness defect for this ticket, just noted so it isn't mistaken for
   silent scope creep in a later round.

**Findings:** None that require a code change. The one real scare (the
word-count gate failing across all 315 posts) traced back to stale local
build artifacts from the interrupted prior session, not to anything in this
diff — rebuilding from clean source resolves it and all gates pass,
including specifically this new post's rendered output.

**Changes made this round:** None to the tracked diff. Rebuilt `dist/` and
`dist-server/` locally to verify (both gitignored, not committed).

## Round 2 — Regression

**Lens:** What ELSE reads this code path, beyond the files touched by this
diff? Grepped every consumer of `src/content/blog/*.md`,
`virtual:blog-meta`, `getAllPosts`, `getPostBySlug`, and `blogFrontmatter`
across the whole repo (not just SPEC.md's 8-item blast-radius list), and
checked each one for behaviour that depends on the *old* set of posts.

**Checked:**

1. **Full consumer sweep** (`grep -rl` for the above symbols across
   `.ts/.tsx/.mjs/.js`) surfaced 8 files SPEC.md's blast-radius section
   didn't name: `convex/content/publish.ts`, `scripts/dedup-blog-drafts.ts`,
   `scripts/sync-convex-blog-to-fs.ts`, `tools/content-agent/src/generate.ts`,
   `tools/content-agent/src/publish.ts`, plus three test files
   (`src/content/blog-xal739-aeo.test.ts`, `src/lib/post-slugs.test.ts`,
   `src/lib/webp-sources.test.ts`).
2. **`scripts/sync-convex-blog-to-fs.ts`** — read in full. This is the
   Convex → filesystem pull used by the *editorial* workflow (admin
   publishes a draft in Convex, operator runs `pnpm content:sync`). It only
   **writes** files whose slug matches a Convex `published` draft, keyed by
   `extractSlug()`; it never deletes or touches files with no matching
   draft. This branch's new slug
   (`tilgjengelighet-lokaler-nedsatt-funksjonsevne`) isn't a Convex draft,
   so this script can't overwrite or clobber it on a future sync — confirmed
   by reading the write loop (`fs.writeFileSync` gated on `extractSlug(d)`
   matching one of `published`, nothing iterates the *filesystem* side to
   prune orphans).
3. **`scripts/dedup-blog-drafts.ts`** — read in full. Operates entirely on
   Convex draft records (`status: published → rejected`); its own docstring
   confirms "the live site — served from committed `src/content/blog/*.md`
   — is untouched." No interaction with a committed file.
4. **`convex/content/publish.ts`, `tools/content-agent/{generate,publish}.ts`**
   — grepped for `content/blog`/`readdir`/`glob`; all three only reference
   the directory *path* in comments/prompts describing the target format
   for future generation, none reads the directory contents at runtime. No
   regression surface.
5. **Test files that iterate all posts, run for real (not assumed):**
   `pnpm vitest run src/lib/post-slugs.test.ts src/lib/webp-sources.test.ts
   src/content/blog-xal739-aeo.test.ts src/content/blogFaq.test.ts
   src/entry-server.h1.test.tsx src/entry-server.main-landmark.test.tsx
   src/lib/digitalt-bookingsystem-description.test.ts
   src/lib/leie-selskapslokale-description.test.ts` → **8 files / 18 tests,
   all pass.** In particular `post-slugs.test.ts` (uniqueness across every
   post, added after a real slug-collision incident) and
   `webp-sources.test.ts` (cover image resolution, including the
   `*-preview.webp` footgun documented in `sync-convex-blog-to-fs.ts`'s
   comments) both pass with this post's frontmatter in the set.
6. **`src/lib/search/corpus.ts`** — read in full. Concatenates
   `getAllPosts()` blog items with static section/route items for the
   sitewide search and chatbot context; no cap, no per-tag/per-keyword dedup
   that a new post could silently collide with or push out.
7. **`pnpm-workspace.yaml` `allowBuilds` addition (flagged, not fixed, in
   Round 1)** — checked whether it perturbs the CI install path
   (`pnpm install --frozen-lockfile`, used by `pr-check.yml`,
   `lint-main.yml`, `deploy.yml`). `allowBuilds` is a pnpm-workspace-level
   setting, not part of `pnpm-lock.yaml`'s resolution graph — confirmed
   `pnpm-lock.yaml` has no diff on this branch, and ran
   `pnpm install --frozen-lockfile` locally: "Lockfile is up to date,
   resolution step is skipped. Already up to date." No regression to the
   frozen-lockfile CI gate.

**Findings:** None. This is a pure content addition; every consumer that
reads `src/content/blog/*.md` — including the ones outside SPEC.md's
original blast-radius list — keys off the directory or Convex state
generically, none hard-codes the old post set, and the editorial
Convex-sync tooling is pull-only/dry-run and cannot clobber a file that
isn't one of its own drafts.

**Changes made this round:** None — no regression surface found, so
nothing to fix.

## Round 3 — Security

**Lens:** Authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path or a page. Read the full diff
(`git diff origin/main...HEAD`) plus the rendering pipeline the new content
flows through, rather than assuming a content-only PR is automatically safe.

**Checked:**

1. **No user-supplied input anywhere in this diff.** The new file
   (`src/content/blog/tilgjengelighet-lokaler-nedsatt-funksjonsevne.md`) is
   author-written static Markdown, committed to the repo — not data
   submitted through a form, API, or Convex mutation at request time. There
   is no query, no tenant/org context, and no authz check to bypass in a
   static blog post.
2. **Markdown-to-HTML injection surface** — grepped for `react-markdown`
   usage (`src/pages/BlogPost.tsx:231`, `BlogPreview.tsx:296`): neither
   passes `rehype-raw` or `allowDangerousHtml`, and no
   `dangerouslySetInnerHTML` exists anywhere in the blog render path
   (confirmed the only repo-wide hit is unrelated,
   `src/components/ui/chart.tsx`). Raw HTML/`<script>` embedded in a
   post body would render as inert literal text, not execute — checked
   this new post's body directly for `<script`, `<img`, `<iframe`,
   `javascript:`, `onerror=`/`onclick=`: zero hits, moot either way.
3. **Links in the new post** — one internal link
   (`/blogg/universell-utforming-wcag-kommunal-booking`, already verified
   live in Round 1) and one external link
   (`https://digilist.no/demo`, the site's own domain, matching the CTA
   pattern used by every sibling gap-fill post). No off-domain or
   attacker-controlled URL introduced.
4. **Frontmatter → `<Seo>` / JSON-LD** (`BlogPost.tsx:133-134,150-151`)
   — `title`/`description` flow into React JSX text (auto-escaped) and into
   a JSON-LD block; this rendering path is pre-existing and shared by 300+
   posts, not something this diff changes. The new post's `title`/
   `description` strings contain no quote-breaking or script-breaking
   sequences that could matter even if it did.
5. **Secrets/credentials** — `git diff origin/main...HEAD` grepped for
   `api[_-]?key|token|secret|password|BEGIN (RSA|PRIVATE)|sk-...`: zero real
   hits (the one regex match was the word "keyed" inside REVIEW.md prose
   from Round 2, not a credential).
6. **`pnpm-workspace.yaml` `allowBuilds` addition** (flagged in Round 1,
   confirmed harmless in Round 2 for the frozen-lockfile CI gate) —
   re-checked from a supply-chain angle this round: all four packages
   (`@swc/core`, `better-sqlite3`, `esbuild`, `sharp`) are pre-existing
   dependencies already resolved in `pnpm-lock.yaml` (zero lines of diff on
   that file), so this only approves postinstall build scripts for packages
   already in the dependency graph — it does not pull in a new package or
   widen what code can run at install time.
7. **No tenant/multi-tenant surface at all in this diff** — the ticket adds
   a single global marketing blog post with no per-tenant/per-org data,
   consistent with `[[project_repo_has_no_booking_domain]]`: this repo is
   marketing/content-ops only, so there is no RBAC or tenant-isolation code
   path for a blog post to cross.

**Findings:** None. Nothing in this diff accepts user input, builds a query
or file path from external data, touches authz/tenant boundaries, or
embeds executable content. The rendering pipeline it flows through
(react-markdown without raw-HTML plugins, `<Seo>`/JSON-LD via JSX
auto-escaping) was already safe against injection before this diff and is
unchanged by it.

**Changes made this round:** None — no security defect found, so nothing
to fix.

## Round 4 — Scope

**Lens:** Is anything in this diff NOT the stated change? Read
`git diff origin/main...HEAD --stat` and inspected every file it touched for
whether it belongs to "write and publish the tilgjengelighet blog post," or
is a drive-by/environmental edit that rode along in the earlier checkpoint
commit.

**Checked:**

1. **Full file list** (`git diff origin/main...HEAD --name-only`): four
   files — `.agent/XAL-1142/SPEC.md`, `.agent/XAL-1142/REVIEW.md` (the
   process artifacts this workflow requires for every ticket, not scope
   creep), `src/content/blog/tilgjengelighet-lokaler-nedsatt-funksjonsevne.md`
   (the actual content addition, confirmed content-only in Round 1), and
   `pnpm-workspace.yaml`.
2. **`pnpm-workspace.yaml`** — the diff adds an `allowBuilds:` block
   (`@swc/core`, `better-sqlite3`, `esbuild`, `sharp`) that Rounds 1–3 each
   noticed and separately declared "harmless" but never evaluated for scope,
   explicitly deferring that judgment to a later round. This round is that
   later round. Traced it to `046f87c` ("checkpoint — session ended before
   the agent pushed"), a WIP commit from the interrupted prior session — the
   change is a side effect of running `pnpm approve-builds --all` locally
   (per `[[project_pnpm_build_needs_approve_builds]]`, a known fresh-checkout
   step) that got swept into a commit rather than left as local, uncommitted
   state. It has nothing to do with writing or publishing a blog post.
3. **Cross-branch check** — diffed `pnpm-workspace.yaml` against
   `origin/main` on the three sibling gap-fill branches that shipped the
   same shape of ticket (XAL-1143, XAL-1145, XAL-1149): **zero of them touch
   this file.** That rules out "every session needs this, it's just usually
   forgotten" — it confirms this is local session noise specific to this
   branch's interrupted checkpoint, not a repo-wide requirement worth
   carrying in this diff. Committing it here would also make this branch an
   unnecessary merge-conflict source against `pnpm-workspace.yaml` for any
   of the other ~10 concurrently active `agent/xal-11xx-*` branches that
   touch the same file for their own unrelated reasons
   (`[[project_concurrent_fleet_agents]]`).

**Findings:**

- `pnpm-workspace.yaml`'s `allowBuilds` addition is out of scope for this
  ticket — a local build-environment convenience that leaked into a commit,
  not a change the content goal asked for or depends on.

**Changes made this round:** Reverted `pnpm-workspace.yaml` to its
`origin/main` state (dropped the `allowBuilds` block), leaving the diff as
exactly the content addition plus its process artifacts. Re-ran `pnpm test`
after the revert to confirm nothing depended on it (build-time package
approval only affects a fresh `pnpm install`, not an already-populated
`node_modules`): 20 files / 40 tests still pass. Committed separately.

## Round 5 — Visual proof

This is new content — the page didn't exist on `origin/main`, so there is
no "before" state to capture; only an AFTER render of the live page applies,
per this repo's proof convention (`[[project_pnpm_build_needs_approve_builds]]`
sibling tickets XAL-1143/1145/1149 used the same shape). Ran `pnpm
dev:client` (Vite on `:8080`) and drove it with `agent-browser`:

- `.agent/XAL-1142/proof/after-tilgjengelighet-post-top.png` — full-page
  capture of `/blogg/tilgjengelighet-lokaler-nedsatt-funksjonsevne`.
  `document.title` and the single `<h1>`
  ("Tilgjengelighet ved booking av lokaler: krav og løsning") match the
  frontmatter, `readingMinutes: 7` renders as "7 MIN LESETID", the
  `Utleier` tag shows, and the table of contents lists all six of the
  post's own H2s in order.
- `.agent/XAL-1142/proof/after-tilgjengelighet-post-faq.png` — scrolled to
  the "Vanlige spørsmål om tilgjengelighet ved booking av lokaler" section;
  confirms the FAQ block and closing CTA heading render, and that the one
  internal link (`a[href*='universell-utforming-wcag-kommunal-booking']`)
  resolves with the expected anchor text ("guiden til universell utforming
  og WCAG i kommunal booking") — a live-render confirmation of what Round 1
  only checked against source markdown.
- `.agent/XAL-1142/proof/after-blogg-listing.png` — `/blogg` listing page,
  scrolled to the new post's card, confirming `getAllPosts()` picked it up
  with no registration step (`document.querySelectorAll('a')` includes an
  `href` containing the post's slug).

No new findings — this round is confirmatory, not a fix.

**Linear attachment:** unreachable. No Linear MCP tool is available in this
environment (confirmed XAL-1151 and reconfirmed here via `ToolSearch`,
matching every prior sibling ticket — XAL-1143, XAL-1145, XAL-1149 hit the
same wall). The three PNGs above are committed to the branch under
`.agent/XAL-1142/proof/` and referenced in the PR body instead; a human
with Linear access should attach them to XAL-1142 manually.

**Step 0 / AGENT-SPEC.md note:** the resume instructions for this run
assumed a root-level `AGENT-SPEC.md` was still missing. Per
`[[project_root_agent_spec_deleted_trap]]`, that file was deliberately
removed repo-wide on `main` (`15c7b14`) because per-branch copies collide
on every merge; this workflow uses `.agent/<ISSUE>/SPEC.md` instead, which
already exists here (written in the interrupted prior session, before
Round 1's review even began) with the full "what/how/changes/blast
radius" writeup and mermaid diagram. No root file was recreated.

**Changes made this round:** None to the tracked content diff — added the
three proof screenshots under `.agent/XAL-1142/proof/` and this section.
