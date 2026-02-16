import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/app/students/transfer")({
  component: StudentTransferPage,
});

const subFeatures = [
  { name: "All Students", href: "/app/students" },
  { name: "Admission", href: "/app/students/admission" },
  { name: "Attendance", href: "/app/students/attendance" },
  { name: "Performance", href: "/app/students/performance" },
  { name: "Discipline", href: "/app/students/discipline" },
  { name: "Transfer TC", href: "/app/students/transfer", active: true },
  { name: "Alumni", href: "/app/students/alumni" },
];

const transferApplications = [
  {
    id: "TC001",
    name: "Rohan Mehta",
    class: "8-A",
    reason: "Parent transfer",
    applyDate: "2026-01-28",
    status: "pending",
  },
  {
    id: "TC002",
    name: "Sneha Rao",
    class: "10-B",
    reason: "Relocation",
    applyDate: "2026-01-25",
    status: "approved",
  },
  {
    id: "TC003",
    name: "Karan Shah",
    class: "9-A",
    reason: "Family reasons",
    applyDate: "2026-01-24",
    status: "issued",
  },
];

function StudentTransferPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Transfer Certificate (TC)
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage student transfer requests and issue TC certificates.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border">
            <Download className="mr-2 h-4 w-4" />
            Export Records
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <FileText className="mr-2 h-4 w-4" />
            New TC Request
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
              Total Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">18</div>
            <p className="text-muted-foreground text-xs">This academic year</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">5</div>
            <p className="text-muted-foreground text-xs">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              TC Issued
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">12</div>
            <p className="text-muted-foreground text-xs">Certificates issued</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Alumni
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">156</div>
            <p className="text-muted-foreground text-xs">Total alumni</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search TC applications..."
                className="border-0 bg-transparent text-sm focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border text-sm">
                Filter by Status
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
                <th className="px-6 py-3">TC ID</th>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Class</th>
                <th className="px-6 py-3">Reason</th>
                <th className="px-6 py-3">Apply Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transferApplications.map((tc) => (
                <tr key={tc.id} className="border-b bg-card hover:bg-muted">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {tc.id}
                  </td>
                  <td className="px-6 py-4">{tc.name}</td>
                  <td className="px-6 py-4">{tc.class}</td>
                  <td className="px-6 py-4">{tc.reason}</td>
                  <td className="px-6 py-4">{tc.applyDate}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        tc.status === "issued"
                          ? "bg-success/15 text-success"
                          : tc.status === "approved"
                            ? "bg-primary/10 text-primary"
                            : "bg-warning/15 text-warning"
                      }
                    >
                      {tc.status.charAt(0).toUpperCase() + tc.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="text-primary">
                      View
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
