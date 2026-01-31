import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, CheckCircle, Clock, Search, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  { id: "TC001", name: "Rohan Mehta", class: "8-A", reason: "Parent transfer", applyDate: "2026-01-28", status: "pending" },
  { id: "TC002", name: "Sneha Rao", class: "10-B", reason: "Relocation", applyDate: "2026-01-25", status: "approved" },
  { id: "TC003", name: "Karan Shah", class: "9-A", reason: "Family reasons", applyDate: "2026-01-24", status: "issued" },
];

function StudentTransferPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transfer Certificate (TC)</h1>
          <p className="text-gray-500 mt-1">
            Manage student transfer requests and issue TC certificates.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-300">
            <Download className="mr-2 h-4 w-4" />
            Export Records
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
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
              Total Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">18</div>
            <p className="text-xs text-gray-500">This academic year</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">5</div>
            <p className="text-xs text-gray-500">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              TC Issued
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-xs text-gray-500">Certificates issued</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Alumni
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">156</div>
            <p className="text-xs text-gray-500">Total alumni</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg flex-1 max-w-md">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search TC applications..."
                className="border-0 bg-transparent focus-visible:ring-0 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 text-sm">
                Filter by Status
              </Button>
              <Button variant="outline" className="border-gray-300 text-sm">
                Filter by Class
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                <tr key={tc.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{tc.id}</td>
                  <td className="px-6 py-4">{tc.name}</td>
                  <td className="px-6 py-4">{tc.class}</td>
                  <td className="px-6 py-4">{tc.reason}</td>
                  <td className="px-6 py-4">{tc.applyDate}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        tc.status === "issued"
                          ? "bg-green-100 text-green-700"
                          : tc.status === "approved"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {tc.status.charAt(0).toUpperCase() + tc.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="text-blue-600">
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
