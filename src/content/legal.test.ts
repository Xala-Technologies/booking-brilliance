import { describe, expect, it } from "vitest";
import {
  ACCESSIBILITY_STATEMENT,
  COOKIE_POLICY,
  PRIVACY_POLICY,
  TERMS_OF_SALE,
  type LegalDoc,
} from "./legal";

/**
 * The two languages must describe the SAME policy.
 *
 * A legal page is the one place where "the translation drifted" is not a
 * cosmetic bug: if the English cookie policy lists two bullet points where the
 * Norwegian lists three, the site is telling two different audiences different
 * things about what it collects, and the consent collected on the thinner page
 * is worth less than the consent collected on the other.
 *
 * Structure is what a test can check. Whether the sentences mean the same thing
 * is a human's job — this pins that nothing went missing while they read.
 */
const DOCS: Array<[string, { nb: LegalDoc; en: LegalDoc }]> = [
  ["cookie policy", COOKIE_POLICY],
  ["accessibility statement", ACCESSIBILITY_STATEMENT],
  ["privacy policy", PRIVACY_POLICY],
  ["terms of sale", TERMS_OF_SALE],
];

describe.each(DOCS)("%s says the same thing in both languages", (_name, doc) => {
  it("has the same number of sections", () => {
    expect(doc.en.sections.length).toBe(doc.nb.sections.length);
  });

  it("has the same blocks, bullets and headings in each section", () => {
    const shape = (d: LegalDoc) =>
      d.sections.map((s) => ({
        blocks: s.blocks.length,
        h3s: s.blocks.filter((b) => b.h3).length,
        bullets: s.blocks.map((b) => b.bullets?.length ?? 0),
        // A link that exists in one language and not the other means one
        // audience has a route to complain and the other does not.
        links: s.blocks.map((b) => b.link?.href ?? null),
      }));
    expect(shape(doc.en)).toEqual(shape(doc.nb));
  });

  it("has no untranslated string shared between the two", () => {
    // Every visible string differs, so a copy-paste that forgot to translate a
    // paragraph shows up here rather than on the live page.
    const strings = (d: LegalDoc) => [
      d.title,
      d.intro,
      ...d.sections.flatMap((s) => [
        s.h2,
        ...s.blocks.flatMap((b) => [
          b.h3,
          b.body,
          ...(b.bullets ?? []),
          // The prose either side of an inline link is still prose. Leaving it
          // out let a paragraph stay Norwegian in the English document while
          // this test reported parity.
          b.link?.before,
          b.link?.after,
        ]),
      ]),
    ].filter((v): v is string => Boolean(v));

    // Proper nouns that are the same string in both languages BY DESIGN. Kept
    // as an explicit list rather than a looser rule (say, "skip anything
    // capitalised"), because the whole value of this check is that it fails on
    // a paragraph someone forgot to translate — and a broad exemption is how
    // that paragraph would slip through. A registered company name is a legal
    // identifier, not prose; translating it would be the actual error.
    const SHARED_BY_DESIGN = new Set([
      // A registered legal identifier. Translating it would be the error.
      "Xala Technologies AS",
      // The lead-in to an inline link: the brand name and an opening paren.
      "Digilist (",
      // "Force majeure" is the same term of art in Norwegian and English legal
      // drafting, and the clause numbering is shared, so the whole heading
      // matches. Rewording the English to differ would make the term wrong.
      "4.4 Force majeure",
    ]);

    // Punctuation is language-neutral — a lone "." after an inline link is
    // identical in both documents on purpose and is not a missed translation.
    const meaningful = (v: string) => /\p{L}{2,}/u.test(v);
    const shared = strings(doc.en)
      .filter(meaningful)
      .filter((s) => !SHARED_BY_DESIGN.has(s))
      .filter((s) => strings(doc.nb).includes(s));
    expect(shared, `identical in both languages: ${shared.join(" | ")}`).toEqual([]);
  });
});
