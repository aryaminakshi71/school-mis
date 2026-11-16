/**
 * Attendance Router
 *
 * oRPC router for attendance management.
 */

import { attendance, classes, students } from "@school/storage";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../lib/db.js";
import { orgAuthed, pub } from "../../procedures/index.js";

export const attendanceRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/attendance",
      summary: "Get attendance records",
      tags: ["Attendance"],
    })
    .input(
      z.object({
        classId: z.string().uuid().optional(),
        sessionId: z.string().uuid().optional(),
        date: z.string().optional(),
        studentId: z.string().uuid().optional(),
        status: z.enum(["present", "absent", "late", "excused"]).optional(),
        page: z.number().int().optional().default(1),
        limit: z.number().int().optional().default(50),
      }),
    )
    .output(
      z.object({
        attendance: z.array(z.any()),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
    )
    .handler(async ({ input }) => {
      const db = getDb();
      const { classId, sessionId, date, page, limit } = input;
      const offset = (page - 1) * limit;

      // If date is provided, return daily class summaries
      if (date) {
        const attendanceDate = new Date(date);

        const dailySummaries = await db
          .select({
            classId: attendance.classId,
            className: classes.name,
            total: sql<number>`count(*)`,
            present: sql<number>`count(case when ${attendance.status} = 'present' then 1 end)`,
            absent: sql<number>`count(case when ${attendance.status} = 'absent' then 1 end)`,
            late: sql<number>`count(case when ${attendance.status} = 'late' then 1 end)`,
            excused: sql<number>`count(case when ${attendance.status} = 'excused' then 1 end)`,
          })
          .from(attendance)
          .leftJoin(classes, eq(attendance.classId, classes.id))
          .where(
            and(
              eq(attendance.date, attendanceDate.toISOString().split("T")[0]),
              sessionId ? eq(attendance.sessionId, sessionId) : undefined,
              classId ? eq(attendance.classId, classId) : undefined,
            ),
          )
          .groupBy(attendance.classId, classes.name)
          .orderBy(classes.name);

        const records = dailySummaries.map((summary) => ({
          id: `${summary.classId}-${date}`,
          className: summary.className,
          total: summary.total,
          present: summary.present,
          absent: summary.absent,
          percentage:
            summary.total > 0
              ? Math.round((summary.present / summary.total) * 100 * 10) / 10
              : 0,
          date,
        }));

        return {
          attendance: records,
          pagination: {
            page,
            limit,
            total: records.length,
            totalPages: Math.ceil(records.length / limit),
          },
        };
      }

      // If no date, return individual attendance records
      const conditions = [];
      if (classId) conditions.push(eq(attendance.classId, classId));
      if (sessionId) conditions.push(eq(attendance.sessionId, sessionId));
      if (input.status) conditions.push(eq(attendance.status, input.status));
      if (input.studentId)
        conditions.push(eq(attendance.studentId, input.studentId));

      const allRecords = await db
        .select({
          id: attendance.id,
          studentId: attendance.studentId,
          classId: attendance.classId,
          className: classes.name,
          studentName: sql<string>`concat(${students.firstName}, ' ', ${students.lastName})`,
          date: attendance.date,
          status: attendance.status,
          checkInTime: attendance.checkInTime,
          checkOutTime: attendance.checkOutTime,
          remarks: attendance.remarks,
        })
        .from(attendance)
        .leftJoin(students, eq(attendance.studentId, students.id))
        .leftJoin(classes, eq(attendance.classId, classes.id))
        .where(and(...conditions))
        .orderBy(desc(attendance.date), desc(attendance.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(attendance)
        .where(and(...conditions));

      return {
        attendance: allRecords.map((record) => ({
          id: record.id,
          studentId: record.studentId,
          studentName: record.studentName,
          className: record.className,
          date: record.date
            ? new Date(record.date).toISOString().split("T")[0]
            : "",
          status: record.status,
          checkInTime: record.checkInTime,
          checkOutTime: record.checkOutTime,
          remarks: record.remarks,
        })),
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    }),

  history: pub
    .route({
      method: "GET",
      path: "/attendance/history",
      summary: "Get attendance history",
      tags: ["Attendance"],
    })
    .input(
      z.object({
        days: z.number().int().optional().default(7),
        classId: z.string().uuid().optional(),
        studentId: z.string().uuid().optional(),
      }),
    )
    .output(
      z.object({
        records: z.array(
          z.object({
            id: z.string(),
            studentId: z.string(),
            classId: z.string().nullable(),
            date: z.string(),
            status: z.string(),
          }),
        ),
      }),
    )
    .handler(async ({ input }) => {
      const db = getDb();
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - input.days);

      const records = await db
        .select({
          id: attendance.id,
          studentId: attendance.studentId,
          classId: attendance.classId,
          date: attendance.date,
          status: attendance.status,
        })
        .from(attendance)
        .leftJoin(students, eq(attendance.studentId, students.id))
        .where(gte(attendance.date, daysAgo.toISOString().split("T")[0]))
        .orderBy(desc(attendance.date))
        .limit(100);

      return {
        records: records.map((r) => ({
          id: r.id,
          studentId: r.studentId,
          classId: r.classId,
          date: r.date,
          status: r.status,
        })),
      };
    }),

  summary: pub
    .route({
      method: "GET",
      path: "/attendance/summary",
      summary: "Get attendance summary",
      tags: ["Attendance"],
    })
    .input(
      z.object({
        classId: z.string().uuid(),
        sessionId: z.string().uuid(),
        month: z.number().int().optional(),
        year: z.number().int().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async () => []),

  get: pub
    .route({
      method: "GET",
      path: "/attendance/{id}",
      summary: "Get single attendance record",
      tags: ["Attendance"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),

  mark: orgAuthed
    .route({
      method: "POST",
      path: "/attendance",
      summary: "Mark attendance",
      tags: ["Attendance"],
    })
    .input(
      z.object({
        studentId: z.string().uuid(),
        classId: z.string().uuid(),
        sessionId: z.string().uuid(),
        date: z.string(),
        status: z.enum(["present", "absent", "late", "excused"]),
        checkInTime: z.string().optional(),
        checkOutTime: z.string().optional(),
        remarks: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),

  bulk: orgAuthed
    .route({
      method: "POST",
      path: "/attendance/bulk",
      summary: "Mark bulk attendance",
      tags: ["Attendance"],
    })
    .input(
      z.object({
        classId: z.string().uuid(),
        sessionId: z.string().uuid(),
        date: z.string(),
        records: z.array(
          z.object({
            studentId: z.string().uuid(),
            status: z.enum(["present", "absent", "late", "excused"]),
            remarks: z.string().optional(),
          }),
        ),
      }),
    )
    .output(z.object({ inserted: z.number(), records: z.array(z.any()) }))
    .handler(async ({ input }) => ({
      inserted: input.records.length,
      records: [],
    })),
};
