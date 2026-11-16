import { useQuery } from "@tanstack/react-query";
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
import { api } from "../lib/api";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/app/parent-portal")({
  component: ParentPortal,
});

function ParentPortal() {
  const { user, hasRole } = useAuth();

  // Mock data for subject performance (should be replaced with actual API data)
  const mockSubjectPerformance = [
    { subject: "Mathematics", teacher: "Mr. Sharma", marks: 85, grade: "A" },
    { subject: "Science", teacher: "Mrs. Gupta", marks: 78, grade: "B+" },
    { subject: "English", teacher: "Mr. Kumar", marks: 82, grade: "A" },
    { subject: "Hindi", teacher: "Mrs. Patel", marks: 75, grade: "B" },
    { subject: "Social Studies", teacher: "Mr. Singh", marks: 80, grade: "A" },
  ];

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

  // Fetch children data
  const { data: childrenData, isLoading: childrenLoading } = useQuery({
    queryKey: ["parent-children"],
    queryFn: async () => {
      const data = await api.students.getMyChildren();
      return (data as any).children || [];
    },
  });

  // Fetch selected child's attendance
  const { data: childAttendance, isLoading: attendanceLoading } = useQuery({
    queryKey: [
      "child-attendance",
      selectedChild,
      childrenData?.[selectedChild]?.id,
    ],
    queryFn: async () => {
      if (!childrenData?.[selectedChild]?.id) return null;
      const data = await api.students.getChildAttendance(
        childrenData[selectedChild].id,
      );
      return (data as any).attendance || [];
    },
    enabled: !!childrenData?.[selectedChild]?.id,
  });

  // Fetch selected child's grades
  const { data: childGrades, isLoading: gradesLoading } = useQuery({
    queryKey: [
      "child-grades",
      selectedChild,
      childrenData?.[selectedChild]?.id,
    ],
    queryFn: async () => {
      if (!childrenData?.[selectedChild]?.id) return null;
      const data = await api.students.getChildGrades(
        childrenData[selectedChild].id,
      );
      return (data as any).grades || [];
    },
    enabled: !!childrenData?.[selectedChild]?.id,
  });

  // Fetch selected child's fees
  const { data: childFees, isLoading: feesLoading } = useQuery({
    queryKey: ["child-fees", selectedChild, childrenData?.[selectedChild]?.id],
    queryFn: async () => {
      if (!childrenData?.[selectedChild]?.id) return null;
      const data = await api.students.getChildFees(
        childrenData[selectedChild].id,
      );
      return (data as any).fees;
    },
    enabled: !!childrenData?.[selectedChild]?.id,
  });

  // Fetch selected child's exams
  const { data: childExams, isLoading: examsLoading } = useQuery({
    queryKey: ["child-exams", selectedChild, childrenData?.[selectedChild]?.id],
    queryFn: async () => {
      if (!childrenData?.[selectedChild]?.id) return null;
      const data = await api.students.getChildExams(
        childrenData[selectedChild].id,
      );
      return (data as any).exams || [];
    },
    enabled: !!childrenData?.[selectedChild]?.id,
  });

  // Fetch selected child's homework
  const { data: childHomework, isLoading: homeworkLoading } = useQuery({
    queryKey: [
      "child-homework",
      selectedChild,
      childrenData?.[selectedChild]?.id,
    ],
    queryFn: async () => {
      if (!childrenData?.[selectedChild]?.id) return null;
      const data = await api.students.getChildHomework(
        childrenData[selectedChild].id,
      );
      return (data as any).homework || [];
    },
    enabled: !!childrenData?.[selectedChild]?.id,
  });

  // Fetch selected child's library books
  const { data: childLibraryBooks, isLoading: libraryLoading } = useQuery({
    queryKey: [
      "child-library",
      selectedChild,
      childrenData?.[selectedChild]?.id,
    ],
    queryFn: async () => {
      if (!childrenData?.[selectedChild]?.id) return null;
      const data = await api.students.getChildLibraryBooks(
        childrenData[selectedChild].id,
      );
      return (data as any).books || [];
    },
    enabled: !!childrenData?.[selectedChild]?.id,
  });

  // Fetch selected child's transport details
  const { data: childTransport, isLoading: transportLoading } = useQuery({
    queryKey: [
      "child-transport",
      selectedChild,
      childrenData?.[selectedChild]?.id,
    ],
    queryFn: async () => {
      if (!childrenData?.[selectedChild]?.id) return null;
      const data = await api.students.getChildTransport(
        childrenData[selectedChild].id,
      );
      return (data as any).transport;
    },
    enabled: !!childrenData?.[selectedChild]?.id,
  });

  // Fetch notices
  const { data: notices, isLoading: noticesLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      if (!childrenData?.[selectedChild]?.id) return [];
      const data = await api.students.getChildNotices(
        childrenData[selectedChild].id,
      );
      return (data as any).notices || [];
    },
    enabled: !!childrenData?.[selectedChild]?.id,
  });

  // Fetch selected child's teachers
  const { data: childTeachers, isLoading: teachersLoading } = useQuery({
    queryKey: [
      "child-teachers",
      selectedChild,
      childrenData?.[selectedChild]?.id,
    ],
    queryFn: async () => {
      if (!childrenData?.[selectedChild]?.id) return null;
      const data = await api.students.getChildTeachers(
        childrenData[selectedChild].id,
      );
      return (data as any).teachers || [];
    },
    enabled: !!childrenData?.[selectedChild]?.id,
  });

  if (childrenLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const children = childrenData || [];
  const currentChild = children[selectedChild];

  if (!currentChild) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <User className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 font-bold text-foreground text-xl">
            No Children Found
          </h2>
          <p className="text-muted-foreground">
            Unable to load children information.
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
        <div>
          <h1 className="mb-2 font-bold text-3xl text-foreground">
            Parent Portal
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your child&apos;s progress and school activities
          </p>
        </div>
      </div>

      {children.length > 1 && (
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {children.map((child: any, index: number) => (
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
                  {child.firstName.charAt(0)}
                </span>
                <span className="text-left">
                  <span className="block font-medium text-sm">
                    {child.firstName} {child.lastName}
                  </span>
                  <span className="block text-muted-foreground text-xs">
                    {child.className || "Not Assigned"}
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
                {currentChild.firstName.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-lg">
                  {currentChild.firstName} {currentChild.lastName}
                </h3>
                <p className="text-muted-foreground">
                  {currentChild.className || "Not Assigned"}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Roll Number</p>
                    <p className="font-medium">
                      {currentChild.rollNumber || currentChild.admissionNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Admission Date
                    </p>
                    <p className="font-medium">
                      {currentChild.createdAt
                        ? new Date(currentChild.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Father&apos;s Name
                    </p>
                    <p className="font-medium">
                      {currentChild.fatherName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Phone</p>
                    <p className="font-medium">
                      {currentChild.fatherPhone || currentChild.phone || "N/A"}
                    </p>
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
            {attendanceLoading ? (
              <div className="flex h-24 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : childAttendance && childAttendance.length > 0 ? (
              <>
                <div className="mb-4 text-center">
                  <div className="font-bold text-4xl text-primary">
                    {childAttendance[0].percentage || 0}%
                  </div>
                  <p className="text-muted-foreground">Overall Attendance</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-success/15 p-2">
                    <div className="font-bold text-success">
                      {childAttendance[0].present || 0}
                    </div>
                    <div className="text-success text-xs">Present</div>
                  </div>
                  <div className="rounded-lg bg-destructive/10 p-2">
                    <div className="font-bold text-destructive">
                      {childAttendance[0].absent || 0}
                    </div>
                    <div className="text-destructive text-xs">Absent</div>
                  </div>
                  <div className="rounded-lg bg-muted p-2">
                    <div className="font-bold text-muted-foreground">
                      {childAttendance[0].total || 0}
                    </div>
                    <div className="text-muted-foreground text-xs">Total</div>
                  </div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <p className="mb-2 text-muted-foreground text-sm">
                    Recent Records
                  </p>
                  {childAttendance
                    .slice(0, 3)
                    .map((record: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-1 text-sm"
                      >
                        <span>{record.className || `Record ${index + 1}`}</span>
                        <span
                          className={
                            (record.percentage || 0) >= 90
                              ? "text-success"
                              : "text-warning"
                          }
                        >
                          {record.percentage || 0}%
                        </span>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="flex h-24 items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  No attendance data available
                </p>
              </div>
            )}
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
            {feesLoading ? (
              <div className="flex h-24 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : childFees ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Fees</span>
                  <span className="font-bold">
                    ₹{childFees.total?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="font-bold text-success">
                    ₹{childFees.paid?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-bold text-warning">
                    ₹{childFees.pending?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <p className="text-muted-foreground text-sm">
                    Status:{" "}
                    <span
                      className={`font-medium ${childFees.status === "paid" ? "text-success" : "text-warning"}`}
                    >
                      {childFees.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </p>
                  {childFees.dueDate && (
                    <p className="text-muted-foreground text-sm">
                      Next due date: {childFees.dueDate}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  No fee data available
                </p>
              </div>
            )}
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
            {homeworkLoading ? (
              <div className="flex h-24 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-3">
                {(childHomework || []).slice(0, 3).map((hw: any) => (
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
                {(!childHomework || childHomework.length === 0) && (
                  <p className="text-muted-foreground text-sm">
                    No homework assigned
                  </p>
                )}
              </div>
            )}
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
            {libraryLoading ? (
              <div className="flex h-24 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-3">
                {(childLibraryBooks || []).map((book: any) => (
                  <div
                    key={book.id}
                    className="rounded-lg border-primary border-l-4 bg-primary/5 p-2"
                  >
                    <p className="font-medium text-sm">{book.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {book.author}
                    </p>
                    <div className="mt-2 flex justify-between">
                      <span className="text-primary text-xs">
                        Due: {book.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
                {(!childLibraryBooks || childLibraryBooks.length === 0) && (
                  <p className="text-muted-foreground text-sm">
                    No books issued
                  </p>
                )}
              </div>
            )}
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
            {transportLoading ? (
              <div className="flex h-24 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : childTransport ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Route</span>
                  <span className="font-medium">{childTransport.route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stop</span>
                  <span className="font-medium">{childTransport.stop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pickup</span>
                  <span className="font-medium">
                    {childTransport.pickupTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Drop</span>
                  <span className="font-medium">{childTransport.dropTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver</span>
                  <span className="font-medium">
                    {childTransport.driverName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span className="font-medium">
                    {childTransport.vehicleNumber}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No transport assigned
              </p>
            )}
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
            {examsLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
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
                    {(childExams || []).map((exam: any) => (
                      <tr key={exam.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{exam.name}</td>
                        <td className="py-3 text-muted-foreground">
                          {exam.date}
                        </td>
                        <td className="py-3">
                          {exam.status === "Upcoming" ? (
                            <Badge variant="warning">Upcoming</Badge>
                          ) : (
                            `${exam.marks || 0}/${exam.maxMarks || 100}`
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
                    {(!childExams || childExams.length === 0) && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-muted-foreground"
                        >
                          No exam results available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
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
            {noticesLoading ? (
              <div className="flex h-24 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-3">
                {(notices || []).map((notice: any) => (
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
                {(!notices || notices.length === 0) && (
                  <p className="text-muted-foreground text-sm">
                    No notices available
                  </p>
                )}
              </div>
            )}
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
            {teachersLoading ? (
              <div className="flex h-24 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-3">
                {(childTeachers || []).map((teacher: any) => (
                  <div key={teacher.id} className="rounded-lg bg-muted p-3">
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
                {(!childTeachers || childTeachers.length === 0) && (
                  <p className="text-muted-foreground text-sm">
                    No teachers assigned
                  </p>
                )}
              </div>
            )}
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
                  {(childTeachers || []).map((teacher: any) => (
                    <option key={teacher.id} value={teacher.name}>
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
