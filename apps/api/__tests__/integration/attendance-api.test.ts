import { beforeAll, describe, expect, it } from "bun:test";
import { apiRequest, ensureAttendanceFixture } from "./test-helpers";

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

beforeAll(async () => {
  await ensureAttendanceFixture();
}, 20000);

describe("Attendance API Integration", () => {
  it("returns attendance history from a single bulk endpoint", async () => {
    const res = await apiRequest("/api/attendance/history?days=21");
    expect(res.status).toBe(200);

    const body = (await res.json()) as {
      attendance: Array<{
        id: string;
        studentId: string;
        classId?: string;
        date: string;
        status: string;
        studentName?: string;
        className?: string;
      }>;
    };

    expect(Array.isArray(body.attendance)).toBe(true);

    if (body.attendance.length > 0) {
      const first = body.attendance[0];
      expect(first.id).toBeTruthy();
      expect(first.studentId).toBeTruthy();
      expect(first.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(first.status).toBeTruthy();
    }
  }, 20000);

  it("saves attendance and can read it back via date + history endpoints", async () => {
    const studentsRes = await apiRequest("/api/students?limit=1");
    expect(studentsRes.status).toBe(200);
    const studentsBody = (await studentsRes.json()) as {
      students: Array<{ id: string; classId?: string | null }>;
    };

    const student = studentsBody.students[0];
    expect(student?.id).toBeTruthy();
    expect(student?.classId).toBeTruthy();

    const today = formatLocalDate(new Date());
    const postRes = await apiRequest("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: today,
        records: [
          {
            studentId: student.id,
            classId: student.classId,
            status: "present",
            remarks: "attendance-api-test",
          },
        ],
      }),
    });

    expect(postRes.status).toBe(200);
    const postBody = (await postRes.json()) as {
      success: boolean;
      saved: number;
    };
    expect(postBody.success).toBe(true);
    expect(postBody.saved).toBeGreaterThanOrEqual(1);

    const byDateRes = await apiRequest(
      `/api/attendance?date=${encodeURIComponent(today)}`,
    );
    expect(byDateRes.status).toBe(200);
    const byDateBody = (await byDateRes.json()) as {
      attendance: Array<{ studentId: string; status: string }>;
    };
    const dateRecord = byDateBody.attendance.find(
      (record) => record.studentId === student.id,
    );
    expect(dateRecord).toBeDefined();
    expect(dateRecord?.status).toBe("present");

    const historyRes = await apiRequest(
      `/api/attendance/history?days=7&studentId=${encodeURIComponent(student.id)}`,
    );
    expect(historyRes.status).toBe(200);
    const historyBody = (await historyRes.json()) as {
      attendance: Array<{ studentId: string; date: string }>;
    };
    const historyRecord = historyBody.attendance.find(
      (record) => record.studentId === student.id && record.date === today,
    );
    expect(historyRecord).toBeDefined();
  }, 20000);
});
