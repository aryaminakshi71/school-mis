/**
 * Storage Package Index
 *
 * Re-exports all database schemas, utilities, and database connection.
 */

export * from "./db/schema/school/school.schema";
export * from "./db/schema/school/auth.schema";
export * from "./db/schema/audit-logs.schema";
export { db, type Database } from "./db";
export {
  eq,
  desc,
  asc,
  count,
  or,
  like,
  sql,
  and,
  gte,
  ne,
  lt,
  lte,
  gt,
  inArray,
} from "drizzle-orm";

// Schema exports for Better Auth adapter
import * as schoolSchema from "./db/schema/school/school.schema";

// Export auth-related schema for Better Auth
export const schema = {
  // Better Auth requires these tables
  user: schoolSchema.directory, // Map directory to user table
  session: schoolSchema.sessions,
  account: schoolSchema.staff, // Map staff as account placeholder
  verification: schoolSchema.smsLogs, // Placeholder for verification
  organization: schoolSchema.classes, // Classes can serve as organization
  member: schoolSchema.teachers, // Teachers as members
};
