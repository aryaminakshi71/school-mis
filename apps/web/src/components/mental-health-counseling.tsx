import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Heart,
  Phone,
  Smile,
  User,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";

export type CounselingType =
  | "individual"
  | "group"
  | "crisis"
  | "family"
  | "peer"
  | "career";
export type SessionStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show";
export type ReferralType =
  | "teacher"
  | "parent"
  | "self"
  | "admin"
  | "peer"
  | "automatic";
export type AppointmentStatus = "available" | "booked" | "blocked" | "break";

export interface Counselor {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  credentials: string[];
  bio: string;
  availability: WeeklySchedule;
  maxDailyAppointments: number;
  languages: string[];
  photo?: string;
  rating: number;
  totalSessions: number;
  isActive: boolean;
}

export interface WeeklySchedule {
  [key: number]: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
}

export interface CounselingSession {
  id: string;
  studentId: string;
  studentName: string;
  counselorId: string;
  counselorName: string;
  type: CounselingType;
  status: SessionStatus;
  scheduledDate: Date;
  startTime: string;
  duration: number;
  notes?: SessionNotes;
  followUp?: FollowUpPlan;
  isVirtual: boolean;
  meetingLink?: string;
  createdAt: Date;
  referral?: ReferralInfo;
  confidentialityLevel: "standard" | "enhanced" | "crisis";
  parentConsent?: boolean;
}

export interface SessionNotes {
  summary: string;
  observations: string[];
  studentConcerns: string[];
  counselorRecommendations: string[];
  moodRating: number;
  progressIndicators: string[];
  nextSteps: string[];
  redFlags?: string[];
  isConfidential: boolean;
}

export interface FollowUpPlan {
  required: boolean;
  recommendedDate?: Date;
  frequency?: "weekly" | "bi-weekly" | "monthly" | "as-needed";
  goals?: string[];
  interventions?: string[];
}

export interface ReferralInfo {
  referredBy: string;
  referredByName: string;
  type: ReferralType;
  reason: string;
  date: Date;
  urgency: "low" | "medium" | "high" | "urgent";
}

export interface MentalHealthResource {
  id: string;
  title: string;
  type: "article" | "video" | "worksheet" | "app" | "hotline" | "support-group";
  category: string;
  description: string;
  url?: string;
  content?: string;
  thumbnail?: string;
  tags: string[];
  ageAppropriate: string[];
  isCrisisResource: boolean;
  contactInfo?: string;
}

export interface WellnessCheck {
  id: string;
  studentId: string;
  studentName: string;
  date: Date;
  mood: number;
  energy: number;
  stress: number;
  sleep: number;
  social: number;
  notes?: string;
  needsSupport: boolean;
  recommendedAction?: string;
}

interface MentalHealthCounselingProps {
  userRole?: "admin" | "counselor" | "teacher" | "student" | "parent";
  userId?: string;
  onBookSession?: (
    session: Omit<CounselingSession, "id" | "status" | "createdAt">,
  ) => Promise<string>;
  onUpdateSession?: (
    sessionId: string,
    updates: Partial<CounselingSession>,
  ) => Promise<void>;
  onAddNotes?: (sessionId: string, notes: SessionNotes) => Promise<void>;
  onReferStudent?: (studentId: string, referral: ReferralInfo) => Promise<void>;
  onRecordWellnessCheck?: (
    check: Omit<WellnessCheck, "id" | "date">,
  ) => Promise<void>;
}

export function MentalHealthCounseling({
  userRole = "student",
  userId = "S001",
  onBookSession,
  onUpdateSession,
  onAddNotes,
  onReferStudent,
  onRecordWellnessCheck,
}: MentalHealthCounselingProps) {
  const [activeTab, setActiveTab] = useState<
    "appointments" | "resources" | "wellness" | "counselors"
  >("appointments");
  const [selectedSession, setSelectedSession] =
    useState<CounselingSession | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(
    null,
  );
  const [showWellnessCheck, setShowWellnessCheck] = useState(false);
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<CounselingType | "all">("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [counselors, setCounselors] = useState<Counselor[]>([
    {
      id: "C001",
      name: "Dr. Amanda Foster",
      title: "Licensed Clinical Psychologist",
      specialization: [
        "Anxiety",
        "Depression",
        "Academic Stress",
        "Crisis Intervention",
      ],
      credentials: [
        "Ph.D. Psychology",
        "Licensed in State",
        "20+ years experience",
      ],
      bio: "Dr. Foster specializes in helping students navigate academic pressure, anxiety, and life transitions. She uses evidence-based approaches including CBT and mindfulness.",
      availability: {
        1: [{ startTime: "09:00", endTime: "17:00", status: "available" }],
        2: [{ startTime: "09:00", endTime: "17:00", status: "available" }],
        3: [{ startTime: "09:00", endTime: "17:00", status: "available" }],
        4: [{ startTime: "09:00", endTime: "17:00", status: "available" }],
        5: [{ startTime: "09:00", endTime: "14:00", status: "available" }],
      },
      maxDailyAppointments: 6,
      languages: ["English", "Spanish"],
      rating: 4.9,
      totalSessions: 1247,
      isActive: true,
    },
    {
      id: "C002",
      name: "Mr. James Chen",
      title: "School Counselor",
      specialization: [
        "Career Guidance",
        "College Prep",
        "Social Skills",
        "Peer Mediation",
      ],
      credentials: ["M.A. School Counseling", "NCC Certified"],
      bio: "James helps students with career planning, college applications, and social development. He's passionate about helping students find their path and build meaningful connections.",
      availability: {
        1: [{ startTime: "08:00", endTime: "16:00", status: "available" }],
        2: [{ startTime: "08:00", endTime: "16:00", status: "available" }],
        4: [{ startTime: "08:00", endTime: "16:00", status: "available" }],
        5: [{ startTime: "08:00", endTime: "16:00", status: "available" }],
      },
      maxDailyAppointments: 5,
      languages: ["English", "Mandarin"],
      rating: 4.8,
      totalSessions: 892,
      isActive: true,
    },
  ]);

  const [sessions, setSessions] = useState<CounselingSession[]>([
    {
      id: "S001",
      studentId: "S001",
      studentName: "Emma Johnson",
      counselorId: "C001",
      counselorName: "Dr. Amanda Foster",
      type: "individual",
      status: "scheduled",
      scheduledDate: new Date(Date.now() + 86400000),
      startTime: "14:00",
      duration: 50,
      isVirtual: true,
      meetingLink: "https://meet.school.edu/session-s001",
      createdAt: new Date(Date.now() - 604800000),
      confidentialityLevel: "standard",
      parentConsent: true,
    },
    {
      id: "S002",
      studentId: "S001",
      studentName: "Emma Johnson",
      counselorId: "C001",
      counselorName: "Dr. Amanda Foster",
      type: "individual",
      status: "completed",
      scheduledDate: new Date(Date.now() - 604800000),
      startTime: "14:00",
      duration: 50,
      isVirtual: false,
      createdAt: new Date(Date.now() - 1209600000),
      confidentialityLevel: "standard",
      parentConsent: true,
      notes: {
        summary:
          "Student expressed anxiety about upcoming exams and college applications. Discussed coping strategies and time management techniques.",
        observations: [
          "Student appeared anxious but engaged",
          "Good eye contact",
          "Articulate about concerns",
        ],
        studentConcerns: [
          "Exam stress",
          "College application pressure",
          "Sleep difficulties",
        ],
        counselorRecommendations: [
          "Practice breathing exercises",
          "Create study schedule",
          "Consider sleep hygiene improvements",
        ],
        moodRating: 6,
        progressIndicators: ["Self-awareness", "Willingness to try strategies"],
        nextSteps: [
          "Practice breathing exercises daily",
          "Journal stress levels",
          "Schedule follow-up in 2 weeks",
        ],
        isConfidential: false,
      },
      followUp: {
        required: true,
        recommendedDate: new Date(Date.now() + 1209600000),
        frequency: "bi-weekly",
        goals: [
          "Reduce exam anxiety",
          "Improve sleep quality",
          "Build coping skills",
        ],
        interventions: [
          "CBT techniques",
          "Mindfulness practice",
          "Study skills coaching",
        ],
      },
    },
  ]);

  const [resources] = useState<MentalHealthResource[]>([
    {
      id: "R001",
      title: "Managing Academic Stress: A Student Guide",
      type: "article",
      category: "Academic Stress",
      description:
        "Practical strategies for managing exam stress, deadlines, and academic pressure while maintaining mental wellness.",
      content: "Academic stress is a common experience for students...",
      tags: ["stress", "academic", "exams", "coping"],
      ageAppropriate: ["high-school", "college"],
      isCrisisResource: false,
    },
    {
      id: "R002",
      title: "Crisis Support Hotline",
      type: "hotline",
      category: "Crisis Support",
      description:
        "24/7 confidential support for students in crisis. Trained counselors available anytime.",
      contactInfo: "1-800-CRISIS-HELP (1-800-274-7471)",
      tags: ["crisis", "emergency", "24-7", "confidential"],
      ageAppropriate: ["all"],
      isCrisisResource: true,
    },
    {
      id: "R003",
      title: "Mindfulness Meditation for Beginners",
      type: "video",
      category: "Mindfulness",
      description:
        "10-minute guided meditation to help reduce anxiety and improve focus.",
      url: "https://wellness.school.edu/mindfulness-basics",
      tags: ["meditation", "mindfulness", "anxiety", "focus"],
      ageAppropriate: ["middle-school", "high-school", "college"],
      isCrisisResource: false,
    },
    {
      id: "R004",
      title: "Peer Support Group - Anxiety & Stress",
      type: "support-group",
      category: "Peer Support",
      description:
        "Weekly facilitated group sessions where students can share experiences and support each other in managing anxiety and stress.",
      tags: ["peer-support", "anxiety", "group-therapy", "community"],
      ageAppropriate: ["high-school", "college"],
      isCrisisResource: false,
    },
  ]);

  const [wellnessChecks, setWellnessChecks] = useState<WellnessCheck[]>([
    {
      id: "W001",
      studentId: "S001",
      studentName: "Emma Johnson",
      date: new Date(Date.now() - 259200000),
      mood: 7,
      energy: 6,
      stress: 8,
      sleep: 5,
      social: 7,
      needsSupport: true,
      recommendedAction:
        "Consider scheduling a counseling session to discuss stress management",
    },
    {
      id: "W002",
      studentId: "S001",
      studentName: "Emma Johnson",
      date: new Date(Date.now() - 604800000),
      mood: 6,
      energy: 7,
      stress: 7,
      sleep: 6,
      social: 8,
      needsSupport: false,
    },
  ]);

  const [newSession, setNewSession] = useState<Partial<CounselingSession>>({
    type: "individual",
    isVirtual: true,
    confidentialityLevel: "standard",
  });

  const [newWellnessCheck, setNewWellnessCheck] = useState<
    Partial<WellnessCheck>
  >({
    mood: 5,
    energy: 5,
    stress: 5,
    sleep: 5,
    social: 5,
  });

  const categoryColors: Record<CounselingType, string> = {
    individual: "bg-indigo-100 text-indigo-700",
    group: "bg-green-100 text-green-700",
    crisis: "bg-red-100 text-red-700",
    family: "bg-purple-100 text-purple-700",
    peer: "bg-amber-100 text-amber-700",
    career: "bg-blue-100 text-blue-700",
  };

  const handleBookSession = async () => {
    if (
      !selectedCounselor ||
      !newSession.scheduledDate ||
      !newSession.startTime
    )
      return;

    const session = {
      ...newSession,
      type: newSession.type || "individual",
      counselorId: selectedCounselor.id,
      counselorName: selectedCounselor.name,
      studentId: userId,
      studentName: "Current User",
      duration: 50,
    } as Omit<CounselingSession, "id" | "status" | "createdAt">;

    const id = onBookSession ? await onBookSession(session) : `S${Date.now()}`;

    setSessions((prev) => [
      ...prev,
      {
        ...session,
        id,
        status: "scheduled",
        createdAt: new Date(),
      } as CounselingSession,
    ]);

    setShowBookingForm(false);
    setSelectedCounselor(null);
    setNewSession({
      type: "individual",
      isVirtual: true,
      confidentialityLevel: "standard",
    });
  };

  const handleRecordWellnessCheck = async () => {
    const check: Omit<WellnessCheck, "id" | "date"> = {
      ...newWellnessCheck,
      studentId: userId,
      studentName: "Current User",
      mood: newWellnessCheck.mood || 5,
      energy: newWellnessCheck.energy || 5,
      stress: newWellnessCheck.stress || 5,
      sleep: newWellnessCheck.sleep || 5,
      social: newWellnessCheck.social || 5,
      needsSupport:
        (newWellnessCheck.stress || 0) > 7 || (newWellnessCheck.mood || 5) < 4,
    };

    const id = onRecordWellnessCheck
      ? await onRecordWellnessCheck(check)
      : `W${Date.now()}`;

    setWellnessChecks((prev) => [
      {
        ...check,
        id,
        date: new Date(),
      } as WellnessCheck,
      ...prev,
    ]);

    setShowWellnessCheck(false);
    setNewWellnessCheck({ mood: 5, energy: 5, stress: 5, sleep: 5, social: 5 });
  };

  const upcomingSessions = sessions.filter((s) => s.status === "scheduled");
  const pastSessions = sessions.filter((s) => s.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Heart className="h-8 w-8 text-pink-500" />
            Mental Health & Counseling
          </h2>
          <p className="mt-1 text-slate-600">
            Confidential support for student wellbeing
          </p>
        </div>
        {userRole === "student" && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowWellnessCheck(true)}
              className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-green-700 transition-colors hover:bg-green-200"
            >
              <Smile className="h-5 w-5" />
              Wellness Check
            </button>
            <button
              onClick={() => setShowBookingForm(true)}
              className="flex items-center gap-2 rounded-lg bg-pink-600 px-6 py-3 font-medium text-white transition-colors hover:bg-pink-700"
            >
              <Calendar className="h-5 w-5" />
              Book Session
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "appointments", label: "My Appointments", icon: Calendar },
          { id: "resources", label: "Resources", icon: FileText },
          { id: "wellness", label: "Wellness Tracker", icon: Heart },
          { id: "counselors", label: "Our Counselors", icon: User },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-pink-600 border-b-2 text-pink-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "appointments" && (
        <div className="space-y-6">
          {upcomingSessions.length > 0 && (
            <div>
              <h3 className="mb-4 font-semibold text-slate-900 text-xl">
                Upcoming Sessions
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {upcomingSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${categoryColors[session.type]}`}
                          >
                            {session.type.charAt(0).toUpperCase() +
                              session.type.slice(1)}
                          </span>
                          <h4 className="mt-2 font-semibold text-lg text-slate-900">
                            {session.counselorName}
                          </h4>
                          <p className="text-slate-500 text-sm">
                            {session.scheduledDate.toLocaleDateString()} at{" "}
                            {session.startTime}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-pink-600">
                          {session.isVirtual ? (
                            <Video className="h-5 w-5" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                      <div className="mb-4 flex items-center gap-2 text-slate-600 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{session.duration} minutes</span>
                        {session.isVirtual && session.meetingLink && (
                          <a
                            href={session.meetingLink}
                            className="ml-2 text-indigo-600 hover:underline"
                          >
                            Join Meeting
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSession(session)}
                          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 text-sm transition-colors hover:bg-slate-50"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setSessions((prev) =>
                              prev.map((s) =>
                                s.id === session.id
                                  ? { ...s, status: "cancelled" }
                                  : s,
                              ),
                            );
                          }}
                          className="rounded-lg border border-red-300 px-4 py-2 text-red-600 text-sm transition-colors hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {pastSessions.length > 0 && (
            <div>
              <h3 className="mb-4 font-semibold text-slate-900 text-xl">
                Past Sessions
              </h3>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="divide-y divide-slate-200">
                  {pastSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className="cursor-pointer p-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${categoryColors[session.type]}`}
                            >
                              {session.type}
                            </span>
                            <span className="text-slate-500 text-sm">
                              {session.scheduledDate.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="font-medium text-slate-900">
                            {session.counselorName}
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {upcomingSessions.length === 0 && pastSessions.length === 0 && (
            <div className="py-12 text-center">
              <Calendar className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <h3 className="mb-2 font-semibold text-slate-900 text-xl">
                No Appointments Yet
              </h3>
              <p className="mb-4 text-slate-600">
                Book your first counseling session to get started
              </p>
              <button
                onClick={() => setShowBookingForm(true)}
                className="rounded-lg bg-pink-600 px-6 py-3 text-white transition-colors hover:bg-pink-700"
              >
                Book a Session
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "resources" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {resources.map((resource) => (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`overflow-hidden rounded-xl border bg-white shadow-md transition-shadow hover:shadow-lg ${
                  resource.isCrisisResource
                    ? "border-red-300"
                    : "border-slate-200"
                }`}
              >
                {resource.isCrisisResource && (
                  <div className="border-red-200 border-b bg-red-50 p-3">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">
                        Crisis Resource - Available 24/7
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600 text-xs uppercase">
                      {resource.type}
                    </span>
                    {resource.isCrisisResource && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-red-700 text-xs">
                        Crisis Support
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 font-semibold text-lg text-slate-900">
                    {resource.title}
                  </h3>
                  <p className="mb-3 text-slate-600 text-sm">
                    {resource.category}
                  </p>
                  <p className="mb-4 text-slate-700 text-sm">
                    {resource.description}
                  </p>

                  {resource.contactInfo && (
                    <div className="mb-4 rounded-lg bg-slate-50 p-3">
                      <div className="flex items-center gap-2 font-medium text-slate-900">
                        <Phone className="h-4 w-4" />
                        {resource.contactInfo}
                      </div>
                    </div>
                  )}

                  <div className="mb-4 flex flex-wrap gap-1">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full rounded-lg bg-pink-600 px-4 py-2 text-center text-white transition-colors hover:bg-pink-700"
                    >
                      Access Resource
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {activeTab === "wellness" && (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-4">
            {wellnessChecks.length > 0 && (
              <>
                {[
                  {
                    label: "Mood",
                    value: wellnessChecks[0].mood,
                    color: "bg-pink-500",
                  },
                  {
                    label: "Energy",
                    value: wellnessChecks[0].energy,
                    color: "bg-yellow-500",
                  },
                  {
                    label: "Stress",
                    value: wellnessChecks[0].stress,
                    color: "bg-red-500",
                  },
                  {
                    label: "Sleep",
                    value: wellnessChecks[0].sleep,
                    color: "bg-indigo-500",
                  },
                  {
                    label: "Social",
                    value: wellnessChecks[0].social,
                    color: "bg-green-500",
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <p className="mb-2 text-slate-600 text-sm">
                      {metric.label}
                    </p>
                    <div className="flex items-end gap-2">
                      <span className="font-bold text-3xl text-slate-900">
                        {metric.value}
                      </span>
                      <span className="text-slate-500 text-sm">/10</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                      <div
                        className={`h-2 rounded-full ${metric.color}`}
                        style={{ width: `${(metric.value / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {wellnessChecks[0]?.needsSupport && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">
                    Support Recommended
                  </p>
                  <p className="text-amber-700 text-sm">
                    {wellnessChecks[0].recommendedAction}
                  </p>
                </div>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="ml-auto rounded-lg bg-amber-600 px-4 py-2 text-sm text-white transition-colors hover:bg-amber-700"
                >
                  Book Now
                </button>
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="border-slate-200 border-b p-4">
              <h3 className="font-semibold text-slate-900">Wellness History</h3>
            </div>
            <div className="divide-y divide-slate-200">
              {wellnessChecks.map((check) => (
                <div key={check.id} className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-slate-500 text-sm">
                      {check.date.toLocaleDateString()}
                    </span>
                    {check.needsSupport && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 text-xs">
                        Support Needed
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: "Mood", value: check.mood },
                      { label: "Energy", value: check.energy },
                      { label: "Stress", value: check.stress },
                      { label: "Sleep", value: check.sleep },
                      { label: "Social", value: check.social },
                    ].map((metric) => (
                      <div key={metric.label} className="text-center">
                        <p className="text-slate-500 text-xs">{metric.label}</p>
                        <p
                          className={`font-semibold text-lg ${
                            metric.value >= 7
                              ? "text-green-600"
                              : metric.value >= 4
                                ? "text-amber-600"
                                : "text-red-600"
                          }`}
                        >
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "counselors" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {counselors.map((counselor) => (
              <motion.div
                key={counselor.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="h-32 bg-gradient-to-br from-pink-400 to-purple-600" />
                <div className="-mt-12 p-6">
                  <div className="mb-4 h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200">
                      <User className="h-12 w-12 text-slate-400" />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl">
                    {counselor.name}
                  </h3>
                  <p className="mb-2 text-slate-600">{counselor.title}</p>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      <span className="font-bold text-lg">
                        {counselor.rating}
                      </span>
                      <span className="ml-1 text-sm">/5</span>
                    </div>
                    <span className="text-slate-500 text-sm">
                      ({counselor.totalSessions} sessions)
                    </span>
                  </div>
                  <p className="mb-4 text-slate-700 text-sm">{counselor.bio}</p>
                  <div className="mb-4">
                    <p className="mb-2 font-medium text-slate-700 text-sm">
                      Specializations:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {counselor.specialization.map((spec) => (
                        <span
                          key={spec}
                          className="rounded bg-slate-100 px-2 py-1 text-slate-600 text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="mb-2 font-medium text-slate-700 text-sm">
                      Credentials:
                    </p>
                    <ul className="space-y-1 text-slate-600 text-sm">
                      {counselor.credentials.map((cred) => (
                        <li key={cred} className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {cred}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCounselor(counselor);
                      setShowBookingForm(true);
                    }}
                    className="w-full rounded-lg bg-pink-600 px-4 py-2 text-white transition-colors hover:bg-pink-700"
                  >
                    Book Session
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {showWellnessCheck && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowWellnessCheck(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b bg-gradient-to-r from-green-50 to-emerald-50 p-6">
              <h3 className="flex items-center gap-2 font-bold text-slate-900 text-xl">
                <Heart className="h-6 w-6 text-pink-500" />
                Daily Wellness Check
              </h3>
              <p className="text-slate-600">
                How are you feeling today? Rate yourself from 1-10.
              </p>
            </div>
            <div className="space-y-4 p-6">
              {[
                { label: "Mood", key: "mood", emoji: "😊" },
                { label: "Energy Level", key: "energy", emoji: "⚡" },
                { label: "Stress Level", key: "stress", emoji: "😰" },
                { label: "Sleep Quality", key: "sleep", emoji: "😴" },
                { label: "Social Connection", key: "social", emoji: "👥" },
              ].map((metric) => (
                <div key={metric.key}>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 font-medium text-slate-700">
                      <span className="text-xl">{metric.emoji}</span>
                      {metric.label}
                    </label>
                    <span className="font-bold text-2xl text-slate-900">
                      {String(
                        newWellnessCheck[
                          metric.key as keyof typeof newWellnessCheck
                        ] ?? "",
                      )}
                      /10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={
                      Number(
                        newWellnessCheck[
                          metric.key as keyof typeof newWellnessCheck
                        ],
                      ) || 5
                    }
                    onChange={(e) =>
                      setNewWellnessCheck({
                        ...newWellnessCheck,
                        [metric.key]: parseInt(e.target.value),
                      })
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-pink-600"
                  />
                  <div className="mt-1 flex justify-between text-slate-500 text-xs">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              ))}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={newWellnessCheck.notes || ""}
                  onChange={(e) =>
                    setNewWellnessCheck({
                      ...newWellnessCheck,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Anything else you'd like to share about how you're feeling?"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              <button
                onClick={handleRecordWellnessCheck}
                className="flex-1 rounded-lg bg-pink-600 px-6 py-3 font-medium text-white transition-colors hover:bg-pink-700"
              >
                Submit Check-in
              </button>
              <button
                onClick={() => setShowWellnessCheck(false)}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showBookingForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setShowBookingForm(false);
            setSelectedCounselor(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <h3 className="font-bold text-slate-900 text-xl">
                Book Counseling Session
              </h3>
              {selectedCounselor && (
                <p className="text-slate-600">with {selectedCounselor.name}</p>
              )}
            </div>
            <div className="space-y-4 p-6">
              {!selectedCounselor ? (
                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Select a Counselor
                  </label>
                  <div className="space-y-2">
                    {counselors.map((counselor) => (
                      <button
                        key={counselor.id}
                        onClick={() => setSelectedCounselor(counselor)}
                        className="w-full rounded-lg border border-slate-200 p-4 text-left transition-colors hover:border-pink-400 hover:bg-pink-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {counselor.name}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {counselor.title}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-slate-900 text-sm">
                              {counselor.rating} ★
                            </p>
                            <p className="text-slate-500 text-xs">
                              {counselor.totalSessions} sessions
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="mb-2 block font-medium text-slate-700">
                      Session Type
                    </label>
                    <select
                      value={newSession.type}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          type: e.target.value as CounselingType,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="individual">Individual Counseling</option>
                      <option value="group">Group Session</option>
                      <option value="crisis">Crisis Support</option>
                      <option value="family">Family Session</option>
                      <option value="career">Career Counseling</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-slate-700">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={
                        newSession.scheduledDate
                          ? newSession.scheduledDate.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          scheduledDate: new Date(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-slate-700">
                      Preferred Time
                    </label>
                    <select
                      value={newSession.startTime || ""}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          startTime: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newSession.isVirtual}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          isVirtual: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded text-pink-600 focus:ring-pink-500"
                    />
                    <label className="text-slate-700 text-sm">
                      Virtual Session (Video Call)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newSession.parentConsent}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          parentConsent: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded text-pink-600 focus:ring-pink-500"
                    />
                    <label className="text-slate-700 text-sm">
                      Parent/Guardian Consent Obtained
                    </label>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              {selectedCounselor && (
                <button
                  onClick={handleBookSession}
                  disabled={!newSession.scheduledDate || !newSession.startTime}
                  className="flex-1 rounded-lg bg-pink-600 px-6 py-3 font-medium text-white transition-colors hover:bg-pink-700 disabled:opacity-50"
                >
                  Confirm Booking
                </button>
              )}
              <button
                onClick={() => {
                  setShowBookingForm(false);
                  setSelectedCounselor(null);
                }}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedSession && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedSession(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xl">
                    Session Details
                  </h3>
                  <p className="text-slate-600">
                    {selectedSession.counselorName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="rounded-full p-2 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Date & Time</p>
                  <p className="font-semibold text-slate-900">
                    {selectedSession.scheduledDate.toLocaleDateString()} at{" "}
                    {selectedSession.startTime}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Duration</p>
                  <p className="font-semibold text-slate-900">
                    {selectedSession.duration} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${categoryColors[selectedSession.type]}`}
                >
                  {selectedSession.type.charAt(0).toUpperCase() +
                    selectedSession.type.slice(1)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    selectedSession.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : selectedSession.status === "scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {selectedSession.status.charAt(0).toUpperCase() +
                    selectedSession.status.slice(1)}
                </span>
              </div>

              {selectedSession.isVirtual && selectedSession.meetingLink && (
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Video className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium text-indigo-900">
                      Virtual Session
                    </span>
                  </div>
                  <a
                    href={selectedSession.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-indigo-600 hover:underline"
                  >
                    {selectedSession.meetingLink}
                  </a>
                </div>
              )}

              {selectedSession.notes && (
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                    <FileText className="h-5 w-5" />
                    Session Notes
                  </h4>
                  <div className="space-y-3 rounded-lg bg-slate-50 p-4">
                    <p className="text-slate-700">
                      {selectedSession.notes.summary}
                    </p>

                    <div>
                      <p className="mb-1 font-medium text-slate-900 text-sm">
                        Student Concerns:
                      </p>
                      <ul className="list-inside list-disc text-slate-600 text-sm">
                        {selectedSession.notes.studentConcerns.map(
                          (concern, idx) => (
                            <li key={idx}>{concern}</li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div>
                      <p className="mb-1 font-medium text-slate-900 text-sm">
                        Recommendations:
                      </p>
                      <ul className="list-inside list-disc text-slate-600 text-sm">
                        {selectedSession.notes.counselorRecommendations.map(
                          (rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div className="flex items-center gap-4 border-slate-200 border-t pt-2">
                      <div>
                        <p className="text-slate-500 text-sm">Mood Rating</p>
                        <p className="font-semibold text-slate-900">
                          {selectedSession.notes.moodRating}/10
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedSession.followUp &&
                selectedSession.followUp.required && (
                  <div className="rounded-lg border border-pink-200 bg-pink-50 p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-pink-900">
                      <Calendar className="h-5 w-5" />
                      Follow-up Recommended
                    </h4>
                    <p className="text-pink-800 text-sm">
                      Next session recommended by{" "}
                      {selectedSession.followUp.recommendedDate?.toLocaleDateString()}
                    </p>
                    {selectedSession.followUp.frequency && (
                      <p className="text-pink-800 text-sm">
                        Suggested frequency:{" "}
                        {selectedSession.followUp.frequency}
                      </p>
                    )}
                  </div>
                )}
            </div>
            <div className="border-slate-200 border-t p-6">
              <button
                onClick={() => setSelectedSession(null)}
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
