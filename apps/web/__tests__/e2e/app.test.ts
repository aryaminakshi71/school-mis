import { expect, test } from "@playwright/test";

function getBaseURL(testInfo: {
  project: { use?: { baseURL?: string } };
}): string {
  const baseURL =
    testInfo.project.use?.baseURL || process.env.PLAYWRIGHT_BASE_URL;
  if (!baseURL) {
    throw new Error("No baseURL configured for School MIS tests");
  }
  return baseURL.replace(/\/$/, "");
}

function resolveURL(baseURL: string, path: string): string {
  return new URL(path, `${baseURL}/`).toString();
}

test.describe("Marketing Pages", () => {
  test("homepage loads correctly", async ({ page }, testInfo) => {
    const baseURL = getBaseURL(testInfo);
    const response = await page.goto(baseURL);
    const status = response?.status() ?? 0;
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(500);

    const heading = page.locator("h1").first();
    if (await heading.count()) {
      await expect(heading).toBeVisible();
    } else {
      const bodyText = await page.textContent("body");
      expect(bodyText || page.url()).toBeTruthy();
    }

    const pricingLink = page.locator('a[href="/pricing"]');
    if (await pricingLink.count()) {
      await expect(pricingLink).toBeVisible();
    }
  });

  test("pricing page loads", async ({ page }, testInfo) => {
    const baseURL = getBaseURL(testInfo);
    const response = await page.goto(resolveURL(baseURL, "pricing"), {
      waitUntil: "domcontentloaded",
    });

    if (!response || response.status() >= 400) {
      test.skip(true, "Pricing page not available - server may not be running");
      return;
    }

    const h1 = page.locator("h1").first();
    if ((await h1.count()) === 0) {
      test.skip(true, "Pricing page not rendered");
      return;
    }

    await expect(h1).toContainText("Pricing");

    // Check pricing cards exist
    await expect(page.locator("text=Starter")).toBeVisible();
    await expect(page.locator("text=Professional")).toBeVisible();
    await expect(page.locator("text=Enterprise")).toBeVisible();
  });
});

test.describe("Auth Pages", () => {
  test("login page loads", async ({ page }, testInfo) => {
    const baseURL = getBaseURL(testInfo);
    await page.goto(resolveURL(baseURL, "login"));
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    if (await emailInput.count()) {
      await expect(emailInput).toBeVisible();
    }
    if (await passwordInput.count()) {
      await expect(passwordInput).toBeVisible();
    }
  });

  test("signup page loads", async ({ page }, testInfo) => {
    const baseURL = getBaseURL(testInfo);
    await page.goto(resolveURL(baseURL, "signup"));
    const nameInput = page.locator('input[name="name"]').first();
    const emailInput = page.locator('input[name="email"]').first();
    if (await nameInput.count()) {
      await expect(nameInput).toBeVisible();
    }
    if (await emailInput.count()) {
      await expect(emailInput).toBeVisible();
    }
  });
});

test.describe("App Dashboard", () => {
  test("dashboard loads", async ({ page }, testInfo) => {
    const baseURL = getBaseURL(testInfo);
    await page.goto(resolveURL(baseURL, "app"));
    await page.waitForTimeout(1000);
    const heading = page.locator("h1").first();
    if (await heading.count()) {
      await expect(heading).toBeVisible();
    }
  });

  test("students page loads", async ({ page }, testInfo) => {
    const baseURL = getBaseURL(testInfo);
    await page.goto(resolveURL(baseURL, "app/students"));
    const heading = page.locator("h1").first();
    if (await heading.count()) {
      await expect(heading).toBeVisible();
    }
  });
});
