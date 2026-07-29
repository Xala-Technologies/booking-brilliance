---
slug: idrettshall-booking-anskaffelse-it-leder-kravspesifikasjon
title: "Idrettshall-booking: kravene IT-leder må stille i anbudet"
description: "Se hvilke krav til sanntid, integrasjon, SSA-L og ID-porten IT-leder bør stille før idrettshall-booking med ledige tider legges ut på anbud, med konkret kravspesifikasjon og sjekkliste."
date: 2026-07-29
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "IT-leder"
cover: "/images/blog/ssal_2026_booking_hero.webp"
keywords: ["idrettshall booking system", "bookingsystem idrettshall kommune", "sesongtildeling idrettshall integrasjon", "SSA-L bookingsystem idrettshall", "dobbeltbooking idrettshall", "anbud idrettshall booking IT-leder"]
---

Idrettshall er lokaltypen flest kommuner sliter mest med å digitalisere godt, fordi samme flate skal håndtere sesongtildeling til lag, enkelttimer for innbyggere og drop-in for skoleklasser i én og samme kalender. Kravspesifikasjonen ser ofte fin ut på papiret, og leverandøren viser gjerne frem en pen oversikt over ledige tider i demoen. Problemet dukker opp første gang to lag møter opp til samme banehalvdel klokken 18, eller når en innbygger booker en enkelttime som skolen egentlig har krav på. Denne artikkelen går gjennom hva IT-leder faktisk bør kreve før et idrettshall-bookingsystem sendes ut på anbud, og hvor i konkurransegrunnlaget kravene typisk mangler i dag.

## Hvorfor idrettshall er den vanskeligste lokaltypen å digitalisere

Et møterom har én kalender og én bruker om gangen. En idrettshall kan derimot deles i tre flater, hel hall, to halve haller eller tre tredjedeler, ha forskjellig åpningstid for skole og fritid, og samtidig følge en sesongtildeling som ble vedtatt måneder i forveien. En stor kommune som Bergen, landets nest største, drifter idrettshaller spredt over mange bydeler, der samme hall typisk brukes av skole på dagtid, faste lag på ettermiddag og kveld, og enkelttimer eller arrangement i helgene. Et system bygget for enkeltrom takler ikke denne kombinasjonen uten at driftsleder må rydde manuelt i konflikter hver mandag. Ledige tider som vises i kalenderen må derfor være ledige tider på riktig flate, ikke bare i hallen som helhet.

## Kravspesifikasjon: sanntid, dobbeltbooking og kapasitet per flate

Kravspesifikasjonen må beskrive konkret hvordan systemet håndterer delt flate, ikke bare skrive «sanntidsoversikt» og anta at leverandøren tolker det likt. Still krav til:

- At booking av halve hallen automatisk sperrer den andre halvdelen når hele hallen er reservert, og omvendt
- At kalenderen oppdateres i sanntid, med en spesifisert maksimal forsinkelse mellom booking og synlig status
- At dobbeltbooking mellom skole, lag og privatpersoner er teknisk umulig å gjennomføre i systemet, ikke noe som «sjekkes manuelt» av driftsleder
- At kapasitet defineres per flate og per tidsrom, ikke bare per rom
- At systemet logger hvem som har booket en gitt flate til enhver tid, slik at en konflikt kan spores og løses raskt

### Vag formulering mot presis formulering

En vag formulering som «systemet skal støtte sanntidsbooking» lar leverandøren definere selv hva sanntid betyr. En presis formulering sier i stedet at systemet skal sperre konkurrerende flater automatisk innen få sekunder, og at dette skal kunne testes og dokumenteres før kontraktsignering. Uten dette presisjonsnivået i kravspesifikasjonen ender du med et system som ser ferdig ut i demo, men som krever manuell kontroll i drift.

## Integrasjon mot fagsystem: skoleskjema, sesongtildeling og medlemsregister

Idrettshall-booking lever ikke isolert. Skoleskjema styrer dagtid, sesongtildelingsmodulen styrer fast ukentlig tid for lag, og medlemsregisteret hos idrettslagene avgjør hvem som har rett til å booke på lagets vegne. Krav til integrasjon bør spesifisere grensesnitt, altså API eller filoverføring, oppdateringsfrekvens og hvem som eier data ved avvik. Lillestrøm kommune, som ble til gjennom sammenslåingen av Skedsmo, Fet og Sørum i 2020, forvalter idrettsanlegg på tvers av tidligere kommunegrenser og flere idrettsråd. Uten integrasjon mot medlemsregisteret må saksbehandler verifisere lagstilhørighet manuelt for hver søknad, noe som øker saksbehandlingstiden og gir rom for feil ved sesongtildeling.

## SSA-L, GDPR og datalokasjon

Statens standardavtale for løpende tjenestekjøp (SSA-L) er normalen for bookingsystemer i offentlig sektor. Uavhengig av hvilken versjon som legges til grunn, bør IT-leder kreve at leverandøren dokumenterer hvor persondata lagres, at det foreligger en databehandleravtale i tråd med GDPR, og at leverandøren kan vise til ISO 27001-sertifisering eller tilsvarende sikkerhetsstyring. Dette må stå i kontrakten og databehandleravtalen, ikke bare nevnes i en salgspresentasjon. Sjekk også hvor eventuelle underleverandører befinner seg i kjeden, siden ansvaret for datalokasjon ikke forsvinner selv om driften er satt bort.

## ID-porten og BankID: pålogging for saksbehandler, driftsleder og lag

Tre brukergrupper skal inn i samme system med ulike rettigheter: saksbehandler som godkjenner søknader, driftsleder som styrer tildeling, og lagledere eller innbyggere som booker enkelttimer. Krav til innlogging bør spesifisere ID-porten for innbyggere og lagledere, og rollestyrt tilgang internt for kommunalt ansatte, slik at samme plattform ikke krever tre separate påloggingsløsninger. Spør konkret hvordan systemet håndterer en lagleder som representerer flere lag, og om fullmakten til å booke på vegne av andre er tidsbegrenset eller må bekreftes på nytt hver sesong.

## Rapportering og belegg: dokumentasjon overfor politikere

Når budsjettet for idrettsanlegg skal forsvares i kommunestyret, må driftsleder kunne dokumentere faktisk belegg, ikke bare vedtatt tildeling. Krav til rapportering bør omfatte eksport av bruksdata per hall, per flate og per brukergruppe, samt mulighet til å sammenligne vedtatt tid mot faktisk oppmøte. Se for deg en hall med 95 prosent vedtatt belegg, men bare 60 prosent faktisk bruk: det er nettopp denne typen avvik som er politisk relevant, og som systemet må kunne produsere uten manuell telling.

## Migrering fra regneark eller eldre system

De fleste anbud kommer fra en kommune som i dag styrer sesongtildeling i regneark og enkelttimer i et eldre system uten API. Krav til migrering bør spesifisere at faste tider, historikk og aktive avtaler overføres uten tap, og at leverandøren tar ansvar for datavask før oppstart, ikke bare tilbyr en importmal. Be om en konkret migreringsplan med tidslinje, ansvarsfordeling og en test der et utvalg av eksisterende avtaler verifiseres i det nye systemet før hele hallen legges om.

## Krav til varsling og API for lag, foreninger og innbyggere

Enkelttimebooking uten varsling gir tomme haller, fordi ingen minner laget om at tiden må bekreftes eller avbestilles i tide. Still krav til automatiske påminnelser før booket tid, mulighet til selv å avbestille uten å ringe noen, og et åpent API slik at lagenes egne systemer eller kommunens nettside kan hente oppdatert kalenderstatus. Spesifiser også hvor raskt en avbestilling frigjør tiden for andre, slik at ledige tider som oppstår i siste liten faktisk blir synlige og bookbare.

## Sjekkliste før du sender ut anbud på idrettshall-booking

Før kravspesifikasjonen sendes, sjekk at den dekker: sanntid og dobbeltbookingsperre per flate, integrasjon mot skoleskjema og medlemsregister, SSA-L-vilkår og dokumentert datalokasjon, ID-porten for eksterne brukere, rapportering på faktisk belegg mot vedtatt tildeling, migreringsplan uten tap av historikk, og varsling med åpent API. Be i tillegg om referanser fra minst to andre kommuner som har flyttet en tilsvarende idrettshall-portefølje, og be om å få teste dobbeltbookingsperren selv før kontrakt signeres. Mangler ett av disse punktene i konkurransegrunnlaget, blir det en tilleggsforhandling etter kontraktsignering, ikke en del av anbudet.

## Kom i gang

Digilist er bygget for nettopp denne kombinasjonen: sesongtildeling, enkelttimer og drop-in i samme sanntidskalender, med ID-porten-innlogging, SSA-L-avtale og rapportering på faktisk belegg som standard. Book en demo for å se hvordan kravspesifikasjonen din kan testes mot en løsning som allerede driftes av flere norske kommuner, og få kalenderen med ledige tider verifisert på egen hallstruktur før du legger noe ut på anbud.