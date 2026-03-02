import { classes, db, feePayments, students, teachers } from "@school/storage";
import { and, count, eq, gte, sql } from "drizzle-orm";
import { feesService } from "./fees.service";

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  monthlyFeeCollection: number;
  pendingFeePayments: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [studentsCount, teachersCount, classesCount, feeStats] =
      await Promise.all([
        db.select({ count: count() }).from(students),
        db.select({ count: count() }).from(teachers),
        db.select({ count: count() }).from(classes),
        feesService.getStats(),
      ]);

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyFees = await db
      .select({ total: sql<number>`sum(${feePayments.amount})` })
      .from(feePayments)
      .where(
        and(
          eq(feePayments.status, "completed"),
          gte(feePayments.paymentDate, currentMonth),
        ),
      );

    return {
      totalStudents: Number(studentsCount[0]?.count || 0),
      totalTeachers: Number(teachersCount[0]?.count || 0),
      totalClasses: Number(classesCount[0]?.count || 0),
      monthlyFeeCollection: Number(monthlyFees[0]?.total || 0),
      pendingFeePayments: feeStats.pending,
    };
  },
};
