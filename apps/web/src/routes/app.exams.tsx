/**
 * Exams & Results Management - FIXED VERSION
 * All sub-features for exam scheduling, marks entry, and result processing
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  Calendar,
  ClipboardList,
  Award,
  Clock,
  Download,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Users,
  BookOpen,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/lib/search-utils";
import { exportToCSV } from "@/lib/export-utils";
import { useListPageShortcuts } from "@/lib/keyboard-shortcuts";
import { toast } from "sonner";
import { handleError } from "@/lib/error-handler";

export const Route = createFileRoute("/app/exams")({
  component: ExamsPage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/exams", icon: FileText, active: true },
  { name: "Exam Types", href: "/app/exams/types", icon: ClipboardList },
  { name: "Schedule", href: "/app/exams/schedule", icon: Calendar },
  { name: "Hall Allocation", href: "/app/exams/halls", icon: BookOpen },
  { name: "Marks Entry", href: "/app/exams/marks", icon: ClipboardList },
  { name: "Results", href: "/app/exams/results", icon: Award },
  { name: "Report Cards", href: "/app/exams/reports", icon: FileText },
];

// Mock data
const upcomingExams = [
  {
    id: "EX001",
    name: "Mathematics UT-3",
    class: "Class 10",
    date: "Jan 25, 2026",
    time: "9:00 AM - 11:00 AM",
    status: "Scheduled",
  },
  {
    id: "EX002",
    name: "Science UT-3",
    class: "Class 10",
    date: "Jan 27, 2026",
    time: "9:00 AM - 11:00 AM",
    status: "Scheduled",
  },
  {
    id: "EX003",
    name: "English Half-Yearly",
    class: "Class 12",
    date: "Jan 30, 2026",
    time: "1:00 PM - 4:00 PM",
    status: "Hall Pending",
  },
];

const recentResults = [
  {
    id: "RES001",
    exam: "Mathematics UT-2",
    class: "Class 10-A",
    students: 42,
    avgMarks: "78.5",
    passRate: "95%",
    status: "Published",
  },
  {
    id: "RES002",
    exam: "Science UT-2",
    class: "Class 10-A",
    students: 42,
    avgMarks: "72.3",
    passRate: "92%",
    status: "Published",
  },
  {
    id: "RES003",
    exam: "Social Science UT-2",
    class: "Class 9-B",
    students: 38,
    avgMarks: "81.2",
    passRate: "97%",
    status: "Draft",
  },
];

const stats = [
  {
    title: "Upcoming Exams",
    value: "12",
    change: "+3 this month",
    icon: Calendar,
    color: "blue",
  },
  {
    title: "Exams Completed",
    value: "24",
    change: "This year",
    icon: CheckCircle,
    color: "green",
  },
  {
    title: "Avg Pass Rate",
    value: "94.2%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "purple",
  },
  {
    title: "Pending Results",
    value: "5",
    change: "To publish",
    icon: Clock,
    color: "yellow",
  },
];

function ExamsPage() {
  // Search functionality
  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredExams,
    hasActiveFilters,
    clearSearch,
  } = useSearch({
    data: upcomingExams,
    searchFields: ["name", "class", "id"],
  });

  const {
    searchQuery: resultsSearchQuery,
    setSearchQuery: setResultsSearchQuery,
    filteredData: filteredResults,
    hasActiveFilters: hasResultsFilters,
    clearSearch: clearResultsSearch,
  } = useSearch({
    data: recentResults,
    searchFields: ["exam", "class", "id"],
  });

  // Export functionality
  const handleExport = () => {
    try {
      const exportData = recentResults.map((r) => ({
        "Exam": r.exam,
        "Class": r.class,
        "Students": r.students.toString(),
        "Average Marks": r.avgMarks,
        "Pass Rate": r.passRate,
        "Status": r.status,
      }));

      exportToCSV(exportData, `exam-results-export-${new Date().toISOString().split("T")[0]}`);
      toast.success("Exam results exported successfully");
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  // Keyboard shortcuts
  useListPageShortcuts(
    () => toast.info("Schedule Exam feature coming soon"),
    () => window.location.reload(),
    () => handleExport()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exams & Results</h1>
          <p className="text-muted-foreground">
            Manage exam scheduling, hall allocation, marks entry, and result
            publishing.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={recentResults.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Results ({recentResults.length})
          </Button>
          <Button onClick={() => toast.info("Schedule Exam feature coming soon")}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Exam
          </Button>
        </div>
      </div>

      {/* Sub-features Navigation */}
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {subFeatures.map((feature) => (
            <button
              key={feature.name}
              onClick={() => {
                if (feature.name !== "Dashboard") {
                  toast.info(`${feature.name} feature coming soon`);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${feature.active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
              <feature.icon className="h-4 w-4" />
              {feature.name}
            </button>
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
                      : "bg-yellow-100"
                  }`}
              >
                <stat.icon
                  className={`h-4 w-4 ${stat.color === "blue"
                    ? "text-blue-600"
                    : stat.color === "green"
                      ? "text-green-600"
                      : stat.color === "purple"
                        ? "text-purple-600"
                        : "text-yellow-600"
                    }`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Exams & Results Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Exams</CardTitle>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearSearch}>
                  Clear
                </Button>
              )}
              <Button variant="ghost" size="sm">
                View Schedule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search exams... (Press / to focus)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-4">
              {filteredExams.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {hasActiveFilters ? "No exams found" : "No upcoming exams"}
                  </p>
                </div>
              ) : (
                filteredExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-start justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{exam.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.class}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {exam.date}
                        <Clock className="h-3 w-3 ml-2" />
                        {exam.time}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          exam.status === "Scheduled"
                            ? "success"
                            : exam.status === "Hall Pending"
                              ? "warning"
                              : "outline"
                        }
                      >
                        {exam.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Results</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-start justify-between p-4 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{result.exam}</p>
                    <p className="text-sm text-muted-foreground">
                      {result.class}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{result.students} students</span>
                      <span>Avg: {result.avgMarks}</span>
                      <span>Pass: {result.passRate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        result.status === "Published" ? "success" : "warning"
                      }
                    >
                      {result.status}
                    </Badge>
                    <div className="flex gap-1 mt-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Schedule Exam</p>
              <p className="text-sm text-muted-foreground">Create new exam</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Allocate Halls</p>
              <p className="text-sm text-muted-foreground">Room assignment</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-yellow-100">
              <ClipboardList className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">Enter Marks</p>
              <p className="text-sm text-muted-foreground">Grade entry</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Publish Results</p>
              <p className="text-sm text-muted-foreground">
                Release to parents
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Types Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Types Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 rounded-lg border">
              <p className="font-medium">Unit Tests (UT)</p>
              <p className="text-sm text-muted-foreground mt-1">
                Monthly assessment
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                3 exams per subject
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="font-medium">Half-Yearly</p>
              <p className="text-sm text-muted-foreground mt-1">
                Mid-term exam
              </p>
              <p className="text-xs text-muted-foreground mt-2">All subjects</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="font-medium">Annual</p>
              <p className="text-sm text-muted-foreground mt-1">Final exam</p>
              <p className="text-xs text-muted-foreground mt-2">
                Board pattern
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="font-medium">Practical</p>
              <p className="text-sm text-muted-foreground mt-1">Lab/Science</p>
              <p className="text-xs text-muted-foreground mt-2">
                Lab assessment
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
