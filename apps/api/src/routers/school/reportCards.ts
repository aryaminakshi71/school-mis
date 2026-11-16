/**
 * ReportCards Router
 *
 * oRPC router for report card management.
 */

import { reportCardDetails, reportCards } from "@school/storage";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../lib/db.js";
import { orgAuthed, pub } from "../../procedures/index.js";

export const reportCardsRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/report-cards",
      summary: "Get report cards",
      tags: ["ReportCards"],
    })
    .input(
      z.object({
        studentId: z.string().uuid().optional(),
        classId: z.string().uuid().optional(),
        examType: z.string().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      if (input.studentId)
        conditions.push(eq(reportCards.studentId, input.studentId));
      if (input.classId)
        conditions.push(eq(reportCards.classId, input.classId));
      if (input.examType)
        conditions.push(eq(reportCards.examType, input.examType));

      const cards = await db
        .select()
        .from(reportCards)
        .where(and(...conditions))
        .orderBy(desc(reportCards.createdAt));

      return cards.map((card) => ({
        id: card.id,
        studentId: card.studentId,
        classId: card.classId,
        sessionId: card.sessionId,
        examType: card.examType,
        totalMarks: card.totalMarks,
        obtainedMarks: card.obtainedMarks,
        percentage: card.percentage,
        grade: card.grade,
        rank: card.rank,
        status: card.status,
        comments: card.remarks,
        createdAt: card.createdAt ? new Date(card.createdAt).toISOString() : "",
      }));
    }),
  get: pub
    .route({
      method: "GET",
      path: "/report-cards/{id}",
      summary: "Get report card",
      tags: ["ReportCards"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const [card] = await db
        .select()
        .from(reportCards)
        .where(eq(reportCards.id, input.id));
      return card || null;
    }),
  getDetails: pub
    .route({
      method: "GET",
      path: "/report-cards/{id}/details",
      summary: "Get report card details",
      tags: ["ReportCards"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.array(z.any()))
    .handler(async ({ input }) => {
      const db = getDb();
      const details = await db
        .select()
        .from(reportCardDetails)
        .where(eq(reportCardDetails.reportCardId, input.id));

      return details.map((d) => ({
        id: d.id,
        reportCardId: d.reportCardId,
        subjectId: d.subjectId,
        maxMarks: d.maxMarks,
        obtainedMarks: d.obtainedMarks,
        grade: d.grade,
        remarks: d.remarks,
      }));
    }),
  create: orgAuthed
    .route({
      method: "POST",
      path: "/report-cards",
      summary: "Create report card",
      tags: ["ReportCards"],
    })
    .input(
      z.object({
        studentId: z.string().uuid(),
        classId: z.string().uuid(),
        sessionId: z.string().uuid(),
        examType: z.enum(["PT1", "PT2", "Half Yearly", "Final"]),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const [card] = await db
        .insert(reportCards)
        .values({
          studentId: input.studentId,
          classId: input.classId,
          sessionId: input.sessionId,
          examType: input.examType,
          status: "draft",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return card;
    }),
  addDetails: orgAuthed
    .route({
      method: "POST",
      path: "/report-cards/{id}/details",
      summary: "Add subject marks",
      tags: ["ReportCards"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        subjectId: z.string().uuid(),
        maxMarks: z.number(),
        obtainedMarks: z.number(),
        grade: z.string().optional(),
        remarks: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const [detail] = await db
        .insert(reportCardDetails)
        .values({
          reportCardId: input.id,
          subjectId: input.subjectId,
          maxMarks: input.maxMarks,
          obtainedMarks: input.obtainedMarks.toString(),
          grade: input.grade || null,
          remarks: input.remarks || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return detail;
    }),
  update: orgAuthed
    .route({
      method: "PUT",
      path: "/report-cards/{id}",
      summary: "Update report card",
      tags: ["ReportCards"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        totalMarks: z.number().optional(),
        obtainedMarks: z.number().optional(),
        percentage: z.number().optional(),
        grade: z.string().optional(),
        rank: z.number().optional(),
        remarks: z.string().optional(),
        status: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const [updated] = await db
        .update(reportCards)
        .set({
          totalMarks: data.totalMarks?.toString(),
          obtainedMarks: data.obtainedMarks?.toString(),
          percentage: data.percentage?.toString(),
          grade: data.grade,
          rank: data.rank,
          remarks: data.remarks,
          status: data.status,
          updatedAt: new Date(),
        })
        .where(eq(reportCards.id, id))
        .returning();

      return updated;
    }),
  publish: orgAuthed
    .route({
      method: "PUT",
      path: "/report-cards/{id}/publish",
      summary: "Publish report card",
      tags: ["ReportCards"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const [updated] = await db
        .update(reportCards)
        .set({ status: "published", updatedAt: new Date() })
        .where(eq(reportCards.id, input.id))
        .returning();
      return updated;
    }),
};
