/**
 * Student Management - Complete Module
 * All sub-features for student lifecycle management
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { SkeletonTable } from "@/components/ui/skeleton";
import { type Student, api } from "@/lib/api";
import { handleError } from "@/lib/error-handler";
import { exportToCSV } from "@/lib/export-utils";
import { useListPageShortcuts } from "@/lib/keyboard-shortcuts";
import { useDebounce, useSearch } from "@/lib/search-utils";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  MoreVertical,
  Search,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/students/")({
  component: StudentsPage,
});

// Sub-features navigation
const subFeatures = [
  { name: "All Students", href: "/app/students", icon: Users, active: true },
  { name: "Admission", href: "/app/students/admission", icon: UserPlus },
  { name: "Attendance", href: "/app/students/attendance", icon: Calendar },
  { name: "Performance", href: "/app/students/performance", icon: TrendingUp },
  { name: "Discipline", href: "/app/students/discipline", icon: AlertCircle },
  { name: "Transfer TC", href: "/app/students/transfer", icon: FileText },
  { name: "Alumni", href: "/app/students/alumni", icon: GraduationCap },
];

// Mock data
// Mock data removed in favor of api.students.list()

function StudentsPage() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("all");
  const { confirm, dialog } = useConfirmDialog();

  const {
    data: students = [],
    isLoading,
    error,
  } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      try {
        const data = await api.students.list();
        return data as Student[];
      } catch (err) {
        const message = handleError(err);
        toast.error(message);
        throw err;
      }
    },
  });

  // Enhanced search with useSearch hook
  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredStudents,
    hasActiveFilters,
    clearSearch,
  } = useSearch<Student>({
    data: students,
    searchFields: [
      "firstName",
      "lastName",
      "admissionNumber",
      "className",
      "email",
      "phone",
    ],
    searchQuery: "",
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Apply class filter
  const finalFilteredStudents =
    selectedClass === "all"
      ? filteredStudents
      : filteredStudents.filter((s) => s.className === selectedClass);

  // Keyboard shortcuts
  useListPageShortcuts(
    () => navigate({ to: "/app/students", search: { action: "new" } }),
    () => window.location.reload(),
    () => handleExport(),
  );

  // Export functionality
  const handleExport = () => {
    try {
      const exportData = finalFilteredStudents.map((s) => ({
        "Admission Number": s.admissionNumber,
        "First Name": s.firstName,
        "Last Name": s.lastName,
        Class: s.className,
        "Roll Number": s.rollNumber,
        Email: s.email || "",
        Phone: s.phone || "",
        "Father Name": s.fatherName || "",
        Attendance: `${s.attendance}%`,
        Status: s.status,
      }));

      exportToCSV(
        exportData,
        `students-export-${new Date().toISOString().split("T")[0]}`,
        {
          "Admission Number": "Admission Number",
          "First Name": "First Name",
          "Last Name": "Last Name",
          Class: "Class",
          "Roll Number": "Roll Number",
          Email: "Email",
          Phone: "Phone",
          "Father Name": "Father Name",
          Attendance: "Attendance %",
          Status: "Status",
        },
      );
      toast.success("Students exported successfully");
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
                Error Loading Students
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
      title: "Total Students",
      value: students.length.toString(),
      change: "+12%",
      icon: Users,
      color: "blue",
    },
    {
      title: "New Admissions (Month)",
      value: "5",
      change: "+2",
      icon: UserPlus,
      color: "green",
    },
    {
      title: "Avg Attendance",
      value:
        Math.round(
          students.reduce((acc, s) => acc + (Number(s.attendance) || 0), 0) /
            (students.length || 1),
        ) + "%",
      change: "+2.1%",
      icon: Calendar,
      color: "purple",
    },
    {
      title: "Fee Defaulters",
      value: "2",
      change: "-1",
      icon: AlertCircle,
      color: "red",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Student Management
          </h1>
          <p className="text-muted-foreground">
            Manage all student-related operations - admission, attendance,
            performance, and more.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading || finalFilteredStudents.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export ({finalFilteredStudents.length})
          </Button>
          <Button
            onClick={() =>
              navigate({ to: "/app/students", search: { action: "new" } })
            }
          >
            <UserPlus className="mr-2 h-4 w-4" />
            New Admission
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
                      : stat.color === "purple"
                        ? "bg-primary/10"
                        : "bg-destructive/10"
                }`}
              >
                <stat.icon
                  className={`h-4 w-4 ${
                    stat.color === "blue"
                      ? "text-primary"
                      : stat.color === "green"
                        ? "text-success"
                        : stat.color === "purple"
                          ? "text-primary"
                          : "text-destructive"
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stat.value}</div>
              <p className="text-muted-foreground text-xs">
                <span
                  className={
                    stat.change.startsWith("+")
                      ? "text-success"
                      : "text-destructive"
                  }
                >
                  {stat.change}
                </span>{" "}
                from last month
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
              placeholder="Search students... (Press / to focus)"
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
            <option value="all">All Classes</option>
            <option value="10-A">Class 10-A</option>
            <option value="9-B">Class 9-B</option>
            <option value="11-A">Class 11-A</option>
          </select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student List</CardTitle>
            {hasActiveFilters && (
              <Badge variant="outline" className="text-xs">
                {finalFilteredStudents.length} of {students.length} students
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonTable rows={5} cols={10} />
          ) : finalFilteredStudents.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">
                {hasActiveFilters ? "No students found" : "No students yet"}
              </h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {hasActiveFilters
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first student"}
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" onClick={clearSearch}>
                  Clear Filters
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    navigate({ to: "/app/students", search: { action: "new" } })
                  }
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add First Student
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-muted-foreground text-sm">
                    <th className="pb-3 font-medium">Student ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Class</th>
                    <th className="pb-3 font-medium">Roll No</th>
                    <th className="pb-3 font-medium">Father's Name</th>
                    <th className="pb-3 font-medium">Contact</th>
                    <th className="pb-3 font-medium">Attendance</th>
                    <th className="pb-3 font-medium">Fees</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {finalFilteredStudents.map((student) => (
                    <tr key={student.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">
                        {student.admissionNumber}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/app/students/${student.id}`}
                            className="flex items-center gap-2 hover:underline"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <span className="font-medium text-primary text-xs">
                                {student.firstName[0]}
                                {student.lastName[0]}
                              </span>
                            </div>
                            <span className="font-medium">
                              {student.firstName} {student.lastName}
                            </span>
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 text-sm">{student.className}</td>
                      <td className="py-3 text-sm">{student.rollNumber}</td>
                      <td className="py-3 text-sm">{student.fatherName}</td>
                      <td className="py-3 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            {student.phone}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {student.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            student.attendance >= 95
                              ? "success"
                              : student.attendance >= 90
                                ? "default"
                                : "warning"
                          }
                        >
                          {student.attendance}%
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant="success">Paid</Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant="outline">{student.status}</Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Link to={`/app/students/${student.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
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
                            <MoreVertical className="h-4 w-4" />
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
          {!isLoading && finalFilteredStudents.length > 0 && (
            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-muted-foreground text-sm">
                Showing 1-{finalFilteredStudents.length} of {students.length}{" "}
                students
                {hasActiveFilters &&
                  ` (filtered from ${students.length} total)`}
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-success/15 p-3">
              <UserPlus className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium">Quick Admission</p>
              <p className="text-muted-foreground text-sm">
                Enroll new student
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Generate TC</p>
              <p className="text-muted-foreground text-sm">
                Transfer certificate
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Generate ID Cards</p>
              <p className="text-muted-foreground text-sm">Print student IDs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
