import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { retrieve, buildLLMContext } from "./rag";
import { MAX_SYSTEM_CHARS, SYSTEM_BUDGET } from "./limits";
import { allFAQEntries } from "@/content/faq";
import type { SearchItem } from "@/lib/search/corpus";

/**
 * The prompt must fit through the endpoint that receives it.
 *
 * Two programs, one number. The browser builds the system prompt; a plain-Node
 * server rejects it with 413 past a length the browser could not see. The
 * prompt grew past that ceiling and the endpoint started refusing the most
 * common questions on the site — every pricing topic among them — while the
 * assistant quietly answered from the FAQ instead.
 */
const SERVER = readFileSync("server/index.mjs", "utf8");

/** Page suggestions as this site actually produces them: long, SEO-written. */
const LONG_PAGES: SearchItem[] = Array.from({ length: 6 }, (_, i) => ({
  title: `Leie selskapslokale i Oslo — slik finner du riktig lokale til bryllup ${i}`,
  subtitle: "Sanntidskalender, ekte priser og direkte booking uten forespørsler og venting",
  href: `/blogg/leie-selskapslokale-oslo-bryllup-guide-${i}`,
})) as SearchItem[];

describe("system prompt fits the endpoint", () => {
  it("the server enforces the same number the client budgets against", () => {
    // The server cannot import the constant, so it holds a copy. This is the
    // only thing stopping the two from drifting apart again.
    const declared = /const MAX_SYSTEM_CHARS = (\d+);/.exec(SERVER)?.[1];
    expect(declared, "server/index.mjs must declare MAX_SYSTEM_CHARS").toBeDefined();
    expect(Number(declared)).toBe(MAX_SYSTEM_CHARS);
  });

  it("the server checks system length against that constant", () => {
    expect(SERVER).toContain("body.system.length > MAX_SYSTEM_CHARS");
  });

  it("no FAQ topic can build a prompt the server would reject", () => {
    const over: string[] = [];
    for (const { q } of allFAQEntries()) {
      const system = buildLLMContext(q, retrieve(q, 3, "nb"), [], LONG_PAGES, "nb").system;
      if (system.length > MAX_SYSTEM_CHARS) over.push(`${q} (${system.length})`);
    }
    expect(over, `these would 413:\n  ${over.join("\n  ")}`).toEqual([]);
  });

  it("trims itself to the budget rather than being rejected", () => {
    // The budget sits below the ceiling on purpose: a prompt 200 characters
    // over is not degraded, it is refused outright.
    const worst = allFAQEntries()
      .map(({ q }) => buildLLMContext(q, retrieve(q, 3, "nb"), [], LONG_PAGES, "nb").system.length)
      .sort((a, b) => b - a)[0];
    expect(worst).toBeLessThanOrEqual(SYSTEM_BUDGET);
  });

  it("keeps the grounding sources even when it drops page suggestions", () => {
    // Trimming must never cost the model the answer it is meant to quote.
    const q = "Hva koster Digilist?";
    const hits = retrieve(q, 3, "nb");
    const system = buildLLMContext(q, hits, [], LONG_PAGES, "nb").system;
    expect(system).toContain(hits[0].a.slice(0, 60));
  });
});
