import { chromium } from "playwright";
const BASE = "http://127.0.0.1:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message.slice(0, 300)));
page.on("response", (r) => {
  if (r.url().includes("/api/rpc") && r.status() >= 400)
    console.log("RPC ERR", r.status(), r.url().replace(BASE, ""));
});
await page.goto(`${BASE}/auth/signup`, { waitUntil: "networkidle" });
await page.fill('input[name="name"]', "Inv Demo");
await page.fill('input[name="email"]', `inv-${Date.now()}@example.com`);
await page.fill('input[name="password"]', "DemoPass123!");
await page.fill('input[name="confirmPassword"]', "DemoPass123!");
await page.click('button:has-text("Sign up")');
await page.waitForURL("**/app/**", { timeout: 20000 }).catch(() => {});
await page.goto(`${BASE}/app/lis`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
// Inventory
await page.click('button:has-text("Inventory")');
await page.waitForTimeout(1000);
await page.locator("form input").first().fill("Glucose Reagent");
await page.locator('form input[type="number"]').first().fill("50");
await page.locator('form input[type="number"]').nth(1).fill("10");
await page.click('button:has-text("Add Item")');
await page.waitForTimeout(1500);
let text = await page.evaluate(() => document.body.innerText);
console.log(
  "INVENTORY:",
  text.includes("Glucose Reagent") ? "created" : "FAILED",
);
// QC
await page.click('button:has-text("QC")');
await page.waitForTimeout(1000);
await page.selectOption("select", { index: 1 });
await page.click('button:has-text("Record QC Run")');
await page.waitForTimeout(1500);
text = await page.evaluate(() => document.body.innerText);
console.log("QC:", text.includes("pass") ? "created" : "FAILED");
await page.screenshot({ path: "/tmp/lis-qc.png", fullPage: true });
await browser.close();
