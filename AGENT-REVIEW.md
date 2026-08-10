# XAL-1151: Deep review log

Change under review: one new file,
`src/content/blog/leie-lokale-sammenligne-egenskaper-kapasitet-utstyr.md`
(a Norwegian blog post), plus `AGENT-SPEC.md`.

## Round 1 — correctness / regression-duplication / security / scope

Four parallel agents, each told to REFUTE the change over the actual file
contents and `git diff origin/main..HEAD`.

**Correctness** — found three real defects:
1. Line 20: a fronted conditional ("Skal du sammenligne...") followed by a
   subject-before-verb main clause ("guiden ... viser"), violating Norwegian
   V2 word order — the finite verb must directly follow the comma. Every
   other fronted-conditional sentence in the post (e.g. line 46, "Er du
   driftsleder ... er [guiden] det riktige stedet") gets this right.
2. Line 26: the post claimed a missing equipment checkbox on a listing "som
   regel" means the equipment doesn't exist, not that the utleier forgot to
   list it — directly contradicted by `utleieobjekt-veiviser-steg-for-steg.md`
   ("Du kan publisere uten en lang funksjonsliste – den kan du fylle ut
   senere"), which documents that an incomplete feature list is a normal,
   expected state on the platform.
3. Line 26: invented two items ("pauserom", "skjerm") into what read as
   Digilist's actual checkbox field list; the veiviser post's real field
   list is wifi, kjøkken, prosjektor, lydanlegg, parkering, garderober —
   "pauserom" and "skjerm" aren't among them.
   Everything else checked out: internal consistency between the table and
   the prose, all five internal links resolve, frontmatter matches
   `blogFrontmatter.ts`'s contract, and `readingMinutes: 5` for the (then)
   860-word body checked against five sibling posts' actual words-per-minute
   ratio (135–201 wpm range) lands mid-range, not just the two posts
   initially spot-checked.

**Regression / duplication** — no true duplicate of the generic,
cross-venue-type "compare characteristics before booking" angle exists in
the 273-post corpus. Closest analogs are all narrower: the wedding-specific
kapasitet/vilkår/tilgjengelighet checklist posts, and
`selskapslokaler-typer-og-hvordan-velge.md`'s sittende/stående explanation
(selskapslokaler-only). Grepped 8 distinctive phrases from the new post
against the whole corpus — zero verbatim reuse found, so the "pris isn't
what matters, X is" opening device (also used by a wedding post from days
earlier) is independently worded, not copied. Tag (`Privatperson`, the most
common value) and cover image (reused by 55 other posts) both consistent
with precedent. No slug collision.

**Security** — no issues. `BlogPost.tsx` renders via `<ReactMarkdown
remarkPlugins={[remarkGfm]}>` with no `rehype-raw` and no
`dangerouslySetInnerHTML` anywhere in the blog render path, so raw HTML in
the markdown (there is none) wouldn't execute regardless. No secrets or
internal infra in either file. The one external link
(`https://digilist.no`) matches the identical pattern already used in 17+
other posts. The Tilgjengelighet section reads as reader-facing advice
("sjekk om..."), not a Digilist accessibility-compliance claim.

**Scope** — clean. Diff is exactly the new post and `AGENT-SPEC.md`; none of
the forbidden shared files (`scripts/prerender.mjs`, `src/entry-server.tsx`,
`scripts/verify-live.mjs`, `vite.config.ts`,
`build-plugins/blogMetaPlugin.ts`) appear in the diff, `git status --short`
was clean, and `AGENT-GOAL.md` is present, tracked, and unmodified as
expected at this stage (scheduled for deletion right before the PR, not
before).

### What I changed after round 1
- Fixed the V2 word-order error on line 20 ("... viser [guiden] hvordan
  ...", verb directly after the comma).
- Softened the "missing checkbox = equipment doesn't exist" claim on line 26
  to match what the veiviser post actually documents: a missing field can
  mean either the equipment doesn't exist or the listing isn't fully filled
  in yet, so the advice is to ask rather than assume.
- Removed "pauserom" and "skjerm" from the equipment list on line 26,
  matching the veiviser post's actual field names (wifi, kjøkken,
  prosjektor, lydanlegg).
- Re-ran the full build pipeline (`optimize-images`, `vite build`, SSR
  build, `prerender.mjs`, `check-blog-word-count.mjs`) and `pnpm test` —
  both green after the edit (16 files / 35 tests, word-count check green on
  both markdown and prerendered HTML; recomputed word count 874, still
  ~175 wpm at `readingMinutes: 5`, no change needed).

## Round 2 — fresh fact-check + full build/SEO regression

Two parallel agents: one re-read every remaining factual/process claim
(platform-field claims, the comparison table, all five cross-link framings,
the illustrative sittende/stående numbers, and a fresh independent
grammar/spelling pass), explicitly told not to re-check round 1's three
fixes; the other ran the full production build from a clean `dist`/
`dist-server`, inspected the prerendered HTML/sitemap/listing page
directly, and ran the test suite.

**Fact-check lens** — platform claims, the table, and all five cross-link
framings all checked out against the six related posts read for this round
(`utleieobjekt-veiviser-steg-for-steg.md`,
`selskapslokaler-typer-og-hvordan-velge.md`,
`hva-er-et-forsamlingslokale.md`,
`leie-lokale-billigst-kommune-sammenlign-lokaltyper.md`,
`moterom-kommune-finn-og-book-ledige-lokaler.md`,
`kapasitetsstyring-idrettsanlegg-driftsleder.md`) — no invented claim, no
link pointing to a post that doesn't actually cover what it's framed as
covering. The "seksti stående, tretti sittende" example was checked and
confirmed adequately hedged as an illustration ("et rom", "gjerne"), not a
universal rule. Found one real grammar defect and two minor consistency
nits:
1. "finnes det heis hvis lokalet ligger i etasje" — missing an
   article/specifier, not standard Bokmål.
2. A nonstandard comma before "og" in the Fasiliteter section's list,
   inconsistent with the post's own list style elsewhere.
3. The table capitalized "Wifi" while the prose used lowercase "wifi".

**Build/SEO lens** — ran the full pipeline once from a clean state
(`rm -rf dist dist-server` → `optimize-images.mjs` → `vite build` → SSR
build → `prerender.mjs` → `check-blog-word-count.mjs` → `pnpm test`): every
step passed, no error-level output, 16/16 test files, 35/35 tests green.
Direct inspection of
`dist/blogg/leie-lokale-sammenligne-egenskaper-kapasitet-utstyr/index.html`
confirmed exactly one `<h1>` matching the title, correct Article JSON-LD,
canonical URL, Open Graph/Twitter tags, all five internal links plus the
external CTA rendered as real `<a href>` tags, and exactly one sitemap
entry (357 total URLs). Checked the known pre-existing listing-pagination
gap from the prior XAL-1139 review specifically for this post: six posts
share today's date, and this post is one of them, landing at position 2 of
6 on `/blogg` page 1 — no defect, the post is visible on the listing page.

### What I changed after round 2
- Fixed "i etasje" → "i en etasje over bakkeplan" (line 30).
- Removed the nonstandard comma before "og" in the Fasiliteter list
  (line 34).
- Lowercased "Wifi" → "wifi" in the comparison table to match the prose's
  usage (line 42).
- Re-ran the full build pipeline and `pnpm test` (16 files / 35 tests, all
  green) after the edits.

## Round 3 — adversarial editorial read + full-branch regression sweep

Two parallel agents: one did a fresh skeptical-editor read of the whole post
(explicitly told not to re-check rounds 1-2's six fixes, only look for
anything new — unsupported superlatives, table/checklist symmetry,
pillar-naming drift, redundancy, one more independent language pass), the
other swept the whole branch state (commits, diff, worktree, ignored files,
lockfiles) for anything content review wouldn't catch.

**Editorial lens** — found five real issues:
1. Three unsupported "most/all" claims stated as flat fact with no backing:
   the intro's "De fleste som skal leie et lokale, sammenligner pris først",
   "De vanligste punktene å sjekke er wifi, kjøkken, prosjektor og
   lydanlegg", and the table's "Feil tall her er den vanligste årsaken til
   at et lokale føles for trangt".
2. The Kapasitet table row was stylistically asymmetric against the other
   four rows — a different phrase structure in "Hva du sjekker," and it
   broke the "Avgjør om..." template every other row's "Hvorfor det betyr
   noe" cell used.
3. The 5-item checklist had no item covering Planløsning (møblering/
   soneinndeling), while Kapasitet got two separate items — an uneven
   mapping from the four body pillars to the checklist.
4. The frontmatter `description` named only "Kapasitet, utstyr,
   tilgjengelighet og fasiliteter," dropping "planløsning" even though it's
   a distinct pillar with its own paragraph and table row.
5. "Utstyr er den andre halvdelen av bildet" read as an English-idiom
   calque rather than natural Bokmål.

**Regression-sweep lens** — clean, with one important caveat surfaced and
resolved: a naive `git diff origin/main..HEAD --stat` showed a spurious
deletion of an unrelated post
(`leie-sal-billigst-kommunal-privat-totalpris-sammenligning.md`) because
`origin/main` had advanced by one unrelated commit after this branch
diverged — confirmed via `git diff <merge-base>..HEAD --stat` that this
branch itself only ever touched the four expected files (`AGENT-GOAL.md`,
`AGENT-SPEC.md`, `AGENT-REVIEW.md`, the new post). Flagged as needing a
merge with the now-advanced `origin/main` before the PR is opened (done at
the sync step), not a content defect. No forbidden shared files touched, no
stray tracked/untracked files, no TODO/FIXME/wrong-ticket text, exactly one
new file under `src/content/blog/`, and `pnpm-workspace.yaml` /
`package.json` / lockfiles confirmed untouched by any commit on this branch
(the local `pnpm approve-builds` run used to install dependencies for
testing never leaked into a commit).

### What I changed after round 3
- Reworded the intro's opening claim from a flat "most renters" assertion
  to a reader-directed statement ("Skal du leie et lokale, er pris gjerne
  det du sammenligner først").
- Reworded "De vanligste punktene å sjekke er..." to "Sjekk gjerne disse
  fire punktene:..." — same four items, framed as guidance rather than an
  unbacked popularity claim.
- Reworded the Kapasitet table row's "Hvorfor det betyr noe" cell to match
  the "Avgjør om..." template used by the other four rows, dropping the
  unsupported "vanligste årsak" claim.
- Shortened the Kapasitet row's "Hva du sjekker" cell to match the other
  rows' comma-list style.
- Added a checklist item for Planløsning and merged the two Kapasitet items
  into one, so all four body pillars now map onto the 5-item checklist.
- Added "planløsning" to the frontmatter description.
- Reworded "Utstyr er den andre halvdelen av bildet" to "Utstyr er den
  andre halvparten av vurderingen."
- Re-ran the full build pipeline and `pnpm test` (16 files / 35 tests, all
  green) after the edits.
