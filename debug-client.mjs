import { chromium } from "playwright";
const BASE = "http://127.0.0.1:3000";
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("console", (m) =>
  console.log("CONSOLE", m.type(), m.text().slice(0, 300)),
);
await page.goto(`${BASE}/auth/signup`, { waitUntil: "networkidle" });
await page.fill('input[name="name"]', "Demo Admin");
await page.fill('input[name="email"]', `dbg5-${Date.now()}@example.com`);
await page.fill('input[name="password"]', "DemoPass123!");
await page.fill('input[name="confirmPassword"]', "DemoPass123!");
await page.click('button:has-text("Sign up")');
await page.waitForURL("**/app/**", { timeout: 20000 }).catch(() => {});
const res = await page.evaluate(async () => {
  try {
    const r = await window.__orpc.registers.entry.list({});
    return { ok: true, data: r };
  } catch (e) {
    return { ok: false, error: String(e), stack: e?.stack?.slice(0, 500) };
  }
});
console.log("DIRECT CALL:", JSON.stringify(res).slice(0, 600));
await browser.close();
