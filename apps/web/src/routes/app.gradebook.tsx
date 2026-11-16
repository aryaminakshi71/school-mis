import { RealTimeGrades } from "@/components/real-time-grades";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/gradebook")({
  component: GradebookPage,
});

function GradebookPage() {
  return <RealTimeGrades />;
}
