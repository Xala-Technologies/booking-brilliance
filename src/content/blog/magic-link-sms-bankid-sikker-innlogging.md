---
slug: magic-link-sms-bankid-sikker-innlogging
title: "Magic link, SMS og BankID: tre sikre innloggingsmåter"
description: "Magic link på e-post, engangskode på SMS, eller BankID via ID-porten. Tre sikre innloggingsmåter, én plattform. Kommunen bestemmer hvilken som kreves."
date: 2026-05-29
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 6
tag: "Sikkerhet"
cover: "/images/blog/integrations_idporten_hero_no.webp"
keywords: ["magic link", "passordløs innlogging", "SMS innlogging", "BankID", "ID-porten", "passwordless authentication", "kommunal innlogging"]
---

Passord var en feilbeslutning av Internett. For en bookingplattform for kommunale lokaler er det også en barriere: innbyggeren skal bestille en bryllupslokale, ikke administrere et SaaS-system. Hver glemt passord-tilbakestilling er en kunde som forsvant.

Digilist støtter tre passordløse innloggingsmetoder, og kommunen bestemmer hvilke som kreves for hvilke flyter.

## I. Magic link på e-post

Skriv inn e-postadressen din. Vi sender en lenke. Klikk på lenken. Du er innlogget i 30 dager (kan justeres per kommune).

**Når brukes det.** Standard for privatpersoner som booker selskapslokaler, møterom eller idrettshaller hvor det ikke kreves identitetsverifikasjon. 80 % av bookingene faller i denne kategorien.

**Hvor sikkert er det.** Sikkert nok for low-risk bookinger. Lenken er kryptografisk signert, gyldig i 15 minutter, og kan kun brukes én gang. Den havner i samme innboks som kunden allerede bruker, som er kontoen de uansett ville mistet hvis noen hadde tilgang.

**Tekniske detaljer.** JWT-signert token med kort levetid. Sendes via Resend (ikke SMTP-direkte). E-postene leveres med en gjennomsnittlig latens på 3–8 sekunder. Forsvinner lenken i spam? Klikk «Send på nytt».

## II. SMS-engangskode

Skriv inn mobilnummer. Du får en 6-sifret kode på SMS. Skriv inn koden, du er innlogget.

**Når brukes det.** For brukere uten norsk e-postadresse, eller hvor kommunen ønsker en sterkere bekreftelse på telefonnummer enn på e-post. Også standard på mobil-først arrangementer der det er enklere å taste en kode enn å bytte til e-postappen.

**Hvor sikkert er det.** Sterkere enn passord, svakere enn BankID. SMS er ikke kryptert mellom operatører, så det er ikke egnet for høy-risk operasjoner. Men for «logg inn for å se min booking»: fullt tilstrekkelig.

**Tekniske detaljer.** Koden er 6 sifre, gyldig i 5 minutter, maks 3 forsøk før blokkering i 30 minutter. Telefonnummer valideres mot E.164-format og verifiseres mot kjente VOIP-tjenester (vi tillater ikke engangsnumre fra burner-tjenester).

## III. BankID via ID-porten

Klikk «Logg inn med ID-porten». Du sendes til ID-porten, autentiserer med BankID, og blir sendt tilbake til Digilist autentisert.

**Når brukes det.** Krevd for sesongleie-søknader (lag og foreninger må kunne identifisere personlig signatar), for kontrakter som krever digital signatur, og som standard for organisasjonskontoer. Kommunen kan kreve det også for vanlige bookinger hvis ønskelig.

**Hvor sikkert er det.** Sterkeste sivile autentiseringsmetode i Norge. Vi bruker det også som identifikator når kunden senere skal signere kontrakt: én autentisering, hele løpet ID-verifisert.

**Tekniske detaljer.** OIDC-flyt via Signicat (eller direkte ID-porten for større kommuner). Vi mottar `sub` (pseudonymisert ID), navn, fødselsdato og e-post. Ingen fødselsnummer lagres i Digilist. Sesjonsvarighet 8 timer, krever ny autentisering etter det.

## Hva velger en kommune?

Vi anbefaler en lagdelt strategi:

| Operasjon | Krav |
|---|---|
| Bla i tilgjengelige lokaler | Ingen innlogging |
| Send forespørsel | Magic link (e-post) |
| Book et standard lokale | Magic link eller SMS |
| Book et anlegg med tilgangskontroll (nøkkel) | SMS eller BankID |
| Søke om sesongleie | BankID |
| Signere kontrakt | BankID |
| Administrere organisasjonskonto | BankID |

Dette balanserer brukervennlighet mot tillit. En innbygger som booker barnebursdagsfest skal ikke trenge BankID. En lagleder som forplikter organisasjonen til sesongleie burde.

## Onboarding-friksjon: målt på tvers

Vi har data fra kommuner som har brukt Digilist over 18 måneder. Med passordløs innlogging:

- **Konvertering fra forespørsel til fullført booking:** 73 % (industrisnitt for kommunale tjenester med passord: 41 %)
- **Drop-off på innloggingssteget:** 4 % (industrisnitt: 22 %)
- **Andel innbyggere som booker mer enn én gang:** 58 % (industrisnitt: 19 %)

Tallene forteller én ting tydelig: når innlogging slutter å være en hindring, blir gjenkjøpsandelen høyere. Ikke fordi tjenesten er bedre, men fordi den ikke kaster ut folk.

## Hva med eldre brukere?

Frykten er reell: «Hva med folk som ikke bruker e-post på telefonen?» Svaret i praksis: de som har problemer med passord, har større problemer med passord enn med magic link. Magic link på desktop fungerer slik:

1. Skriv inn e-post på din PC
2. Åpne e-post-programmet ditt på samme PC
3. Klikk lenken, så er du innlogget i samme nettleser-fane

Det krever ikke at brukeren forstår OAuth, OTP, eller noe annet. Det krever bare at de kan åpne sin egen e-post. Som de uansett allerede gjør.

For de få som virkelig sliter, har kommunen alltid telefonsupport som backup. Disse er en liten gruppe, men plattformen er designet for at de ikke skal stenges ute.

## Sikkerhet bak kulissene

Alle innloggingshendelser logges. Mistenkelig aktivitet (mange forsøk fra ulike IP-adresser, store geografiske hopp innen kort tid) trigger automatisk kontolåsing og e-postvarsel til brukeren. Vi har ikke selv noensinne hatt et innbrudd i en plattformkonto: passordløs design fjerner hele angrepsoverflaten der passord blir lekt fra andre tjenester og prøvd hos oss.

