/**
 * /ai-agenter — deep-dive showcase of Digilist's customer-facing AI domain agents.
 * Content is grounded in xala-agent-fleet/core/fleet-registry.ts (category:"domain")
 * and each agent's prompts. SEO-optimised: own title/meta/canonical, FAQ + Service
 * schema, and a matching entry in scripts/prerender.mjs for static crawler HTML.
 */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  MessagesSquare,
  CalendarClock,
  Sunrise,
  Compass,
  Wand2,
  ScanEye,
  ArrowUpRight,
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { ProgressRail, SectionRule, EditorialHeading, EditorialButton } from "@/components/editorial";
import { AgentFlow } from "@/components/AgentFlow";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

const frameworks = ["GDPR", "NSM grunnprinsipper", "SOC 2", "WCAG 2.1 AA", "Markedsføringsloven"];

const agents = [
  {
    icon: ShieldCheck,
    tag: "Godkjenning",
    title: "Compliance-kontroll av hver oppføring",
    lead:
      "Før en oppføring publiseres, gjennomgår Digilist-agenten den mot loven — ikke bare mot en sjekkliste.",
    points: [
      "Skanner all offentlig tekst for personopplysninger (GDPR), eksponerte tilgangskoder og usikre lenker (NSM), og villedende eller ulovlig markedsføring.",
      "Et eget vision-steg laster ned og inspiserer hvert bilde — fanger ulovlig innhold, bilder som feilrepresenterer lokalet, og gjenkjennelige ansikter uten grunnlag.",
      "Fanger villedende avvik strukturell validering ikke ser: feil kategori, åpningstider som ikke dekker bruken, skjulte obligatoriske kostnader.",
      "Godkjenner rene oppføringer med konkrete salgsråd — og veileder resten fikset med en varm melding på norsk, aldri en byråkratisk avvisning.",
    ],
    flow: ["Innsendt oppføring", "Publiseringsgate", "Compliance-gjennomgang", "Bildekontroll", "Beslutning + veiledning"],
    href: "/ai-agenter/compliance-godkjenning",
  },
  {
    icon: MessagesSquare,
    tag: "Henvendelser",
    title: "Førstesvar på kundeforespørsler",
    lead:
      "Ingen henvendelse blir liggende. Agenten leser forespørselen og svarer på utleiers vegne — varmt og korrekt.",
    points: [
      "Leser inn formål, dato, antall og spørsmål fra henvendelsen, og skriver et imøtekommende førstesvar som en dyktig saksbehandler.",
      "Klager, prisforhandling og juridiske spørsmål løftes alltid til et menneske — agenten kjenner sine grenser.",
      "Skriver utkast som standard; automatisk utsending er noe dere skrur på selv når dere er trygge.",
      "Rask respons vinner bookinger — henvendelser besvares med én gang, ikke når noen får tid.",
    ],
    flow: ["Henvendelse", "Leser formål · dato · antall", "Utkast til svar", "Triage til menneske?", "Send"],
  },
  {
    icon: CalendarClock,
    tag: "Sesongtildeling",
    title: "Forklarer halltildeling som holder",
    lead:
      "Det mest omstridte en kommune gjør. Agenten tildeler aldri selv — den gjennomgår og begrunner.",
    points: [
      "Leser det ferdige forslaget fra AllocationEngine og flagger det reglene ikke ser: klubber som faller utenfor, konflikter avgjort ved loddtrekning, slots et menneske har overstyrt.",
      "Vurderer om resultatet er forsvarlig å stå for — mønstre over tid, som at samme klubb taper hver sesong.",
      "Skriver hver klubbs begrunnelse i mentor-tone, klart og respektfullt. Aldri «systemet bestemte» — et menneske står ansvarlig.",
      "Hvert klubbrettet ord er menneske-godkjent før det sendes.",
    ],
    flow: ["Forslag fra motoren", "Finner signaler", "Vurderer forsvarlighet", "Forklaring per klubb", "Menneske godkjenner"],
    href: "/ai-agenter/sesongtildeling",
  },
  {
    icon: Sunrise,
    tag: "Drift",
    title: "Dagens oversikt til de som drifter byggene",
    lead:
      "Vaktmester, renhold, vakthold og brannvern får dagen sin servert — rolig og personlig.",
    points: [
      "Per driftskontakt: en oversikt over dagens tider i riktig rekkefølge, med det som må følges opp løftet fram.",
      "Leser og varsler kun — rører aldri en booking.",
      "Sender aldri en tom melding: er det ingenting å melde, er det stille.",
      "Informasjonen finnes allerede i Digilist — agenten bringer den ut til rett person, i stedet for å ligge begravd under «Min side».",
    ],
    flow: ["Dagens bookinger", "Per driftskontakt", "Rolig oversikt", "Varsel"],
  },
  {
    icon: Compass,
    tag: "Innsikt",
    title: "Ser hvor markedet har hull",
    lead:
      "En markedsstrateg som leser hele markedsplassen og finner mulighetene — uten å røre noe.",
    points: [
      "Leser tilbud (publiserte oppføringer) mot etterspørsel (bookinger og henvendelser) på tvers av alle leietakere.",
      "Finner gapene: hvor det mangler lokaler folk faktisk leter etter, i hver offentlig kategori.",
      "Skriver en kort, rangert mulighetsoversikt til teamet — i dashbordet og som melding.",
      "Kun lesing, ingen kundevendte handlinger — ren innsikt til å vokse bevisst.",
    ],
    flow: ["Tilbud + etterspørsel", "Finner gap", "Rangert oversikt"],
  },
  {
    icon: Wand2,
    tag: "Importér",
    title: "Lag utkast fra en lenke eller fil",
    lead:
      "Har du lokalet på Airbnb, Booking.com, Finn eller Eventum — eller i et Word-dokument? Agenten lager et ferdig utkast.",
    points: [
      "Lim inn en lenke til en eksisterende oppføring, eller last opp et dokument — flere kilder samtidig, som en samling.",
      "Agenten analyserer innholdet og trekker ut navn, beskrivelse, kapasitet, fasiliteter, beliggenhet og priser.",
      "Feltene fylles inn i Digilists struktur, og du får et ferdig utkast du bare finpusser.",
      "Du bekrefter og publiserer selv — utkastet går gjennom compliance-godkjenning før det blir synlig.",
    ],
    flow: ["Lenke eller fil", "Analyse", "Trekker ut felter", "Utkast til oppføring"],
    href: "/ai-agenter/importer-oppforing",
  },
];

const faq = [
  {
    question: "Er Digilist-agentene GDPR-sikre?",
    answer:
      "Ja. Hver oppføring kontrolleres mot GDPR før publisering — agenten fanger personopplysninger i offentlig tekst og bilder. Agentene følger også NSM grunnprinsipper for IKT-sikkerhet, SOC 2 og krav til universell utforming (WCAG 2.1 AA).",
  },
  {
    question: "Tar agentene avgjørelser på egen hånd?",
    answer:
      "Nei, ikke for kundevendte handlinger. Svar på henvendelser skrives som utkast (automatisk utsending er valgfritt), sesongtildeling forklares men tildeles aldri av agenten, og hvert klubbrettet ord er menneske-godkjent. Godkjenning av oppføringer skjer mot klare, lovbaserte kriterier — tvilstilfeller eskaleres til et menneske.",
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

const AiAgenter = () => {
  return (
    <>
      <SEO
        title="AI-agenter for booking og utleie — GDPR-sikker automatisering | Digilist"
        description="Digilist bruker AI-agenter som godkjenner oppføringer mot GDPR, NSM, SOC 2 og universell utforming, svarer på henvendelser, forklarer sesongtildeling og gir daglig driftsoversikt. Bygget for norske kommuner."
        keywords={[
          "AI bookingsystem",
          "AI agenter booking",
          "GDPR bookingplattform",
          "automatisk godkjenning oppføringer",
          "bookingsystem kommune",
          "sesongtildeling idrettshall",
          "compliance utleieplattform",
          "universell utforming booking",
        ]}
        canonical="https://digilist.no/ai-agenter"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "AI-agenter", url: "https://digilist.no/ai-agenter" },
        ]}
        faq={faq}
        service
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          {/* Hero */}
          <section className="pt-28 lg:pt-36 pb-14 lg:pb-20 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="INNEBYGD INTELLIGENS" />
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter">
                <div className="lg:col-span-8">
                  <EditorialHeading as="h1" size="display">
                    AI-agenter som gjør jobben.
                  </EditorialHeading>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-xl lg:text-2xl text-ink-soft leading-relaxed measure">
                    Under Digilist jobber en flåte av AI-agenter. De godkjenner oppføringer mot
                    loven, svarer på henvendelser, forklarer sesongtildeling og varsler dem som
                    drifter byggene — så administrasjonen slipper det repetitive, og folk kan bruke
                    tiden på skjønn.
                  </p>
                </div>
              </div>

              {/* Compliance framework row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-10 lg:mt-14 pt-8 border-t border-rule">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint mr-1">
                  Oppføringer kontrolleres mot
                </span>
                {frameworks.map((f) => (
                  <span
                    key={f}
                    className="font-mono text-[11px] uppercase tracking-wider text-navy bg-navy/5 border border-navy/15 rounded-sm px-2.5 py-1"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Per-agent deep sections */}
          {agents.map((a, i) => {
            const Icon = a.icon;
            return (
              <section
                key={a.title}
                className={`py-14 lg:py-20 ${i % 2 === 0 ? "bg-paper-tinted" : "bg-paper"}`}
              >
                <div className="container mx-auto md:px-8 lg:px-12">
                  <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter">
                    <div className="lg:col-span-4">
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="font-mono text-sm text-accent-text tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px w-6 bg-rule" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft">
                          {a.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="w-12 h-12 shrink-0 inline-flex items-center justify-center bg-navy/5 border border-navy/15 rounded-sm text-navy">
                          <Icon className="h-6 w-6" strokeWidth={1.5} />
                        </span>
                        <h2
                          className="font-serif text-2xl lg:text-3xl text-ink"
                          style={{ fontVariationSettings: getFraunces("section"), lineHeight: 1.1 }}
                        >
                          {a.title}
                        </h2>
                      </div>
                      <p className="text-lg text-ink-soft italic measure">{a.lead}</p>
                    </div>
                    <motion.ul
                      initial="hidden"
                      whileInView="visible"
                      viewport={viewportOnce}
                      variants={staggerParent}
                      className="lg:col-span-8 border-t border-rule"
                    >
                      {a.points.map((p) => (
                        <motion.li
                          key={p}
                          variants={staggerChild}
                          className="py-5 border-b border-rule text-lg text-ink leading-relaxed"
                        >
                          {p}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>

                  <div className="mt-8 lg:mt-10">
                    <AgentFlow steps={a.flow} />
                    {a.href && (
                      <Link
                        to={a.href}
                        className="inline-block mt-5 font-mono text-[12px] uppercase tracking-wider text-navy hover:underline"
                      >
                        Les mer om {a.tag.toLowerCase()} →
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            );
          })}

          {/* Vision callout */}
          <section className="py-14 lg:py-20 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-1">
                  <ScanEye className="h-8 w-8 text-navy" strokeWidth={1.5} />
                </div>
                <p
                  className="lg:col-span-11 font-serif text-2xl lg:text-3xl text-ink leading-snug"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Agentene gjetter ikke. De leser de faktiske Digilist-reglene, dokumentasjonen og
                  loven før de dømmer — og ser bildene, ikke bare teksten.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-14 lg:py-20 bg-paper-tinted">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="OFTE STILTE SPØRSMÅL" />
              <div className="border-t border-rule">
                {faq.map((f) => (
                  <div key={f.question} className="grid lg:grid-cols-12 gap-4 lg:gap-gutter py-8 border-b border-rule">
                    <h3
                      className="lg:col-span-5 font-serif text-xl lg:text-2xl text-ink"
                      style={{ fontVariationSettings: getFraunces("sub"), lineHeight: 1.2 }}
                    >
                      {f.question}
                    </h3>
                    <p className="lg:col-span-7 text-lg text-ink-soft leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <EditorialButton href="/#kontakt" variant="primary">
                  Book en demo <ArrowUpRight className="inline h-4 w-4" />
                </EditorialButton>
                <EditorialButton href="/" variant="outline">
                  Tilbake til forsiden
                </EditorialButton>
              </div>
            </div>
          </section>
        </main>
      </PageTransition>

      <Footer />
    </>
  );
};

export default AiAgenter;
