import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Calendar, Search, Star, Users, X } from "lucide-react";
import { useState } from "react";

export type SessionStatus = "open" | "in-progress" | "completed" | "cancelled";
export type HelpType =
  | "tutoring"
  | "homework-help"
  | "study-group"
  | "project-collaboration"
  | "skill-swap";
export type RequestStatus = "pending" | "accepted" | "declined" | "completed";

export interface PeerTutor {
  id: string;
  name: string;
  grade: string;
  subjects: string[];
  bio: string;
  rating: number;
  totalSessions: number;
  hourlyRate: number;
  availability: TimeSlot[];
  certifications?: string[];
  achievements?: string[];
  languages: string[];
  isVerified: boolean;
  profileImage?: string;
  reviews: Review[];
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

export interface TimeSlot {
  day: number;
  startTime: string;
  endTime: string;
}

export interface HelpRequest {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  type: HelpType;
  subject: string;
  topic: string;
  description: string;
  urgency: "low" | "medium" | "high" | "urgent";
  budget: number;
  preferredDuration: number;
  preferredTimes: TimeSlot[];
  status: SessionStatus;
  createdAt: Date;
  responses: TutorResponse[];
  acceptedTutorId?: string;
  scheduledSession?: ScheduledSession;
  attachments?: string[];
  views: number;
}

export interface TutorResponse {
  id: string;
  tutorId: string;
  tutorName: string;
  message: string;
  proposedRate: number;
  proposedTime: Date;
  duration: number;
  status: RequestStatus;
  respondedAt: Date;
}

export interface ScheduledSession {
  id: string;
  tutorId: string;
  tutorName: string;
  studentId: string;
  studentName: string;
  subject: string;
  topic: string;
  scheduledTime: Date;
  duration: number;
  rate: number;
  location: string;
  meetingLink?: string;
  isVirtual: boolean;
  status: SessionStatus;
  notes?: SessionNotes;
  completionData?: CompletionData;
}

export interface SessionNotes {
  summary: string;
  topicsCovered: string[];
  progressMade: string;
  nextSteps: string[];
  tutorFeedback?: string;
  studentFeedback?: string;
}

export interface CompletionData {
  completedAt: Date;
  rating: number;
  tutorReview?: string;
  studentReview?: string;
  hoursCompleted: number;
  paymentAmount: number;
  paymentStatus: "pending" | "completed";
}

export interface SkillSwap {
  id: string;
  offererId: string;
  offererName: string;
  skillOffering: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  skillSeeking: string;
  description: string;
  availability: string;
  status: "open" | "matched" | "completed";
  matches?: SkillMatch[];
}

export interface SkillMatch {
  id: string;
  userId: string;
  userName: string;
  skillOffering: string;
  matchScore: number;
  status: "pending" | "accepted" | "active" | "completed";
}

interface PeerLearningMarketplaceProps {
  userRole?: "student" | "teacher" | "admin";
  userId?: string;
  onCreateRequest?: (
    request: Omit<HelpRequest, "id" | "status" | "createdAt" | "views">,
  ) => Promise<string>;
  onRespondToRequest?: (
    requestId: string,
    response: Omit<TutorResponse, "id" | "respondedAt" | "status">,
  ) => Promise<void>;
  onAcceptResponse?: (requestId: string, responseId: string) => Promise<void>;
  onCompleteSession?: (
    sessionId: string,
    data: CompletionData,
  ) => Promise<void>;
  onSubmitReview?: (
    tutorId: string,
    review: Omit<Review, "id" | "date" | "helpful">,
  ) => Promise<void>;
}

export function PeerLearningMarketplace({
  userRole = "student",
  userId = "S001",
  onCreateRequest,
  onRespondToRequest,
  onAcceptResponse,
  onCompleteSession,
  onSubmitReview,
}: PeerLearningMarketplaceProps) {
  const [activeTab, setActiveTab] = useState<
    "tutors" | "requests" | "sessions" | "skills"
  >("tutors");
  const [selectedTutor, setSelectedTutor] = useState<PeerTutor | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(
    null,
  );
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterType, setFilterType] = useState<HelpType | "all">("all");

  const [tutors] = useState<PeerTutor[]>([
    {
      id: "T001",
      name: "Emma Chen",
      grade: "11",
      subjects: ["Mathematics", "Physics", "Chemistry"],
      bio: "Passionate about STEM subjects! I love breaking down complex concepts into simple, understandable pieces. I've been tutoring since freshman year and have helped over 50 students improve their grades.",
      rating: 4.9,
      totalSessions: 78,
      hourlyRate: 15,
      availability: [
        { day: 1, startTime: "15:00", endTime: "18:00" },
        { day: 3, startTime: "15:00", endTime: "18:00" },
        { day: 5, startTime: "10:00", endTime: "14:00" },
      ],
      certifications: ["Math Olympiad Bronze", "AP Scholar with Distinction"],
      achievements: [
        "Tutor of the Month - March 2025",
        "100% Student Satisfaction Rate",
      ],
      languages: ["English", "Mandarin"],
      isVerified: true,
      reviews: [
        {
          id: "R1",
          reviewerId: "S101",
          reviewerName: "Alex M.",
          rating: 5,
          comment:
            "Emma explained calculus so clearly! Finally understand derivatives.",
          date: new Date(Date.now() - 604800000),
          helpful: 12,
        },
        {
          id: "R2",
          reviewerId: "S102",
          reviewerName: "Jordan K.",
          rating: 5,
          comment:
            "Great at physics. Helped me prep for my exam and I got an A!",
          date: new Date(Date.now() - 2592000000),
          helpful: 8,
        },
      ],
    },
    {
      id: "T002",
      name: "Marcus Johnson",
      grade: "12",
      subjects: ["English Literature", "History", "Creative Writing"],
      bio: "Literature enthusiast and aspiring author. I specialize in essay writing, literary analysis, and creative writing. Let's make learning fun and engaging!",
      rating: 4.8,
      totalSessions: 45,
      hourlyRate: 12,
      availability: [
        { day: 2, startTime: "16:00", endTime: "19:00" },
        { day: 4, startTime: "16:00", endTime: "19:00" },
        { day: 6, startTime: "10:00", endTime: "15:00" },
      ],
      languages: ["English", "Spanish"],
      isVerified: true,
      reviews: [
        {
          id: "R3",
          reviewerId: "S103",
          reviewerName: "Taylor R.",
          rating: 5,
          comment:
            "Marcus helped me structure my college essays. Got into my dream school!",
          date: new Date(Date.now() - 1209600000),
          helpful: 15,
        },
      ],
    },
    {
      id: "T003",
      name: "Sophia Williams",
      grade: "10",
      subjects: ["Computer Science", "Web Development", "Digital Art"],
      bio: "Tech-savvy student passionate about coding and design. I can help with Python, HTML/CSS, JavaScript, and graphic design projects. Let's build something cool together!",
      rating: 4.7,
      totalSessions: 32,
      hourlyRate: 14,
      availability: [
        { day: 1, startTime: "14:00", endTime: "17:00" },
        { day: 5, startTime: "14:00", endTime: "17:00" },
      ],
      certifications: ["Code.org Certified", "Adobe Creative Suite Basics"],
      languages: ["English"],
      isVerified: true,
      reviews: [
        {
          id: "R4",
          reviewerId: "S104",
          reviewerName: "Casey B.",
          rating: 5,
          comment:
            "Sophia helped me create my first website. Super patient and knowledgeable!",
          date: new Date(Date.now() - 777600000),
          helpful: 10,
        },
      ],
    },
  ]);

  const [requests] = useState<HelpRequest[]>([
    {
      id: "REQ001",
      studentId: "S201",
      studentName: "David Park",
      grade: "10",
      type: "tutoring",
      subject: "Mathematics",
      topic: "Algebra II - Quadratic Equations",
      description:
        "I'm struggling with solving quadratic equations and graphing parabolas. Need someone to walk me through the concepts step by step.",
      urgency: "medium",
      budget: 20,
      preferredDuration: 60,
      preferredTimes: [{ day: 3, startTime: "15:30", endTime: "17:30" }],
      status: "open",
      createdAt: new Date(Date.now() - 172800000),
      responses: [
        {
          id: "RES1",
          tutorId: "T001",
          tutorName: "Emma Chen",
          message:
            "I can help! I'm available Wednesday at 4pm. I'll bring practice problems.",
          proposedRate: 15,
          proposedTime: new Date(Date.now() + 86400000),
          duration: 60,
          status: "pending",
          respondedAt: new Date(Date.now() - 86400000),
        },
      ],
      views: 45,
    },
    {
      id: "REQ002",
      studentId: "S202",
      studentName: "Aisha Patel",
      grade: "11",
      type: "study-group",
      subject: "Chemistry",
      topic: "AP Chemistry - Thermodynamics",
      description:
        "Looking for 2-3 study partners to prepare for AP Chem exam. We can meet in the library after school.",
      urgency: "high",
      budget: 0,
      preferredDuration: 120,
      preferredTimes: [{ day: 2, startTime: "15:00", endTime: "18:00" }],
      status: "in-progress",
      createdAt: new Date(Date.now() - 345600000),
      responses: [
        {
          id: "RES2",
          tutorId: "T004",
          tutorName: "Ryan Lee",
          message: "I'm in! I got a 5 on AP Chem last year.",
          proposedRate: 0,
          proposedTime: new Date(Date.now() + 86400000),
          duration: 120,
          status: "accepted",
          respondedAt: new Date(Date.now() - 259200000),
        },
        {
          id: "RES3",
          tutorId: "T005",
          tutorName: "Priya Sharma",
          message: "Count me in too!",
          proposedRate: 0,
          proposedTime: new Date(Date.now() + 86400000),
          duration: 120,
          status: "accepted",
          respondedAt: new Date(Date.now() - 172800000),
        },
      ],
      acceptedTutorId: "T004",
      scheduledSession: {
        id: "SES001",
        tutorId: "T004",
        tutorName: "Ryan Lee",
        studentId: "S202",
        studentName: "Aisha Patel",
        subject: "Chemistry",
        topic: "AP Chemistry Study Group",
        scheduledTime: new Date(Date.now() + 86400000),
        duration: 120,
        rate: 0,
        location: "Library Study Room 3",
        isVirtual: false,
        status: "in-progress",
      },
      views: 89,
    },
    {
      id: "REQ003",
      studentId: "S203",
      studentName: "Jordan Martinez",
      grade: "12",
      type: "homework-help",
      subject: "English",
      topic: "Essay Writing - Thesis Development",
      description:
        "Need help crafting a strong thesis statement for my senior thesis. 30 minutes should be enough.",
      urgency: "urgent",
      budget: 15,
      preferredDuration: 30,
      preferredTimes: [{ day: 1, startTime: "16:00", endTime: "17:00" }],
      status: "completed",
      createdAt: new Date(Date.now() - 604800000),
      responses: [
        {
          id: "RES4",
          tutorId: "T002",
          tutorName: "Marcus Johnson",
          message: "I can help you today! Meet me in the writing center.",
          proposedRate: 12,
          proposedTime: new Date(Date.now() - 518400000),
          duration: 30,
          status: "accepted",
          respondedAt: new Date(Date.now() - 604800000),
        },
      ],
      acceptedTutorId: "T002",
      scheduledSession: {
        id: "SES002",
        tutorId: "T002",
        tutorName: "Marcus Johnson",
        studentId: "S203",
        studentName: "Jordan Martinez",
        subject: "English",
        topic: "Thesis Development",
        scheduledTime: new Date(Date.now() - 518400000),
        duration: 30,
        rate: 12,
        location: "Writing Center",
        isVirtual: false,
        status: "completed",
        notes: {
          summary: "Worked on thesis statement development",
          topicsCovered: [
            "Thesis structure",
            "Argument clarity",
            "Supporting evidence",
          ],
          progressMade:
            "Student created 3 thesis options and selected the strongest one",
          nextSteps: [
            "Draft introduction paragraph",
            "Outline supporting points",
          ],
        },
        completionData: {
          completedAt: new Date(Date.now() - 518400000),
          rating: 5,
          hoursCompleted: 0.5,
          paymentAmount: 12,
          paymentStatus: "completed",
        },
      },
      views: 34,
    },
  ]);

  const [skillSwaps] = useState<SkillSwap[]>([
    {
      id: "SW001",
      offererId: "S301",
      offererName: "Chris Thompson",
      skillOffering: "Guitar (Intermediate)",
      skillLevel: "intermediate",
      skillSeeking: "Spanish Language",
      description:
        "I've been playing guitar for 5 years and can teach chords, strumming patterns, and basic music theory. Looking to learn Spanish conversation skills in exchange.",
      availability: "Weekends and Thursday evenings",
      status: "open",
    },
    {
      id: "SW002",
      offererId: "S302",
      offererName: "Maya Gupta",
      skillOffering: "Photography & Editing",
      skillLevel: "advanced",
      skillSeeking: "Basketball Skills",
      description:
        "Professional-level photography skills including composition, lighting, and Adobe Lightroom/Photoshop. Want to improve my basketball game.",
      availability: "Monday/Wednesday afternoons",
      status: "matched",
      matches: [
        {
          id: "M1",
          userId: "S303",
          userName: "Tom Anderson",
          skillOffering: "Basketball (Varsity Player)",
          matchScore: 95,
          status: "accepted",
        },
      ],
    },
  ]);

  const [newRequest, setNewRequest] = useState<Partial<HelpRequest>>({
    type: "tutoring",
    urgency: "medium",
    budget: 20,
    preferredDuration: 60,
  });

  const [responseData, setResponseData] = useState<Partial<TutorResponse>>({
    proposedRate: 15,
    duration: 60,
  });

  const typeColors: Record<HelpType, string> = {
    tutoring: "bg-blue-100 text-blue-700",
    "homework-help": "bg-green-100 text-green-700",
    "study-group": "bg-purple-100 text-purple-700",
    "project-collaboration": "bg-amber-100 text-amber-700",
    "skill-swap": "bg-pink-100 text-pink-700",
  };

  const urgencyColors: Record<string, string> = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subjects.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesSubject =
      filterSubject === "all" || tutor.subjects.includes(filterSubject);
    return matchesSearch && matchesSubject;
  });

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || request.type === filterType;
    return matchesSearch && matchesType;
  });

  const allSubjects = Array.from(new Set(tutors.flatMap((t) => t.subjects)));

  const handleCreateRequest = async () => {
    if (!newRequest.subject || !newRequest.topic || !newRequest.description)
      return;

    const request = {
      ...newRequest,
      type: newRequest.type || "tutoring",
      studentId: userId,
      studentName: "Current User",
      grade: "11",
    } as Omit<HelpRequest, "id" | "status" | "createdAt" | "views">;

    const id = onCreateRequest
      ? await onCreateRequest(request)
      : `REQ${Date.now()}`;

    setShowRequestForm(false);
    setNewRequest({
      type: "tutoring",
      urgency: "medium",
      budget: 20,
      preferredDuration: 60,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Users className="h-8 w-8 text-indigo-600" />
            Peer Learning Marketplace
          </h2>
          <p className="mt-1 text-slate-600">
            Connect with peer tutors and study partners
          </p>
        </div>
        {userRole === "student" && (
          <button
            onClick={() => setShowRequestForm(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <BookOpen className="h-5 w-5" />
            Post Request
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Active Tutors",
            value: tutors.length,
            color: "bg-indigo-500",
            icon: Users,
          },
          {
            label: "Open Requests",
            value: requests.filter((r) => r.status === "open").length,
            color: "bg-amber-500",
            icon: BookOpen,
          },
          {
            label: "Completed Sessions",
            value: requests.filter((r) => r.status === "completed").length,
            color: "bg-green-500",
            icon: Star,
          },
          {
            label: "Avg Rating",
            value: "4.8",
            color: "bg-purple-500",
            icon: Star,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon
                className={`h-4 w-4 ${stat.color.replace("bg-", "text-")}`}
              />
              <span className="text-slate-600 text-sm">{stat.label}</span>
            </div>
            <p className="font-bold text-2xl text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "tutors", label: "Find Tutors", icon: Users },
          { id: "requests", label: "Help Requests", icon: BookOpen },
          { id: "sessions", label: "My Sessions", icon: Calendar },
          { id: "skills", label: "Skill Swap", icon: Star },
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

      {activeTab === "tutors" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search tutors by name, subject, or skill..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterSubject}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterSubject(e.target.value)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Subjects</option>
              {allSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredTutors.map((tutor) => (
                <motion.div
                  key={tutor.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-600" />
                  <div className="-mt-8 p-6">
                    <div className="flex items-start justify-between">
                      <div className="h-16 w-16 rounded-full bg-white p-1 shadow-lg">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200">
                          <Users className="h-8 w-8 text-slate-400" />
                        </div>
                      </div>
                      {tutor.isVerified && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-green-700 text-xs">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-bold text-slate-900 text-xl">
                      {tutor.name}
                    </h3>
                    <p className="mb-2 text-slate-600">
                      Grade {tutor.grade} • {tutor.totalSessions} sessions
                    </p>
                    <div className="mb-3 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span className="font-semibold text-slate-900">
                        {tutor.rating}
                      </span>
                      <span className="text-slate-500 text-sm">
                        ({tutor.reviews.length} reviews)
                      </span>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {tutor.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-700 text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    <p className="mb-4 line-clamp-2 text-slate-600 text-sm">
                      {tutor.bio}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-lg text-slate-900">
                          ${tutor.hourlyRate}
                        </span>
                        <span className="text-slate-500 text-sm">/hour</span>
                      </div>
                      <button
                        onClick={() => setSelectedTutor(tutor)}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {activeTab === "requests" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterType(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              {Object.keys(typeColors).map((type) => (
                <option key={type} value={type}>
                  {type.replace("-", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((request) => (
                <motion.div
                  key={request.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${typeColors[request.type]}`}
                        >
                          {request.type.replace("-", " ").toUpperCase()}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${urgencyColors[request.urgency]}`}
                        >
                          {request.urgency.toUpperCase()}
                        </span>
                        <span className="text-slate-500 text-sm">
                          {request.views} views
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-900">
                        {request.topic}
                      </h3>
                      <p className="text-slate-600">
                        {request.subject} • Grade {request.grade}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-slate-900">
                        {request.budget > 0 ? `$${request.budget}` : "Free"}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {request.preferredDuration} min
                      </p>
                    </div>
                  </div>
                  <p className="mb-4 text-slate-700">{request.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <span>Posted by {request.studentName}</span>
                      <span>•</span>
                      <span>{request.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-sm">
                        {request.responses.length} response
                        {request.responses.length !== 1 ? "s" : ""}
                      </span>
                      {request.status === "open" &&
                        userRole === "student" &&
                        request.studentId !== userId && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowResponseForm(true);
                            }}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700"
                          >
                            Offer Help
                          </button>
                        )}
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 text-sm transition-colors hover:bg-slate-50"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {activeTab === "sessions" && (
        <div className="space-y-4">
          {requests
            .filter(
              (r) =>
                r.scheduledSession &&
                (r.studentId === userId || r.acceptedTutorId === userId),
            )
            .map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {request.scheduledSession?.subject}
                    </h3>
                    <p className="text-slate-600">
                      {request.scheduledSession?.topic}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      request.scheduledSession?.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : request.scheduledSession?.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {request.scheduledSession?.status.toUpperCase()}
                  </span>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-slate-500 text-sm">
                      {request.studentId === userId ? "Tutor" : "Student"}
                    </p>
                    <p className="font-semibold text-slate-900">
                      {request.studentId === userId
                        ? request.scheduledSession?.tutorName
                        : request.scheduledSession?.studentName}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-slate-500 text-sm">When</p>
                    <p className="font-semibold text-slate-900">
                      {request.scheduledSession?.scheduledTime.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-slate-500 text-sm">Where</p>
                    <p className="font-semibold text-slate-900">
                      {request.scheduledSession?.location}
                    </p>
                  </div>
                </div>
                {request.scheduledSession?.completionData && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                      <span className="font-semibold text-slate-900">
                        {request.scheduledSession.completionData.rating}/5
                      </span>
                    </div>
                    <p className="text-green-800 text-sm">
                      Session completed • $
                      {request.scheduledSession.completionData.paymentAmount}{" "}
                      paid
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      )}

      {activeTab === "skills" && (
        <div className="space-y-4">
          {skillSwaps.map((swap) => (
            <motion.div
              key={swap.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-pink-100 px-2 py-1 text-pink-700 text-xs">
                      SKILL SWAP
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        swap.status === "open"
                          ? "bg-green-100 text-green-700"
                          : swap.status === "matched"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {swap.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {swap.offererName}
                  </h3>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-indigo-50 p-3">
                  <p className="mb-1 text-slate-600 text-sm">Offering</p>
                  <p className="font-semibold text-indigo-900">
                    {swap.skillOffering}
                  </p>
                  <span className="text-indigo-600 text-xs capitalize">
                    ({swap.skillLevel})
                  </span>
                </div>
                <div className="rounded-lg bg-amber-50 p-3">
                  <p className="mb-1 text-slate-600 text-sm">Seeking</p>
                  <p className="font-semibold text-amber-900">
                    {swap.skillSeeking}
                  </p>
                </div>
              </div>
              <p className="mb-3 text-slate-700">{swap.description}</p>
              <p className="mb-4 text-slate-500 text-sm">
                Available: {swap.availability}
              </p>
              {swap.matches && swap.matches.length > 0 && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="font-medium text-green-800 text-sm">
                    Matched with: {swap.matches[0].userName}
                  </p>
                  <p className="text-green-600 text-xs">
                    Offering: {swap.matches[0].skillOffering}
                  </p>
                </div>
              )}
              {swap.status === "open" && (
                <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700">
                  Express Interest
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {selectedTutor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedTutor(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="relative h-32 bg-gradient-to-br from-indigo-500 to-purple-600">
              <button
                onClick={() => setSelectedTutor(null)}
                className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="-mt-12 p-6">
              <div className="mb-4 h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200">
                  <Users className="h-12 w-12 text-slate-400" />
                </div>
              </div>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-2xl text-slate-900">
                    {selectedTutor.name}
                  </h3>
                  <p className="text-slate-600">Grade {selectedTutor.grade}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-2xl text-slate-900">
                      {selectedTutor.rating}
                    </span>
                    <span className="text-slate-500">/5</span>
                  </div>
                  <p className="text-slate-500 text-sm">
                    {selectedTutor.totalSessions} sessions
                  </p>
                </div>
              </div>

              <p className="mb-4 text-slate-700">{selectedTutor.bio}</p>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Hourly Rate</p>
                  <p className="font-bold text-slate-900 text-xl">
                    ${selectedTutor.hourlyRate}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Languages</p>
                  <p className="font-semibold text-slate-900 text-sm">
                    {selectedTutor.languages.join(", ")}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="mb-2 font-semibold text-slate-900">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTutor.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700 text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {selectedTutor.certifications && (
                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-slate-900">
                    Certifications
                  </h4>
                  <ul className="space-y-1">
                    {selectedTutor.certifications.map((cert, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-slate-600 text-sm"
                      >
                        <Star className="h-4 w-4 text-amber-500" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="mb-2 font-semibold text-slate-900">Reviews</h4>
                <div className="space-y-3">
                  {selectedTutor.reviews.map((review) => (
                    <div key={review.id} className="rounded-lg bg-slate-50 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 fill-amber-500 text-amber-500"
                            />
                          ))}
                        </div>
                        <span className="font-medium text-slate-900 text-sm">
                          {review.reviewerName}
                        </span>
                        <span className="text-slate-500 text-xs">
                          {review.date.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showRequestForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowRequestForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b bg-indigo-50 p-6">
              <h3 className="font-bold text-indigo-900 text-xl">
                Post Help Request
              </h3>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Type
                  </label>
                  <select
                    value={newRequest.type}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        type: e.target.value as HelpType,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="tutoring">Tutoring</option>
                    <option value="homework-help">Homework Help</option>
                    <option value="study-group">Study Group</option>
                    <option value="project-collaboration">
                      Project Collaboration
                    </option>
                    <option value="skill-swap">Skill Swap</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Urgency
                  </label>
                  <select
                    value={newRequest.urgency}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        urgency: e.target.value as any,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Subject *
                </label>
                <input
                  type="text"
                  value={newRequest.subject || ""}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, subject: e.target.value })
                  }
                  placeholder="e.g., Mathematics"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Topic *
                </label>
                <input
                  type="text"
                  value={newRequest.topic || ""}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, topic: e.target.value })
                  }
                  placeholder="e.g., Quadratic Equations"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Description *
                </label>
                <textarea
                  value={newRequest.description || ""}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe what you need help with..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={newRequest.budget || ""}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        budget: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0 for free"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={newRequest.preferredDuration || ""}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        preferredDuration: parseInt(e.target.value) || 60,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              <button
                onClick={handleCreateRequest}
                disabled={
                  !newRequest.subject ||
                  !newRequest.topic ||
                  !newRequest.description
                }
                className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                Post Request
              </button>
              <button
                onClick={() => setShowRequestForm(false)}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showResponseForm && selectedRequest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowResponseForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <h3 className="font-bold text-slate-900 text-xl">Offer Help</h3>
              <p className="text-slate-600">{selectedRequest.topic}</p>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Your Message
                </label>
                <textarea
                  value={responseData.message || ""}
                  onChange={(e) =>
                    setResponseData({
                      ...responseData,
                      message: e.target.value,
                    })
                  }
                  placeholder="Tell them how you can help..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Your Rate ($)
                  </label>
                  <input
                    type="number"
                    value={responseData.proposedRate || ""}
                    onChange={(e) =>
                      setResponseData({
                        ...responseData,
                        proposedRate: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={responseData.duration || ""}
                    onChange={(e) =>
                      setResponseData({
                        ...responseData,
                        duration: parseInt(e.target.value) || 60,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              <button
                onClick={() => {
                  setShowResponseForm(false);
                  setSelectedRequest(null);
                }}
                className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Send Offer
              </button>
              <button
                onClick={() => {
                  setShowResponseForm(false);
                  setSelectedRequest(null);
                }}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
