import { Link } from "react-router-dom";
import { Calculator, Ruler, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { EditorialHeading, EditorialCard } from "@/components/editorial";
import PilotInvitationSection from "@/components/PilotInvitationSection";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { toolsFaq } from "@/content/kalkulator-copy";

export default function Verktoy() {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const prefix = en ? "/en" : "";
  const FAQ = toolsFaq(locale);
  const TOOLS = [
    {
      to: `${prefix}/verktoy/leiepriskalkulator`,
      icon: Calculator,
      title: t(locale, "tools.priceTitle"),
      desc: t(locale, "tools.priceDesc"),
    },
    {
      to: `${prefix}/verktoy/kapasitetskalkulator`,
      icon: Ruler,
      title: t(locale, "tools.capTitle"),
      desc: t(locale, "tools.capDesc"),
    },
  ];
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={t(locale, "tools.title")}
        description={t(locale, "tools.description")}
        keywords={t(locale, "tools.keywords")}
        canonical={en ? "https://digilist.no/en/verktoy" : "https://digilist.no/verktoy"}
        faq={FAQ}
        breadcrumbs={[
          { name: t(locale, "nav.home"), url: en ? "https://digilist.no/en" : "https://digilist.no/" },
          { name: t(locale, "tools.crumb"), url: en ? "https://digilist.no/en/verktoy" : "https://digilist.no/verktoy" },
        ]}
      />
      <Navbar />

      <main id="main">
        <section className="pt-28 lg:pt-32 pb-10 lg:pb-14 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialHeading as="h1" size="display">
              {t(locale, "tools.h1")}
            </EditorialHeading>
            <p className="text-xl text-ink-soft measure leading-relaxed mt-5">
              {t(locale, "tools.lede")}
            </p>
          </div>
        </section>

        <section className="pb-14 lg:pb-24 bg-paper">
          <div className="mx-auto max-w-3xl px-6 grid gap-5 sm:grid-cols-2">
            {TOOLS.map((tool) => (
              <Link key={tool.to} to={tool.to} className="group">
                <EditorialCard className="p-6 h-full">
                  <tool.icon className="h-6 w-6 text-ink-soft" aria-hidden />
                  <h2 className="font-serif text-2xl text-ink mt-4 mb-2">{tool.title}</h2>
                  <p className="text-ink-soft leading-relaxed">{tool.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-ink group-hover:gap-2 transition-all">
                    {t(locale, "tools.open")} <ArrowRight className="h-4 w-4" />
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
