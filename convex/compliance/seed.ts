/**
 * Compliance seed — ISO 27001:2022 Annex A (93 controls) + SOC 2 Common
 * Criteria (33 controls). Idempotent: upserts by (framework, ref) so it
 * can be re-run as the catalog evolves.
 *
 * Norwegian labels follow the official ISO/IEC 27001:2022 NS-translation
 * vocabulary where one exists; SOC 2 retains AICPA wording with a short
 * Norwegian summary.
 *
 * automation_signal links a control to a collector key in
 * convex/compliance/collectors.ts so automated evidence rolls up to the
 * right rows.
 */
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../auth";

const ISO = () => new Date().toISOString();

interface Seed {
  ref: string;
  theme: string;
  title: string;
  description: string;
  automation_signal?: string;
}

// ISO 27001:2022 Annex A — 93 controls, 4 themes.
const ISO_CONTROLS: Seed[] = [
  // A.5 Organisatoriske kontroller (37)
  { ref: "A.5.1", theme: "Organisatoriske", title: "Retningslinjer for informasjonssikkerhet", description: "Definert, godkjent og kommunisert sikkerhetspolicy med årlig revisjon." },
  { ref: "A.5.2", theme: "Organisatoriske", title: "Roller og ansvar for informasjonssikkerhet", description: "Klart definerte sikkerhetsroller og ansvarsområder." },
  { ref: "A.5.3", theme: "Organisatoriske", title: "Adskillelse av oppgaver", description: "Konflikterende oppgaver og ansvar er adskilt for å redusere risiko for misbruk." },
  { ref: "A.5.4", theme: "Organisatoriske", title: "Ledelsens ansvar", description: "Ledelsen krever at alle ansatte og leverandører følger sikkerhetspolicy." },
  { ref: "A.5.5", theme: "Organisatoriske", title: "Kontakt med myndigheter", description: "Kontaktpunkter etablert med relevante myndigheter (NSM, Datatilsynet)." },
  { ref: "A.5.6", theme: "Organisatoriske", title: "Kontakt med interessegrupper", description: "Aktivt medlemskap i relevante sikkerhetsfora og ISAC-grupper." },
  { ref: "A.5.7", theme: "Organisatoriske", title: "Trusselsbilde", description: "Trusselsinformasjon innhentes, analyseres og deles internt." },
  { ref: "A.5.8", theme: "Organisatoriske", title: "Informasjonssikkerhet i prosjektledelse", description: "Sikkerhet er integrert i alle prosjekt- og endringsprosesser." },
  { ref: "A.5.9", theme: "Organisatoriske", title: "Inventar over informasjon og andre tilknyttede ressurser", description: "Komplett inventar over informasjonsaktiva med eierskap." },
  { ref: "A.5.10", theme: "Organisatoriske", title: "Akseptabel bruk av informasjon", description: "Regler for akseptabel bruk av informasjonsaktiva er dokumentert." },
  { ref: "A.5.11", theme: "Organisatoriske", title: "Retur av aktiva", description: "Ansatte og leverandører returnerer alle aktiva ved avslutning." },
  { ref: "A.5.12", theme: "Organisatoriske", title: "Klassifisering av informasjon", description: "Informasjon klassifiseres etter konfidensialitet og kritikalitet." },
  { ref: "A.5.13", theme: "Organisatoriske", title: "Merking av informasjon", description: "Klassifisert informasjon merkes konsekvent." },
  { ref: "A.5.14", theme: "Organisatoriske", title: "Overføring av informasjon", description: "Sikre overføringsmekanismer for informasjon mellom parter." },
  { ref: "A.5.15", theme: "Organisatoriske", title: "Tilgangskontroll", description: "Policy for tilgangskontroll etablert basert på forretningsbehov og risiko." },
  { ref: "A.5.16", theme: "Organisatoriske", title: "Identitetsadministrasjon", description: "Hele livssyklusen for digitale identiteter er kontrollert." },
  { ref: "A.5.17", theme: "Organisatoriske", title: "Autentiseringsinformasjon", description: "Tildeling og håndtering av passord/MFA-tokens er kontrollert." },
  { ref: "A.5.18", theme: "Organisatoriske", title: "Tilgangsrettigheter", description: "Tilgangsrettigheter tildeles, revideres og fjernes basert på rolle." },
  { ref: "A.5.19", theme: "Organisatoriske", title: "Informasjonssikkerhet i leverandørforhold", description: "Sikkerhetskrav avtales med leverandører." },
  { ref: "A.5.20", theme: "Organisatoriske", title: "Sikkerhet i leverandøravtaler", description: "Avtaler med leverandører inneholder relevante sikkerhetsbestemmelser." },
  { ref: "A.5.21", theme: "Organisatoriske", title: "Sikkerhet i ICT-leverandørkjeden", description: "Risiko i ICT-leverandørkjeden er identifisert og styrt." },
  { ref: "A.5.22", theme: "Organisatoriske", title: "Overvåking, gjennomgang og endring av leverandørtjenester", description: "Leverandørtjenester overvåkes og revideres regelmessig." },
  { ref: "A.5.23", theme: "Organisatoriske", title: "Informasjonssikkerhet ved bruk av skytjenester", description: "Skytjenester er vurdert, godkjent og styrt." },
  { ref: "A.5.24", theme: "Organisatoriske", title: "Planlegging og forberedelse for hendelseshåndtering", description: "Roller, ansvar og prosedyrer for hendelseshåndtering definert.", automation_signal: "alerts-mttr" },
  { ref: "A.5.25", theme: "Organisatoriske", title: "Vurdering og beslutning om hendelser", description: "Hendelser vurderes og kategoriseres systematisk." },
  { ref: "A.5.26", theme: "Organisatoriske", title: "Respons på informasjonssikkerhetshendelser", description: "Hendelser håndteres iht. dokumenterte responsplaner." },
  { ref: "A.5.27", theme: "Organisatoriske", title: "Læring fra informasjonssikkerhetshendelser", description: "Læring fra hendelser brukes til å forbedre kontroller." },
  { ref: "A.5.28", theme: "Organisatoriske", title: "Innsamling av bevis", description: "Bevis samles, bevares og presenteres iht. juridiske krav." },
  { ref: "A.5.29", theme: "Organisatoriske", title: "Informasjonssikkerhet under forstyrrelser", description: "Sikkerhetskontroller fungerer ved forstyrrelser og krise." },
  { ref: "A.5.30", theme: "Organisatoriske", title: "ICT-beredskap for forretningskontinuitet", description: "ICT-beredskapsplaner testes regelmessig.", automation_signal: "uptime-sla" },
  { ref: "A.5.31", theme: "Organisatoriske", title: "Lovkrav, regulatoriske og kontraktuelle krav", description: "Alle relevante juridiske og regulatoriske krav identifisert og fulgt." },
  { ref: "A.5.32", theme: "Organisatoriske", title: "Immaterielle rettigheter", description: "Bruk av tredjeparts opphavsrett er regulert og dokumentert." },
  { ref: "A.5.33", theme: "Organisatoriske", title: "Beskyttelse av poster", description: "Poster beskyttes mot tap, ødeleggelse, forfalskning og uautorisert tilgang." },
  { ref: "A.5.34", theme: "Organisatoriske", title: "Personvern og beskyttelse av personopplysninger", description: "Personopplysninger behandles iht. GDPR/personvernforordningen." },
  { ref: "A.5.35", theme: "Organisatoriske", title: "Uavhengig gjennomgang av informasjonssikkerhet", description: "Uavhengig gjennomgang av sikkerhetstilstand utføres regelmessig." },
  { ref: "A.5.36", theme: "Organisatoriske", title: "Etterlevelse av policyer, regler og standarder", description: "Etterlevelse av interne policyer overvåkes og rapporteres.", automation_signal: "audit-findings" },
  { ref: "A.5.37", theme: "Organisatoriske", title: "Dokumenterte driftsprosedyrer", description: "Driftsprosedyrer dokumentert og holdt oppdatert." },

  // A.6 Personellkontroller (8)
  { ref: "A.6.1", theme: "Personell", title: "Bakgrunnssjekk", description: "Bakgrunnssjekk av ansatte iht. lov og klassifiseringskrav." },
  { ref: "A.6.2", theme: "Personell", title: "Ansettelsesvilkår", description: "Ansettelsesavtaler inneholder sikkerhetsforpliktelser." },
  { ref: "A.6.3", theme: "Personell", title: "Bevisstgjøring, utdanning og opplæring innen informasjonssikkerhet", description: "Alle ansatte gjennomfører årlig sikkerhetsopplæring." },
  { ref: "A.6.4", theme: "Personell", title: "Disiplinærprosess", description: "Disiplinærprosess for sikkerhetsbrudd er definert og kommunisert." },
  { ref: "A.6.5", theme: "Personell", title: "Ansvar etter ansettelsens slutt eller endring", description: "Sikkerhetsforpliktelser fortsetter etter ansettelse." },
  { ref: "A.6.6", theme: "Personell", title: "Konfidensialitets- eller taushetsavtaler", description: "Taushetsavtaler signert av alle med tilgang til konfidensiell informasjon." },
  { ref: "A.6.7", theme: "Personell", title: "Fjernarbeid", description: "Fjernarbeid styres iht. sikkerhetskrav." },
  { ref: "A.6.8", theme: "Personell", title: "Rapportering av informasjonssikkerhetshendelser", description: "Klar kanal for å rapportere hendelser tilgjengelig for alle." },

  // A.7 Fysiske kontroller (14)
  { ref: "A.7.1", theme: "Fysiske", title: "Fysiske sikkerhetsgrenser", description: "Fysiske grenser definert og beskytter sensitive områder." },
  { ref: "A.7.2", theme: "Fysiske", title: "Fysisk inngang", description: "Adgangskontroll på inngang til sikrede områder." },
  { ref: "A.7.3", theme: "Fysiske", title: "Sikring av kontorer, rom og fasiliteter", description: "Fysisk sikkerhet for kontor- og driftsfasiliteter." },
  { ref: "A.7.4", theme: "Fysiske", title: "Fysisk sikkerhetsovervåkning", description: "Sikrede områder overvåkes kontinuerlig." },
  { ref: "A.7.5", theme: "Fysiske", title: "Beskyttelse mot fysiske og miljømessige trusler", description: "Beskyttelse mot brann, flom, jordskjelv, eksplosjon, sivil uro." },
  { ref: "A.7.6", theme: "Fysiske", title: "Arbeid i sikrede områder", description: "Prosedyrer for arbeid i sikrede områder definert." },
  { ref: "A.7.7", theme: "Fysiske", title: "Rent skrivebord og ren skjerm", description: "Policy for rent skrivebord og lås av skjerm håndhevet." },
  { ref: "A.7.8", theme: "Fysiske", title: "Plassering og beskyttelse av utstyr", description: "Utstyr plassert for å redusere risiko og uautorisert tilgang." },
  { ref: "A.7.9", theme: "Fysiske", title: "Sikkerhet av aktiva utenfor lokaler", description: "Aktiva utenfor lokaler beskyttes." },
  { ref: "A.7.10", theme: "Fysiske", title: "Lagringsmedier", description: "Lagringsmedier styres og avhendes sikkert." },
  { ref: "A.7.11", theme: "Fysiske", title: "Støttetjenester", description: "Strøm, kjøling og kommunikasjon støttes med redundans." },
  { ref: "A.7.12", theme: "Fysiske", title: "Kabelsikkerhet", description: "Strøm- og kommunikasjonskabler beskyttes mot avlytting og skade." },
  { ref: "A.7.13", theme: "Fysiske", title: "Vedlikehold av utstyr", description: "Utstyr vedlikeholdes for å sikre kontinuerlig drift." },
  { ref: "A.7.14", theme: "Fysiske", title: "Sikker avhending eller gjenbruk av utstyr", description: "Utstyr som inneholder data avhendes eller gjenbrukes sikkert." },

  // A.8 Teknologiske kontroller (34)
  { ref: "A.8.1", theme: "Teknologiske", title: "Brukerendeenhetsenheter", description: "Brukerendeenheter sikres iht. policy." },
  { ref: "A.8.2", theme: "Teknologiske", title: "Privilegerte tilgangsrettigheter", description: "Privilegert tilgang er begrenset, logget og revideres." },
  { ref: "A.8.3", theme: "Teknologiske", title: "Begrensning av informasjonstilgang", description: "Tilgang til informasjon begrenset iht. tilgangskontrollpolicy." },
  { ref: "A.8.4", theme: "Teknologiske", title: "Tilgang til kildekode", description: "Tilgang til kildekode er begrenset og logget." },
  { ref: "A.8.5", theme: "Teknologiske", title: "Sikker autentisering", description: "MFA pålagt for alle privilegerte og administrative tilganger." },
  { ref: "A.8.6", theme: "Teknologiske", title: "Kapasitetsstyring", description: "Kapasitet overvåkes og justeres iht. forretningskrav." },
  { ref: "A.8.7", theme: "Teknologiske", title: "Beskyttelse mot ondsinnet programvare", description: "Anti-malware aktivt og oppdatert på alle endepunkter." },
  { ref: "A.8.8", theme: "Teknologiske", title: "Håndtering av tekniske sårbarheter", description: "Sårbarheter identifiseres, prioriteres og lukkes iht. SLA.", automation_signal: "audit-findings" },
  { ref: "A.8.9", theme: "Teknologiske", title: "Konfigurasjonsstyring", description: "Sikre konfigurasjoner definert og håndhevet." },
  { ref: "A.8.10", theme: "Teknologiske", title: "Sletting av informasjon", description: "Informasjon slettes når den ikke lenger er nødvendig." },
  { ref: "A.8.11", theme: "Teknologiske", title: "Datamaskering", description: "Personopplysninger maskeres i ikke-produksjonsmiljøer." },
  { ref: "A.8.12", theme: "Teknologiske", title: "Forebygging av datalekkasje", description: "Tekniske kontroller mot datalekkasje implementert." },
  { ref: "A.8.13", theme: "Teknologiske", title: "Sikkerhetskopiering av informasjon", description: "Regelmessige sikkerhetskopier tas, testes og lagres sikkert." },
  { ref: "A.8.14", theme: "Teknologiske", title: "Redundans i informasjonsbehandlingsfasiliteter", description: "Kritiske systemer har redundans for å oppfylle tilgjengelighetskrav.", automation_signal: "uptime-sla" },
  { ref: "A.8.15", theme: "Teknologiske", title: "Logging", description: "Hendelseslogger samles, beskyttes og oppbevares." },
  { ref: "A.8.16", theme: "Teknologiske", title: "Overvåkingsaktiviteter", description: "Nettverk og systemer overvåkes for uvanlig aktivitet.", automation_signal: "audit-findings" },
  { ref: "A.8.17", theme: "Teknologiske", title: "Klokkesynkronisering", description: "Systemklokker synkronisert mot autoritativ tidskilde." },
  { ref: "A.8.18", theme: "Teknologiske", title: "Bruk av privilegerte hjelpeprogrammer", description: "Bruk av privilegerte verktøy er begrenset og logget." },
  { ref: "A.8.19", theme: "Teknologiske", title: "Installasjon av programvare på driftssystemer", description: "Kun godkjent programvare installeres på produksjonssystemer." },
  { ref: "A.8.20", theme: "Teknologiske", title: "Nettverkssikkerhet", description: "Nettverk segmenteres og beskyttes iht. risiko." },
  { ref: "A.8.21", theme: "Teknologiske", title: "Sikkerhet av nettverkstjenester", description: "Sikkerhetsfunksjoner i nettverkstjenester avtalt og overvåket." },
  { ref: "A.8.22", theme: "Teknologiske", title: "Segregering i nettverk", description: "Nettverk segregeres etter sikkerhetsdomener." },
  { ref: "A.8.23", theme: "Teknologiske", title: "Webfiltrering", description: "Tilgang til ekstern web filtreres for å hindre malware og dataeksfiltrering." },
  { ref: "A.8.24", theme: "Teknologiske", title: "Bruk av kryptografi", description: "Kryptografi brukes iht. policy; nøkler styres sikkert.", automation_signal: "tls-expiry" },
  { ref: "A.8.25", theme: "Teknologiske", title: "Sikker utviklingslivssyklus", description: "Sikkerhet integrert i hele utviklingslivssyklusen." },
  { ref: "A.8.26", theme: "Teknologiske", title: "Sikkerhetskrav for applikasjoner", description: "Applikasjonskrav inkluderer sikkerhetskrav." },
  { ref: "A.8.27", theme: "Teknologiske", title: "Sikker systemarkitektur og utviklingsprinsipper", description: "Sikkerhet-by-design prinsipper anvendes." },
  { ref: "A.8.28", theme: "Teknologiske", title: "Sikker koding", description: "Utviklere følger sikre kodepraksiser." },
  { ref: "A.8.29", theme: "Teknologiske", title: "Sikkerhetstesting under utvikling og aksept", description: "Sikkerhetstesting utføres før produksjonssetting." },
  { ref: "A.8.30", theme: "Teknologiske", title: "Outsourcet utvikling", description: "Outsourcet utvikling overvåkes for sikkerhet." },
  { ref: "A.8.31", theme: "Teknologiske", title: "Adskillelse av miljøer", description: "Utvikling, test og produksjonsmiljøer er adskilt." },
  { ref: "A.8.32", theme: "Teknologiske", title: "Endringsstyring", description: "Endringer styres formelt med review og godkjenning.", automation_signal: "git-changes" },
  { ref: "A.8.33", theme: "Teknologiske", title: "Testinformasjon", description: "Testdata velges, beskyttes og styres." },
  { ref: "A.8.34", theme: "Teknologiske", title: "Beskyttelse av informasjonssystemer under revisjonstesting", description: "Revisjonstesting planlegges for å minimere driftsforstyrrelse." },
];

// SOC 2 Common Criteria — 33 controls across 9 categories.
const SOC2_CONTROLS: Seed[] = [
  // CC1 Control Environment
  { ref: "CC1.1", theme: "Kontrollmiljø", title: "COSO-prinsipp 1 — Integritet og etiske verdier", description: "Organisasjonen demonstrerer forpliktelse til integritet og etiske verdier." },
  { ref: "CC1.2", theme: "Kontrollmiljø", title: "COSO-prinsipp 2 — Styreoppsyn", description: "Styret utøver oppsyn med utvikling og ytelse av internkontroll." },
  { ref: "CC1.3", theme: "Kontrollmiljø", title: "COSO-prinsipp 3 — Struktur og myndighet", description: "Ledelsen etablerer struktur, rapporteringslinjer og myndighet." },
  { ref: "CC1.4", theme: "Kontrollmiljø", title: "COSO-prinsipp 4 — Kompetanse", description: "Organisasjonen tiltrekker, utvikler og beholder kompetente personer." },
  { ref: "CC1.5", theme: "Kontrollmiljø", title: "COSO-prinsipp 5 — Ansvarlighet", description: "Individer holdes ansvarlige for internkontrollansvar." },

  // CC2 Communication and Information
  { ref: "CC2.1", theme: "Kommunikasjon", title: "Informasjonskvalitet", description: "Relevant, kvalitetssikret informasjon brukes for internkontroll." },
  { ref: "CC2.2", theme: "Kommunikasjon", title: "Intern kommunikasjon", description: "Internt kommuniseres mål, ansvar og internkontroll." },
  { ref: "CC2.3", theme: "Kommunikasjon", title: "Ekstern kommunikasjon", description: "Kommunikasjon med eksterne parter støtter internkontroll." },

  // CC3 Risk Assessment
  { ref: "CC3.1", theme: "Risikovurdering", title: "Mål spesifiseres", description: "Mål spesifiseres for å muliggjøre identifisering og vurdering av risiko." },
  { ref: "CC3.2", theme: "Risikovurdering", title: "Risiko identifiseres og analyseres", description: "Organisasjonen identifiserer risiko mot målene og analyserer dem." },
  { ref: "CC3.3", theme: "Risikovurdering", title: "Vurdering av svindel", description: "Potensial for svindel vurderes ved evaluering av risiko." },
  { ref: "CC3.4", theme: "Risikovurdering", title: "Endringer som påvirker internkontroll", description: "Endringer som kan påvirke internkontrollsystemet identifiseres og vurderes." },

  // CC4 Monitoring Activities
  { ref: "CC4.1", theme: "Overvåking", title: "Løpende og separate vurderinger", description: "Pågående og/eller separate evalueringer bestemmer om internkontroll fungerer.", automation_signal: "audit-findings" },
  { ref: "CC4.2", theme: "Overvåking", title: "Kommunikasjon av svakheter", description: "Svakheter i internkontroll vurderes og kommuniseres til ansvarlige parter." },

  // CC5 Control Activities
  { ref: "CC5.1", theme: "Kontrollaktiviteter", title: "Valg og utvikling av kontrollaktiviteter", description: "Kontrollaktiviteter velges for å redusere risiko mot akseptabelt nivå." },
  { ref: "CC5.2", theme: "Kontrollaktiviteter", title: "Teknologi-baserte kontroller", description: "Teknologi-generelle kontroller for å støtte måloppnåelse." },
  { ref: "CC5.3", theme: "Kontrollaktiviteter", title: "Kontrollaktiviteter implementeres via policy", description: "Kontrollaktiviteter utrulles gjennom policyer og prosedyrer." },

  // CC6 Logical and Physical Access Controls
  { ref: "CC6.1", theme: "Tilgangskontroll", title: "Logisk tilgangssikkerhet", description: "Logiske tilgangssikkerhetskontroller beskytter informasjon mot uautorisert tilgang." },
  { ref: "CC6.2", theme: "Tilgangskontroll", title: "Registrering og autorisering av brukere", description: "Brukerregistrering og autoritetsendringer kontrolleres." },
  { ref: "CC6.3", theme: "Tilgangskontroll", title: "Periodisk gjennomgang av tilgang", description: "Tilgang gjennomgås periodisk for fortsatt relevans." },
  { ref: "CC6.4", theme: "Tilgangskontroll", title: "Fysisk tilgangskontroll", description: "Fysisk tilgang til fasiliteter er begrenset." },
  { ref: "CC6.5", theme: "Tilgangskontroll", title: "Sletting/inaktivering av tilganger", description: "Tilganger fjernes ved opphør av ansettelse eller avtale." },
  { ref: "CC6.6", theme: "Tilgangskontroll", title: "Logiske tilgangssikkerhetstiltak ved overføring", description: "Logiske tilganger beskyttes utenfor systemgrenser.", automation_signal: "tls-expiry" },
  { ref: "CC6.7", theme: "Tilgangskontroll", title: "Begrensning av flyttbare medier", description: "Bruk av flyttbare medier begrenset." },
  { ref: "CC6.8", theme: "Tilgangskontroll", title: "Konfigurasjons- og endringskontroller for malware", description: "Tiltak for å forhindre, oppdage og handle på malware.", automation_signal: "audit-findings" },

  // CC7 System Operations
  { ref: "CC7.1", theme: "Systemoperasjoner", title: "Endringsdeteksjon", description: "Avvik fra konfigurasjon detekteres." },
  { ref: "CC7.2", theme: "Systemoperasjoner", title: "Overvåking av systemkomponenter", description: "Systemkomponenter overvåkes for å oppdage anomalier.", automation_signal: "uptime-sla" },
  { ref: "CC7.3", theme: "Systemoperasjoner", title: "Hendelsesevaluering", description: "Sikkerhetshendelser evalueres for å avgjøre om de utgjør sikkerhetsbrudd.", automation_signal: "alerts-mttr" },
  { ref: "CC7.4", theme: "Systemoperasjoner", title: "Respons på sikkerhetshendelser", description: "Sikkerhetshendelser møtes med ansvar, kommunikasjon og oppfølging." },
  { ref: "CC7.5", theme: "Systemoperasjoner", title: "Gjenoppretting fra sikkerhetshendelser", description: "Organisasjonen identifiserer, utvikler og implementerer aktiviteter for å gjenopprette etter hendelser." },

  // CC8 Change Management
  { ref: "CC8.1", theme: "Endringsstyring", title: "Endringsstyringsprosess", description: "Endringer på infrastruktur, programvare og prosedyrer er autorisert, designet, testet, godkjent og implementert.", automation_signal: "git-changes" },

  // CC9 Risk Mitigation
  { ref: "CC9.1", theme: "Risikoreduksjon", title: "Risikoreduksjonsaktiviteter", description: "Risikoreduserende aktiviteter er identifisert og implementert." },
  { ref: "CC9.2", theme: "Risikoreduksjon", title: "Risiko fra forretningspartnere", description: "Risiko fra forretningspartnere er vurdert og styrt." },
];

// GDPR core — register the foundational obligations as controls so the
// portal can show GDPR posture alongside the security frameworks.
const GDPR_CONTROLS: Seed[] = [
  { ref: "GDPR-Art-5", theme: "Personvernprinsipper", title: "Prinsipper for behandling", description: "Lovlighet, åpenhet, formålsbegrensning, dataminimering, riktighet, lagringsbegrensning, integritet og konfidensialitet." },
  { ref: "GDPR-Art-6", theme: "Personvernprinsipper", title: "Lovlig behandling", description: "Behandling av personopplysninger har et lovlig grunnlag etter art. 6." },
  { ref: "GDPR-Art-13", theme: "De registrertes rettigheter", title: "Informasjon ved innsamling", description: "Registrerte informeres ved innsamling av personopplysninger." },
  { ref: "GDPR-Art-15", theme: "De registrertes rettigheter", title: "Innsynsrett", description: "Registrerte kan kreve innsyn i egne personopplysninger." },
  { ref: "GDPR-Art-17", theme: "De registrertes rettigheter", title: "Rett til sletting", description: "Registrerte kan kreve sletting av egne personopplysninger." },
  { ref: "GDPR-Art-25", theme: "Innebygd personvern", title: "Innebygd og standardinnstilt personvern", description: "Personvern er innebygd og standardinnstilling i alle systemer." },
  { ref: "GDPR-Art-28", theme: "Databehandlere", title: "Databehandleravtale", description: "Skriftlig databehandleravtale med alle leverandører som behandler personopplysninger." },
  { ref: "GDPR-Art-30", theme: "Dokumentasjon", title: "Protokoll over behandlingsaktiviteter (RoPA)", description: "Skriftlig protokoll over alle behandlingsaktiviteter holdes oppdatert." },
  { ref: "GDPR-Art-32", theme: "Sikkerhet", title: "Sikkerhet ved behandlingen", description: "Egnede tekniske og organisatoriske tiltak for å sikre risikoadekvat sikkerhetsnivå.", automation_signal: "tls-expiry" },
  { ref: "GDPR-Art-33", theme: "Brudd", title: "Melding om brudd til tilsynsmyndigheten", description: "Brudd på personopplysningssikkerhet meldes til Datatilsynet innen 72 timer." },
  { ref: "GDPR-Art-34", theme: "Brudd", title: "Melding om brudd til registrerte", description: "Registrerte informeres ved brudd med høy risiko for deres rettigheter." },
  { ref: "GDPR-Art-35", theme: "Risikovurdering", title: "Vurdering av personvernkonsekvenser (DPIA)", description: "DPIA gjennomføres ved høyrisikobehandling." },
];

export const upsertAll = mutation({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    const now = ISO();
    const stats = { inserted: 0, updated: 0, total: 0 };

    const upsert = async (framework: string, list: Seed[]) => {
      for (const c of list) {
        const existing = await ctx.db
          .query("compliance_controls")
          .withIndex("by_framework_ref", (q) =>
            q.eq("framework", framework).eq("ref", c.ref),
          )
          .first();

        const payload = {
          framework,
          ref: c.ref,
          theme: c.theme,
          title: c.title,
          description: c.description,
          automation_signal: c.automation_signal ?? null,
          updated_at: now,
        };

        if (existing) {
          await ctx.db.patch(existing._id, payload);
          stats.updated += 1;
        } else {
          await ctx.db.insert("compliance_controls", {
            ...payload,
            status: "planned",
            owner: "ibrahim@xala.no",
            last_reviewed_at: null,
            next_review_at: null,
            notes: "",
            created_at: now,
          });
          stats.inserted += 1;
        }
        stats.total += 1;
      }
    };

    await upsert("iso27001", ISO_CONTROLS);
    await upsert("soc2", SOC2_CONTROLS);
    await upsert("gdpr", GDPR_CONTROLS);

    return stats;
  },
});
