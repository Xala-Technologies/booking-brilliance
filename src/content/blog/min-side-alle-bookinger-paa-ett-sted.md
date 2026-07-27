---
slug: min-side-alle-bookinger-paa-ett-sted
title: "Min side: alle bookinger, samtaler og kvitteringer på ett sted"
description: "Kommende bookinger, fullførte, samtaletråder med utleier, kvitteringer og kalenderintegrasjon. Alt samlet et sted innbyggeren faktisk kan finne tilbake til."
date: 2026-06-02
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 5
tag: "Innbygger"
cover: "/images/blog/minside_hero.svg"
keywords: ["Min side", "innbygger dashboard", "bookings historikk", "kvittering", "kalenderintegrasjon", "selvbetjening", "Digilist UX"]
---

Det vanligste support-spørsmålet hos kommunens servicetorg er ikke «hvordan booker jeg?», det er «hvor finner jeg igjen bookingen min?». Den ble bekreftet på e-post for tre uker siden. E-posten er borte. Bekreftelseslinken er glemt. Personen vil bare endre tidspunktet en time.

Min side i Digilist løser den problemstillingen ved å eksistere på samme adresse hver gang, å være tilgjengelig uten passord og å samle absolutt alt en innbygger har gjort i plattformen på samme sted.

## Hvordan innbyggeren finner Min side

Tre veier:

1. **`booking.kommune.no/minside`**, direkte URL, fungerer alltid
2. **Knappen «Min side»** i toppmenyen, synlig når innlogget
3. **«Se mine bookinger»** i hver bekreftelses- og påminnelses-e-post

Hvis innbyggeren ikke er innlogget, trigges magic link automatisk. Skriv e-post, klikk lenke i e-post, du er på Min side. Ingen passord-glemt-flyt.

## Hva Min side viser

Tre faner:

### Kommende bookinger

Liste over alt som ligger framover i tid. For hver:

- Lokale (navn, bilde, adresse, kart-lenke)
- Dato og tid
- Bookingnummer
- Status (bekreftet, venter på godkjenning, foreslått endring)
- Aksjoner: vis detaljer, send melding, endre, kanseller

«Endre» åpner et skjema som lar kunden foreslå ny tid. Hvis utleier har auto-godkjenning av endringer på, gjennomføres den umiddelbart. Hvis ikke, sendes endringsforespørsel til saksbehandler.

### Fullførte

Bookinghistorikk: alt som er ferdig. For hver kan kunden:

- Laste ned kvittering (PDF)
- Be om kopi av faktura hvis det var en organisasjonsbooking
- Lese tilbake samtaletråden
- Skrive en anmeldelse hvis kommunen har det aktivert

Historikken går så langt tilbake som GDPR-policyen tillater: typisk 36 måneder for vanlige bookinger, lengre for organisasjonsbookinger som er knyttet til kontrakter.

### Søknader og avtaler

For sesongleie og lengrevarige avtaler. Lag og foreninger ser her:

- Status på sesongleie-søknaden (innsendt, under behandling, godkjent, avvist)
- Tildelte tider når fordelingen er publisert
- Avtaler de er knyttet til (digitalt signert via BankID)
- Endringslogger på avtalene

## Samtaletråder: én pr. booking

Hver booking har sin egen samtaletråd (se [Forespørsel og chat](/blogg/foresporsel-chat-kommunikasjon)). Fra Min side ser kunden alle samtaler de har hatt, ordnet etter siste aktivitet. Klikk en samtale, så er du i tråden, klar til å svare.

Ulest melding fra saksbehandler? Min side har et lite tall-merke i navigasjonen, og kunden får e-post + push-varsel hvis den har installert plattformen som PWA på telefonen.

## Kalenderintegrasjon

Hver booking har en «Legg til i kalender»-knapp som genererer en .ics-fil. Klikker kunden den på telefonen, åpnes telefonens kalenderapp med bookingen prefylt. På desktop laster .ics-filen ned og kan importeres til Google Calendar, Outlook, Apple Calendar.

Vi vurderer abonnement-feed (kunden abonnerer på alle sine bookinger som en levende kalender), men det er foreløpig ikke prioritert: folk klager ikke på .ics-modellen.

## Kvitteringer og fakturaer

For bookinger med betaling lagres:

- **Kvittering** (PDF, alltid tilgjengelig): viser hva som ble betalt, når og hvordan
- **Faktura** (PDF, hvis organisasjonsbooking): EHF-formatet for digital arkivering hvis kunden trenger det
- **Refusjonsbekreftelse** (hvis aktuelt): viser når og hvordan beløp ble tilbakeført

Innbyggerregnskap er ofte etterspurt rundt skatteoppgjør (treningsavgift for barn osv.). Å ha en oversikt på ett sted gjør den jobben dramatisk enklere.

## Personvern på Min side

Det innbyggeren ser om seg selv:

- Sine egne bookinger og samtaler
- Sin profil med navn, e-post og telefon (kan endres)
- Sin betalingshistorikk
- Sine preferanser (varsler, kalenderintegrasjon)

Det innbyggeren ikke ser:

- Andre kunders data
- Saksbehandlerens interne notater
- Plattformens audit-logger

«Last ned mine data» og «slett kontoen min» finnes som knapper. GDPR-retten håndteres direkte i grensesnittet, ikke via en e-post til support.

## Tilgjengelighet

Min side er WCAG 2.1 AA-kompatibel:

- Tastaturnavigerbar
- Skjermleservennlig (Aria-roller, semantisk HTML)
- 4.5:1-kontrast minimum
- Skalerer til 200 % uten tap av funksjonalitet
- Responsive helt ned til 320 px bredde

Hvorfor det betyr noe: en del av kundebasen for kommunale bookinger er eldre eller har funksjonsnedsettelser. Tilgjengelighets-arbeid er ikke en juridisk avkrysningsoppgave. Det er hvordan man gjør tjenesten reell for alle.

## Det enkle prinsippet bak

Min side er bygd på antakelsen om at innbyggeren ikke skal måtte huske hvordan plattformen fungerer. Hver gang de kommer tilbake, skal det være den samme adressen, samme layout, alle tidligere bookinger der de forventer dem. Det bygger den ene egenskapen som gjør at folk kommer tilbake: forutsigbarhet.
