/**
 * ReportCards Router
 *
 * oRPC router for report card management.
 */

import { z } from "zod";
import { pub, orgAuthed } from "../../procedures/index.js";

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
    .handler(async () => []),
  get: pub
    .route({
      method: "GET",
      path: "/report-cards/{id}",
      summary: "Get report card",
      tags: ["ReportCards"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),
  getDetails: pub
    .route({
      method: "GET",
      path: "/report-cards/{id}/details",
      summary: "Get report card details",
      tags: ["ReportCards"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.array(z.any()))
    .handler(async () => []),
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
    .handler(async ({ input }) => ({ id: "new-id", ...input })),
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
    .handler(async ({ input }) => ({
      ...input,
      id: "new-id",
      reportCardId: input.id,
    })),
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
    .handler(async ({ input }) => input),
  publish: orgAuthed
    .route({
      method: "PUT",
      path: "/report-cards/{id}/publish",
      summary: "Publish report card",
      tags: ["ReportCards"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => ({ id: input.id, status: "published" })),
};
