/**
 * Every text token must clear WCAG AA against every surface it can land on.
 *
 * This exists because the policy was previously enforced by HAND-WRITTEN
 * COMMENTS. `--ink-faint` carried "AA 5.1:1 on paper-deep" — true, and
 * verified — while `--ochre` sat just above a block whose comment says its
 * whole family was "tuned so every one lands at ~5.5:1 on --paper" and was
 * never brought into that tuning. It kept 38% lightness and shipped at
 * **4.48:1** as the PILOT status label on /teknologi. axe measured 4.47.
 *
 * A comment cannot compute a ratio, so nothing noticed. Nothing else could
 * either: the only a11y auditor that runs against this site is cheerio-based
 * and parses HTML without resolving CSS, and the Playwright+axe pass that
 * would catch it is a deferred TODO.
 *
 * What this test can and cannot do, stated honestly:
 *   - It CAN catch a token whose value drifts below AA on a token surface.
 *     That is the whole `--ochre` class of defect.
 *   - It CANNOT catch text placed on a hard-coded colour, because that surface
 *     is not a token. The hero's browser-chrome badge — `bg-[#e3e7ed]` under a
 *     5% black overlay — was exactly that, and only axe against a rendered page
 *     would have found it. The one such surface known today is pinned below by
 *     hand so at least it cannot regress silently.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const CSS = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "index.css"),
  "utf8",
);

/** Read a token from the `:root` (light) block — the first definition wins. */
function token(name: string): string {
  const match = new RegExp(`--${name}:\\s*([^;/]+?)\\s*(?:;|/\\*)`).exec(CSS);
  if (!match?.[1]) throw new Error(`token --${name} not found in index.css`);
  return match[1].trim();
}

type RGB = [number, number, number];

export function hslToRgb(hsl: string): RGB {
  const [h, s, l] = hsl.split(/\s+/).map((p) => Number.parseFloat(p));
  if (h === undefined || s === undefined || l === undefined) throw new Error(`bad hsl: ${hsl}`);
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - c / 2;
  const sextant = Math.floor(h / 60) % 6;
  const [r, g, b] = ([
    [c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x],
  ][sextant] ?? [0, 0, 0]) as RGB;
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

export function hexToRgb(hex: string): RGB {
  const v = hex.replace("#", "");
  return [
    Number.parseInt(v.slice(0, 2), 16),
    Number.parseInt(v.slice(2, 4), 16),
    Number.parseInt(v.slice(4, 6), 16),
  ];
}

/** Composite `fg` over `bg` at `alpha` — how an overlay surface resolves. */
export function composite(fg: RGB, bg: RGB, alpha: number): RGB {
  return fg.map((f, i) => Math.round(f * alpha + (bg[i] as number) * (1 - alpha))) as RGB;
}

export function relativeLuminance([r, g, b]: RGB): number {
  const channel = (v: number): number => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: RGB, b: RGB): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const AA_BODY = 4.5;

/**
 * Which surfaces each text token ACTUALLY lands on, with where that was
 * verified. A full cross-product is the wrong shape and I built it that way
 * first: it reported five failures for warm tokens on `--footer`, none of
 * which occur — those tokens appear only in the hero's RotatingWord. Acting on
 * them would have darkened five colours to fix nothing, which is the same
 * mistake as reporting a defect you have not confirmed happens.
 *
 * So each entry is a claim about real usage. If a token gains a new surface,
 * add it here and the ratio is enforced; the comment is the audit trail.
 */
const ALL_SURFACES = ["paper", "paper-deep", "paper-tinted", "accent-tinted", "footer"] as const;

const PAIRINGS: { text: string; surfaces: readonly string[]; where: string }[] = [
  { text: "ink", surfaces: ALL_SURFACES, where: "body copy across every template" },
  { text: "ink-soft", surfaces: ALL_SURFACES, where: "secondary copy across every template" },
  // 323 call sites, including ten in Footer.tsx on the deeper --footer surface.
  { text: "ink-faint", surfaces: ALL_SURFACES, where: "captions, meta, footer links" },
  { text: "accent-text", surfaces: ALL_SURFACES, where: "links and AKTIV status labels" },
  // text-ochre: IntegrationsSection PILOT label and RotatingWord — both on --paper.
  { text: "ochre", surfaces: ["paper"], where: "IntegrationsSection.tsx PILOT label, RotatingWord.tsx" },
  // The rest of the warm family exists only in the hero's rotating word.
  { text: "ochre-warm", surfaces: ["paper"], where: "RotatingWord.tsx only" },
  { text: "kobber", surfaces: ["paper"], where: "RotatingWord.tsx only" },
  { text: "terrakotta", surfaces: ["paper"], where: "RotatingWord.tsx only" },
  { text: "rav", surfaces: ["paper"], where: "RotatingWord.tsx only" },
];

describe("colour maths", () => {
  it("reproduces the two values axe measured on the live site", () => {
    // Anchors the maths to an external, independent measurement. If these
    // drift, the helpers are wrong — not the tokens.
    expect(contrastRatio(hslToRgb("36 50% 38%"), hslToRgb("40 46% 96%"))).toBeCloseTo(4.47, 1);
    expect(
      contrastRatio(hslToRgb("215 19% 40%"), composite([0, 0, 0], hexToRgb("#e3e7ed"), 0.05)),
    ).toBeCloseTo(4.41, 1);
  });

  it("converts hsl and hex to the same rgb axe reported", () => {
    expect(hslToRgb("36 50% 38%")).toEqual(hexToRgb("#916b30"));
    expect(hslToRgb("40 46% 96%")).toEqual(hexToRgb("#f9f6f0"));
  });
});

describe("every text token clears WCAG AA on every surface it actually lands on", () => {
  for (const { text, surfaces, where } of PAIRINGS) {
    for (const surface of surfaces) {
      it(`--${text} on --${surface} (${where})`, () => {
        const ratio = contrastRatio(hslToRgb(token(text)), hslToRgb(token(surface)));
        expect(
          ratio,
          `--${text} on --${surface} is ${ratio.toFixed(2)}:1, below AA ${AA_BODY}:1. ` +
            `Darken the token; do not add a comment claiming it passes elsewhere.`,
        ).toBeGreaterThanOrEqual(AA_BODY);
      });
    }
  }
});

describe("hard-coded surfaces this test cannot discover on its own", () => {
  /**
   * Pinned by hand because these are not tokens: the surface is a literal hex
   * plus an alpha overlay, so a CSS-parsing test is structurally blind to it.
   * Only axe against a rendered page finds NEW ones. This keeps the known case
   * from regressing.
   *
   * Worth recording how this resolved. The hero badge was the second defect
   * axe found — `--ink-faint` at 40% on `#e3e7ed` under a 5% black overlay
   * measured 4.41. The first instinct was to change that one component to
   * `--ink-soft`. Darkening `--ink-faint` to 36% for the FOOTER then lifted the
   * badge to 5.15 on its own, so the component change became a visual change
   * with no accessibility benefit — a heavier badge than the design intends —
   * and was reverted. The token fix subsumed it.
   */
  it("hero browser-chrome badge clears AA with the current --ink-faint", () => {
    const badge = composite([0, 0, 0], hexToRgb("#e3e7ed"), 0.05);
    expect(badge).toEqual(hexToRgb("#d8dbe1")); // the surface axe reported

    // The historical defect, kept as the reason this test exists.
    expect(contrastRatio(hslToRgb("215 19% 40%"), badge)).toBeLessThan(AA_BODY);

    // The invariant that must hold now and after any future token change.
    const ratio = contrastRatio(hslToRgb(token("ink-faint")), badge);
    expect(
      ratio,
      `--ink-faint is ${ratio.toFixed(2)}:1 on the hero chrome badge. It was 4.41 at 40% ` +
        `lightness; if this drops below AA again, darken the token rather than patching the component.`,
    ).toBeGreaterThanOrEqual(AA_BODY);
  });

  it("the hero badge still uses the token this test checks", () => {
    // If the class changes, the assertion above is measuring the wrong thing.
    const hero = readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "components", "HeroSection.tsx"),
      "utf8",
    );
    const badgeLine = hero.split("\n").find((l) => l.includes("bg-black/[0.05]"));
    expect(badgeLine, "the hero chrome badge line moved — re-verify its contrast").toBeDefined();
    expect(badgeLine).toContain("text-ink-faint");
  });
});
