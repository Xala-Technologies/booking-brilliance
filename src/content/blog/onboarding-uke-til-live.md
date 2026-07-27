---
slug: onboarding-uke-til-live
title: "Onboarding for nye kunder: fra signering til live på en uke"
description: "Fem dager, fem milepæler. Ingen konsulent, ingen prosjektrigging: bare en sekvens som er bygget for at en kommune eller utleier skal komme live uten å miste fart."
date: 2026-05-30
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 6
tag: "Onboarding"
cover: "/images/blog/onboarding_hero.svg"
keywords: ["onboarding", "implementering", "go-live", "Digilist onboarding", "kommunal SaaS", "raskt i drift"]
---

«Hvor lang tid tar det å komme live?» er det første spørsmålet en kommune stiller. Det andre er: «Hvor mye av oss krever det?»

Begge svar er kortere enn dere tror. Hovedgrunnen er at Digilist har bygget onboarding som et produkt, ikke som et konsulentprosjekt. Den følger en bestemt sekvens, har klare milepæler og krever ingen tekniske ressurser hos dere.

Slik ser en typisk uke ut.

## Dag 1: Signering og kick-off (1 time)

Avtalen er signert, kommunen har en kontoansvarlig hos oss, og dere har valgt:

- Hvilke anlegg som skal med i første lansering (vi anbefaler maks 5–10 til å starte)
- Hvilken juridisk enhet som er kunde (kommuneetat, foretak, kommuneselskap)
- Hvilke roller som trenger admin-tilgang (typisk 2–4 personer)

Kick-off-møtet er 30 minutter. Vi går gjennom planen for uken, dere får tilganger, vi avtaler check-in-møter dag 3 og dag 5. Det er det.

## Dag 2: Konfigurasjon (2 timer dere · 3 timer oss)

Plattformen er provisjonert. Dere logger inn for første gang og:

- Last opp logo, sett farger om dere har en visuell profil
- Sett organisasjonsdetaljer (org.nr, adresse, kontakt)
- Velg betalingsleverandører (Vipps, Stripe, EHF/Peppol). Vi setter opp koblingene
- Inviter saksbehandlere og admins med deres e-postadresser

Vi tar oss av alt det tekniske: domeneoppsett (`booking.kommune.no`), e-postdomene-verifisering, integrasjonskontoer.

## Dag 3: Innhold (4 timer dere · 1 time oss)

Dette er den eneste dagen som krever en seriøs arbeidsinnsats fra deres side. Hvert anlegg får opprettet en oppføring med veiviseren (se [Slik legger du til et nytt utleieobjekt](/blogg/utleieobjekt-veiviser-steg-for-steg)). For 8–10 anlegg tar det ca. 30 minutter per anlegg første gang, eller mindre hvis dere har en mal å kopiere fra.

Hvis dere har data i et eksisterende system (RCO Booking, Excel-ark, en gammel webside) tilbyr vi importer:

- **RCO-migrasjon.** Vi har en standard import som tar bygg, åpningstider, priser og pågående sesongavtaler ut av RCO.
- **Excel-import.** Last opp en .xlsx med kolonnestrukturen vi sender: anlegg, kapasitet, fasiliteter, åpningstider.
- **Manuell oppretting.** Veiviseren, anlegg for anlegg.

Møtet dag 3 er 30 minutter for å avklare spørsmål som dukker opp underveis.

## Dag 4: Test (3 timer dere · 2 timer oss)

Nå går plattformen i en stille modus: domenet svarer, alt fungerer, men den er ikke annonsert offentlig. Vi gjør sammen:

- **Test-bookinger.** Saksbehandler oppretter en booking som privatperson (med Magic link). Plattformen sender bekreftelse. Kalender oppdateres. Fakturagrunnlag genereres.
- **Driftsroller.** Vaktmester får e-post + SMS-varsel. Stemmer detaljene?
- **Betalingsflyt.** En test-booking med Vipps-betaling. 1 krone, vi refunderer etterpå.
- **Sesongleie.** Hvis dere skal bruke den, en test-søknad fra et fiktivt lag.
- **Mobil.** Alt på iPhone og Android.

Eventuelle bugs eller justeringer fikses samme dag. Vi har en hotfix-rutine for go-live-uker som leverer endringer innen 4 timer.

## Dag 5: Go-live (1 time dere)

Knappen «Aktiver offentlig» trykkes. Plattformen er live på `booking.kommune.no` (eller deres valgte domene). Vi kjører sammen gjennom:

- Sjekkliste for at alle anlegg er publisert
- Bekreftelse på at SEO-data er i orden (sitemap submitted)
- Test av siste e-post-flyt
- Avtale om første ukes oppfølging

Resten av dagen sender dere selv en kort kommunikasjon til relevante interessenter: innbyggere via nettside/sosiale medier, lag og foreninger via e-post, kommuneansatte via internt nyhetsbrev. Vi har maler.

## Uke 2: Stabilisering, ikke implementasjon

Uke 2 er ikke en del av onboarding. Den er en del av drift. Men det er typisk når:

- Første reelle booking fra innbygger kommer inn (oftest dag 1 av uke 2)
- Saksbehandler oppdager noen flyter de vil justere (vi ringer kundeansvarlig)
- Dere starter å se Plausible-statistikk på hva som faktisk skjer
- Reglene for auto-godkjenning kalibreres basert på reelle data

Vi har en check-in dag 10. Etter det er vi i normal support-modus.

## Hva som ikke står på listen

**Tilpasset utvikling.** Vi gjør ikke kundespesifikk koding under onboarding. Plattformen har konfigureringsvalg som dekker 95% av kommuner; resten holdes til etter at dere er live.

**Migrasjon av historiske bookinger.** Vi importerer framtidige sesongleier og pågående avtaler, men ikke hver eneste historisk booking fra 2019. Erfaringen er at det skaper mer støy enn verdi.

**Custom integrasjoner.** Hvis dere trenger en kobling vi ikke har, vurderes det etter go-live. Standard-integrasjonene (Vipps, BankID, ID-porten, Visma, Tripletex, Fiken, EHF) er på plass dag én.

## Hva en uke faktisk gir

Etter onboarding har dere:

- En live, offentlig bookingplattform
- 5–10 anlegg som tar imot bookinger
- Saksbehandlere som er trent på flyten
- Betalingsstrøm fra Vipps og kort til kommunekonto
- Fakturagrunnlag til regnskap (EHF eller direkte integrasjon)
- En tjeneste innbyggere kan bruke på telefonen, uten passord

For en ordinær kommune med 12 anlegg er det 30+ timer å investere fra deres side over fem dager. Sammenlignet med et tradisjonelt SaaS-implementasjonsprosjekt på 3–6 måneder er det forskjellen mellom å bygge en bro og å gå over en eksisterende.

