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

## Round 3 — adversarial editorial read + full-branch regression sweep

Two parallel agents: one did a fresh skeptical Bokmål-copyeditor read of
the whole post with zero prior context, explicitly told not to re-check
rounds 1-2's fixes; the other swept the whole branch (commits, diff,
worktree, ignored files) for anything content review wouldn't catch.

**Editorial lens** — found eight issues, six real and fixed, two judged
not worth a content change:
1. "Den vanligste årsaken..." — an unsupported superlative stated as bare
   fact. Softened to "En vanlig årsak...".
2. "én virksomhetsområde" — wrong gender article; "område" is neuter
   ("et område"), so it should be "ett virksomhetsområde". Fixed.
3. "fortsetter henvendelsene inn de gamle kanalene" — missing preposition,
   ungrammatical. Fixed to "fortsetter henvendelsene å komme inn i de
   gamle kanalene".
4. "...blir raskt omgått, gjerne tilbake til regneark..." — a dangling
   fragment with no verb connecting the second clause. Fixed to "...blir
   raskt omgått: saksbehandlerne går gjerne tilbake til regneark...".
5. Inconsistent reader address: two sentences used singular "du"/"din"
   while the rest of the piece consistently uses plural "dere". Fixed both
   to "dere".
6. "hvordan systemet virker den dagen" — ambiguous verb ("virker" can mean
   "functions" or "seems"). Changed to "fungerer" to remove the ambiguity.
   Two findings judged not to need a content change:
7. **Ownership wording, not a real contradiction**: "IT ... eier den
   tekniske kravspesifikasjonen" (roller-section) vs. "IT og
   virksomhetsområdet skriver kravspesifikasjonen sammen" (kravspec
   section) read as conflicting sole-vs-joint ownership. Reworded the
   roller-section bullet to "IT ... har ansvaret for de tekniske kravene"
   so it no longer implies sole authorship of the whole document, which
   both matches the kravspec section's joint-authorship claim and is a
   more accurate description of what an IT-avdeling actually does in this
   process.
8. **Bruk-case 1 not mentioning Økonomi og innkjøp explicitly**: valid
   observation, not a contradiction — added a short parenthetical noting
   the small-kommune team "også dekker økonomi og innkjøp", since in a
   kommune small enough to combine driftsleder and IT-ansvarlig into one
   person or small team, the same team typically also handles this role
   rather than having it disappear.

**Regression-sweep lens** — clean. `git log 60470a1..HEAD` showed six
commits at the time of this round, each doing what its message claims;
`git diff 60470a1..HEAD --stat` showed exactly the three expected files
(the post, `AGENT-SPEC.md`, `AGENT-REVIEW.md`); `git status --short` and
`--ignored` showed no stray tracked or untracked artifacts beyond the
standard build/dependency directories; none of the forbidden shared build
files were touched; `AGENT-GOAL.md` confirmed present, tracked, and
unmodified (expected at this stage); no TODO/FIXME or wrong-ticket-number
text in either doc file — the one XAL-1139 mention in this file's own
round-1 section is a self-aware note about pre-existing stale content in
the base commit, not an error introduced by this branch. Exactly one new
file under `src/content/blog/`, no duplicates. `proof/` contains ten PNGs
from prior unrelated tickets, untouched by this branch — noted as
pre-existing, not a defect.

### What I changed after round 3
- Fixed items 1-6 above directly in the post.
- Reworded the roller-section IT bullet per item 7's resolution.
- Added the økonomi/innkjøp parenthetical to bruk-case 1 per item 8.
- Rebuilt and re-ran `pnpm vitest run` — both green after the edits
  (16 files / 35 tests, word-count check passes).

## Round 4 — final holistic refute pass + independent fresh-eyes read

Two parallel agents: one did a targeted final pass (encoding/whitespace
sweep, redundancy check, bruk-case-vs-body consistency after round 3's
edits, one more legal-claim cross-check against the linked idrettshall
post), explicitly told to assume all eleven round 1-3 fixes were correct
and not re-check them; the other read the file completely cold, with zero
prior context, independently re-verifying every link, the full
frontmatter, the reading-time math, and doing its own from-scratch
Norwegian-language read as a first-time reader.

**Holistic refute lens** — no encoding/whitespace issues (byte-level sweep
clean, UTF-8 correct throughout, æ/ø/å all render properly). No redundancy
between the Sammenligning section and any other section. The two bruk-case
boxes are internally coherent with each other and with the Fire roller
list and procurement paragraph after round 3's edits. Confirmed the
threshold logic matched the idrettshall post's own framing structurally —
though this comparison point became moot after this round's own finding
below, which corrected both this post and (implicitly) flagged the same
gap in the idrettshall post's framing as pre-existing and out of scope.

**Fresh-eyes lens** — independently re-verified all five `/blogg/*` links
plus `/book-demo` resolve, frontmatter is complete and parses cleanly, and
recomputed word count (1026 words) and implied reading speed (171 wpm) —
plausible and within the site's own established 134-174 wpm range across
sibling posts. Found one genuine, real issue neither of the first three
rounds caught: the procurement paragraph's threshold explanation jumped
straight from "under national terskelverdi → no kunngjøringsplikt" to
"over EØS-terskelverdi → full anbudsprosedyre with Doffin kunngjøring,"
omitting the middle tier. Verified via web search (anskaffelser.no): FOA
§ 8-17 requires Doffin kunngjøring for del II anskaffelser — i.e.
kunngjøringsplikt on Doffin actually starts at the **national**
terskelverdi, not the EØS terskelverdi; the EØS threshold additionally
requires kunngjøring in the EU's TED database. The post (and the
idrettshall post it structurally followed) stated no kunngjøringsplikt
existed until the EØS threshold, which understates when a kommune actually
has to publish a competition.

### What I changed after round 4
- Rewrote the procurement paragraph to correctly describe all three tiers:
  under 100 000 kr (unntatt), 100 000 kr to national terskelverdi (del I,
  no kunngjøringsplikt), national to EØS terskelverdi (del II, Doffin
  kunngjøring required), and over EØS terskelverdi (del III, Doffin + TED).
- Updated the mellomstor-kommune bruk-case to say "kunngjøring på både
  Doffin og TED" instead of "kunngjøring på Doffin" alone, matching the
  corrected main-body framing.
- Rebuilt and re-ran `pnpm vitest run` — both green after the edits
  (16 files / 35 tests, word-count check passes).

Four rounds run. Round 1 found and fixed five real defects (an agency
mislabel, a mischaracterized link, a calqued term, two comma splices).
Round 2 confirmed those fixes, then found and fixed three more (round 1's
own agency fix was itself wrong and got corrected to the real agency, an
intro/body measurement-window mismatch, a threshold mix-up in a bruk-case)
plus surfaced one pre-existing, out-of-scope systemic gap (listing-page
same-date sort tie-break). Round 3 found and fixed eight issues (an
unsupported superlative, a gender-agreement error, a missing preposition,
a dangling-fragment sentence, a du/dere inconsistency, an ambiguous verb,
an ownership-wording tweak, and a bruk-case completeness gap). Round 4
found and fixed one more real issue (an incomplete procurement-threshold
explanation, verified against the actual regulation via web search) on an
independent fresh read, and confirmed everything else held on a final
holistic pass. No round came back completely empty of real, fixable
defects until this file was rebuilt and retested six times total — which
is why this review runs the full four rounds as scoped rather than
stopping early.

## Proof

This is new content, not a fix to existing behavior, so only an AFTER
state applies (there is no "before" — the page didn't exist). Verified
with a full production build (`vite build` + SSR + `scripts/prerender.mjs`)
served via `vite preview`, then captured with `agent-browser`:
- `proof/after-valg-og-implementering-bookingsystem-kommune.png` — the
  published post's top (title, tag, author, reading time) at
  `/blogg/valg-og-implementering-bookingsystem-kommune`.
- `proof/after-valg-og-implementering-bookingsystem-kommune-eksempler.png`
  — the "To eksempler" section further down the page, with round 3 and
  round 4's fixes (four-role parity, correct threshold/Doffin+TED wording)
  visible in the live rendered output.
