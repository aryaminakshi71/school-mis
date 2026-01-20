/**
 * Gallery Router
 *
 * API routes for gallery management
 */

import { z } from "zod";
import { eq, and, desc, asc } from "drizzle-orm";
import { orgAuthed } from "../../procedures";
import { getDb, schema } from "../../lib/db";

export const galleryRouter = {
  /**
   * Get all galleries
   */
  list: orgAuthed
    .route({
      method: "GET",
      path: "/gallery",
      summary: "Get all galleries",
      tags: ["Gallery"],
    })
    .input(
      z
        .object({
          category: z.string().optional(),
          status: z.boolean().optional(),
          page: z.number().int().min(1).optional().default(1),
          limit: z.number().int().min(1).max(100).optional().default(20),
        })
        .optional(),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb(context);
      const orgId = context.organization.id;
      const page = input?.page || 1;
      const limit = input?.limit || 20;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (input?.category)
        conditions.push(eq(schema.gallery.category, input.category));
      if (input?.status !== undefined)
        conditions.push(eq(schema.gallery.isActive, input.status));

      const galleries = await db
        .select()
        .from(schema.gallery)
        .where(and(...conditions))
        .orderBy(desc(schema.gallery.date))
        .limit(limit)
        .offset(offset);

      return { galleries, pagination: { page, limit } };
    }),

  /**
   * Get gallery with images
   */
  getById: orgAuthed
    .route({
      method: "GET",
      path: "/gallery/:id",
      summary: "Get gallery with images",
      tags: ["Gallery"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const [gallery] = await db
        .select()
        .from(schema.gallery)
        .where(eq(schema.gallery.id, input.id));

      const images = await db
        .select()
        .from(schema.galleryImages)
        .where(eq(schema.galleryImages.galleryId, input.id))
        .orderBy(asc(schema.galleryImages.order));

      return { gallery, images };
    }),

  /**
   * Create gallery
   */
  create: orgAuthed
    .route({
      method: "POST",
      path: "/gallery",
      summary: "Create gallery",
      tags: ["Gallery"],
    })
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        date: z.string(),
        category: z.string().optional(),
        location: z.string().optional(),
        coverImage: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const [gallery] = await db
        .insert(schema.gallery)
        .values({
          ...input,
          isActive: true,
        })
        .returning();

      return { gallery };
    }),

  /**
   * Add images to gallery
   */
  addImages: orgAuthed
    .route({
      method: "POST",
      path: "/gallery/:id/images",
      summary: "Add images to gallery",
      tags: ["Gallery"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        images: z.array(
          z.object({
            imageUrl: z.string(),
            caption: z.string().optional(),
          }),
        ),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const images = input.images.map((img, index) => ({
        galleryId: input.id,
        imageUrl: img.imageUrl,
        caption: img.caption,
        order: index,
        uploadedBy: context.user.id,
      }));

      const inserted = await db
        .insert(schema.galleryImages)
        .values(images)
        .returning();

      return { images: inserted };
    }),

  /**
   * Update gallery
   */
  update: orgAuthed
    .route({
      method: "PUT",
      path: "/gallery/:id",
      summary: "Update gallery",
      tags: ["Gallery"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          category: z.string().optional(),
          location: z.string().optional(),
          coverImage: z.string().optional(),
          isActive: z.boolean().optional(),
        }),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const [gallery] = await db
        .update(schema.gallery)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(eq(schema.gallery.id, input.id))
        .returning();

      return { gallery };
    }),

  /**
   * Delete gallery
   */
  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/gallery/:id",
      summary: "Delete gallery",
      tags: ["Gallery"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      await db
        .delete(schema.galleryImages)
        .where(eq(schema.galleryImages.galleryId, input.id));
      await db.delete(schema.gallery).where(eq(schema.gallery.id, input.id));

      return { success: true };
    }),

  /**
   * Get gallery categories
   */
  categories: orgAuthed
    .route({
      method: "GET",
      path: "/gallery/categories",
      summary: "Get gallery categories",
      tags: ["Gallery"],
    })
    .output(z.any())
    .handler(async ({ context }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const categories = await db
        .select({
          category: schema.gallery.category,
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.gallery)
        .where(eq(schema.gallery.isActive, true))
        .groupBy(schema.gallery.category);

      return { categories };
    }),
};
