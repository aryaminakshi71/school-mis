/**
 * Branding Router — per-organization white-label settings.
 */

import { z } from "zod";
import { eq } from "drizzle-orm";
import { whiteLabelSettings } from "@school/storage";
import { getDb } from "../../lib/db.js";
import { orgAuthed } from "../../procedures/index.js";

const updateSchema = z.object({
  brandName: z.string().min(1).max(120),
  logoUrl: z.string().url().nullable().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  supportEmail: z.string().email().nullable().optional(),
  customDomain: z.string().max(180).nullable().optional(),
});

function orgIdOf(context: any): string {
  return (
    context?.organization?.id ??
    context?.user?.organizationId ??
    ""
  );
}

export const brandingRouter = {
  get: orgAuthed
    .route({
      method: "GET",
      path: "/branding",
      summary: "Get white-label branding",
      tags: ["Branding"],
    })
    .output(z.any())
    .handler(async ({ context }) => {
      const orgId = orgIdOf(context);
      if (!orgId) return { branding: null };
      const db = getDb();
      const [row] = await db
        .select()
        .from(whiteLabelSettings)
        .where(eq(whiteLabelSettings.organizationId, orgId))
        .limit(1);
      return { branding: row ?? null };
    }),

  update: orgAuthed
    .route({
      method: "PUT",
      path: "/branding",
      summary: "Update white-label branding",
      tags: ["Branding"],
    })
    .input(updateSchema)
    .output(z.any())
    .handler(async ({ context, input }) => {
      const orgId = orgIdOf(context);
      if (!orgId) {
        throw new Error("No organization in context");
      }
      const db = getDb();
      const [existing] = await db
        .select()
        .from(whiteLabelSettings)
        .where(eq(whiteLabelSettings.organizationId, orgId))
        .limit(1);

      if (existing) {
        const [row] = await db
          .update(whiteLabelSettings)
          .set({ ...input, updatedAt: new Date() })
          .where(eq(whiteLabelSettings.organizationId, orgId))
          .returning();
        return { branding: row };
      }

      const [row] = await db
        .insert(whiteLabelSettings)
        .values({ organizationId: orgId, ...input })
        .returning();
      return { branding: row };
    }),
};
