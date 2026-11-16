import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  GraduationCap,
  MoreVertical,
  RefreshCw,
  Search,
  Shield,
  Star,
  User,
  UserCheck,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

export type AbsenceType =
  | "sick"
  | "personal"
  | "emergency"
  | "professional"
  | "vacation";
export type AbsenceStatus =
  | "pending"
  | "approved"
  | "denied"
  | "covered"
  | "cancelled";
export type SubstituteStatus =
  | "requested"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show";
export type MatchPriority = "auto" | "preferred" | "manual" | "emergency";

export interface TeacherAbsence {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  teacherPhone: string;
  type: AbsenceType;
  status: AbsenceStatus;
  startDate: Date;
  endDate: Date;
  reason: string;
  classes: ClassAssignment[];
  submittedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  substituteId?: string;
  substituteName?: string;
  substituteStatus?: SubstituteStatus;
  urgency: "low" | "medium" | "high" | "urgent";
  estimatedCost?: number;
  notes?: string;
  attachments?: string[];
}

export interface ClassAssignment {
  id: string;
  subject: string;
  grade: string;
  section: string;
  room: string;
  period: string;
  time: string;
  lessonPlanUrl?: string;
  specialInstructions?: string;
  materials?: string[];
}

export interface SubstituteTeacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  qualifications: string[];
  certifications: string[];
  preferredSubjects: string[];
  gradeLevels: string[];
  availability: WeeklyAvailability;
  rating: number;
  totalAssignments: number;
  completedAssignments: number;
  cancellationRate: number;
  hourlyRate: number;
  isActive: boolean;
  backgroundCheckStatus: "pending" | "approved" | "expired";
  backgroundCheckExpiry?: Date;
  lastActive?: Date;
  notes?: string;
}

export interface WeeklyAvailability {
  [key: number]: TimeRange[];
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface AutomatedMatch {
  absenceId: string;
  substituteId: string;
  substituteName: string;
  matchScore: number;
  matchReasons: string[];
  priority: MatchPriority;
  estimatedCost: number;
  availability: boolean;
  distance?: string;
  previousExperience: boolean;
}

export interface SubstitutionLog {
  id: string;
  absenceId: string;
  substituteId: string;
  classId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  hoursWorked: number;
  feedback?: SubstituteFeedback;
  issues?: string[];
  photos?: string[];
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
}

export interface SubstituteFeedback {
  rating: number;
  punctuality: number;
  professionalism: number;
  classroomManagement: number;
  lessonDelivery: number;
  comments?: string;
  wouldRequestAgain: boolean;
  reportedBy: string;
  reportedAt: Date;
}

interface SubstituteTeacherSystemProps {
  userRole?: "admin" | "teacher" | "substitute" | "staff";
  userId?: string;
  onRequestAbsence?: (
    absence: Omit<TeacherAbsence, "id" | "status" | "submittedAt">,
  ) => Promise<string>;
  onApproveAbsence?: (
    absenceId: string,
    approved: boolean,
    notes?: string,
  ) => Promise<void>;
  onFindSubstitute?: (
    absenceId: string,
    criteria: any,
  ) => Promise<AutomatedMatch[]>;
  onAssignSubstitute?: (
    absenceId: string,
    substituteId: string,
  ) => Promise<void>;
  onUpdateSubstitutionStatus?: (
    logId: string,
    status: SubstituteStatus,
    notes?: string,
  ) => Promise<void>;
  onSubmitFeedback?: (
    logId: string,
    feedback: SubstituteFeedback,
  ) => Promise<void>;
}

export function SubstituteTeacherSystem({
  userRole = "admin",
  userId = "A001",
  onRequestAbsence,
  onApproveAbsence,
  onFindSubstitute,
  onAssignSubstitute,
  onUpdateSubstitutionStatus,
  onSubmitFeedback,
}: SubstituteTeacherSystemProps) {
  const [activeTab, setActiveTab] = useState<
    "absences" | "substitutes" | "matches" | "history"
  >("absences");
  const [selectedAbsence, setSelectedAbsence] = useState<TeacherAbsence | null>(
    null,
  );
  const [showAbsenceForm, setShowAbsenceForm] = useState(false);
  const [showSubstituteProfile, setShowSubstituteProfile] =
    useState<SubstituteTeacher | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<AbsenceStatus | "all">(
    "all",
  );
  const [selectedMatches, setSelectedMatches] = useState<AutomatedMatch[]>([]);
  const [isFindingMatches, setIsFindingMatches] = useState(false);

  const [absences, setAbsences] = useState<TeacherAbsence[]>([
    {
      id: "A001",
      teacherId: "T001",
      teacherName: "Ms. Sarah Johnson",
      teacherEmail: "sarah.johnson@school.edu",
      teacherPhone: "+1-555-0101",
      type: "sick",
      status: "pending",
      startDate: new Date(Date.now() + 86400000),
      endDate: new Date(Date.now() + 172800000),
      reason: "Flu - doctor's orders to rest",
      classes: [
        {
          id: "C1",
          subject: "Mathematics",
          grade: "10",
          section: "A",
          room: "201",
          period: "1",
          time: "08:00-09:30",
          lessonPlanUrl: "/plans/math-10a-nov15.pdf",
        },
        {
          id: "C2",
          subject: "Mathematics",
          grade: "11",
          section: "B",
          room: "205",
          period: "3",
          time: "10:30-12:00",
          lessonPlanUrl: "/plans/math-11b-nov15.pdf",
        },
      ],
      submittedAt: new Date(Date.now() - 7200000),
      urgency: "high",
      estimatedCost: 240,
      notes:
        "Lesson plans uploaded to shared drive. Emergency contact: spouse at +1-555-0102",
    },
    {
      id: "A002",
      teacherId: "T002",
      teacherName: "Mr. David Chen",
      teacherEmail: "david.chen@school.edu",
      teacherPhone: "+1-555-0103",
      type: "professional",
      status: "approved",
      startDate: new Date(Date.now() + 259200000),
      endDate: new Date(Date.now() + 345600000),
      reason: "State teaching conference",
      classes: [
        {
          id: "C3",
          subject: "Physics",
          grade: "12",
          section: "A",
          room: "Lab 1",
          period: "2",
          time: "09:45-11:15",
        },
        {
          id: "C4",
          subject: "Physics",
          grade: "11",
          section: "C",
          room: "Lab 1",
          period: "4",
          time: "12:15-13:45",
        },
      ],
      submittedAt: new Date(Date.now() - 2592000000),
      approvedBy: "Principal Williams",
      approvedAt: new Date(Date.now() - 2419200000),
      urgency: "low",
      estimatedCost: 480,
      substituteId: "SUB001",
      substituteName: "Mrs. Linda Martinez",
      substituteStatus: "confirmed",
      notes: "Pre-approved conference attendance. Substitute already assigned.",
    },
    {
      id: "A003",
      teacherId: "T003",
      teacherName: "Mrs. Emily Rodriguez",
      teacherEmail: "emily.rodriguez@school.edu",
      teacherPhone: "+1-555-0105",
      type: "emergency",
      status: "covered",
      startDate: new Date(Date.now() - 86400000),
      endDate: new Date(Date.now()),
      reason: "Family emergency - parent hospitalized",
      classes: [
        {
          id: "C5",
          subject: "English Literature",
          grade: "9",
          section: "D",
          room: "103",
          period: "1",
          time: "08:00-09:30",
        },
        {
          id: "C6",
          subject: "English Literature",
          grade: "10",
          section: "C",
          room: "107",
          period: "5",
          time: "14:00-15:30",
        },
      ],
      submittedAt: new Date(Date.now() - 90000000),
      approvedBy: "Principal Williams",
      approvedAt: new Date(Date.now() - 88200000),
      urgency: "urgent",
      estimatedCost: 240,
      substituteId: "SUB002",
      substituteName: "Mr. Robert Taylor",
      substituteStatus: "completed",
      notes: "Emergency coverage arranged within 2 hours of request.",
    },
  ]);

  const [substitutes] = useState<SubstituteTeacher[]>([
    {
      id: "SUB001",
      name: "Mrs. Linda Martinez",
      email: "linda.martinez@email.com",
      phone: "+1-555-0201",
      qualifications: ["M.A. Mathematics Education", "State Certified Teacher"],
      certifications: [
        "Substitute Teaching License",
        "Mathematics 7-12",
        "Classroom Management",
      ],
      preferredSubjects: ["Mathematics", "Science", "Physics"],
      gradeLevels: ["Middle School", "High School"],
      availability: {
        1: [{ start: "08:00", end: "15:30" }],
        2: [{ start: "08:00", end: "15:30" }],
        3: [{ start: "08:00", end: "15:30" }],
        4: [{ start: "08:00", end: "15:30" }],
        5: [{ start: "08:00", end: "12:00" }],
      },
      rating: 4.8,
      totalAssignments: 127,
      completedAssignments: 123,
      cancellationRate: 0.02,
      hourlyRate: 25,
      isActive: true,
      backgroundCheckStatus: "approved",
      backgroundCheckExpiry: new Date(Date.now() + 31536000000),
      lastActive: new Date(Date.now() - 86400000),
      notes:
        "Excellent substitute, highly reliable, great with high school students",
    },
    {
      id: "SUB002",
      name: "Mr. Robert Taylor",
      email: "robert.taylor@email.com",
      phone: "+1-555-0202",
      qualifications: [
        "B.A. English Literature",
        "M.Ed. Curriculum Development",
      ],
      certifications: [
        "Substitute Teaching License",
        "English 6-12",
        "ESL Certified",
      ],
      preferredSubjects: ["English", "History", "Social Studies"],
      gradeLevels: ["Elementary", "Middle School", "High School"],
      availability: {
        0: [{ start: "08:00", end: "15:30" }],
        1: [{ start: "08:00", end: "15:30" }],
        2: [{ start: "08:00", end: "15:30" }],
        3: [{ start: "08:00", end: "15:30" }],
        4: [{ start: "08:00", end: "15:30" }],
        5: [{ start: "08:00", end: "15:30" }],
      },
      rating: 4.6,
      totalAssignments: 89,
      completedAssignments: 86,
      cancellationRate: 0.03,
      hourlyRate: 23,
      isActive: true,
      backgroundCheckStatus: "approved",
      backgroundCheckExpiry: new Date(Date.now() + 25920000000),
      lastActive: new Date(),
      notes: "Versatile substitute, comfortable with all grade levels",
    },
    {
      id: "SUB003",
      name: "Dr. Patricia Wong",
      email: "patricia.wong@email.com",
      phone: "+1-555-0203",
      qualifications: ["Ph.D. Biology", "B.Ed. Secondary Education"],
      certifications: [
        "Substitute Teaching License",
        "Biology 9-12",
        "Chemistry 9-12",
      ],
      preferredSubjects: ["Biology", "Chemistry", "Environmental Science"],
      gradeLevels: ["High School"],
      availability: {
        1: [{ start: "09:00", end: "14:00" }],
        3: [{ start: "09:00", end: "14:00" }],
        5: [{ start: "09:00", end: "14:00" }],
      },
      rating: 4.9,
      totalAssignments: 45,
      completedAssignments: 45,
      cancellationRate: 0,
      hourlyRate: 30,
      isActive: true,
      backgroundCheckStatus: "approved",
      backgroundCheckExpiry: new Date(Date.now() + 63072000000),
      lastActive: new Date(Date.now() - 604800000),
      notes: "Specialized in sciences, excellent lab safety record",
    },
  ]);

  const [newAbsence, setNewAbsence] = useState<Partial<TeacherAbsence>>({
    type: "sick",
    urgency: "medium",
    classes: [],
    startDate: new Date(),
    endDate: new Date(),
  });

  const [feedback, setFeedback] = useState<Partial<SubstituteFeedback>>({
    rating: 5,
    punctuality: 5,
    professionalism: 5,
    classroomManagement: 5,
    lessonDelivery: 5,
    wouldRequestAgain: true,
  });

  const absenceTypeColors: Record<AbsenceType, string> = {
    sick: "bg-red-100 text-red-700",
    personal: "bg-blue-100 text-blue-700",
    emergency: "bg-amber-100 text-amber-700",
    professional: "bg-purple-100 text-purple-700",
    vacation: "bg-green-100 text-green-700",
  };

  const absenceStatusColors: Record<AbsenceStatus, string> = {
    pending: "bg-amber-500",
    approved: "bg-green-500",
    denied: "bg-red-500",
    covered: "bg-blue-500",
    cancelled: "bg-slate-500",
  };

  const substituteStatusColors: Record<SubstituteStatus, string> = {
    requested: "bg-amber-100 text-amber-700",
    confirmed: "bg-green-100 text-green-700",
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-slate-100 text-slate-700",
    cancelled: "bg-red-100 text-red-700",
    "no-show": "bg-red-200 text-red-800",
  };

  const urgencyColors: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  const filteredAbsences = absences.filter((absence) => {
    const matchesSearch =
      absence.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      absence.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      absence.substituteName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || absence.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleFindMatches = async (absence: TeacherAbsence) => {
    setIsFindingMatches(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockMatches: AutomatedMatch[] = substitutes
      .filter((sub) => sub.isActive && sub.backgroundCheckStatus === "approved")
      .map((sub) => {
        const subjectMatches = absence.classes.filter((c) =>
          sub.preferredSubjects.some((ps) =>
            c.subject.toLowerCase().includes(ps.toLowerCase()),
          ),
        ).length;
        const score = Math.min(100, 50 + subjectMatches * 15 + sub.rating * 5);

        return {
          absenceId: absence.id,
          substituteId: sub.id,
          substituteName: sub.name,
          matchScore: score,
          matchReasons: [
            subjectMatches > 0
              ? `Experience in ${absence.classes[0].subject}`
              : "General substitute",
            `Rating: ${sub.rating}/5`,
            sub.totalAssignments > 50
              ? "Highly experienced"
              : "Qualified substitute",
          ],
          priority: (score > 85 ? "preferred" : "auto") as MatchPriority,
          estimatedCost: sub.hourlyRate * absence.classes.length * 1.5,
          availability: true,
          previousExperience: sub.totalAssignments > 20,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    setSelectedMatches(mockMatches);
    setIsFindingMatches(false);
    setSelectedAbsence(absence);
  };

  const handleAssignSubstitute = async (substituteId: string) => {
    if (!selectedAbsence) return;

    const substitute = substitutes.find((s) => s.id === substituteId);

    setAbsences((prev) =>
      prev.map((a) =>
        a.id === selectedAbsence.id
          ? {
              ...a,
              substituteId,
              substituteName: substitute?.name,
              substituteStatus: "confirmed",
              status: "covered",
            }
          : a,
      ),
    );

    setSelectedMatches([]);
    setSelectedAbsence(null);
  };

  const handleRequestAbsence = async () => {
    if (!newAbsence.reason || !newAbsence.startDate || !newAbsence.endDate)
      return;

    const absence = {
      ...newAbsence,
      type: newAbsence.type || "sick",
      teacherId: userId,
      teacherName: "Current Teacher",
      teacherEmail: "teacher@school.edu",
      teacherPhone: "+1-555-0000",
      classes: newAbsence.classes || [],
    } as Omit<TeacherAbsence, "id" | "status" | "submittedAt">;

    const id = onRequestAbsence
      ? await onRequestAbsence(absence)
      : `A${Date.now()}`;

    setAbsences((prev) => [
      {
        ...absence,
        id,
        status: "pending",
        submittedAt: new Date(),
      } as TeacherAbsence,
      ...prev,
    ]);

    setShowAbsenceForm(false);
    setNewAbsence({
      type: "sick",
      urgency: "medium",
      classes: [],
      startDate: new Date(),
      endDate: new Date(),
    });
  };

  const handleApproveAbsence = async (absenceId: string, approved: boolean) => {
    if (onApproveAbsence) {
      await onApproveAbsence(absenceId, approved);
    }

    setAbsences((prev) =>
      prev.map((a) =>
        a.id === absenceId
          ? {
              ...a,
              status: approved ? "approved" : "denied",
              approvedBy: approved ? "Admin" : undefined,
              approvedAt: approved ? new Date() : undefined,
            }
          : a,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <UserCheck className="h-8 w-8 text-indigo-600" />
            Substitute Teacher System
          </h2>
          <p className="mt-1 text-slate-600">
            Automated absence management and substitute matching
          </p>
        </div>
        {userRole === "teacher" && (
          <button
            onClick={() => setShowAbsenceForm(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <Calendar className="h-5 w-5" />
            Request Absence
          </button>
        )}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          {
            label: "Pending Requests",
            value: absences.filter((a) => a.status === "pending").length,
            color: "bg-amber-500",
          },
          {
            label: "Awaiting Substitute",
            value: absences.filter(
              (a) => a.status === "approved" && !a.substituteId,
            ).length,
            color: "bg-orange-500",
          },
          {
            label: "Covered",
            value: absences.filter((a) => a.status === "covered").length,
            color: "bg-green-500",
          },
          {
            label: "Active Substitutes",
            value: substitutes.filter((s) => s.isActive).length,
            color: "bg-blue-500",
          },
          { label: "Avg Match Score", value: "87%", color: "bg-purple-500" },
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
          { id: "absences", label: "Absence Requests", icon: Calendar },
          { id: "substitutes", label: "Substitute Pool", icon: User },
          { id: "matches", label: "AI Matching", icon: Zap },
          { id: "history", label: "Coverage History", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 border-b-2 text-indigo-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "absences" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search absences..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterStatus(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="covered">Covered</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="divide-y divide-slate-200">
              <AnimatePresence mode="popLayout">
                {filteredAbsences.map((absence) => (
                  <motion.div
                    key={absence.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-slate-900">
                            {absence.teacherName}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${absenceTypeColors[absence.type]}`}
                          >
                            {absence.type.charAt(0).toUpperCase() +
                              absence.type.slice(1)}
                          </span>
                          <div
                            className={`h-2 w-2 rounded-full ${absenceStatusColors[absence.status]}`}
                          />
                          <span className="text-slate-500 text-xs capitalize">
                            {absence.status}
                          </span>
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${urgencyColors[absence.urgency]}`}
                          >
                            {absence.urgency.toUpperCase()}
                          </span>
                        </div>
                        <p className="mb-2 text-slate-600">{absence.reason}</p>
                        <div className="flex items-center gap-4 text-slate-600 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {absence.startDate.toLocaleDateString()} -{" "}
                            {absence.endDate.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {absence.classes.length} class
                            {absence.classes.length !== 1 ? "es" : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Requested {absence.submittedAt.toLocaleString()}
                          </span>
                          {absence.estimatedCost && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              Est. ${absence.estimatedCost}
                            </span>
                          )}
                        </div>
                        {absence.substituteName && (
                          <div className="mt-2 flex items-center gap-2">
                            <User className="h-4 w-4 text-indigo-600" />
                            <span className="text-slate-700 text-sm">
                              Substitute:{" "}
                              <span className="font-medium">
                                {absence.substituteName}
                              </span>
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${substituteStatusColors[absence.substituteStatus || "requested"]}`}
                            >
                              {absence.substituteStatus?.replace("-", " ") ||
                                "requested"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {(userRole === "admin" || userRole === "staff") &&
                          absence.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleApproveAbsence(absence.id, true)
                                }
                                className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleApproveAbsence(absence.id, false)
                                }
                                className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
                              >
                                <X className="h-4 w-4" />
                                Deny
                              </button>
                            </>
                          )}
                        {(userRole === "admin" || userRole === "staff") &&
                          absence.status === "approved" &&
                          !absence.substituteId && (
                            <button
                              onClick={() => handleFindMatches(absence)}
                              disabled={isFindingMatches}
                              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                            >
                              {isFindingMatches ? (
                                <>
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                  Finding...
                                </>
                              ) : (
                                <>
                                  <Zap className="h-4 w-4" />
                                  Find Substitute
                                </>
                              )}
                            </button>
                          )}
                        <button
                          onClick={() => setSelectedAbsence(absence)}
                          className="p-2 text-slate-400 transition-colors hover:text-slate-600"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}

      {activeTab === "substitutes" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {substitutes.map((sub) => (
              <motion.div
                key={sub.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-600" />
                <div className="-mt-10 p-6">
                  <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-white p-1 shadow-lg">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200">
                      <User className="h-10 w-10 text-slate-400" />
                    </div>
                  </div>
                  <h3 className="text-center font-bold text-slate-900 text-xl">
                    {sub.name}
                  </h3>
                  <div className="mt-1 mb-3 flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="font-semibold text-slate-900">
                      {sub.rating}
                    </span>
                    <span className="text-slate-500 text-sm">
                      ({sub.totalAssignments} assignments)
                    </span>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex flex-wrap justify-center gap-1">
                      {sub.preferredSubjects.slice(0, 3).map((subject) => (
                        <span
                          key={subject}
                          className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-700 text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-1">
                      {sub.gradeLevels.map((grade) => (
                        <span
                          key={grade}
                          className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 text-xs"
                        >
                          {grade}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded bg-slate-50 p-2 text-center">
                      <p className="text-slate-500 text-xs">Hourly Rate</p>
                      <p className="font-semibold text-slate-900">
                        ${sub.hourlyRate}
                      </p>
                    </div>
                    <div className="rounded bg-slate-50 p-2 text-center">
                      <p className="text-slate-500 text-xs">Completion</p>
                      <p className="font-semibold text-slate-900">
                        {Math.round(
                          (sub.completedAssignments / sub.totalAssignments) *
                            100,
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span
                      className={
                        sub.backgroundCheckStatus === "approved"
                          ? "text-green-600"
                          : "text-amber-600"
                      }
                    >
                      BG Check: {sub.backgroundCheckStatus}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowSubstituteProfile(sub)}
                    className="mt-4 w-full rounded-lg border border-indigo-600 px-4 py-2 text-indigo-600 transition-colors hover:bg-indigo-50"
                  >
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {activeTab === "matches" && selectedMatches.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900 text-xl">
            <Zap className="h-6 w-6 text-amber-500" />
            AI-Generated Substitute Matches
          </h3>
          <div className="space-y-4">
            {selectedMatches.slice(0, 5).map((match) => (
              <div
                key={match.substituteId}
                className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-indigo-400"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h4 className="font-semibold text-lg text-slate-900">
                        {match.substituteName}
                      </h4>
                      <div className="flex items-center gap-1 rounded bg-indigo-100 px-2 py-1">
                        <Star className="h-3 w-3 text-indigo-600" />
                        <span className="font-semibold text-indigo-700 text-sm">
                          {match.matchScore}% match
                        </span>
                      </div>
                      {match.priority === "preferred" && (
                        <span className="rounded bg-green-100 px-2 py-0.5 text-green-700 text-xs">
                          Preferred Match
                        </span>
                      )}
                    </div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {match.matchReasons.map((reason, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 text-xs"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm">
                      Estimated Cost:{" "}
                      <span className="font-semibold text-slate-900">
                        ${match.estimatedCost}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleAssignSubstitute(match.substituteId)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                  >
                    Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAbsenceForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowAbsenceForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b bg-indigo-50 p-6">
              <h3 className="flex items-center gap-2 font-bold text-indigo-900 text-xl">
                <Calendar className="h-6 w-6" />
                Request Absence
              </h3>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Absence Type *
                  </label>
                  <select
                    value={newAbsence.type}
                    onChange={(e) =>
                      setNewAbsence({
                        ...newAbsence,
                        type: e.target.value as AbsenceType,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="sick">Sick Leave</option>
                    <option value="personal">Personal Day</option>
                    <option value="emergency">Emergency</option>
                    <option value="professional">
                      Professional Development
                    </option>
                    <option value="vacation">Vacation</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Urgency Level *
                  </label>
                  <select
                    value={newAbsence.urgency}
                    onChange={(e) =>
                      setNewAbsence({
                        ...newAbsence,
                        urgency: e.target.value as any,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low - Advance Notice</option>
                    <option value="medium">Medium - Few Days Notice</option>
                    <option value="high">High - Short Notice</option>
                    <option value="urgent">Urgent - Immediate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={
                      newAbsence.startDate
                        ? newAbsence.startDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setNewAbsence({
                        ...newAbsence,
                        startDate: new Date(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={
                      newAbsence.endDate
                        ? newAbsence.endDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setNewAbsence({
                        ...newAbsence,
                        endDate: new Date(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Reason for Absence *
                </label>
                <textarea
                  value={newAbsence.reason || ""}
                  onChange={(e) =>
                    setNewAbsence({ ...newAbsence, reason: e.target.value })
                  }
                  placeholder="Please provide details about your absence..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Additional Notes
                </label>
                <textarea
                  value={newAbsence.notes || ""}
                  onChange={(e) =>
                    setNewAbsence({ ...newAbsence, notes: e.target.value })
                  }
                  placeholder="Any special instructions, lesson plan locations, etc."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              <button
                onClick={handleRequestAbsence}
                disabled={
                  !newAbsence.reason ||
                  !newAbsence.startDate ||
                  !newAbsence.endDate
                }
                className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                Submit Request
              </button>
              <button
                onClick={() => setShowAbsenceForm(false)}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showSubstituteProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowSubstituteProfile(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="relative h-32 bg-gradient-to-br from-indigo-500 to-purple-600">
              <button
                onClick={() => setShowSubstituteProfile(null)}
                className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="-mt-12 p-6">
              <div className="mb-4 h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200">
                  <User className="h-12 w-12 text-slate-400" />
                </div>
              </div>
              <h3 className="font-bold text-2xl text-slate-900">
                {showSubstituteProfile.name}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                <span className="font-semibold text-slate-900">
                  {showSubstituteProfile.rating}/5
                </span>
                <span className="text-slate-500">
                  ({showSubstituteProfile.totalAssignments} assignments)
                </span>
              </div>

              <div className="my-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Hourly Rate</p>
                  <p className="font-bold text-slate-900 text-xl">
                    ${showSubstituteProfile.hourlyRate}/hr
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Completion Rate</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {Math.round(
                      (showSubstituteProfile.completedAssignments /
                        showSubstituteProfile.totalAssignments) *
                        100,
                    )}
                    %
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold text-slate-900">
                    Qualifications
                  </h4>
                  <ul className="space-y-1">
                    {showSubstituteProfile.qualifications.map((qual, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-slate-700 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {qual}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-slate-900">
                    Certifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {showSubstituteProfile.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700 text-sm"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-slate-900">
                    Preferred Subjects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {showSubstituteProfile.preferredSubjects.map(
                      (subject, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 text-sm"
                        >
                          {subject}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-slate-900">
                    Grade Levels
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {showSubstituteProfile.gradeLevels.map((grade, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-amber-100 px-3 py-1 text-amber-700 text-sm"
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>

                {showSubstituteProfile.notes && (
                  <div className="rounded-lg bg-amber-50 p-4">
                    <h4 className="mb-2 font-semibold text-amber-900">
                      Admin Notes
                    </h4>
                    <p className="text-amber-800 text-sm">
                      {showSubstituteProfile.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedAbsence && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedAbsence(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xl">
                  Absence Details
                </h3>
                <button
                  onClick={() => setSelectedAbsence(null)}
                  className="rounded-full p-2 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Teacher</p>
                  <p className="font-semibold text-slate-900">
                    {selectedAbsence.teacherName}
                  </p>
                  <p className="text-slate-600 text-sm">
                    {selectedAbsence.teacherEmail}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Period</p>
                  <p className="font-semibold text-slate-900">
                    {selectedAbsence.startDate.toLocaleDateString()} -{" "}
                    {selectedAbsence.endDate.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 ${absenceTypeColors[selectedAbsence.type]}`}
                >
                  {selectedAbsence.type.toUpperCase()}
                </span>
                <span
                  className={`rounded-full px-3 py-1 ${urgencyColors[selectedAbsence.urgency]}`}
                >
                  {selectedAbsence.urgency.toUpperCase()}
                </span>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-slate-900">Reason</h4>
                <p className="rounded-lg bg-slate-50 p-4 text-slate-700">
                  {selectedAbsence.reason}
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-slate-900">
                  Classes ({selectedAbsence.classes.length})
                </h4>
                <div className="space-y-2">
                  {selectedAbsence.classes.map((cls) => (
                    <div key={cls.id} className="rounded-lg bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">
                            {cls.subject} - Grade {cls.grade}
                            {cls.section}
                          </p>
                          <p className="text-slate-600 text-sm">
                            {cls.room} • Period {cls.period} • {cls.time}
                          </p>
                        </div>
                        {cls.lessonPlanUrl && (
                          <a
                            href={cls.lessonPlanUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 text-sm hover:underline"
                          >
                            Lesson Plan
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedAbsence.substituteName && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <h4 className="mb-2 font-semibold text-green-900">
                    Assigned Substitute
                  </h4>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-slate-900">
                      {selectedAbsence.substituteName}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${substituteStatusColors[selectedAbsence.substituteStatus || "requested"]}`}
                    >
                      {selectedAbsence.substituteStatus?.replace("-", " ") ||
                        "requested"}
                    </span>
                  </div>
                </div>
              )}

              {selectedAbsence.notes && (
                <div>
                  <h4 className="mb-2 font-semibold text-slate-900">
                    Additional Notes
                  </h4>
                  <p className="text-slate-600 text-sm">
                    {selectedAbsence.notes}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
