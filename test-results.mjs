import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on('pageerror', (e) => console.log('PAGEERROR', e.message.slice(0, 300)));
page.on('response', (r) => { if (r.url().includes('/api/rpc') && r.status() >= 400) console.log('RPC ERR', r.status(), r.url().replace(BASE, '')); });
await page.goto(`${BASE}/auth/signup`, { waitUntil: 'networkidle' });
await page.fill('input[name="name"]', 'Res Demo');
await page.fill('input[name="email"]', `res-${Date.now()}@example.com`);
await page.fill('input[name="password"]', 'DemoPass123!');
await page.fill('input[name="confirmPassword"]', 'DemoPass123!');
await page.click('button:has-text("Sign up")');
await page.waitForURL('**/app/**', { timeout: 20000 }).catch(() => {});
await page.goto(`${BASE}/app/lis`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
// patient
await page.locator('form input').first().fill('MRN-4001');
await page.locator('form input').nth(1).fill('Res');
await page.locator('form input').nth(2).fill('Test');
await page.click('button:has-text("Add Patient")');
await page.waitForTimeout(1200);
// order
await page.click('button:has-text("Orders")');
await page.waitForTimeout(1200);
await page.selectOption('select', { index: 1 });
await page.locator('input[type="checkbox"]').first().check();
await page.click('button:has-text("Create Order")');
await page.waitForTimeout(1200);
// sample
await page.click('button:has-text("Samples")');
await page.waitForTimeout(1200);
await page.selectOption('select', { index: 1 });
await page.click('button:has-text("Register Sample")');
await page.waitForTimeout(1200);
// results
await page.click('button:has-text("Results")');
await page.waitForTimeout(1200);
await page.selectOption('select', { index: 1 });
await page.waitForTimeout(1200);
// fill result form (right card)
const numInputs = page.locator('input');
await page.locator('form input').first().fill('14.5');
await page.locator('form input').nth(1).fill('g/dL');
await page.locator('form input').nth(2).fill('12');
await page.locator('form input').nth(3).fill('16');
await page.click('button:has-text("Save Result")');
await page.waitForTimeout(1500);
const text = await page.evaluate(() => document.body.innerText);
console.log('RESULT SAVED:', text.includes('14.5') ? 'yes' : 'no');
console.log('VERIFY BTN:', text.includes('Verify') ? 'yes' : 'no');
await page.screenshot({ path: '/tmp/lis-results.png', fullPage: true });
await browser.close();
