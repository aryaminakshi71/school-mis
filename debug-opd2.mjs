import { chromium } from "playwright";
const BASE = "http://127.0.0.1:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE", m.text().slice(0, 300));
});
page.on("response", (r) => {
  if (r.url().includes("/api/")) console.log("HTTP", r.status(), r.url());
});
await page.goto(`${BASE}/auth/signup`, { waitUntil: "networkidle" });
await page.fill('input[name="name"]', "Demo Admin");
await page.fill('input[name="email"]', `dbg2-${Date.now()}@example.com`);
await page.fill('input[name="password"]', "DemoPass123!");
await page.fill('input[name="confirmPassword"]', "DemoPass123!");
await page.click('button:has-text("Sign up")');
await page.waitForURL("**/app/**", { timeout: 20000 }).catch(() => {});
console.log("--- now OPD ---");
await page
  .goto(`${BASE}/app/registers/opd`, { waitUntil: "networkidle" })
  .catch(() => {});
await page.waitForTimeout(2500);
console.log(
  "OPD text:",
  (await page.evaluate(() => document.body.innerText)).slice(0, 200),
);
await browser.close();
