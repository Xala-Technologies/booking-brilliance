# XAL-1153: Deep review log

Change under review: one new file,
`src/content/blog/valg-og-implementering-bookingsystem-kommune.md`
(a Norwegian blog post), plus `AGENT-SPEC.md`.

## Round 1 — correctness / regression-duplication / security / scope

Four parallel agents, each told to REFUTE the change over the actual file
contents and `git diff 60470a1..HEAD`.

**Correctness** — found three real defects:
1. "Den mekaniske delen ... go-live uke for uke, er beskrevet i
   [onboarding-guiden]" mischaracterized the linked post: the linked
   `onboarding-uke-til-live.md` breaks the process down day by day
   (Dag 1-5) within a single week, not week by week.
2. `"bruk-cases"` (frontmatter description and the H2 heading) is a
   calqued English/Norwegian hybrid not used anywhere else on the site
   (confirmed via `grep -rl "bruk-case\|brukstilfelle" src/content/blog/*.md`
   — only this file).
3. Two comma splices (kommafeil): "Kontraktsignering er ikke sluttpunktet,
   det er starten..." and "Avvik fra planen er ikke et tegn på at valget
   var feil, det er informasjon...".
   Everything else checked out: all five internal links resolve and each
   linked post's actual content substantiates what this post claims about
   it, "fire roller" is followed by exactly four bullets, procurement
   figures (100 000 kr exemption, national/EØS terskelverdi, SSA-L) match
   the idrettshall post's own figures with no internal contradiction,
   frontmatter is complete and well-formed, `/book-demo` route exists.

**Regression / duplication** — independently found the same real defect as
the security lens (below): "Digitaliseringsdirektoratet (DFØ)" mislabels
the agency — Digitaliseringsdirektoratet is Digdir; DFØ (Direktoratet for
forvaltning og økonomistyring) is a different agency. This sentence was
lifted near-verbatim from `idrettshall-bookingsystem-anskaffelse-
kravspesifikasjon-it-leder.md`, which has the same pre-existing error
(out of scope to fix there — not part of this branch's file). No other
duplication or contradiction found: the six linked posts (idrettshall
kravspec, sal anskaffelse, TCO/sammenligning, leverandør-valg, onboarding)
are genuinely summarized-and-linked, not repeated; no slug collision; the
`tag: "Beslutningstaker"` value matches the site's existing convention of
many single-use persona tags; the cover image exists on disk and is
already shared by other posts.

**Security** — no exploitable issue. `BlogPost.tsx` renders via
`ReactMarkdown` with `remarkGfm` only, no `rehype-raw`, no
`dangerouslySetInnerHTML` in the blog render path, and the new post's
markdown contains no raw HTML/script content. No secrets or internal
infrastructure details in either file. Compliance claims (GDPR, SSA-L,
anskaffelsesloven) are stated in the same non-committal "check current
values" tone as sibling posts, not overstated — except the same DFØ/Digdir
mislabel the other two lenses found. `/book-demo` is a public,
unauthenticated route.

**Scope** — clean. `git diff 60470a1..HEAD --stat` shows only
`AGENT-SPEC.md` and the new post; none of the forbidden shared files
(`scripts/prerender.mjs`, `src/entry-server.tsx`, `scripts/verify-live.mjs`,
`vite.config.ts`, `build-plugins/blogMetaPlugin.ts`) appear in the diff.
`git status --short` and `--ignored` show no stray files beyond the
expected build directories. `AGENT-GOAL.md` present and untouched, as
expected at this stage. One observation, not a violation: `AGENT-REVIEW.md`
(this file) still carried stale XAL-1139 content at the start of this
branch — pre-existing from the merged base commit, not introduced by this
branch's own commits, and rewritten from scratch as part of this round.

### What I changed after round 1
- Rewrote the "Digitaliseringsdirektoratet (DFØ)" mislabel to "(Digdir)".
- Reworded "go-live uke for uke" to "go-live dag for dag" to accurately
  describe the linked onboarding post's day-by-day structure.
- Replaced "bruk-cases" with "praktiske eksempler" (frontmatter
  description) and the H2 heading "To bruk-cases" with "To eksempler",
  both natural Bokmål.
- Fixed both comma splices by replacing the comma with an em dash.
- Rebuilt (`optimize-images`, `vite build`, SSR build, `prerender.mjs`,
  `check-blog-word-count.mjs`) and re-ran `pnpm vitest run` — both green
  after the edits (16 files / 35 tests, word-count check passes on both
  markdown and prerendered HTML).
