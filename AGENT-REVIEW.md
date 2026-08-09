# XAL-1150: Deep review log

Change under review: `src/content/blog/undervisnings-og-opplaeringslokaler.md`
(new Norwegian Bokmål blog post), a matching `POST_FAQ` entry in
`src/content/blogFaq.mjs`, and `AGENT-SPEC.md`.

## Round 1 — correctness / regression / security / scope

Four parallel agents, each told to REFUTE the change, run over
`git diff 28ea183 61b4f88` (the state right after the post was first written).

**Correctness** — checked frontmatter shape against `BlogFrontmatter`
(`src/lib/blogFrontmatter.ts`), the internal link target
(`klasseromsleie-til-kurs-og-opplaering.md` exists with the matching slug),
byte-for-byte verbatim match of all 3 FAQ question/answer pairs between the
post body and `blogFaq.mjs` (checked programmatically, not by eye), slug
consistency across frontmatter/filename/FAQ key, markdown syntax, and that
product claims (ID-porten, BankID, Frivillighetsregisteret,
serietidsbestillinger) are established terminology already used elsewhere in
the corpus. **No issues found.**

**Regression** — grepped the whole repo for anything that hardcodes a post
count, iterates all `POST_FAQ` keys, or asserts a specific corpus size; ran
`scripts/check-blog-word-count.mjs` and `scripts/check-title-lengths.mjs`
directly; confirmed tags are derived dynamically from frontmatter
(`src/pages/Blog.tsx`) with no enum to update; confirmed no slug collision
exists anywhere in `src/content/blog/*.md`. **No issues found.**

**Security** — confirmed the post body contains no raw HTML/script tags/JS
URIs, no secrets or internal infra details, that `https://digilist.no/demo`
and the internal `/blogg/klasseromsleie-til-kurs-og-opplaering` link are
established, already-used patterns elsewhere in the corpus, and that
`AGENT-SPEC.md` doesn't leak anything sensitive. **No issues found.**

**Scope** — confirmed only the three expected files changed, no forbidden
shared build/render script was touched, and that the previous
`AGENT-SPEC.md`/`AGENT-REVIEW.md` content (from the already-merged,
unrelated XAL-1141) was safe to fully overwrite. **Found one real issue:**
several sections — the pricing breakdown, the 5-step booking walkthrough,
and the "praktiske krav" bullet list — were near-verbatim structural clones
of the equivalent sections in the existing
`klasseromsleie-til-kurs-og-opplaering.md` post (same skeleton, same order,
same wording for the four "praktiske krav" items, same three-tier pricing
split). The reviewer's independent assessment: the three named personas
(kursarrangører, språkskoler, opplæringsleverandører) and the
affordability/self-service framing the ticket asked for *are* a genuine,
underserved gap relative to the existing post — but the surrounding
boilerplate risked shipping this as a near-duplicate URL that cannibalizes
keyword space rather than a distinct piece of content.

### What changed after round 1

Rewrote the pricing section, the "lett-bookbar" section and the "praktiske
krav" section (`src/content/blog/undervisnings-og-opplaeringslokaler.md`):
- Pricing now compares cost **across venue types** (grupperom vs.
  auditorium/samlingssal) and leads with "the price is only useful if you
  can compare it before deciding" instead of repeating the sibling post's
  persona-tier pricing breakdown almost verbatim.
- The 5-step numbered booking walkthrough was replaced with a shorter,
  differently-framed section on what self-service booking removes (no
  waiting on a caseworker, no repeat calls per parallel course, no
  double-booking risk) rather than restating the same 5 steps.
- The "praktiske krav" bullet list (ansvarlig booker / avbestillingsfrist /
  ryddefrist / utstyrsansvar) was cut entirely and replaced with one
  paragraph that names what's *specific* to undervisningslokaler
  (auditorium/samlingssal booked months ahead for a fixed room+capacity)
  and points to the sibling post's existing deep dive on the shared
  klasserom-specific requirements, instead of restating them.
- FAQ section and its `POST_FAQ` entry were left untouched (verified still
  byte-for-byte matching after the edit) — that section was not flagged.

Re-ran after the fix: `pnpm build` (prerender + word-count gate, still
passes for all 261 posts), `vitest run src/content/blogFaq.test.ts
src/content/blog-xal739-aeo.test.ts` (4/4 pass), `node
scripts/check-title-lengths.mjs` (60 chars, unflagged). Word count dropped
from 1056 to 941 words — still well above the 200-word floor.

## Round 2 — correctness / regression / security / scope-duplication re-check

Four parallel agents, run over `git diff 28ea183 55ca580` (base through the
round-1 fix commit), each re-checking their lens against the revised
content and one of them specifically re-litigating the round-1 duplication
finding from scratch rather than trusting the fix commit's own claim.

**Correctness** — verified the new pricing section's auditorium/grupperom
capacity claims (60 / 12) are consistent with the room-type ranges
introduced earlier in the same post (grupperom 10–30, auditorium/samlingssal
40+); confirmed programmatically that the FAQ section (untouched by the fix
commit) still matches `POST_FAQ["undervisnings-og-opplaeringslokaler"]`
byte-for-byte; confirmed the internal link still resolves; grepped for
dangling references to the deleted 5-step list or "praktiske krav" bullets
(none found); re-confirmed word count and markdown balance. **No issues
found.**

**Regression** — re-ran `check-blog-word-count.mjs` (261/261 pass),
`check-title-lengths.mjs` (60 chars), and both targeted vitest files (4/4
pass); grepped `dist/blogg/undervisnings-og-opplaeringslokaler/index.html`
directly and confirmed the prerendered HTML actually contains the H1, all 3
FAQ questions, and a `"@type":"FAQPage"` JSON-LD block — not just present in
source markdown; grepped the whole repo for the exact removed phrasing
(the old 5-step intro line, the old "Ansvarlig booker"/"Avbestillingsfrist"
wording) and found only unrelated occurrences in two untouched sibling
posts, confirming nothing else depended on the deleted text; confirmed
`src/lib/posts.ts`'s sort places the new post in today's top tie-group with
no manual step. **No issues found.**

**Security** — re-scanned the rewritten sections for raw HTML/script
content, secrets, and injection patterns; reconfirmed both link targets are
byte-identical to round 1 and still legitimate. **No issues found.**

**Scope/duplication re-check** — independently re-read both posts in full
and compared section-by-section against the three round-1 clones, without
taking the fix commit's message at its word: the numbered booking
walkthrough is gone from the new post (replaced by a 3-bullet "what
self-service removes" framing with no procedural steps); the 4-item
"praktiske krav" list is gone, replaced by a single sentence naming the four
shared terms once as a pointer to the sibling post's existing deep dive,
not a restatement; the 3-tier persona pricing list is gone, replaced by
prose about price comparability across venue types. Keyword arrays between
the two posts share no identical strings. One minor residual overlap noted
(a single near-duplicate clause about real-time availability updates,
appearing once in each post) — judged not disqualifying, since it describes
one real, singular product fact rather than restating a whole section.
**Verdict: the round-1 finding is resolved** — this reads as two distinct
articles with the overlapping procedural specifics properly consolidated
into one canonical post via internal linking, not duplicated.

## Round 3 — fresh-angle pass over the same diff

Four parallel agents, run over `git diff 28ea183 55ca580`, each explicitly
told to look past what rounds 1-2 already checked and find something new —
correctness from a native-Bokmål-reader angle instead of a mechanical
frontmatter check, regression via consumers not yet inspected
(homepage teaser/search corpus truncation, og:image handling, image
optimizer, redirect guard), security via the CI/supply-chain angle instead
of re-scanning the same markdown, and scope via a literal clause-by-clause
re-read of the ticket's own acceptance line in `AGENT-GOAL.md`.

**Correctness — found two real issues.** Reading the post as a native
speaker: (1) a genuine grammar error, "det først ledige tidspunktet" should
be "det første ledige tidspunktet" (ordinal in a definite noun phrase takes
the adjectival form; the reviewer cross-checked this is the house idiom by
finding "den første ledige tiden" already used correctly in a sibling
post). (2) The opening three-clause sentence had no governing main verb —
a stacked sentence fragment relying on the next sentence to complete the
thought, inconsistent with how every other sampled post opens. Everything
else (description length, keyword coverage, product-claim consistency
against 3+ sibling posts, title/H1 rendering) checked out.

**Regression — no issues found.** Checked `BlogPreviewSection.tsx` and the
sitewide search corpus for description-length truncation risk (this post's
172-char description is unremarkable against the corpus's 162-char average,
231-char max, no truncation logic exists to break); confirmed
`scripts/prerender.mjs`'s og:image handling and `verify-live.mjs`'s
image-diversity check (warning-only, doesn't fire since the 12 newest posts
already use 7+ distinct covers) are unaffected by reusing a shared cover;
confirmed the preview-size image variant already exists on disk; confirmed
`scripts/guard-blog-redirects.mjs` is a new-slug-only check with no
retroactive rename risk relevant here; re-ran `eslint` on `blogFaq.mjs`
clean.

**Security — no issues found.** Checked the CI/supply-chain angle: no
GitHub Actions workflow triggers additional deploy/external-service calls
specifically because a new blog post exists (deploy only fires on push to
`main`, unchanged by this diff; `indexnow-submit.mjs` exists but isn't
wired into any workflow); confirmed the new `blogFaq.mjs` object literal
has no computed keys/function calls/interpolation; re-read `AGENT-GOAL.md`
and confirmed the shipped post traces cleanly to the ticket's stated scope
with no unexplained links or claims; re-checked the `AGENT-SPEC.md` mermaid
diagram and Notes section for leaked infra details — none found.

**Scope — found one real issue.** Re-reading the ticket's acceptance line
in `AGENT-GOAL.md` clause by clause against the post: kursarrangører,
språkskoler, and opplæringsleverandører were all covered as named personas;
"rimelige" and "lett-bookbare" were both covered as section-level framing.
But the clause "Digilist støtter pedagogiske og faglige arrangementer med
lokalbooking" had been dropped entirely — zero occurrences of "pedagog" or
"faglig" anywhere in the post, and the post frames everything as "kurs"
specifically, narrower than the ticket's "faglige arrangementer." Also
confirmed the post is Bokmål throughout with no stray Nynorsk/English,
`AGENT-GOAL.md` is still present and untouched by any commit so far, and
the round-1 cross-link is one-directional (the sibling post has zero diff
across the whole branch).

### What changed after round 3

`src/content/blog/undervisnings-og-opplaeringslokaler.md`:
- Fixed "det først ledige tidspunktet" → "det første ledige tidspunktet".
- Rewrote the opening three-clause sentence into three separate complete
  sentences, each with its own main verb, instead of one ungrammatical
  stacked fragment.
- Added a new paragraph after the room-types list explicitly naming
  "pedagogiske og faglige arrangementer" (fagdag, forelesningsrekke,
  bedriftsintern workshop) as content Digilist's booking flow treats the
  same as a course — covering the ticket's acceptance clause that had been
  dropped.

Re-ran after the fix: `vitest run src/content/blogFaq.test.ts
src/content/blog-xal739-aeo.test.ts` (4/4 pass), `node
scripts/check-title-lengths.mjs` (60 chars, unflagged), `pnpm build`
(prerender + word-count gate, still passes for all 261 posts). Word count
now 998 words (up from 941, still comfortably above the 200-word floor).
FAQ section and `POST_FAQ` entry re-verified byte-for-byte matching after
the edit (the FAQ section itself was not touched).

## Round 4 — final pass on the fully fixed diff

Four parallel agents, run over the final diff `28ea183..40415ab` (base
through all three fix commits), each re-checking their lens once more to
confirm rounds 1-3's fixes actually hold together and that stacking three
separate edit passes on the same file didn't introduce or leave anything
new.

**Correctness** — read the full post fresh as if for the first time: no
leftover artifacts or broken transitions between sections after three
rounds of edits. Specifically checked the newest paragraph (pedagogiske og
faglige arrangementer) reads naturally in context and its one product claim
("Digilist skiller ikke mellom kurs og slike faglige arrangementer i
bookingflyten") matches an established house idiom already used in two
sibling posts, rather than asserting something new and unverified.
Re-verified the rewritten opening is now three grammatically complete
sentences. Re-verified the FAQ section still matches `POST_FAQ` byte-for-byte
on the truly final file state (not trusting earlier rounds' checks).
Re-ran the word-count gate. **No issues found.**

**Regression** — ran the FULL test suite (`npx vitest run`, all 16 files /
35 tests, not just the two targeted files), a full `pnpm build`, and
`eslint` on `blogFaq.mjs` — all green. Confirmed `blogFaq.mjs`'s diff
across the whole branch is still exactly the one clean addition from round
1, untouched by the two later fix commits that only edited the `.md` file.
**One process note, not a shipped-code defect:** at the time this agent
ran, `AGENT-REVIEW.md` itself was mid-edit (this document) and the
`proof/` screenshot was untracked — correctly flagged as unfinished
bookkeeping to commit before opening the PR, not a defect in the reviewed
change. Also flagged that the branch had drifted from `origin/main` and
would need a sync before push — addressed in the SYNC step below, per the
workflow's own ordering (sync happens after review, before push).

**Security** — final scan of the two newest additions (the pedagogiske/
faglige paragraph and the rewritten opening) for raw HTML/script content
and secrets — clean. Full-file scan across all three edit rounds for
prompt-injection phrasing and hidden Unicode control characters — none
found. Confirmed no stray temp/editor artifacts (`.bak`/`.tmp`/`.swp`) were
left in the repo from the editing process. **No issues found.**

**Scope** — final `git diff 28ea183 40415ab --stat` confirms exactly three
files changed across all three commits: the post, `blogFaq.mjs`, and
`AGENT-SPEC.md`. Re-confirmed all six clauses of the ticket's acceptance
line are now covered, quoting the specific sentence that now covers the
previously-missing "pedagogiske og faglige arrangementer" clause.
Re-confirmed no forbidden shared build/render file was touched at any
point across all three commits. **No issues found — ready to ship.**

### Outcome

Four rounds run. Round 1 found and fixed a structural-duplication risk
against a sibling post. Round 2 independently re-verified that fix actually
resolved the concern rather than just rewording it. Round 3 found and
fixed a genuine grammar error, an ungrammatical opening sentence, and one
dropped ticket acceptance clause. Round 4 re-checked all four lenses on the
fully fixed diff and found nothing further — full test suite (35/35), full
build, and word-count gate (261/261 posts) all green on the final commit.
