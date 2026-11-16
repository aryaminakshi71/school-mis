import { RealTimeAttendance } from "@/components/real-time-attendance";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/attendance/")({
  component: AttendancePage,
});

function AttendancePage() {
  return <RealTimeAttendance />;
}
