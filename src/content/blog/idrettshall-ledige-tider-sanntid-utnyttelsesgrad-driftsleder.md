---
slug: idrettshall-ledige-tider-sanntid-utnyttelsesgrad-driftsleder
title: "Idrettshall ledige tider i sanntid: slik fyller driftsleder dødtiden"
description: "Digilist viser ledige tider i idrettshallen i sanntid, med lastetid under 2,5 sekunder, slik at driftsleder kan fylle dødtiden og løfte utnyttelsesgraden."
date: 2026-08-09
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Driftsleder"
cover: "/images/blog/sanntidskalender_hero_no.webp"
keywords: ["idrettshall ledige tider", "idrettshall booking", "idrettshall sanntid", "utnyttelsesgrad idrettshall", "bookingsystem idrettshall ytelse", "idrettshall booking flere haller", "restplasser idrettshall"]
---

Ledige tider i idrettshallen forsvinner ikke fordi ingen vil booke dem. De forsvinner fordi kalenderen er treg, oppdateres for sjelden eller viser feil tall når noen faktisk sjekker. For driftsleder er dette ikke et pyntedetalj, det er kroner tapt hver eneste uke, og et tall som er vanskelig å forsvare når kommune, idrettsråd eller eier spør hvorfor hallen ikke er bedre utnyttet.

## Hvorfor ledige tider i idrettshallen sjelden blir fylt

Tre ting går igjen når haller står tomme selv om de er bookbare. Kalenderen oppdateres manuelt, gjerne av en driftsleder som også har nøkkelansvar, renhold og vaktplaner å styre. Endringer i faste avtaler eller sesongtildeling havner ikke i systemet før dagen etter, slik at en time som egentlig ble frigitt i går fortsatt vises som opptatt i dag. Og siden som skal vise ledige tider bruker for lang tid på å laste, slik at brukeren rekker å gi opp før tallene i det hele tatt vises. Resultatet er dødtid: timer som teknisk sett er ledige, men som aldri når fram til noen som vil booke dem, og som dermed heller aldri dukker opp i noe regnskap som tapt inntekt.

## Hva som faktisk endret seg: fra treg side til sanntid

I interne målinger hos Digilist har lastetiden for siden med ledige tider i idrettshaller som fortsatt kjører eldre løsninger, ofte ligget over 20 sekunder, lenge nok til at de fleste besøkende forlater siden før kalenderen viser noe som helst. Etter overgang til Digilists sanntidsvisning ligger tilsvarende oppslag konsekvent under 2,5 sekunder. Forskjellen handler ikke om design, den handler om at kalenderen henter data direkte fra bookingmotoren i sanntid i stedet for å bygge hele siden på nytt for hvert oppslag mot en tung database. For driftsleder betyr det at en restplass som dukker opp klokken 14 faktisk er synlig og bookbar klokken 14:01, ikke neste morgen når noen manuelt har rukket å oppdatere arket.

## Fra ledige tider til fylte timer: booking-flyten som konverterer

Å vise ledige tider er første halvdel. Andre halvdel er hvor mange steg det tar å faktisk booke en. Digilist lar besøkende filtrere på hall, tidspunkt og aktivitet, se ledig tid og fullføre reservasjonen i samme flyt, uten å laste ned et skjema, ringe eller vente på e-postbekreftelse fra en saksbehandler som først er tilbake på kontoret dagen etter. Hver ekstra kontaktflate mellom "her er en ledig time" og "denne timen er nå booket" er et sted brukeren kan falle fra, spesielt på mobil, der de fleste faktisk sjekker ledige tider. Haller med kort booking-flyt trenger ikke bemanne en telefon eller innboks for å fylle restkapasitet; kalenderen gjør jobben selv, også utenom kontortid.

## Utnyttelsesgrad: hvilke timer står tomme, og hvorfor

Utnyttelsesgrad er tallet en driftsleder faktisk styres på: andel av tilgjengelig kapasitet som faktisk brukes, ikke bare antall bookinger som kommer inn. Formelen er enkel, bookede timer delt på totalt tilgjengelige timer per hall, men den er verdiløs uten data brutt ned på riktig nivå. Digilist viser utnyttelsesgrad per hall, per ukedag og per time, slik at et mønster som "tirsdager 20:00 til 22:00 står tomt gjennom hele oktober" blir synlig med én gang i stedet for å oppdages tre måneder senere i et årsregnskap. En driftsleder som ser dette mønsteret tidlig kan flytte annonsering, justere prising på restplasser i lavtrafikk-tidspunkt eller tilby tiden til lag med venteliste i en annen hall, i stedet for å la timen stå tom sesongen ut.

## Sesongtildeling og restplasser i samme kalender

Faste avtaler og sesongtildeling til lag skal ikke kollidere med enkelttimer som selges løpende. Digilist håndterer begge i samme kalender: sesongblokken er reservert automatisk, og alt utenfor den vises som ledig i sanntid, uten dobbeltbooking og uten at driftsleder må krysssjekke to systemer eller to regneark. Når et lag melder avbud på en fast time, frigjøres den umiddelbart som restplass i stedet for å ligge død fram til neste sesongrevisjon eller neste møte i idrettsrådet. Det samme gjelder motsatt vei: en enkelttime som er booket av en privatperson eller bedrift, blokkeres automatisk mot at et lag senere får tildelt akkurat den tiden i neste sesong.

## Turnering og engangsarrangement uten treg side

Ved en turnering søker mange samtidig på samme tidsrom, ofte over flere haller på én gang, gjerne i minuttene rett etter at påmeldingen åpner eller kampoppsettet publiseres. En kalender som allerede bruker 20 sekunder på ett enkelt oppslag har en tendens til å bli enda tregere, eller falle helt ut, under samtidig trafikk fra mange brukere. Digilists arkitektur er bygget for at søk mot flere haller samtidig ikke skal degradere responstiden nevneverdig, slik at en arrangørkomité kan booke haller til en turnering med hundre lag uten at siden oppleves tregere for den hundrede brukeren enn for den første. For driftsleder betyr det færre henvendelser om "siden henger" midt i den travleste perioden på sesongen.

## Rapportering driftsleder kan legge fram

Kommune, idrettsråd eller eier spør før eller siden om dokumentasjon: hvor mye av hallen er faktisk i bruk, og hva koster tomme timer i tapt inntekt eller svekket grunnlag for spillemiddelsøknad. Digilist eksporterer utnyttelsesgrad, bookingvolum og inntekt per hall som rapporter driftsleder kan legge fram direkte, uten å bygge dem manuelt i regneark hver gang noen spør. Flere haller bruker denne typen rapport aktivt inn i den årlige budsjettdialogen med idrettsråd eller eier, som dokumentasjon på at kapasiteten faktisk forvaltes, ikke bare fordeles på papiret ved sesongstart.

## Hva driftsleder bør kreve ved bytte av bookingsystem

Før neste anskaffelse bør driftsleder sjekke fire ting konkret, og be om at hver av dem dokumenteres, ikke bare påstås:

- **Faktisk lastetid** på siden for ledige tider, målt under normal trafikk i egen hall, ikke i leverandørens demo-miljø
- **Oppdateringsfrekvens**: hvor lang tid tar det fra en booking gjøres til ledig tid oppdateres for neste bruker
- **Ytelse under samtidig søk** mot flere haller, dokumentert med reelle tall, ikke bare beskrevet i et salgsmøte
- **Håndtering av avbud**: frigjøres en fast times avlyste time automatisk som restplass, eller krever det manuell oppfølging

Disse fire punktene avgjør om systemet faktisk fyller dødtiden, eller bare flytter den fra papir til skjerm.

## Kom i gang: sanntids ledige tider i egen hall

En hall som viser ledige tider i sanntid og har en kort booking-flyt fyller dødtid som ellers går tapt for godt, og gir driftsleder tall å legge fram når noen spør om utnyttelsen. Book en demo med Digilist, så viser vi hvordan sanntidskalenderen, utnyttelsesrapportene og sesongtildelingen fungerer sammen i din hall.