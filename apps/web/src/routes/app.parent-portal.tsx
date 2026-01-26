import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth, UserRole } from "../lib/auth-context";
import { useState } from "react";
import { toast } from "sonner";
import {
  User,
  BookOpen,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  MessageSquare,
  Bus,
  Home,
  BookMarked,
  Users,
  Phone,
  Mail,
  ChevronRight,
  Send,
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
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

export const Route = createFileRoute("/app/parent-portal")({
  component: ParentPortal,
});

function ParentPortal() {
  const { user, hasRole } = useAuth();

  if (!hasRole(["parent", "admin", "student"])) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
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
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors w-fit group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parent Portal</h1>
          <p className="text-gray-600 text-lg">
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
                className={`flex items-center gap-3 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedChild === index
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {child.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{child.name}</p>
                  <p className="text-xs text-gray-500">{child.class}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {currentChild.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentChild.name}
                </h3>
                <p className="text-gray-600">
                  {currentChild.class} - Section {currentChild.section}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Roll Number</p>
                    <p className="font-medium">{currentChild.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Admission Date</p>
                    <p className="font-medium">{currentChild.admissionDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{currentChild.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="font-medium">{currentChild.bloodGroup}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                Attendance
              </CardTitle>
              <Link
                to="/app/attendance"
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
              >
                View Details <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-blue-600">93.3%</div>
              <p className="text-gray-500">Overall Attendance</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <div className="text-green-600 font-bold">42</div>
                <div className="text-xs text-green-600">Present</div>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <div className="text-red-600 font-bold">3</div>
                <div className="text-xs text-red-600">Absent</div>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <div className="text-gray-600 font-bold">45</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Monthly Breakdown</p>
              {mockAttendance.map((month) => (
                <div
                  key={month.month}
                  className="flex justify-between items-center text-sm py-1"
                >
                  <span>{month.month}</span>
                  <span
                    className={
                      month.percentage >= 90
                        ? "text-green-600"
                        : "text-yellow-600"
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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                Pay Now <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Fees</span>
                <span className="font-bold">
                  ₹{mockFees.total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid</span>
                <span className="font-bold text-green-600">
                  ₹{mockFees.paid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-bold text-yellow-600">
                  ₹{mockFees.pending.toLocaleString()}
                </span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-500">
                  Next due date: {mockFees.dueDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                Homework
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
              {mockHomework.slice(0, 3).map((hw) => (
                <div key={hw.id} className="p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{hw.subject}</p>
                      <p className="text-xs text-gray-500">{hw.title}</p>
                    </div>
                    <Badge
                      variant={
                        hw.status === "submitted" ? "success" : "warning"
                      }
                    >
                      {hw.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {hw.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <BookMarked className="w-4 h-4 text-white" />
                </div>
                Library Books
              </CardTitle>
              <Link
                to="/app/library"
                className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
              >
                Browse <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockLibraryBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-2 bg-purple-50 rounded-lg border-l-4 border-purple-500"
                >
                  <p className="font-medium text-sm">{book.title}</p>
                  <p className="text-xs text-gray-500">{book.author}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-purple-600">
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
              <Bus className="w-5 h-5" />
              Transport
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Route</span>
                <span className="font-medium">{mockTransport.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stop</span>
                <span className="font-medium">{mockTransport.stop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup</span>
                <span className="font-medium">{mockTransport.pickupTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Drop</span>
                <span className="font-medium">{mockTransport.dropTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Exam Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
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
                      <td className="py-3 text-gray-500">{exam.date}</td>
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
              <MessageSquare className="w-5 h-5" />
              Notices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    notice.priority === "high"
                      ? "bg-red-50 border-red-500"
                      : "bg-blue-50 border-blue-500"
                  }`}
                >
                  <p className="font-medium text-sm">{notice.title}</p>
                  <p className="text-xs text-gray-500 mb-1">{notice.date}</p>
                  <p className="text-sm text-gray-600">{notice.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
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
                      <p className="text-xs text-gray-500">{subject.teacher}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
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
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        subject.marks >= 90
                          ? "bg-green-500"
                          : subject.marks >= 75
                            ? "bg-blue-500"
                            : "bg-yellow-500"
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
              <Users className="w-5 h-5" />
              Teacher Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTeachers.map((teacher) => (
                <div key={teacher.name} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-gray-500">{teacher.subject}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowContactForm(true)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {teacher.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
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
              <Send className="w-5 h-5" />
              Contact Teacher
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium">Select Teacher</label>
                <select className="w-full mt-1 p-2 border rounded-lg">
                  {mockTeachers.map((teacher) => (
                    <option key={teacher.name} value={teacher.name}>
                      {teacher.name} - {teacher.subject}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="Enter subject" className="mt-1" />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium">Message</label>
              <textarea
                placeholder="Enter your message..."
                className="w-full mt-1 p-2 border rounded-lg"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button>
                <Send className="w-4 h-4 mr-2" />
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
            <FileText className="w-5 h-5" />
            Academic Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">A</p>
              <p className="text-sm text-gray-600">Current Grade</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <p className="text-3xl font-bold text-green-600">3.8</p>
              <p className="text-sm text-gray-600">GPA</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">Top 15%</p>
              <p className="text-sm text-gray-600">Class Rank</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">95%</p>
              <p className="text-sm text-gray-600">Assignment Completion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
