---
slug: saksbehandler-godkjenne-avvise-kommunisere
title: "Saksbehandler: godkjenne, avvise og kommunisere på minutter"
description: "Innboks for forespørsler, regelbasert auto-godkjenning, samtaletråd per booking og fullt revisjonsspor. Slik fungerer saksbehandlingsflyten i praksis."
date: 2026-05-27
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 6
tag: "Saksbehandler"
cover: "/images/blog/booking_calendar_hero_no.webp"
keywords: ["saksbehandler", "godkjenning", "avvise booking", "kommunikasjon", "innboks", "kommunal booking"]
---

For en saksbehandler er hverdagen ofte ikke selve bookingene, men e-postene rundt dem. «Er hallen ledig torsdag?» «Vi trenger to ekstra timer.» «Kan vi flytte til mandag?» Hver tråd starter et nytt sted. Det finnes ingen samlet logg. Og halvparten av forespørslene burde aldri ha krevd manuell behandling.

Digilist starter fra motsatt ende: alt som kan automatiseres, gjør plattformen. Det som krever vurdering, lander i én innboks med konteksten allerede vedlagt.

## Innboksen: én oversikt, prioriterte forespørsler

Saksbehandleren har én side: «Forespørsler». Den viser:

- Bookinger som venter på godkjenning (sortert eldst først, eller etter risiko)
- Endringsforespørsler på allerede godkjente bookinger
- Avlysninger fra leietaker (krever refusjonsvurdering)
- Sesongleie-søknader (separat fane med større kontekst)

Hver rad viser kunden, lokalet, datoen, type forespørsel og hvor lenge den har ventet. Klikk åpner detaljvinduet med full kontekst: kundens historie, betalingsstatus, eventuell samtaletråd og kalenderinnsikt («tre andre bookinger samme dag»).

## Tre handlinger: godkjenn, avvis, spør

**Godkjenn.** Ett klikk. Plattformen sender bekreftelse til leietaker, blokkerer tiden i kalenderen, varsler driftsroller (vaktmester, renhold, vekter) og oppretter fakturagrunnlag hvis betaling kreves. Du kan legge til en kort melding til kunden hvis du vil. Ellers brukes standardbekreftelsen.

**Avvis.** Velg en grunn fra listen (kollisjon, manglende dokumentasjon, utenfor åpningstid, annen årsak). Skriv inn forklaring. Plattformen sender en høflig avslags-e-post med din begrunnelse og, ikke minst, en lenke til alternative ledige tider hvis kunden vil prøve igjen.

**Spør.** Trenger du mer informasjon? Send en melding direkte til kunden via bookingens samtaletråd. Kunden får varsel på e-post og SMS, svarer fra sin Min side, og hele samtalen ligger lagret på forespørselen. Ingen e-postkjede å holde styr på.

## Regelbasert auto-godkjenning

Mye av godkjenningsarbeidet er repetitivt. Et bryllup i et selskapslokale, fra en familie som har booket før, med fullført betaling, på en ledig dato, det burde aldri lande i en innboks.

I Digilist setter du opp regler per utleieobjekt:

- **Privatperson + betaling fullført + ingen kollisjon** → auto-godkjenn
- **Organisasjon med BRREG-verifikasjon + medlemstall over X** → auto-godkjenn
- **Sportslag som har sesongleieavtale** → auto-godkjenn for tider innenfor avtalen
- **Alt annet** → manuell godkjenning

Vi har sett kommuner gå fra 90 % manuell behandling til 20 % etter to ukers regeltilpasning. De resterende 20 % er de som faktisk trenger vurdering.

## Kommunikasjon: samtaletråd per booking

Hver booking har sin egen samtaletråd som inkluderer:

- Innledende forespørsel og dine spørsmål
- Statusendringer (godkjent, avvist, endret)
- Endringer på pris eller dato
- Meldinger frem og tilbake mellom deg og kunden

Kunden ser den samme tråden i sin Min side. Det er ingen «innboks» i klassisk forstand. Kommunikasjonen lever der bookingen er. Når bookingen avsluttes, arkiveres tråden sammen med den.

## Sesongleie: egen fane, større beslutninger

Sesongleie er en annen disiplin enn vanlig booking. Du behandler ikke én forespørsel, du fordeler tider mellom mange søkere etter regler kommunen har bestemt. Digilist har en egen sesongleie-modul med:

- Søknadsfristhåndtering
- BRREG-verifisering av lag og foreninger
- Regelbasert fordeling (prioritet, alder, type aktivitet)
- Konfliktvarsling når to lag søker samme tid
- Endelig publisering av fordeling, eksport til kalender

Detaljene er for store til denne artikkelen. [Sesongleie og fordeling for lag og foreninger](/blogg/sesongleie-fordeling-lag-foreninger) går grundigere inn på det.

## Revisjon: alt loggføres

Hver handling (godkjenning, avvisning, melding, endring) loggføres med tidsstempel, saksbehandler og endring. Loggføringen er uredigerbar og dekker SSA-L-kravene om sporbarhet. Hvis kommunen blir spurt om hvordan en booking ble behandlet et halvt år senere, er svaret tilgjengelig på fem sekunder.

## Hva det betyr i praksis

For Nordre Follo kommune, som behandler ca. 1 200 bookinger i måneden på tvers av 12 anlegg, har overgangen til Digilist redusert manuell saksbehandling med 60 % og responstid på forespørsler fra dager til timer. Det er ikke fordi vi har gjort bookinger mindre kompliserte. Det er fordi vi har plassert kompliserten der den faktisk er.

