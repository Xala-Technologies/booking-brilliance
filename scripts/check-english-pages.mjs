// Is the English site actually English?
//
// "100% confidence" has to be a number something else computes, not a claim.
// This walks every prerendered /en page, strips markup, and reports any text
// run containing Norwegian function words.
//
// It reads dist/, which is what a crawler gets first. It cannot see the
// post-hydration DOM — the tab title reverting to Norwegian was invisible to
// exactly this kind of check — so a clean run here is necessary, not
// sufficient. The browser sweep is the other half.
import { promises as fs } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
// Function words that exist ONLY in Norwegian. "for" was in this list and is
// an ordinary English word — it made every English sentence a false positive
// and the count meaningless. A check nobody trusts gets ignored.
const NB =
  /(^|[^\p{L}])(og|ikke|dere|våre|hvordan|utleie|lokaler|å|som|med|til|på|av|vi|du|den|det|er|har|kan|alle|finn|snakk|les|hva|når|hvor)([^\p{L}]|$)/iu;

/**
 * Names that collide with a Norwegian function word.
 *
 * The NB pattern is case-insensitive, so "AV equipment" matched "av", and
 * "Finn" — Norway's classifieds site, named in English copy as a brand —
 * matched the verb "finn". Both flagged fully English sentences.
 *
 * Stripped before the test rather than removed from NB, and matched
 * case-SENSITIVELY: lowercase "av" and "finn" are real, common Norwegian
 * words, and dropping them from the list would blind the check to actual
 * Norwegian prose. Only the capitalised forms are names.
 */
const ACRONYMS = /\b(AV|Finn)\b/g;

/**
 * Roman numerals used as section markers: "I. SECURITY", "VI. QUESTIONS".
 *
 * "VI" matches the Norwegian "vi" (we) and "I" matches the Norwegian "i"
 * (in), both case-insensitively, so an English section label was reported as
 * untranslated. Anchored on the trailing period, which is what makes it a
 * numeral rather than a word — a bare uppercase I or VI in prose is still
 * checked.
 */
const NUMERALS = /\b[IVX]+\.\s/g;

const ALLOW = [
  /^[A-ZÆØÅ][a-zæøå]+(\s[A-ZÆØÅ][a-zæøå]+)*$/u, // proper nouns
  /^(Vipps|BankID|ID-porten|EHF|Peppol|Digilist|Newsreader|Inter|Oslo|Norge)/i,
];

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name === "index.html") out.push(p);
  }
  return out;
}

function textRuns(html) {
  const stripped = html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  return stripped
    .split(/<[^>]+>/)
    .map((s) => s.replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 3 && s.length < 300);
}

const files = await walk(join(DIST, "en")).catch(() => []);
if (!files.length) {
  console.log("check-english: no dist/en — run pnpm build first");
  process.exit(0);
}

let total = 0;
const report = [];
for (const f of files) {
  const html = await fs.readFile(f, "utf-8");
  const bad = [...new Set(
    textRuns(html).filter(
      (t) => NB.test(t.replace(ACRONYMS, " ").replace(NUMERALS, " ")) && !ALLOW.some((re) => re.test(t)),
    ),
  )];
  if (bad.length) {
    total += bad.length;
    report.push({ page: f.replace(`${DIST}`, "").replace("/index.html", "") || "/", count: bad.length, samples: bad.slice(0, 4) });
  }
}

report.sort((a, b) => b.count - a.count);
console.log(`check-english: ${files.length} English page(s), ${total} Norwegian run(s) across ${report.length}\n`);
for (const r of report.slice(0, 25)) {
  console.log(`  ${String(r.count).padStart(4)}  ${r.page}`);
  for (const s of r.samples) console.log(`        · ${s.slice(0, 100)}`);
}
if (process.env.CHECK_ENGLISH_STRICT === "1" && total > 0) process.exit(1);
