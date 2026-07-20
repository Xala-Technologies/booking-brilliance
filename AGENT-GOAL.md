# XAL-356: [marketing] [SEO warn] title.long — /blogg/kapasitetsstyring-idrettsanlegg-driftsleder

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Fiks SEO-problemet på https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder (marketing): Title is 66 chars (recommend ≤65). Verifiser med seo-crawler etter endring.`

## Implementation contract — complete this before writing code
- **Problem:** Fiks SEO-problemet på https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder (marketing): Title is 66 chars (recommend ≤65). Verifiser med seo-crawler etter endring.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-356-marketing-seo-warn-title-long-blogg-kapasitetsst`
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
- One issue → one branch (`agent/xal-356-marketing-seo-warn-title-long-blogg-kapasitetsst`) → one independently reviewable change. Never main.
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

Sidetittelen på bloggartikkelen [https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder](<https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder>) er 66 tegn, én over SEO-crawlerens anbefalte grense på ≤65 tegn (marketing:crawl:title.long, seo/warn, konfidens 72%). Dette er en anbefaling — siden fungerer og vises; ingenting er ødelagt.

## Scope

**Innenfor:**

* Forkorte <title> for /blogg/kapasitetsstyring-idrettsanlegg-driftsleder til ≤65 tegn i marketing-repoet
* Verifisere endringen med seo-crawleren etter deploy

**Utenfor:**

* Endringer utenfor marketing-repoet
* Titler/SEO på andre sider enn den angitte URL-en
* Urelaterte refaktoreringer eller drive-by-fikser
* Direkte merge til main

## Acceptance Criteria

- [ ] <title> for [https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder](<https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder>) er ≤65 tegn
- [ ] seo-crawleren rapporterer ikke lenger title.long-warn for denne URL-en etter endring
- [ ] CI (tester + build) er grønn
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel

## Testing Scenario

* Gitt bloggsiden /blogg/kapasitetsstyring-idrettsanlegg-driftsleder, Når jeg måler tegnlengden på <title>-elementet, Så er den ≤65 tegn
* Gitt at tittelen er forkortet og deployet, Når seo-crawleren kjøres på URL-en, Så finnes ingen title.long-warn for denne siden
* Gitt den forkortede tittelen, Når siden lastes, Så gjenspeiler tittelen fortsatt artikkelens tema (kapasitetsstyring for idrettsanlegg / driftsleder)

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

*Ingen begrunnelse oppgitt.*

## Åpne spørsmål

* Hva er den nåværende tittelteksten (66 tegn)? Saken oppgir lengden, men ikke selve strengen — nødvendig for å foreslå en forkortet variant.
* Hvilken tapt effekt (SERP-avkorting, klikkrate, tapt trafikk) har de ekstra tegnet konkret hatt? Ingen bevis i saken — trengs for å prioritere mot annet arbeid.
* Hvem har bedt om dette / hvem er berørt? Saken er auto-generert fra et crawl-funn uten oppgitt interessent.
* Er ≤65 tegn en hard intern SEO-policy eller kun crawlerens standardanbefaling?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** technical → `improvements-agent` · repo `marketing`

**Klassifisering:** improvement · alvorlighet minor · prioritet P3

## Problem statement

[marketing] [SEO warn] title.long — /blogg/kapasitetsstyring-idrettsanlegg-driftsleder. Title is 66 chars (recommend ≤65) Observed at [https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder](<https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder>). Classification: improvement/minor — fixable. Relevant code: [https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder](<https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder>).

## Scope

Improve on-page SEO (marketing:crawl:title.long:[https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder](<https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder>)): Title is 66 chars (recommend ≤65) Touch points: [https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder](<https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder>) (Title is 66 chars (recommend ≤65)).

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Improve on-page SEO (marketing:crawl:title.long:[https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder](<https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder>)): Title is 66 chars (recommend ≤65)
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.
- [ ] Changes address: [https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder](<https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder>).
- [ ] Verify fix on [https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder](<https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder>) or equivalent environment.

## Kodeanalyse (bevis, marketing @ seo-run)

Status: **fixable** (konfidens 72 %)

* `https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder` — Title is 66 chars (recommend ≤65)

## Kilde

Skann-funn: seo/warn — [https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder](<https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder>)

## Kjør som Claude-loop (i `/Volumes/Laravel/Loveable/booking-brilliance`, på en ny branch)

```
/loop Fiks SEO-problemet på https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder (marketing): Title is 66 chars (recommend ≤65). Verifiser med seo-crawler etter endring.
```

---

*Auto-generert av Digilist Improvements Agent (Linear specialist) fra marketing:crawl:title.long:[https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder](<https://digilist.no/blogg/kapasitetsstyring-idrettsanlegg-driftsleder>) + kodeanalyse (graf @ seo-run). Flytt til godkjenningstilstand for å klargjøre en implementasjons-branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-356/marketing-seo-warn-titlelong-bloggkapasitetsstyring-idrettsanlegg
