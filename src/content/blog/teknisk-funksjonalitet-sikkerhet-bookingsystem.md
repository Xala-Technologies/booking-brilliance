---
slug: teknisk-funksjonalitet-sikkerhet-bookingsystem
title: "Teknisk funksjonalitet og sikkerhet i bookingsystem: hva kommune-IT bør sjekke"
description: "Sikker offentlig innlogging, revisjonsspor og avansert administrasjon: den tekniske sjekklisten kommune-IT bør legge til grunn før et bookingsystem anskaffes."
date: 2026-08-09
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "IT-leder"
cover: "/images/blog/gdpr_iso27001_hero_no.webp"
keywords: ["teknisk funksjonalitet bookingsystem", "sikkerhet bookingsystem kommune", "ID-porten BankID", "revisjonsspor", "rollebasert tilgang", "ISO 27001 sertifisering", "SSA-L 2026", "kommune IT-leder anskaffelse"]
---

De fleste demoer av et bookingsystem handler om kalendervisning, betaling og hvor pent grensesnittet ser ut. Det er den delen en saksbehandler eller en innbygger merker. Det en kommune-IT-leder faktisk må stå til ansvar for, er en annen del: hvordan logger brukerne trygt inn, hvem har gjort hva med hvilken data, og hvem kan endre hva i systemet uten å måtte ringe leverandøren. Det er den tekniske og sikkerhetsmessige funksjonaliteten, og den avgjør ofte om et system i det hele tatt kan godkjennes for offentlig bruk, uavhengig av hvor bra kalenderen ser ut.

Denne artikkelen går gjennom de tre områdene som oftest avgjør en teknisk vurdering: sikker offentlig innlogging, revisjonsspor og avansert administrasjon, og hvordan de henger sammen med at en leverandør faktisk kan sertifiseres, ikke bare påstå at den er sikker.

## Hva "teknisk" betyr i en anskaffelse

Når en kravspesifikasjon skiller mellom funksjonelle og tekniske krav, er det sjelden tilfeldig. Funksjonelle krav svarer på om systemet løser oppgaven. Tekniske krav svarer på om det kan driftes, revideres og forsvares i etterkant, av IT-avdelingen selv, av Datatilsynet ved en klage, eller av kommunerevisjonen ved en stikkprøve. Et system som scorer høyt på det første og lavt på det andre, ender ofte som et avvik i neste internrevisjon.

De tre kravene som går igjen i så godt som enhver kommunal kravspesifikasjon er: sterk autentisering av brukere, sporbarhet på endringer, og styring av hvem som har tilgang til hva. Under følger hva hvert av dem faktisk innebærer i praksis.

## Sikker offentlig innlogging

Et bookingsystem som håndterer navn, kontaktinformasjon og betalingshistorikk kan ikke basere seg på et eget passordregime. Offentlig sektor har allerede løst dette gjennom ID-porten, og BankID er innbyggernes vante inngang.

I Digilist logger innbyggere inn med BankID gjennom ID-porten, og kommunens egne saksbehandlere og driftsledere bruker samme inngang med rollestyrt tilgang etterpå. Det fjerner passord som angrepsvektor helt, og gir en signert, verifisert identitet på hver handling som krever det, for eksempel når en leiekontrakt skal ha rettskraft. Den fulle mekanikken bak dette, inkludert eID-nivåer og hva som skjer når en bruker ikke har BankID, er beskrevet i [ID-porten og BankID: pålitelig innlogging i kommunale tjenester](/blogg/idporten-bankid-kommunal-innlogging), med phishing-motstand utdypet i [phishingresistente innlogginger med ID-porten og BankID](/blogg/phishing-resistente-innlogginger-idporten-bankid). Den tekniske integrasjonsflyten mot ID-porten og kommunens Microsoft 365-miljø, inkludert Outlook-kalendersync, er dokumentert i [ID-porten og BankID: slik sikrer Digilist bookingen din](/blogg/id-porten-bankid-integrasjon-kommune-booking).

## Revisjonsspor: sporbarhet på hver endring

En kommune må kunne svare på "hvem gjorde denne endringen, og når" for enhver booking, godkjenning eller avvisning, ikke fordi det er hyggelig å ha, men fordi det er en forutsetning for saksbehandling som skal tåle en klage eller en tvist om en avbestilling.

I praksis betyr det at hver mutasjon, ikke bare hver innlogging, skrives til en egen, uforanderlig logg med tidsstempel og bruker, atskilt fra selve dataen den beskriver, slik at verken kommunens administratorer eller Digilist-support kan slette enkeltoppføringer i ettertid. Hvordan det ser ut i en reell arbeidsflyt, fra søknad til vedtak med fullt revisjonsspor, er vist i [idrettshall ledige tider: saksbehandlerens vei fra søknad til vedtak](/blogg/idrettshall-tildeling-saksbehandler-godkjenning-revisjonsspor).

## Avansert administrasjon uten å måtte kode

Et bookingsystem med bare én brukerrolle blir fort enten for åpent (alle kan endre alt) eller en flaskehals (kun én person kan gjøre noe utenfor egen booking). Avansert administrasjon betyr at kommunen selv kan sette opp roller, saksbehandler, driftsleder, lagkoordinator, bedriftsfullmakt, og justere rettighetene deres, uten at det krever ny kode eller en supportsak til leverandøren hver gang organisasjonen endrer seg.

Dette er beskrevet i detalj, med de faktiske brukertypene og rollene Digilist skiller mellom, i [brukerstyring og tilgangskontroll for lag, privat og bedrift](/blogg/brukerstyring-og-tilgangskontroll).

## Hvorfor dette er kjernen i sertifisering, ikke et tillegg til den

ISO 27001 (informasjonssikkerhet) og ISO 27701 (personverninformasjon) er ikke sertifikater man får for å love å være forsiktig. De krever dokumenterte kontroller for nøyaktig disse tre områdene: hvem får tilgang, hvordan tilgang autentiseres, og hvordan endringer spores og kan revideres i ettertid. Det samme gjelder kravene i [SSA-L](/blogg/ssa-l-2026-bookingsystem-kommune), Statens standardavtale for løpende tjenestekjøp, som norske kommuner i økende grad legger til grunn ved anskaffelse av bookingsystem som SaaS.

Det er derfor sikker innlogging, revisjonsspor og rollestyrt administrasjon ikke er tre separate "nice to have"-funksjoner. De er de tre tekniske søylene et sertifiseringsregime faktisk måler, og en leverandør som mangler én av dem kan ikke dokumentere resten på en troverdig måte, uansett hvor bra kalenderfunksjonen er. Det er også her et bookingsystem bygget for kommunal drift skiller seg tydeligst fra en generisk løsning laget for et helt annet marked.

## Sjekkliste: teknisk due diligence før signering

Konkrete spørsmål å stille en leverandør før kontrakt, uavhengig av hvor godt demoen så ut:

- Hvilken innloggingsmekanisme brukes for innbyggere, og hvilken for kommuneansatte? Er den ID-porten-basert, eller et eget passordregime?
- Er hver dataendrende handling, ikke bare innlogging, skrevet til en atskilt, ikke-slettbar logg med bruker og tidsstempel?
- Kan kommunen selv opprette og justere roller og tilganger, eller krever hver endring en supporthenvendelse?
- Er leverandøren ISO 27001- og ISO 27701-sertifisert, eller "i prosess"? Be om revisjonsrapporten, ikke bare merket.
- Er systemet klargjort for SSA-L 2026, eller må kommunens jurister forhandle avvik fra standardavtalen?
- Kan tilgangsrettigheter for én kommune eller én organisasjon bevises isolert fra andre kunders data, ikke bare påstås?

Et unnvikende svar på noen av disse er mer avslørende enn et perfekt demo-oppsett.

## Kom i gang

Sikker offentlig innlogging, fullt revisjonsspor og rollestyrt administrasjon er ikke tre prosjekter å legge til senere, de må være der fra første anskaffelse for at et bookingsystem i det hele tatt skal kunne sertifiseres for kommunal drift. [Book en demo](#kontakt) og se den tekniske funksjonaliteten i praksis, eller les mer om hvordan Digilist er [ISO 27001- og ISO 27701-sertifisert](/sikkerhet) fra dag én.
