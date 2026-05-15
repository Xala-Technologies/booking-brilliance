/**
 * Polite fetcher. Rate-limits, gives each request a clear User-Agent, and
 * measures load time. No Playwright in v1 — digilist.no is pre-rendered, so
 * a plain HTTP fetch sees everything Google sees.
 */

export interface FetchedPage {
  url: string;
  status: number;
  contentType: string | null;
  html: string;
  loadMs: number;
}

export interface FetcherOptions {
  /** Min ms between requests (default 250). */
  minIntervalMs?: number;
  /** Request timeout (default 12000). */
  timeoutMs?: number;
  /** Custom User-Agent (default identifies us as the internal auditor). */
  userAgent?: string;
}

const DEFAULT_UA =
  "DigilistSEOCrawler/1.0 (+https://digilist.no; internal audit)";

export class Fetcher {
  private lastAt = 0;
  private readonly opts: Required<FetcherOptions>;

  constructor(opts: FetcherOptions = {}) {
    this.opts = {
      minIntervalMs: opts.minIntervalMs ?? 250,
      timeoutMs: opts.timeoutMs ?? 12_000,
      userAgent: opts.userAgent ?? DEFAULT_UA,
    };
  }

  async fetch(url: string): Promise<FetchedPage> {
    await this.throttle();
    const t0 = Date.now();
    const ac = new AbortController();
    const to = setTimeout(() => ac.abort(), this.opts.timeoutMs);
    try {
      const res = await fetch(url, {
        signal: ac.signal,
        redirect: "follow",
        headers: {
          "User-Agent": this.opts.userAgent,
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "nb-NO,nb;q=0.9,en;q=0.8",
        },
      });
      const html = await res.text();
      return {
        url: res.url || url,
        status: res.status,
        contentType: res.headers.get("content-type"),
        html,
        loadMs: Date.now() - t0,
      };
    } catch (err) {
      return {
        url,
        status: 0,
        contentType: null,
        html: "",
        loadMs: Date.now() - t0,
      };
    } finally {
      clearTimeout(to);
    }
  }

  private async throttle(): Promise<void> {
    const wait = this.lastAt + this.opts.minIntervalMs - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    this.lastAt = Date.now();
  }
}
