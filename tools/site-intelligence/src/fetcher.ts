/** Polite shared fetcher used by every auditor. */

export interface FetchedPage {
  url: string;
  status: number;
  contentType: string | null;
  headers: Record<string, string>;
  html: string;
  loadMs: number;
}

const DEFAULT_UA =
  "DigilistSiteIntelligence/1.0 (+https://digilist.no; internal audit)";

export class Fetcher {
  private lastAt = 0;
  constructor(
    private readonly opts: {
      minIntervalMs: number;
      timeoutMs: number;
      userAgent: string;
    } = {
      minIntervalMs: 250,
      timeoutMs: 12_000,
      userAgent: DEFAULT_UA,
    },
  ) {}

  async fetch(
    url: string,
    method: "GET" | "HEAD" = "GET",
  ): Promise<FetchedPage> {
    await this.throttle();
    const t0 = Date.now();
    const ac = new AbortController();
    const to = setTimeout(() => ac.abort(), this.opts.timeoutMs);
    try {
      const res = await fetch(url, {
        method,
        signal: ac.signal,
        redirect: "follow",
        headers: {
          "User-Agent": this.opts.userAgent,
          Accept: "text/html,application/xhtml+xml,*/*",
          "Accept-Language": "nb-NO,nb;q=0.9,en;q=0.8",
        },
      });
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        headers[k.toLowerCase()] = v;
      });
      const html = method === "HEAD" ? "" : await res.text();
      return {
        url: res.url || url,
        status: res.status,
        contentType: res.headers.get("content-type"),
        headers,
        html,
        loadMs: Date.now() - t0,
      };
    } catch {
      return {
        url,
        status: 0,
        contentType: null,
        headers: {},
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
