import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  ClipboardList,
  ExternalLink,
  FileText,
  MessageSquare,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/app/teacher-portal")({
  component: TeacherPortal,
});

function TeacherPortal() {
  const { user, hasRole } = useAuth();
  const [selectedClass, setSelectedClass] = useState("Class 9-A");

  if (!hasRole(["teacher", "admin"])) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 font-bold text-foreground text-xl">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            This portal is only available for teachers and staff.
          </p>
        </div>
      </div>
    );
  }

  const mockTeacher = {
    name: user?.name || "John Smith",
    qualification: "M.Sc Mathematics, B.Ed",
    subjects: ["Mathematics", "Physics"],
    classes: ["Class 9-A", "Class 10-B", "Class 11-A"],
    experience: "8 years",
    email: "john.smith@school.com",
    phone: "+91 98765 43210",
  };

  const mockStudents = [
    { id: "1", name: "Rahul Sharma", rollNumber: "ADM-001", attendance: 93 },
    { id: "2", name: "Priya Patel", rollNumber: "ADM-002", attendance: 97 },
    { id: "3", name: "Amit Kumar", rollNumber: "ADM-003", attendance: 85 },
    { id: "4", name: "Sneha Gupta", rollNumber: "ADM-004", attendance: 91 },
    { id: "5", name: "Vikash Singh", rollNumber: "ADM-005", attendance: 88 },
  ];

  const mockClasses = [
    {
      id: "9-A",
      name: "Class 9-A",
      strength: 42,
      averageMarks: 78.5,
      averageAttendance: 92,
    },
    {
      id: "10-B",
      name: "Class 10-B",
      strength: 38,
      averageMarks: 82.3,
      averageAttendance: 89,
    },
    {
      id: "11-A",
      name: "Class 11-A",
      strength: 35,
      averageMarks: 75.8,
      averageAttendance: 94,
    },
  ];

  const mockTimetable = [
    {
      time: "08:00 AM",
      period: "Mathematics",
      class: "Class 9-A",
      room: "Room 101",
    },
    {
      time: "09:00 AM",
      period: "Mathematics",
      class: "Class 10-B",
      room: "Room 102",
    },
    { time: "10:00 AM", period: "Break", class: "", room: "" },
    { time: "10:15 AM", period: "Physics", class: "Class 11-A", room: "Lab 1" },
    {
      time: "11:15 AM",
      period: "Mathematics",
      class: "Class 9-A",
      room: "Room 101",
    },
    { time: "12:15 PM", period: "Lunch", class: "", room: "" },
    {
      time: "01:00 PM",
      period: "Physics Lab",
      class: "Class 10-B",
      room: "Lab 2",
    },
  ];

  const mockAssignments = [
    {
      id: "1",
      title: "Linear Equations Worksheet",
      class: "Class 9-A",
      subject: "Mathematics",
      dueDate: "2026-01-25",
      submitted: 28,
      total: 42,
    },
    {
      id: "2",
      title: "Motion Lab Report",
      class: "Class 10-B",
      subject: "Physics",
      dueDate: "2026-01-22",
      submitted: 35,
      total: 38,
    },
    {
      id: "3",
      title: "Quadratic Equations Test",
      class: "Class 9-A",
      subject: "Mathematics",
      dueDate: "2026-01-30",
      submitted: 0,
      total: 42,
    },
  ];

  const mockExams = [
    {
      title: "Mathematics Unit Test",
      class: "Class 9-A",
      date: "2026-02-05",
      time: "10:00 AM",
      status: "scheduled",
    },
    {
      title: "Physics Mid Term",
      class: "Class 10-B",
      date: "2026-02-10",
      time: "09:00 AM",
      status: "scheduled",
    },
  ];

  const selectedClassData = mockClasses.find((c) => c.name === selectedClass);

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex flex-col gap-4">
        <Link
          to="/app"
          className="group inline-flex w-fit items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-primary"
        >
          <ArrowLeft className="group-hover:-translate-x-1 h-4 w-4 transition-transform" />
          Back to Dashboard
        </Link>
        <div>
          <h1 className="mb-2 font-bold text-3xl text-foreground">
            Teacher Portal
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your classes, attendance, and academic activities
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="border-2 shadow-lg transition-all hover:shadow-xl lg:col-span-3">
          <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              Teacher Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-bold text-2xl text-primary-foreground shadow-lg ring-4 ring-primary/20">
                {mockTeacher.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-xl">
                  {mockTeacher.name}
                </h3>
                <p className="text-muted-foreground">
                  {mockTeacher.qualification}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mockTeacher.subjects.map((subject, i) => (
                    <span
                      key={i}
                      className="rounded bg-primary/10 px-2 py-1 text-primary text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Experience</p>
                    <p className="font-medium">{mockTeacher.experience}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Classes</p>
                    <p className="font-medium">
                      {mockTeacher.classes.length} classes
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Email</p>
                    <p className="font-medium text-sm">{mockTeacher.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Phone</p>
                    <p className="font-medium">{mockTeacher.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BarChart3 className="h-4 w-4 text-background" />
              </div>
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Students</span>
                <span className="font-bold">115</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Classes Today</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Pending Assignments
                </span>
                <span className="font-bold text-warning">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Upcoming Exams</span>
                <span className="font-bold text-destructive">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-2 shadow-md transition-all hover:shadow-xl lg:col-span-2">
          <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Calendar className="h-4 w-4 text-primary-foreground" />
                </div>
                Today&apos;s Timetable
              </CardTitle>
              <Link
                to="/app/schedule"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary/80"
              >
                Full Schedule <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockTimetable.map((period, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-lg p-3 ${
                    period.period === "Break" || period.period === "Lunch"
                      ? "bg-muted"
                      : "bg-success/15"
                  }`}
                >
                  <span className="w-20 font-medium text-muted-foreground text-sm">
                    {period.time}
                  </span>
                  <div className="flex-1">
                    <span className="font-medium">{period.period}</span>
                    {period.class && (
                      <span className="ml-2 text-muted-foreground text-sm">
                        ({period.class})
                      </span>
                    )}
                  </div>
                  {period.room && (
                    <span className="text-muted-foreground text-sm">
                      {period.room}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-card">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Users className="h-4 w-4 text-background" />
                </div>
                My Classes
              </CardTitle>
              <Link
                to="/app/classes"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary/80"
              >
                View All <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockClasses.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.name)}
                  className={`flex w-full flex-col rounded-lg p-3 text-left transition-colors ${
                    selectedClass === cls.name
                      ? "border-2 border-success/30 bg-success/15"
                      : "bg-muted hover:bg-muted"
                  }`}
                >
                  <span className="flex w-full items-center justify-between">
                    <span className="font-medium">{cls.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {cls.strength} students
                    </span>
                  </span>
                  <span className="mt-1 flex w-full gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Avg: {cls.averageMarks}%
                    </span>
                    <span className="text-muted-foreground">
                      Att: {cls.averageAttendance}%
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-destructive/90">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <ClipboardList className="h-4 w-4 text-background" />
                </div>
                Class Students - {selectedClass}
              </CardTitle>
              <Link
                to="/app/students"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary"
              >
                View All <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-lg bg-muted p-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-muted-foreground text-xs">
                        Roll: {student.rollNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-1 text-sm ${
                        student.attendance >= 90
                          ? "bg-success/15 text-success"
                          : student.attendance >= 80
                            ? "bg-warning/15 text-warning"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {student.attendance}%
                    </span>
                    <Link to="/app/notifications">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-warning to-warning/90">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning">
                  <FileText className="h-4 w-4 text-background" />
                </div>
                Assignments
              </CardTitle>
              <Link
                to="/app/gradebook"
                className="flex items-center gap-1 font-medium text-sm text-warning hover:text-warning"
              >
                Manage <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAssignments.map((assignment) => (
                <div key={assignment.id} className="rounded-lg bg-muted p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {assignment.class} • {assignment.subject}
                      </p>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      Due: {assignment.dueDate}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Submissions</span>
                      <span>
                        {assignment.submitted}/{assignment.total}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-success"
                        style={{
                          width: `${(assignment.submitted / assignment.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Award className="h-4 w-4 text-background" />
                </div>
                Upcoming Exams
              </CardTitle>
              <Link
                to="/app/exams"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary"
              >
                Schedule <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockExams.map((exam, i) => (
                <div
                  key={i}
                  className="rounded-lg border-primary border-l-4 bg-primary/5 p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{exam.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {exam.class}
                      </p>
                    </div>
                    <span className="font-medium text-primary text-sm">
                      {exam.date}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {exam.time} • {exam.status}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start">
                <ClipboardList className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
              <Button variant="outline" className="justify-start">
                <Award className="mr-2 h-4 w-4" />
                Upload Marks
              </Button>
              <Button variant="outline" className="justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Notice
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Exam
              </Button>
              <Button variant="outline" className="justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
