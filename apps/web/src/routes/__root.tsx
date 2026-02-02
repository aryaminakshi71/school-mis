import {
  Scripts,
  createRootRoute,
  Outlet,
  HeadContent,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "../components/providers/posthog-provider";
import { ThemeProvider } from "../lib/theme-context";
import { AuthProvider } from "../lib/auth-context";
import { ErrorBoundary } from "../components/error-boundary";
import { useGlobalShortcuts } from "../lib/keyboard-shortcuts";
import { ErrorPage, NotFoundPage } from "../components/error";
import { generateOrganizationSchema, generateWebSiteSchema, getSchoolMISOrganizationSchema } from "../lib/structured-data";

import "../styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const Route = createRootRoute({
  component: RootDocument,
  errorComponent: ({ error }) => <ErrorPage error={error} />,
  notFoundComponent: () => <NotFoundPage />,
});

function RootDocument() {
  // Enable global keyboard shortcuts
  useGlobalShortcuts();

  const organizationSchema = generateOrganizationSchema(getSchoolMISOrganizationSchema())
  const websiteSchema = generateWebSiteSchema({
    name: 'School MIS',
    url: import.meta.env.VITE_PUBLIC_SITE_URL || 'https://school-mis.your-domain.com',
    description: 'Complete school administration solution for managing all school operations.',
  })

  return (
    <html lang="en" className="light">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body>
        <ErrorBoundary>
          <PostHogProvider>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider>
                <AuthProvider>
                  <Outlet />
                  <Toaster position="top-right" richColors />
                  <TanStackRouterDevtools />
                  <Scripts />
                </AuthProvider>
              </ThemeProvider>
            </QueryClientProvider>
          </PostHogProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
