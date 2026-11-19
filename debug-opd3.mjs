import { chromium } from "playwright";
const BASE = "http://127.0.0.1:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("console", (m) =>
  console.log("CONSOLE", m.type(), m.text().slice(0, 300)),
);
page.on("request", (r) => {
  if (
    !r.url().includes("@") &&
    !r.url().includes(".js") &&
    !r.url().includes(".css")
  )
    console.log("REQ", r.method(), r.url());
});
page.on("requestfailed", (r) =>
  console.log("FAILED", r.url(), r.failure()?.errorText),
);
await page.goto(`${BASE}/auth/signup`, { waitUntil: "networkidle" });
await page.fill('input[name="name"]', "Demo Admin");
await page.fill('input[name="email"]', `dbg3-${Date.now()}@example.com`);
await page.fill('input[name="password"]', "DemoPass123!");
await page.fill('input[name="confirmPassword"]', "DemoPass123!");
await page.click('button:has-text("Sign up")');
await page.waitForURL("**/app/**", { timeout: 20000 }).catch(() => {});
console.log("--- now OPD ---");
await page
  .goto(`${BASE}/app/registers/opd`, { waitUntil: "networkidle" })
  .catch(() => {});
await page.waitForTimeout(2500);
await browser.close();
