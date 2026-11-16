import { RealTimeDashboard } from "@/components/real-time-dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: DashboardHome,
});

export default function DashboardHome() {
  return <RealTimeDashboard />;
}
