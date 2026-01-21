/**
 * Gate Pass Router
 *
 * API routes for gate pass management
 */

import { z } from "zod";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { orgAuthed } from "../../procedures";
import { getDb, schema } from "../../lib/db";

export const gatePassRouter = {
  /**
   * Get all gate passes
   */
  list: orgAuthed
    .route({
      method: "GET",
      path: "/gate-passes",
      summary: "Get all gate passes",
      tags: ["Gate Pass"],
    })
    .input(
      z
        .object({
          studentId: z.string().uuid().optional(),
          status: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
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
      if (input?.studentId)
        conditions.push(eq(schema.gatePasses.studentId, input.studentId));
      if (input?.status)
        conditions.push(eq(schema.gatePasses.status, input.status));
      if (input?.startDate && input?.endDate) {
        conditions.push(
          sql`${schema.gatePasses.exitDate} BETWEEN ${input.startDate} AND ${input.endDate}`,
        );
      }

      const gatePasses = await db
        .select({
          id: schema.gatePasses.id,
          passNumber: schema.gatePasses.passNumber,
          exitDate: schema.gatePasses.exitDate,
          exitTime: schema.gatePasses.exitTime,
          expectedReturnDate: schema.gatePasses.expectedReturnDate,
          expectedReturnTime: schema.gatePasses.expectedReturnTime,
          actualReturnDate: schema.gatePasses.actualReturnDate,
          actualReturnTime: schema.gatePasses.actualReturnTime,
          reason: schema.gatePasses.reason,
          guardianName: schema.gatePasses.guardianName,
          guardianPhone: schema.gatePasses.guardianPhone,
          status: schema.gatePasses.status,
          student: {
            id: schema.students.id,
            firstName: schema.students.firstName,
            lastName: schema.students.lastName,
            admissionNumber: schema.students.admissionNumber,
            classId: schema.students.classId,
          },
        })
        .from(schema.gatePasses)
        .leftJoin(
          schema.students,
          eq(schema.gatePasses.studentId, schema.students.id),
        )
        .leftJoin(
          schema.classes,
          eq(schema.students.classId, schema.classes.id),
        )
        .where(and(...conditions))
        .orderBy(desc(schema.gatePasses.createdAt))
        .limit(limit)
        .offset(offset);

      return { gatePasses, pagination: { page, limit } };
    }),

  /**
   * Create gate pass request
   */
  create: orgAuthed
    .route({
      method: "POST",
      path: "/gate-passes",
      summary: "Create gate pass",
      tags: ["Gate Pass"],
    })
    .input(
      z.object({
        studentId: z.string().uuid(),
        reason: z.string().min(1),
        exitDate: z.string(),
        exitTime: z.string(),
        expectedReturnDate: z.string().optional(),
        expectedReturnTime: z.string().optional(),
        guardianName: z.string().optional(),
        guardianPhone: z.string().optional(),
        guardianRelation: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;
      const passNumber = `GP-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

      const [gatePass] = await db
        .insert(schema.gatePasses)
        .values({
          ...input,
          passNumber,
          requestedBy: context.user.id,
          status: "pending",
        })
        .returning();

      return { gatePass };
    }),

  /**
   * Approve gate pass
   */
  approve: orgAuthed
    .route({
      method: "POST",
      path: "/gate-passes/:id/approve",
      summary: "Approve gate pass",
      tags: ["Gate Pass"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        remarks: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const [gatePass] = await db
        .update(schema.gatePasses)
        .set({
          status: "approved",
          approvedBy: context.user.id,
          approvedAt: new Date(),
          remarks: input.remarks,
          updatedAt: new Date(),
        })
        .where(eq(schema.gatePasses.id, input.id))
        .returning();

      return { gatePass };
    }),

  /**
   * Reject gate pass
   */
  reject: orgAuthed
    .route({
      method: "POST",
      path: "/gate-passes/:id/reject",
      summary: "Reject gate pass",
      tags: ["Gate Pass"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        remarks: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const [gatePass] = await db
        .update(schema.gatePasses)
        .set({
          status: "rejected",
          remarks: input.remarks,
          updatedAt: new Date(),
        })
        .where(eq(schema.gatePasses.id, input.id))
        .returning();

      return { gatePass };
    }),

  /**
   * Mark gate pass as used (exit)
   */
  markUsed: orgAuthed
    .route({
      method: "POST",
      path: "/gate-passes/:id/use",
      summary: "Mark gate pass as used",
      tags: ["Gate Pass"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const [gatePass] = await db
        .update(schema.gatePasses)
        .set({
          status: "used",
          updatedAt: new Date(),
        })
        .where(eq(schema.gatePasses.id, input.id))
        .returning();

      return { gatePass };
    }),

  /**
   * Mark gate pass as returned
   */
  markReturned: orgAuthed
    .route({
      method: "POST",
      path: "/gate-passes/:id/return",
      summary: "Mark gate pass as returned",
      tags: ["Gate Pass"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        actualReturnDate: z.string().optional(),
        actualReturnTime: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const [gatePass] = await db
        .update(schema.gatePasses)
        .set({
          status: "returned",
          actualReturnDate:
            input.actualReturnDate || new Date().toISOString().split("T")[0],
          actualReturnTime:
            input.actualReturnTime || new Date().toTimeString().slice(0, 5),
          updatedAt: new Date(),
        })
        .where(eq(schema.gatePasses.id, input.id))
        .returning();

      return { gatePass };
    }),

  /**
   * Get gate pass statistics
   */
  stats: orgAuthed
    .route({
      method: "GET",
      path: "/gate-passes/stats",
      summary: "Get gate pass statistics",
      tags: ["Gate Pass"],
    })
    .output(z.any())
    .handler(async ({ context }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const [stats] = await db
        .select({
          total: sql<number>`COUNT(*)`,
          pending: sql<number>`SUM(CASE WHEN ${schema.gatePasses.status} = 'pending' THEN 1 ELSE 0 END)`,
          approved: sql<number>`SUM(CASE WHEN ${schema.gatePasses.status} = 'approved' THEN 1 ELSE 0 END)`,
          used: sql<number>`SUM(CASE WHEN ${schema.gatePasses.status} = 'used' THEN 1 ELSE 0 END)`,
          returned: sql<number>`SUM(CASE WHEN ${schema.gatePasses.status} = 'returned' THEN 1 ELSE 0 END)`,
          rejected: sql<number>`SUM(CASE WHEN ${schema.gatePasses.status} = 'rejected' THEN 1 ELSE 0 END)`,
        })
        .from(schema.gatePasses);

      return {
        stats: {
          total: Number(stats?.total) || 0,
          pending: Number(stats?.pending) || 0,
          approved: Number(stats?.approved) || 0,
          used: Number(stats?.used) || 0,
          returned: Number(stats?.returned) || 0,
          rejected: Number(stats?.rejected) || 0,
        },
      };
    }),
};
