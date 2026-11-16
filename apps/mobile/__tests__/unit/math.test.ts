import { describe, expect, it } from "vitest";
import {
  type StudentRecord,
  buildApiBaseUrl,
  buildAttendanceSavePayload,
  filterStudents,
  formatLocalDate,
  getAttendanceRate,
  getInitials,
} from "../../app/mobile-data";

const students: StudentRecord[] = [
  {
    id: "student-1",
    firstName: "Ada",
    lastName: "Lovelace",
    admissionNumber: "ADM-001",
    classId: "class-a",
    className: "Class 10",
    section: "A",
  },
  {
    id: "student-2",
    firstName: "Grace",
    lastName: "Hopper",
    admissionNumber: "ADM-002",
    classId: "class-b",
    className: "Class 11",
    section: "B",
  },
];

describe("mobile data helpers", () => {
  it("builds the API base URL from the configured web app URL", () => {
    expect(buildApiBaseUrl("http://localhost:5173/")).toBe(
      "http://localhost:5173/api",
    );
  });

  it("filters students by name, admission number, or class", () => {
    expect(filterStudents(students, "ada")).toHaveLength(1);
    expect(filterStudents(students, "ADM-002")).toHaveLength(1);
    expect(filterStudents(students, "class 10")).toHaveLength(1);
  });

  it("calculates initials and attendance rate consistently", () => {
    expect(getInitials("School Management")).toBe("SM");
    expect(
      getAttendanceRate([
        { status: "present" },
        { status: "present" },
        { status: "absent" },
      ]),
    ).toBe(67);
  });

  it("builds the attendance save payload from selected statuses", () => {
    expect(
      buildAttendanceSavePayload(
        students,
        {
          "student-1": "present",
          "student-2": "late",
        },
        "2026-03-09",
      ),
    ).toEqual({
      date: "2026-03-09",
      records: [
        {
          studentId: "student-1",
          classId: "class-a",
          status: "present",
        },
        {
          studentId: "student-2",
          classId: "class-b",
          status: "late",
        },
      ],
    });
  });

  it("formats local dates without timezone drift", () => {
    expect(formatLocalDate(new Date("2026-03-09T14:45:00"))).toBe("2026-03-09");
  });
});
