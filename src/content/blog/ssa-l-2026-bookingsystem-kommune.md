---
slug: ssa-l-2026-bookingsystem-kommune
title: "Hva er SSA-L? Avtale om løpende tjenestekjøp"
seoTitle: "Hva er SSA-L? Avtale om løpende tjenestekjøp – Digilist"
description: "SSA-L er Avtale om løpende tjenestekjøp, oppdatert i 2026. Se kravene et kommunalt bookingsystem må møte, og hvordan kommunen sjekker samsvar."
date: 2026-05-14
updated: 2026-08-24
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 9
tag: "Anskaffelse"
cover: "/images/blog/ssal_2026_booking_hero.webp"
keywords: ["SSA-L", "Avtale om løpende tjenestekjøp", "kommunalt bookingsystem", "SSA-L 2026", "sikkerhetsbilag"]
h1InBody: true
---

IT-lederen åpner Anskaffelser.no. Så docs. Så denne siden.

SSA-L er Avtale om løpende tjenestekjøp. For et kommunalt bookingsystem er det malen.

# Hva er SSA-L? Avtale om løpende tjenestekjøp

SSA-L er Avtale om løpende tjenestekjøp, og det er malen for et kommunalt bookingsystem.

## Vanlige spørsmål om SSA-L

**Hva er SSA-L?**
SSA-L er Avtale om løpende tjenestekjøp, og det er malen for et kommunalt bookingsystem. DFØ oppdaterte malen i 2026. Den gjelder standardiserte tjenester levert over internett, typisk et SaaS-abonnement der leverandøren har driftsansvaret.

**Hva er Avtale om løpende tjenestekjøp?**
Det er det SSA-L heter. Se [SSA-L hos Anskaffelser.no](https://www.anskaffelser.no/verktoy/mal/ssa-l-avtale-om-lopende-tjenestekjop). For et kommunalt bookingsystem er det malen.

**Hvilken avtale gjelder for et kommunalt bookingsystem?**
SSA-L. Et bookingsystem som leveres og driftes som abonnement, hører hjemme under Avtale om løpende tjenestekjøp. Ikke SSA-D. Ikke SSA-K.

**Er SSA-L pliktig ved anskaffelse av bookingsystem?**
Nei. Den er ikke lovpålagt. Den er den anbefalte malen for kommunale SaaS-kjøp, og mange kommuner legger den i konkurransegrunnlaget.

**Hva er forskjellen på SSA-L, SSA-D og SSA-K?**
SSA-L er løpende tjenestekjøp. SSA-D er utvikling og tilpasning. SSA-K er en enklere kjøpsavtale for korte leveranser. Et kommunalt bookingsystem som abonnement er SSA-L.

**Hva er nytt i SSA-L 2026?**
Avtalen ble oppdatert i 2026 og er ment for standardiserte tjenester levert over internett, inkludert sky og ASP. Se [SSA-L hos Anskaffelser.no](https://www.anskaffelser.no/verktoy/mal/ssa-l-avtale-om-lopende-tjenestekjop).

## Hva er SSA-L?

SSA-L er Avtale om løpende tjenestekjøp ([Anskaffelser.no](https://www.anskaffelser.no/verktoy/mal/ssa-l-avtale-om-lopende-tjenestekjop) / DFØ).

Oppdatert i 2026. Gjelder standardiserte tjenester levert over internett, inkludert sky og ASP.

For et kommunalt bookingsystem er dette malen, ikke SSA-D og ikke SSA-K. Det skillet står under.

Kommunen må fortsatt sjekke bilag. «Vi støtter SSA» er ikke nok.

## Sanntidstilgjengelighet: fundament, ikke funksjon

Sanntid er det første kravet enhver kommunal innbygger merker. Når en innbygger søker etter ledig treningstid i en idrettshall, må kalenderen vise det som er ledig _nå_, ikke en versjon fra siste nattlige synkronisering. Tre underkrav følger:

1. **Reaktive oppdateringer.** Når en booking bekreftes eller avlyses, oppdateres kalenderen umiddelbart for alle andre brukere. Ingen polling, ingen refresh-knapper.
2. **Konfliktdeteksjon.** Plattformen må forhindre dobbeltbookinger på samme tidsrom, også når to brukere booker samtidig.
3. **Reservasjon under booking.** Tid skal låses mens brukeren fyller ut betalingsskjema (typisk 5–10 minutter) for å unngå at vinduet forsvinner mens kortet legges inn.

For Digilist løses dette med Convex' reaktive runtime: spørringer abonnerer på underliggende data og publiserer endringer på millisekunder.

## Sesongleie med regelstyrt fordeling

Idrettslag, kulturskoler og foreninger leier kommunale lokaler i sesonger, typisk høst (sept–des) og vår (jan–juni). Manuell tildeling er tidkrevende og opplever ofte klager om favorisering.

SSA-L 2026 krever derfor:

- Egen søknadsportal for lag og foreninger (BRREG-verifisert)
- Regelstyrt fordelingsforslag basert på kommunens prioriteringsregler
- Saksbehandlerverktøy for justering før godkjenning
- Rapportering på kapasitetsutnyttelse, tilskudd og fordeling

Digilists sesongleie-modul implementerer alle disse kravene, og lar saksbehandleren overprøve forslaget der lokale forhold krever det.

## ID-porten + BankID: Norge-tilpasset autentisering

Innbyggere skal logge inn via ID-porten med BankID, MinID eller andre godkjente metoder. Organisasjoner skal verifiseres mot Brønnøysundregisteret (BRREG). Dette er ikke valgfritt, men en del av SSA-Ls krav om sikker autentisering og datakvalitet.

For utenlandske SaaS-leverandører er dette en betydelig integrasjonskostnad. For Digilist, bygget på norsk grunn, er det første integrasjon vi etablerte.

## EHF-fakturering og regnskapsintegrasjon

Faktura til kommunale enheter må sendes via EHF (Elektronisk Handelsformat) over Peppol-nettverket. Digilist genererer EHF-faktura automatisk ved bookingfullføring og kan integreres direkte mot kommunens regnskapssystem: Visma eAccounting, Tripletex, Fiken, PowerOffice eller DNB Regnskap.

## Universell utforming, ISO og GDPR

- **WCAG 2.0 AA** er minimumskravet. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy.
- **ISO 27001 og 27701** er forventet sertifisering. Digilist er sertifisert.
- **GDPR** krever databehandleravtale, dataregister og rett til sletting. Digilist har dette på plass og lagrer all data i Norge og EU.

## Migrasjon: det glemte kravet

Mange kommuner har eksisterende bookingsystemer (RCO, Aktimo, Idrettens Bookingsystem osv.) med historiske bookinger og sesongleieavtaler. SSA-L 2026 krever at den nye leverandøren støtter migrasjon, ikke bare frisk start.

Digilist tilbyr import fra RCO booking og andre systemer i etableringsfasen, med valideringsregler for foreningsregister og bookinghistorikk.

## SSA-L, SSA-D og SSA-K: hvilken avtale gjelder for et bookingsystem

Statens standardavtaler er ikke én avtale, men en familie, og det er lett å be om feil mal i konkurransegrunnlaget. **SSA-L** gjelder løpende tjenestekjøp, typisk et SaaS-abonnement der leverandøren har driftsansvaret – det er malen som passer et bookingsystem. **SSA-D** brukes når kommunen bestiller utvikling eller vesentlig tilpasning av en løsning, og **SSA-K** er en enklere kjøpsavtale for avgrensede, korte leveranser uten løpende drift. Be leverandøren bekrefte at de leverer på SSA-L spesifikt, ikke bare «Statens standardavtaler» generelt – feil avtaletype gir feil ansvarsfordeling den dagen noe går galt.

## Slik verifiserer kommunen SSA-L-samsvar hos leverandøren

Et utfylt bilag er ikke det samme som verifisert samsvar. Fire trinn skiller en reell verifikasjon fra en brosjyrepåstand:

1. **Krev et konkret utfylt sikkerhetsbilag** (bilag 7), ikke en generisk henvisning til «bransjestandard». Hvert punkt skal ha status og bevis, ikke bare et kryss.
2. **Be om gyldig ISO 27001-sertifikat** med sertifiseringsdato og revisjonsselskap, ikke bare et diplom uten dato.
3. **Be om siste pen-test-rapport**, gjerne med sammendrag av funn og lukkingsfrist for eventuelle avvik.
4. **Se selvdeklarasjonen mot en uavhengig kilde**: mange leverandører publiserer et offentlig samsvars- eller transparensdashbord som oppdateres løpende – sammenlign tallene der mot det som står i tilbudet.

Digilists eget [transparensdashbord](/transparens) viser sikkerhets- og kvalitetsstatus løpende, slik at en kommune kan verifisere kravene før signering, ikke bare stole på ordene i tilbudet.

## Hva kommunen bør gjøre nå

1. **Kartlegg eksisterende anlegg og brukergrupper:** antall, type, kapasitet, sesongmønster
2. **Definer prioriteringsregler for sesongleie:** alder, lokal tilknytning, foreningstype
3. **Be om demo med fokus på SSA-L-kravene:** ikke generelle salgspresentasjoner
4. **Test sanntid live:** be leverandøren vise hvordan en booking forplanter seg gjennom systemet i sanntid

For en kompakt sjekkliste mot SSA-L 2026-kravene, se vår [landingsside for kommuner](/bookingsystem-kommune).
