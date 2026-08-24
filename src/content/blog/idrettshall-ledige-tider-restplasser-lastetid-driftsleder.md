---
slug: idrettshall-ledige-tider-restplasser-lastetid-driftsleder
title: "Idrettshall: restplassen forsvinner mens siden laster"
description: "Driftsledere trenger en sanntidsvisning som laster raskt. Se hvordan Digilist kuttet lastetiden på bookingsiden for idrettshaller fra 20,53 til under 2,5 sekunder."
date: 2026-08-09
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Driftsleder"
cover: "/images/blog/sanntidskalender_hero_no.webp"
keywords: ["idrettshall ledige tider", "idrettshall booking", "LCP bookingside", "sanntidsoppdatering", "restplasser idrettshall", "dobbeltbooking", "universell utforming booking"]
---

Et lag som klikker seg inn for å finne en ledig time, men venter på at kalenderen skal tegne seg ferdig, rekker ofte ikke å booke før timen er tatt av noen andre. For driftsleder er ikke dette bare et irritasjonsmoment: det er timer som forblir ubrukt, og henvendelser som havner på telefonen i stedet for i systemet. Denne artikkelen går gjennom hva som faktisk skjer teknisk når "ledige tider" vises for sakte, hva Digilist har rettet for å gjøre bookingflaten pålitelig i praksis, og hvordan driftsleder selv kan teste om et system faktisk holder det det lover.

## Idrettshall ledige tider: hvorfor sekundene fra klikk til kalender avgjør om noen fullfører bookingen

Google regner en side som "rask nok" når det viktigste innholdselementet, Largest Contentful Paint (LCP), vises innen 2,5 sekunder for minst 75 prosent av besøkende. Under den grensen fullfører folk det de kom for å gjøre. Over den faller de fra, og ifølge en mye sitert analyse fra Google forlater over halvparten av mobilbrukerne en side som bruker mer enn tre sekunder på å laste. For en bookingside betyr det konkret: laget som skulle sikre seg en ekstra treningstime, lukker fanen og prøver en annen kveld, eller lar være helt. Målingen gjelder ikke bare forsiden. Det er selve bookingsiden, der kalenderen med ledige tider skal tegnes, som avgjør om besøket ender i en fullført reservasjon eller en lukket fane.

## Hva "ledige tider" faktisk betyr: sanntidsstatus vs. en side som bare ser oppdatert ut

En kalender kan se ferdig ut visuelt lenge før dataene bak den er korrekte. Mange bookingsystemer viser et cachet øyeblikksbilde som kan være minutter gammelt: det ser oppdatert ut, men en time som nettopp ble booket av et annet lag står fortsatt som ledig. Dette er en vanlig feilkilde i systemer bygget for lesehastighet fremfor datakorrekthet, der kalendervisningen hentes fra et mellomlager som oppdateres på et intervall i stedet for ved hver endring. Digilist henter tilgjengelighet direkte fra samme database som skriver bookingene, ikke fra et mellomlagret uttrekk. Forskjellen merkes først når to lag prøver å ta samme time samtidig: den ene bookingen går gjennom, den andre avvises umiddelbart i stedet for å bli akseptert og siden kansellert i etterkant.

## Fra 20,53 sekunder til under 2,5: hva som ble rettet i lastetiden på bookingsiden

Digilist målte selv LCP på egen bookingflate og fant en verdi på 20,53 sekunder på enkelte haller med mange samtidige ressurser, altså langt over det som gjør en side brukbar. Årsaken var ikke én stor feil, men flere mindre som forsterket hverandre:

- Kalenderdata for hver ressurs (hall, bane, sal) ble hentet sekvensielt, ett kall etter det andre, i stedet for parallelt
- Bilder av hallene lastet i full oppløsning uten komprimering eller moderne formater som WebP
- JavaScript som ikke trengtes for selve visningen av ledige tider blokkerte rendering av siden
- Kalenderkomponenten ble bygget på nytt i nettleseren fra bunnen av, i stedet for at første visning kom ferdig rendret fra serveren

Etter omskriving av datahentingen til parallelle kall, innføring av lazy loading for alt som ikke er synlig ved første visning, og server-side rendering av selve kalendervisningen, ligger LCP nå under 2,5 sekunder på tilsvarende sider. Det samme mønsteret går igjen i drift med mange haller og høyt samtidig trykk på kveldstid: jo flere ressurser som skal vises i én kalender, jo mer forsterkes effekten av sekvensiell datahenting, og jo mer merkes forbedringen når den fjernes.

## Hvorfor treg lasting rammer restplasser hardest

En full ukesplan endrer seg sjelden i siste liten, men restplasser gjør det hele tiden: en avbestilling to timer før trening, en hall som frigjøres fordi et lag trekker seg fra en kamp. Disse vinduene er korte, ofte under en time før noen andre booker dem. Er lastetiden på 20 sekunder, rekker brukeren i praksis aldri å se den ledige timen før den er tatt av noen som fikk varselet raskere eller satt klar med siden allerede åpen. Tenk deg en kveld med treningstid for ti lag i en flerbrukshall: når ett lag melder avbud klokken 17, er tiden normalt tatt av et annet lag innen den neste halvtimen. En bookingside som bruker 20 sekunder på å vise at timen er ledig, taper i praksis konkurransen om den plassen hver eneste gang. Rask lasting er derfor ikke bare et ytelsesmål, det er det som avgjør om en restplass i det hele tatt blir brukt, eller om hallen står tom en kveld den kunne vært fylt.

## Booking, avbestilling og venteliste i samme flate

Når en ledig tid vises korrekt og raskt, må resten av flyten henge sammen uten å sende brukeren til en annen side eller et skjema på e-post:

- **Booking**: laget velger tid og bekrefter direkte i kalenderen
- **Avbestilling**: frigjør tiden umiddelbart, synlig for alle med samme kalender
- **Venteliste**: brukere som ønsket en opptatt time varsles automatisk når den blir ledig
- **Bytte av tid**: to lag kan bytte tildelte tider uten at saksbehandler må inn manuelt

Alt dette skjer i samme system som viser tilgjengeligheten, slik at ingen av trinnene lener seg på et utdatert øyeblikksbilde. En avbestilling som ikke umiddelbart speiles i kalenderen, skaper akkurat samme problem som treg lasting: en ledig time som i praksis er usynlig for dem som faktisk kunne brukt den.

## Driftslederens perspektiv: én kalender for skole, lag og private uten dobbeltbooking

Dobbeltbooking oppstår nesten alltid fordi skolens timeplan, lagenes sesongtildeling og privates enkelttimer ligger i separate systemer som ikke snakker sammen. Med én kalender som viser alle tre kategoriene i sanntid, blir en skoletime, en fast treningstid og en privat booking gjensidig utelukkende i samme datastruktur, i stedet for tre lister som må avstemmes manuelt av en driftsleder som oppdager kollisjonen først når noen møter opp til en dobbeltbooket hall. Drift med flere haller og bruk gjennom hele døgnet, skole på dagtid, faste lag på ettermiddag og kveld, og private eller bedrifter i helgene, er der denne samlingen sparer mest: hver ekstra ressurs som legges inn i separate systemer, øker sannsynligheten for at to bookinger overlapper uten at noen oppdager det før det er for sent.

## Hva rask og pålitelig ledige-tider-visning betyr for universell utforming og WCAG 2.1 AA

Et bookingsystem som skal møte kravene i WCAG 2.1 AA må også fungere for brukere med skjermleser eller begrenset tid til rådighet, og lang responstid rammer disse brukerne hardest siden de allerede bruker mer tid per interaksjon. En skjermleser som venter på at asynkront innhold skal lastes uten at endringen varsles, kan lese opp en kalender som fortsatt viser gamle data, uten at brukeren får vite at noe har endret seg. Riktig bruk av ARIA-live-regioner for sanntidsoppdateringer løser dette, men bare hvis dataene bak faktisk oppdateres raskt nok til at varselet er riktig når det kommer. Digilist bygger på Designsystemet fra Digdir, som dekker kontrast, tastaturnavigasjon og fokushåndtering, men selve hastigheten er en like reell del av tilgjengelighet: en kalender som henger, er utilgjengelig uansett hvor riktig HTML-markeringen er.

## Sjekkliste: slik vurderer driftsleder om et bookingsystem faktisk viser ledige tider i sanntid

Før dere bytter eller fornyer et bookingsystem, test dette konkret:

1. Book en time i ett vindu og se om den forsvinner som ledig i et annet vindu innen sekunder
2. Mål LCP på bookingsiden med et gratis verktøy som PageSpeed Insights
3. Avbestill en time og sjekk om den dukker opp som ledig uten manuell oppdatering
4. Se om skole-, lag- og privatbooking faktisk deler samme kalenderdata
5. Test navigasjon med kun tastatur, og sjekk om en skjermleser varsles når kalenderen oppdateres
6. Be leverandøren vise faktisk LCP-tall for en hall med mange samtidige ressurser, ikke bare for en tom demoside

Systemer som feiler på punkt to, feiler ofte på resten også. Treg lasting er sjelden isolert fra andre svakheter i arkitekturen.

## Kom i gang

Vil dere se hvordan en sanntidskalender med lastetid under 2,5 sekunder fungerer for deres haller? Book en demo med Digilist og test flyten på egne data, med egne haller og egen belastning.