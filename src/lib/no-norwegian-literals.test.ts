import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * No Norwegian in a user-visible JSX ATTRIBUTE of a bilingual component.
 *
 * This exists because `check:english` has two blind spots, and both were
 * found the hard way:
 *
 * 1. It reads `dist/`, so it cannot see anything that renders from data.
 *    /transparens fetches its content, and the checker reported 26/0 while
 *    the live page carried 22 Norwegian strings across two render stages.
 * 2. It reads TEXT NODES, so `aria-label`, `placeholder`, `alt` and `title`
 *    are invisible to it — which means a screen-reader user on the English
 *    site could be hearing Norwegian while every check passed.
 *
 * Attributes are the right thing to check in source: they are single-valued,
 * so unlike a paired NB/EN array there is no legitimate reason for one to
 * hold Norwegian in a file that has declared itself bilingual.
 */
const NB_WORD =
  /(^|[^\p{L}])(og|ikke|som|til|på|av|vi|du|den|det|har|kan|når|hvor|dine|våre|eller|slik|uten|med|blir|skal|gå|søk|spør)([^\p{L}]|$)/iu;

/** Capitalised names that collide with a Norwegian word, matched case-sensitively. */
const NAMES = /\b(AV|Finn|Digilist|Vipps|BankID)\b/g;

/** Attributes a visitor sees or a screen reader speaks. */
const VISIBLE_ATTRS =
  /\b(aria-label|ariaLabel|placeholder|alt|title|label|caption|sub|eyebrow|body|desc)="([^"\n]{8,})"/g;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return sourceFiles(p);
    return /\.tsx$/.test(e.name) && !e.name.includes(".test.") ? [p] : [];
  });
}

describe("bilingual components hold no Norwegian in visible attributes", () => {
  const files = [...sourceFiles("src/components"), ...sourceFiles("src/pages")];

  for (const file of files) {
    const src = readFileSync(file, "utf8");
    if (!src.includes('from "@/lib/copy"')) continue;

    it(`${file}`, () => {
      // Comment lines quoting a Norwegian heading are documentation.
      const code = src
        .split("\n")
        .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
        .join("\n");
      const offenders = [...code.matchAll(VISIBLE_ATTRS)]
        .map((m) => `${m[1]}="${m[2]}"`)
        .filter((s) => NB_WORD.test(s.replace(NAMES, " ")));
      expect(
        offenders,
        `Norwegian in a visible attribute — route through t():\n  ${offenders.join("\n  ")}`,
      ).toEqual([]);
    });
  }
});
