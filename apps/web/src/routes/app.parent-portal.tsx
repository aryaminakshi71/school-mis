import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  Bus,
  DollarSign,
  ExternalLink,
  FileText,
  Home,
  Mail,
  MessageSquare,
  Phone,
  Send,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/app/parent-portal")({
  component: ParentPortal,
});

function ParentPortal() {
  const { user, hasRole } = useAuth();

  if (!hasRole(["parent", "admin", "student"])) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <User className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 font-bold text-foreground text-xl">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            This portal is only available for parents and students.
          </p>
        </div>
      </div>
    );
  }

  const [selectedChild, setSelectedChild] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  const mockChildren = [
    {
      id: "1",
      name: "John Smith",
      class: "Class 9-A",
      rollNumber: "ADM-001",
      section: "A",
      admissionDate: "2024-04-15",
      dateOfBirth: "2010-05-15",
      bloodGroup: "O+",
      emergencyContact: "+91 98765 43210",
    },
    {
      id: "2",
      name: "Emma Smith",
      class: "Class 7-B",
      rollNumber: "ADM-015",
      section: "B",
      admissionDate: "2024-06-20",
      dateOfBirth: "2012-08-22",
      bloodGroup: "O+",
      emergencyContact: "+91 98765 43210",
    },
  ];

  const mockAttendance = [
    {
      month: "January 2026",
      present: 20,
      absent: 2,
      total: 22,
      percentage: 90.9,
    },
    {
      month: "December 2025",
      present: 21,
      absent: 1,
      total: 22,
      percentage: 95.5,
    },
  ];

  const mockFees = {
    total: 50000,
    paid: 35000,
    pending: 15000,
    dueDate: "2026-02-15",
    paymentHistory: [
      { date: "2026-01-15", amount: 10000, receipt: "REC-001" },
      { date: "2025-10-10", amount: 15000, receipt: "REC-002" },
      { date: "2025-06-20", amount: 10000, receipt: "REC-003" },
    ],
  };

  const mockExams = [
    {
      name: "Mathematics Unit Test",
      date: "2026-01-25",
      marks: 85,
      maxMarks: 100,
      grade: "A",
      percentage: 85,
    },
    {
      name: "Physics Mid Term",
      date: "2026-01-20",
      marks: 78,
      maxMarks: 100,
      grade: "B+",
      percentage: 78,
    },
    { name: "Chemistry Quarterly", date: "2026-02-01", status: "Upcoming" },
    {
      name: "English Essay",
      date: "2026-01-10",
      marks: 92,
      maxMarks: 100,
      grade: "A+",
      percentage: 92,
    },
  ];

  const mockHomework = [
    {
      id: "1",
      subject: "Mathematics",
      title: "Linear Equations Worksheet",
      dueDate: "2026-01-25",
      status: "pending",
      description: "Complete exercises 1-20 from Chapter 5",
      teacher: "Dr. Rajesh Kumar",
    },
    {
      id: "2",
      subject: "Physics",
      title: "Motion Lab Report",
      dueDate: "2026-01-22",
      status: "submitted",
      description: "Submit lab report on uniformly accelerated motion",
      teacher: "Mrs. Priya Sharma",
    },
    {
      id: "3",
      subject: "Chemistry",
      title: "Periodic Table Memorization",
      dueDate: "2026-01-28",
      status: "pending",
      description: "Memorize first 20 elements with atomic numbers",
      teacher: "Mr. Vikram Patel",
    },
  ];

  const mockLibraryBooks = [
    {
      id: "1",
      title: "The Adventures of Sherlock Holmes",
      author: "Arthur Conan Doyle",
      issueDate: "2026-01-10",
      dueDate: "2026-01-24",
      status: "Active",
    },
    {
      id: "2",
      title: "NCERT Mathematics Class 9",
      author: "NCERT",
      issueDate: "2026-01-15",
      dueDate: "2026-01-29",
      status: "Active",
    },
  ];

  const mockTransport = {
    route: "Route 5 - North Campus",
    stop: "Main Market, Sector 15",
    pickupTime: "07:15 AM",
    dropTime: "04:30 PM",
    driverName: "Mr. Suresh Kumar",
    driverPhone: "+91 98765 43220",
    vehicleNumber: "HR-26-A-1234",
  };

  const mockNotices = [
    {
      id: "1",
      title: "Parent-Teacher Meeting",
      date: "2026-01-28",
      message:
        "PTM scheduled for next Saturday at 10 AM. Please confirm your attendance.",
      priority: "high",
    },
    {
      id: "2",
      title: "Holiday Notice",
      date: "2026-01-26",
      message: "School will remain closed on Republic Day (January 26th).",
      priority: "normal",
    },
    {
      id: "3",
      title: "Annual Sports Day",
      date: "2026-02-05",
      message:
        "Annual sports day will be held on February 5th. Parents are cordially invited.",
      priority: "normal",
    },
  ];

  const mockTeachers = [
    {
      name: "Dr. Rajesh Kumar",
      subject: "Mathematics",
      phone: "+91 98765 43210",
      email: "rajesh@school.edu",
    },
    {
      name: "Mrs. Priya Sharma",
      subject: "Physics",
      phone: "+91 98765 43211",
      email: "priya@school.edu",
    },
    {
      name: "Mr. Vikram Patel",
      subject: "Chemistry",
      phone: "+91 98765 43214",
      email: "vikram@school.edu",
    },
  ];

  const mockSubjectPerformance = [
    {
      subject: "Mathematics",
      marks: 85,
      grade: "A",
      teacher: "Dr. Rajesh Kumar",
    },
    {
      subject: "Physics",
      marks: 78,
      grade: "B+",
      teacher: "Mrs. Priya Sharma",
    },
    {
      subject: "Chemistry",
      marks: 82,
      grade: "A-",
      teacher: "Mr. Vikram Patel",
    },
    { subject: "English", marks: 88, grade: "A", teacher: "Ms. Ananya Gupta" },
    {
      subject: "Biology",
      marks: 75,
      grade: "B+",
      teacher: "Mrs. Priya Sharma",
    },
  ];

  const currentChild = mockChildren[selectedChild];

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
            Parent Portal
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your child&apos;s progress and school activities
          </p>
        </div>
      </div>

      {mockChildren.length > 1 && (
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {mockChildren.map((child, index) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(index)}
                className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-2 transition-colors ${
                  selectedChild === index
                    ? "border-2 border-primary bg-primary/10"
                    : "border-2 border-transparent bg-muted hover:bg-muted"
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm">
                  {child.name.charAt(0)}
                </span>
                <span className="text-left">
                  <span className="block font-medium text-sm">
                    {child.name}
                  </span>
                  <span className="block text-muted-foreground text-xs">
                    {child.class}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xl">
                {currentChild.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-lg">
                  {currentChild.name}
                </h3>
                <p className="text-muted-foreground">
                  {currentChild.class} - Section {currentChild.section}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Roll Number</p>
                    <p className="font-medium">{currentChild.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Admission Date
                    </p>
                    <p className="font-medium">{currentChild.admissionDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Date of Birth
                    </p>
                    <p className="font-medium">{currentChild.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Blood Group</p>
                    <p className="font-medium">{currentChild.bloodGroup}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-success to-success/90">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success">
                  <TrendingUp className="h-4 w-4 text-background" />
                </div>
                Attendance
              </CardTitle>
              <Link
                to="/app/attendance"
                className="flex items-center gap-1 font-medium text-sm text-success hover:text-success"
              >
                View Details <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-center">
              <div className="font-bold text-4xl text-primary">93.3%</div>
              <p className="text-muted-foreground">Overall Attendance</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-success/15 p-2">
                <div className="font-bold text-success">42</div>
                <div className="text-success text-xs">Present</div>
              </div>
              <div className="rounded-lg bg-destructive/10 p-2">
                <div className="font-bold text-destructive">3</div>
                <div className="text-destructive text-xs">Absent</div>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <div className="font-bold text-muted-foreground">45</div>
                <div className="text-muted-foreground text-xs">Total</div>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <p className="mb-2 text-muted-foreground text-sm">
                Monthly Breakdown
              </p>
              {mockAttendance.map((month) => (
                <div
                  key={month.month}
                  className="flex items-center justify-between py-1 text-sm"
                >
                  <span>{month.month}</span>
                  <span
                    className={
                      month.percentage >= 90 ? "text-success" : "text-warning"
                    }
                  >
                    {month.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                Pay Now <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Fees</span>
                <span className="font-bold">
                  ₹{mockFees.total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid</span>
                <span className="font-bold text-success">
                  ₹{mockFees.paid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-bold text-warning">
                  ₹{mockFees.pending.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-3">
                <p className="text-muted-foreground text-sm">
                  Next due date: {mockFees.dueDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-warning to-warning/90">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning">
                  <Home className="h-4 w-4 text-background" />
                </div>
                Homework
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
              {mockHomework.slice(0, 3).map((hw) => (
                <div key={hw.id} className="rounded-lg bg-muted p-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{hw.subject}</p>
                      <p className="text-muted-foreground text-xs">
                        {hw.title}
                      </p>
                    </div>
                    <Badge
                      variant={
                        hw.status === "submitted" ? "success" : "warning"
                      }
                    >
                      {hw.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Due: {hw.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md transition-all hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <BookMarked className="h-4 w-4 text-background" />
                </div>
                Library Books
              </CardTitle>
              <Link
                to="/app/library"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary"
              >
                Browse <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockLibraryBooks.map((book) => (
                <div
                  key={book.id}
                  className="rounded-lg border-primary border-l-4 bg-primary/5 p-2"
                >
                  <p className="font-medium text-sm">{book.title}</p>
                  <p className="text-muted-foreground text-xs">{book.author}</p>
                  <div className="mt-2 flex justify-between">
                    <span className="text-primary text-xs">
                      Due: {book.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5" />
              Transport
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route</span>
                <span className="font-medium">{mockTransport.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stop</span>
                <span className="font-medium">{mockTransport.stop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup</span>
                <span className="font-medium">{mockTransport.pickupTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Drop</span>
                <span className="font-medium">{mockTransport.dropTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Exam Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Exam</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Marks</th>
                    <th className="pb-2 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {mockExams.map((exam, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3 font-medium">{exam.name}</td>
                      <td className="py-3 text-muted-foreground">
                        {exam.date}
                      </td>
                      <td className="py-3">
                        {exam.marks !== undefined ? (
                          <span>
                            {exam.marks}/{exam.maxMarks} ({exam.percentage}%)
                          </span>
                        ) : (
                          <Badge variant="warning">Upcoming</Badge>
                        )}
                      </td>
                      <td className="py-3">
                        {exam.grade && (
                          <Badge
                            variant={
                              exam.grade.startsWith("A")
                                ? "success"
                                : exam.grade.startsWith("B")
                                  ? "default"
                                  : "warning"
                            }
                          >
                            {exam.grade}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={`rounded-lg border-l-4 p-3 ${
                    notice.priority === "high"
                      ? "border-destructive/30 bg-destructive/10"
                      : "border-primary bg-primary/5"
                  }`}
                >
                  <p className="font-medium text-sm">{notice.title}</p>
                  <p className="mb-1 text-muted-foreground text-xs">
                    {notice.date}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {notice.message}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSubjectPerformance.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{subject.subject}</p>
                      <p className="text-muted-foreground text-xs">
                        {subject.teacher}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {subject.marks}%
                      </span>
                      <Badge
                        variant={
                          subject.grade.startsWith("A")
                            ? "success"
                            : subject.grade.startsWith("B")
                              ? "default"
                              : "warning"
                        }
                      >
                        {subject.grade}
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${
                        subject.marks >= 90
                          ? "bg-success"
                          : subject.marks >= 75
                            ? "bg-primary"
                            : "bg-warning"
                      }`}
                      style={{ width: `${subject.marks}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Teacher Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTeachers.map((teacher) => (
                <div key={teacher.name} className="rounded-lg bg-muted p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {teacher.subject}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowContactForm(true)}
                    >
                      <MessageSquare className="mr-1 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                  <div className="mt-2 flex gap-3 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {teacher.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {teacher.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {showContactForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Contact Teacher
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-medium text-sm">Select Teacher</label>
                <select className="mt-1 w-full rounded-lg border p-2">
                  {mockTeachers.map((teacher) => (
                    <option key={teacher.name} value={teacher.name}>
                      {teacher.name} - {teacher.subject}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-medium text-sm">Subject</label>
                <Input placeholder="Enter subject" className="mt-1" />
              </div>
            </div>
            <div className="mb-4">
              <label className="font-medium text-sm">Message</label>
              <textarea
                placeholder="Enter your message..."
                className="mt-1 w-full rounded-lg border p-2"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowContactForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Academic Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 p-4 text-center">
              <p className="font-bold text-3xl text-primary">A</p>
              <p className="text-muted-foreground text-sm">Current Grade</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-success to-success/90 p-4 text-center">
              <p className="font-bold text-3xl text-success">3.8</p>
              <p className="text-muted-foreground text-sm">GPA</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 p-4 text-center">
              <p className="font-bold text-3xl text-primary">Top 15%</p>
              <p className="text-muted-foreground text-sm">Class Rank</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-warning to-warning/90 p-4 text-center">
              <p className="font-bold text-3xl text-warning">95%</p>
              <p className="text-muted-foreground text-sm">
                Assignment Completion
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
