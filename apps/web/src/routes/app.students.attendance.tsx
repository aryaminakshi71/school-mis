import { createFileRoute } from "@tanstack/react-router";
import { Calendar, CheckCircle, XCircle, AlertCircle, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  { id: "STU001", name: "Aryan Sharma", class: "10-A", present: 22, absent: 2, percentage: "91.6%", status: "good" },
  { id: "STU002", name: "Priya Patel", class: "9-B", present: 24, absent: 0, percentage: "100%", status: "excellent" },
  { id: "STU003", name: "Rahul Singh", class: "11-A", present: 20, absent: 4, percentage: "83.3%", status: "average" },
  { id: "STU004", name: "Ananya Gupta", class: "8-A", present: 23, absent: 1, percentage: "95.8%", status: "good" },
  { id: "STU005", name: "Vikram Kumar", class: "12-B", present: 19, absent: 5, percentage: "79.1%", status: "low" },
];

function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Attendance</h1>
          <p className="text-gray-500 mt-1">
            Track and manage student daily attendance records.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-300">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
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
              Today's Present
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1,180</div>
            <p className="text-xs text-gray-500">94.5% of total students</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Absent
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">67</div>
            <p className="text-xs text-gray-500">5.5% of total students</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Attendance
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">93.2%</div>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Low Attendance Alert
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-xs text-gray-500">Students below 75%</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg flex-1 max-w-md">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search students..."
                className="border-0 bg-transparent focus-visible:ring-0 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 text-sm">
                Select Date
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
                <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{student.id}</td>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.class}</td>
                  <td className="px-6 py-4 text-green-600">{student.present}</td>
                  <td className="px-6 py-4 text-red-600">{student.absent}</td>
                  <td className="px-6 py-4 font-medium">{student.percentage}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        student.status === "excellent"
                          ? "bg-green-100 text-green-700"
                          : student.status === "good"
                          ? "bg-blue-100 text-blue-700"
                          : student.status === "average"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
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
