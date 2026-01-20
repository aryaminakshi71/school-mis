import { createRouter, createRouterType } from "@tanstack/react-router";

const routeTree = createRouterType({
  routes: {
    "/": {
      filePath: "index.tsx",
    },
    "/features": {
      filePath: "features.tsx",
    },
    "/pricing": {
      filePath: "pricing.tsx",
    },
    "/faq": {
      filePath: "faq.tsx",
    },
    "/about": {
      filePath: "about.tsx",
    },
    "/login": {
      filePath: "login.tsx",
    },
    "/signup": {
      filePath: "signup.tsx",
    },
    "/forgot-password": {
      filePath: "forgot-password.tsx",
    },
    "/privacy": {
      filePath: "privacy.tsx",
    },
    "/terms": {
      filePath: "terms.tsx",
    },
    "/app": {
      filePath: "app.tsx",
    },
    "/app/students": {
      filePath: "app.students.tsx",
    },
  },
});

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
