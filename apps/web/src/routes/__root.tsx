import { NotFoundPage } from "@/components/error";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { AuthProvider } from "../lib/auth-context";
import { initSentry } from "../lib/sentry";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  getSchoolMISOrganizationSchema,
} from "../lib/structured-data";
import "../styles/globals.css";

export const Route = createRootRoute({
  head: () => {
    const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL;
    const ogImage = siteUrl ? `${siteUrl}/og.svg` : "/og.svg";

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "School MIS - School Management Information System" },
        {
          name: "description",
          content:
            "All-in-one school management system for students, staff, academics, finance, and operations.",
        },
        { name: "robots", content: "index, follow" },
        {
          property: "og:title",
          content: "School MIS - School Management Information System",
        },
        {
          property: "og:description",
          content:
            "All-in-one school management system for students, staff, academics, finance, and operations.",
        },
        { property: "og:type", content: "website" },
        { property: "og:image", content: ogImage },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "School MIS - School Management Information System",
        },
        {
          name: "twitter:description",
          content:
            "All-in-one school management system for students, staff, academics, finance, and operations.",
        },
        { name: "twitter:image", content: ogImage },
        { name: "theme-color", content: "#4f46e5" },
      ],
    };
  },
  component: RootDocument,
  notFoundComponent: NotFoundPage,
});

const queryClient = new QueryClient();

function RootDocument() {
  if (typeof window !== "undefined") {
    initSentry();
  }

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="mask-icon" href="/icon.svg" color="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateOrganizationSchema(getSchoolMISOrganizationSchema()),
            ),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateWebSiteSchema({
                name: getSchoolMISOrganizationSchema().name,
                url:
                  import.meta.env.VITE_PUBLIC_SITE_URL ||
                  getSchoolMISOrganizationSchema().url,
              }),
            ),
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Outlet />
            <Scripts />
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
