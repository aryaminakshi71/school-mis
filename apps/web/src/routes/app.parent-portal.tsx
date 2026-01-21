import { createFileRoute, redirect } from "@tanstack/react-router";
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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

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

  const mockChild = {
    name: "John Smith",
    class: "Class 9-A",
    rollNumber: "ADM-001",
    admissionDate: "2024-04-15",
  };

  const mockAttendance = {
    present: 42,
    absent: 3,
    total: 45,
    percentage: 93.3,
  };

  const mockFees = {
    total: 50000,
    paid: 35000,
    pending: 15000,
    dueDate: "2026-02-15",
  };

  const mockExams = [
    {
      name: "Mathematics Unit Test",
      date: "2026-01-25",
      marks: 85,
      grade: "A",
    },
    { name: "Physics Mid Term", date: "2026-01-20", marks: 78, grade: "B+" },
    { name: "Chemistry Quarterly", date: "2026-02-01", status: "Upcoming" },
  ];

  const mockNotices = [
    {
      id: "1",
      title: "Parent-Teacher Meeting",
      date: "2026-01-28",
      message: "PTM scheduled for next Saturday at 10 AM",
    },
    {
      id: "2",
      title: "Holiday Notice",
      date: "2026-01-26",
      message: "School will remain closed on Republic Day",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Parent Portal</h1>
        <p className="text-gray-600">
          Track your child's progress and school activities
        </p>
      </div>

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
                {mockChild.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {mockChild.name}
                </h3>
                <p className="text-gray-600">{mockChild.class}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Roll Number</p>
                    <p className="font-medium">{mockChild.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Admission Date</p>
                    <p className="font-medium">{mockChild.admissionDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-blue-600">
                {mockAttendance.percentage}%
              </div>
              <p className="text-gray-500">Attendance Rate</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <div className="text-green-600 font-bold">
                  {mockAttendance.present}
                </div>
                <div className="text-xs text-green-600">Present</div>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <div className="text-red-600 font-bold">
                  {mockAttendance.absent}
                </div>
                <div className="text-xs text-red-600">Absent</div>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <div className="text-gray-600 font-bold">
                  {mockAttendance.total}
                </div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Fee Status
            </CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Recent Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockExams.map((exam, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{exam.name}</p>
                    <p className="text-xs text-gray-500">{exam.date}</p>
                  </div>
                  {exam.marks !== undefined ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                      {exam.marks}/{100} ({exam.grade})
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium">
                      Upcoming
                    </span>
                  )}
                </div>
              ))}
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
                  className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500"
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Academic Performance
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
