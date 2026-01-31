import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Award, Search, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/app/students/performance")({
  component: StudentPerformancePage,
});

const subFeatures = [
  { name: "All Students", href: "/app/students" },
  { name: "Admission", href: "/app/students/admission" },
  { name: "Attendance", href: "/app/students/attendance" },
  { name: "Performance", href: "/app/students/performance", active: true },
  { name: "Discipline", href: "/app/students/discipline" },
  { name: "Transfer TC", href: "/app/students/transfer" },
  { name: "Alumni", href: "/app/students/alumni" },
];

const performanceData = [
  { id: "STU001", name: "Aryan Sharma", class: "10-A", marks: 85, grade: "A", rank: 3, status: "excellent" },
  { id: "STU002", name: "Priya Patel", class: "9-B", marks: 92, grade: "A+", rank: 1, status: "outstanding" },
  { id: "STU003", name: "Rahul Singh", class: "11-A", marks: 78, grade: "B+", rank: 8, status: "good" },
  { id: "STU004", name: "Ananya Gupta", class: "8-A", marks: 88, grade: "A", rank: 2, status: "excellent" },
  { id: "STU005", name: "Vikram Kumar", class: "12-B", marks: 72, grade: "B", rank: 12, status: "average" },
];

function StudentPerformancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Performance</h1>
          <p className="text-gray-500 mt-1">
            View and analyze student academic performance and grades.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-300">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" className="border-gray-300">
            <Download className="mr-2 h-4 w-4" />
            Export
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
              Class Average
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">82.4%</div>
            <p className="text-xs text-gray-500">All classes combined</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Top Performers
            </CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">47</div>
            <p className="text-xs text-gray-500">Students with A grade</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Needs Improvement
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">23</div>
            <p className="text-xs text-gray-500">Below 60% marks</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Exams Completed
            </CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-xs text-gray-500">This academic year</p>
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
                Select Exam
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
                <th className="px-6 py-3">Marks %</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Class Rank</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((student) => (
                <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{student.id}</td>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.class}</td>
                  <td className="px-6 py-4 font-medium">{student.marks}%</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-blue-100 text-blue-700">{student.grade}</Badge>
                  </td>
                  <td className="px-6 py-4">#{student.rank}</td>
                  <td className="px-6 py-4">
                    <div className="w-24">
                      <Progress value={student.marks} className="h-2" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        student.status === "outstanding"
                          ? "bg-purple-100 text-purple-700"
                          : student.status === "excellent"
                          ? "bg-green-100 text-green-700"
                          : student.status === "good"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
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
