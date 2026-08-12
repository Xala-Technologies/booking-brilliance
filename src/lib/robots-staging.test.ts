import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TRANSLATED_PATHS } from "./i18n";

/**
 * robots.txt and TRANSLATED_PATHS have to agree.
 *
 * They are two hand-maintained lists of the same fact — which English pages
 * have English copy — and the failure is silent in both directions. Forget to
 * Allow a page that has been translated and it never gets indexed; forget to
 * Disallow one that has not and Google indexes Norwegian text at an English
 * URL, judged as duplicate content against the page that actually ranks.
 */
describe("robots.txt matches the translated set", () => {
  const robots = readFileSync("public/robots.txt", "utf-8");
  const allowed = new Set(
    [...robots.matchAll(/^Allow:\s*(\/en[^\s$]*)\$?\s*$/gm)].map((m) => m[1]),
  );

  it("disallows the mirrored English tree by default", () => {
    expect(robots).toMatch(/^Disallow:\s*\/en\/\s*$/m);
  });

  it("allows exactly the pages whose English copy exists", () => {
    const expected = new Set(
      [...TRANSLATED_PATHS].map((p) => (p === "/" ? "/en" : `/en${p}`)),
    );
    for (const path of expected) {
      expect(allowed, `${path} is translated but not Allowed in robots.txt`).toContain(path);
    }
    for (const path of allowed) {
      expect(expected, `${path} is Allowed in robots.txt but has no English copy`).toContain(path);
    }
  });
});
