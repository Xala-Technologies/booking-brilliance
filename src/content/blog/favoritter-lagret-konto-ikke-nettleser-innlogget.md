---
slug: favoritter-lagret-konto-ikke-nettleser-innlogget
title: "Favoritter-meldingen er rettet: nå stemmer teksten med lagringsstatus"
description: "En feil i favorittfunksjonen viste innloggede brukere en oppfordring om å logge inn, selv om valget allerede lå lagret på kontoen. Nå viser meldingen riktig status enten du er innlogget eller gjest."
date: 2026-08-08
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Privatperson"
cover: "/images/blog/digilist_app_hero_no.webp"
keywords: ["favoritter digilist", "lagre favoritter booking", "favoritter konto vs nettleser", "logg inn feilmelding", "favorittfunksjon bookingsystem", "digilist innlogging"]
---

Du trykker på hjerteikonet på et selskapslokale eller en idrettshall, og en boks dukker opp med en beskjed om lagring. Spørsmålet er om den beskjeden faktisk stemmer med hva som skjer, og hos Digilist gjorde den ikke alltid det. Nå er meldingen rettet slik at den viser riktig status uansett om du er innlogget eller ikke.

## Hva som er endret

Toasten som vises når du favorittmarkerer et lokale, en hytte eller et stykke utstyr, sjekker nå den faktiske innloggingsstatusen din før den formulerer teksten. Er du innlogget, får du beskjed om at valget er lagret på kontoen. Er du gjest, får du beskjed om at valget er lagret lokalt, med en oppfordring til å logge inn for å ta det med deg videre. Endringen er liten i kode, en betinget setning som nå leser riktig kilde før den velger tekst, men den fjerner en logisk feil som har ligget i grensesnittet en stund.

## Før: hvorfor innloggede brukere så en «logg inn»-melding

Feilen lå i rekkefølgen komponenten sjekket ting i. Meldingsteksten ble satt basert på om favoritten ble skrevet til local storage i nettleseren, ikke basert på om brukeren faktisk var innlogget. Resultatet var at en innlogget bruker som markerte en idrettshall som favoritt, likevel kunne se «logg inn for å lagre permanent», selv om valget allerede lå trygt på kontoen. For en bruker som nettopp har logget inn med ID-porten eller e-post og passord, er det en unødvendig og forvirrende melding. Den typen mismatch mellom det grensesnittet sier og det systemet faktisk gjør, er nøyaktig den kategorien feil brukere husker lengst, selv om den aldri kostet noen en reell favoritt.

## Hvorfor denne typen feil oppstår

Feilen er typisk for grensesnitt der visningslogikk og tilstandslogikk utvikler seg hver for seg. En lagringsmekanisme kan endres, fra ren lokal lagring til lagring på konto, uten at teksten som beskriver den for brukeren, oppdateres i samme slag. Koden kompilerer, testene for selve lagringen kan gå grønt, og likevel sitter brukeren igjen med en melding som beskriver den gamle virkemåten. Det er en påminnelse om at en funksjon sjelden er ferdig når koden fungerer teknisk. Den er ferdig når det brukeren faktisk leser i grensesnittet, stemmer overens med det systemet har gjort, og det krever at noen tester nøyaktig den kombinasjonen: innlogget bruker, favorittklikk, og lest meldingstekst, ikke bare lagringen isolert.

## Slik fungerer det nå for innloggede brukere

Når du er logget inn, skrives favoritten direkte til kontoen din i databasen. Det betyr at valget følger deg mellom enheter: markerer du et selskapslokale som favoritt på mobilen på vei hjem fra jobb, ligger det klart når du åpner Digilist på PC-en samme kveld. Toasten bekrefter nå nettopp dette, uten forbehold om nettleser eller enhet.

## Som gjest: lokal lagring i nettleseren

Bruker du Digilist uten å være innlogget, lagres favorittene fortsatt, men lokalt i nettleseren via local storage. Det er praktisk for et raskt søk der og da, men skjørt: local storage ligger på den ene nettleseren, på den ene enheten, og forsvinner helt til du selv sletter nettleserdata, bytter enhet eller nettleser, eller nettleseren av eget tiltak rydder bort gammel lagring. Nøyaktig når det skjer, varierer mellom nettlesere og personverninnstillinger, og du får sjelden noe varsel før favorittlisten er borte. Den nye meldingsteksten sier dette rett ut, i stedet for å late som om lagringen er permanent når den ikke er det.

## Hvordan du sjekker at favoritten faktisk ligger på kontoen din

Er du usikker på om en tidligere markering ble lagret på kontoen eller bare i nettleseren, er den raskeste sjekken å logge inn og åpne favorittlisten din fra en annen enhet eller en annen nettleser. Dukker lokalet opp der, ligger det trygt på kontoen. Gjør det ikke det, var markeringen gjort som gjest, og den fulgte nettleseren, ikke deg. Har du markert lokaler eller utstyr som gjest og logger inn i etterkant, er det verdt å sjekke listen på nytt og markere favorittene igjen om de mangler, siden lokal lagring og kontolagring i praksis er to atskilte lister som ikke automatisk smelter sammen.

## En presisjon, ikke en ny funksjon

Selve favorittfunksjonen er ikke ny, og lagring på konto har eksistert lenge. Det som er rettet, er kommunikasjonen rundt den. Digilist har ikke lagt til noen funksjon her, bare fjernet en unøyaktighet mellom det systemet faktisk gjør og det systemet sier at det gjør. Den typen presisjon er lett å overse i en produktlogg, men den er akkurat den type detalj som avgjør om brukere stoler på grensesnittet neste gang de trykker på en knapp.

## Hvorfor meldingsteksten betyr noe for tillit

I en bookingflyt tar folk beslutninger basert på det de leser i grensesnittet. Ser du «logg inn for å lagre» når du allerede er innlogget, oppstår tvil: er favoritten min faktisk lagret, eller må jeg gjøre noe mer? Den tvilen koster ikke bare et klikk til, den svekker tilliten til resten av bookingen, inkludert betaling og bekreftelse senere i løpet. Presis tekst på småting som dette er en del av hvorfor Digilist fungerer for både privatpersoner og profesjonelle utleiere, ikke bare en pyntedetalj.

## Betydning for lag, foreninger og bedrifter

Foreninger som sammenligner flere haller før en sesongsøknad, eller bedrifter som samler alternativer før et internt møte, bruker ofte favorittlisten som en arbeidsflate: marker fem til seks aktuelle lokaler, book stab til å vurdere dem, og ta beslutningen samlet. Skal en kommunal idrettshall og et selskapslokale i samme by ligge trygt i samme liste over flere dager mens flere personer i organisasjonen vurderer alternativene, må lagringen faktisk være persistent, og brukeren må vite at den er det. Den rettede meldingen gjør nettopp dette tydelig for alle som logger inn med en organisasjonskonto, i stedet for å etterlate tvil om hvorvidt arbeidet må gjøres på nytt neste dag.

## Betydning for private utleiere

For deg som leier ut lokale, hytte eller utstyr på Digilist, betyr riktig favorittlagring at interesserte leietakere faktisk kommer tilbake til annonsen din. En gjestebruker som mister favorittlisten fordi nettleseren ble tømt, finner kanskje aldri veien tilbake til akkurat ditt lokale blant dusinvis av alternativer. Innlogget lagring på konto reduserer den lekkasjen, og en tydelig melding om hvor valget faktisk ligger, øker sjansen for at markeringen fører til en reell henvendelse, ikke en favoritt som stille forsvinner sammen med nettleserdataen.

## Prøv Digilist gratis

Om du sammenligner selskapslokaler til bryllup, ser etter en idrettshall til laget, eller leier ut eget utstyr, er favorittlisten laget for å holde oversikten mens du bestemmer deg. Logg inn, marker det du vurderer, og la Digilist holde styr på resten. Prøv Digilist gratis og se selv hvor lagringen faktisk havner.