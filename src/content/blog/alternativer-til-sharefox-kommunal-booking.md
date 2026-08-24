---
slug: alternativer-til-sharefox-kommunal-booking
title: "Alternativer til Sharefox for kommunal booking"
description: "Vurderer kommunen alternativer til Sharefox for booking av lokaler? Se hva Digilist er, hvem det passer for, og hva dere bør sjekke før dere velger."
date: 2026-07-27
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 8
tag: "Anskaffelse"
cover: "/images/blog/integrations_idporten_hero_no.webp"
keywords: ["alternativer til sharefox", "sharefox alternativ", "kommunal booking", "bookingsystem kommune", "sharefox.no", "Digilist"]
---

Kommuner som søker etter «alternativer til Sharefox for kommunal booking» er som regel enten inne i en anskaffelsesprosess eller ikke fornøyd med løsningen de har i dag. Denne artikkelen svarer direkte på spørsmålet, og går gjennom hva dere faktisk bør sjekke før dere velger leverandør.

## Kort svar: Digilist er et reelt alternativ til Sharefox for kommunal booking

Digilist er en norsk booking- og utleieplattform bygget for det norske utleiemarkedet, med sanntidskalender, ID-porten-innlogging, sesongleiefordeling og EHF-fakturering. I motsetning til mange etablerte bookingsystemer, som typisk er bygget for enten offentlig sektor eller private utleiere, dekker Digilist begge markeder på samme plattform: kommuner og annen offentlig sektor på den ene siden, og private utleiere av selskapslokaler, møterom og idrettsanlegg på den andre. Det gjør Digilist relevant både for en kommune som skal erstatte et eksisterende bookingsystem, og for en driftsleder i en privat hall eller et kulturhus som vurderer sin første digitale bookingløsning. Om Digilist er riktig for akkurat deres kommune avhenger av hvilke krav dere har til integrasjoner, saksbehandlerflyt og prismodell, som gjennomgås under.

---

## Hva er Digilist?

Digilist er en SaaS-plattform for booking og utleie av lokaler og ressurser, bygget spesifikt for det norske markedet. Plattformen dekker to distinkte kundegrupper:

- **Offentlig sektor (B2B):** kommuner og fylkeskommuner som skal la innbyggere, lag og foreninger søke om og booke idrettshaller, svømmehaller, møterom, kantiner og kulturhus, med saksbehandlerflyt, sesongleiefordeling og rapportering til administrasjonen.
- **Private utleiere (B2C):** selskapslokaler, møteromsutleie, treningssentre og andre private aktører som trenger sanntidskalender, betaling og kundehåndtering uten en kommunal saksbehandlerprosess.

Teknisk er Digilist bygget på PostgreSQL hostet av Convex, med data lagret i Norge og EU, og er ISO 27001- og ISO 27701-sertifisert. Grensesnittet for offentlig sektor er bygget på [Digdir Designsystemet](/blogg/digdir-designsystemet-kommunal-bookingplattform), Digitaliseringsdirektoratets felles komponentbibliotek for offentlige digitale tjenester.

## Kategorier å sjekke når dere vurderer alternativer til Sharefox

Uansett hvilken leverandør dere til slutt velger (Sharefox, Digilist eller en annen), bør evalueringen dekke de samme funksjonelle kategoriene. Dette er kategoriene som i praksis avgjør om et bookingsystem fungerer for en kommune over tid, ikke bare i piloten:

| Kategori | Hva dere bør spørre om | Hvordan Digilist løser det |
|---|---|---|
| **Innbyggerselvbetjening** | Kan innbyggere, lag og foreninger søke og booke selv, uten å ringe eller sende e-post til saksbehandler? | Egen selvbetjeningsportal for søknad, booking og status, tilgjengelig døgnet rundt |
| **Saksbehandlerflyt** | Får saksbehandler et arbeidsverktøy for godkjenning, avslag og fordeling, eller må alt gjøres manuelt utenfor systemet? | Regelstyrt fordelingsforslag for sesongleie, med mulighet for manuell justering og godkjenning |
| **Innlogging og identitet** | Støtter systemet ID-porten og BankID for sikker pålogging av innbyggere og lag? | Innebygd [ID-porten- og BankID-integrasjon](/blogg/leie-idrettshall-kommune-komplett-guide-lag) for offentlig sektor, enkel kontoopprettelse for private utleiere |
| **Fakturering** | Kan systemet sende fakturagrunnlag direkte til kommunens økonomisystem via EHF/Peppol, eller krever det manuell overføring? | Innebygd EHF/Peppol-fakturagrunnlag |
| **Sesongleie** | Har systemet en egen modul for sesongfordeling til lag og foreninger, med kapasitetsrapportering? | Egen sesongleie-modul med søknadsportal og automatisk kapasitetsrapportering |
| **Prismodell** | Skaleres prisen med antall lokaler og faktisk bruk, eller med antall ansatte som sjelden logger inn? | Flat, forutsigbar prismodell tilpasset kommunens faktiske størrelse, se [bookingsystem for småkommuner](/blogg/bookingsystem-smakommuner-kostnadseffektive-losninger) |
| **Universell utforming** | Er grensesnittet testet mot WCAG-kravene som gjelder for offentlige digitale tjenester? | Bygget på Digdir Designsystemet, WCAG 2.1 AA-testet i komponentnivå |
| **Migrering** | Kan leverandøren overta historiske bookinger, avtaler og foreningsregistre fra dagens system? | Støtter migrasjon fra eksisterende bookingsystemer i etableringsfasen |

Vi sammenligner ikke navngitte funksjoner hos Sharefox, BookUp, Aktiv Kommune, Checkfront eller Gibbs i denne tabellen, ettersom leverandørenes faktiske funksjonsomfang endrer seg over tid og bør verifiseres direkte mot leverandøren. Kategoriene over er derimot stabile: still de samme spørsmålene til alle leverandører dere vurderer, og be om en demo som viser hver kategori i praksis, ikke bare i en produktbrosjyre.

## Anskaffelse: hva som faktisk styrer valget

For kommuner er valg av bookingsystem underlagt anskaffelsesregelverket. To ting er verdt å sjekke tidlig i prosessen, uavhengig av hvilken leverandør dere til slutt velger:

- **Terskelverdier.** Om kontraktsverdien ligger under gjeldende nasjonale terskelverdier, kan kommunen normalt gå til direkte avtale i stedet for full anbudskonkurranse. Sjekk alltid gjeldende beløp hos [Digitaliseringsdirektoratet (Digdir)](https://www.digdir.no) og kommunens eget innkjøpsreglement før dere velger anskaffelsesform.
- **SSA-L-kontrakt.** Mange kommuner bruker Statens Standardavtale for løsninger (SSA-L) som kontraktsgrunnlag ved kjøp av SaaS-bookingsystem. Vi har gått gjennom kravbildet i detalj i [SSA-L 2026: full kravguide til kommunalt bookingsystem](/blogg/ssa-l-2026-bookingsystem-kommune).

## Digilist for kommuner og private utleiere

Det som skiller Digilist fra mange etablerte bookingsystemer, er at plattformen er bygget for begge sider av det norske utleiemarkedet fra samme kodebase: kommunal saksbehandling med ID-porten og sesongleiefordeling på den ene siden, og enkel selvbetjent booking for private utleiere på den andre. For en kommune som allerede har brukt tid på å vurdere Sharefox eller lignende, betyr det at evalueringskriteriene i tabellen over kan brukes direkte, uavhengig av om dere til slutt lander på Sharefox, Digilist eller en tredje leverandør.

Vurderer dere et bytte, eller er dere i en anskaffelsesprosess og vil se hvordan Digilist dekker kategoriene over i praksis? Book en demo, så går vi gjennom kommunens konkrete krav og lokaler.

[Se Digilists bookingsystem for kommuner →](/bookingsystem-kommune)

## Kilder

- [Digitaliseringsdirektoratet (Digdir)](https://www.digdir.no) – nasjonale terskelverdier og føringer for offentlige digitale tjenester
- [Digdir Designsystemet](https://designsystemet.no/no) – felles komponentbibliotek og WCAG-krav for offentlig sektor
- [SSA-L 2026: full kravguide til kommunalt bookingsystem](/blogg/ssa-l-2026-bookingsystem-kommune) – gjennomgang av kontraktskrav ved SaaS-anskaffelse
- [Digdir Designsystemet: hvorfor det er et must i offentlig sektor](/blogg/digdir-designsystemet-kommunal-bookingplattform) – bakgrunn om universell utforming og designkrav
- [Bookingsystem for småkommuner: kostnadseffektive løsninger](/blogg/bookingsystem-smakommuner-kostnadseffektive-losninger) – prismodell og driftskostnader for mindre kommuner
