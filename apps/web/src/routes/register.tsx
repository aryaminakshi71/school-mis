/**
 * Register Page
 *
 * Redirects to signup page.
 */

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  loader: () => {
    throw redirect({
      to: "/signup",
    });
  },
});
