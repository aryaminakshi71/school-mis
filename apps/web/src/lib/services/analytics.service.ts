export interface AnalyticsData {
  students: StudentAnalytics;
  staff: StaffAnalytics;
  fees: FeeAnalytics;
  attendance: AttendanceAnalytics;
  exams: ExamAnalytics;
  library: LibraryAnalytics;
}

export interface StudentAnalytics {
  totalStudents: number;
  newAdmissions: number;
  withdrawals: number;
  classWiseDistribution: Array<{ class: string; count: number }>;
  genderDistribution: { male: number; female: number; other: number };
  monthlyTrend: Array<{ month: string; count: number }>;
}

export interface StaffAnalytics {
  totalStaff: number;
  teachers: number;
  supportStaff: number;
  departments: Array<{ name: string; count: number }>;
  avgExperience: number;
  qualifications: Array<{ degree: string; count: number }>;
}

export interface FeeAnalytics {
  totalCollection: number;
  pendingAmount: number;
  overdueAmount: number;
  collectionRate: number;
  monthlyCollection: Array<{ month: string; amount: number }>;
  classWiseCollection: Array<{
    class: string;
    collected: number;
    pending: number;
  }>;
  paymentMethods: Array<{ method: string; count: number; amount: number }>;
}

export interface AttendanceAnalytics {
  overallRate: number;
  dailyTrend: Array<{ date: string; rate: number }>;
  classWiseRate: Array<{ class: string; rate: number }>;
  monthlyTrend: Array<{ month: string; rate: number }>;
  lowAttendanceAlerts: number;
}

export interface ExamAnalytics {
  totalExams: number;
  avgPassRate: number;
  topPerformers: Array<{ studentId: string; name: string; percentage: number }>;
  subjectWisePerformance: Array<{
    subject: string;
    avgMarks: number;
    passRate: number;
  }>;
  gradeDistribution: Array<{ grade: string; count: number }>;
  monthlyTrend: Array<{ month: string; avgPercentage: number }>;
}

export interface LibraryAnalytics {
  totalBooks: number;
  issuedBooks: number;
  availableBooks: number;
  popularBooks: Array<{ title: string; issueCount: number }>;
  topBorrowers: Array<{
    studentId: string;
    name: string;
    booksBorrowed: number;
  }>;
  monthlyIssueTrend: Array<{ month: string; issues: number }>;
  overdueBooks: number;
}

export interface DashboardMetrics {
  students: { total: number; change: number };
  staff: { total: number; change: number };
  attendance: { rate: number; change: number };
  fees: { collected: number; target: number; change: number };
  exams: { passRate: number; change: number };
  library: { issued: number; change: number };
}

class AnalyticsService {
  private mockData: AnalyticsData = {
    students: {
      totalStudents: 1247,
      newAdmissions: 45,
      withdrawals: 12,
      classWiseDistribution: [
        { class: "Class 1", count: 120 },
        { class: "Class 2", count: 115 },
        { class: "Class 3", count: 130 },
        { class: "Class 4", count: 125 },
        { class: "Class 5", count: 140 },
        { class: "Class 6", count: 135 },
        { class: "Class 7", count: 128 },
        { class: "Class 8", count: 122 },
        { class: "Class 9", count: 142 },
        { class: "Class 10", count: 90 },
      ],
      genderDistribution: { male: 680, female: 545, other: 22 },
      monthlyTrend: [
        { month: "Aug 2025", count: 1180 },
        { month: "Sep 2025", count: 1205 },
        { month: "Oct 2025", count: 1220 },
        { month: "Nov 2025", count: 1235 },
        { month: "Dec 2025", count: 1240 },
        { month: "Jan 2026", count: 1247 },
      ],
    },
    staff: {
      totalStaff: 86,
      teachers: 62,
      supportStaff: 24,
      departments: [
        { name: "Mathematics", count: 12 },
        { name: "Science", count: 15 },
        { name: "English", count: 10 },
        { name: "Social Science", count: 8 },
        { name: "Hindi", count: 6 },
        { name: "Physical Education", count: 5 },
        { name: "Arts", count: 4 },
        { name: "Music", count: 2 },
      ],
      avgExperience: 7.5,
      qualifications: [
        { degree: "Ph.D.", count: 15 },
        { degree: "M.Ed.", count: 25 },
        { degree: "M.A.", count: 20 },
        { degree: "B.Ed.", count: 20 },
        { degree: "Other", count: 6 },
      ],
    },
    fees: {
      totalCollection: 12500000,
      pendingAmount: 850000,
      overdueAmount: 250000,
      collectionRate: 93.6,
      monthlyCollection: [
        { month: "Aug 2025", amount: 3200000 },
        { month: "Sep 2025", amount: 2800000 },
        { month: "Oct 2025", amount: 2100000 },
        { month: "Nov 2025", amount: 1800000 },
        { month: "Dec 2025", amount: 1500000 },
        { month: "Jan 2026", amount: 1100000 },
      ],
      classWiseCollection: [
        { class: "Class 1", collected: 980000, pending: 45000 },
        { class: "Class 2", collected: 920000, pending: 55000 },
        { class: "Class 3", collected: 1050000, pending: 60000 },
        { class: "Class 4", collected: 1000000, pending: 50000 },
        { class: "Class 5", collected: 1120000, pending: 75000 },
        { class: "Class 6", collected: 1080000, pending: 68000 },
        { class: "Class 7", collected: 1020000, pending: 72000 },
        { class: "Class 8", collected: 980000, pending: 65000 },
        { class: "Class 9", collected: 1140000, pending: 80000 },
        { class: "Class 10", collected: 720000, pending: 350000 },
      ],
      paymentMethods: [
        { method: "Online Transfer", count: 650, amount: 7500000 },
        { method: "UPI", count: 280, amount: 2800000 },
        { method: "Cash", count: 120, amount: 1200000 },
        { method: "Cheque", count: 50, amount: 1000000 },
      ],
    },
    attendance: {
      overallRate: 94.2,
      dailyTrend: [
        { date: "2026-01-16", rate: 95.5 },
        { date: "2026-01-17", rate: 92.3 },
        { date: "2026-01-18", rate: 96.1 },
        { date: "2026-01-19", rate: 93.8 },
        { date: "2026-01-20", rate: 94.5 },
        { date: "2026-01-21", rate: 93.2 },
        { date: "2026-01-22", rate: 94.8 },
      ],
      classWiseRate: [
        { class: "Class 1", rate: 96.5 },
        { class: "Class 2", rate: 95.2 },
        { class: "Class 3", rate: 94.8 },
        { class: "Class 4", rate: 93.5 },
        { class: "Class 5", rate: 94.1 },
        { class: "Class 6", rate: 93.8 },
        { class: "Class 7", rate: 92.5 },
        { class: "Class 8", rate: 91.8 },
        { class: "Class 9", rate: 93.2 },
        { class: "Class 10", rate: 94.0 },
      ],
      monthlyTrend: [
        { month: "Aug 2025", rate: 95.2 },
        { month: "Sep 2025", rate: 94.8 },
        { month: "Oct 2025", rate: 93.5 },
        { month: "Nov 2025", rate: 94.1 },
        { month: "Dec 2025", rate: 92.8 },
        { month: "Jan 2026", rate: 94.2 },
      ],
      lowAttendanceAlerts: 23,
    },
    exams: {
      totalExams: 48,
      avgPassRate: 87.5,
      topPerformers: [
        { studentId: "s1", name: "Aryan Sharma", percentage: 98.5 },
        { studentId: "s2", name: "Priya Patel", percentage: 97.8 },
        { studentId: "s3", name: "Rahul Kumar", percentage: 97.2 },
        { studentId: "s4", name: "Sneha Gupta", percentage: 96.5 },
        { studentId: "s5", name: "Vikash Singh", percentage: 96.0 },
      ],
      subjectWisePerformance: [
        { subject: "Mathematics", avgMarks: 78.5, passRate: 92 },
        { subject: "Science", avgMarks: 82.3, passRate: 95 },
        { subject: "English", avgMarks: 85.1, passRate: 97 },
        { subject: "Social Science", avgMarks: 80.2, passRate: 94 },
        { subject: "Hindi", avgMarks: 76.8, passRate: 89 },
      ],
      gradeDistribution: [
        { grade: "A+", count: 120 },
        { grade: "A", count: 250 },
        { grade: "B+", count: 320 },
        { grade: "B", count: 280 },
        { grade: "C", count: 180 },
        { grade: "D", count: 70 },
        { grade: "F", count: 27 },
      ],
      monthlyTrend: [
        { month: "Aug 2025", avgPercentage: 82.5 },
        { month: "Sep 2025", avgPercentage: 84.2 },
        { month: "Oct 2025", avgPercentage: 80.8 },
        { month: "Nov 2025", avgPercentage: 83.5 },
        { month: "Dec 2025", avgPercentage: 81.2 },
        { month: "Jan 2026", avgPercentage: 85.0 },
      ],
    },
    library: {
      totalBooks: 15420,
      issuedBooks: 3420,
      availableBooks: 12000,
      popularBooks: [
        { title: "The Adventures of Sherlock Holmes", issueCount: 89 },
        { title: "Harry Potter Series", issueCount: 76 },
        { title: "NCERT Mathematics Class 9", issueCount: 72 },
        { title: "The Diary of a Young Girl", issueCount: 68 },
        { title: "Brief History of Time", issueCount: 65 },
      ],
      topBorrowers: [
        { studentId: "s1", name: "Aryan Sharma", booksBorrowed: 24 },
        { studentId: "s2", name: "Priya Patel", booksBorrowed: 22 },
        { studentId: "s3", name: "Rahul Kumar", booksBorrowed: 20 },
        { studentId: "s4", name: "Sneha Gupta", booksBorrowed: 19 },
        { studentId: "s5", name: "Vikash Singh", booksBorrowed: 18 },
      ],
      monthlyIssueTrend: [
        { month: "Aug 2025", issues: 520 },
        { month: "Sep 2025", issues: 680 },
        { month: "Oct 2025", issues: 450 },
        { month: "Nov 2025", issues: 580 },
        { month: "Dec 2025", issues: 320 },
        { month: "Jan 2026", issues: 420 },
      ],
      overdueBooks: 45,
    },
  };

  getDashboardMetrics(): DashboardMetrics {
    return {
      students: { total: this.mockData.students.totalStudents, change: 4.2 },
      staff: { total: this.mockData.staff.totalStaff, change: 2.1 },
      attendance: { rate: this.mockData.attendance.overallRate, change: 1.5 },
      fees: {
        collected: this.mockData.fees.totalCollection,
        target: 15000000,
        change: 8.5,
      },
      exams: { passRate: this.mockData.exams.avgPassRate, change: 2.3 },
      library: { issued: this.mockData.library.issuedBooks, change: -5.2 },
    };
  }

  getStudentAnalytics(): StudentAnalytics {
    return this.mockData.students;
  }

  getStaffAnalytics(): StaffAnalytics {
    return this.mockData.staff;
  }

  getFeeAnalytics(): FeeAnalytics {
    return this.mockData.fees;
  }

  getAttendanceAnalytics(): AttendanceAnalytics {
    return this.mockData.attendance;
  }

  getExamAnalytics(): ExamAnalytics {
    return this.mockData.exams;
  }

  getLibraryAnalytics(): LibraryAnalytics {
    return this.mockData.library;
  }

  getFullAnalytics(): AnalyticsData {
    return this.mockData;
  }

  async exportToPDF(
    data: Record<string, any>,
    filename: string,
  ): Promise<void> {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  }

  async exportToExcel(
    data: Record<string, any[]>,
    filename: string,
  ): Promise<void> {
    const csvRows: string[] = [];
    const headers = Object.keys(data);
    csvRows.push(headers.join(","));

    const maxRows = Math.max(...headers.map((h) => data[h].length));

    for (let i = 0; i < maxRows; i++) {
      const row = headers.map((header) => {
        const item = data[header][i];
        if (item === null || item === undefined) return "";
        if (typeof item === "object") return JSON.stringify(item);
        return String(item);
      });
      csvRows.push(row.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.xls`;
    link.click();
  }

  private convertToCSV(data: Record<string, any>): string {
    const rows: string[] = [];
    const headers = Object.keys(data);

    headers.forEach((key) => {
      rows.push(`${key}: ${JSON.stringify(data[key])}`);
    });

    return rows.join("\n");
  }

  generateReport(
    type: "students" | "fees" | "attendance" | "exams" | "library",
  ): Blob {
    let content = "";

    switch (type) {
      case "students":
        content = this.generateStudentReport();
        break;
      case "fees":
        content = this.generateFeeReport();
        break;
      case "attendance":
        content = this.generateAttendanceReport();
        break;
      case "exams":
        content = this.generateExamReport();
        break;
      case "library":
        content = this.generateLibraryReport();
        break;
    }

    return new Blob([content], { type: "text/plain;charset=utf-8;" });
  }

  private generateStudentReport(): string {
    const s = this.mockData.students;
    return `
SCHOOL MIS - STUDENT REPORT
Generated: ${new Date().toLocaleString()}
====================================

TOTAL STUDENTS: ${s.totalStudents}
NEW ADMISSIONS: ${s.newAdmissions}
WITHDRAWALS: ${s.withdrawals}

CLASS WISE DISTRIBUTION
${s.classWiseDistribution.map((c) => `  ${c.class}: ${c.count}`).join("\n")}

GENDER DISTRIBUTION
  Male: ${s.genderDistribution.male}
  Female: ${s.genderDistribution.female}
  Other: ${s.genderDistribution.other}

MONTHLY TREND
${s.monthlyTrend.map((m) => `  ${m.month}: ${m.count}`).join("\n")}
`;
  }

  private generateFeeReport(): string {
    const f = this.mockData.fees;
    return `
SCHOOL MIS - FEE REPORT
Generated: ${new Date().toLocaleString()}
====================================

TOTAL COLLECTION: ₹${f.totalCollection.toLocaleString()}
PENDING: ₹${f.pendingAmount.toLocaleString()}
OVERDUE: ₹${f.overdueAmount.toLocaleString()}
COLLECTION RATE: ${f.collectionRate}%

MONTHLY COLLECTION
${f.monthlyCollection.map((m) => `  ${m.month}: ₹${m.amount.toLocaleString()}`).join("\n")}

PAYMENT METHODS
${f.paymentMethods.map((p) => `  ${p.method}: ${p.count} transactions (₹${p.amount.toLocaleString()})`).join("\n")}
`;
  }

  private generateAttendanceReport(): string {
    const a = this.mockData.attendance;
    return `
SCHOOL MIS - ATTENDANCE REPORT
Generated: ${new Date().toLocaleString()}
====================================

OVERALL ATTENDANCE RATE: ${a.overallRate}%
LOW ATTENDANCE ALERTS: ${a.lowAttendanceAlerts}

CLASS WISE RATES
${a.classWiseRate.map((c) => `  ${c.class}: ${c.rate}%`).join("\n")}

DAILY TREND
${a.dailyTrend.map((d) => `  ${d.date}: ${d.rate}%`).join("\n")}
`;
  }

  private generateExamReport(): string {
    const e = this.mockData.exams;
    return `
SCHOOL MIS - EXAM REPORT
Generated: ${new Date().toLocaleString()}
====================================

TOTAL EXAMS: ${e.totalExams}
AVERAGE PASS RATE: ${e.avgPassRate}%

TOP PERFORMERS
${e.topPerformers.map((p) => `  ${p.name}: ${p.percentage}%`).join("\n")}

SUBJECT WISE PERFORMANCE
${e.subjectWisePerformance.map((s) => `  ${s.subject}: Avg ${s.avgMarks}% (Pass: ${s.passRate}%)`).join("\n")}

GRADE DISTRIBUTION
${e.gradeDistribution.map((g) => `  Grade ${g.grade}: ${g.count} students`).join("\n")}
`;
  }

  private generateLibraryReport(): string {
    const l = this.mockData.library;
    return `
SCHOOL MIS - LIBRARY REPORT
Generated: ${new Date().toLocaleString()}
====================================

TOTAL BOOKS: ${l.totalBooks}
ISSUED: ${l.issuedBooks}
AVAILABLE: ${l.availableBooks}
OVERDUE: ${l.overdueBooks}

POPULAR BOOKS
${l.popularBooks.map((b) => `  ${b.title}: ${b.issueCount} issues`).join("\n")}

TOP BORROWERS
${l.topBorrowers.map((b) => `  ${b.name}: ${b.booksBorrowed} books`).join("\n")}
`;
  }
}

export const analyticsService = new AnalyticsService();

export function useAnalytics() {
  return {
    getDashboardMetrics:
      analyticsService.getDashboardMetrics.bind(analyticsService),
    getStudentAnalytics:
      analyticsService.getStudentAnalytics.bind(analyticsService),
    getStaffAnalytics:
      analyticsService.getStaffAnalytics.bind(analyticsService),
    getFeeAnalytics: analyticsService.getFeeAnalytics.bind(analyticsService),
    getAttendanceAnalytics:
      analyticsService.getAttendanceAnalytics.bind(analyticsService),
    getExamAnalytics: analyticsService.getExamAnalytics.bind(analyticsService),
    getLibraryAnalytics:
      analyticsService.getLibraryAnalytics.bind(analyticsService),
    getFullAnalytics: analyticsService.getFullAnalytics.bind(analyticsService),
    exportToPDF: analyticsService.exportToPDF.bind(analyticsService),
    exportToExcel: analyticsService.exportToExcel.bind(analyticsService),
    generateReport: analyticsService.generateReport.bind(analyticsService),
  };
}

export default analyticsService;
