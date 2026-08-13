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
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { agentsCopy } from "@/content/ai-agenter";
import { LinkOrText } from "@/components/LinkOrText";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

const AiAgenter = () => {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const c = agentsCopy(locale);
  const agents = c.agents;
  const faq = c.faq;
  const frameworks = c.frameworks;
  // Icons are presentation and pair with the translated agents by position.
  const AGENT_ICONS = [ShieldCheck, MessagesSquare, CalendarClock, Sunrise, Compass, Wand2];

  return (
    <>
      <SEO
        title={c.metaTitle}
        description={c.metaDescription}
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
        canonical={en ? "https://digilist.no/en/ai-agenter" : "https://digilist.no/ai-agenter"}
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
              <SectionRule label={c.rule} />
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter">
                <div className="lg:col-span-8">
                  <EditorialHeading as="h1" size="display">
                    {c.h1}
                  </EditorialHeading>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-xl lg:text-2xl text-ink-soft leading-relaxed measure">
                    {c.lede}
                  </p>
                </div>
              </div>

              {/* Compliance framework row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-10 lg:mt-14 pt-8 border-t border-rule">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint mr-1">
                  {c.checkedAgainst}
                </span>
                {frameworks.map((f) => (
                  <span
                    key={f}
                    className="font-mono text-[11px] uppercase tracking-wider text-accent-text bg-accent-text/5 border border-accent-text/15 rounded-sm px-2.5 py-1"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Per-agent deep sections */}
          {agents.map((a, i) => {
            const Icon = AGENT_ICONS[i];
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
                        <span className="w-12 h-12 shrink-0 inline-flex items-center justify-center bg-accent-text/5 border border-accent-text/15 rounded-sm text-accent-text">
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
                    {/* The three sub-pages are Norwegian only, so in English
                        this reads as a label rather than a link out of the
                        language. It becomes a link again when they exist. */}
                    {a.href && !en && (
                      <Link
                        to={a.href}
                        className="inline-block mt-5 font-mono text-[12px] uppercase tracking-wider text-accent-text hover:underline"
                      >
                        {c.readMore} {a.tag.toLowerCase()} →
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
                  <ScanEye className="h-8 w-8 text-accent-text" strokeWidth={1.5} />
                </div>
                <p
                  className="lg:col-span-11 font-serif text-2xl lg:text-3xl text-ink leading-snug"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  {c.visionCallout}
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-14 lg:py-20 bg-paper-tinted">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label={c.faqRule} />
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
                <EditorialButton href={en ? "/en/book-demo" : "/#kontakt"} variant="primary">
                  {c.ctaDemo} <ArrowUpRight className="inline h-4 w-4" />
                </EditorialButton>
                <EditorialButton href={en ? "/en" : "/"} variant="outline">
                  {c.ctaHome}
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
