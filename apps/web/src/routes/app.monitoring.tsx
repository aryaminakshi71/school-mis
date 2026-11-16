import { MonitoringDashboard } from "@/components/monitoring-dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/monitoring")({
  component: MonitoringPage,
});

function MonitoringPage() {
  return <MonitoringDashboard />;
}
