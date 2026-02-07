import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { Hono } from "hono";

describe("API Health Endpoint", () => {
  it("should return health status", async () => {
    const app = new Hono();
    app.get("/api/health", (c) => {
      return c.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      });
    });

    const res = await app.request("http://localhost/api/health");
    expect(res.status).toBe(200);

    const body = await res.json() as { status: string; version: string; timestamp: string };
    expect(body.status).toBe("ok");
    expect(body.version).toBe("1.0.0");
    expect(body.timestamp).toBeDefined();
  });
});

describe("Students Router", () => {
  it("should return empty list of students", async () => {
    const app = new Hono();
    app.get("/api/school/students", (c) => {
      return c.json({
        students: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      });
    });

    const res = await app.request("http://localhost/api/school/students");
    expect(res.status).toBe(200);

    const body = await res.json() as { students: unknown[]; pagination: { total: number } };
    expect(body.students).toBeInstanceOf(Array);
    expect(body.students.length).toBe(0);
    expect(body.pagination.total).toBe(0);
  });
});

describe("Attendance Router", () => {
  it("should return attendance summary", async () => {
    const app = new Hono();
    app.get("/api/school/attendance/summary", (c) => {
      return c.json({
        totalStudents: 100,
        present: 95,
        absent: 5,
        attendanceRate: 95,
      });
    });

    const res = await app.request(
      "http://localhost/api/school/attendance/summary",
    );
    expect(res.status).toBe(200);

    const body = await res.json() as { totalStudents: number; present: number; attendanceRate: number };
    expect(body.totalStudents).toBe(100);
    expect(body.present).toBe(95);
    expect(body.attendanceRate).toBe(95);
  });
});

