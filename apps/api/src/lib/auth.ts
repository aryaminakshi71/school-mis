/**
 * Better Auth Configuration
 *
 * Setup Better Auth for authentication.
 */

import { betterAuth } from "better-auth";

export function createAuth(db: any, env: Record<string, any>) {
  return betterAuth({
    database: {
      provider: "postgresql",
      connectionString: env.DATABASE_URL,
    },
    secret: env.BETTER_AUTH_SECRET,
    advanced: {
      cookiePrefix: "school-mis",
      sessionExpiresIn: 60 * 60 * 24 * 7, // 7 days
    },
    plugins: [
      // Add plugins here (email, phone, etc.)
    ],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
  });
}

export function createAuthFromEnv(db: any, env: Record<string, any>) {
  return createAuth(db, {
    DATABASE_URL: env.DATABASE_URL || process.env.DATABASE_URL,
    BETTER_AUTH_SECRET:
      env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:
      env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
  });
}
