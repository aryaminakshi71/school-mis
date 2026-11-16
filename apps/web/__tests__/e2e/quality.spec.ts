import AxeBuilder from "@axe-core/playwright";
import { type Page, type TestInfo, expect, test } from "@playwright/test";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const DCL_BUDGET_MS = Number(process.env.PERF_DCL_BUDGET_MS ?? 5000);
const LOAD_BUDGET_MS = Number(process.env.PERF_LOAD_BUDGET_MS ?? 9000);
const LIGHTHOUSE_PERF_MIN = Number(process.env.LH_MIN_PERFORMANCE ?? 0.25);
const LIGHTHOUSE_ACCESSIBILITY_MIN = Number(
  process.env.LH_MIN_ACCESSIBILITY ?? 0.85,
);
const LIGHTHOUSE_BEST_PRACTICES_MIN = Number(
  process.env.LH_MIN_BEST_PRACTICES ?? 0.85,
);
const LIGHTHOUSE_SEO_MIN = Number(process.env.LH_MIN_SEO ?? 0.55);
const LIGHTHOUSE_TEST_TIMEOUT_MS = Number(
  process.env.LH_TEST_TIMEOUT_MS ?? 120000,
);
const A11Y_PORTALS_TEST_TIMEOUT_MS = Number(
  process.env.A11Y_PORTALS_TEST_TIMEOUT_MS ?? 120000,
);
const A11Y_MAX_SERIOUS_VIOLATIONS = Number(
  process.env.A11Y_MAX_SERIOUS_VIOLATIONS ?? 0,
);
const A11Y_CHECK_COLOR_CONTRAST = process.env.A11Y_CHECK_COLOR_CONTRAST === "1";

type PortalRole =
  | "admin"
  | "student"
  | "teacher"
  | "parent"
  | "staff"
  | "accountant"
  | "librarian";

function getBaseUrl(testInfo: TestInfo): string {
  const baseURL = testInfo.project.use.baseURL;
  if (!baseURL || typeof baseURL !== "string") {
    throw new Error("Playwright baseURL is required for quality gates.");
  }
  return baseURL;
}

async function runLighthouseAudit(url: string) {
  const chrome = await launch({
    chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    });
    const lhr = runnerResult?.lhr;
    if (!lhr) throw new Error(`Lighthouse did not produce report for ${url}`);
    return {
      performance: lhr.categories.performance?.score ?? 0,
      accessibility: lhr.categories.accessibility?.score ?? 0,
      bestPractices: lhr.categories["best-practices"]?.score ?? 0,
      seo: lhr.categories.seo?.score ?? 0,
    };
  } finally {
    await chrome.kill();
  }
}

async function setAuthenticatedUser(page: Page, role: PortalRole) {
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

async function assertNoSeriousA11yViolations(page: Page, label: string) {
  const builder = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]);
  const results = await (A11Y_CHECK_COLOR_CONTRAST
    ? builder
    : builder.disableRules(["color-contrast"])
  ).analyze();

  const seriousViolations = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact || ""),
  );

  if (seriousViolations.length > A11Y_MAX_SERIOUS_VIOLATIONS) {
    const details = seriousViolations
      .map((v) => {
        const firstNode = v.nodes[0];
        const target = firstNode?.target?.join(" ") ?? "unknown-target";
        return `${v.id}(${v.impact})@${target}`;
      })
      .join(", ");
    throw new Error(
      `[a11y] ${label} has serious/critical violations: ${details}`,
    );
  }
}

test.describe("Quality Gates", () => {
  test("homepage should meet baseline performance budget", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status() ?? 0).toBeLessThan(500);

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (nav) {
        return {
          domContentLoadedMs: nav.domContentLoadedEventEnd - nav.startTime,
          loadMs: nav.loadEventEnd - nav.startTime,
        };
      }
      return {
        domContentLoadedMs: 0,
        loadMs: 0,
      };
    });

    expect(metrics.domContentLoadedMs).toBeGreaterThan(0);
    expect(metrics.loadMs).toBeGreaterThan(0);
    expect(metrics.domContentLoadedMs).toBeLessThan(DCL_BUDGET_MS);
    expect(metrics.loadMs).toBeLessThan(LOAD_BUDGET_MS);
  });

  test("public pages should pass Lighthouse thresholds", async ({}, testInfo) => {
    test.setTimeout(LIGHTHOUSE_TEST_TIMEOUT_MS);
    const baseUrl = getBaseUrl(testInfo);
    for (const route of ["/", "/login"]) {
      const url = new URL(route, baseUrl).toString();
      const scores = await runLighthouseAudit(url);
      expect(scores.performance).toBeGreaterThanOrEqual(LIGHTHOUSE_PERF_MIN);
      expect(scores.accessibility).toBeGreaterThanOrEqual(
        LIGHTHOUSE_ACCESSIBILITY_MIN,
      );
      expect(scores.bestPractices).toBeGreaterThanOrEqual(
        LIGHTHOUSE_BEST_PRACTICES_MIN,
      );
      expect(scores.seo).toBeGreaterThanOrEqual(LIGHTHOUSE_SEO_MIN);
    }
  });

  test("login page should keep baseline accessibility semantics", async ({
    page,
  }) => {
    const response = await page.goto("/login");
    expect(response?.status() ?? 0).toBeLessThan(500);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();

    await page.keyboard.press("Tab");
    const activeTag = await page.evaluate(
      () => document.activeElement?.tagName?.toLowerCase() || "",
    );
    expect(activeTag).not.toBe("");
    await assertNoSeriousA11yViolations(page, "/login");
  });

  test("key portal pages should pass serious accessibility gate", async ({
    page,
  }) => {
    test.setTimeout(A11Y_PORTALS_TEST_TIMEOUT_MS);
    const portalCases: Array<{
      role: PortalRole;
      route: string;
      heading: string;
    }> = [
      { role: "admin", route: "/app", heading: "Dashboard" },
      {
        role: "student",
        route: "/app/student-portal",
        heading: "Student Portal",
      },
      { role: "staff", route: "/app/staff-portal", heading: "Staff Portal" },
    ];

    for (const portalCase of portalCases) {
      await setAuthenticatedUser(page, portalCase.role);
      const response = await page.goto(portalCase.route);
      expect(response?.status() ?? 0).toBeLessThan(500);
      await expect(
        page.getByRole("heading", { name: portalCase.heading }),
      ).toBeVisible({ timeout: 15000 });
      await expect(page.getByText("Access Denied")).toHaveCount(0);
      await assertNoSeriousA11yViolations(page, portalCase.route);
    }
  });
});
