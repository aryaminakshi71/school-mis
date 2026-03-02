import { attendance, db } from "@school/storage";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { toPgDate } from "../date-utils";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceMarkInput {
  studentId: string;
  classId: string;
  sessionId: string;
  date: Date;
  status: AttendanceStatus;
}

export const attendanceService = {
  async mark(input: AttendanceMarkInput): Promise<void> {
    await db.insert(attendance).values({
      studentId: input.studentId,
      classId: input.classId,
      sessionId: input.sessionId,
      date: toPgDate(input.date),
      status: input.status,
    });
  },

  async getByStudent(studentId: string) {
    return db
      .select()
      .from(attendance)
      .where(eq(attendance.studentId, studentId))
      .orderBy(desc(attendance.date));
  },

  async getByClass(classId: string, date: Date) {
    return db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.classId, classId),
          eq(attendance.date, toPgDate(date)),
        ),
      );
  },

  async getSummary(
    studentId: string,
    month: number,
    year: number,
  ): Promise<{
    present: number;
    absent: number;
    total: number;
    percentage: number;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.studentId, studentId),
          gte(attendance.date, toPgDate(startDate)),
          lte(attendance.date, toPgDate(endDate)),
        ),
      );

    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const total = records.length;

    return {
      present,
      absent,
      total,
      percentage: total > 0 ? (present / total) * 100 : 0,
    };
  },
};
