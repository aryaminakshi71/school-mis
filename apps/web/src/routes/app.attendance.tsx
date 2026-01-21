import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Calendar,
  Save,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  ChevronDown,
} from "lucide-react";

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
}

export const Route = createFileRoute("/app/attendance")({
  component: AttendancePage,
});

async function fetchAttendance(
  date: string,
  classId?: string,
): Promise<AttendanceRecord[]> {
  const params = new URLSearchParams({ date });
  if (classId) params.append("classId", classId);
  const res = await fetch(`/api/attendance?${params}`);
  if (!res.ok) throw new Error("Failed to fetch attendance");
  const data = await res.json();
  return data.attendance || [];
}

async function saveAttendance(data: {
  date: string;
  classId: string;
  records: Array<{ studentId: string; status: string; classId: string }>;
}): Promise<{ success: boolean; saved: number }> {
  const res = await fetch("/api/attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to save attendance");
  }
  return res.json();
}

function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>(
    {},
  );
  const queryClient = useQueryClient();

  const {
    data: records,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["attendance", selectedDate, selectedClass],
    queryFn: () => fetchAttendance(selectedDate, selectedClass),
  });

  const saveMutation = useMutation({
    mutationFn: saveAttendance,
    onSuccess: (data: { saved: number }) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast.success(`Attendance saved for ${data.saved} students`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    if (!records || records.length === 0) {
      toast.error("No students to save");
      return;
    }

    const recordsToSave = records.map((record: AttendanceRecord) => ({
      studentId: record.studentId,
      status: attendanceData[record.studentId] || record.status,
      classId: selectedClass,
    }));

    saveMutation.mutate({
      date: selectedDate,
      classId: selectedClass,
      records: recordsToSave,
    });
  };

  const stats = {
    present: (records || []).filter(
      (r: AttendanceRecord) => r.status === "present",
    ).length,
    absent: (records || []).filter(
      (r: AttendanceRecord) => r.status === "absent",
    ).length,
    late: (records || []).filter((r: AttendanceRecord) => r.status === "late")
      .length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Track student attendance</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-green-700 text-sm font-medium">Present</p>
          </div>
          <p className="text-2xl font-bold text-green-800">{stats.present}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-red-700 text-sm font-medium">Absent</p>
          </div>
          <p className="text-2xl font-bold text-red-800">{stats.absent}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-yellow-700 text-sm font-medium">Late</p>
          </div>
          <p className="text-2xl font-bold text-yellow-800">{stats.late}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-blue-700 text-sm font-medium">Total</p>
          </div>
          <p className="text-2xl font-bold text-blue-800">
            {records?.length || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
        <div className="p-4 border-b flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              <option value="9-a">Class 9-A</option>
              <option value="9-b">Class 9-B</option>
              <option value="10-a">Class 10-A</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saveMutation.isPending ? "Saving..." : "Save Attendance"}
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading attendance...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            Error loading attendance. Please try again.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Class
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {records?.map((record: AttendanceRecord) => (
                <tr key={record.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">
                    {record.studentName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {record.className}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={attendanceData[record.studentId] || record.status}
                      onChange={(e) =>
                        handleStatusChange(record.studentId, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        (attendanceData[record.studentId] || record.status) ===
                        "present"
                          ? "bg-green-100 text-green-700"
                          : (attendanceData[record.studentId] ||
                                record.status) === "absent"
                            ? "bg-red-100 text-red-700"
                            : (attendanceData[record.studentId] ||
                                  record.status) === "late"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="excused">Excused</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {records?.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-600"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <p>No attendance records found. Select a date and class.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
