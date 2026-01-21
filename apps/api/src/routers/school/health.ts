/**
 * Health Router
 *
 * API routes for student health records
 */

import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { orgAuthed } from "../../procedures";
import { getDb, schema } from "../../lib/db";

export const healthRouter = {
  /**
   * Get health records for a student
   */
  records: orgAuthed
    .route({
      method: "GET",
      path: "/health/records",
      summary: "Get health records",
      tags: ["Health"],
    })
    .input(
      z
        .object({
          studentId: z.string().uuid().optional(),
          visitType: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
        .optional(),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const conditions = [];
      if (input?.studentId)
        conditions.push(eq(schema.healthRecords.studentId, input.studentId));
      if (input?.visitType)
        conditions.push(eq(schema.healthRecords.visitType, input.visitType));

      const records = await db
        .select({
          id: schema.healthRecords.id,
          visitDate: schema.healthRecords.visitDate,
          visitType: schema.healthRecords.visitType,
          symptoms: schema.healthRecords.symptoms,
          diagnosis: schema.healthRecords.diagnosis,
          treatment: schema.healthRecords.treatment,
          medication: schema.healthRecords.medication,
          doctorName: schema.healthRecords.doctorName,
          temperature: schema.healthRecords.temperature,
          bloodPressure: schema.healthRecords.bloodPressure,
          weight: schema.healthRecords.weight,
          height: schema.healthRecords.height,
          notes: schema.healthRecords.notes,
          student: {
            id: schema.students.id,
            firstName: schema.students.firstName,
            lastName: schema.students.lastName,
            admissionNumber: schema.students.admissionNumber,
          },
        })
        .from(schema.healthRecords)
        .leftJoin(
          schema.students,
          eq(schema.healthRecords.studentId, schema.students.id),
        )
        .where(and(...conditions))
        .orderBy(desc(schema.healthRecords.visitDate));

      return { records };
    }),

  /**
   * Add health record
   */
  addRecord: orgAuthed
    .route({
      method: "POST",
      path: "/health/records",
      summary: "Add health record",
      tags: ["Health"],
    })
    .input(
      z.object({
        studentId: z.string().uuid(),
        visitDate: z.string(),
        visitType: z.enum(["exam", "routine", "emergency"]),
        symptoms: z.string().optional(),
        diagnosis: z.string().optional(),
        treatment: z.string().optional(),
        medication: z.string().optional(),
        doctorName: z.string().optional(),
        temperature: z.number().optional(),
        bloodPressure: z.string().optional(),
        weight: z.number().optional(),
        height: z.number().optional(),
        notes: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const [record] = await db
        .insert(schema.healthRecords)
        .values(input)
        .returning();

      return { record };
    }),

  /**
   * Get health summary for a student
   */
  summary: orgAuthed
    .route({
      method: "GET",
      path: "/health/summary/:studentId",
      summary: "Get health summary for student",
      tags: ["Health"],
    })
    .input(z.object({ studentId: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const [summary] = await db
        .select({
          totalVisits: sql<number>`COUNT(*)`,
          examVisits: sql<number>`SUM(CASE WHEN ${schema.healthRecords.visitType} = 'exam' THEN 1 ELSE 0 END)`,
          emergencyVisits: sql<number>`SUM(CASE WHEN ${schema.healthRecords.visitType} = 'emergency' THEN 1 ELSE 0 END)`,
          routineVisits: sql<number>`SUM(CASE WHEN ${schema.healthRecords.visitType} = 'routine' THEN 1 ELSE 0 END)`,
          lastCheckupDate: sql`MAX(${schema.healthRecords.visitDate})`,
        })
        .from(schema.healthRecords)
        .where(eq(schema.healthRecords.studentId, input.studentId));

      return {
        summary: {
          totalVisits: Number(summary?.totalVisits) || 0,
          examVisits: Number(summary?.examVisits) || 0,
          emergencyVisits: Number(summary?.emergencyVisits) || 0,
          routineVisits: Number(summary?.routineVisits) || 0,
          lastCheckupDate: summary?.lastCheckupDate,
        },
      };
    }),

  /**
   * Get health statistics for all students
   */
  stats: orgAuthed
    .route({
      method: "GET",
      path: "/health/stats",
      summary: "Get health statistics",
      tags: ["Health"],
    })
    .output(z.any())
    .handler(async ({ context }) => {
      const db = getDb();
      const orgId = context.organization.id;

      const [stats] = await db
        .select({
          totalRecords: sql<number>`COUNT(*)`,
          examVisits: sql<number>`SUM(CASE WHEN ${schema.healthRecords.visitType} = 'exam' THEN 1 ELSE 0 END)`,
          emergencyVisits: sql<number>`SUM(CASE WHEN ${schema.healthRecords.visitType} = 'emergency' THEN 1 ELSE 0 END)`,
          routineVisits: sql<number>`SUM(CASE WHEN ${schema.healthRecords.visitType} = 'routine' THEN 1 ELSE 0 END)`,
          studentsWithVisits: sql<number>`COUNT(DISTINCT ${schema.healthRecords.studentId})`,
        })
        .from(schema.healthRecords);

      return {
        stats: {
          totalRecords: Number(stats?.totalRecords) || 0,
          examVisits: Number(stats?.examVisits) || 0,
          emergencyVisits: Number(stats?.emergencyVisits) || 0,
          routineVisits: Number(stats?.routineVisits) || 0,
          studentsWithVisits: Number(stats?.studentsWithVisits) || 0,
        },
      };
    }),
};
