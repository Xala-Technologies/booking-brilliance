import { motion } from "framer-motion";
import {
  SectionRule,
  EditorialHeading,
  EditorialCard,
  SpecRow,
} from "@/components/editorial";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

const stacks = [
  {
    category: "Frontend",
    items: [
      { name: "React", value: "19" },
      { name: "React Router", value: "7" },
      { name: "TypeScript", value: "5.x strict" },
      { name: "Tailwind CSS", value: "3.x" },
      { name: "Vite", value: "5.x" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Convex", value: "self-hosted" },
      { name: "Node.js", value: "20 LTS" },
      { name: "TypeScript", value: "5.x strict" },
      { name: "Zod", value: "Skjemavalidering" },
    ],
  },
  {
    category: "Database",
    items: [
      { name: "PostgreSQL", value: "16" },
      { name: "Convex", value: "Reaktiv runtime" },
      { name: "Outbox event bus", value: "transaksjonell" },
      { name: "Region", value: "Norge / EU" },
    ],
  },
  {
    category: "Sikkerhet & Etterlevelse",
    items: [
      { name: "ID-porten", value: "BankID / MinID" },
      { name: "GDPR", value: "Kompatibel" },
      { name: "ISO 27001 / 27701", value: "Sertifisert" },
      { name: "WCAG", value: "2.0 AA" },
      { name: "TLS", value: "1.3 + AES-256-GCM" },
    ],
  },
];

const stats = [
  { value: "100 %", label: "TypeScript strict" },
  { value: "99,9 %", label: "Oppetid SLA" },
  { value: "<200ms", label: "API p95" },
  { value: "AA", label: "WCAG 2.0" },
];

const TechnologyStackSection = () => {
  return (
    <section
      id="teknologi"
      className="py-14 lg:py-20 bg-paper-deep/40"
    >
      <div className="container mx-auto px-4">
        <SectionRule label="VI. TEKNOLOGI" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-16">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section">
              Bygget for{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0',
                }}
              >
                pålitelighet.
              </em>
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p
              className="text-xl text-ink-soft italic"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              Konvensjonelle, kjedelige valg som leverer dag etter dag.
            </p>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-16"
        >
          {stacks.map((s) => (
            <motion.div key={s.category} variants={staggerChild}>
              <EditorialCard>
                <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-rule">
                  <h3
                    className="font-serif text-2xl lg:text-3xl text-ink"
                    style={{ fontVariationSettings: getFraunces("section") }}
                  >
                    {s.category}
                  </h3>
                  <span className="editorial-mono-caption">{s.items.length} valg</span>
                </div>
                <div>
                  {s.items.map((it) => (
                    <SpecRow key={it.name} label={it.name} value={it.value} />
                  ))}
                </div>
              </EditorialCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={staggerChild}
              className="bg-paper px-6 py-10 flex flex-col items-start"
            >
              <span
                className="font-mono text-4xl lg:text-5xl text-accent-text tabular-nums"
                style={{ letterSpacing: "-0.02em" }}
              >
                {s.value}
              </span>
              <span className="mt-3 editorial-mono-caption">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechnologyStackSection;
