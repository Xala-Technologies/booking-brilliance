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

## Round 2 — fresh fact-check + build/SEO regression

Two parallel agents: one re-verified round 1's five fixes landed correctly,
then did a fresh line-by-line fact-check of every remaining claim against
the five linked posts; the other ran the full production build from a
clean `dist`/`dist-server` and inspected the prerendered HTML, sitemap, and
listing page directly.

**Fact-check lens** — confirmed all five round-1 fixes landed correctly
(`grep` for "DFØ", "uke for uke", "bruk-case" all return zero matches).
Found three new issues, one of which corrected a mistake round 1 itself
introduced:
1. **Round 1's "Digdir" fix was factually wrong.** I verified with a live
   web search (anskaffelser.no, regjeringen.no): terskelverdier and
   anskaffelser.no are run by DFØ (Direktoratet for forvaltning og
   økonomistyring), not Digitaliseringsdirektoratet (Digdir) — a different
   agency entirely (ID-porten, Altinn-samordning, digital tilgjengelighet).
   Round 1's three lenses converged on the wrong fix because the original
   text paired the right acronym with the wrong full name; correcting the
   acronym alone (to Digdir) fixed the pairing but pointed at the wrong
   agency for this specific domain. The idrettshall post has the same
   underlying error, unfixed there per this ticket's out-of-scope rule.
2. Intro line promised measuring effect "et halvt år etter go-live" (a
   fixed six-month point), while the Gevinstrealisering section itself
   says "tre til seks måneder" (a range) — an internal inconsistency
   between the intro's promise and the body's actual claim.
3. The mellomstor-kommune bruk-case said contract value "ligger ofte over
   den nasjonale terskelverdien, som utløser en lengre anbudsprosedyre" —
   but the post's own procurement paragraph a few sections earlier states
   only the EØS-terskelverdi (not the national one) triggers full
   anbudsprosedyre with Doffin-kunngjøring. The bruk-case blurred the
   distinction the post itself had just drawn.

**Build/SEO lens** — ran the full pipeline once from a clean state
(`rm -rf dist dist-server` → `optimize-images.mjs` → `vite build` → SSR
build → `prerender.mjs` → `check-blog-word-count.mjs` → `pnpm vitest run`):
all steps passed, 16/16 test files, 35/35 tests green, word-count check
green on both markdown and prerendered HTML. Direct inspection of
`dist/blogg/valg-og-implementering-bookingsystem-kommune/index.html`
confirmed exactly one `<h1>` matching the title, correct `Article` JSON-LD,
canonical URL, Open Graph tags (structurally identical to sibling post
`onboarding-uke-til-live`), and exactly one sitemap entry — all green. All
five internal links resolve to real prerendered pages.

One pre-existing, out-of-scope gap surfaced (not a defect of this file):
`src/pages/Blog.tsx`'s sort comparator (`(a,b) => (a.date < b.date ? 1 : -1)`)
never returns `0` for equal dates, so the ~60 posts sharing today's date
sort in effectively implementation-defined order rather than a real tie-
break. This post happens to land at position 1 of 262 today (visible on
page 1 of the listing), but that placement isn't a guarantee — it's an
artifact of the buggy comparator affecting many same-day posts, not
something this single-file content change introduced or can fix (the fix
would touch `src/pages/Blog.tsx`, a shared rendering file this ticket's
scope note explicitly says not to touch).

### What I changed after round 2
- Corrected "Digitaliseringsdirektoratet (Digdir)" to "Direktoratet for
  forvaltning og økonomistyring (DFØ) på anskaffelser.no" — the factually
  correct agency for terskelverdier, verified via web search.
- Reworded the intro's "et halvt år etter go-live" to "i månedene etter
  go-live" so it no longer promises a specific number the body's actual
  range ("tre til seks måneder") doesn't match.
- Reworded the mellomstor-kommune bruk-case to reference the EØS-
  terskelverdi (not the nasjonale terskelverdi) as the trigger for full
  anbudsprosedyre, matching the post's own procurement paragraph.
- Rebuilt and re-ran `pnpm vitest run` — both green after the edits
  (16 files / 35 tests, word-count check passes).
