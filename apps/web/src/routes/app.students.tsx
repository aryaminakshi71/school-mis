/**
 * Student Management - Complete Module
 * All sub-features for student lifecycle management
 */

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import {
  Users,
  UserPlus,
  FileText,
  Calendar,
  Award,
  AlertCircle,
  GraduationCap,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Eye,
  Edit,
  Trash,
  Mail,
  Phone,
  MapPin,
  Building,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearch, useDebounce } from "@/lib/search-utils";
import { exportToCSV, exportToExcel } from "@/lib/export-utils";
import { useListPageShortcuts } from "@/lib/keyboard-shortcuts";
import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { handleError } from "@/lib/error-handler";

export const Route = createFileRoute("/app/students")({
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

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      try {
        return await api.students.list();
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
  } = useSearch({
    data: students,
    searchFields: ["firstName", "lastName", "admissionNumber", "className", "email", "phone"],
    searchQuery: "",
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Apply class filter
  const finalFilteredStudents = selectedClass === "all"
    ? filteredStudents
    : filteredStudents.filter((s) => s.className === selectedClass);

  // Keyboard shortcuts
  useListPageShortcuts(
    () => navigate({ to: "/app/students", search: { action: "new" } }),
    () => window.location.reload(),
    () => handleExport()
  );

  // Export functionality
  const handleExport = () => {
    try {
      const exportData = finalFilteredStudents.map((s) => ({
        "Admission Number": s.admissionNumber,
        "First Name": s.firstName,
        "Last Name": s.lastName,
        "Class": s.className,
        "Roll Number": s.rollNumber,
        "Email": s.email || "",
        "Phone": s.phone || "",
        "Father Name": s.fatherName || "",
        "Attendance": `${s.attendance}%`,
        "Status": s.status,
      }));

      exportToCSV(exportData, `students-export-${new Date().toISOString().split("T")[0]}`, {
        "Admission Number": "Admission Number",
        "First Name": "First Name",
        "Last Name": "Last Name",
        "Class": "Class",
        "Roll Number": "Roll Number",
        "Email": "Email",
        "Phone": "Phone",
        "Father Name": "Father Name",
        "Attendance": "Attendance %",
        "Status": "Status",
      });
      toast.success("Students exported successfully");
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Students</h3>
              <p className="text-sm text-gray-600 mb-4">{handleError(error)}</p>
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
      value: Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / (students.length || 1)) + "%",
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
          <h1 className="text-3xl font-bold tracking-tight">
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
          <Button onClick={() => navigate({ to: "/app/students", search: { action: "new" } })}>
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
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${feature.active
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
                className={`p-2 rounded-lg ${stat.color === "blue"
                  ? "bg-blue-100"
                  : stat.color === "green"
                    ? "bg-green-100"
                    : stat.color === "purple"
                      ? "bg-purple-100"
                      : "bg-red-100"
                  }`}
              >
                <stat.icon
                  className={`h-4 w-4 ${stat.color === "blue"
                    ? "text-blue-600"
                    : stat.color === "green"
                      ? "text-green-600"
                      : stat.color === "purple"
                        ? "text-purple-600"
                        : "text-red-600"
                    }`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
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
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students... (Press / to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[300px]"
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="flex h-10 w-[150px] items-center justify-between rounded-lg border border-input bg-white px-3 py-2 text-sm"
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
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {hasActiveFilters ? "No students found" : "No students yet"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first student"}
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" onClick={clearSearch}>
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => navigate({ to: "/app/students", search: { action: "new" } })}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add First Student
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
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
                    <td className="py-3 text-sm">{student.admissionNumber}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/app/students/${student.id}`} className="flex items-center gap-2 hover:underline">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                          <span className="font-medium">{student.firstName} {student.lastName}</span>
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{student.className}</td>
                    <td className="py-3 text-sm">{student.rollNumber}</td>
                    <td className="py-3 text-sm">{student.fatherName}</td>
                    <td className="py-3 text-sm">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          {student.phone}
                        </span>
                        <span className="text-xs text-muted-foreground">
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
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing 1-{finalFilteredStudents.length} of {students.length} students
                {hasActiveFilters && ` (filtered from ${students.length} total)`}
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
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-green-100">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Quick Admission</p>
              <p className="text-sm text-muted-foreground">
                Enroll new student
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Generate TC</p>
              <p className="text-sm text-muted-foreground">
                Transfer certificate
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <GraduationCap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Generate ID Cards</p>
              <p className="text-sm text-muted-foreground">Print student IDs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
