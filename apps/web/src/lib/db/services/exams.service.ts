import { db, examSchedules } from "@school/storage";
import { asc, eq, gte } from "drizzle-orm";
import { fromPgDate, toPgDate } from "../date-utils";

export interface ExamSchedule {
  id: string;
  title: string;
  examType: string;
  classId?: string;
  subjectId?: string;
  examDate: Date;
  startTime: string;
  endTime: string;
  totalMarks?: number;
}

export const mapExamScheduleRow = (
  row: typeof examSchedules.$inferSelect,
): ExamSchedule => ({
  id: row.id,
  title: row.title || "",
  examType: row.examType || "",
  classId: row.classId || undefined,
  subjectId: row.subjectId || undefined,
  examDate: fromPgDate(row.examDate) || new Date(),
  startTime: row.startTime || "",
  endTime: row.endTime || "",
  totalMarks: row.totalMarks ? Number(row.totalMarks) : undefined,
});

export const examsService = {
  async list(classId?: string): Promise<ExamSchedule[]> {
    const baseQuery = db
      .select()
      .from(examSchedules)
      .orderBy(asc(examSchedules.examDate));

    const result = classId
      ? await baseQuery.where(eq(examSchedules.classId, classId))
      : await baseQuery;

    return result.map(mapExamScheduleRow);
  },

  async create(data: Omit<ExamSchedule, "id">): Promise<ExamSchedule> {
    const result = await db
      .insert(examSchedules)
      .values({
        title: data.title,
        examType: data.examType,
        classId: data.classId,
        subjectId: data.subjectId,
        examDate: toPgDate(data.examDate),
        startTime: data.startTime,
        endTime: data.endTime,
        totalMarks: data.totalMarks,
      })
      .returning();

    const created = result[0];
    if (!created) {
      throw new Error("Failed to create exam");
    }

    return mapExamScheduleRow(created);
  },

  async upcoming(limit = 10): Promise<ExamSchedule[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await db
      .select()
      .from(examSchedules)
      .where(gte(examSchedules.examDate, toPgDate(today)))
      .orderBy(asc(examSchedules.examDate))
      .limit(limit);

    return result.map(mapExamScheduleRow);
  },
};
