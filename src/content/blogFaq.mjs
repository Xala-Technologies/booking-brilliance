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
};
