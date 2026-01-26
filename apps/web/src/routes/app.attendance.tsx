/**
 * Attendance Management - Complete Module
 * All sub-features for student and staff attendance tracking
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Download,
  Plus,
  ChevronRight,
  Search,
  Filter,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/lib/search-utils";
import { exportToCSV } from "@/lib/export-utils";
import { useListPageShortcuts } from "@/lib/keyboard-shortcuts";
import { SkeletonTable } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { handleError } from "@/lib/error-handler";

export const Route = createFileRoute("/app/attendance")({
  component: AttendancePage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/attendance", icon: Calendar, active: true },
  { name: "Student Attendance", href: "/app/attendance/students", icon: Users },
  { name: "Staff Attendance", href: "/app/attendance/staff", icon: Users },
  { name: "Reports", href: "/app/attendance/reports", icon: FileText },
  { name: "Leave Requests", href: "/app/attendance/leave", icon: Clock },
  { name: "Alerts", href: "/app/attendance/alerts", icon: AlertTriangle },
];

// Mock data
const todayAttendance = [
  {
    class: "Class 10-A",
    total: 42,
    present: 40,
    absent: 2,
    percentage: "95.2%",
  },
  {
    class: "Class 10-B",
    total: 40,
    present: 38,
    absent: 2,
    percentage: "95.0%",
  },
  {
    class: "Class 9-A",
    total: 38,
    present: 37,
    absent: 1,
    percentage: "97.4%",
  },
  {
    class: "Class 9-B",
    total: 36,
    present: 34,
    absent: 2,
    percentage: "94.4%",
  },
  {
    class: "Class 8-A",
    total: 40,
    present: 39,
    absent: 1,
    percentage: "97.5%",
  },
];

const recentAbsentStudents = [
  {
    id: "STU001",
    name: "Aryan Sharma",
    class: "Class 10-A",
    reason: "Sick Leave",
    date: "Jan 20, 2026",
    parentNotified: true,
  },
  {
    id: "STU002",
    name: "Priya Patel",
    class: "Class 9-B",
    reason: "Family Function",
    date: "Jan 20, 2026",
    parentNotified: false,
  },
  {
    id: "STU003",
    name: "Rahul Singh",
    class: "Class 10-A",
    reason: "Medical",
    date: "Jan 19, 2026",
    parentNotified: true,
  },
];

const stats = [
  {
    title: "Today's Attendance",
    value: "94.2%",
    change: "+2.1%",
    icon: CheckCircle,
    color: "green",
  },
  {
    title: "Total Absent",
    value: "23",
    change: "-5",
    icon: XCircle,
    color: "red",
  },
  {
    title: "Leave Pending",
    value: "8",
    change: "Requests",
    icon: Clock,
    color: "yellow",
  },
  {
    title: "Alerts Sent",
    value: "15",
    change: "Today",
    icon: AlertTriangle,
    color: "purple",
  },
];

function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Search functionality
  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredAttendance,
    hasActiveFilters,
    clearSearch,
  } = useSearch({
    data: todayAttendance,
    searchFields: ["class"],
  });

  const {
    searchQuery: absentSearchQuery,
    setSearchQuery: setAbsentSearchQuery,
    filteredData: filteredAbsentStudents,
    hasActiveFilters: hasAbsentFilters,
    clearSearch: clearAbsentSearch,
  } = useSearch({
    data: recentAbsentStudents,
    searchFields: ["name", "class", "id"],
  });

  // Export functionality
  const handleExport = () => {
    try {
      const exportData = todayAttendance.map((a) => ({
        "Class": a.class,
        "Total Students": a.total.toString(),
        "Present": a.present.toString(),
        "Absent": a.absent.toString(),
        "Percentage": a.percentage,
      }));

      exportToCSV(exportData, `attendance-export-${selectedDate}`);
      toast.success("Attendance report exported successfully");
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  // Keyboard shortcuts
  useListPageShortcuts(
    () => toast.info("Mark Attendance feature coming soon"),
    () => window.location.reload(),
    () => handleExport()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track student and staff attendance, manage leave requests, and send
            alerts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleExport}
            disabled={todayAttendance.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report ({todayAttendance.length})
          </Button>
          <Button onClick={() => toast.info("Mark Attendance feature coming soon")}>
            <Plus className="mr-2 h-4 w-4" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Date Picker */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex h-10 w-[200px] items-center justify-between rounded-lg border border-input bg-white px-3 py-2 text-sm"
          />
        </div>
        <Button variant="outline">Today</Button>
        <Button variant="outline">Yesterday</Button>
      </div>

      {/* Sub-features Navigation */}
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {subFeatures.map((feature) => (
            <a
              key={feature.name}
              href={feature.href}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${
                  stat.color === "green"
                    ? "bg-green-100"
                    : stat.color === "red"
                      ? "bg-red-100"
                      : stat.color === "yellow"
                        ? "bg-yellow-100"
                        : "bg-purple-100"
                }`}
              >
                <stat.icon
                  className={`h-4 w-4 ${
                    stat.color === "green"
                      ? "text-green-600"
                      : stat.color === "red"
                        ? "text-red-600"
                        : stat.color === "yellow"
                          ? "text-yellow-600"
                          : "text-purple-600"
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Class-wise Attendance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Today's Attendance - {selectedDate}</CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearSearch}>
                Clear
              </Button>
            )}
            <Button variant="ghost" size="sm">
              Mark All Present
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by class... (Press / to focus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Class</th>
                  <th className="pb-3 font-medium">Total Students</th>
                  <th className="pb-3 font-medium">Present</th>
                  <th className="pb-3 font-medium">Absent</th>
                  <th className="pb-3 font-medium">Attendance %</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      {hasActiveFilters ? "No classes found" : "No attendance data"}
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((row) => (
                  <tr key={row.class} className="border-b last:border-0">
                    <td className="py-3 font-medium">{row.class}</td>
                    <td className="py-3">{row.total}</td>
                    <td className="py-3 text-green-600 font-medium">
                      {row.present}
                    </td>
                    <td className="py-3 text-red-600 font-medium">
                      {row.absent}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${
                              parseFloat(row.percentage) >= 95
                                ? "bg-green-500"
                                : parseFloat(row.percentage) >= 90
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: row.percentage }}
                          />
                        </div>
                        <span className="text-sm">{row.percentage}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          parseFloat(row.percentage) >= 95
                            ? "success"
                            : parseFloat(row.percentage) >= 90
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {parseFloat(row.percentage) >= 95
                          ? "Excellent"
                          : parseFloat(row.percentage) >= 90
                            ? "Good"
                            : "Low"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Absences & Quick Actions Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Absences */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Absences</CardTitle>
            <div className="flex items-center gap-2">
              {hasAbsentFilters && (
                <Button variant="ghost" size="sm" onClick={clearAbsentSearch}>
                  Clear
                </Button>
              )}
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search absent students..."
                  value={absentSearchQuery}
                  onChange={(e) => setAbsentSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-4">
              {filteredAbsentStudents.length === 0 ? (
                <div className="text-center py-8">
                  <XCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {hasAbsentFilters ? "No students found" : "No absences recorded"}
                  </p>
                </div>
              ) : (
                filteredAbsentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-red-100">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {student.class} • {student.reason}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {student.date}
                    </p>
                    <Badge
                      variant={student.parentNotified ? "success" : "warning"}
                      className="mt-1"
                    >
                      {student.parentNotified ? "Notified" : "Pending"}
                    </Badge>
                  </div>
                </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Bulk Attendance</p>
                <p className="text-sm text-muted-foreground">
                  Mark all present/absent
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Individual Entry</p>
                <p className="text-sm text-muted-foreground">
                  Mark specific student
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-3 rounded-lg bg-yellow-100">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Send Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Auto-notify parents
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Generate Reports</p>
                <p className="text-sm text-muted-foreground">
                  Attendance statements
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { FileText } from "lucide-react";
