import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "../components/providers/posthog-provider";
import { ThemeProvider } from "../lib/theme-context";
import { AuthProvider } from "../lib/auth-context";
import { ErrorBoundary } from "../components/error-boundary";
import { useGlobalShortcuts } from "../lib/keyboard-shortcuts";

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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "School MIS - Modern School Management" },
      {
        name: "description",
        content: "Complete school administration solution",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  // Enable global keyboard shortcuts
  useGlobalShortcuts();

  return (
    <html lang="en" className="light">
      <head>
        <HeadContent />
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
