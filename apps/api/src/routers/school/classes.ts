/**
 * Classes Router
 *
 * oRPC router for class management.
 */

import { z } from "zod";
import { ClassesListResponseSchema } from "../../contracts/school.js";
import { orgAuthed, pub } from "../../procedures/index.js";

export const classesRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/classes",
      summary: "Get all classes",
      tags: ["Classes"],
    })
    .output(ClassesListResponseSchema)
    .handler(async () => {
      return { classes: [] };
    }),

  get: pub
    .route({
      method: "GET",
      path: "/classes/{id}",
      summary: "Get single class",
      tags: ["Classes"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),

  create: orgAuthed
    .route({
      method: "POST",
      path: "/classes",
      summary: "Create class",
      tags: ["Classes"],
    })
    .input(
      z.object({
        name: z.string().min(1),
        section: z.string().optional(),
        sessionId: z.string().uuid().optional(),
        capacity: z.number().int().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),

  update: orgAuthed
    .route({
      method: "PUT",
      path: "/classes/{id}",
      summary: "Update class",
      tags: ["Classes"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().optional(),
        section: z.string().optional(),
        capacity: z.number().int().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => input),

  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/classes/{id}",
      summary: "Delete class",
      tags: ["Classes"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input }) => ({ success: true })),
};
