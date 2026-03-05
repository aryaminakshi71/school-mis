import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  FileText,
  MessageSquare,
  TrendingUp,
  User,
  XCircle,
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
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/app/staff-portal")({
  component: StaffPortal,
});

function StaffPortal() {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!hasRole(["teacher", "staff", "accountant", "librarian", "admin"])) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <User className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 font-bold text-foreground text-xl">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
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
            Staff Portal
          </h1>
          <p className="text-lg text-muted-foreground">
            View your personal information, payroll, attendance, and performance
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 transition-colors ${
              activeTab === tab.id
                ? "border-2 border-primary bg-primary/10"
                : "border-2 border-transparent bg-muted hover:bg-muted"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success font-bold text-2xl text-success-foreground">
                    {mockStaff.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-xl">
                      {mockStaff.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {mockStaff.role} - {mockStaff.department}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Employee ID
                        </p>
                        <p className="font-medium">{mockStaff.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Qualification
                        </p>
                        <p className="font-medium">{mockStaff.qualification}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Experience
                        </p>
                        <p className="font-medium">{mockStaff.experience}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Join Date
                        </p>
                        <p className="font-medium">{mockStaff.joinDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Email</p>
                        <p className="font-medium text-sm">{mockStaff.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Phone</p>
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
                  <TrendingUp className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-success/15 p-4 text-center">
                    <p className="font-bold text-2xl text-success">₹71,450</p>
                    <p className="text-muted-foreground text-sm">Net Salary</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-primary/5 p-2 text-center">
                      <p className="font-bold text-foreground text-lg">88.9%</p>
                      <p className="text-muted-foreground text-xs">
                        Attendance
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary/5 p-2 text-center">
                      <p className="font-bold text-foreground text-lg">4.2/5</p>
                      <p className="text-muted-foreground text-xs">Rating</p>
                    </div>
                    <div className="rounded-lg bg-warning/15 p-2 text-center">
                      <p className="font-bold text-lg text-warning">27</p>
                      <p className="text-muted-foreground text-xs">
                        Leave Left
                      </p>
                    </div>
                    <div className="rounded-lg bg-destructive/10 p-2 text-center">
                      <p className="font-bold text-destructive text-lg">1</p>
                      <p className="text-muted-foreground text-xs">Pending</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today&apos;s Timetable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockTimetable.map((period, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-lg p-2 ${
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
                        {period.subject && (
                          <span className="ml-2 text-muted-foreground text-sm">
                            - {period.subject}
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
                      className="rounded-lg border-primary border-l-4 bg-primary/5 p-3"
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
        </>
      )}

      {activeTab === "payroll" && (
        <>
          <div className="mb-6 grid gap-6 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-medium text-sm">
                  Basic Salary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl text-foreground">
                  ₹{mockPayroll.basicSalary.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-medium text-sm">
                  Gross Salary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl text-success">
                  ₹{mockPayroll.grossSalary.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-medium text-sm">
                  Total Deductions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl text-destructive">
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
                <CardTitle className="font-medium text-sm">
                  Net Salary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl text-primary">
                  ₹{mockPayroll.netSalary.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Salary Slip - January 2026
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-medium">Earnings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Basic Salary
                        </span>
                        <span>₹{mockPayroll.basicSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Dearness Allowance (DA)
                        </span>
                        <span>₹{mockPayroll.da.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          House Rent Allowance (HRA)
                        </span>
                        <span>₹{mockPayroll.hra.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Medical Allowance
                        </span>
                        <span>₹{mockPayroll.medical.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Transport Allowance
                        </span>
                        <span>₹{mockPayroll.transport.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold">
                        <span>Gross Earnings</span>
                        <span>₹{mockPayroll.grossSalary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Deductions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Provident Fund (PF)
                        </span>
                        <span>
                          ₹{mockPayroll.deductions.pf.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Tax Deducted at Source (TDS)
                        </span>
                        <span>
                          ₹{mockPayroll.deductions.tds.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Insurance</span>
                        <span>
                          ₹{mockPayroll.deductions.insurance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold">
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
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Net Pay</span>
                      <span className="text-success">
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
                  <Briefcase className="h-5 w-5" />
                  Bank & PF Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-muted-foreground text-sm">Bank Name</p>
                    <p className="font-medium">{mockStaff.bankName}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-muted-foreground text-sm">
                      Account Number
                    </p>
                    <p className="font-medium">{mockStaff.accountNumber}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-muted-foreground text-sm">IFSC Code</p>
                    <p className="font-medium">{mockStaff.ifscCode}</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-3">
                    <p className="text-muted-foreground text-sm">PF Number</p>
                    <p className="font-medium">{mockStaff.pfNumber}</p>
                  </div>
                </div>
                <Button className="mt-4 w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Salary Slip
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Salary History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground text-sm">
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
                            <Download className="h-4 w-4" />
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
          <div className="mb-6 grid gap-6 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-medium text-sm">Present</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-3xl text-success">
                  {mockAttendance.present}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-medium text-sm">Absent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-3xl text-destructive">
                  {mockAttendance.absent}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-medium text-sm">On Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-3xl text-warning">
                  {mockAttendance.leave}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-medium text-sm">
                  Attendance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-3xl text-primary">
                  {mockAttendance.percentage}%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Monthly Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground text-sm">
                      <th className="pb-3 font-medium">Month</th>
                      <th className="pb-3 font-medium text-success">Present</th>
                      <th className="pb-3 font-medium text-destructive">
                        Absent
                      </th>
                      <th className="pb-3 font-medium text-warning">Leave</th>
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
                          <td className="py-3 text-success">{month.present}</td>
                          <td className="py-3 text-destructive">
                            {month.absent}
                          </td>
                          <td className="py-3 text-warning">{month.leave}</td>
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
          <div className="mb-6 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Casual Leave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-center">
                  <p className="font-bold text-3xl text-success">
                    {mockLeave.casual.remaining}
                  </p>
                  <p className="text-muted-foreground">Days Remaining</p>
                </div>
                <div className="text-muted-foreground text-sm">
                  <div className="mb-1 flex justify-between">
                    <span>Used: {mockLeave.casual.used}</span>
                    <span>Total: {mockLeave.casual.total}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-success"
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
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Sick Leave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-center">
                  <p className="font-bold text-3xl text-primary">
                    {mockLeave.sick.remaining}
                  </p>
                  <p className="text-muted-foreground">Days Remaining</p>
                </div>
                <div className="text-muted-foreground text-sm">
                  <div className="mb-1 flex justify-between">
                    <span>Used: {mockLeave.sick.used}</span>
                    <span>Total: {mockLeave.sick.total}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
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
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Earned Leave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-center">
                  <p className="font-bold text-3xl text-primary">
                    {mockLeave.earned.remaining}
                  </p>
                  <p className="text-muted-foreground">Days Remaining</p>
                </div>
                <div className="text-muted-foreground text-sm">
                  <div className="mb-1 flex justify-between">
                    <span>Used: {mockLeave.earned.used}</span>
                    <span>Total: {mockLeave.earned.total}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${(mockLeave.earned.used / mockLeave.earned.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockLeave.pendingRequests.length > 0 ? (
                  <div className="space-y-3">
                    {mockLeave.pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="rounded-lg border-warning/30 border-l-4 bg-warning/15 p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{request.type}</p>
                            <p className="text-muted-foreground text-sm">
                              {request.fromDate} to {request.toDate}
                            </p>
                            <p className="mt-1 text-muted-foreground text-sm">
                              {request.reason}
                            </p>
                          </div>
                          <Badge variant="warning">{request.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-muted-foreground">
                    No pending requests
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Recently Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockLeave.recentApprovals.length > 0 ? (
                  <div className="space-y-3">
                    {mockLeave.recentApprovals.map((approval) => (
                      <div
                        key={approval.id}
                        className="rounded-lg border-success/30 border-l-4 bg-success/15 p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{approval.type}</p>
                            <p className="text-muted-foreground text-sm">
                              {approval.fromDate} to {approval.toDate}
                            </p>
                            <p className="mt-1 text-muted-foreground text-sm">
                              {approval.reason}
                            </p>
                          </div>
                          <Badge variant="success">{approval.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-muted-foreground">
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
          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Overall Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="mb-2 font-bold text-5xl text-primary">
                    {mockPerformance.overallRating}
                  </div>
                  <p className="mb-4 text-muted-foreground">out of 5.0</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-2xl ${star <= Math.round(mockPerformance.overallRating) ? "text-warning" : "text-muted-foreground"}`}
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
                  <TrendingUp className="h-5 w-5" />
                  Category Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPerformance.categories.map((category) => (
                    <div key={category.name}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {category.name}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {category.rating}/5
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${(category.rating / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPerformance.achievements.map((achievement, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg border-warning/30 border-l-4 bg-warning/15 p-3"
                    >
                      <Award className="h-5 w-5 text-warning" />
                      <span className="font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Goals & Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPerformance.goals.map((goal, i) => (
                    <div key={i}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {goal.status === "Completed" ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : goal.status === "In Progress" ? (
                            <Clock className="h-4 w-4 text-primary" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
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
                      <div className="ml-6 h-2 w-full rounded-full bg-muted">
                        <div
                          className={`h-2 rounded-full ${
                            goal.status === "Completed"
                              ? "bg-success"
                              : goal.status === "In Progress"
                                ? "bg-primary"
                                : "bg-muted"
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
