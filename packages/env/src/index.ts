/**
 * Environment Variables Type Definitions
 *
 * This package provides type-safe access to environment variables.
 * All environment variables used across the application should be typed here.
 */

export type ProcessEnv = {
  // Operational
  NODE_ENV: "development" | "production" | "test";

  // Site Config
  VITE_PUBLIC_SITE_URL: string;
  API_URL: string;

  // Database
  DATABASE_URL: string;

  // Auth (Better Auth)
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;

  // Redis (Upstash)
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;

  // Analytics
  VITE_PUBLIC_POSTHOG_KEY?: string;
  VITE_PUBLIC_POSTHOG_HOST?: string;

  // Cloudflare
  CLOUDFLARE_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET_NAME?: string;

  // Stripe
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;

  // Email (SMTP)
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  FROM_EMAIL?: string;

  // SMS (Twilio)
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_PHONE_NUMBER?: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ProcessEnv {}
  }
}
