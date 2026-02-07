import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import {
  User,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Award,
  DollarSign,
  Library,
  TrendingUp,
  ChevronRight,
  Book,
  Bus,
  Home,
  Edit,
  Download,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/app/student-portal")({
  component: StudentPortal,
});

function StudentPortal() {
  const { user, hasRole } = useAuth();

  if (!hasRole(["student", "admin"])) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
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
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors w-fit group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Portal</h1>
            <p className="text-gray-600 text-lg">
              Welcome back, <span className="font-semibold text-gray-900">{studentData.personal.name}</span>!
            </p>
          </div>

          <Button
            size="sm"
            className="bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Profile
          </Button>
        </div>
      </div>

      {/* Personal Info Card */}
      <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              Personal Information
            </CardTitle>

            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 text-primary"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg ring-4 ring-primary/20">
                {studentData.personal.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {studentData.personal.name}
                </h3>
                <p className="text-gray-600">
                  {studentData.personal.class} - Roll No:{" "}
                  {studentData.personal.rollNumber}
                </p>
                <p className="text-sm text-gray-500">
                  {studentData.personal.house} House
                </p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Admission No.</p>
                <p className="font-medium">
                  {studentData.personal.admissionNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <p className="font-medium">{studentData.personal.bloodGroup}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{studentData.personal.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{studentData.personal.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card >

      {/* Quick Stats */}
      < div className="grid grid-cols-2 md:grid-cols-4 gap-4" >
        <Card className="border-2 hover:shadow-lg transition-all cursor-pointer group hover:border-green-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{averageMarks.toFixed(1)}%</p>
                <p className="text-sm font-medium text-gray-600">Average Marks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-lg transition-all cursor-pointer group hover:border-blue-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {studentData.attendance.percentage}%
                </p>
                <p className="text-sm font-medium text-gray-600">Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-lg transition-all cursor-pointer group hover:border-purple-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {studentData.libraryBooks.length}
                </p>
                <p className="text-sm font-medium text-gray-600">Library Books</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-lg transition-all cursor-pointer group hover:border-orange-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{(paidFees / 1000).toFixed(1)}K
                </p>
                <p className="text-sm font-medium text-gray-600">Fees Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div >

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subjects & Performance */}
        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                Subjects & Performance
              </CardTitle>
              <Link
                to="/app/exams"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentData.subjects.map((subject, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-sm text-gray-500">{subject.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {subject.marks}/{subject.maxMarks}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${subject.marks >= 90
                        ? "bg-green-100 text-green-700"
                        : subject.marks >= 75
                          ? "bg-blue-100 text-blue-700"
                          : subject.marks >= 60
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
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
        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                Today&apos;s Timetable
              </CardTitle>
              <Link
                to="/app/schedule"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                Full Schedule <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {studentData.timetable.map((period, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2 rounded-lg ${["Assembly", "Break", "Lunch"].includes(period.period)
                    ? "bg-gray-100"
                    : "bg-blue-50"
                    }`}
                >
                  <span className="text-sm font-medium text-gray-600 w-20">
                    {period.time}
                  </span>
                  <span className="flex-1 font-medium">{period.period}</span>
                  {period.room !== "-" && (
                    <span className="text-sm text-gray-500">{period.room}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Homework */}
        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Homework & Assignments
              </CardTitle>
              <Link
                to="/app/gradebook"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
              >
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentData.homework.map((hw, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{hw.title}</p>
                    <p className="text-sm text-gray-500">
                      {hw.subject} • Due: {hw.dueDate}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${hw.status === "submitted"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
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
        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                Fee Status
              </CardTitle>
              <Link
                to="/app/fees"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                Pay Fees <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Paid: ₹{paidFees.toLocaleString()}</span>
                <span>Total: ₹{totalFees.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(paidFees / totalFees) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              {studentData.fees.map((fee, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span>{fee.type}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${fee.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
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
        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Library className="w-4 h-4 text-white" />
                </div>
                Library Books
              </CardTitle>
              <Link
                to="/app/library"
                className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
              >
                Browse Library <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentData.libraryBooks.map((book, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg"
                >
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-500">Due: {book.dueDate}</span>
                    <span className="text-amber-600 font-medium">
                      {book.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transport Info */}
        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
                  <Bus className="w-4 h-4 text-white" />
                </div>
                Transport Details
              </CardTitle>
              <Link
                to="/app/transport"
                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
              >
                Track Bus <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Route</p>
                <p className="font-medium">{studentData.transport.route}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stop</p>
                <p className="font-medium">{studentData.transport.stop}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pickup Time</p>
                <p className="font-medium">
                  {studentData.transport.pickupTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Drop Time</p>
                <p className="font-medium">{studentData.transport.dropTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Driver</p>
                <p className="font-medium">
                  {studentData.transport.driverName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium">
                  {studentData.transport.vehicleNumber}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div >
  );
}
