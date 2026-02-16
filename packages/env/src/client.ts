/**
 * Client environment variables
 * Safe to expose to browser
 */

import { z } from "zod";

export const clientSchema = z.object({
  VITE_PUBLIC_SITE_URL: z.string().url().default("http://localhost:5173"),
  VITE_PUBLIC_CDN_URL: z.string().url().optional(),
  VITE_PUBLIC_POSTHOG_KEY: z.string().optional(),
  VITE_PUBLIC_POSTHOG_HOST: z.string().optional(),
  VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
});

export type ClientEnv = z.infer<typeof clientSchema>;

export const env: ClientEnv = clientSchema.parse({
  VITE_PUBLIC_SITE_URL: import.meta.env.VITE_PUBLIC_SITE_URL,
  VITE_PUBLIC_CDN_URL: import.meta.env.VITE_PUBLIC_CDN_URL,
  VITE_PUBLIC_POSTHOG_KEY: import.meta.env.VITE_PUBLIC_POSTHOG_KEY,
  VITE_PUBLIC_POSTHOG_HOST: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY: import.meta.env
    .VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY,
});
