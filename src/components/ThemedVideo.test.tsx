// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ThemedVideo } from "./ThemedVideo";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom has no matchMedia; next-themes calls it on mount even with enableSystem={false}.
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as typeof window.matchMedia;

/**
 * XAL-1166: the hero video is not the measured LCP element (the H1 is, per
 * XAL-316 / HeroSection.tsx:76-79), so it must not eagerly preload and steal
 * bandwidth from the real LCP path.
 */
describe("ThemedVideo preload", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders preload="metadata", not "auto"', () => {
    act(() => {
      root.render(
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ThemedVideo
            ariaLabel="Digilist i praksis"
            light={{
              webm: "/videos/light.webm",
              mp4: "/videos/light.mp4",
              poster: "/videos/light-poster.jpg",
            }}
            dark={{
              webm: "/videos/dark.webm",
              mp4: "/videos/dark.mp4",
              poster: "/videos/dark-poster.jpg",
            }}
          />
        </ThemeProvider>,
      );
    });

    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video!.getAttribute("preload")).toBe("metadata");
  });
});
