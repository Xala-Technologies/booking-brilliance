import { motion } from "framer-motion";
import { ShieldCheck, MessagesSquare, CalendarClock, Sunrise, Compass, Wand2 } from "lucide-react";
import { EditorialButton } from "@/components/editorial";
import { SectionHeader } from "@/components/SectionHeader";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

// NOTE (for review): these are the real customer-facing "domain agents" from the
// Digilist agent fleet — see xala-agent-fleet/core/fleet-registry.ts (category:"domain").
// Descriptions are grounded in each agent's registry entry + prompts. Verify before publishing.

// The compliance frameworks the Listing Approver checks every listing against.
const frameworks = ["GDPR", "NSM", "SOC 2", "WCAG 2.1 AA", "Markedsføringsloven"];

const agents = [
  {
    icon: ShieldCheck,
    titleKey: "agents.a1.title",
    bodyKey: "agents.a1.body",
  },
  {
    icon: MessagesSquare,
    titleKey: "agents.a2.title",
    bodyKey: "agents.a2.body",
  },
  {
    icon: CalendarClock,
    titleKey: "agents.a3.title",
    bodyKey: "agents.a3.body",
  },
  {
    icon: Sunrise,
    titleKey: "agents.a4.title",
    bodyKey: "agents.a4.body",
  },
  {
    icon: Compass,
    titleKey: "agents.a5.title",
    bodyKey: "agents.a5.body",
  },
  {
    icon: Wand2,
    titleKey: "agents.a6.title",
    bodyKey: "agents.a6.body",
  },
];


/** Keep a link inside the visitor's language. Every route is mirrored. */
function localeHref(href: string, locale: "nb" | "en"): string {
  if (locale !== "en" || !href.startsWith("/") || href.startsWith("/en")) return href;
  return href === "/" ? "/en" : `/en${href}`;
}

const AiAgentsSection = () => {
  const locale = localeFromPath(useLocation().pathname);
  return (
    <section id="agenter" className="theme-cozy-dark py-10 lg:py-14 bg-paper-tinted border-y border-rule">
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionHeader
          label={t(locale, "agents.label")}
          intro={t(locale, "agents.intro")}
        >
          {t(locale, "agents.headline")}{" "}
          <em
            className="italic"
            style={{ fontVariationSettings: getFraunces("display") }}
          >
            {t(locale, "agents.headlineEm")}
          </em>
          .
        </SectionHeader>

        {/* Framework trust row — what every listing is checked against */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-10 lg:mb-14 pb-8 border-b border-rule">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint mr-1">
            Oppføringer kontrolleres mot
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          {agents.map((a) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.titleKey}
                variants={staggerChild}
                className="group bg-gradient-to-br from-paper to-paper-deep rounded-lg border border-rule p-7 flex flex-col shadow-[0_2px_10px_-4px_rgba(10,18,40,0.12)] transition-all duration-normal ease-editorial hover:-translate-y-0.5 hover:border-accent-text/30 hover:shadow-[0_16px_34px_-18px_rgba(10,18,40,0.4)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 shrink-0 inline-flex items-center justify-center bg-accent-text/10 ring-1 ring-accent-text/25 rounded-md text-accent-text transition-transform duration-normal ease-editorial group-hover:scale-105">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3
                    className="font-serif text-xl lg:text-2xl text-ink"
                    style={{ fontVariationSettings: getFraunces("sub"), lineHeight: 1.15 }}
                  >
                    {t(locale, a.titleKey)}
                  </h3>
                </div>
                <p className="text-base text-ink-soft leading-relaxed">{t(locale, a.bodyKey)}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-10 lg:mt-12">
          <EditorialButton href={localeHref("/ai-agenter", locale)} variant="outline">
            {t(locale, "agents.cta")}
          </EditorialButton>
        </div>
      </div>
    </section>
  );
};

export default AiAgentsSection;
