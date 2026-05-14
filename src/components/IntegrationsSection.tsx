import { motion } from "framer-motion";
import {
  SectionRule,
  EditorialHeading,
  IntegrationLogo,
} from "@/components/editorial";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

interface IntegrationRow {
  name: string;
  category: string;
  status: "AKTIV" | "PILOT" | "PLANLAGT";
  version?: string;
}

const integrations: IntegrationRow[] = [
  { name: "Vipps", category: "Betaling", status: "AKTIV", version: "mobile + web" },
  { name: "Stripe Connect", category: "Betaling", status: "AKTIV", version: "Express" },
  { name: "BankID", category: "Autentisering", status: "AKTIV", version: "Signicat" },
  { name: "ID-porten", category: "Autentisering", status: "AKTIV" },
  { name: "Altinn", category: "Offentlig", status: "AKTIV" },
  { name: "EHF / Peppol", category: "Fakturering", status: "AKTIV" },
  { name: "Visma eAccounting", category: "Regnskap", status: "AKTIV" },
  { name: "RCO booking", category: "Booking-import", status: "AKTIV", version: "migrasjon" },
  { name: "Tripletex", category: "Regnskap", status: "AKTIV" },
  { name: "Fiken", category: "Regnskap", status: "AKTIV" },
  { name: "PowerOffice", category: "Regnskap", status: "AKTIV" },
  { name: "DNB Regnskap", category: "Regnskap", status: "AKTIV" },
  { name: "Microsoft 365 / Outlook", category: "Kalender", status: "AKTIV" },
  { name: "Salto KS", category: "Adgangskontroll", status: "PILOT" },
  { name: "ISO 27001 & 27701", category: "Samsvar", status: "AKTIV" },
  { name: "GDPR", category: "Samsvar", status: "AKTIV" },
  { name: "WCAG 2.0 AA", category: "Universell utforming", status: "AKTIV" },
];

const IntegrationsSection = () => {
  return (
    <section
      id="integrasjoner"
      className="py-14 lg:py-20 bg-paper"
    >
      <div className="container mx-auto px-4">
        <SectionRule label="V. INTEGRASJONER" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-16">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section">
              Tilkoblet det{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0',
                }}
              >
                norske
              </em>{" "}
              landskapet.
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p
              className="text-xl text-ink-soft italic"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              Betaling, autentisering, regnskap og samsvar — bygget for norske
              utleiere fra første dag.
            </p>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="overflow-x-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          tabIndex={0}
          role="region"
          aria-label="Integrasjoner og samsvar"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-ink/30">
                <th className="text-left py-4 pr-6 editorial-mono-caption">
                  Tjeneste
                </th>
                <th className="text-left py-4 pr-6 editorial-mono-caption">
                  Kategori
                </th>
                <th className="text-left py-4 pr-6 editorial-mono-caption hidden md:table-cell">
                  Versjon
                </th>
                <th className="text-right py-4 editorial-mono-caption">Status</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map((row, idx) => (
                <motion.tr
                  key={row.name}
                  variants={staggerChild}
                  className={`border-b border-rule ${
                    idx % 2 === 1 ? "bg-paper-deep/30" : "bg-paper"
                  }`}
                >
                  <td className="py-5 pr-6">
                    <IntegrationLogo brand={row.name} />
                  </td>
                  <td className="py-5 pr-6 text-base text-ink-soft">
                    {row.category}
                  </td>
                  <td className="py-5 pr-6 text-base text-ink-faint hidden md:table-cell">
                    {row.version ?? "—"}
                  </td>
                  <td className="py-4 text-right">
                    <span
                      className={`font-mono text-xs tracking-widest ${
                        row.status === "AKTIV"
                          ? "text-accent-text"
                          : row.status === "PILOT"
                          ? "text-ochre"
                          : "text-ink-faint"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
