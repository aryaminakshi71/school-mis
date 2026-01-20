import { test, expect } from "@playwright/test";

test.describe("Marketing Pages", () => {
  test("homepage loads correctly", async ({ page }) => {
    await page.goto("http://localhost:3001/");
    await expect(page).toHaveTitle(/School MIS/);

    // Check hero section
    await expect(page.locator("h1")).toContainText("School Management System");

    // Check navigation
    await expect(page.locator('a[href="/features"]')).toBeVisible();
    await expect(page.locator('a[href="/pricing"]')).toBeVisible();
  });

  test("features page loads", async ({ page }) => {
    await page.goto("http://localhost:3001/features");
    await expect(page.locator("h1")).toContainText("Features");
  });

  test("pricing page loads with toggle", async ({ page }) => {
    await page.goto("http://localhost:3001/pricing");
    await expect(page.locator("h1")).toContainText("Pricing");

    // Check pricing cards exist
    await expect(page.locator("text=Starter")).toBeVisible();
    await expect(page.locator("text=Professional")).toBeVisible();
    await expect(page.locator("text=Enterprise")).toBeVisible();
  });

  test("FAQ page loads", async ({ page }) => {
    await page.goto("http://localhost:3001/faq");
    await expect(page.locator("h1")).toContainText("FAQ");
  });

  test("about page loads", async ({ page }) => {
    await page.goto("http://localhost:3001/about");
    await expect(page.locator("h1")).toContainText("About");
  });
});

test.describe("Auth Pages", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("http://localhost:3001/login");
    await expect(page.locator("h1")).toContainText("Welcome back");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("signup page loads", async ({ page }) => {
    await page.goto("http://localhost:3001/signup");
    await expect(page.locator("h1")).toContainText("Create your account");
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test("forgot password page loads", async ({ page }) => {
    await page.goto("http://localhost:3001/forgot-password");
    await expect(page.locator("h1")).toContainText("Forgot password");
  });
});

test.describe("App Dashboard", () => {
  test("dashboard loads", async ({ page }) => {
    await page.goto("http://localhost:3001/app");
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("students page loads", async ({ page }) => {
    await page.goto("http://localhost:3001/app/students");
    await expect(page.locator("h1")).toContainText("Students");
  });
});

test.describe("Legal Pages", () => {
  test("privacy page loads", async ({ page }) => {
    await page.goto("http://localhost:3001/privacy");
    await expect(page.locator("h1")).toContainText("Privacy Policy");
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("http://localhost:3001/terms");
    await expect(page.locator("h1")).toContainText("Terms of Service");
  });
});
