import { afterEach, describe, expect, it, vi } from "vitest";
import {
  type StudentRecord,
  assignStudentsToClass,
  buildAttendanceSavePayload,
  deleteClassRecord,
  deleteGradeRecord,
  deleteStudentRecord,
  deleteSubjectRecord,
  deleteTeacherRecord,
  saveAttendanceSubmission,
  saveClassRecord,
  saveGradeRecord,
  saveStudentRecord,
  saveSubjectRecord,
  saveTeacherRecord,
} from "../../app/mobile-data";

const studentRoster: StudentRecord[] = [
  {
    id: "student-1",
    firstName: "Ada",
    lastName: "Lovelace",
    classId: "class-a",
    className: "Class 10",
  },
  {
    id: "student-2",
    firstName: "Grace",
    lastName: "Hopper",
    classId: "class-a",
    className: "Class 10",
  },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe("mobile attendance API", () => {
  it("posts attendance records to the live API shape", async () => {
    const payload = buildAttendanceSavePayload(
      studentRoster,
      {
        "student-1": "present",
        "student-2": "late",
      },
      "2026-03-09",
    );

    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, saved: 2 }),
    } as Response);

    const result = await saveAttendanceSubmission(
      "http://localhost:5173/api",
      payload,
    );

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/attendance",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(result).toEqual({ success: true, saved: 2 });

    const requestInit = fetchSpy.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(requestInit.body))).toEqual({
      date: "2026-03-09",
      records: [
        {
          studentId: "student-1",
          classId: "class-a",
          status: "present",
        },
        {
          studentId: "student-2",
          classId: "class-a",
          status: "late",
        },
      ],
    });
  });

  it("surfaces API errors when attendance save fails", async () => {
    const payload = buildAttendanceSavePayload(
      studentRoster,
      { "student-1": "absent" },
      "2026-03-09",
    );

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        error: "No active academic session found for attendance",
      }),
    } as Response);

    await expect(
      saveAttendanceSubmission("http://localhost:5173/api", payload),
    ).rejects.toThrow("No active academic session found for attendance");
  });

  it("creates a student through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "student-3",
        firstName: "Katherine",
        lastName: "Johnson",
        classId: "class-a",
      }),
    } as Response);

    const result = await saveStudentRecord("http://localhost:5173/api", {
      firstName: "Katherine",
      lastName: "Johnson",
      classId: "class-a",
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/students",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result.firstName).toBe("Katherine");
  });

  it("updates an existing student through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "student-1",
        firstName: "Ada",
        lastName: "Byron",
      }),
    } as Response);

    await saveStudentRecord("http://localhost:5173/api", {
      id: "student-1",
      firstName: "Ada",
      lastName: "Byron",
      phone: "+1-555-0100",
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/students/student-1",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("bulk assigns students to a class through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, assigned: 2 }),
    } as Response);

    const result = await assignStudentsToClass("http://localhost:5173/api", {
      studentIds: ["student-1", "student-2"],
      classId: "class-b",
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/students/bulk/assign-class",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result).toEqual({ success: true, assigned: 2 });
  });

  it("creates a grade through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        grade: {
          id: "grade-1",
          studentId: "student-1",
          studentName: "Ada Lovelace",
          subjectId: "subject-1",
          subject: "Mathematics",
          examType: "Midterm",
          classId: "class-a",
          className: "Class 10-A",
          score: 92,
          maxScore: 100,
          grade: "A",
          date: "2026-03-09",
        },
      }),
    } as Response);

    await saveGradeRecord("http://localhost:5173/api", {
      studentId: "student-1",
      classId: "class-a",
      sessionId: "session-2026",
      examType: "Midterm",
      subjectId: "subject-1",
      maxMarks: 100,
      obtainedMarks: 92,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/grades",
      expect.objectContaining({ method: "POST" }),
    );

    const requestInit = fetchSpy.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(requestInit.body))).toEqual({
      studentId: "student-1",
      classId: "class-a",
      sessionId: "session-2026",
      examType: "Midterm",
      subjectId: "subject-1",
      maxMarks: 100,
      obtainedMarks: 92,
    });
  });

  it("updates a grade through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        grade: { id: "grade-1" },
      }),
    } as Response);

    await saveGradeRecord("http://localhost:5173/api", {
      id: "grade-1",
      studentId: "student-1",
      classId: "class-a",
      examType: "Final",
      subjectId: "subject-2",
      maxMarks: 100,
      obtainedMarks: 88,
      grade: "B+",
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/grades/grade-1",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("creates a teacher through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "teacher-1",
        firstName: "Mary",
        lastName: "Jackson",
        email: "mary@example.edu",
      }),
    } as Response);

    await saveTeacherRecord("http://localhost:5173/api", {
      firstName: "Mary",
      lastName: "Jackson",
      email: "mary@example.edu",
      subject: "Physics",
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/teachers",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("updates a teacher through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "teacher-1",
        firstName: "Mary",
        lastName: "Jackson",
      }),
    } as Response);

    await saveTeacherRecord("http://localhost:5173/api", {
      id: "teacher-1",
      firstName: "Mary",
      lastName: "Jackson",
      email: "mary@example.edu",
      qualification: "B.Ed",
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/teachers/teacher-1",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("creates a class through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "class-1",
        name: "Class 12",
        section: "A",
        capacity: 45,
      }),
    } as Response);

    await saveClassRecord("http://localhost:5173/api", {
      name: "Class 12",
      section: "A",
      capacity: 45,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/classes",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("updates a class through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ id: "class-1", name: "Class 12" }),
    } as Response);

    await saveClassRecord("http://localhost:5173/api", {
      id: "class-1",
      name: "Class 12",
      section: "B",
      capacity: 40,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/classes/class-1",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("creates a subject through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "subject-1",
        name: "Biology",
        code: "BIO",
      }),
    } as Response);

    await saveSubjectRecord("http://localhost:5173/api", {
      name: "Biology",
      code: "BIO",
      classId: "class-1",
      teacherId: "teacher-1",
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/subjects",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("updates a subject through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ id: "subject-1", name: "Biology" }),
    } as Response);

    await saveSubjectRecord("http://localhost:5173/api", {
      id: "subject-1",
      name: "Biology",
      code: "BIO-2",
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/subjects/subject-1",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("deletes a student through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, id: "student-1" }),
    } as Response);

    await deleteStudentRecord("http://localhost:5173/api", "student-1");

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/students/student-1",
      { method: "DELETE" },
    );
  });

  it("deletes a grade through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, id: "grade-1" }),
    } as Response);

    await deleteGradeRecord("http://localhost:5173/api", "grade-1");

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/grades/grade-1",
      { method: "DELETE" },
    );
  });

  it("deletes a teacher through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, id: "teacher-1" }),
    } as Response);

    await deleteTeacherRecord("http://localhost:5173/api", "teacher-1");

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/teachers/teacher-1",
      { method: "DELETE" },
    );
  });

  it("deletes a class through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, id: "class-1" }),
    } as Response);

    await deleteClassRecord("http://localhost:5173/api", "class-1");

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/classes/class-1",
      { method: "DELETE" },
    );
  });

  it("deletes a subject through the mobile API helper", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, id: "subject-1" }),
    } as Response);

    await deleteSubjectRecord("http://localhost:5173/api", "subject-1");

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:5173/api/subjects/subject-1",
      { method: "DELETE" },
    );
  });

  it("surfaces delete dependency errors from the API helper", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({
        error:
          "Cannot delete class because it is still referenced by 2 students.",
      }),
    } as Response);

    await expect(
      deleteClassRecord("http://localhost:5173/api", "class-1"),
    ).rejects.toThrow(
      "Cannot delete class because it is still referenced by 2 students.",
    );
  });
});
