// Per-post FAQPage schema, shared by the browser (src/pages/BlogPost.tsx,
// via SEO.tsx's `faq` prop) and the static build (scripts/prerender.mjs,
// which bakes the same JSON-LD into the prerendered HTML `<head>`). Kept as
// plain JS (no TS syntax) so scripts/prerender.mjs can `import` it directly
// under plain Node ESM, no build step.
//
// Keyed by slug, opt-in — only posts that actually carry a matching
// "Vanlige spørsmål" section in their markdown body should have an entry
// here, since the Q/A text must mirror what the reader sees on the page.
export const POST_FAQ = {
  "beste-nettside-leie-lokale-hytte-utstyr-norge": [
    {
      question:
        "Hva er beste nettside for å leie lokale, hytte eller utstyr i Norge?",
      answer:
        "For korttidsutleie mellom privatpersoner, inkludert hytter, dekker Airbnb og Hygglo markedet godt. For lokaler, haller, fritidsboliger og utstyr som drives av kommuner, idrettslag og bedrifter er Digilist den dedikerte norske plattformen, med sanntidskalender, ID-porten-innlogging og betaling i samme flyt.",
    },
    {
      question: "Er Digilist det samme som Airbnb eller Hygglo?",
      answer:
        "Nei. Airbnb og Hygglo er markedsplasser der privatpersoner leier ut til hverandre gjennom en tredjepart som formidler transaksjonen. Digilist er ikke en markedsplass, men et driftssystem en utleier eier og styrer selv, med egen kalender, eget kundeforhold, egen prising og egen betalingsflyt.",
    },
    {
      question: "Kan jeg leie hytte via Digilist?",
      answer:
        "Digilist er i dag ikke en markedsplass for korttidsutleie av private hytter, slik Airbnb og Hygglo er. Det Digilist derimot løser, er booking av fritidsboliger og hytter som en kommune eller bedrift allerede eier, og som lånes eller leies ut til innbyggere og ansatte etter faste regler.",
    },
    {
      question: "Har Airbnb utstyr til hytta i tillegg til overnatting?",
      answer:
        "Nei, Airbnb formidler overnatting mellom privatpersoner, ikke utleie av utstyr utover det vertskapet velger å ha med i hytta. Skal du leie utstyr som kanoer, sykler eller campingutstyr i tillegg, er Hygglo en egen markedsplass for privat utstyrsutleie. Digilist løser en tredje variant: kommuner og bedrifter som eier både fritidsboliger og utstyr kan administrere booking av begge deler i samme kalender og betalingsflyt, i stedet for to separate systemer.",
    },
    {
      question:
        "Passer Digilist for private utleiere, eller bare for kommuner?",
      answer:
        "Begge deler. En privat utleier av et selskapslokale, et bryllupslokale eller utstyr til utlån kan bruke det samme systemet som en kommune, bare i mindre skala. Forskjellen fra Airbnb og Hygglo er at Digilist er et abonnement utleieren eier selv, ikke en markedsplass der en andel av hver betaling går til plattformen.",
    },
  ],
  "ssa-l-2026-bookingsystem-kommune": [
    {
      question: "Hva er SSA-L?",
      answer:
        "SSA-L er Avtale om løpende tjenestekjøp. DFØ oppdaterte malen i 2026. Den gjelder standardiserte tjenester levert over internett, typisk et SaaS-abonnement der leverandøren har driftsansvaret. Et kommunalt bookingsystem hører hjemme her.",
    },
    {
      question: "Er SSA-L pliktig ved anskaffelse av bookingsystem?",
      answer:
        "SSA-L er ikke lovpålagt, men den anbefalte og mest brukte kontraktsmalen for kommunale SaaS-kjøp. De fleste kommuner legger den til grunn i konkurransegrunnlaget, og en leverandør som ikke kan levere på bilagene om sikkerhet og tjenestenivå, faller normalt fra i evalueringen.",
    },
    {
      question: "Hva er forskjellen på SSA-L, SSA-D og SSA-K?",
      answer:
        "SSA-L gjelder løpende tjenestekjøp (typisk SaaS med driftsansvar hos leverandøren), SSA-D gjelder utvikling og tilpasning av en løsning, og SSA-K er en enklere kjøpsavtale for korte, avgrensede leveranser. Et bookingsystem som leveres og driftes som abonnement, hører hjemme under SSA-L.",
    },
    {
      question: "Hvordan verifiserer kommunen SSA-L-samsvar hos leverandøren?",
      answer:
        "Be om et utfylt sikkerhetsbilag (ikke bare en generell henvisning), et gyldig ISO 27001-sertifikat, siste pen-test-rapport og en kort demo av kravene i praksis: sanntidsoppdatering, ID-porten-innlogging og EHF-faktura. Selvdeklarasjon alene er ikke nok. Krev dokumentasjon du kan verifisere.",
    },
    {
      question: "Hva er nytt i SSA-L 2026?",
      answer:
        "Anskaffelser.no skriver at avtalen ble oppdatert i 2026 og er ment for standardiserte tjenester levert over internett, inkludert sky og ASP. Se SSA-L hos Anskaffelser.no (https://www.anskaffelser.no/verktoy/mal/ssa-l-avtale-om-lopende-tjenestekjop).",
    },
  ],
  "statistikk-rapportering-bruksdata-kommunale-lokaler": [
    {
      question:
        "Hvilken statistikk trenger en kommune for å planlegge bruken av lokaler?",
      answer:
        "Belegg per lokale og tidsrom, avlysnings- og no-show-rate, inntekt og kostnad per objekt, og fordelingen av bruk mellom lag og foreninger, skole og interne møter. Disse fire dekker det meste av det en leder trenger for å prioritere mellom lokaler.",
    },
    {
      question: "Hvorfor holder det ikke med manuelle tellinger i regneark?",
      answer:
        "Manuelle tellinger gir et øyeblikksbilde som er utdatert før det brukes til beslutninger, og de skiller sjelden mellom en reell booking og en avlyst booking. Skal dataene brukes til ressursplanlegging, må de komme løpende fra bookingsystemet, ikke fra en periodisk opptelling.",
    },
    {
      question: "Hvem i kommunen bør ha tilgang til bruksstatistikken?",
      answer:
        "Både driftsledere og administrative ledere, men med ulikt omfang: driftslederen trenger detaljert innsikt i eget anlegg, mens en leder eller administrator trenger et samlet bilde på tvers av alle kommunale lokaler for å prioritere budsjett og investeringer.",
    },
    {
      question:
        "Kan bruksstatistikk brukes til å begrunne investeringer eller nedleggelser?",
      answer:
        "Ja. Dokumentert belegg over tid er et sterkere grunnlag for politiske beslutninger enn anekdotisk kunnskap, både når kommunen skal argumentere for et nytt anlegg og når et lokale reelt sett står ubrukt og bør avvikles eller omdisponeres.",
    },
  ],
  "hva-koster-det-a-leie-selskapslokale-eller-moterom": [
    {
      question: "Hva koster det å leie et selskapslokale eller møterom?",
      answer:
        "Et selskapslokale koster typisk 1 500–4 000 kroner per dag for et grendehus, 6 000–15 000 kroner for et kulturhus, og 15 000–40 000+ kroner for et privat fest- eller hotellokale med servering. Et møterom ligger fra 100–500 kroner timen kommunalt til 500–1 500 kroner timen privat, eller 2 000–6 000 kroner for en hel dag.",
    },
    {
      question: "Er det billigere å leie kommunalt enn privat?",
      answer:
        "Ja, som regel. Kommunen priser lokaler og møterom nær selvkost, mens private aktører legger inn service, personale og driftsmargin i prisen. Forskjellen blir størst når servering og teknikk er inkludert i den private prisen.",
    },
    {
      question: "Hva er inkludert i leieprisen for et møterom?",
      answer:
        "Det varierer. Et kommunalt møterom inkluderer som regel bare rommet og enkelt utstyr, mens et privat møterom på hotell eller kontorfellesskap ofte inkluderer projektor, videokonferanseutstyr og noen ganger kaffe og lunsj. Sjekk alltid hva som følger med før du sammenligner priser.",
    },
    {
      question:
        "Kan lag og foreninger leie møterom eller selskapslokale gratis?",
      answer:
        "Mange kommuner tilbyr gratis eller sterkt rabatterte priser til lag og foreninger registrert i Frivillighetsregisteret, både for møterom og selskapslokaler. Prisen avhenger av hvem som booker, så oppgi formålet ditt for å se riktig sats i bookingsystemet.",
    },
  ],
  "lokalesok-definisjoner-lokaletyper-priser": [
    {
      question: "Hva er lokalesøk?",
      answer:
        "Lokalesøk er å lete etter, sammenligne og booke et ledig lokale til et arrangement, møte eller en fast aktivitet, ved å filtrere på sted, dato, kapasitet og pris i stedet for å kontakte utleiere en etter en.",
    },
    {
      question:
        "Hva er forskjellen på et forsamlingslokale og et selskapslokale?",
      answer:
        "Forsamlingslokale er en bredere, ofte bygningsteknisk betegnelse på lokaler godkjent for at mange kan samles samtidig, og omfatter i kommunal sammenheng blant annet kulturhus, grendehus og festsaler. Selskapslokale er ikke en egen bygningskategori, men en bruksbetegnelse på et lokale – ofte et grendehus, kulturhus eller privat festlokale – som leies ut til private feiringer som bursdager og jubileer. Slike lokaler oppfyller som regel også kravene til et forsamlingslokale, mens et lite møterom normalt ikke gjør det.",
    },
    {
      question: "Hva koster det å leie et lokale?",
      answer:
        "Det spenner fra gratis for kommunale møterom til lag og foreninger, via 1 500–15 000 kroner per dag for grendehus og kulturhus, til 15 000 kroner og oppover for private festlokaler med servering inkludert.",
    },
    {
      question:
        "Kan jeg søke lokale uten å vite nøyaktig hvilket sted jeg vil leie?",
      answer:
        "Ja. Et geografisk lokalesøk lar deg velge by eller kommune først, og deretter dato, kapasitet og lokaltype, slik at du får treff på tvers av alle lokaler i området i stedet for å måtte kjenne til hvert utleiested fra før.",
    },
  ],
  "lokalbooking-geografisk-sok": [
    {
      question: "Kan jeg søke på tvers av flere byer samtidig?",
      answer:
        "Ja, du kan legge inn flere byer eller kommuner i samme søk, og Digilist viser treff for alle stedene side om side med egne priser og egen tilgjengelighet.",
    },
    {
      question: "Er prisene like i Oslo, Bergen og Trondheim?",
      answer:
        "Nei, hver utleier og kommune setter sitt eget prisregulativ. Søket viser reelle priser per sted, ikke et gjennomsnitt.",
    },
    {
      question: "Må jeg vite navnet på lokalet for å finne det?",
      answer:
        "Nei, det geografiske søket er laget nettopp for situasjonen der du kjenner stedet, men ikke navnet på et bestemt lokale ennå.",
    },
    {
      question: "Fungerer geografisk søk for både privatpersoner og bedrifter?",
      answer:
        "Ja, samme søkefunksjon brukes uansett om du booker som privatperson, lag, forening eller bedrift.",
    },
  ],
  "undervisnings-og-opplaeringslokaler": [
    {
      question: "Hva koster det å leie et undervisningslokale?",
      answer:
        "Prisen varierer med hvem som booker og hvor lenge. Frivillige og ideelle kursholdere får ofte redusert sats, mens språkskoler og private kursarrangører normalt betaler en fast time- eller dagspris. I Digilist vises prisen i kalenderen før du bekrefter bookingen.",
    },
    {
      question:
        "Kan en språkskole booke samme rom hver uke gjennom et helt semester?",
      answer:
        "Ja. Digilist støtter serietidsbestillinger, slik at en språkskole kan booke for eksempel hver tirsdag klokken 18–20 gjennom hele semesteret i én operasjon, i stedet for å booke uke for uke.",
    },
    {
      question: "Må jeg ringe for å få vite om et lokale er ledig?",
      answer:
        "Nei. Ledigheten vises i sanntid i kalenderen, sammen med pris og utstyr, slik at du kan søke, sammenligne og bekrefte bookingen selv uten å kontakte en saksbehandler.",
    },
  ],
  "system-for-innbyggere-booke-idrettshall-kommune": [
    {
      question:
        "Hvilket system kan innbyggere bruke til å booke idrettshall i kommunen?",
      answer:
        "Digilist er en norsk SaaS-plattform for booking av idrettshaller, gymsaler og kommunale lokaler. Innbyggere ser ledig kapasitet i sanntid, logger inn med ID-porten eller BankID, og betaler direkte i løsningen. Kommunen bruker samme system til å tildele fast treningstid til lag og foreninger.",
    },
    {
      question: "Er det gratis for innbyggere å bruke systemet?",
      answer:
        "Selve bookingen er gratis for innbyggeren. Kommunen setter prisen for leie av hall eller lokale, og denne vises i Digilist før betaling.",
    },
    {
      question: "Kan lag og foreninger booke faste treningstider hver uke?",
      answer:
        "Ja. Sesongtildeling er en egen modul i Digilist der lag og foreninger søker om fast ukentlig treningstid for en hel sesong, og kommunen fordeler etter egen prioriteringsnøkkel.",
    },
    {
      question: "Fungerer bookingsystemet på mobil?",
      answer:
        "Ja. Digilist er nettbasert og fungerer i nettleser på mobil, nettbrett og PC, uten behov for å laste ned en egen app.",
    },
    {
      question:
        "Hva skjer med allerede bookede timer når en kommune bytter system?",
      answer:
        "Ved implementering overfører Digilist eksisterende sesongtildelinger og faste bookinger før løsningen settes i drift, slik at ingen lag mister allerede tildelt treningstid.",
    },
    {
      question: "Kan private aktører bruke samme system som kommunen?",
      answer:
        "Ja. Digilist driftes på samme plattform for både kommunal og privat utleie, men med adskilte tilganger, slik at en kommune og en privat utleier aldri deler data eller kalendere.",
    },
  ],
  "dans-og-kunstnerstudier-atelier-for-opplaering": [
    {
      question:
        "Kan en danseinstruktør sikre samme dansesal for en hel sesong på forhånd?",
      answer:
        "Ja, gjennom serietidsbestilling bookes hele sesongen i én operasjon, med samme ukedag og klokkeslett hver gang, og med mulighet til å avlyse enkeltdatoer uten å påvirke resten av sesongen.",
    },
    {
      question:
        "Kan en teatergruppe booke flere øvingskvelder i uken fram mot en premiere?",
      answer:
        "Ja, en sammenhengende reservasjon kan dekke flere faste ukedager samtidig for hele øvingsperioden, slik at rommet er sikret helt fram til premieredatoen.",
    },
    {
      question:
        "Skiller booking av en teatergruppes øvingslokale seg fra en danseklasse eller et kunstnerkurs?",
      answer:
        "Ja, en danseklasse eller et kurs går ofte over en løpende sesong, mens en teatergruppes øvingsperiode har en fast sluttdato, premieren, og bookes derfor som en avgrenset blokk fram til den datoen.",
    },
    {
      question:
        "Kan en kunstner som holder kurs dele atelieret med andre brukere uten kollisjon?",
      answer:
        "Ja, hvert atelier eller studie er en egen ressurs i kalenderen, og kursrekken vises som opptatt for alle andre i hele perioden den er booket.",
    },
  ],
  "spesialiserte-lokaler-kultur-underholdning": [
    {
      question:
        "Hva skiller et spesialisert kultur- og underholdningslokale fra et vanlig selskapslokale?",
      answer:
        "Et selskapslokale er nøytralt og møbelbasert, mens et spesialisert lokale er bygget rundt én bruk, som scene og lydanlegg til konsert, lydisolasjon til øving eller veggplass og lys til utstilling.",
    },
    {
      question:
        "Er det verdt å merke et lokale for kultur og underholdning når søkevolumet er lavere enn for selskapslokale?",
      answer:
        "Ja, færre lokaler konkurrerer om disse søkene enn om selskapslokale, og søkerne har som regel allerede bestemt seg for formålet, noe som gir høyere kjøpsintensjon per treff.",
    },
    {
      question:
        "Kan samme lokale bookes både til en enkelt øvingsøkt og til en fast sesongavtale?",
      answer:
        "Ja, samme sanntidskalender håndterer både en enkeltbooking til en øvingskveld og en fast ukentlig eller sesongbasert avtale.",
    },
    {
      question:
        "Må lokalet ha skjenkebevilling for å passe til konsert eller kulturarrangement?",
      answer:
        "Ikke nødvendigvis, det avhenger av arrangementet, men for arrangement med publikumsbetalt inngang og bar er det ofte en forutsetning.",
    },
  ],
  "beste-bookingsystem-kommune-norge": [
    {
      question:
        "Hva er det viktigste å sjekke når en kommune velger bookingsystem?",
      answer:
        "Selvbetjening for innbyggere, saksbehandlerflyt for godkjenning, sesongleie for lag og foreninger, ID-porten-pålogging, EHF-fakturering og migrering fra dagens system. Disse seks dekker det som faktisk skaper eller ødelegger drift.",
    },
    {
      question:
        "Er denne sjekklisten bare for Digilist, eller kan den brukes mot andre leverandører?",
      answer:
        "Sjekklisten gjelder uansett leverandør. Still de samme spørsmålene til Aktiv Kommune, BookUp, Gibbs og enhver annen leverandør dere vurderer, og be om en demo som viser hver kategori i praksis.",
    },
    {
      question: "Må kommunen bruke SSA-L som kontraktsmal?",
      answer:
        "SSA-L er ikke lovpålagt, men den anbefalte og mest brukte kontraktsmalen for kommunale SaaS-kjøp. De fleste kommuner legger den til grunn i konkurransegrunnlaget, og en leverandør som ikke kan levere på bilagene om sikkerhet og tjenestenivå, faller normalt fra i evalueringen.",
    },
    {
      question:
        "Hva skjer med allerede bookede timer når en kommune bytter system?",
      answer:
        "Ved implementering overfører Digilist eksisterende sesongtildelinger og faste bookinger før løsningen settes i drift, slik at ingen lag mister allerede tildelt treningstid. Samme mulighet bør være tilgjengelig hos enhver leverandør dere vurderer.",
    },
  ],
  "hva-er-bookingsystem-kommunale-lokaler": [
    {
      question: "Hva er et bookingsystem for kommunale lokaler?",
      answer:
        "En digital kalender der innbyggere, lag og foreninger booker kommunale rom og anlegg. Saksbehandleren godkjenner i samme løsning, med kontroll og logg.",
    },
    {
      question: "Hvilke lokaler kan bookes?",
      answer:
        "Hall, møterom, kulturhus, idrettsanlegg og andre rom kommunen leier ut. På Digilist ser du typen, kapasitet og ledig tid før du booker.",
    },
    {
      question: "Er dette det samme som et saksbehandlingssystem?",
      answer:
        "Nei. Bookingsystemet tar søknad, kalender og utleie. Saksbehandling av vedtak ligger i fagsystemet. De kan kobles, de er ikke det samme.",
    },
    {
      question: "Må innbyggeren ringe kommunen?",
      answer:
        "Nei. Ledig tid og pris vises før booking. Saksbehandleren har fortsatt kontroll og kan be om mer dokumentasjon.",
    },
  ],
  "bryllupslokale-ledig-dato-tidslinje-sanntid": [
    {
      question: "Kan jeg reservere en dato uten å betale depositum?",
      answer:
        "Noen lokaler tilbyr en uforpliktende forhåndsreservasjon i noen få dager. De fleste krever likevel depositum eller signert avtale for å låse datoen endelig, så bruk den korte fristen til å bestemme dere, ikke til å fortsette å lete videre.",
    },
    {
      question: "Hvorfor er samme lokale dyrere om sommeren enn om vinteren?",
      answer:
        "Etterspørselen er høyere, og mange utleiere legger på en sesongpris for de mest populære månedene, gjerne 15 til 25 prosent over vinterprisen. Lavere etterspørsel vinterstid gjør at utleier heller vil fylle kalenderen til lavere pris enn å stå med tomme helger.",
    },
    {
      question: "Hvor mange lokaler bør jeg sammenligne før jeg bestemmer meg?",
      answer:
        "Tre til fem realistiske alternativer er som regel nok til å se forskjeller i pris, kapasitet og stil uten at søket tar for lang tid. Flere enn det, og dere risikerer heller å bruke unødvendig mye tid på lokaler dere uansett ikke ville valgt.",
    },
    {
      question: "Bør jeg vente med å booke til jeg har fast gjesteliste?",
      answer:
        "Nei. Kapasiteten i de fleste lokaler dekker et bredt spenn, og dere kan justere endelig gjestetall nærmere datoen. Venter dere med å booke til gjestelisten er helt ferdig, risikerer dere at lokalet er tatt før dere i det hele tatt har begynt å lete.",
    },
  ],
  "bryllupsmottak-bankettsaler-storre-selskaper-hoy-kontraktverdi": [
    {
      question:
        "Hvor mange gjester må en sal ta for å regnes som en bankettsal?",
      answer:
        "Det er ingen offisiell grense, men i praksis regnes en sal som bankettegnet fra rundt 120–150 sittende gjester med tilhørende kjøkken- og serveringskapasitet for det volumet.",
    },
    {
      question: "Bør vi prise bankettsalen per kvadratmeter eller per kuvert?",
      answer:
        "Per kuvert (per gjest) over en minimumsgrense fanger opp den reelle verdien bedre enn en flat literpris, fordi kontraktverdien da skalerer med gjestetallet slik den faktisk gjør for catering og bar.",
    },
    {
      question: "Konkurrerer vi med mindre selskapslokaler på pris?",
      answer:
        "Nei, i praksis ikke. En kunde som trenger 200+ sitteplasser har allerede filtrert bort lokaler under den kapasiteten, uansett pris, så dere konkurrerer på tilgjengelighet og pakke, ikke på laveste literpris.",
    },
    {
      question:
        "Kan samme sal leies ut til andre store arrangementer enn bryllup?",
      answer:
        "Ja, firmajubileum, gallamiddager og store konfirmasjoner bruker samme kapasitet og samme pakkestruktur, og bør settes opp som samme bookbare ressurs i Digilist.",
    },
  ],
  "idrettshall-avbestilling-bytte-venteliste-privatperson": [
    {
      question:
        "Kan jeg avbestille bare én enkeltøkt i en fast ukentlig avtale?",
      answer:
        "Ja. Avbestiller du én uke i en fast avtale innenfor fristen, påvirker det ikke resten av sesongen. Resten av de faste tidene står som normalt.",
    },
    {
      question:
        "Hva skjer hvis jeg glemmer å bekrefte en ventelisteplass i tide?",
      answer:
        "Tilbudet går automatisk videre til neste person på listen, og du beholder plassen din lenger nede på listen til neste ledige time dukker opp.",
    },
    {
      question: "Kan jeg bytte en booket time til en helt annen kommune?",
      answer:
        "Ja, så lenge kommunen er tilknyttet samme Digilist-nettverk og hallen har en ledig time som passer. Byttet registreres med samme referansekode som originalbookingen.",
    },
  ],
  "idrettshall-fast-treningstid-trener-kursholder-enkeltpersonforetak": [
    {
      question:
        "Kan jeg booke idrettshall uten å representere et lag eller en forening?",
      answer:
        "Ja. Digilist skiller ikke mellom foreningsbooking og privat booking i søkeflaten, du ser samme ledige tider og booker med eget navn eller foretak.",
    },
    {
      question: "Hvor langt fram kan jeg booke en fast ukentlig time?",
      answer:
        "Det varierer per hall og kommune, men mange tillater booking for hele sesongen, typisk 12 til 20 uker fram i tid, med mulighet til å forlenge før sesongen tar slutt.",
    },
    {
      question: "Får jeg varsel hvis en time jeg venter på blir ledig?",
      answer:
        "Ja, du kan legge deg på venteliste for en spesifikk tid og få varsel med det samme timen frigis, slik at du kan sikre den før noen andre.",
    },
    {
      question:
        "Hva om treningsgruppen min vokser og jeg trenger en større hall?",
      answer:
        "Du kan booke en ny, større hall som enkelttime for å teste om den passer, og først konvertere til fast avtale når gruppen har stabilisert seg der, uten å måtte si opp den opprinnelige avtalen før du er sikker.",
    },
  ],
  "idrettshall-ledige-tider-booke-uten-lag-privatperson": [
    {
      question: "Må jeg være medlem av et idrettslag for å leie hall?",
      answer:
        "Nei. Ledig kapasitet utenom sesongtildelingen er åpen for alle, uavhengig av medlemskap eller organisasjonstilknytning.",
    },
    {
      question:
        "Kan bedrifter booke idrettshall på samme måte som privatpersoner?",
      answer:
        "Ja. Bedrifter bruker samme sanntidskalender til teambuilding eller firmaturneringer, men kan i tillegg få samlefaktura ved flere bookinger.",
    },
    {
      question: "Hvor langt i forveien kan jeg booke?",
      answer:
        "Det varierer fra hall til hall. Mange tider blir bookbare flere måneder frem i tid, mens andre dukker opp med kort varsel når et lag avbestiller en av sine faste timer.",
    },
    {
      question: "Er det forskjell på å leie kommunal og privat hall?",
      answer:
        "Kommunale haller følger ofte en fast offentlig prisliste, mens private haller kan prise mer fleksibelt og tilby tilleggstjenester som catering direkte. Digilist viser begge typer i samme søk, slik at du kan sammenligne før du booker.",
    },
  ],
  "idrettshall-ledige-tider-sok-book-varsling-tvers-kommuner": [
    {
      question: "Kan jeg se ledige tider uten å logge inn?",
      answer:
        "Ja, søk og oversikt er åpent for alle, men du må logge inn for å booke eller sette opp varsling.",
    },
    {
      question: "Hvor ofte oppdateres tilgjengeligheten?",
      answer:
        "I sanntid. En time forsvinner fra søket i det øyeblikket noen andre booker den, så du ser aldri en time som allerede er tatt.",
    },
    {
      question: "Får jeg refundert ved avbestilling?",
      answer:
        "Det følger kommunens eget regelverk for det aktuelle anlegget, og vilkårene vises tydelig før du betaler.",
    },
    {
      question: "Kan jeg booke på vegne av et lag uten å være lagleder?",
      answer:
        "Ja, hvem som helst kan booke en enkelttime, men noen kommuner krever at bestillingen knyttes til et registrert lag for å få redusert sats.",
    },
    {
      question: "Hva skjer hvis jeg glemmer å avbestille?",
      answer:
        "De fleste kommuner registrerer da timen som brukt, og enkelte praktiserer gebyr eller redusert prioritet ved gjentatte tilfeller.",
    },
  ],
  "kunstner-verksteder-studio-dansesaler-kreative-lokaler": [
    {
      question:
        "Kan en enkelt kunstner booke en kveldsøkt i et verksted uten å binde seg til noe fast?",
      answer:
        "Ja, hobbybrukere kan booke enkelttimer direkte i sanntidskalenderen, med betaling i samme flyt, uten å avtale noe utover den ene økten.",
    },
    {
      question:
        "Kan en instruktør sikre samme rom for et helt kurs på forhånd?",
      answer:
        "Ja, gjennom serietidsbestilling bookes hele kursperioden i én operasjon, slik at deltakerne har samme tid og sted sikret hver uke, med mulighet til å avlyse enkeltdatoer uten å påvirke resten av kurset.",
    },
    {
      question:
        "Kan en profesjonell kunstner leie fast atelierplass over flere måneder?",
      answer:
        "Ja, en fast avtale kan settes opp for hele leieperioden, med eksklusiv tilgang til rommet så lenge avtalen varer.",
    },
    {
      question:
        "Kan hobbybrukere, kursdeltakere og profesjonelle kunstnere dele samme kalender uten å kollidere?",
      answer:
        "Ja, hvert kunstner-verksted, hver studio og hver dansesal er en egen ressurs i kalenderen, og lokaleeieren ser alle bookinger på tvers av brukergrupper samlet, uten manuell krysssjekk.",
    },
  ],
  "mote-rom-kommune-finn-ledige-i-omradet-mine-bookinger": [
    {
      question: "Kan jeg booke møterom uten å kontakte en saksbehandler?",
      answer:
        "Ja. For rom med automatisk godkjenning bekreftes bookingen med en gang du har logget inn og betalt eventuell leie. Saksbehandler kobles kun inn når rommet krever en vurdering.",
    },
    {
      question: "Hvordan finner jeg ledige møterom i mitt område?",
      answer:
        "Søk på område, dato og antall plasser. Ledige rom vises på kart og i liste, filtrert etter utstyr som prosjektor og wifi.",
    },
    {
      question: "Finnes det møterom med prosjektor og wifi?",
      answer:
        "Ja, filtrer på utstyr i søket. Da vises kun rom som faktisk har det du trenger.",
    },
    {
      question: "Hva koster et møterom?",
      answer:
        "Lag og foreninger leier ofte gratis eller til en symbolsk sats, privatpersoner betaler en moderat sats, og bedrifter betaler full pris. Din innlogging avgjør hvilken pris du ser.",
    },
    {
      question: "Hvor finner jeg mine tidligere bookinger?",
      answer:
        "Under Min side ligger kommende bookinger, historikk, kvitteringer og meldinger samlet.",
    },
  ],
  "sal-kommune-restplasser-sesong-billigst-lag-foreninger": [
    {
      question: "Er sesongtildeling alltid billigere enn enkeltbooking?",
      answer:
        "Nei. Det er som regel billigere per gang ved jevnt oppmøte, men bindingen kan gjøre enkeltbooking av restplasser rimeligere for grupper med variabelt fremmøte.",
    },
    {
      question: "Hvor mye kan depositum og gebyrer utgjøre av totalprisen?",
      answer:
        "Det varierer fra kommune til kommune og fra sal til sal, men depositum, avbestillingsgebyr og vaskekrav bør alltid legges til grunnsatsen når foreningen sammenligner. Summen av disse postene kan i praksis utgjøre en vesentlig del av det foreningen faktisk betaler per gang, selv om ingen av dem står i selve timeprisen i regulativet.",
    },
    {
      question: "Kan foreningen booke sal i en annen kommune?",
      answer:
        "Ja, de fleste kommunale saler er åpne for eksterne, men uten lokale medlemsrabatter og med kommunens egne frister for avbestilling.",
    },
  ],
  "studio-fotografi-videografi-privatproduksjon-booking": [
    {
      question:
        "Kan en enkeltkunde booke en fotoøkt uten å binde seg til noe fast?",
      answer:
        "Ja, enkeltøkter bookes direkte i sanntidskalenderen, med betaling i samme flyt, uten noen forpliktelse utover den ene økten.",
    },
    {
      question:
        "Kan en content-skaper sikre samme ukentlige tidspunkt over flere måneder?",
      answer:
        "Ja, gjennom serietidsbestilling bookes hele perioden i én operasjon, slik at tidspunktet er sikret hver uke, med mulighet til å avlyse enkeltdatoer uten å påvirke resten av serien.",
    },
    {
      question:
        "Kan en videograf reservere studioet eksklusivt til en sammenhengende produksjon?",
      answer:
        "Ja, en avgrenset periode kan bookes som én eksklusiv reservasjon, slik at ingen andre kan booke rommet mens produksjonen pågår.",
    },
    {
      question:
        "Kan prisen settes ulikt for enkeltøkter, faste avtaler og produksjonsleie?",
      answer:
        "Ja, lokaleeieren setter differensiert pris per bruksformål, slik at rommets faktiske verdi gjenspeiles uansett hvilket av de tre bookingmønstrene gjesten bruker.",
    },
  ],
  "yoga-wellness-studio-klasseromlokaler": [
    {
      question:
        "Kan en deltaker booke en enkelt drop-in-time uten å binde seg til et helt kurs?",
      answer:
        "Ja, drop-in-deltakere kan booke enkelttimer direkte i sanntidskalenderen, med betaling i samme flyt, uten å avtale noe utover den ene klassen.",
    },
    {
      question:
        "Kan en instruktør sikre samme rom for en fast ukentlig klasse gjennom hele semesteret?",
      answer:
        "Ja, gjennom serietidsbestilling bookes hele semesteret i én operasjon, slik at deltakerne har samme tid og sted sikret hver uke, med mulighet til å avlyse enkeltuker uten å påvirke resten av klassen.",
    },
    {
      question:
        "Kan en instruktør booke rommet eksklusivt for en helgeworkshop eller et retreat?",
      answer:
        "Ja, en avgrenset periode som en hel helg kan bookes som én sammenhengende reservasjon, med eksklusiv tilgang til rommet mens arrangementet pågår.",
    },
    {
      question:
        "Kan lokaleeieren tilby klippekort eller medlemskap til faste yoga- og wellness-elever?",
      answer:
        "Ja, faste deltakere kan kjøpe forhåndsbetalte klipp eller et løpende medlemskap, i stedet for å faktureres for hver enkelt time.",
    },
  ],
  "bolig-til-leie-oslo-mellombolig-leilighet": [
    {
      question:
        "Er en korttidsleilighet det samme som en vanlig bolig til leie?",
      answer:
        "Nei. En vanlig bolig til leie forutsetter normalt en kontrakt på minst ett år med depositum og oppsigelsestid. En korttidsleilighet booker du direkte for den perioden du faktisk trenger, fra noen netter til flere uker, uten den samme bindingstiden.",
    },
    {
      question: "Hvor lenge kan jeg bo i en mellombolig?",
      answer:
        "Det varierer fra vert til vert, men mange korttidsleiligheter kan bookes for alt fra én natt til flere uker sammenhengende. Du velger netter i kalenderen og ser totalprisen for hele oppholdet før du booker.",
    },
    {
      question: "Er møbler, sengetøy og kjøkkenutstyr inkludert?",
      answer:
        "Det står på hver leilighet. De fleste korttidsleiligheter er fullt møblerte med kjøkkenutstyr, og mange inkluderer sengetøy og håndklær, mens andre krever at du tar det med selv. Sjekk alltid detaljene på annonsen før du booker.",
    },
    {
      question:
        "Hva koster en mellombolig i Oslo sammenlignet med en vanlig leiekontrakt?",
      answer:
        "Prisen per natt er som regel høyere enn en tilsvarende leilighet på en ordinær leiekontrakt, men du unngår depositum på flere måneders leie og bindingstid du ikke trenger. For et opphold på noen uker blir totalkostnaden ofte lavere enn summen av depositum, oppsigelsestid og møbler du uansett må kjøpe og kvitte deg med.",
    },
    {
      question: "Kan jeg avbestille hvis flyttedatoen endrer seg?",
      answer:
        "Avbestillingsreglene settes av verten og står på hver leilighet før du booker. Der det er tillatt, avbestiller du digitalt, og beløpet refunderes etter reglene som gjelder for akkurat den leiligheten.",
    },
  ],
  "bryllupslokale-nar-deg-overnatting-leverandorer-sok": [
    {
      question: "Må jeg bruke alle tjenestene til ett lokale?",
      answer:
        "Nei, du velger fritt hvilke leverandører og hvilken overnatting du legger til, lokalet er utgangspunktet, ikke en pakke du må ta i sin helhet.",
    },
    {
      question: "Kan jeg endre gjesteantall etter bestilling?",
      answer:
        "Ja, du justerer i samme oversikt, og lokale, catering og overnatting oppdateres mot samme tall.",
    },
    {
      question: "Hva skjer med depositum ved avbestilling?",
      answer:
        "Vilkårene følger hvert enkelt lokale og leverandør, men du ser dem samlet før du bekrefter, ikke spredt i fem forskjellige kontrakter.",
    },
    {
      question: "Hvor tidlig bør vi booke overnatting til gjestene?",
      answer:
        "Samtidig som lokalet, hvis dere vil sikre rom på eller nær eiendommen. Venter dere til noen uker før, er de nærmeste alternativene ofte allerede tatt av andre arrangementer i området.",
    },
    {
      question: "Kan vi bruke leverandører som ikke er tilknyttet lokalet?",
      answer:
        "Ja. De tilknyttede leverandørene er forslag basert på hva som pleier å fungere godt i det aktuelle lokalet, ikke et krav. Dere kan legge til egne leverandører ved siden av.",
    },
  ],
  "catering-servering-lokale-med-kjokken-bursdag-bedriftsfest": [
    {
      question:
        "Hvordan vet jeg om et lokale har egnet kjøkken til at cateringleverandøren min kan levere der?",
      answer:
        "Sjekk om lokalet er merket med storhusholdningskjøkken, enklere serveringskjøkken eller bare kjøkkenkrok før du booker, og avklar med leverandøren om det dekker det de trenger for menyen din.",
    },
    {
      question:
        "Er catering alltid inkludert i leieprisen for et selskapslokale?",
      answer:
        "Nei. Noen lokaler har fast servering inkludert eller som tilvalg, mens andre bare stiller kjøkkenet til rådighet for en cateringleverandør du bestiller selv. Sjekk alltid dette før du booker.",
    },
    {
      question:
        "Hvor lang tid i forveien bør jeg bestille catering til jul eller påske?",
      answer:
        "Cateringleverandørers kapasitet er lavest i høysesongen rundt høytidene, så bestill lokale og leverandør tidligere enn du ville gjort ellers, og avklar allergihensyn skriftlig i god tid.",
    },
    {
      question:
        "Kan jeg bruke egen mat i et lokale med kjøkken, selv om lokalet har fast servering?",
      answer:
        "Det varierer fra lokale til lokale. Noen tillater selvcatering mot at du rengjør kjøkkenet selv etter bruk, mens andre krever at maten kommer fra deres faste leverandør. Sjekk vilkårene før du booker.",
    },
  ],
  "idrettshall-bookingsystem-drift-regler-roller-rapportering": [
    {
      question:
        "Kan vi ha ulike regler for skole, lag og private i samme system?",
      answer:
        "Ja, reglene settes per brukergruppe og hall, ikke globalt for hele anlegget.",
    },
    {
      question: "Hva skjer med en booking som ikke godkjennes innen fristen?",
      answer:
        "Den bør automatisk frigis, slik at tiden ikke låses unødig for andre som venter på samme tidspunkt.",
    },
    {
      question: "Må vi ha manuell godkjenning for alle bookinger?",
      answer:
        "Nei, de fleste kan automatiseres. Manuell behandling bør reserveres for unntakene beskrevet over, ikke brukes som standard for alt.",
    },
    {
      question: "Hvordan dokumenterer vi belegg til spillemidler-søknaden?",
      answer:
        "Revisjonssporet i bookingsystemet holder normalt det som trengs, forutsatt at hver booking er koblet til brukergruppe, tidspunkt og godkjenning.",
    },
    {
      question: "Kan vi endre regelverket midt i sesongen?",
      answer:
        "Ja, men endringer bør varsles i god tid til faste brukere, og gjelde fra en fastsatt dato fremover, ikke bakover på allerede bekreftede bookinger.",
    },
  ],
  "idrettshall-kommune-booke-enkelttime-trening-arrangement": [
    {
      question: "Kan jeg booke idrettshall som privatperson?",
      answer: "Ja, enkelttimer bookes direkte i kalenderen med BankID.",
    },
    {
      question: "Hvorfor kan jeg ikke booke fast trening selv?",
      answer:
        "Faste tider fordeles i sesongtildelingen etter prioritering, ikke fortløpende.",
    },
    {
      question: "Hva skjer om jeg avbestiller?",
      answer:
        "Innen fristen er det gratis, etter fristen belastes du. Fristen står i bekreftelsen.",
    },
    {
      question: "Ser jeg prisen før jeg booker?",
      answer: "Ja, prisen vises i kalenderen før du bekrefter.",
    },
  ],
  "idrettshall-ledige-tider-booking": [
    {
      question: "Hvordan ser jeg ledige tider i idrettshallen?",
      answer:
        "Du åpner hallens bookingside og ser en kalender der ledige timer er valgbare og opptatte timer er stengt. Visningen er oppdatert i sanntid, så det du ser er faktisk ledig akkurat nå.",
    },
    {
      question: "Hva er avbestillingsfristen?",
      answer:
        "Fristen settes av kommunen, ofte mellom 24 og 48 timer før timen starter. Avbestiller du innen fristen, frigjøres timen automatisk til andre. Etter fristen kan timen bli fakturert selv om den ikke brukes.",
    },
    {
      question: "Hvem har prioritet på faste tider?",
      answer:
        "Kommunen fastsetter kriteriene, typisk med barne- og ungdomsidrett først, deretter breddeidrett og til slutt voksne og private. Systemet håndhever fordelingen som ble vedtatt, slik at tildelte tider ligger låst gjennom sesongen.",
    },
    {
      question: "Kan privatpersoner leie enkelttimer?",
      answer:
        "Ja. Alt som ikke er tildelt som fast tid, og alle timer som frigjøres ved avlysning, er tilgjengelig for enkeltbooking.",
    },
  ],
  "idrettshall-ledige-tider-venteliste-prioritering-lag-foreninger": [
    {
      question: "Kan vi booke en enkelttime samme dag?",
      answer:
        "Ja, dersom hallen viser den som ledig i sanntid, og hallen tillater booking uten forhåndsgodkjenning.",
    },
    {
      question: "Hvor lenge står vi på venteliste før den utløper?",
      answer:
        "Det varierer per hall, men en vanlig frist er ut inneværende sesong, eller til laget selv fjerner seg fra listen.",
    },
    {
      question:
        "Mister vi plassen i fordelingsnøkkelen om vi booker mange enkelttimer?",
      answer:
        "Nei, enkelttimer utenom fordelingen påvirker ikke sesongtildelingen neste år.",
    },
    {
      question: "Kan andre enn lagleder booke tid på vegne av laget?",
      answer:
        "Det kommer an på hvordan hallen har satt opp tilgangene. Mange lag lar flere personer, for eksempel både hovedtrener og en foreldrekontakt, ha rettigheter til å booke og avbestille, slik at det ikke stopper opp om én person er utilgjengelig.",
    },
    {
      question:
        "Hva skjer hvis vi glemmer å avbestille en tid vi likevel ikke bruker?",
      answer:
        "Praksis varierer per hall og kommune, men gjentatte tilfeller av ubrukt, ikke-avbestilt tid kan påvirke lagets prioritet ved neste sesongtildeling. Sjekk hallens retningslinjer, eller avklar direkte med driftsleder dersom dere er usikre.",
    },
  ],
  "leie-bryllupslokale-kapasitet-inkludert-bookingprosess": [
    {
      question: "Hvor tidlig bør vi booke bryllupslokale?",
      answer:
        "For lørdager i høysesong (juni til august), regn 12 til 18 måneder. For hverdager eller lavsesong holder ofte 6 til 8 måneder.",
    },
    {
      question: "Er catering alltid inkludert i leien?",
      answer:
        "Nei. Mange lokaler leier ut kun rommet og krever at dere bestiller catering separat eller gjennom en anbefalt partner.",
    },
    {
      question: "Hvor mye depositum må vi betale?",
      answer:
        "Vanligvis 10 til 25 prosent av totalprisen, betalt ved signering av kontrakt.",
    },
    {
      question: "Kan vi endre gjesteantallet etter at vi har booket?",
      answer:
        "Ja, innenfor fristen som står i kontrakten, som regel 2 til 4 uker før arrangementet.",
    },
    {
      question: "Bør vi velge lokale med eller uten catering inkludert?",
      answer:
        "Det kommer an på om dere har egne ønsker om meny og leverandør. Et lokale med fast cateringpartner sparer dere for koordinering, men gir mindre frihet enn å velge catering selv.",
    },
  ],
  "moterom-kommune-omrade-lag-foreninger-selvbetjent-booking": [
    {
      question:
        "Må vi være registrert i Frivillighetsregisteret for å booke møterom?",
      answer:
        "Det varierer fra kommune til kommune. Mange kommuner krever at laget er registrert som frivillig organisasjon for å få redusert eller gratis leie, mens ordinær leiepris gjelder for lag som ikke er registrert.",
    },
    {
      question:
        "Kan vi avlyse ett enkelt møte i en fast serie uten å miste resten?",
      answer:
        "Ja. En fast serie og en enkeltavbestilling må kunne håndteres hver for seg, slik at ett avlyst styremøte i november ikke påvirker møtene i desember og januar.",
    },
    {
      question:
        "Hva skjer hvis vi glemmer å avbestille et møte vi ikke lenger trenger?",
      answer:
        "Rommet bør automatisk frigjøres til andre etter en fastsatt frist, og foreningen bør få en påminnelse i forkant, slik at det sjelden skjer i praksis.",
    },
    {
      question: "Kan flere personer i styret booke på vegne av laget?",
      answer:
        "Ja, det bør være mulig å gi flere styremedlemmer tilgang til å booke på vegne av foreningen, slik at ansvaret ikke hviler på én person som må huske alt.",
    },
  ],
  "sesongtildeling-idrettshall-saksbehandler-guide": [
    {
      question: "Når er søknadsfristen for treningstid?",
      answer:
        "Vanligvis 1. april eller 1. mai for sesongen som starter til høsten. Sjekk kommunens eget reglement.",
    },
    {
      question: "Hva skjer med søknader som kommer inn etter fristen?",
      answer:
        "De behandles som restkapasitet og fordeles på tider som står ledige etter at sesongtildelingen er lagt. De går ikke foran de ordinære søknadene.",
    },
    {
      question: "Hvem får treningstid først når flere lag søker samme time?",
      answer:
        "Prioriteringsreglementet avgjør, som regel barn og unge og konkurranseparti før voksne og eksterne, ikke rekkefølgen på søknadene.",
    },
    {
      question: "Kan innbyggere booke idrettshall drop-in?",
      answer:
        "Ja, restkapasitet og avlyste tider frigis til enkeltbooking uten at det rører de faste tildelte tidene.",
    },
    {
      question: "Hvordan klager man på tildelt treningstid?",
      answer:
        "Klagen behandles mot det dokumenterte vedtaket, der søknad, regel og begrunnelse ligger lagret.",
    },
  ],
  "tilgjengelighet-lokaler-nedsatt-funksjonsevne": [
    {
      question:
        "Er tilgjengelighet for nedsatt funksjonsevne et lovkrav for alle lokaler?",
      answer:
        "Offentlige virksomheter har en aktivitetsplikt til universell utforming av lokaler rettet mot allmennheten. Kommersielle lokaler er omfattet av det samme diskrimineringsvernet når de tilbyr tjenester til allmennheten, og TEK17 setter byggtekniske minstekrav ved nybygg og hovedombygging for begge.",
    },
    {
      question: "Hvilke tilgjengelighetsegenskaper bør et lokale dokumentere?",
      answer:
        "De mest etterspurte er trinnfri adkomst, dørbredde, tilgjengelig toalett, heis til aktuelle etasjer, teleslynge og HC-parkering i gangavstand fra inngangen.",
    },
    {
      question:
        "Kan en booker filtrere søket på tilgjengelighetsbehov i Digilist?",
      answer:
        "Ja, tilgjengelighetsegenskaper registreres per lokale og kan filtreres i søket, slik at bookeren ser svaret direkte i resultatlisten uten å måtte ringe og spørre.",
    },
    {
      question: "Er tilgjengelighet bare en compliance-oppgave?",
      answer:
        "Nei. Et fysisk tilgjengelig lokale som ikke viser det i bookingflyten, ekskluderer i praksis den samme gjesten som et lokale uten tilrettelegging. Å gjøre informasjonen synlig er det som faktisk skaper inkludering.",
    },
  ],
  "booking-spesialiserte-trening-kunstnerlokaler": [
    {
      question: "Kan jeg booke en enkelttime uten å binde meg til noe fast?",
      answer:
        "Ja, uansett om du er musiker, fotograf, kunstner eller treningsinstruktør, kan du booke en enkeltøkt direkte i sanntidskalenderen, med betaling i samme flyt.",
    },
    {
      question: "Kan jeg sikre samme rom hver uke over en hel sesong?",
      answer:
        "Ja, gjennom en fast ukentlig avtale bookes hele perioden i én operasjon, slik at du slipper å bekrefte på nytt hver gang, med mulighet til å avlyse enkeltdatoer uten å påvirke resten av avtalen.",
    },
    {
      question: "Hvorfor koster et fotostudio mer per time enn et øvingsrom?",
      answer:
        "Fordi prisen på et fotostudio i hovedsak reflekterer utstyret, som cyc-vegg og lysrigg, ikke bare selve rommet, mens et øvingsrom eller atelier har lavere utstyrskostnad per kvadratmeter.",
    },
    {
      question:
        "Kan jeg reservere et lokale eksklusivt til en sammenhengende produksjon eller et kurs?",
      answer:
        "Ja, en avgrenset periode kan bookes som én eksklusiv reservasjon, slik at ingen andre kan booke rommet mens produksjonen eller kurset pågår.",
    },
  ],
  "bryllupslokale-typer-gard-hage-sal-unikt-lokale": [
    {
      question: "Kan jeg ha bryllup ute og innendørs backup samtidig?",
      answer:
        "Ja, det er standard løsning hos de fleste gårder og noen selskapslokaler med hageareal. Spør om reserveplanen er inkludert i prisen eller om den koster ekstra hvis den faktisk brukes.",
    },
    {
      question: "Trenger hagebryllup alltid egen skjenkebevilling?",
      answer:
        "Nesten alltid, siden private eiendommer sjelden har fast bevilling. Søk hos kommunen der lokalet ligger i god tid, gjerne to til tre måneder før datoen.",
    },
    {
      question: "Er unike lokaler dyrere enn tradisjonelle selskapslokaler?",
      answer:
        "Ikke nødvendigvis, men de mangler ofte fast inventar og catering, så legg inn kostnad for innleie av stoler, bord, service og eventuelt kjøkkenløsning før du sammenligner totalpris, ikke bare leieprisen.",
    },
    {
      question:
        "Hvilken lokaltype passer best for et lite bryllup under 50 gjester?",
      answer:
        "Hage, privat eiendom eller en mindre gårdsstue gir best forhold mellom pris og atmosfære for få gjester, mens store selskapslokaler og hoteller ofte har minstepris uavhengig av gjestetall.",
    },
  ],
  idrettshall: [
    {
      question: "Hvordan avbestiller jeg en booket time?",
      answer:
        "Avbestilling av idrettshall bør gjøres i samme portal som bookingen, innen en frist kommunen setter, for eksempel 24 eller 48 timer før. Frigitt tid går umiddelbart tilbake som ledig, slik at andre kan booke den.",
    },
    {
      question: "Må jeg betale, og når?",
      answer:
        "Det avhenger av leietaker og formål. Barne- og ungdomslag har ofte gratis eller subsidiert tid, mens kommersielle leietakere betaler etter takst. Betaling håndteres enten i bookingflyten eller ved faktura, avhengig av kommunens ordning.",
    },
    {
      question: "Hvem har prioritet når flere lag vil ha samme tid?",
      answer:
        "Prioriteringen følger kommunens vedtatte kriterier, der barne- og ungdomsidrett vanligvis rangeres foran voksenmosjon, og lag med mange aktive foran mindre grupper. Kriteriene er synlige i systemet, slik at tildelingen kan etterprøves.",
    },
    {
      question: "Kan et lag frigi en fast tid det ikke skal bruke?",
      answer:
        "Ja. Et lag som melder fra at det ikke trener en gitt uke, frigir tiden til enkeltbooking. Dette er en av de enkleste måtene å heve belegget på uten å bygge mer.",
    },
  ],
  "idrettshall-fast-trening-bedrift-samlefaktura": [
    {
      question: "Kan vi bytte ukedag midt i sesongen?",
      answer:
        "Ja, men det avhenger av at ønsket tidspunkt er ledig i hallen. Send endringsønsket til administrator i god tid, så sjekkes tilgjengelighet før avtalen justeres.",
    },
    {
      question: "Kan avtalen dekke flere lokasjoner samtidig?",
      answer:
        "Ja. En bedrift med ansatte på flere kontorsteder kan sette opp separate faste avtaler i ulike haller, administrert av samme brukere og fakturert samlet dersom det er ønskelig.",
    },
    {
      question:
        "Hva skjer hvis vi vil avslutte hele avtalen før sesongen er ferdig?",
      answer:
        "Avtalen kan sies opp med varslingsfrist, og bedriften faktureres kun for uker som allerede er brukt eller ligger innenfor fristen, ikke for resten av perioden.",
    },
    {
      question: "Må alle ansatte ha egen konto for å bruke tilbudet?",
      answer:
        "Nei. Avtalen administreres av utpekte kontaktpersoner i bedriften, og ansatte trenger ikke egen konto for selve treningen, bare beskjed om tid og sted.",
    },
  ],
  "idrettshall-ledige-tider-book-mobil-sanntid-privatperson": [
    {
      question: "Kan jeg booke en enkelttime uten å tilhøre et lag?",
      answer:
        "Ja, fri kapasitet og restplasser er åpne for privatpersoner, uavhengig av lagsmedlemskap.",
    },
    {
      question: "Hvor ofte oppdateres ledige tider?",
      answer:
        "Kalenderen oppdateres i sanntid. Blir en time avbestilt, er den bookbar for andre innen få minutter.",
    },
    {
      question:
        "Kan jeg se ledig idrettshall i nærheten uten å vite navnet på hallen?",
      answer:
        "Ja, du filtrerer på kommune eller område, og Digilist viser alle haller med ledig kapasitet innenfor det du søker.",
    },
    {
      question: "Koster det noe å stå på venteliste?",
      answer:
        "Nei, det koster ikke noe å sette seg på venteliste. Du betaler først når du bekrefter en tildelt restplass.",
    },
    {
      question: "Hva skjer om jeg glemmer avbestillingsfristen?",
      answer:
        "Du får varsel før fristen går ut. Avbestiller du for sent, kan hallens gebyrregler gjelde, dette står tydelig ved booking.",
    },
  ],
  "idrettshall-ledige-tider-booking-samlet-guide-lagledere": [
    {
      question: "Kan laget booke uten sesongtildeling?",
      answer:
        "Ja, gjennom restplasser, men tilgangen er mindre forutsigbar enn en fast sesongtildeling.",
    },
    {
      question: "Hvor ofte oppdateres ledige tider?",
      answer:
        "I et sanntidssystem skjer oppdateringen umiddelbart ved booking eller avbestilling, ikke på faste intervaller.",
    },
    {
      question: "Hva skjer om vi avbestiller for sent?",
      answer:
        "De fleste kommuner belaster et gebyr, og timen kan uansett bli stående tom dersom den ikke frigis i tide til at et annet lag rekker å booke den.",
    },
    {
      question: "Kan flere personer i laget booke samtidig?",
      answer:
        "Ja, dersom klubben har flere brukere knyttet til samme lagkonto, kan trener og lagleder booke fra hver sin innlogging uten å overskrive hverandre.",
    },
    {
      question:
        "Hva skjer med treningstiden hvis hallen stenges for vedlikehold?",
      answer:
        "Kommunen bør varsle berørte lag i forkant og tilby erstatningstid eller flytte økten til en annen hall. I et system med sanntidskalender ser dere umiddelbart hvilke tider som er merket som stengt, i stedet for å møte opp til en låst dør.",
    },
  ],
  "kommunalt-bookingsystem-hva-er-det": [
    {
      question: "Kan vi bruke Calendly eller Google Calendar i stedet?",
      answer:
        "Til interne møterom kan det fungere, men det mangler ID-porten-pålogging, rollestyrt saksbehandling, kommunale satser og dokumentert datalokasjon. Til innbyggerrettet utleie holder det ikke.",
    },
    {
      question: "Hvor lagres dataene?",
      answer:
        "Krev at leverandøren dokumenterer lagring innenfor EU/EØS, og helst i Norge, med navngitte underleverandører i databehandleravtalen.",
    },
    {
      question: "Hvordan får lag og foreninger tilgang?",
      answer:
        "En verifisert kontaktperson logger inn via ID-porten og knyttes til organisasjonen, slik at foreningen kan booke mens kommunen ser hvem som er ansvarlig.",
    },
    {
      question: "Hva skjer med personopplysningene ved klage eller innsyn?",
      answer:
        "Alle beslutninger logges, slik at kommunen kan dokumentere hvem som søkte, hvem som godkjente og på hvilket grunnlag, som er nødvendig både for GDPR-innsyn og klagebehandling.",
    },
    {
      question: "Hvor lang tid tar det å komme i gang?",
      answer:
        "Med ryddig datagrunnlag tar det typisk 6 til 10 uker, avhengig av antall anlegg og integrasjoner.",
    },
  ],
  "leie-utstyr-til-fest-telt-bord-lyd-servering": [
    {
      question: "Kan jeg leie bare utstyr uten å leie lokale?",
      answer:
        "Ja, de fleste utleiere av telt, lyd og kjøkkenutstyr leier ut uavhengig av lokale, for eksempel hvis dere holder arrangementet hjemme eller i egen hage.",
    },
    {
      question: "Hvor lenge varer en vanlig leieperiode?",
      answer:
        "De fleste leverandører regner leie per døgn eller helg. Skal dere rigge dagen før og rydde dagen etter, spør om leieperioden dekker hele perioden, eller om dere betaler ekstra dager.",
    },
    {
      question: "Hva skjer hvis utstyret blir skadet eller forsinket?",
      answer:
        "Depositumet dekker normalt mindre skader, mens større skader eller manglende retur kan koste mer enn depositumet. Forsinket levering fra leverandørens side gir dere som regel rett til prisavslag, men sjekk alltid leiebetingelsene før dere signerer.",
    },
  ],
  "rapportering-statistikk-lokalbruk-private-utleiere": [
    {
      question: "Hva bør en rapport for utleieobjekter inneholde?",
      answer:
        "Som et minimum bør den dekke belegg (per lokale, ukedag og periode), inntekt og kostnad per objekt avstemt mot det som faktisk er betalt, og bruksmønster over sesong. Til sammen gir dette grunnlaget for både budsjettanalyse og ressursoptimalisering.",
    },
    {
      question:
        "Hvordan brukes rapportering i budsjettarbeidet til en utleier?",
      answer:
        "Rapportene viser hvilke objekter som bærer driften og hvilke som ikke gjør det, hvor avvik mellom budsjettert og faktisk inntekt oppstår, og hvor tapt inntekt fra avlysning eller no-show kan reduseres.",
    },
    {
      question:
        "Kan rapportering på belegg og inntekt hentes automatisk fra et bookingsystem?",
      answer:
        "Ja, forutsatt at booking, betaling og avlysning håndteres i samme plattform. Da bygges rapportene løpende av den faktiske aktiviteten, uten at du selv må samle tall fra flere kalendere eller regneark.",
    },
    {
      question: "Hvordan brukes bruksstatistikk til å optimalisere lokalene?",
      answer:
        "Bruksmønster over tid viser hvilke objekter som bør prises opp, hvilke som bør markedsføres mer, og hvor kapasitet bør flyttes fra et lokale med lavt belegg til et med venteliste, i stedet for å la hvert objekt driftes isolert.",
    },
  ],
  "spesiallokaler-niche-utleie-teaterscene-kjeller": [
    {
      question:
        "Må lokalet passe inn i en av de forhåndsdefinerte typene for å publiseres?",
      answer:
        "Nei, dere velger nærmeste type i veiviseren, men beskrivelsen og bildene er det som faktisk formidler lokalets egenart til leietaker.",
    },
    {
      question:
        "Er det verdt å publisere et lokale med lavt forventet søkevolum?",
      answer:
        "Ja, summen av alle spesiallokaler utgjør et reelt marked, og et lokale som ikke er synlig noe sted taper automatisk til et dårligere, men søkbart alternativ.",
    },
    {
      question:
        "Kan et spesiallokale leies ut både til enkelthendelser og faste avtaler?",
      answer:
        "Ja, samme sanntidskalender håndterer både en enkeltbooking til et fotoshoot og en fast avtale for gjentakende bruk.",
    },
    {
      question: "Kan bilder og beskrivelse endres etter publisering?",
      answer:
        "Ja, alt er redigerbart når som helst, uten at eksisterende bookinger påvirkes.",
    },
  ],
  "treningsrom-gymhaller-personlig-trener-fitnessinstruktor": [
    {
      question:
        "Kan en personlig trener booke samme treningsrom fast hver uke?",
      answer:
        "Ja, gjennom serietidsbestilling, slik at hele perioden bookes i én operasjon og enkeltøkter kan avlyses uten å påvirke resten av avtalen.",
    },
    {
      question:
        "Kan flere trenere og instruktører dele samme kalender hos en gymoperatør?",
      answer:
        "Ja, hvert treningsrom er en egen ressurs i kalenderen, og gymoperatøren ser alle bookinger på tvers av rom og trenere samlet, uten å måtte krysssjekke separate avtaler manuelt.",
    },
    {
      question:
        "Betaler treneren ved booking, eller faktureres det i etterkant?",
      answer:
        "Betaling skjer i samme flyt som bookingen, slik at gymoperatøren ikke trenger å purre selvstendige trenere for enkelttimer eller faste avtaler.",
    },
    {
      question:
        "Kan et treningsrom ha egen pris for enkelttimer og faste ukentlige avtaler?",
      answer:
        "Ja, prisen kan differensieres per rom, per tidspunkt og per avtaletype, slik at en fast ukentlig klient betaler en annen sats enn en enkeltbooking.",
    },
  ],
  "book-idrettshall-guide-ledige-tider-pris-avbestilling": [
    {
      question: "Kan jeg booke idrettshall samme dag?",
      answer:
        "Ja, hvis systemet viser sanntidsledighet og hallen ikke krever forhåndsgodkjenning.",
    },
    {
      question: "Hva skjer ved dobbeltbooking?",
      answer:
        "I et sanntidssystem skal det ikke være mulig, siden tiden sperres idet den bookes. Skjer det likevel, er det et tegn på at systemet ikke oppdaterer i sanntid, eller at to systemer brukes side om side for samme hall.",
    },
    {
      question: "Får jeg varsel hvis en time blir ledig?",
      answer:
        "Med kalendersynk og push-varsel, ja. Uten det må du sjekke manuelt, gjerne flere ganger om dagen i høysesong.",
    },
    {
      question: "Kan jeg booke flere haller samtidig til en turnering?",
      answer:
        "Ja, forutsatt at systemet viser ledighet på tvers av haller i samme oversikt. Booker du hallene hver for seg i separate systemer, må du selv holde styr på at ingen av tidene kolliderer.",
    },
    {
      question: "Må jeg betale med en gang jeg booker?",
      answer:
        "Det varierer. Enkelttimer betales ofte med kort i samme steg, mens sesongplass og turneringsbooking i kommunal regi normalt faktureres i etterkant.",
    },
  ],
  "bryllupslokale-pris-filter-sammenlign-favoritter": [
    {
      question: "Hva er et rimelig bryllupslokale?",
      answer:
        "Et selskapslokale eller kulturhus uten inkludert mat, der dere står for catering selv, gir vanligvis lavest grunnpris.",
    },
    {
      question:
        "Hvorfor varierer prisen så mye mellom lokaler med samme kapasitet?",
      answer:
        "Fordi lokaltype og hva som er inkludert i prisen varierer mer enn gjestetallet gjør.",
    },
    {
      question:
        "Kan jeg finne bryllupslokale nær meg innenfor et fast budsjett?",
      answer:
        "Ja, sett prisintervall og radius samtidig i filteret, så ser dere raskt hvilke lokaler i nærområdet som matcher budsjettet.",
    },
    {
      question:
        "Når bør vi bestille bryllupslokale for å få best pris og flest alternativer?",
      answer:
        "Start gjerne 12 til 18 måneder før datoen dere ønsker, spesielt hvis dere sikter mot høysesong eller et populært lokale.",
    },
  ],
  "hva-er-et-forsamlingslokale": [
    {
      question: "Er et grendehus det samme som et forsamlingslokale?",
      answer:
        "Et grendehus er som regel et forsamlingslokale i praksis, siden det er godkjent for at mange mennesker skal samles der. Betegnelsen «forsamlingslokale» er den tekniske og forsikringsmessige kategorien, mens «grendehus», «samfunnshus» og «festsal» er navnene kommunen bruker på de konkrete byggene.",
    },
    {
      question:
        "Kan private leie kommunale forsamlingslokaler til bryllup eller fest?",
      answer:
        "Ja, de fleste kommuner leier ut forsamlingslokaler til private arrangementer, men ofte med en annen pris og lengre søknadsfrist enn for lag og foreninger.",
    },
    {
      question: "Hvorfor tar noen bookinger lengre tid å behandle enn andre?",
      answer:
        "Møterom og enkle korttidsbookinger er ofte selvbetjente, mens forsamlingslokaler, haller og arrangementer krever manuell saksbehandling fordi flere hensyn, som kapasitet, prioritering og eventuell konflikt med andre søknader, må vurderes.",
    },
    {
      question: "Må jeg bruke ID-porten for å booke et kommunalt lokale?",
      answer:
        "Det avhenger av kommunen og lokaltypen, men stadig flere krever innlogging via ID-porten for å verifisere hvem som er ansvarlig for bookingen, særlig for forsamlingslokaler og arrangementer.",
    },
    {
      question: "Hvordan finner jeg ut hvilken lokaltype jeg trenger?",
      answer:
        "Ta utgangspunkt i antall deltakere og formålet med samlingen. Et møte for fem personer trenger et møterom, mens et bryllup for hundre gjester trenger et forsamlingslokale med tilstrekkelig godkjent kapasitet.",
    },
  ],
  "idrettshall-enkelttime-uten-lag-privatperson": [
    {
      question: "Hvorfor var timen ledig i går, men borte i dag?",
      answer:
        "En tid som var ledig i går kan være borte i dag fordi et lag har fått tildelt sesongtime i samme slot, eller fordi en annen enkeltbooking kom inn først. Sanntidsvisning løser det meste av forvirringen, siden kalenderen alltid viser status akkurat nå, ikke et øyeblikksbilde fra i går.",
    },
    {
      question: "Kan jeg sette meg på venteliste for en populær tid?",
      answer:
        "Ja, ved høy pågang kan du legge deg på venteliste for populære tidspunkt, typisk fredag og lørdag kveld, og du varsles automatisk dersom en time frigis ved avbestilling.",
    },
    {
      question: "Får jeg varsel hvis timen min blir flyttet?",
      answer:
        "Ja, du varsles på e-post eller SMS med det samme, og bookingen inkluderer alltid forslag til ny tid eller informasjon om refusjon.",
    },
    {
      question: "Må jeg være bosatt i kommunen for å booke?",
      answer:
        "Nei, enkelttimer i de fleste haller er åpne uavhengig av bosted, i motsetning til enkelte sesongtildelinger som er forbeholdt lag registrert i kommunen.",
    },
  ],
  "idrettshall-ledige-tider-book-enkelttime-privatperson": [
    {
      question: "Må jeg være medlem av et lag for å leie idrettshall?",
      answer:
        "Nei, ledig tid kan bookes av privatpersoner og bedrifter uten medlemskap.",
    },
    {
      question: "Kan jeg booke bare noen timer, eller må jeg leie en hel dag?",
      answer:
        "De fleste haller selger tid i enkelttimer, gjerne med minimum én time.",
    },
    {
      question: "Hvor lang tid i forveien kan jeg booke?",
      answer:
        "Det varierer, men mange haller åpner ledig tid to til fire uker frem, noen kortere.",
    },
    {
      question: "Får jeg garderobe og utstyr med i prisen?",
      answer:
        "Sjekk alltid hva som er inkludert, garderobe følger ofte med, utstyr som baller eller matter kan koste ekstra.",
    },
    {
      question:
        "Kan jeg booke idrettshall til et bedriftsarrangement og ikke bare privat fest?",
      answer:
        "Ja, de fleste haller skiller ikke mellom privat og bedrift så lenge du betaler full sats og oppgir riktig formål ved booking.",
    },
    {
      question: "Hva skjer hvis arrangementet varer lenger enn planlagt?",
      answer:
        "Booker du for kort tid og trenger mer, må du sjekke om neste time er ledig og booke den i tillegg. Hallen er normalt ikke tilgjengelig utover tidsrommet du har betalt for, siden neste booking kan starte rett etter.",
    },
  ],
  "idrettshall-ledige-tider-booking-driftsleder-prioritering-skole-lag-privat":
    [
      {
        question: "Kan to lag booke samme hall samtidig?",
        answer:
          "Ja, hvis hallen er delt i flater og de bruker hver sin bane. Systemet regner det ikke som dobbeltbooking.",
      },
      {
        question: "Hva hindrer dobbeltbooking?",
        answer:
          "En bekreftet booking sperrer flaten umiddelbart, og kolliderende forespørsler markeres før de kan godkjennes.",
      },
      {
        question: "Går sesongtildeling foran enkelttime?",
        answer:
          "Ja, når reglementet sier det. Rekkefølgen er en innstilling du styrer selv.",
      },
      {
        question: "Hva skjer med en frigjort sesongtid?",
        answer:
          "Den kan tilbys venteliste automatisk, i prioritert rekkefølge.",
      },
      {
        question: "Hvordan håndteres for sene avbud?",
        answer:
          "Setter du en avbudsfrist, skiller systemet rettidige avbud fra sene, og gjentatte sene avbud blir synlige i loggen per lag.",
      },
      {
        question: "Kan jeg endre prioriteringen midt i sesongen?",
        answer:
          "Ja. Reglene er innstillinger, og en endring gjelder for alle haller fra den lagres.",
      },
    ],
  "idrettshall-turnering-flere-haller-blokkbooking-samlefaktura": [
  ],
  "leie-pa-digilist-bestilling-betaling-avbestilling": [
    {
      question: "Må jeg signere en egen kontrakt i tillegg til bestillingen?",
      answer:
        "For de fleste bestillinger er vilkårene i bestillingsbekreftelsen den avtalen som gjelder. Ved store arrangementer, for eksempel leie av en gård til bryllup over flere dager, kan utleier i tillegg legge ved en egen avtale du må signere før leieperioden starter.",
    },
    {
      question: "Kan jeg forhandle prisen?",
      answer:
        "Hos private utleiere kan du ofte forhandle, særlig ved lengre leieperioder eller lavsesong. Hos kommunale objekter følger prisen et fastsatt regulativ, og den er ikke forhandlbar uansett hvem som booker.",
    },
    {
      question: "Hva om jeg må bytte dato etter at jeg har betalt?",
      answer:
        "Det håndteres som beskrevet under avbestilling og endring: mange utleiere lar deg bytte uten kostnad i god tid før leiestart, men jo nærmere leiedatoen du er, jo mer ligner det økonomisk på en avbestilling.",
    },
    {
      question:
        "Får jeg en kvittering jeg kan bruke til refusjon fra arbeidsgiver eller forening?",
      answer:
        "Ja. Fordi betalingen går gjennom Digilist og ikke direkte til utleier, får du én samlet kvittering per bestilling, uavhengig av om du leier lokale, utstyr eller tjeneste.",
    },
  ],
  "rapportering-analyser-kommunale-lokaler": [
    {
      question: "Hva bør en rapport om kommunale lokaler inneholde?",
      answer:
        "Som et minimum bør rapporteringen dekke arealutnyttelse (belegg per lokale, bygning og tidsrom), leieinntekter (per lokale, brukergruppe og periode, avstemt mot regnskapet) og bruksmønster (sesongvariasjon og utvikling over tid per brukergruppe). Disse tre gir til sammen grunnlaget for både budsjettering og planlegging.",
    },
    {
      question: "Hvordan brukes rapportering i kommunens budsjettarbeid?",
      answer:
        "Rapportene gir de faktiske tallene bak budsjettforslaget: hvilke anlegg som gir hvilken inntekt, hvor belegget er høyt nok til å forsvare investering, og hvor avvik mellom budsjettert og faktisk inntekt oppstår tidlig nok til å justeres i løpet av året.",
    },
    {
      question:
        "Kan rapportering på arealutnyttelse og leieinntekter hentes automatisk fra et bookingsystem?",
      answer:
        "Ja, forutsatt at booking, betaling og avlysning håndteres i samme plattform. Da bygges rapportene løpende av den faktiske aktiviteten, uten at noen manuelt må samle tall fra flere regneark eller systemer før hvert møte.",
    },
    {
      question: "Hvem i kommunen trenger tilgang til rapporteringen?",
      answer:
        "Behovet varierer med rollen. Driftsledere trenger detaljert belegg per anlegg for den daglige styringen, økonomiavdelingen trenger avstemte inntektstall, og administratorer og kommunestyret trenger et samlet overblikk til budsjett- og planleggingssaker. En god løsning gir hver rolle det nivået den faktisk trenger.",
    },
  ],
  "spesialiserte-idrettssteder-tennis-bowling-basketball-gym": [
    {
      question:
        "Kan et lag booke flere tennisbaner eller basketballbaner samtidig til en turnering?",
      answer:
        "Ja, flere baner kan bookes i samme operasjon for en avgrenset periode, med eksklusiv tilgang til anlegget mens turneringen pågår.",
    },
    {
      question:
        "Kan en privatperson booke en enkelt time uten å tilhøre en klubb?",
      answer:
        "Ja, ledig tid i sanntid kan bookes direkte av enkeltpersoner, med betaling i samme flyt, uten å tilhøre et lag eller en forening.",
    },
    {
      question: "Kan et lag sikre samme bane hver uke gjennom hele sesongen?",
      answer:
        "Ja, gjennom serietidsbestilling bookes hele sesongen i én operasjon, med mulighet til å avlyse enkeltuker uten å påvirke resten av avtalen.",
    },
    {
      question: "Vises utstyr og baneforhold før jeg bekrefter bookingen?",
      answer:
        "Ja, hver anleggstype viser egne detaljer, som dekketype for tennisbaner eller tilgjengelig utstyr for gym, slik at du vet nøyaktig hva du booker.",
    },
  ],
  "trenings-og-badeanlegg-booking-treningsgrupper-svommeklubber": [
    {
      question:
        "Kan en treningsgruppe booke gym eller styrkerom fast hver uke?",
      answer:
        "Ja, gjennom serietidsbestilling for enkeltsesonger eller sesongtildeling for hele sesonger, avhengig av hvor lenge avtalen skal vare.",
    },
    {
      question: "Får svømmeklubber egen pris?",
      answer:
        "Ja, registrerte foreninger får gruppetakst verifisert mot Frivillighetsregisteret, synlig i kalenderen før bestilling.",
    },
    {
      question: "Kan vi booke basseng utenom klubbtidene?",
      answer:
        "Ja, ledige enkelttimer i basseng vises i sanntid ved siden av de faste klubbtidene.",
    },
    {
      question: "Hva skjer om en fast tildelt time blir ledig?",
      answer:
        "Den vises umiddelbart som enkelttime for andre å booke, uten at sesongavtalen endres.",
    },
  ],
  "bryllup-totalbudsjett-catering-dekor-dj-overnatting": [
    {
      question: "Hva koster et bryllup for 80 gjester i 2026?",
      answer:
        "For 80 gjester i et selskapslokale i midtsesong ligger et realistisk totalbudsjett mellom 155 000 og 267 000 kroner. Lokalet står for 25 000 til 45 000 kroner, catering 72 000 til 120 000, alkoholpakke 32 000 til 56 000, dekor og blomster 15 000 til 25 000, DJ og lyd 8 000 til 15 000, og rengjøring og vakthold 3 000 til 6 000 kroner. Overnatting kommer i tillegg.",
    },
    {
      question: "Hva koster catering per gjest i et bryllup?",
      answer:
        "En tre retters middag med servering ligger normalt på 900 til 1 500 kroner per gjest i 2026. Buffet er som regel 15 til 20 prosent billigere enn sittende servering med kelnere. Kake, kaffe og kveldsmat kommer ofte i tillegg, gjerne 150 til 250 kroner per gjest ekstra. Mange cateringfirmaer tilbyr halv pris for gjester under 12 år.",
    },
    {
      question: "Hva koster overnatting til bryllupsgjestene?",
      answer:
        "Et rom på nærmeste hotell eller pensjonat koster typisk 1 200 til 2 000 kroner per natt i 2026. Booker dere en blokk med rom for 20 til 30 gjester, kan det gi rabatt på 10 til 15 prosent fra enkelte overnattingssteder. Ligger nærmeste overnatting mer enn 20 minutter unna, bør dere også sette av 3 000 til 6 000 kroner til shuttlebuss.",
    },
    {
      question: "Hvordan kan vi spare penger uten å kutte gjestelisten?",
      answer:
        "Velg en hverdag eller lavsesong, altså januar til april eller oktober til november, der leieprisen på lokalet kan være 20 til 30 prosent lavere enn i juni og juli. Buffet fremfor sittende servering sparer typisk 15 til 20 prosent på cateringposten. Bruk lokalets eget lydanlegg, bestill overnatting i blokk tidlig, og spør om pakkepris når catering, dekor og bar bestilles samlet.",
    },
  ],
  "bryllupsbudsjett-totalpris-catering-utstyr-overnatting": [
    {
      question: "Hvor mye av bryllupsbudsjettet går til mat og drikke?",
      answer:
        "Mat og drikke utgjør normalt 40 til 50 prosent av totalbudsjettet. Prisen per kuvert varierer typisk fra 900 til 1 800 kroner for en tre retters middag med enkel drikkepakke, og opp mot 2 500 kroner for en full alt inkludert-pakke med aperitiff, vin til maten og kaffe. Ved 100 gjester utgjør det alene 90 000 til 250 000 kroner.",
    },
    {
      question: "Hva koster overnatting til bryllupsgjester nær lokalet?",
      answer:
        "Et dobbeltrom på hotell nær lokalet koster typisk 1 200 til 2 200 kroner natten i høysesong, mens en hytte eller et feriehus for flere kan ligge på 3 000 til 6 000 kroner natten. Overnatting innen gangavstand er ofte 20 til 30 prosent dyrere enn tilsvarende tilbud noen kilometer unna. Mange gir 10 til 15 prosent rabatt ved blokkbooking av fem rom eller flere.",
    },
    {
      question: "Hvilke skjulte kostnader kommer på toppen av leieprisen?",
      answer:
        "Regn med at de skjulte postene til sammen kan legge 10 000 til 25 000 kroner på toppen av leieprisen. Det gjelder overtid utover avtalt tidsrom, ofte 1 500 til 3 000 kroner per time, rydding og vask på 2 000 til 5 000 kroner, skjenkebevilling hvis lokalet ikke har egen, forsikring mot skader på 500 til 1 500 kroner for en kveld, og strømforbruk utover normalt.",
    },
    {
      question: "Når forfaller betalingen for bryllupslokale og catering?",
      answer:
        "De fleste lokaler og cateringleverandører krever et forskudd ved signering, ofte 20 til 30 prosent av totalprisen, for å sikre datoen. Restbeløpet forfaller som regel 14 til 30 dager før bryllupet, når endelig gjesteantall er bekreftet. Fotograf og DJ krever ofte forskudd ved bestilling, mens catering fakturerer basert på endelig gjestetall nærmere datoen.",
    },
  ],
  "bryllupslokale-befaring-catering-overnatting-plan": [
    {
      question: "Når bør du begynne å se etter bryllupslokale?",
      answer:
        "Ønsker dere en lørdag i høysesongen mai til september, bør søket starte 12 til 18 måneder før. Med fleksibel dato eller ukedag holder det med 6 til 9 måneder, og i lavsesong eller ved kort planlegging 3 til 5 måneder. Gods, hovedgårder og signaturlokaler kan være fullbooket på attraktive lørdager mer enn ett år i forkant.",
    },
    {
      question: "Hva bør du sjekke på befaring av bryllupslokalet?",
      answer:
        "Gå gjennom lokalet på samme tid på døgnet som bryllupet skal foregå, slik at lyset er representativt. Sjekk kapasitet ved sittende middag versus stående mingling, akustikk med og uten musikk, temperatur og ventilasjon i et rom fullt av folk, avstand fra kjøkken til servering, og om vinduene kan mørklegges. Noter strømuttak og internettdekning hvis dere skal ha band, dj eller fotoboks.",
    },
    {
      question: "Hvor langt unna lokalet bør bryllupsgjestene overnatte?",
      answer:
        "Søk overnatting innenfor 10 til 15 minutters gange, eller avtal shuttlebuss om det ikke finnes hotell i nærheten. Book en blokk med rom tidlig, gjerne samtidig som dere bekrefter lokalet, siden hotell nær populære selskapslokaler fylles opp av samme kunder som booker lokalet selv. Spør hotellet om gruppepris ved 10 til 15 rom, og gi gjestene en bookingfrist.",
    },
    {
      question: "I hvilken rekkefølge bør bryllupsbestillingene gjøres?",
      answer:
        "Bekreft lokale og dato først, og signer kontrakten så snart depositumet er avklart. Lås catering og lyd innen 2 måneder etter det. Book hotellblokk samtidig som lokalet, siden rom nær populære lokaler forsvinner raskt. Bekreft dekor og siste detaljer 4 til 6 uker før dagen, og send en samlet kjøreplan til alle leverandørene en uke før bryllupet.",
    },
  ],
  "bryllupslokale-catering-dj-overnatting-samlet-bestilling": [
    {
      question:
        "I hvilken rekkefølge bør lokale, catering og overnatting bookes?",
      answer:
        "Dato og lokale kommer først, siden gjestetall, budsjett og hvor gjestene skal bo regner seg ut fra dem. Deretter bør overnatting avklares, fordi de beste alternativene nær lokalet forsvinner raskest. Catering kan vente til lokalet er bekreftet, men bør bestilles i god tid. Dekorasjon, lyd, lys og DJ har lengst tidsvindu og kan bookes noen måneder før.",
    },
    {
      question: "Hvilke cateringmodeller kan man velge til bryllup?",
      answer:
        "Tre modeller går igjen. Fullservice fra lokalet, der stedet leverer mat, servering og ofte servise selv, er enklest å administrere, men bindende. Ekstern cateringleverandør gir fritt valg av tilbyder, men lokalet må tillate ekstern mat, og noen krever påslag eller egen godkjenning. Selvcatering er rimeligst per gjest, men krever fullverdig kjøkken og folk som tar ansvar på selve dagen.",
    },
    {
      question: "Hvorfor bør overnatting til gjestene bookes tidlig?",
      answer:
        "Sommermånedene er høysesong for bryllup i Norge, og i populære reisemål som Lillehammer, Sørlandet og fjordstrøkene fylles de nærmeste overnattingsstedene raskere opp i denne perioden. Venter dere til lokalet er bekreftet, risikerer dere at de nærmeste alternativene er utsolgt. Reserver et rombudsjett hos ett eller to steder tidlig, og juster antallet nærmere datoen.",
    },
    {
      question:
        "Hvordan holder man styr på avbestillingsfrister hos flere leverandører?",
      answer:
        "Hver leverandør har sine egne vilkår for depositum, avbestilling og ansvar, og de stemmer sjelden overens. Lokalet kan ha én frist, cateringleverandøren en annen og overnattingsstedet en tredje. Skriv opp avbestillingsfrist, depositum og hvem som har ansvar for skader eller avlysning hos hver enkelt leverandør før dere signerer, og legg dem i samme kalender som selve bryllupsdatoen.",
    },
  ],
  "leie-alt-til-arrangementet-lokale-utstyr-tjenester-overnatting": [
    {
      question: "Hva koster det å leie sal til et selskap med 80 gjester?",
      answer:
        "En sal for 80 personer i et grendehus koster typisk 3 000 til 6 000 kroner for en helg, mens et dedikert selskapslokale med kjøkken, scene og garderobe fort ligger på 8 000 til 15 000 kroner. Sjekk alltid hva prisen faktisk inkluderer: noen lokaler tar separat betalt for opprydding og for bord og stoler, mens andre har alt inkludert i leieprisen.",
    },
    {
      question: "Hvor mange gjester får plass til sittende middag?",
      answer:
        "Til bryllup og konfirmasjon med sittende middag trenger dere typisk mer plass per gjest enn til en stående mingle-fest. Kapasiteten som oppgis på nettsiden er ofte maksimum ved møblering til konsert eller stående mingling, ikke ved bankettoppsett med runde bord. Regn heller 60 til 70 prosent av oppgitt tall til sittende middag.",
    },
    {
      question: "Hva koster det å leie utstyr til festen?",
      answer:
        "Et enkelt lydanlegg med mikrofon starter rundt 800 kroner for en kveld, et selskapstelt til 50 gjester ligger gjerne på 2 500 til 4 000 kroner, og en pakke med 60 stoler og 8 bord koster typisk 1 500 til 2 500 kroner. Skal dere ha scene til taler eller DJ, kommer det som egen post, ofte 1 000 til 2 000 kroner.",
    },
    {
      question: "Hva koster overnatting til gjester som kommer langveisfra?",
      answer:
        "En hytte til 8 personer i nærheten av arrangementet koster ofte 2 500 til 4 500 kroner per natt, mens en leilighet for 4 gjerne ligger på 1 200 til 2 000 kroner. Book overnattingen tidlig, særlig i høysesong fra mai til august og rundt konfirmasjonshelger i mai, for de nærmeste og billigste alternativene forsvinner først.",
    },
    {
      question: "Hvor mye depositum må man regne med?",
      answer:
        "Depositum varierer med kategori. Lokaler krever ofte 15 til 25 prosent av leiesummen, utstyr gjerne et fast beløp på 500 til 1 500 kroner avhengig av verdi, mens tjenester som catering og fotograf sjelden krever depositum, men i stedet delbetaling ved bekreftelse på typisk 30 til 50 prosent. Avbestiller dere mer enn 14 dager før, får dere som regel depositumet tilbake i sin helhet.",
    },
  ],
  "idrettshall-turnering-flere-haller-overnatting-utstyr-arrangorkomite": [
    {
      question: "Hvor mange idrettshaller trenger en cup med 20 lag?",
      answer:
        "En cup med 20 lag i én aldersklasse gir fort 60-70 kamper fordelt over en helg. Skal alle kampene gjennomføres innenfor to dager, rekker ikke én hall med to baner. Komiteen må leie tid i to eller tre haller parallelt, pluss en reservetime søndag formiddag i tilfelle forsinkelser fredag kveld.",
    },
    {
      question:
        "Hva er forskjellen på blokkbooking til turnering og fast sesongtildeling?",
      answer:
        "Sesongtildeling går gjennom idrettsrådets fordelingsnøkkel og gjelder faste ukedager over en hel sesong, typisk med søknadsfrist tre til seks måneder før sesongstart. Et turneringsarrangement er en engangssøknad om blokkbooking av hele hallen, eller store deler av den, over en avgrenset helg, med kortere behandlingstid, men fortsatt med saksbehandling som kan ta et par uker.",
    },
    {
      question: "Hvordan booker man overnatting til gjestelag under en cup?",
      answer:
        "Gjestelag som reiser fra en annen landsdel trenger sovesal, ofte i samme bygg eller i en nærliggende skole. Bestilles hall og overnatting hver for seg, oppstår lett datoavvik der hallen er booket fredag til søndag og sovesalen bare til lørdag. Legg overnattingen inn i samme bestilling som hallene, med samme datoer på begge.",
    },
    {
      question: "Når bør utstyr til sekretariatet bestilles?",
      answer:
        "Resultattavle, sekretariatsbord og baller bør bestilles i samme prosess som selve hallbookingen, ikke som en etterfølgende tilleggsforespørsel sendt etter at hallene allerede er bekreftet. Bestilles utstyret separat og sent, er risikoen at det som var ledig da hallen ble booket, er utleid til et annet arrangement samme helg.",
    },
  ],
  "hva-koster-det-a-leie-selskapslokale-moterom": [
    {
      question: "Hva koster et møterom for 6-10 personer per time?",
      answer:
        "Møterom for 6-10 personer koster typisk fra 300-800 kroner timen. Beliggenhet og innhold styrer resten: lokaler i Oslo sentrum koster mer enn tilsvarende lokaler i mindre byer, og bord, stoler, lyd- og bildeutstyr, kjøkken og vask trekker prisen opp hvis det ikke er inkludert i grunnprisen.",
    },
    {
      question: "Hva koster et selskapslokale til 50-150 gjester?",
      answer:
        "Selskapslokaler for 50-150 gjester ligger ofte mellom 8000 og 25000 kroner for en kveld. Beliggenhet slår kraftig ut: lokaler i Oslo sentrum koster mer enn tilsvarende lokaler i mindre byer, og ifølge Sentralens egne priser koster de største selskapslokalene med fullt utstyr over 30000 kroner for en kveld. Helg og kveld koster som regel mer enn hverdag på dagtid.",
    },
    {
      question: "Hvordan booker jeg et selskapslokale uten å ringe rundt?",
      answer:
        "Du søker opp lokale etter sted og dato, ser ledig kapasitet i en sanntidskalender, velger tidspunkt og betaler direkte i bookingen. Bekreftelsen kommer automatisk, uten e-postutveksling frem og tilbake med utleier. Digilist tar ikke betalt av deg for å bruke plattformen, det er utleier som setter prisen, og Digilist tar en mindre transaksjonsavgift for sanntidsbetalingen.",
    },
  ],
  "selskapslokaler-typer-og-hvordan-velge": [
    {
      question: "Hvilke typer selskapslokaler finnes?",
      answer:
        "De fleste selskapslokaler i Norge faller i fire kategorier: grendehus og bygdehus, som er enkle og rimelige og eid av en bygdelagsforening eller stiftelse; kulturhus og kommunale festsaler, ofte med scene eller lydanlegg og priset nær selvkost; klubbhus og foreningslokaler, der prisen ofte er lavere for medlemmer; og private festlokaler, gårder, hoteller og restauranter med høyere standard og prisnivå.",
    },
    {
      question: "Hva koster det å leie et selskapslokale?",
      answer:
        "Prisen henger sammen med kategori og hva som er inkludert. Et grendehus starter gjerne på 1 500–4 000 kroner per dag, mens et privat festlokale med servering fort lander på 15 000–40 000 kroner eller mer. Grendehus, kulturhus og klubbhus ligger lavest, mens private festlokaler ligger høyere fordi servering og personale ofte er inkludert i prisen.",
    },
    {
      question: "Hvor mange gjester rommer et selskapslokale?",
      answer:
        "Kapasitet oppgis nesten alltid i to tall: sittende ved bord og stående. De fleste grendehus, kulturhus og klubbhus er dimensjonert for 20–60 gjester, og det er her flest bursdager og jubileer havner. 60–120 gjester krever en større sal i et kulturhus, en gård eller et hotell. Et lokale som oppgir «inntil 150 personer» mener som regel stående.",
    },
    {
      question: "Hva bør jeg sjekke før jeg booker selskapslokale?",
      answer:
        "Sjekk kapasitet sittende, ikke bare lokalets oppgitte maksgrense for stående. Avklar om du kan lage mat selv eller må bruke lokalets faste catering, hvor mye av depositumet som holdes tilbake ved skade eller manglende vask, og hva som gjelder for parkering, tilgjengelighet, sluttidspunkt og støygrenser. Lørdager i høysesong bookes opp først.",
    },
  ],
  "leie-selskapslokale-bryllup-fest": [
    {
      question: "Hvor kan jeg leie et selskapslokale til bryllup eller fest?",
      answer:
        "De vanligste stedene å lete er bookingplattformer som Digilist, der du søker etter ledig dato og reserverer direkte; katalogtjenester som Selskapslokaler.no, der lokaler er listet opp og du kontakter hver enkelt selv; eventmarkedsplasser som Eventum; og direkte hos eier, altså grendehus, idrettslag, menighetshus og private festlokaler. En katalog viser deg lokalet, en bookingplattform lar deg fullføre reservasjonen.",
    },
    {
      question:
        "Hvor lang tid før bør jeg booke et bryllups- eller festlokale?",
      answer:
        "Rundt 20 000 par gifter seg i Norge hvert år, ifølge Statistisk sentralbyrå, og populære lokaler til bryllup og store fester bookes ofte 6 til 12 måneder i forveien. Lørdager i mai til september er de mest ettertraktede datoene. Er du fleksibel på ukedag, finner du oftere ledig plass på kortere varsel.",
    },
    {
      question: "Kan jeg leie kommunale lokaler og grendehus til privat fest?",
      answer:
        "Ja. Mange grendehus, kulturhus, samfunnshus og kommunale lokaler leies ut til private arrangementer som bryllup, konfirmasjon, bursdag og minnestund. På Digilist ligger de i samme kalender som private festlokaler, slik at du kan sammenligne et privat festlokale og det lokale grendehuset uten å bytte tjeneste underveis.",
    },
    {
      question: "Hva koster det å leie et selskapslokale?",
      answer:
        "Det finnes ingen fast nasjonal takst, og tre forhold styrer det meste: lokaltype, der grendehus, samfunnshus og lag- og foreningslokaler ligger lavere enn hotell-, restaurant- og rene selskapslokaler; dag og sesong, der lørdager i høysesong koster mer enn hverdager og lavsesong; og hva som er inkludert av bord, stoler, servise, kjøkken og renhold. Sammenlign totalpris, ikke bare grunnleien.",
    },
    {
      question:
        "Kan jeg leie selskapslokale til konfirmasjon, bursdag eller minnestund på samme måte?",
      answer:
        "Ja. Konfirmasjon, bursdag, jubileum, minnestund og firmafest bookes på samme måte som bryllup, ut fra dato, kapasitet og pris. Behovet er det samme uansett anledning: finne et lokale som er ledig på riktig dato, med plass til antallet gjester og til en pris du kjenner på forhånd.",
    },
  ],
  "bryllupslokale-typer-gard-hotell-selskapslokale-ute": [
    {
      question:
        "Hva koster bryllupslokale på gård, hotell, selskapslokale og uteareal?",
      answer:
        "Gård koster 15 000–40 000 kroner for selve lokaleleien, hotell 25 000–70 000 kroner, gjerne med pakkepris per kuvert på 800–1 400 kroner per gjest som dekker mat, drikke og servering. Selskapslokale koster 8 000–25 000 kroner for leien alene, og uteareal 5 000–15 000 kroner for grunnen, pluss 20 000–50 000 kroner for teltleie, gulv og oppvarming.",
    },
    {
      question: "Hvor mye billigere er bryllup utenfor høysesong?",
      answer:
        "Høysesong betyr juni til august og lørdager. Bytter dere til en fredag eller søndag i mai eller september, ser dere ofte 15 til 30 prosent lavere pris på både lokale og catering. Om vinteren faller uteareal i praksis bort som hovedlokale, og valget står mellom hotell, selskapslokale eller en gård med isolert låve.",
    },
    {
      question: "Hvilken lokaltype passer antall gjester?",
      answer:
        "Gård har vanlig kapasitet 40 til 150 gjester, avhengig av om låven har fast tak eller må suppleres med telt; et gårdsbryllup med 150 gjester krever telt i tillegg, ekstra toaletter og gjerne innleid kjøkken. Hotell passer godt fra 50 gjester og oppover og skalerer bedre til store selskaper. Selskapslokaler passer mellomstore selskaper, typisk 50 til 100 gjester.",
    },
    {
      question: "Hva koster det å regnsikre et utendørs bryllup?",
      answer:
        "Telt med tett tak, gulv og varmeovner koster typisk 20 000–50 000 kroner ekstra avhengig av størrelse og sesong, mens gårder med egen låve slipper denne kostnaden helt siden bygningen allerede er der. Noen utearealer krever egen forsikring for teltoppsett, og enkelte kommunale parker som Frognerparken krever i tillegg søknad om arrangement i god tid før dato.",
    },
  ],
  "leie-lokale-privat-fest-og-bedriftsevent": [
    {
      question: "Hva koster et julebordlokale?",
      answer:
        "Det finnes ingen fast pris; den varierer med lokaltype, kapasitet, ukedag og hvor mye som er inkludert av bord, stoler, kjøkken og rydding. Kommunale lokaler som grendehus, kulturhus og samfunnshus har ofte lavest pris, spesielt for lag og foreninger. Private selskapslokaler og restauranter koster mer, men har gjerne servering inkludert. Lag- og foreningslokaler ligger midt imellom.",
    },
    {
      question: "Når bør bedriften booke julebordlokale?",
      answer:
        "Populære datoer i november og desember bookes opp allerede i august og september, og de beste datoene blir booket ut i løpet av få uker. Et lokale som virker ledig på en statisk nettside kan allerede være tatt når du ringer. En kalender som oppdateres i sanntid viser at datoen er borte i det øyeblikket noen andre bekrefter.",
    },
    {
      question: "Hva bør jeg avklare før jeg signerer?",
      answer:
        "Sjekk kapasitet sittende, ikke stående; et julebord med tre-retters middag krever mer plass per gjest enn en enkel mingelfest. Avklar sluttidspunkt og støygrenser, avbestillingsfrist, om utleier kan levere fakturagrunnlag fremfor kortbetaling, og hva som forventes av rydding etter arrangementet, samt om det stilles depositum.",
    },
    {
      question: "Hva skiller behovene til bedrifter og privatpersoner?",
      answer:
        "Kravene til lokalet overlapper mye, men bedriftskunder legger typisk mer vekt på faktura fremfor kortbetaling, tydelig avbestillingsfrist når planene endres internt, og et lokale sentralt nok til at ansatte kan komme seg dit etter jobb. Privatpersoner legger mer vekt på pris per gjest og hvor tidlig de må booke for en bestemt lørdag.",
    },
  ],
  "bryllupslokale-kommune-godkjenning-vigsel-skjenkebevilling-catering-depositum":
    [
      {
        question: "Hva koster borgerlig vigsel i kommunen?",
        answer:
          "Borgerlig vigsel er gratis på kommunens ordinære vigselssted i åpningstiden. Vil dere gifte dere utenom, for eksempel en lørdag eller på et annet sted, tar mange kommuner et gebyr, typisk mellom 1 500 og 4 000 kroner. Prøvingsattest fra Skatteetaten må være klar før vielsen, og den er gyldig i fire måneder.",
      },
      {
        question:
          "Når trenger dere skjenkebevilling til bryllup i et kommunalt lokale?",
        answer:
          "Skal det serveres alkohol mot betaling, eller i et arrangement som ikke regnes som rent privat, trenger dere skjenkebevilling. For et enkeltarrangement søker dere om en ambulerende bevilling hos kommunen. Behandlingstiden er ofte to til fire uker, gebyret ligger typisk på noen hundre kroner opp til rundt 1 000 kroner, og en ansvarlig person over 20 år må stå oppført som skjenkeansvarlig.",
      },
      {
        question: "Hvor stort er depositumet på en kommunal festsal?",
        answer:
          "Depositum for en kommunal festsal ligger ofte mellom 2 000 og 5 000 kroner og betales tilbake når lokalet er levert rent og uskadd. Du hefter for skader utover normal slitasje, og manglende rydding trekkes gjerne fra. Ta bilder når dere overtar og når dere leverer, så har dere dokumentasjon hvis det oppstår uenighet.",
      },
      {
        question: "Hvilke regler gjelder for pynt i kommunale bryllupslokaler?",
        answer:
          "De fleste kommunale lokaler tillater pynt, men med grenser. Levende lys er ofte forbudt av brannhensyn, og LED-lys er alternativet. Konfetti, roseblader og glitter som er vanskelig å rydde blir gjerne avvist eller utløser et rengjøringsgebyr. Teip og spiker i vegger er sjelden tillatt, så løsningen er som regel frittstående dekor og bordoppsatser.",
      },
    ],
  "bryllupslokale-pris-per-type-selvcatering-fullservice": [
  ],
  "bryllupslokale-romegenskaper-catering-lydanlegg-tilgjengelighet": [
    {
      question:
        "Hvor mange gjester får det plass til i et bryllupslokale i praksis?",
      answer:
        "Kapasitetstallet forutsetter som regel et tomt rom, uten dansegulv, buffé, DJ-pult eller gangareal mellom bordene. Sett inn de elementene, og reell kapasitet faller ofte 20 til 30 prosent under det oppgitte maksimumtallet. Et lokale på 150 kvadratmeter som reklamerer med plass til 100 gjester sittende, har erfaringsmessig plass til rundt 70 til 80.",
    },
    {
      question: "Hvor stort må dansegulvet være i et bryllupslokale?",
      answer:
        "Dansegulvet bør regnes separat fra spiseplassen. Som tommelfingerregel trenger du minst 30 kvadratmeter dansegulv til 100 gjester hvis rundt halvparten skal danse samtidig, noe mer hvis dere planlegger en åpningsdans med plass til tilskuere rundt. Spør derfor hvor mange kvadratmeter som er satt av til dansegulv, og om kapasitetstallet gjelder med dansegulvet inkludert.",
    },
    {
      question:
        "Hva kjennetegner et forsvarlig catering-kjøkken i et bryllupslokale?",
      answer:
        "Et forsvarlig catering-kjøkken har varmeskap, kjøling og nok benkeplass til at maten kan ferdigstilles på stedet, ikke bare varmes opp. Uten det må cateringfirmaet levere ferdig anrettet mat, noe som begrenser menyvalgene og som regel koster ekstra i tillegg til selve cateringprisen.",
    },
    {
      question: "Hva bør du sjekke om tilgjengelighet i et bryllupslokale?",
      answer:
        "Sjekk om toalettet er tilgjengelig og ligger i samme etasje som festlokalet, om det finnes heis dersom festen holdes over gateplan, og om dørbredder og gangareal mellom bordene er brede nok for rullestol og rullator. Be om en konkret bekreftelse på at inngang, toalett og festlokale henger sammen uten trapper.",
    },
  ],
  "bryllupslokale-vilkar-kapasitet-skjenking-catering-lyd": [
    {
      question: "Hvor lenge kan bryllupsfesten vare i lokalet?",
      answer:
        "Mange lokaler i tettbygde strøk har lydgrense rundt 85 desibel etter klokken 23, og krever at musikken stopper senest klokken 01.00 av hensyn til naboer. Gårder og lokaler utenfor sentrum uten naboer i umiddelbar nærhet tillater ofte fest til 02.00 eller 03.00. Spør konkret om lydgrense i desibel og eksakt sluttidspunkt før dere booker.",
    },
    {
      question: "Hvor lang tid tar det å få skjenkebevilling til bryllup?",
      answer:
        "De fleste kommuner oppgir minst fire ukers frist for søknad før arrangementet, og enkelte krever seks. Søknaden går til kommunen der lokalet ligger, og de fleste kommuner henter uttalelse fra politiet før bevillingen innvilges. Gebyret er som regel noen få hundre kroner. Sjekk også om bevillingen dekker uteareal, eller bare innendørs.",
    },
    {
      question: "Hva er forskjellen på annonsert og branngodkjent kapasitet?",
      answer:
        "Et lokale annonsert for 150 gjester kan i praksis være godkjent for 120 etter brannforskriften, avhengig av rømningsveier, møblering og hvor mange dører som regnes som godkjent rømningsvei. Kapasitet med langbord, scene og dansegulv er ofte 20 til 30 prosent lavere enn tallet øverst i annonsen. Den branngodkjente kapasiteten står i lokalets bruksstillatelse.",
    },
    {
      question: "Hvor mye sparer dere på fri catering fremfor fast leverandør?",
      answer:
        "Fri catering kan spare 10 000 til 20 000 kroner på en middels stor fest, men bare hvis dere faktisk har noen som kan koordinere logistikken på dagen. Fast leverandør gir forutsigbarhet, men lite fleksibilitet på pris; et avvik oppover fra standardmenyen koster fort ekstra per kuvert.",
    },
  ],
  "leie-lokale-sammenligne-egenskaper-kapasitet-utstyr": [
    {
      question:
        "Hva er forskjellen på sittende og stående kapasitet i et lokale?",
      answer:
        "Et rom som tar seksti stående, tar gjerne bare tretti sittende rundt bord, fordi bord og stoler krever langt mer plass enn et publikum som står. Sjekk hvilket tall som gjelder for din anledning, ikke bare det høyeste tallet i annonsen, og legg inn en margin hvis arrangementet har innslag som krever egen plass.",
    },
    {
      question: "Hvilket utstyr bør du sjekke før du booker et lokale?",
      answer:
        "Sjekk wifi til presentasjoner, kjøkken til servering, prosjektor til bilder eller video og lydanlegg til tale eller musikk. Mangler et felt i annonsen, kan det bety at utstyret ikke finnes, men det kan også bety at utleier ikke har fylt ut hele lista ennå – spør heller enn å anta, hvis akkurat det punktet er avgjørende for deg.",
    },
    {
      question: "Hva bør du sjekke om tilgjengelighet før du leier et lokale?",
      answer:
        "Sjekk om det er parkering i gangavstand, og om den er gratis eller avgiftsbelagt. Sjekk kollektivforbindelse hvis noen av gjestene ikke kjører selv. Og sjekk selve adkomsten inn i lokalet: er det trinnfritt, finnes det heis hvis lokalet ligger i en etasje over bakkeplan, og er dørene brede nok for rullestol eller barnevogn.",
    },
    {
      question:
        "Hva er inkludert i prisen på et lokale, og hva kommer i tillegg?",
      answer:
        "Bord og stoler følger som regel med, mens duker, servise eller teknisk personell ofte må bestilles separat. Garderobe, toaletter i tilstrekkelig antall, uteareal og mulighet for catering eller egen matlaging er detaljene som sjelden avgjør om du booker et lokale i utgangspunktet, men som avgjør om dagen faktisk går knirkefritt.",
    },
  ],
  "leie-sal-kommune-pris-utstyr-depositum-privatperson": [
    {
      question: "Hva koster det å leie sal i kommunen?",
      answer:
        "Prisen styres av ukedag, sesong, minsteleie og rengjøringsavgift. En lørdag kveld koster ofte 30-50 prosent mer enn en hverdagskveld, og mange saler har minimum tre eller fire timer. En klasseromsal i Lillestrøm kommune ligger typisk rundt 450 kroner per time på hverdager, mens en tilsvarende sal i helg fort passerer 650 kroner.",
    },
    {
      question: "Hvor stort er depositumet ved leie av kommunal sal?",
      answer:
        "Depositum ved leie av sal ligger vanligvis mellom 1 000 og 2 500 kroner, avhengig av salens størrelse og om det serveres alkohol. Kontroller hvor mange dager før arrangementet du kan avbestille uten å tape depositumet, om depositumet dekker skader eller om det er en egen selvrisiko, og hvem som er ansvarlig for rydding.",
    },
    {
      question: "Hvem kan leie kommunal sal, og betaler alle samme pris?",
      answer:
        "Kommunale saler leies ut til privatpersoner som feirer bursdag eller konfirmasjon, pårørende som trenger et lokale til en minnestund, lag og foreninger som vil sikre fast øvingslokale, og bedrifter som booker møterom til kurs og samlinger. Enkelte kommuner har egne satser for innbyggere og reduserte priser for frivillige lag, mens andre praktiserer én fast pris uansett formål.",
    },
    {
      question: "Når lønner et privat lokale seg fremfor kommunal sal?",
      answer:
        "Et privat selskapslokale kan lønne seg når du trenger kort responstid, fleksible klokkeslett utenom kommunens ordinære åpningstider, eller når den kommunale salen allerede er fullbooket på ønsket dato. Private lokaler har ofte høyere minsteleie og mindre standardiserte priser. For faste, forutsigbare arrangementer er kommunal sal som regel billigst.",
    },
  ],
  "leie-idrettshall-pris-booking-enkelttime": [
    {
      question: "Hva koster det å leie idrettshall per time?",
      answer:
        "I 2026 ligger enkelttimeprisen typisk mellom 450 og 950 kroner per time i norske kommuner, avhengig av hallstørrelse og om du leier hel eller delt hall. De fleste kommuner har en lav sats for lag og foreninger med fast tildeling, og en høyere enkelttimepris for privatpersoner og bedrifter. Kveld og helg koster mer enn dagtid på hverdager.",
    },
    {
      question: "Må jeg betale depositum når jeg leier idrettshall?",
      answer:
        "Depositum er vanlig ved enkeltbooking av bedrifter og private, typisk 1000 til 3000 kroner, og det trekkes tilbake dersom hallen leveres i samme stand som den ble mottatt. De fleste kommuner krever i tillegg at leietaker har egen ansvarsforsikring, særlig ved arrangementer med publikum eller mange deltakere. Sjekk hva som gjelder før du booker, ikke etter.",
    },
    {
      question: "Når må jeg avbestille for å slippe gebyr?",
      answer:
        "Avbestillingsfristen varierer, men 48 til 72 timer før bookingtidspunktet er vanlig for at du skal slippe gebyr. Avbestiller du senere, eller uteblir uten varsel, fakturerer flere kommuner full pris, siden tiden da ikke kan tilbys andre. Med et digitalt bookingsystem endrer eller kansellerer du selv i portalen, og du ser fristen tydelig før du bestiller.",
    },
    {
      question: "Hvor lang tid i forveien bør jeg booke hall til en cup?",
      answer:
        "Book i god tid, gjerne to til tre måneder før et større arrangement, siden kommuner med begrenset hallkapasitet fyller opp helgene raskt, særlig i turneringssesongen fra september til april. Avklar samtidig antall garderober, om det er strøm nok til flere boder samtidig, og om det finnes begrensning på antall tilskuere av brannvernhensyn.",
    },
  ],
  "idrettshall-pris-time-sesong-nasjonal-oversikt-lag-foreninger": [
    {
      question: "Hva koster en time i idrettshallen i 2026?",
      answer:
        "Prisen varierer fra rundt 150 kroner for barne- og ungdomsidrett i kommunal hall til over 900 kroner for en full flerbrukshall utenfor prioritert tid. Kommunal hall for voksne og seniorlag ligger typisk på 300 til 600 kroner timen, skolehall leid ut på kveldstid på 250 til 500 kroner, og privat idrettshall på 600 til 1200 kroner.",
    },
    {
      question: "Lønner fast sesongleie seg framfor enkelttimer?",
      answer:
        "Sesongleie gir vanligvis 15 til 30 prosent lavere kroner per time enn å booke enkelttimer løpende. For et lag som trener to faste timer i uken over en sesong på 40 uker utgjør det fort 4000 til 8000 kroner spart. Ulempen er mindre fleksibilitet: en fast time som ikke brukes, koster likevel penger uten en bytteklausul.",
    },
    {
      question: "Hvilke tillegg kommer utenom timeprisen?",
      answer:
        "Vanlige tillegg er garderobeleie på 50 til 150 kroner, vaktmestertilstedeværelse utenom ordinær arbeidstid på ofte 300 til 600 kroner per oppdrag, strømpåslag ved bruk av lysanlegg til kamp, og utstyrsleie som mål, matter eller lydanlegg. For en turneringsdag kan tilleggene alene utgjøre 1000 til 1500 kroner oppå den annonserte timeprisen.",
    },
    {
      question: "Hvordan får laget ned prisen på halleie?",
      answer:
        "Medlemskap i Norges idrettsforbund utløser lavere sats enn for uorganiserte grupper i de fleste kommunale prisregulativ. I tillegg finnes ungdomsrabatt på typisk 30 til 50 prosent under voksensats, klippekort eller sesongpakke med rabatt fra timer to og oppover, og samarbeidsavtaler mellom idrettsråd og kommune. Be om skriftlig prisregulativ før sesongstart.",
    },
  ],
  "leie-idrettshall-bursdag-arrangement-privatperson": [
    {
      question: "Kan privatpersoner leie idrettshall til bursdag?",
      answer:
        "Ja. De fleste kommuner lar innbyggere leie idrettshallen til bursdag, cup, loppemarked eller konfirmasjon. Lag og foreninger prioriteres først når sesongtildelingen settes, men det som blir til overs etter tildelingen frigis for engangsleie til privatpersoner, bedrifter og andre arrangører. Helger, skoleferier og enkelte formiddager står ofte åpne for slik bruk.",
    },
    {
      question: "Hva koster det å leie idrettshall til et arrangement?",
      answer:
        "Engangsleie av en full idrettshall ligger vanligvis på 400 til 900 kroner per time for privatpersoner, mens en mindre gymsal ofte koster 200 til 400 kroner per time. Prisen varierer med kommune, hallstørrelse og om du leier på dagtid eller kveld. Leier du bare en tredjedel av gulvet, kan prisen halveres.",
    },
    {
      question: "Hvor lang tid i forveien bør du booke?",
      answer:
        "Populære helgedatoer, spesielt i mai, juni og desember, blir ofte booket opp flere måneder i forveien. Hverdager på dagtid eller sene kveldstider er derimot ofte tilgjengelige innenfor et par uker. En cup eller et større arrangement med flere haller bør bookes minst to til tre måneder før, mens en enkel bursdag på en hverdagskveld ofte lar seg ordne på under en uke.",
    },
    {
      question: "Hva skjer hvis arrangementet må avbestilles?",
      answer:
        "En vanlig regel er gratis avbestilling frem til 14 dager før arrangementet, og deretter et gebyr på 25 til 50 prosent av leiesummen. Ved skade på gulv eller utstyr er leietaker som hovedregel ansvarlig, og enkelte kommuner krever et depositum på 1000 til 2000 kroner for arrangementer med mer enn 50 gjester.",
    },
  ],
  "leie-idrettshall-privat-enkelttime-innbygger": [
    {
      question: "Må du være medlem av et lag for å leie kommunal idrettshall?",
      answer:
        "Nei. En privatperson kan booke en enkelttime til egentrening, en aktivitetsdag med kollegaer eller en bursdag uten å være medlem av noe lag. Som innbygger konkurrerer du ikke med idrettslagene om de faste kveldstidene. Du booker enkelttimer i det som er ledig etter at sesongtildelingen er lagt, typisk hull på dagtid, sene kvelder og helger.",
    },
    {
      question: "Hva koster det å leie idrettshall privat?",
      answer:
        "En hel idrettshall til privat bruk ligger typisk et sted mellom 300 og 800 kroner timen, en gymsal ofte lavere, mens en svømmehall eller et kulturhus med bemanning koster mer. Ved bursdager og større arrangementer kreves ofte et depositum, for eksempel 1 000 til 2 000 kroner, som du får tilbake når anlegget er levert i orden.",
    },
    {
      question: "Hvorfor blir bookingen avvist eller forsinket?",
      answer:
        "De vanligste årsakene er feil oppgitt formål, for eksempel at du booker trening når du egentlig skal ha bursdag, for sen booking av bemannede lokaler, manglende betaling innen fristen, et deltakerantall over anleggets kapasitet og branntekniske godkjenning, eller at du prøver å booke fast ukentlig tid gjennom enkelttime-flyten. Fast tid går via sesongtildeling.",
    },
    {
      question: "Hva er du ansvarlig for når du leier hallen?",
      answer:
        "Du er økonomisk ansvarlig for skader som oppstår i din leietid, og du skal rydde og forlate anlegget i samme stand som du fikk det. Etterlater du søppel, kan renholdsgebyr trekkes fra depositumet. Antall personer er begrenset av anleggets kapasitet og branntekniske godkjenning, og innesko er ofte påbudt i hallen.",
    },
  ],
  "hvor-booke-idrettshall-kommune": [
    {
      question: "Hvordan booker du en kommunal idrettshall?",
      answer:
        "I en digital bookingplattform søker du opp anlegget og filtrerer på kommune, idrettstype eller navn, velger hall og ser bilder, utstyrsliste og kapasitet, velger dato og tidspunkt i kalenderen, legger inn kontaktinformasjon for lag eller forening, og bekrefter bookingen. Du får en umiddelbar bekreftelse på e-post. Hele prosessen tar under ti minutter første gang.",
    },
    {
      question: "Hva koster det å leie kommunal hall?",
      answer:
        "Prisene varierer mye mellom kommuner og type anlegg. Lag og foreninger med kommunal støtte betaler gjerne en subsidiert pris, ofte mellom 0 og 200 kroner per time. Kommersielle aktører som bedriftsidrett og private arrangementer betaler markedspris, typisk 500–1500 kroner per time for en fullstørrelses hall. Arrangementer over helgen kan ha egne takster.",
    },
    {
      question: "Kan laget booke fast treningstid gjennom hele sesongen?",
      answer:
        "Ja. Mange lag trenger et fast treningstidspunkt gjennom hele sesongen i stedet for å booke enkeltøkter. Det gjøres som en serietidsbestilling: du velger for eksempel «hver tirsdag og torsdag kl. 19–21 fra august til mai», og systemet blokkerer alle tidene i én operasjon. Må en enkeltdato kanselleres, slettes kun den, ikke hele serien.",
    },
    {
      question: "Hva skjer etter at du har booket?",
      answer:
        "Bekreftelsen inneholder all relevant informasjon: adresse, tidspunkt, hvilken inngang du skal bruke og eventuelle regler for bruk av utstyret. Noen kommuner sender også en påminnelse dagen før. Trenger du å avbestille eller endre tidspunkt, gjøres det i samme system, uten at du må kontakte kommunen på nytt.",
    },
  ],
  "idrettshall-avbestilling-frist-gebyr-venteliste-lag-foreninger": [
    {
      question: "Hvor lenge før økten må laget avbestille idrettshallen?",
      answer:
        "Fristen varierer mellom kommuner og haller, men mønsteret som går igjen er en frist på mellom 24 og 48 timer før økt. En vanlig modell er 48 timer for sesongtider og 24 timer for enkelttimer, fordi sesongtider er del av en helårsavtale og påvirker fordelingen for flere lag, mens en enkelttime er lettere å fylle på kort varsel.",
    },
    {
      question: "Hva koster det å avbestille for sent eller ikke møte opp?",
      answer:
        "Avbestilling innenfor fristen koster ingenting. Avbestilling etter fristen utløser ofte et delvis gebyr, rundt 50 prosent av timeprisen, mens uteblivelse uten varsel normalt faktureres til full pris, i noen tilfeller med et tillegg for administrasjon. Gebyret registreres automatisk på tidspunktet avbestillingen skjer, og går videre til fakturering.",
    },
    {
      question: "Hva skjer med timen laget avbestiller?",
      answer:
        "Så snart en avbestilling er godkjent innenfor fristen, går timen til ventelisten for den aktuelle hallen og tidsluken. Lag som står registrert med interesse for akkurat den ukedagen og det tidspunktet, får varsel på SMS eller push, og det laget som svarer først får timen bekreftet. Kalenderen oppdateres i sanntid for alle andre.",
    },
    {
      question: "Hvilken feil gjør lag oftest ved avbestilling?",
      answer:
        "Den vanligste feilen er å avbestille muntlig eller på tekstmelding direkte til driftsleder, uten å registrere avbestillingen i systemet. Da starter ikke fristklokken, og timen går ikke automatisk til ventelisten. Den nest vanligste er å anta at en sesongtime kan avbestilles med samme 24-timersfrist som en enkelttime.",
    },
  ],
  "sesongbooking-idrettshall-frister-tildeling-klage-lag-foreninger": [
    {
      question: "Når åpner sesongbookingen av idrettshall?",
      answer:
        "Det finnes ingen nasjonal frist for sesongtildeling, og kommunene styrer prosessen selv. Lillestrøm kommune åpner normalt søknadsvinduet i begynnelsen av mai for sesongen som starter i august, mens Bodø kommune legger åpningen til midten av juni. Forskjellen handler om når kommunen rekker å behandle søknader, avklare vedlikeholdsperioder og sette opp fordelingsmøter før sommeren.",
    },
    {
      question: "Hva må søknaden om sesongtid inneholde?",
      answer:
        "Laget bør ha klart oppdatert medlemstall fordelt på aldersgruppe, reelt treningsbehov i timer per uke, dokumentasjon på aktivitet som terminliste eller treningsplan, eventuell dokumentasjon for utøvere med nedsatt funksjonsevne, og en kontaktperson i styret som kan svare raskt. Ufullstendige søknader er en gjenganger som årsak til lav prioritering.",
    },
    {
      question: "Hvordan prioriterer kommunen mellom lagene?",
      answer:
        "De vanligste faktorene er antall aktive medlemmer, særlig andelen barn og unge under 19 år, som normalt veier tyngst, om laget driver breddeidrett eller toppidrett, om laget har hatt tildelt tid tidligere uten å bruke den, og geografisk tilhørighet. Et lag med 80 medlemmer fordelt på fem aldersklasser rangerer normalt høyere enn et seniorlag med 15 medlemmer.",
    },
    {
      question: "Kan laget klage på tildelt treningstid?",
      answer:
        "Klagefristen er som regel to til tre uker etter at tildelingsvedtaket er sendt ut, og klagen bør sendes skriftlig med referanse til vedtaksnummeret. Det som faktisk lar seg endre, er som regel feil i saksbehandlingen: at dokumentasjon ikke ble vurdert, at et kriterium ble feil anvendt, eller at et lag ble utelatt på grunn av en administrativ feil.",
    },
  ],
  "idrettshall-ekstra-treningstid-utenom-sesongtildeling-lag-foreninger": [
    {
      question: "Hva koster ekstra treningstid utenom sesongtildelingen?",
      answer:
        "En enkelttime utenom tildelt tid i en kommunal hall koster typisk 350 til 450 kroner, mens private haller ofte tar 600 til 900 kroner i kveldstid, når etterspørselen er høyest. Barne- og ungdomsidrett har som regel redusert sats. For én ekstra time i uken over en sesong på rundt 30 uker utgjør forskjellen 6 000 til 13 500 kroner.",
    },
    {
      question: "Hvordan finner laget ledig treningstid på kort varsel?",
      answer:
        "Ekstra ledig tid oppstår som avbud fra andre lag, uutnyttede skoletimer på ettermiddagen og hull i private hallers program. Den er ikke søknadspliktig på samme måte som sesongtildelingen, men den må fanges opp raskt, for den forsvinner ofte i løpet av timer eller dager. En samlet sanntidskalender viser flere haller samtidig i stedet for én og én nettside.",
    },
    {
      question: "Kan laget få varsel når en time blir ledig?",
      answer:
        "Ja. Et lag som legger seg på venteliste for en ønsket time, får varsel på e-post eller push med en gang et annet lag avbestiller. Digilist praktiserer normalt et kort prioritetsvindu for ventelisten, typisk i størrelsesorden 10 til 15 minutter, før timen legges åpen for nytt søk. Med flere ønskede tidspunkt lønner det seg å stå på venteliste i mer enn én hall.",
    },
    {
      question: "Må laget søke om fast ukentlig ekstratid?",
      answer:
        "Ja. Fast ukentlig ekstratid går normalt gjennom kommunens ordinære tildelingsrunde eller en løpende søknad til driftsleder, fordi den legger beslag på kapasitet over lang tid og påvirker andre lags mulighet til å få tid. En enkelttime dekker derimot et engangsbehov og bookes direkte i kalenderen uten søknadsprosess, med bekreftelse med det samme.",
    },
  ],
  "idrettshall-kommunal-og-privat-hall-ledige-tider-samlet": [
    {
      question:
        "Hvorfor er det så vanskelig å finne ledig tid i idrettshallen?",
      answer:
        "Idrettshaller driftes sjelden i ett system. Kommunen fordeler treningstid gjennom sesongtildeling og et eget kommunalt bookingsystem, private haller bruker sine egne bookingløsninger, og enkelte flerbrukshaller har bare et Excel-ark eller en oppslagstavle i resepsjonen. Ingen av systemene snakker sammen, så ingen ser hele bildet på tvers av kommunale og private tilbydere.",
    },
    {
      question: "Hva er prisforskjellen på kommunal og privat idrettshall?",
      answer:
        "En kommunal hall følger et politisk vedtatt prisregulativ, ofte 150 til 300 kroner timen for lag med hjemmehørende medlemmer. En privat hall eller flerbrukshall tar markedspris, ofte 500 til 900 kroner timen. Et lag som trener to timer i uken i 30 uker betaler mellom 9000 og 18 000 kroner i en kommunal hall, mot 30 000 til 54 000 kroner i en privat.",
    },
    {
      question: "Når blir kommunale enkelttimer synlige for booking?",
      answer:
        "En typisk kommune legger ut sesongsøknad for 80 til 90 prosent av kapasiteten før enkelttimer i det hele tatt blir synlige for andre. Det som er igjen etter tildelingsvedtaket, dukker først opp i bookingsystemet etter at klagefristen på fordelingsvedtaket har gått ut, gjerne fire til seks uker inn i sesongen.",
    },
    {
      question: "Bør laget velge fast ukentlig tid eller enkelttimer?",
      answer:
        "Et fast lag med jevnlig trening bør sikte mot en fast ukentlig tid, enten gjennom sesongtildeling eller en løpende avtale med en privat hall. En privatperson som trener uregelmessig, eller et lag som trenger ekstra kapasitet foran en turnering, er bedre tjent med enkelttimer booket etter behov. Drop-in finnes stort sett bare hos private aktører.",
    },
  ],
  "idrettshall-cup-turnering-blokkbooking-ledige-tider-arrangor": [
    {
      question:
        "Hvordan booker jeg idrettshall til en cup som varer hele helgen?",
      answer:
        "En turneringshelg er ikke 40 enkelttimer, det er én sammenhengende reservasjon. Med blokkbooking legger arrangøren inn hele perioden i ett grep, for eksempel fredag klokken 17 til søndag klokken 18, i stedet for hver time separat. Driftslederen får da én forespørsel å forholde seg til fremfor 20, og ingen enkelttime glipper og blir bookbar for andre midt i turneringen.",
    },
    {
      question: "Hva koster det å leie idrettshall til cup eller turnering?",
      answer:
        "Prisen for arrangementsutleie ligger normalt høyere enn ordinær timepris, fordi hallen er utilgjengelig for andre i hele perioden og driftsleder ofte må stille med ekstra bemanning i helgen. En vanlig modell er en fast helgepris per hall pluss et tillegg for garderober og kiosk, fakturert samlet til arrangøren i etterkant. Flere driftsledere krever også depositum ved bekreftet booking.",
    },
    {
      question:
        "Hvor raskt får arrangøren svar på en søknad om hall til turnering?",
      answer:
        "Arrangementsutleie krever som regel godkjenning fra driftsleder eller idrettskonsulent, siden bookingen låser hallen for andre formål i flere dager. Ligger garderobebehov og utstyr som resultattavle og sekretariatbord i samme søknad, kuttes responstiden fra flere uker med e-post frem og tilbake til noen dager, fordi driftslederen slipper å etterspørre manglende informasjon.",
    },
    {
      question:
        "Hva er forskjellen på sesongtildeling, enkelttimer og arrangementsutleie?",
      answer:
        "Sesongtildeling er faste ukentlige treningstider tildelt lag for hele sesongen, normalt fastsatt før sommeren. Enkelttimer er løse timer som bookes etter behov, ofte med kort varsel og uten krav om egen godkjenning. Arrangementsutleie er en sammenhengende blokk over flere dager til cup, turnering eller stevne, og krever egen godkjenning fordi den fortrenger vanlig drift for alle andre brukere.",
    },
  ],
  "sesongtildeling-idrettshall-kommune-fordelingsnokkel": [
    {
      question: "Hva er forskjellen på sesongtildeling og løpende booking?",
      answer:
        "Løpende booking er å reservere en ledig time i en kalender der først til mølla gjelder. Sesongtildeling er en forvaltningsprosess: kommunen samler inn søknader fra alle lag som ønsker fast treningstid, typisk fra august til juni, og fordeler den samlede kapasiteten etter kriterier vedtatt på forhånd. Resultatet er et enkeltvedtak som kan påklages etter forvaltningsloven.",
    },
    {
      question: "Når er søknadsfristen for treningstid i idrettshall?",
      answer:
        "Typisk søknadsfrist ligger i april eller mai for sesongen som starter i august, gjerne seks til åtte uker før terminlisten skal publiseres, slik at saksbehandler rekker både registrering, fordeling og eventuell klagebehandling før sesongstart. Registrerte idrettslag og foreninger med organisasjonsnummer kan søke, ofte med krav om tilknytning til et idrettsråd eller en overordnet klubb.",
    },
    {
      question: "Hvilke kriterier brukes i fordelingsnøkkelen?",
      answer:
        "De vanligste kriteriene er klubbstørrelse målt i antall aktive medlemmer i relevant aldersgruppe, aldersprioritet der barn og ungdom under 19 år ofte går foran seniorlag, kjønnsbalanse der enkelte kommuner vekter jenteidrett høyere, og tidligere bruk, slik at lag som fylte tildelt tid forrige sesong kan få fortrinn foran lag med høyt registrert fravær.",
    },
    {
      question: "Hva må saksbehandler dokumentere i en klagesak?",
      answer:
        "Klagefristen er normalt tre uker fra vedtaket er mottatt, i tråd med forvaltningsloven. Saksbehandler må kunne vise hvilken fordelingsnøkkel som ble brukt og hvordan laget konkret ble vurdert opp mot den, sammenligningsgrunnlag mot andre lag i samme kategori og aldersgruppe, og om det finnes ledig kapasitet klagen kan løses med uten å omfordele andre lags tid.",
    },
  ],
  "idrettshall-treningsplan-sesong-kamp-ekstra-tid-lagleder": [
    {
      question: "Hva koster ekstra halltid utover tildelt sesongkvote?",
      answer:
        "Ekstra treningstid utover tildelt kvote koster typisk 350 til 600 kroner per time i en kommunal hall, avhengig av halltype og tidspunkt, mens kveldstid i helgen ofte ligger i øvre sjikt. En lagleder som planlegger fem ekstraøkter foran en avgjørende turnering bør derfor sette av 1750 til 3000 kroner i budsjettet.",
    },
    {
      question: "Hva er avbestillingsfristen for en treningstime?",
      answer:
        "De fleste haller opererer med en avbestillingsfrist på 24 til 48 timer før økten. Avbestiller laget innenfor fristen, frigis timen umiddelbart til andre lag eller til venteliste. Avbestiller laget for sent, eller uteblir uten varsel, kan hallen belaste et avbestillingsgebyr, ofte i størrelsesorden 200 til 400 kroner per time.",
    },
    {
      question: "Hva gjør laget når ønsket treningstid allerede er tatt?",
      answer:
        "Laget legger seg på venteliste i stedet for å ringe rundt til andre lagledere. Frigis timen, for eksempel fordi et annet lag avbestiller innenfor fristen, går den automatisk videre til neste lag på listen, og laglederen får varsel så snart plassen er ledig. Mange lag bytter også tid seg imellom når begge ser hverandres kalender.",
    },
    {
      question: "Hvorfor kolliderer treningstid og kamper så ofte?",
      answer:
        "Sesongtildelingen gir laget faste timer, men kamper legges inn av kretsen med kort varsel, ofte to til tre uker før spilledato, og ekstra treningstid må bookes separat. Når kampoppsett og treningstid ligger i samme system, sjekkes en ny booking automatisk mot kamper, andre lags tildelte tid og vedlikeholdsvinduer før den bekreftes.",
    },
  ],
  "leie-motrom-kommune-samme-dag": [
    {
      question: "Kan man booke et kommunalt møterom samme dag?",
      answer:
        "Ja. Med digitalisert booking ser en medarbeider som trenger rom til et hastemøte klokken 14 hva som er ledig, og bekrefter på under ett minutt uten å involvere andre. Rommet blokkeres i systemet umiddelbart, slik at alle andre ser oppdatert tilgjengelighet i samme sekund.",
    },
    {
      question: "Hvorfor oppstår dobbeltbooking av kommunale møterom?",
      answer:
        "Fordi bestillingen skjer i flere kanaler samtidig. Når rom bestilles via e-post, telefon eller en Excel-fil som oppdateres sporadisk, kan én avdeling sende e-post om Møterom B mens en annen ringer om det samme rommet. Uten en felles kalender som oppdateres i sanntid, oppdages kollisjonen først i etterkant.",
    },
    {
      question:
        "Hvor mye administrasjonstid sparer kommunen på digital rombooking?",
      answer:
        "En mellomstor norsk kommune med 12 møterom og 3 kulturhus samlet all bookingadministrasjon i én portal, og rapporterte etterpå om gjennomsnittlig 4 timer mindre administrasjon per uke knyttet til rom og lokaler. Kommunen oppga også at dobbeltbookingene forsvant og at eksterne leietakere fikk raskere svar.",
    },
    {
      question:
        "Hvordan planlegges vedlikehold uten at det kolliderer med bookinger?",
      answer:
        "Renhold, teknisk vedlikehold og oppgraderinger planlegges direkte i systemet. Rommet merkes som utilgjengelig i den aktuelle perioden, og ingen kan booke det i mellomtiden. Driftslederen slipper å koordinere dette manuelt med den som håndterer bookinger, fordi informasjonen er synlig for alle parter i sanntid.",
    },
  ],
  "sal-kommune-vilkar-avbestilling-depositum-ansvar": [
    {
      question: "Hva koster det å avbestille en kommunal sal?",
      answer:
        "Et vanlig mønster er full refusjon ved avbestilling mer enn 14 dager før arrangementet, halv refusjon ved 7 til 14 dager, og ingen refusjon under 7 dager. Enkelttimer i idrettshall har ofte en kortere frist, gjerne 48 timer, mens hele dager i sal eller festlokale typisk krever 14 dagers varsel.",
    },
    {
      question: "Hvor stort er depositumet, og når får du det tilbake?",
      answer:
        "Vanlig nivå for en grendesal eller flerbrukshall ligger mellom 1 500 og 5 000 kroner, mens større kulturhus og festsaler kan kreve opp mot 10 000 kroner ved store selskaper. Depositumet betales normalt sammen med leien eller ved henting av nøkkel, og skal tilbakebetales innen 1-2 uker etter at lokalet er kontrollert.",
    },
    {
      question: "Hvem er ansvarlig for skader i et leid kommunalt lokale?",
      answer:
        "Leietaker er som hovedregel ansvarlig for skader som oppstår i leieperioden, uavhengig av om det er leietakeren selv eller en gjest som forårsaker dem. Kommunens bygningsforsikring dekker vanligvis selve bygget, ikke innhold leietaker tar med eller skader som oppstår som følge av arrangementet, så egen ansvarsforsikring forutsettes normalt.",
    },
    {
      question:
        "Hva skjer hvis kommunen selv avlyser eller dobbeltbooker salen?",
      answer:
        "Der kommunen selv avlyser, for eksempel ved akutt behov for lokalet til valg eller kriseledelse, har leietaker normalt krav på full refusjon og hjelp til å finne alternativt lokale, men sjelden erstatning for indirekte kostnader som catering eller innleid underholdning. Spør konkret hvordan kommunen unngår dobbeltbooking i praksis.",
    },
  ],
  "leie-sal-kommune-soknad-godkjenning-svarfrist-privatperson": [
    {
      question: "Hvor lang tid tar det å få svar på en søknad om å leie sal?",
      answer:
        "Kommunale nettsider oppgir ofte en behandlingstid på mellom tre og ti virkedager for søknader om utleie av saler, og mange opererer med en uttalt svarfrist på tre til fem virkedager for ukompliserte søknader. Det er sjelden selve vurderingen som tar tid, men antall manuelle steg mellom innsendt søknad og svar.",
    },
    {
      question: "Hva må du ha klart før du søker om å leie sal?",
      answer:
        "De fleste kommuner ber om formål med arrangementet, antall gjester, ønsket tidsrom inkludert rigge- og ryddetid, og en kontaktperson med ansvar under arrangementet. Enkelte saler krever i tillegg dokumentasjon, som forsikringsbevis for lag og foreninger, eller bekreftelse på at arrangementet er alkoholfritt.",
    },
    {
      question: "Når betaler du leien og depositumet?",
      answer:
        "Betaling skjer normalt etter godkjenning, ikke før. Når søknaden er innvilget, mottar du en faktura eller betalingslenke for leien, og i mange tilfeller et separat depositum som skal dekke eventuell skade eller manglende rydding. Depositumet tilbakebetales etter at lokalet er sjekket, ofte innen én til to uker.",
    },
    {
      question: "Hva gjør du hvis søknaden om sal blir avslått?",
      answer:
        "Avslag skyldes oftest dobbeltbooking, feil formål for lokalet, eller at salen er reservert til fast aktivitet på det tidspunktet du har søkt om. Et godt system viser deg alternative saler og ledige tider samme dag som avslaget kommer, slik at du kan sende en ny søknad umiddelbart i stedet for å starte søket på nytt.",
    },
  ],
  "leie-lokale-billigst-kommune-sammenlign-lokaltyper": [
    {
      question: "Hva koster det for et lag å leie lokale i kommunen?",
      answer:
        "En typisk lagssats ligger på 0 til 120 kroner per time for gymsal, 100 til 300 kroner for idrettshall, 150 til 400 kroner for møterom, 500 til 2 000 kroner per døgn eller kveld for kultursal, og 1 000 til 4 000 kroner per døgn for selskapslokale. Prisene varierer mellom kommuner.",
    },
    {
      question: "Hvordan finner laget det billigste egnede lokalet?",
      answer:
        "Ved å sammenligne på tvers av lokaltyper, ikke bare mellom kommuner. Skal koret ha generalprøve, kan en gymsal til 80 kroner timen erstatte en kultursal til 1 500 kroner kvelden når selve forestillingen holdes et annet sted. Definer først hva aktiviteten krever av plass, utstyr og tidsrom, og filtrer så på dato, kapasitet og maks pris.",
    },
    {
      question: "Hvorfor betaler to lag ulik pris for det samme lokalet?",
      answer:
        "Kommunen opererer normalt med tre satser for samme lokale: subsidiert lagssats for registrerte lag med aktivitet for barn og unge, medlemssats for øvrige frivillige lag, og kommersiell sats for bedrifter og private, gjerne 3-5 ganger lagssatsen. En hall til 900 kroner timen kommersielt kan ligge på 0 til 150 kroner for et idrettslag i samme kommune.",
    },
    {
      question: "Hvilke kostnader kommer i tillegg til timeprisen?",
      answer:
        "Depositum på 500 til 3 000 kroner som tilbakebetales etter godkjent rengjøring, avbestillingsgebyr fra 50 til 100 prosent av leien hvis du avbestiller for sent, eget renholdsgebyr hvis lokalet ikke leveres ryddet, og utstyr som lyd, lys og bord. Et selskapslokale til 2 000 kroner kan ende på 3 500 med depositum og renhold.",
    },
  ],
  "leie-sal-kommune-typer-pris-guide": [
    {
      question: "Hva koster det å leie grendehus, kulturhus eller skolegymsal?",
      answer:
        "Typiske spenn i 2026 er 400 til 1 200 kroner per døgn for grendehus, 250 til 600 kroner per time for skolegymsal, 1 500 til 3 500 kroner per døgn for forsamlingshus, 2 000 til 5 000 kroner per døgn for en mindre kultursal, og 800 til 2 000 kroner per arrangement for menighetshus.",
    },
    {
      question: "Hva er forskjellen på grendehus, forsamlingshus og kulturhus?",
      answer:
        "Grendehus er enkle bygg driftet av lokale lag eller velforeninger, ofte billigst, og passer bursdag og mindre samlinger på 20 til 60 personer. Forsamlingshus er mellomstore lokaler med kjøkken og garderobe, populære til konfirmasjon og bryllupsfest. Kulturhus har scene, lyd og lys, men er dyrere og krever gjerne teknisk personale.",
    },
    {
      question: "Hva er inkludert i leieprisen for en kommunal sal?",
      answer:
        "Sjelden alt. Kjøkken er ofte inkludert i grunnprisen, men noen steder kreves eget påslag for komfyr og oppvaskmaskin. Lyd og lys er som regel med i kulturhus, men koster ekstra i grendehus. Rengjøring koster gjerne 300 til 800 kroner hvis du ikke vasker selv, og vakthold kreves ofte ved alkoholservering eller over 50 gjester.",
    },
    {
      question:
        "Hvor lang er avbestillingsfristen, og hvor stort er depositumet?",
      answer:
        "De fleste kommuner krever depositum på 500 til 2 000 kroner, som tilbakebetales etter godkjent sluttbefaring av lokalet. Avbestillingsfristen varierer typisk fra 48 timer til to uker før arrangementet, og avbestiller du for sent, mister du hele eller deler av leiesummen.",
    },
  ],
  "bryllupslokale-kommune-pris-privat-sammenligning": [
    {
      question: "Hva koster et bryllupslokale i kommunen?",
      answer:
        "Et grendehus eller en skoleaula koster typisk 1 500 til 4 000 kroner per dag, mens et kulturhus eller en representasjonssal ligger på 6 000 til 15 000 kroner. Et privat festlokale for samme antall gjester starter ofte på 15 000 kroner og passerer 40 000 når servering er med i pakken.",
    },
    {
      question:
        "Er et kommunalt bryllupslokale billigere enn et privat festlokale?",
      answer:
        "Selve rommet er sjelden den store utgiften i kommunen. Leier du en kommunal festsal til 8 000 kroner, tar inn catering for 80 gjester til rundt 600 kroner per kuvert, betaler 2 500 for sluttvask og legger ut 4 000 i depositum du får igjen, lander totalen rundt 58 500 kroner. Da utgjør lokalet under en femtedel av regningen.",
    },
    {
      question: "Hva er inkludert når du leier bryllupslokale av kommunen?",
      answer:
        "Kommunen inkluderer som regel selve lokalet, strøm, tilgang til kjøkken og ofte bord og stoler. Rigging, borddekking, vask og teknikk må du derimot ofte ordne selv eller betale ekstra for, og vakthold kreves gjerne ved skjenking. Be om en skriftlig oversikt over hva som konkret følger med.",
    },
    {
      question: "Hvor lang tid i forveien bør du booke bryllupslokale?",
      answer:
        "Bryllup planlegges gjerne 12 til 18 måneder i forveien, og populære lørdager i juni og august går først. Mange kommuner åpner booking omtrent ett år frem i tid. Med en sanntidskalender ser du hvilke datoer som faktisk er ledige, og om fredagen, søndagen eller uken etter er åpen.",
    },
  ],
  "finn-og-book-ledige-moterom-i-din-kommune": [
    {
      question: "Hva koster det å leie møterom i kommunen?",
      answer:
        "Prisen avhenger av hvem du er og hva du skal bruke rommet til. Lag og foreninger får ofte gratis eller sterkt subsidiert leie, særlig for barne- og ungdomsaktivitet og for organisasjoner registrert i Frivillighetsregisteret. Privatpersoner betaler gjerne 100 til 500 kroner per time avhengig av rommets størrelse, og næringsliv full pris.",
    },
    {
      question: "Hvordan finner jeg ledige møterom nær meg?",
      answer:
        "Sett bydel eller posisjon først, velg riktig romtype og legg inn dato og klokkeslett. I Digilist ser du lokalene på kart og kan filtrere på sted, kapasitet, utstyr som skjerm, prosjektor eller teleslynge, og tidspunkt. Kombinasjonen tar deg fra hundrevis av mulige rom til en håndfull relevante treff.",
    },
    {
      question: "Hva er forskjellen på møterom, grupperom og kurslokale?",
      answer:
        "Møterom er mindre rom for 4 til 12 personer med bord, stoler og skjerm, og passer til styremøter og planleggingsmøter. Grupperom er enda mindre, ofte på bibliotek eller skoler, for 2 til 6 personer. Kurslokale er større rom for 20 personer eller flere, med prosjektor og noen ganger enkelt kjøkken.",
    },
    {
      question: "Hvilke regler gjelder når du booker et kommunalt møterom?",
      answer:
        "Du må normalt være myndig, altså fylt 18 år, for å stå som ansvarlig for en booking. Den som booker er ansvarlig for at rommet leveres ryddig og uskadd, og for at antall personer holder seg innenfor kapasiteten. Kommunen krever ofte avbestilling 24 til 48 timer før, ellers kan du bli fakturert.",
    },
  ],
  "hvilket-bookingsystem-bor-en-norsk-kommune-velge": [
    {
      question: "Hvilket bookingsystem bør en norsk kommune velge?",
      answer:
        "Et bookingsystem bygget for norsk offentlig sektor, med ID-porten-innlogging, GDPR- og ISO 27001-etterlevelse, WCAG 2.1 AA-tilgjengelighet og sanntidsoppdatert kalender. Digilist er bygget spesifikt for dette markedet og er i 2026 et reelt alternativ til Aktiv Kommune, Gibbs og bookup.no ved anskaffelse av bookingsystem.",
    },
    {
      question: "Hvilke krav må et kommunalt bookingsystem oppfylle?",
      answer:
        "Forskrift om universell utforming av IKT stiller krav om WCAG 2.1 nivå AA for offentlige nettløsninger, med krav som har vært fullt gjeldende for eksisterende innhold siden 2021. I tillegg må leverandøren kunne dokumentere GDPR-etterlevelse og databehandleravtale, og ID-porten-støtte hindrer at kommunen må drifte egne brukerkontoer for innbyggerne.",
    },
    {
      question: "Hvor lang tid tar det å ta i bruk et nytt bookingsystem?",
      answer:
        "Oppsett av Digilist for en kommune tar typisk 2 til 4 uker fra signering til lokalene er søkbare for innbyggere, avhengig av hvor mange bygg og ressurser som skal legges inn og om ID-porten-integrasjon skal på plass først. Eksisterende lokaler og faste avtaler importeres, med en kort periode med parallell drift.",
    },
    {
      question: "Hva koster et bookingsystem for en kommune?",
      answer:
        "Prisen varierer normalt med antall lokaler og brukere, og de fleste leverandører, Digilist inkludert, tilbyr et tilpasset tilbud etter en kort behovskartlegging fremfor én fast listepris. Oppsettstiden og arkitekturen, altså skyløsning uten lokal serverdrift, er derimot faste egenskaper uavhengig av kommunens størrelse.",
    },
  ],
  "bookingsoftware-kommune-sammenligning-pris": [
    {
      question: "Hvilke prismodeller finnes for bookingsoftware i kommunen?",
      answer:
        "Det finnes i praksis tre: per-bruker-lisens, der du betaler per påloggingskonto per måned; per-lokale-lisens, der du betaler for hvert rom, hall eller uteareal som skal være bookbart; og flat avgift, en fast måneds- eller årssum uavhengig av antall brukere og lokasjoner. Digilist bruker flat avgift.",
    },
    {
      question: "Hva koster bookingsoftware for en kommune?",
      answer:
        "Basert på innhentede prisanslag per mai 2026 ligger Digilist på fra 39 000 kroner i årsleie med oppsett inkludert, mens de tre andre kategoriene av leverandører ligger på fra 48 000 til 62 000 kroner i årsleie, med oppsett og implementering på mellom 15 000 og 80 000 kroner i tillegg.",
    },
    {
      question: "Hvilke kostnader kommer i tillegg til lisensen?",
      answer:
        "Integrasjon med Microsoft 365 er den vanligste: erfaringstall fra tilsvarende prosjekter tilsier 20-40 timers internt arbeid bare for kalenderintegrasjon. I tillegg kommer oppsett og vedlikehold av ID-porten-avtaler, løpende drift med oppdateringer, brukerstøtte og opplæring, og en juridisk vurdering hvis data overføres til tredjeland.",
    },
    {
      question: "Er det billigste bookingsystemet rimeligst over tid?",
      answer:
        "Sjelden. Frogn kommune evaluerte bookingløsningen sin i 2024 og oppdaget at de brukte omtrent 40 timer årlig på manuelle bekreftelser og påminnelser til lag og foreninger. Regnet til en internpris på 500 kroner timen utgjør det 20 000 kroner per år, nok til å dekke mellomlegget til en mer komplett løsning.",
    },
  ],
  "leie-sal-fast-kommune-forening-sesong": [
    {
      question: "Hvordan får foreningen fast sal gjennom hele sesongen?",
      answer:
        "Faste tider tildeles én gang før sesongen, ikke løpende, og fristen ligger typisk i mai eller juni for kommende skoleår. Foreningen søker om et tidsintervall, for eksempel tirsdag 18 til 20 gjennom hele høst- og vårsesongen, og kommunen tildeler ledige faste tider samlet før sesongstart.",
    },
    {
      question: "Hva koster det for en forening å leie sal fast?",
      answer:
        "En time som koster en privat leietaker mellom 400 og 800 kroner kan for en forening være alt fra gratis til rundt 150 kroner, avhengig av kommune og lokale. Tre ting avgjør prisen: foreningsrabatt, aldersfordeling og om avtalen er fast eller enkeltbooking. Hver kommune vedtar sine egne satser.",
    },
    {
      question: "Hva må foreningen dokumentere i søknaden om fastplass?",
      answer:
        "Saksbehandleren krever som regel organisasjonsnummer og registrering i Frivillighetsregisteret, medlemsliste eller medlemstall med aldersfordeling, en kontaktperson med ansvar for nøkkel, orden og avbestilling, og ønsket tid og lokale med et alternativ hvis førstevalget er opptatt. Barne- og ungdomsandelen avgjør ofte både rabatt og prioritet.",
    },
    {
      question: "Beholder foreningen fastplassen fra år til år?",
      answer:
        "Ikke automatisk. De fleste kommuner ber om fornyelse hver sesong, ofte innen samme vårfrist, og svarer dere ikke, kan tiden gå til en annen forening. Foreninger som har hatt samme tid i mange år har som regel en fordel ved fornyelse, men det forutsetter at tiden er brukt og at avlysninger er meldt fra om.",
    },
  ],
  "uterom-grontareal-arrangementer-kommune": [
    {
      question: "Hva regnes som uterom kommunen leier ut til arrangementer?",
      answer:
        "Parker og grøntareal som kan romme alt fra en mindre feiring til en sommerkonsert, avgrensede strandavsnitt av en offentlig badeplass, torg og festplasser i sentrum, og uteareal ved idretts- og kulturanlegg som kan bookes separat fra selve bygget. Felles er at de er avgrensede arealer, ikke bygninger med lås.",
    },
    {
      question:
        "Hvordan booker du en park eller et grøntareal til et arrangement?",
      answer:
        "Filtrer på park, strand eller torg og på ønsket dato, sjekk areal, kapasitet og hva som finnes av strøm og vann, og velg tidspunkt og avgrensning i kalenderen. Send inn søknaden og bekreft med ID-porten, BankID eller organisasjonens innlogging. Kvitteringen viser areal, tidsrom og krav til rydding og avfallshåndtering.",
    },
    {
      question: "Trenger du egen tillatelse i tillegg til selve bookingen?",
      answer:
        "Større arrangementer krever ofte en egen tillatelse til bruk av offentlig grunn, ikke bare en booking. Denne kan følge samme flyt som selve reservasjonen, slik at arrangøren søker og booker i én prosess i stedet for to separate henvendelser til ulike etater. Ansvarsforsikring kreves ofte dokumentert ved store arrangementer.",
    },
    {
      question:
        "Hvorfor mangler kommunen ofte oversikt over ledige utearealer?",
      answer:
        "De fleste kommunale bookingsystemer er bygget rundt bygninger med en dør og en nøkkel, og et grøntareal legges derfor sjelden inn som en egen lokaltype. Oversikten over hvilke tillatelser som er gitt, blir liggende hos én saksbehandler i park- og idrettsavdelingen i stedet for i kalenderen, med risiko for to overlappende arrangementer samme helg.",
    },
  ],
  "sal-kommune-sesongpris-tidspunkt-privatperson": [
    {
      question: "Når er det billigst å leie sal i kommunen?",
      answer:
        "Januar, februar og deler av november er lavsesong, med rabatterte satser eller i noen kommuner gratis leie. Mai, juni og september er høysesong for konfirmasjon og bryllup, med priser typisk 20 til 35 prosent over grunnprisen. Innenfor samme måned er hverdag formiddag klart billigst.",
    },
    {
      question: "Hvor mye dyrere er lørdag kveld enn en hverdag?",
      answer:
        "En helgekveld koster i mange kommunale prisregulativ 40 til 60 prosent mer enn en formiddag på hverdag i det samme lokalet, fordi prisen følger etterspørsel time for time. Skal du ha et møte, en mindre markering eller en øvelse uten publikum, kan en tirsdag formiddag koste under halvparten av lørdag kveld.",
    },
    {
      question: "Hvor lang tid i forveien bør du booke for å få lavest pris?",
      answer:
        "Booker du en dato seks til ni måneder før arrangementet, unngår du at prisen justeres opp når få datoer er igjen. Et vanlig mønster er at de mest ettertraktede salene er fullbooket åtte til ti uker før en konfirmasjonshelg i mai, mens de samme salene hadde god ledig kapasitet ti måneder i forveien.",
    },
    {
      question: "Kan du få sal billigere på kort varsel?",
      answer:
        "Ja, hvis datoen er fleksibel. Når noen kansellerer en booking 10 til 14 dager før en avtalt dato, legger flere kommuner den ledige tiden ut som restplass, ofte til redusert sats, fordi målet er å unngå et tomt lokale. Strategien passer dårlig for bryllup og konfirmasjon, der datoen sjelden er fleksibel.",
    },
  ],
  "moterom-kurslokale-leie-billig-dagtid-bedrift": [
    {
      question: "Hva koster det å leie et kurslokale?",
      answer:
        "Kommunale kurslokaler ligger typisk mellom 300 og 600 kroner timen på dagtid, avhengig av kommune, beliggenhet og utstyrsnivå. Private aktører tar ofte 500 til 900 kroner timen, men inkluderer gjerne wifi, prosjektor og resepsjonstjeneste i prisen uten tillegg. Sammenlign totalpris for hele kursdagen, ikke bare timesatsen på annonsen.",
    },
    {
      question:
        "Hvorfor er møterom og kurslokale billigere på dagtid enn på kveld?",
      answer:
        "De fleste utleiere, både kommunale og private, prissetter etter etterspørsel. Kveld og helg er høysesong for private arrangementer som bursdager, jubileer og bryllup, mens dagtid mandag til fredag ofte står ledig. Et kurslokale som koster 700 kroner timen på kveldstid kan ligge på 450 kroner timen mellom klokken 08 og 16.",
    },
    {
      question: "Trenger bedriften møterom, kurslokale eller sal?",
      answer:
        "Møterom passer til inntil 10-12 deltakere og korte økter, som statusmøter eller mindre arbeidsgrupper. Kurslokale eller seminarrom er dimensjonert for gruppearbeid, med plass til flere bord, en pauseflate og ofte ett eller to grupperom ved siden av. Sal blir aktuelt først når kurset passerer 40-50 deltakere.",
    },
    {
      question: "Når må vi avbestille et kurslokale for å slippe gebyr?",
      answer:
        "Typisk praksis er gebyrfri avbestilling frem til 48-72 timer før kursstart, og delvis refusjon eller flytting mot et mindre gebyr etter det. Private aktører har ofte strammere frister rundt store helger og fellesferien. Be om fristen skriftlig i bekreftelsen, så slipper dere å tolke vilkår i etterkant.",
    },
  ],
  "moterom-kommune-finn-og-book-ledige-lokaler": [
    {
      question: "Hva koster det å leie et kommunalt møterom?",
      answer:
        "Kommunen setter satsene selv. Frivillige lag og foreninger betaler ofte lite eller ingenting, særlig til barne- og ungdomsaktivitet, private innbyggere betaler en moderat timepris eller døgnpris, og bedrifter betaler den høyeste satsen. Som størrelsesorden ligger et vanlig møterom for en privatperson gjerne mellom 200 og 600 kroner for en kveld.",
    },
    {
      question: "Hvem kan booke et kommunalt møterom?",
      answer:
        "Hvem som får booke varierer med kommunens reglement, men typisk kan fire grupper søke: innbyggere som trenger rom til private møter eller mindre arrangementer, lag og foreninger med aktivitet i kommunen, borettslag og sameier til beboermøter og årsmøter, og bedrifter og næringsdrivende, ofte til høyere pris enn frivilligheten. Noen rom er forbeholdt bestemte formål.",
    },
    {
      question: "Hvorfor blir bookingen min avvist?",
      answer:
        "De vanligste årsakene er feil brukertype for rommet, for mange deltakere i forhold til kapasiteten, et formål som ikke er tillatt, for eksempel servering eller salg der det ikke er lov, manglende organisasjonstilknytning når du booker på foreningens vegne, eller at rommet krever booking noen dager i forveien.",
    },
    {
      question: "Hvordan endrer eller avbestiller jeg en booking?",
      answer:
        "Gå inn på bookingen under «Mine bookinger» og rediger den, så lenge du er innenfor kommunens frist. Systemet sjekker at den nye tiden er ledig før endringen lagres. Vil du avbestille, finner du reservasjonen samme sted og trykker avbestill. Er du innenfor fristen for gratis avbestilling, refunderes eventuell betaling etter kommunens regler.",
    },
  ],
  "moterom-kommune-ledige-omrade-mine-oversikt-booking": [
    {
      question: "Hvorfor havner kommunens møterom i separate kalendere?",
      answer:
        "De fleste kommuner har vokst seg til dette problemet, ikke planlagt det: ett bygg tok i bruk Outlook-ressurskalendere, et annet fikk sitt eget bookingskjema, et tredje styrer rommet med en whiteboard-tavle i gangen. Digilist ser typisk fire til seks ulike registreringsmåter i bruk samtidig, fordelt på mellom fem og femten bygg.",
    },
    {
      question: "Hva koster dobbeltbooking av møterom i administrasjonstid?",
      answer:
        "Dobbeltbooking løses som regel med telefon eller e-post fram og tilbake mellom to avdelinger som begge mener de booket først, noe som typisk tar 10 til 15 minutter administrativ tid per konflikt. Har kommunen 20 til 30 slike konflikter i måneden, binder det opp flere timer hver måned.",
    },
    {
      question:
        "Kan kommunen leie ut møterom til lag og næringsliv utenom kontortid?",
      answer:
        "Ja. Flere kommuner leier ut møterom og kurslokaler til lag, foreninger og lokalt næringsliv på kveldstid, med egne priser og egne godkjenningsrutiner for eksterne leietakere. Et idrettslag som trenger et møterom til styremøte én kveld i måneden betaler gjerne en annen sats enn en lokal bedrift som leier samme rom en hel dag.",
    },
  ],
  "moterom-kommune-omrade-ledig-booking-driftsleder": [
    {
      question: "Hva koster det for eksterne å leie et kommunalt møterom?",
      answer:
        "En vanlig modell er at interne avdelinger booker til 0 kroner uten depositum, at lag og foreninger i rabattkategori betaler 50 til 150 kroner timen uten depositum, og at eksterne innen næring eller privat betaler 250 til 450 kroner timen med et depositum på 500 til 1000 kroner. Satsene håndheves automatisk ved booking.",
    },
    {
      question:
        "Hvordan prioriterer kommunen mellom interne møter og ekstern utleie?",
      answer:
        "Reglene settes per rom, ikke globalt. Intern administrasjon har typisk førsteprioritet på dagtid i rådhuset, med automatisk godkjenning for egne ansatte. Lag og foreninger kan få tildelt faste tidsluker på kveldstid, mens innbyggere og eksterne leietakere booker ledig kapasitet utenom kjernetid, med manuell godkjenning fra driftsansvarlig.",
    },
    {
      question:
        "Hvordan unngår kommunen dobbeltbooking av møterom på tvers av bygg?",
      answer:
        "Ved å samle all kapasitet i én plattform. Da ser du ledig møterom i ditt område på tvers av bygg i sanntid, ikke bare rommene i bygget du selv sitter i. Årsaken til dobbeltbooking er nesten alltid at bookingen skjer i flere systemer samtidig, en delt Excel-liste her og en lokal Outlook-kalender der, uten at de snakker sammen i sanntid.",
    },
    {
      question: "Hvor lang tid tar det å sette opp møteromsbooking i kommunen?",
      answer:
        "Oppstarten følger tre steg: bygg rombiblioteket med bygg, kapasitet, utstyr og geografisk område per rom, sett prioriterings- og godkjenningsregler per rom, og koble på Outlook- eller Exchange-synk og ID-porten. De fleste kommuner har rombiblioteket klart og første møterom bookbart i løpet av én til to uker.",
    },
  ],
  "moterom-kommune-omrade-mine-ekstern-utleie-driftsleder": [
    {
      question:
        "Hvor mye tar et transaksjonsbasert bookingsystem av leieinntekten?",
      answer:
        "Mange bookingløsninger tar en prosentandel av hver transaksjon, ofte mellom 3 og 8 prosent. En kommune som leier ut møterom 3 000 timer i året til 250 kroner timen sitter på en bruttoinntekt på 750 000 kroner. Med et transaksjonsgebyr på 5 prosent forsvinner 37 500 kroner rett ut av kommunekassen, år etter år.",
    },
    {
      question:
        "Abonnement eller transaksjonsavgift: hva blir billigst for kommunen?",
      answer:
        "Et fast abonnement koster det samme uansett hvor mange bookinger som gjennomføres, mens en transaksjonsbasert modell stiger med aktiviteten. For en kommune som aktivt jobber med å fylle møterom utenom arbeidstid, blir et abonnement raskt billigere. Regn totalkostnad ved forventet volum om ett og tre år, ikke bare ved dagens bruk.",
    },
    {
      question:
        "Hvordan setter driftsleder opp ulike priser for ulike brukergrupper?",
      answer:
        "Et møterom har sjelden bare én pris. Et praktisk oppsett er internt bruk for kommunale ansatte til 0 kroner og forhåndsgodkjent, lag og foreninger til redusert timepris koblet til medlemsregister, og bedrifter og private til full markedspris med betaling ved booking. Reglene ligger i systemet, ikke i hodet på én person.",
    },
    {
      question:
        "Hvor lang tid tar det å digitalisere møteromsbooking i en kommune?",
      answer:
        "Digitaliseringen starter med en kartlegging av hvilke rom som finnes, i hvilke bygg og med hvilken kapasitet. Deretter defineres prisgrupper og tilgangsnivåer for hver brukergruppe, før løsningen testes i en pilot på ett eller to bygg. En kommune på størrelse med Lillestrøm kan realistisk gå fra kartlegging til full lansering på 6 til 10 uker.",
    },
  ],
  "moterom-kommune-omrade-mine-personlig-oversikt-saksbehandler": [
    {
      question:
        "Hvordan finner en kommuneansatt ledig møterom på tvers av byggene?",
      answer:
        "Du velger område, for eksempel sentrum, en bydel eller en enhet, og får opp alle bookbare rom i de byggene som hører til der, uavhengig av hvem som formelt eier bygget. Filtrering går på område, byggtype, kapasitet og utstyr som prosjektor, videokonferanse og whiteboard, slik at du finner et rom som passer møtet.",
    },
    {
      question: "Kan jeg endre eller avbestille møterommet selv?",
      answer:
        "Ja. Under «Mine bookinger» ligger alle møtene du selv har reservert, uavhengig av hvilket bygg de gjelder. Du kan endre tidspunkt, bytte rom eller avbestille selv, uten å ringe vaktmester eller sende en ny e-post til resepsjonen. Blir rommet tatt ut av drift for vedlikehold, varsles du automatisk slik at du kan omboke.",
    },
    {
      question: "Hvordan hindrer systemet at to ansatte booker samme møterom?",
      answer:
        "Sanntidskalenderen viser status idet du ser på den, ikke slik den så ut da noen sist oppdaterte et regneark. To saksbehandlere kan derfor aldri booke samme rom samtidig, og en booking bekreftes umiddelbart. Bekreftelsen kommer som varsel i appen eller på e-post innen sekunder, ikke som svar neste virkedag.",
    },
    {
      question:
        "Hvor lang tid tar utrullingen fra pilotbygg til hele kommunen?",
      answer:
        "De fleste kommuner starter med ett pilotbygg, typisk rådhuset, i fire til seks uker. Uke 1 til 2 settes rom, brukere og tilgangsregler opp for pilotbygget, uke 3 til 6 kjøres pilotdrift med reell booking, i måned 2 rulles det ut til øvrige bygg ett tjenesteområde av gangen, og i måned 3 er det full drift.",
    },
  ],
  "moterom-bookingsystem-kommune-abonnement-ssal-gdpr": [
    {
      question:
        "Hva bør IT-leder kreve i kravspesifikasjonen for et møteromsystem?",
      answer:
        "Kravspesifikasjonen bør konkretisere antall bygg og rom systemet skal dekke ved oppstart og hvordan nye bygg legges til uten ny avtale, krav til oppetid på typisk 99,5 prosent eller høyere med bot ved brudd, integrasjon mot ID-porten, Active Directory og eksisterende kalendersystem, eierskap til data ved kontraktsslutt, og definert responstid på support.",
    },
    {
      question: "Hvorfor er abonnement bedre enn pris per booking?",
      answer:
        "Mange bookingsystemer tar betalt per transaksjon. For et møteromsystem som skal brukes hundrevis av ganger daglig på tvers av en hel kommune, snur den modellen insentivet på hodet: jo bedre ansatte tar systemet i bruk, jo høyere blir regningen. Går kommunen fra 1 000 til 3 000 bookinger i måneden, tredobles regningen i takt med suksessen.",
    },
    {
      question: "Hvilke skjulte kostnader dukker opp i anbud på bookingsystem?",
      answer:
        "Sjekk hva som ligger i grunnprisen og hva som er solgt som tillegg: integrasjon mot ID-porten og fagsystemer, support med definert responstid, løpende oppgraderinger og sikkerhetspatcher, opplæring av nye brukere og byggforvaltere, og eventuell tilleggsmodul for eksterne betalte utleier. Be leverandøren spesifisere totalpris for en fullt utbygd løsning.",
    },
    {
      question: "Hva krever GDPR av et kommunalt møteromsystem?",
      answer:
        "Møteromsbooking involverer ansattdata: navn, avdeling, arbeidssted og møtehistorikk. For en norsk kommune betyr det krav om databehandleravtale, dokumentert lagring innenfor EØS, og en leverandør som kan vise til ISO 27001 eller tilsvarende sertifisering. Sjekk at leverandøren kan dokumentere dette skriftlig før avtalen signeres.",
    },
  ],
  "ledige-moterom-i-kommunen": [
    {
      question: "Må jeg logge inn for å se ledige møterom i kommunen?",
      answer:
        "Nei. Du kan søke og se ledighet uten innlogging. BankID trengs først når du skal bekrefte en booking. Innloggingen sikrer at reservasjonen knyttes til en reell person eller organisasjon, og at kommunen vet hvem som er ansvarlig for rommet. Du oppgir aldri passordet ditt til kommunen; BankID håndterer selve verifiseringen.",
    },
    {
      question: "Hva koster det å leie et kommunalt møterom?",
      answer:
        "Prisen avhenger av rommet og hvem du er. Mange kommuner har egne satser for lag og foreninger, ofte gratis eller sterkt redusert for barne- og ungdomsaktivitet, mens privatpersoner og bedrifter betaler ordinær leie. Pris per time eller døgn, og eventuelt depositum eller rengjøringsgebyr, står på rommets kort før du bekrefter.",
    },
    {
      question: "Hvordan finner jeg møterom nær meg?",
      answer:
        "Du kan velge bydel eller nærmeste tettsted fra en liste, eller se rommene plottet på et kart. Vil du ha noe i gangavstand, søker du på «møterom nær meg», og portalen sorterer etter avstand fra adressen din. Trenger du parkering eller trinnfri adkomst, huker du av for det i filteret, så faller rom uten det bort.",
    },
    {
      question: "Kan jeg endre eller avbestille en booking selv?",
      answer:
        "Ja. Fra Mine side åpner du bookingen og velger endre eller avbestill. Du ser hva som er ledig for den nye datoen og flytter reservasjonen hvis rommet tillater det. Eventuelle avbestillingsregler, for eksempel gebyr ved avbestilling senere enn 48 timer før, vises før du bekrefter. Rommet blir ledig for andre med en gang.",
    },
  ],
  "leie-bryllupslokale": [
    {
      question: "Hva koster det å leie bryllupslokale?",
      answer:
        "Et lite forsamlingshus eller grendehus koster ofte 3 000 til 6 000 kroner for en helg, og utenfor de største byene finner du hele helger under 5 000 kroner. En sal i et kulturhus ligger typisk mellom 8 000 og 18 000 kroner, mens rene kommersielle selskapslokaler ofte starter på 15 000 til 40 000 kroner for lokalet alene.",
    },
    {
      question: "Hva er inkludert i leien av et bryllupslokale?",
      answer:
        "Bord og stoler, kjøkken med komfyr, ovn, oppvaskmaskin og kjøleskap, grunnbelysning, strøm og oppvarming samt toaletter, garderobe og som regel parkering er ofte inkludert. I tillegg kommer gjerne renhold til 1 500 til 4 000 kroner, servise i noen lokaler, teknisk utstyr som projektor og mikrofon, og duker, pynt og catering.",
    },
    {
      question: "Hvor mange gjester får plass i et bryllupslokale?",
      answer:
        "Et lokale merket for 150 personer tar gjerne 150 stående, men bare 90 til 100 ved langbord med servering. Regn 1,5 til 2 kvadratmeter per gjest ved bordsetting, og mer hvis buffé og dansegulv skal inn i samme rom. Sjekk både godkjent makskapasitet av branntekniske hensyn og hva lokalet realistisk rommer.",
    },
    {
      question: "Hvor stort er depositumet, og når får vi det tilbake?",
      answer:
        "Et depositum på 2 000 til 5 000 kroner er vanlig, og enkelte store lokaler krever mer. Beløpet betales ved booking og holdes tilbake som sikkerhet mot skader, tapt nøkkel og manglende rydding. Det betales tilbake etter en godkjent sluttbefaring, så det er ingen ekstra kostnad hvis alt er i orden.",
    },
  ],
  "bryllupslokale-pris-norge-regioner-lokaltyper": [
    {
      question: "Hva koster et bryllupslokale i Norge?",
      answer:
        "For selve lokaleleien, uten mat og drikke, ligger de fleste par mellom 12 000 og 45 000 kroner for en helgedag. Legger du til pakkepris med catering fra hotell eller selskapslokale, havner totalprisen for lokale og mat som regel mellom 900 og 1 600 kroner per gjest, altså 65 000 til 110 000 kroner med 70 gjester.",
    },
    {
      question: "Hvor mye dyrere er Oslo enn distriktene?",
      answer:
        "Lokaleleien ligger på 25 000 til 60 000 kroner i Oslo, 20 000 til 45 000 i Bergen, 18 000 til 42 000 i Stavanger, 18 000 til 40 000 i Trondheim og 10 000 til 25 000 i distriktene. Forskjellen mellom Oslo og distriktene kan altså være 15 000 til 35 000 kroner for lokalet alene.",
    },
    {
      question: "Hva koster gård, hotell og selskapslokale?",
      answer:
        "Gård koster 15 000 til 35 000 kroner for helgeleie, ofte som bart lokale. Hotell prises som pakke fra 950 til 1 450 kroner per kuvert, med sal, servering og ofte overnatting til brudeparet inkludert. Selskapslokale og grendehus ligger på 8 000 til 18 000 kroner, mens unike lokaler som fyr, låve og sjøhus koster 20 000 til 50 000 kroner.",
    },
    {
      question: "Når lønner pakkepris seg framfor ren lokaleleie?",
      answer:
        "Pakkepris lønner seg når dere er over 60 gjester eller har begrenset tid til planlegging, fordi stordriftsfordelene hos hotellet veier opp for påslaget. Er dere færre enn 40 gjester og kjenner noen som kan stå for mat, snur regnestykket ofte i favør av ren lokaleleie.",
    },
  ],
  "bryllupslokale-kapasitet-m2-per-gjest-dansegulv": [
    {
      question: "Hvor mange kvadratmeter trenger vi per gjest?",
      answer:
        "Tommelfingerregelen for sittende gjester rundt runde bord er 1,2 til 1,5 kvadratmeter per person, inkludert stolplass og gangareal mellom bordene. Skal lokalet i tillegg romme dansegulv, scene og buffet, bør dere regne 1,8 til 2 kvadratmeter per gjest. Ved stående mingling uten faste bord kan dere regne ned mot 0,8 til 1 kvadratmeter.",
    },
    {
      question: "Hvor mange gjester får plass i et lokale på 150 kvadratmeter?",
      answer:
        "Et lokale på 150 kvadratmeter gir plass til rundt 100 sittende gjester med festmøblering, ikke 150 slik den rå arealoppgaven kan tyde på. Et lokale på 200 kvadratmeter som markedsføres som «opptil 180 gjester», holder i praksis rundt 100 til 110 når dansegulv og servering legges inn fullt ut.",
    },
    {
      question: "Hvor mye plass tar dansegulvet?",
      answer:
        "Dansegulv på 30 til 40 kvadratmeter er standard for 80 til 100 gjester, og det arealet må trekkes fra spiseplassen, ikke legges på toppen av den oppgitte kapasiteten. Scene til brudepar, DJ-bord og eventuell fotoboks legger typisk beslag på ytterligere 8 til 12 kvadratmeter.",
    },
    {
      question: "Hva koster det å velge et for stort lokale?",
      answer:
        "Et lokale dimensjonert for 150 gjester leies typisk ut for 40 000 til 45 000 kroner uansett faktisk belegg, mens et lokale skreddersydd for 60 gjester ofte koster 15 000 til 18 000 kroner. Booker dere 60 gjester i det store lokalet, ender dere på 667 til 750 kroner per gjesteplass, mot 250 til 300 kroner i det riktig dimensjonerte.",
    },
  ],
  "bryllupslokale-hva-er-inkludert-befaringsguide": [
    {
      question: "Hva er inkludert i leieprisen for et bryllupslokale?",
      answer:
        "Sjekk konkret om bord, stoler og duker, lyd- og lysanlegg, dansegulv, rydding og vask, garderobe og toaletter, vertskap under arrangementet, strøm til DJ eller band og adgang for rigging dagen før er med i grunnprisen. Mange lokaler oppgir en lav grunnpris og legger til 8 000-15 000 kroner i tilleggsleie for dansegulv, lyd og rydding alene.",
    },
    {
      question: "Trenger vi skjenkebevilling i et leid bryllupslokale?",
      answer:
        "Private lokaler har normalt ikke fast skjenkebevilling for enkeltarrangementer. Skal det serveres alkohol utover det gjestene selv tar med, må dere som regel søke kommunen om ambulerende skjenkebevilling. Søknadsfristen er ofte tre til fire uker før arrangementet, og gebyret ligger gjerne i sjiktet 300-400 kroner. Hotell har som regel bevilling på plass.",
    },
    {
      question: "Hvor mange gjester rommer lokalet egentlig?",
      answer:
        "Regn med 20-30 prosent mindre reell kapasitet enn lokalets oppgitte maksimumstall når alt skal inn i rommet. Et lokale markedsført for 150 sitteplasser rommer ofte reelt 100-120 gjester med dansegulv og buffé inkludert. Be alltid utleier om en oppsatt planskisse for akkurat deres gjestetall og bordoppsett.",
    },
    {
      question: "Hvor lang tid i forkant bør vi booke lokalet?",
      answer:
        "Populære lokaler i mai til september bør bookes 10-14 måneder i forveien, spesielt for lørdager. Utenfor høysesong, som januar, februar eller november, kan seks til åtte måneder holde, og dere har ofte bedre forhandlingsrom på pris. Er dere fleksible på ukedag eller sesong, kan dere vente lenger.",
    },
  ],
  "bryllupslokale-vigsel-mottakelse-ett-eller-to-lokaler": [
    {
      question: "Kan vi holde en borgerlig vigsel i et leid selskapslokale?",
      answer:
        "En borgerlig vigsel kan i utgangspunktet holdes hvor som helst, også i et leid selskapslokale, så lenge vigsler, brudepar og to myndige vitner er fysisk til stede. Det avgjørende er ikke en formell godkjenning av rommet, men om vigsleren har tilgang på riktig tidspunkt og om lokalet har ryddig plass til seremonien atskilt fra festriggingen.",
    },
    {
      question: "Lønner det seg å ha vigsel og fest på samme sted?",
      answer:
        "Ett lokale leid for hele dagen, typisk fra klokken 10 til midnatt, koster ofte 25 000-45 000 kroner i leie alene. To lokaler blir sjelden billigere: et separat festlokale på kveldstid ligger på 15 000-35 000 kroner, og legger dere til transport mellom stedene, spiser besparelsen på kortere leietid ofte opp forskjellen.",
    },
    {
      question: "Hvor lang avstand kan vi ha mellom seremoni og fest?",
      answer:
        "En avstand på 20-25 minutters kjøring er normalt håndterbart. Over 45 minutter bør dere sette av en egen transportpost i budsjettet, gjerne buss for gjestene, siden mange ellers kommer for sent til mottakelsen. Regn i tillegg inn 60-90 minutter til fotografering mellom seremonien og festen.",
    },
    {
      question: "Hva må være på plass før vigselen kan gjennomføres?",
      answer:
        "Brudeparet må ha en gyldig prøvingsattest fra Skatteetaten før vigselen kan gjennomføres. Attesten er knyttet til brudefolkets papirer, ikke til lokalet, men den må foreligge og fremvises til vigsleren på selve dagen. Avklar den tidlig, og hold den helt adskilt fra bookingen av lokale.",
    },
  ],
  "bryllupslokale-planlegging-tidslinje-pris-tilgjengelighet": [
    {
      question: "Når bør vi begynne å søke etter bryllupslokale?",
      answer:
        "Regn med 12 til 18 måneder fra frieri til bryllupsdag hvis dere vil ha en lørdag i juni, juli eller september. Populære lokaler i og rundt Oslo, Bergen, Trondheim og Stavanger tar ofte imot bestillinger så tidlig som 18 måneder frem i tid, mens hverdager og lavsesong fortsatt lar seg booke 4 til 6 måneder før.",
    },
    {
      question: "Hvorfor forsvinner de mest populære datoene først?",
      answer:
        "Norge har rundt 24 000 vielser i året ifølge SSB, og en stor andel samler seg i sommerhalvåret, med lørdager som den klart mest etterspurte ukedagen. Det gir et smalt tidsvindu mot bred etterspørsel, og lokaler med kapasitet til 80-120 gjester og uteareal egnet for vielsen blir fullbooket for hovedsesongen allerede tidlig på nyåret.",
    },
    {
      question: "Hvor mye depositum må vi betale, og når forfaller resten?",
      answer:
        "De fleste bryllupslokaler krever 20-30 prosent av totalprisen i depositum ved signering, ofte ikke refunderbart ved avbestilling. Andre rate på gjerne 30-40 prosent forfaller rundt seks måneder før, basert på foreløpig gjestetall, og sluttoppgjøret 2-4 uker før, basert på endelig gjestetall og tillegg som overtid, rigg eller ekstra catering.",
    },
    {
      question: "Hva koster det å endre dato etter at vi har booket?",
      answer:
        "En datoendring mer enn 6 måneder før koster som regel lite eller ingenting utover et administrasjonsgebyr, forutsatt at den nye datoen er ledig hos lokalet. Nærmere enn 3 måneder før behandles det ofte som en ny booking med nytt depositum, fordi lokalet allerede har avvist andre forespørsler for datoen dere forlater.",
    },
  ],
  "bryllupslokale-pris-flytt-dato-lavsesong": [
    {
      question: "Hva koster et bryllupslokale for 80 til 100 gjester?",
      answer:
        "For et selskap på 80 til 100 gjester ligger totalprisen for lokale, mat og drikke typisk mellom 800 og 1 400 kroner per gjest, altså 65 000 til 140 000 kroner samlet. Selve lokalleien varierer fra rundt 15 000 kroner for et enkelt grendehus eller forsamlingshus til over 60 000 kroner for en eksklusiv gård med overnatting og eget kjøkken.",
    },
    {
      question: "Hvor mye sparer vi på å gifte oss i lavsesong?",
      answer:
        "Høysesongen juni til august går til full listepris. Skuldersesong i april, mai og september gir 10 til 20 prosent lavere lokalleie, med samme kvalitet på lokalet og samme meny, mens lavsesong fra oktober til mars kan gi 30 til 40 prosent lavere pris. Desember er unntaket, siden julearrangementer holder prisen oppe.",
    },
    {
      question: "Hvor mye billigere er fredag eller søndag enn lørdag?",
      answer:
        "Et fredagsbryllup ligger typisk 15 til 25 prosent under lørdagsprisen, mens et søndagsbryllup kan ligge 20 til 30 prosent under. For et lokale som tar 40 000 kroner for en lørdag i lavsesong, betyr det ofte 28 000 til 32 000 kroner for en søndag samme helg.",
    },
    {
      question: "Hvilke kostnader endrer seg ikke med datoen?",
      answer:
        "Depositumet er som regel fast, typisk 5 000 til 15 000 kroner uavhengig av sesong. Catering per kuvert varierer med leverandør og meny, ikke med dato, og det samme gjelder leie av service, dekorasjon og lyd. Minimumsbeløpet for mat og drikke er derimot ofte høyere i høysesong.",
    },
  ],
  "bryllupslokale-typer-gard-hage-unikt-lokale": [
    {
      question: "Hvilke typer bryllupslokaler kan vi velge mellom?",
      answer:
        "De fleste norske bryllupslokaler faller i fem kategorier: gårdsbryllup, hagebryllup, selskapslokale, hotell og unike lokaler som fabrikkbygg, loft eller galleri. Forskjellen ligger sjelden i pris alene, men i hvor mye dere selv må organisere. Et hotell leverer mat, servering og ofte overnatting under ett tak, mens en gård krever at dere setter sammen catering, telt og toaletter selv.",
    },
    {
      question: "Hvor mange gjester tar de ulike lokaltypene?",
      answer:
        "Selskapslokaler tar typisk 50 til 120 gjester, mens gårder og hager ofte har plass til 150 til 300 med telt. For unike lokaler som fabrikkbygg, loft eller galleri må dere avklare brannforskriftene og maks antall personer godkjent for stedet, siden lokalet i utgangspunktet ikke er bygget for selskap.",
    },
    {
      question: "Hva krever et gårdsbryllup ekstra planlegging til?",
      answer:
        "Et gårdsbryllup krever værsikring, strøm til musikk og lys, parkering for gjester som kommer med bil, og ofte leie av telt separat fra selve gården. Mange gårder ligger utenfor by, så avstand for gjestene bør avklares tidlig. Sjekk også om gården har skjenkebevilling for arrangementer, eller om dere må søke selv gjennom kommunen.",
    },
    {
      question: "Når bør vi booke, og hvilke lokaler går først?",
      answer:
        "Lørdager i juni og august er mest etterspurt, og populære lokaler i disse periodene bookes typisk 12 til 18 måneder i forveien. Selskapslokaler og hotell i byer som Bergen og Trondheim går ofte tidligst unna, mens enkelte gårder og hager har bedre ledighet også seks til ni måneder før.",
    },
  ],
  "bryllupslokale-regler-skjenking-rigging-sjekkliste": [
    {
      question: "Trenger vi skjenkebevilling i bryllupet?",
      answer:
        "Skal dere servere alkohol, må enten lokalet ha egen fast skjenkebevilling, eller dere må søke om bevilling for en enkelt anledning i kommunen der lokalet ligger. Gebyret varierer fra kommune til kommune, og søknaden bør sendes minst fire uker før arrangementet, siden enkelte kommuner har lang saksbehandlingstid i høysesong for bryllup.",
    },
    {
      question: "Kan vi ta med egen alkohol til bryllupslokalet?",
      answer:
        "Det må avtales særskilt, siden de fleste lokaler enten krever korkepenger eller nekter medbrakt alkohol helt. Har lokalet fast bevilling, er det ofte enklere og rimeligere enn å søke selv, men da er dere også bundet av lokalets utvalg og priser på drikke. Sjekk også skjenketiden, som kommunen eller husreglene kan sette kortere enn alkoholloven.",
    },
    {
      question: "Hvor lang tid trenger vi til rigging av lokalet?",
      answer:
        "Dekoratøren trenger ofte 3 til 4 timer for bord, blomster og lys, og cateringfirmaet gjerne 2 timer til klargjøring av kjøkken. Spør konkret om dere får tilgang dagen før eller samme morgen, og når alt må være ryddet ut. Spør også om det finnes vareheis eller egen leveringsinngang.",
    },
    {
      question: "Hvilke husregler bør vi sjekke før vi signerer?",
      answer:
        "Sjekk lydnivå og kveldsstopp, som mange lokaler setter mellom klokken 23.00 og 00.00, om levende lys er tillatt eller kun batteridrevne, om dyr slipper inn, om røyking kun er tillatt utendørs, om egen catering er tillatt, og hva makstallet for gjester er. Be om dokumentasjon på godkjent persontall, ikke bare utleiers muntlige anslag.",
    },
  ],
  "bryllupslokale-prismodeller-kuvertpris-pakkepris-lokaleleie": [
    {
      question: "Hva er kuvertpris på et bryllupslokale?",
      answer:
        "Kuvertpris er en fast sum per gjest, typisk 950-1 400 kroner, som regel inkludert mat, servering og bruk av lokalet i et avtalt tidsrom. Modellen passer best når gjestetallet er usikkert helt frem til påmeldingsfristen, siden dere betaler for faktisk oppmøte og ikke for et antall dere har bundet dere til på forhånd.",
    },
    {
      question: "Hva koster et bryllupslokale med ren lokaleleie?",
      answer:
        "Ren lokaleleie er en fast leiesum for selve rommet, gjerne 15 000-40 000 kroner, hvor dere bestiller catering, servering og utstyr selv. Men mange leieavtaler har forbrukskrav på ofte 700-900 kroner per gjest. Med 90 gjester blir det fort 63 000-81 000 kroner i tillegg til selve leien, før personale, servise eller lydanlegg er lagt til.",
    },
    {
      question: "Hvordan sammenligner du tilbud med ulike prismodeller?",
      answer:
        "Regn alt om til én total kostnad delt på antall gjester: legg sammen leie, forbrukskrav, tillegg og depositum, del på antall gjester dere faktisk planlegger å invitere, og sammenlign kronebeløpet per gjest på tvers av lokalene i stedet for kuvertprisen alene mot pakkeprisen alene. Regn alltid ut fra deres faktiske gjestetall, ikke lokalets anbefalte makstall.",
    },
    {
      question: "Hvor stort depositum er normalt for et bryllupslokale?",
      answer:
        "Et depositum på 15-25 prosent av totalsummen ved signering er normalt, gjerne med resten fordelt på to til tre innbetalinger frem mot bryllupsdagen, for eksempel 20 prosent ved signering, 30 prosent seks måneder før og resten 30 dager før. Et varselsignal er et depositum over 50 prosent uten skriftlig avbestillingsklausul.",
    },
  ],
  "bryllupslokale-pris-guide": [
    {
      question: "Hva koster et bryllupslokale i Norge?",
      answer:
        "Et forsamlingshus eller bygdehus ligger typisk på 5 000 til 15 000 kroner for hele døgnet, et rent selskapslokale i by på 15 000 til 40 000 kroner, og gods og gårder med eksklusiv bruk av hele anlegget på 40 000 til 120 000 kroner. Hoteller tar sjelden fast leiepris, men legger salen inn i en pakkepris per gjest, gjerne 900 til 1 800 kroner inkludert mat.",
    },
    {
      question: "Hvor mye billigere er et bryllup utenfor høysesong?",
      answer:
        "Mai til august er høysesong for bryllup i Norge, og mange utleiere legger en sesongpremie på 20 til 40 prosent oppå grunnprisen for lørdager i juni og juli. Bytter dere til fredag eller søndag samme måned, faller prisen gjerne 10 til 15 prosent. Legger dere bryllupet til en hverdag i november eller januar, kan leieprisen halveres sammenlignet med en junilørdag på samme lokale.",
    },
    {
      question: "Hvor mye depositum krever et bryllupslokale?",
      answer:
        "De fleste utleiere krever et depositum på 10 til 20 prosent av totalprisen, eller et fast beløp mellom 5 000 og 15 000 kroner, for å reservere datoen. Avbestillingsvilkårene er ofte trappet: full refusjon ved avbestilling mer enn 90 dager før, delvis refusjon ved 30 til 60 dager, og ingen refusjon nærmere enn 14 dager.",
    },
    {
      question: "Hvilke skjulte kostnader kommer i tillegg til leieprisen?",
      answer:
        "Spør alltid om korkasje for medbrakt drikke, ofte 100 til 300 kroner per flaske. Rengjøring utover grunnvask faktureres separat mange steder, gjerne 2 000 til 5 000 kroner. Overtid utover avtalt sluttidspunkt koster typisk 1 500 til 3 000 kroner per time, og mange utleiere krever egen arrangementsforsikring, som koster fra 500 til 1 500 kroner.",
    },
  ],
  "bryllupslokale-budsjett-pris-per-gjest": [
    {
      question: "Hva koster et bryllupslokale per gjest?",
      answer:
        "Som praktisk referanse ligger totalkostnaden for lokale og catering til sammen typisk mellom 3 000 og 4 500 kroner per gjest hos norske bryllupslokaler, avhengig av om bar og drikke er inkludert i pakken. Tallet er nyttig som utgangspunkt, men sier ikke noe om akkurat deres gjesteliste og lokale, så bruk det som en grov sjekk, ikke en fasit.",
    },
    {
      question: "Hvordan regner dere ut reell pris per gjest?",
      answer:
        "Del alltid totalprisen på antall gjester før dere sammenligner lokaler. Lokalleie per gjest er leiepris delt på antall gjester, catering per gjest er tilbudt pris fra cateringfirmaet, og totalpris per gjest er summen av de to pluss eventuelle tillegg som rigg, vakthold og rydding. Legg de tre tallene i et regneark for hvert lokale dere vurderer.",
    },
    {
      question: "Hvor mye sparer dere på å flytte bryllupet til lavsesong?",
      answer:
        "Juni, juli og august er høysesong, og mange tar 20 til 40 prosent høyere pris i disse månedene enn i november eller februar. Lørdag er dyrest, fredag ofte 10 til 15 prosent billigere, og søndag eller hverdag kan gi 20 til 30 prosent rabatt. Et lokale som normalt tar 35 000 kroner en lørdag i juli, tilbys ofte for 25 000 til 28 000 kroner en fredag i oktober.",
    },
    {
      question: "Hvordan bør dere fordele bryllupsbudsjettet?",
      answer:
        "En vanlig fordeling for et bryllup med 80 til 100 gjester er om lag 30 prosent til lokale, 35 prosent til mat og drikke, 15 prosent til foto og underholdning, 10 prosent til antrekk, og 10 prosent til dekor og øvrig. Sett et samlet tak først, fordel deretter prosentvis, og hold av 5 til 10 prosent som buffer til uforutsette kostnader.",
    },
  ],
  "bryllupslokale-pris-skjulte-kostnader": [
    {
      question: "Hva koster et bryllupslokale i 2026?",
      answer:
        "Et enkelt grendehus eller forsamlingslokale starter gjerne på 8 000 til 15 000 kroner for leie av selve lokalet en helg. Et selskapslokale med servering og eget personale ligger typisk mellom 25 000 og 60 000 kroner for 80 til 120 gjester. Gårder og hoteller med eksklusiv bruk av hele anlegget kan lande på 80 000 til 200 000 kroner.",
    },
    {
      question: "Hva betyr minimumsforbruk på et bryllupslokale?",
      answer:
        "Minimumsforbruk betyr at lokalet er gratis eller billig å leie, men at dere forplikter dere til å bruke et minstebeløp på mat og drikke, ofte 800 til 1 500 kroner per gjest hos gårder og hoteller. Det er modellen flest overraskes av, fordi lokalet virker billig i annonsen mens den reelle kostnaden ligger i barregningen.",
    },
    {
      question: "Hvilke skjulte kostnader har et bryllupslokale?",
      answer:
        "Fire poster går ofte utenom fra-prisen: depositum på 5 000 til 20 000 kroner, opprydding og rengjøring på 2 000 til 6 000 kroner, overtid på 500 til 1 500 kroner per påbegynte time utover avtalt sluttid, og korkepenger for medbrakt drikke, ofte 100 til 250 kroner per flaske. Spør konkret om alle fire før dere ber om skriftlig tilbud.",
    },
    {
      question: "Hvordan forhandler dere ned prisen på bryllupslokalet?",
      answer:
        "Spør om lavsesongrabatt hvis dere kan flytte dato til januar til mars eller november. Be om å fjerne poster dere ikke trenger, som DJ-anlegg eller ekstra vertinne, i stedet for å be om rabatt på totalen. Mange lokaler gir 5 til 10 prosent for bestilling mer enn tolv måneder før. Spør også om minimumsforbruket kan reduseres mot noe mer i fast leie.",
    },
  ],
  "bryllupslokale-pris-sesong-ukedag": [
    {
      question: "Når bør dere booke bryllupslokale?",
      answer:
        "Populære lokaler for lørdager i mai til august booker ofte fullt 12 til 18 måneder i forveien. Venter dere til seks måneder før, sitter dere igjen med et smalt utvalg og lite forhandlingsrom. Booker dere 12 til 24 måneder frem i tid, får dere velge fritt blant både dato og lokale, og flere utleiere gir tidligbooking-rabatt.",
    },
    {
      question: "Hvor mye billigere er et bryllup på hverdag?",
      answer:
        "Høysesong er mai til september, med topp i juni og august, og prisen ligger da ofte 20 til 40 prosent høyere enn i lavsesong. Lørdag er dyrest og booket lengst frem i tid. Fredag og søndag ligger typisk 15 til 25 prosent under lørdagsprisen, mens hverdager fra mandag til torsdag kan gi 30 til 50 prosent rabatt hos lokaler som ellers står tomme.",
    },
    {
      question: "Hvorfor koster samme sal så ulikt på to datoer?",
      answer:
        "Ta samme sal med plass til 100 gjester. En lørdag i juni, booket ni måneder før og med kveldsselskap til klokken 02, gir grunnpris 45 000 kroner og totalt rundt 58 000 kroner med obligatorisk cateringpakke og overtidstillegg. En søndag i oktober, booket 14 måneder før og avsluttet klokken 22, gir 27 000 kroner i grunnpris og rundt 32 000 kroner totalt.",
    },
    {
      question:
        "Hvilket depositum krever et bryllupslokale, og hva skjer ved avbestilling?",
      answer:
        "De fleste bryllupslokaler krever depositum på 10 til 20 prosent av totalsummen ved signering, med restbeløpet betalt 30 til 60 dager før datoen. Spør konkret om det koster noe å flytte datoen, om depositumet er refunderbart, delvis refunderbart eller tapt ved avbestilling, og om det finnes en frist der resten forfaller uansett. Be om at punktene står i selve kontrakten.",
    },
  ],
  "bryllupslokale-totalpris-depositum-tillegg": [
    {
      question: "Hva koster et bryllupslokale i 2026?",
      answer:
        "En enkel forsamlingssal eller bygdehus koster 4.000 til 9.000 kroner for kvelden. Et selskapslokale med kjøkken og servise ligger på 12.000 til 25.000 kroner, en gård eller lada med eget uteareal på 20.000 til 40.000 kroner, og et eksklusivt lokale med catering og overnatting inkludert på 40.000 kroner og oppover. En lørdag i juni koster ofte 20-30 prosent mer enn samme lokale en fredag i november.",
    },
    {
      question: "Hvilke skjulte kostnader kommer i tillegg til leieprisen?",
      answer:
        "Depositum for bryllupslokale ligger vanligvis mellom 3.000 og 10.000 kroner. De vanligste skjulte postene er overtid utover avtalt sluttidspunkt, ofte 1.500-3.000 kroner per påbegynt time, rydding og søppelhåndtering, ansvarsforsikring for arrangementet, nøkkelvakt eller vertskap utover åpningstid, korkeavgift for medbrakt drikke, og minstekjøp av mat eller drikke fra lokalets eget kjøkken.",
    },
    {
      question: "Hvordan regner dere ut totalprisen på et bryllupslokale?",
      answer:
        "Bruk en enkel modell: leiepris pluss tillegg for stoler, servise og lyd, pluss depositum, pluss 10 prosent buffer for overtid eller ekstra timer. For et lokale med grunnpris 18.000 kroner, 4.000 kroner i tillegg og 5.000 kroner i depositum bør dere budsjettere med rundt 24.000-26.000 kroner reelt bundet, selv om depositumet i praksis kommer tilbake.",
    },
    {
      question: "Hvorfor varierer prisen per gjest så mye?",
      answer:
        "Pris per gjest faller når lokalet fylles opp, fordi den faste kostnaden til leie, oppvarming og personale fordeles på flere. Et lokale til 20.000 kroner gir 400 kroner per hode ved 50 gjester, rundt 267 kroner ved 75 gjester og 200 kroner ved 100 gjester. Samtidig øker mat, drikke og servise proporsjonalt, så totalregnestykket flater ofte ut rundt 60-70 gjester.",
    },
  ],
  "leie-bryllupslokale-pris-guide": [
    {
      question: "Hva koster det å leie bryllupslokale i Norge?",
      answer:
        "Et rent selskapslokale i en by koster typisk 15 000 til 35 000 kroner for en helg, uten catering. En gård med hage og eventuelt overnatting ligger ofte på 20 000 til 50 000 kroner. Hoteller og kulturhus selger som regel bryllup som pakke per gjest, fra 900 til 1 800 kroner inkludert mat, drikke og bord og stoler.",
    },
    {
      question: "Hvor mye dyrere er bryllupslokale i Oslo og Bergen?",
      answer:
        "Lokaler i Oslo og Bergen ligger gjerne 20 til 30 prosent høyere enn tilsvarende lokaler i mindre byer og distriktene, både fordi etterspørselen er høyere og fordi færre lokaler konkurrerer om samme helg. Et bryllup for 80 gjester som koster 25 000 kroner i leie i Oslo, kan koste 18 000 til 20 000 kroner for et tilsvarende lokale i Innlandet eller Trøndelag.",
    },
    {
      question: "Hva er inkludert i leieprisen for et bryllupslokale?",
      answer:
        "Selve leieprisen dekker som regel bare lokalet, oppvarming eller kjøling, og et gitt antall timer, typisk 6 til 10 timer inkludert rigging og rydding. Catering, dekor, blomster, DJ eller band og overnatting til gjester kommer nesten alltid i tillegg. Regn med 800 til 1 200 kroner per couvert for en tre retters meny med servering, og egne priser for drikkepakker.",
    },
    {
      question: "Må dere søke egen skjenkebevilling til bryllupet?",
      answer:
        "Skal dere servere alkohol utover det lokalet selv har skjenkebevilling for, må dere søke egen skjenkebevilling for enkeltanledning hos kommunen der lokalet ligger. Søknaden bør sendes minst seks uker før bryllupet, og de fleste kommuner krever dokumentasjon på ansvarshavende og internkontroll for skjenking.",
    },
  ],
  "konferanse-sal-kommune-priser-arrangor-kulturarrangement": [
    {
      question:
        "Hva koster det å leie konferansesal eller kultursal i kommunen?",
      answer:
        "De fleste kommuner opererer med to prisnivåer for samme sal. Lag og foreninger med lokal tilknytning betaler normalt en subsidiert timepris, mens kommersielle arrangører betaler full sats. Forskjellen ligger typisk på 2 til 3 ganger prisen: en frivillig lagsleie kan ligge rundt 150 til 250 kroner timen, mens en bedrift eller profesjonell arrangør betaler 400 til 600 kroner for samme rom.",
    },
    {
      question: "Hva inkluderer timeprisen på en kultursal?",
      answer:
        "Timeprisen på nettsiden er sjelden hele historien. Sjekk om rigging og nedrigging, bord, stoler og garderobe, vaktmestertilsyn utenom normal åpningstid og rengjøring er inkludert, og hva depositumet er, gjerne 3 000 til 8 000 kroner for større kultursaler. Et seminarlokale til 3 000 kroner dagen kan ende på 6 000 til 7 000 kroner når tilleggene legges til.",
    },
    {
      question: "Hvor lang tid tar det å få en kommunal sal godkjent?",
      answer:
        "For kommunale saler tar godkjenning ofte 3 til 10 virkedager, fordi saksbehandler må vurdere arrangementstype opp mot ordensregler og andre bookinger i samme periode. Private utleiere bekrefter som regel innen 24 til 48 timer. Book i god tid for konserter og større kulturarrangement, siden populære saler i sentrale byer fylles opp flere måneder frem i høysesongen.",
    },
    {
      question: "Hvorfor stiger totalprisen selv om leieprisen står stille?",
      answer:
        "Kommunale satser justeres normalt én gang i året, men strøm- og energitillegg legges på separat i mange bygg etter hvert som driftskostnadene øker. Forsikringskrav for konserter med publikum over 200 personer kan kreve egen arrangørforsikring som ikke står i den offisielle prislisten. Sesong spiller også inn, og helgeleie har ofte et eget tillegg sammenlignet med hverdager.",
    },
  ],
  "bryllupslokale-forhandle-pris-sammenligne-tilbud": [
    {
      question:
        "Hva er faktisk forhandlingsbart på prisen for et bryllupslokale?",
      answer:
        "Leieprisen for selve lokalet er som regel forhandlingsbar, særlig ved lavere etterspørsel. Det samme gjelder overtid utover avtalt sluttidspunkt, opprydding og vask som ofte er lagt inn som fast tillegg og kan reduseres eller strykes, og møblering og oppsett som bord, stoler og lystavlinger. Skjenkebevilling, maksimalt antall gjester og lovpålagte krav til brannsikkerhet ligger utenfor forhandlingsrommet.",
    },
    {
      question: "Hvor mye billigere er et bryllup på hverdag i lavsesong?",
      answer:
        "Dato er det sterkeste kortet dere har. En lørdag i juni i Oslo-området kan ligge på 35 000 til 45 000 kroner i ren lokalleie, mens samme lokale en hverdag i november ofte havner på 15 000 til 20 000 kroner, en forskjell på 40 til 50 prosent. Fredag ettermiddag og søndag ligger typisk midt mellom.",
    },
    {
      question: "Når bør dere booke for å få lavest pris?",
      answer:
        "To ulike strategier gir lavere pris. Booker dere 12 til 18 måneder i forveien, får dere ofte tidligbestillingsrabatt fordi lokalet sikrer inntekt lenge før datoen. Booker dere en restplass tre til seks uker før, forhandler dere fra motsatt side: lokalet taper penger på en tom dato. Begge fungerer, men ingen av dem fungerer hvis dere booker midt imellom.",
    },
    {
      question: "Hvordan bruker dere flere tilbud som forhandlingsgrunnlag?",
      answer:
        "Å ringe ett lokale og be om rabatt gir sjelden resultat, fordi utleieren ikke har noe å måle seg mot. Be i stedet tre til fem lokaler om et sammenlignbart tilbud for samme dato, samme gjestetall og samme omfang, og bruk det billigste tilbudet aktivt når dere snakker med favoritten.",
    },
  ],
  "sal-billigst-kommune-totalpris-depositum-privatperson": [
    {
      question: "Hva koster det egentlig å leie en kommunal sal?",
      answer:
        "Timeprisen er sjelden tallet du ender med å betale. En sal som koster 250 kroner timen i seks timer gir 1 500 kroner på papiret, men med depositum, rengjøring og en obligatorisk vertstjeneste kan totalen lande på 4 000 til 6 000 kroner, altså to til fire ganger grunnprisen. Forskjellen mellom to saler ligger nesten alltid i tilleggspostene, ikke i timeprisen.",
    },
    {
      question: "Hva koster depositum, rengjøring og vertstjeneste?",
      answer:
        "Depositum ligger vanligvis på 2 000 til 5 000 kroner og refunderes etter godkjent sluttsjekk av lokalet. Rengjøringsgebyr er 800 til 1 500 kroner hvis du ikke rydder og vasker selv. Vertstjeneste, altså en ansatt som må være til stede under arrangementet, koster ofte 300 til 500 kroner timen og er i mange saler obligatorisk etter klokken 22.",
    },
    {
      question: "Hvorfor betaler lag og foreninger mindre for samme sal?",
      answer:
        "Lag, foreninger og frivillige organisasjoner får ofte 30 til 50 prosent rabatt sammenlignet med private leietakere, fordi kommunen subsidierer lokalt organisasjonsliv gjennom lavere utleiepriser. En sal som koster 400 kroner timen for en privatperson, kan dermed koste 200 til 280 kroner timen for et registrert lag. Sjekk om kommunen skiller mellom medlemspris, lagspris og fullpris.",
    },
    {
      question: "Når er kommunale saler billigst å leie?",
      answer:
        "Fredag og lørdag kveld i mai og juni er dyrest, ofte 20 til 40 prosent over grunnpris, fordi konfirmasjon og bryllup fyller kalenderen i samme periode. Desember har et tilsvarende press. Hverdager, særlig tirsdag og onsdag ettermiddag utenom skoleferier, er nesten alltid billigst, og vinterhalvåret utenom desember gir lavere etterspørsel og bedre pris.",
    },
  ],
  "leie-sal-billigst-kommunal-privat-totalpris-sammenligning": [
    {
      question: "Er kommunal sal alltid billigst?",
      answer:
        "Nei. Kommunale saler har lav timepris fordi de er finansiert med skattepenger, men timeprisen er bare ett ledd i regnestykket. I et regneeksempel kan en kommunal sal koste 380 kroner timen og likevel kreve åtte timers minimumsleie, obligatorisk vask til 900 kroner og et depositum på 3000 kroner. Et privat selskapslokale i samme by kan ha flat pris på 6500 kroner inkludert vask, bord og stoler.",
    },
    {
      question:
        "Hvorfor varierer prisen på private saler mer enn på kommunale?",
      answer:
        "Kommunale priser følger et politisk vedtatt regulativ, normalt vedtatt én gang i året, og prisen er lik uansett ukedag eller sesong. Private utleiere prissetter etter etterspørsel, slik hoteller gjør: en lørdag i høysesong koster mer enn en hverdag utenfor sesong, men prisen faller ofte kraftig utenfor høysesong fordi utleier prioriterer inntekt fremfor et tomt lokale.",
    },
    {
      question: "Hvilke skjulte kostnader avgjør hvilken sal som er billigst?",
      answer:
        "Fire poster snur ofte rangeringen: rengjøring, der enkelte kommuner fakturerer 600 til 1200 kroner for profesjonell vask; depositum, ofte 2000 til 5000 kroner kommunalt og bundet i flere uker; vertstjeneste, som enkelte private lokaler inkluderer; og utstyr, som ofte er inkludert privat, men leies ut per gjenstand kommunalt. Forskjellen kan utgjøre 2000 til 4000 kroner.",
    },
    {
      question: "Når lønner kommunal sal seg likevel?",
      answer:
        "Er du medlem i et lag eller en forening, snur regnestykket ofte tilbake i kommunens favør. Mange kommuner gir frivillighetsrabatt på mellom 50 og 100 prosent av leieprisen for godkjente lag og foreninger, og enkelte tilbyr i tillegg kulturmidler eller aktivitetstilskudd som kan dekke deler av leien i etterkant. Den typen støtte finnes ikke i det private markedet.",
    },
    {
      question:
        "Hvorfor har private lokaler oftere ledig tid enn kommunale saler?",
      answer:
        "I byer der lag og foreninger har fast sesongleie i de kommunale salene, er fredager og lørdager ofte fullbooket flere måneder frem i tid, fordi den faste leien spiser opp mesteparten av kapasiteten før enkeltpersoner rekker å booke. Private lokaler har sjeldnere den samme bindingen, og frigjør oftere restplasser med kort varsel, gjerne til redusert pris.",
    },
  ],
  "leie-sal-kapasitet-pris-riktig-storrelse-privatperson": [
    {
      question: "Hvor stor sal trenger du til arrangementet?",
      answer:
        "Sitteplassering med rundbord krever 1,5 til 2 kvadratmeter per person, mens rader klarer seg med under 1 kvadratmeter. Regn 2 kvadratmeter per gjest til bryllup med dans, 1,5 til konfirmasjon med rundbordsetting, og under 1 til minnestund og møter i radoppsett. 70 gjester i rundbordsetting med dansegulv krever om lag 140 kvadratmeter pluss areal til buffet og bar.",
    },
    {
      question: "Hva koster de ulike kommunale saltypene?",
      answer:
        "Et grendehus er rimeligst, typisk 400 til 900 kroner for hele døgnet. Forsamlingshus ligger i mellomsjiktet på 1200 til 2500 kroner per arrangement, som regel med kjøkken og garderobe inkludert. Aula på skole krever ofte vaktmestertilstedeværelse, som legger 300 til 600 kroner på totalprisen. Kulturhus er dyrest, gjerne fra 3000 og opp til 8000 kroner.",
    },
    {
      question: "Hvorfor koster det mer å booke en for stor sal?",
      answer:
        "Store saler koster mer å drifte, med høyere strøm-, vaske- og vaktholdstillegg. En sal for 40 personer kan ligge rundt 400 til 500 kroner timen, mens en sal for 120 personer i samme bygg ligger på 800 til 900 kroner timen. Et selskap på 45 gjester som bookes inn i salen for 80 i stedet for den for 50, betaler fort 600 til 1000 kroner ekstra.",
    },
    {
      question: "Kan du leie bare en del av en kommunal sal?",
      answer:
        "Ja, i bygg med foldevegger som deler ett stort rom i to eller tre mindre soner. En delt sal kan gjerne ligge 30 til 40 prosent under prisen for hele salen, selv om det er samme bygg og samme adresse. Mange lokaler lar deg booke den minste sonen med opsjon på å utvide frem til en avtalt frist. Spør bookingansvarlig, det står sjelden i prislisten.",
    },
    {
      question: "Kan maks personantall i en sal fravikes?",
      answer:
        "Nei. Maks personantall er en juridisk grense satt av brannforskriften ut fra rømningsveier og kvadratmeter per person, fastsatt av brannvesenet eller kommunens brannforebyggende avdeling, og den kan ikke fravikes av utleier selv om du tilbyr å betale mer. Grensen varierer med møblering: en sal godkjent for 150 med rader kan være godkjent for kun 90 med rundbord og dansegulv.",
    },
  ],
  "leie-bryllupslokale-kapasitet-inkludert-skjenkebevilling": [
    {
      question: "Hvor mange gjester tar et bryllupslokale egentlig?",
      answer:
        "Kapasitetstallet i annonsen er sjelden ett tall. Et lokale som tar 100 gjester ved skoleoppsett tar gjerne bare 70 med rundbord til sittende middag, og enda færre med dansegulv og DJ-plass. Be om tre tall: sittende middag med rundbord, buffét med ståplass, og sittende middag pluss dansegulv. Et lokale oppgitt til 90 gjester kan lande på 55 til 60.",
    },
    {
      question: "Trenger vi skjenkebevilling, og når må vi søke?",
      answer:
        "Skal dere servere vin eller sprit, må lokalet enten ha egen skjenkebevilling, eller dere må søke om ambulerende bevilling hos kommunen der lokalet ligger. Fristen varierer fra kommune til kommune, så sett av minst tre til fire uker før arrangementet. Sjekk også om bevillingen gjelder hele lokalet inkludert uteareal, og om det er krav til vakthold.",
    },
    {
      question: "Hva bør vi sjekke er inkludert i leien?",
      answer:
        "Sjekk om bord, stoler og duker, lyd- og lysanlegg, rigging kvelden før og rydding dagen etter, kjøkken til catering, vaktmester eller kontaktperson under festen og parkering er inkludert eller kommer som tillegg. Spør også om utleier legger på et eget rengjøringsgebyr, og hvor stort depositumet er, oftest 15 til 25 prosent av leiesummen.",
    },
    {
      question: "Hvor lang tid i forveien må vi booke?",
      answer:
        "De fleste norske bryllup holdes mellom mai og september, og de mest populære lokalene er ofte fullbooket 8 til 12 måneder i forveien for lørdager i juni og august. Vil dere spare penger, gir en fredag eller en søndag i lavsesong ofte 15 til 25 prosent lavere pris hos samme lokale.",
    },
  ],
  "bryllupslokale-kapasitet-faser-vielse-fest-sammenligning": [
    {
      question:
        "Hvorfor stemmer ikke makstallet i annonsen med antall gjester?",
      answer:
        "Brannforskriftens persontall angir maksimalt antall mennesker i rommet på ett gitt tidspunkt, ikke hvor mange som får plass ved bord med god avstand mellom stolradene. Et lokale godkjent for 200 personer stående kan bli trangt for 120 sittende gjester med servering, cateringstasjon og en liten scene. Be om separate tall for seremoni, middag og fest.",
    },
    {
      question: "Hvor mange kvadratmeter trenger en sittende bryllupsmiddag?",
      answer:
        "Med runde bord for 8 til 10 gjester, servitørganger mellom bordene og plass til en liten scene eller DJ-pult, regner mange lokaler og eventbyråer med rundt 1,8 til 2 kvadratmeter per gjest som utgangspunkt. Et bryllup med 120 gjester trenger dermed nærmere 220 kvadratmeter ren gulvflate til middagen alene.",
    },
    {
      question: "Hvor stort må dansegulvet være?",
      answer:
        "Et dansegulv bør ha minst 0,3 til 0,5 kvadratmeter per gjest som faktisk befinner seg der samtidig, ikke per gjest totalt på gjestelisten. For 100 gjester der rundt halvparten er på dansegulvet samtidig, snakker vi om minst 20 kvadratmeter sammenhengende gulv, i tillegg til bar og sittegrupper langs kanten.",
    },
    {
      question: "Hvor lang tid tar det å bygge om lokalet mellom fasene?",
      answer:
        "Ombygging i samme rom tar som regel mellom 45 og 90 minutter med to til tre personer, avhengig av hvor mye møblement som skal flyttes, og det er tid gjestene må fylle et annet sted, for eksempel med aperitiff ute eller i en foajé. Flere separate rom koster mer i leie, men fjerner den risikoen.",
    },
  ],
  "befaring-bryllupslokale-sjekkliste": [
    {
      question: "Hvor lenge bør en befaring av bryllupslokale ta?",
      answer:
        "Sett av minst 45-60 minutter per lokale, ta med en sjekkliste, og noter svarene skriftlig mens dere står der, ikke fra hukommelsen etterpå. Be utleier vise en konkret bordplan for akkurat deres gjestetall i stedet for å lene dere på maks-kapasiteten i brosjyren, som nesten alltid er oppgitt som stolrader uten bord.",
    },
    {
      question: "Hva bør vi spørre om plan B ved regn?",
      answer:
        "Spør konkret hva som skjer hvis det regner på seremonitidspunktet: finnes det et telt eller en innendørs sal som kan ta over med kort varsel, hvem setter opp overgangen, og hvor lang tid tar den i praksis. Be også om et konkret klokkeslett for når beslutningen om plan B senest må tas.",
    },
    {
      question: "Hva må vi sjekke ved kjøkken og catering?",
      answer:
        "Sjekk om lokalet har eget kjøkken, eller om all mat må produseres et annet sted, og om dere står fritt til å velge egen cateringleverandør eller er bundet til utleiers faste partner. Spør om strømkapasiteten er nok til varmeskap og kokeplater for hele gjestelisten samtidig, og om lokalet tar korkasje på medbrakt drikke.",
    },
    {
      question:
        "Hvordan sjekker vi at lokalet er tilgjengelig for alle gjester?",
      answer:
        "Ikke ta utleiers ord for at lokalet er tilgjengelig. Gå selv gjennom ruten fra parkering til inngang, mellom lokalene, og fram til toalett. Sjekk om det finnes trinnfri adkomst uten smale dører eller høye terskler, et HC-tilpasset toalett i rimelig gangavstand, og om trapper har rekkverk eller alternativ rampe.",
    },
  ],
  "hvordan-unnga-dobbeltbooking-utleie": [
    {
      question: "Hva er dobbeltbooking når du leier ut lokaler?",
      answer:
        "To bekreftede bookinger på samme rom og samme tid. Det skjer når ja-et lever i Outlook, e-post eller hodet, mens hallkalenderen ikke er oppdatert.",
    },
    {
      question: "Hvorfor skjer det når Outlook og hallkalenderen er separate?",
      answer:
        "En booking i den ene skriver ikke til den andre. To personer kan si ja til samme lørdag uten å se hverandres avtale.",
    },
    {
      question: "Hindrer kalendersynk dobbeltbooking?",
      answer:
        "Ja, når synken er toveis og i sanntid. En booking ett sted gjør tiden opptatt overalt som er koblet. Det er selve grunnen til én felles kalender.",
    },
    {
      question: "Må vi slutte å bruke Outlook og Google Kalender?",
      answer:
        "Nei. Du kobler dem til Digilist. Hallkalenderen forblir kilden. Outlook og Google viser det samme.",
    },
    {
      question: "Hva ser innbyggeren og saksbehandleren etter en booking?",
      answer:
        "Innbyggeren ser ledig eller opptatt før hen sender. Saksbehandleren godkjenner i samme kalender. Endringen ligger i loggen.",
    },
  ],
};
