import { TimetableManager } from "@/components/timetable-manager";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/timetable")({
  component: TimetablePage,
});

function TimetablePage() {
  return <TimetableManager />;
}
