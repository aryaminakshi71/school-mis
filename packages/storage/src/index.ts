/**
 * Storage Package Index
 *
 * Re-exports all database schemas and utilities.
 */

export * from "./db/schema/school/school.schema.ts";

// Re-export drizzle-orm query builders for convenience
export {
  // Query builders
  select,
  insert,
  update,
  delete as deleteQuery,
  // Conditions
  eq,
  and,
  or,
  not,
  // Ordering
  desc,
  asc,
  // SQL
  sql,
  // Aggregates
  count,
  sum,
  avg,
  min,
  max,
} from "drizzle-orm";
