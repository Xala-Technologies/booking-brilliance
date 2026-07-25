import { Link } from "react-router-dom";
import { Calculator, Ruler, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { EditorialHeading, EditorialCard } from "@/components/editorial";
import PilotInvitationSection from "@/components/PilotInvitationSection";

const TOOLS = [
  {
    to: "/verktoy/leiepriskalkulator",
    icon: Calculator,
    title: "Leiepriskalkulator",
    desc: "Hva koster det å leie lokale? Få et ærlig, veiledende prisintervall justert for lokaltype, by, ukedag og sesong.",
  },
  {
    to: "/verktoy/kapasitetskalkulator",
    icon: Ruler,
    title: "Kapasitetskalkulator",
    desc: "Hvor stort lokale trenger du? Regn ut anbefalt areal ut fra antall gjester og oppsett, og se hvilke lokaltyper som passer.",
  },
];

const FAQ = [
  {
    question: "Er verktøyene gratis?",
    answer:
      "Ja. Alle verktøyene på Digilist er gratis å bruke, uten innlogging. De gir veiledende estimater for å hjelpe deg å planlegge og budsjettere et arrangement.",
  },
  {
    question: "Gir verktøyene bindende priser?",
    answer:
      "Nei. Verktøyene gir veiledende pekepinner basert på typiske tall i det norske utleiemarkedet. Faktisk pris og kapasitet ser du på det enkelte lokalet på Digilist.",
  },
];

export default function Verktoy() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Gratis verktøy for å leie lokale – pris og kapasitet | Digilist"
        description="Gratis verktøy for deg som skal leie lokale: leiepriskalkulator og kapasitetskalkulator. Estimer pris og areal for bryllup, fest, møte eller konferanse – uten innlogging."
        keywords="verktøy leie lokale, leiepriskalkulator, kapasitetskalkulator, planlegge arrangement, budsjett lokale"
        canonical="https://digilist.no/verktoy"
        faq={FAQ}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Verktøy", url: "https://digilist.no/verktoy" },
        ]}
      />
      <Navbar />

      <main id="main">
        <section className="pt-28 lg:pt-32 pb-10 lg:pb-14 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialHeading as="h1" size="display">
              Gratis verktøy for å leie lokale
            </EditorialHeading>
            <p className="text-xl text-ink-soft measure leading-relaxed mt-5">
              Enkle, ærlige verktøy for deg som planlegger et arrangement – estimer pris og areal før du leter etter
              lokale. Ingen innlogging, ingen forpliktelser.
            </p>
          </div>
        </section>

        <section className="pb-14 lg:pb-24 bg-paper">
          <div className="mx-auto max-w-3xl px-6 grid gap-5 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <Link key={t.to} to={t.to} className="group">
                <EditorialCard className="p-6 h-full">
                  <t.icon className="h-6 w-6 text-ink-soft" aria-hidden />
                  <h2 className="font-serif text-2xl text-ink mt-4 mb-2">{t.title}</h2>
                  <p className="text-ink-soft leading-relaxed">{t.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-ink group-hover:gap-2 transition-all">
                    Åpne verktøyet <ArrowRight className="h-4 w-4" />
                  </span>
                </EditorialCard>
              </Link>
            ))}
          </div>
        </section>

        <PilotInvitationSection />
      </main>

      <Footer />
    </div>
  );
}
