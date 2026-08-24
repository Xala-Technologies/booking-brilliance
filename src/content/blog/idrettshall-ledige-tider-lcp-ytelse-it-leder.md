---
slug: idrettshall-ledige-tider-lcp-ytelse-it-leder
title: "Idrettshallens ledige tider: LCP fra 20,53 til 2,5 sek"
description: "Siden for ledige tider i idrettshallen gikk fra 20,53 til under 2,5 sekunder i LCP. Se hva som ble målt, og hvordan IT-ledere kan stille ytelseskrav i anbud."
date: 2026-08-08
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "IT-leder"
cover: "/images/blog/availability_calendar_hero_no.webp"
keywords: ["idrettshall ledige tider", "LCP bookingsystem", "core web vitals bookingsystem", "ytelseskrav SSA-L", "dobbeltbooking idrettshall", "universell utforming sidehastighet"]
---

En side som viser ledige tider i idrettshallen er verdiløs hvis den ikke rekker å laste før timen er tatt av noen andre. Vi målte siden for ledige tider på app.digilist.no før og etter en ytelsesgjennomgang: LCP falt fra 20,53 sekunder til under 2,5 sekunder. Under følger tallene, hva som faktisk ble endret, hvorfor det betyr noe for IT-ledere og saksbehandlere i kommunen, og hva vi ikke påstår.

## Hva LCP faktisk måler, og hvorfor 20,53 sekunder var kritisk

Largest Contentful Paint (LCP) måler tiden fra siden begynner å laste til det største, synlige innholdselementet er ferdig rendret. På denne siden er det kalenderoversikten med ledige tider i idrettshallen. Google regner under 2,5 sekunder som «god» ytelse. Alt over 4 sekunder regnes som «dårlig» og påvirker både brukeropplevelse og rangering i søk.

20,53 sekunder er ikke et marginalt avvik. Det er en side som i praksis ikke fungerer for formålet sitt. En bruker som skal sjekke om hallen er ledig klokken 18 på tirsdag, rekker verken å se dataene eller å handle på dem før tålmodigheten er brukt opp. For et bookingsystem der ledige tider endrer seg i sanntid, er dette ikke en kosmetisk feil. Det er et funksjonelt sammenbrudd: siden gjør ikke jobben den er bygget for å gjøre.

## Fra 20,53 sekunder til under 2,5 sekunder: hva som faktisk ble målt

Målingene ble tatt på samme side, samme brukerflyt og med samme verktøy, Lighthouse og Core Web Vitals, før og etter endringen på app.digilist.no:

- Før: LCP på 20,53 sekunder på siden for ledige tider i idrettshall
- Etter: LCP under 2,5 sekunder, innenfor Googles «god»-terskel
- Ingen endring i datamodell eller funksjonalitet, kun i hvordan siden henter og rendrer dataene

Det er en reduksjon på over åtte ganger. Forskjellen kommer fra hvordan sanntidsdata om ledige tider hentes og vises, ikke fra å fjerne informasjon brukeren trenger. Konkret betyr det at kalenderen ikke lenger venter på at alle data er hentet før noe som helst vises: det som er klart, vises fortløpende, mens resten lastes i bakgrunnen. Målingene er gjort under sammenlignbare forhold for mobil, som er der de fleste brukere sjekker ledige tider i praksis.

## Hvorfor lastetid avgjør om en ledig time blir booket eller tapt

En idrettshall med populære tider har ofte flere brukere som sjekker samme tidsrom samtidig. Et typisk eksempel er et lag som mister en fast treningstid, og flere andre lag som venter på nettopp den timen. Når siden bruker 20 sekunder på å vise ledige tider, rekker konkurrerende brukere å booke før den første i det hele tatt ser oversikten. Resultatet er en opplevd dobbeltbelastning: tiden var teknisk sett ledig, men systemet var for tregt til å la brukeren gjøre noe med det.

Under 2,5 sekunder endrer denne dynamikken. Ledige tider vises nær sanntid, og forskjellen mellom å se en time og å faktisk få booket den blir mindre avhengig av hvem som klikket fortest på en treg side, og mer avhengig av faktisk tilgjengelighet i kalenderen. For en driftsleder eller saksbehandler er dette forskjellen mellom å måtte forklare hvorfor «systemet viste ledig, men timen var borte» og et system der det brukeren ser, faktisk stemmer med det som er tilgjengelig.

## Ytelse som del av universell utforming

Sidehastighet er ikke bare et teknisk mål. Det er en del av kravene i WCAG 2.1 AA, som norske kommuner er forpliktet til å følge for offentlige digitale tjenester. Brukere med kognitive utfordringer, eller som navigerer med skjermleser og tastatur, er særlig sårbare for lange lastetider. En side som «henger» uten tilbakemelding er vanskelig å tolke, og kan tvinge brukeren til å starte på nytt eller gi opp helt. Motoriske utfordringer forsterker problemet ytterligere: en bruker som har brukt lang tid på å navigere frem til bookingskjemaet, mister alt arbeidet hvis siden ikke rekker å laste ferdig før tidsluken er tatt av noen andre. Rask og forutsigbar lasting er derfor ikke bare et ytelsesmål. Det er et tilgjengelighetskrav, på linje med kontrast, tastaturnavigasjon og tydelige feilmeldinger.

## Hva forbedringen betyr for saksbehandler og IT-leder

For en IT-leder i en kommune, for eksempel i en kommune på størrelse med Lillestrøm, er 2,5 sekunder LCP noe konkret å kreve i en kontrakt. Det er en målbar terskel som kan spesifiseres i kravspesifikasjonen og verifiseres etter leveranse, i motsetning til vage formuleringer som «rask» eller «brukervennlig». I en SSA-L-avtale eller et anbud for bookingsystem til idrettshall bør ytelseskrav stå ved siden av krav til integrasjoner og sikkerhet, med en konkret terskel og en metode for å måle den. Core Web Vitals fra Google er et naturlig valg, fordi målemetoden er offentlig dokumentert og kan gjentas av hvem som helst.

For saksbehandlere som håndterer sesongtildeling og enkeltbookinger, betyr det færre henvendelser om et system som «henger», og færre tvister om hvem som booket en tid først. Når brukeren ser riktig status i kalenderen med en gang, blir også saksbehandlerens etterarbeid mindre: færre manuelle korrigeringer av dobbeltbookinger som egentlig skyldes at siden viste utdatert informasjon i flere sekunder.

## Slik stiller du et etterprøvbart ytelseskrav i anbudet

Et ytelseskrav er bare verdt noe hvis det kan måles etter levering, ikke bare vurderes subjektivt ved demo. For IT-ledere som skal skrive kravspesifikasjon eller evaluere tilbud til et bookingsystem for idrettshall, er dette de praktiske elementene som bør med:

- **Konkret terskel**: spesifiser LCP under 2,5 sekunder, ikke «rask lasting» eller «god ytelse».
- **Navngitt side**: knytt kravet til den siden som faktisk avgjør om innbyggeren lykkes, i dette tilfellet siden for ledige tider, ikke bare forsiden.
- **Navngitt målemetode**: Core Web Vitals målt med Lighthouse, slik at leverandøren og kommunen måler på samme måte.
- **Måletidspunkt**: krev måling både ved leveranse og som del av en årlig oppfølging, siden ytelse kan forringes over tid når mer funksjonalitet legges til.
- **Dokumentasjonsplikt**: leverandøren skal kunne fremlegge målingene på forespørsel, ikke bare hevde at kravet er oppfylt.

Uten disse elementene blir et ytelseskrav en formulering ingen kan håndheve. Med dem blir det en linje i kontrakten som faktisk kan verifiseres, på samme måte som krav til oppetid eller svartid på support.

## Hva det betyr for lag, foreninger og bedrifter

Lag og foreninger som konkurrerer om de samme populære treningstidene, typisk hverdager mellom 17 og 20, merker forskjellen direkte. Når siden for ledige tider laster raskt, blir konkurransen om en ledig time avgjort av faktisk tilgjengelighet i kalenderen, ikke av hvem som tilfeldigvis hadde en raskere internettforbindelse eller satt klar med siden allerede åpen. For et lag som mister en fast treningstid og må konkurrere om en ledig erstatning sammen med flere andre lag, kan de sekundene være forskjellen på å få eller miste timen.

For bedrifter som booker idrettshall til firmaarrangementer eller fast trening for ansatte, betyr det en bookingflyt som faktisk kan gjennomføres på mobil i en pause, uten at siden må lastes på nytt flere ganger før den svarer.

## Hva det betyr for private utleiere

Private utleiere av idrettshall og anlegg taper reelle bookinger når en interessent gir opp underveis i prosessen. En treg side med ledige tider øker antall avbrutte forsøk, spesielt på mobil, der brukere har lavere terskel for å forlate en side som ikke svarer raskt. Med LCP under 2,5 sekunder fullføres flere bookingforsøk, fordi brukeren faktisk ser tilgjengeligheten og kan handle på den før interessen daler. For en utleier med flere anlegg og korte tidsvinduer mellom arrangementer betyr det færre tapte henvendelser og mindre tid brukt på å følge opp interessenter som ga opp underveis.

## Hva vi ikke påstår

Dette er en dokumentert måling på egen plattform, før og etter, med samme verktøy og samme side. Vi sammenligner ikke med andre bookingsystemer, og vi påstår ikke at 20,53 sekunder er representativt for bransjen for øvrig. Vi påstår heller ikke at LCP alene avgjør om en booking fullføres, det er én faktor blant flere, som skjemaets utforming og antall steg i bookingflyten. Tallene gjelder app.digilist.no, målt med Core Web Vitals, og kan verifiseres av enhver IT-leder som ber om dokumentasjon i en anskaffelsesprosess.

## Sett kravet i kontrakten, ikke bare i beskrivelsen

Hvis dere skal ut i anbud eller reforhandle en SSA-L-avtale for bookingsystem til idrettshall, still ytelseskravet konkret: LCP under 2,5 sekunder, dokumentert og verifiserbart, med navngitt side og målemetode. Book en demo med Digilist, så viser vi målingene og hvordan sanntidsdata om ledige tider fungerer i praksis, ikke bare i en presentasjon.