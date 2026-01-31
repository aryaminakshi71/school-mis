/**
 * Attendance Reports - Generate and view attendance reports
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  Download,
  BarChart3,
  TrendingUp,
  PieChart,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/app/attendance/reports")({
  component: AttendanceReportsPage,
});

const subFeatures = [
  { name: "Dashboard", href: "/app/attendance", icon: Calendar },
  { name: "Student Attendance", href: "/app/attendance/students", icon: Users },
  { name: "Staff Attendance", href: "/app/attendance/staff", icon: Users },
  { name: "Reports", href: "/app/attendance/reports", icon: FileText, active: true },
  { name: "Leave Requests", href: "/app/attendance/leave", icon: Clock },
  { name: "Alerts", href: "/app/attendance/alerts", icon: AlertTriangle },
];

const reportTypes = [
  {
    id: "daily",
    name: "Daily Attendance Report",
    description: "Class-wise attendance for a specific date",
    icon: CalendarDays,
    color: "blue",
  },
  {
    id: "monthly",
    name: "Monthly Summary",
    description: "Attendance statistics for the entire month",
    icon: Calendar,
    color: "green",
  },
  {
    id: "student",
    name: "Student-wise Report",
    description: "Individual student attendance history",
    icon: Users,
    color: "purple",
  },
  {
    id: "defaulters",
    name: "Defaulters List",
    description: "Students with low attendance percentage",
    icon: AlertTriangle,
    color: "red",
  },
  {
    id: "consolidated",
    name: "Consolidated Report",
    description: "Combined view of all attendance data",
    icon: BarChart3,
    color: "yellow",
  },
  {
    id: "trends",
    name: "Attendance Trends",
    description: "Visual analytics and trends over time",
    icon: TrendingUp,
    color: "orange",
  },
];

const recentReports = [
  { name: "Daily Report - Jan 27, 2026", type: "daily", date: "2026-01-27", size: "245 KB" },
  { name: "Monthly Summary - January 2026", type: "monthly", date: "2026-01-26", size: "1.2 MB" },
  { name: "Defaulters List - Week 3", type: "defaulters", date: "2026-01-25", size: "89 KB" },
  { name: "Class 10 Attendance Analysis", type: "student", date: "2026-01-24", size: "512 KB" },
];

function AttendanceReportsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const handleGenerateReport = (reportType: string) => {
    toast.success(`Generating ${reportType} report...`);
  };

  const handleDownload = (reportName: string) => {
    toast.success(`Downloading ${reportName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Reports</h1>
          <p className="text-muted-foreground">Generate, view, and download attendance reports and analytics.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex h-10 w-[150px] items-center justify-between rounded-lg border border-input bg-white px-3 py-2 text-sm"
          />
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
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

      {/* Report Types Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-${report.color}-100`}>
                  <report.icon className={`h-6 w-6 text-${report.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{report.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                    onClick={() => handleGenerateReport(report.name)}
                  >
                    Generate
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Generated on {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(report.name)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reports This Month</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Total downloads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Auto-generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128 MB</div>
            <p className="text-xs text-muted-foreground">For reports</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
