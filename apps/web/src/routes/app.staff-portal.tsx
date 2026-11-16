import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Calendar, TrendingUp, User } from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { api } from "../lib/api";
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

  // Fetch staff profile
  const { data: staffProfile, isLoading: profileLoading } = useQuery<{
    employeeId?: string;
    firstName?: string;
    lastName?: string;
    designation?: string;
    department?: string;
    createdAt?: string;
    email?: string;
    phone?: string;
    address?: string;
    salary?: number;
    attendance?: number;
    tasksCompleted?: number;
    performance?: number;
  }>({
    queryKey: ["staff-profile"],
    queryFn: async () => {
      const data = await api.staff.getMyProfile();
      return data as any;
    },
  });

  // Fetch staff tasks
  const { data: staffTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["staff-tasks"],
    queryFn: async () => {
      const data = await api.staff.getMyTasks();
      return (data as any).tasks || [];
    },
  });

  // Fetch staff attendance
  const { data: staffAttendance, isLoading: attendanceLoading } = useQuery<{
    present?: number;
    absent?: number;
    leave?: number;
    percentage?: number;
    monthlyData?: Array<{
      month: string;
      present: number;
      absent: number;
      leave: number;
    }>;
  }>({
    queryKey: ["staff-attendance"],
    queryFn: async () => {
      const data = await api.staff.getMyAttendance();
      return data as any;
    },
  });

  if (profileLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const staffData = staffProfile
    ? {
        id: staffProfile.employeeId || "STF001",
        name:
          (staffProfile.firstName || "") + " " + (staffProfile.lastName || ""),
        role: staffProfile.designation || "Staff Member",
        department: staffProfile.department || "General",
        qualification: "M.Sc, B.Ed", // Mock
        experience: "8 years", // Mock
        joinDate: staffProfile.createdAt
          ? new Date(staffProfile.createdAt).toLocaleDateString()
          : "",
        email: staffProfile.email || "",
        phone: staffProfile.phone || "",
        address: staffProfile.address || "",
        salary: staffProfile.salary || 0,
        attendance: staffProfile.attendance || 0,
        tasksCompleted: staffProfile.tasksCompleted || 0,
        performance: staffProfile.performance || 0,
      }
    : null;

  if (!staffData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <User className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 font-bold text-foreground text-xl">
            No Staff Data Found
          </h2>
          <p className="text-muted-foreground">
            Unable to load staff information.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "attendance", label: "Attendance", icon: Calendar },
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
                    {staffData?.name?.charAt(0) || "S"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-xl">
                      {staffData?.name || "Staff Member"}
                    </h3>
                    <p className="text-muted-foreground">
                      {staffData?.role || "Staff"} -{" "}
                      {staffData?.department || "Department"}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Employee ID
                        </p>
                        <p className="font-medium">{staffData?.id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Qualification
                        </p>
                        <p className="font-medium">
                          {staffData?.qualification || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Experience
                        </p>
                        <p className="font-medium">
                          {staffData?.experience || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Join Date
                        </p>
                        <p className="font-medium">
                          {staffData?.joinDate
                            ? new Date(staffData.joinDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Email</p>
                        <p className="font-medium text-sm">
                          {staffData?.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Phone</p>
                        <p className="font-medium">
                          {staffData?.phone || "N/A"}
                        </p>
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
                  {staffAttendance?.present || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-medium text-sm">Absent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-3xl text-destructive">
                  {staffAttendance?.absent || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-medium text-sm">On Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-3xl text-warning">
                  {staffAttendance?.leave || 0}
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
                  {staffAttendance?.percentage || 0}%
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
                    {(staffAttendance?.monthlyData || []).map((month, i) => {
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
    </div>
  );
}
