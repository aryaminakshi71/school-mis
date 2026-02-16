/**
 * Student Attendance - Detailed student-wise attendance tracking
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { exportToCSV } from "@/lib/export-utils";
import { useSearch } from "@/lib/search-utils";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  Filter,
  Mail,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/attendance/students")({
  component: StudentAttendancePage,
});

const subFeatures = [
  { name: "Dashboard", href: "/app/attendance", icon: Calendar },
  {
    name: "Student Attendance",
    href: "/app/attendance/students",
    icon: Users,
    active: true,
  },
  { name: "Staff Attendance", href: "/app/attendance/staff", icon: Users },
  { name: "Reports", href: "/app/attendance/reports", icon: Calendar },
  { name: "Leave Requests", href: "/app/attendance/leave", icon: Clock },
  { name: "Alerts", href: "/app/attendance/alerts", icon: AlertTriangle },
];

// Mock data for student attendance
const studentAttendance = [
  {
    id: "STU-001",
    name: "Aarav Sharma",
    rollNo: "101",
    class: "10-A",
    totalDays: 25,
    present: 23,
    absent: 1,
    leave: 1,
    percentage: 96,
    status: "regular",
    lastAttendance: "Present",
  },
  {
    id: "STU-002",
    name: "Priya Patel",
    rollNo: "102",
    class: "10-A",
    totalDays: 25,
    present: 24,
    absent: 0,
    leave: 1,
    percentage: 100,
    status: "excellent",
    lastAttendance: "Present",
  },
  {
    id: "STU-003",
    name: "Rahul Kumar",
    rollNo: "103",
    class: "10-A",
    totalDays: 25,
    present: 20,
    absent: 3,
    leave: 2,
    percentage: 88,
    status: "warning",
    lastAttendance: "Absent",
  },
  {
    id: "STU-004",
    name: "Ananya Gupta",
    rollNo: "104",
    class: "10-B",
    totalDays: 25,
    present: 22,
    absent: 2,
    leave: 1,
    percentage: 92,
    status: "regular",
    lastAttendance: "Present",
  },
  {
    id: "STU-005",
    name: "Vikram Singh",
    rollNo: "105",
    class: "9-A",
    totalDays: 25,
    present: 18,
    absent: 5,
    leave: 2,
    percentage: 80,
    status: "critical",
    lastAttendance: "Absent",
  },
  {
    id: "STU-006",
    name: "Neha Verma",
    rollNo: "106",
    class: "9-A",
    totalDays: 25,
    present: 24,
    absent: 1,
    leave: 0,
    percentage: 98,
    status: "excellent",
    lastAttendance: "Present",
  },
];

const classOptions = [
  "All Classes",
  "10-A",
  "10-B",
  "9-A",
  "9-B",
  "8-A",
  "8-B",
];

function StudentAttendancePage() {
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredStudents,
    hasActiveFilters,
    clearSearch,
  } = useSearch({
    data: studentAttendance,
    searchFields: ["name", "id", "rollNo", "class"],
    searchQuery: "",
  });

  const filteredByClass =
    selectedClass === "All Classes"
      ? filteredStudents
      : filteredStudents.filter((s) => s.class === selectedClass);

  const regularStudents = filteredByClass.filter(
    (s) => s.percentage >= 95,
  ).length;
  const warningStudents = filteredByClass.filter(
    (s) => s.percentage < 90,
  ).length;

  const handleExport = () => {
    const exportData = filteredByClass.map((s) => ({
      "Student ID": s.id,
      Name: s.name,
      "Roll No": s.rollNo,
      Class: s.class,
      "Total Days": s.totalDays,
      Present: s.present,
      Absent: s.absent,
      Leave: s.leave,
      Percentage: `${s.percentage}%`,
      Status: s.status,
    }));

    exportToCSV(exportData, `student-attendance-${selectedDate}`);
    toast.success("Student attendance exported");
  };

  const handleNotifyParents = (studentId: string) => {
    toast.success(`Notification sent to parents of ${studentId}`);
  };

  const stats = [
    {
      title: "Total Students",
      value: filteredByClass.length.toString(),
      change: "Selected class",
      icon: Users,
      color: "blue",
    },
    {
      title: "Regular (95%+)",
      value: regularStudents.toString(),
      change: "Good standing",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Low Attendance",
      value: warningStudents.toString(),
      change: "Needs attention",
      icon: AlertTriangle,
      color: "red",
    },
    {
      title: "Avg Attendance",
      value: "93%",
      change: "This month",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Student Attendance
          </h1>
          <p className="text-muted-foreground">
            Track individual student attendance records and history.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Sub-features Navigation */}
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {subFeatures.map((feature) => (
            <a
              key={feature.name}
              href={feature.href}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
                feature.active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <feature.icon className="h-4 w-4" />
              {feature.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium text-sm">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 bg-${stat.color}-100`}>
                <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stat.value}</div>
              <p className="text-muted-foreground text-xs">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px] pl-9"
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="-translate-y-1/2 absolute top-1/2 right-2 h-6 px-2 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="flex h-10 w-[150px] items-center justify-between rounded-lg border border-input bg-card px-3 py-2 text-sm"
          >
            {classOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex h-10 w-[150px] items-center justify-between rounded-lg border border-input bg-card px-3 py-2 text-sm"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Student Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-muted-foreground text-sm">
                  <th className="pb-3 font-medium">Student ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Roll No</th>
                  <th className="pb-3 font-medium">Class</th>
                  <th className="pb-3 font-medium">Present</th>
                  <th className="pb-3 font-medium">Absent</th>
                  <th className="pb-3 font-medium">Leave</th>
                  <th className="pb-3 font-medium">Percentage</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Today's Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredByClass.map((student) => (
                  <tr key={student.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{student.id}</td>
                    <td className="py-3 font-medium">{student.name}</td>
                    <td className="py-3 text-sm">{student.rollNo}</td>
                    <td className="py-3 text-sm">{student.class}</td>
                    <td className="py-3 font-medium text-sm text-success">
                      {student.present}
                    </td>
                    <td className="py-3 font-medium text-destructive text-sm">
                      {student.absent}
                    </td>
                    <td className="py-3 text-primary text-sm">
                      {student.leave}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${
                              student.percentage >= 95
                                ? "bg-success"
                                : student.percentage >= 90
                                  ? "bg-warning"
                                  : "bg-destructive"
                            }`}
                            style={{ width: `${student.percentage}%` }}
                          />
                        </div>
                        <span className="font-medium text-sm">
                          {student.percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          student.status === "excellent"
                            ? "success"
                            : student.status === "regular"
                              ? "default"
                              : student.status === "warning"
                                ? "warning"
                                : "destructive"
                        }
                      >
                        {student.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          student.lastAttendance === "Present"
                            ? "success"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {student.lastAttendance}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleNotifyParents(student.id)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
