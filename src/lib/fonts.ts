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

// Unified Fraunces voice — keep WONK off, keep SOFT consistent (30).
// Only opsz and wght vary across sizes; weight always 400.
const PRESETS: Record<FrauncesSize, string> = {
  hero: '"opsz" 144, "wght" 400, "SOFT" 30, "WONK" 0',
  display: '"opsz" 120, "wght" 400, "SOFT" 30, "WONK" 0',
  section: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0',
  sub: '"opsz" 36, "wght" 420, "SOFT" 30, "WONK" 0',
  quote: '"opsz" 72, "wght" 400, "SOFT" 30, "WONK" 0',
  dropcap: '"opsz" 144, "wght" 480, "SOFT" 30, "WONK" 0',
  "body-italic": '"opsz" 16, "wght" 420, "SOFT" 30, "WONK" 0',
};

export function getFraunces(size: FrauncesSize): string {
  return PRESETS[size];
}
