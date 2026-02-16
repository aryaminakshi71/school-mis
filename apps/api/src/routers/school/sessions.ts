/**
 * Sessions Router
 *
 * oRPC router for academic session management.
 */

import { z } from "zod";
import { orgAuthed, pub } from "../../procedures/index.js";

export const sessionsRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/sessions",
      summary: "Get all sessions",
      tags: ["Sessions"],
    })
    .output(z.array(z.any()))
    .handler(async () => []),

  get: pub
    .route({
      method: "GET",
      path: "/sessions/{id}",
      summary: "Get single session",
      tags: ["Sessions"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),

  create: orgAuthed
    .route({
      method: "POST",
      path: "/sessions",
      summary: "Create session",
      tags: ["Sessions"],
    })
    .input(
      z.object({
        name: z.string().min(1),
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),

  update: orgAuthed
    .route({
      method: "PUT",
      path: "/sessions/{id}",
      summary: "Update session",
      tags: ["Sessions"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => input),

  activate: orgAuthed
    .route({
      method: "PUT",
      path: "/sessions/{id}/activate",
      summary: "Activate session",
      tags: ["Sessions"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => ({ id: input.id, isActive: true })),

  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/sessions/{id}",
      summary: "Delete session",
      tags: ["Sessions"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async () => ({ success: true })),
};
