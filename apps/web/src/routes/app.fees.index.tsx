import { RealTimeFees } from "@/components/real-time-fees";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/fees/")({
  component: FeesPage,
});

function FeesPage() {
  return <RealTimeFees />;
}
