# XAL-1163 — Adversarial Review

## Round 1 — CORRECTNESS

**Question:** does this branch do what the acceptance criteria say, including on
the edge cases, and are the factual claims in SPEC.md actually true of the code
today (not just asserted)?

**What I checked:**

- `git diff origin/main...HEAD --stat` — confirmed the entire diff is 3 files,
  173 insertions, 0 deletions, 0 files modified: `.agent/XAL-1163/SPEC.md` (new),
  `AGENT-GOAL.md` (new, auto-generated ticket record), `pnpm-workspace.yaml`
  (+`allowBuilds` block). No application code is touched by this branch, which
  matches SPEC.md's own claim ("no code work — already shipped").
- Re-derived every factual claim in SPEC.md from the source files instead of
  trusting the prose:
  - `src/content/blog/beste-nettside-leie-lokale-hytte-utstyr-norge.md` frontmatter
    — confirmed `date: 2026-08-07`, `schema: "FAQPage"`, and `faqQuestion` equal
    to the ticket's exact target query verbatim.
  - `src/content/blogFaq.mjs` `POST_FAQ["beste-nettside-leie-lokale-hytte-utstyr-norge"]`
    — first Q/A pair matches the frontmatter `faqQuestion`/`faqAnswer` verbatim.
  - Body `## Vanlige spørsmål` section — read it directly (not just the test
    assertion) and confirmed all 4 question/answer pairs in `POST_FAQ` appear
    verbatim in the rendered markdown, so there's no frontmatter/body drift
    (the exact bug class `blogFaq.test.ts` cites as XAL-758's root cause).
  - `src/pages/BlogPost.tsx:161` passes `POST_FAQ[post.slug]` into `SEO.tsx`'s
    `faq` prop; `SEO.tsx:247-261` emits an `FAQPage` JSON-LD block with
    `mainEntity` built from that array whenever `faq.length > 0` — traced this
    is unconditional on the frontmatter's `schema` field (which is cosmetic /
    unparsed, per the test file's own comment) — the real switch is presence
    in `POST_FAQ`, and this slug has an entry.
  - `scripts/prerender.mjs:2518-2529` builds the identical `FAQPage` shape
    (`@type: Question` / `acceptedAnswer.@type: Answer`) from the same
    `POST_FAQ` map for the static HTML path, and splices it into `<head>`
    alongside the Article block — confirmed AI crawlers reading prerendered
    HTML (no JS execution) still see the FAQPage JSON-LD.
  - Ran `npx vitest run src/content/blogFaq.test.ts` myself in this worktree:
    **2 passed** — reproduces the result SPEC.md reports, not just trusting it.
- Checked the ticket's literal "Done when" text against SPEC's conclusion: the
  ticket itself says `Current assessment: exists`, and the one open sub-item
  (confirm AI-citation effect in the next measurement cycle) is external
  monitoring, not a repo change — SPEC.md doesn't overclaim or quietly drop
  scope here.
- Checked whether `pnpm-workspace.yaml`'s new `allowBuilds` block is scope
  creep: it's a side effect of running `pnpm approve-builds --all`, which
  SPEC.md states was required (and had never been run in this worktree) to
  execute the vitest suite that produces the evidence above. It touches no
  application behavior and is the kind of setup step this repo already
  documents as necessary for a fresh checkout — not opportunistic.
- Checked whether `AGENT-GOAL.md` being left in the tree is a correctness
  problem: delivery rules say delete it *before opening the PR*, not before
  committing intermediate work, and no PR exists yet (`gh pr list` for this
  branch returns empty) — not a defect at this stage, just something the round
  that opens the PR still needs to do.

**Findings:** none. Every claim in SPEC.md that could be independently
verified against the current source (frontmatter, `POST_FAQ`, markdown body,
both JSON-LD emission paths, the test suite) checked out exactly as described.
The diff itself introduces no application code, so there is no implementation
to be wrong about — the only thing this branch asserts is "no code work is
needed," and that assertion is correct on inspection, including the edge case
that the frontmatter's `schema: "FAQPage"` field is cosmetic and the real
FAQPage trigger is the `POST_FAQ` map (verified in both the client and static
prerender paths, not just one).

**Changed:** nothing — no fix was needed. No commit from this round beyond
this file.

## Round 2 — REGRESSION

**Question:** what ELSE reads this code path, and did anything depend on the
old behaviour? This branch's diff (`git diff origin/main...HEAD --stat`) is
still only 4 files — `.agent/XAL-1163/{SPEC,REVIEW}.md`, `AGENT-GOAL.md`,
`pnpm-workspace.yaml` — none of which is application code. So the regression
surface isn't "did I break a function callers rely on", it's: does the one
real config change (`pnpm-workspace.yaml`'s new `allowBuilds` block) affect
anything beyond this worktree, and does anything else in the fleet collide
with the files this branch touches.

**What I checked:**

- Traced every consumer of `POST_FAQ` / `blogFaq.mjs` again from scratch
  (`grep -rn "POST_FAQ|blogFaq" src scripts`) to confirm Round 1's list was
  complete: `src/pages/BlogPost.tsx` (client JSON-LD via `SEO.tsx`) and
  `scripts/prerender.mjs` (static JSON-LD) are still the only two consumers.
  No third reader (sitemap generator, RSS/feed script, search-index builder)
  exists. Since no file in this diff modifies any of `blogFaq.mjs`,
  `BlogPost.tsx`, `SEO.tsx`, or `prerender.mjs`, there is no behavior for a
  consumer to regress against — this axis is moot by construction, not by
  omission.
- The one substantive diff hunk, `pnpm-workspace.yaml`'s new `allowBuilds`
  block (`'@swc/core'`, `better-sqlite3`, `esbuild`, `sharp`: all `true`), is
  a **workspace-root** file — its effect isn't scoped to this ticket, it
  applies to every `pnpm install` in the monorepo, including CI, once this
  merges. Checked whether CI currently depends on these builds being
  *skipped*:
  - `.github/workflows/pr-check.yml` and `deploy.yml` both run
    `pnpm install --frozen-lockfile` then `pnpm build` today, on `main`,
    *without* this `allowBuilds` block. Pulled recent run history with
    `gh run list --workflow=pr-check.yml` — last 5 runs all `success`. So the
    build-script-skip warning pnpm currently emits for these 4 packages is
    provably non-fatal to the existing pipeline; nothing depends on the
    scripts staying blocked, so turning them on can't un-break something
    that was silently relying on the skip.
  - Checked for lockfile markers (`requiresBuild: true`) that would reveal
    packages needing approval that this list misses — none present in this
    lockfile format, so couldn't cross-check completeness that way; fell
    back to the CI-green evidence above, which only needs the *existing*
    list to not regress, not to be exhaustive.
  - `gh pr list` across the repo for any open PR touching `pnpm-workspace.yaml`
    or `AGENT-GOAL.md` (the two root files this branch adds/edits, where
    sibling fleet branches are most likely to collide per
    `[[project_concurrent_fleet_agents]]`) — zero hits. No merge-conflict
    exposure from concurrent branches on these files right now.
  - `tools/improvements-agent/src/{prepare,implement}.ts` are the only code
    that reads/writes `AGENT-GOAL.md` by name, and only by presence
    (write it on prepare, instruct deletion before PR) — nothing parses its
    placeholder body, so leaving the unfilled contract template in the tree
    mid-flow (as Round 1 already noted) doesn't regress that tooling either.
- Re-ran `npx vitest run src/content/blogFaq.test.ts`: **2 passed**, same as
  Round 1 — confirms nothing drifted between rounds.

**Findings:** none. The branch's only non-doc change is an additive,
workspace-wide `pnpm-workspace.yaml` config block; CI's own recent run
history shows the build steps it touches already succeed without it, so
enabling them can't regress a dependency that was silently relying on the
skip. No application code path changed, so there is no caller/consumer to
break. No concurrent open PR touches the same root files.

**Changed:** nothing — no fix was needed. No commit from this round beyond
this file.
