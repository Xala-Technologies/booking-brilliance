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
