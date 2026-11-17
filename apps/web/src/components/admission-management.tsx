import { AnimatePresence, motion } from "framer-motion";
import { toPng } from "html-to-image";
import {
  Check,
  Download,
  FileText,
  QrCode,
  Upload,
  UserPlus,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

export interface StudentApplication {
  id: string;
  studentName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  fatherName: string;
  motherName: string;
  phone: string;
  email: string;
  address: string;
  previousSchool: string;
  classApplying: string;
  documents: {
    birthCertificate?: string;
    previousMarksheet?: string;
    addressProof?: string;
    photo?: string;
  };
  status: "pending" | "under-review" | "approved" | "rejected" | "admitted";
  appliedDate: Date;
  meritScore?: number;
}

interface AdmissionManagementProps {
  onSubmitApplication: (
    application: Omit<StudentApplication, "id" | "status" | "appliedDate">,
  ) => Promise<void>;
  onApprove: (applicationId: string) => Promise<void>;
  onReject: (applicationId: string, reason: string) => Promise<void>;
  onGenerateID: (application: StudentApplication) => Promise<void>;
  mode: "applicant" | "admin";
}

const CLASSES = [
  "Nursery",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

export function AdmissionManagement({
  onSubmitApplication,
  onApprove,
  onReject,
  onGenerateID,
  mode,
}: AdmissionManagementProps) {
  const [showForm, setShowForm] = useState(mode === "applicant");
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [formData, setFormData] = useState({
    studentName: "",
    dateOfBirth: "",
    gender: "male" as "male" | "female" | "other",
    fatherName: "",
    motherName: "",
    phone: "",
    email: "",
    address: "",
    previousSchool: "",
    classApplying: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] =
    useState<StudentApplication | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const idCardRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (documentType: string, file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [documentType]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmitApplication({
        ...formData,
        documents: Object.keys(uploadedFiles).reduce((acc, key) => {
          acc[key as keyof typeof acc] = uploadedFiles[key].name;
          return acc;
        }, {} as any),
      });

      alert("Application submitted successfully!");
      setShowForm(false);
      setFormData({
        studentName: "",
        dateOfBirth: "",
        gender: "male",
        fatherName: "",
        motherName: "",
        phone: "",
        email: "",
        address: "",
        previousSchool: "",
        classApplying: "",
      });
      setUploadedFiles({});
    } catch (error) {
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadIDCard = async () => {
    if (idCardRef.current && selectedApplication) {
      try {
        const dataUrl = await toPng(idCardRef.current, { quality: 0.95 });
        const link = document.createElement("a");
        link.download = `ID-Card-${selectedApplication.studentName}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Failed to generate ID card:", err);
      }
    }
  };

  const filteredApplications = applications.filter(
    (app) => filterStatus === "all" || app.status === filterStatus,
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      "under-review": "bg-blue-100 text-blue-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      admitted: "bg-purple-100 text-purple-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (mode === "applicant" && showForm) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-gray-200 border-b p-6 dark:border-gray-800">
          <h2 className="flex items-center gap-2 font-bold text-gray-900 text-xl dark:text-gray-100">
            <UserPlus className="h-6 w-6 text-primary" />
            Online Admission Application
          </h2>
          <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            Fill in the details below to apply for admission
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Student Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Student Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary dark:border-gray-700"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary dark:border-gray-700"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Gender *
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value as any })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary dark:border-gray-700"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Class Applying For *
                </label>
                <select
                  required
                  value={formData.classApplying}
                  onChange={(e) =>
                    setFormData({ ...formData, classApplying: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary dark:border-gray-700"
                >
                  <option value="">Select Class</option>
                  {CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      Class {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Parent Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Parent/Guardian Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Father's Name
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) =>
                    setFormData({ ...formData, fatherName: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary dark:border-gray-700"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Mother's Name
                </label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) =>
                    setFormData({ ...formData, motherName: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary dark:border-gray-700"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary dark:border-gray-700"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary dark:border-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Documents Upload */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Required Documents
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { key: "birthCertificate", label: "Birth Certificate" },
                {
                  key: "previousMarksheet",
                  label: "Previous School Marksheet",
                },
                { key: "addressProof", label: "Address Proof" },
                { key: "photo", label: "Passport Size Photo" },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="rounded-xl border-2 border-gray-300 border-dashed p-4 dark:border-gray-700"
                >
                  <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                    {label}
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(key, file);
                    }}
                    className="hidden"
                    id={`file-${key}`}
                  />
                  <label
                    htmlFor={`file-${key}`}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">
                      {uploadedFiles[key]
                        ? uploadedFiles[key].name
                        : "Upload File"}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-primary px-4 py-3 text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (mode === "admin") {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-gray-200 border-b p-6 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                Admission Applications
              </h2>
              <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                Review and manage admission applications
              </p>
            </div>
            <select
              value={filterStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterStatus(e.target.value)
              }
              className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="admitted">Admitted</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          {filteredApplications.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500 dark:text-gray-400">
                No applications found
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {app.studentName}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-1 font-medium text-xs ${getStatusColor(app.status)}`}
                        >
                          {app.status.replace("-", " ")}
                        </span>
                        {app.meritScore && (
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-primary text-xs">
                            Merit Score: {app.meritScore}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm dark:text-gray-400">
                        Applying for Class {app.classApplying} • Applied on{" "}
                        {app.appliedDate.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={() => onApprove(app.id)}
                            className="rounded-lg bg-green-500 px-3 py-1.5 text-sm text-white hover:bg-green-600"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setSelectedApplication(app)}
                            className="rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {app.status === "approved" && (
                        <button
                          onClick={() => {
                            setSelectedApplication(app);
                            onGenerateID(app);
                          }}
                          className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary/90"
                        >
                          Generate ID
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ID Card Preview Modal */}
        <AnimatePresence>
          {selectedApplication && (
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
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
              >
                {/* ID Card Preview */}
                <div
                  ref={idCardRef}
                  className="bg-gradient-to-br from-primary to-primary/80 p-8 text-white"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xl">SchoolOS</h3>
                      <p className="text-sm text-white/80">
                        Student Identity Card
                      </p>
                    </div>
                    <QrCode className="h-12 w-12 text-white/80" />
                  </div>

                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                      <span className="font-bold text-3xl">
                        {selectedApplication.studentName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        {selectedApplication.studentName}
                      </h4>
                      <p className="text-sm text-white/80">
                        Class {selectedApplication.classApplying}
                      </p>
                      <p className="text-sm text-white/80">
                        ID: {selectedApplication.id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-white/60">DOB:</span>{" "}
                      {selectedApplication.dateOfBirth}
                    </p>
                    <p>
                      <span className="text-white/60">Contact:</span>{" "}
                      {selectedApplication.phone}
                    </p>
                    <p>
                      <span className="text-white/60">Valid Until:</span> 2026
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4">
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                  >
                    Close
                  </button>
                  <button
                    onClick={downloadIDCard}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-white"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null;
}

export default AdmissionManagement;
