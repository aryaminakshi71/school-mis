/**
 * Analytics Router
 *
 * oRPC router for analytics and reporting.
 */

import {
  analyticsEvents,
  analyticsSummaries,
  attendance,
  feePayments,
  students,
  teachers,
} from "@school/storage";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../lib/db.js";
import { pub } from "../../procedures/index.js";

export const analyticsRouter = {
  // Get dashboard summary
  dashboard: pub
    .route({
      method: "GET",
      path: "/analytics/dashboard",
      summary: "Get dashboard summary stats",
      tags: ["Analytics"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      const today = new Date().toISOString().split("T")[0];

      const [studentCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(students);

      const [teacherCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(teachers);

      const [staffCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(sql`staff`);

      const [attendanceToday] = await db
        .select({ count: sql<number>`count(*)` })
        .from(attendance)
        .where(sql`DATE(${attendance.date}::date) = ${today}`);

      const [feesCollected] = await db
        .select({ total: sql<string>`COALESCE(SUM(${feePayments.amount}), 0)` })
        .from(feePayments)
        .where(eq(feePayments.status, "paid"));

      const [feesPending] = await db
        .select({ count: sql<number>`count(*)` })
        .from(feePayments)
        .where(eq(feePayments.status, "pending"));

      return {
        totalStudents: studentCount?.count ?? 0,
        totalTeachers: teacherCount?.count ?? 0,
        totalStaff: staffCount?.count ?? 0,
        attendanceToday: attendanceToday?.count ?? 0,
        feesCollected: feesCollected?.total ?? "0",
        feesPending: feesPending?.count ?? 0,
      };
    }),

  // Get attendance trends
  attendanceTrends: pub
    .route({
      method: "GET",
      path: "/analytics/attendance-trends",
      summary: "Get attendance trends",
      tags: ["Analytics"],
    })
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();

      const records = await db
        .select({
          date: sql`DATE(${attendance.date}::date)`.as("date"),
          status: attendance.status,
          count: sql<number>`count(*)`.as("count"),
        })
        .from(attendance)
        .where(
          sql`DATE(${attendance.date}::date) >= ${input.startDate} AND DATE(${attendance.date}::date) <= ${input.endDate}`
        )
        .groupBy(sql`DATE(${attendance.date}::date)`, attendance.status);

      const trendsMap = new Map<
        string,
        { present: number; absent: number; total: number }
      >();

      for (const record of records) {
        const date = record.date as string;
        if (!trendsMap.has(date)) {
          trendsMap.set(date, { present: 0, absent: 0, total: 0 });
        }
        const entry = trendsMap.get(date)!;
        entry.total += record.count;
        if (record.status === "present") {
          entry.present = record.count;
        } else if (record.status === "absent") {
          entry.absent = record.count;
        }
      }

      return Array.from(trendsMap.entries()).map(([date, data]) => ({
        date,
        ...data,
      }));
    }),

  // Get fee collection trends
  feeTrends: pub
    .route({
      method: "GET",
      path: "/analytics/fee-trends",
      summary: "Get fee collection trends",
      tags: ["Analytics"],
    })
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();

      const records = await db
        .select({
          date: sql`DATE(${feePayments.paymentDate}::date)`.as("date"),
          amount: sql<string>`SUM(${feePayments.amount})`.as("amount"),
          count: sql<number>`count(*)`.as("count"),
        })
        .from(feePayments)
        .where(
          and(
            eq(feePayments.status, "paid"),
            sql`DATE(${feePayments.paymentDate}::date) >= ${input.startDate} AND DATE(${feePayments.paymentDate}::date) <= ${input.endDate}`
          )
        )
        .groupBy(sql`DATE(${feePayments.paymentDate}::date)`)
        .orderBy(sql`DATE(${feePayments.paymentDate}::date)`);

      return records.map((r) => ({
        date: r.date as string,
        amount: r.amount ?? "0",
        count: r.count ?? 0,
      }));
    }),

  // Record an analytics event
  trackEvent: pub
    .route({
      method: "POST",
      path: "/analytics/events",
      summary: "Track an analytics event",
      tags: ["Analytics"],
    })
    .input(
      z.object({
        eventType: z.string().min(1),
        entityType: z.string().optional(),
        entityId: z.string().uuid().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();

      const [event] = await db
        .insert(analyticsEvents)
        .values({
          eventType: input.eventType,
          entityType: input.entityType ?? null,
          entityId: input.entityId ?? null,
          metadata: input.metadata ?? null,
        })
        .returning();

      return { id: event.id };
    }),

  // Get analytics summaries
  getSummaries: pub
    .route({
      method: "GET",
      path: "/analytics/summaries",
      summary: "Get analytics summaries",
      tags: ["Analytics"],
    })
    .input(
      z.object({
        period: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
        metric: z.string().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();

      let query = db.select().from(analyticsSummaries);

      if (input.period) {
        query = query.where(eq(analyticsSummaries.period, input.period)) as typeof query;
      }

      const summaries = await query.orderBy(desc(analyticsSummaries.periodEnd));

      return summaries;
    }),

  // Get enrollment stats - simplified
  enrollmentStats: pub
    .route({
      method: "GET",
      path: "/analytics/enrollment",
      summary: "Get enrollment statistics",
      tags: ["Analytics"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      const allStudents = await db.select().from(students);
      return [{ year: new Date().getFullYear(), month: new Date().getMonth() + 1, newStudents: allStudents.length, totalActive: allStudents.length }];
    }),
};
