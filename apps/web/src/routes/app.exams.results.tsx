/**
 * Exam Results Management - View and publish examination results
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Calendar,
  Download,
  Eye,
  FileText,
  MapPin,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/exams/results")({
  component: ExamResultsPage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/exams", icon: FileText },
  { name: "Exam Types", href: "/app/exams/types", icon: BookOpen },
  { name: "Schedule", href: "/app/exams/schedule", icon: Calendar },
  { name: "Hall Allocation", href: "/app/exams/halls", icon: MapPin },
  { name: "Marks Entry", href: "/app/exams/marks", icon: BookOpen },
  { name: "Results", href: "/app/exams/results", icon: Award, active: true },
  { name: "Report Cards", href: "/app/exams/reports", icon: FileText },
];

interface ExamResult {
  id: string;
  examName: string;
  subject: string;
  class: string;
  date: string;
  maxMarks: number;
  passingMarks: number;
  totalStudents: number;
  passedStudents: number;
  failedStudents: number;
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
  passPercentage: number;
  status: "draft" | "published";
  results: {
    studentId: string;
    studentName: string;
    rollNumber: string;
    marks: number;
    grade: string;
    status: "pass" | "fail";
  }[];
}

function ExamResultsPage() {
  const [examResults, setExamResults] = useState<ExamResult[]>([
    {
      id: "1",
      examName: "Mathematics UT-3",
      subject: "Mathematics",
      class: "Class 10-A",
      date: "2026-01-25",
      maxMarks: 50,
      passingMarks: 20,
      totalStudents: 42,
      passedStudents: 38,
      failedStudents: 4,
      averageMarks: 35.2,
      highestMarks: 48,
      lowestMarks: 12,
      passPercentage: 90.5,
      status: "published",
      results: [
        {
          studentId: "STU001",
          studentName: "Rahul Sharma",
          rollNumber: "101",
          marks: 42,
          grade: "A",
          status: "pass",
        },
        {
          studentId: "STU002",
          studentName: "Priya Singh",
          rollNumber: "102",
          marks: 38,
          grade: "B+",
          status: "pass",
        },
      ],
    },
    {
      id: "2",
      examName: "Science UT-3",
      subject: "Science",
      class: "Class 10-A",
      date: "2026-01-27",
      maxMarks: 50,
      passingMarks: 20,
      totalStudents: 42,
      passedStudents: 35,
      failedStudents: 7,
      averageMarks: 32.8,
      highestMarks: 46,
      lowestMarks: 8,
      passPercentage: 83.3,
      status: "published",
      results: [],
    },
  ]);

  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const classes = [...new Set(examResults.map((r) => r.class))];

  const filteredResults = examResults.filter((result) => {
    const matchesSearch =
      result.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "all" || result.class === filterClass;
    const matchesStatus =
      filterStatus === "all" || result.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPassStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-100 text-green-800";
      case "fail":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const publishResult = (resultId: string) => {
    setExamResults((prev) =>
      prev.map((result) =>
        result.id === resultId ? { ...result, status: "published" } : result,
      ),
    );
    toast.success("Results published successfully");
  };

  const exportResults = (result: ExamResult) => {
    toast.success(`Results for ${result.examName} exported successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Exam Results</h1>
          <p className="text-muted-foreground">
            View and publish examination results
          </p>
        </div>
      </div>

      {/* Sub-features Navigation */}
      <div className="flex flex-wrap gap-2">
        {subFeatures.map((feature) => (
          <Button
            key={feature.href}
            variant={feature.active ? "default" : "outline"}
            size="sm"
            asChild
          >
            <a href={feature.href}>
              <feature.icon className="mr-2 h-4 w-4" />
              {feature.name}
            </a>
          </Button>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[200px] flex-1">
              <div className="relative">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{examResults.length}</div>
            <p className="text-muted-foreground text-xs">
              {examResults.filter((r) => r.status === "published").length}{" "}
              published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Average Pass Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {(
                examResults.reduce((sum, r) => sum + r.passPercentage, 0) /
                examResults.length
              ).toFixed(1)}
              %
            </div>
            <p className="text-muted-foreground text-xs">Overall performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Students
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {examResults.reduce((sum, r) => sum + r.totalStudents, 0)}
            </div>
            <p className="text-muted-foreground text-xs">Appeared in exams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Pass Count</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {examResults.reduce((sum, r) => sum + r.passedStudents, 0)}
            </div>
            <p className="text-muted-foreground text-xs">Students passed</p>
          </CardContent>
        </Card>
      </div>

      {/* Exam Results List */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredResults.map((result) => (
          <Card key={result.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{result.examName}</CardTitle>
              <Badge className={getStatusColor(result.status)}>
                {result.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Subject: {result.subject}</p>
                  <p>Date: {result.date}</p>
                  <p>Class: {result.class}</p>
                </div>
                <div>
                  <p>Max Marks: {result.maxMarks}</p>
                  <p>Passing: {result.passingMarks}</p>
                  <p>Students: {result.totalStudents}</p>
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedResult(result)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportResults(result)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  {result.status === "draft" && (
                    <Button size="sm" onClick={() => publishResult(result.id)}>
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Results Modal */}
      {selectedResult && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Detailed Results - {selectedResult.examName}
              </CardTitle>
              <Button variant="outline" onClick={() => setSelectedResult(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedResult.results.map((studentResult) => (
                <div
                  key={studentResult.studentId}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{studentResult.studentName}</p>
                    <p className="text-muted-foreground text-sm">
                      Roll: {studentResult.rollNumber} • ID:{" "}
                      {studentResult.studentId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {studentResult.marks} / {selectedResult.maxMarks}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Grade: {studentResult.grade}
                    </p>
                  </div>
                  <Badge className={getPassStatusColor(studentResult.status)}>
                    {studentResult.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
