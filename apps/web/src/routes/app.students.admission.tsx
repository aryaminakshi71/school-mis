import { createFileRoute } from "@tanstack/react-router";
import { Users, UserPlus, Search, Download, Upload, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
          <h1 className="text-3xl font-bold text-gray-900">Student Admission</h1>
          <p className="text-gray-500 mt-1">
            Manage new student admissions and applications.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-300">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
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
              Total Applications
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">124</div>
            <p className="text-xs text-gray-500">This academic year</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">18</div>
            <p className="text-xs text-gray-500">Awaiting decision</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">98</div>
            <p className="text-xs text-gray-500">Admissions confirmed</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Rejected
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <p className="text-xs text-gray-500">Not eligible</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg flex-1 max-w-md">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search applications..."
                className="border-0 bg-transparent focus-visible:ring-0 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 text-sm">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
              <Button variant="outline" className="border-gray-300 text-sm">
                Filter
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                <tr key={app.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{app.id}</td>
                  <td className="px-6 py-4">{app.name}</td>
                  <td className="px-6 py-4">{app.grade}</td>
                  <td className="px-6 py-4">{app.parentName}</td>
                  <td className="px-6 py-4">{app.contact}</td>
                  <td className="px-6 py-4">{app.appliedDate}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        app.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : app.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="text-blue-600">
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
