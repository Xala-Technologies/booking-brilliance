# XAL-759: [SEO ROI 46] Fiks side: https://digilist.no/blogg/leie-selskapslokale-bryllup-fest

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the `marketing` repo (booking-brilliance), fix the meta description length on the blog post at src/content/blog/leie-selskapslokale-bryllup-fest.md (route /blogg/leie-selskapslokale-bryllup-fest). Do NOT touch scripts/prerender.mjs or src/components/SEO.tsx or src/pages/BlogPost.tsx — the Article JSON-LD, BreadcrumbList JSON-LD, and <meta name="description"> injection already work correctly and generically for every blog post through that pipeline (verified: scripts/prerender.mjs lines ~2494-2565 inject Article+BreadcrumbList schema per post at build time from post.description/post.title, and src/components/SEO.tsx renders the same client-side). The only real defect is that the `description:` field in this post's frontmatter (line 4) is 190 characters, exceeding the ~160-char SEO/meta-description limit, so it gets truncated by Google and other consumers. Rewrite that one frontmatter field to a unique, compelling description under 160 characters (count with a script, not by eye) that preserves the core promise (find/compare/book selskapslokale for bryllup/fest with real-time availability). Do not change title, keywords, schema (FAQPage), or body content. Acceptance criteria: (1) the description string is <160 characters, (2) `pnpm build` (or the repo's actual build script — check package.json) succeeds and dist/blogg/leie-selskapslokale-bryllup-fest/index.html contains a <meta name="description"> under 160 chars and a <script type="application/ld+json"> block with @type Article and @type BreadcrumbList, (3) any existing tests pass. Verify by running the build and grepping the generated dist HTML file directly, plus optionally pasting the JSON-LD into Google's Rich Results Test. Open a PR only after tests are green.`

## Implementation contract — complete this before writing code
- **Problem:** In the `marketing` repo (booking-brilliance), fix the meta description length on the blog post at src/content/blog/leie-selskapslokale-bryllup-fest.md (route /blogg/leie-selskapslokale-bryllup-fest). Do NOT touch scripts/prerender.mjs or src/components/SEO.tsx or src/pages/BlogPost.tsx — the Article JSON-LD, BreadcrumbList JSON-LD, and <meta name="description"> injection already work correctly and generically for every blog post through that pipeline (verified: scripts/prerender.mjs lines ~2494-2565 inject Article+BreadcrumbList schema per post at build time from post.description/post.title, and src/components/SEO.tsx renders the same client-side). The only real defect is that the `description:` field in this post's frontmatter (line 4) is 190 characters, exceeding the ~160-char SEO/meta-description limit, so it gets truncated by Google and other consumers. Rewrite that one frontmatter field to a unique, compelling description under 160 characters (count with a script, not by eye) that preserves the core promise (find/compare/book selskapslokale for bryllup/fest with real-time availability). Do not change title, keywords, schema (FAQPage), or body content. Acceptance criteria: (1) the description string is <160 characters, (2) `pnpm build` (or the repo's actual build script — check package.json) succeeds and dist/blogg/leie-selskapslokale-bryllup-fest/index.html contains a <meta name="description"> under 160 chars and a <script type="application/ld+json"> block with @type Article and @type BreadcrumbList, (3) any existing tests pass. Verify by running the build and grepping the generated dist HTML file directly, plus optionally pasting the JSON-LD into Google's Rich Results Test. Open a PR only after tests are green.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-759-fiks-side-https-digilist-no-blogg-leie`
- **Scope:** _the one change this branch delivers_
- **Out of scope:** _what you will NOT touch — no opportunistic refactor, no formatting sweeps_
- **Acceptance criteria:** _observable, demonstrable outcomes_
- **Architecture constraints:** _boundaries + patterns to follow_
- **Files likely affected:** _list them; if this grows well beyond the list, escalate_
- **Testing requirements:** _what proves it works_
- **Security considerations:** _secrets, RBAC, injection, dependencies_
- **Rollback strategy:** _how to revert safely_
- **Definition of done:** compiled · tests green · acceptance demonstrated with evidence · one reviewable change · no attribution

## Delivery rules
- One issue → one branch (`agent/xal-759-fiks-side-https-digilist-no-blogg-leie`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** improvement · severity minor · priority P3

Product gap: [SEO ROI 46] Fiks side: [https://digilist.no/blogg/leie-selskapslokale-bryllup-fest](<https://digilist.no/blogg/leie-selskapslokale-bryllup-fest>). <!-- xaheen-triage -->
**defect** · severity minor — Page loads fine with good content; only metadata missing.

Page lacks a meta description tag and JSON-LD Article schema. Content is fine (2,100 words, good links); only metadata needs fixing.

**Done when**

- [ ] Page has unique <meta name="description"> tag under 160 characters
- [ ] Page has valid JSON-LD Article schema and BreadcrumbList (if used elsewhere)

**How to verify**

* View page source and confirm meta description tag is present
* Validate JSON-LD via Google Rich Results Test with no schema errors

**Open questions**

* Are these the same 2 findings the Opportunity Agent detected?
* Should this reuse a sitewide template or is this a one-off fix?

Target repo: `marketing`

<details><summary>Reporter's original text</summary>

**ROI-score 46/100** — rangert av Opportunity Agent på verdi, ikke søkevolum.

| Faktor | Verdi |
| -- | -- |
| Inntektspotensial | 26 |
| Innsats | 20 |
| Konkurranse | 20 |
| Datasikkerhet | 30 |
| Intensjon | commercial |

**Hvorfor:** 2 SEO-funn på siden — fiks eksisterende innhold

Kilde: digital tvilling (GSC + SERP + page_intel). Type: `fix-page`.

</details> Current assessment: fixable (improvement, minor). Relevant code: src/content/blog/leie-selskapslokale-bryllup-fest.md:4, scripts/prerender.mjs:2494-2565, src/components/SEO.tsx:294-322.

**Scope**
Meta description tag and Article+BreadcrumbList JSON-LD already exist for this page via the sitewide blog prerender pipeline (scripts/prerender.mjs) and client SEO component (src/components/SEO.tsx) — no template work needed. The one real defect: the frontmatter `description` in src/content/blog/leie-selskapslokale-bryllup-fest.md is 190 characters, over the 160-char SEO limit, and gets used verbatim as the meta description. Rewrite it to under 160 characters while keeping it unique and on-topic. Touch points: src/content/blog/leie-selskapslokale-bryllup-fest.md:4 (frontmatter `description` is 190 chars (target <160); this exact string is written verbatim into <meta name="description">, og:description and twitter:description); scripts/prerender.mjs:2494-2565 (prerender already injects Article JSON-LD + BreadcrumbList (from breadcrumbs) into the static HTML for every /blogg/:slug page, including this one — ticket's claim of 'missing JSON-LD' is false); src/components/SEO.tsx:294-322 (client-side SEO component also renders Article + BreadcrumbList JSON-LD from the same post fields, confirming the schema pipeline is sitewide, not one-off).

**Done when**

- [ ] Meta description tag and Article+BreadcrumbList JSON-LD already exist for this page via the sitewide blog prerender pipeline (scripts/prerender.mjs) and client SEO component (src/components/SEO.tsx) — no template work needed. The one real defect: the frontmatter `description` in src/content/blog/leie-selskapslokale-bryllup-fest.md is 190 characters, over the 160-char SEO limit, and gets used verbatim as the meta description. Rewrite it to under 160 characters while keeping it unique and on-topic.

## Code analysis (evidence, marketing @ 725c87de)

Status: **fixable** (confidence 85%)

* `src/content/blog/leie-selskapslokale-bryllup-fest.md:4` — frontmatter `description` is 190 chars (target <160); this exact string is written verbatim into <meta name="description">, og:description and twitter:description
* `scripts/prerender.mjs:2494-2565` — prerender already injects Article JSON-LD + BreadcrumbList (from breadcrumbs) into the static HTML for every /blogg/:slug page, including this one — ticket's claim of 'missing JSON-LD' is false
* `src/components/SEO.tsx:294-322` — client-side SEO component also renders Article + BreadcrumbList JSON-LD from the same post fields, confirming the schema pipeline is sitewide, not one-off

## Source

Product idea (XAL-759), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop In the `marketing` repo (booking-brilliance), fix the meta description length on the blog post at src/content/blog/leie-selskapslokale-bryllup-fest.md (route /blogg/leie-selskapslokale-bryllup-fest). Do NOT touch scripts/prerender.mjs or src/components/SEO.tsx or src/pages/BlogPost.tsx — the Article JSON-LD, BreadcrumbList JSON-LD, and <meta name="description"> injection already work correctly and generically for every blog post through that pipeline (verified: scripts/prerender.mjs lines ~2494-2565 inject Article+BreadcrumbList schema per post at build time from post.description/post.title, and src/components/SEO.tsx renders the same client-side). The only real defect is that the `description:` field in this post's frontmatter (line 4) is 190 characters, exceeding the ~160-char SEO/meta-description limit, so it gets truncated by Google and other consumers. Rewrite that one frontmatter field to a unique, compelling description under 160 characters (count with a script, not by eye) that preserves the core promise (find/compare/book selskapslokale for bryllup/fest with real-time availability). Do not change title, keywords, schema (FAQPage), or body content. Acceptance criteria: (1) the description string is <160 characters, (2) `pnpm build` (or the repo's actual build script — check package.json) succeeds and dist/blogg/leie-selskapslokale-bryllup-fest/index.html contains a <meta name="description"> under 160 chars and a <script type="application/ld+json"> block with @type Article and @type BreadcrumbList, (3) any existing tests pass. Verify by running the build and grepping the generated dist HTML file directly, plus optionally pasting the JSON-LD into Google's Rich Results Test. Open a PR only after tests are green.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from XAL-759 + code analysis

Linear: https://linear.app/xala-technologies/issue/XAL-759/seo-roi-46-fiks-side-httpsdigilistnobloggleie-selskapslokale-bryllup
