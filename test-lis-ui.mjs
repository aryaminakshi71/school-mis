import { chromium } from "playwright";
const BASE = "http://127.0.0.1:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message.slice(0, 300)));
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE", m.text().slice(0, 300));
});
await page.goto(`${BASE}/auth/signup`, { waitUntil: "networkidle" });
await page.fill('input[name="name"]', "LIS Demo");
await page.fill('input[name="email"]', `lisui-${Date.now()}@example.com`);
await page.fill('input[name="password"]', "DemoPass123!");
await page.fill('input[name="confirmPassword"]', "DemoPass123!");
await page.click('button:has-text("Sign up")');
await page.waitForURL("**/app/**", { timeout: 20000 }).catch(() => {});
await page.goto(`${BASE}/app/lis`, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
console.log(
  "TEXT:",
  (await page.evaluate(() => document.body.innerText)).slice(0, 400),
);
await page.screenshot({ path: "/tmp/lis-patients.png", fullPage: true });
// click Tests tab
await page.click('button:has-text("Tests")');
await page.waitForTimeout(1500);
console.log(
  "TESTS:",
  (await page.evaluate(() => document.body.innerText)).slice(0, 300),
);
await page.screenshot({ path: "/tmp/lis-tests.png", fullPage: true });
await browser.close();
