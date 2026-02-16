/**
 * DailyWorks Router
 *
 * oRPC router for daily work/homework management.
 */

import { z } from "zod";
import { orgAuthed, pub } from "../../procedures/index.js";

export const dailyWorksRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/daily-works",
      summary: "Get daily works",
      tags: ["DailyWorks"],
    })
    .input(
      z.object({
        classId: z.string().uuid().optional(),
        subjectId: z.string().uuid().optional(),
        workDate: z.string().optional(),
        workType: z.string().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async () => []),
  get: pub
    .route({
      method: "GET",
      path: "/daily-works/{id}",
      summary: "Get daily work",
      tags: ["DailyWorks"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),
  create: orgAuthed
    .route({
      method: "POST",
      path: "/daily-works",
      summary: "Create daily work",
      tags: ["DailyWorks"],
    })
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        classId: z.string().uuid().optional(),
        subjectId: z.string().uuid().optional(),
        workDate: z.string(),
        workType: z.string(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),
  update: orgAuthed
    .route({
      method: "PUT",
      path: "/daily-works/{id}",
      summary: "Update daily work",
      tags: ["DailyWorks"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => input),
  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/daily-works/{id}",
      summary: "Delete daily work",
      tags: ["DailyWorks"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async () => ({ success: true })),
};
