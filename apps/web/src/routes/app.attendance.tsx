import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/attendance")({
  beforeLoad: () => {
    throw redirect({
      to: "/app/attendance",
      replace: true,
    });
  },
});
