import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/app/students/$id")({
  component: StudentDetailPage,
});

async function fetchStudent(id: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Find student from mock data
  const student = await api.students.get(id);

  if (!student) throw new Error("Student not found");
  return student;
}

function StudentDetailPage() {
  const params = Route.useParams();
  const location = useLocation();
  const studentId = params.id || location.pathname.split("/").pop() || "";

  const {
    data: student,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => fetchStudent(studentId),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-4xl">❌</div>
        <h2 className="font-bold text-foreground text-xl">
          Error loading student
        </h2>
        <p className="text-muted-foreground">The student could not be found.</p>
        <Link
          to="/app/students"
          className="mt-4 inline-block text-primary hover:underline"
        >
          ← Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/app/students"
          className="mb-4 inline-block text-primary hover:underline"
        >
          ← Back to Students
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary font-bold text-2xl text-primary-foreground">
            {student.firstName?.charAt(0)}
            {student.lastName?.charAt(0)}
          </div>
          <div>
            <h1 className="font-bold text-2xl text-foreground">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-muted-foreground">
              Admission No: {student.admissionNumber || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-bold text-foreground text-lg">
              Student Information
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">{student.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Phone</p>
                <p className="font-medium">{student.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Gender</p>
                <p className="font-medium">{student.gender || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Date of Birth</p>
                <p className="font-medium">{student.dateOfBirth || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-bold text-foreground text-lg">
              Parent Information
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm">Father Name</p>
                <p className="font-medium">{student.fatherName || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Father Phone</p>
                <p className="font-medium">{student.fatherPhone || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Mother Name</p>
                <p className="font-medium">{student.motherName || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Mother Phone</p>
                <p className="font-medium">{student.motherPhone || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-bold text-foreground text-lg">Address</h2>
            <p className="text-muted-foreground">
              {student.address || "No address provided"}
            </p>
            {student.city && (
              <p className="text-muted-foreground">
                {student.city}, {student.state} {student.pincode}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-bold text-foreground text-lg">
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attendance</span>
                <span className="font-medium text-success">94.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fees Paid</span>
                <span className="font-medium text-success">₹15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exams Taken</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 font-bold text-foreground text-lg">Actions</h2>
            <div className="space-y-2">
              <button className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90">
                Edit Student
              </button>
              <button className="w-full rounded-lg border px-4 py-2 transition-colors hover:bg-muted">
                View Attendance
              </button>
              <button className="w-full rounded-lg border px-4 py-2 transition-colors hover:bg-muted">
                View Fees
              </button>
              <button className="w-full rounded-lg border border-destructive/30 px-4 py-2 text-destructive transition-colors hover:bg-destructive/10">
                Delete Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
