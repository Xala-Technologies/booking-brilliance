import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { localeFromPath, type Locale } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { SectionHeader } from "@/components/SectionHeader";
import { InterestSelector } from "@/components/InterestSelector";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

/** The four steps, built per language from the copy dictionary. */
const stepsFor = (locale: Locale) =>
  [1, 2, 3, 4].map((n) => ({
    step: `0${n}`,
    title: t(locale, `how.step${n}.title`),
    description: t(locale, `how.step${n}.body`),
  }));

const HowItWorksSection = () => {
  const locale = localeFromPath(useLocation().pathname);
  const steps = stepsFor(locale);
  return (
    <section
      id="funksjonalitet"
      className="py-10 lg:py-14 bg-paper"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionHeader
          label={t(locale, "how.label")}
          intro={t(locale, "how.intro")}
        >
          {t(locale, "how.headline")}{" "}
          <em
            className="italic"
            style={{
              fontVariationSettings: '"opsz" 96, "wght" 400',
            }}
          >
            {t(locale, "how.headlineEm")}
          </em>
        </SectionHeader>

        <InterestSelector />

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="relative border-l border-rule pl-10 lg:pl-14"
        >
          {steps.map((s, idx) => (
            <motion.li
              key={s.step}
              variants={staggerChild}
              className={`relative grid grid-cols-12 gap-6 lg:gap-gutter py-10 lg:py-14 ${
                idx > 0 ? "border-t border-rule" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute -left-[2.75rem] lg:-left-[3.75rem] top-12 lg:top-16 inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-paper border border-hairline-strong rounded-sm font-mono text-xs tracking-widest text-accent-text tabular-nums"
              >
                {s.step}
              </span>
              <div className="col-span-12 lg:col-span-4">
                <span className="editorial-mono-caption text-ink-faint mb-3 block">
                  STEG {s.step} / {String(steps.length).padStart(2, "0")}
                </span>
                <h3
                  className="font-serif text-3xl lg:text-5xl text-ink"
                  style={{
                    fontVariationSettings: getFraunces("section"),
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {s.title}
                </h3>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <p className="text-lg lg:text-xl text-ink-soft measure leading-relaxed">
                  {s.description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
};

export default HowItWorksSection;
