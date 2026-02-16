/**
 * Staff Attendance Management - Daily attendance, reports, leave tracking
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { exportToCSV } from "@/lib/export-utils";
import { useSearch } from "@/lib/search-utils";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  TrendingUp,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/teachers/attendance")({
  component: AttendancePage,
});

const subFeatures = [
  { name: "All Staff", href: "/app/teachers", icon: Users },
  { name: "Recruitment", href: "/app/teachers/recruitment", icon: UserPlus },
  { name: "Payroll", href: "/app/teachers/payroll", icon: DollarSign },
  {
    name: "Attendance",
    href: "/app/teachers/attendance",
    icon: Calendar,
    active: true,
  },
  { name: "Leave", href: "/app/teachers/leave", icon: Clock },
  { name: "Performance", href: "/app/teachers/performance", icon: Award },
  { name: "Training", href: "/app/teachers/training", icon: Award },
];

// Mock data for attendance records
const attendanceRecords = [
  {
    id: "EMP-001",
    name: "Ramesh Kumar",
    designation: "Senior Teacher",
    present: 22,
    absent: 1,
    leave: 2,
    total: 25,
    percentage: 96,
    status: "present",
    checkIn: "08:45 AM",
    checkOut: "04:15 PM",
  },
  {
    id: "EMP-002",
    name: "Priya Sharma",
    designation: "Teacher",
    present: 23,
    absent: 0,
    leave: 2,
    total: 25,
    percentage: 100,
    status: "present",
    checkIn: "08:30 AM",
    checkOut: "04:00 PM",
  },
  {
    id: "EMP-003",
    name: "Amit Patel",
    designation: "Head of Department",
    present: 21,
    absent: 2,
    leave: 2,
    total: 25,
    percentage: 92,
    status: "absent",
    checkIn: "-",
    checkOut: "-",
  },
  {
    id: "EMP-004",
    name: "Sneha Gupta",
    designation: "Teacher",
    present: 20,
    absent: 1,
    leave: 4,
    total: 25,
    percentage: 96,
    status: "on_leave",
    checkIn: "-",
    checkOut: "-",
  },
  {
    id: "EMP-005",
    name: "Vikram Singh",
    designation: "Teacher",
    present: 24,
    absent: 0,
    leave: 1,
    total: 25,
    percentage: 98,
    status: "present",
    checkIn: "08:15 AM",
    checkOut: "04:30 PM",
  },
];

// Daily attendance summary
const dailySummary = [
  { date: "2026-01-27", present: 45, absent: 3, leave: 2, late: 1 },
  { date: "2026-01-26", present: 46, absent: 2, leave: 3, late: 0 },
  { date: "2026-01-25", present: 47, absent: 1, leave: 2, late: 1 },
  { date: "2026-01-24", present: 48, absent: 0, leave: 2, late: 2 },
  { date: "2026-01-23", present: 45, absent: 2, leave: 3, late: 0 },
];

function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState("2026-01-27");
  const [viewMode, setViewMode] = useState("daily");

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredRecords,
    hasActiveFilters,
    clearSearch,
  } = useSearch({
    data: attendanceRecords,
    searchFields: ["name", "id", "designation"],
    searchQuery: "",
  });

  const presentCount = filteredRecords.filter(
    (r) => r.status === "present",
  ).length;
  const absentCount = filteredRecords.filter(
    (r) => r.status === "absent",
  ).length;
  const onLeaveCount = filteredRecords.filter(
    (r) => r.status === "on_leave",
  ).length;

  const handleMarkAllPresent = () => {
    toast.success("Marked all staff as present for today");
  };

  const handleExport = () => {
    const exportData = filteredRecords.map((r) => ({
      "Employee ID": r.id,
      Name: r.name,
      Designation: r.designation,
      "Present Days": r.present,
      "Absent Days": r.absent,
      "Leave Days": r.leave,
      "Total Days": r.total,
      Percentage: `${r.percentage}%`,
      Status: r.status,
    }));

    exportToCSV(exportData, `staff-attendance-${selectedDate}`);
    toast.success("Attendance data exported");
  };

  const stats = [
    {
      title: "Present Today",
      value: presentCount.toString(),
      change: "On duty",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Absent",
      value: absentCount.toString(),
      change: "Not reported",
      icon: XCircle,
      color: "red",
    },
    {
      title: "On Leave",
      value: onLeaveCount.toString(),
      change: "Approved leave",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Avg Attendance",
      value: "95%",
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
            Staff Attendance
          </h1>
          <p className="text-muted-foreground">
            Track daily attendance, view reports, and manage leave.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleMarkAllPresent}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All Present
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

      {/* Date Selector & View Mode */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setViewMode("daily")}
            className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
              viewMode === "daily"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setViewMode("monthly")}
            className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
              viewMode === "monthly"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly Summary
          </button>
          <button
            onClick={() => setViewMode("reports")}
            className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
              viewMode === "reports"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Reports
          </button>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex h-10 w-[180px] items-center justify-between rounded-lg border border-input bg-card px-3 py-2 text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search staff..."
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
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "daily" && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Attendance - {selectedDate}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-muted-foreground text-sm">
                    <th className="pb-3 font-medium">Employee ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Designation</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Check In</th>
                    <th className="pb-3 font-medium">Check Out</th>
                    <th className="pb-3 font-medium">Month %</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{record.id}</td>
                      <td className="py-3 font-medium">{record.name}</td>
                      <td className="py-3 text-sm">{record.designation}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            record.status === "present"
                              ? "success"
                              : record.status === "absent"
                                ? "destructive"
                                : "default"
                          }
                        >
                          {record.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm">{record.checkIn}</td>
                      <td className="py-3 text-sm">{record.checkOut}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            record.percentage >= 95
                              ? "success"
                              : record.percentage >= 90
                                ? "default"
                                : "warning"
                          }
                        >
                          {record.percentage}%
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Present
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            <XCircle className="mr-1 h-4 w-4" />
                            Absent
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
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
      )}

      {viewMode === "monthly" && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary - January 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-muted-foreground text-sm">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Present</th>
                    <th className="pb-3 font-medium">Absent</th>
                    <th className="pb-3 font-medium">On Leave</th>
                    <th className="pb-3 font-medium">Late</th>
                    <th className="pb-3 font-medium">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {dailySummary.map((day) => (
                    <tr key={day.date} className="border-b last:border-0">
                      <td className="py-3 text-sm">{day.date}</td>
                      <td className="py-3 font-medium text-sm text-success">
                        {day.present}
                      </td>
                      <td className="py-3 font-medium text-destructive text-sm">
                        {day.absent}
                      </td>
                      <td className="py-3 font-medium text-primary text-sm">
                        {day.leave}
                      </td>
                      <td className="py-3 font-medium text-sm text-warning">
                        {day.late}
                      </td>
                      <td className="py-3 text-sm">
                        {Math.round((day.present / 50) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "reports" && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Monthly Report</p>
                <p className="text-muted-foreground text-sm">Download PDF</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-success/15 p-3">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Attendance Trends</p>
                <p className="text-muted-foreground text-sm">View analytics</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-warning/15 p-3">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-medium">Low Attendance</p>
                <p className="text-muted-foreground text-sm">View alerts</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
