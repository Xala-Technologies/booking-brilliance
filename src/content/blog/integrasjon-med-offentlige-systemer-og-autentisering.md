---
slug: id-porten-booking-integrering-kommune
title: "ID-porten-integrasjon: slik slipper kommunen å bygge egen innlogging"
description: "IT-ledere i kommuner kan åpne bookingsystemet for innbyggere via ID-porten uten å bygge eller vedlikeholde egen autentisering. Her er hva det innebærer i praksis."
date: 2026-07-09
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 6
tag: "IT-leder"
cover: "/images/blog/digital_booking_importance_hero_no.webp"
keywords: ["ID-porten", "booking kommune", "BankID integrasjon", "offentlig sektor autentisering", "GDPR kommune", "Outlook kalender", "Digilist"]
---

Mange kommuner har i dag bookingløsninger der innbyggere enten logger inn med e-post og passord, eller ikke logger inn i det hele tatt. Begge alternativer er problematiske: hjemmelagde brukerbaser krever vedlikehold og er sårbare, mens åpne løsninger uten autentisering gir ingen garanti for at den som booker faktisk er den de sier de er.

ID-porten løser dette, men bare dersom bookingsystemet er koblet direkte til det.

## Hvorfor ID-porten ikke er valgfritt i offentlig sektor

Digitaliseringsrundskrivet og Digdirs føringer er tydelige: tjenester som behandler personopplysninger om innbyggere skal bruke nasjonale fellesløsninger for autentisering der det er mulig. ID-porten er den nasjonale løsningen.

For en IT-leder betyr dette i praksis at dersom kommunen tilbyr timebestilling til for eksempel helsestasjonen, barnevernet eller tekniske tjenester, og systemet kobler en booking til en persons navn og kontaktinformasjon, så håndterer dere personopplysninger. Da er ID-porten ikke en ambisjon, det er et krav.

I tillegg er det en reell sikkerhetsgevinst. En innbygger som logger inn med ID-porten er identifisert med samme sikkerhetsnivå som brukes ved skattemeldingen og helsenorge.no. Risikoen for at noen booker time i en annens navn, eller at en bookinghistorikk kobles til feil person, faller til nær null.

## Digilists direktekoblinger: ID-porten, BankID og Outlook

Digilist er koblet direkte mot ID-porten og BankID via Digdirs offisielle OIDC-rammeverk, ikke via et mellomledd eller en tredjeparts autentiseringstjeneste som kommunen selv må forvalte avtaler med.

Det betyr konkret:

- **Innbyggeren logger inn med ID-porten eller BankID** direkte fra bookingportalen
- **Ingen brukerdatabase i Digilist**, brukeridentiteten eies av Digdir, ikke av kommunen eller leverandøren
- **Outlook-kalender kobles direkte** via Microsoft Graph API, slik at ansattes kalendere er kilden til tilgjengelighet i sanntid

Det siste punktet er undervurdert. Mange bookingsystemer har en egen kalender internt i systemet som ansatte må holde oppdatert manuelt, parallelt med Outlook. Det fører til dobbeltbookinger og mye støy. Når Digilist leser direkte fra Outlook, er det ansattes egen kalender som styrer hva som er ledig.

Stavanger kommune erfarte dette da de evaluerte integrasjonsbehovet mot eksisterende IT-infrastruktur: kravet om at innbyggerrettede tjenester skulle bruke eksisterende Microsoft 365-miljø og nasjonale innloggingsløsninger, uten at det krevde egne mellomintegrasjoner, ble avgjørende for valg av løsning.

## Sikkerhet og GDPR ut av boksen

Som IT-leder vet du at det å ta i bruk en ny leverandør alltid utløser en rekke spørsmål: Hvor lagres data? Hva sier databehandleravtalen? Kan vi inngå SSA-L? Finnes det revisjonslogg?

Med Digilist er svarene korte:

**Datalokasjon:** All data lagres i Norge, på infrastruktur som oppfyller kravene i Schrems II og NSMs grunnprinsipper.

**Databehandleravtale:** Digilist leverer standard SSA-L (statens standardavtale for løpende tjenester) tilpasset offentlig sektor. Du trenger ikke forhandle frem en særavtale.

**Revisjonslogg:** Alle hendelser, hvem som logget inn, hvilken booking som ble opprettet, endret eller slettet, og av hvem, lagres i en uforanderlig logg. Dersom kommunens DPO eller Datatilsynet ber om innsyn, kan det leveres.

**Tilgangsstyring:** Tilgang til administrasjonspanelet styres med samme roller som kommunens øvrige Microsoft 365-miljø, via Azure AD. Ingen separate brukernavn og passord å administrere.

Dette er ikke ekstra moduler som må bestilles, det er hvordan systemet er bygget fra starten.

## Færre telefoner til rådhuset

Her er en effekt som ofte undervurderes i IT-lederes beregninger: autentisering via ID-porten reduserer behovet for manuell support.

Når innbyggere ikke husker passordet sitt til kommunens bookingportal, ringer de. Når de er usikre på om de er registrert eller ikke, ringer de. Når de vil endre en booking og ikke kommer inn, ringer de.

Med ID-porten er det ingen passord å glemme og ingen brukerkonto å registrere. Innbyggeren logger inn med BankID, på samme måte som de logger inn i nettbanken. Det er allerede kjent atferd for de aller fleste over 18 år i Norge.

Bærum kommune rapporterte at innføring av ID-porten som innlogging på selvbetjeningsløsninger reduserte antall supporthenvendelser knyttet til innlogging med over 40 prosent i løpet av det første halvåret. Effekten på bookingspesifikke tjenester er tilsvarende.

For kommunens IT-avdeling betyr det mindre tid på passordresett og brukerstøtte, og mer tid på oppgaver som faktisk krever fagkompetanse.

## Slik setter du det opp på én dag

Et vanlig inntrykk er at ID-porten-integrasjon krever måneder med prosjektarbeid. Det er ikke tilfelle med Digilist, forutsatt at kommunen allerede er registrert som tjenesteleverandør i Digdirs selvbetjeningsløsning (Samarbeidsportalen).

Prosessen ser slik ut:

### Steg 1: Registrer tjenesten i Samarbeidsportalen (1-2 timer)
Dersom kommunen ikke allerede har gjort dette, opprettes en klient i Digdirs Samarbeidsportal. Dette er kommunens eget ansvar og tar normalt 1-2 timer første gang. Digilist har dokumentasjon som beskriver nøyaktig hvilke scopes og redirect-URIer som skal registreres.

### Steg 2: Legg inn klient-ID og secret i Digilist (15 minutter)
Verdiene fra Samarbeidsportalen legges inn i Digilists administrasjonspanel. Det krever ingen koding og ingen serveroppsett.

### Steg 3: Koble Outlook-kalender via Microsoft 365-admin (30 minutter)
En global administrator i kommunens Microsoft 365-tenant godkjenner tilgangen via en standard OAuth-flyt. Etter det kan ressurskalendrene til ansatte kobles til bookingsystemet.

### Steg 4: Test og publiser (1-2 timer)
Digilists onboarding-team går gjennom en sjekkliste med deg: at innlogging fungerer, at bookinger vises korrekt i Outlook, at revisjonsloggen skriver hendelser og at databehandleravtalen er signert.

Totalestimatet for en kommune som allerede har Microsoft 365 og er registrert i Samarbeidsportalen: én arbeidsdag, fordelt på et par timer her og der.

## Hva dette betyr for IT-avdelingen fremover

En ID-porten-integrert bookingløsning er ikke bare et teknisk valg, det er et vedlikeholdsvalg. Kommunen slipper å eie en brukerdatabase, slipper å håndtere passordpolicyer for innbyggere og slipper å følge opp sikkerhetsoppdateringer i en hjemmelaget innloggingsmodul.

Vedlikeholdet av selve autentiseringen ligger hos Digdir. Det er Norges sterkeste autentiseringsinfrastruktur, driftet av staten, og kommunen får bruke den uten å betale for den selv.

For IT-ledere som allerede har mer enn nok å forvalte, er dette en konkret reduksjon i teknisk gjeld.

---

## Se det i praksis

Ønsker du å se hvordan ID-porten, BankID og Outlook-integrasjonen fungerer i Digilist, og få en vurdering av hva oppsettet vil kreve i din kommunes infrastruktur?

**Book en demo med IT-ledelse**, så går vi gjennom integrasjonsarkitekturen, SSA-L og hva som skal til for at kommunen er oppe og kjører innen én dag.
