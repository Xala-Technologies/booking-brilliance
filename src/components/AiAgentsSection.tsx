import { motion } from "framer-motion";
import { ShieldCheck, Scale, Activity, Sparkles } from "lucide-react";
import { SectionRule, EditorialHeading } from "@/components/editorial";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

// NOTE (for review): these describe real capabilities in the Digilist agent fleet.
// "Live" = running in production today; "Under utrulling" = built, rolling out.
// Verify the framing before publishing — this is public-facing product copy.
const agents = [
  {
    icon: ShieldCheck,
    status: "Live",
    title: "Automatisk moderering",
    description:
      "En agent gjennomgår nye oppføringer og søknader mot deres egne regler — godkjenner det som er klart, og løfter tvilstilfeller til en saksbehandler. Kortere kø, konsekvent behandling.",
  },
  {
    icon: Scale,
    status: "Under utrulling",
    title: "Tildeling med begrunnelse",
    description:
      "Ved sesongtildeling for lag og foreninger gjennomgår agenten fordelingen og forklarer hvorfor den ser slik ut — en transparent og etterprøvbar prosess, ikke en svart boks.",
  },
  {
    icon: Activity,
    status: "Live",
    title: "Selvovervåking",
    description:
      "Plattformen overvåker seg selv døgnet rundt og retter opp driftsavvik automatisk — ofte før noen rekker å merke dem. Oppetid uten manuell vakt.",
  },
  {
    icon: Sparkles,
    status: "Vokser",
    title: "En flåte som lærer",
    description:
      "Agentene deler et felles minne og blir bedre for hver oppgave. Nye agenter kommer til over tid — bygget for å ta det repetitive arbeidet, så folk kan bruke tiden på skjønn.",
  },
];

const AiAgentsSection = () => {
  return (
    <section id="agenter" className="py-14 lg:py-20 bg-paper-tinted">
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="INTELLIGENT AUTOMATISERING" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section">
              Agenter som gjør jobben.
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p
              className="text-xl text-ink-soft italic"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              Under overflaten jobber en flåte av AI-agenter — de modererer,
              begrunner og overvåker, så administrasjonen slipper.
            </p>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule"
        >
          {agents.map((a) => {
            const Icon = a.icon;
            return (
              <motion.div key={a.title} variants={staggerChild} className="bg-paper p-7 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <span className="w-10 h-10 inline-flex items-center justify-center bg-navy/5 border border-navy/15 rounded-sm text-navy">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-accent-text">
                    {a.status}
                  </span>
                </div>
                <h3
                  className="font-serif text-xl lg:text-2xl text-ink mb-3"
                  style={{ fontVariationSettings: getFraunces("sub"), lineHeight: 1.15 }}
                >
                  {a.title}
                </h3>
                <p className="text-base text-ink-soft leading-relaxed">{a.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AiAgentsSection;
