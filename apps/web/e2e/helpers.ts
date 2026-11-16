import { Page, expect } from "@playwright/test";

export async function navigateTo(page: Page, route: string) {
  await page.goto(route);
  await page.waitForLoadState("networkidle");
}

export async function login(
  page: Page,
  email = "admin@school.edu",
  password = "admin123",
) {
  await navigateTo(page, "/login");

  // Fill login form
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);

  // Submit
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL("**/app/**");

  // Verify logged in
  await expect(page.locator("text=Dashboard")).toBeVisible();
}

export async function checkPageLoaded(page: Page) {
  // Check no 404
  await expect(page.locator("text=404")).not.toBeVisible();

  // Check no error
  await expect(page.locator("text=Error")).not.toBeVisible();

  // Check page loaded (has content)
  const bodyText = await page.locator("body").textContent();
  expect(bodyText?.length).toBeGreaterThan(100);
}

export async function waitForToast(page: Page, message: string) {
  await expect(page.locator(`text=${message}`)).toBeVisible();
}

export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `./e2e/screenshots/${name}.png`,
    fullPage: true,
  });
}

export async function fillForm(page: Page, fields: Record<string, string>) {
  for (const [selector, value] of Object.entries(fields)) {
    await page.fill(selector, value);
  }
}

export async function selectOption(
  page: Page,
  selector: string,
  option: string,
) {
  await page.click(selector);
  await page.click(`text=${option}`);
}

export async function checkApiResponse(
  page: Page,
  url: string,
  expectedStatus: number = 200,
) {
  const response = await page.waitForResponse((response) =>
    response.url().includes(url),
  );
  expect(response.status()).toBe(expectedStatus);
}
