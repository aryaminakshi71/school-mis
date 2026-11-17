import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:3070';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on('response', (r) => { if (r.url().includes('/api/auth')) console.log('API', r.status(), r.url().replace(BASE, '')); });
const email = `login-${Date.now()}@example.com`;
// signup
await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });
await page.fill('#school-name', 'Login Test School');
await page.fill('#email', email);
await page.fill('#password', 'DemoPass123!');
await page.click('button:has-text("Create Account")');
await page.waitForTimeout(3500);
console.log('after signup:', page.url());
// logout via localStorage + go to login
await page.evaluate(() => localStorage.removeItem('school_mis_user'));
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
// fill login
const inputs = page.locator('input');
await inputs.first().fill(email);
await inputs.nth(1).fill('DemoPass123!');
await page.locator('button[type="submit"]').first().click();
await page.waitForTimeout(3500);
console.log('after login:', page.url());
const text = await page.evaluate(() => document.body.innerText);
console.log('dash:', text.includes('Total Students') ? 'yes' : text.slice(0, 100));
await page.screenshot({ path: '/tmp/school-dashboard.png', fullPage: true });
await browser.close();
