import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    actorUserId: text("actor_user_id"),
    actorEmail: text("actor_email"),
    organizationId: text("organization_id"),
    action: text("action").notNull(),
    requestMethod: text("request_method").notNull(),
    requestPath: text("request_path").notNull(),
    requestBody: jsonb("request_body"),
    responseStatus: integer("response_status"),
    responseTime: integer("response_time"),
    sessionId: text("session_id"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    resourceType: text("resource_type"),
    resourceId: text("resource_id"),
    details: jsonb("details"),
    oldValues: jsonb("old_values"),
    newValues: jsonb("new_values"),
    statusCode: integer("status_code"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_audit_logs_org").on(table.organizationId),
    index("idx_audit_logs_actor").on(table.actorUserId),
    index("idx_audit_logs_created_at").on(table.createdAt),
  ],
);
