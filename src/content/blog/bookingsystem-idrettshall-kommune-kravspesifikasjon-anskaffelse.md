---
slug: bookingsystem-idrettshall-kommune-kravspesifikasjon-anskaffelse
title: "Bookingsystem for idrettshall: kravspesifikasjonen en IT-leder må stille ved anskaffelse"
description: "Alt en IT-leder i kommunen må kravspesifisere ved anskaffelse av bookingsystem for idrettshall: SSA-L, ID-porten, sanntids ledighet, fakturering og revisjonsspor."
date: 2026-08-27
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "IT-leder"
cover: "/images/blog/ssal_2026_booking_hero.webp"
keywords: ["bookingsystem idrettshall kommune", "anskaffelse idrettsanlegg system", "SSA-L idrettshall", "ID-porten booking idrettshall", "idrettshall ledige tider i sanntid", "kravspesifikasjon bookingsystem idrettsanlegg"]
---

Et bookingsystem for idrettshall er ikke bare en kalender. Det er en anskaffelse som må tåle SSA-L-kontrakt, ID-porten-pålogging, revisjonskrav og daglig drift på tvers av flere anlegg samtidig. Under følger kravene en IT-leder i kommunen bør stille før kontrakten signeres, ikke bare funksjonene leverandøren viser frem i demoen.

## Hva et bookingsystem for idrettshall faktisk må dekke

De fleste idrettshaller lever i to parallelle bookingregimer: sesongtildeling til lag og foreninger fra august til juni, og enkelttimer til privatpersoner og bedrifter i hullene mellom. Et system som bare håndterer det ene, tvinger driftsleder til å føre resten i regneark eller på papir. Kommuner som drifter et titalls idrettshaller fordelt på flere anlegg, opplever typisk dobbeltbooking ved hver sesongstart når sesongtildelingen og enkelttimebookingen ligger i separate systemer som må avstemmes manuelt. Kravet til IT-leder bør derfor være at sesongtildeling, fastbooking og drop-in enkelttimer ligger i samme datamodell, ikke i to systemer som synkroniseres i etterkant.

Dette høres opplagt ut på papiret, men det er nettopp her de fleste anbud svikter: leverandøren demonstrerer sesongtildeling i ett skjermbilde og enkelttimebooking i et annet, uten å vise at de to deler samme ledighetsdata i sanntid. Be om å se begge flytene i samme demo, mot samme testanlegg, før du evaluerer tilbudet videre.

## Krav ved anskaffelse: SSA-L, datalokasjon Norge og GDPR

Bookingsystem for idrettsanlegg regnes normalt som en løpende tjenesteavtale, og SSA-L er standardavtalen de fleste kommuner legger til grunn ved anskaffelse. Still krav om at leverandøren kan signere SSA-L uten vesentlige avvik, at data lagres i Norge eller EU/EØS, og at det finnes databehandleravtale klar til signering før kontraktsinngåelse. Idrettshaller behandler personopplysninger om barn og unge gjennom medlemslister og påmeldinger, noe som gjør GDPR-etterlevelsen strengere enn for et generisk møteromsystem. Be om dokumentasjon på hvor data faktisk ligger og hvem som er underleverandør, ikke bare en påstand om at leverandøren er "GDPR-kompatibel".

Sjekk også hva som skjer med dataene ved kontraktsslutt. En kravspesifikasjon uten exit-klausul om dataeksport og sletting overlater det spørsmålet til forhandling under tidspress, gjerne midt i en sesongtildeling.

## ID-porten og BankID: verifisert pålogging for lag, foreninger og privatpersoner

Skal en forening booke en fast treningstid, må systemet vite hvem som faktisk representerer laget, ikke bare hvilken e-postadresse som fylte ut skjemaet. ID-porten og BankID gir verifisert identitet for privatpersoner, mens organisasjonsnummer kobler foreningsrepresentanten til riktig lag. Uten dette havner ansvaret for avbestilling, mislighold og fakturering hos driftsleder manuelt, hver gang. Kravspesifikasjonen bør spesifisere at systemet støtter ID-porten som standard påloggingsmetode, ikke som et tilleggsmodul med ekstra lisenskostnad, og at BankID-verifisering også dekker privatpersoner som booker enkelttimer utenom sesongtildelingen.

## Sanntids ledighetsoversikt på tvers av flere haller og anlegg

En idrettskonsulent som skal svare et lag om ledig tid i tre ulike haller, kan ikke ringe tre driftsledere for å sjekke kalenderen manuelt. Sanntids ledighet på tvers av alle haller i kommunen, tilgjengelig gjennom ett grensesnitt og gjerne et åpent API, er det som faktisk avgjør nytteverdien av systemet. Still krav om at ledighetsdata oppdateres i sanntid, ikke med nattlig batch-jobb, og at API-et kan koble seg til kommunens egen nettside eller innbyggerportal uten mellomledd. Spør spesifikt hvor lang forsinkelse det er fra en booking gjøres til den vises som opptatt andre steder i systemet, det tallet avslører om «sanntid» i produktbladet faktisk stemmer.

## Avbestilling og no-show: hvordan systemet må frigjøre tid automatisk

No-show er den vanligste årsaken til at haller står tomme selv når kalenderen viser «booket». Systemet bør frigjøre tiden automatisk når en booking avbestilles innenfor en definert frist, og varsle ventelisten samme øyeblikk. Manuell frigjøring, der driftsleder må logge inn og slette en rad, betyr i praksis at halltimer forsvinner i systemet uten å bli tilgjengelige igjen. Krav: automatisk regelmotor for avbestillingsfrist, automatisk varsling til venteliste, og logg over no-show per lag som grunnlag for statistikk og eventuelle sanksjonsregler ved gjentatt fravær.

## Fakturering og betaling: fra manuell fakturering til automatisert flyt

Mange kommuner fakturerer fortsatt idrettshallbruk manuelt, med et regneark som eksporteres til økonomisystemet én gang i måneden. Det krever tett integrasjon mot fakturasystemet, og det er en kilde til feil ved sesongtildeling der hundrevis av linjer skal faktureres samtidig. Still krav om at systemet støtter automatisert fakturaflyt mot kommunens økonomisystem, med mulighet for både forhåndsbetaling for enkelttimer og periodisk fakturering for sesongkontrakter til lag og foreninger. Be om en liste over hvilke økonomisystemer leverandøren faktisk har integrert mot tidligere, ikke bare en generell «vi støtter API-integrasjon».

## Statistikk og utnyttelsesgrad: rapportering driftsleder faktisk bruker

Driftsleder og idrettskonsulent trenger tall for å prioritere investeringer og svare politikerne når spørsmålet om ny hall kommer opp. Utnyttelsesgrad per hall, per ukedag og per tidspunkt er det mest etterspurte, sammen med no-show-rate per lag. Mange kommuner bruker fortsatt uker på å hente ut denne typen tall manuelt fra papirbaserte bookinglister eller regneark før budsjettbehandlingen, noe som gjør statistikken utdatert før den når politikerne. Krav: eksporterbar statistikk uten manuell bearbeiding, og rapporter som kan filtreres per anlegg og per periode direkte i grensesnittet, uten at IT-leder må bestille en egen rapport fra leverandøren hver gang.

## Sikkerhet, revisjonsspor og universell utforming i kravspesifikasjonen

Et kommunalt bookingsystem må tåle en sikkerhetsrevisjon uten overraskelser. Krev revisjonsspor på alle endringer, hvem som booket, avbestilte eller endret en tildeling, og når. Krev også at brukergrensesnittet oppfyller WCAG 2.1 AA, siden idrettshaller booker for hele befolkningen, ikke bare de digitalt vante. ISO 27001-sertifisering hos leverandøren er ikke et minstekrav i alle anbud, men det er et sterkt signal om at sikkerhetsarbeidet er systematisk fremfor ad hoc.

## Referanser, pilotperiode og exit: spørsmål å stille før kontraktsignering

En kravspesifikasjon er ikke ferdig før du har snakket med andre kommuner som faktisk bruker systemet i drift, ikke bare referansene leverandøren selv har valgt ut. Spør spesifikt om sesongtildelingen, ikke bare om enkelttimebooking, siden det er der de fleste systemer viser sine svakheter. Be om en tidsavgrenset pilotperiode med ett eller to anlegg før fullskala utrulling, med tydelige suksesskriterier: sanntidsoppdatering, korrekt fakturagrunnlag og null dobbeltbookinger i pilotperioden. Avtal også hva som skjer ved kontraktsslutt eller bytte av leverandør, inkludert frist for dataeksport i et format kommunen faktisk kan bruke videre, slik at kommunen aldri sitter låst til én leverandør fordi historikken ikke lar seg flytte.

## Sjekkliste: hva du bør kreve i kravspesifikasjon eller anbud

- Sesongtildeling og enkelttimer i samme system, ikke to separate løsninger
- SSA-L-kompatibel avtale, databehandleravtale og datalagring i Norge/EU
- ID-porten og BankID som standard pålogging, ikke tilleggsmodul
- Sanntids ledighetsoversikt med åpent API på tvers av alle anlegg
- Automatisk frigjøring av tid ved avbestilling og no-show
- Integrasjon mot kommunens fakturasystem, ikke manuell eksport
- Statistikk og utnyttelsesgrad eksporterbar uten manuell bearbeiding
- Revisjonsspor på alle bookinghendelser
- WCAG 2.1 AA-samsvar dokumentert, ikke bare påstått
- Referansesjekk mot faktiske kommunebrukere, pilotperiode og exit-klausul for dataeksport

Digilist er bygget for nettopp denne kravlisten: sesongtildeling og enkelttimer i én kalender, ID-porten-pålogging, sanntids API mot flere anlegg, automatisk frigjøring av avbestilte tider og revisjonsspor på hver hendelse. Book en demo, så går vi gjennom kravspesifikasjonen din punkt for punkt og viser hvordan Digilist dekker den.