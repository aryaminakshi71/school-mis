import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Shield, Search, Download, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  { id: "STU001", name: "Rahul Verma", class: "10-A", incident: "Late arrival", date: "2026-01-28", severity: "minor", status: "resolved" },
  { id: "STU002", name: "Kiran Shah", class: "9-B", incident: "Disruptive behavior", date: "2026-01-25", severity: "moderate", status: "pending" },
  { id: "STU003", name: "Neha Gupta", class: "11-A", incident: "Uniform violation", date: "2026-01-24", severity: "minor", status: "resolved" },
  { id: "STU004", name: "Amit Kumar", class: "12-B", incident: "Mobile phone use", date: "2026-01-22", severity: "minor", status: "warning" },
];

function StudentDisciplinePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discipline Records</h1>
          <p className="text-gray-500 mt-1">
            Manage student discipline incidents and behavioral records.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-300">
            <Download className="mr-2 h-4 w-4" />
            Export Records
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
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
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              feature.active
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {feature.name}
          </a>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Incidents
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">34</div>
            <p className="text-xs text-gray-500">This academic year</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Cases
            </CardTitle>
            <Shield className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <p className="text-xs text-gray-500">Awaiting resolution</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Resolved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">24</div>
            <p className="text-xs text-gray-500">Cases resolved</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Suspensions
            </CardTitle>
            <Ban className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">2</div>
            <p className="text-xs text-gray-500">Active suspensions</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg flex-1 max-w-md">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search incidents..."
                className="border-0 bg-transparent focus-visible:ring-0 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 text-sm">
                Filter by Severity
              </Button>
              <Button variant="outline" className="border-gray-300 text-sm">
                Filter by Status
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{record.id}</td>
                  <td className="px-6 py-4">{record.name}</td>
                  <td className="px-6 py-4">{record.class}</td>
                  <td className="px-6 py-4">{record.incident}</td>
                  <td className="px-6 py-4">{record.date}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        record.severity === "minor"
                          ? "bg-yellow-100 text-yellow-700"
                          : record.severity === "moderate"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {record.severity.charAt(0).toUpperCase() + record.severity.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        record.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : record.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="text-blue-600">
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
