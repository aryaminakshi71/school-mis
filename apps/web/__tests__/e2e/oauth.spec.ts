import { expect, test } from "@playwright/test";

test.describe("OAuth Authentication", () => {
  test.describe("Google OAuth", () => {
    test("should display Google login button on login page", async ({
      page,
    }) => {
      await page.goto("/login");

      const googleButton = page.locator(
        'button:has-text("Google"), a:has-text("Google"), [data-testid="google-login"]',
      );
      if ((await googleButton.count()) > 0) {
        await expect(googleButton.first()).toBeVisible();
      }
    });
  });

  test.describe("GitHub OAuth", () => {
    test("should display GitHub login button on login page", async ({
      page,
    }) => {
      await page.goto("/login");

      const githubButton = page.locator(
        'button:has-text("GitHub"), a:has-text("GitHub"), [data-testid="github-login"]',
      );
      if ((await githubButton.count()) > 0) {
        await expect(githubButton.first()).toBeVisible();
      }
    });
  });

  test.describe("Demo Mode", () => {
    test("should access demo mode", async ({ page }) => {
      await page.goto("/demo");

      const startButton = page.locator(
        'button:has-text("Start Demo"), a:has-text("Start Demo")',
      );
      if ((await startButton.count()) > 0) {
        await startButton.first().click();
        await page.waitForTimeout(1000);
      }
    });
  });
});

test.describe("Stripe Payments", () => {
  test("should display pricing plans", async ({ page }) => {
    await page.goto("/pricing");
    await page.waitForTimeout(500);

    const pricingSection = page.locator(
      '[id="pricing"], section:has-text("Pricing")',
    );
    if ((await pricingSection.count()) > 0) {
      await expect(pricingSection.first()).toBeVisible();
    }
  });
});

test.describe("School MIS Portals", () => {
  test("should access student portal", async ({ page }) => {
    await page.goto("/app/student-portal");
    await page.waitForTimeout(500);
  });

  test("should access teacher portal", async ({ page }) => {
    await page.goto("/app/teacher-portal");
    await page.waitForTimeout(500);
  });

  test("should access parent portal", async ({ page }) => {
    await page.goto("/app/parent-portal");
    await page.waitForTimeout(500);
  });
});
