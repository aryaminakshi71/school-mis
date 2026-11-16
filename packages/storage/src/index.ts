/**
 * Storage Package Index
 *
 * Re-exports all database schemas, utilities, and database connection.
 */

export {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  like,
  lt,
  lte,
  ne,
  or,
  sql,
} from "drizzle-orm";
export { type Database, db } from "./db";
export * from "./db/schema/audit-logs.schema";
export * from "./db/schema/school/auth.schema";
export * from "./db/schema/school/school.schema";

// Schema exports for Better Auth adapter
import * as authSchema from "./db/schema/school/auth.schema";

// Export auth-related schema for Better Auth
export const schema = {
  // Better Auth requires these tables
  user: authSchema.users,
  session: authSchema.userSessions,
  account: authSchema.userAccounts,
  verification: authSchema.emailVerificationTokens,
  organization: authSchema.organizations,
  member: authSchema.members,
  invitation: authSchema.invitations,
};
