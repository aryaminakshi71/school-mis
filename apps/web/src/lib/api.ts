/**
 * API Client
 *
 * This file provides the API client for connecting to the backend.
 */

import { v4 as uuid } from "uuid";

// Types
export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  classId: string;
  className: string;
  rollNumber: number;
  fatherName: string;
  fatherPhone: string;
  attendance: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qualification: string;
  subject: string;
  salary: number;
  attendance: number;
  status: "active" | "on_leave" | "inactive";
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  section: string;
  capacity: number;
  students: number;
  classTeacher: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  paymentMethod: string;
  status: "paid" | "pending" | "overdue";
  date: string;
}

export interface Exam {
  id: string;
  name: string;
  className: string;
  subject: string;
  date: string;
  status: "scheduled" | "completed" | "pending_results";
}

export interface AttendanceRecord {
  id: string;
  className: string;
  total: number;
  present: number;
  absent: number;
  percentage: number;
  date: string;
}

// Helper to handle API requests
const request = async (path: string, options: RequestInit = {}) => {
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

  return response.json();
};

// API Functions
export const api = {
  // Students
  students: {
    list: async () => {
      const data = await request("/students?limit=100");
      return data.students;
    },
    get: async (id: string) => {
      const data = await request(`/students/${id}`);
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
      const data = await request("/teachers");
      return data.teachers;
    },
    get: async (id: string) => {
      return request(`/teachers/${id}`);
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
      const data = await request("/classes");
      return data.classes;
    },
    get: async (id: string) => {
      const data = await request("/classes");
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
      const data = await request("/fees");
      return data.fees;
    },
    collect: async (data: Omit<FeePayment, "id">) => {
      return request("/fees", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    getStats: async () => {
      const data = await request("/fees");
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
      const data = await request("/expenses");
      return data.expenses;
    },
    create: async (data: any) => {
      return request("/expenses", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    getStats: async () => {
      const data = await request("/expenses/stats");
      return data;
    },
  },

  // Fee Structures
  feeStructures: {
    list: async () => {
      const data = await request("/fee-structures");
      return data.structures;
    },
    create: async (data: any) => {
      return request("/fee-structures", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  // Fee Categories
  feeCategories: {
    list: async () => {
      const data = await request("/fee-categories");
      return data.categories;
    },
    create: async (data: any) => {
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
        const data = await request("/exams");
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
        const data = await request("/grades");
        return data.grades || [];
      } catch (e) {
        console.warn("Grades endpoint not ready", e);
        return [];
      }
    },
    create: async (data: any) => {
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
        const data = await request("/subjects");
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
      const data = await request("/attendance");
      return data.attendance;
    },
    getByDate: async (date: string) => {
      const data = await request(`/attendance?date=${date}`);
      return data.attendance;
    },
  },

  // Dashboard Stats
  dashboard: {
    getStats: async () => {
      try {
        // Use request helper for cleaner error handling
        const [studentsData, teachersData, classesData, feesData] = await Promise.all([
          request("/students?limit=1"),
          request("/teachers"),
          request("/classes"),
          request("/fees"),
        ]);

        const fees = feesData.fees || [];

        return {
          totalStudents: studentsData.pagination?.total || 0,
          totalTeachers: teachersData.teachers?.length || 0,
          totalClasses: classesData.classes?.length || 0,
          todayAttendance: 94.2, // Placeholder
          monthlyFeeCollection: fees
            .filter((f: any) => f.status === "completed" || f.status === "paid")
            .reduce((sum: number, f: any) => sum + Number(f.amount), 0),
          pendingFeePayments: fees.filter(
            (f: any) => f.status === "pending" || f.status === "overdue",
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
          const data = await request("/transport/routes");
          return data.routes || [];
        } catch (e) {
          console.warn("Transport routes endpoint not ready", e);
          return [];
        }
      },
      create: async (data: any) => {
        return request("/transport/routes", {
          method: "POST",
          body: JSON.stringify(data),
        });
      },
    },
    vehicles: {
      list: async () => {
        try {
          const data = await request("/transport/vehicles");
          return data.vehicles || [];
        } catch (e) {
          console.warn("Transport vehicles endpoint not ready", e);
          return [];
        }
      },
      create: async (data: any) => {
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
          const data = await request(`/library/books?${params.toString()}`);
          return data.books || [];
        } catch (e) {
          console.warn("Library books endpoint not ready", e);
          return [];
        }
      },
      create: async (data: any) => {
        return request("/library/books", {
          method: "POST",
          body: JSON.stringify(data),
        });
      },
    },
    transactions: {
      list: async () => {
        try {
          const data = await request("/library/transactions");
          return data.transactions || [];
        } catch (e) {
          console.warn("Library transactions endpoint not ready", e);
          return [];
        }
      },
    },
    issue: async (data: { bookId: string; studentId: string; dueDate: string }) => {
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
