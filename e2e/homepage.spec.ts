import { expect, test } from "@playwright/test";

test.describe("School MIS", () => {
  test("should load homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/School/i);
  });
});
