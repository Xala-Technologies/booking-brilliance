/**
 * AgentSpokeLayout — shared editorial layout for the deep /ai-agenter/* pages.
 * Each spoke passes structured, unique content (hero, pipeline flow, body
 * sections, FAQ, related links) and this handles SEO, chrome and section
 * rendering. Kept data-driven so every spoke stays substantial + consistent.
 */
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { ProgressRail, SectionRule, EditorialHeading, EditorialButton } from "@/components/editorial";
import { AgentFlow } from "@/components/AgentFlow";
import { getFraunces } from "@/lib/fonts";

export interface AgentSpokeContent {
  slug: string; // e.g. "sesongtildeling"
  eyebrow: string; // SectionRule label
  h1: string;
  lead: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  breadcrumbLabel: string;
  flowTitle: string;
  flow: string[];
  frameworks?: string[];
  sections: Array<{ heading: string; body: string[] }>;
  faq: Array<{ question: string; answer: string }>;
  related: Array<{ label: string; href: string }>;
}

const AgentSpokeLayout = ({ content }: { content: AgentSpokeContent }) => {
  const url = `https://digilist.no/ai-agenter/${content.slug}`;
  return (
    <>
      <SEO
        title={content.metaTitle}
        description={content.metaDescription}
        keywords={content.keywords}
        canonical={url}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "AI-agenter", url: "https://digilist.no/ai-agenter" },
          { name: content.breadcrumbLabel, url },
        ]}
        faq={content.faq}
        service
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          {/* Hero */}
          <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <nav className="mb-6 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                <Link to="/ai-agenter" className="hover:text-accent-text">AI-agenter</Link>
                <span className="mx-2">/</span>
                <span className="text-ink-soft">{content.breadcrumbLabel}</span>
              </nav>
              <SectionRule label={content.eyebrow} />
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter">
                <div className="lg:col-span-9">
                  <EditorialHeading as="h1" size="display">
                    {content.h1}
                  </EditorialHeading>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-xl lg:text-2xl text-ink-soft leading-relaxed measure">
                    {content.lead}
                  </p>
                </div>
              </div>

              {content.frameworks && content.frameworks.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-10 pt-8 border-t border-rule">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint mr-1">
                    Kontrollert mot
                  </span>
                  {content.frameworks.map((f) => (
                    <span
                      key={f}
                      className="font-mono text-[11px] uppercase tracking-wider text-accent-text bg-accent-text/5 border border-accent-text/15 rounded-sm px-2.5 py-1"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Pipeline flow */}
          <section className="py-12 lg:py-16 bg-paper-tinted">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label={content.flowTitle} />
              <div className="mt-6">
                <AgentFlow steps={content.flow} />
              </div>
            </div>
          </section>

          {/* Body sections */}
          {content.sections.map((s, i) => (
            <section key={s.heading} className={`py-12 lg:py-16 ${i % 2 === 0 ? "bg-paper" : "bg-paper-tinted"}`}>
              <div className="container mx-auto md:px-8 lg:px-12">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter">
                  <div className="lg:col-span-4">
                    <h2
                      className="font-serif text-3xl lg:text-4xl text-ink"
                      style={{ fontVariationSettings: getFraunces("section"), lineHeight: 1.1 }}
                    >
                      {s.heading}
                    </h2>
                  </div>
                  <div className="lg:col-span-8 space-y-5">
                    {s.body.map((p, n) => (
                      <p key={n} className="text-lg text-ink-soft leading-relaxed">{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* FAQ */}
          <section className="py-12 lg:py-16 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="OFTE STILTE SPØRSMÅL" />
              <div className="border-t border-rule mt-6">
                {content.faq.map((f) => (
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
            </div>
          </section>

          {/* Related + CTA */}
          <section className="py-12 lg:py-16 bg-paper-tinted">
            <div className="container mx-auto md:px-8 lg:px-12">
              <div className="flex flex-wrap gap-3 mb-10">
                {content.related.map((r) => (
                  <Link
                    key={r.href}
                    to={r.href}
                    className="font-mono text-[12px] uppercase tracking-wider text-accent-text bg-paper border border-rule rounded-sm px-4 py-2 hover:border-accent-text/30"
                  >
                    {r.label} →
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <EditorialButton href="/#kontakt" variant="primary">
                  Book en demo <ArrowUpRight className="inline h-4 w-4" />
                </EditorialButton>
                <EditorialButton href="/ai-agenter" variant="outline">
                  Alle AI-agentene
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

export default AgentSpokeLayout;
