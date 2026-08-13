import { describe, expect, it } from "vitest";
import { COOKIE_POLICY, type LegalDoc } from "./legal";

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
        ...s.blocks.flatMap((b) => [b.h3, b.body, ...(b.bullets ?? [])]),
      ]),
    ].filter((v): v is string => Boolean(v));

    const shared = strings(doc.en).filter((s) => strings(doc.nb).includes(s));
    expect(shared, `identical in both languages: ${shared.join(" | ")}`).toEqual([]);
  });
});
