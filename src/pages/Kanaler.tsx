import { Link2, Wand2, FileCheck, RefreshCw, CheckCircle2 } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PilotInvitationSection from "@/components/PilotInvitationSection";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  SpecRow,
  ProgressRail,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";

const CHANNELS = ["Airbnb", "Booking.com", "Bookup", "Eventum", "Finn"];

const SYNC_BENEFITS = [
  "Synk kalender, priser og tilgjengelighet automatisk",
  "Legg til nye oppføringer uten dobbeltarbeid",
  "Alltid oppdatert — aldri dobbeltbookinger",
  "Én admin for alle kanaler",
  "Endringer slår gjennom i sanntid, overalt",
  "Behold kanalene du allerede tjener på",
];

const IMPORT_STEPS = [
  {
    icon: Link2,
    title: "Lim inn lenken",
    body: "Fra Finn, Airbnb, Booking.com, Eventum — eller hvilken som helst kilde. Du kan også laste opp et dokument.",
  },
  {
    icon: Wand2,
    title: "Agenten henter alt",
    body: "Tekst, bilder, kalender, priser og konfigurasjon trekkes ut og struktureres automatisk.",
  },
  {
    icon: FileCheck,
    title: "Ferdig utkast",
    body: "Du får et komplett oppføringsutkast i Digilist. Gjennomgå, juster og publiser — ingen manuell inntasting.",
  },
];

const FAQ = [
  {
    question: "Hvordan fungerer toveis kalendersynk?",
    answer:
      "Du kobler kanalene dine — som Airbnb, Booking.com, Bookup, Eventum eller Finn — til Digilist én gang. Deretter holdes kalender, priser og tilgjengelighet synkronisert begge veier: en booking på én kanal blokkerer tiden på alle de andre umiddelbart, og endringer du gjør i Digilist slår gjennom overalt. Slik unngår du dobbeltbookinger uten manuelt vedlikehold.",
  },
  {
    question: "Hvilke kanaler kan jeg koble til?",
    answer:
      "Digilist kobler mot de vanligste kanalene norske utleiere bruker — Airbnb, Booking.com, Bookup, Eventum og Finn — samt kalenderstandarder som iCal, CalDAV, Outlook og Google Calendar. Mangler kanalen din? Ta kontakt, så ser vi på en tilkobling.",
  },
  {
    question: "Kan AI-agenten importere oppføringene mine automatisk?",
    answer:
      "Ja. Lim inn lenken til en eksisterende oppføring (eller last opp et dokument), så henter agenten tekst, bilder, kalender, priser og konfigurasjon og lager et ferdig utkast i Digilist. Du trenger bare å gjennomgå og publisere — ingen manuell inntasting fra bunnen av.",
  },
  {
    question: "Kan jeg fortsette å bruke Airbnb og Booking.com samtidig?",
    answer:
      "Absolutt. Poenget med toveis synk er nettopp at du beholder kanalene du allerede tjener på. Digilist blir det samlende kalender- og driftslaget, mens du fortsetter å ta imot bookinger der kundene dine allerede er.",
  },
  {
    question: "Hindrer synk dobbeltbookinger?",
    answer:
      "Ja. Fordi tilgjengeligheten holdes synkronisert i sanntid på tvers av alle tilkoblede kanaler, blir en tid som bookes ett sted umiddelbart utilgjengelig alle andre steder. Det er selve grunnen til at én felles kalender fjerner dobbeltbookinger.",
  },
];

const Kanaler = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Kanaler & synk · Digilist | Toveis kalendersynk og AI-import"
        description="Koble Airbnb, Booking.com, Bookup, Eventum og Finn til Digilist. Toveis kalendersynk i sanntid og AI-agent som importerer oppføringene dine til et ferdig utkast — behold begge plattformer."
        keywords="kanalsynk, channel manager, kalendersynk, importere oppføring airbnb, importere finn, toveis synk booking, unngå dobbeltbooking"
        canonical="https://digilist.no/kanaler"
        ogImage="https://digilist.no/og-image.png"
        faq={FAQ}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Kanaler & synk", url: "https://digilist.no/kanaler" },
        ]}
      />
      <ProgressRail />
      <Navbar />

      <main id="main">
        {/* Hero */}
        <section className="pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="KANALER · TOVEIS SYNK" />

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-start">
              <div className="lg:col-span-8">
                <EditorialHeading as="h1" size="hero" className="mb-6">
                  Én kalender.{" "}
                  <em
                    className="italic"
                    style={{ fontVariationSettings: getFraunces("hero") }}
                  >
                    alle kanaler
                  </em>
                  .
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure leading-relaxed mb-10">
                  Har du lokaler på Airbnb, Booking.com, Bookup eller Eventum? Koble
                  dem til Digilist én gang, så holdes kalender og tilgjengelighet i{" "}
                  <strong className="text-ink">toveis synk automatisk</strong> — og
                  la AI-agenten importere oppføringene dine til ferdige utkast. Ingen
                  dobbeltarbeid, ingen dobbeltbookinger, og du beholder kanalene du
                  allerede tjener på.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton variant="primary" size="lg" href="/book-demo">
                    Book en demo
                  </EditorialButton>
                  <EditorialButton
                    variant="outline"
                    size="lg"
                    icon={false}
                    href="https://app.digilist.no"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Åpne plattformen
                  </EditorialButton>
                </div>
              </div>

              <div className="lg:col-span-4">
                <EditorialCard className="bg-accent-tinted">
                  <h2
                    className="font-serif text-2xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("section") }}
                  >
                    Dine kanaler
                  </h2>
                  <SpecRow label="Synk" value="Toveis · sanntid" />
                  <SpecRow label="Kanaler" value="Airbnb · Booking.com · +" />
                  <SpecRow label="Kalender" value="iCal · CalDAV · Outlook" />
                  <SpecRow label="Import" value="AI-agent · lenke" />
                  <SpecRow label="Admin" value="Én for alle" />
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        {/* I. Two-way sync */}
        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="I. TOVEIS SYNK" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Koble til én gang.{" "}
                  <em className="italic">alltid oppdatert</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Kalender, priser og tilgjengelighet holdes i sync begge veier —
                  uten manuelt vedlikehold.
                </p>
              </div>
            </div>

            {/* Channel chips → hub */}
            <div className="rounded-lg border border-rule bg-paper p-8 lg:p-10 shadow-[0_14px_44px_-26px_rgba(10,18,40,0.4)] mb-10">
              <p className="editorial-mono-caption text-ink-faint text-center">
                Dine kanaler
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                {CHANNELS.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-rule bg-gradient-to-b from-paper to-paper-deep/70 shadow-[0_1px_2px_rgba(10,18,40,0.06)] px-4 py-2 text-sm font-medium text-ink"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="my-6 flex flex-col items-center gap-1.5 text-accent-text">
                <RefreshCw className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                <span className="editorial-mono-caption">Toveis synk · sanntid</span>
              </div>
              <div className="rounded-md border border-accent-text/30 bg-gradient-to-b from-paper to-paper-deep shadow-[inset_0_1px_0_hsl(0_0%_100%/0.5),0_2px_6px_-1px_rgba(10,18,40,0.12),0_14px_30px_-16px_rgba(10,18,40,0.3)] px-5 py-5 text-center">
                <p className="editorial-mono-caption text-accent-text">Digilist</p>
                <p
                  className="mt-1.5 font-serif text-xl lg:text-2xl text-ink"
                  style={{ letterSpacing: "-0.015em", lineHeight: 1.15 }}
                >
                  Én kalender, alltid oppdatert
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {SYNC_BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="h-5 w-5 mt-0.5 shrink-0 text-accent-text"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="text-base text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* II. AI-agent import */}
        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="II. AI-AGENT · IMPORT" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  La agenten flytte{" "}
                  <em className="italic">oppføringene dine</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Slipp å taste inn alt på nytt — agenten bygger utkastet for deg.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {IMPORT_STEPS.map(({ icon: Icon, title, body }, i) => (
                <div
                  key={title}
                  className="group border border-rule rounded-sm bg-paper p-6 lg:p-7 shadow-[0_1px_2px_rgba(10,18,40,0.05),0_10px_28px_-20px_rgba(10,18,40,0.28)] transition-all duration-normal ease-editorial hover:-translate-y-1 hover:border-accent-text/30 hover:shadow-[0_24px_48px_-24px_rgba(10,18,40,0.5)]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 shrink-0 inline-flex items-center justify-center bg-accent-text/10 ring-1 ring-accent-text/25 rounded-md text-accent-text transition-transform duration-normal ease-editorial group-hover:scale-105">
                      <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <h3
                      className="font-serif text-xl text-ink"
                      style={{ fontVariationSettings: getFraunces("sub"), letterSpacing: "-0.01em" }}
                    >
                      {title}
                    </h3>
                    <span className="ml-auto font-mono text-[0.7rem] tracking-widest text-ink-faint">
                      0{i + 1}
                    </span>
                  </div>
                  <p className="text-base text-ink-soft leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <span className="editorial-mono-caption text-ink-faint">Kilder</span>
              {["Finn", "Airbnb", "Booking.com", "Eventum", "+ alle kilder"].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-rule bg-gradient-to-b from-paper to-paper-deep/70 px-3.5 py-1.5 text-sm font-medium text-ink"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        <PilotInvitationSection />

        {/* FAQ */}
        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="III. SPØRSMÅL OG SVAR" />
            <EditorialHeading as="h2" size="section" className="mb-10">
              Vanlige spørsmål om kanaler og synk.
            </EditorialHeading>
            <dl className="space-y-8 max-w-4xl">
              {FAQ.map((q) => (
                <div key={q.question} className="border-b border-rule pb-8">
                  <dt
                    className="font-serif text-2xl text-ink mb-3"
                    style={{
                      fontVariationSettings: getFraunces("section"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {q.question}
                  </dt>
                  <dd className="text-base text-ink-soft leading-relaxed measure">
                    {q.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Kanaler;
