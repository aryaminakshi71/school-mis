import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Ban,
  CheckCircle,
  Download,
  Search,
  Shield,
} from "lucide-react";

export const Route = createFileRoute("/app/students/discipline")({
  component: StudentDisciplinePage,
});

const subFeatures = [
  { name: "All Students", href: "/app/students" },
  { name: "Admission", href: "/app/students/admission" },
  { name: "Attendance", href: "/app/students/attendance" },
  { name: "Performance", href: "/app/students/performance" },
  { name: "Discipline", href: "/app/students/discipline", active: true },
  { name: "Transfer TC", href: "/app/students/transfer" },
  { name: "Alumni", href: "/app/students/alumni" },
];

const disciplineRecords = [
  {
    id: "STU001",
    name: "Rahul Verma",
    class: "10-A",
    incident: "Late arrival",
    date: "2026-01-28",
    severity: "minor",
    status: "resolved",
  },
  {
    id: "STU002",
    name: "Kiran Shah",
    class: "9-B",
    incident: "Disruptive behavior",
    date: "2026-01-25",
    severity: "moderate",
    status: "pending",
  },
  {
    id: "STU003",
    name: "Neha Gupta",
    class: "11-A",
    incident: "Uniform violation",
    date: "2026-01-24",
    severity: "minor",
    status: "resolved",
  },
  {
    id: "STU004",
    name: "Amit Kumar",
    class: "12-B",
    incident: "Mobile phone use",
    date: "2026-01-22",
    severity: "minor",
    status: "warning",
  },
];

function StudentDisciplinePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Discipline Records
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage student discipline incidents and behavioral records.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border">
            <Download className="mr-2 h-4 w-4" />
            Export Records
          </Button>
          <Button className="bg-destructive hover:bg-destructive">
            <AlertCircle className="mr-2 h-4 w-4" />
            Report Incident
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
              Total Incidents
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">34</div>
            <p className="text-muted-foreground text-xs">This academic year</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Pending Cases
            </CardTitle>
            <Shield className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">8</div>
            <p className="text-muted-foreground text-xs">Awaiting resolution</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Resolved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">24</div>
            <p className="text-muted-foreground text-xs">Cases resolved</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Suspensions
            </CardTitle>
            <Ban className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">2</div>
            <p className="text-muted-foreground text-xs">Active suspensions</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                className="border-0 bg-transparent text-sm focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border text-sm">
                Filter by Severity
              </Button>
              <Button variant="outline" className="border-border text-sm">
                Filter by Status
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
                <th className="px-6 py-3">Incident Type</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {disciplineRecords.map((record) => (
                <tr key={record.id} className="border-b bg-card hover:bg-muted">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {record.id}
                  </td>
                  <td className="px-6 py-4">{record.name}</td>
                  <td className="px-6 py-4">{record.class}</td>
                  <td className="px-6 py-4">{record.incident}</td>
                  <td className="px-6 py-4">{record.date}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        record.severity === "minor"
                          ? "bg-warning/15 text-warning"
                          : record.severity === "moderate"
                            ? "bg-warning/15 text-warning"
                            : "bg-destructive/10 text-destructive"
                      }
                    >
                      {record.severity.charAt(0).toUpperCase() +
                        record.severity.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        record.status === "resolved"
                          ? "bg-success/15 text-success"
                          : record.status === "pending"
                            ? "bg-warning/15 text-warning"
                            : "bg-primary/10 text-primary"
                      }
                    >
                      {record.status.charAt(0).toUpperCase() +
                        record.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="text-primary">
                      View Details
                    </Button>
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
