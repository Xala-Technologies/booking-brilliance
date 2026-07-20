# XAL-354: [marketing] [SEO warn] title.long — /blogg/datalokasjon-norge-gdpr-kommunal-booking

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Fiks SEO-problemet på https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking (marketing): Title is 66 chars (recommend ≤65). Verifiser med seo-crawler etter endring.`

## Implementation contract — complete this before writing code
- **Problem:** Fiks SEO-problemet på https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking (marketing): Title is 66 chars (recommend ≤65). Verifiser med seo-crawler etter endring.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-354-marketing-seo-warn-title-long-blogg-datalokasjon`
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
- One issue → one branch (`agent/xal-354-marketing-seo-warn-title-long-blogg-datalokasjon`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

> **Scope — minimal & conflict-free (rebuild):** fix ONLY this page's own metadata (its frontmatter title/description, or its own component). Do NOT add build-time guards or edit shared build/render scripts (scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs) — every SEO branch funnels through those and they conflict on merge. Content edit only.

<!-- xaheen-triage -->

## Problem Statement

Sidetittelen på [https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking](<https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking>) er 66 tegn, mens SEO-anbefalingen er ≤65 tegn. Funnet av SEO-skann (seo/warn, konfidens 72 %) i marketing-repoet. Ingenting er ødelagt — siden fungerer; tittelen overskrider en anbefalt grense med ett tegn.

## Scope

**Innenfor:**

* Korte ned sidetittelen (<title>) for /blogg/datalokasjon-norge-gdpr-kommunal-booking til ≤65 tegn
* Bevare betydning og relevante søkeord i tittelen
* Verifisere med seo-crawler etter endring

**Utenfor:**

* Endringer utenfor marketing-repoet
* Titler/SEO på andre sider enn den angitte URL-en
* Urelaterte refaktoreringer eller drive-by-fikser
* Direkte merge til main

## Acceptance Criteria

- [ ] Tittelen på /blogg/datalokasjon-norge-gdpr-kommunal-booking er ≤65 tegn
- [ ] seo-crawler rapporterer ikke lenger title.long for denne URL-en
- [ ] Bygg og relevante tester er grønne (CI)
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel

## Testing Scenario

* Given siden /blogg/datalokasjon-norge-gdpr-kommunal-booking, When tittelens tegnlengde måles, Then er den ≤65 tegn
* Given den nye tittelen, When seo-crawler kjøres på URL-en, Then er title.long-advarselen borte
* Given endringen, When siden lastes, Then er tittelen fortsatt meningsbærende og inneholder relevante søkeord (f.eks. datalokasjon/GDPR/kommunal booking)

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

*Ingen begrunnelse oppgitt.*

## Åpne spørsmål

* Hvem er påvirket, og hva er den faktiske verdien av å fikse denne ene-tegns-overskridelsen? Saken oppgir ingen brukere, trafikk eller forretningskonsekvens.
* Hva er den nåværende tittelteksten (66 tegn), slik at en konkret forkortelse kan foreslås? Saken oppgir bare lengden, ikke teksten.
* Finnes det en fast mal/mønster for bloggtitler i marketing-repoet som forkortelsen må følge?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** technical → `improvements-agent` · repo `marketing`

**Klassifisering:** improvement · alvorlighet minor · prioritet P3

## Problem statement

[marketing] [SEO warn] title.long — /blogg/datalokasjon-norge-gdpr-kommunal-booking. Title is 66 chars (recommend ≤65) Observed at [https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking](<https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking>). Classification: improvement/minor — fixable. Relevant code: [https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking](<https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking>).

## Scope

Improve on-page SEO (marketing:crawl:title.long:[https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking](<https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking>)): Title is 66 chars (recommend ≤65) Touch points: [https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking](<https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking>) (Title is 66 chars (recommend ≤65)).

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Improve on-page SEO (marketing:crawl:title.long:[https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking](<https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking>)): Title is 66 chars (recommend ≤65)
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.
- [ ] Changes address: [https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking](<https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking>).
- [ ] Verify fix on [https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking](<https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking>) or equivalent environment.

## Kodeanalyse (bevis, marketing @ seo-run)

Status: **fixable** (konfidens 72 %)

* `https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking` — Title is 66 chars (recommend ≤65)

## Kilde

Skann-funn: seo/warn — [https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking](<https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking>)

## Kjør som Claude-loop (i `/Volumes/Laravel/Loveable/booking-brilliance`, på en ny branch)

```
/loop Fiks SEO-problemet på https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking (marketing): Title is 66 chars (recommend ≤65). Verifiser med seo-crawler etter endring.
```

---

*Auto-generert av Digilist Improvements Agent (Linear specialist) fra marketing:crawl:title.long:[https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking](<https://digilist.no/blogg/datalokasjon-norge-gdpr-kommunal-booking>) + kodeanalyse (graf @ seo-run). Flytt til godkjenningstilstand for å klargjøre en implementasjons-branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-354/marketing-seo-warn-titlelong-bloggdatalokasjon-norge-gdpr-kommunal
