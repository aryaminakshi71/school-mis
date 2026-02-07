/**
 * SMS Router
 *
 * API routes for SMS notifications
 */

import { z } from "zod";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { orgAuthed } from "../../procedures";
import { getDb, schema } from "../../lib/db";

export const smsRouter = {
  /**
   * Get SMS logs
   */
  logs: orgAuthed
    .route({
      method: "GET",
      path: "/sms/logs",
      summary: "Get SMS logs",
      tags: ["SMS"],
    })
    .input(
      z
        .object({
          recipientType: z.string().optional(),
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
      if (input?.recipientType)
        conditions.push(eq(schema.smsLogs.recipientType, input.recipientType));
      if (input?.status)
        conditions.push(eq(schema.smsLogs.status, input.status));

      const logs = await db
        .select()
        .from(schema.smsLogs)
        .where(and(...conditions))
        .orderBy(desc(schema.smsLogs.createdAt))
        .limit(limit)
        .offset(offset);

      return { logs, pagination: { page, limit } };
    }),

  /**
   * Get SMS templates
   */
  templates: orgAuthed
    .route({
      method: "GET",
      path: "/sms/templates",
      summary: "Get SMS templates",
      tags: ["SMS"],
    })
    .input(z.object({ type: z.string().optional() }).optional())
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const conditions = [eq(schema.smsTemplates.isActive, true)];
      if (input?.type)
        conditions.push(eq(schema.smsTemplates.type, input.type));

      const templates = await db
        .select()
        .from(schema.smsTemplates)
        .where(and(...conditions))
        .orderBy(asc(schema.smsTemplates.name));

      return { templates };
    }),

  /**
   * Create SMS template
   */
  createTemplate: orgAuthed
    .route({
      method: "POST",
      path: "/sms/templates",
      summary: "Create SMS template",
      tags: ["SMS"],
    })
    .input(
      z.object({
        name: z.string().min(1),
        templateId: z.string().min(1),
        content: z.string().min(1),
        type: z.enum(["attendance", "fee", "exam", "general", "alert"]),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const [template] = await db
        .insert(schema.smsTemplates)
        .values(input)
        .returning();

      return { template };
    }),

  /**
   * Send SMS
   */
  send: orgAuthed
    .route({
      method: "POST",
      path: "/sms/send",
      summary: "Send SMS",
      tags: ["SMS"],
    })
    .input(
      z.object({
        recipientType: z.enum(["student", "parent", "staff", "teacher"]),
        recipientId: z.string().uuid().optional(),
        phoneNumber: z.string().optional(),
        message: z.string().min(1),
        templateId: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      let phoneNumber = input.phoneNumber;
      let recipientId = input.recipientId;

      if (!phoneNumber && input.recipientId) {
        if (input.recipientType === "student") {
          const [student] = await db
            .select({
              phone: schema.students.phone,
              fatherPhone: schema.students.fatherPhone,
            })
            .from(schema.students)
            .where(eq(schema.students.id, input.recipientId));
          phoneNumber = student?.fatherPhone ?? student?.phone ?? undefined;
        } else if (input.recipientType === "teacher") {
          const [teacher] = await db
            .select({ phone: schema.teachers.phone })
            .from(schema.teachers)
            .where(eq(schema.teachers.id, input.recipientId));
          phoneNumber = teacher?.phone ?? undefined;
        } else if (input.recipientType === "staff") {
          const [staff] = await db
            .select({ phone: schema.staff.phone })
            .from(schema.staff)
            .where(eq(schema.staff.id, input.recipientId));
          phoneNumber = staff?.phone ?? undefined;
        }
      }

      if (!phoneNumber) {
        throw new Error("Phone number not found");
      }

      // Ensure recipientId is a valid string
      const finalRecipientId = input.recipientId || recipientId;
      if (!finalRecipientId) {
        throw new Error("Recipient ID is required");
      }

      const [log] = await db
        .insert(schema.smsLogs)
        .values({
          recipientType: input.recipientType,
          recipientId: finalRecipientId,
          phoneNumber,
          message: input.message,
          templateId: input.templateId,
          status: "sent",
          sentAt: new Date(),
        })
        .returning();

      return { log };
    }),

  /**
   * Send bulk SMS
   */
  sendBulk: orgAuthed
    .route({
      method: "POST",
      path: "/sms/send-bulk",
      summary: "Send bulk SMS",
      tags: ["SMS"],
    })
    .input(
      z.object({
        recipientType: z.enum(["student", "parent", "staff", "teacher"]),
        classId: z.string().uuid().optional(),
        message: z.string().min(1),
        templateId: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      let students;
      if (input.classId) {
        students = await db
          .select({
            id: schema.students.id,
            phone: schema.students.phone,
            fatherPhone: schema.students.fatherPhone,
          })
          .from(schema.students)
          .where(eq(schema.students.classId, input.classId));
      } else {
        students = await db
          .select({
            id: schema.students.id,
            phone: schema.students.phone,
            fatherPhone: schema.students.fatherPhone,
          })
          .from(schema.students)
          .where(eq(schema.students.status, true));
      }

      const logs = [];
      for (const student of students) {
        const phoneNumber = student.fatherPhone || student.phone;
        if (phoneNumber) {
          const [log] = await db
            .insert(schema.smsLogs)
            .values({
              recipientType: input.recipientType,
              recipientId: student.id,
              phoneNumber,
              message: input.message,
              templateId: input.templateId,
              status: "sent",
              sentAt: new Date(),
            })
            .returning();
          logs.push(log);
        }
      }

      return { sent: logs.length, logs };
    }),

  /**
   * Get SMS statistics
   */
  stats: orgAuthed
    .route({
      method: "GET",
      path: "/sms/stats",
      summary: "Get SMS statistics",
      tags: ["SMS"],
    })
    .output(z.any())
    .handler(async ({ context }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const [stats] = await db
        .select({
          total: sql<number>`COUNT(*)`,
          sent: sql<number>`SUM(CASE WHEN ${schema.smsLogs.status} = 'sent' THEN 1 ELSE 0 END)`,
          delivered: sql<number>`SUM(CASE WHEN ${schema.smsLogs.status} = 'delivered' THEN 1 ELSE 0 END)`,
          failed: sql<number>`SUM(CASE WHEN ${schema.smsLogs.status} = 'failed' THEN 1 ELSE 0 END)`,
          pending: sql<number>`SUM(CASE WHEN ${schema.smsLogs.status} = 'pending' THEN 1 ELSE 0 END)`,
        })
        .from(schema.smsLogs);

      return {
        stats: {
          total: Number(stats?.total) || 0,
          sent: Number(stats?.sent) || 0,
          delivered: Number(stats?.delivered) || 0,
          failed: Number(stats?.failed) || 0,
          pending: Number(stats?.pending) || 0,
        },
      };
    }),
};
