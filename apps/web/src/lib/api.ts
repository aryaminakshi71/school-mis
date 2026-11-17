import type {
  AttendanceListResponseDto,
  AttendanceRecordDto,
  ClassDto,
  ClassesListResponseDto,
  ExamDto,
  ExamsListResponseDto,
  ExpenseDto,
  ExpenseStatsDto,
  ExpensesListResponseDto,
  FeeCategoriesListResponseDto,
  FeeCategoryDto,
  FeePaymentDto,
  FeeStructureDto,
  FeeStructuresListResponseDto,
  FeesListResponseDto,
  GradeRecordDto,
  GradesListResponseDto,
  LibraryBookDto,
  LibraryBooksListResponseDto,
  LibraryTransactionDto,
  LibraryTransactionsListResponseDto,
  StudentDto,
  StudentsListResponseDto,
  SubjectDto,
  SubjectsListResponseDto,
  TeacherDto,
  TeachersListResponseDto,
  TransportRouteDto,
  TransportRoutesListResponseDto,
  TransportVehicleDto,
  TransportVehiclesListResponseDto,
} from "@school/api";

// Shared API DTO types (source of truth: apps/api/src/contracts/school.ts)
export type Student = StudentDto;
export type Teacher = TeacherDto;
export type Class = ClassDto;
export type FeePayment = FeePaymentDto;
export type Exam = ExamDto;
export type AttendanceRecord = AttendanceRecordDto;
export type GradeRecord = GradeRecordDto;
export type Expense = ExpenseDto;
export type ExpenseStats = ExpenseStatsDto;
export type FeeStructure = FeeStructureDto;
export type FeeCategory = FeeCategoryDto;
export type Subject = SubjectDto;
export type TransportRoute = TransportRouteDto;
export type TransportVehicle = TransportVehicleDto;
export type LibraryBook = LibraryBookDto;
export type LibraryTransaction = LibraryTransactionDto;

export interface ExpenseCreateInput {
  category: string;
  description?: string;
  amount: number;
  date: string;
  paymentMethod?: string;
  paidTo?: string;
}

export interface FeeStructureCreateInput {
  categoryId: string;
  classId?: string;
  sessionId: string;
  amount: number;
  dueDate?: string;
}

export interface FeeCategoryCreateInput {
  name: string;
  description?: string;
  type: string;
  isRecurring?: boolean;
}

export interface GradeCreateInput {
  studentId: string;
  subjectId: string;
  classId?: string;
  examType: string;
  obtainedMarks: number;
  maxMarks: number;
  sessionId: string | null;
}

export interface TransportRouteCreateInput {
  routeName: string;
  routeNumber?: string;
  startPoint: string;
  endPoint: string;
  distance?: number;
}

export interface TransportVehicleCreateInput {
  vehicleNumber: string;
  vehicleType?: string;
  capacity?: number;
  routeId?: string;
}

export interface LibraryBookCreateInput {
  title: string;
  author: string;
  isbn?: string;
  totalCopies: number;
  category?: string;
  publisher?: string;
  location?: string;
  availableCopies?: number;
}

// Student Portal Types
export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  class?: string;
  section?: string;
  rollNumber?: string;
  admissionNumber?: string;
  admissionDate?: string;
  createdAt?: string;
  house?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  address?: string;
  photo?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
}

export interface StudentAttendance {
  present: number;
  absent: number;
  total: number;
  percentage: number;
  monthlyTrend?: Array<{ month: string; days: number }>;
}

export interface StudentGrade {
  id: string;
  subject: string;
  marks: number;
  maxMarks: number;
  grade: string;
  examType: string;
  date: string;
}

export interface StudentFees {
  total: number;
  paid: number;
  pending: number;
  status: "paid" | "pending" | "overdue" | "unknown";
  recentPayments?: Array<{ date: string; amount: number; method: string }>;
}

// Teacher Portal Types
export interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  qualification: string;
  subject: string;
  experience: number;
  salary: number;
  joiningDate?: string;
  address?: string;
  photo?: string;
  attendance?: number;
}

export interface TeacherClass {
  id: string;
  name: string;
  section: string;
  subject: string;
  students: number;
  schedule?: Array<{ day: string; period: string; time: string }>;
}

export interface TeacherTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
}

export interface TeacherPerformance {
  rating: number;
  studentsFeedback: number;
  peerReview: number;
  attendance: number;
  lastAppraisal: string;
  nextAppraisal: string;
  status: "excellent" | "good" | "average" | "needs_improvement";
}

export interface TeacherPerformanceData {
  id: string;
  name: string;
  designation: string;
  department: string;
  rating: number;
  studentsFeedback: number;
  peerReview: number;
  attendance: number;
  lastAppraisal: string;
  nextAppraisal: string;
  status: "excellent" | "good" | "average" | "needs_improvement";
}

export interface TeacherPerformanceResponse {
  performance: TeacherPerformanceData[];
  appraisalCycles: TeacherAppraisalCycle[];
}

export interface TeacherAppraisalCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming";
  completed: number;
  total: number;
}

export interface SchoolSettingsUpdateInput {
  schoolName?: string;
  shortName?: string;
  schoolAddress?: string;
  phoneNumber?: string;
  supportEmail?: string;
  websiteUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  receiptFooter?: string;
  mobileAppName?: string;
}

export interface SchoolBranding {
  schoolName: string;
  shortName: string;
  schoolAddress: string;
  phoneNumber?: string;
  supportEmail?: string;
  websiteUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  receiptFooter?: string;
  mobileAppName?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendance: number;
  monthlyFeeCollection: number;
  pendingFeePayments: number;
}

// Helper to handle API requests with enhanced error handling
const request = async <T>(
  path: string,
  options: RequestInit = {},
  retries = 3,
): Promise<T> => {
  const url = `/api${path}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `API Error: ${response.statusText}`;
        let errorDetails: any = {};

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errorDetails = errorData;
        } catch {
          // If we can't parse error response, use default message
        }

        // Handle specific HTTP status codes
        switch (response.status) {
          case 400:
            throw new Error(`Bad Request: ${errorMessage}`);
          case 401:
            throw new Error("Authentication required. Please log in again.");
          case 403:
            throw new Error(
              "Access denied. You don't have permission for this action.",
            );
          case 404:
            throw new Error("The requested resource was not found.");
          case 409:
            throw new Error(`Conflict: ${errorMessage}`);
          case 422:
            throw new Error(`Validation Error: ${errorMessage}`);
          case 429:
            throw new Error(
              "Too many requests. Please wait a moment and try again.",
            );
          case 500:
            throw new Error("Server error. Please try again later.");
          case 503:
            throw new Error(
              "Service temporarily unavailable. Please try again later.",
            );
          default:
            throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      // If it's the last attempt, throw the error
      if (attempt === retries) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("An unexpected error occurred");
      }

      // For network errors, wait before retrying
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.warn(`Network error on attempt ${attempt}, retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      // For other errors, don't retry
      throw error;
    }
  }

  throw new Error("Request failed after all retries");
};

// API Functions
export const api = {
  // Students
  students: {
    list: async () => {
      const data = await request<StudentsListResponseDto>(
        "/students?limit=100",
      );
      return data.students;
    },
    get: async (id: string) => {
      const data = await request<Student>(`/students/${id}`);
      return data;
    },
    create: async (data: Omit<Student, "id" | "createdAt">) => {
      return request("/students", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: Partial<Student>) => {
      return request(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return request(`/students/${id}`, {
        method: "DELETE",
      });
    },
    getMyProfile: async (): Promise<StudentProfile> => {
      return request(`/students/me`);
    },
    getMyAttendance: async (): Promise<{ attendance: StudentAttendance }> => {
      return request(`/students/me/attendance`);
    },
    getMyGrades: async (): Promise<{ grades: StudentGrade[] }> => {
      return request(`/students/me/grades`);
    },
    getMyFees: async (): Promise<{ fees: StudentFees }> => {
      return request(`/students/me/fees`);
    },

    // Parent-specific endpoints
    getMyChildren: async () => {
      return request("/students/children");
    },
    getChildAttendance: async (id: string) => {
      return request(`/students/child/${id}/attendance`);
    },
    getChildGrades: async (id: string) => {
      return request(`/students/child/${id}/grades`);
    },
    getChildFees: async (id: string) => {
      return request(`/students/child/${id}/fees`);
    },
    getChildHomework: async (id: string) => {
      return request(`/students/child/${id}/homework`);
    },
    getChildExams: async (id: string) => {
      return request(`/students/child/${id}/exams`);
    },
    getChildLibraryBooks: async (id: string) => {
      return request(`/students/child/${id}/library`);
    },
    getChildTransport: async (id: string) => {
      return request(`/students/child/${id}/transport`);
    },
    getChildNotices: async (id: string) => {
      return request(`/students/child/${id}/notices`);
    },
    getChildTeachers: async (id: string) => {
      return request(`/students/child/${id}/teachers`);
    },
  },

  // Teachers
  teachers: {
    list: async () => {
      const data = await request<TeachersListResponseDto>("/teachers");
      return data.teachers;
    },
    get: async (id: string) => {
      return request<Teacher>(`/teachers/${id}`);
    },
    create: async (data: Omit<Teacher, "id" | "createdAt">) => {
      return request("/teachers", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: Partial<Teacher>) => {
      return request(`/teachers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return request(`/teachers/${id}`, {
        method: "DELETE",
      });
    },
    // Teacher portal endpoints
    getMyProfile: async (): Promise<TeacherProfile> => {
      return request("/teachers/me");
    },
    getMyClasses: async (): Promise<TeacherClass[]> => {
      return request("/teachers/me/classes");
    },
    getMyStudents: async () => {
      return request("/teachers/me/students");
    },
    getMyTasks: async (): Promise<TeacherTask[]> => {
      return request("/teachers/me/tasks");
    },
    getPerformance: async (): Promise<TeacherPerformanceResponse> => {
      // Return mock data for now since the backend API is not fully implemented
      return {
        performance: [
          {
            id: "EMP001",
            name: "Priya Sharma",
            designation: "Senior Teacher",
            department: "Mathematics",
            rating: 4.8,
            studentsFeedback: 4.7,
            peerReview: 4.9,
            attendance: 98,
            lastAppraisal: "2024-01-15",
            nextAppraisal: "2025-01-15",
            status: "excellent",
          },
          {
            id: "EMP002",
            name: "Rahul Verma",
            designation: "Teacher",
            department: "Science",
            rating: 4.2,
            studentsFeedback: 4.1,
            peerReview: 4.3,
            attendance: 95,
            lastAppraisal: "2024-03-20",
            nextAppraisal: "2025-03-20",
            status: "good",
          },
          {
            id: "EMP003",
            name: "Anita Patel",
            designation: "Teacher",
            department: "English",
            rating: 4.5,
            studentsFeedback: 4.6,
            peerReview: 4.4,
            attendance: 97,
            lastAppraisal: "2024-02-10",
            nextAppraisal: "2025-02-10",
            status: "excellent",
          },
          {
            id: "EMP004",
            name: "Suresh Kumar",
            designation: "Junior Teacher",
            department: "Social Studies",
            rating: 3.6,
            studentsFeedback: 3.5,
            peerReview: 3.7,
            attendance: 92,
            lastAppraisal: "2024-04-05",
            nextAppraisal: "2025-04-05",
            status: "average",
          },
          {
            id: "EMP005",
            name: "Meera Gupta",
            designation: "Teacher",
            department: "Hindi",
            rating: 3.8,
            studentsFeedback: 3.9,
            peerReview: 3.7,
            attendance: 94,
            lastAppraisal: "2024-05-12",
            nextAppraisal: "2025-05-12",
            status: "average",
          },
        ],
        appraisalCycles: [
          {
            id: "1",
            name: "Annual Appraisal 2024-25",
            startDate: "2024-04-01",
            endDate: "2024-06-30",
            status: "active",
            completed: 42,
            total: 45,
          },
          {
            id: "2",
            name: "Mid-Year Review 2024",
            startDate: "2024-09-01",
            endDate: "2024-10-15",
            status: "upcoming",
            completed: 0,
            total: 45,
          },
          {
            id: "3",
            name: "Annual Appraisal 2023-24",
            startDate: "2023-04-01",
            endDate: "2023-06-30",
            status: "completed",
            completed: 44,
            total: 44,
          },
        ],
      };
    },
    getRecruitment: async (): Promise<{
      jobPostings: any[];
      applications: any[];
    }> => {
      return request("/teachers/recruitment");
    },
    getTraining: async () => {
      return request("/teachers/training");
    },
    getLeave: async () => {
      return request("/teachers/leave");
    },
    getClassStats: async () => {
      return request("/teachers/me/class-stats");
    },
  },

  // Staff
  staff: {
    list: async () => {
      return request("/staff");
    },
    get: async (id: string) => {
      return request(`/staff/${id}`);
    },
    create: async (data: any) => {
      return request("/staff", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any) => {
      return request(`/staff/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return request(`/staff/${id}`, {
        method: "DELETE",
      });
    },
    // Staff portal endpoints
    getMyProfile: async () => {
      return request("/staff/me");
    },
    getMyTasks: async () => {
      return request("/staff/me/tasks");
    },
    getMyAttendance: async () => {
      return request("/staff/me/attendance");
    },
    getAttendance: async () => {
      return request("/staff/attendance");
    },
  },

  // Classes
  classes: {
    list: async () => {
      const data = await request<ClassesListResponseDto>("/classes");
      return data.classes;
    },
    get: async (id: string) => {
      const data = await request<ClassesListResponseDto>("/classes");
      return data.classes.find((c: Class) => c.id === id);
    },
    create: async (data: Omit<Class, "id" | "students">) => {
      return request("/classes", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: Partial<Class>) => {
      return request(`/classes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return request(`/classes/${id}`, {
        method: "DELETE",
      });
    },
  },

  // Fees
  fees: {
    list: async () => {
      const data = await request<FeesListResponseDto>("/fees");
      return data.fees;
    },
    collect: async (data: Omit<FeePayment, "id">) => {
      return request("/fees", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    getStats: async () => {
      const data = await request<FeesListResponseDto>("/fees");
      const fees: FeePayment[] = data.fees || [];

      return {
        totalCollected: fees
          .filter((f) => f.status === "paid")
          .reduce((sum, f) => sum + Number(f.amount), 0),
        pending: fees
          .filter((f) => f.status === "pending")
          .reduce((sum, f) => sum + Number(f.amount), 0),
        overdue: fees
          .filter((f) => f.status === "overdue")
          .reduce((sum, f) => sum + Number(f.amount), 0),
      };
    },
  },

  // Expenses
  expenses: {
    list: async () => {
      const data = await request<ExpensesListResponseDto>("/expenses");
      return data.expenses;
    },
    create: async (data: ExpenseCreateInput) => {
      return request("/expenses", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    getStats: async () => {
      const data = await request<ExpenseStatsDto>("/expenses/stats");
      return data;
    },
  },

  // Fee Structures
  feeStructures: {
    list: async () => {
      const data =
        await request<FeeStructuresListResponseDto>("/fee-structures");
      return data.structures;
    },
    create: async (data: FeeStructureCreateInput) => {
      return request("/fee-structures", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  // Fee Categories
  feeCategories: {
    list: async () => {
      const data =
        await request<FeeCategoriesListResponseDto>("/fee-categories");
      return data.categories;
    },
    create: async (data: FeeCategoryCreateInput) => {
      return request("/fee-categories", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  // Exams
  exams: {
    list: async () => {
      try {
        const data = await request<ExamsListResponseDto>("/exams");
        return data.exams || [];
      } catch (e) {
        console.warn("Exams endpoint not ready", e);
        return [];
      }
    },
    create: async (data: Omit<Exam, "id">) => {
      return request("/exams", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  // Grades
  grades: {
    list: async () => {
      try {
        const data = await request<GradesListResponseDto>("/grades");
        return data.grades || [];
      } catch (e) {
        console.warn("Grades endpoint not ready", e);
        return [];
      }
    },
    create: async (data: GradeCreateInput) => {
      return request("/grades", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  // Subjects
  subjects: {
    list: async () => {
      try {
        const data = await request<SubjectsListResponseDto>("/subjects");
        return data.subjects || [];
      } catch (e) {
        console.warn("Subjects endpoint not ready", e);
        return [];
      }
    },
  },

  // Attendance
  attendance: {
    list: async () => {
      const data = await request<AttendanceListResponseDto>("/attendance");
      return data.attendance;
    },
    getByDate: async (date: string) => {
      const data = await request<AttendanceListResponseDto>(
        `/attendance?date=${date}`,
      );
      return data.attendance;
    },
  },

  // Dashboard Stats
  dashboard: {
    getStats: async (): Promise<DashboardStats> => {
      try {
        // Use request helper for cleaner error handling
        const [studentsData, teachersData, classesData, feesData] =
          await Promise.all([
            request<StudentsListResponseDto>("/students?limit=1"),
            request<TeachersListResponseDto>("/teachers"),
            request<ClassesListResponseDto>("/classes"),
            request<FeesListResponseDto>("/fees"),
          ]);

        const fees = feesData.fees || [];

        return {
          totalStudents: studentsData.pagination?.total || 0,
          totalTeachers: teachersData.teachers?.length || 0,
          totalClasses: classesData.classes?.length || 0,
          todayAttendance: 94.2, // Placeholder
          monthlyFeeCollection: fees
            .filter((f) => f.status === "completed" || f.status === "paid")
            .reduce((sum, f) => sum + Number(f.amount), 0),
          pendingFeePayments: fees.filter(
            (f) => f.status === "pending" || f.status === "overdue",
          ).length,
        };
      } catch (error) {
        console.error("Dashboard stats error:", error);
        return {
          totalStudents: 0,
          totalTeachers: 0,
          totalClasses: 0,
          todayAttendance: 0,
          monthlyFeeCollection: 0,
          pendingFeePayments: 0,
        };
      }
    },
  },

  // Transport
  transport: {
    routes: {
      list: async () => {
        try {
          const data =
            await request<TransportRoutesListResponseDto>("/transport/routes");
          return data.routes || [];
        } catch (e) {
          console.warn("Transport routes endpoint not ready", e);
          return [];
        }
      },
      create: async (data: TransportRouteCreateInput) => {
        return request("/transport/routes", {
          method: "POST",
          body: JSON.stringify(data),
        });
      },
    },
    vehicles: {
      list: async () => {
        try {
          const data = await request<TransportVehiclesListResponseDto>(
            "/transport/vehicles",
          );
          return data.vehicles || [];
        } catch (e) {
          console.warn("Transport vehicles endpoint not ready", e);
          return [];
        }
      },
      create: async (data: TransportVehicleCreateInput) => {
        return request("/transport/vehicles", {
          method: "POST",
          body: JSON.stringify(data),
        });
      },
    },
  },

  // Library
  library: {
    books: {
      list: async (search?: string, category?: string) => {
        try {
          const params = new URLSearchParams();
          if (search) params.append("search", search);
          if (category) params.append("category", category);
          const data = await request<LibraryBooksListResponseDto>(
            `/library/books?${params.toString()}`,
          );
          return data.books || [];
        } catch (e) {
          console.warn("Library books endpoint not ready", e);
          return [];
        }
      },
      create: async (data: LibraryBookCreateInput) => {
        return request("/library/books", {
          method: "POST",
          body: JSON.stringify(data),
        });
      },
    },
    transactions: {
      list: async () => {
        try {
          const data = await request<LibraryTransactionsListResponseDto>(
            "/library/transactions",
          );
          return data.transactions || [];
        } catch (e) {
          console.warn("Library transactions endpoint not ready", e);
          return [];
        }
      },
    },
    issue: async (data: {
      bookId: string;
      studentId: string;
      dueDate: string;
    }) => {
      return request("/library/issue", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    return: async (transactionId: string) => {
      return request("/library/return", {
        method: "POST",
        body: JSON.stringify({ transactionId }),
      });
    },
  },
  schoolSettings: {
    get: async () => {
      try {
        const data = await request<SchoolBranding>("/settings/school");
        return data;
      } catch (e) {
        console.warn("School settings endpoint not ready", e);
        return defaultSchoolBranding;
      }
    },
    update: async (data: Partial<SchoolSettingsUpdateInput>) => {
      return request<SchoolBranding>("/settings/school", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
  },

  // Monitoring
  monitoring: {
    dashboard: async () => {
      return request("/monitoring/dashboard");
    },
    metrics: async (days?: string) => {
      const query = days ? `?days=${days}` : "";
      return request(`/monitoring/metrics${query}`);
    },
    alerts: async () => {
      return request("/monitoring/alerts");
    },
  },

  // Timetable
  timetable: {
    list: async (
      classId?: string,
    ): Promise<
      Array<{
        dayOfWeek: number;
        dayName: string;
        periods: Array<{
          id: string;
          periodNumber: number;
          subjectName: string;
          subjectId?: string;
          teacherName?: string;
          teacherId?: string;
          startTime: string;
          endTime: string;
          roomNumber?: string;
          classId?: string;
          className?: string;
        }>;
      }>
    > => {
      const query = classId ? `?classId=${classId}` : "";
      return request(`/timetable${query}`);
    },
    create: async (data: any) => {
      return request("/timetable", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any) => {
      return request(`/timetable/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return request(`/timetable/${id}`, {
        method: "DELETE",
      });
    },
  },
};

const defaultSchoolBranding: SchoolBranding = {
  schoolName: "SchoolOS",
  shortName: "School",
  schoolAddress: "",
  phoneNumber: "",
  supportEmail: "",
  websiteUrl: "",
  logoUrl: "",
  primaryColor: "#047857",
  secondaryColor: "#17332a",
  receiptFooter: "",
  mobileAppName: "SchoolOS",
};

export { defaultSchoolBranding, request };
