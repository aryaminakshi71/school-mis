/**
 * Students API Integration Tests
 *
 * In-process tests against the Hono app using the e2e schema.
 */

import { describe, expect, it } from "bun:test";
import { apiRequest } from "./test-helpers";

describe("Students API Integration", () => {
  describe("GET /api/students", () => {
    it("should return list of students", async () => {
      const res = await apiRequest("/api/students");
      expect(res.status).toBe(200);
      const data = (await res.json()) as any;
      expect(data.students).toBeDefined();
      expect(Array.isArray(data.students)).toBe(true);
      expect(data.pagination).toBeDefined();
    });

    it("should support pagination", async () => {
      const res = await apiRequest("/api/students?page=1&limit=10");
      const data = (await res.json()) as any;
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(10);
    });

    it("should support search", async () => {
      const res = await apiRequest("/api/students?search=john");
      expect(res.status).toBe(200);
      const data = (await res.json()) as any;
      expect(data.students).toBeDefined();
    });
  });

  describe("POST /api/students", () => {
    it("should create a new student", async () => {
      const newStudent = {
        firstName: "Test",
        lastName: "Student",
        email: `test-${Date.now()}@example.com`,
        phone: "1234567890",
        gender: "male",
        address: "123 Test St",
      };

      const res = await apiRequest("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      expect(res.status).toBe(200);
      const data = (await res.json()) as any;
      expect(data.id).toBeDefined();
      expect(data.firstName).toBe(newStudent.firstName);
    });

    it("should require authentication", async () => {
      const res = await apiRequest("/api/students", {
        method: "POST",
        auth: false,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: "Test" }),
      });

      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/students/:id", () => {
    it("should update student", async () => {
      const createRes = await apiRequest("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: "Update", lastName: "Test" }),
      });
      const student = (await createRes.json()) as any;

      const res = await apiRequest(`/api/students/${student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: "Updated" }),
      });

      expect(res.status).toBe(200);
      const data = (await res.json()) as any;
      expect(data.firstName).toBe("Updated");
    });
  });

  describe("DELETE /api/students/:id", () => {
    it("should delete student", async () => {
      const createRes = await apiRequest("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: "Delete", lastName: "Test" }),
      });
      const student = (await createRes.json()) as any;

      const res = await apiRequest(`/api/students/${student.id}`, {
        method: "DELETE",
      });

      expect(res.status).toBe(200);
      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
    });
  });
});
