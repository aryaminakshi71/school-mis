import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle,
  Clock,
  Download,
  Search,
  Upload,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/app/students/admission")({
  component: StudentAdmissionPage,
});

const subFeatures = [
  { name: "All Students", href: "/app/students" },
  { name: "Admission", href: "/app/students/admission", active: true },
  { name: "Attendance", href: "/app/students/attendance" },
  { name: "Performance", href: "/app/students/performance" },
  { name: "Discipline", href: "/app/students/discipline" },
  { name: "Transfer TC", href: "/app/students/transfer" },
  { name: "Alumni", href: "/app/students/alumni" },
];

const admissionApplications = [
  {
    id: "APP001",
    name: "Rohan Kumar",
    grade: "Class 5",
    parentName: "Rajesh Kumar",
    contact: "+91 98765 43210",
    appliedDate: "2026-01-28",
    status: "pending",
  },
  {
    id: "APP002",
    name: "Priya Sharma",
    grade: "Class 8",
    parentName: "Amit Sharma",
    contact: "+91 98765 43211",
    appliedDate: "2026-01-27",
    status: "approved",
  },
  {
    id: "APP003",
    name: "Arjun Patel",
    grade: "Class 3",
    parentName: "Suresh Patel",
    contact: "+91 98765 43212",
    appliedDate: "2026-01-26",
    status: "rejected",
  },
];

function StudentAdmissionPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Student Admission
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage new student admissions and applications.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="mr-2 h-4 w-4" />
            New Application
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
              Total Applications
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">124</div>
            <p className="text-muted-foreground text-xs">This academic year</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">18</div>
            <p className="text-muted-foreground text-xs">Awaiting decision</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">98</div>
            <p className="text-muted-foreground text-xs">
              Admissions confirmed
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Rejected
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">8</div>
            <p className="text-muted-foreground text-xs">Not eligible</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                className="border-0 bg-transparent text-sm focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border text-sm">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
              <Button variant="outline" className="border-border text-sm">
                Filter
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Application ID</th>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Parent Name</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Applied Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admissionApplications.map((app) => (
                <tr key={app.id} className="border-b bg-card hover:bg-muted">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {app.id}
                  </td>
                  <td className="px-6 py-4">{app.name}</td>
                  <td className="px-6 py-4">{app.grade}</td>
                  <td className="px-6 py-4">{app.parentName}</td>
                  <td className="px-6 py-4">{app.contact}</td>
                  <td className="px-6 py-4">{app.appliedDate}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        app.status === "approved"
                          ? "bg-success/15 text-success"
                          : app.status === "rejected"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-warning/15 text-warning"
                      }
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="text-primary">
                      Review
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
