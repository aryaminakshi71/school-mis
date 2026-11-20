import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SubscriptionGate } from "@/components/billing/SubscriptionGate";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <SubscriptionGate>
      <Outlet />
    </SubscriptionGate>
  );
}
