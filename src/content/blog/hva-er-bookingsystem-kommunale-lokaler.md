---
slug: hva-er-bookingsystem-kommunale-lokaler
title: "Hva er et bookingsystem for kommunale lokaler"
description: "Hva er et bookingsystem for kommunale lokaler: innbyggeren ser ledig tid og pris, saksbehandleren godkjenner med logg. Hall, møterom og kulturhus. Demo og pristilbud etter anlegg."
date: 2026-07-19
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 8
tag: "IT-leder"
cover: "/images/blog/sanntidskalender_hero_no.webp"
keywords: ["bookingsystem kommunale lokaler", "bookingsystem kommune", "kommunale lokaler", "digital booking", "hall og møterom"]
---

IT-leder, innkjøp og kulturkontoret stiller det samme spørsmålet: hva er det egentlig, og hva må leverandøren tåle.

Et bookingsystem for kommunale lokaler er der innbygger, lag og saksbehandler ser ledig tid og pris og booker hall, møterom eller kulturhus, uten å ringe kommunen. Saksbehandleren godkjenner med logg.

## Hva er et bookingsystem for kommunale lokaler

1. Et bookingsystem for kommunale lokaler er en digital kalender der innbyggere, lag og foreninger søker om og booker kommunale rom og anlegg.
2. Saksbehandleren ser søknaden, godkjenner eller ber om mer, og alt ligger i loggen.
3. På Digilist ligger private og kommunale lokaler i samme kalender, med pris og ledig tid synlig før noen ringer.

## Hvilke lokaltyper kan bookes digitalt

Nesten alle kommunale rom med en kalender kan legges inn. De vanligste kategoriene er:

- **Idrettshaller og gymsaler:** sesongtildeling til idrettslag, ofte med faste treningstider gjennom hele skoleåret.
- **Møterom og grupperom:** internt for ansatte, eksternt for foreninger og næringsliv.
- **Kulturhus og scener:** med teknisk utstyr, billettkapasitet og krav om vakthold.
- **Selskapslokaler og grendehus:** utleie til private arrangementer, ofte med depositum og renholdsgebyr.
- **Svømmehaller, klasserom og uteanlegg:** kunstgress, friluftsscener og bålplasser.

Forskjellen mellom lokaltypene ligger i reglene, ikke i teknologien. En gymsal trenger sesongtildeling og prioritering mellom lag, mens et selskapslokale trenger depositum og aldersgrense på leietaker. Et godt system håndterer begge uten separate installasjoner, gjennom regeloppsett per lokaltype.

## Hva koster et bookingsystem for en kommune

Prisen avhenger av antall lokaler, integrasjoner og om betaling og adgangskontroll skal inngå. De vanlige modellene er:

- **Årlig lisens (SaaS):** en fast eller trappetrinnsbasert abonnementspris, gjerne knyttet til innbyggertall eller antall anlegg som skal håndteres i løsningen.
- **Transaksjonsbasert:** et påslag per betalt booking, aktuelt der utleie til private står for mye av volumet.
- **Etablering og oppsett:** en engangskostnad for konfigurasjon, migrering av eksisterende bookinger og opplæring.

Den interne tiden som går til prosjektledelse, integrasjon mot ID-porten og fakturasystem, og opprydding i lokaldata før oppstart, bestemmer ofte år-ett-kostnaden mer enn lisensen i seg selv.

Anskaffelser over terskelverdi må ut på anbud etter anskaffelsesregelverket. For et rent SaaS-bookingsystem er terskelen for åpen konkurranse fort nådd over en fireårig avtaleperiode, så regn med Doffin-utlysning, kravspesifikasjon og evaluering på både pris og kvalitet.

## Hva krever GDPR og norsk datalokasjon av leverandøren

Et bookingsystem behandler personopplysninger: navn, kontaktinfo, i noen tilfeller fødselsnummer via innlogging, og hvem som leier hva. Da gjelder personvernforordningen fullt ut, og kommunen er behandlingsansvarlig.

Konkrete krav en IT-leder må stille:

- **Databehandleravtale (DPA)** som beskriver formål, kategorier av data og sikkerhetstiltak.
- **Datalokasjon i EU/EØS.** Data bør lagres i Norge eller innenfor EØS. Overføring til land utenfor EØS krever eget rettslig grunnlag, og etter Schrems II-dommen er det en reell risiko å bygge på amerikanske skytjenester uten tilleggsgarantier.
- **Sikker innlogging via ID-porten og BankID,** slik at identiteten til den som booker er bekreftet og fødselsnummer ikke tastes inn manuelt.
- **Sletterutiner og innsyn,** slik at en innbygger kan be om innsyn og sletting uten at kommunen må lete i logger.

Digilist lagrer data innenfor EØS og bruker ID-porten for innlogging, nettopp for å slippe usikkerheten rundt tredjelandsoverføring. For en kommune er dette forskjellen på en anskaffelse som tåler et tilsyn fra Datatilsynet, og en som ikke gjør det.

## Hva er forskjellen på et bookingsystem og et saksbehandlersystem

Et bookingsystem håndterer selve reservasjonen: ledig kapasitet, kalender, betaling og bekreftelse. Et saksbehandlersystem håndterer vedtaket: vurdering, begrunnelse, klageadgang og arkivering.

I praksis flyter de over i hverandre. Når et idrettslag søker om fast treningstid i en hall det er kamp om, er det ikke en enkel reservasjon, det er en tildelingssak med prioritering, vedtak og mulighet for klage. Da trenger du saksbehandlerfunksjonalitet oppå bookingen:

| Funksjon | Ren booking | Saksbehandling |
|---|---|---|
| Ledig kapasitet i kalender | Ja | Ja |
| Umiddelbar bekreftelse | Ja | Nei, krever vurdering |
| Prioritering mellom søkere | Nei | Ja |
| Vedtak og begrunnelse | Nei | Ja |
| Arkivverdig dokumentasjon | Nei | Ja |

Et rent internasjonalt bookingverktøy stopper på venstre kolonne. Kommunale lokaler trenger begge, fordi tildeling av knapp kapasitet er myndighetsutøvelse som skal kunne etterprøves.

## Hva bør stå i en kravspesifikasjon (SSA-L) for lokalutleie

For skytjenester og løpende tjenestekjøp brukes ofte SSA-L, Statens standardavtale for løpende tjenestekjøp. Kravspesifikasjonen er vedlegget som avgjør om systemet faktisk passer kommunen. Ta med minst dette:

- **Funksjonelle krav:** sesongtildeling, prioriteringsregler, betaling, depositum, avlysning og venteliste.
- **Integrasjoner:** ID-porten og BankID for innlogging, fakturasystem og gjerne adgangskontroll for nøkkelfri tilgang til haller.
- **Personvern og sikkerhet:** databehandleravtale, datalokasjon i EØS, logging og sletterutiner.
- **Universell utforming:** samsvar med WCAG og forskrift om universell utforming av IKT, siden løsningen retter seg mot alle innbyggere.
- **Tilgjengelighet og drift:** oppetidskrav, responstid på support og rutine for feilretting.
- **Exit og dataeierskap:** at kommunen eier sine data og kan få dem utlevert i et åpent format ved avtaleslutt.

Skriv kravene målbart. «Systemet skal støtte innlogging» er ubrukelig i en evaluering. «Systemet skal støtte innlogging via ID-porten på sikkerhetsnivå 3 og høyere» kan faktisk vurderes ja eller nei.

## Hva betyr digital booking i praksis for lag og foreninger

For frivilligheten er dette den delen som merkes mest. I dag bruker mange klubber timer på å ringe rundt for å finne ut om gymsalen er ledig neste tirsdag. Med digital booking ser en lagleder ledig kapasitet i kalenderen, sender forespørsel med BankID, og får svar sporbart i stedet for via en e-post som forsvinner.

Konkret betyr det:

- **Selvbetjening døgnet rundt,** ikke bare i kommunens åpningstid.
- **Én innlogging** med BankID, uten egne brukernavn og passord per system.
- **Oversikt over egne bookinger,** avlysninger og faktura på ett sted.
- **Rettferdig tildeling,** fordi reglene er like for alle og synlige.

For små foreninger uten egen administrasjon er lavere terskel avgjørende. Jo enklere det er å booke, jo mer blir anleggene faktisk brukt, og jo mindre tid går til telefonrunder både for klubben og for kommunens ansatte.

## Hva er typisk implementeringstid og målbar gevinst

En avgrenset innføring, for eksempel idrettshaller og noen møterom i én kommune, tar gjerne 4 til 12 uker fra kontrakt til første reelle booking. Mesteparten av tiden går ikke til teknikk, men til å rydde i lokaldata, sette prisregler og enes internt om tildelingsreglene. En full utrulling til alle lokaltyper med adgangskontroll og fakturaintegrasjon tar lengre tid.

Gevinstene som lar seg måle etter innføring:

- **Redusert administrasjonstid:** færre telefoner og e-poster, gjerne en reduksjon på flere timer i uken per saksbehandler.
- **Høyere utnyttelse:** ledig kapasitet blir synlig, og haller som før sto tomme fylles opp.
- **Bedre sporbarhet:** alle vedtak og betalinger er dokumentert, noe som forenkler både revisjon og klagebehandling.
- **Færre dobbeltbookinger:** én sannhet i kalenderen fjerner konflikten mellom to lag som trodde de hadde samme tid.

Sett målepunktene før oppstart. Mål antall henvendelser på telefon, timer brukt på tildeling og utnyttelsesgrad per anlegg i et par referansemåneder, så har du et faktisk sammenligningsgrunnlag når systemet har vært i drift et halvår.

## Vanlige spørsmål om bookingsystem for kommunale lokaler

### Hva er et bookingsystem for kommunale lokaler?

En digital kalender der innbyggere, lag og foreninger booker kommunale rom og anlegg. Saksbehandleren godkjenner i samme løsning, med kontroll og logg.

### Hvilke lokaler kan bookes?

Hall, møterom, kulturhus, idrettsanlegg og andre rom kommunen leier ut. På Digilist ser du typen, kapasitet og ledig tid før du booker.

### Er dette det samme som et saksbehandlingssystem?

Nei. Bookingsystemet tar søknad, kalender og utleie. Saksbehandling av vedtak ligger i fagsystemet. De kan kobles, de er ikke det samme.

### Må innbyggeren ringe kommunen?

Nei. Ledig tid og pris vises før booking. Saksbehandleren har fortsatt kontroll og kan be om mer dokumentasjon.

## Neste steg: se løsningen på egne lokaler

Den beste måten å vurdere et bookingsystem på er å se det mot kommunens egne lokaltyper og regler, ikke en generisk demo. Book en demo med Digilist, så viser vi hvordan sesongtildeling, ID-porten-innlogging og datalokasjon i EØS fungerer for akkurat din kommune, og hva en innføring realistisk krever av tid og integrasjoner.