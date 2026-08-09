---
slug: idrettshall-booking-lcp-hendelse-monitorering-driftsleder
title: "Idrettshall-booking: slik rettet vi LCP fra 20,53 til 2,5 sekunder"
description: "Digilist rettet en LCP på 20,53 sekunder på idrettshall-bookingen til under 2,5 sekunder, og overvåker Core Web Vitals løpende for driftsledere i appen."
date: 2026-08-09
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Driftsleder"
cover: "/images/blog/realtime_updates_hero_no.webp"
keywords: ["idrettshall ledige tider", "idrettshall booking", "LCP idrettshall", "Core Web Vitals booking", "SSA-L ytelseskrav", "app.digilist.no", "reservere idrettshall sanntid"]
---

En idrettshall med god belegning taper timer den dagen bookingsiden er treg, ikke den dagen kalenderen er full. Dette er historien om et konkret avvik i app.digilist.no: en lastetid på 20,53 sekunder på idrettshall-bookingen, hvordan den ble funnet og rettet til under 2,5 sekunder, og hva den typen hendelse betyr for deg som drifter anlegg. Historien er relevant utover selve tallet, fordi den viser hva som faktisk skal til for at en ledig time blir booket, og ikke bare vist frem i en kalender ingen rekker å åpne før den er tatt.

## Hva var problemet: 20,53 sekunders lastetid på idrettshall-bookingen i appen

Under rutinemessig måling av Core Web Vitals fanget vi opp at Largest Contentful Paint (LCP) på idrettshall-bookingen i app.digilist.no lå på 20,53 sekunder for enkelte brukere. Det er langt over Googles grense for "dårlig" (over 4 sekunder), og et sted en bruker i realiteten rekker å forlate siden flere ganger før kalenderen vises. Årsaken var en kombinasjon av to konkrete forhold: en tung kalenderkomponent som lastet hele sesongens oppføringer i ett kall, uavhengig av hvilken uke brukeren faktisk så på, og manglende komprimering på hall-bildene, som lå urutinert store uten tilpasning for mobilvisning. Begge deler er vanlige, men lett å overse, årsaker til dårlig LCP i booking-systemer der kalender og bilder konkurrerer om å laste først.

## Hva er rettet: fra 20,53 sekunder til under 2,5 sekunder, konkret

Rettelsen besto av tre grep. Først lat lasting av sesongdata, slik at kalenderen henter de nærmeste ukene først i stedet for å hente hele sesongen samlet ved hver sideåpning. Deretter komprimering og riktig størrelse på hallbilder, som kuttet gjennomsnittlig bildevekt betydelig uten synlig kvalitetstap. Til sist prioritert lasting av selve bookingkalenderen foran dekorative elementer, slik at brukeren ser ledige tider før resten av siden er ferdig tegnet. Resultatet ble en LCP på under 2,5 sekunder, innenfor Googles grense for "god" ytelse, en reduksjon på over 85 prosent fra utgangspunktet. Endringen ble verifisert mot reell brukertrafikk over tid, ikke bare i et testmiljø, før den ble regnet som lukket.

## Hvorfor lastetid avgjør hvem som får den ledige timen

Google har dokumentert at 53 % av mobilbrukere forlater en side som bruker over tre sekunder på å laste. På en idrettshall-booking betyr det at en ledig time etter avbud kan bli tatt av den som får siden opp raskest, ikke den som var først ute med å prøve. Ved 20 sekunders lastetid rekker konkurrerende lag, foreldre og enkeltpersoner rett og slett ikke å se timen før den er borte, eller de gir opp og ringer i stedet. Med en side som svarer på under to og et halvt sekund, blir konkurransen om restplassen rettferdig igjen: det avgjøres av hvem som er raskest til å trykke book, ikke hvem som venter lengst på at siden skal laste.

## Slik overvåker Digilist Core Web Vitals løpende, ikke bare ved lansering

Ytelse måles ikke én gang ved lansering og glemmes. Digilist kjører automatiserte målinger av LCP, INP og CLS mot produksjonssiden på faste intervaller, og avvik over terskelverdi utløser en sak internt før driftsleder eller kommune merker noe. Det var nettopp denne rutinen som fanget opp 20,53-sekunders-avviket før det ble et mønster av tapte bookinger. Målingene tar høyde for at brukere kobler seg til fra ulike nettverk og enheter, fra fiber på et kontor til mobildata på en fotballbane, slik at et avvik som først rammer noen få brukere ikke blir stående uoppdaget i månedsvis. Det er forskjellen mellom å love ytelse i et tilbud og faktisk dokumentere den underveis.

## Betydning for kommunen: revisjonsspor, SSA-L og ytelseskrav i anskaffelsen

Kommuner som anskaffer bookingsystem etter SSA-L stiller i økende grad krav til ytelse og oppetid, ikke bare funksjonalitet. En hendelse som denne, med tidsstempel, målt avvik og dokumentert rettelse, er nøyaktig den typen revisjonsspor en IT-leder eller innkjøper trenger å vise til ved kontraktsoppfølging. En kommune som forvalter ti eller flere idrettshaller og gymsaler i samme system, bør be om at leverandøren kan vise historikk på Core Web Vitals for de siste månedene, ikke bare en SLA på papiret som aldri etterprøves i praksis.

## Betydning for lag, foreninger og private som booker idrettshall

Et lag som jakter en ledig treningstime midt i sesongen, eller en forelder som skal booke bursdag i hallen, bruker som regel mobil i farten, ofte på vei mellom andre gjøremål. Med LCP under 2,5 sekunder viser kalenderen ledige tider før brukeren rekker å bytte app eller legge fra seg telefonen. Det gjør avbud og restplasser reelt tilgjengelige i sanntid, i stedet for teoretisk tilgjengelige bak en treg lasteskjerm der timen uansett er tatt av noen andre før siden er ferdig lastet.

## Betydning for driftsleder: færre tapte bookinger og mindre support

For driftsleder er dette rent driftsøkonomisk. Hver time som blir stående tom fordi bookingsiden var treg da avbudet kom, er tapt inntekt og dårligere utnyttelsesgrad på anlegget. Rask lasting reduserer også antall telefoner og e-poster fra brukere som ikke fikk siden til å laste, og lar driftsleder bruke tiden på anlegget i stedet for på support og manuell ombooking.

## Regnestykket: hva treg lasting koster i tapte reservasjoner

Tallet blir konkret med et enkelt eksempel. Anta en hall med en snittpris på 450 kroner per time og rundt tolv avbud i måneden. Hvis halvparten av disse avbudene ikke rekker å bli booket på nytt fordi siden laster tregt idet den ledige timen dukker opp, taper anlegget omtrent 2 700 kroner i måneden i uteblitt inntekt, eller over 32 000 kroner i året, på ett enkelt anlegg. En kommune eller privat utleier med flere haller i porteføljen multipliserer det tapet med antall anlegg. Det er denne typen tap som sjelden vises i et regnskap som "treg nettside", men som likevel spiser rett inn i utnyttelsesgraden måned etter måned.

## Slik sjekker du selv om idrettshallens ledige tider laster raskt

Du trenger ikke ta leverandørens ord for det. Åpne bookingsiden på mobildata, ikke wifi, og bruk Chromes innebygde Lighthouse-verktøy eller PageSpeed Insights til å måle LCP direkte på siden med ledige tider. Gjenta målingen noen ganger og på ulike tider av dagen, siden belastning og nettverksforhold varierer. En verdi under 2,5 sekunder er godt, 2,5 til 4 sekunder bør følges opp, og over 4 sekunder betyr at brukere trolig forlater siden før kalenderen vises.

## Ofte stilte spørsmål om idrettshall ledige tider og booking

### Hva er en god LCP-verdi for en bookingside?

Under 2,5 sekunder regnes som god ifølge Googles Core Web Vitals-terskler. Mellom 2,5 og 4 sekunder trenger forbedring, over 4 sekunder er dårlig.

### Hvor ofte måler Digilist ytelsen på app.digilist.no?

Målingene kjøres automatisert og løpende mot produksjon, ikke bare ved nye utrullinger, slik at avvik fanges opp mens de er små.

### Kan kommunen kreve ytelsesdokumentasjon i en SSA-L-anskaffelse?

Ja. Ytelseskrav og dokumentert oppfølging kan tas inn som del av kravspesifikasjonen og følges opp gjennom kontraktsperioden, ikke bare verifiseres ved leveranse.

### Hva var de tre konkrete grepene som senket lastetiden mest?

Lat lasting av sesongdata slik at kun den nærmeste perioden hentes først, komprimering og riktig størrelse på hallbilder, og prioritert lasting av selve bookingkalenderen foran dekorative elementer. Til sammen tok de LCP fra 20,53 sekunder til under 2,5 sekunder.

### Hva bør et lag eller en forening gjøre for å utnytte restplasser bedre?

Slå på varsling for avbud der det finnes, og book fra mobil så snart en ledig tid dukker opp. Med en rask bookingside er det ofte et spørsmål om sekunder, ikke minutter, hvem som får timen.

## Se ytelsen selv

Vil du se hvordan idrettshallens ledige tider oppfører seg i sanntid, med rask lasting og løpende ytelsesovervåking som en del av avtalen, ikke et engangsløfte? Book en demo av Digilist, så viser vi bookingflyten på deres eget anlegg.