/**
 * Conversion tracking, gated on consent.
 *
 * Two things this module exists to fix.
 *
 * **1. Plausible cannot run a paid campaign.** It is a good privacy-first
 * traffic counter and it deliberately sends nothing back to Google or Meta.
 * Both platforms bid using conversion signals: without them there is no Smart
 * Bidding, no lookalike audience, and no cost-per-booking — the spend degrades
 * to buying clicks and hoping. Plausible stays; these tags answer a different
 * question.
 *
 * **2. The cookie banner used to discard its own answer.** It wrote
 * `localStorage["cookie-consent"]` and nothing anywhere read it. That was
 * harmless while only Plausible ran, because Plausible needs no consent. The
 * moment an ad tag is added it stops being harmless: Norway is in the EEA, so
 * marketing storage requires a real opt-in under GDPR/ePrivacy, and a banner
 * that asks and ignores is worse than no banner.
 *
 * **Everything here is inert until the IDs are configured.** No `VITE_GA4_ID`,
 * no GA4. That is deliberate: the ad accounts do not exist yet, and code that
 * ships dormant can be reviewed and deployed now rather than rushed on the day
 * someone wants to launch.
 */

export type ConsentChoice = "granted" | "denied";

export interface ConsentState {
  /** GA4 and other measurement storage. */
  analytics: ConsentChoice;
  /** Google Ads + Meta: remarketing, conversion attribution, audiences. */
  marketing: ConsentChoice;
  /** ISO timestamp of the decision — GDPR asks you to be able to show when. */
  decidedAt: string;
  /** Bumped when the banner's wording or categories change materially. */
  version: number;
}

/** Raise this to re-ask everyone; a stored decision below it is ignored. */
export const CONSENT_VERSION = 2;

const STORAGE_KEY = "cookie-consent";

const env = import.meta.env as Record<string, string | undefined>;

/** Measurement IDs. Absent = that platform is never loaded. */
export const IDS = {
  ga4: env.VITE_GA4_ID,
  googleAds: env.VITE_GOOGLE_ADS_ID,
  metaPixel: env.VITE_META_PIXEL_ID,
} as const;

/** Google Ads conversion labels, one per action. Format: `AW-XXX/label`. */
export const ADS_CONVERSION_LABELS: Record<ConversionEvent, string | undefined> = {
  demo_request: env.VITE_ADS_LABEL_DEMO,
  inquiry_sent: env.VITE_ADS_LABEL_INQUIRY,
  host_signup: env.VITE_ADS_LABEL_HOST_SIGNUP,
};

export type ConversionEvent = "demo_request" | "inquiry_sent" | "host_signup";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[] };
    _fbq?: unknown;
    plausible?: (...args: unknown[]) => void;
  }
}

const gtag = (...args: unknown[]): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
};

// ── consent storage ────────────────────────────────────────────────────────

/**
 * The stored decision, or null when there is none.
 *
 * A decision from an older `CONSENT_VERSION` is treated as absent rather than
 * upgraded. Consent is to a specific set of purposes; silently carrying a yes
 * across a change in what you are asking about is not consent.
 *
 * The legacy flat values `"accepted"` / `"rejected"` written by the previous
 * banner are also treated as absent — they predate the marketing category
 * entirely, so they cannot speak to it.
 */
export function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw === "accepted" || raw === "rejected") return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (parsed.analytics !== "granted" && parsed.analytics !== "denied") return null;
    if (parsed.marketing !== "granted" && parsed.marketing !== "denied") return null;
    return parsed as ConsentState;
  } catch {
    // A blocked or full localStorage must not be read as a grant.
    return null;
  }
}

export function saveConsent(analytics: ConsentChoice, marketing: ConsentChoice): ConsentState {
  const state: ConsentState = {
    analytics,
    marketing,
    decidedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* Storage refused; the choice still applies to this page view. */
  }
  return state;
}

// ── tag loading ────────────────────────────────────────────────────────────

const loaded = new Set<string>();

function loadScript(id: string, src: string): void {
  if (loaded.has(id) || document.getElementById(id)) return;
  loaded.add(id);
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

/** GA4 + Google Ads share one gtag.js load, keyed on whichever ID exists. */
function loadGoogleTag(): void {
  const primary = IDS.ga4 ?? IDS.googleAds;
  if (!primary) return;
  loadScript("gtag-js", `https://www.googletagmanager.com/gtag/js?id=${primary}`);
  if (IDS.ga4) gtag("config", IDS.ga4, { send_page_view: true });
  if (IDS.googleAds) gtag("config", IDS.googleAds);
}

/**
 * Meta's pixel snippet, only ever called after a marketing grant.
 *
 * Meta has no equivalent of Consent Mode — there is no "load but do not
 * store" state — so the only compliant option in the EEA is not to load it at
 * all until the visitor agrees.
 */
function loadMetaPixel(): void {
  if (!IDS.metaPixel || window.fbq) return;
  // Meta's own snippet writes this as a bare ternary expression, which is a
  // no-unused-expressions lint error. Same behaviour, written as a statement.
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue?.push(args);
  } as NonNullable<Window["fbq"]>;
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  loadScript("meta-pixel", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", IDS.metaPixel);
  window.fbq("track", "PageView");
}

// ── applying consent ───────────────────────────────────────────────────────

/**
 * Push the decision to every platform and load what is now permitted.
 *
 * Called on every page load with a stored decision, and again the moment the
 * banner is answered. The `consent update` is sent even when everything is
 * denied — that denial is itself the signal Google needs for EEA modelling.
 */
export function applyConsent(state: ConsentState): void {
  gtag("consent", "update", {
    ad_storage: state.marketing,
    ad_user_data: state.marketing,
    ad_personalization: state.marketing,
    analytics_storage: state.analytics,
  });

  if (state.analytics === "granted" || state.marketing === "granted") loadGoogleTag();
  if (state.marketing === "granted") loadMetaPixel();
}

/** Call once at startup. Returns true when a banner still needs answering. */
export function initAnalytics(): boolean {
  const stored = readConsent();
  if (!stored) return true;
  applyConsent(stored);
  return false;
}

// ── conversions ────────────────────────────────────────────────────────────

export interface ConversionParams {
  /** Which page or block the action came from. */
  source?: string;
  /** Optional value, for reporting only — no real revenue is known here. */
  value?: number;
  currency?: string;
}

const META_EVENT: Record<ConversionEvent, string> = {
  demo_request: "Lead",
  inquiry_sent: "Contact",
  host_signup: "CompleteRegistration",
};

/**
 * Report a conversion to every platform that is permitted and configured.
 *
 * Always reports to Plausible, which needs no consent and gives an
 * unconditional count — useful precisely because it keeps working for visitors
 * who declined, so the team can see how much of reality the ad platforms are
 * allowed to see.
 */
export function trackConversion(event: ConversionEvent, params: ConversionParams = {}): void {
  window.plausible?.(event, { props: { source: params.source ?? "unknown" } });

  const consent = readConsent();
  if (!consent) return;

  if (consent.analytics === "granted" && IDS.ga4) {
    gtag("event", event, {
      source: params.source,
      value: params.value,
      currency: params.currency ?? "NOK",
    });
  }

  if (consent.marketing !== "granted") return;

  const label = ADS_CONVERSION_LABELS[event];
  if (IDS.googleAds && label) {
    gtag("event", "conversion", {
      send_to: label,
      value: params.value,
      currency: params.currency ?? "NOK",
    });
  }

  if (IDS.metaPixel) {
    window.fbq?.("track", META_EVENT[event], {
      content_name: params.source,
      value: params.value,
      currency: params.currency ?? "NOK",
    });
  }
}

/** True when at least one ad platform is configured — used to warn in dev. */
export function isTrackingConfigured(): boolean {
  return Boolean(IDS.ga4 || IDS.googleAds || IDS.metaPixel);
}
