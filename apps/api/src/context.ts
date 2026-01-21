/**
 * Context Types
 *
 * Defines the context structure for API requests.
 */

import type { Pool } from "pg";
import type { ProcessEnv } from "@school/env";

export interface AppContext {
  env: ProcessEnv;
  headers: Headers;
  requestId: string;
  logger?: Console;
  db: Pool;
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
