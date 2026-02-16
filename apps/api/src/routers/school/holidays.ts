/**
 * Holidays Router
 *
 * oRPC router for holiday management.
 */

import { z } from "zod";
import { orgAuthed, pub } from "../../procedures/index.js";

export const holidaysRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/holidays",
      summary: "Get holidays",
      tags: ["Holidays"],
    })
    .input(
      z.object({ year: z.number().optional(), type: z.string().optional() }),
    )
    .output(z.array(z.any()))
    .handler(async () => []),
  get: pub
    .route({
      method: "GET",
      path: "/holidays/{id}",
      summary: "Get holiday",
      tags: ["Holidays"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),
  create: orgAuthed
    .route({
      method: "POST",
      path: "/holidays",
      summary: "Create holiday",
      tags: ["Holidays"],
    })
    .input(
      z.object({
        title: z.string(),
        date: z.string(),
        type: z.enum(["national", "festival", "vacation", "other"]),
        description: z.string().optional(),
        isRecurring: z.boolean().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),
  update: orgAuthed
    .route({
      method: "PUT",
      path: "/holidays/{id}",
      summary: "Update holiday",
      tags: ["Holidays"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
        date: z.string().optional(),
        type: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => input),
  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/holidays/{id}",
      summary: "Delete holiday",
      tags: ["Holidays"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async () => ({ success: true })),
};
