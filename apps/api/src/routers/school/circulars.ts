/**
 * Circulars Router
 *
 * API routes for circular/notice management
 */

import { z } from "zod";
import { eq, and, desc, asc } from "drizzle-orm";
import { orgAuthed } from "../../procedures";
import { getDb, schema } from "../../lib/db";

export const circularsRouter = {
  /**
   * Get all circulars
   */
  list: orgAuthed
    .route({
      method: "GET",
      path: "/circulars",
      summary: "Get all circulars",
      tags: ["Circulars"],
    })
    .input(
      z
        .object({
          type: z.string().optional(),
          priority: z.string().optional(),
          status: z.string().optional(),
          page: z.number().int().min(1).optional().default(1),
          limit: z.number().int().min(1).max(100).optional().default(20),
        })
        .optional(),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;
      const page = input?.page || 1;
      const limit = input?.limit || 20;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (input?.type) conditions.push(eq(schema.circulars.type, input.type));
      if (input?.priority)
        conditions.push(eq(schema.circulars.priority, input.priority));
      if (input?.status)
        conditions.push(eq(schema.circulars.status, input.status));

      const circulars = await db
        .select()
        .from(schema.circulars)
        .where(and(...conditions))
        .orderBy(desc(schema.circulars.date))
        .limit(limit)
        .offset(offset);

      return { circulars, pagination: { page, limit } };
    }),

  /**
   * Create circular
   */
  create: orgAuthed
    .route({
      method: "POST",
      path: "/circulars",
      summary: "Create circular",
      tags: ["Circulars"],
    })
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        circularNumber: z.string().optional(),
        date: z.string(),
        type: z.enum(["general", "exam", "holiday", "fee", "transport"]),
        priority: z.enum(["urgent", "normal"]).optional(),
        targetAudience: z.array(z.string()).optional(),
        attachments: z
          .array(
            z.object({
              name: z.string(),
              url: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const [circular] = await db
        .insert(schema.circulars)
        .values({
          ...input,
          publishedBy: context.user.id,
          status: "draft",
        })
        .returning();

      return { circular };
    }),

  /**
   * Publish circular
   */
  publish: orgAuthed
    .route({
      method: "POST",
      path: "/circulars/:id/publish",
      summary: "Publish circular",
      tags: ["Circulars"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const [circular] = await db
        .update(schema.circulars)
        .set({
          status: "published",
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schema.circulars.id, input.id))
        .returning();

      return { circular };
    }),

  /**
   * Delete circular
   */
  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/circulars/:id",
      summary: "Delete circular",
      tags: ["Circulars"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      await db
        .delete(schema.circulars)
        .where(eq(schema.circulars.id, input.id));

      return { success: true };
    }),
};
