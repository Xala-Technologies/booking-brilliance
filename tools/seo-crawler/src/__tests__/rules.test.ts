import { describe, it, expect } from "vitest";
import { evaluatePage, evaluateSite, score } from "../rules";
import type { PageSnapshot } from "../parse";

function snap(over: Partial<PageSnapshot> = {}): PageSnapshot {
  return {
    url: "https://digilist.no/",
    status: 200,
    loadMs: 200,
    title: "Digilist — kommunal booking",
    titleLength: 0,
    description:
      "Norsk SaaS-plattform for booking, betaling og sesongleie. Bygget for norske kommuner.",
    descriptionLength: 0,
    canonical: "https://digilist.no/",
    h1: ["Heading"],
    h2: [],
    ogTitle: "Digilist",
    ogDescription: "X",
    ogImage: "https://digilist.no/og.png",
    twitterCard: "summary",
    robotsMeta: null,
    langAttr: "nb",
    internalLinks: [],
    externalLinks: [],
    imagesMissingAlt: 0,
    imagesTotal: 0,
    jsonLdTypes: ["Organization"],
    wordCount: 800,
    htmlSize: 1234,
    ...over,
  };
}

// Sync the derived lengths with the strings we just supplied
function withLengths(s: PageSnapshot): PageSnapshot {
  return {
    ...s,
    titleLength: s.title?.length ?? 0,
    descriptionLength: s.description?.length ?? 0,
  };
}

describe("evaluatePage", () => {
  it("flags non-200 status and stops", () => {
    const f = evaluatePage(withLengths(snap({ status: 404 })));
    expect(f.map((x) => x.rule)).toContain("status");
    expect(f).toHaveLength(1); // bails early
  });

  it("flags missing title", () => {
    const f = evaluatePage(withLengths(snap({ title: null })));
    expect(f.find((x) => x.rule === "title.missing")?.severity).toBe("error");
  });

  it("flags too-short title", () => {
    const f = evaluatePage(withLengths(snap({ title: "Hei" })));
    expect(f.find((x) => x.rule === "title.short")).toBeDefined();
  });

  it("flags missing H1", () => {
    const f = evaluatePage(withLengths(snap({ h1: [] })));
    expect(f.find((x) => x.rule === "h1.missing")?.severity).toBe("error");
  });

  it("flags multiple H1", () => {
    const f = evaluatePage(withLengths(snap({ h1: ["A", "B"] })));
    expect(f.find((x) => x.rule === "h1.multiple")?.severity).toBe("warn");
  });

  it("flags missing structured data", () => {
    const f = evaluatePage(withLengths(snap({ jsonLdTypes: [] })));
    expect(f.find((x) => x.rule === "structured.missing")).toBeDefined();
  });

  it("flags thin content", () => {
    const f = evaluatePage(withLengths(snap({ wordCount: 30 })));
    expect(f.find((x) => x.rule === "content.thin")).toBeDefined();
  });

  it("flags missing alt on >3 images as error", () => {
    const f = evaluatePage(
      withLengths(snap({ imagesTotal: 10, imagesMissingAlt: 5 })),
    );
    const r = f.find((x) => x.rule === "image.alt");
    expect(r?.severity).toBe("error");
  });

  it("scores a clean page at 100", () => {
    const f = evaluatePage(withLengths(snap()));
    expect(score(f)).toBe(100);
  });
});

describe("evaluateSite", () => {
  it("flags duplicate titles across pages", () => {
    const a = withLengths(snap({ url: "https://digilist.no/a", title: "Same" }));
    const b = withLengths(snap({ url: "https://digilist.no/b", title: "Same" }));
    const f = evaluateSite([a, b]);
    expect(f.filter((x) => x.rule === "title.duplicate")).toHaveLength(2);
  });

  it("detects broken internal links to other crawled pages", () => {
    const a = withLengths(
      snap({
        url: "https://digilist.no/a",
        internalLinks: ["https://digilist.no/missing"],
      }),
    );
    const b = withLengths(
      snap({ url: "https://digilist.no/missing", status: 404 }),
    );
    const f = evaluateSite([a, b]);
    expect(f.find((x) => x.rule === "link.broken")?.url).toBe(
      "https://digilist.no/a",
    );
  });
});

describe("score", () => {
  it("subtracts severity weights from 100", () => {
    expect(score([])).toBe(100);
    expect(
      score([{ url: "x", rule: "r", severity: "error", message: "" }]),
    ).toBe(82);
    expect(
      score([
        { url: "x", rule: "r", severity: "warn", message: "" },
        { url: "x", rule: "r", severity: "warn", message: "" },
      ]),
    ).toBe(88);
  });

  it("floors at zero", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      url: `x${i}`,
      rule: "r",
      severity: "error" as const,
      message: "",
    }));
    expect(score(many)).toBe(0);
  });
});
