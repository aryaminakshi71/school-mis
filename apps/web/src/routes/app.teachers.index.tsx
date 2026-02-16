/**
 * Staff/Teachers Management - Complete Module
 * All sub-features for staff management including recruitment, payroll, etc.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { SkeletonTable } from "@/components/ui/skeleton";
import { type Teacher, api } from "@/lib/api";
import { handleError } from "@/lib/error-handler";
import { exportToCSV } from "@/lib/export-utils";
import { useListPageShortcuts } from "@/lib/keyboard-shortcuts";
import { useSearch } from "@/lib/search-utils";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Award,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  GraduationCap,
  Search,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/teachers/")({
  component: TeachersPage,
});

// Sub-features navigation
const subFeatures = [
  { name: "All Staff", href: "/app/teachers", icon: Users, active: true },
  { name: "Recruitment", href: "/app/teachers/recruitment", icon: UserPlus },
  { name: "Payroll", href: "/app/teachers/payroll", icon: DollarSign },
  { name: "Attendance", href: "/app/teachers/attendance", icon: Calendar },
  { name: "Leave", href: "/app/teachers/leave", icon: Clock },
  { name: "Performance", href: "/app/teachers/performance", icon: TrendingUp },
  { name: "Training", href: "/app/teachers/training", icon: Award },
];

// Mock data removed in favor of api.teachers.list()

function TeachersPage() {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const { confirm, dialog } = useConfirmDialog();

  const {
    data: staff = [],
    isLoading,
    error,
  } = useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: async () => {
      try {
        const data = await api.teachers.list();
        return data as Teacher[];
      } catch (err) {
        toast.error(handleError(err));
        throw err;
      }
    },
  });

  // Enhanced search with useSearch hook
  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredStaff,
    hasActiveFilters,
    clearSearch,
  } = useSearch<Teacher>({
    data: staff,
    searchFields: [
      "firstName",
      "lastName",
      "employeeId",
      "subject",
      "qualification",
      "email",
      "phone",
    ],
    searchQuery: "",
  });

  // Apply department filter
  const finalFilteredStaff =
    selectedDepartment === "all"
      ? filteredStaff
      : filteredStaff.filter(
          (s) => s.subject.toLowerCase() === selectedDepartment.toLowerCase(),
        );

  // Keyboard shortcuts
  useListPageShortcuts(
    () => navigate({ to: "/app/teachers", search: { action: "new" } }),
    () => window.location.reload(),
    () => handleExport(),
  );

  // Export functionality
  const handleExport = () => {
    try {
      const exportData = finalFilteredStaff.map((s) => ({
        "Employee ID": s.employeeId,
        "First Name": s.firstName,
        "Last Name": s.lastName,
        Subject: s.subject,
        Qualification: s.qualification || "",
        Email: s.email || "",
        Phone: s.phone || "",
        Salary: s.salary?.toString() || "",
        Attendance: `${s.attendance}%`,
        Status: s.status,
      }));

      exportToCSV(
        exportData,
        `staff-export-${new Date().toISOString().split("T")[0]}`,
      );
      toast.success("Staff exported successfully");
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
              <h3 className="mb-2 font-semibold text-lg">
                Error Loading Staff
              </h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {handleError(error)}
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Staff",
      value: staff.length.toString(),
      change: "+3",
      icon: Users,
      color: "blue",
    },
    {
      title: "Teaching Staff",
      value: staff.length.toString(),
      change: "+2",
      icon: GraduationCap,
      color: "green",
    },
    {
      title: "Monthly Payroll",
      value:
        "₹" +
        staff
          .reduce((sum, s) => sum + (Number(s.salary) || 0), 0)
          .toLocaleString(),
      change: "+₹1.2L",
      icon: DollarSign,
      color: "yellow",
    },
    {
      title: "Avg Attendance",
      value:
        Math.round(
          staff.reduce((sum, s) => sum + (Number(s.attendance) || 0), 0) /
            (staff.length || 1),
        ) + "%",
      change: "+1.2%",
      icon: Calendar,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Staff Management
          </h1>
          <p className="text-muted-foreground">
            Manage all staff - recruitment, payroll, attendance, performance,
            and training.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading || finalFilteredStaff.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export ({finalFilteredStaff.length})
          </Button>
          <Button
            onClick={() =>
              navigate({ to: "/app/teachers", search: { action: "new" } })
            }
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Sub-features Navigation */}
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {subFeatures.map((feature) => (
            <Link
              key={feature.name}
              to={feature.href}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
                feature.active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <feature.icon className="h-4 w-4" />
              {feature.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium text-sm">
                {stat.title}
              </CardTitle>
              <div
                className={`rounded-lg p-2 ${
                  stat.color === "blue"
                    ? "bg-primary/10"
                    : stat.color === "green"
                      ? "bg-success/15"
                      : stat.color === "yellow"
                        ? "bg-warning/15"
                        : "bg-primary/10"
                }`}
              >
                <stat.icon
                  className={`h-4 w-4 ${
                    stat.color === "blue"
                      ? "text-primary"
                      : stat.color === "green"
                        ? "text-success"
                        : stat.color === "yellow"
                          ? "text-warning"
                          : "text-primary"
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stat.value}</div>
              <p className="text-muted-foreground text-xs">
                <span className="text-success">{stat.change}</span> from last
                month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search staff... (Press / to focus)"
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
            <option value="all">All Departments</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
            <option value="english">English</option>
            <option value="sports">Sports</option>
          </select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Staff List</CardTitle>
            {hasActiveFilters && (
              <Badge variant="outline" className="text-xs">
                {finalFilteredStaff.length} of {staff.length} staff
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonTable rows={5} cols={10} />
          ) : finalFilteredStaff.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">
                {hasActiveFilters ? "No staff found" : "No staff yet"}
              </h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {hasActiveFilters
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first staff member"}
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" onClick={clearSearch}>
                  Clear Filters
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    navigate({ to: "/app/teachers", search: { action: "new" } })
                  }
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add First Staff
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-muted-foreground text-sm">
                    <th className="pb-3 font-medium">Staff ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Department</th>
                    <th className="pb-3 font-medium">Qualification</th>
                    <th className="pb-3 font-medium">Contact</th>
                    <th className="pb-3 font-medium">Salary</th>
                    <th className="pb-3 font-medium">Attendance</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {finalFilteredStaff.map((member) => (
                    <tr key={member.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{member.employeeId}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <span className="font-medium text-primary text-xs">
                              {member.firstName[0]}
                              {member.lastName[0]}
                            </span>
                          </div>
                          <span className="font-medium">
                            {member.firstName} {member.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-sm">Teacher</td>
                      <td className="py-3 text-sm">{member.subject}</td>
                      <td className="py-3 text-sm">{member.qualification}</td>
                      <td className="py-3 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            {member.phone}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {member.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 font-medium text-sm">
                        ₹{member.salary}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            member.attendance >= 95
                              ? "success"
                              : member.attendance >= 90
                                ? "default"
                                : "warning"
                          }
                        >
                          {member.attendance}%
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            member.status === "active" ? "success" : "outline"
                          }
                        >
                          {member.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && finalFilteredStaff.length > 0 && (
            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-muted-foreground text-sm">
                Showing 1-{finalFilteredStaff.length} of {staff.length} staff
                {hasActiveFilters && ` (filtered from ${staff.length} total)`}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {dialog}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-success/15 p-3">
              <UserPlus className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium">Recruitment</p>
              <p className="text-muted-foreground text-sm">
                Post job, shortlist
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-warning/15 p-3">
              <DollarSign className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="font-medium">Generate Payslip</p>
              <p className="text-muted-foreground text-sm">Monthly payroll</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Leave Approval</p>
              <p className="text-muted-foreground text-sm">Pending requests</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Performance Review</p>
              <p className="text-muted-foreground text-sm">Appraisal form</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
