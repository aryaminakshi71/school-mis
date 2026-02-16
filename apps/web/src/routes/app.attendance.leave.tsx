/**
 * Attendance Leave Management - Handle leave requests for students and staff
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
  Eye,
  FileText,
  Filter,
  Plus,
  Search,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/attendance/leave")({
  component: AttendanceLeavePage,
});

const subFeatures = [
  { name: "Dashboard", href: "/app/attendance", icon: Calendar },
  { name: "Student Attendance", href: "/app/attendance/students", icon: Users },
  { name: "Staff Attendance", href: "/app/attendance/staff", icon: Users },
  { name: "Reports", href: "/app/attendance/reports", icon: FileText },
  {
    name: "Leave Requests",
    href: "/app/attendance/leave",
    icon: Clock,
    active: true,
  },
  { name: "Alerts", href: "/app/attendance/alerts", icon: AlertTriangle },
];

// Mock data for leave requests
const leaveRequests = [
  {
    id: "LR-001",
    type: "student",
    name: "Aarav Sharma",
    class: "10-A",
    leaveType: "Sick Leave",
    from: "2026-01-30",
    to: "2026-01-31",
    days: 2,
    reason: "Fever and cold",
    status: "pending",
    appliedOn: "2026-01-28",
  },
  {
    id: "LR-002",
    type: "student",
    name: "Priya Patel",
    class: "10-A",
    leaveType: "Family Function",
    from: "2026-02-01",
    to: "2026-02-02",
    days: 2,
    reason: "Sister's wedding",
    status: "approved",
    appliedOn: "2026-01-27",
  },
  {
    id: "LR-003",
    type: "staff",
    name: "Ramesh Kumar",
    department: "Mathematics",
    leaveType: "Casual Leave",
    from: "2026-01-30",
    to: "2026-01-30",
    days: 1,
    reason: "Personal work",
    status: "pending",
    appliedOn: "2026-01-28",
  },
  {
    id: "LR-004",
    type: "student",
    name: "Ananya Gupta",
    class: "10-B",
    leaveType: "Medical",
    from: "2026-01-25",
    to: "2026-01-27",
    days: 3,
    reason: "Dental surgery",
    status: "approved",
    appliedOn: "2026-01-23",
  },
  {
    id: "LR-005",
    type: "staff",
    name: "Priya Sharma",
    department: "Science",
    leaveType: "Earned Leave",
    from: "2026-02-05",
    to: "2026-02-07",
    days: 3,
    reason: "Vacation",
    status: "pending",
    appliedOn: "2026-01-26",
  },
];

function AttendanceLeavePage() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredRequests,
    hasActiveFilters,
    clearSearch,
  } = useSearch({
    data: leaveRequests,
    searchFields: ["name", "id", "reason", "class", "department"],
    searchQuery: "",
  });

  const filteredByType =
    selectedType === "all"
      ? filteredRequests
      : filteredRequests.filter((r) => r.type === selectedType);

  const filteredByStatus =
    selectedStatus === "all"
      ? filteredByType
      : filteredByType.filter((r) => r.status === selectedStatus);

  const pendingCount = filteredRequests.filter(
    (r) => r.status === "pending",
  ).length;
  const studentRequests = filteredRequests.filter(
    (r) => r.type === "student",
  ).length;
  const staffRequests = filteredRequests.filter(
    (r) => r.type === "staff",
  ).length;

  const handleApprove = (id: string) => {
    toast.success(`Leave request ${id} approved`);
  };

  const handleReject = (id: string) => {
    toast.success(`Leave request ${id} rejected`);
  };

  const handleExport = () => {
    const exportData = filteredByStatus.map((r) => ({
      "Request ID": r.id,
      Type: r.type,
      Name: r.name,
      "Class/Dept": r.class || r.department,
      "Leave Type": r.leaveType,
      From: r.from,
      To: r.to,
      Days: r.days,
      Reason: r.reason,
      Status: r.status,
    }));

    exportToCSV(
      exportData,
      `leave-requests-${new Date().toISOString().split("T")[0]}`,
    );
    toast.success("Leave requests exported");
  };

  const stats = [
    {
      title: "Pending Requests",
      value: pendingCount.toString(),
      change: "Need approval",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Student Requests",
      value: studentRequests.toString(),
      change: "This month",
      icon: Users,
      color: "blue",
    },
    {
      title: "Staff Requests",
      value: staffRequests.toString(),
      change: "This month",
      icon: Users,
      color: "green",
    },
    {
      title: "Approved Today",
      value: "12",
      change: "Processed",
      icon: CheckCircle,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Leave Requests</h1>
          <p className="text-muted-foreground">
            Manage and approve leave requests from students and staff.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Request
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
              placeholder="Search requests..."
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
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="flex h-10 w-[130px] items-center justify-between rounded-lg border border-input bg-card px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            <option value="student">Students</option>
            <option value="staff">Staff</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex h-10 w-[130px] items-center justify-between rounded-lg border border-input bg-card px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-muted-foreground text-sm">
                  <th className="pb-3 font-medium">Request ID</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Class/Dept</th>
                  <th className="pb-3 font-medium">Leave Type</th>
                  <th className="pb-3 font-medium">From - To</th>
                  <th className="pb-3 font-medium">Days</th>
                  <th className="pb-3 font-medium">Reason</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredByStatus.map((request) => (
                  <tr key={request.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{request.id}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          request.type === "student" ? "default" : "outline"
                        }
                      >
                        {request.type}
                      </Badge>
                    </td>
                    <td className="py-3 font-medium">{request.name}</td>
                    <td className="py-3 text-sm">
                      {request.class || request.department}
                    </td>
                    <td className="py-3 text-sm">{request.leaveType}</td>
                    <td className="py-3 text-sm">
                      {request.from} <br />
                      <span className="text-muted-foreground">
                        to {request.to}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-sm">{request.days}</td>
                    <td className="py-3 text-sm">{request.reason}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          request.status === "approved"
                            ? "success"
                            : request.status === "pending"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {request.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-success"
                              onClick={() => handleApprove(request.id)}
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleReject(request.id)}
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
