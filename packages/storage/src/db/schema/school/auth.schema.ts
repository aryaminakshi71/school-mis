import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ============================================================================
// USER AUTHENTICATION TABLES
// ============================================================================

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    image: text("image"),
    role: varchar("role", { length: 50 }).notNull().default("student"),
    phone: varchar("phone", { length: 20 }),
    isActive: boolean("is_active").default(true).notNull(),
    studentId: uuid("student_id"),
    childId: uuid("child_id"),
    schoolId: uuid("school_id"), // Reference to organization/school
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    // Better Auth required fields
    password: text("password"), // Hashed password
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
    schoolIdx: index("users_school_idx").on(table.schoolId),
  }),
);

export const userAccounts = pgTable(
  "user_accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    accountId: text("account_id").notNull(), // OAuth account ID
    providerId: text("provider_id").notNull(), // OAuth provider (google, github, etc.)
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    idToken: text("id_token"),
    password: text("password"), // For account password
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("accounts_user_idx").on(table.userId),
    providerIdx: index("accounts_provider_idx").on(
      table.providerId,
      table.accountId,
    ),
  }),
);

export const userSessions = pgTable(
  "user_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    impersonatedBy: text("impersonated_by"),
    activeOrganizationId: uuid("active_organization_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("sessions_user_idx").on(table.userId),
    tokenIdx: index("sessions_token_idx").on(table.token),
    expiresIdx: index("sessions_expires_idx").on(table.expiresAt),
  }),
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    token: varchar("token", { length: 255 }).unique().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    usedAt: timestamp("used_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("reset_tokens_user_idx").on(table.userId),
    tokenIdx: index("reset_tokens_token_idx").on(table.token),
    expiresIdx: index("reset_tokens_expires_idx").on(table.expiresAt),
  }),
);

export const emailVerificationTokens = pgTable(
  "email_verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    // Better Auth-compatible columns
    identifier: varchar("identifier", { length: 255 }),
    value: text("value"),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).unique(),
    expiresAt: timestamp("expires_at").notNull(),
    verifiedAt: timestamp("verified_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("verify_tokens_user_idx").on(table.userId),
    tokenIdx: index("verify_tokens_token_idx").on(table.token),
    identifierIdx: index("verify_tokens_identifier_idx").on(table.identifier),
    expiresIdx: index("verify_tokens_expires_idx").on(table.expiresAt),
  }),
);

// ============================================================================
// ORGANIZATION (SCHOOL) TABLES
// ============================================================================

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique(),
    logo: text("logo"),
    metadata: jsonb("metadata"),
    // School specific fields
    schoolCode: varchar("school_code", { length: 50 }).unique(),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    pincode: varchar("pincode", { length: 10 }),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }),
    website: text("website"),
    // Subscription/Billing
    plan: varchar("plan", { length: 50 }).default("free").notNull(),
    subscriptionStatus: varchar("subscription_status", { length: 50 }).default(
      "active",
    ),
    subscriptionExpiresAt: timestamp("subscription_expires_at"),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    // Status
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("org_slug_idx").on(table.slug),
    schoolCodeIdx: index("org_school_code_idx").on(table.schoolCode),
    planIdx: index("org_plan_idx").on(table.plan),
  }),
);

export const members = pgTable(
  "members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: varchar("role", { length: 50 }).notNull().default("member"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index("members_org_idx").on(table.organizationId),
    userIdx: index("members_user_idx").on(table.userId),
    orgUserIdx: index("members_org_user_idx").on(
      table.organizationId,
      table.userId,
    ),
  }),
);

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull(),
    status: varchar("status", { length: 50 }).default("pending").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    invitedBy: uuid("invited_by").references(() => users.id),
    inviterId: uuid("inviter_id").references(() => users.id),
    acceptedAt: timestamp("accepted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index("invitations_org_idx").on(table.organizationId),
    emailIdx: index("invitations_email_idx").on(table.email),
    statusIdx: index("invitations_status_idx").on(table.status),
    expiresIdx: index("invitations_expires_idx").on(table.expiresAt),
  }),
);

// ============================================================================
// USER PASSWORD HISTORY (for security)
// ============================================================================

export const userPasswords = pgTable("user_passwords", {
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  sessions: many(userSessions),
  accounts: many(userAccounts),
  password: one(userPasswords, {
    fields: [users.id],
    references: [userPasswords.userId],
  }),
  passwordResetTokens: many(passwordResetTokens),
  emailVerificationTokens: many(emailVerificationTokens),
  members: many(members),
}));

export const userAccountsRelations = relations(userAccounts, ({ one }) => ({
  user: one(users, {
    fields: [userAccounts.userId],
    references: [users.id],
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

export const userPasswordsRelations = relations(userPasswords, ({ one }) => ({
  user: one(users, {
    fields: [userPasswords.userId],
    references: [users.id],
  }),
}));

export const passwordResetTokensRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.userId],
      references: [users.id],
    }),
  }),
);

export const emailVerificationTokensRelations = relations(
  emailVerificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationTokens.userId],
      references: [users.id],
    }),
  }),
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(members),
  invitations: many(invitations),
}));

export const membersRelations = relations(members, ({ one }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  invitedByUser: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));
