import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:3000";
const OUT = process.argv[3] || "/tmp/shots";
const EMAIL = `demo-${Date.now()}@example.com`;

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

async function shot(name) {
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log("shot", name);
}

// Sign up
await page.goto(`${BASE}/auth/signup`, { waitUntil: "networkidle" });
await page.fill('input[name="name"]', "Demo Admin");
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', "DemoPass123!");
await page.fill('input[name="confirmPassword"]', "DemoPass123!");
await page.click('button:has-text("Sign up")');
await page.waitForURL("**/app/**", { timeout: 20000 }).catch(() => {});
await shot("01-registers");

// Register detail
await page
  .goto(`${BASE}/app/registers/opd`, { waitUntil: "networkidle" })
  .catch(() => {});
await shot("02-opd");

await page
  .goto(`${BASE}/app/registers/biochemistry`, { waitUntil: "networkidle" })
  .catch(() => {});
await shot("03-biochemistry");

// Dashboard
await page
  .goto(`${BASE}/app/dashboard`, { waitUntil: "networkidle" })
  .catch(() => {});
await shot("04-dashboard");

await browser.close();
console.log("done");
