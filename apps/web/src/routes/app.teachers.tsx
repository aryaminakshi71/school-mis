/**
 * Staff/Teachers Management - Complete Module
 * All sub-features for staff management including recruitment, payroll, etc.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  GraduationCap,
  UserPlus,
  DollarSign,
  Calendar,
  Award,
  Users,
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
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/teachers")({
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

// Mock data
const staff = [
  {
    id: "STF001",
    name: "Dr. Rajesh Kumar",
    role: "Senior Teacher",
    department: "Mathematics",
    qualification: "M.Sc, B.Ed",
    phone: "+91 98765 43210",
    email: "rajesh@school.edu",
    salary: "₹65,000",
    attendance: "98%",
    status: "Active",
  },
  {
    id: "STF002",
    name: "Mrs. Priya Sharma",
    role: "Teacher",
    department: "Science",
    qualification: "M.Sc, B.Ed",
    phone: "+91 98765 43211",
    email: "priya@school.edu",
    salary: "₹55,000",
    attendance: "95%",
    status: "Active",
  },
  {
    id: "STF003",
    name: "Mr. Amit Singh",
    role: "Physical Education",
    department: "Sports",
    qualification: "M.P.Ed",
    phone: "+91 98765 43212",
    email: "amit@school.edu",
    salary: "₹45,000",
    attendance: "92%",
    status: "Active",
  },
  {
    id: "STF004",
    name: "Ms. Ananya Gupta",
    role: "Junior Teacher",
    department: "English",
    qualification: "M.A, B.Ed",
    phone: "+91 98765 43213",
    email: "ananya@school.edu",
    salary: "₹40,000",
    attendance: "97%",
    status: "Active",
  },
  {
    id: "STF005",
    name: "Mr. Vikram Patel",
    role: "Lab Assistant",
    department: "Science",
    qualification: "M.Sc",
    phone: "+91 98765 43214",
    email: "vikram@school.edu",
    salary: "₹35,000",
    attendance: "88%",
    status: "On Leave",
  },
];

const stats = [
  {
    title: "Total Staff",
    value: "86",
    change: "+3",
    icon: Users,
    color: "blue",
  },
  {
    title: "Teaching Staff",
    value: "62",
    change: "+2",
    icon: GraduationCap,
    color: "green",
  },
  {
    title: "Monthly Payroll",
    value: "₹42.5L",
    change: "+₹1.2L",
    icon: DollarSign,
    color: "yellow",
  },
  {
    title: "Avg Attendance",
    value: "95.8%",
    change: "+1.2%",
    icon: Calendar,
    color: "purple",
  },
];

function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Staff Management
          </h1>
          <p className="text-muted-foreground">
            Manage all staff - recruitment, payroll, attendance, performance,
            and training.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
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
                      : stat.color === "yellow"
                        ? "bg-yellow-100"
                        : "bg-purple-100"
                }`}
              >
                <stat.icon
                  className={`h-4 w-4 ${
                    stat.color === "blue"
                      ? "text-blue-600"
                      : stat.color === "green"
                        ? "text-green-600"
                        : stat.color === "yellow"
                          ? "text-yellow-600"
                          : "text-purple-600"
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last
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
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[300px]"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="flex h-10 w-[180px] items-center justify-between rounded-lg border border-input bg-white px-3 py-2 text-sm"
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
          <CardTitle>Staff List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
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
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{member.id}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{member.role}</td>
                    <td className="py-3 text-sm">{member.department}</td>
                    <td className="py-3 text-sm">{member.qualification}</td>
                    <td className="py-3 text-sm">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          {member.phone}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {member.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-sm font-medium">
                      {member.salary}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          parseFloat(member.attendance) >= 95
                            ? "success"
                            : parseFloat(member.attendance) >= 90
                              ? "default"
                              : "warning"
                        }
                      >
                        {member.attendance}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          member.status === "Active" ? "success" : "outline"
                        }
                      >
                        {member.status}
                      </Badge>
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
                          <DollarSign className="h-4 w-4" />
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

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-green-100">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Recruitment</p>
              <p className="text-sm text-muted-foreground">
                Post job, shortlist
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-yellow-100">
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">Generate Payslip</p>
              <p className="text-sm text-muted-foreground">Monthly payroll</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Leave Approval</p>
              <p className="text-sm text-muted-foreground">Pending requests</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Performance Review</p>
              <p className="text-sm text-muted-foreground">Appraisal form</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
