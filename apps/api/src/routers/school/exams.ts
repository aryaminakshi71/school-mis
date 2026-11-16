/**
 * Exams Router
 *
 * oRPC router for exam/datesheet management.
 */

import { examSchedules } from "@school/storage";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../lib/db.js";
import { orgAuthed, pub } from "../../procedures/index.js";

export const examsRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/exams",
      summary: "Get exams",
      tags: ["Exams"],
    })
    .input(
      z.object({
        classId: z.string().uuid().optional(),
        sessionId: z.string().uuid().optional(),
        examType: z.string().optional(),
      }),
    )
    .output(z.object({ exams: z.array(z.any()) }))
    .handler(async ({ input }) => {
      const db = getDb();
      const { classId, sessionId, examType } = input;

      const conditions = [];
      if (classId) conditions.push(eq(examSchedules.classId, classId));
      if (sessionId) conditions.push(eq(examSchedules.sessionId, sessionId));
      if (examType) conditions.push(eq(examSchedules.examType, examType));

      const exams = await db
        .select()
        .from(examSchedules)
        .where(and(...conditions))
        .orderBy(examSchedules.examDate);

      return { exams };
    }),
  get: pub
    .route({
      method: "GET",
      path: "/exams/{id}",
      summary: "Get exam",
      tags: ["Exams"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),
  create: orgAuthed
    .route({
      method: "POST",
      path: "/exams",
      summary: "Create exam",
      tags: ["Exams"],
    })
    .input(
      z.object({
        title: z.string(),
        examType: z.enum(["PT1", "PT2", "Half Yearly", "Final"]),
        classId: z.string().uuid(),
        subjectId: z.string().uuid(),
        examDate: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        totalMarks: z.number().optional(),
        roomNumber: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),
  update: orgAuthed
    .route({
      method: "PUT",
      path: "/exams/{id}",
      summary: "Update exam",
      tags: ["Exams"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        roomNumber: z.string().optional(),
        status: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => input),
  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/exams/{id}",
      summary: "Delete exam",
      tags: ["Exams"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async () => ({ success: true })),
};
