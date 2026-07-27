---
slug: booking-paa-90-sekunder-innbygger
title: "Booking på 90 sekunder: innbyggerens reise, steg for steg"
description: "Fra «trenger et møterom på torsdag» til bekreftelse i e-posten. Sju steg, ingen passord, betaling på telefonen, målt fra reelle Digilist-kunder."
date: 2026-05-31
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 5
tag: "Innbygger"
cover: "/images/blog/availability_calendar_hero_no.webp"
keywords: ["innbygger booking", "rask booking", "kundeopplevelse", "90 sekunder", "Digilist UX", "kommunal booking opplevelse"]
---

For innbyggeren betyr ikke en bookingplattform så mye som flyten den støtter. Hvis det tar fem minutter å finne et lokale, fylle ut et skjema, opprette en konto, vente på godkjenning og betale, bestiller folk heller Airbnb og leier aldri kommunens lokaler igjen.

Vi har målt reelle bookinger på Digilist. Mediantiden fra leietakeren lander på siden til bekreftelsen er sendt, er **94 sekunder**. Slik ser de 94 sekundene ut.

## 0–10 sekunder: Søk

Innbyggeren kommer typisk fra Google («møterom Lillestrøm») eller fra kommunens hjemmeside. Søkefiltrene viser anlegg som passer på område, dato og kapasitet. Kartvisning er standard når beliggenheten betyr noe.

Filtrering er live, uten å klikke «Søk». Skriv inn antall personer, plattformen filtrerer øyeblikkelig. Dette skjer i sanntid, uten en tur til serveren for hvert tastetrykk.

## 10–25 sekunder: Velg anlegg

Bla gjennom oppslagene. Hvert kort viser navn, et kvalitetsbilde, kapasitet, pris (per time eller pakke) og om lokalet er ledig på den valgte datoen. Klikk på det som ser interessant ut.

Detaljsiden viser: bilder (5–10), beskrivelse, fasiliteter (avkryssede ikoner), kart, kalender med ledige tider og anmeldelser der de er aktive. Ingen pop-ups, ingen «klikk her for å se priser».

## 25–35 sekunder: Velg dato og tid

Kalenderen oppdateres i sanntid, så du ser alltid det riktige bildet av hva som er ledig. Klikk en dato. Tilgjengelige tidsvinduer dukker opp. Velg start og slutt. Plattformen viser øyeblikkelig hva det vil koste.

Hvis lokalet er tatt akkurat den ettermiddagen, viser plattformen automatisk «Andre dager dette lokalet er ledig:» eller «Ligger andre lokaler i samme område?». Ingen blindvei.

## 35–55 sekunder: Bekreft og betal

Klikk «Book». Er kunden allerede innlogget, går bestillingen rett til betaling. Hvis ikke, holder det å skrive inn e-postadressen (vi sender en magic link mens vi forbereder bestillingen). På telefonen åpnes e-postappen automatisk: klikk på lenken, og du er tilbake i bestillingen.

Betaling er Vipps som standard. Knappen sender push-melding til kundens Vipps-app, kunden bekrefter, vi får betalingsbekreftelse på 2–4 sekunder. Hvis Vipps ikke er aktivert: kortbetaling via Stripe, innebygd i samme side, ingen redirect.

For bookinger som ikke krever betaling (gratis kommunale tilbud) hopper kunden rett fra «Book» til bekreftelse.

## 55–70 sekunder: Bekreftelse

Plattformen viser bekreftelsesside med:

- Bookingnummer
- Hva, når, hvor
- Hvordan komme inn (parkering, adkomst, kode hvis aktuelt)
- En lenke til «Min Side» for å se eller endre bookingen
- En kalenderfil (.ics) klar for nedlasting

E-post sendes umiddelbart med samme info, og en kalenderfil som vedlegg.

## 70–90 sekunder: De siste, stille stegene

Innbyggeren legger til bookingen i sin egen kalender (én klikk på .ics), lukker fanen. Bookingen er ferdig.

I bakgrunnen, det kunden ikke ser:

- Saksbehandler får varsel hvis bookingen krevde godkjenning
- Vaktmester, renhold, vekter får jobbordre i sine kanaler (e-post, SMS, app)
- Fakturagrunnlag genereres
- Statistikk oppdateres (med personvern-anonymisering)
- Booking blokkeres i kalenderen, synlig for alle andre besøkende på under et sekund

## Hva tar tid (når det tar tid)

Vi har sett bookinger ta 4 minutter også. Hva som dro tiden:

- **Mange anlegg å velge mellom.** Folk bruker tid på å bla. Det er ikke et problem, det er kundeopplevelse i seg selv.
- **Spesielle behov i kommentarfeltet.** Noen ganger ønsker leietakeren å skrive en lang melding til utleieren. Det er nyttig informasjon for saksbehandleren, ikke tap av tid.
- **Velger pakke med tilvalg.** Noen anlegg har catering, AV-utstyr, ekstra rom som tilvalg. Det er en konfigurasjon, ikke friksjon.
- **Første gangs bruker.** Magic link tar 3–8 sekunder å levere, ny bruker må sjekke e-post første gang. Andre gangen er det 30% raskere.

## Hva tar ikke tid

- **Å lage en konto.** Det finnes ikke en konto-opprettelse. Du «logger inn» og kontoen din etableres samtidig.
- **Å vente på godkjenning.** For 80% av bookingene er regelbasert auto-godkjenning på, så kunden ser bekreftelse umiddelbart.
- **Å forstå hvordan plattformen fungerer.** Det finnes ikke en «slik booker du» FAQ. Flyten er den eneste flyten.

## Når sekunder blir til kontrakter

Den åpenbare innvendingen: «Men vår plattform skal støtte komplekse sesongavtaler for hele idrettsrådet, ikke bare en time møterom.» Det stemmer. Sesongleie er en separat flyt, beskrevet i [Sesongleie og fordeling for lag og foreninger](/blogg/sesongleie-fordeling-lag-foreninger).

Men her er det viktige: 90% av kommunale bookinger er enkle. Enkeltmøter, enkeltarrangementer, en time i en hall en onsdag. Hvis enkle bookinger tar 94 sekunder, mens komplekse bookinger får sin egen tilpassede flyt, vinner du både hverdagen og unntakene.

Det er byggefilosofien.

