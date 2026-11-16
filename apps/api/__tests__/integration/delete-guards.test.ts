import { beforeAll, describe, expect, it } from "bun:test";
import {
  apiRequest,
  ensureAttendanceFixture,
  withTestSql,
} from "./test-helpers";

beforeAll(async () => {
  await ensureAttendanceFixture();
}, 20000);

describe("Delete guard API Integration", () => {
  it("blocks deleting a class when students still belong to it", async () => {
    const studentsRes = await apiRequest("/api/students?limit=1");
    expect(studentsRes.status).toBe(200);

    const studentsBody = (await studentsRes.json()) as {
      students: Array<{ classId?: string | null }>;
    };

    const classId = studentsBody.students[0]?.classId;
    expect(classId).toBeTruthy();

    const res = await apiRequest(`/api/classes/${classId}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(409);

    const body = (await res.json()) as {
      error: string;
      dependencies: Record<string, number>;
    };

    expect(body.error).toContain("Cannot delete class");
    expect(body.dependencies.students).toBeGreaterThan(0);
  }, 20000);

  it("blocks deleting a student when attendance records exist", async () => {
    const studentsRes = await apiRequest("/api/students?limit=1");
    expect(studentsRes.status).toBe(200);

    const studentsBody = (await studentsRes.json()) as {
      students: Array<{ id: string }>;
    };

    const studentId = studentsBody.students[0]?.id;
    expect(studentId).toBeTruthy();

    const res = await apiRequest(`/api/students/${studentId}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(409);

    const body = (await res.json()) as {
      error: string;
      dependencies: Record<string, number>;
    };

    expect(body.error).toContain("Cannot delete student");
    expect(body.dependencies.attendance).toBeGreaterThan(0);
  }, 20000);

  it("blocks deleting a teacher when subjects still reference them", async () => {
    await withTestSql(async (sql) => {
      await sql.unsafe(`
        CREATE TABLE IF NOT EXISTS "teachers" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "employee_id" text UNIQUE,
          "first_name" text NOT NULL,
          "last_name" text NOT NULL,
          "email" text UNIQUE,
          "phone" text,
          "qualification" text,
          "subject_specialization" text,
          "status" boolean DEFAULT true,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
        )
      `);

      await sql.unsafe(`
        CREATE TABLE IF NOT EXISTS "subjects" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "name" text NOT NULL,
          "code" text UNIQUE,
          "class_id" uuid,
          "teacher_id" uuid,
          "is_active" boolean DEFAULT true,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
        )
      `);

      await sql.unsafe(`
        INSERT INTO "teachers" (
          "id", "employee_id", "first_name", "last_name", "email", "status"
        ) VALUES (
          '55555555-5555-5555-5555-555555555555',
          'TCH-555555',
          'Delete',
          'Blocked',
          'delete-blocked@example.edu',
          true
        )
        ON CONFLICT ("id") DO NOTHING
      `);

      await sql.unsafe(`
        INSERT INTO "subjects" (
          "id", "name", "code", "teacher_id", "is_active"
        ) VALUES (
          '66666666-6666-6666-6666-666666666666',
          'Protected Subject',
          'PRT-1',
          '55555555-5555-5555-5555-555555555555',
          true
        )
        ON CONFLICT ("id") DO NOTHING
      `);
    });

    const res = await apiRequest(
      "/api/teachers/55555555-5555-5555-5555-555555555555",
      { method: "DELETE" },
    );
    expect(res.status).toBe(409);

    const body = (await res.json()) as {
      error: string;
      dependencies: Record<string, number>;
    };

    expect(body.error).toContain("Cannot delete teacher");
    expect(body.dependencies.subjects).toBeGreaterThan(0);
  }, 20000);
});
