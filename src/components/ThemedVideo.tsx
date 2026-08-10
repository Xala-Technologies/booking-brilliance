import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface Variant {
  /** Path to the VP9 .webm */
  webm: string;
  /** Path to the H.264 .mp4 fallback */
  mp4: string;
  /** Poster frame shown before playback starts */
  poster: string;
}

interface ThemedVideoProps {
  light: Variant;
  dark: Variant;
  /** Describes the footage, not the theme. */
  ariaLabel: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Plays a light- or dark-UI recording to match the active site theme.
 *
 * Why this needs JS at all: the site's theme is class-based (next-themes), not
 * media-query based, because a visitor can override their OS preference with
 * the Navbar toggle. That rules out the pure-CSS approach of
 * `<source media="(prefers-color-scheme: dark)">`, which only ever sees the OS
 * setting and would show a dark recording to someone who had explicitly chosen
 * the light theme.
 *
 * SSR/prerender renders the dark variant — it matches the browser-mockup chrome
 * the hero wraps this in, and it is what every prerendered page has served
 * historically, so crawlers and the first paint see no change. The swap happens
 * after mount, once `resolvedTheme` is actually known; rendering against
 * `theme` before then would flash the wrong file for visitors on "system".
 *
 * The `key` is what forces the swap: <video> ignores changes to <source
 * children> after it has loaded, so the element has to be remounted for the new
 * file to be picked up.
 */
export function ThemedVideo({
  light,
  dark,
  ariaLabel,
  className,
  style,
}: ThemedVideoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const variant = mounted && resolvedTheme === "light" ? light : dark;

  return (
    <video
      key={variant.webm}
      className={className}
      style={style}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={variant.poster}
      aria-label={ariaLabel}
    >
      <source src={variant.webm} type="video/webm" />
      <source src={variant.mp4} type="video/mp4" />
    </video>
  );
}

export default ThemedVideo;
