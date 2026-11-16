/**
 * Staff Attendance - Track teacher and staff daily attendance
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { exportToCSV } from "@/lib/export-utils";
import { useSearch } from "@/lib/search-utils";
import { useQuery } from "@tanstack/react-query";
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
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  todayStatus?: string;
  percentage?: number;
  present?: number;
  absent?: number;
  leave?: number;
  checkIn?: string;
  checkOut?: string;
  status?: string;
}

interface AttendanceData {
  attendance: StaffMember[];
}

export const Route = createFileRoute("/app/attendance/staff")({
  component: StaffAttendancePage,
});

const subFeatures = [
  { name: "Dashboard", href: "/app/attendance", icon: Calendar },
  { name: "Student Attendance", href: "/app/attendance/students", icon: Users },
  {
    name: "Staff Attendance",
    href: "/app/attendance/staff",
    icon: Users,
    active: true,
  },
  { name: "Reports", href: "/app/attendance/reports", icon: Calendar },
  { name: "Leave Requests", href: "/app/attendance/leave", icon: Clock },
  { name: "Alerts", href: "/app/attendance/alerts", icon: AlertTriangle },
];

const departmentOptions = ["All Departments"];

function mapDepartments(data: any[]) {
  const departments = new Set<string>();
  data.forEach((d) => {
    if (d.department) departments.add(d.department);
  });
  return ["All Departments", ...Array.from(departments).sort()];
}

function formatPercentage(value: number | undefined) {
  return value && Number.isFinite(value) ? value : 0;
}

function formatAttendanceStatus(value: string) {
  if (!value) return "Absent";
  return value;
}

function StaffAttendancePage() {
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const { data: attendanceData, isLoading } = useQuery<AttendanceData>({
    queryKey: ["staff-attendance"],
    queryFn: async () => {
      const data = await api.staff.getAttendance();
      return data as AttendanceData;
    },
  });

  const staffAttendance = attendanceData?.attendance || [];
  const departments = attendanceData
    ? mapDepartments(staffAttendance)
    : departmentOptions;

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredStaff,
    hasActiveFilters,
    clearSearch,
  } = useSearch<StaffMember>({
    data: staffAttendance,
    searchFields: ["name", "id", "designation", "department"],
    searchQuery: "",
  });

  const filteredByDept =
    selectedDepartment === "All Departments"
      ? filteredStaff
      : filteredStaff.filter((s) => s.department === selectedDepartment);

  const presentToday = filteredByDept.filter(
    (s) => s.todayStatus === "Present",
  ).length;
  const onLeaveToday = filteredByDept.filter(
    (s) => s.todayStatus === "On Leave",
  ).length;

  const avgAttendance =
    filteredByDept.length > 0
      ? Math.round(
          filteredByDept.reduce(
            (sum, s) => sum + formatPercentage(s.percentage),
            0,
          ) / filteredByDept.length,
        )
      : 0;

  const handleExport = () => {
    const exportData = filteredByDept.map((s) => ({
      "Employee ID": s.id,
      Name: s.name,
      Designation: s.designation,
      Department: s.department,
      Present: s.present,
      Absent: s.absent,
      Leave: s.leave,
      Percentage: `${s.percentage}%`,
      Status: s.status,
      "Today's Status": s.todayStatus,
    }));

    exportToCSV(exportData, `staff-attendance-${selectedDate}`);
    toast.success("Staff attendance exported");
  };

  const handleMarkAttendance = () => {
    toast.success("Attendance marking mode activated");
  };

  const stats = [
    {
      title: "Total Staff",
      value: filteredByDept.length.toString(),
      change: "All departments",
      icon: Users,
      color: "blue",
    },
    {
      title: "Present Today",
      value: presentToday.toString(),
      change: "Checked in",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "On Leave",
      value: onLeaveToday.toString(),
      change: "Approved leave",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Avg Attendance",
      value: `${avgAttendance}%`,
      change: "This month",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Staff Attendance
          </h1>
          <p className="text-muted-foreground">
            Track teacher and staff daily attendance and records.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleMarkAttendance}>
            <Plus className="mr-2 h-4 w-4" />
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
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="flex h-10 w-[180px] items-center justify-between rounded-lg border border-input bg-card px-3 py-2 text-sm"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
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

      {/* Staff Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-muted-foreground text-sm">
                  <th className="pb-3 font-medium">Employee ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Designation</th>
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Present</th>
                  <th className="pb-3 font-medium">Absent</th>
                  <th className="pb-3 font-medium">Leave</th>
                  <th className="pb-3 font-medium">Percentage</th>
                  <th className="pb-3 font-medium">Today's Status</th>
                  <th className="pb-3 font-medium">Check In</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredByDept.map((staff) => (
                  <tr key={staff.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{staff.id}</td>
                    <td className="py-3 font-medium">{staff.name}</td>
                    <td className="py-3 text-sm">{staff.designation}</td>
                    <td className="py-3 text-sm">{staff.department}</td>
                    <td className="py-3 font-medium text-sm text-success">
                      {staff.present}
                    </td>
                    <td className="py-3 font-medium text-destructive text-sm">
                      {staff.absent}
                    </td>
                    <td className="py-3 text-primary text-sm">{staff.leave}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          (staff.percentage || 0) >= 95
                            ? "success"
                            : (staff.percentage || 0) >= 90
                              ? "default"
                              : "warning"
                        }
                      >
                        {staff.percentage || 0}%
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          staff.todayStatus === "Present"
                            ? "success"
                            : staff.todayStatus === "On Leave"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {staff.todayStatus}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm">{staff.checkIn}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
