import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

page.on('console', (msg) => {
  if (msg.type() === 'error') console.log('CONSOLE', msg.text().slice(0, 200));
});
page.on('requestfailed', (req) => console.log('FAILED', req.url(), req.failure()?.errorText));
page.on('response', (res) => {
  if (res.status() >= 400) console.log('HTTP', res.status(), res.url());
});

// signup
await page.goto(`${BASE}/auth/signup`, { waitUntil: 'networkidle' });
await page.fill('input[name="name"]', 'Demo Admin');
await page.fill('input[name="email"]', `dbg-${Date.now()}@example.com`);
await page.fill('input[name="password"]', 'DemoPass123!');
await page.fill('input[name="confirmPassword"]', 'DemoPass123!');
await page.click('button:has-text("Sign up")');
await page.waitForURL('**/app/**', { timeout: 20000 }).catch(() => {});
console.log('after signup:', page.url());

// go to OPD
await page.goto(`${BASE}/app/registers/opd`, { waitUntil: 'networkidle' }).catch(() => {});
await page.waitForTimeout(2000);
const text = await page.evaluate(() => document.body.innerText.slice(0, 300));
console.log('OPD text:', text);

await browser.close();
