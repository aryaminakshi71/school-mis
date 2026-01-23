/**
 * Student Management - Complete Module
 * All sub-features for student lifecycle management
 */

import { createFileRoute, Link } from "@tanstack/react-router";
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
const students = [
  {
    id: "STU001",
    name: "Aryan Sharma",
    class: "Class 10-A",
    rollNo: "15",
    father: "Rajesh Sharma",
    phone: "+91 98765 43210",
    email: "aryan@email.com",
    attendance: "95%",
    status: "Active",
    fees: "Paid",
  },
  {
    id: "STU002",
    name: "Priya Patel",
    class: "Class 9-B",
    rollNo: "22",
    father: "Suresh Patel",
    phone: "+91 98765 43211",
    email: "priya@email.com",
    attendance: "92%",
    status: "Active",
    fees: "Pending",
  },
  {
    id: "STU003",
    name: "Rahul Singh",
    class: "Class 11-A",
    rollNo: "08",
    father: "Amit Singh",
    phone: "+91 98765 43212",
    email: "rahul@email.com",
    attendance: "88%",
    status: "Active",
    fees: "Paid",
  },
  {
    id: "STU004",
    name: "Ananya Gupta",
    class: "Class 8-A",
    rollNo: "31",
    father: "Ravi Gupta",
    phone: "+91 98765 43213",
    email: "ananya@email.com",
    attendance: "97%",
    status: "Active",
    fees: "Paid",
  },
  {
    id: "STU005",
    name: "Vikram Kumar",
    class: "Class 12-B",
    rollNo: "45",
    father: "Sanjay Kumar",
    phone: "+91 98765 43214",
    email: "vikram@email.com",
    attendance: "91%",
    status: "Active",
    fees: "Overdue",
  },
];

const stats = [
  {
    title: "Total Students",
    value: "1,247",
    change: "+12%",
    icon: Users,
    color: "blue",
  },
  {
    title: "New Admissions (Month)",
    value: "45",
    change: "+8",
    icon: UserPlus,
    color: "green",
  },
  {
    title: "Avg Attendance",
    value: "94.2%",
    change: "+2.1%",
    icon: Calendar,
    color: "purple",
  },
  {
    title: "Fee Defaulters",
    value: "23",
    change: "-5",
    icon: AlertCircle,
    color: "red",
  },
];

function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
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
                  stat.color === "blue"
                    ? "bg-blue-100"
                    : stat.color === "green"
                      ? "bg-green-100"
                      : stat.color === "purple"
                        ? "bg-purple-100"
                        : "bg-red-100"
                }`}
              >
                <stat.icon
                  className={`h-4 w-4 ${
                    stat.color === "blue"
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
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[300px]"
            />
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
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
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
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{student.id}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{student.class}</td>
                    <td className="py-3 text-sm">{student.rollNo}</td>
                    <td className="py-3 text-sm">{student.father}</td>
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
                          parseFloat(student.attendance) >= 95
                            ? "success"
                            : parseFloat(student.attendance) >= 90
                              ? "default"
                              : "warning"
                        }
                      >
                        {student.attendance}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          student.fees === "Paid"
                            ? "success"
                            : student.fees === "Pending"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {student.fees}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline">{student.status}</Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
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

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1-{filteredStudents.length} of {students.length} students
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
        </CardContent>
      </Card>

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
