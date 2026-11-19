import fs from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:3000";
const OUT = process.argv[3] || "/tmp/shots-final";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

async function shot(name) {
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log("shot", name);
}

// 1. Login page
await page.goto(`${BASE}/auth/login`, { waitUntil: "networkidle" });
await shot("01-login");

// 2. Signup page
await page.goto(`${BASE}/auth/signup`, { waitUntil: "networkidle" });
await shot("02-signup");

// 3. Sign up → registers
await page.fill('input[name="name"]', "Demo Admin");
await page.fill('input[name="email"]', `video-${Date.now()}@example.com`);
await page.fill('input[name="password"]', "DemoPass123!");
await page.fill('input[name="confirmPassword"]', "DemoPass123!");
await page.click('button:has-text("Sign up")');
await page.waitForURL("**/app/**", { timeout: 20000 }).catch(() => {});
await shot("03-registers");

// 4. Scroll registers
await page.evaluate(() => window.scrollTo(0, 400));
await shot("04-registers-scrolled");

await browser.close();
console.log("done");
