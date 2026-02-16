/**
 * Staff Leave Management - Leave requests, approval workflow, leave balance
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { exportToCSV } from "@/lib/export-utils";
import { useSearch } from "@/lib/search-utils";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  Hourglass,
  Plus,
  Search,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/teachers/leave")({
  component: LeavePage,
});

const subFeatures = [
  { name: "All Staff", href: "/app/teachers", icon: Users },
  { name: "Recruitment", href: "/app/teachers/recruitment", icon: UserPlus },
  { name: "Payroll", href: "/app/teachers/payroll", icon: DollarSign },
  { name: "Attendance", href: "/app/teachers/attendance", icon: Calendar },
  { name: "Leave", href: "/app/teachers/leave", icon: Clock, active: true },
  { name: "Performance", href: "/app/teachers/performance", icon: Award },
  { name: "Training", href: "/app/teachers/training", icon: Award },
];

// Mock data for leave requests
const leaveRequests = [
  {
    id: "LR-001",
    employee: "Ramesh Kumar",
    employeeId: "EMP-001",
    designation: "Senior Teacher",
    type: "Casual Leave",
    from: "2026-01-30",
    to: "2026-01-31",
    days: 2,
    reason: "Family function",
    status: "pending",
    appliedOn: "2026-01-27",
  },
  {
    id: "LR-002",
    employee: "Priya Sharma",
    employeeId: "EMP-002",
    designation: "Teacher",
    type: "Sick Leave",
    from: "2026-01-28",
    to: "2026-01-29",
    days: 2,
    reason: "Medical emergency",
    status: "approved",
    appliedOn: "2026-01-26",
  },
  {
    id: "LR-003",
    employee: "Amit Patel",
    employeeId: "EMP-003",
    designation: "Head of Department",
    type: "Earned Leave",
    from: "2026-02-05",
    to: "2026-02-10",
    days: 6,
    reason: "Personal work",
    status: "pending",
    appliedOn: "2026-01-25",
  },
  {
    id: "LR-004",
    employee: "Sneha Gupta",
    employeeId: "EMP-004",
    designation: "Teacher",
    type: "Maternity Leave",
    from: "2026-02-01",
    to: "2026-04-30",
    days: 90,
    reason: "Childbirth",
    status: "approved",
    appliedOn: "2026-01-20",
  },
  {
    id: "LR-005",
    employee: "Vikram Singh",
    employeeId: "EMP-005",
    designation: "Teacher",
    type: "Casual Leave",
    from: "2026-01-29",
    to: "2026-01-29",
    days: 1,
    reason: "Bank work",
    status: "rejected",
    appliedOn: "2026-01-28",
  },
];

// Mock data for leave balance
const leaveBalance = [
  { employee: "Ramesh Kumar", casual: 8, sick: 10, earned: 15, total: 33 },
  { employee: "Priya Sharma", casual: 10, sick: 8, earned: 12, total: 30 },
  { employee: "Amit Patel", casual: 5, sick: 12, earned: 20, total: 37 },
  { employee: "Sneha Gupta", casual: 12, sick: 10, earned: 18, total: 40 },
];

function LeavePage() {
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredRequests,
    hasActiveFilters,
    clearSearch,
  } = useSearch({
    data: leaveRequests,
    searchFields: ["employee", "employeeId", "type", "reason"],
    searchQuery: "",
  });

  const filteredByStatus =
    selectedStatus === "all"
      ? filteredRequests
      : filteredRequests.filter((r) => r.status === selectedStatus);

  const pendingCount = filteredRequests.filter(
    (r) => r.status === "pending",
  ).length;
  const approvedCount = filteredRequests.filter(
    (r) => r.status === "approved",
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
      Employee: r.employee,
      Type: r.type,
      From: r.from,
      To: r.to,
      Days: r.days,
      Reason: r.reason,
      Status: r.status,
      "Applied On": r.appliedOn,
    }));

    exportToCSV(
      exportData,
      `leave-requests-${new Date().toISOString().split("T")[0]}`,
    );
    toast.success("Leave data exported");
  };

  const stats = [
    {
      title: "Pending Requests",
      value: pendingCount.toString(),
      change: "Need approval",
      icon: Hourglass,
      color: "yellow",
    },
    {
      title: "Approved Today",
      value: approvedCount.toString(),
      change: "Processed",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Avg Processing Time",
      value: "1.5 days",
      change: "Response time",
      icon: Clock,
      color: "blue",
    },
    {
      title: "Leave Utilization",
      value: "78%",
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
            Leave Management
          </h1>
          <p className="text-muted-foreground">
            Manage leave requests, track balances, and approve/reject
            applications.
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

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("requests")}
          className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "requests"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Leave Requests
        </button>
        <button
          onClick={() => setActiveTab("balance")}
          className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "balance"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Leave Balance
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "calendar"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Leave Calendar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {activeTab === "requests" && (
            <>
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex h-10 w-[150px] items-center justify-between rounded-lg border border-input bg-card px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </>
          )}
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "requests" && "Leave Requests"}
            {activeTab === "balance" && "Leave Balance Overview"}
            {activeTab === "calendar" && "Leave Calendar"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === "requests" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-muted-foreground text-sm">
                    <th className="pb-3 font-medium">Request ID</th>
                    <th className="pb-3 font-medium">Employee</th>
                    <th className="pb-3 font-medium">Leave Type</th>
                    <th className="pb-3 font-medium">From - To</th>
                    <th className="pb-3 font-medium">Days</th>
                    <th className="pb-3 font-medium">Reason</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Applied On</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredByStatus.map((request) => (
                    <tr key={request.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{request.id}</td>
                      <td className="py-3">
                        <div className="font-medium">{request.employee}</div>
                        <div className="text-muted-foreground text-xs">
                          {request.designation}
                        </div>
                      </td>
                      <td className="py-3 text-sm">{request.type}</td>
                      <td className="py-3 text-sm">
                        {request.from} <br />
                        <span className="text-muted-foreground">
                          to {request.to}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-sm">
                        {request.days}
                      </td>
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
                      <td className="py-3 text-sm">{request.appliedOn}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
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
          )}

          {activeTab === "balance" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-muted-foreground text-sm">
                    <th className="pb-3 font-medium">Employee</th>
                    <th className="pb-3 font-medium">Casual Leave</th>
                    <th className="pb-3 font-medium">Sick Leave</th>
                    <th className="pb-3 font-medium">Earned Leave</th>
                    <th className="pb-3 font-medium">Total Balance</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveBalance.map((balance) => (
                    <tr
                      key={balance.employee}
                      className="border-b last:border-0"
                    >
                      <td className="py-3 font-medium">{balance.employee}</td>
                      <td className="py-3 text-sm">{balance.casual} days</td>
                      <td className="py-3 text-sm">{balance.sick} days</td>
                      <td className="py-3 text-sm">{balance.earned} days</td>
                      <td className="py-3 font-medium text-sm">
                        {balance.total} days
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-1 h-4 w-4" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="py-12 text-center">
              <CalendarDays className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">Leave Calendar</h3>
              <p className="mb-4 text-muted-foreground text-sm">
                View all approved leaves in a calendar format. Plan resources
                accordingly.
              </p>
              <Button>
                <CalendarDays className="mr-2 h-4 w-4" />
                Open Calendar View
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
