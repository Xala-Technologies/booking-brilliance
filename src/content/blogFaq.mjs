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
      question: "Hva er beste nettside for å leie lokale, hytte eller utstyr i Norge?",
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
      question: "Passer Digilist for private utleiere, eller bare for kommuner?",
      answer:
        "Begge deler. En privat utleier av et selskapslokale, et bryllupslokale eller utstyr til utlån kan bruke det samme systemet som en kommune, bare i mindre skala. Forskjellen fra Airbnb og Hygglo er at Digilist er et abonnement utleieren eier selv, ikke en markedsplass der en andel av hver betaling går til plattformen.",
    },
  ],
  "ssa-l-2026-bookingsystem-kommune": [
    {
      question: "Hva er SSA-L 2026?",
      answer:
        "SSA-L er Statens standardavtale for løpende tjenestekjøp av IT – malen de fleste norske kommuner bruker når de anskaffer et bookingsystem som SaaS. 2026-versjonen skjerper kravene til sanntidsdata, ID-porten-autentisering, EHF-fakturering, universell utforming og ISO 27001.",
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
        "Be om et utfylt sikkerhetsbilag (ikke bare en generell henvisning), et gyldig ISO 27001-sertifikat, siste pen-test-rapport og en kort demo av kravene i praksis: sanntidsoppdatering, ID-porten-innlogging og EHF-faktura. Selvdeklarasjon alene er ikke nok – krev dokumentasjon du kan verifisere.",
    },
  ],
  "statistikk-rapportering-bruksdata-kommunale-lokaler": [
    {
      question: "Hvilken statistikk trenger en kommune for å planlegge bruken av lokaler?",
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
      question: "Kan bruksstatistikk brukes til å begrunne investeringer eller nedleggelser?",
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
      question: "Kan lag og foreninger leie møterom eller selskapslokale gratis?",
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
      question: "Hva er forskjellen på et forsamlingslokale og et selskapslokale?",
      answer:
        "Forsamlingslokale er en bredere, ofte bygningsteknisk betegnelse på lokaler godkjent for at mange kan samles samtidig, og omfatter i kommunal sammenheng blant annet kulturhus, grendehus og festsaler. Selskapslokale er ikke en egen bygningskategori, men en bruksbetegnelse på et lokale – ofte et grendehus, kulturhus eller privat festlokale – som leies ut til private feiringer som bursdager og jubileer. Slike lokaler oppfyller som regel også kravene til et forsamlingslokale, mens et lite møterom normalt ikke gjør det.",
    },
    {
      question: "Hva koster det å leie et lokale?",
      answer:
        "Det spenner fra gratis for kommunale møterom til lag og foreninger, via 1 500–15 000 kroner per dag for grendehus og kulturhus, til 15 000 kroner og oppover for private festlokaler med servering inkludert.",
    },
    {
      question: "Kan jeg søke lokale uten å vite nøyaktig hvilket sted jeg vil leie?",
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
      question: "Kan en språkskole booke samme rom hver uke gjennom et helt semester?",
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
      question: "Hvilket system kan innbyggere bruke til å booke idrettshall i kommunen?",
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
      question: "Hva skjer med allerede bookede timer når en kommune bytter system?",
      answer:
        "Ved implementering overfører Digilist eksisterende sesongtildelinger og faste bookinger før løsningen settes i drift, slik at ingen lag mister allerede tildelt treningstid.",
    },
    {
      question: "Kan private aktører bruke samme system som kommunen?",
      answer:
        "Ja. Digilist driftes på samme plattform for både kommunal og privat utleie, men med adskilte tilganger, slik at en kommune og en privat utleier aldri deler data eller kalendere.",
    },
  ],
};
