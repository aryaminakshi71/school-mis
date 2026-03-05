/**
 * Dashboard - Complete Overview with Data from API
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BarChart,
  BookOpen,
  Bus,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  FileText,
  GraduationCap,
  MessageSquare,
  Package,
  Plus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

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
          <h1 className="font-bold text-3xl text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back! Here's what's happening at your school today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Students
            </CardTitle>
            <div className="rounded-lg bg-primary-light/20 p-2">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.totalStudents.toLocaleString()}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              <span className="font-medium text-foreground">+12%</span> from last
              month
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Today's Attendance
            </CardTitle>
            <div className="rounded-lg bg-success/15 p-2">
              <Calendar className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.todayAttendance}%
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              <span className="font-medium text-foreground">+2.1%</span> from
              yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Fee Collection
            </CardTitle>
            <div className="rounded-lg bg-warning/15 p-2">
              <DollarSign className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              ₹{(stats.monthlyFeeCollection / 100000).toFixed(1)}L
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              <span className="font-medium text-foreground">+₹2.3L</span> this week
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Pending Tasks
            </CardTitle>
            <div className="rounded-lg bg-destructive/10 p-2">
              <Clock className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.pendingFeePayments}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              5 urgent, 13 normal priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* All Modules Grid */}
      <div>
        <h2 className="mb-4 font-semibold text-foreground text-xl">
          School Management Modules
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allModules.map((module) => (
            <Link
              key={module.name}
              to={module.href}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary-light hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between">
                <div
                  className={`rounded-lg p-3 ${
                    module.color === "blue"
                      ? "bg-primary-light/20"
                      : module.color === "purple"
                        ? "bg-primary/10"
                        : module.color === "green"
                          ? "bg-success/15"
                          : module.color === "orange"
                            ? "bg-warning/15"
                            : module.color === "red"
                              ? "bg-destructive/10"
                              : module.color === "yellow"
                                ? "bg-warning/15"
                                : module.color === "indigo"
                                  ? "bg-primary/10"
                                  : module.color === "pink"
                                    ? "bg-primary/10"
                                    : module.color === "cyan"
                                      ? "bg-primary/10"
                                      : module.color === "teal"
                                        ? "bg-primary/10"
                                        : module.color === "amber"
                                          ? "bg-warning/15"
                                          : "bg-destructive/10"
                  }`}
                >
                  <module.icon
                    className={`h-5 w-5 ${
                      module.color === "blue"
                        ? "text-primary"
                        : module.color === "purple"
                          ? "text-primary"
                          : module.color === "green"
                            ? "text-success"
                            : module.color === "orange"
                              ? "text-warning"
                              : module.color === "red"
                                ? "text-destructive"
                                : module.color === "yellow"
                                  ? "text-warning"
                                  : module.color === "indigo"
                                    ? "text-primary"
                                    : module.color === "pink"
                                      ? "text-primary"
                                      : module.color === "cyan"
                                        ? "text-primary"
                                        : module.color === "teal"
                                          ? "text-primary"
                                          : module.color === "amber"
                                            ? "text-warning"
                                            : "text-destructive"
                    }`}
                  />
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">
                {module.name}
              </h3>
              <p className="mb-3 text-muted-foreground text-sm">
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
                    className="bg-muted text-muted-foreground text-xs"
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
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="rounded-full bg-muted p-2">
                    <activity.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {activity.action}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {activity.name}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full text-muted-foreground"
            >
              View All Activity
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary-light/20">
                    <span className="text-muted-foreground text-xs">
                      {event.date.split(" ")[0]}
                    </span>
                    <span className="font-bold text-foreground text-sm">
                      {event.date.split(" ")[1].replace(",", "")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {event.title}
                    </p>
                    <Badge
                      variant="outline"
                      className={`mt-1 ${
                        event.type === "exam"
                          ? "border-destructive/30 text-foreground"
                          : event.type === "meeting"
                            ? "border-primary/20 text-foreground"
                            : event.type === "event"
                              ? "border-success/30 text-foreground"
                              : "border-warning/30 text-foreground"
                      }`}
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full text-muted-foreground"
            >
              View Calendar
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 font-semibold text-foreground text-xl">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="cursor-pointer border-border transition-all hover:border-primary/20 hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-success/15 p-3">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">New Admission</p>
                <p className="text-muted-foreground text-sm">Enroll student</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer border-border transition-all hover:border-primary/20 hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-primary-light/20 p-3">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Mark Attendance</p>
                <p className="text-muted-foreground text-sm">
                  Daily attendance
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer border-border transition-all hover:border-primary/20 hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-warning/15 p-3">
                <DollarSign className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground">Collect Fees</p>
                <p className="text-muted-foreground text-sm">Fee collection</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer border-border transition-all hover:border-primary/20 hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Send Notification</p>
                <p className="text-muted-foreground text-sm">SMS/WhatsApp</p>
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
