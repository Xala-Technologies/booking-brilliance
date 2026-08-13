## Round 1 — Correctness

**Lens:** does the diff do what the acceptance criteria say, including edge cases? Read `.agent/XAL-1008/SPEC.md`, then `git diff origin/main...HEAD`, then ran the actual checks rather than trusting the SPEC's tables.

**Checks run:**
- Re-ran `grep -rn 'title="'` over `src/pages/*.tsx` with a length filter (>65) — zero remaining hits.
- Searched for template-literal (`` title={` ``) and multi-line `title=` props across `src/pages/*.tsx` (the ticket explicitly asked to recheck these patterns, since the original single-line-grep list was known to be incomplete) — found one template-literal title (`BlogPreview.tsx:215`, a `noindex,nofollow` preview page, correctly out of scope) and no multi-line props.
- Programmatically walked every `title:` key in `src/lib/copy.ts` for anything with "title" in its key — only `faqPage.title` was ever >65, and it's fixed; no other i18n title key is over.
- Parsed every `BYER` entry in `src/content/lokalerByer.ts` (all 15 cities, cross-checked against `grep -n '^\s*name:'`) and computed the *effective* title (`data.title ?? default template`) for each — all ≤65, including `Bærum` (65, exactly at the limit, correctly left on the default template and not called out in the SPEC's table, but not a bug since it doesn't need a fix).
- Parsed all 91 `title:` literals in `scripts/prerender.mjs` — zero >65.
- Ran `pnpm build` and diffed the shipped `dist/**/index.html` `<title>` tags: 431 files, zero non-blog-post pages >65 chars, and the ticket's named spot-check (`/rapport/utleiemarkedet-norge-2026`) shows the exact expected shortened string. Also checked for accidental duplicate titles across non-blog pages introduced by the shortening — none.
- Ran `pnpm test`: 1 failure (`src/entry-server.main-landmark.test.tsx`, a 5s Suspense-resolution timeout on a lazy-loaded blog post). Re-ran that file in isolation 3x — passed every time. `entry-server.tsx` is untouched by this diff, so this is pre-existing flakiness under parallel load, not a regression from this change.

**Findings:**
1. (Fixed) `src/pages/seo-title-length.test.ts` added regression coverage for `faqPage.title` (copy.ts) and `Blog.tsx`'s local `COPY.title`, but not for the other two i18n-driven titles that share the same `title={t(locale, "...")}` pattern: `home.title` and `pricing.title` in `copy.ts` (consumed by `Index.tsx`/`Priser.tsx`). The SPEC says these were manually checked (52/44/59/58 chars — all currently fine, not a live bug), but unlike every other title source touched by this ticket, they had no automated length guard, so a future edit to either could silently regress past 65 with nothing to catch it. Added the same nb/en length assertions used for `faqPage.title`.
2. (Not fixed, documented) `seo-title-length.test.ts`'s regex `/title="([^"]*)"/g` matches *any* `title="..."` JSX attribute in a `src/pages/*.tsx` file, not specifically `<SEO title=...>`. It currently works because every non-SEO `title=` in scope (native tooltip `title`s in `Status.tsx`/`Transparens.tsx`, and the short "eyebrow" title prop on ~30 simple landing pages) is well under 65 chars. This is over-broad by construction: a future long tooltip title would fail this test with a misleading "SEO `<title>` length" message even though it has nothing to do with SERP snippets. Left as-is — narrowing it safely (e.g. requiring the match to follow a `<SEO` opening tag) is more invasive than this ticket's scope justifies, and there's no current false failure to fix.

**Verdict:** the core acceptance criteria are met — every previously-offending title (component literals, i18n dict entries, per-city overrides, and the independent `prerender.mjs` copy that actually ships in `dist/`) is now ≤65 chars, the primary phrase + `Digilist` brand suffix is preserved in every case, the diff is scoped to title strings and their tests only, `pnpm build` is green, and the named spot-check URL renders the expected shortened title. `pnpm test` has one flaky, pre-existing, unrelated failure (documented above, not caused by this diff).

## Round 2 — Regression

**Lens:** what ELSE reads this code path? `src/components/SEO.tsx` is the one shared consumer of every page's title (sets `document.title`, `og:title`, `twitter:title`, JSON-LD `name`). Round 1 verified every `<SEO title="...">` and known i18n/dynamic-template source. This round instead enumerated every *caller* of `SEO.tsx` — directly and through wrapper components — to check whether any caller passes its title through a prop name the earlier `title="..."` grep (and the `seo-title-length.test.ts` regex, which uses the identical pattern) would not match.

**Checks run:**
- `grep -rl "<SEO" src/ --include="*.tsx"` — 35 files render `<SEO`. Of those, 3 are wrapper *components*, not pages: `src/components/UseCasePage.tsx` (`title={seoTitle}`, 36 page consumers), `src/components/MarketplaceHub.tsx` (`title={seoTitle}`, 4 page consumers), `src/components/AgentSpokeLayout.tsx` (`title={content.metaTitle}`, 3 page consumers) — 43 pages total whose actual `<SEO>` title lives in a `seoTitle="..."` JSX attribute or a `metaTitle: "..."` object property in the *calling* page file, not a `title="..."` attribute.
- The existing length-guard regex (`seo-title-length.test.ts:18`, `/title="([^"]*)"/g`, and the original manual grep from round 0) is case-sensitive and matches the literal substring `title="`. `seoTitle="..."` does not contain that substring (`seoTitle=` has capital `T`), and `metaTitle: "..."` uses a colon, not `=`, so both prop shapes are structurally invisible to it. Also: `PAGES_DIR` filtering used `readdirSync(PAGES_DIR)` — non-recursive — so `src/pages/agents/*.tsx` was never scanned by the test at all, for *any* prop shape.
- Programmatically extracted the `seoTitle=`/`metaTitle:` string from all 43 wrapper-consumer pages and measured length. 39 are fine. **4 are >65 and were never touched by this diff**, even though `prerender.mjs` already carries a *shortened* title for the same route (added in the original fix, see SPEC's "5 titles for routes that don't have a matching `title=` literal in `src/pages/*.tsx`" — that claim is wrong for 4 of those 5; they do have a literal, just under a different prop name):
  - `src/pages/UseCaseIdrettshaller.tsx:17` `seoTitle` — 72 chars (route `/bruksomrader/idrettshaller-gymsaler`)
  - `src/pages/UseCaseKulturhus.tsx:17` `seoTitle` — 69 chars (route `/bruksomrader/kulturhus-kantiner`)
  - `src/pages/Arrangementer.tsx:92` `seoTitle` — 72 chars (route `/arrangementer`)
  - `src/pages/agents/ImporterOppforing.tsx:8` `metaTitle` — 69 chars (route `/ai-agenter/importer-oppforing`; also the one page missed purely because of the non-recursive directory scan)
- Effect: `pnpm build`'s prerendered static HTML for these 4 routes is correctly ≤65 (since `prerender.mjs`'s own copy was fixed), but the moment React hydrates — or a user navigates client-side into any of these 4 routes without a full page load — `SEO.tsx` re-renders with the page component's own long `seoTitle`/`metaTitle` prop and overwrites `document.title`/`og:title`/`twitter:title`/JSON-LD `name` back to the >65-char string. This is the exact static-vs-runtime mismatch the SPEC flagged as a risk for `prerender.mjs` (worried the *static* copy would lag the *component*), just inverted: here the component lagged the static copy. `UseCasePage.tsx:66` even documents the contract explicitly — `/** SEO meta title (≤65 chars). */` — confirming this is a real, intended invariant that regressed.
- Checked for other consumers that might duplicate title text: no sitemap generator, search index (no Algolia/Pagefind in this repo), or RSS feed reads page titles (`grep` for `sitemap`/`algolia`/`pagefind` in `scripts/`/`src/` turned up only `prerender.mjs`'s own sitemap-writer, which uses routes/URLs, not titles). No test file references the old long strings, so nothing outside `SEO.tsx`'s direct render path was at risk.

**Fixed:**
- Shortened all 4 `seoTitle`/`metaTitle` strings to match the text already shipped in `prerender.mjs` for the same route (keeps the static and runtime copies identical, consistent with how every other fixed page in this diff works):
  - `UseCaseIdrettshaller.tsx`: `"Idrettshall booking: for kommuner og foreninger | Digilist"` (60)
  - `UseCaseKulturhus.tsx`: `"Kulturhus og kantiner: for kommunale arenaer | Digilist"` (57)
  - `Arrangementer.tsx`: `"Arrangementer: kjøp billetter til konsert og teater | Digilist"` (64)
  - `agents/ImporterOppforing.tsx`: `"Importér oppføring: fra Airbnb eller Finn | Digilist"` (54)
- Extended `seo-title-length.test.ts` to close the two gaps that let this regress silently: (1) added a `seoTitle="..."`/`metaTitle:\s*"..."` pattern alongside the existing `title="..."` one, and (2) made the `src/pages` scan recursive so `src/pages/agents/*.tsx` (and any future subdirectory) is covered. Re-verified the other 39 wrapper-consumer pages still pass under the new pattern (no other pre-existing regressions found).
- Did not touch `prerender.mjs` (already correct for these 4 routes) or any other file.

**Verdict:** found and fixed a real regression — 4 of the 43 pages that route their SEO title through a wrapper component (`UseCasePage`/`MarketplaceHub`/`AgentSpokeLayout`) via a `seoTitle`/`metaTitle` prop, rather than a literal `<SEO title="...">`, were missed by every prior check (grep, SPEC's blast-radius scan, and round 1's test suite) because those checks all keyed on the exact substring `title="`. Static prerendered HTML was already correct for these routes (via `prerender.mjs`); the client-rendered/hydrated title was not. Now fixed at the source and guarded by an extended test.

## Round 3 — Security

**Lens:** authz, tenant isolation, injection, secrets, and anything user-supplied that reaches a query, a path, or a page. Read `.agent/XAL-1008/SPEC.md`, `.agent/XAL-1008/REVIEW.md` (rounds 1–2), and `git diff origin/main...HEAD`.

**Checks run:**
- Enumerated every file the diff touches (`git diff origin/main...HEAD --stat`): 9 `src/pages/*.tsx` literals, 2 `src/pages/agents|UseCase*` wrapper-prop strings (round 2's fix), `src/lib/copy.ts` (`faqPage.title` nb/en), `src/pages/Blog.tsx` (`COPY.nb/en.title`), `scripts/prerender.mjs` (21 `ROUTES`/`faqRoute`/`blogIndex` title literals), `src/content/lokalerByer.ts` (12 new `title:` overrides) + its test, and a new `seo-title-length.test.ts`. Read the full diff for every one of these files (not just the SPEC's summary table) to confirm each change is a static string literal edit and nothing else moved.
- **Authz/tenant isolation:** confirmed via prior sessions' memory and re-confirmed by this diff — this repo is a marketing/content-ops site with no booking/tenant domain, no session or role checks anywhere in the changed files. None of the 9 changed files contain auth, session, or role-check code; the diff is 100% string-literal edits inside JSX props, object literals, and array-of-object literals.
- **Injection:** traced every changed title's data flow back to its source. All are hardcoded developer-authored string literals — no `req`/`params`/`query`/DB read/env var feeds any of them. The one page that renders a *dynamic* title, `src/pages/LokalerTilLeieBy.tsx` (`data.title ?? \`Lokaler til leie i ${data.name} – finn og book ledige lokaler | Digilist\`}`), is untouched by this diff except that 12 `BYER` entries gained a static `title:` override (same mechanism Fredrikstad already used) — the lookup itself (`BYER[by.toLowerCase()]`, `by` from `useParams`) is a static-object-key lookup against a hardcoded `Record`, not a template evaluation, so a malicious `by` route param can only resolve to `undefined` → `NotFound`, never to injected content. This logic is unchanged by the diff.
- Checked `scripts/prerender.mjs`'s title-insertion mechanism (`.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)`, line ~2365) — this does an unescaped string interpolation into raw HTML, which would be a real HTML-injection primitive *if* `meta.title` were ever attacker-influenced. It isn't: every `meta.title` in `ROUTES` is a literal owned by this diff. Grepped every string this diff added or changed for `<`, `>`, `&`, or `"` (the characters that would matter for that unescaped replace) — zero hits. Pre-existing risk shape, not introduced or worsened here, and no live exploit path since there's no attacker-controlled input reaching `meta.title`.
- **Secrets:** grepped the full diff for `api[_-]?key`, `secret`, `token`, `password`, `bearer`, PEM headers — zero hits. Titles are marketing copy; nothing in the shortened strings references internal infrastructure, credentials, or non-public information. (Noted separately, not a security finding: `OmOss.tsx`'s title dropped "fra Xala Technologies" during shortening — a content/branding call already inside round 1/2's correctness lens, not a security concern.)
- **User-supplied data reaching a query/path/page:** none of the 12 changed files accept user input at all — they're either static page components, a static content dictionary, or a build-time script. The only route param in the entire blast radius (`by` in `LokalerTilLeieBy.tsx`) was already covered above.
- Also checked the new `seo-title-length.test.ts` (test-only, never shipped) for anything security-relevant: it does `readdirSync`/`readFileSync` against fixed, hardcoded relative paths only (`PAGES_DIR`, `../lib/copy.ts`, `../../scripts/prerender.mjs`) — no dynamic path construction from any external input, so no path-traversal shape even in test code.

**Findings:** none. This diff has no authz, tenant-isolation, injection, secrets, or user-input-reaches-a-sink surface — it is a closed set of static string-literal edits (title text only) across page components, an i18n dict, a per-city content map, and a build script's hardcoded route table, verified above to have zero attacker-influenced data flowing into any of them. No fixes made this round.

**Verdict:** clean. No code changes this round.

## Round 4 — Scope

**Lens:** is anything in this diff NOT the stated change? Drive-by edits, unrelated tidying, files nobody asked to touch. Read `.agent/XAL-1008/SPEC.md`, rounds 1–3 above, then `git diff origin/main...HEAD` in full (not the SPEC's summary table) for every changed file.

**Checks run:**
- `git diff origin/main...HEAD --stat`: 21 files. Split them into three buckets and checked each:
  1. **Process docs** (`.agent/XAL-1008/SPEC.md`, `.agent/XAL-1008/REVIEW.md`) — required record-keeping for this workflow, not product code. In scope by the task contract itself.
  2. **Title-string edits** (`scripts/prerender.mjs`, `src/content/lokalerByer.ts`, `src/lib/copy.ts`, and 12 `src/pages/**/*.tsx` files including the round-2 wrapper-prop fixes) — read every hunk in full (not just the SPEC's table). Every `-`/`+` pair is a single `title:`/`title=`/`seoTitle=`/`metaTitle:` string literal. Confirmed via `git diff --stat`: each page file shows exactly `2` lines changed (1 removed, 1 added) except `Blog.tsx` (4, for nb+en) and `lokalerByer.ts` (12 insertions, one new `title:` line per city, 0 deletions). No `description`, `keywords`, `canonical`, `breadcrumbs`, or JSX-structure line appears in any hunk — those are all unchanged context lines.
  3. **New/extended test files** (`src/pages/seo-title-length.test.ts`, `src/content/lokalerByer.test.ts`) — both are pure regression guards for the ≤65-char invariant this ticket introduces (added in rounds 1–2, not this round). Read `seo-title-length.test.ts` in full: it only reads fixed, hardcoded relative paths (`src/pages`, `src/lib/copy.ts`, `scripts/prerender.mjs`) and asserts lengths — no unrelated assertions, no snapshot of unrelated behavior.
- Checked for anything a "shortening pass" commonly drags in by habit, none found: no import reordering, no unrelated formatting/whitespace-only hunks, no `package.json`/lockfile/CI config/tsconfig changes, no renamed files, no dist/build artifacts committed (`git diff --name-only | grep -i dist` — empty), no changes to `scripts/check-title-lengths.mjs` (the explicitly-out-of-scope blog-frontmatter script) or `src/content/blog/*.md`.
- Re-ran `git status` — working tree clean, nothing staged/unstaged outside the 5 committed commits ahead of `origin/main`.
- Checked commit boundaries (`git log --oneline origin/main..HEAD`): 5 commits, each already scoped to one concern (initial 62-title fix, round 1 correctness + test, round 2 regression fix + test, round 3 security docs-only). No commit mixes an unrelated change with a title edit.

**Findings:** none. Every changed line in every file is either a title string, a length-guard test for that exact invariant, or the process documentation this workflow itself requires. No drive-by tidying, no unrelated file touched, no scope creep.

**Verdict:** clean. No code changes this round. (This session also resolved a stale "AGENT-SPEC.md doesn't exist, redo step 0" instruction in the run prompt against actual repo state: `.agent/XAL-1008/SPEC.md` already existed from an earlier round, and a root-level `AGENT-SPEC.md` was deliberately removed from `main` upstream — per-branch copies of that file collide on merge. Did not recreate it.)

## Round 5 — Proof

**Lens:** this is a *fix to behaviour that existed before* (a long `<title>` string), so the merge gate needs after-evidence that the shortened title actually ships and renders — not just that the diff looks right on paper (rounds 1–4 already exhausted the "does the diff do the right thing" lens). No AGENT-SPEC.md work was needed: `.agent/XAL-1008/SPEC.md` already exists with the required diagram (confirmed round 4), so step 0 was already satisfied on disk — the run prompt's premise ("step 0 was never finished") was stale.

**Commands run, fresh this session:**

```
$ pnpm build
...
Pre-rendered 429 pages + sitemap.
✓ All 340 blog posts have at least 200 words in the markdown source.
✓ All 340 blog posts render at least 200 words in dist/blogg/*/index.html.

$ grep -o '<title>[^<]*</title>' dist/rapport/utleiemarkedet-norge-2026/index.html
<title>Utleiemarkedet i Norge 2026 – data og priser | Digilist</title>

$ pnpm test
 Test Files  42 passed (42)
      Tests  724 passed (724)
```

`pnpm test` is fully green this run (724/724) — round 1's noted flaky `entry-server.main-landmark.test.tsx` timeout did not reproduce here.

**Visual proof:** started `pnpm preview` against the freshly built `dist/`, opened `http://localhost:4173/rapport/utleiemarkedet-norge-2026` with `agent-browser`, waited for hydration, and read `document.title` back from the live DOM (not just the prerendered HTML) — `"Utleiemarkedet i Norge 2026 – data og priser | Digilist"` (55 chars), confirming the static `dist/` copy and the client-hydrated `SEO.tsx`-driven title agree. Screenshot with the title value overlaid on the actual rendered page saved to `.agent/XAL-1008/proof/utleiemarkedet-title-after.png`. The ticket's own spot-check (curl `https://digilist.no/rapport/utleiemarkedet-norge-2026` after deploy) is necessarily out of reach pre-deploy; this is the closest equivalent achievable in this session (local build + local preview server, not the production origin).

**Linear attachment:** no Linear MCP tools are available in this environment (confirmed empty via `ToolSearch`, consistent with prior-session finding for XAL-1151 — see memory). The screenshot above could not be attached to the XAL-1008 issue programmatically; a human with Linear access should attach `.agent/XAL-1008/proof/utleiemarkedet-title-after.png` manually.

**Verdict:** build and full test suite green from a clean run this session; the one named acceptance-criterion URL verified end-to-end (static HTML + hydrated DOM + visual screenshot) to render the shortened, ≤65-char title. No code changes this round.
