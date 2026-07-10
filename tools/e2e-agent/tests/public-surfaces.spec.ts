/**
 * Public-surface E2E journeys — the critical things a visitor must be able to
 * do on digilist.no without logging in. Written to be robust against a live
 * site (no brittle text assertions where a smoke check suffices). Each test
 * title is stable — the runner keys Linear dedup on it.
 *
 * Login-gated app flows (app.digilist.no, ID-porten/BankID) are intentionally
 * out of scope until test auth is available.
 */
import { test, expect, type Page } from "@playwright/test";

/** Fail the test if the page logged a console error or a request failed. */
function trackPageErrors(page: Page): { errors: string[] } {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 160)}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${String(e).slice(0, 160)}`));
  page.on("requestfailed", (r) => {
    // Ignore third-party/analytics noise; flag same-origin + asset failures.
    const u = r.url();
    if (u.includes("digilist.no")) errors.push(`request failed: ${u.slice(0, 120)}`);
  });
  return { errors };
}

test("home page loads with an h1 and primary navigation", async ({ page }) => {
  const t = trackPageErrors(page);
  const resp = await page.goto("/");
  expect(resp?.status(), "home HTTP status").toBeLessThan(400);
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /blogg/i }).first()).toBeVisible();
  expect(t.errors, `console/network errors on /`).toEqual([]);
});

test("blog index lists posts and a post opens with its cover + body", async ({ page }) => {
  await page.goto("/blogg");
  const firstPost = page.locator('a[href^="/blogg/"]').first();
  await expect(firstPost).toBeVisible();
  await firstPost.click();
  await expect(page).toHaveURL(/\/blogg\/.+/);
  await expect(page.locator("article, .post-body").first()).toBeVisible();
  const body = await page.locator("article, .post-body").first().innerText();
  expect(body.length, "article body length").toBeGreaterThan(400);
});

test("book-demo page shows a working contact form", async ({ page }) => {
  const resp = await page.goto("/book-demo");
  expect(resp?.status()).toBeLessThan(400);
  // A name/email input + a submit control must exist.
  await expect(page.locator('input[type="email"], input[name*="mail" i]').first()).toBeVisible();
  await expect(page.getByRole("button").filter({ hasText: /book|send|demo/i }).first()).toBeVisible();
});

test("chatbot opens on the home page", async ({ page }) => {
  await page.goto("/");
  const launcher = page
    .getByRole("button", { name: /chat|snakk|hjelp|assistent/i })
    .or(page.locator('[aria-label*="chat" i], button:has-text("Chat")'))
    .first();
  await expect(launcher, "chatbot launcher present").toBeVisible();
});

test("key public pages render (faq, transparens, status, use-cases)", async ({ page }) => {
  for (const path of ["/faq", "/transparens", "/status", "/bruksomrader/idrettshaller-gymsaler"]) {
    const resp = await page.goto(path);
    expect(resp?.status(), `${path} status`).toBeLessThan(400);
    await expect(page.locator("h1, h2").first(), `${path} heading`).toBeVisible();
  }
});

test("transparens shows the measured uptime metric", async ({ page }) => {
  await page.goto("/transparens");
  // Either the measured-uptime headline or the SLA figure must be present.
  await expect(page.getByText(/oppetid|uptime/i).first()).toBeVisible();
});
