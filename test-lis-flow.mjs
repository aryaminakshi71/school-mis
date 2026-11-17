import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on('pageerror', (e) => console.log('PAGEERROR', e.message.slice(0, 300)));
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 200)); });

await page.goto(`${BASE}/auth/signup`, { waitUntil: 'networkidle' });
await page.fill('input[name="name"]', 'Flow Demo');
await page.fill('input[name="email"]', `flow-${Date.now()}@example.com`);
await page.fill('input[name="password"]', 'DemoPass123!');
await page.fill('input[name="confirmPassword"]', 'DemoPass123!');
await page.click('button:has-text("Sign up")');
await page.waitForURL('**/app/**', { timeout: 20000 }).catch(() => {});
await page.goto(`${BASE}/app/lis`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// 1. Create patient
await page.fill('input[placeholder="Search name, MRN, phone…"]', '');
const mrnInput = page.locator('form input').first();
await mrnInput.fill('MRN-1001');
await page.locator('form input').nth(1).fill('Ravi');
await page.locator('form input').nth(2).fill('Sharma');
await page.click('button:has-text("Add Patient")');
await page.waitForTimeout(1500);
console.log('PATIENT:', (await page.evaluate(() => document.body.innerText)).includes('Ravi') ? 'created' : 'FAILED');

// 2. Create order
await page.click('button:has-text("Orders")');
await page.waitForTimeout(1000);
await page.selectOption('select', { index: 1 }); // first patient
await page.locator('input[type="checkbox"]').first().check();
await page.click('button:has-text("Create Order")');
await page.waitForTimeout(1500);
const orderText = await page.evaluate(() => document.body.innerText);
console.log('ORDER:', orderText.includes('ORD-') ? 'created' : 'FAILED');

// 3. Register sample
await page.click('button:has-text("Samples")');
await page.waitForTimeout(1000);
await page.selectOption('select', { index: 1 }); // first order
await page.click('button:has-text("Register Sample")');
await page.waitForTimeout(1500);
const sampleText = await page.evaluate(() => document.body.innerText);
console.log('SAMPLE:', sampleText.includes('ACC-') ? 'created' : 'FAILED');

// 4. Generate report
await page.click('button:has-text("Reports")');
await page.waitForTimeout(1000);
await page.selectOption('select', { index: 1 });
await page.click('button:has-text("Generate Report")');
await page.waitForTimeout(1500);
const reportText = await page.evaluate(() => document.body.innerText);
console.log('REPORT:', reportText.includes('RPT-') ? 'created' : 'FAILED');

// 5. Create invoice
await page.click('button:has-text("Billing")');
await page.waitForTimeout(1000);
await page.locator('input[type="number"]').first().fill('1000');
await page.click('button:has-text("Create Invoice")');
await page.waitForTimeout(1500);
const billText = await page.evaluate(() => document.body.innerText);
console.log('INVOICE:', billText.includes('INV-') ? 'created' : 'FAILED');

await page.screenshot({ path: '/tmp/lis-flow.png', fullPage: true });
await browser.close();
