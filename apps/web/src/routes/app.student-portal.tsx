import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Download,
  Edit,
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
import { api } from "../lib/api";
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

  // Fetch student profile and portal data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["student-profile"],
    queryFn: api.students.getMyProfile,
  });

  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ["student-attendance"],
    queryFn: api.students.getMyAttendance,
  });

  const { data: gradesData, isLoading: gradesLoading } = useQuery({
    queryKey: ["student-grades"],
    queryFn: api.students.getMyGrades,
  });

  const { data: feesData, isLoading: feesLoading } = useQuery({
    queryKey: ["student-fees"],
    queryFn: api.students.getMyFees,
  });

  const isLoading =
    profileLoading || attendanceLoading || gradesLoading || feesLoading;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const studentData = profile
    ? {
        personal: {
          name: profile.name,
          class: profile.class || "Not Assigned",
          section: profile.section || "",
          rollNumber: profile.rollNumber || "",
          admissionNumber: profile.admissionNumber || "",
          admissionDate: profile.createdAt
            ? new Date(profile.createdAt).toLocaleDateString()
            : "",
          house: profile.house || "N/A",
          bloodGroup: profile.bloodGroup || "N/A",
          phone: profile.phone || "",
          email: profile.email || "",
          dob: profile.dateOfBirth || "",
          address: profile.address || "",
        },
        attendance: attendanceData?.attendance || {
          present: 0,
          absent: 0,
          total: 0,
          percentage: 0,
        },
        subjects: gradesData?.grades || [],
        fees: feesData?.fees || {
          total: 0,
          paid: 0,
          pending: 0,
          status: "unknown",
        },
      }
    : null;

  if (!studentData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <User className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 font-bold text-foreground text-xl">
            No Student Data Found
          </h2>
          <p className="text-muted-foreground">
            Unable to load student information.
          </p>
        </div>
      </div>
    );
  }

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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Full Name</p>
              <p className="font-medium">{studentData.personal.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Class & Section</p>
              <p className="font-medium">
                {studentData.personal.class} {studentData.personal.section}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Roll Number</p>
              <p className="font-medium">{studentData.personal.rollNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Admission Number</p>
              <p className="font-medium">
                {studentData.personal.admissionNumber}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Admission Date</p>
              <p className="font-medium">
                {studentData.personal.admissionDate}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">House</p>
              <p className="font-medium">{studentData.personal.house}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Blood Group</p>
              <p className="font-medium">{studentData.personal.bloodGroup}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Phone</p>
              <p className="font-medium">{studentData.personal.phone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="font-medium">{studentData.personal.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Card */}
      <Card className="border-2 shadow-lg transition-shadow hover:shadow-xl">
        <CardHeader className="border-b bg-gradient-to-r from-green-50 to-green-25 pb-3 dark:from-green-950/20 dark:to-green-900/10">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            Attendance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="font-bold text-2xl text-green-600">
                {studentData.attendance.present}
              </p>
              <p className="text-muted-foreground text-sm">Present</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-2xl text-red-600">
                {studentData.attendance.absent}
              </p>
              <p className="text-muted-foreground text-sm">Absent</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-2xl text-blue-600">
                {studentData.attendance.total}
              </p>
              <p className="text-muted-foreground text-sm">Total Days</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-2xl text-primary">
                {studentData.attendance.percentage}%
              </p>
              <p className="text-muted-foreground text-sm">Percentage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades Card */}
      <Card className="border-2 shadow-lg transition-shadow hover:shadow-xl">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-blue-25 pb-3 dark:from-blue-950/20 dark:to-blue-900/10">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Academic Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentData.subjects.map((subject, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <p className="font-medium">{subject.subject}</p>
                  <p className="text-muted-foreground text-sm">
                    {subject.examType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {subject.marks}/{subject.maxMarks}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Grade: {subject.grade}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fees Card */}
      <Card className="border-2 shadow-lg transition-shadow hover:shadow-xl">
        <CardHeader className="border-b bg-gradient-to-r from-yellow-50 to-yellow-25 pb-3 dark:from-yellow-950/20 dark:to-yellow-900/10">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            Fee Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="font-bold text-2xl text-green-600">
                ₹{studentData.fees.paid.toLocaleString()}
              </p>
              <p className="text-muted-foreground text-sm">Paid</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-2xl text-red-600">
                ₹{studentData.fees.pending.toLocaleString()}
              </p>
              <p className="text-muted-foreground text-sm">Pending</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-2xl text-blue-600">
                ₹{studentData.fees.total.toLocaleString()}
              </p>
              <p className="text-muted-foreground text-sm">Total</p>
            </div>
            <div className="text-center">
              <p
                className={`font-bold text-2xl ${
                  studentData.fees.status === "paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {studentData.fees.status === "paid" ? "Paid" : "Pending"}
              </p>
              <p className="text-muted-foreground text-sm">Status</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
