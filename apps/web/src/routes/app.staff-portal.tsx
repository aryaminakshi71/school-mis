import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { useState } from "react";
import {
  User,
  DollarSign,
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  Users,
  Phone,
  Mail,
  Award,
  Briefcase,
  BookOpen,
  MessageSquare,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export const Route = createFileRoute("/app/staff-portal")({
  component: StaffPortal,
});

function StaffPortal() {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!hasRole(["teacher", "staff", "accountant", "librarian", "admin"])) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            This portal is only available for staff members.
          </p>
        </div>
      </div>
    );
  }

  const mockStaff = {
    id: "STF001",
    name: "Dr. Rajesh Kumar",
    role: "Senior Teacher",
    department: "Mathematics",
    qualification: "M.Sc, B.Ed",
    experience: "8 years",
    joinDate: "2018-07-15",
    email: "rajesh@school.edu",
    phone: "+91 98765 43210",
    address: "123, Sector 15, Gurugram",
    bankName: "HDFC Bank",
    accountNumber: "XXXX-XXXX-1234",
    ifscCode: "HDFC0001234",
    pfNumber: "PF/123456",
  };

  const mockPayroll = {
    basicSalary: 55000,
    da: 11000,
    hra: 8250,
    medical: 1500,
    transport: 2000,
    grossSalary: 77750,
    deductions: {
      pf: 3300,
      tds: 2500,
      insurance: 500,
    },
    netSalary: 71450,
    salaryHistory: [
      { month: "January 2026", amount: 71450, status: "Paid" },
      { month: "December 2025", amount: 71450, status: "Paid" },
      { month: "November 2025", amount: 71450, status: "Paid" },
      { month: "October 2025", amount: 68900, status: "Paid" },
      { month: "September 2025", amount: 68900, status: "Paid" },
    ],
  };

  const mockAttendance = {
    present: 48,
    absent: 2,
    leave: 4,
    total: 54,
    percentage: 88.9,
    monthlyData: [
      { month: "January 2026", present: 20, absent: 1, leave: 1 },
      { month: "December 2025", present: 21, absent: 0, leave: 2 },
      { month: "November 2025", present: 20, absent: 1, leave: 1 },
    ],
  };

  const mockLeave = {
    casual: { total: 12, used: 5, remaining: 7 },
    sick: { total: 10, used: 3, remaining: 7 },
    earned: { total: 15, used: 2, remaining: 13 },
    pendingRequests: [
      {
        id: "LR001",
        type: "Sick Leave",
        fromDate: "2026-01-28",
        toDate: "2026-01-29",
        reason: "Medical appointment",
        status: "Pending",
      },
    ],
    recentApprovals: [
      {
        id: "LR002",
        type: "Casual Leave",
        fromDate: "2026-01-10",
        toDate: "2026-01-12",
        reason: "Family function",
        status: "Approved",
      },
    ],
  };

  const mockPerformance = {
    overallRating: 4.2,
    categories: [
      { name: "Teaching Quality", rating: 4.5 },
      { name: "Student Engagement", rating: 4.3 },
      { name: "Punctuality", rating: 4.0 },
      { name: "Team Collaboration", rating: 4.1 },
      { name: "Administrative Tasks", rating: 4.0 },
    ],
    achievements: [
      "Best Teacher Award 2025",
      "100% Attendance Certificate",
      "Research Paper Published",
    ],
    goals: [
      { goal: "Complete B.Ed. Ph.D.", progress: 60, status: "In Progress" },
      { goal: "Organize Math Olympiad", progress: 100, status: "Completed" },
      { goal: "Mentor 5 Junior Teachers", progress: 80, status: "In Progress" },
    ],
  };

  const mockTimetable = [
    {
      time: "08:00 AM",
      period: "Class 9-A",
      subject: "Mathematics",
      room: "Room 101",
    },
    {
      time: "09:00 AM",
      period: "Class 10-B",
      subject: "Mathematics",
      room: "Room 102",
    },
    { time: "10:00 AM", period: "Break", subject: "", room: "" },
    {
      time: "10:15 AM",
      period: "Class 11-A",
      subject: "Mathematics",
      room: "Room 103",
    },
    {
      time: "11:15 AM",
      period: "Class 9-A",
      subject: "Mathematics",
      room: "Room 101",
    },
    { time: "12:15 PM", period: "Lunch", subject: "", room: "" },
    {
      time: "01:00 PM",
      period: "Class 12-A",
      subject: "Mathematics",
      room: "Room 104",
    },
  ];

  const mockNotices = [
    {
      id: "1",
      title: "Staff Meeting",
      date: "2026-01-25",
      message: "Monthly staff meeting at 4 PM in Conference Room",
    },
    {
      id: "2",
      title: "Salary Credit",
      date: "2026-01-28",
      message: "January salaries will be credited by end of month",
    },
    {
      id: "3",
      title: "Professional Development",
      date: "2026-02-01",
      message: "Workshop on new teaching methodologies",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "payroll", label: "Payroll", icon: DollarSign },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "leave", label: "Leave", icon: Clock },
    { id: "performance", label: "Performance", icon: TrendingUp },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
        <p className="text-gray-600">
          View your personal information, payroll, attendance, and performance
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-blue-100 border-2 border-blue-500"
                : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                    {mockStaff.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {mockStaff.name}
                    </h3>
                    <p className="text-gray-600">
                      {mockStaff.role} - {mockStaff.department}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Employee ID</p>
                        <p className="font-medium">{mockStaff.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Qualification</p>
                        <p className="font-medium">{mockStaff.qualification}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-medium">{mockStaff.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Join Date</p>
                        <p className="font-medium">{mockStaff.joinDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-sm">{mockStaff.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{mockStaff.phone}</p>
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
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">₹71,450</p>
                    <p className="text-sm text-gray-600">Net Salary</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">88.9%</p>
                      <p className="text-xs text-gray-600">Attendance</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">4.2/5</p>
                      <p className="text-xs text-gray-600">Rating</p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded-lg">
                      <p className="text-lg font-bold text-yellow-600">27</p>
                      <p className="text-xs text-gray-600">Leave Left</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <p className="text-lg font-bold text-red-600">1</p>
                      <p className="text-xs text-gray-600">Pending</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today&apos;s Timetable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockTimetable.map((period, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        period.period === "Break" || period.period === "Lunch"
                          ? "bg-gray-100"
                          : "bg-green-50"
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-600 w-20">
                        {period.time}
                      </span>
                      <div className="flex-1">
                        <span className="font-medium">{period.period}</span>
                        {period.subject && (
                          <span className="text-sm text-gray-500 ml-2">
                            - {period.subject}
                          </span>
                        )}
                      </div>
                      {period.room && (
                        <span className="text-sm text-gray-500">
                          {period.room}
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
                      <p className="text-xs text-gray-500 mb-1">
                        {notice.date}
                      </p>
                      <p className="text-sm text-gray-600">{notice.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === "payroll" && (
        <>
          <div className="grid lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Basic Salary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{mockPayroll.basicSalary.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Gross Salary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  ₹{mockPayroll.grossSalary.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total Deductions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  ₹
                  {(
                    mockPayroll.deductions.pf +
                    mockPayroll.deductions.tds +
                    mockPayroll.deductions.insurance
                  ).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Net Salary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{mockPayroll.netSalary.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Salary Slip - January 2026
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Earnings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Basic Salary</span>
                        <span>₹{mockPayroll.basicSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Dearness Allowance (DA)
                        </span>
                        <span>₹{mockPayroll.da.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          House Rent Allowance (HRA)
                        </span>
                        <span>₹{mockPayroll.hra.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Medical Allowance</span>
                        <span>₹{mockPayroll.medical.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Transport Allowance
                        </span>
                        <span>₹{mockPayroll.transport.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Gross Earnings</span>
                        <span>₹{mockPayroll.grossSalary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Deductions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Provident Fund (PF)
                        </span>
                        <span>
                          ₹{mockPayroll.deductions.pf.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Tax Deducted at Source (TDS)
                        </span>
                        <span>
                          ₹{mockPayroll.deductions.tds.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insurance</span>
                        <span>
                          ₹{mockPayroll.deductions.insurance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total Deductions</span>
                        <span>
                          ₹
                          {(
                            mockPayroll.deductions.pf +
                            mockPayroll.deductions.tds +
                            mockPayroll.deductions.insurance
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Net Pay</span>
                      <span className="text-green-600">
                        ₹{mockPayroll.netSalary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Bank & PF Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Bank Name</p>
                    <p className="font-medium">{mockStaff.bankName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Account Number</p>
                    <p className="font-medium">{mockStaff.accountNumber}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">IFSC Code</p>
                    <p className="font-medium">{mockStaff.ifscCode}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-500">PF Number</p>
                    <p className="font-medium">{mockStaff.pfNumber}</p>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <Download className="w-4 h-4 mr-2" />
                  Download Salary Slip
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Salary History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="pb-3 font-medium">Month</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPayroll.salaryHistory.map((salary, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3 font-medium">{salary.month}</td>
                        <td className="py-3">
                          ₹{salary.amount.toLocaleString()}
                        </td>
                        <td className="py-3">
                          <Badge variant="success">{salary.status}</Badge>
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "attendance" && (
        <>
          <div className="grid lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Present</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {mockAttendance.present}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Absent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">
                  {mockAttendance.absent}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">On Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-600">
                  {mockAttendance.leave}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Attendance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {mockAttendance.percentage}%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Monthly Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="pb-3 font-medium">Month</th>
                      <th className="pb-3 font-medium text-green-600">
                        Present
                      </th>
                      <th className="pb-3 font-medium text-red-600">Absent</th>
                      <th className="pb-3 font-medium text-yellow-600">
                        Leave
                      </th>
                      <th className="pb-3 font-medium">Total Days</th>
                      <th className="pb-3 font-medium">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAttendance.monthlyData.map((month, i) => {
                      const total = month.present + month.absent + month.leave;
                      const percentage = (
                        (month.present / total) *
                        100
                      ).toFixed(1);
                      return (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-3 font-medium">{month.month}</td>
                          <td className="py-3 text-green-600">
                            {month.present}
                          </td>
                          <td className="py-3 text-red-600">{month.absent}</td>
                          <td className="py-3 text-yellow-600">
                            {month.leave}
                          </td>
                          <td className="py-3">{total}</td>
                          <td className="py-3">
                            <Badge
                              variant={
                                parseFloat(percentage) >= 90
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {percentage}%
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "leave" && (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Casual Leave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-green-600">
                    {mockLeave.casual.remaining}
                  </p>
                  <p className="text-gray-500">Days Remaining</p>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Used: {mockLeave.casual.used}</span>
                    <span>Total: {mockLeave.casual.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(mockLeave.casual.used / mockLeave.casual.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  Sick Leave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-blue-600">
                    {mockLeave.sick.remaining}
                  </p>
                  <p className="text-gray-500">Days Remaining</p>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Used: {mockLeave.sick.used}</span>
                    <span>Total: {mockLeave.sick.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(mockLeave.sick.used / mockLeave.sick.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                  Earned Leave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-purple-600">
                    {mockLeave.earned.remaining}
                  </p>
                  <p className="text-gray-500">Days Remaining</p>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Used: {mockLeave.earned.used}</span>
                    <span>Total: {mockLeave.earned.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${(mockLeave.earned.used / mockLeave.earned.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockLeave.pendingRequests.length > 0 ? (
                  <div className="space-y-3">
                    {mockLeave.pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{request.type}</p>
                            <p className="text-sm text-gray-500">
                              {request.fromDate} to {request.toDate}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {request.reason}
                            </p>
                          </div>
                          <Badge variant="warning">{request.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No pending requests
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Recently Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockLeave.recentApprovals.length > 0 ? (
                  <div className="space-y-3">
                    {mockLeave.recentApprovals.map((approval) => (
                      <div
                        key={approval.id}
                        className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{approval.type}</p>
                            <p className="text-sm text-gray-500">
                              {approval.fromDate} to {approval.toDate}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {approval.reason}
                            </p>
                          </div>
                          <Badge variant="success">{approval.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recent approvals
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === "performance" && (
        <>
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Overall Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {mockPerformance.overallRating}
                  </div>
                  <p className="text-gray-500 mb-4">out of 5.0</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-2xl ${star <= Math.round(mockPerformance.overallRating) ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Category Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPerformance.categories.map((category) => (
                    <div key={category.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {category.rating}/5
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(category.rating / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPerformance.achievements.map((achievement, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500"
                    >
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Goals & Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPerformance.goals.map((goal, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {goal.status === "Completed" ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : goal.status === "In Progress" ? (
                            <Clock className="w-4 h-4 text-blue-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="font-medium">{goal.goal}</span>
                        </div>
                        <Badge
                          variant={
                            goal.status === "Completed"
                              ? "success"
                              : goal.status === "In Progress"
                                ? "default"
                                : "warning"
                          }
                        >
                          {goal.status}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 ml-6">
                        <div
                          className={`h-2 rounded-full ${
                            goal.status === "Completed"
                              ? "bg-green-500"
                              : goal.status === "In Progress"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
