import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "School MIS - Modern School Management System" },
      {
        name: "description",
        content:
          "Comprehensive school management system for educational institutions. Manage students, staff, finances, and communications from a single platform.",
      },
    ],
    links: [{ rel: "icon", href: "/favicon.ico" }],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <Toaster position="top-right" richColors />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  );
}
