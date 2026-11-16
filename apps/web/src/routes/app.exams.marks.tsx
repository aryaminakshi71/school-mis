/**
 * Marks Entry Management - Enter and manage student examination marks
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Calendar, FileText, MapPin, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/exams/marks")({
  component: MarksEntryPage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/exams", icon: FileText },
  { name: "Exam Types", href: "/app/exams/types", icon: BookOpen },
  { name: "Schedule", href: "/app/exams/schedule", icon: Calendar },
  { name: "Hall Allocation", href: "/app/exams/halls", icon: MapPin },
  {
    name: "Marks Entry",
    href: "/app/exams/marks",
    icon: BookOpen,
    active: true,
  },
  { name: "Results", href: "/app/exams/results", icon: BookOpen },
  { name: "Report Cards", href: "/app/exams/reports", icon: FileText },
];

interface StudentMark {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  marks: number | null;
  grade: string;
  status: "pending" | "entered" | "verified";
  remarks?: string;
}

interface ExamSession {
  id: string;
  examName: string;
  subject: string;
  class: string;
  date: string;
  maxMarks: number;
  passingMarks: number;
  students: StudentMark[];
  status: "in-progress" | "completed" | "published";
}

function MarksEntryPage() {
  const [examSessions, setExamSessions] = useState<ExamSession[]>([
    {
      id: "1",
      examName: "Mathematics UT-3",
      subject: "Mathematics",
      class: "Class 10-A",
      date: "2026-01-25",
      maxMarks: 50,
      passingMarks: 20,
      status: "in-progress",
      students: [
        {
          id: "1",
          studentId: "STU001",
          studentName: "Rahul Sharma",
          rollNumber: "101",
          marks: 42,
          grade: "A",
          status: "entered",
        },
        {
          id: "2",
          studentId: "STU002",
          studentName: "Priya Singh",
          rollNumber: "102",
          marks: 38,
          grade: "B+",
          status: "entered",
        },
        {
          id: "3",
          studentId: "STU003",
          studentName: "Amit Kumar",
          rollNumber: "103",
          marks: null,
          grade: "",
          status: "pending",
        },
        {
          id: "4",
          studentId: "STU004",
          studentName: "Sneha Patel",
          rollNumber: "104",
          marks: 45,
          grade: "A",
          status: "verified",
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
      status: "completed",
      students: [
        {
          id: "5",
          studentId: "STU001",
          studentName: "Rahul Sharma",
          rollNumber: "101",
          marks: 40,
          grade: "A",
          status: "verified",
        },
        {
          id: "6",
          studentId: "STU002",
          studentName: "Priya Singh",
          rollNumber: "102",
          marks: 35,
          grade: "B",
          status: "verified",
        },
      ],
    },
  ]);

  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(
    null,
  );
  const [isBulkEntryOpen, setIsBulkEntryOpen] = useState(false);
  const [bulkMarks, setBulkMarks] = useState("");

  const calculateGrade = (marks: number, maxMarks: number): string => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C+";
    if (percentage >= 40) return "C";
    return "F";
  };

  const handleMarkEntry = (studentId: string, marks: string) => {
    if (!selectedSession) return;

    const markValue = marks === "" ? null : parseFloat(marks);
    if (
      markValue !== null &&
      (markValue < 0 || markValue > selectedSession.maxMarks)
    ) {
      toast.error(`Marks must be between 0 and ${selectedSession.maxMarks}`);
      return;
    }

    setExamSessions((prev) =>
      prev.map((session) =>
        session.id === selectedSession.id
          ? {
              ...session,
              students: session.students.map((student) =>
                student.id === studentId
                  ? {
                      ...student,
                      marks: markValue,
                      grade:
                        markValue !== null
                          ? calculateGrade(markValue, session.maxMarks)
                          : "",
                      status: markValue !== null ? "entered" : "pending",
                    }
                  : student,
              ),
            }
          : session,
      ),
    );
  };

  const handleBulkEntry = () => {
    if (!selectedSession || !bulkMarks.trim()) {
      toast.error("Please enter marks data");
      return;
    }

    const lines = bulkMarks.trim().split("\n");
    const updates: { rollNumber: string; marks: number }[] = [];

    for (const line of lines) {
      const [rollNumber, marksStr] = line.split(",").map((s) => s.trim());
      const marks = parseFloat(marksStr);

      if (!rollNumber || isNaN(marks)) {
        toast.error(
          `Invalid format in line: ${line}. Use format: rollNumber,marks`,
        );
        return;
      }

      if (marks < 0 || marks > selectedSession.maxMarks) {
        toast.error(
          `Marks ${marks} out of range for roll number ${rollNumber}`,
        );
        return;
      }

      updates.push({ rollNumber, marks });
    }

    setExamSessions((prev) =>
      prev.map((session) =>
        session.id === selectedSession.id
          ? {
              ...session,
              students: session.students.map((student) => {
                const update = updates.find(
                  (u) => u.rollNumber === student.rollNumber,
                );
                if (update) {
                  return {
                    ...student,
                    marks: update.marks,
                    grade: calculateGrade(update.marks, session.maxMarks),
                    status: "entered" as const,
                  };
                }
                return student;
              }),
            }
          : session,
      ),
    );

    setIsBulkEntryOpen(false);
    setBulkMarks("");
    toast.success("Bulk marks entered successfully");
  };

  const publishResults = (sessionId: string) => {
    setExamSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              status: "published",
              students: session.students.map((student) => ({
                ...student,
                status: "verified",
              })),
            }
          : session,
      ),
    );
    toast.success("Results published successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "entered":
        return "bg-blue-100 text-blue-800";
      case "verified":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "published":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
          <h1 className="font-bold text-3xl">Marks Entry</h1>
          <p className="text-muted-foreground">
            Enter and manage student examination marks
          </p>
        </div>
      </div>

      {/* Exam Sessions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {examSessions.map((session) => (
          <Card
            key={session.id}
            className={`cursor-pointer transition-colors ${
              selectedSession?.id === session.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedSession(session)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{session.examName}</CardTitle>
              <Badge className={getSessionStatusColor(session.status)}>
                {session.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Subject:</strong> {session.subject}
                </p>
                <p>
                  <strong>Class:</strong> {session.class}
                </p>
                <p>
                  <strong>Date:</strong> {session.date}
                </p>
                <p>
                  <strong>Max Marks:</strong> {session.maxMarks}
                </p>
                <div className="flex justify-between">
                  <span>Students:</span>
                  <span>
                    {
                      session.students.filter((s) => s.status !== "pending")
                        .length
                    }{" "}
                    / {session.students.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Marks Entry Interface */}
      {selectedSession && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedSession.examName} - Marks Entry</CardTitle>
                <p className="text-muted-foreground">
                  {selectedSession.subject} • {selectedSession.class} • Max
                  Marks: {selectedSession.maxMarks}
                </p>
              </div>
              <div className="flex space-x-2">
                <Dialog
                  open={isBulkEntryOpen}
                  onOpenChange={setIsBulkEntryOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">Bulk Entry</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bulk Marks Entry</DialogTitle>
                      <DialogDescription>
                        Enter marks in CSV format: rollNumber,marks (one per
                        line)
                        <br />
                        Example:
                        <br />
                        101,42
                        <br />
                        102,38
                        <br />
                        103,45
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <textarea
                        className="h-48 w-full rounded-md border p-2"
                        value={bulkMarks}
                        onChange={(e) => setBulkMarks(e.target.value)}
                        placeholder="101,42&#10;102,38&#10;103,45"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsBulkEntryOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleBulkEntry}>Import Marks</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {selectedSession.status === "completed" && (
                  <Button onClick={() => publishResults(selectedSession.id)}>
                    Publish Results
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedSession.students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-4">
                    <User className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{student.studentName}</p>
                      <p className="text-muted-foreground text-sm">
                        Roll: {student.rollNumber} • ID: {student.studentId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={student.marks ?? ""}
                        onChange={(e) =>
                          handleMarkEntry(student.id, e.target.value)
                        }
                        className="w-20"
                        min="0"
                        max={selectedSession.maxMarks}
                        placeholder="Marks"
                      />
                      <span className="text-muted-foreground text-sm">
                        / {selectedSession.maxMarks}
                      </span>
                    </div>
                    <Badge className={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                    {student.grade && (
                      <Badge variant="outline" className="font-bold">
                        {student.grade}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border p-4 text-center">
                <div className="font-bold text-2xl">
                  {
                    selectedSession.students.filter(
                      (s) => s.status !== "pending",
                    ).length
                  }
                </div>
                <p className="text-muted-foreground text-sm">Marks Entered</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="font-bold text-2xl">
                  {
                    selectedSession.students.filter(
                      (s) =>
                        s.marks !== null &&
                        s.marks! >= selectedSession.passingMarks,
                    ).length
                  }
                </div>
                <p className="text-muted-foreground text-sm">Passed</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="font-bold text-2xl">
                  {selectedSession.students.reduce(
                    (sum, s) => sum + (s.marks || 0),
                    0,
                  ) /
                    Math.max(
                      1,
                      selectedSession.students.filter((s) => s.marks !== null)
                        .length,
                    )}
                  .toFixed(1)
                </div>
                <p className="text-muted-foreground text-sm">Average</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="font-bold text-2xl">
                  {Math.max(
                    ...selectedSession.students.map((s) => s.marks || 0),
                  )}
                </div>
                <p className="text-muted-foreground text-sm">Highest</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
