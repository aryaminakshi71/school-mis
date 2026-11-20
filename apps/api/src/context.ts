/**
 * Context Types
 *
 * Defines the context structure for API requests.
 */

import type { ServerEnv } from "@school/env/server";
import type { Pool } from "pg";

export interface AppContext {
  env: ServerEnv;
  headers: Headers;
  requestId: string;
  logger?: Console;
  db: Pool;
  user?: {
    id: string;
    email: string;
    name: string;
    role?: string;
    schoolId?: string;
    emailVerified?: boolean;
  } | null;
}

export interface AuthContext extends AppContext {
  user: {
    id: string;
    email: string;
    name: string;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
  auth: any;
}

export interface OrgContext extends AuthContext {
  organization: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
  member: {
    id: string;
    role: "owner" | "admin" | "member";
  };
}
