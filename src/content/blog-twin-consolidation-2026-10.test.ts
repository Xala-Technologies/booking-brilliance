import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { POST_FAQ } from "./blogFaq.mjs";

/**
 * 2026-10-13 blog twin consolidation: three pairs of posts were competing for
 * the same query (SEO Researcher brief, 2026-10-13-twin-winners.md). For each
 * pair the loser's unique, still-accurate content was merged into the winner
 * and the loser now 301s to it:
 *
 *   A: hvilket-bookingsystem-bor-en-norsk-kommune-velge → beste-bookingsystem-kommune-norge
 *   B: hvordan-digitalisere-booking-kommunale-lokaler   → hvordan-digitalisere-booking-av-kommunale-lokaler
 *      digitalisere-booking-kommunale-lokaler           → hvordan-digitalisere-booking-av-kommunale-lokaler
 *   C: beste-plattform-private-utleiere-leie-ut-lokalet → beste-plattform-private-utleiere-leie-ut-lokale
 *
 * Cluster B ships the swap flagged in the brief's "Conflicts and flags" #1:
 * av- wins (it carries the only FAQ block and the PR #429 CTR enrichment),
 * not the plain kommunale-lokaler- post the GSC baseline alone would have
 * picked, so the 4 internal links naming the old winner get repointed too.
 */

const BLOG_DIR = join(__dirname, "blog");
const NGINX_CONF = readFileSync(join(__dirname, "..", "..", "server", "nginx.snippet.conf"), "utf-8");
const PRERENDER_SRC = readFileSync(join(__dirname, "..", "..", "scripts", "prerender.mjs"), "utf-8");
const DIST = join(__dirname, "..", "..", "dist");

const REDIRECTS: Array<{ loser: string; winner: string }> = [
  { loser: "hvilket-bookingsystem-bor-en-norsk-kommune-velge", winner: "beste-bookingsystem-kommune-norge" },
  { loser: "hvordan-digitalisere-booking-kommunale-lokaler", winner: "hvordan-digitalisere-booking-av-kommunale-lokaler" },
  { loser: "digitalisere-booking-kommunale-lokaler", winner: "hvordan-digitalisere-booking-av-kommunale-lokaler" },
  { loser: "beste-plattform-private-utleiere-leie-ut-lokalet", winner: "beste-plattform-private-utleiere-leie-ut-lokale" },
];

const WINNERS = [...new Set(REDIRECTS.map((r) => r.winner))];

describe("blog twin consolidation: losers are gone, winners remain", () => {
  const files = new Set(readdirSync(BLOG_DIR));

  it("no loser .md file survives in src/content/blog", () => {
    for (const { loser } of REDIRECTS) {
      expect(files.has(`${loser}.md`), `${loser}.md should have been deleted`).toBe(false);
    }
  });

  it("every winner .md file still exists", () => {
    for (const winner of WINNERS) {
      expect(files.has(`${winner}.md`), `${winner}.md is missing`).toBe(true);
    }
  });
});

describe("blog twin consolidation: nginx 301s are a single hop each", () => {
  /** The `return 301 https://digilist.no<path>;` inside an exact-match `location = <path> { ... }` block. */
  function nginxTarget(path: string): string | null {
    const re = new RegExp(
      `location\\s*=\\s*${path.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\s*\\{\\s*return\\s+301\\s+https://digilist\\.no(/[^;\\s]*)\\s*;`,
    );
    return NGINX_CONF.match(re)?.[1] ?? null;
  }

  for (const { loser, winner } of REDIRECTS) {
    it(`/blogg/${loser} 301s straight to /blogg/${winner}, no trailing-slash variant missing`, () => {
      expect(nginxTarget(`/blogg/${loser}`), `exact-match block for /blogg/${loser} not found`).toBe(
        `/blogg/${winner}`,
      );
      expect(
        nginxTarget(`/blogg/${loser}/`),
        `exact-match block for /blogg/${loser}/ not found`,
      ).toBe(`/blogg/${winner}`);
    });
  }

  it("no winner slug is itself the loser of another rule in this table (no chain)", () => {
    const loserSlugs = new Set(REDIRECTS.map((r) => r.loser));
    for (const winner of WINNERS) {
      expect(loserSlugs.has(winner), `${winner} is a winner but also redirects elsewhere`).toBe(false);
    }
  });
});

describe("blog twin consolidation: prerender.mjs ships the matching stub list", () => {
  function arraySource(): string {
    const start = PRERENDER_SRC.indexOf("const blogTwinConsolidationRedirects = [");
    expect(start, "blogTwinConsolidationRedirects array not found in prerender.mjs").toBeGreaterThan(-1);
    const end = PRERENDER_SRC.indexOf("];", start);
    return PRERENDER_SRC.slice(start, end);
  }

  it("has one stub entry per nginx redirect, same from/to pairs", () => {
    const src = arraySource();
    for (const { loser, winner } of REDIRECTS) {
      const re = new RegExp(
        `from:\\s*"/blogg/${loser}",\\s*to:\\s*"/blogg/${winner}"`,
      );
      expect(src, `missing stub entry for /blogg/${loser} -> /blogg/${winner}`).toMatch(re);
    }
  });
});

describe("blog twin consolidation: no internal link still points at a loser", () => {
  const SEARCH_DIRS = [
    join(__dirname, "blog"),
    join(__dirname, "..", "pages"),
    join(__dirname, "..", "components"),
  ];

  function collectFiles(dir: string, exts: string[]): string[] {
    const out: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) out.push(...collectFiles(p, exts));
      else if (exts.some((e) => entry.name.endsWith(e))) out.push(p);
    }
    return out;
  }

  const files = SEARCH_DIRS.flatMap((d) => collectFiles(d, [".md", ".ts", ".tsx"]));

  for (const { loser } of REDIRECTS) {
    it(`no .md/.ts/.tsx file under blog/pages/components links to /blogg/${loser}`, () => {
      const offenders = files.filter((f) => readFileSync(f, "utf-8").includes(`/blogg/${loser}`));
      expect(offenders, `still linked from: ${offenders.join(", ")}`).toHaveLength(0);
    });
  }
});

describe("blog twin consolidation: FAQ parity on the winners", () => {
  const faqWinners = ["beste-bookingsystem-kommune-norge", "hvordan-digitalisere-booking-av-kommunale-lokaler"];

  for (const slug of faqWinners) {
    it(`POST_FAQ["${slug}"] mirrors a matching Vanlige spørsmål / Ofte stilte spørsmål section in the body`, () => {
      const entry = POST_FAQ[slug];
      expect(entry, `POST_FAQ["${slug}"] is missing — no FAQPage schema will render`).toBeDefined();
      expect(entry.length).toBeGreaterThan(0);
      const raw = readFileSync(join(BLOG_DIR, `${slug}.md`), "utf-8");
      expect(raw).toMatch(/## (Vanlige spørsmål|Ofte stilte spørsmål)/);
      for (const { question, answer } of entry) {
        expect(raw, `body is missing question: ${question}`).toContain(question);
        expect(raw, `body is missing answer: ${answer}`).toContain(answer);
      }
    });
  }

  it("beste-bookingsystem-kommune-norge keeps exactly five FAQ, per the merge brief", () => {
    expect(POST_FAQ["beste-bookingsystem-kommune-norge"]).toHaveLength(5);
  });

  it("carries the loser's ranking phrase through the redirect, in an H2 or FAQ question", () => {
    const raw = readFileSync(join(BLOG_DIR, "beste-bookingsystem-kommune-norge.md"), "utf-8");
    expect(
      raw,
      "winner must keep 'Hvilket bookingsystem bør en norsk kommune velge' (the redirected loser's ranking phrase) in an H2 or FAQ",
    ).toMatch(/#.*Hvilket bookingsystem bør en norsk kommune velge/i);
  });

  it("uses a comma, not an em dash, in the price H2 (fix pinned by the brief)", () => {
    const raw = readFileSync(join(BLOG_DIR, "beste-bookingsystem-kommune-norge.md"), "utf-8");
    expect(raw).toContain("## Hva Digilist koster, og hva vi ikke tar");
    expect(raw).not.toContain("Hva Digilist koster — og hva vi ikke tar");
  });
});

describe("blog twin consolidation: excluded content stayed out of the winners", () => {
  it("cluster B winner never claims the unverifiable '200 ukentlige bookinger' figure", () => {
    const raw = readFileSync(
      join(BLOG_DIR, "hvordan-digitalisere-booking-av-kommunale-lokaler.md"),
      "utf-8",
    );
    expect(raw).not.toContain("200 ukentlige bookinger");
  });

  it("cluster C winner never claims the loser's 1-3 day setup timeline", () => {
    const raw = readFileSync(join(BLOG_DIR, "beste-plattform-private-utleiere-leie-ut-lokale.md"), "utf-8");
    expect(raw).not.toMatch(/1 til 3 dager/);
  });

  it("cluster C winner's merged price mention uses only the shared price-block marker, no new kroner figures", () => {
    const raw = readFileSync(join(BLOG_DIR, "beste-plattform-private-utleiere-leie-ut-lokale.md"), "utf-8");
    expect(raw).toContain("<!-- price-block: shared -->");
    expect(raw).not.toMatch(/\d[\d .]*\s*kr\b/);
  });
});

// dist/ only exists after `pnpm build`. Skipping keeps `vitest` usable on a
// clean checkout; CI builds before it tests, so the checks that matter still
// run where they matter.
describe.skipIf(!existsSync(DIST))("blog twin consolidation: built dist/ output", () => {
  it("sitemap.xml lists every winner and none of the losers", () => {
    const sitemap = readFileSync(join(DIST, "sitemap.xml"), "utf-8");
    for (const { loser } of REDIRECTS) {
      expect(sitemap, `sitemap.xml still lists the loser /blogg/${loser}`).not.toContain(`/blogg/${loser}<`);
    }
    for (const winner of WINNERS) {
      expect(sitemap, `sitemap.xml is missing the winner /blogg/${winner}`).toContain(`/blogg/${winner}<`);
    }
  });

  it("every loser's prerendered stub is a noindex, single-hop redirect to its winner", () => {
    for (const { loser, winner } of REDIRECTS) {
      const path = join(DIST, "blogg", loser, "index.html");
      expect(existsSync(path), `dist/blogg/${loser}/index.html is missing`).toBe(true);
      const html = readFileSync(path, "utf-8");
      expect(html).toContain(`https://digilist.no/blogg/${winner}`);
      expect(html).toMatch(/noindex/i);
      // Single hop: the stub must not point at another loser.
      for (const { loser: otherLoser } of REDIRECTS) {
        expect(html, `stub for ${loser} must not chain through ${otherLoser}`).not.toContain(
          `/blogg/${otherLoser}"`,
        );
      }
    }
  });

  it("every winner renders with exactly one <h1>", () => {
    for (const winner of WINNERS) {
      const path = join(DIST, "blogg", winner, "index.html");
      expect(existsSync(path), `dist/blogg/${winner}/index.html is missing`).toBe(true);
      const html = readFileSync(path, "utf-8");
      const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
      expect(h1Count, `${winner} rendered ${h1Count} <h1> tags, expected exactly 1`).toBe(1);
    }
  });
});
