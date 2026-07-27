import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface RotatingWordProps {
  /** First entry is what SSR paints and what the heading's aria-label states. */
  words: readonly string[];
  /** Milliseconds each word rests before rolling to the next. */
  holdMs?: number;
  className?: string;
}

const ROLL = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

/**
 * getBoundingClientRect() reports a run's *advance* width, but a serif glyph's
 * ink can extend past its advance — and the hero's negative letter-spacing
 * (-0.02em) pulls the box in further still. Sizing the visible box to the
 * advance is therefore always slightly short. This trailing slack, in em, keeps
 * the following word off the ink; the clipping it used to cause is gone because
 * the box no longer clips horizontally at all (see overflow handling below).
 */
const INK_SLACK_EM = 0.12;

/**
 * Shared line height for the mask band, its baseline strut and the words. Tall
 * enough to clear Newsreader's descenders at rest; the roll is clipped above
 * and below this band, which is what makes it read as a roll.
 */
const LINE_BOX_EM = 1.18;

/**
 * Warm "koselig" accents, one per word (see --ochre-warm/--kobber/--terrakotta
 * /--rav in index.css). Same hue family as xala.no's warm accent, tuned so all
 * four sit at ~5.5:1 on --paper — they read as one family and clear body AA,
 * not just the 3:1 large-text minimum this size would allow.
 */
const COLORS = [
  "text-ochre-warm",
  "text-kobber",
  "text-terrakotta",
  "text-rav",
] as const;

/**
 * A single word in a heading that rolls vertically to the next one in the list.
 *
 * Four constraints shape this component:
 *
 * 1. LCP. The hero <h1> is the confirmed largest-contentful-paint element
 *    (XAL-316, see docs/xal-316-lcp-handoff.md). words[0] therefore renders as
 *    plain in-flow text on the server and on the first client paint — no motion
 *    wrapper, no opacity:0, nothing to wait for. Rotation begins only after
 *    mount AND after the webfont settles.
 *
 * 2. Crawlable text. Words are measured against a probe appended to <body>,
 *    never inside the heading. An in-heading measurement layer would put every
 *    word in the <h1>, so its text would read "Lokaler Lokaler Selskapslokaler
 *    Møterom …" to anything that ignores aria-hidden.
 *
 * 3. CLS. Words differ in width ("Møterom" vs "Selskapslokaler"), so following
 *    text would jump on each swap. The visible box animates its width between
 *    measured values instead, and re-measures when a breakpoint changes the
 *    font size — stale widths from another breakpoint would mis-size the box.
 *
 * 4. Motion sensitivity. The site claims WCAG 2.1 AA and WCAG 2.2.2 covers
 *    auto-starting movement running past five seconds. Under
 *    prefers-reduced-motion this never rotates: it stays static text, identical
 *    to the SSR output.
 *
 * The rolling word is aria-hidden; the stable accessible name comes from
 * aria-label on the heading itself, so assistive tech reads one fixed sentence.
 */
export function RotatingWord({
  words,
  holdMs = 2800,
  className,
}: RotatingWordProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState<number[] | null>(null);
  const hostRef = useRef<HTMLElement | null>(null);

  // Measures against a probe in <body> that mirrors the heading's resolved
  // typography — font-variation-settings and letter-spacing included, which
  // canvas measureText() cannot reproduce for a variable font.
  const measure = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;
    const cs = getComputedStyle(host);
    const fontSize = parseFloat(cs.fontSize);
    if (!fontSize) return;

    const probe = document.createElement("span");
    probe.setAttribute("aria-hidden", "true");
    Object.assign(probe.style, {
      position: "absolute",
      left: "-9999px",
      top: "0",
      visibility: "hidden",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontStyle: cs.fontStyle,
      letterSpacing: cs.letterSpacing,
      fontVariationSettings: cs.fontVariationSettings,
    });
    document.body.appendChild(probe);

    const slack = fontSize * INK_SLACK_EM;
    const next = words.map((w) => {
      probe.textContent = w;
      return probe.getBoundingClientRect().width + slack;
    });
    probe.remove();

    if (next.every((w) => w > 0)) setWidths(next);
  }, [words]);

  useEffect(() => {
    if (reduceMotion) return;
    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) fonts.ready.then(run).catch(run);
    else run();

    // A breakpoint change alters the heading's font size, invalidating widths.
    window.addEventListener("resize", run);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", run);
    };
  }, [reduceMotion, measure]);

  useEffect(() => {
    if (reduceMotion || !widths) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      holdMs,
    );
    return () => window.clearInterval(id);
  }, [reduceMotion, widths, words.length, holdMs]);

  // Reduced motion, or pre-measurement: plain in-flow text, byte-identical to
  // the prerendered markup.
  if (reduceMotion || !widths) {
    return (
      <span ref={hostRef} className={`${COLORS[0]} ${className ?? ""}`}>
        {words[0]}
      </span>
    );
  }

  return (
    <motion.span
      ref={hostRef}
      aria-hidden="true"
      className={`relative inline-block ${className ?? ""}`}
      style={{
        // An inline-block's baseline is the baseline of its last in-flow line
        // box — but every word here is absolutely positioned, leaving no line
        // box at all, so the box fell back to its bottom margin edge and the
        // word floated above the rest of the line. The zero-width space below
        // restores a real in-flow line box, so the baseline matches "du
        // trenger," exactly. LINE_BOX_EM keeps that strut, and the words
        // positioned against it, on one shared line height.
        lineHeight: LINE_BOX_EM,
        // Only the VERTICAL axis is masked — that is what makes the roll read
        // as a roll. Clipping horizontally too (plain overflow:hidden) shaved
        // the ink off the last glyph, rendering "Selskapslokaler" as
        // "Selskapslokalei". `overflow-x: visible` normally computes to `auto`
        // when the other axis is clipped, but the spec exempts `clip` — so
        // this pairing is the one way to mask a single axis.
        overflowY: "clip",
        overflowX: "visible",
      }}
      animate={{ width: widths[index] }}
      initial={false}
      // Width settles faster than the roll, so a longer word has room before
      // it arrives rather than briefly overhanging the text after it.
      transition={{ ...ROLL, duration: 0.4 }}
    >
      {"​"}
      <AnimatePresence initial={false}>
        <motion.span
          key={index}
          className={`absolute left-0 top-0 whitespace-nowrap ${COLORS[index % COLORS.length]}`}
          style={{ lineHeight: LINE_BOX_EM }}
          // ±125%, not ±100%: the percentage resolves against the word's own
          // height (lineHeight 1 = 1em) while the mask band is 1.18em tall, so
          // a 100% translate leaves a 0.18em sliver of the outgoing word
          // parked above the band.
          initial={{ y: "125%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-125%" }}
          transition={ROLL}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

export default RotatingWord;
