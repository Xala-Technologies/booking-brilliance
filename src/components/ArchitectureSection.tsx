import { DiagramViewer } from "./DiagramViewer";
import { DiagramData } from "../types/diagram";
import {
  SectionRule,
  EditorialHeading,
  EditorialCard,
  Sidenote,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";

const ArchitectureSection = () => {
  const diagramData: DiagramData = {
    title: "Digilist plattformarkitektur",
    nodes: [
      { id: "webapp", label: "Web", subLabel: "Digdir Designsystemet", category: "client", layer: 0, icon: "React", color: "#1F2F6E" },
      { id: "dashboard", label: "Dashboard", subLabel: "Multi-tenant", category: "client", layer: 0, icon: "React", color: "#1F2F6E" },
      { id: "mobile", label: "Mobil", subLabel: "Tablet · iOS · Android", category: "client", layer: 0, icon: "React", color: "#1F2F6E" },
      { id: "convex", label: "Convex", subLabel: "Reaktiv runtime", category: "server", layer: 1, icon: "Convex", color: "#0A1228" },
      { id: "postgres", label: "PostgreSQL", subLabel: "16 (NO/EU)", category: "database", layer: 2, icon: "PostgreSQL", color: "#1F2F6E" },
      { id: "outbox", label: "Outbox Bus", subLabel: "Transaksjonelle hendelser", category: "worker", layer: 2, icon: "Bus", color: "#1F2F6E" },
      { id: "audit", label: "Revisjon", subLabel: "Audit-log + RBAC", category: "general", layer: 2, icon: "Audit", color: "#1F2F6E" },
      { id: "integrations", label: "Integrasjoner", subLabel: "Vipps · BankID · Visma · RCO · EHF", category: "storage", layer: 2, icon: "Plug", color: "#1F2F6E" },
    ],
    links: [
      { source: "webapp", target: "convex" },
      { source: "dashboard", target: "convex" },
      { source: "mobile", target: "convex" },
      { source: "convex", target: "postgres" },
      { source: "convex", target: "outbox" },
      { source: "convex", target: "audit" },
      { source: "convex", target: "integrations" },
    ],
  };

  return (
    <section
      id="arkitektur"
      className="py-14 lg:py-20 bg-paper"
    >
      <div className="container mx-auto px-4">
        <SectionRule label="VII. ARKITEKTUR" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-16">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section">
              Schema.
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p
              className="text-xl text-ink-soft italic"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              Tre klienter mot én reaktiv runtime, med transaksjonell hendelsesbus og
              fullstendig revisjon.
            </p>
          </div>
        </div>

        <div className="relative">
          <EditorialCard bleed className="bg-paper-deep/40">
            <div className="hidden md:block w-full h-[640px]">
              <DiagramViewer data={diagramData} />
            </div>

            <div className="md:hidden p-6 space-y-8">
              {[0, 1, 2].map((layer) => (
                <div key={layer}>
                  <h3 className="editorial-mono-caption mb-4">
                    {layer === 0
                      ? "Klienter"
                      : layer === 1
                      ? "Reaktiv runtime"
                      : "Lagring & samsvar"}
                  </h3>
                  <div className="grid grid-cols-2 gap-px bg-rule">
                    {diagramData.nodes
                      .filter((n) => n.layer === layer)
                      .map((node) => (
                        <div
                          key={node.id}
                          className="bg-paper p-4 flex flex-col"
                        >
                          <span
                            className="font-serif text-lg text-ink"
                            style={{
                              fontVariationSettings: '"opsz" 36, "wght" 460',
                            }}
                          >
                            {node.label}
                          </span>
                          <span className="text-xs text-ink-faint mt-1">
                            {node.subLabel}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </EditorialCard>
          <p className="mt-3 editorial-mono-caption">
            Fig. II — Systemarkitektur (forenklet)
          </p>

          <div className="mt-10 grid lg:grid-cols-2 gap-6">
            <Sidenote marker={1}>
              Convex er en reaktiv runtime: spørringer abonnerer på data og
              oppdateres umiddelbart når underliggende tabeller endres.
            </Sidenote>
            <Sidenote marker={2}>
              Outbox-bussen sikrer transaksjonell publisering: hendelsen lagres
              i samme transaksjon som mutasjonen, og distribueres deretter til
              abonnenter med backoff og dead-letter.
            </Sidenote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
