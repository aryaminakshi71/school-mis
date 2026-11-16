import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  GraduationCap,
  MoreVertical,
  Search,
  Star,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

export type ScholarshipType =
  | "merit"
  | "need-based"
  | "sports"
  | "arts"
  | "leadership"
  | "stem"
  | "minority"
  | "international"
  | "military"
  | "other";
export type ScholarshipStatus =
  | "draft"
  | "active"
  | "closed"
  | "awarded"
  | "suspended";
export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under-review"
  | "interview"
  | "accepted"
  | "rejected"
  | "waitlisted";
export type FundingSource =
  | "school"
  | "government"
  | "private"
  | "corporate"
  | "alumni"
  | "foundation";

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  type: ScholarshipType;
  status: ScholarshipStatus;
  amount: {
    min: number;
    max: number;
    currency: string;
    recurring: boolean;
    frequency?: "one-time" | "semester" | "annual" | "monthly";
  };
  eligibility: EligibilityCriteria;
  requirements: string[];
  applicationWindow: {
    openDate: Date;
    closeDate: Date;
    notificationDate?: Date;
  };
  fundingSource: FundingSource;
  sponsorName?: string;
  totalAwards: number;
  remainingAwards: number;
  totalFunding: number;
  disbursedAmount: number;
  documents: RequiredDocument[];
  faq?: FAQItem[];
  contactEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EligibilityCriteria {
  minGPA?: number;
  maxGPA?: number;
  minGrade?: string;
  maxGrade?: string;
  subjects?: string[];
  extracurriculars?: string[];
  financialNeed?: boolean;
  residency?: string[];
  demographics?: string[];
  specificRequirements?: string[];
}

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  type:
    | "transcript"
    | "essay"
    | "recommendation"
    | "resume"
    | "portfolio"
    | "financial"
    | "other";
  required: boolean;
  maxSize?: number;
  acceptedFormats?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  studentId: string;
  studentName: string;
  status: ApplicationStatus;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewerId?: string;
  reviewerName?: string;
  documents: UploadedDocument[];
  essays?: EssayResponse[];
  recommendationLetters?: RecommendationLetter[];
  interviewScheduled?: Date;
  interviewNotes?: string;
  awardAmount?: number;
  awardDate?: Date;
  rejectionReason?: string;
  waitlistPosition?: number;
  notes?: string;
}

export interface UploadedDocument {
  id: string;
  requirementId: string;
  name: string;
  url: string;
  uploadedAt: Date;
  size: number;
  type: string;
}

export interface EssayResponse {
  prompt: string;
  response: string;
  wordCount: number;
  submittedAt: Date;
}

export interface RecommendationLetter {
  recommenderName: string;
  recommenderTitle: string;
  relationship: string;
  letter: string;
  submittedAt: Date;
}

export interface ScholarshipRecipient {
  id: string;
  studentId: string;
  studentName: string;
  scholarshipId: string;
  scholarshipName: string;
  awardAmount: number;
  awardDate: Date;
  semester: string;
  academicYear: string;
  gpa: number;
  status: "active" | "suspended" | "completed";
  disbursements: DisbursementRecord[];
  renewalRequired: boolean;
  renewalDeadline?: Date;
}

export interface DisbursementRecord {
  id: string;
  amount: number;
  date: Date;
  semester: string;
  academicYear: string;
  status: "scheduled" | "processing" | "completed";
  method: "bank-transfer" | "check" | "direct-deposit" | "credit-to-account";
  reference?: string;
}

interface ScholarshipManagementProps {
  userRole?: "admin" | "scholarship-officer" | "teacher" | "student" | "parent";
  userId?: string;
  onCreateScholarship?: (
    scholarship: Omit<
      Scholarship,
      "id" | "createdAt" | "updatedAt" | "remainingAwards" | "disbursedAmount"
    >,
  ) => Promise<string>;
  onApplyForScholarship?: (
    application: Omit<ScholarshipApplication, "id" | "status" | "submittedAt">,
  ) => Promise<string>;
  onReviewApplication?: (
    applicationId: string,
    status: ApplicationStatus,
    notes?: string,
    awardAmount?: number,
  ) => Promise<void>;
  onUploadDocument?: (
    applicationId: string,
    document: Omit<UploadedDocument, "id" | "uploadedAt">,
  ) => Promise<void>;
  onDisburseFunds?: (
    recipientId: string,
    disbursement: Omit<DisbursementRecord, "id" | "status">,
  ) => Promise<void>;
}

export function ScholarshipManagement({
  userRole = "student",
  userId = "S001",
  onCreateScholarship,
  onApplyForScholarship,
  onReviewApplication,
  onUploadDocument,
  onDisburseFunds,
}: ScholarshipManagementProps) {
  const [activeTab, setActiveTab] = useState<
    "available" | "applications" | "awarded" | "manage"
  >("available");
  const [selectedScholarship, setSelectedScholarship] =
    useState<Scholarship | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showCreateScholarship, setShowCreateScholarship] = useState(false);
  const [showRecipientDetails, setShowRecipientDetails] =
    useState<ScholarshipRecipient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ScholarshipType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "all">(
    "all",
  );

  const [scholarships, setScholarships] = useState<Scholarship[]>([
    {
      id: "S001",
      name: "Excellence in STEM Scholarship",
      description:
        "Awarded to outstanding students demonstrating exceptional aptitude in Science, Technology, Engineering, and Mathematics. Supports students pursuing STEM degrees with a focus on innovation and research.",
      type: "stem",
      status: "active",
      amount: {
        min: 5000,
        max: 15000,
        currency: "USD",
        recurring: true,
        frequency: "annual",
      },
      eligibility: {
        minGPA: 3.5,
        subjects: [
          "Mathematics",
          "Physics",
          "Chemistry",
          "Biology",
          "Computer Science",
        ],
        specificRequirements: [
          "Must be pursuing STEM major",
          "Research experience preferred",
        ],
      },
      requirements: [
        "Official transcripts (minimum 3.5 GPA)",
        "Two letters of recommendation",
        "Personal statement (500 words)",
        "Research project portfolio",
        "Interview with selection committee",
      ],
      applicationWindow: {
        openDate: new Date(Date.now() - 86400000),
        closeDate: new Date(Date.now() + 2592000000),
        notificationDate: new Date(Date.now() + 3456000000),
      },
      fundingSource: "foundation",
      sponsorName: "Tech Innovators Foundation",
      totalAwards: 10,
      remainingAwards: 10,
      totalFunding: 150000,
      disbursedAmount: 0,
      documents: [
        {
          id: "D1",
          name: "Transcript",
          description: "Official academic transcript",
          type: "transcript",
          required: true,
          acceptedFormats: [".pdf"],
        },
        {
          id: "D2",
          name: "Recommendation Letters",
          description: "Two letters from faculty or mentors",
          type: "recommendation",
          required: true,
          acceptedFormats: [".pdf", ".docx"],
        },
        {
          id: "D3",
          name: "Personal Statement",
          description: "Essay describing your STEM interests and goals",
          type: "essay",
          required: true,
        },
        {
          id: "D4",
          name: "Research Portfolio",
          description: "Documentation of research projects",
          type: "portfolio",
          required: false,
        },
      ],
      faq: [
        {
          question: "Can I apply if I'm a sophomore?",
          answer:
            "Yes, this scholarship is open to all grade levels pursuing STEM degrees.",
        },
        {
          question: "Is the scholarship renewable?",
          answer:
            "Yes, recipients can reapply annually if they maintain a 3.5+ GPA.",
        },
      ],
      contactEmail: "scholarships@school.edu",
      createdAt: new Date(Date.now() - 7776000000),
      updatedAt: new Date(Date.now() - 2592000000),
    },
    {
      id: "S002",
      name: "Future Leaders Leadership Award",
      description:
        "Recognizes students who have demonstrated exceptional leadership skills in their school and community. Supports students with proven track records of initiative and positive impact.",
      type: "leadership",
      status: "active",
      amount: {
        min: 3000,
        max: 8000,
        currency: "USD",
        recurring: false,
        frequency: "one-time",
      },
      eligibility: {
        minGPA: 3.0,
        extracurriculars: [
          "Student Government",
          "Clubs",
          "Community Service",
          "Sports Captain",
        ],
        specificRequirements: [
          "Demonstrated leadership experience",
          "Community service hours (50+)",
        ],
      },
      requirements: [
        "Minimum 3.0 GPA",
        "Leadership experience documentation",
        "Two recommendation letters",
        "Essay on leadership philosophy (1000 words)",
        "Community service verification",
      ],
      applicationWindow: {
        openDate: new Date(Date.now() - 2592000000),
        closeDate: new Date(Date.now() + 5184000000),
      },
      fundingSource: "alumni",
      sponsorName: "Class of 1995 Alumni Association",
      totalAwards: 5,
      remainingAwards: 5,
      totalFunding: 40000,
      disbursedAmount: 0,
      documents: [
        {
          id: "D5",
          name: "Transcript",
          description: "Official transcript showing minimum 3.0 GPA",
          type: "transcript",
          required: true,
        },
        {
          id: "D6",
          name: "Leadership Documentation",
          description: "Documentation of leadership roles and achievements",
          type: "other",
          required: true,
        },
        {
          id: "D7",
          name: "Service Verification",
          description: "Proof of community service hours",
          type: "other",
          required: true,
        },
      ],
      contactEmail: "leadership-award@school.edu",
      createdAt: new Date(Date.now() - 10368000000),
      updatedAt: new Date(Date.now() - 5184000000),
    },
    {
      id: "S003",
      name: "Arts Excellence Scholarship",
      description:
        "Supports talented students in visual arts, performing arts, music, and creative writing. Recognizes artistic achievement and potential for creative contribution.",
      type: "arts",
      status: "active",
      amount: {
        min: 2500,
        max: 10000,
        currency: "USD",
        recurring: true,
        frequency: "semester",
      },
      eligibility: {
        subjects: ["Art", "Music", "Theater", "Creative Writing", "Dance"],
        specificRequirements: [
          "Portfolio submission required",
          "Audition may be required for performing arts",
        ],
      },
      requirements: [
        "Artistic portfolio (10-20 pieces)",
        "Artist statement (500 words)",
        "Recommendation from arts teacher",
        "Performance video (for performing arts)",
        "Interview with arts faculty",
      ],
      applicationWindow: {
        openDate: new Date(Date.now() - 1209600000),
        closeDate: new Date(Date.now() + 7776000000),
      },
      fundingSource: "private",
      sponsorName: "Arts Endowment Fund",
      totalAwards: 8,
      remainingAwards: 3,
      totalFunding: 80000,
      disbursedAmount: 50000,
      documents: [
        {
          id: "D8",
          name: "Portfolio",
          description: "10-20 pieces of artistic work",
          type: "portfolio",
          required: true,
        },
        {
          id: "D9",
          name: "Artist Statement",
          description: "Your artistic vision and goals",
          type: "essay",
          required: true,
        },
        {
          id: "D10",
          name: "Teacher Recommendation",
          description: "From an arts faculty member",
          type: "recommendation",
          required: true,
        },
      ],
      contactEmail: "arts-scholarship@school.edu",
      createdAt: new Date(Date.now() - 15552000000),
      updatedAt: new Date(Date.now() - 7776000000),
    },
    {
      id: "S004",
      name: "Financial Need-Based Grant",
      description:
        "Need-based financial assistance for students from low-income families. Designed to ensure that financial barriers do not prevent talented students from accessing education.",
      type: "need-based",
      status: "active",
      amount: {
        min: 1000,
        max: 12000,
        currency: "USD",
        recurring: true,
        frequency: "annual",
      },
      eligibility: {
        financialNeed: true,
        minGPA: 2.5,
        specificRequirements: [
          "Demonstrated financial need",
          "FAFSA completion required",
        ],
      },
      requirements: [
        "FAFSA completion",
        "Financial documentation",
        "Personal statement on financial need",
        "Transcript (minimum 2.5 GPA)",
        "Recommendation letter",
      ],
      applicationWindow: {
        openDate: new Date(Date.now() - 5184000000),
        closeDate: new Date(Date.now() + 10368000000),
      },
      fundingSource: "school",
      totalAwards: 20,
      remainingAwards: 15,
      totalFunding: 240000,
      disbursedAmount: 60000,
      documents: [
        {
          id: "D11",
          name: "FAFSA Confirmation",
          description: "FAFSA submission confirmation",
          type: "financial",
          required: true,
        },
        {
          id: "D12",
          name: "Financial Documents",
          description: "Tax returns and financial statements",
          type: "financial",
          required: true,
        },
        {
          id: "D13",
          name: "Personal Statement",
          description: "Describe your financial situation and need",
          type: "essay",
          required: true,
        },
      ],
      contactEmail: "financial-aid@school.edu",
      createdAt: new Date(Date.now() - 18144000000),
      updatedAt: new Date(Date.now() - 10368000000),
    },
  ]);

  const [applications, setApplications] = useState<ScholarshipApplication[]>([
    {
      id: "A001",
      scholarshipId: "S001",
      scholarshipName: "Excellence in STEM Scholarship",
      studentId: "S001",
      studentName: "Emma Johnson",
      status: "submitted",
      submittedAt: new Date(Date.now() - 172800000),
      documents: [
        {
          id: "DOC1",
          requirementId: "D1",
          name: "transcript.pdf",
          url: "/docs/transcript.pdf",
          uploadedAt: new Date(Date.now() - 259200000),
          size: 1024000,
          type: "application/pdf",
        },
        {
          id: "DOC2",
          requirementId: "D2",
          name: "recommendation1.pdf",
          url: "/docs/rec1.pdf",
          uploadedAt: new Date(Date.now() - 172800000),
          size: 512000,
          type: "application/pdf",
        },
      ],
      essays: [
        {
          prompt: "Describe your STEM interests and goals",
          response:
            "Ever since I was young, I've been fascinated by the natural world...",
          wordCount: 487,
          submittedAt: new Date(Date.now() - 172800000),
        },
      ],
    },
    {
      id: "A002",
      scholarshipId: "S003",
      scholarshipName: "Arts Excellence Scholarship",
      studentId: "S001",
      studentName: "Emma Johnson",
      status: "accepted",
      submittedAt: new Date(Date.now() - 7776000000),
      reviewedAt: new Date(Date.now() - 5184000000),
      reviewerName: "Prof. Michael Chen",
      awardAmount: 7500,
      awardDate: new Date(Date.now() - 5184000000),
      documents: [],
    },
  ]);

  const [recipients] = useState<ScholarshipRecipient[]>([
    {
      id: "R001",
      studentId: "S002",
      studentName: "Marcus Chen",
      scholarshipId: "S001",
      scholarshipName: "Excellence in STEM Scholarship",
      awardAmount: 10000,
      awardDate: new Date(Date.now() - 31536000000),
      semester: "Fall",
      academicYear: "2024-2025",
      gpa: 3.8,
      status: "active",
      disbursements: [
        {
          id: "DIS1",
          amount: 5000,
          date: new Date(Date.now() - 2592000000),
          semester: "Fall",
          academicYear: "2024-2025",
          status: "completed",
          method: "direct-deposit",
        },
        {
          id: "DIS2",
          amount: 5000,
          date: new Date(Date.now() + 7776000000),
          semester: "Spring",
          academicYear: "2024-2025",
          status: "scheduled",
          method: "direct-deposit",
        },
      ],
      renewalRequired: true,
      renewalDeadline: new Date(Date.now() + 15552000000),
    },
  ]);

  const [newScholarship, setNewScholarship] = useState<Partial<Scholarship>>({
    type: "merit",
    fundingSource: "school",
    status: "draft",
    amount: {
      min: 0,
      max: 0,
      currency: "USD",
      recurring: false,
    },
    eligibility: {},
    requirements: [],
    documents: [],
  });

  const typeColors: Record<ScholarshipType, string> = {
    merit: "bg-blue-100 text-blue-700",
    "need-based": "bg-green-100 text-green-700",
    sports: "bg-orange-100 text-orange-700",
    arts: "bg-pink-100 text-pink-700",
    leadership: "bg-purple-100 text-purple-700",
    stem: "bg-indigo-100 text-indigo-700",
    minority: "bg-amber-100 text-amber-700",
    international: "bg-cyan-100 text-cyan-700",
    military: "bg-red-100 text-red-700",
    other: "bg-slate-100 text-slate-700",
  };

  const statusColors: Record<ApplicationStatus, string> = {
    draft: "bg-slate-100 text-slate-700",
    submitted: "bg-blue-100 text-blue-700",
    "under-review": "bg-amber-100 text-amber-700",
    interview: "bg-purple-100 text-purple-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    waitlisted: "bg-orange-100 text-orange-700",
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      scholarship.sponsorName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || scholarship.type === filterType;
    const isActive = scholarship.status === "active";
    return matchesSearch && matchesType && isActive;
  });

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.scholarshipName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const isApplicationWindowOpen = (scholarship: Scholarship) => {
    const now = new Date();
    return (
      now >= scholarship.applicationWindow.openDate &&
      now <= scholarship.applicationWindow.closeDate
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <GraduationCap className="h-8 w-8 text-amber-600" />
            Scholarship Management
          </h2>
          <p className="mt-1 text-slate-600">
            Discover, apply for, and manage scholarships
          </p>
        </div>
        {(userRole === "admin" || userRole === "scholarship-officer") && (
          <button
            onClick={() => setShowCreateScholarship(true)}
            className="flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-700"
          >
            <Award className="h-5 w-5" />
            Create Scholarship
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Active Scholarships",
            value: scholarships.filter((s) => s.status === "active").length,
            color: "bg-blue-500",
          },
          {
            label: "Total Funding",
            value: formatCurrency(
              scholarships.reduce((sum, s) => sum + s.totalFunding, 0),
              "USD",
            ),
            color: "bg-green-500",
          },
          {
            label: "Applications",
            value: applications.length,
            color: "bg-purple-500",
          },
          {
            label: "Awards Disbursed",
            value: recipients.length,
            color: "bg-amber-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${stat.color}`} />
              <span className="text-slate-600 text-sm">{stat.label}</span>
            </div>
            <p className="font-bold text-2xl text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "available", label: "Available Scholarships", icon: Award },
          { id: "applications", label: "My Applications", icon: FileText },
          { id: "awarded", label: "Awarded Scholarships", icon: Star },
          ...(userRole === "admin" || userRole === "scholarship-officer"
            ? [{ id: "manage", label: "Manage", icon: Users }]
            : []),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-amber-600 border-b-2 text-amber-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "available" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterType(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Types</option>
              {Object.entries(typeColors).map(([type]) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredScholarships.map((scholarship) => (
                <motion.div
                  key={scholarship.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="h-2 bg-gradient-to-r from-amber-400 to-yellow-500" />
                  <div className="p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${typeColors[scholarship.type]}`}
                      >
                        {scholarship.type.replace("-", " ").toUpperCase()}
                      </span>
                      {isApplicationWindowOpen(scholarship) ? (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-green-700 text-xs">
                          Accepting Applications
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600 text-xs">
                          Closed
                        </span>
                      )}
                    </div>
                    <h3 className="mb-2 font-bold text-slate-900 text-xl">
                      {scholarship.name}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-slate-600 text-sm">
                      {scholarship.description}
                    </p>

                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm">Award Amount</p>
                        <p className="font-bold text-amber-600 text-xl">
                          {formatCurrency(
                            scholarship.amount.min,
                            scholarship.amount.currency,
                          )}{" "}
                          -{" "}
                          {formatCurrency(
                            scholarship.amount.max,
                            scholarship.amount.currency,
                          )}
                        </p>
                        {scholarship.amount.recurring && (
                          <p className="text-slate-500 text-xs">
                            {scholarship.amount.frequency}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-sm">
                          Awards Available
                        </p>
                        <p className="font-semibold text-lg text-slate-900">
                          {scholarship.remainingAwards}/
                          {scholarship.totalAwards}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center gap-4 text-slate-600 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Deadline:{" "}
                        {scholarship.applicationWindow.closeDate.toLocaleDateString()}
                      </span>
                      {scholarship.sponsorName && (
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {scholarship.sponsorName}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedScholarship(scholarship)}
                        className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 text-sm transition-colors hover:bg-slate-50"
                      >
                        View Details
                      </button>
                      {isApplicationWindowOpen(scholarship) && (
                        <button
                          onClick={() => {
                            setSelectedScholarship(scholarship);
                            setShowApplicationForm(true);
                          }}
                          className="flex-1 rounded-lg bg-amber-600 px-4 py-2 text-sm text-white transition-colors hover:bg-amber-700"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredScholarships.length === 0 && (
            <div className="py-12 text-center">
              <Award className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <h3 className="mb-2 font-semibold text-slate-900 text-xl">
                No Scholarships Found
              </h3>
              <p className="text-slate-600">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </>
      )}

      {activeTab === "applications" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterStatus(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Statuses</option>
              {Object.keys(statusColors).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="divide-y divide-slate-200">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  onClick={() =>
                    setSelectedScholarship(
                      scholarships.find(
                        (s) => s.id === application.scholarshipId,
                      ) || null,
                    )
                  }
                  className="cursor-pointer p-6 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-semibold text-lg text-slate-900">
                          {application.scholarshipName}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${statusColors[application.status]}`}
                        >
                          {application.status.replace("-", " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-600 text-sm">
                        <span>
                          Applied:{" "}
                          {application.submittedAt?.toLocaleDateString()}
                        </span>
                        {application.reviewedAt && (
                          <span>
                            Reviewed:{" "}
                            {application.reviewedAt.toLocaleDateString()}
                          </span>
                        )}
                        {application.awardAmount && (
                          <span className="font-semibold text-green-600">
                            Award:{" "}
                            {formatCurrency(application.awardAmount, "USD")}
                          </span>
                        )}
                      </div>
                      {application.documents.length > 0 && (
                        <div className="mt-2 flex items-center gap-2 text-slate-500 text-sm">
                          <FileText className="h-4 w-4" />
                          {application.documents.length} document
                          {application.documents.length > 1 ? "s" : ""}{" "}
                          submitted
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 transition-colors hover:text-slate-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "awarded" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-slate-200 border-b p-6">
            <h3 className="font-bold text-slate-900 text-xl">
              Scholarship Recipients
            </h3>
          </div>
          <div className="divide-y divide-slate-200">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                onClick={() => setShowRecipientDetails(recipient)}
                className="cursor-pointer p-6 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-semibold text-lg text-slate-900">
                        {recipient.studentName}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          recipient.status === "active"
                            ? "bg-green-100 text-green-700"
                            : recipient.status === "suspended"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {recipient.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mb-1 text-slate-600">
                      {recipient.scholarshipName}
                    </p>
                    <div className="flex items-center gap-4 text-slate-600 text-sm">
                      <span className="font-semibold text-amber-600">
                        {formatCurrency(recipient.awardAmount, "USD")}
                      </span>
                      <span>GPA: {recipient.gpa}</span>
                      <span>
                        {recipient.semester} {recipient.academicYear}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-sm">Awarded</p>
                    <p className="font-medium text-slate-900">
                      {recipient.awardDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedScholarship && !showApplicationForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedScholarship(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="relative h-32 bg-gradient-to-r from-amber-400 to-yellow-500">
              <button
                onClick={() => setSelectedScholarship(null)}
                className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="-mt-12 p-6">
              <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${typeColors[selectedScholarship.type]}`}
                  >
                    {selectedScholarship.type.replace("-", " ").toUpperCase()}
                  </span>
                </div>
                <h3 className="mb-2 font-bold text-2xl text-slate-900">
                  {selectedScholarship.name}
                </h3>
                {selectedScholarship.sponsorName && (
                  <p className="mb-3 text-slate-600">
                    Sponsored by {selectedScholarship.sponsorName}
                  </p>
                )}
                <p className="text-slate-700">
                  {selectedScholarship.description}
                </p>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="mb-1 text-slate-500 text-sm">Award Range</p>
                  <p className="font-bold text-amber-600 text-xl">
                    {formatCurrency(
                      selectedScholarship.amount.min,
                      selectedScholarship.amount.currency,
                    )}{" "}
                    -{" "}
                    {formatCurrency(
                      selectedScholarship.amount.max,
                      selectedScholarship.amount.currency,
                    )}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="mb-1 text-slate-500 text-sm">
                    Available Awards
                  </p>
                  <p className="font-bold text-slate-900 text-xl">
                    {selectedScholarship.remainingAwards}/
                    {selectedScholarship.totalAwards}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="mb-1 text-slate-500 text-sm">
                    Application Deadline
                  </p>
                  <p className="font-bold text-slate-900 text-xl">
                    {selectedScholarship.applicationWindow.closeDate.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-3 font-semibold text-slate-900">
                  Eligibility Requirements
                </h4>
                <ul className="space-y-2">
                  {selectedScholarship.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-slate-700 text-sm"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="mb-3 font-semibold text-slate-900">
                  Required Documents
                </h4>
                <div className="space-y-2">
                  {selectedScholarship.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-700 text-sm">
                          {doc.name}
                        </span>
                        {doc.required && (
                          <span className="rounded bg-red-100 px-2 py-0.5 text-red-700 text-xs">
                            Required
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 text-xs">{doc.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedScholarship.faq &&
                selectedScholarship.faq.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 font-semibold text-slate-900">
                      Frequently Asked Questions
                    </h4>
                    <div className="space-y-3">
                      {selectedScholarship.faq.map((item, idx) => (
                        <div key={idx} className="rounded-lg bg-slate-50 p-3">
                          <p className="mb-1 font-medium text-slate-900">
                            Q: {item.question}
                          </p>
                          <p className="text-slate-700 text-sm">
                            A: {item.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex gap-3">
                {isApplicationWindowOpen(selectedScholarship) && (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="flex-1 rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-700"
                  >
                    Apply Now
                  </button>
                )}
                <button
                  onClick={() => setSelectedScholarship(null)}
                  className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showApplicationForm && selectedScholarship && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowApplicationForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <h3 className="font-bold text-slate-900 text-xl">
                Apply for {selectedScholarship.name}
              </h3>
            </div>
            <div className="space-y-6 p-6">
              <div>
                <h4 className="mb-3 font-semibold text-slate-900">
                  Required Documents
                </h4>
                <div className="space-y-3">
                  {selectedScholarship.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900">
                            {doc.name}
                          </p>
                          <p className="text-slate-600 text-sm">
                            {doc.description}
                          </p>
                        </div>
                        {doc.required && (
                          <span className="rounded bg-red-100 px-2 py-1 text-red-700 text-xs">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 text-sm transition-colors hover:bg-slate-50">
                          <Upload className="h-4 w-4" />
                          Upload Document
                        </button>
                        {doc.acceptedFormats && (
                          <span className="text-slate-500 text-xs">
                            Accepted: {doc.acceptedFormats.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-amber-800 text-sm">
                  <strong>Important:</strong> By submitting this application,
                  you confirm that all information provided is accurate and
                  complete. False information may result in disqualification.
                </p>
              </div>
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              <button
                onClick={() => {
                  setShowApplicationForm(false);
                }}
                className="flex-1 rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-700"
              >
                Submit Application
              </button>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Save as Draft
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showCreateScholarship && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCreateScholarship(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b bg-amber-50 p-6">
              <h3 className="flex items-center gap-2 font-bold text-amber-900 text-xl">
                <Award className="h-6 w-6" />
                Create New Scholarship
              </h3>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Scholarship Name *
                </label>
                <input
                  type="text"
                  value={newScholarship.name || ""}
                  onChange={(e) =>
                    setNewScholarship({
                      ...newScholarship,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter scholarship name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Description *
                </label>
                <textarea
                  value={newScholarship.description || ""}
                  onChange={(e) =>
                    setNewScholarship({
                      ...newScholarship,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the scholarship purpose and goals..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Type *
                  </label>
                  <select
                    value={newScholarship.type}
                    onChange={(e) =>
                      setNewScholarship({
                        ...newScholarship,
                        type: e.target.value as ScholarshipType,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {Object.keys(typeColors).map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Funding Source *
                  </label>
                  <select
                    value={newScholarship.fundingSource}
                    onChange={(e) =>
                      setNewScholarship({
                        ...newScholarship,
                        fundingSource: e.target.value as FundingSource,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="school">School Fund</option>
                    <option value="government">Government</option>
                    <option value="private">Private Donor</option>
                    <option value="corporate">Corporate Sponsor</option>
                    <option value="alumni">Alumni Association</option>
                    <option value="foundation">Foundation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Minimum Award Amount *
                  </label>
                  <div className="relative">
                    <DollarSign className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
                    <input
                      type="number"
                      value={newScholarship.amount?.min || ""}
                      onChange={(e) =>
                        setNewScholarship({
                          ...newScholarship,
                          amount: {
                            min: parseInt(e.target.value) || 0,
                            max: newScholarship.amount?.max ?? 0,
                            currency: newScholarship.amount?.currency ?? "USD",
                            recurring:
                              newScholarship.amount?.recurring ?? false,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Maximum Award Amount *
                  </label>
                  <div className="relative">
                    <DollarSign className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
                    <input
                      type="number"
                      value={newScholarship.amount?.max || ""}
                      onChange={(e) =>
                        setNewScholarship({
                          ...newScholarship,
                          amount: {
                            min: newScholarship.amount?.min ?? 0,
                            max: parseInt(e.target.value) || 0,
                            currency: newScholarship.amount?.currency ?? "USD",
                            recurring:
                              newScholarship.amount?.recurring ?? false,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Total Number of Awards *
                  </label>
                  <input
                    type="number"
                    value={newScholarship.totalAwards || ""}
                    onChange={(e) =>
                      setNewScholarship({
                        ...newScholarship,
                        totalAwards: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Total Funding Pool *
                  </label>
                  <div className="relative">
                    <DollarSign className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
                    <input
                      type="number"
                      value={newScholarship.totalFunding || ""}
                      onChange={(e) =>
                        setNewScholarship({
                          ...newScholarship,
                          totalFunding: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Application Window
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    placeholder="Open Date"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="date"
                    placeholder="Close Date"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newScholarship.amount?.recurring || false}
                  onChange={(e) =>
                    setNewScholarship({
                      ...newScholarship,
                      amount: {
                        min: newScholarship.amount?.min ?? 0,
                        max: newScholarship.amount?.max ?? 0,
                        currency: newScholarship.amount?.currency ?? "USD",
                        recurring: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <label className="text-slate-700 text-sm">
                  Recurring Scholarship (multi-year)
                </label>
              </div>
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              <button
                onClick={() => setShowCreateScholarship(false)}
                className="flex-1 rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-700"
              >
                Create Scholarship
              </button>
              <button
                onClick={() => setShowCreateScholarship(false)}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showRecipientDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowRecipientDetails(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xl">
                  Recipient Details
                </h3>
                <button
                  onClick={() => setShowRecipientDetails(null)}
                  className="rounded-full p-2 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-6 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <User className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xl">
                    {showRecipientDetails.studentName}
                  </h4>
                  <p className="text-slate-600">
                    {showRecipientDetails.scholarshipName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="mb-1 text-slate-500 text-sm">Total Award</p>
                  <p className="font-bold text-amber-600 text-xl">
                    {formatCurrency(showRecipientDetails.awardAmount, "USD")}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="mb-1 text-slate-500 text-sm">GPA</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {showRecipientDetails.gpa}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="mb-1 text-slate-500 text-sm">Status</p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      showRecipientDetails.status === "active"
                        ? "bg-green-100 text-green-700"
                        : showRecipientDetails.status === "suspended"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {showRecipientDetails.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-slate-900">
                  Disbursement History
                </h4>
                <div className="space-y-2">
                  {showRecipientDetails.disbursements.map((disbursement) => (
                    <div
                      key={disbursement.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {formatCurrency(disbursement.amount, "USD")}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {disbursement.semester} {disbursement.academicYear}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            disbursement.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : disbursement.status === "processing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {disbursement.status.toUpperCase()}
                        </span>
                        <p className="mt-1 text-slate-500 text-sm">
                          {disbursement.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {showRecipientDetails.renewalRequired && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span className="font-medium text-amber-900">
                      Renewal Required
                    </span>
                  </div>
                  <p className="text-amber-800 text-sm">
                    Scholarship renewal application due by{" "}
                    {showRecipientDetails.renewalDeadline?.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            <div className="border-slate-200 border-t p-6">
              <button
                onClick={() => setShowRecipientDetails(null)}
                className="w-full rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
