---
slug: idrettshall-ledige-tider-lcp-restplasser-lag-foreninger
title: "Idrettshall: det raskeste laget får restplassen først"
description: "Digilists side for ledige tider lastet før på 20,53 sekunder og kostet lag restplasser ved avbud. Se hvordan lastetid og bookinglås avgjør hvem som vinner."
date: 2026-08-09
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Lag og foreninger"
cover: "/images/blog/sanntidskalender_hero_no.webp"
keywords: ["idrettshall ledige tider", "ledig time idrettshall", "booking idrettshall", "restplasser sesong", "avbud idrettshall", "dobbeltbooking idrettshall"]
---

Når et lag melder avbud, blir timen ledig for alle som følger med samtidig. Den som ser det først og klikker først, får timen. Det høres banalt ut helt til man vet at siden for ledige tider i Digilist tidligere hadde en målt lastetid på over 20 sekunder, altså lenge nok til at kampen om restplassen var avgjort før dataen i det hele tatt hadde vist seg på skjermen. Den siden er nå rettet, og denne artikkelen viser hva endringen faktisk betyr for et lag som jakter restplasser gjennom sesongen.

## Hva "ledige tider" faktisk betyr

"Ledige tider" er ikke én ting. Det er tre forskjellige datastrømmer som må samles i én liste for at et lag skal ha nytte av den:

- **Avbud**: et annet lag har trukket seg fra en allerede tildelt time, og timen frigis umiddelbart.
- **Restplasser**: timer som aldri ble fordelt i sesongtildelingen, ofte tidlig morgen eller sent på kvelden.
- **Sesongrester**: kapasitet som blir stående ubrukt fordi et lag har lagt ned aktivitet eller redusert treningsmengden midt i sesongen.

Skal en lagleder faktisk kunne bruke listen til noe, må alle tre vises i sanntid, i samme kalender, uten at man må sjekke tre ulike systemer eller ringe driftslederen for å bekrefte at timen fortsatt står ledig.

## 20,53 sekunder: hva den gamle lastetiden kostet

Den gamle versjonen av ledige tider-siden hadde en målt lastetid på 20,53 sekunder før hovedinnholdet var synlig. For et lag som fikk SMS-varsel om et avbud klokken 16.00 og skulle rekke å booke før konkurrerende lag, var det i praksis bortkastet tid, uansett hvor raskt lagleder var med tommelen. Google regner en side som "dårlig" på Core Web Vitals når hovedinnholdet (Largest Contentful Paint, LCP) bruker mer enn 4 sekunder. 20,53 sekunder er over fem ganger den grensen, og i praksis betydde det at siden ofte ikke rakk å vise ledige timer før laget som satt nærmest telefonen allerede hadde booket dem gjennom en annen kanal, eller at brukeren rett og slett ga opp og lukket fanen.

## Hva som er fikset: LCP under 2,5 sekunder

Google definerer LCP under 2,5 sekunder som "god" ytelse. Det er terskelen Digilist har rettet ledige tider-siden mot, og det er en målt verdi, ikke en påstand i en produktbeskrivelse. Endringen kom fra tre konkrete grep: kalenderdataen lastes nå i eget kall før resten av siden rendres, bilder og skrifttyper er komprimert og lastes forsinket der de ikke påvirker det som vises først, og selve kalendervisningen er bygget om til å tegne det synlige tidsvinduet med én gang i stedet for å bygge hele sesongoversikten på forhånd. Resultatet er en side som viser ledige timer før brukeren rekker å bli utålmodig, uansett om laget sjekker fra en bærbar PC i klubbhuset eller en mobil med dårlig dekning i garderoben.

## Slik ser laget ledige tider i sanntid, også på mobilt nett i hallen

Idrettshaller har ofte dårlig mobildekning i selve hallen, spesielt i eldre bygg med tykke vegger. Da hjelper det lite med en rask side hvis den krever store datamengder for å oppdatere seg. Digilists kalender er bygget for å synkronisere små dataendringer i stedet for å laste hele oversikten på nytt hver gang noen andre booker en time. Det betyr at en lagleder som sjekker ledige tider fra mobilen mens laget varmer opp, ser samme oppdaterte bilde som noen som sitter hjemme på fiber, og at listen ikke fryser fast på gammel informasjon fordi nettet i hallen er tregt.

## Varsling ved avbud: fra tapt time til booket time før andre rekker å reagere

Den raskeste veien til en restplass er varsling, ikke manuell sjekking. Når et lag melder avbud, kan andre lag som har markert interesse for den ukedagen og tidsrommet få varsel med det samme timen frigis, i stedet for å oppdage den ved tilfeldig innlogging dagen etter. Kombinert med en side som faktisk laster raskt nok til å vise timen når varselet kommer, flyttes fordelen fra "hvem sjekker oftest" til "hvem har satt opp riktig varsling". Det er en fordel alle lag kan sette opp, ikke bare de med en frivillig som sjekker kalenderen hver kveld.

## Hvorfor rask lasting hindrer dobbeltbooking når flere lag klikker samtidig

Når en time frigis samtidig som flere lag har fått varsel, oppstår det klassiske problemet: to lag trykker "book" innen samme sekund. Løsningen ligger ikke i kalendervisningen, men i at systemet låser timen i det øyeblikket én bruker starter bookingen, slik at det andre laget ser timen som opptatt før de rekker å fullføre. En treg side gjør dette verre, fordi flere lag rekker å starte bookingprosessen parallelt før noen av dem ser at timen allerede er tatt. Et konkret eksempel: hvis tre lagledere åpner bookingsiden i samme sekund etter et avbudsvarsel, og siden bruker 20 sekunder på å laste, kan alle tre rekke å starte en bookingprosess før noen av dem ser at timen faktisk er tatt av en annen. Med lastetid under 2,5 sekunder ser lagleder nummer to og tre statusen "opptatt" nesten momentant, før de i det hele tatt rekker å fylle ut skjemaet, og antallet reelle kollisjoner går kraftig ned.

## Fra ledig tid til bekreftet booking: hele flyten steg for steg

1. Laget ser timen dukke opp i listen over ledige tider, enten via varsel eller ved å sjekke kalenderen.
2. Lagleder trykker book, og systemet låser timen for andre samtidig.
3. Bookingen bekreftes med det samme, uten manuell godkjenning fra driftsleder for enkelttimer innenfor gjeldende regler.
4. Timen forsvinner fra listen over ledige tider for alle andre brukere, i sanntid.
5. Laget får bekreftelse og påminnelse nærmere treningstidspunktet.

Hele løpet fra varsel til bekreftet booking tar typisk under ett minutt når siden laster raskt og varslingen er satt opp riktig.

## Praktiske tips: slik utnytter laget restplasser og ledige enkelttimer gjennom sesongen

- Sett opp varsling på flere ukedager og tidsrom, ikke bare de mest populære. Restplasser dukker ofte opp utenfor kveldstid, særlig tidlig morgen.
- Sjekk sesongrester tidlig i august og januar. Det er da flest lag justerer treningsmengden opp eller ned.
- Book enkelttimer fortløpende i stedet for å vente på en større sesongtildeling. Mange haller frigir restkapasitet gjennom hele sesongen, ikke bare ved sesongstart.
- La flere i laget ha tilgang til å booke, slik at ikke alt stopper opp fordi én person er utilgjengelig når et avbud kommer.

## Book demo

Et lag som er avhengig av å rekke restplasser før andre, trenger et system som faktisk viser ledige tider når det gjelder, ikke bare i teorien. Book en demo med Digilist og se hvordan sanntidskalenderen, varslingen og bookinglåsen fungerer sammen i praksis for laget deres.