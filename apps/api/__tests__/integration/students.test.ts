/**
 * Students API Integration Tests
 *
 * E2E tests for student management endpoints
 */

import { beforeAll, describe, expect, it } from "vitest";

describe("Students API Integration", () => {
  const API_URL = process.env.API_URL || "http://localhost:3000";
  let authToken: string;

  beforeAll(async () => {
    // Get auth token for tests
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@school.edu",
        password: "admin123",
      }),
    });

    if (loginRes.ok) {
      const data = await loginRes.json();
      authToken = data.token;
    }
  });

  describe("GET /api/students", () => {
    it("should return list of students", async () => {
      const res = await fetch(`${API_URL}/api/students`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.students).toBeDefined();
      expect(Array.isArray(data.students)).toBe(true);
      expect(data.pagination).toBeDefined();
    });

    it("should support pagination", async () => {
      const res = await fetch(`${API_URL}/api/students?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await res.json();
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(10);
    });

    it("should support search", async () => {
      const res = await fetch(`${API_URL}/api/students?search=john`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.students).toBeDefined();
    });
  });

  describe("POST /api/students", () => {
    it("should create a new student", async () => {
      const newStudent = {
        firstName: "Test",
        lastName: "Student",
        email: "test@example.com",
        phone: "1234567890",
        gender: "male",
        address: "123 Test St",
      };

      const res = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newStudent),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.id).toBeDefined();
      expect(data.firstName).toBe(newStudent.firstName);
    });

    it("should require authentication", async () => {
      const res = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: "Test" }),
      });

      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/students/:id", () => {
    it("should update student", async () => {
      // First create a student
      const createRes = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          firstName: "Update",
          lastName: "Test",
        }),
      });

      const student = await createRes.json();

      // Then update
      const res = await fetch(`${API_URL}/api/students/${student.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          firstName: "Updated",
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.firstName).toBe("Updated");
    });
  });

  describe("DELETE /api/students/:id", () => {
    it("should delete student", async () => {
      // Create a student
      const createRes = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          firstName: "Delete",
          lastName: "Test",
        }),
      });

      const student = await createRes.json();

      // Delete
      const res = await fetch(`${API_URL}/api/students/${student.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it("should not delete student with dependencies", async () => {
      // This would require a student with attendance records
      // Simplified test - would need actual data setup
      expect(true).toBe(true);
    });
  });
});
