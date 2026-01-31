/**
 * Staff Attendance - Track teacher and staff daily attendance
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  Filter,
  TrendingUp,
  AlertTriangle,
  Eye,
  Edit,
  Mail,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/lib/search-utils";
import { exportToCSV } from "@/lib/export-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/attendance/staff")({
  component: StaffAttendancePage,
});

const subFeatures = [
  { name: "Dashboard", href: "/app/attendance", icon: Calendar },
  { name: "Student Attendance", href: "/app/attendance/students", icon: Users },
  { name: "Staff Attendance", href: "/app/attendance/staff", icon: Users, active: true },
  { name: "Reports", href: "/app/attendance/reports", icon: Calendar },
  { name: "Leave Requests", href: "/app/attendance/leave", icon: Clock },
  { name: "Alerts", href: "/app/attendance/alerts", icon: AlertTriangle },
];

// Mock data for staff attendance
const staffAttendance = [
  {
    id: "EMP-001",
    name: "Ramesh Kumar",
    designation: "Senior Teacher",
    department: "Mathematics",
    present: 23,
    absent: 1,
    leave: 1,
    percentage: 96,
    status: "regular",
    todayStatus: "Present",
    checkIn: "08:45 AM",
  },
  {
    id: "EMP-002",
    name: "Priya Sharma",
    designation: "Teacher",
    department: "Science",
    present: 24,
    absent: 0,
    leave: 1,
    percentage: 100,
    status: "excellent",
    todayStatus: "Present",
    checkIn: "08:30 AM",
  },
  {
    id: "EMP-003",
    name: "Amit Patel",
    designation: "Head of Department",
    department: "English",
    present: 22,
    absent: 2,
    leave: 1,
    percentage: 92,
    status: "regular",
    todayStatus: "Present",
    checkIn: "09:00 AM",
  },
  {
    id: "EMP-004",
    name: "Sneha Gupta",
    designation: "Teacher",
    department: "Mathematics",
    present: 20,
    absent: 3,
    leave: 2,
    percentage: 88,
    status: "warning",
    todayStatus: "On Leave",
    checkIn: "-",
  },
  {
    id: "EMP-005",
    name: "Vikram Singh",
    designation: "Physical Education",
    department: "Sports",
    present: 24,
    absent: 1,
    leave: 0,
    percentage: 98,
    status: "excellent",
    todayStatus: "Present",
    checkIn: "08:15 AM",
  },
];

const departmentOptions = ["All Departments", "Mathematics", "Science", "English", "Sports", "Administration"];

function StaffAttendancePage() {
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredStaff,
    hasActiveFilters,
    clearSearch,
  } = useSearch({
    data: staffAttendance,
    searchFields: ["name", "id", "designation", "department"],
    searchQuery: "",
  });

  const filteredByDept = selectedDepartment === "All Departments"
    ? filteredStaff
    : filteredStaff.filter((s) => s.department === selectedDepartment);

  const presentToday = filteredByDept.filter((s) => s.todayStatus === "Present").length;
  const onLeaveToday = filteredByDept.filter((s) => s.todayStatus === "On Leave").length;

  const handleExport = () => {
    const exportData = filteredByDept.map((s) => ({
      "Employee ID": s.id,
      "Name": s.name,
      "Designation": s.designation,
      "Department": s.department,
      "Present": s.present,
      "Absent": s.absent,
      "Leave": s.leave,
      "Percentage": `${s.percentage}%`,
      "Status": s.status,
      "Today's Status": s.todayStatus,
    }));

    exportToCSV(exportData, `staff-attendance-${selectedDate}`);
    toast.success("Staff attendance exported");
  };

  const handleMarkAttendance = () => {
    toast.success("Attendance marking mode activated");
  };

  const stats = [
    { title: "Total Staff", value: filteredByDept.length.toString(), change: "All departments", icon: Users, color: "blue" },
    { title: "Present Today", value: presentToday.toString(), change: "Checked in", icon: CheckCircle, color: "green" },
    { title: "On Leave", value: onLeaveToday.toString(), change: "Approved leave", icon: Clock, color: "yellow" },
    { title: "Avg Attendance", value: "94%", change: "This month", icon: TrendingUp, color: "purple" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Attendance</h1>
          <p className="text-muted-foreground">Track teacher and staff daily attendance and records.</p>
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[300px]"
            />
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs">
                Clear
              </Button>
            )}
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="flex h-10 w-[180px] items-center justify-between rounded-lg border border-input bg-white px-3 py-2 text-sm"
          >
            {departmentOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex h-10 w-[150px] items-center justify-between rounded-lg border border-input bg-white px-3 py-2 text-sm"
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
                <tr className="border-b text-left text-sm text-muted-foreground">
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
                    <td className="py-3 text-sm text-green-600 font-medium">{staff.present}</td>
                    <td className="py-3 text-sm text-red-600 font-medium">{staff.absent}</td>
                    <td className="py-3 text-sm text-blue-600">{staff.leave}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          staff.percentage >= 95
                            ? "success"
                            : staff.percentage >= 90
                            ? "default"
                            : "warning"
                        }
                      >
                        {staff.percentage}%
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={staff.todayStatus === "Present" ? "success" : staff.todayStatus === "On Leave" ? "default" : "destructive"}
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
