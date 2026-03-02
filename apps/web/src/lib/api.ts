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

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendance: number;
  monthlyFeeCollection: number;
  pendingFeePayments: number;
}

// Helper to handle API requests
const request = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return (await response.json()) as T;
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
};

export default api;
