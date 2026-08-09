---
slug: idrettshall-ledige-tider-lcp-ytelse-driftsavtale-it-leder
title: "Idrettshall ledige tider: LCP-hendelsen IT-leder må kunne dokumentere"
description: "Digilist dokumenterte en reell LCP-hendelse på 20,53 sekunder i idrettshallens ledige tider-visning, med root cause og retting. Se hva IT-leder bør kreve i driftsavtalen etterpå."
date: 2026-08-09
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "IT-leder"
cover: "/images/blog/realtime_updates_hero_no.webp"
keywords: ["idrettshall ledige tider", "bookingsystem idrettshall drift", "LCP Core Web Vitals kommune", "oppetid hendelseshåndtering bookingsystem", "sanntid dobbeltbooking", "universell utforming responstid", "driftsavtale bookingsystem"]
---

Et bookingsystem som viser ledige tider i idrettshallen riktig, men tregt, løser ikke problemet det ble anskaffet for. Denne artikkelen tar utgangspunkt i en reell hendelse hos Digilist, der Largest Contentful Paint (LCP) på app.digilist.no målte 20,53 sekunder mot et mål under 2,5 sekunder, og bruker den til å vise hva en IT-leder bør følge opp etter anskaffelsen, ikke bare før den. For en kommune med flere idrettshaller, mange samtidige brukere og en driftsavtale som forplikter en leverandør, er ytelse i produksjon en driftsindikator på linje med oppetid, ikke et teknisk vedlegg fra anbudsfasen.

## Hvorfor ledige tider i idrettshallen må vises raskt, ikke bare riktig

Ledige tider-visningen er som regel den siden med høyest trafikk i et kommunalt bookingsystem. Lag som leter etter en restplass etter avbud, saksbehandlere som sjekker belegg før de svarer på en henvendelse, og innbyggere som booker en enkelttime på kveldstid, bruker den samme sanntidskalenderen samtidig. Hvis siden bruker over 20 sekunder på å vise første meningsfulle innhold, rekker brukeren å forlate den, laste siden på nytt, eller booke i et konkurrerende system, før dataene i det hele tatt er lastet ferdig.

Konsekvensen er ikke bare en misfornøyd bruker. En restplass som ikke blir booket fordi siden var treg, er en ressurs kommunen har betalt for å drifte, men som står tom. For en IT-leder som skal forsvare investeringen i et bookingsystem overfor rådmann eller kultur- og idrettsavdeling, er ytelse derfor ikke et teknisk pynteord. Det er en av de få målbare størrelsene som direkte påvirker om anlegget faktisk blir brukt.

## Fra kravspesifikasjon til produksjon: hva IT-leder bør følge opp etter anskaffelsen

En SSA-L-avtale med krav om responstid i kravspesifikasjonen er verdiløs hvis ingen måler mot den i drift. Kravet forsvinner ofte i overleveringen fra anskaffelse til forvaltning, fordi den som forhandlet avtalen ikke er den samme som følger den opp i hverdagen.

IT-leder bør derfor sette opp tre faste kontrollpunkter etter go-live. Det første er en månedlig rapport på Core Web Vitals fra produksjonsmiljøet, ikke fra et testmiljø som aldri har den samme belastningen som en hverdagskveld med flere haller i bruk samtidig. Det andre er en kvartalsvis gjennomgang av avvik mot driftsavtalen, gjerne i samme møte som annen leverandøroppfølging. Det tredje er en fast eskaleringsvei, en navngitt kontakt og en frist, for når et mål brytes.

Uten disse tre blir anskaffelsens ytelseskrav en engangssjekk ved leveranse i stedet for en løpende forpliktelse gjennom hele avtaleperioden.

## Core Web Vitals og LCP forklart: hva målet under 2,5 sekunder betyr for et bookingsystem i drift

LCP, Largest Contentful Paint, måler tiden fra siden begynner å laste til det største og mest meningsfulle elementet er synlig, i praksis kalenderen med ledige tider. Google og de fleste offentlige ytelseskrav setter grensen ved 2,5 sekunder for «god» ytelse. Mellom 2,5 og 4 sekunder regnes som «trenger forbedring». Over 4 sekunder er «dårlig». En måling på 20,53 sekunder er ikke en gradvis forverring, det er et driftsavvik som bør trigge samme prosess som et nedetidsvarsel.

LCP er bare ett av tre Core Web Vitals-mål. Interaction to Next Paint (INP) måler hvor raskt siden svarer når en bruker trykker på en ledig time, og Cumulative Layout Shift (CLS) måler om innhold hopper rundt mens siden laster, noe som er spesielt problematisk hvis en bruker trykker «book» akkurat idet en annen rad flytter seg. En IT-leder som bare følger opp LCP, mister halvparten av bildet. Alle tre bør stå i samme rapport, målt som reelle brukerdata fra produksjonsmiljøet, ikke bare som labdata fra et enkeltoppslag i et verktøy som PageSpeed Insights.

## Hendelsen: LCP på 20,53 sekunder på app.digilist.no, funn og retting

Hendelsen ble fanget opp av Digilists egen ytelsesovervåking, ikke av en brukerklage. Root cause var en spørring mot sanntidskalenderen som ikke var indeksert riktig for haller med mange samtidige ressurser, kombinert med at bildet i toppseksjonen ikke ble lastet med riktig prioritet. Kombinasjonen betydde at siden både ventet på en tregere databasespørring enn nødvendig og prioriterte feil innhold først i nettleseren.

Fikset ble rullet ut i produksjon samme dag som avviket ble oppdaget: spørringen ble omskrevet til å bruke riktig indeks, og bildet fikk korrekt lastingsprioritet. Etterfølgende måling viste LCP tilbake under 2 sekunder, godt innenfor målet på 2,5 sekunder. Det som gjør hendelsen relevant for en driftsavtale, er ikke at avviket skjedde, alle systemer får avvik, men at det ble oppdaget automatisk, rettet innen timer og loggført med før- og etter-tall som kan etterprøves i ettertid.

## Sanntidsdata for ledige tider: hvorfor treg lasting og dobbeltbooking henger sammen

Når kalenderen laster tregt, øker sannsynligheten for at to brukere ser den samme ledige timen som tilgjengelig samtidig. Dobbeltbooking er sjelden en feil i selve reservasjonslogikken. Det er oftest et symptom på at synkroniseringen mellom det brukeren ser i nettleseren og det systemet faktisk har booket i databasen, henger etter.

Digilist bruker sanntidsoppdatering slik at en booking låser tiden for alle andre visninger innen millisekunder, ikke ved neste sideoppdatering. En treg LCP forsinker akkurat dette vinduet: jo lenger siden bruker på å laste og vise oppdatert status, desto lenger er tidsrommet der to brukere kan handle på utdatert informasjon. Konflikter blir mer sannsynlige i haller med høyt trykk, som fotballhaller på hverdagskvelder eller idrettshaller med turneringer i helgene, nettopp fordi mange forsøker å booke samme ressurs i samme tidsvindu. En IT-leder som følger opp ytelse, følger derfor indirekte opp risikoen for dobbeltbooking også, selv om de to sjelden nevnes i samme setning i en driftsavtale.

## Oppetid, hendelseshåndtering og varsling: hva som bør stå i driftsavtalen

En driftsavtale for et bookingsystem bør minst dekke fem punkter, og de bør stå som konkrete tall, ikke som formuleringer overlatt til leverandørens skjønn:

- **Oppetidsmål**, typisk 99,5 prosent eller høyere for kritiske funksjoner som booking og betaling
- **Responstid ved hendelse**: hvor raskt leverandøren skal bekrefte at et avvik er mottatt, ofte innen 1 time for kritiske feil
- **Rettetid**: frist for å lukke et kritisk avvik, ofte innen 24 timer
- **Varslingsplikt**: at kommunen informeres proaktivt ved planlagt vedlikehold og ved uventede driftsavvik, ikke bare når noen spør
- **Rapportering**: faste ytelsesrapporter på fast intervall, ikke bare hendelsesbaserte rapporter når noe allerede har gått galt

Uten disse punktene skriftlig og med konkrete tall er det opp til leverandørens eget skjønn hva som regnes som en hendelse verdt å varsle om, og det er sjelden et skjønn som favoriserer kunden når noe faktisk går galt en fredag ettermiddag.

## Universell utforming og responstid: hvorfor WCAG 2.1 AA også stiller krav til ytelse

WCAG 2.1 AA handler ikke bare om kontrast og skjermleser-støtte. Suksesskriterier knyttet til forutsigbarhet, og at innhold ikke forsvinner eller endres uventet mens brukeren samhandler med det, forutsetter at siden faktisk er ferdig lastet før interaksjonen skjer. En bruker med skjermleser som navigerer til en kalender som ikke er ferdig rendret, får feil eller ufullstendig informasjon lest opp, og kan i verste fall booke feil tid uten å vite det.

Ytelse er derfor ikke atskilt fra tilgjengelighet i et offentlig bookingsystem. Det er en forutsetning for at tilgjengelighetskravene i praksis er oppfylt, ikke bare på papiret i tilgjengelighetserklæringen kommunen er pålagt å publisere. En IT-leder som følger opp WCAG-status uten å samtidig følge opp responstid, kontrollerer bare halve kravet.

## Revisjonsspor: hvordan ytelseshendelser logges og rapporteres til kommunen

Digilist logger hver ytelsesmåling med tidsstempel, berørt hall eller ressurs, og hvilken endring som rettet avviket. For LCP-hendelsen betyr det at en kommune med flere idrettshaller i samme instans kan be om samme dokumentasjon som ble brukt internt til å verifisere fiksen: målingen før retting, endringen som ble gjort, og målingen etter.

Det gir IT-leder et revisjonsspor som holder i en tilsynssituasjon, ikke bare en muntlig forsikring om at «det er ordnet». Det samme prinsippet bør gjelde for alle kritiske avvik i avtaleperioden, ikke bare denne ene hendelsen: hvis leverandøren ikke kan fremvise logg med tidsstempel og root cause på forespørsel, er det et tegn på at hendelseshåndteringen er mindre moden enn driftsavtalen forutsetter.

## Sjekkliste: ytelseskrav IT-leder bør stille i oppfølgingen av et bookingsystem for idrettshall

- Krev månedlig rapport på LCP, INP, CLS og oppetid fra produksjonsmiljøet, ikke bare fra testmiljøet
- Sett en konkret eskaleringsfrist for avvik over 2,5 sekunder LCP, med navngitt kontaktperson hos leverandøren
- Be om hendelseslogg med root cause, tidsstempel og rettetid for siste 12 måneder
- Sjekk at sanntidsoppdatering av ledige tider er dokumentert, ikke bare påstått i et salgsmøte
- Bekreft at ytelseskrav er koblet til WCAG 2.1 AA-oppfølgingen og tilgjengelighetserklæringen, ikke behandlet som to separate saker
- Avtal fast rapporteringsintervall for Core Web Vitals i driftsavtalen, ikke bare ved kontraktsinngåelse

## Book demo

Hvis dere følger opp en driftsavtale for et bookingsystem, eller vurderer å bytte leverandør, kan Digilist vise faktiske ytelsestall fra produksjon, ikke bare tall fra en demo satt opp for anledningen. Book en demo med Digilist og be om samme type rapport som ligger til grunn for denne artikkelen, inkludert LCP, INP, CLS og oppetid for de siste 12 månedene.