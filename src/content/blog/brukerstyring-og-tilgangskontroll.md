---
slug: brukerstyring-og-tilgangskontroll
title: "Brukerstyring og tilgangskontroll for lag, privat og bedrift"
description: "Lag, privatpersoner og bedrifter har ulike behov for tilgang og bookingretter. Se hvordan brukerstyring og rollebasert tilgangskontroll fungerer i Digilist."
date: 2026-07-25
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "IT-leder"
cover: "/images/blog/onboarding_hero.svg"
keywords: ["brukerstyring", "tilgangskontroll", "brukerstyring og tilgangskontroll", "rollebasert tilgang", "brukertyper booking", "administrere brukere bookingsystem", "tilgangsstyring kommune"]
---

Et kommunalt bookingsystem har sjelden bare én type bruker. En saksbehandler skal godkjenne forespørsler. Et idrettslag skal la flere medlemmer booke på lagets vegne. En bedrift skal fakturere internt og trenger noen som har fullmakt til å bekrefte. En privatperson vil bare booke ett lokale, én gang, uten å opprette en organisasjon. Uten en tydelig modell for brukerstyring ender systemet enten med at alle får samme tilgang – som er en sikkerhetsrisiko – eller at hver bruker må ringe kommunen for å få gjort noe utenfor sin egen enkle booking.

## Hvorfor brukerstyring og tilgangskontroll er et eget behov

Brukerstyring handler om to ting som henger sammen, men som ofte forveksles:

- **Hvem er brukeren** – en privatperson, et lag/en organisasjon, eller en bedrift – og hvilken kontoform gir det tilgang til.
- **Hva brukeren har lov til** – om vedkommende bare kan booke for seg selv, administrere andres tilgang, godkjenne forespørsler, eller se fakturagrunnlag.

Uten dette skillet ender systemer med enten for mye tilgang (alle kan endre alt) eller for lite fleksibilitet (kun én person i hele laget kan booke, og alt stopper opp når hun har ferie). Digilist er bygget rundt at ulike brukertyper har reelt forskjellige behov for tilgang og bookingretter, ikke bare forskjellig grensesnitt.

## De tre brukertypene og hva som skiller dem

### Privatpersoner

En privatperson booker som regel ett lokale til én anledning – en bursdag, en aktivitet, en enkelttime. Tilgangen er enkel med hensikt:

- Egen innlogging, egne bookinger, ingen administrasjon av andre.
- Kan se og endre sine egne reservasjoner, men har ingen tilgang til andre brukeres data eller til å delegere tilgang videre.
- Bekrefter booking med vanlig innlogging, eller med ID-porten/BankID der kommunen krever det for identitetsbekreftede tjenester.

### Lag og foreninger

Et lag eller en forening er en organisasjon med flere personer som trenger å booke på vegne av samme enhet, men uten at de deler passord:

- **Lagkoordinator eller styremedlem** registrerer laget som enhet og administrerer hvem som har tilgang.
- **Medlemmer** kan få egen, avgrenset tilgang til å booke innenfor lagets rammer – for eksempel treningstider – uten å kunne endre lagets øvrige avtaler eller legge til nye medlemmer selv.
- Tilgangen kan trekkes tilbake når et medlem slutter, uten at hele laget må bytte felles innlogging.

Dette er beskrevet mer i dybden i [registrering av lag og organisasjoner](/blogg/registrere-lag-organisasjon-booke-kommunale-lokaler) og i [rollebasert medlemstilgang for frivillige organisasjoner](/blogg/frivillig-organisasjon-bookingsystem-medlemstilgang).

### Bedrifter

En bedrift booker sjeldnere enn et lag, men med andre krav til hvem som har fullmakt:

- **Bedriftskontoen** kan ha én eller flere personer med rett til å bekrefte bookinger som skal faktureres til virksomheten.
- Tilgangen skiller normalt mellom hvem som kan **søke og be om** et lokale, og hvem som har fullmakt til å **bekrefte** en booking som medfører kostnad – relevant når en bedrift skal godkjenne internt før et julebord eller kundearrangement bekreftes.
- Fakturagrunnlag og bookinghistorikk er knyttet til bedriften som enhet, ikke til én enkelt ansatt sin private konto.

## Hvordan roller styrer hva som er mulig

Utover selve brukertypen har enkelte roller i systemet videre rettigheter enn en vanlig booker:

- **Saksbehandler** hos kommunen ser innkommende forespørsler på tvers av brukertyper, kan godkjenne eller avvise, og har tilgang til kommunikasjonstråden per booking – men ikke til andre kommuners data.
- **Driftsleder** har oversikt over belegg og kapasitet for lokalene vedkommende drifter, uavhengig av hvem som booker dem.
- **Administrator/IT-leder** setter opp hvilke roller som finnes, og hvilke rettigheter hver rolle har, uten å måtte kode noe selv.

Rollene er ikke knyttet til brukertypen alene – en person kan være både saksbehandler i jobben og privatperson når hun booker et lokale til egen bursdag, med tydelig atskilte tilganger for de to sammenhengene.

## Hvorfor dette må være tydelig fra start

Et system uten tydelig tilgangskontroll skaper to typiske problemer i praksis: enten deles én felles innlogging på tvers av et helt lag eller en hel avdeling – noe som gjør det umulig å vite hvem som faktisk booket noe, og hva som skjer med tilgangen når personen slutter – eller så blir tilgangsstyringen så streng at alt må gå via én person, som blir en flaskehals hver gang hun er utilgjengelig.

Digilist løser dette ved å knytte tilgang til brukertype og rolle fra registreringstidspunktet: en privatperson trenger ingen administrasjon, et lag får en koordinator som styrer medlemstilgang, og en bedrift får kontroll over hvem som har fullmakt til å bekrefte bookinger som koster penger. Endringer i tilgang – nytt medlem, ny ansatt med fullmakt, noen som slutter – gjøres av den som allerede administrerer enheten, uten at kommunen må involveres i hver enkelt endring.

## Kom i gang

Enten du representerer en kommune som skal sette opp roller for saksbehandlere og driftsledere, et lag som trenger å gi flere medlemmer tilgang til å booke, eller en bedrift som må styre hvem som har fullmakt til å bekrefte en reservasjon – brukerstyringen i Digilist er bygget for at hver brukertype får nøyaktig den tilgangen den trenger, verken mer eller mindre. [Prøv Digilist](https://digilist.no) og sett opp brukere og roller for din organisasjon.
