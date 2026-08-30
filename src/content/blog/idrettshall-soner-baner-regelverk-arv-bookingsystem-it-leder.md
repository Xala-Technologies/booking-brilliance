---
slug: idrettshall-soner-baner-regelverk-arv-bookingsystem-it-leder
title: "Idrettshall med flere soner: regelverket må arves ned til hver bane"
description: "Se hvorfor en sone i idrettshallen aldri skal godkjenne, prise eller åpne booking på egne vilkår, og hva IT-leder bør kreve testet før driftssetting."
date: 2026-08-30
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "IT-leder"
cover: "/images/blog/sanntidskalender_hero_no.webp"
keywords: ["idrettshall ledige tider", "soner og baner bookingsystem", "godkjenning booking idrettshall", "sesongtildeling flere soner", "SSA-L bookingsystem kommune", "dobbeltbooking idrettshall"]
---

En idrettshall med flere soner er sjelden én bookbar enhet. Den er en hall delt i baner, saler og garderobetider som hver har egne ledige tider, men som må dele samme regelverk. Når et bookingsystem lar en enkelt sone godkjenne, prise eller åpne seg selv annerledes enn hallen den ligger under, oppstår feil som verken driftsleder eller saksbehandler oppdager før klagen kommer.

For IT-leder som skal anskaffe eller kvalitetssikre et bookingsystem til en flerbaners idrettshall, er dette et problem som er usynlig i demoen og svært synlig i driften. Leverandøren viser gjerne en ryddig kalender der alle soner ser riktige ut. Spørsmålet som avgjør om systemet holder i praksis, er hva som skjer bak kalenderen: hvor regelverket faktisk håndheves, og om det håndheves likt for hver eneste sone, hver eneste gang.

## Hva «ledige tider» betyr når idrettshallen er delt i flere soner og baner

I en flerbrukshall med for eksempel tre soner og seks baner er «ledig tid» ikke ett tall. Sone A kan være ledig fra 17.00, mens Sone B er opptatt til 19.00 av en fast treningstime. En sanntidsoversikt over flere baner må derfor vise hver sone separat, samtidig som den kobler tidene til hallens felles kalender, slik at ingen bestiller garderobe eller tribune som allerede er lagt til en annen sone i samme tidsrom.

Store flerbrukshaller i norske kommuner har gjerne mellom tre og fem soner eller baner som bookes uavhengig av hverandre: hovedbane, en eller to mindre trimsaler, og noen ganger en tilstøtende aktivitetssal. Alle sonene styres normalt av samme åpningstid, samme godkjenningsrutine og samme prisregler, men de driftes ofte som separate rader i et regneark eller separate kalendere i bookingsystemet. Det er nettopp her regelverket lett kan gli fra hverandre uten at noen har bestemt at det skal skje.

## Arv av regelverk: hvorfor en sone skal følge samme godkjenning, åpningstid og pris som hallen den ligger under

Regelverket for en idrettshall (godkjenningskrav, åpningstider, rabattkategorier) hører til hallen, ikke til den enkelte sonen. En sone er en administrativ underenhet, ikke en selvstendig bookingenhet med egne regler. Når en sone arver regelverket fra hallen automatisk, er det umulig å konfigurere en bane slik at den ved en feil godkjenner seg selv, åpner utenfor hallens tider, eller gir en lavere pris enn resten av hallen. Dette er kjernen i hvordan Digilist er bygget: regelverket ligger på hallnivå og propageres ned til hver sone ved hver eneste bookingskriving, uansett om bookingen kommer fra en saksbehandler, en driftsleder eller innbyggeren selv gjennom selvbetjeningsportalen.

## Slik oppstår feilen i praksis

Tenk deg en flerbrukshall der Sone C (en liten trimsal) er satt opp med «automatisk godkjenning» fordi den brukes til korte enkelttimer, mens resten av hallen krever saksbehandling for booking over to timer. Hvis regelverket kun sjekkes når siden lastes, kan en bruker booke seks timer sammenhengende i Sone C og få automatisk godkjenning, mens en identisk booking i Sone A hadde krevd saksbehandling. Resultatet er ulik behandling av like søknader innenfor samme hall, noe som er nøyaktig det en klage på usaklig forskjellsbehandling vil peke på.

Et beslektet scenario oppstår ved sesongtildeling. Anta at hallen har seks baner og at hver bane i snitt mottar 30-40 søknader i en tildelingsrunde. Da snakker vi fort om et sted mellom 180 og 240 søknader totalt for hele hallen i én runde. Hvis systemet tildeler sesongtimer bane for bane, uten en samlet sjekk mot hallens felles ressurser (garderober, foajé, parkering), kan to soner ende opp med overlappende garderobetider selv om selve banetidene ikke krasjer. Feilen er usynlig helt til sesongen starter og to lag møter opp til samme garderobe samtidig.

## Hvor Digilist validerer regelverket

Feilen over unngås ikke ved å validere pent i grensesnittet. Digilist sjekker godkjenningskrav, åpningstid og prisregler i selve bookingskrivingen, i tilbudsgenereringen og i ledig-tid-sjekken, ikke bare når kalenderen vises. Det betyr at:

- En sone kan aldri lagre en booking som bryter hallens åpningstid, selv om klienten (nettleseren) skulle sende en avvikende forespørsel.
- Tilbudet som genereres for en booking beregnes alltid ut fra hallens prisregler, ikke sonens lokale konfigurasjon alene.
- Ledig-tid-sjekken slår sammen alle soner i hallen, slik at dobbeltbooking på tvers av soner (for eksempel garderobe delt mellom to baner) fanges opp før bekreftelse.
- Godkjenningskravet evalueres på nytt ved hver skriving, ikke bare ved første lagring, slik at en endring i hallens regelverk automatisk slår ut på alle underliggende soner uten manuell oppdatering av hver enkelt sone.

## Konsekvens for saksbehandling

Når godkjenningskrav arves konsekvent, kan saksbehandler stole på at enkelttimer og sesongtildeling behandles likt uansett hvilken sone søknaden gjelder. Det er særlig viktig ved sesongtildeling, der en hall med flere baner kan samle inn et stort antall søknader i én tildelingsrunde, som beskrevet over. Hvis én sone systematisk unngår saksbehandling på grunn av feil konfigurasjon, bygger kommunen opp en skjult ulikhet i tildelingen som først synes når noen sammenligner vedtak i etterkant, gjerne i forbindelse med en klage. På det tidspunktet er skaden allerede skjedd: tildelingen er kommunisert, lag har lagt sesongplaner, og å reversere en feilaktig godkjent booking er en langt vanskeligere jobb enn å ha forhindret den i utgangspunktet.

## Konsekvens for prising

Det samme gjelder pris. En sone skal aldri kunne få en rabattkategori eller pris som avviker fra resten av hallen, med mindre det er et bevisst, dokumentert unntak (for eksempel at en liten trimsal har lavere kvadratmeterpris enn hovedbanen). Uten arvet prisregel risikerer kommunen at et lag booker gjennom «feil» sone for å få lagsrabatt på en booking som egentlig gjelder hovedbanen, noe som over en sesong kan utgjøre et betydelig inntektstap for driftsbudsjettet. Dette trenger ikke være et hallvolum av ekstremt omfang for at det skal merkes: selv et avvik på noen få kroner per time, multiplisert med flere hundre timer i en sesong, blir fort et beløp som synes igjen i regnskapet til hallen.

## Sporbarhet og revisjon

I offentlige anskaffelser av bookingsystem, ofte under SSA-L, er sporbarhet et dokumentasjonskrav, ikke en tilleggsfunksjon. Kommunen må kunne vise, i ettertid, hvilket regelverk som gjaldt for en gitt sone på bookingtidspunktet, og at det regelverket faktisk stemte med hallens vedtatte satser og retningslinjer. Et system som validerer regelverk kun i visningslaget etterlater ingen slik dokumentasjon, fordi feilen aldri blir en del av loggen.

Digilist logger hvilken regel som ble anvendt på hver booking, koblet til sone og hall, slik at en revisjon eller en klagesak kan spores tilbake til faktisk anvendt regelverk. Det samme gjelder endringer i regelverket selv: hvis hallens åpningstider eller prisregler endres midt i en sesong, viser loggen hvilket regelverk som gjaldt før og etter endringen, og fra hvilket tidspunkt. Uten den historikken er det vanskelig å svare presist på et spørsmål fra kommunerevisjonen eller en klageinstans om hvorfor to tilsynelatende like bookinger fikk ulik behandling.

## Sjekkliste for IT-leder

Før dere signerer avtale om bookingsystem til en flerbaners idrettshall, be leverandøren vise, ikke bare beskrive, følgende:

- Arver en ny sone automatisk hallens godkjenningskrav, åpningstid og prisregler, eller må dette settes manuelt per sone? Manuell oppsett er der feil sniker seg inn.
- Valideres regelverket i bookingskrivingen og tilbudsgenereringen, eller kun i grensesnittet? Be om å se hva som skjer hvis forespørselen sendes utenom det vanlige grensesnittet.
- Slår ledig-tid-sjekken sammen delte ressurser (garderobe, tribune, foajé) på tvers av soner, eller sjekkes hver sone isolert?
- Kan dere hente ut en logg som viser hvilket regelverk som gjaldt for en spesifikk booking, seks måneder tilbake, inkludert eventuelle endringer i regelverket i mellomtiden?
- Hvordan håndteres sesongtildeling når en hall har flere soner med ulikt volum av søknader, og hvordan forhindres kryssbooking av delte ressurser i samme tildelingsrunde?

## Oppsummering

Krev at leverandøren demonstrerer arv av regelverk på en reell testhall med minst to soner, ikke bare på papiret, før driftssetting. Se etter systemer som validerer regelverket der bookingen faktisk skrives, ikke bare der den vises, og som logger nok til at en revisjon eller en klagesak kan besvares presist måneder i etterkant.

Book en demo med Digilist, så viser vi hvordan godkjenning, pris og åpningstid arves konsekvent fra hall til sone, og hvordan det dokumenteres for revisjon.