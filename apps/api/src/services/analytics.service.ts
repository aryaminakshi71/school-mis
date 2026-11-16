import {
  attendance,
  classes,
  db,
  examSchedules,
  feePayments,
  students,
  teachers,
} from "@school/storage";
import { and, eq, gte, lte, sql } from "drizzle-orm";

export interface DashboardMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendance: {
    present: number;
    absent: number;
    percentage: number;
  };
  feeCollection: {
    total: number;
    collected: number;
    pending: number;
    percentage: number;
  };
  upcomingExams: number;
  newAdmissions: number;
}

export interface TrendData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    color: string;
  }>;
}

export interface PerformanceMetrics {
  subject: string;
  classAverage: number;
  highestScore: number;
  lowestScore: number;
  passPercentage: number;
}

export class AnalyticsService {
  // Get dashboard overview metrics
  async getDashboardMetrics(schoolId?: string): Promise<DashboardMetrics> {
    // Get today's date in YYYY-MM-DD format for date column comparisons
    const formatDate = (date: Date): string => {
      return date.toISOString().split("T")[0];
    };

    const today = new Date();
    const todayStr = formatDate(today);
    today.setHours(0, 0, 0, 0);

    // Calculate 7 days later for exam queries
    const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const sevenDaysLaterStr = formatDate(sevenDaysLater);

    const [
      studentCount,
      teacherCount,
      classCount,
      todayAttendanceData,
      feeData,
      upcomingExamsCount,
    ] = await Promise.all([
      // Total students
      db
        .select({ count: sql<number>`count(*)` })
        .from(students)
        .then((res) => res[0]?.count || 0),

      // Total teachers
      db
        .select({ count: sql<number>`count(*)` })
        .from(teachers)
        .then((res) => res[0]?.count || 0),

      // Total classes
      db
        .select({ count: sql<number>`count(*)` })
        .from(classes)
        .then((res) => res[0]?.count || 0),

      // Today's attendance
      db
        .select({
          present: sql<number>`sum(case when status = 'present' then 1 else 0 end)`,
          absent: sql<number>`sum(case when status = 'absent' then 1 else 0 end)`,
        })
        .from(attendance)
        .where(sql`date(date) = ${today.toISOString().split("T")[0]}`)
        .then((res) => res[0]),

      // Fee collection this month
      db
        .select({
          total: sql<number>`sum(amount)`,
        })
        .from(feePayments)
        .where(
          and(
            gte(
              feePayments.paymentDate,
              new Date(today.getFullYear(), today.getMonth(), 1),
            ),
            lte(feePayments.paymentDate, today),
          ),
        )
        .then((res) => res[0]?.total || 0),

      // Upcoming exams (next 7 days)
      db
        .select({ count: sql<number>`count(*)` })
        .from(examSchedules)
        .where(
          and(
            gte(examSchedules.examDate, todayStr),
            lte(examSchedules.examDate, sevenDaysLaterStr),
          ),
        )
        .then((res) => res[0]?.count || 0),
    ]);

    const totalStudentsToday =
      (todayAttendanceData?.present || 0) + (todayAttendanceData?.absent || 0);
    const attendancePercentage =
      totalStudentsToday > 0
        ? ((todayAttendanceData?.present || 0) / totalStudentsToday) * 100
        : 0;

    return {
      totalStudents: studentCount,
      totalTeachers: teacherCount,
      totalClasses: classCount,
      todayAttendance: {
        present: todayAttendanceData?.present || 0,
        absent: todayAttendanceData?.absent || 0,
        percentage: Math.round(attendancePercentage * 100) / 100,
      },
      feeCollection: {
        total: feeData,
        collected: feeData * 0.7, // Mock data
        pending: feeData * 0.3,
        percentage: 70,
      },
      upcomingExams: upcomingExamsCount,
      newAdmissions: 15, // Mock data
    };
  }

  // Get attendance trends (last 30 days)
  async getAttendanceTrends(classId?: string): Promise<TrendData> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const attendanceData = await db
      .select({
        date: sql<string>`date(date)`,
        present: sql<number>`sum(case when status = 'present' then 1 else 0 end)`,
        absent: sql<number>`sum(case when status = 'absent' then 1 else 0 end)`,
      })
      .from(attendance)
      .where(gte(attendance.date, thirtyDaysAgoStr))
      .groupBy(sql`date(date)`)
      .orderBy(sql`date(date)`);

    return {
      labels: attendanceData.map((d) => d.date),
      datasets: [
        {
          label: "Present",
          data: attendanceData.map((d) => d.present),
          color: "#10b981",
        },
        {
          label: "Absent",
          data: attendanceData.map((d) => d.absent),
          color: "#ef4444",
        },
      ],
    };
  }

  // Get fee collection trends (last 12 months)
  async getFeeCollectionTrends(): Promise<TrendData> {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const feeData = await db
      .select({
        month: sql<string>`to_char(payment_date, 'YYYY-MM')`,
        collected: sql<number>`sum(amount)`,
      })
      .from(feePayments)
      .where(gte(feePayments.paymentDate, twelveMonthsAgo))
      .groupBy(sql`to_char(payment_date, 'YYYY-MM')`)
      .orderBy(sql`to_char(payment_date, 'YYYY-MM')`);

    return {
      labels: feeData.map((d) => d.month),
      datasets: [
        {
          label: "Fee Collection (₹)",
          data: feeData.map((d) => d.collected),
          color: "#4f46e5",
        },
      ],
    };
  }

  // Get class-wise performance
  async getClassPerformance(): Promise<PerformanceMetrics[]> {
    // This would aggregate exam results data
    // Mock implementation for now
    return [
      {
        subject: "Mathematics",
        classAverage: 75.5,
        highestScore: 98,
        lowestScore: 45,
        passPercentage: 92,
      },
      {
        subject: "Science",
        classAverage: 78.2,
        highestScore: 96,
        lowestScore: 52,
        passPercentage: 94,
      },
      {
        subject: "English",
        classAverage: 82.1,
        highestScore: 99,
        lowestScore: 60,
        passPercentage: 97,
      },
      {
        subject: "Social Studies",
        classAverage: 79.8,
        highestScore: 95,
        lowestScore: 55,
        passPercentage: 95,
      },
      {
        subject: "Computer Science",
        classAverage: 85.3,
        highestScore: 100,
        lowestScore: 65,
        passPercentage: 98,
      },
    ];
  }

  // Get student distribution by grade/class
  async getStudentDistribution(): Promise<{
    byClass: Array<{ className: string; count: number }>;
    byGender: Array<{ gender: string; count: number }>;
    byAge: Array<{ ageGroup: string; count: number }>;
  }> {
    const byClass = await db
      .select({
        className: classes.name,
        count: sql<number>`count(${students.id})`,
      })
      .from(students)
      .leftJoin(classes, eq(students.classId, classes.id))
      .groupBy(classes.name);

    // Mock data for gender and age
    return {
      byClass: byClass.map((c) => ({
        className: c.className || "Unknown",
        count: c.count,
      })),
      byGender: [
        { gender: "Male", count: 520 },
        { gender: "Female", count: 480 },
      ],
      byAge: [
        { ageGroup: "5-7", count: 200 },
        { ageGroup: "8-10", count: 350 },
        { ageGroup: "11-13", count: 280 },
        { ageGroup: "14-16", count: 170 },
      ],
    };
  }

  // Get top performing students
  async getTopStudents(limit: number = 10): Promise<
    Array<{
      id: string;
      name: string;
      className: string;
      averageMarks: number;
      attendance: number;
    }>
  > {
    // Mock data - would query actual grades and attendance
    return Array.from({ length: limit }, (_, i) => ({
      id: `student_${i + 1}`,
      name: `Student ${i + 1}`,
      className: `Class ${Math.floor(i / 3) + 5}`,
      averageMarks: 90 - i * 2,
      attendance: 95 - i,
    }));
  }

  // Get students needing attention (low attendance/grades)
  async getAtRiskStudents(): Promise<
    Array<{
      id: string;
      name: string;
      className: string;
      attendance: number;
      averageMarks: number;
      riskLevel: "high" | "medium" | "low";
      issues: string[];
    }>
  > {
    // Would query students with attendance < 75% or marks < 40%
    return [
      {
        id: "1",
        name: "John Doe",
        className: "Class 8-A",
        attendance: 65,
        averageMarks: 45,
        riskLevel: "high",
        issues: ["Low attendance", "Poor academic performance"],
      },
      {
        id: "2",
        name: "Jane Smith",
        className: "Class 9-B",
        attendance: 70,
        averageMarks: 52,
        riskLevel: "medium",
        issues: ["Below average attendance"],
      },
    ];
  }

  // Get comparative analysis (year over year)
  async getYearOverYearComparison(): Promise<{
    currentYear: {
      admissions: number;
      passRate: number;
      avgAttendance: number;
    };
    previousYear: {
      admissions: number;
      passRate: number;
      avgAttendance: number;
    };
    change: { admissions: number; passRate: number; avgAttendance: number };
  }> {
    return {
      currentYear: { admissions: 120, passRate: 94.5, avgAttendance: 91.2 },
      previousYear: { admissions: 110, passRate: 92.8, avgAttendance: 89.5 },
      change: { admissions: 9.1, passRate: 1.7, avgAttendance: 1.7 },
    };
  }

  // Generate custom report
  async generateCustomReport(
    reportType: "attendance" | "fees" | "academic" | "comprehensive",
    startDate: Date,
    endDate: Date,
    filters?: Record<string, any>,
  ): Promise<{
    title: string;
    generatedAt: Date;
    data: any;
    summary: string;
  }> {
    // Implementation would generate actual reports
    return {
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      generatedAt: new Date(),
      data: {},
      summary: `Report generated for period ${startDate.toDateString()} to ${endDate.toDateString()}`,
    };
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
