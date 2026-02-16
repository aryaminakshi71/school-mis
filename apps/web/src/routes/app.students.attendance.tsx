import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Download,
  Search,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/app/students/attendance")({
  component: StudentAttendancePage,
});

const subFeatures = [
  { name: "All Students", href: "/app/students" },
  { name: "Admission", href: "/app/students/admission" },
  { name: "Attendance", href: "/app/students/attendance", active: true },
  { name: "Performance", href: "/app/students/performance" },
  { name: "Discipline", href: "/app/students/discipline" },
  { name: "Transfer TC", href: "/app/students/transfer" },
  { name: "Alumni", href: "/app/students/alumni" },
];

const attendanceData = [
  {
    id: "STU001",
    name: "Aryan Sharma",
    class: "10-A",
    present: 22,
    absent: 2,
    percentage: "91.6%",
    status: "good",
  },
  {
    id: "STU002",
    name: "Priya Patel",
    class: "9-B",
    present: 24,
    absent: 0,
    percentage: "100%",
    status: "excellent",
  },
  {
    id: "STU003",
    name: "Rahul Singh",
    class: "11-A",
    present: 20,
    absent: 4,
    percentage: "83.3%",
    status: "average",
  },
  {
    id: "STU004",
    name: "Ananya Gupta",
    class: "8-A",
    present: 23,
    absent: 1,
    percentage: "95.8%",
    status: "good",
  },
  {
    id: "STU005",
    name: "Vikram Kumar",
    class: "12-B",
    present: 19,
    absent: 5,
    percentage: "79.1%",
    status: "low",
  },
];

function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Student Attendance
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track and manage student daily attendance records.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Calendar className="mr-2 h-4 w-4" />
            Mark Attendance
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {subFeatures.map((feature) => (
          <a
            key={feature.name}
            href={feature.href}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm ${
              feature.active
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-muted"
            }`}
          >
            {feature.name}
          </a>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Today's Present
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">1,180</div>
            <p className="text-muted-foreground text-xs">
              94.5% of total students
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Today's Absent
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">67</div>
            <p className="text-muted-foreground text-xs">
              5.5% of total students
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Average Attendance
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">93.2%</div>
            <p className="text-muted-foreground text-xs">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Low Attendance Alert
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">12</div>
            <p className="text-muted-foreground text-xs">Students below 75%</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="border-0 bg-transparent text-sm focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border text-sm">
                Select Date
              </Button>
              <Button variant="outline" className="border-border text-sm">
                Filter by Class
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Student ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Class</th>
                <th className="px-6 py-3">Present Days</th>
                <th className="px-6 py-3">Absent Days</th>
                <th className="px-6 py-3">Attendance %</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((student) => (
                <tr
                  key={student.id}
                  className="border-b bg-card hover:bg-muted"
                >
                  <td className="px-6 py-4 font-medium text-foreground">
                    {student.id}
                  </td>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.class}</td>
                  <td className="px-6 py-4 text-success">{student.present}</td>
                  <td className="px-6 py-4 text-destructive">
                    {student.absent}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {student.percentage}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        student.status === "excellent"
                          ? "bg-success/15 text-success"
                          : student.status === "good"
                            ? "bg-primary/10 text-primary"
                            : student.status === "average"
                              ? "bg-warning/15 text-warning"
                              : "bg-destructive/10 text-destructive"
                      }
                    >
                      {student.status.charAt(0).toUpperCase() +
                        student.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
