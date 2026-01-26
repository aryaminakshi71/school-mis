import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

export type UserRole =
  | "admin"
  | "teacher"
  | "staff"
  | "accountant"
  | "librarian"
  | "parent"
  | "student";

export interface Permission {
  resource: string;
  actions: ("create" | "read" | "update" | "delete" | "export" | "import")[];
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: "admin",
    description: "Full access to all features",
    permissions: [
      { resource: "dashboard", actions: ["read"] },
      {
        resource: "students",
        actions: ["create", "read", "update", "delete", "export", "import"],
      },
      { resource: "teachers", actions: ["create", "read", "update", "delete"] },
      { resource: "classes", actions: ["create", "read", "update", "delete"] },
      { resource: "attendance", actions: ["create", "read", "update"] },
      {
        resource: "fees",
        actions: ["create", "read", "update", "delete", "export"],
      },
      { resource: "library", actions: ["create", "read", "update", "delete"] },
      {
        resource: "transport",
        actions: ["create", "read", "update", "delete"],
      },
      { resource: "exams", actions: ["create", "read", "update", "delete"] },
      { resource: "reports", actions: ["read", "export"] },
      { resource: "settings", actions: ["read", "update"] },
      { resource: "users", actions: ["create", "read", "update", "delete"] },
    ],
  },
  {
    role: "teacher",
    description: "Can manage classes, attendance, and exams",
    permissions: [
      { resource: "dashboard", actions: ["read"] },
      { resource: "students", actions: ["read"] },
      { resource: "teachers", actions: ["read"] },
      { resource: "classes", actions: ["read"] },
      { resource: "attendance", actions: ["create", "read", "update"] },
      { resource: "fees", actions: ["read"] },
      { resource: "library", actions: ["read"] },
      { resource: "transport", actions: ["read"] },
      { resource: "exams", actions: ["create", "read", "update"] },
      { resource: "reports", actions: ["read"] },
    ],
  },
  {
    role: "staff",
    description: "Non-teaching staff access",
    permissions: [
      { resource: "dashboard", actions: ["read"] },
      { resource: "attendance", actions: ["read"] },
      { resource: "payroll", actions: ["read"] },
      { resource: "leave", actions: ["create", "read"] },
    ],
  },
  {
    role: "accountant",
    description: "Can manage fees and financial reports",
    permissions: [
      { resource: "dashboard", actions: ["read"] },
      { resource: "students", actions: ["read"] },
      { resource: "fees", actions: ["create", "read", "update", "export"] },
      { resource: "reports", actions: ["read", "export"] },
    ],
  },
  {
    role: "librarian",
    description: "Can manage library books and issues",
    permissions: [
      { resource: "dashboard", actions: ["read"] },
      { resource: "library", actions: ["create", "read", "update", "delete"] },
      { resource: "students", actions: ["read"] },
    ],
  },
  {
    role: "parent",
    description: "View child's progress and fees",
    permissions: [
      { resource: "dashboard", actions: ["read"] },
      { resource: "students", actions: ["read"] },
      { resource: "attendance", actions: ["read"] },
      { resource: "fees", actions: ["read"] },
      { resource: "exams", actions: ["read"] },
      { resource: "reports", actions: ["read"] },
    ],
  },
  {
    role: "student",
    description: "View own progress",
    permissions: [
      { resource: "dashboard", actions: ["read"] },
      { resource: "attendance", actions: ["read"] },
      { resource: "fees", actions: ["read"] },
      { resource: "exams", actions: ["read"] },
      { resource: "reports", actions: ["read"] },
    ],
  },
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  childId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (
    resource: string,
    action: "create" | "read" | "update" | "delete" | "export" | "import",
  ) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
  getRolePermissions: () => RolePermissions | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("school_mis_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("school_mis_user");
      }
    }
    setIsLoading(false);
  }, []);

  const hasPermission = useCallback(
    (
      resource: string,
      action: "create" | "read" | "update" | "delete" | "export" | "import",
    ) => {
      if (!user) return false;
      // Admin has all permissions
      if (user.role === "admin") return true;
      const roleConfig = ROLE_PERMISSIONS.find((r) => r.role === user.role);
      if (!roleConfig) return false;
      const permission = roleConfig.permissions.find(
        (p) => p.resource === resource,
      );
      return permission ? permission.actions.includes(action) : false;
    },
    [user],
  );

  const hasRole = useCallback(
    (roles: UserRole[]) => {
      if (!user) return false;
      // Admin has access to all portals and features
      if (user.role === "admin") return true;
      return roles.includes(user.role);
    },
    [user],
  );

  const getRolePermissions = useCallback(() => {
    if (!user) return undefined;
    return ROLE_PERMISSIONS.find((r) => r.role === user.role);
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call the real API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Login failed" }));
        throw new Error(error.error || "Invalid credentials");
      }

      const userData = await response.json();
      
      const user: User = {
        id: userData.id || "user-id",
        name: userData.name || "User",
        email: userData.email || email,
        role: userData.role || "admin",
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
      };

      // Set user state and persist to localStorage
      setUser(user);
      localStorage.setItem("school_mis_user", JSON.stringify(user));
      
      // Wait a bit to ensure state is updated
      await new Promise((resolve) => setTimeout(resolve, 50));
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    // await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    localStorage.removeItem("school_mis_user");
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
        hasRole,
        getRolePermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function usePermission(
  resource: string,
  action: "create" | "read" | "update" | "delete" | "export" | "import",
) {
  const { hasPermission, isLoading } = useAuth();
  return { hasPermission: hasPermission(resource, action), isLoading };
}
