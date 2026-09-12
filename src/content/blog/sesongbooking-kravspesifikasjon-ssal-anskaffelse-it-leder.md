---
slug: sesongbooking-kravspesifikasjon-ssal-anskaffelse-it-leder
title: "Sesongbooking i SSA-L: kravene IT-leder må stille ved anskaffelse"
description: "Sesongbooking er en anskaffelse, ikke en tilpasning i etterkant. Se hvilke krav til frister, tildeling, klagebehandling og ID-porten IT-leder må sette i SSA-L-kontrakten."
date: 2026-09-12
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "IT-leder"
cover: "/images/blog/ssal_2026_booking_hero.webp"
keywords: ["sesongbooking", "SSA-L", "kravspesifikasjon bookingsystem", "ID-porten", "enkeltvedtak forvaltningsloven", "GDPR kommune", "klagebehandling sesongtildeling"]
---

Sesongbooking i kommunen involverer typisk 30 til 150 lag og foreninger, en søknadsfrist, et sett tildelingskriterier og en klagerunde hvert eneste år. Når hele denne kjeden ligger i hodet på én saksbehandler og et regneark, er det ikke et bemanningsproblem som løses med en vikar. Det er et anskaffelsesproblem, og det er IT-leder som må løse det med krav i kontrakten, ikke med en beklagelse til lagene når fristen glipper eller tildelingen ikke kan dokumenteres. Denne artikkelen går gjennom hva et sesongbookingmodul faktisk må dekke, og hvordan kravene bør formuleres i en SSA-L-anskaffelse.

## Sesongbooking som systemkrav, ikke som årshjul i hodet til en saksbehandler

Et årshjul som lever i hodet til én person er en enkeltpunktsfeil, uansett hvor kompetent personen er. Blir saksbehandleren syk i uken søknadsfristen skal kommuniseres, eller slutter hun midt i tildelingsrunden, stopper hele prosessen opp til noen andre klarer å rekonstruere hvem som har søkt, hvilke kriterier som gjelder, og hvem som venter på svar.

I en kommune med et sesongbookingvolum på 80 til 100 lag og foreninger er dette ikke en teoretisk risiko. Uten et system som eier fristene, kriteriene og loggen, arver neste saksbehandler en prosess ingen kan dokumentere retroaktivt, og hver overlevering blir en ny sjanse for at noe faller ut.

Kravspesifikasjonen må derfor definere sesongbooking som en systemfunksjon med egne tilstander, som åpen, under behandling, tildelt, klagefrist og endelig, ikke som en tilleggsrutine driftsleder eller saksbehandler holder styr på manuelt i et regneark eller en e-postmappe. Still konkret krav om at hver tilstand er tidsstemplet og knyttet til en bruker, slik at ansvar og historikk følger saken, ikke personen som behandlet den.

## Søknadsvindu og frist: hvorfor åpningsdato må styres av systemet, ikke av en kalenderpåminnelse

En kommune med en Outlook-påminnelse som eneste kontroll på når søknadsvinduet åpner, risikerer at datoen glipper, kommuniseres ulikt til ulike lag, eller endres i siste øyeblikk uten at alle får vite det. Systemet bør ha en konfigurerbar søknadsperiode, typisk 4 til 6 uker, med automatisk åpning og lukking, og varsling til alle registrerte foreninger samtidig, gjennom samme kanal.

Krav til leverandøren: åpningsdato og frist skal være et administrativt felt driftsleder eller IT-leder selv kan endre, ikke kode leverandøren må endre manuelt hver sesong mot timepris. Sett også krav om at systemet kan stenge søknadsvinduet automatisk ved fristens utløp, og at etterpåkomne søknader registreres i en egen kø for unntaksbehandling, ikke blandes med søknader som kom i tide.

Det er forskjellen på en løsning kommunen eier og styrer selv, og en løsning kommunen leier tilgang til og er avhengig av leverandøren for å drifte.

## Tildelingskriterier og prisstige som må kunne dokumenteres i etterkant

Når to lag konkurrerer om samme haltid, avgjøres det av kriterier: medlemstall, aldersgruppe, tidligere tildeling, eller en kombinasjon vektet etter en fastsatt modell. Disse kriteriene må ligge som strukturerte data i systemet, ikke som en muntlig praksis saksbehandleren husker fra i fjor eller en kommentar i margen på et gammelt vedtak.

Still krav om at:

- kriteriene er versjonerte, slik at man i etterkant kan se hvilket sett som gjaldt for en gitt tildeling, selv om kriteriene er endret siden
- vekting og prisstige kan eksporteres som dokumentasjon uten manuell sammenstilling fra flere kilder
- systemet viser hvilket lag som fikk hvilken tid, og hvorfor, i samme visning, uten å måtte krysse mot et separat vedtaksdokument
- endringer i tildelingen etter at vedtaket er fattet logges med tidspunkt og saksbehandler, uansett hvor liten endringen er

Uten dette blir enhver klage et arkivsøk i e-post og regneark fra flere saksbehandlere over flere år, og svaret til klageren blir sjelden raskere eller bedre fundert enn arkivsøket tillater.

## Klagebehandling: hva forvaltningsloven krever at systemet logger om enkeltvedtak

En sesongtildeling er et enkeltvedtak etter forvaltningsloven, og klagefristen er normalt tre uker fra vedtaket er mottatt av parten. Systemet må derfor logge når vedtaket ble sendt, når klagen kom inn, og hvilket grunnlag vedtaket bygget på, uten at noe av dette kan endres i etterkant uten spor.

Erfaringsmessig handler klager på sesongtildeling oftest om manglende begrunnelse, ikke om selve utfallet: laget forstår ikke hvorfor et annet lag fikk tiden, fordi vedtaket viser konklusjonen men ikke resonnementet.

Krav til leverandøren: klagebehandling skal være en egen prosess i systemet med tidsstempel, saksbehandleridentitet og mulighet til å knytte klagesvaret til det opprinnelige vedtaket og de kriteriene som lå til grunn, slik at revisjon, kommunedirektøren eller Sivilombudet kan følge kjeden uten å be om innsyn i e-postkasser eller personlige notater. Sett også krav om at klagefristen beregnes automatisk fra tidspunktet vedtaket ble sendt, ikke manuelt av saksbehandler, slik at fristen aldri blir feil regnet.

## Identifisering av lag og foreninger: ID-porten og BankID som forutsetning for gyldig søknad

En søknad signert med et navn i et fritekstfelt er ikke sporbar, og gir kommunen svakt grunnlag hvis tildelingen senere bestrides av noen som hevder de aldri søkte, eller at søknaden ble sendt av feil person i foreningen.

Skal en tildeling tåle klage, må søkeren være identifisert med ID-porten eller BankID, slik at det finnes en autentisert kobling mellom personen som søkte og organisasjonen de representerer. Dette er ikke en funksjon å legge til senere som en integrasjon nummer to. Det er en forutsetning for at søknaden i det hele tatt kan regnes som gyldig underlag for et enkeltvedtak.

Krav i kravspesifikasjonen: systemet skal støtte ID-porten for innlogging av foreningsrepresentanter, med rolletilknytning til organisasjonsnummer, ikke bare til en e-postadresse som kan endres eller deles fritt mellom personer i foreningen. Still også krav om at systemet kan vise hvem som er registrert som signaturberettiget for hver forening, og at dette kan oppdateres uten å måtte kontakte leverandøren.

## GDPR og datalokasjon: hvilke søkerdata systemet lagrer og hvor lenge

Søknadsdata inneholder personopplysninger: navn, kontaktinfo, og i noen tilfeller medlemslister eller aldersfordeling i laget. Kravspesifikasjonen bør stille konkrete krav: hvor dataene lagres, med krav om EU/EØS som minimum, hvilken lagringstid som gjelder etter at sesongen er avsluttet, og hvordan sletting dokumenteres og kan verifiseres av kommunen selv.

En rimelig praksis er å slette søknadsdata senest ett år etter sesongslutt, med mindre en klagesak fortsatt er åpen, og da knyttes lagringen til klagesakens løpetid i stedet for en fast dato. Still krav om at leverandøren kan dokumentere når og hvordan sletting skjer, ikke bare bekrefte at det «gjøres i tråd med GDPR» uten et verifiserbart grensesnitt.

Uten dette kravet skriftlig i kontrakten havner ansvaret for GDPR-etterlevelse hos kommunen selv som databehandlingsansvarlig, mens leverandøren som faktisk lagrer og prosesserer dataene, ikke har en avtalt plikt til å dokumentere noe som helst.

## Integrasjon mot fagsystem og økonomi: EHF, Visma, Tripletex og hvorfor det ikke er en tilleggsfunksjon

Tildelt sesongtid skal ofte faktureres, og fakturaen må inn i kommunens økonomisystem uten at noen taster beløp og fakturamottaker manuelt fra en bookingoversikt inn i et annet system.

Krev at bookingsystemet støtter EHF-format og har dokumentert integrasjon mot Visma og Tripletex, ikke en generisk «API tilgjengelig på forespørsel» som i praksis betyr et tilleggsprosjekt etter kontraktsignering. Manuell overføring av fakturagrunnlag fra bookingsystem til økonomisystem er en kjent kilde til feil i beløp, fakturamottaker og periode, særlig når volumet er flere titalls fakturaer i samme sesong.

En reell integrasjon fjerner det trinnet helt: tildelingen genererer fakturagrunnlaget, og fakturagrunnlaget går til økonomisystemet uten et manuelt mellomsteg. Sett krav om at integrasjonen er del av leveransen ved kontraktsignering, ikke en opsjon som prises separat etter at kommunen allerede er låst til leverandøren.

## Kravspesifikasjonen: sjekkliste for SSA-L-anskaffelse av et sesongbookingmodul

Ved SSA-L-anskaffelse bør sesongbooking dekkes eksplisitt i bilag 1, kundens kravspesifikasjon, ikke antas dekket av en generell bookingfunksjon som beskrives i løsningsspesifikasjonen i bilag 2. Sjekkpunkter IT-leder bør ta med:

1. Konfigurerbart søknadsvindu med automatisk åpning, lukking og varsling til alle registrerte foreninger
2. Versjonerte tildelingskriterier med eksport til dokumentasjon, uten manuell sammenstilling
3. Klagebehandling med tidsstempling knyttet til enkeltvedtaket og automatisk beregnet klagefrist
4. ID-porten-pålogging for foreningsrepresentanter, med rolletilknytning til organisasjonsnummer
5. Dokumentert datalokasjon, lagringstid og verifiserbar sletterutine for søknadsdata
6. EHF-integrasjon mot kommunens økonomisystem, inkludert Visma og Tripletex, som del av standardleveransen

Mangler ett av disse punktene i kravspesifikasjonen, ender det som en avtalt tilpasning i etterkant, og da forhandler kommunen fra en svakere posisjon enn før kontrakten ble signert. Bruk gjerne servicenivåbilaget, bilag 4, til å knytte konkrete krav til responstid ved feil i søknadsperioden, siden dette er perioden hvor nedetid gir størst konsekvens for lagene.

## Fra manuell prosess til revisjonssikker: hva kommunen faktisk bytter ut

Det kommunen bytter ut er ikke et regneark. Det er en risiko: at én person sitter med all kunnskap om frister, kriterier og klagegrunnlag, og at ingen andre kan tre inn uten å gjette seg fram til hvordan ting har vært gjort tidligere år.

Digilist bygger sesongbooking som en systemfunksjon med logget tildeling, ID-porten-identifisering og klagebehandling i samme flate, slik at IT-leder kan kravspesifisere dette som konkrete, testbare krav i stedet for å håpe leverandøren forstår behovet underveis i anskaffelsen. Testbare krav betyr også at kommunen kan verifisere leveransen før kontrakten signeres, ikke først når første klage kommer inn neste sesong.

Vil du se hvordan sesongbooking, klagebehandling og fakturaintegrasjon henger sammen i praksis, og hvordan kravene kan formuleres i egen kravspesifikasjon? Book en demo med Digilist.