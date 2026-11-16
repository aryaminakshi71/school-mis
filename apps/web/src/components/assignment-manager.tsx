import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Edit2,
  Eye,
  FileText,
  Loader2,
  Plus,
  Search,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

export type AssignmentStatus =
  | "draft"
  | "published"
  | "submitted"
  | "graded"
  | "late";
export type SubmissionType = "file" | "text" | "link" | "quiz";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  teacher: string;
  dueDate: Date;
  maxMarks: number;
  submissionType: SubmissionType;
  attachments?: string[];
  status: AssignmentStatus;
  createdAt: Date;
  submissions?: AssignmentSubmission[];
  gradingRubric?: GradingCriteria[];
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: Date;
  content: string;
  attachments?: string[];
  marks?: number;
  feedback?: string;
  status: "submitted" | "graded" | "late";
  plagiarismScore?: number;
}

export interface GradingCriteria {
  id: string;
  name: string;
  description: string;
  maxMarks: number;
  marks?: number;
}

interface AssignmentManagerProps {
  mode: "teacher" | "student";
  userId: string;
  userName: string;
  classId?: string;
}

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Mathematics Problem Set - Chapter 5",
    description:
      "Complete exercises 5.1 to 5.5 from the textbook. Show all your work and steps clearly.",
    subject: "Mathematics",
    class: "10-A",
    teacher: "Mr. Rajesh Kumar",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    maxMarks: 50,
    submissionType: "file",
    status: "published",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    submissions: [],
    gradingRubric: [
      {
        id: "1",
        name: "Problem Solving",
        description: "Correct approach and methodology",
        maxMarks: 20,
      },
      {
        id: "2",
        name: "Accuracy",
        description: "Correct calculations and answers",
        maxMarks: 20,
      },
      {
        id: "3",
        name: "Presentation",
        description: "Neatness and organization",
        maxMarks: 10,
      },
    ],
  },
  {
    id: "2",
    title: "Science Lab Report - Photosynthesis",
    description:
      "Write a detailed lab report on the photosynthesis experiment conducted in class. Include hypothesis, procedure, observations, and conclusion.",
    subject: "Science",
    class: "10-A",
    teacher: "Mrs. Sunita Gupta",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    maxMarks: 30,
    submissionType: "file",
    status: "published",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    submissions: [
      {
        id: "sub-1",
        studentId: "stu-1",
        studentName: "Rahul Sharma",
        submittedAt: new Date(),
        content: "Lab report uploaded",
        attachments: ["lab_report.pdf"],
        status: "submitted",
        plagiarismScore: 12,
      },
    ],
    gradingRubric: [
      {
        id: "1",
        name: "Hypothesis",
        description: "Clear and testable hypothesis",
        maxMarks: 5,
      },
      {
        id: "2",
        name: "Procedure",
        description: "Detailed step-by-step procedure",
        maxMarks: 10,
      },
      {
        id: "3",
        name: "Observations",
        description: "Accurate and detailed observations",
        maxMarks: 10,
      },
      {
        id: "4",
        name: "Conclusion",
        description: "Valid conclusion based on data",
        maxMarks: 5,
      },
    ],
  },
];

export function AssignmentManager({
  mode,
  userId,
  userName,
  classId,
}: AssignmentManagerProps) {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<AssignmentStatus | "all">(
    "all",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionContent, setSubmissionContent] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);
  const [gradingAssignment, setGradingAssignment] = useState<Assignment | null>(
    null,
  );
  const [gradingSubmission, setGradingSubmission] =
    useState<AssignmentSubmission | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSubmissionFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    setSubmissionFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const submitAssignment = async (assignment: Assignment) => {
    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newSubmission: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      studentId: userId,
      studentName: userName,
      submittedAt: new Date(),
      content: submissionContent,
      attachments: submissionFiles.map((f) => f.name),
      status: new Date() > assignment.dueDate ? "late" : "submitted",
    };

    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignment.id) {
          return {
            ...a,
            submissions: [...(a.submissions || []), newSubmission],
          };
        }
        return a;
      }),
    );

    setSubmissionContent("");
    setSubmissionFiles([]);
    setSelectedAssignment(null);
    setIsSubmitting(false);
    alert("Assignment submitted successfully!");
  };

  const gradeSubmission = (
    assignment: Assignment,
    submission: AssignmentSubmission,
    criteriaMarks: Record<string, number>,
    feedback: string,
  ) => {
    const totalMarks = Object.values(criteriaMarks).reduce((a, b) => a + b, 0);

    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignment.id) {
          return {
            ...a,
            submissions: a.submissions?.map((s) => {
              if (s.id === submission.id) {
                return {
                  ...s,
                  marks: totalMarks,
                  feedback,
                  status: "graded",
                };
              }
              return s;
            }),
          };
        }
        return a;
      }),
    );

    setGradingAssignment(null);
    setGradingSubmission(null);
    alert("Assignment graded successfully!");
  };

  const getStatusColor = (status: AssignmentStatus) => {
    const colors = {
      draft: "bg-gray-100 text-gray-700",
      published: "bg-blue-100 text-blue-700",
      submitted: "bg-yellow-100 text-yellow-700",
      graded: "bg-green-100 text-green-700",
      late: "bg-red-100 text-red-700",
    };
    return colors[status] || colors.draft;
  };

  const isOverdue = (dueDate: Date) => new Date() > dueDate;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
              {mode === "teacher" ? "Assignment Manager" : "My Assignments"}
            </h2>
            <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
              {mode === "teacher"
                ? "Create and manage assignments"
                : "View and submit your assignments"}
            </p>
          </div>
          {mode === "teacher" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Assignment
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search assignments..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as AssignmentStatus | "all")
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
          </select>
        </div>
      </div>

      {/* Assignment List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {filteredAssignments.map((assignment) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {assignment.title}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-1 font-medium text-xs ${getStatusColor(assignment.status)}`}
                  >
                    {assignment.status.charAt(0).toUpperCase() +
                      assignment.status.slice(1)}
                  </span>
                  {isOverdue(assignment.dueDate) &&
                    assignment.status !== "graded" && (
                      <span className="rounded-full bg-red-100 px-2 py-1 font-medium text-red-700 text-xs">
                        Overdue
                      </span>
                    )}
                </div>
                <p className="mb-3 text-gray-600 text-sm dark:text-gray-400">
                  {assignment.description.slice(0, 150)}...
                </p>
                <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {assignment.subject}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {assignment.class}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Due: {assignment.dueDate.toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {assignment.maxMarks} marks
                  </span>
                </div>
              </div>

              <div className="ml-4 flex items-center gap-2">
                {mode === "student" && assignment.status === "published" && (
                  <button
                    onClick={() => setSelectedAssignment(assignment)}
                    className="rounded-lg bg-primary px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-primary/90"
                  >
                    Submit
                  </button>
                )}
                {mode === "teacher" && (
                  <>
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20">
                      <Edit2 className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Submissions count for teachers */}
            {mode === "teacher" && assignment.submissions && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-gray-500 text-sm">
                  {assignment.submissions.length} submission
                  {assignment.submissions.length !== 1 ? "s" : ""}
                </span>
                {assignment.submissions.some(
                  (s) => s.status === "submitted",
                ) && (
                  <button
                    onClick={() => {
                      setGradingAssignment(assignment);
                      setGradingSubmission(
                        assignment.submissions?.find(
                          (s) => s.status === "submitted",
                        ) || null,
                      );
                    }}
                    className="text-primary text-sm hover:text-primary/80"
                  >
                    Grade now →
                  </button>
                )}
              </div>
            )}

            {/* Student submission status */}
            {mode === "student" &&
              assignment.submissions?.find((s) => s.studentId === userId) && (
                <div className="mt-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-700 text-sm dark:text-green-300">
                      Submitted on{" "}
                      {assignment.submissions
                        .find((s) => s.studentId === userId)
                        ?.submittedAt.toLocaleDateString()}
                    </span>
                  </div>
                  {assignment.submissions.find((s) => s.studentId === userId)
                    ?.marks !== undefined && (
                    <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
                      Marks:{" "}
                      {
                        assignment.submissions.find(
                          (s) => s.studentId === userId,
                        )?.marks
                      }{" "}
                      / {assignment.maxMarks}
                    </p>
                  )}
                </div>
              )}
          </motion.div>
        ))}

        {filteredAssignments.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500 dark:text-gray-400">
              No assignments found
            </p>
          </div>
        )}
      </div>

      {/* Submit Assignment Modal */}
      <AnimatePresence>
        {selectedAssignment && mode === "student" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg dark:text-gray-100">
                    Submit Assignment
                  </h3>
                  <button
                    onClick={() => setSelectedAssignment(null)}
                    className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="mb-4 text-gray-600 text-sm dark:text-gray-400">
                  {selectedAssignment.title}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                      Your Submission
                    </label>
                    <textarea
                      value={submissionContent}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setSubmissionContent(e.target.value)
                      }
                      placeholder="Enter your submission details..."
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                      Attachments
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer rounded-lg border-2 border-gray-300 border-dashed p-4 text-center transition-colors hover:border-primary dark:border-gray-700"
                    >
                      <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-gray-600 text-sm dark:text-gray-400">
                        Click to upload files
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {submissionFiles.length > 0 && (
                    <div className="space-y-2">
                      {submissionFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
                        >
                          <span className="text-gray-700 text-sm dark:text-gray-300">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setSelectedAssignment(null)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitAssignment(selectedAssignment)}
                    disabled={isSubmitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Submit Assignment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grading Modal */}
      <AnimatePresence>
        {gradingAssignment && gradingSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg dark:text-gray-100">
                      Grade Assignment
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {gradingSubmission.studentName} -{" "}
                      {gradingAssignment.title}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setGradingAssignment(null);
                      setGradingSubmission(null);
                    }}
                    className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Submission Details */}
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <h4 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                        Submission
                      </h4>
                      <p className="text-gray-600 text-sm dark:text-gray-400">
                        {gradingSubmission.content}
                      </p>
                      {gradingSubmission.attachments && (
                        <div className="mt-3 space-y-2">
                          {gradingSubmission.attachments.map((file, idx) => (
                            <a
                              key={idx}
                              href="#"
                              className="flex items-center gap-2 text-primary text-sm hover:text-primary/80"
                            >
                              <Download className="h-4 w-4" />
                              {file}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {gradingSubmission.plagiarismScore !== undefined && (
                      <div
                        className={`rounded-lg p-4 ${gradingSubmission.plagiarismScore > 30 ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20"}`}
                      >
                        <h4 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                          Plagiarism Check
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`h-full rounded-full ${gradingSubmission.plagiarismScore > 30 ? "bg-red-500" : "bg-green-500"}`}
                              style={{
                                width: `${gradingSubmission.plagiarismScore}%`,
                              }}
                            />
                          </div>
                          <span className="font-medium text-sm">
                            {gradingSubmission.plagiarismScore}%
                          </span>
                        </div>
                        {gradingSubmission.plagiarismScore > 30 && (
                          <p className="mt-2 text-red-600 text-sm dark:text-red-400">
                            <AlertCircle className="mr-1 inline h-4 w-4" />
                            High similarity detected
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Grading Rubric */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Grading Rubric
                    </h4>
                    {gradingAssignment.gradingRubric?.map((criteria) => (
                      <div key={criteria.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">
                            {criteria.name}
                          </span>
                          <span className="text-gray-500">
                            <input
                              type="number"
                              min={0}
                              max={criteria.maxMarks}
                              defaultValue={0}
                              className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-center dark:border-gray-700 dark:bg-gray-800"
                              onChange={(e) => {
                                // Update marks logic here
                              }}
                            />
                            / {criteria.maxMarks}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs">
                          {criteria.description}
                        </p>
                      </div>
                    ))}

                    <div className="border-gray-200 border-t pt-4 dark:border-gray-700">
                      <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                        Feedback
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Provide feedback to the student..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setGradingAssignment(null);
                      setGradingSubmission(null);
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      gradeSubmission(
                        gradingAssignment,
                        gradingSubmission,
                        {},
                        "",
                      )
                    }
                    className="flex-1 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
                  >
                    Submit Grades
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AssignmentManager;
