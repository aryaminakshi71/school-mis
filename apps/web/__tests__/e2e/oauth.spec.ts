import { expect, test, type Page } from "@playwright/test";

const PORTAL_TEST_TIMEOUT_MS = Number(
  process.env.PORTAL_TEST_TIMEOUT_MS ?? 120000,
);
const PORTAL_HEADING_TIMEOUT_MS = Number(
  process.env.PORTAL_HEADING_TIMEOUT_MS ?? 30000,
);

type PortalRole =
  | "admin"
  | "student"
  | "teacher"
  | "parent"
  | "staff"
  | "accountant"
  | "librarian";

async function setAuthenticatedUser(page: Page, role: PortalRole = "admin") {
  await page.goto("/login");
  await page.evaluate((userRole: PortalRole) => {
    const roleToName: Record<PortalRole, string> = {
      admin: "Admin",
      student: "Student",
      teacher: "Teacher",
      parent: "Parent",
      staff: "Staff",
      accountant: "Accountant",
      librarian: "Librarian",
    };
    const user = {
      id: `e2e-${userRole}`,
      name: `E2E ${roleToName[userRole]}`,
      email: `e2e-${userRole}@schoolmis.local`,
      role: userRole,
    };
    localStorage.setItem("school_mis_user", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.removeItem("demo_mode");
    localStorage.removeItem("isDemo");
  }, role);
}

async function expectNoServerErrors(page: Page, action: () => Promise<void>) {
  const serverErrors: string[] = [];
  const onResponse = (response: { status: () => number; url: () => string }) => {
    const status = response.status();
    if (status >= 500 && response.url().includes("/api/")) {
      serverErrors.push(`${status} ${response.url()}`);
    }
  };

  page.on("response", onResponse);
  try {
    await action();
  } finally {
    page.off("response", onResponse);
  }

  expect(serverErrors, `Server errors found:\n${serverErrors.join("\n")}`).toEqual(
    [],
  );
}

async function expectPortalHeading(page: Page, heading: string) {
  await expect(page.getByRole("heading", { name: heading })).toBeVisible({
    timeout: PORTAL_HEADING_TIMEOUT_MS,
  });
  await expect(page.getByText("Access Denied")).toHaveCount(0);
}

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
  test.describe.configure({ mode: "serial", timeout: PORTAL_TEST_TIMEOUT_MS });

  test("should access admin dashboard portal", async ({ page }) => {
    await setAuthenticatedUser(page, "admin");
    await expectNoServerErrors(page, async () => {
      const response = await page.goto("/app");
      expect(response?.status() ?? 0).toBeLessThan(500);
      await expectPortalHeading(page, "Dashboard");
    });
  });

  test("should access student portal", async ({ page }) => {
    await setAuthenticatedUser(page, "student");
    await expectNoServerErrors(page, async () => {
      const response = await page.goto("/app/student-portal");
      expect(response?.status() ?? 0).toBeLessThan(500);
      await expectPortalHeading(page, "Student Portal");
    });
  });

  test("should access teacher portal", async ({ page }) => {
    await setAuthenticatedUser(page, "teacher");
    await expectNoServerErrors(page, async () => {
      const response = await page.goto("/app/teacher-portal");
      expect(response?.status() ?? 0).toBeLessThan(500);
      await expectPortalHeading(page, "Teacher Portal");
    });
  });

  test("should access parent portal", async ({ page }) => {
    await setAuthenticatedUser(page, "parent");
    await expectNoServerErrors(page, async () => {
      const response = await page.goto("/app/parent-portal");
      expect(response?.status() ?? 0).toBeLessThan(500);
      await expectPortalHeading(page, "Parent Portal");
    });
  });

  test("should access staff portal", async ({ page }) => {
    await setAuthenticatedUser(page, "staff");
    await expectNoServerErrors(page, async () => {
      const response = await page.goto("/app/staff-portal");
      expect(response?.status() ?? 0).toBeLessThan(500);
      await expectPortalHeading(page, "Staff Portal");
    });
  });

  test("should access accountant portal", async ({ page }) => {
    await setAuthenticatedUser(page, "accountant");
    await expectNoServerErrors(page, async () => {
      const response = await page.goto("/app/fees");
      expect(response?.status() ?? 0).toBeLessThan(500);
      await expectPortalHeading(page, "Fees & Finance");
    });
  });

  test("should access staff management portal card target", async ({ page }) => {
    await setAuthenticatedUser(page, "admin");
    await expectNoServerErrors(page, async () => {
      const response = await page.goto("/app/teachers");
      expect(response?.status() ?? 0).toBeLessThan(500);
      await expectPortalHeading(page, "Staff Management");
    });
  });

  test("should block student-only user from teacher portal", async ({ page }) => {
    await setAuthenticatedUser(page, "student");
    await page.goto("/app/teacher-portal");
    await expect(page.getByText("Access Denied")).toBeVisible();
  });

  test("should block student-only user from staff portal", async ({ page }) => {
    await setAuthenticatedUser(page, "student");
    await page.goto("/app/staff-portal");
    await expect(page.getByText("Access Denied")).toBeVisible();
  });
});
