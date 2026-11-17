/**
 * Better Auth Configuration
 *
 * Full-featured authentication with Better Auth for School MIS.
 * Includes JWT tokens, database sessions, email/password auth, and role-based access.
 *
 * NOTE: This file is prepared for Better Auth integration.
 * Install better-auth with: npm install better-auth
 */

import { db } from "@school/storage";
import * as schema from "@school/storage/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

// Environment configuration
const getEnv = () => ({
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET ||
    "your-secret-key-here-change-in-production",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  BETTER_AUTH_TRUSTED_ORIGINS: process.env.BETTER_AUTH_TRUSTED_ORIGINS,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
});

// Mock auth for when better-auth is not installed
const createMockAuth = () => ({
  api: {
    signUpEmail: async (_data?: any) => ({
      user: null,
      error: { message: "Auth not configured" },
    }),
    signInEmail: async (_data?: any) => ({
      user: null,
      error: { message: "Auth not configured" },
    }),
    signOut: async () => ({ success: true }),
    getSession: async (_opts?: any) => null,
  },
  handler: async (_req?: any) =>
    new Response("Auth not configured", { status: 503 }),
});

// Auth type definition
export type Auth = {
  api: {
    signUpEmail: (
      data?: any,
    ) => Promise<{ user: any; error?: { message: string } }>;
    signInEmail: (
      data?: any,
    ) => Promise<{ user: any; error?: { message: string } }>;
    signOut: () => Promise<{ success: boolean }>;
    getSession: (opts?: any) => Promise<any>;
  };
  handler: (req?: any) => Promise<Response>;
};

/**
 * Better Auth configuration with full features
 * Returns mock auth if better-auth is not installed
 */
export const auth = () => {
  const env = getEnv();

  // Try to dynamically import better-auth
  try {
    return betterAuth({
      // Database adapter using Drizzle
      database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
          user: schema.users,
          session: schema.userSessions,
          account: schema.userAccounts,
          verification: schema.emailVerificationTokens,
          organization: schema.organizations,
          member: schema.members,
          invitation: schema.invitations,
        },
      }),

      // Security
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      trustedOrigins: [
        env.BETTER_AUTH_URL,
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3015",
        "http://localhost:3070",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3015",
        "http://127.0.0.1:3070",
        ...(env.BETTER_AUTH_TRUSTED_ORIGINS
          ? env.BETTER_AUTH_TRUSTED_ORIGINS.split(",")
          : []),
      ],

      // Session configuration
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // Update session every 24 hours
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60, // 5 minutes
        },
      },

      // Authentication providers
      socialProviders: {
        google:
          env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
            ? {
                clientId: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
                redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
              }
            : undefined,
        github:
          env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
            ? {
                clientId: env.GITHUB_CLIENT_ID,
                clientSecret: env.GITHUB_CLIENT_SECRET,
                redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/github`,
              }
            : undefined,
      },

      // Email + password auth
      emailAndPassword: {
        enabled: true,
      },

      // Email verification
      emailVerification: {
        required: true,
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async (
          user: { email: string },
          url: string,
          _token: string,
        ) => {
          console.log(`[Email] Verification email to ${user.email}: ${url}`);
        },
      },

      // Password reset
      forgotPassword: {
        sendResetEmail: async (
          user: { email: string },
          url: string,
          _token: string,
        ) => {
          console.log(`[Email] Password reset email to ${user.email}: ${url}`);
        },
      },

      // Rate limiting
      rateLimit: {
        enabled: true,
        window: 60,
        max: 100,
      },

      // Organization support
      organization: {
        enabled: true,
        allowUserToCreateOrganization: true,
      },

      plugins: [],
    });
  } catch (err) {
    console.error("[Auth] Failed to initialise better-auth:", err);
    return createMockAuth();
  }
};

// Create singleton instance - lazily initialized so the real auth is used
let authInstance: Auth | null = null;

export function getAuth(): Auth {
  if (!authInstance) {
    authInstance = auth();
  }
  return authInstance;
}

// Initialize auth immediately
getAuth();

// Export auth utilities - guaranteed to be defined
export const api = authInstance.api;
export const handler = authInstance.handler;

// Role-based access control helpers
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  SCHOOL_ADMIN: "school_admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
  STAFF: "staff",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Permission definitions
export const PERMISSIONS = {
  // Student management
  STUDENT_CREATE: "student:create",
  STUDENT_READ: "student:read",
  STUDENT_UPDATE: "student:update",
  STUDENT_DELETE: "student:delete",

  // Teacher management
  TEACHER_CREATE: "teacher:create",
  TEACHER_READ: "teacher:read",
  TEACHER_UPDATE: "teacher:update",
  TEACHER_DELETE: "teacher:delete",

  // Class management
  CLASS_CREATE: "class:create",
  CLASS_READ: "class:read",
  CLASS_UPDATE: "class:update",
  CLASS_DELETE: "class:delete",

  // Attendance
  ATTENDANCE_MARK: "attendance:mark",
  ATTENDANCE_READ: "attendance:read",

  // Fees
  FEE_MANAGE: "fee:manage",
  FEE_COLLECT: "fee:collect",
  FEE_READ: "fee:read",

  // Grades
  GRADE_CREATE: "grade:create",
  GRADE_READ: "grade:read",
  GRADE_UPDATE: "grade:update",

  // Library
  LIBRARY_MANAGE: "library:manage",
  LIBRARY_ISSUE: "library:issue",

  // Transport
  TRANSPORT_MANAGE: "transport:manage",

  // Reports
  REPORT_VIEW: "report:view",
  REPORT_EXPORT: "report:export",

  // Admin
  ADMIN_FULL: "admin:full",
  SETTINGS_MANAGE: "settings:manage",
} as const;

// Role to permissions mapping
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.SCHOOL_ADMIN]: [
    PERMISSIONS.STUDENT_CREATE,
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.STUDENT_UPDATE,
    PERMISSIONS.STUDENT_DELETE,
    PERMISSIONS.TEACHER_CREATE,
    PERMISSIONS.TEACHER_READ,
    PERMISSIONS.TEACHER_UPDATE,
    PERMISSIONS.CLASS_CREATE,
    PERMISSIONS.CLASS_READ,
    PERMISSIONS.CLASS_UPDATE,
    PERMISSIONS.CLASS_DELETE,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.FEE_MANAGE,
    PERMISSIONS.FEE_COLLECT,
    PERMISSIONS.FEE_READ,
    PERMISSIONS.GRADE_READ,
    PERMISSIONS.GRADE_UPDATE,
    PERMISSIONS.LIBRARY_MANAGE,
    PERMISSIONS.LIBRARY_ISSUE,
    PERMISSIONS.TRANSPORT_MANAGE,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.SETTINGS_MANAGE,
  ],
  [ROLES.TEACHER]: [
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.CLASS_READ,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.GRADE_CREATE,
    PERMISSIONS.GRADE_READ,
    PERMISSIONS.GRADE_UPDATE,
    PERMISSIONS.LIBRARY_ISSUE,
  ],
  [ROLES.STUDENT]: [
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.GRADE_READ,
    PERMISSIONS.ATTENDANCE_READ,
  ],
  [ROLES.PARENT]: [
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.GRADE_READ,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.FEE_READ,
  ],
  [ROLES.STAFF]: [
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.CLASS_READ,
    PERMISSIONS.LIBRARY_MANAGE,
    PERMISSIONS.TRANSPORT_MANAGE,
  ],
};

// Helper to check if user has permission
export function hasPermission(role: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return (
    permissions.includes(PERMISSIONS.ADMIN_FULL) ||
    permissions.includes(permission)
  );
}

// Helper to check multiple permissions
export function hasAnyPermission(role: Role, permissions: string[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: Role, permissions: string[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}
