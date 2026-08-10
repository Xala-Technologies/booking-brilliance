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
