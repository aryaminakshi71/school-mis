/**
 * Dashboard - Complete Overview with Data from API
 */

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  DollarSign,
  Bus,
  FileText,
  MessageSquare,
  Package,
  BarChart,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Plus,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

// All modules with sub-features
const allModules = [
  {
    name: "Students",
    icon: Users,
    color: "blue",
    href: "/app/students",
    count: "1,247",
    subFeatures: [
      "Admission",
      "Attendance",
      "Performance",
      "Discipline",
      "TC",
      "Alumni",
    ],
  },
  {
    name: "Staff",
    icon: GraduationCap,
    color: "purple",
    href: "/app/teachers",
    count: "86",
    subFeatures: [
      "Recruitment",
      "Payroll",
      "Attendance",
      "Leave",
      "Performance",
      "Training",
    ],
  },
  {
    name: "Classes",
    icon: BookOpen,
    color: "green",
    href: "/app/classes",
    count: "42",
    subFeatures: [
      "Sections",
      "Subjects",
      "Timetable",
      "Assignments",
      "Certificates",
    ],
  },
  {
    name: "Attendance",
    icon: Calendar,
    color: "orange",
    href: "/app/attendance",
    count: "94.2%",
    subFeatures: ["Daily", "Staff", "Reports", "Alerts", "Leave Management"],
  },
  {
    name: "Exams",
    icon: FileText,
    color: "red",
    href: "/app/exams",
    count: "12",
    subFeatures: [
      "Schedule",
      "Hall Allocation",
      "Marks Entry",
      "Results",
      "Report Cards",
    ],
  },
  {
    name: "Fees",
    icon: DollarSign,
    color: "yellow",
    href: "/app/fees",
    collection: "₹12.5L",
    subFeatures: [
      "Structure",
      "Collection",
      "Online Payment",
      "Expenses",
      "Salary",
      "Budget",
    ],
  },
  {
    name: "Library",
    icon: BookOpen,
    color: "indigo",
    href: "/app/library",
    books: "15,420",
    subFeatures: ["Books Catalog", "Issue/Return", "Fines", "Library Cards"],
  },
  {
    name: "Transport",
    icon: Bus,
    color: "pink",
    href: "/app/transport",
    vehicles: "12",
    subFeatures: [
      "Routes",
      "Vehicles",
      "Drivers",
      "GPS Tracking",
      "Allocation",
    ],
  },
  {
    name: "Notifications",
    icon: MessageSquare,
    color: "cyan",
    href: "/app/notifications",
    sent: "2,450",
    subFeatures: ["SMS", "WhatsApp", "Email", "Templates", "Scheduled"],
  },
  {
    name: "Parent Portal",
    icon: Users,
    color: "teal",
    href: "/app/parent-portal",
    active: "89%",
    subFeatures: [
      "Dashboard",
      "Attendance",
      "Fees",
      "Results",
      "Homework",
      "Chat",
    ],
  },
  {
    name: "Inventory",
    icon: Package,
    color: "amber",
    href: "/app/inventory",
    items: "2,340",
    subFeatures: ["Items", "Purchase", "Stock", "Issuance", "Reports"],
  },
  {
    name: "Reports",
    icon: BarChart,
    color: "rose",
    href: "/app/reports",
    type: "Analytics",
    subFeatures: ["Students", "Staff", "Financial", "Academic", "Custom"],
  },
];

const recentActivities = [
  {
    type: "admission",
    action: "New admission",
    name: "Aryan Sharma - Class 9-A",
    time: "10 min ago",
    icon: Users,
  },
  {
    type: "fee",
    action: "Fee collected",
    name: "₹45,500 from 23 students",
    time: "1 hour ago",
    icon: DollarSign,
  },
  {
    type: "exam",
    action: "Result published",
    name: "Class 10 - Science UT",
    time: "2 hours ago",
    icon: FileText,
  },
  {
    type: "attendance",
    action: "Attendance marked",
    name: "94.2% overall attendance",
    time: "3 hours ago",
    icon: Clock,
  },
  {
    type: "transport",
    action: "Route updated",
    name: "Route 5 - New stop added",
    time: "4 hours ago",
    icon: Bus,
  },
];

const upcomingEvents = [
  { title: "Class 10 Half-Yearly Exams", date: "Jan 25, 2026", type: "exam" },
  { title: "Parent-Teacher Meeting", date: "Jan 28, 2026", type: "meeting" },
  { title: "Annual Sports Day", date: "Feb 5, 2026", type: "event" },
  { title: "Fee Due Date", date: "Feb 10, 2026", type: "fee" },
];

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    todayAttendance: 0,
    monthlyFeeCollection: 0,
    pendingFeePayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.dashboard.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening at your school today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-300">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalStudents.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium">+12%</span> from last
              month
            </p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Attendance
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-100">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.todayAttendance}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium">+2.1%</span> from
              yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Fee Collection
            </CardTitle>
            <div className="p-2 rounded-lg bg-yellow-100">
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ₹{(stats.monthlyFeeCollection / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium">+₹2.3L</span> this
              week
            </p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Tasks
            </CardTitle>
            <div className="p-2 rounded-lg bg-red-100">
              <Clock className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.pendingFeePayments}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              5 urgent, 13 normal priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* All Modules Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          School Management Modules
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allModules.map((module) => (
            <a
              key={module.name}
              href={module.href}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 hover:shadow-lg hover:border-blue-200 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`p-3 rounded-lg ${
                    module.color === "blue"
                      ? "bg-blue-100"
                      : module.color === "purple"
                        ? "bg-purple-100"
                        : module.color === "green"
                          ? "bg-green-100"
                          : module.color === "orange"
                            ? "bg-orange-100"
                            : module.color === "red"
                              ? "bg-red-100"
                              : module.color === "yellow"
                                ? "bg-yellow-100"
                                : module.color === "indigo"
                                  ? "bg-indigo-100"
                                  : module.color === "pink"
                                    ? "bg-pink-100"
                                    : module.color === "cyan"
                                      ? "bg-cyan-100"
                                      : module.color === "teal"
                                        ? "bg-teal-100"
                                        : module.color === "amber"
                                          ? "bg-amber-100"
                                          : "bg-rose-100"
                  }`}
                >
                  <module.icon
                    className={`h-5 w-5 ${
                      module.color === "blue"
                        ? "text-blue-600"
                        : module.color === "purple"
                          ? "text-purple-600"
                          : module.color === "green"
                            ? "text-green-600"
                            : module.color === "orange"
                              ? "text-orange-600"
                              : module.color === "red"
                                ? "text-red-600"
                                : module.color === "yellow"
                                  ? "text-yellow-600"
                                  : module.color === "indigo"
                                    ? "text-indigo-600"
                                    : module.color === "pink"
                                      ? "text-pink-600"
                                      : module.color === "cyan"
                                        ? "text-cyan-600"
                                        : module.color === "teal"
                                          ? "text-teal-600"
                                          : module.color === "amber"
                                            ? "text-amber-600"
                                            : "text-rose-600"
                    }`}
                  />
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {module.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {module.count ||
                  module.collection ||
                  module.books ||
                  module.vehicles ||
                  module.sent ||
                  module.active ||
                  module.items ||
                  ""}
                {module.count && " Total"}
                {module.collection && " Collected"}
                {module.books && " Books"}
                {module.vehicles && " Vehicles"}
                {module.sent && " Sent"}
                {module.active && " Active"}
                {module.items && " Items"}
              </p>
              <div className="flex flex-wrap gap-1">
                {module.subFeatures.slice(0, 3).map((feature) => (
                  <Badge
                    key={feature}
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-600"
                  >
                    {feature}
                  </Badge>
                ))}
                {module.subFeatures.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{module.subFeatures.length - 3}
                  </Badge>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Clock className="h-5 w-5 text-gray-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-gray-100">
                    <activity.icon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.name}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-gray-600">
              View All Activity
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Calendar className="h-5 w-5 text-gray-400" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500">
                      {event.date.split(" ")[0]}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {event.date.split(" ")[1].replace(",", "")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {event.title}
                    </p>
                    <Badge
                      variant="outline"
                      className={`mt-1 ${
                        event.type === "exam"
                          ? "text-red-600 border-red-200"
                          : event.type === "meeting"
                            ? "text-blue-600 border-blue-200"
                            : event.type === "event"
                              ? "text-green-600 border-green-200"
                              : "text-yellow-600 border-yellow-200"
                      }`}
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-gray-600">
              View Calendar
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-md transition-all border-gray-200 hover:border-blue-200">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-3 rounded-lg bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New Admission</p>
                <p className="text-sm text-gray-500">Enroll student</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-all border-gray-200 hover:border-blue-200">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Mark Attendance</p>
                <p className="text-sm text-gray-500">Daily attendance</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-all border-gray-200 hover:border-blue-200">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-3 rounded-lg bg-yellow-100">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Collect Fees</p>
                <p className="text-sm text-gray-500">Fee collection</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-all border-gray-200 hover:border-blue-200">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Send Notification</p>
                <p className="text-sm text-gray-500">SMS/WhatsApp</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/app/")({
  component: DashboardHome,
});
