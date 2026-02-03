/**
 * Better Auth Configuration
 *
 * Setup Better Auth for authentication.
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import type { Database } from "@school/storage";
import { schema } from "@school/storage";
import { createStripePlugin, createStripeClient } from "@school/auth/config/stripe";

export function createAuth(db: Database, env: Record<string, any>) {
  // Build plugins array
  const plugins: any[] = [
    // Organization/team support
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 3, // Free tier limit
    }),
  ];

  // Add Stripe plugin if configured
  if (env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET) {
    const stripeClient = createStripeClient(env.STRIPE_SECRET_KEY);
    plugins.push(
      createStripePlugin({
        stripeClient,
        webhookSecret: env.STRIPE_WEBHOOK_SECRET,
        db,
        appId: "school-mis",
      })
    );
  }

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
        organization: schema.organization,
        member: schema.member,
      },
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL || env.VITE_PUBLIC_SITE_URL,
    basePath: "/api/auth",
    advanced: {
      cookiePrefix: "school-mis",
      sessionExpiresIn: 60 * 60 * 24 * 7, // 7 days
    },
    plugins,
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
