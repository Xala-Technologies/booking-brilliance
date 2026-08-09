# XAL-1141: Deep review log

Change under review: one new file,
`src/content/blog/teknisk-funksjonalitet-sikkerhet-bookingsystem.md`
(a Norwegian blog post), plus `AGENT-SPEC.md` and `proof/*.png`.

## Round 1 — correctness / regression-duplication / security / scope

Four parallel agents, each told to REFUTE the change over the actual file
contents (and `git show 63231fa` for the scope lens).

**Correctness** — found two real defects:
1. The post defined SSA-L as "Statens standardavtale for programvare som
   tjeneste". Every other post in the repo (15+, cross-checked with grep)
   defines it as "Statens standardavtale for løpende tjenestekjøp" — my
   phrasing was simply wrong, not a stylistic variant.
2. The audit-log line "loggen kan ikke endres av den samme kontoen som gjorde
   endringen" was an invented, uncorroborated specific claim — no other post
   or `Sikkerhet.tsx` makes that particular assertion. The closest
   established claim (`integrasjon-med-offentlige-systemer-og-autentisering.md`:
   "Loggen er uforanderlig, verken administratorer i kommunen eller
   Digilist-support kan slette enkeltoppføringer") is different and better
   supported.
   Everything else checked out: ISO 27001/27701 "sertifisert" (not "i
   prosess") matches `Sikkerhet.tsx` and other posts; all four internal links
   resolved; frontmatter conventions matched; no Norwegian grammar errors.

**Regression / duplication** — found the most important issue of the round:
`integrasjon-med-offentlige-systemer-og-autentisering.md` (slug
`id-porten-bankid-integrasjon-kommune-booking`) covers the same three pillars
(ID-porten/BankID auth, immutable audit log, RBAC) in comparable depth, and I
had not read it before writing (my pre-writing grep pass found it but I only
skimmed the file list, not the file itself). Real keyword overlap also
flagged against `brukerstyring-og-tilgangskontroll.md` (`rollebasert
tilgang`), `ssa-l-2026-bookingsystem-kommune.md` (`SSA-L 2026`), and
`idrettshall-tildeling-saksbehandler-godkjenning-revisjonsspor.md`
(`revisjonsspor`, published the same day). Slug and cover-image reuse
(`gdpr_iso27001_hero_no.webp`, already used by 6 other posts) were both
confirmed clean — reuse is the established norm here, not a collision risk.

**Security** — no issues. Markdown renders through `ReactMarkdown` with only
`remarkGfm` (no `rehype-raw`), so there's no HTML-injection surface either
way; the post contains no raw HTML regardless. Audit-log description stays at
the same marketing-level detail already public on `/sikkerhet`. No
unsupported certification claims (matched existing "sertifisert" wording) and
no external links besides internal `/blogg/*` and `/sikkerhet` paths.

**Scope** — clean. Diff is exactly the new post, `AGENT-SPEC.md`, and
`proof/*.png`; no shared build/render script touched. One doc-accuracy
defect: `AGENT-SPEC.md` described a keyword (`"teknisk sikkerhet
bookingsystem"`) that wasn't actually in the file's frontmatter (the real
second keyword was `"sikkerhet bookingsystem kommune"`).

### What I changed after round 1
- Fixed the SSA-L acronym expansion to "Statens standardavtale for løpende
  tjenestekjøp" and turned the mention into a link to
  `/blogg/ssa-l-2026-bookingsystem-kommune`, matching how every other post
  refers to it.
- Rewrote the audit-log sentence to use the same, already-established
  "uforanderlig … verken administratorer i kommunen eller Digilist-support
  kan slette enkeltoppføringer" claim instead of the invented
  same-account-lockout detail.
- Added an explicit cross-link from the login section to
  `integrasjon-med-offentlige-systemer-og-autentisering.md`, framing it as
  "the technical integration deep dive" so the two posts read as a
  hub-(checklist)-and-spoke-(architecture) pair for search engines and
  readers, rather than two pieces chasing the same intent.
- Corrected `AGENT-SPEC.md`'s keyword list to match the actual frontmatter,
  and added the missed near-duplicate post plus the mitigation taken to the
  "HOW IT WORKS NOW" section.
- Re-ran `node scripts/check-blog-word-count.mjs` after edits (still 1019
  words, well above the 200-word floor) and re-confirmed all internal links
  resolve.

## Round 2 — deeper fact-check + SEO/rendering regression

Two parallel agents: one re-verified round 1's fixes landed correctly and
then read every remaining factual sentence line by line against
`Sikkerhet.tsx` and 3+ other posts; the other did a full `pnpm build` +
`pnpm vitest run` pass focused on structured data, sitemap, blog listing, and
the AEO corpus file — none of which round 1 had checked.

**Fact-check lens** — round 1's three fixes all verified correct (SSA-L
phrasing now matches 11+ other posts, audit-log claim now verbatim-consistent
with the linked integration post, new cross-link resolves). One new, real
issue found: the "avansert administrasjon" section (then line 38) claimed the
*kommune* sets up and adjusts rights for all four listed roles — including
"lagkoordinator" and "bedriftsfullmakt." Cross-checked against
`brukerstyring-og-tilgangskontroll.md` and
`registrere-lag-organisasjon-booke-kommunale-lokaler.md`: lagkoordinator is
the *team's own* admin role, and a business's booking-confirmation authority
is controlled by the business itself, not the kommune. The sentence conflated
kommune-administered RBAC with tenant-internal self-administration, which
blurs a real multi-tenant boundary, ironic given the post's own checklist
asks vendors to prove tenant isolation. Everything else re-checked clean: ISO
checklist phrasing matches ~5 other posts' generic due-diligence language
(not a Digilist-specific hedge), description (158 chars) and title (78
chars) are within the corpus's normal range, and the "fjerner passord som
angrepsvektor helt" claim is narrower than, not contradicting, the phishing
post's more hedged claim.

**SEO/rendering lens** — ran a full `pnpm build` and inspected the actual
prerendered output, not just the source markdown. Confirmed: exactly one
`<h1>` matching the frontmatter title; `Article` JSON-LD present with
`headline`/`description` matching frontmatter and `articleSection: "IT-leder"`
matching `tag`; canonical URL and all Open Graph tags (including
`og:locale=nb_NO`) correct; the post appears exactly once in
`dist/sitemap.xml` with the right `<lastmod>`; it appears correctly as the
first (most recent) entry on the blog listing page, sorted by date as
expected; `pnpm vitest run` still green (16 files / 35 tests). Confirmed the
post's correct *absence* from `dist/llms-full.txt` is expected behavior (that
file is a static FAQ corpus, not a per-post index — verified other linked
posts are likewise absent). No issues found in this lens.

### What I changed after round 2
- Rewrote the "avansert administrasjon" paragraph to separate kommune-level
  role administration (saksbehandler, driftsleder, administrator — set up and
  adjusted by the kommune) from tenant-internal self-administration
  (lagkoordinator, bedriftsfullmakt — set up and adjusted by the team or
  business itself, without kommune involvement), matching the tenant
  boundary described in `brukerstyring-og-tilgangskontroll.md`.
- Re-ran the word-count check (1043 words) and `pnpm vitest run` (16 files /
  35 tests, all green) after the edit.
