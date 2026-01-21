import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Calendar,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/app/exams")({
  component: ExamsPage,
});

interface Exam {
  id: string;
  name: string;
  className: string;
  subject: string;
  date: string;
  maxMarks: number;
  status: "scheduled" | "completed" | "upcoming";
}

interface Mark {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  marks: number;
  grade: string;
}

function ExamsPage() {
  const { user, hasPermission } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [activeTab, setActiveTab] = useState<"exams" | "marks">("exams");
  const queryClient = useQueryClient();

  const canCreate = hasPermission("exams", "create");
  const canDelete = hasPermission("exams", "delete");

  const mockExams: Exam[] = [
    {
      id: "1",
      name: "Mathematics Unit Test",
      className: "Class 9-A",
      subject: "Mathematics",
      date: "2026-01-25",
      maxMarks: 100,
      status: "scheduled",
    },
    {
      id: "2",
      name: "Physics Mid Term",
      className: "Class 10-A",
      subject: "Physics",
      date: "2026-01-20",
      maxMarks: 100,
      status: "completed",
    },
    {
      id: "3",
      name: "Chemistry Quarterly",
      className: "Class 9-B",
      subject: "Chemistry",
      date: "2026-02-01",
      maxMarks: 100,
      status: "upcoming",
    },
  ];

  const mockMarks: Mark[] = [
    {
      id: "1",
      examId: "2",
      studentId: "1",
      studentName: "John Smith",
      marks: 85,
      grade: "A",
    },
    {
      id: "2",
      examId: "2",
      studentId: "2",
      studentName: "Emma Wilson",
      marks: 92,
      grade: "A+",
    },
    {
      id: "3",
      examId: "2",
      studentId: "3",
      studentName: "James Brown",
      marks: 78,
      grade: "B+",
    },
    {
      id: "4",
      examId: "2",
      studentId: "4",
      studentName: "Sarah Davis",
      marks: 88,
      grade: "A",
    },
  ];

  const examStats = {
    total: mockExams.length,
    completed: mockExams.filter((e) => e.status === "completed").length,
    upcoming: mockExams.filter((e) => e.status === "upcoming").length,
    scheduled: mockExams.filter((e) => e.status === "scheduled").length,
  };

  const handleDelete = (id: string) => {
    toast.promise(
      new Promise((resolve) => {
        if (confirm("Are you sure you want to delete this exam?")) {
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ["exams"] });
            resolve(true);
          }, 500);
        }
      }),
      {
        loading: "Deleting exam...",
        success: "Exam deleted successfully",
        error: "Failed to delete exam",
      },
    );
  };

  const handleViewMarks = (exam: Exam) => {
    setSelectedExam(exam);
    setShowMarksModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600">Schedule exams and enter marks</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule Exam
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold">{examStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{examStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold">{examStats.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">{examStats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden shadow-sm mb-6">
        <div className="border-b flex">
          <button
            onClick={() => setActiveTab("exams")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
              activeTab === "exams"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Exams
          </button>
          <button
            onClick={() => setActiveTab("marks")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
              activeTab === "marks"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Marks Entry
          </button>
        </div>

        {activeTab === "exams" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Exam Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Class
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Max Marks
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
                {mockExams.map((exam) => (
                  <tr key={exam.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {exam.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {exam.className}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {exam.subject}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {exam.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {exam.maxMarks}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          exam.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : exam.status === "upcoming"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {exam.status.charAt(0).toUpperCase() +
                          exam.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewMarks(exam)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Marks
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(exam.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "marks" && (
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Exam
              </label>
              <select className="w-full max-w-md px-4 py-2 border rounded-lg">
                <option value="">Select an exam</option>
                {mockExams
                  .filter((e) => e.status === "completed")
                  .map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name} - {exam.className}
                    </option>
                  ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Student Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Marks
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Grade
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockMarks.map((mark) => (
                    <tr key={mark.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">
                        {mark.studentName}
                      </td>
                      <td className="px-4 py-3 text-sm">{mark.marks}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {mark.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-green-600">
                        Entered
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Schedule New Exam</h2>
            <form>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Mathematics Unit Test"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class
                    </label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      <option>Class 9-A</option>
                      <option>Class 9-B</option>
                      <option>Class 10-A</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      <option>Mathematics</option>
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Marks
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="100"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Schedule Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMarksModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-2">{selectedExam.name}</h2>
            <p className="text-gray-600 text-sm mb-4">
              {selectedExam.className} | {selectedExam.subject} | Max Marks:{" "}
              {selectedExam.maxMarks}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Student
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Marks
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockMarks.map((mark) => (
                    <tr key={mark.id} className="border-t">
                      <td className="px-4 py-2 text-sm">{mark.studentName}</td>
                      <td className="px-4 py-2 text-sm">{mark.marks}</td>
                      <td className="px-4 py-2 text-sm">{mark.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setShowMarksModal(false)}
              className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
