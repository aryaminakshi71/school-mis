/**
 * Exam Reports Management - Generate and view examination report cards
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Calendar,
  Download,
  FileText,
  Mail,
  MapPin,
  Printer,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/exams/reports")({
  component: ExamReportsPage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/exams", icon: FileText },
  { name: "Exam Types", href: "/app/exams/types", icon: BookOpen },
  { name: "Schedule", href: "/app/exams/schedule", icon: Calendar },
  { name: "Hall Allocation", href: "/app/exams/halls", icon: MapPin },
  { name: "Marks Entry", href: "/app/exams/marks", icon: BookOpen },
  { name: "Results", href: "/app/exams/results", icon: BookOpen },
  {
    name: "Report Cards",
    href: "/app/exams/reports",
    icon: FileText,
    active: true,
  },
];

interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  rollNumber: string;
  academicYear: string;
  subjects: {
    name: string;
    marks: number;
    maxMarks: number;
    grade: string;
    status: "pass" | "fail";
  }[];
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  overallGrade: string;
  rank: number;
  status: "generated" | "sent" | "printed";
  generatedDate: string;
}

function ExamReportsPage() {
  const [reportCards, setReportCards] = useState<ReportCard[]>([
    {
      id: "1",
      studentId: "STU001",
      studentName: "Rahul Sharma",
      class: "Class 10-A",
      rollNumber: "101",
      academicYear: "2025-2026",
      subjects: [
        {
          name: "Mathematics",
          marks: 42,
          maxMarks: 50,
          grade: "A",
          status: "pass",
        },
        {
          name: "Science",
          marks: 40,
          maxMarks: 50,
          grade: "A",
          status: "pass",
        },
        {
          name: "English",
          marks: 38,
          maxMarks: 50,
          grade: "B+",
          status: "pass",
        },
        {
          name: "Social Science",
          marks: 45,
          maxMarks: 50,
          grade: "A",
          status: "pass",
        },
      ],
      totalMarks: 165,
      maxTotalMarks: 200,
      percentage: 82.5,
      overallGrade: "A",
      rank: 3,
      status: "generated",
      generatedDate: "2026-02-01",
    },
    {
      id: "2",
      studentId: "STU002",
      studentName: "Priya Singh",
      class: "Class 10-A",
      rollNumber: "102",
      academicYear: "2025-2026",
      subjects: [
        {
          name: "Mathematics",
          marks: 38,
          maxMarks: 50,
          grade: "B+",
          status: "pass",
        },
        {
          name: "Science",
          marks: 35,
          maxMarks: 50,
          grade: "B",
          status: "pass",
        },
        {
          name: "English",
          marks: 42,
          maxMarks: 50,
          grade: "A",
          status: "pass",
        },
        {
          name: "Social Science",
          marks: 40,
          maxMarks: 50,
          grade: "A",
          status: "pass",
        },
      ],
      totalMarks: 155,
      maxTotalMarks: 200,
      percentage: 77.5,
      overallGrade: "B+",
      rank: 8,
      status: "sent",
      generatedDate: "2026-02-01",
    },
  ]);

  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState("standard");

  const filteredReports = reportCards.filter((report) => {
    const matchesSearch =
      report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.rollNumber.includes(searchTerm);
    const matchesClass = filterClass === "all" || report.class === filterClass;
    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const generateReportCard = (studentId: string) => {
    // Mock report card generation
    toast.success("Report card generated successfully");
  };

  const printReportCard = (reportId: string) => {
    toast.success("Report card sent to printer");
  };

  const emailReportCard = (reportId: string) => {
    toast.success("Report card sent via email");
  };

  const downloadReportCard = (reportId: string) => {
    toast.success("Report card downloaded");
  };

  const bulkGenerate = () => {
    toast.success("Bulk report cards generation started");
  };

  const bulkEmail = () => {
    toast.success("Bulk email sending started");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated":
        return "bg-blue-100 text-blue-800";
      case "sent":
        return "bg-green-100 text-green-800";
      case "printed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-800";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-800";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const classes = [...new Set(reportCards.map((r) => r.class))];

  return (
    <div className="space-y-6">
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Report Cards</h1>
          <p className="text-muted-foreground">
            Generate and manage student report cards
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={bulkGenerate}>
            Bulk Generate
          </Button>
          <Button variant="outline" onClick={bulkEmail}>
            Bulk Email
          </Button>
        </div>
      </div>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Report Card Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Label htmlFor="template">Select Template:</Label>
            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Template</SelectItem>
                <SelectItem value="detailed">Detailed Template</SelectItem>
                <SelectItem value="minimal">Minimal Template</SelectItem>
                <SelectItem value="custom">Custom Template</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[200px] flex-1">
              <div className="relative">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
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
                <SelectItem value="generated">Generated</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="printed">Printed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{reportCards.length}</div>
            <p className="text-muted-foreground text-xs">
              Generated report cards
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Average Percentage
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {(
                reportCards.reduce((sum, r) => sum + r.percentage, 0) /
                reportCards.length
              ).toFixed(1)}
              %
            </div>
            <p className="text-muted-foreground text-xs">Class performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Top Performers
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {reportCards.filter((r) => r.overallGrade.startsWith("A")).length}
            </div>
            <p className="text-muted-foreground text-xs">Grade A students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Distributed</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {reportCards.filter((r) => r.status === "sent").length}
            </div>
            <p className="text-muted-foreground text-xs">
              Reports sent to parents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Cards List */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">{report.studentName}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {report.class} • Roll: {report.rollNumber} • Rank:{" "}
                  {report.rank}
                </p>
              </div>
              <Badge className={getStatusColor(report.status)}>
                {report.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>Academic Year: {report.academicYear}</p>
                    <p>Generated: {report.generatedDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Total: {report.totalMarks}/{report.maxTotalMarks}
                    </p>
                    <p>Percentage: {report.percentage}%</p>
                    <Badge className={getGradeColor(report.overallGrade)}>
                      Grade: {report.overallGrade}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Subject-wise Performance:</h4>
                  {report.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{subject.name}</span>
                      <div className="flex items-center space-x-2">
                        <span>
                          {subject.marks}/{subject.maxMarks}
                        </span>
                        <Badge
                          variant="outline"
                          className={getGradeColor(subject.grade)}
                        >
                          {subject.grade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReport(report)}
                  >
                    View Full Report
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadReportCard(report.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => printReportCard(report.id)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => emailReportCard(report.id)}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Report Card Modal */}
      {selectedReport && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Report Card - {selectedReport.studentName}</CardTitle>
              <Button variant="outline" onClick={() => setSelectedReport(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/50 p-4">
                <div>
                  <h3 className="mb-2 font-semibold">Student Information</h3>
                  <p>
                    <strong>Name:</strong> {selectedReport.studentName}
                  </p>
                  <p>
                    <strong>Class:</strong> {selectedReport.class}
                  </p>
                  <p>
                    <strong>Roll Number:</strong> {selectedReport.rollNumber}
                  </p>
                  <p>
                    <strong>Student ID:</strong> {selectedReport.studentId}
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Academic Information</h3>
                  <p>
                    <strong>Academic Year:</strong>{" "}
                    {selectedReport.academicYear}
                  </p>
                  <p>
                    <strong>Class Rank:</strong> {selectedReport.rank}
                  </p>
                  <p>
                    <strong>Report Generated:</strong>{" "}
                    {selectedReport.generatedDate}
                  </p>
                </div>
              </div>

              {/* Subject Marks Table */}
              <div>
                <h3 className="mb-4 font-semibold">Subject-wise Performance</h3>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 text-left">Subject</th>
                        <th className="p-3 text-center">Marks</th>
                        <th className="p-3 text-center">Max Marks</th>
                        <th className="p-3 text-center">Grade</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.subjects.map((subject, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">{subject.name}</td>
                          <td className="p-3 text-center">{subject.marks}</td>
                          <td className="p-3 text-center">
                            {subject.maxMarks}
                          </td>
                          <td className="p-3 text-center">
                            <Badge className={getGradeColor(subject.grade)}>
                              {subject.grade}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Badge
                              variant={
                                subject.status === "pass"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {subject.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t bg-muted/50 font-semibold">
                        <td className="p-3">Total</td>
                        <td className="p-3 text-center">
                          {selectedReport.totalMarks}
                        </td>
                        <td className="p-3 text-center">
                          {selectedReport.maxTotalMarks}
                        </td>
                        <td className="p-3 text-center">
                          <Badge
                            className={getGradeColor(
                              selectedReport.overallGrade,
                            )}
                          >
                            {selectedReport.overallGrade}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          {selectedReport.percentage >= 40 ? "Pass" : "Fail"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Overall Performance */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg border p-4">
                  <div className="font-bold text-2xl">
                    {selectedReport.percentage}%
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Overall Percentage
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="font-bold text-2xl">
                    {selectedReport.overallGrade}
                  </div>
                  <p className="text-muted-foreground text-sm">Overall Grade</p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="font-bold text-2xl">
                    {selectedReport.rank}
                  </div>
                  <p className="text-muted-foreground text-sm">Class Rank</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
