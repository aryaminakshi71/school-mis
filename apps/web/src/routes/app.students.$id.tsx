import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">❌</div>
        <h2 className="text-xl font-bold text-gray-900">
          Error loading student
        </h2>
        <p className="text-gray-600">The student could not be found.</p>
        <Link
          to="/app/students"
          className="mt-4 inline-block text-blue-600 hover:underline"
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
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Students
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {student.firstName?.charAt(0)}
            {student.lastName?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600">
              Admission No: {student.admissionNumber || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Student Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{student.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{student.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{student.gender || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{student.dateOfBirth || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Parent Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Father Name</p>
                <p className="font-medium">{student.fatherName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Father Phone</p>
                <p className="font-medium">{student.fatherPhone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mother Name</p>
                <p className="font-medium">{student.motherName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mother Phone</p>
                <p className="font-medium">{student.motherPhone || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Address</h2>
            <p className="text-gray-600">
              {student.address || "No address provided"}
            </p>
            {student.city && (
              <p className="text-gray-600">
                {student.city}, {student.state} {student.pincode}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Attendance</span>
                <span className="font-medium text-green-600">94.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fees Paid</span>
                <span className="font-medium text-green-600">₹15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Exams Taken</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-2">
              <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Student
              </button>
              <button className="w-full py-2 px-4 border rounded-lg hover:bg-gray-50 transition-colors">
                View Attendance
              </button>
              <button className="w-full py-2 px-4 border rounded-lg hover:bg-gray-50 transition-colors">
                View Fees
              </button>
              <button className="w-full py-2 px-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                Delete Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
