import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Book,
  BookOpen,
  Bus,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  FileText,
  Library,
  TrendingUp,
  User,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/app/student-portal")({
  component: StudentPortal,
});

function StudentPortal() {
  const { user, hasRole } = useAuth();

  if (!hasRole(["student", "admin"])) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <User className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 font-bold text-foreground text-xl">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            This portal is only available for students.
          </p>
        </div>
      </div>
    );
  }

  const studentData = {
    personal: {
      name: "Rahul Sharma",
      class: "Class 9-A",
      section: "A",
      rollNumber: "ADM-001",
      admissionNumber: "2024-ADM-001",
      admissionDate: "2024-04-15",
      house: "Sapphire House",
      bloodGroup: "O+",
      phone: "+91 98765 43210",
      email: "rahul.sharma@email.com",
      dob: "2008-05-15",
      address: "123, Main Street, City - 123456",
    },
    attendance: {
      present: 42,
      absent: 3,
      late: 2,
      total: 47,
      percentage: 89.4,
      monthly: [
        { month: "Jul", present: 20, total: 22 },
        { month: "Aug", present: 21, total: 23 },
        { month: "Sep", present: 19, total: 21 },
        { month: "Oct", present: 22, total: 22 },
        { month: "Nov", present: 18, total: 20 },
        { month: "Dec", present: 20, total: 21 },
      ],
    },
    subjects: [
      {
        name: "Mathematics",
        teacher: "Mr. John Smith",
        marks: 85,
        grade: "A",
        maxMarks: 100,
        attendance: 95,
      },
      {
        name: "Physics",
        teacher: "Ms. Sarah Johnson",
        marks: 78,
        grade: "B+",
        maxMarks: 100,
        attendance: 92,
      },
      {
        name: "Chemistry",
        teacher: "Dr. Rajesh Kumar",
        marks: 82,
        grade: "A-",
        maxMarks: 100,
        attendance: 88,
      },
      {
        name: "English",
        teacher: "Ms. Priya Sharma",
        marks: 88,
        grade: "A",
        maxMarks: 100,
        attendance: 96,
      },
      {
        name: "Hindi",
        teacher: "Mr. Amit Patel",
        marks: 92,
        grade: "A+",
        maxMarks: 100,
        attendance: 98,
      },
      {
        name: "Computer Science",
        teacher: "Mr. Vikash Singh",
        marks: 95,
        grade: "A+",
        maxMarks: 100,
        attendance: 100,
      },
      {
        name: "Social Science",
        teacher: "Ms. Anjali Desai",
        marks: 80,
        grade: "A-",
        maxMarks: 100,
        attendance: 90,
      },
    ],
    exams: [
      {
        name: "Unit Test 1",
        subject: "Mathematics",
        date: "2025-07-15",
        marks: 85,
        maxMarks: 100,
        grade: "A",
      },
      {
        name: "Unit Test 1",
        subject: "Physics",
        date: "2025-07-18",
        marks: 78,
        maxMarks: 100,
        grade: "B+",
      },
      {
        name: "Half Yearly",
        subject: "Mathematics",
        date: "2025-09-01",
        marks: 82,
        maxMarks: 100,
        grade: "A-",
      },
      {
        name: "Half Yearly",
        subject: "Physics",
        date: "2025-09-05",
        marks: 75,
        maxMarks: 100,
        grade: "B",
      },
      {
        name: "Unit Test 2",
        subject: "Chemistry",
        date: "2025-11-10",
        marks: 88,
        maxMarks: 100,
        grade: "A",
      },
    ],
    homework: [
      {
        subject: "Mathematics",
        title: "Chapter 5 - Linear Equations",
        dueDate: "2026-01-25",
        status: "pending",
        maxMarks: 20,
      },
      {
        subject: "Physics",
        title: "Lab Report - Motion",
        dueDate: "2026-01-22",
        status: "submitted",
        maxMarks: 25,
      },
      {
        subject: "Chemistry",
        title: "Periodic Table Assignment",
        dueDate: "2026-01-28",
        status: "pending",
        maxMarks: 15,
      },
      {
        subject: "English",
        title: "Essay - My Dreams",
        dueDate: "2026-01-30",
        status: "pending",
        maxMarks: 30,
      },
    ],
    libraryBooks: [
      {
        title: "The Physics of the Future",
        author: "Michio Kaku",
        issueDate: "2026-01-10",
        dueDate: "2026-01-30",
        status: "Active",
      },
      {
        title: "Organic Chemistry",
        author: "Paula Yurkanis Bruice",
        issueDate: "2026-01-15",
        dueDate: "2026-02-05",
        status: "Active",
      },
    ],
    timetable: [
      { time: "07:30 AM", period: "Assembly", room: "Ground", day: "Mon-Fri" },
      {
        time: "08:00 AM",
        period: "Period 1 - Mathematics",
        room: "Room 101",
        day: "Mon-Fri",
      },
      {
        time: "09:00 AM",
        period: "Period 2 - Physics",
        room: "Lab 1",
        day: "Mon-Fri",
      },
      { time: "10:00 AM", period: "Break", room: "-", day: "Mon-Fri" },
      {
        time: "10:15 AM",
        period: "Period 3 - Chemistry",
        room: "Room 102",
        day: "Mon-Fri",
      },
      {
        time: "11:15 AM",
        period: "Period 4 - English",
        room: "Room 103",
        day: "Mon-Fri",
      },
      { time: "12:15 PM", period: "Lunch", room: "-", day: "Mon-Fri" },
      {
        time: "01:00 PM",
        period: "Period 5 - Hindi",
        room: "Room 101",
        day: "Mon-Fri",
      },
      {
        time: "02:00 PM",
        period: "Period 6 - Computer Science",
        room: "Lab 2",
        day: "Mon-Fri",
      },
    ],
    fees: [
      {
        type: "Tuition Fee",
        amount: 25000,
        status: "paid",
        paidDate: "2025-04-01",
        receipt: "RCP-001",
      },
      {
        type: "Transport Fee",
        amount: 12000,
        status: "paid",
        paidDate: "2025-04-01",
        receipt: "RCP-002",
      },
      {
        type: "Exam Fee",
        amount: 5000,
        status: "pending",
        dueDate: "2026-02-15",
        receipt: "-",
      },
      {
        type: "Library Fee",
        amount: 2000,
        status: "paid",
        paidDate: "2025-04-01",
        receipt: "RCP-003",
      },
    ],
    transport: {
      route: "Route 5 - North Zone",
      stop: "City Center",
      pickupTime: "07:15 AM",
      dropTime: "04:30 PM",
      driverName: "Mr. Suresh Kumar",
      driverPhone: "+91 98765 43211",
      vehicleNumber: "GJ-01-AB-1234",
    },
  };

  const totalFees = studentData.fees.reduce((acc, fee) => acc + fee.amount, 0);
  const paidFees = studentData.fees
    .filter((f) => f.status === "paid")
    .reduce((acc, fee) => acc + fee.amount, 0);
  const averageMarks =
    studentData.subjects.reduce((acc, sub) => acc + sub.marks, 0) /
    studentData.subjects.length;

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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 font-bold text-3xl text-foreground">
              Student Portal
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome back,{" "}
              <span className="font-semibold text-foreground">
                {studentData.personal.name}
              </span>
              !
            </p>
          </div>

          <Button
            size="sm"
            className="bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Profile
          </Button>
        </div>
      </div>

      {/* Personal Info Card */}
      <Card className="border-2 shadow-lg transition-shadow hover:shadow-xl">
        <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-primary/5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              Personal Information
            </CardTitle>

            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10"
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-bold text-2xl text-primary-foreground shadow-lg ring-4 ring-primary/20">
                {studentData.personal.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {studentData.personal.name}
                </h3>
                <p className="text-muted-foreground">
                  {studentData.personal.class} - Roll No:{" "}
                  {studentData.personal.rollNumber}
                </p>
                <p className="text-muted-foreground text-sm">
                  {studentData.personal.house} House
                </p>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-muted-foreground text-sm">Admission No.</p>
                <p className="font-medium">
                  {studentData.personal.admissionNumber}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Blood Group</p>
                <p className="font-medium">{studentData.personal.bloodGroup}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Phone</p>
                <p className="font-medium">{studentData.personal.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">{studentData.personal.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="group cursor-pointer border-2 transition-all hover:border-success/30 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success to-success/90 shadow-md transition-transform group-hover:scale-110">
                <TrendingUp className="h-6 w-6 text-background" />
              </div>
              <div>
                <p className="font-bold text-3xl text-foreground">
                  {averageMarks.toFixed(1)}%
                </p>
                <p className="font-medium text-muted-foreground text-sm">
                  Average Marks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group cursor-pointer border-2 transition-all hover:border-primary/30 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/90 shadow-md transition-transform group-hover:scale-110">
                <Calendar className="h-6 w-6 text-background" />
              </div>
              <div>
                <p className="font-bold text-3xl text-foreground">
                  {studentData.attendance.percentage}%
                </p>
                <p className="font-medium text-muted-foreground text-sm">
                  Attendance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group cursor-pointer border-2 transition-all hover:border-primary/30 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/90 shadow-md transition-transform group-hover:scale-110">
                <Book className="h-6 w-6 text-background" />
              </div>
              <div>
                <p className="font-bold text-3xl text-foreground">
                  {studentData.libraryBooks.length}
                </p>
                <p className="font-medium text-muted-foreground text-sm">
                  Library Books
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group cursor-pointer border-2 transition-all hover:border-warning/30 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-warning to-warning/90 shadow-md transition-transform group-hover:scale-110">
                <DollarSign className="h-6 w-6 text-background" />
              </div>
              <div>
                <p className="font-bold text-3xl text-foreground">
                  ₹{(paidFees / 1000).toFixed(1)}K
                </p>
                <p className="font-medium text-muted-foreground text-sm">
                  Fees Paid
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subjects & Performance */}
        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <BookOpen className="h-4 w-4 text-primary-foreground" />
                </div>
                Subjects & Performance
              </CardTitle>
              <Link
                to="/app/exams"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary"
              >
                View All <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentData.subjects.map((subject, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-muted p-3"
                >
                  <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {subject.teacher}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {subject.marks}/{subject.maxMarks}
                    </p>
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        subject.marks >= 90
                          ? "bg-success/15 text-success"
                          : subject.marks >= 75
                            ? "bg-primary/10 text-primary"
                            : subject.marks >= 60
                              ? "bg-warning/15 text-warning"
                              : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {subject.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Timetable */}
        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Clock className="h-4 w-4 text-background" />
                </div>
                Today&apos;s Timetable
              </CardTitle>
              <Link
                to="/app/schedule"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary"
              >
                Full Schedule <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {studentData.timetable.map((period, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 rounded-lg p-2 ${
                    ["Assembly", "Break", "Lunch"].includes(period.period)
                      ? "bg-muted"
                      : "bg-primary/5"
                  }`}
                >
                  <span className="w-20 font-medium text-muted-foreground text-sm">
                    {period.time}
                  </span>
                  <span className="flex-1 font-medium">{period.period}</span>
                  {period.room !== "-" && (
                    <span className="text-muted-foreground text-sm">
                      {period.room}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Homework */}
        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-warning to-warning/90">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning">
                  <FileText className="h-4 w-4 text-background" />
                </div>
                Homework & Assignments
              </CardTitle>
              <Link
                to="/app/gradebook"
                className="flex items-center gap-1 font-medium text-sm text-warning hover:text-warning"
              >
                View All <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentData.homework.map((hw, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-muted p-3"
                >
                  <div>
                    <p className="font-medium">{hw.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {hw.subject} • Due: {hw.dueDate}
                    </p>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      hw.status === "submitted"
                        ? "bg-success/15 text-success"
                        : "bg-warning/15 text-warning"
                    }`}
                  >
                    {hw.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fee Status */}
        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-primary/15 to-card">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <DollarSign className="h-4 w-4 text-background" />
                </div>
                Fee Status
              </CardTitle>
              <Link
                to="/app/fees"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary"
              >
                Pay Fees <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-sm">
                <span>Paid: ₹{paidFees.toLocaleString()}</span>
                <span>Total: ₹{totalFees.toLocaleString()}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-success"
                  style={{ width: `${(paidFees / totalFees) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              {studentData.fees.map((fee, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-muted p-2"
                >
                  <span>{fee.type}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      fee.status === "paid"
                        ? "bg-success/15 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {fee.status === "paid"
                      ? `₹${fee.amount.toLocaleString()} (Paid)`
                      : `₹${fee.amount.toLocaleString()} (Due)`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Library Books */}
        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Library className="h-4 w-4 text-background" />
                </div>
                Library Books
              </CardTitle>
              <Link
                to="/app/library"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary"
              >
                Browse Library <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentData.libraryBooks.map((book, idx) => (
                <div
                  key={idx}
                  className="rounded-r-lg border-warning/30 border-l-4 bg-warning/15 p-3"
                >
                  <p className="font-medium">{book.title}</p>
                  <p className="text-muted-foreground text-sm">{book.author}</p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Due: {book.dueDate}
                    </span>
                    <span className="font-medium text-warning">
                      {book.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transport Info */}
        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Bus className="h-4 w-4 text-background" />
                </div>
                Transport Details
              </CardTitle>
              <Link
                to="/app/transport"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary"
              >
                Track Bus <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Route</p>
                <p className="font-medium">{studentData.transport.route}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Stop</p>
                <p className="font-medium">{studentData.transport.stop}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Pickup Time</p>
                <p className="font-medium">
                  {studentData.transport.pickupTime}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Drop Time</p>
                <p className="font-medium">{studentData.transport.dropTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Driver</p>
                <p className="font-medium">
                  {studentData.transport.driverName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Vehicle</p>
                <p className="font-medium">
                  {studentData.transport.vehicleNumber}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
