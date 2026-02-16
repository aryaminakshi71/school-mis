/**
 * Gradebook - Grade Management with Real Data
 */

import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  FileText,
  Loader2,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/gradebook")({
  component: GradebookPage,
});

interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  examType: string;
  score: number;
  maxScore: number;
  grade: string;
  date: string;
}

function GradebookPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data from API
  const [gradeRecords, setGradeRecords] = useState<GradeRecord[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [classesList, setClassesList] = useState<any[]>([]);

  // Form state
  const [gradeForm, setGradeForm] = useState({
    studentId: "",
    subjectId: "",
    classId: "",
    examType: "Midterm",
    score: "",
    maxScore: "100",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [grades, students, subjects, classes] = await Promise.all([
        api.grades.list(),
        api.students.list(),
        api.subjects.list(),
        api.classes.list(),
      ]);
      setGradeRecords(grades);
      setStudentsList(students);
      setSubjectsList(subjects);
      setClassesList(classes);
    } catch (error) {
      console.error("Failed to fetch gradebook data:", error);
      toast.error("Failed to load gradebook data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const subjects = [...new Set(gradeRecords.map((r) => r.subject))];

  const filteredRecords = gradeRecords.filter((record) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      subjectFilter === "all" || record.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  function getLetterGrade(score: number): string {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  // Group records by student for the summary view
  const studentSummaries = studentsList.map((student) => {
    const studentGrades = gradeRecords.filter(
      (r) => r.studentId === student.id,
    );
    const avgScore =
      studentGrades.length > 0
        ? studentGrades.reduce(
            (sum, r) => sum + (r.score / r.maxScore) * 100,
            0,
          ) / studentGrades.length
        : 0;

    return {
      ...student,
      name: `${student.firstName} ${student.lastName}`,
      grade: student.classId ? "N/A" : "N/A",
      section: "",
      rollNumber: student.admissionNumber,
      gradesCount: studentGrades.length,
      avgScore: avgScore.toFixed(1),
      avgGrade: getLetterGrade(avgScore),
      trend: avgScore >= 80 ? "up" : avgScore < 60 ? "down" : "stable",
    };
  });

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeForm.studentId || !gradeForm.subjectId || !gradeForm.score) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      // Find student's class
      const student = studentsList.find((s) => s.id === gradeForm.studentId);

      await api.grades.create({
        studentId: gradeForm.studentId,
        subjectId: gradeForm.subjectId,
        classId: student?.classId || gradeForm.classId,
        examType: gradeForm.examType,
        obtainedMarks: Number(gradeForm.score),
        maxMarks: Number(gradeForm.maxScore),
        sessionId: null,
      });

      toast.success("Grade added successfully");
      setIsAddGradeOpen(false);
      setGradeForm({
        studentId: "",
        subjectId: "",
        classId: "",
        examType: "Midterm",
        score: "",
        maxScore: "100",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to add grade:", error);
      toast.error("Failed to add grade");
    } finally {
      setSubmitting(false);
    }
  };

  const gradeColumns = [
    {
      key: "studentName",
      header: "Student",
      render: (record: GradeRecord) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <span className="font-medium text-xs">
              {record.studentName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <span className="font-medium text-foreground">
            {record.studentName}
          </span>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
    },
    {
      key: "examType",
      header: "Exam Type",
    },
    {
      key: "score",
      header: "Score",
      render: (record: GradeRecord) => (
        <span className="text-foreground">
          {record.score}/{record.maxScore}
        </span>
      ),
    },
    {
      key: "percentage",
      header: "Percentage",
      render: (record: GradeRecord) => {
        const percentage = (record.score / record.maxScore) * 100;
        return (
          <span
            className={cn(
              "font-medium",
              percentage >= 80
                ? "text-primary"
                : percentage >= 60
                  ? "text-accent"
                  : "text-destructive",
            )}
          >
            {percentage.toFixed(0)}%
          </span>
        );
      },
    },
    {
      key: "grade",
      header: "Grade",
      render: (record: GradeRecord) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 font-medium text-xs",
            record.grade.startsWith("A")
              ? "bg-primary/10 text-primary"
              : record.grade.startsWith("B")
                ? "bg-chart-3/10 text-chart-3"
                : record.grade.startsWith("C")
                  ? "bg-accent/10 text-accent"
                  : "bg-destructive/10 text-destructive",
          )}
        >
          {record.grade}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
    },
  ];

  const summaryColumns = [
    {
      key: "name",
      header: "Student",
      render: (student: (typeof studentSummaries)[0]) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <span className="font-medium text-sm">
              {student.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{student.name}</p>
            <p className="text-muted-foreground text-sm">
              {student.rollNumber}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "gradesCount",
      header: "Exams Taken",
    },
    {
      key: "avgScore",
      header: "Average Score",
      render: (student: (typeof studentSummaries)[0]) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">
            {student.avgScore}%
          </span>
          {student.trend === "up" && (
            <TrendingUp className="h-4 w-4 text-primary" />
          )}
          {student.trend === "down" && (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
        </div>
      ),
    },
    {
      key: "avgGrade",
      header: "Grade",
      render: (student: (typeof studentSummaries)[0]) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 font-medium text-xs",
            student.avgGrade === "A"
              ? "bg-primary/10 text-primary"
              : student.avgGrade === "B"
                ? "bg-chart-3/10 text-chart-3"
                : student.avgGrade === "C"
                  ? "bg-accent/10 text-accent"
                  : "bg-destructive/10 text-destructive",
          )}
        >
          {student.avgGrade}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (student: (typeof studentSummaries)[0]) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedStudent(student.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Gradebook</h1>
          <p className="text-muted-foreground">
            Manage grades and generate reports
          </p>
        </div>
      </div>

      <Tabs defaultValue="grades" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="bg-secondary">
            <TabsTrigger value="grades">All Grades</TabsTrigger>
            <TabsTrigger value="summary">Student Summary</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Grade
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Grade</DialogTitle>
                  <DialogDescription>
                    Enter the grade details for a student exam.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddGrade} className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="student">Student *</Label>
                    <Select
                      value={gradeForm.studentId}
                      onValueChange={(val) =>
                        setGradeForm({ ...gradeForm, studentId: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentsList.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.firstName} {student.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select
                        value={gradeForm.subjectId}
                        onValueChange={(val) =>
                          setGradeForm({ ...gradeForm, subjectId: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectsList.length > 0 ? (
                            subjectsList.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="math">Mathematics</SelectItem>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="history">History</SelectItem>
                              <SelectItem value="physics">Physics</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="examType">Exam Type *</Label>
                      <Select
                        value={gradeForm.examType}
                        onValueChange={(val) =>
                          setGradeForm({ ...gradeForm, examType: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Quiz">Quiz</SelectItem>
                          <SelectItem value="Midterm">Midterm</SelectItem>
                          <SelectItem value="Final">Final</SelectItem>
                          <SelectItem value="Assignment">Assignment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="score">Score *</Label>
                      <Input
                        id="score"
                        type="number"
                        placeholder="85"
                        value={gradeForm.score}
                        onChange={(e) =>
                          setGradeForm({ ...gradeForm, score: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxScore">Max Score</Label>
                      <Input
                        id="maxScore"
                        type="number"
                        placeholder="100"
                        value={gradeForm.maxScore}
                        onChange={(e) =>
                          setGradeForm({
                            ...gradeForm,
                            maxScore: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddGradeOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Add Grade
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="grades" className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search grades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border bg-secondary pl-9"
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-40 border-border bg-secondary">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <FileText className="mx-auto mb-3 h-10 w-10 opacity-20" />
              <p>No grade records found.</p>
              <p className="text-sm">Click "Add Grade" to create one.</p>
            </div>
          ) : (
            <DataTable columns={gradeColumns} data={filteredRecords} />
          )}
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <DataTable columns={summaryColumns} data={studentSummaries} />
        </TabsContent>
      </Tabs>

      {/* Student Detail Dialog */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Grade Details</DialogTitle>
          </DialogHeader>
          {selectedStudent &&
            (() => {
              const student = studentsList.find(
                (s) => s.id === selectedStudent,
              );
              const studentGrades = gradeRecords.filter(
                (r) => r.studentId === selectedStudent,
              );

              if (!student) return null;

              return (
                <>
                  <div className="flex items-center gap-4 border-border border-b pb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <span className="font-medium text-lg">
                        {student.firstName?.[0]}
                        {student.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-muted-foreground">
                        {student.admissionNumber}
                      </p>
                    </div>
                  </div>
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {studentGrades.length === 0 ? (
                      <p className="py-4 text-center text-muted-foreground">
                        No grades recorded
                      </p>
                    ) : (
                      studentGrades.map((grade) => (
                        <div
                          key={grade.id}
                          className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
                        >
                          <div>
                            <p className="font-medium">{grade.subject}</p>
                            <p className="text-muted-foreground text-sm">
                              {grade.examType} - {grade.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {grade.score}/{grade.maxScore}
                            </p>
                            <span
                              className={cn(
                                "text-sm",
                                grade.grade.startsWith("A")
                                  ? "text-primary"
                                  : grade.grade.startsWith("B")
                                    ? "text-chart-3"
                                    : "text-accent",
                              )}
                            >
                              {grade.grade}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              );
            })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>
              Close
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
