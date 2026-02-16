import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/fees/payment")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/fees/payment"!</div>;
}
