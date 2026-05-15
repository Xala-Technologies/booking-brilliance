/**
 * Fraunces variable-axis presets.
 * opsz (optical size)  — 9..144
 * wght (weight)        — 300..900
 * SOFT (softness)      — 0..100
 * WONK (wonky/sharp)   — 0..1
 */

export type FrauncesSize =
  | "hero"
  | "display"
  | "section"
  | "sub"
  | "quote"
  | "dropcap"
  | "body-italic";

// Unified Fraunces voice — heavier than browser default for WCAG AA
// legibility on cream paper, especially at sub/quote sizes where light
// serifs read as anemic. Weight bumps:
//   hero/display 400 → 460
//   section 400 → 480
//   sub 420 → 540 (small headings need most weight)
//   quote 400 → 460
//   dropcap 480 → 540
const PRESETS: Record<FrauncesSize, string> = {
  hero: '"opsz" 144, "wght" 460, "SOFT" 30, "WONK" 0',
  display: '"opsz" 120, "wght" 460, "SOFT" 30, "WONK" 0',
  section: '"opsz" 96, "wght" 480, "SOFT" 30, "WONK" 0',
  sub: '"opsz" 36, "wght" 540, "SOFT" 30, "WONK" 0',
  quote: '"opsz" 72, "wght" 460, "SOFT" 30, "WONK" 0',
  dropcap: '"opsz" 144, "wght" 540, "SOFT" 30, "WONK" 0',
  "body-italic": '"opsz" 16, "wght" 460, "SOFT" 30, "WONK" 0',
};

export function getFraunces(size: FrauncesSize): string {
  return PRESETS[size];
}
