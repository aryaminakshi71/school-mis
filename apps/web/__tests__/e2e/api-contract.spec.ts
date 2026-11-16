import { expect, test } from "@playwright/test";

const API_ENDPOINTS = [
  "/api/health",
  "/api/students?limit=1",
  "/api/teachers",
  "/api/classes",
  "/api/fees",
];

test.describe("API Contract", () => {
  for (const endpoint of API_ENDPOINTS) {
    test(`should return non-5xx for ${endpoint}`, async ({ request }) => {
      const response = await request.get(endpoint);
      const status = response.status();
      expect(status, `${endpoint} returned ${status}`).toBeGreaterThanOrEqual(
        200,
      );
      expect(status, `${endpoint} returned ${status}`).toBeLessThan(500);
    });
  }
});
