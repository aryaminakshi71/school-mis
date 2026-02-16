/**
 * Assignments Router
 *
 * oRPC router for assignment management.
 */

import { z } from "zod";
import { orgAuthed, pub } from "../../procedures/index.js";

export const assignmentsRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/assignments",
      summary: "Get assignments",
      tags: ["Assignments"],
    })
    .input(
      z.object({
        classId: z.string().uuid().optional(),
        subjectId: z.string().uuid().optional(),
        status: z.string().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async () => []),
  get: pub
    .route({
      method: "GET",
      path: "/assignments/{id}",
      summary: "Get assignment",
      tags: ["Assignments"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),
  create: orgAuthed
    .route({
      method: "POST",
      path: "/assignments",
      summary: "Create assignment",
      tags: ["Assignments"],
    })
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        classId: z.string().uuid(),
        subjectId: z.string().uuid(),
        dueDate: z.string(),
        maxMarks: z.number().optional(),
        submissionType: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),
  update: orgAuthed
    .route({
      method: "PUT",
      path: "/assignments/{id}",
      summary: "Update assignment",
      tags: ["Assignments"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
        description: z.string().optional(),
        dueDate: z.string().optional(),
        status: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => input),
  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/assignments/{id}",
      summary: "Delete assignment",
      tags: ["Assignments"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async () => ({ success: true })),
  listSubmissions: pub
    .route({
      method: "GET",
      path: "/assignments/{id}/submissions",
      summary: "Get submissions",
      tags: ["Assignments"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.array(z.any()))
    .handler(async () => []),
  submit: orgAuthed
    .route({
      method: "POST",
      path: "/assignments/{id}/submit",
      summary: "Submit assignment",
      tags: ["Assignments"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        content: z.string().optional(),
        attachments: z.array(z.string()).optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({
      id: "new-id",
      assignmentId: input.id,
      status: "submitted",
    })),
  grade: orgAuthed
    .route({
      method: "PUT",
      path: "/assignments/submissions/{submissionId}/grade",
      summary: "Grade submission",
      tags: ["Assignments"],
    })
    .input(
      z.object({
        submissionId: z.string().uuid(),
        marks: z.number(),
        feedback: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({
      id: input.submissionId,
      marks: input.marks,
      status: "graded",
    })),
};
