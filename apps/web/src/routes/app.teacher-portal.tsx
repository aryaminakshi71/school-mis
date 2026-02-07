import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { useState } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings,
  MessageSquare,
  UserPlus,
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

export const Route = createFileRoute("/app/teacher-portal")({
  component: TeacherPortal,
});

function TeacherPortal() {
  const { user, hasRole } = useAuth();
  const [selectedClass, setSelectedClass] = useState("Class 9-A");

  if (!hasRole(["teacher", "admin"])) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
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
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Portal</h1>
          <p className="text-gray-600 text-lg">
            Manage your classes, attendance, and academic activities
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 border-2 shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              Teacher Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg ring-4 ring-primary/20">
                {mockTeacher.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {mockTeacher.name}
                </h3>
                <p className="text-gray-600">{mockTeacher.qualification}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mockTeacher.subjects.map((subject, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{mockTeacher.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Classes</p>
                    <p className="font-medium">
                      {mockTeacher.classes.length} classes
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-sm">{mockTeacher.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{mockTeacher.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Students</span>
                <span className="font-bold">115</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Classes Today</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Assignments</span>
                <span className="font-bold text-yellow-600">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Upcoming Exams</span>
                <span className="font-bold text-red-600">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary-foreground" />
                </div>
                Today&apos;s Timetable
              </CardTitle>
              <Link
                to="/app/schedule"
                className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
              >
                Full Schedule <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockTimetable.map((period, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg ${period.period === "Break" || period.period === "Lunch"
                    ? "bg-gray-100"
                    : "bg-green-50"
                    }`}
                >
                  <span className="text-sm font-medium text-gray-600 w-20">
                    {period.time}
                  </span>
                  <div className="flex-1">
                    <span className="font-medium">{period.period}</span>
                    {period.class && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({period.class})
                      </span>
                    )}
                  </div>
                  {period.room && (
                    <span className="text-sm text-gray-500">{period.room}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                My Classes
              </CardTitle>
              <Link
                to="/app/classes"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
              >
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockClasses.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.name)}
                  className={`w-full p-3 rounded-lg text-left transition-colors flex flex-col ${selectedClass === cls.name
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-gray-50 hover:bg-gray-100"
                    }`}
                >
                  <span className="flex justify-between items-center w-full">
                    <span className="font-medium">{cls.name}</span>
                    <span className="text-sm text-gray-500">
                      {cls.strength} students
                    </span>
                  </span>
                  <span className="flex gap-4 mt-1 text-sm w-full">
                    <span className="text-gray-500">
                      Avg: {cls.averageMarks}%
                    </span>
                    <span className="text-gray-500">
                      Att: {cls.averageAttendance}%
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-white" />
                </div>
                Class Students - {selectedClass}
              </CardTitle>
              <Link
                to="/app/students"
                className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1"
              >
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-gray-500">
                        Roll: {student.rollNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm px-2 py-1 rounded ${student.attendance >= 90
                        ? "bg-green-100 text-green-700"
                        : student.attendance >= 80
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {student.attendance}%
                    </span>
                    <Link to="/app/notifications">
                      <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Assignments
              </CardTitle>
              <Link
                to="/app/gradebook"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
              >
                Manage <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAssignments.map((assignment) => (
                <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-sm text-gray-500">
                        {assignment.class} • {assignment.subject}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      Due: {assignment.dueDate}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Submissions</span>
                      <span>
                        {assignment.submitted}/{assignment.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
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

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 shadow-md hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                Upcoming Exams
              </CardTitle>
              <Link
                to="/app/exams"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                Schedule <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockExams.map((exam, i) => (
                <div
                  key={i}
                  className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{exam.title}</p>
                      <p className="text-sm text-gray-500">{exam.class}</p>
                    </div>
                    <span className="text-sm text-purple-600 font-medium">
                      {exam.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
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
              <Settings className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start">
                <ClipboardList className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
              <Button variant="outline" className="justify-start">
                <Award className="w-4 h-4 mr-2" />
                Upload Marks
              </Button>
              <Button variant="outline" className="justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Notice
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Exam
              </Button>
              <Button variant="outline" className="justify-start">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
