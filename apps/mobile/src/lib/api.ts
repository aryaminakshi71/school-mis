/**
 * Mobile API Client
 *
 * HTTP client for School MIS API with:
 * - Authentication token management
 * - Request/response interceptors
 * - Error handling
 * - Retry logic
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

// API Configuration
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://school.aryaminakshi.workers.dev";

// Token storage keys
const TOKEN_KEY = "@school_mis:token";
const USER_KEY = "@school_mis:user";

interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private config: ApiConfig;
  private token: string | null = null;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseURL: config.baseURL || API_BASE_URL,
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
    };
    this.loadToken();
  }

  async loadToken(): Promise<void> {
    try {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("[ApiClient] Failed to load token:", error);
    }
  }

  async setToken(token: string): Promise<void> {
    this.token = token;
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("[ApiClient] Failed to save token:", error);
    }
  }

  async clearToken(): Promise<void> {
    this.token = null;
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("[ApiClient] Failed to clear token:", error);
    }
  }

  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    customHeaders?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...customHeaders,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.config.timeout,
        );

        const response = await fetch(url, {
          method,
          headers,
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // Handle auth errors
          if (response.status === 401) {
            await this.clearToken();
          }

          throw new Error(
            errorData.error ||
              `HTTP ${response.status}: ${response.statusText}`,
          );
        }

        const responseData = await response.json();

        return {
          data: responseData,
          status: response.status,
        };
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (error instanceof Error && error.message.includes("4")) {
          break;
        }

        if (attempt < this.config.retries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, attempt)),
          );
        }
      }
    }

    throw lastError || new Error("Request failed after retries");
  }

  async get<T>(
    endpoint: string,
    customHeaders?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>("GET", endpoint, undefined, customHeaders);
  }

  async post<T>(
    endpoint: string,
    data: unknown,
    customHeaders?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>("POST", endpoint, data, customHeaders);
  }

  async put<T>(
    endpoint: string,
    data: unknown,
    customHeaders?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>("PUT", endpoint, data, customHeaders);
  }

  async delete<T>(
    endpoint: string,
    customHeaders?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>("DELETE", endpoint, undefined, customHeaders);
  }

  async patch<T>(
    endpoint: string,
    data: unknown,
    customHeaders?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>("PATCH", endpoint, data, customHeaders);
  }
}

// Create singleton instance
export const api = new ApiClient();

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    schoolId?: string;
    emailVerified: boolean;
  };
  token: string;
  session: {
    id: string;
    expiresAt: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/api/auth/login",
      credentials,
    );
    await api.setToken(response.data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/api/auth/logout", {});
    } finally {
      await api.clearToken();
    }
  },

  getCurrentUser: async () => {
    const response = await api.get<AuthResponse["user"]>("/api/auth/me");
    return response.data;
  },

  socialLogin: async (provider: "google" | "github", code: string) => {
    const response = await api.post<AuthResponse>(
      `/api/auth/callback/${provider}`,
      { code },
    );
    await api.setToken(response.data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    return response.data;
  },
};

// ============================================================================
// STUDENTS API
// ============================================================================

export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  classId?: string;
  className?: string;
  section?: string;
  fatherName?: string;
  fatherPhone?: string;
  motherName?: string;
  motherPhone?: string;
  createdAt: string;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  classId?: string;
  fatherName?: string;
  fatherPhone?: string;
  motherName?: string;
  motherPhone?: string;
}

export const studentsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);

    const response = await api.get<{ students: Student[]; pagination: any }>(
      `/api/students?${query.toString()}`,
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Student>(`/api/students/${id}`);
    return response.data;
  },

  create: async (data: CreateStudentDto) => {
    const response = await api.post<Student>("/api/students", data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateStudentDto>) => {
    const response = await api.put<Student>(`/api/students/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean }>(
      `/api/students/${id}`,
    );
    return response.data;
  },

  bulkAssignClass: async (studentIds: string[], classId: string) => {
    const response = await api.post<{ success: boolean; assigned: number }>(
      "/api/students/bulk/assign-class",
      { studentIds, classId },
    );
    return response.data;
  },
};

// ============================================================================
// ATTENDANCE API
// ============================================================================

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  remarks?: string;
  studentName?: string;
  className?: string;
}

export const attendanceApi = {
  getByDate: async (date: string, classId?: string) => {
    const query = new URLSearchParams({ date });
    if (classId) query.append("classId", classId);

    const response = await api.get<{ attendance: AttendanceRecord[] }>(
      `/api/attendance?${query.toString()}`,
    );
    return response.data;
  },

  getHistory: async (params?: { days?: number; studentId?: string }) => {
    const query = new URLSearchParams();
    if (params?.days) query.append("days", params.days.toString());
    if (params?.studentId) query.append("studentId", params.studentId);

    const response = await api.get<{ attendance: AttendanceRecord[] }>(
      `/api/attendance/history?${query.toString()}`,
    );
    return response.data;
  },

  markAttendance: async (data: {
    date: string;
    classId: string;
    records: Array<{
      studentId: string;
      status: AttendanceRecord["status"];
      remarks?: string;
    }>;
  }) => {
    const response = await api.post<{ success: boolean; saved: number }>(
      "/api/attendance",
      data,
    );
    return response.data;
  },
};

// ============================================================================
// FEES API
// ============================================================================

export interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  paidAmount: number;
  status: "pending" | "completed" | "overdue";
  dueDate?: string;
}

export const feesApi = {
  getAll: async (params?: { studentId?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.studentId) query.append("studentId", params.studentId);
    if (params?.status) query.append("status", params.status);

    const response = await api.get<{ fees: Fee[] }>(
      `/api/fees?${query.toString()}`,
    );
    return response.data;
  },

  createAllocation: async (data: {
    studentId: string;
    feeStructureId?: string;
    amount: number;
  }) => {
    const response = await api.post<Fee>("/api/fees", data);
    return response.data;
  },

  makePayment: async (
    allocationId: string,
    data: { studentId: string; amount: number; paymentMethod?: string },
  ) => {
    const response = await api.post<{
      success: boolean;
      receiptNumber: string;
    }>(`/api/fees/${allocationId}/pay`, data);
    return response.data;
  },
};

// ============================================================================
// CLASSES API
// ============================================================================

export interface Class {
  id: string;
  name: string;
  section?: string;
  capacity?: number;
  students: number;
  classTeacher?: string;
  createdAt: string;
}

export const classesApi = {
  getAll: async () => {
    const response = await api.get<{ classes: Class[] }>("/api/classes");
    return response.data;
  },

  getList: async () => {
    const response = await api.get<{
      classes: Pick<Class, "id" | "name" | "section">[];
    }>("/api/classes/list");
    return response.data;
  },

  create: async (data: {
    name: string;
    section?: string;
    capacity?: number;
  }) => {
    const response = await api.post<Class>("/api/classes", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Class>) => {
    const response = await api.put<Class>(`/api/classes/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean }>(
      `/api/classes/${id}`,
    );
    return response.data;
  },
};

// ============================================================================
// HEALTH API
// ============================================================================

export const healthApi = {
  check: async () => {
    const response = await api.get<{
      status: string;
      timestamp: string;
      version: string;
    }>("/api/health");
    return response.data;
  },
};

// Re-export types
export type { ApiResponse, ApiError, ApiConfig };
export default api;
