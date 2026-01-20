/**
 * Context Types
 *
 * Defines the context structure for API requests.
 */

import type { Database } from '@school-mis/storage';

export interface AppEnv {
  DATABASE: Database;
  NODE_ENV: string;
  VITE_PUBLIC_SITE_URL: string;
  BETTER_AUTH_SECRET: string;
  CACHE: KVNamespace;
  BUCKET: R2Bucket;
}

export interface InitialContext {
  env: AppEnv;
  headers: Headers;
  requestId: string;
  logger?: Console;
}

export interface AuthContext extends InitialContext {
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
    role: 'owner' | 'admin' | 'member';
  };
}
