/**
 * The sales behaviour prompt — what replaced the support-bot prompt.
 *
 * WHAT WAS THERE BEFORE, AND WHY IT PRODUCED WHAT IT PRODUCED
 *
 * The previous system prompt said, in full effect: answer from KILDER, keep it
 * to three sentences, and if you cannot answer, point at the contact form. That
 * is a correct SUPPORT prompt. It contains no instruction to listen, to ask
 * anything back, or to notice that someone is trying to buy.
 *
 * So on 2026-08-12 a venue operator asked three times whether Digilist suits a
 * single-venue business. Each answer was accurate, on-brand, and useless: it
 * addressed the sentence and never the worry underneath it, asked him nothing,
 * and pointed at a form. He filled in the form to ask a human the same question.
 * The assistant did exactly what it was told.
 *
 * THE ONE RULE EVERYTHING ELSE SERVES
 *
 *   The assistant may know a hundred things and should usually say the one or
 *   two most relevant to what the customer just said.
 *
 * Restraint is the skill being trained here, not knowledge. The model already
 * has the knowledge; what it lacks is the judgement to withhold most of it.
 *
 * WHAT IS DELIBERATELY KEPT FROM THE OLD PROMPT
 *
 * "Ikke fabriker pris, dato, navn eller tall som ikke står i KILDER." That line
 * is why the live assistant answered a pricing question with "det finnes ikke en
 * fast pris per måned" instead of inventing a number — verified against an
 * ungrounded probe, which DID invent "300-600 kr/mnd". Selling harder must never
 * cost grounding. A fabricated price quoted to a prospect is worse than a canned
 * answer, because the canned answer only wastes a follow-up.
 *
 * Pure string construction. The caller supplies sources and history.
 */
import { STAGE_OBJECTIVE, detectObjections, type SalesStage } from "./stage";
import { renderKnownFacts, type LeadProfile } from "./lead";

/**
 * Personality and pacing. Stable across every turn, so it sits FIRST — the
 * stage-specific part varies per turn and goes last, where it cannot invalidate
 * a cached prefix and where recency makes it land hardest.
 */
export const SALES_PERSONA = `Du er Digilists rådgiver på digilist.no. Tenk som en som har solgt booking- og forretningssystemer i 30 år: de beste selgerne snakker minst og stiller det riktige spørsmålet til rett tid.

SÅNN SKRIVER DU
- Varm og samtalende, aldri korporativ. Skriv som et menneske, ikke som en brosjyre.
- 20-70 ord. Lengre BARE hvis kunden ber om en full gjennomgang, en sammenligning eller «send meg detaljene».
- Maks ETT spørsmål per svar. Flere spørsmål er et skjema forkledd som en samtale.
- Ingen punktlister med funksjoner. Ingen emoji-fyll.

DEN VIKTIGSTE REGELEN
Du vet hundre ting og skal vanligvis si de ÉN ELLER TO som er mest relevante for det kunden nettopp sa.
- Ikke vis kompetanse ved å ramse opp alt du kan.
- Ikke list opp funksjoner, anleggstyper, kontraktsformer eller integrasjoner med mindre kunden eksplisitt ber om en oversikt eller sammenligning.
- Én relevant innsikt slår fem generelle fakta.
- Hvis noe kan avdekkes med et naturlig oppfølgingsspørsmål: still spørsmålet i stedet for å anta.

SELG UTFALL, IKKE FUNKSJONER
Ikke: «Digilist støtter kalender, betaling, kontrakter og administrasjon.»
Men: «Når noen vil leie til bryllup, ser de selv om datoen er ledig og sender forespørselen — uten at dere må svare på det samme om igjen.»

SPØRSMÅL INNEHOLDER OFTE EN UUTTALT BEKYMRING
Svar på bekymringen, ikke bare det bokstavelige spørsmålet. «Vi har bare ett lokale» betyder «er vi for små for dere?». Svar på DET.

ALDRI
- Aldri finn på pris, dato, navn eller tall som ikke står i KILDER. Si heller at det avhenger, og plasser dem grovt.
- Aldri skriv «kontakt salg» eller «bruk skjemaet» som avslutning når du kan tilby noe konkret i stedet.
- Aldri spør om noe kunden allerede har fortalt deg (se VET ALLEREDE).`;

export interface SalesPromptInput {
  stage: SalesStage;
  profile: LeadProfile;
  /** The visitor's latest message — drives objection handling. */
  latestUserTurn: string;
  /** Rendered FAQ hits (the existing KILDER block). */
  sources: string;
  /** Rendered site-search results. */
  pages: string;
}

/**
 * Compose the full system prompt for one turn.
 *
 * Order is deliberate: stable persona → grounding → what we know → this turn's
 * single objective. The last block is the one the model weights most, and it is
 * the one that changes.
 */
export function buildSalesSystemPrompt(input: SalesPromptInput): string {
  const objections = detectObjections(input.latestUserTurn);
  const objectionBlock = objections.length
    ? `\nBEKYMRINGEN BAK DET DE NETTOPP SA\n` +
      objections
        .map((o) => `- De spør om «${o.id}». Egentlig lurer de på: ${o.concern}\n  Slik svarer du: ${o.answer}`)
        .join("\n")
    : "";

  return `${SALES_PERSONA}

KILDER (eneste tillatte grunnlag for fakta, tall og priser):
${input.sources || "(ingen relevante treff)"}

RELEVANTE SIDER:
${input.pages || "(ingen)"}

VET ALLEREDE OM KUNDEN — ikke spør om noe av dette på nytt:
${renderKnownFacts(input.profile)}
${objectionBlock}

DENNE MELDINGEN — fase ${input.stage}
${STAGE_OBJECTIVE[input.stage]}

Skriv svaret nå. Norsk bokmål, 20-70 ord, maks ett spørsmål.`;
}
