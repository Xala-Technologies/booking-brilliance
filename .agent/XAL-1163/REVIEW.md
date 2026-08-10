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
