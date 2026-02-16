/**
 * Exams & Results Management - FIXED VERSION
 * All sub-features for exam scheduling, marks entry, and result processing
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { handleError } from "@/lib/error-handler";
import { exportToCSV } from "@/lib/export-utils";
import { useListPageShortcuts } from "@/lib/keyboard-shortcuts";
import { useSearch } from "@/lib/search-utils";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  FileText,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

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
        Exam: r.exam,
        Class: r.class,
        Students: r.students.toString(),
        "Average Marks": r.avgMarks,
        "Pass Rate": r.passRate,
        Status: r.status,
      }));

      exportToCSV(
        exportData,
        `exam-results-export-${new Date().toISOString().split("T")[0]}`,
      );
      toast.success("Exam results exported successfully");
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  // Keyboard shortcuts
  useListPageShortcuts(
    () => toast.info("Schedule Exam feature coming soon"),
    () => window.location.reload(),
    () => handleExport(),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Exams & Results</h1>
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
          <Button
            onClick={() => toast.info("Schedule Exam feature coming soon")}
          >
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
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
                feature.active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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
                        : "bg-warning/15"
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
                          : "text-warning"
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stat.value}</div>
              <p className="text-muted-foreground text-xs">{stat.change}</p>
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
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
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
                <div className="py-8 text-center">
                  <Calendar className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">
                    {hasActiveFilters ? "No exams found" : "No upcoming exams"}
                  </p>
                </div>
              ) : (
                filteredExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-start justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{exam.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {exam.class}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-muted-foreground text-xs">
                        <Calendar className="h-3 w-3" />
                        {exam.date}
                        <Clock className="ml-2 h-3 w-3" />
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
                        <ChevronRight className="ml-1 h-4 w-4" />
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
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{result.exam}</p>
                    <p className="text-muted-foreground text-sm">
                      {result.class}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-muted-foreground text-xs">
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
                    <div className="mt-2 flex gap-1">
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
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-success/15 p-3">
              <Calendar className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium">Schedule Exam</p>
              <p className="text-muted-foreground text-sm">Create new exam</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Allocate Halls</p>
              <p className="text-muted-foreground text-sm">Room assignment</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-warning/15 p-3">
              <ClipboardList className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="font-medium">Enter Marks</p>
              <p className="text-muted-foreground text-sm">Grade entry</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Publish Results</p>
              <p className="text-muted-foreground text-sm">
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
            <div className="rounded-lg border p-4">
              <p className="font-medium">Unit Tests (UT)</p>
              <p className="mt-1 text-muted-foreground text-sm">
                Monthly assessment
              </p>
              <p className="mt-2 text-muted-foreground text-xs">
                3 exams per subject
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-medium">Half-Yearly</p>
              <p className="mt-1 text-muted-foreground text-sm">
                Mid-term exam
              </p>
              <p className="mt-2 text-muted-foreground text-xs">All subjects</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-medium">Annual</p>
              <p className="mt-1 text-muted-foreground text-sm">Final exam</p>
              <p className="mt-2 text-muted-foreground text-xs">
                Board pattern
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-medium">Practical</p>
              <p className="mt-1 text-muted-foreground text-sm">Lab/Science</p>
              <p className="mt-2 text-muted-foreground text-xs">
                Lab assessment
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
