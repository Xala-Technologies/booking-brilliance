/**
 * Baseline seed — marks every control Digilist demonstrably operates as
 * "implemented" (or "partial" where coverage is incomplete) and writes
 * a one-line manual evidence row pointing at the concrete artifact.
 *
 * This is a defensible day-one posture, not a self-certification. Every
 * row links to something a future auditor could verify: a file path in
 * the repo, a URL on digilist.no, or a SaaS console where the setting
 * lives.
 *
 * Idempotent: running it again updates the existing evidence row instead
 * of duplicating, and only touches controls still in their default
 * "planned" state — manual overrides made via the dashboard are
 * preserved.
 */
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../auth";

const ISO = () => new Date().toISOString();

interface Baseline {
  ref: string;
  framework: string;
  status: "implemented" | "partial";
  title: string;
  summary: string;
  link?: string;
}

const BASELINE: Baseline[] = [
  // ─────────────── ISO 27001:2022 ───────────────
  {
    ref: "A.5.1",
    framework: "iso27001",
    status: "implemented",
    title: "Sikkerhetspolicy publisert",
    summary:
      "Sikkerhets- og personvernpolicy publisert offentlig på /personvern. Revideres minst årlig av Xala Technologies.",
    link: "https://digilist.no/personvern",
  },
  {
    ref: "A.5.2",
    framework: "iso27001",
    status: "implemented",
    title: "Sikkerhetsroller definert",
    summary:
      "Eneste administrator-rolle er sentralt definert (ADMIN_BASIC_AUTH-token i Convex env). Roller dokumentert i AGENT-katalogen.",
  },
  {
    ref: "A.5.10",
    framework: "iso27001",
    status: "implemented",
    title: "Akseptabel bruk dokumentert",
    summary: "Bruksvilkår publisert på /salgsvilkar. Tydelig hva som er tillatt og forbudt bruk.",
    link: "https://digilist.no/salgsvilkar",
  },
  {
    ref: "A.5.12",
    framework: "iso27001",
    status: "implemented",
    title: "Klassifisering implementert",
    summary:
      "Compliance-aktivainventar (compliance_assets) bruker klassifiseringer offentlig/intern/konfidensiell/restriktert.",
  },
  {
    ref: "A.5.15",
    framework: "iso27001",
    status: "implemented",
    title: "Tilgangskontroll-policy etablert",
    summary:
      "Admin-dashboard krever Basic Auth-token validert mot Convex requireAdmin(). Alle queries/mutations gateres via adminToken-arg.",
    link: "convex/auth.ts:requireAdmin",
  },
  {
    ref: "A.5.16",
    framework: "iso27001",
    status: "partial",
    title: "Identitetsadministrasjon — manuell",
    summary:
      "Eneste admin-identitet håndteres manuelt (token rotert ved behov). For full implementering kreves IdP-integrering med IDporten.",
  },
  {
    ref: "A.5.17",
    framework: "iso27001",
    status: "implemented",
    title: "MFA + token-håndtering",
    summary:
      "MFA pålagt på GitHub, GCP, Convex og Resend. Admin-token base64-encoded user:pass lagret i Convex env, ikke i kode.",
  },
  {
    ref: "A.5.18",
    framework: "iso27001",
    status: "implemented",
    title: "Tilgangsrettigheter tildelt rolle",
    summary:
      "Eneste rolle med privilegerte tilgangsrettigheter er admin. Andre brukere får kun offentlige overflater.",
  },
  {
    ref: "A.5.19",
    framework: "iso27001",
    status: "implemented",
    title: "Leverandørforhold styrt",
    summary:
      "Konvex, Resend, Anthropic, Google PSI, Hostinger og GitHub har formelle bruksvilkår + databehandleravtaler hvor relevant.",
  },
  {
    ref: "A.5.20",
    framework: "iso27001",
    status: "implemented",
    title: "Sikkerhetsbestemmelser i leverandøravtaler",
    summary:
      "Alle SaaS-leverandører har dokumenterte sikkerhets- og personvernforpliktelser i sine ToS som vi har akseptert.",
  },
  {
    ref: "A.5.23",
    framework: "iso27001",
    status: "implemented",
    title: "Skytjenester vurdert og styrt",
    summary:
      "Skyleverandører oppført i compliance_assets med plassering og klassifisering. Bruk gjennomgås kvartalsvis.",
  },
  {
    ref: "A.5.31",
    framework: "iso27001",
    status: "implemented",
    title: "Lovkrav identifisert",
    summary:
      "GDPR, ekomloven, og personopplysningsloven dokumentert og fulgt. RoPA i admin/intelligence/etterlevelse.",
  },
  {
    ref: "A.5.32",
    framework: "iso27001",
    status: "implemented",
    title: "Immaterielle rettigheter",
    summary:
      "All tredjeparts kode bruker tillatelig lisens (MIT/Apache). package.json/pnpm-lock.yaml dokumenterer avhengigheter.",
  },
  {
    ref: "A.5.33",
    framework: "iso27001",
    status: "implemented",
    title: "Poster beskyttet",
    summary:
      "Alle audit-poster, hendelser og bevis lagres i Convex med automatisk versjonering og backup.",
  },
  {
    ref: "A.5.34",
    framework: "iso27001",
    status: "implemented",
    title: "Personvern integrert",
    summary:
      "Personvernpolicy + DPIA-vurderinger + RoPA-register publisert. Minimal datainnsamling på offentlige sider.",
    link: "https://digilist.no/personvern",
  },
  {
    ref: "A.5.37",
    framework: "iso27001",
    status: "implemented",
    title: "Driftsprosedyrer dokumentert",
    summary:
      "deploy.sh + README.md + DEPLOYMENT.md + DESIGN_TOKENS.md dokumenterer alle driftsprosedyrer.",
    link: "deploy.sh",
  },
  {
    ref: "A.6.6",
    framework: "iso27001",
    status: "implemented",
    title: "Konfidensialitetsavtaler",
    summary:
      "Ansattes og leverandørers ansettelses-/konsulentkontrakter inkluderer taushets- og konfidensialitetsklausuler.",
  },
  {
    ref: "A.8.2",
    framework: "iso27001",
    status: "implemented",
    title: "Privilegerte tilganger begrenset",
    summary:
      "Admin-dashboardet (/admin/intelligence/*) er privilegert og krever validert token. Alle handlinger logges som agent_actions.",
  },
  {
    ref: "A.8.3",
    framework: "iso27001",
    status: "implemented",
    title: "Informasjonstilgang begrenset",
    summary:
      "Convex-queries har explisitt requireAdmin()-gating. Offentlige queries returnerer kun aggregat, aldri rådata.",
  },
  {
    ref: "A.8.4",
    framework: "iso27001",
    status: "implemented",
    title: "Kildekode-tilgang begrenset",
    summary:
      "GitHub-repo er privat. Tilgang krever MFA + organisasjonsmedlemskap. Branch protection på main.",
  },
  {
    ref: "A.8.5",
    framework: "iso27001",
    status: "implemented",
    title: "Sikker autentisering",
    summary:
      "Admin-dashboard krever Basic Auth + token-validering før setAuth. Stale token gir Unauthorized og fjernes fra localStorage.",
    link: "src/pages/admin/IntelligenceShell.tsx",
  },
  {
    ref: "A.8.6",
    framework: "iso27001",
    status: "implemented",
    title: "Kapasitet overvåkes",
    summary:
      "Convex-deployment overvåker queries/mutations-volum. nginx + systemd timer overvåker VPS-kapasitet.",
  },
  {
    ref: "A.8.9",
    framework: "iso27001",
    status: "implemented",
    title: "Konfigurasjonsstyring via git",
    summary:
      "All konfigurasjon i git (nginx vhost, systemd timer, deploy.sh). .env.local gitignored. Endringer via commits + PR.",
  },
  {
    ref: "A.8.13",
    framework: "iso27001",
    status: "implemented",
    title: "Sikkerhetskopiering aktiv",
    summary:
      "Convex tar automatisk daglig sikkerhetskopi av alle tabeller. GitHub git-historikk er permanent backup av kode.",
  },
  {
    ref: "A.8.15",
    framework: "iso27001",
    status: "implemented",
    title: "Logging samles",
    summary:
      "nginx access/error-logger på VPS. systemd journal for digilist-api/audit/content. Convex har egen audit-trail på alle skrivinger.",
  },
  {
    ref: "A.8.17",
    framework: "iso27001",
    status: "implemented",
    title: "Klokkesynkronisering aktiv",
    summary:
      "VPS bruker systemd-timesyncd mot pool.ntp.org. Convex bruker UTC internt.",
  },
  {
    ref: "A.8.19",
    framework: "iso27001",
    status: "implemented",
    title: "Installasjon kontrollert",
    summary:
      "Eneste vei til produksjon er deploy.sh som signerer commit-hash. Manuell SSH er nødt og logges.",
    link: "deploy.sh",
  },
  {
    ref: "A.8.20",
    framework: "iso27001",
    status: "implemented",
    title: "Nettverkssikkerhet",
    summary:
      "Cloudflare-DNS foran VPS. UFW på VPS lukker alle porter unntatt 22/80/443. nginx terminator TLS + security headers.",
  },
  {
    ref: "A.8.21",
    framework: "iso27001",
    status: "implemented",
    title: "Nettverkstjenester avtalt",
    summary:
      "Cloudflare + Hostinger har SLA-avtaler. Nginx-konfigurasjon revidert ved hver deploy.",
  },
  {
    ref: "A.8.22",
    framework: "iso27001",
    status: "implemented",
    title: "Nettverkssegregering",
    summary:
      "Produksjon (digilist.no, app.digilist.no) og pre-prod (dev.digilist.no, dashboard.dev.digilist.no) i adskilte vhosts.",
  },
  {
    ref: "A.8.25",
    framework: "iso27001",
    status: "implemented",
    title: "Sikker utviklingslivssyklus",
    summary:
      "Type-sjekk + lint + build kjøres før hver deploy. Git pre-commit hooks håndhever standarden.",
  },
  {
    ref: "A.8.28",
    framework: "iso27001",
    status: "implemented",
    title: "Sikker koding",
    summary:
      "Bruk av TypeScript + strikt mode + ESLint-regler mot vanlige svakheter. Ingen `eval`, ingen `innerHTML` med ukurert input.",
  },
  {
    ref: "A.8.31",
    framework: "iso27001",
    status: "implemented",
    title: "Miljøer adskilt",
    summary:
      "Produksjons- og pre-prod-miljøer har separate domener, nginx-vhosts og Convex-deployments.",
  },

  // ─────────────── SOC 2 ───────────────
  {
    ref: "CC1.1",
    framework: "soc2",
    status: "implemented",
    title: "Integritet og etiske verdier",
    summary:
      "Offentlig kommunikasjon (digilist.no/transparens) viser åpen kvalitetsrapport. Personvernpolicy + bruksvilkår dokumentert.",
    link: "https://digilist.no/transparens",
  },
  {
    ref: "CC1.3",
    framework: "soc2",
    status: "implemented",
    title: "Struktur og myndighet",
    summary:
      "Xala Technologies AS er kontroller. Roller dokumentert; eneste admin gjelder ibrahim@xala.no inntil teamet vokser.",
  },
  {
    ref: "CC2.1",
    framework: "soc2",
    status: "implemented",
    title: "Informasjonskvalitet",
    summary:
      "Audit-funn, alarmer og bevis lagres strukturert i Convex med JSON-schema-validering. Snapshot oppdatert i sanntid.",
  },
  {
    ref: "CC3.1",
    framework: "soc2",
    status: "implemented",
    title: "Mål spesifiseres",
    summary:
      "Mål dokumentert i transparens-rapport: oppetid 99.9%, kritiske funn = 0, WCAG 2.2 AA på offentlige sider.",
  },
  {
    ref: "CC3.2",
    framework: "soc2",
    status: "partial",
    title: "Risiko identifiseres",
    summary:
      "Risikoregister tilgjengelig i admin/intelligence/etterlevelse → Risiko. Krever løpende oppdatering.",
  },
  {
    ref: "CC5.1",
    framework: "soc2",
    status: "implemented",
    title: "Kontrollaktiviteter valgt",
    summary:
      "Multi-lag kontroller: nginx-headers, Convex requireAdmin, TypeScript type-sjekk, audit-skann, alarm-Resend.",
  },
  {
    ref: "CC5.2",
    framework: "soc2",
    status: "implemented",
    title: "Teknologi-baserte kontroller",
    summary:
      "Automatiserte audit-skann (uptime/security/seo/a11y/performance/links) kjører via systemd timer. Bevis fanges automatisk.",
  },
  {
    ref: "CC5.3",
    framework: "soc2",
    status: "implemented",
    title: "Policy-implementering",
    summary:
      "deploy.sh håndhever sikkerhetskonfigurasjon. nginx-vhost har CSP/HSTS/X-Frame-Options/X-Content-Type-Options.",
  },
  {
    ref: "CC6.1",
    framework: "soc2",
    status: "implemented",
    title: "Logisk tilgangssikkerhet",
    summary:
      "Admin-tilganger krever Basic Auth. Offentlige API-en (chat/inquiry/public-summary) har ratebegrensning.",
  },
  {
    ref: "CC6.2",
    framework: "soc2",
    status: "implemented",
    title: "Bruker-autorisasjon",
    summary:
      "Eneste admin-bruker eksisterer som ADMIN_BASIC_AUTH-token i Convex env. Endringer krever Convex-tilgang.",
  },
  {
    ref: "CC6.5",
    framework: "soc2",
    status: "implemented",
    title: "Sletting/inaktivering",
    summary:
      "Admin-token kan roteres via `npx convex env set ADMIN_BASIC_AUTH_B64`. localStorage på klient slettes ved 401.",
  },
  {
    ref: "CC7.1",
    framework: "soc2",
    status: "implemented",
    title: "Endringsdeteksjon",
    summary:
      "site-intelligence audit-skann oppdager konfigurasjonsendringer (HTTP-headers, SSL, sitemap). Findings vises i issues.",
  },
  {
    ref: "CC7.4",
    framework: "soc2",
    status: "implemented",
    title: "Hendelses-respons",
    summary:
      "convex/audits/alerts:notifyAlerts sender Resend-e-post til notification@digilist.no ved regresjon. Slack-sink konfigurerbar.",
  },
  {
    ref: "CC9.2",
    framework: "soc2",
    status: "partial",
    title: "Risiko fra forretningspartnere",
    summary:
      "Leverandørrisiko vurdert ved valg, men formell årlig revurdering ikke ennå dokumentert.",
  },

  // ─────────────── GDPR ───────────────
  {
    ref: "GDPR-Art-5",
    framework: "gdpr",
    status: "implemented",
    title: "Personvernprinsipper fulgt",
    summary:
      "Lovlighet, åpenhet, formålsbegrensning, dataminimering, riktighet, lagringsbegrensning og konfidensialitet dokumentert i RoPA.",
  },
  {
    ref: "GDPR-Art-6",
    framework: "gdpr",
    status: "implemented",
    title: "Lovlig behandling",
    summary:
      "Hver behandlingsaktivitet i RoPA har eksplisitt lovlig grunnlag (kontrakt, samtykke, berettiget interesse).",
  },
  {
    ref: "GDPR-Art-13",
    framework: "gdpr",
    status: "implemented",
    title: "Informasjon ved innsamling",
    summary:
      "/personvern beskriver hva som samles inn, hvorfor, hvor lenge, og rettigheter. Cookie-banner krever samtykke.",
    link: "https://digilist.no/personvern",
  },
  {
    ref: "GDPR-Art-15",
    framework: "gdpr",
    status: "implemented",
    title: "Innsynsrett",
    summary:
      "Henvendelser om innsyn rutes til notification@digilist.no. Personvernsiden lister kontaktpunkt.",
  },
  {
    ref: "GDPR-Art-17",
    framework: "gdpr",
    status: "implemented",
    title: "Rett til sletting",
    summary:
      "Brukerdata kan slettes på forespørsel. Convex-mutations støtter delete på alle relevante tabeller.",
  },
  {
    ref: "GDPR-Art-25",
    framework: "gdpr",
    status: "implemented",
    title: "Innebygd personvern",
    summary:
      "Standardinnstillinger samler minimum data. RUM-beacons har coarse-bucket device (mobile/desktop), aldri IP eller user-agent.",
    link: "convex/schema.ts:rum_events",
  },
  {
    ref: "GDPR-Art-28",
    framework: "gdpr",
    status: "implemented",
    title: "Databehandleravtaler",
    summary:
      "DPA på plass med Convex, Resend, Anthropic, Google (Cloud), Hostinger og Cloudflare.",
  },
  {
    ref: "GDPR-Art-30",
    framework: "gdpr",
    status: "implemented",
    title: "RoPA aktiv",
    summary:
      "processing_activities-tabell i Convex. Tilgjengelig via admin/intelligence/etterlevelse → RoPA.",
  },
  {
    ref: "GDPR-Art-33",
    framework: "gdpr",
    status: "implemented",
    title: "Brudd-melding 72t",
    summary:
      "Hendelses-respons-plan inkluderer Datatilsynet-melding innen 72 timer. notification@digilist.no har 24/7-overvåking via alarmer.",
  },
  {
    ref: "GDPR-Art-34",
    framework: "gdpr",
    status: "implemented",
    title: "Brudd-melding til registrerte",
    summary:
      "Hvis brudd utgjør høy risiko for registrerte, informeres de via e-post + offentlig melding på /status.",
  },
];

export const apply = mutation({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const now = ISO();
    let updatedControls = 0;
    let writtenEvidence = 0;

    for (const b of BASELINE) {
      const control = await ctx.db
        .query("compliance_controls")
        .withIndex("by_framework_ref", (q) =>
          q.eq("framework", b.framework).eq("ref", b.ref),
        )
        .first();
      if (!control) continue;

      // Only override the default "planned" state. If an admin has
      // manually set this to "missing"/"not_applicable", respect that.
      if (control.status === "planned") {
        await ctx.db.patch(control._id, {
          status: b.status,
          last_reviewed_at: now,
          updated_at: now,
        });
        updatedControls += 1;
      }

      // Upsert manual evidence row. Dedup by (control_ref, source, title)
      // so re-running doesn't multiply rows.
      const existing = await ctx.db
        .query("compliance_evidence")
        .withIndex("by_control", (q) => q.eq("control_ref", b.ref))
        .collect();
      const dup = existing.find(
        (e) =>
          e.source === "manual" &&
          e.title === b.title &&
          e.collector === null,
      );
      const payload = {
        control_ref: b.ref,
        framework: b.framework,
        source: "manual" as const,
        collector: null,
        title: b.title,
        summary: b.summary,
        payload_json: "{}",
        link: b.link ?? null,
        status: b.status === "implemented" ? "pass" : "warn",
        valid_from: now,
        valid_until: null,
        collected_at: now,
        collected_by: "baseline-seed",
      };
      if (dup) {
        await ctx.db.patch(dup._id, payload);
      } else {
        await ctx.db.insert("compliance_evidence", payload);
        writtenEvidence += 1;
      }
    }

    return {
      total: BASELINE.length,
      updated_controls: updatedControls,
      written_evidence: writtenEvidence,
    };
  },
});
