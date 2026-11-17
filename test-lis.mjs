import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 200)); });
await page.goto(`${BASE}/auth/signup`, { waitUntil: 'networkidle' });
const email = `lis-${Date.now()}@example.com`;
await page.fill('input[name="name"]', 'LIS Tester');
await page.fill('input[name="email"]', email);
await page.fill('input[name="password"]', 'DemoPass123!');
await page.fill('input[name="confirmPassword"]', 'DemoPass123!');
await page.click('button:has-text("Sign up")');
await page.waitForURL('**/app/**', { timeout: 20000 }).catch(() => {});
console.log('signed up:', email, '->', page.url());

const result = await page.evaluate(async () => {
  const call = async (path, body) => {
    const res = await fetch(`/api/rpc/${path}`, {
      method: body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body ? JSON.stringify({ json: body }) : undefined,
    });
    return { status: res.status, body: await res.text() };
  };
  const list = await call('lis/patients/list');
  const create = await call('lis/patients/create', {
    mrn: 'MRN-001', firstName: 'Asha', lastName: 'Verma', gender: 'female', phone: '9876543210',
  });
  const list2 = await call('lis/patients/list');
  return { list, create, list2 };
});
console.log('LIST:', result.list.status, result.list.body.slice(0, 200));
console.log('CREATE:', result.create.status, result.create.body.slice(0, 300));
console.log('LIST2:', result.list2.status, result.list2.body.slice(0, 300));
await browser.close();
