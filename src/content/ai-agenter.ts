/**
 * The /ai-agenter page copy, in both languages.
 *
 * The English is deliberately conservative about what the agents DO, because
 * this page is the product's claim about its own autonomy and getting it wrong
 * in either direction is a problem. Two specifics:
 *
 * - "utkast" is "a draft", never "a suggested reply that is sent". The whole
 *   safety story is that customer-facing replies are drafted and a human sends
 *   them, so a looser word would overstate the automation.
 * - "menneske-godkjent" is "approved by a person", not "human-approved" — the
 *   latter reads as a product feature label; the former is what actually
 *   happens, and this is the sentence a public body will scrutinise.
 *
 * Norwegian regulatory bodies keep their names and get a gloss: NSM is the
 * National Security Authority, "markedsføringsloven" the Marketing Control
 * Act. An English reader cannot look up an untranslated statute name.
 */
import type { Locale } from "@/lib/i18n";

export interface Agent {
  tag: string;
  title: string;
  lead: string;
  points: readonly string[];
  flow: readonly string[];
  href?: string;
}

export interface QA {
  question: string;
  answer: string;
}

export interface AgentsCopy {
  metaTitle: string;
  metaDescription: string;
  rule: string;
  h1: string;
  lede: string;
  checkedAgainst: string;
  frameworks: readonly string[];
  readMore: string;
  visionCallout: string;
  faqRule: string;
  ctaDemo: string;
  ctaHome: string;
  agents: readonly Agent[];
  faq: readonly QA[];
}

const AGENTS_NB: readonly Agent[] = [
  {
    tag: "Godkjenning",
    title: "Compliance-kontroll av hver oppføring",
    lead:
      "Før en oppføring publiseres, gjennomgår Digilist-agenten den mot loven – ikke bare mot en sjekkliste.",
    points: [
      "Skanner all offentlig tekst for personopplysninger (GDPR), eksponerte tilgangskoder og usikre lenker (NSM), og villedende eller ulovlig markedsføring.",
      "Et eget vision-steg laster ned og inspiserer hvert bilde – fanger ulovlig innhold, bilder som feilrepresenterer lokalet, og gjenkjennelige ansikter uten grunnlag.",
      "Fanger villedende avvik strukturell validering ikke ser: feil kategori, åpningstider som ikke dekker bruken, skjulte obligatoriske kostnader.",
      "Godkjenner rene oppføringer med konkrete salgsråd – og veileder resten fikset med en varm melding på norsk, aldri en byråkratisk avvisning.",
    ],
    flow: ["Innsendt oppføring", "Publiseringsgate", "Compliance-gjennomgang", "Bildekontroll", "Beslutning + veiledning"],
    href: "/ai-agenter/compliance-godkjenning",
  },
  {
    tag: "Henvendelser",
    title: "Førstesvar på kundeforespørsler",
    lead:
      "Ingen henvendelse blir liggende. Agenten leser forespørselen og svarer på utleiers vegne – varmt og korrekt.",
    points: [
      "Leser inn formål, dato, antall og spørsmål fra henvendelsen, og skriver et imøtekommende førstesvar som en dyktig saksbehandler.",
      "Klager, prisforhandling og juridiske spørsmål løftes alltid til et menneske – agenten kjenner sine grenser.",
      "Skriver utkast som standard; automatisk utsending er noe dere skrur på selv når dere er trygge.",
      "Rask respons vinner bookinger – henvendelser besvares med én gang, ikke når noen får tid.",
    ],
    flow: ["Henvendelse", "Leser formål · dato · antall", "Utkast til svar", "Triage til menneske?", "Send"],
  },
  {
    tag: "Sesongtildeling",
    title: "Forklarer halltildeling som holder",
    lead:
      "Det mest omstridte en kommune gjør. Agenten tildeler aldri selv – den gjennomgår og begrunner.",
    points: [
      "Leser det ferdige forslaget fra AllocationEngine og flagger det reglene ikke ser: klubber som faller utenfor, konflikter avgjort ved loddtrekning, slots et menneske har overstyrt.",
      "Vurderer om resultatet er forsvarlig å stå for – mønstre over tid, som at samme klubb taper hver sesong.",
      "Skriver hver klubbs begrunnelse i mentor-tone, klart og respektfullt. Aldri «systemet bestemte» – et menneske står ansvarlig.",
      "Hvert klubbrettet ord er menneske-godkjent før det sendes.",
    ],
    flow: ["Forslag fra motoren", "Finner signaler", "Vurderer forsvarlighet", "Forklaring per klubb", "Menneske godkjenner"],
    href: "/ai-agenter/sesongtildeling",
  },
  {
    tag: "Drift",
    title: "Dagens oversikt til de som drifter byggene",
    lead:
      "Vaktmester, renhold, vakthold og brannvern får dagen sin servert – rolig og personlig.",
    points: [
      "Per driftskontakt: en oversikt over dagens tider i riktig rekkefølge, med det som må følges opp løftet fram.",
      "Leser og varsler kun – rører aldri en booking.",
      "Sender aldri en tom melding: er det ingenting å melde, er det stille.",
      "Informasjonen finnes allerede i Digilist – agenten bringer den ut til rett person, i stedet for å ligge begravd under «Min side».",
    ],
    flow: ["Dagens bookinger", "Per driftskontakt", "Rolig oversikt", "Varsel"],
  },
  {
    tag: "Innsikt",
    title: "Ser hvor markedet har hull",
    lead:
      "En markedsstrateg som leser hele markedsplassen og finner mulighetene – uten å røre noe.",
    points: [
      "Leser tilbud (publiserte oppføringer) mot etterspørsel (bookinger og henvendelser) på tvers av alle leietakere.",
      "Finner gapene: hvor det mangler lokaler folk faktisk leter etter, i hver offentlig kategori.",
      "Skriver en kort, rangert mulighetsoversikt til teamet – i dashbordet og som melding.",
      "Kun lesing, ingen kundevendte handlinger – ren innsikt til å vokse bevisst.",
    ],
    flow: ["Tilbud + etterspørsel", "Finner gap", "Rangert oversikt"],
  },
  {
    tag: "Importér",
    title: "Lag utkast fra en lenke eller fil",
    lead:
      "Har du lokalet på Airbnb, Booking.com, Finn eller Eventum – eller i et Word-dokument? Agenten lager et ferdig utkast.",
    points: [
      "Lim inn en lenke til en eksisterende oppføring, eller last opp et dokument – flere kilder samtidig, som en samling.",
      "Agenten analyserer innholdet og trekker ut navn, beskrivelse, kapasitet, fasiliteter, beliggenhet og priser.",
      "Feltene fylles inn i Digilists struktur, og du får et ferdig utkast du bare finpusser.",
      "Du bekrefter og publiserer selv – utkastet går gjennom compliance-godkjenning før det blir synlig.",
    ],
    flow: ["Lenke eller fil", "Analyse", "Trekker ut felter", "Utkast til oppføring"],
    href: "/ai-agenter/importer-oppforing",
  },
];

const FAQ_NB: readonly QA[] = [
  {
    question: "Er Digilist-agentene GDPR-sikre?",
    answer:
      "Ja. Hver oppføring kontrolleres mot GDPR før publisering – agenten fanger personopplysninger i offentlig tekst og bilder. Agentene følger også NSM grunnprinsipper for IKT-sikkerhet, SOC 2 og krav til universell utforming (WCAG 2.1 AA).",
  },
  {
    question: "Tar agentene avgjørelser på egen hånd?",
    answer:
      "Nei, ikke for kundevendte handlinger. Svar på henvendelser skrives som utkast (automatisk utsending er valgfritt), sesongtildeling forklares men tildeles aldri av agenten, og hvert klubbrettet ord er menneske-godkjent. Godkjenning av oppføringer skjer mot klare, lovbaserte kriterier – tvilstilfeller eskaleres til et menneske.",
  },
  {
    question: "Hvilke standarder kontrolleres en oppføring mot?",
    answer:
      "GDPR (personvern), NSM grunnprinsipper for IKT-sikkerhet, SOC 2 (Trust Services Criteria), universell utforming / WCAG 2.1 AA, og markedsføringsloven for villedende eller ulovlige kommersielle påstander.",
  },
  {
    question: "Hvilke AI-agenter er inkludert?",
    answer:
      "Fem kundevendte agenter: godkjenning og compliance av oppføringer, svar på henvendelser, gjennomgang og forklaring av sesongtildeling, daglig driftsoversikt til byggenes folk, og markedsinnsikt som finner tilbud/etterspørsel-gap. Flåten utvides over tid.",
  },
];

const AGENTS_EN: readonly Agent[] = [
  {
    tag: "Approval",
    title: "A compliance review of every listing",
    lead:
      "Before a listing goes live, the Digilist agent reviews it against the law — not just against a checklist.",
    points: [
      "Scans all public text for personal data (GDPR), exposed access codes and unsafe links (NSM, the Norwegian National Security Authority), and misleading or unlawful marketing.",
      "A separate vision step downloads and inspects every image — catching unlawful content, pictures that misrepresent the venue, and recognisable faces with no basis for being there.",
      "Catches misleading discrepancies that structural validation cannot see: the wrong category, opening hours that do not cover the stated use, hidden mandatory costs.",
      "Approves clean listings with concrete advice on selling better — and guides the rest to a fix with a warm message, never a bureaucratic rejection.",
    ],
    flow: ["Listing submitted", "Publishing gate", "Compliance review", "Image check", "Decision + guidance"],
    href: "/ai-agenter/compliance-godkjenning",
  },
  {
    tag: "Enquiries",
    title: "A first reply to customer enquiries",
    lead:
      "No enquiry is left sitting. The agent reads the request and replies on the operator's behalf — warmly and correctly.",
    points: [
      "Reads the purpose, date, numbers and questions out of the enquiry, and writes a welcoming first reply the way a capable case officer would.",
      "Complaints, price negotiation and legal questions are always raised to a person — the agent knows its limits.",
      "Writes drafts by default; automatic sending is something you switch on yourself, once you are confident.",
      "A fast response wins bookings — enquiries are answered at once, not when someone gets round to it.",
    ],
    flow: ["Enquiry", "Reads purpose · date · numbers", "Draft reply", "Raise to a person?", "Send"],
  },
  {
    tag: "Seasonal allocation",
    title: "Explains a hall allocation that will hold up",
    lead:
      "The most contested thing a public body does. The agent never allocates — it reviews and it explains.",
    points: [
      "Reads the finished proposal from the allocation engine and flags what the rules cannot see: clubs that fall outside, conflicts settled by drawing lots, slots a person has overridden.",
      "Judges whether the outcome is defensible — including patterns over time, such as the same club losing out every season.",
      "Writes each club's reasoning in a mentoring tone, clearly and respectfully. Never 'the system decided' — a person is accountable.",
      "Every word addressed to a club is approved by a person before it is sent.",
    ],
    flow: ["Proposal from the engine", "Finds signals", "Judges defensibility", "Reasoning per club", "A person approves"],
    href: "/ai-agenter/sesongtildeling",
  },
  {
    tag: "Operations",
    title: "The day ahead, for the people who run the buildings",
    lead:
      "Caretakers, cleaning, security and fire safety get their day laid out — calmly and personally.",
    points: [
      "Per operations contact: an overview of today's bookings in the right order, with anything needing follow-up brought to the front.",
      "Reads and notifies only — it never touches a booking.",
      "Never sends an empty message: if there is nothing to report, it stays quiet.",
      "The information is already in Digilist — the agent brings it out to the right person, instead of leaving it buried under 'My page'.",
    ],
    flow: ["Today's bookings", "Per operations contact", "A calm overview", "Notification"],
  },
  {
    tag: "Insight",
    title: "Sees where the market has gaps",
    lead:
      "A market strategist that reads the whole marketplace and finds the openings — without touching anything.",
    points: [
      "Reads supply (published listings) against demand (bookings and enquiries) across every tenant.",
      "Finds the gaps: where venues people are actually looking for are missing, in each public category.",
      "Writes a short, ranked list of opportunities for the team — in the dashboard and as a message.",
      "Read-only, with no customer-facing actions — pure insight, for growing deliberately.",
    ],
    flow: ["Supply + demand", "Finds gaps", "Ranked overview"],
  },
  {
    tag: "Import",
    title: "Build a draft from a link or a file",
    lead:
      "Is your venue on Airbnb, Booking.com, Finn or Eventum — or in a Word document? The agent builds a finished draft.",
    points: [
      "Paste a link to an existing listing, or upload a document — several sources at once, as a set.",
      "The agent analyses the content and extracts the name, description, capacity, facilities, location and prices.",
      "The fields are filled into Digilist's structure, and you get a finished draft that only needs polishing.",
      "You confirm and publish it yourself — and the draft goes through compliance approval before it becomes visible.",
    ],
    flow: ["A link or a file", "Analysis", "Extracts the fields", "Listing draft"],
    href: "/ai-agenter/importer-oppforing",
  },
];

const FAQ_EN: readonly QA[] = [
  {
    question: "Are the Digilist agents safe under GDPR?",
    answer:
      "Yes. Every listing is checked against GDPR before publication — the agent catches personal data in public text and in images. The agents also follow the NSM basic principles for ICT security set by the Norwegian National Security Authority, SOC 2, and the accessibility requirements of WCAG 2.1 AA.",
  },
  {
    question: "Do the agents make decisions on their own?",
    answer:
      "Not for anything customer-facing. Replies to enquiries are written as drafts, with automatic sending optional; seasonal allocation is explained but never decided by the agent; and every word addressed to a club is approved by a person. Listing approval runs against clear, law-based criteria, and anything in doubt is raised to a person.",
  },
  {
    question: "Which standards is a listing checked against?",
    answer:
      "GDPR for privacy; the NSM basic principles for ICT security; SOC 2 Trust Services Criteria; accessibility under WCAG 2.1 AA; and the Norwegian Marketing Control Act for misleading or unlawful commercial claims.",
  },
  {
    question: "Which AI agents are included?",
    answer:
      "Five customer-facing agents: listing approval and compliance, replies to enquiries, review and explanation of seasonal allocation, a daily operations overview for the people who run the buildings, and market insight that finds gaps between supply and demand. The fleet grows over time.",
  },
];

const NB: AgentsCopy = {
  metaTitle: "AI-agenter for booking og utleie | Digilist",
  metaDescription:
    "AI-agenter som godkjenner oppføringer mot GDPR, NSM, SOC 2 og universell utforming, svarer på henvendelser og forklarer sesongtildeling. For norske kommuner.",
  rule: "INNEBYGD INTELLIGENS",
  h1: "AI-agenter som gjør jobben.",
  lede:
    "Under Digilist jobber en flåte av AI-agenter. De godkjenner oppføringer mot loven, svarer på henvendelser, forklarer sesongtildeling og varsler dem som drifter byggene – så administrasjonen slipper det repetitive, og folk kan bruke tiden på skjønn.",
  checkedAgainst: "Oppføringer kontrolleres mot",
  frameworks: ["GDPR", "NSM grunnprinsipper", "SOC 2", "WCAG 2.1 AA", "Markedsføringsloven"],
  readMore: "Les mer om",
  visionCallout:
    "Agentene gjetter ikke. De leser de faktiske Digilist-reglene, dokumentasjonen og loven før de dømmer – og ser bildene, ikke bare teksten.",
  faqRule: "OFTE STILTE SPØRSMÅL",
  ctaDemo: "Book en demo",
  ctaHome: "Tilbake til forsiden",
  agents: AGENTS_NB,
  faq: FAQ_NB,
};

const EN: AgentsCopy = {
  metaTitle: "AI agents for booking and venue rental | Digilist",
  metaDescription:
    "AI agents approve listings against GDPR, national security principles, SOC 2 and accessibility rules, reply to enquiries, and explain seasonal allocation.",
  rule: "BUILT-IN INTELLIGENCE",
  h1: "AI agents that do the work.",
  lede:
    "Underneath Digilist runs a fleet of AI agents. They check listings against the law, reply to enquiries, explain seasonal allocation and brief the people who run the buildings — so the administration is freed from the repetitive work, and people can spend their time on judgement.",
  checkedAgainst: "Listings are checked against",
  frameworks: ["GDPR", "NSM security principles", "SOC 2", "WCAG 2.1 AA", "Marketing Control Act"],
  readMore: "Read more about",
  visionCallout:
    "The agents do not guess. They read the actual Digilist rules, the documentation and the law before they judge — and they look at the images, not only the text.",
  faqRule: "FREQUENTLY ASKED QUESTIONS",
  ctaDemo: "Book a demo",
  ctaHome: "Back to the home page",
  agents: AGENTS_EN,
  faq: FAQ_EN,
};

export function agentsCopy(locale: Locale): AgentsCopy {
  return locale === "en" ? EN : NB;
}
