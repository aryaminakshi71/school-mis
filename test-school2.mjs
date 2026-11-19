import { chromium } from "playwright";
const BASE = "http://127.0.0.1:3070";
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("response", async (r) => {
  if (r.url().includes("/api/auth/sign-up")) {
    console.log("STATUS", r.status());
    console.log("BODY", (await r.text()).slice(0, 500));
  }
});
await page.goto(`${BASE}/signup`, { waitUntil: "networkidle" });
await page.fill("#email", `dbg-${Date.now()}@example.com`);
await page.fill("#password", "DemoPass123!");
await page.click('button:has-text("Create Account")');
await page.waitForTimeout(3000);
await browser.close();
