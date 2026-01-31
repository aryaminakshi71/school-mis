/**
 * Staff Performance Management - Appraisals, evaluations, feedback
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  UserPlus,
  DollarSign,
  Calendar,
  Award,
  Search,
  Plus,
  Star,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  Filter,
  Target,
  BarChart3,
  MessageSquare,
  MoreVertical,
  Eye,
  Edit,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/lib/search-utils";
import { exportToCSV } from "@/lib/export-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/teachers/performance")({
  component: PerformancePage,
});

const subFeatures = [
  { name: "All Staff", href: "/app/teachers", icon: Users },
  { name: "Recruitment", href: "/app/teachers/recruitment", icon: UserPlus },
  { name: "Payroll", href: "/app/teachers/payroll", icon: DollarSign },
  { name: "Attendance", href: "/app/teachers/attendance", icon: Calendar },
  { name: "Leave", href: "/app/teachers/leave", icon: Clock },
  { name: "Performance", href: "/app/teachers/performance", icon: Award, active: true },
  { name: "Training", href: "/app/teachers/training", icon: Award },
];

// Mock data for performance evaluations
const performanceData = [
  {
    id: "EMP-001",
    name: "Ramesh Kumar",
    designation: "Senior Teacher",
    department: "Mathematics",
    rating: 4.8,
    studentsFeedback: 4.7,
    peerReview: 4.9,
    attendance: 96,
    lastAppraisal: "2025-07-15",
    nextAppraisal: "2026-07-15",
    status: "excellent",
  },
  {
    id: "EMP-002",
    name: "Priya Sharma",
    designation: "Teacher",
    department: "Science",
    rating: 4.5,
    studentsFeedback: 4.6,
    peerReview: 4.4,
    attendance: 98,
    lastAppraisal: "2025-08-20",
    nextAppraisal: "2026-08-20",
    status: "good",
  },
  {
    id: "EMP-003",
    name: "Amit Patel",
    designation: "Head of Department",
    department: "English",
    rating: 4.2,
    studentsFeedback: 4.0,
    peerReview: 4.3,
    attendance: 94,
    lastAppraisal: "2025-06-10",
    nextAppraisal: "2026-06-10",
    status: "average",
  },
  {
    id: "EMP-004",
    name: "Sneha Gupta",
    designation: "Teacher",
    department: "Mathematics",
    rating: 4.9,
    studentsFeedback: 4.9,
    peerReview: 4.8,
    attendance: 99,
    lastAppraisal: "2025-09-01",
    nextAppraisal: "2026-09-01",
    status: "excellent",
  },
  {
    id: "EMP-005",
    name: "Vikram Singh",
    designation: "Teacher",
    department: "Sports",
    rating: 3.8,
    studentsFeedback: 3.9,
    peerReview: 3.7,
    attendance: 88,
    lastAppraisal: "2025-05-25",
    nextAppraisal: "2026-05-25",
    status: "needs_improvement",
  },
];

// Mock data for appraisal cycles
const appraisalCycles = [
  { id: "AP-2026-Q1", name: "Annual Appraisal 2026", startDate: "2026-01-01", endDate: "2026-03-31", status: "active", completed: 25, total: 50 },
  { id: "AP-2025-Q4", name: "Quarterly Review Q4 2025", startDate: "2025-10-01", endDate: "2025-12-31", status: "completed", completed: 48, total: 48 },
  { id: "AP-2025-Q3", name: "Quarterly Review Q3 2025", startDate: "2025-07-01", endDate: "2025-09-30", status: "completed", completed: 46, total: 46 },
];

function PerformancePage() {
  const [activeTab, setActiveTab] = useState("evaluations");
  const [selectedRating, setSelectedRating] = useState("all");

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredPerformance,
    hasActiveFilters,
    clearSearch,
  } = useSearch({
    data: performanceData,
    searchFields: ["name", "id", "designation", "department"],
    searchQuery: "",
  });

  const filteredByRating = selectedRating === "all"
    ? filteredPerformance
    : filteredPerformance.filter((p) => p.status === selectedRating);

  const excellentCount = filteredPerformance.filter((p) => p.rating >= 4.5).length;
  const needsImprovementCount = filteredPerformance.filter((p) => p.rating < 4.0).length;
  const avgRating = filteredPerformance.reduce((sum, p) => sum + p.rating, 0) / (filteredPerformance.length || 1);

  const handleExport = () => {
    const exportData = filteredByRating.map((p) => ({
      "Employee ID": p.id,
      "Name": p.name,
      "Designation": p.designation,
      "Department": p.department,
      "Overall Rating": p.rating,
      "Student Feedback": p.studentsFeedback,
      "Peer Review": p.peerReview,
      "Attendance": `${p.attendance}%`,
      "Last Appraisal": p.lastAppraisal,
      "Next Appraisal": p.nextAppraisal,
      "Status": p.status,
    }));

    exportToCSV(exportData, `performance-evaluations-${new Date().toISOString().split("T")[0]}`);
    toast.success("Performance data exported");
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge variant="success">Excellent</Badge>;
      case "good":
        return <Badge variant="default">Good</Badge>;
      case "average":
        return <Badge variant="outline">Average</Badge>;
      case "needs_improvement":
        return <Badge variant="destructive">Needs Improvement</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = [
    { title: "Avg Rating", value: avgRating.toFixed(1), change: "Out of 5.0", icon: Star, color: "yellow" },
    { title: "Top Performers", value: excellentCount.toString(), change: "Rating 4.5+", icon: TrendingUp, color: "green" },
    { title: "Needs Attention", value: needsImprovementCount.toString(), change: "Below 4.0", icon: AlertCircle, color: "red" },
    { title: "Pending Reviews", value: "12", change: "This quarter", icon: Clock, color: "blue" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Management</h1>
          <p className="text-muted-foreground">Track staff performance, conduct appraisals, and manage feedback.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Start Appraisal
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("evaluations")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "evaluations"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Performance Evaluations
        </button>
        <button
          onClick={() => setActiveTab("appraisals")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "appraisals"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Appraisal Cycles
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "feedback"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          360° Feedback
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {activeTab === "evaluations" && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[300px]"
                />
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs">
                    Clear
                  </Button>
                )}
              </div>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="flex h-10 w-[150px] items-center justify-between rounded-lg border border-input bg-white px-3 py-2 text-sm"
              >
                <option value="all">All Ratings</option>
                <option value="excellent">Excellent (4.5+)</option>
                <option value="good">Good (4.0-4.4)</option>
                <option value="average">Average (3.5-3.9)</option>
                <option value="needs_improvement">Needs Improvement</option>
              </select>
            </>
          )}
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "evaluations" && "Performance Evaluations"}
            {activeTab === "appraisals" && "Appraisal Cycles"}
            {activeTab === "feedback" && "360° Feedback"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === "evaluations" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Employee ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Designation</th>
                    <th className="pb-3 font-medium">Department</th>
                    <th className="pb-3 font-medium">Overall Rating</th>
                    <th className="pb-3 font-medium">Student Feedback</th>
                    <th className="pb-3 font-medium">Peer Review</th>
                    <th className="pb-3 font-medium">Attendance</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Next Appraisal</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredByRating.map((employee) => (
                    <tr key={employee.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{employee.id}</td>
                      <td className="py-3 font-medium">{employee.name}</td>
                      <td className="py-3 text-sm">{employee.designation}</td>
                      <td className="py-3 text-sm">{employee.department}</td>
                      <td className="py-3">
                        <span className={`text-lg font-bold ${getRatingColor(employee.rating)}`}>
                          {employee.rating}
                        </span>
                        <span className="text-xs text-muted-foreground"> / 5.0</span>
                      </td>
                      <td className="py-3 text-sm">{employee.studentsFeedback}</td>
                      <td className="py-3 text-sm">{employee.peerReview}</td>
                      <td className="py-3">
                        <Badge variant={employee.attendance >= 95 ? "success" : employee.attendance >= 90 ? "default" : "warning"}>
                          {employee.attendance}%
                        </Badge>
                      </td>
                      <td className="py-3">{getStatusBadge(employee.status)}</td>
                      <td className="py-3 text-sm">{employee.nextAppraisal}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "appraisals" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Cycle ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Start Date</th>
                    <th className="pb-3 font-medium">End Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Progress</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appraisalCycles.map((cycle) => (
                    <tr key={cycle.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{cycle.id}</td>
                      <td className="py-3 font-medium">{cycle.name}</td>
                      <td className="py-3 text-sm">{cycle.startDate}</td>
                      <td className="py-3 text-sm">{cycle.endDate}</td>
                      <td className="py-3">
                        <Badge variant={cycle.status === "active" ? "success" : "outline"}>
                          {cycle.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm">
                        {cycle.completed}/{cycle.total} ({Math.round((cycle.completed / cycle.total) * 100)}%)
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {cycle.status === "active" && (
                            <Button variant="ghost" size="sm">
                              <Target className="h-4 w-4 mr-1" />
                              Set Goals
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">360° Feedback</h3>
              <p className="text-sm text-gray-600 mb-4">
                Collect feedback from students, peers, and supervisors for comprehensive performance evaluation.
              </p>
              <div className="flex gap-2 justify-center">
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Request Feedback
                </Button>
                <Button variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
