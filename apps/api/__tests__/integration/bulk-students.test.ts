import { beforeAll, describe, expect, it } from "bun:test";
import {
  apiRequest,
  ensureAttendanceFixture,
  withTestSql,
} from "./test-helpers";

beforeAll(async () => {
  await ensureAttendanceFixture();

  await withTestSql(async (sql) => {
    await sql.unsafe(`
      INSERT INTO "classes" (
        "id", "name", "section", "session_id", "capacity"
      ) VALUES (
        '44444444-4444-4444-4444-444444444444',
        'Class 11',
        'B',
        '11111111-1111-1111-1111-111111111111',
        42
      )
      ON CONFLICT ("id") DO NOTHING
    `);
  });
}, 20000);

describe("Bulk student API Integration", () => {
  it("bulk assigns students to a class", async () => {
    const studentsRes = await apiRequest("/api/students?limit=5");
    expect(studentsRes.status).toBe(200);

    const studentsBody = (await studentsRes.json()) as {
      students: Array<{ id: string }>;
    };

    const studentIds = studentsBody.students
      .slice(0, 1)
      .map((student) => student.id);
    expect(studentIds.length).toBeGreaterThan(0);

    const assignRes = await apiRequest("/api/students/bulk/assign-class", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentIds,
        classId: "44444444-4444-4444-4444-444444444444",
      }),
    });

    expect(assignRes.status).toBe(200);
    const assignBody = (await assignRes.json()) as {
      success: boolean;
      assigned: number;
      class: { id: string; name: string };
    };
    expect(assignBody.success).toBe(true);
    expect(assignBody.assigned).toBe(studentIds.length);
    expect(assignBody.class.id).toBe("44444444-4444-4444-4444-444444444444");

    const refreshedRes = await apiRequest("/api/students?limit=5");
    expect(refreshedRes.status).toBe(200);
    const refreshedBody = (await refreshedRes.json()) as {
      students: Array<{
        id: string;
        classId?: string | null;
        className?: string | null;
      }>;
    };

    const movedStudent = refreshedBody.students.find(
      (student) => student.id === studentIds[0],
    );
    expect(movedStudent?.classId).toBe("44444444-4444-4444-4444-444444444444");
    expect(movedStudent?.className).toBe("Class 11");
  }, 20000);
});
