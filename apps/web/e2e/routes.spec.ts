import { expect, test } from "@playwright/test";
import { checkPageLoaded, login, navigateTo } from "./helpers";

test.describe("School MIS - Route Navigation", () => {
  test("should navigate to all public pages", async ({ page }) => {
    const publicRoutes = [
      "/",
      "/about",
      "/features",
      "/pricing",
      "/blog",
      "/terms",
      "/privacy",
      "/security",
    ];

    for (const route of publicRoutes) {
      await navigateTo(page, route);
      await checkPageLoaded(page);
      console.log(`✓ ${route} loaded successfully`);
    }
  });

  test("should navigate to auth pages", async ({ page }) => {
    const authRoutes = ["/login", "/signup", "/register"];

    for (const route of authRoutes) {
      await navigateTo(page, route);
      await checkPageLoaded(page);
      console.log(`✓ ${route} loaded successfully`);
    }
  });
});

test.describe("School MIS - Dashboard Routes", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "admin@school.edu", "admin123");
  });

  test("should navigate to dashboard", async ({ page }) => {
    await navigateTo(page, "/app");
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });

  test("should navigate to all main modules", async ({ page }) => {
    const modules = [
      { route: "/app/students", title: "Students" },
      { route: "/app/teachers", title: "Staff" },
      { route: "/app/classes", title: "Classes" },
      { route: "/app/attendance", title: "Attendance" },
      { route: "/app/exams", title: "Exams" },
      { route: "/app/fees", title: "Fees" },
      { route: "/app/library", title: "Library" },
      { route: "/app/transport", title: "Transport" },
      { route: "/app/inventory", title: "Inventory" },
      { route: "/app/reports", title: "Reports" },
      { route: "/app/timetable", title: "Timetable" },
      { route: "/app/chat", title: "Chat" },
      { route: "/app/monitoring", title: "Monitoring" },
    ];

    for (const { route, title } of modules) {
      await navigateTo(page, route);
      await expect(
        page
          .locator(`h1:has-text("${title}"), h2:has-text("${title}")`)
          .first(),
      ).toBeVisible();
      console.log(`✓ ${route} - ${title} module loaded`);
    }
  });

  test("should navigate to attendance sub-routes", async ({ page }) => {
    const attendanceRoutes = [
      "/app/attendance/students",
      "/app/attendance/staff",
      "/app/attendance/leave",
      "/app/attendance/reports",
    ];

    for (const route of attendanceRoutes) {
      await navigateTo(page, route);
      await checkPageLoaded(page);
      console.log(`✓ ${route} loaded`);
    }
  });

  test("should navigate to exams sub-routes", async ({ page }) => {
    const examRoutes = [
      "/app/exams/schedule",
      "/app/exams/marks",
      "/app/exams/results",
      "/app/exams/halls",
    ];

    for (const route of examRoutes) {
      await navigateTo(page, route);
      await checkPageLoaded(page);
      console.log(`✓ ${route} loaded`);
    }
  });

  test("should navigate to fees sub-routes", async ({ page }) => {
    const feeRoutes = [
      "/app/fees/structure",
      "/app/fees/collection",
      "/app/fees/reports",
      "/app/fees/expenses",
    ];

    for (const route of feeRoutes) {
      await navigateTo(page, route);
      await checkPageLoaded(page);
      console.log(`✓ ${route} loaded`);
    }
  });

  test("should navigate to student sub-routes", async ({ page }) => {
    const studentRoutes = [
      "/app/students/admission",
      "/app/students/attendance",
      "/app/students/performance",
    ];

    for (const route of studentRoutes) {
      await navigateTo(page, route);
      await checkPageLoaded(page);
      console.log(`✓ ${route} loaded`);
    }
  });

  test("should navigate to teacher sub-routes", async ({ page }) => {
    const teacherRoutes = [
      "/app/teachers/attendance",
      "/app/teachers/leave",
      "/app/teachers/payroll",
    ];

    for (const route of teacherRoutes) {
      await navigateTo(page, route);
      await checkPageLoaded(page);
      console.log(`✓ ${route} loaded`);
    }
  });

  test("should navigate to portal routes", async ({ page }) => {
    const portals = [
      "/app/parent-portal",
      "/app/student-portal",
      "/app/teacher-portal",
      "/app/staff-portal",
    ];

    for (const route of portals) {
      await navigateTo(page, route);
      await checkPageLoaded(page);
      console.log(`✓ ${route} loaded`);
    }
  });

  test("should navigate to settings and profile", async ({ page }) => {
    await navigateTo(page, "/app/settings");
    await expect(page.locator("text=Settings")).toBeVisible();

    await navigateTo(page, "/app/profile");
    await expect(page.locator("text=Profile")).toBeVisible();
  });
});

test.describe("School MIS - API Endpoints", () => {
  test("should check health endpoint", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  test("should check API docs", async ({ request }) => {
    const response = await request.get("/api/openapi.json");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.info.title).toBe("School MIS API");
  });
});

test.describe("School MIS - UI Components", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("should display sidebar navigation", async ({ page }) => {
    await navigateTo(page, "/app");
    await expect(page.locator("[data-testid='sidebar']")).toBeVisible();

    // Check all main nav items
    const navItems = [
      "Dashboard",
      "Students",
      "Staff",
      "Classes",
      "Attendance",
      "Exams",
      "Fees",
      "Library",
      "Transport",
    ];

    for (const item of navItems) {
      await expect(
        page.locator(`[data-testid='sidebar'] >> text=${item}`),
      ).toBeVisible();
    }
  });

  test("should display command palette with Cmd+K", async ({ page }) => {
    await navigateTo(page, "/app");

    // Open command palette
    await page.keyboard.press("Meta+k");

    // Check if it opened
    await expect(page.locator("[role='dialog']")).toBeVisible();
    await expect(page.locator("text=Type a command or search")).toBeVisible();

    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(page.locator("[role='dialog']")).not.toBeVisible();
  });

  test("should display quick actions widget", async ({ page }) => {
    await navigateTo(page, "/app");

    // Check floating action button
    await expect(page.locator("[data-testid='quick-actions']")).toBeVisible();

    // Click to expand
    await page.click("[data-testid='quick-actions']");

    // Check actions visible
    await expect(page.locator("text=Add Student")).toBeVisible();
    await expect(page.locator("text=Mark Attendance")).toBeVisible();
  });

  test("should display toast notifications", async ({ page }) => {
    await navigateTo(page, "/app");

    // Trigger an action that shows toast (if available)
    // Or check if toast container exists
    await expect(page.locator("[data-testid='toast-container']")).toBeVisible();
  });

  test("should toggle dark mode", async ({ page }) => {
    await navigateTo(page, "/app");

    // Check initial theme
    const initialTheme = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );

    // Open command palette and toggle theme
    await page.keyboard.press("Meta+k");
    await page.click("text=Switch to Dark Mode");

    // Verify theme changed
    const newTheme = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(newTheme).not.toBe(initialTheme);
  });
});

test.describe("School MIS - Responsive Design", () => {
  const viewports = [
    { name: "Mobile", width: 375, height: 667 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Desktop", width: 1920, height: 1080 },
  ];

  for (const { name, width, height } of viewports) {
    test(`should render correctly on ${name} (${width}x${height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await login(page);
      await navigateTo(page, "/app");

      // Check no horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(overflow).toBe(false);

      // Check main content visible
      await expect(page.locator("main")).toBeVisible();

      console.log(`✓ Responsive on ${name}`);
    });
  }
});

test.describe("School MIS - Accessibility", () => {
  test("should be keyboard navigable", async ({ page }) => {
    await login(page);
    await navigateTo(page, "/app");

    // Press Tab to navigate
    await page.keyboard.press("Tab");

    // Check focus is visible
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName,
    );
    expect(focusedElement).not.toBe("BODY");
  });

  test("should have proper ARIA labels", async ({ page }) => {
    await login(page);
    await navigateTo(page, "/app/students");

    // Check table has proper labels
    const table = page.locator("table").first();
    await expect(table).toHaveAttribute("role", "table");
  });
});
