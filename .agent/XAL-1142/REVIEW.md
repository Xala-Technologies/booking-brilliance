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
