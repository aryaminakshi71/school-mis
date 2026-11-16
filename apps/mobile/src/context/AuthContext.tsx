/**
 * Authentication Context for React Native
 *
 * Provides global authentication state and methods:
 * - Login/logout
 * - User profile management
 * - Token refresh
 * - Role-based access control
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CreateStudentDto, Student, authApi, studentsApi } from "../lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  schoolId?: string;
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "@school_mis:user";

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ["*"],
  school_admin: [
    "student:create",
    "student:read",
    "student:update",
    "student:delete",
    "teacher:read",
    "attendance:mark",
    "attendance:read",
    "fee:manage",
    "grade:read",
    "grade:update",
  ],
  teacher: [
    "student:read",
    "attendance:mark",
    "attendance:read",
    "grade:create",
    "grade:read",
    "grade:update",
  ],
  student: ["student:read", "grade:read", "attendance:read"],
  parent: ["student:read", "grade:read", "attendance:read", "fee:read"],
  staff: ["student:read", "library:manage"],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userJson) {
          const user = JSON.parse(userJson);
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("[Auth] Failed to load user:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const authData = await authApi.login({ email, password });

      await AsyncStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(authData.user),
      );

      setState({
        user: authData.user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("[Auth] Logout error:", error);
    } finally {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await authApi.getCurrentUser();
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      setState((prev) => ({ ...prev, user }));
    } catch (error) {
      console.error("[Auth] Failed to refresh user:", error);
      // If refresh fails, logout
      await logout();
    }
  }, [logout]);

  const hasRole = useCallback(
    (roles: string[]): boolean => {
      if (!state.user) return false;
      return roles.includes(state.user.role);
    },
    [state.user],
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!state.user) return false;

      const permissions = ROLE_PERMISSIONS[state.user.role] || [];

      // Super admin has all permissions
      if (permissions.includes("*")) return true;

      return permissions.includes(permission);
    },
    [state.user],
  );

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshUser,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ============================================================================
// HOOKS FOR DATA FETCHING
// ============================================================================

import { useCallback, useEffect, useState } from "react";

export function useStudents(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentsApi.getAll(params);
      setData(response.students);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.search]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { data, loading, error, pagination, refetch: fetchStudents };
}

export function useStudent(id: string) {
  const [data, setData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await studentsApi.getById(id);
        setData(response);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  return { data, loading, error };
}

export function useCreateStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (data: CreateStudentDto) => {
    try {
      setLoading(true);
      const response = await studentsApi.create(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

// Re-export types
export type { User, AuthState, AuthContextType };
