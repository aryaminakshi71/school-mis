"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Archive,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Download,
  FileText,
  Filter,
  FolderOpen,
  Lightbulb,
  ListTodo,
  Mic,
  MoreHorizontal,
  Pause,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Sparkles,
  Target,
  ThumbsDown,
  ThumbsUp,
  Timer,
  UserCircle,
  Users,
  Video,
  Wand2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "live" | "ended";
  duration: number;
  participants: MeetingParticipant[];
  transcript: TranscriptSegment[];
  actionItems: ActionItem[];
  decisions: Decision[];
  sentiment: SentimentAnalysis;
  summary: MeetingSummary;
  tasks: FollowUpTask[];
  recordingUrl?: string;
  tags: string[];
}

interface MeetingParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: "host" | "co-host" | "participant";
  email: string;
  speakingTime: number;
  messageCount: number;
  engagementScore: number;
  joinedAt: Date;
  leftAt?: Date;
}

interface TranscriptSegment {
  id: string;
  speakerId: string;
  speakerName: string;
  text: string;
  timestamp: Date;
  sentiment: "positive" | "neutral" | "negative";
  isHighlighted: boolean;
  isActionItem: boolean;
  confidence: number;
}

interface ActionItem {
  id: string;
  text: string;
  assigneeId: string;
  assigneeName: string;
  priority: "high" | "medium" | "low";
  dueDate?: Date;
  status: "pending" | "in-progress" | "completed";
  sourceSegmentId: string;
  createdAt: Date;
}

interface Decision {
  id: string;
  text: string;
  timestamp: Date;
  agreedBy: string[];
  impact: "high" | "medium" | "low";
  category: string;
}

interface SentimentAnalysis {
  overall: "positive" | "neutral" | "negative";
  positive: number;
  neutral: number;
  negative: number;
  timeline: { timestamp: Date; score: number }[];
  insights: string[];
}

interface MeetingSummary {
  overview: string;
  keyPoints: string[];
  duration: number;
  participantCount: number;
  topics: string[];
  generatedAt: Date;
}

interface FollowUpTask {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: Date;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  meetingId: string;
  createdAt: Date;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
    },
  },
};

const mockParticipants: MeetingParticipant[] = [
  {
    id: "p1",
    name: "Dr. Sarah Johnson",
    role: "host",
    email: "sarah.johnson@school.edu",
    speakingTime: 840,
    messageCount: 12,
    engagementScore: 95,
    joinedAt: new Date(Date.now() - 3600000),
    avatar: "SJ",
  },
  {
    id: "p2",
    name: "Michael Chen",
    role: "co-host",
    email: "michael.chen@school.edu",
    speakingTime: 420,
    messageCount: 8,
    engagementScore: 88,
    joinedAt: new Date(Date.now() - 3500000),
    avatar: "MC",
  },
  {
    id: "p3",
    name: "Emily Rodriguez",
    role: "participant",
    email: "emily.rodriguez@school.edu",
    speakingTime: 180,
    messageCount: 5,
    engagementScore: 72,
    joinedAt: new Date(Date.now() - 3400000),
    avatar: "ER",
  },
  {
    id: "p4",
    name: "James Wilson",
    role: "participant",
    email: "james.wilson@school.edu",
    speakingTime: 120,
    messageCount: 3,
    engagementScore: 65,
    joinedAt: new Date(Date.now() - 3300000),
    avatar: "JW",
  },
  {
    id: "p5",
    name: "Lisa Park",
    role: "participant",
    email: "lisa.park@school.edu",
    speakingTime: 90,
    messageCount: 2,
    engagementScore: 58,
    joinedAt: new Date(Date.now() - 3200000),
    avatar: "LP",
  },
];

const generateMockTranscript = (): TranscriptSegment[] => {
  const segments: TranscriptSegment[] = [
    {
      id: "t1",
      speakerId: "p1",
      speakerName: "Dr. Sarah Johnson",
      text: "Good morning everyone! Let's start our monthly curriculum review meeting. Today we'll discuss the new AI integration initiatives and teacher training programs.",
      timestamp: new Date(Date.now() - 3600000),
      sentiment: "positive",
      isHighlighted: true,
      isActionItem: false,
      confidence: 98,
    },
    {
      id: "t2",
      speakerId: "p2",
      speakerName: "Michael Chen",
      text: "I've prepared a comprehensive report on our current technology adoption rates. We've seen a 45% increase in digital tool usage since last semester.",
      timestamp: new Date(Date.now() - 3540000),
      sentiment: "positive",
      isHighlighted: false,
      isActionItem: false,
      confidence: 97,
    },
    {
      id: "t3",
      speakerId: "p1",
      speakerName: "Dr. Sarah Johnson",
      text: "Excellent work, Michael. Let's discuss the teacher training timeline. Emily, could you prepare the training schedule by next Friday?",
      timestamp: new Date(Date.now() - 3480000),
      sentiment: "positive",
      isHighlighted: false,
      isActionItem: true,
      confidence: 96,
    },
    {
      id: "t4",
      speakerId: "p3",
      speakerName: "Emily Rodriguez",
      text: "Absolutely, I'll have the training schedule ready. I'll also include the new AI-powered assessment tools we discussed last week.",
      timestamp: new Date(Date.now() - 3420000),
      sentiment: "positive",
      isHighlighted: false,
      isActionItem: false,
      confidence: 95,
    },
    {
      id: "t5",
      speakerId: "p4",
      speakerName: "James Wilson",
      text: "I have some concerns about the budget allocation for these new initiatives. The current proposal might exceed our Q3 limits.",
      timestamp: new Date(Date.now() - 3360000),
      sentiment: "negative",
      isHighlighted: true,
      isActionItem: false,
      confidence: 94,
    },
    {
      id: "t6",
      speakerId: "p1",
      speakerName: "Dr. Sarah Johnson",
      text: "That's a valid concern, James. Let's allocate 60% of the remaining Q3 budget to these initiatives and review again in October.",
      timestamp: new Date(Date.now() - 3300000),
      sentiment: "neutral",
      isHighlighted: true,
      isActionItem: false,
      confidence: 97,
    },
    {
      id: "t7",
      speakerId: "p5",
      speakerName: "Lisa Park",
      text: "Should we also consider the maintenance costs for the new software licenses?",
      timestamp: new Date(Date.now() - 3240000),
      sentiment: "neutral",
      isHighlighted: false,
      isActionItem: false,
      confidence: 93,
    },
    {
      id: "t8",
      speakerId: "p2",
      speakerName: "Michael Chen",
      text: "Good point, Lisa. I'll create a 3-year cost projection including maintenance and support fees.",
      timestamp: new Date(Date.now() - 3180000),
      sentiment: "positive",
      isHighlighted: false,
      isActionItem: true,
      confidence: 96,
    },
    {
      id: "t9",
      speakerId: "p1",
      speakerName: "Dr. Sarah Johnson",
      text: "Perfect! Let's move forward with the AI curriculum integration. Michael will lead the technical implementation, Emily will handle training coordination.",
      timestamp: new Date(Date.now() - 3120000),
      sentiment: "positive",
      isHighlighted: true,
      isActionItem: false,
      confidence: 98,
    },
    {
      id: "t10",
      speakerId: "p3",
      speakerName: "Emily Rodriguez",
      text: "I'll schedule the first training session for September 15th. All departments will be included.",
      timestamp: new Date(Date.now() - 3060000),
      sentiment: "positive",
      isHighlighted: false,
      isActionItem: true,
      confidence: 95,
    },
  ];
  return segments;
};

const mockMeetings: Meeting[] = [
  {
    id: "m1",
    title: "Monthly Curriculum Review - AI Integration",
    description: "Discussion on implementing AI tools across departments",
    startTime: new Date(Date.now() - 3600000),
    endTime: new Date(Date.now() - 600000),
    status: "ended",
    duration: 50,
    participants: mockParticipants,
    transcript: generateMockTranscript(),
    actionItems: [
      {
        id: "a1",
        text: "Prepare comprehensive training schedule for all departments",
        assigneeId: "p3",
        assigneeName: "Emily Rodriguez",
        priority: "high",
        status: "pending",
        sourceSegmentId: "t3",
        createdAt: new Date(Date.now() - 3480000),
      },
      {
        id: "a2",
        text: "Create 3-year cost projection including maintenance fees",
        assigneeId: "p2",
        assigneeName: "Michael Chen",
        priority: "medium",
        status: "in-progress",
        sourceSegmentId: "t8",
        createdAt: new Date(Date.now() - 3180000),
      },
      {
        id: "a3",
        text: "Schedule first training session for September 15th",
        assigneeId: "p3",
        assigneeName: "Emily Rodriguez",
        priority: "high",
        status: "pending",
        sourceSegmentId: "t10",
        createdAt: new Date(Date.now() - 3060000),
      },
    ],
    decisions: [
      {
        id: "d1",
        text: "Allocate 60% of Q3 remaining budget to AI integration initiatives",
        timestamp: new Date(Date.now() - 3300000),
        agreedBy: ["p1", "p2", "p4", "p5"],
        impact: "high",
        category: "Budget",
      },
      {
        id: "d2",
        text: "Michael Chen to lead technical implementation of AI curriculum",
        timestamp: new Date(Date.now() - 3120000),
        agreedBy: ["p1", "p2", "p3", "p4", "p5"],
        impact: "high",
        category: "Leadership",
      },
      {
        id: "d3",
        text: "Include all departments in AI training starting September 15th",
        timestamp: new Date(Date.now() - 3060000),
        agreedBy: ["p1", "p2", "p3", "p4", "p5"],
        impact: "medium",
        category: "Training",
      },
    ],
    sentiment: {
      overall: "positive",
      positive: 70,
      neutral: 25,
      negative: 5,
      timeline: [
        { timestamp: new Date(Date.now() - 3600000), score: 0.8 },
        { timestamp: new Date(Date.now() - 3300000), score: -0.3 },
        { timestamp: new Date(Date.now() - 3000000), score: 0.9 },
      ],
      insights: [
        "Meeting maintained positive sentiment throughout",
        "Budget concerns were addressed constructively",
        "High engagement on training initiatives",
      ],
    },
    summary: {
      overview:
        "Successfully reviewed curriculum integration plans with strong consensus on AI adoption. Key decisions made on budget allocation and training timeline.",
      keyPoints: [
        "45% increase in digital tool usage since last semester",
        "60% of Q3 budget allocated to AI initiatives",
        "Training scheduled for September 15th",
        "Technical implementation assigned to Michael Chen",
      ],
      duration: 50,
      participantCount: 5,
      topics: [
        "AI Integration",
        "Budget Planning",
        "Teacher Training",
        "Technology Adoption",
      ],
      generatedAt: new Date(),
    },
    tasks: [
      {
        id: "ft1",
        title: "Prepare Training Materials",
        description: "Create comprehensive training documentation for AI tools",
        assigneeId: "p3",
        assigneeName: "Emily Rodriguez",
        dueDate: new Date(Date.now() + 604800000),
        priority: "high",
        status: "pending",
        meetingId: "m1",
        createdAt: new Date(),
      },
      {
        id: "ft2",
        title: "Cost Analysis Report",
        description: "Complete 3-year cost projection with maintenance fees",
        assigneeId: "p2",
        assigneeName: "Michael Chen",
        dueDate: new Date(Date.now() + 1209600000),
        priority: "medium",
        status: "in-progress",
        meetingId: "m1",
        createdAt: new Date(),
      },
    ],
    recordingUrl: "#",
    tags: ["AI", "Curriculum", "Budget", "Training"],
  },
  {
    id: "m2",
    title: "Emergency Management Protocol Review",
    description: "Review and update school emergency response procedures",
    startTime: new Date(Date.now() - 172800000),
    endTime: new Date(Date.now() - 172740000),
    status: "ended",
    duration: 60,
    participants: mockParticipants.slice(0, 4),
    transcript: [],
    actionItems: [],
    decisions: [],
    sentiment: {
      overall: "neutral",
      positive: 40,
      neutral: 55,
      negative: 5,
      timeline: [],
      insights: ["Professional and focused discussion on safety protocols"],
    },
    summary: {
      overview: "Reviewed and approved updated emergency management protocols.",
      keyPoints: [
        "Updated evacuation procedures",
        "New communication protocols established",
      ],
      duration: 60,
      participantCount: 4,
      topics: ["Safety", "Emergency Management"],
      generatedAt: new Date(),
    },
    tasks: [],
    tags: ["Safety", "Emergency"],
  },
  {
    id: "m3",
    title: "Student Performance Analytics Review",
    description: "Quarterly review of student performance metrics",
    startTime: new Date(Date.now() + 86400000),
    endTime: new Date(Date.now() + 87000000),
    status: "scheduled",
    duration: 45,
    participants: mockParticipants.slice(0, 3),
    transcript: [],
    actionItems: [],
    decisions: [],
    sentiment: {
      overall: "neutral",
      positive: 50,
      neutral: 50,
      negative: 0,
      timeline: [],
      insights: [],
    },
    summary: {
      overview: "Scheduled meeting for performance review.",
      keyPoints: [],
      duration: 45,
      participantCount: 3,
      topics: ["Analytics"],
      generatedAt: new Date(),
    },
    tasks: [],
    tags: ["Analytics", "Performance"],
  },
];

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case "positive":
      return "#22c55e";
    case "negative":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

const getPriorityColor = (priority: string): { bg: string; text: string } => {
  switch (priority) {
    case "high":
      return { bg: "bg-rose-500/10", text: "text-rose-400" };
    case "medium":
      return { bg: "bg-amber-500/10", text: "text-amber-400" };
    default:
      return { bg: "bg-blue-500/10", text: "text-blue-400" };
  }
};

export function AIMeetingSummarizer() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(
    mockMeetings[0],
  );
  const [activeTab, setActiveTab] = useState<
    "live" | "transcript" | "analytics" | "summary"
  >("live");
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState<
    TranscriptSegment[]
  >([]);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "live" | "ended" | "scheduled"
  >("all");
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const playbackInterval = useRef<NodeJS.Timeout | null>(null);

  const liveMeeting = meetings.find((m) => m.status === "live");

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        if (Math.random() > 0.7) {
          const mockSegment: TranscriptSegment = {
            id: `live-${Date.now()}`,
            speakerId:
              mockParticipants[
                Math.floor(Math.random() * mockParticipants.length)
              ].id,
            speakerName:
              mockParticipants[
                Math.floor(Math.random() * mockParticipants.length)
              ].name,
            text: [
              "That's an excellent point.",
              "I agree with that assessment.",
              "Can we dive deeper into this?",
              "Let me add to that thought.",
              "From my perspective...",
            ][Math.floor(Math.random() * 5)],
            timestamp: new Date(),
            sentiment: Math.random() > 0.3 ? "positive" : "neutral",
            isHighlighted: false,
            isActionItem: Math.random() > 0.8,
            confidence: 90 + Math.random() * 8,
          };
          setCurrentTranscript((prev) => [...prev, mockSegment]);
        }
      }, 3000);
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    if (activeTab === "transcript" && transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab, selectedMeeting?.transcript]);

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesFilter =
      selectedFilter === "all" || meeting.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const startRecording = () => {
    setIsRecording(true);
    setIsTranscribing(true);
    setCurrentTranscript([]);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsTranscribing(false);
  };

  const playRecording = () => {
    if (isPlaying) {
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      let progress = 0;
      playbackInterval.current = setInterval(() => {
        progress += 1;
        setPlaybackProgress((progress / 100) * 100);
        if (progress >= 100) {
          if (playbackInterval.current) {
            clearInterval(playbackInterval.current);
          }
          setIsPlaying(false);
          setPlaybackProgress(0);
        }
      }, 100);
    }
  };

  const exportSummary = (format: "pdf" | "docx" | "txt") => {
    // Export functionality placeholder
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateMeetingMinutes = (meeting: Meeting) => {
    const minutes = `
MEETING MINUTES
===============

Meeting: ${meeting.title}
Date: ${meeting.startTime.toLocaleDateString()}
Duration: ${meeting.duration} minutes
Participants: ${meeting.participants.map((p) => p.name).join(", ")}

SUMMARY
-------
${meeting.summary.overview}

KEY POINTS
----------
${meeting.summary.keyPoints.map((point) => `• ${point}`).join("\n")}

DECISIONS MADE
--------------
${meeting.decisions.map((d) => `• ${d.text} (${d.category})`).join("\n")}

ACTION ITEMS
------------
${meeting.actionItems.map((a) => `• [${a.priority.toUpperCase()}] ${a.text} - ${a.assigneeName}`).join("\n")}

FOLLOW-UP TASKS
---------------
${meeting.tasks.map((t) => `• ${t.title} (Due: ${t.dueDate.toLocaleDateString()})`).join("\n")}

Generated by AI Meeting Summarizer
`;
    return minutes;
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <motion.div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-80 flex-col border-slate-800 border-r bg-slate-900/80 backdrop-blur-xl"
        >
          {/* Sidebar Header */}
          <div className="border-slate-800 border-b p-6">
            <div className="mb-6 flex items-center gap-3">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 shadow-lg shadow-violet-500/20">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-xl bg-violet-500 opacity-30 blur-lg"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              <div>
                <h1 className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text font-bold text-transparent text-xl">
                  AI Meeting Summarizer
                </h1>
                <p className="text-slate-400 text-xs">
                  Intelligent Transcription & Analytics
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-2.5 pr-4 pl-10 text-slate-200 text-sm transition-all placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>

            {/* Filters */}
            <div className="mt-4 flex gap-2">
              {["all", "live", "ended"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter as any)}
                  className={`rounded-lg px-3 py-1.5 font-medium text-xs transition-all ${
                    selectedFilter === filter
                      ? "border border-violet-500/30 bg-violet-500/20 text-violet-300"
                      : "border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Meeting List */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {filteredMeetings.map((meeting, index) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMeeting(meeting)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  selectedMeeting?.id === meeting.id
                    ? "border-violet-500/30 bg-violet-500/10"
                    : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600"
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium text-[10px] ${
                      meeting.status === "live"
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : meeting.status === "ended"
                          ? "border border-slate-600/30 bg-slate-600/20 text-slate-400"
                          : "border border-blue-500/30 bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {meeting.status === "live" && (
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        Live
                      </span>
                    )}
                    {meeting.status === "ended" && "Ended"}
                    {meeting.status === "scheduled" && "Scheduled"}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {meeting.duration}m
                  </span>
                </div>
                <h3 className="mb-1 line-clamp-2 font-semibold text-slate-200 text-sm">
                  {meeting.title}
                </h3>
                <p className="mb-3 text-slate-500 text-xs">
                  {meeting.startTime.toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2">
                  <div className="-space-x-2 flex">
                    {meeting.participants.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-800 bg-gradient-to-br from-violet-500 to-fuchsia-500 font-medium text-[10px] text-white"
                      >
                        {p.avatar || p.name[0]}
                      </div>
                    ))}
                  </div>
                  <span className="text-slate-500 text-xs">
                    +{meeting.participants.length - 3}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {meeting.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-slate-700/50 px-1.5 py-0.5 text-[10px] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Create Button */}
          <div className="border-slate-800 border-t p-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 font-medium text-sm text-white transition-all hover:from-violet-500 hover:to-fuchsia-500"
            >
              <Plus className="h-4 w-4" />
              New Meeting
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {selectedMeeting ? (
            <>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-slate-800 border-b bg-slate-900/50 p-6 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h2 className="font-bold text-2xl text-white">
                        {selectedMeeting.title}
                      </h2>
                      {selectedMeeting.status === "live" && (
                        <motion.span
                          className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-400 text-sm"
                          animate={{ opacity: [1, 0.7, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                          Recording
                        </motion.span>
                      )}
                    </div>
                    <p className="text-slate-400">
                      {selectedMeeting.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-slate-500 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {selectedMeeting.startTime.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {formatTime(selectedMeeting.startTime)} -{" "}
                        {formatTime(selectedMeeting.endTime)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {selectedMeeting.participants.length} participants
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Timer className="h-4 w-4" />
                        {selectedMeeting.duration} minutes
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => exportSummary("pdf")}
                      className="rounded-lg bg-slate-800 p-2.5 text-slate-400 transition-colors hover:text-slate-200"
                      title="Export PDF"
                    >
                      <Download className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        copyToClipboard(generateMeetingMinutes(selectedMeeting))
                      }
                      className="rounded-lg bg-slate-800 p-2.5 text-slate-400 transition-colors hover:text-slate-200"
                      title="Copy Minutes"
                    >
                      <Copy className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-lg bg-slate-800 p-2.5 text-slate-400 transition-colors hover:text-slate-200"
                      title="Share"
                    >
                      <Share2 className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-lg bg-slate-800 p-2.5 text-slate-400 transition-colors hover:text-slate-200"
                      title="Settings"
                    >
                      <Settings className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 flex gap-2">
                  {["live", "transcript", "analytics", "summary"].map((tab) => (
                    <motion.button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`relative rounded-xl px-5 py-2.5 font-medium text-sm transition-all ${
                        activeTab === tab
                          ? "text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        {tab === "live" && <Video className="h-4 w-4" />}
                        {tab === "transcript" && (
                          <FileText className="h-4 w-4" />
                        )}
                        {tab === "analytics" && (
                          <BarChart3 className="h-4 w-4" />
                        )}
                        {tab === "summary" && <Sparkles className="h-4 w-4" />}
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {tab === "transcript" &&
                          selectedMeeting.transcript.length > 0 && (
                            <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px]">
                              {selectedMeeting.transcript.length}
                            </span>
                          )}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {/* Live Tab */}
                  {activeTab === "live" && (
                    <motion.div
                      key="live"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Live Recording Status */}
                      <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 gap-6 md:grid-cols-2"
                      >
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl">
                          <div className="mb-6 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 font-semibold text-lg text-slate-200">
                              <Mic className="h-5 w-5 text-violet-400" />
                              Real-Time Transcription
                            </h3>
                            <div className="flex items-center gap-2">
                              {isRecording ? (
                                <motion.div
                                  className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-400 text-sm"
                                  animate={{ opacity: [1, 0.7, 1] }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                  }}
                                >
                                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                  Recording
                                </motion.div>
                              ) : (
                                <span className="rounded-full bg-slate-700 px-3 py-1.5 text-slate-400 text-sm">
                                  Standby
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Waveform Visualization */}
                          <div className="relative mb-6 h-32 overflow-hidden rounded-xl bg-slate-800/50">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 60 }).map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-1 rounded-full bg-gradient-to-t from-violet-500 to-fuchsia-500"
                                    animate={
                                      isRecording
                                        ? {
                                            height: [
                                              4,
                                              20 + Math.random() * 40,
                                              4,
                                            ],
                                          }
                                        : { height: 4 }
                                    }
                                    transition={{
                                      duration: 0.4,
                                      repeat: isRecording ? Infinity : 0,
                                      delay: i * 0.02,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                            {isRecording && (
                              <div className="absolute top-3 right-3 rounded border border-rose-500/30 bg-rose-500/20 px-2 py-1 text-rose-400 text-xs">
                                <span className="flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
                                  REC
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Recording Controls */}
                          <div className="flex items-center justify-center gap-4">
                            {!isRecording ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startRecording}
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-3 font-medium text-white transition-all hover:from-rose-400 hover:to-pink-400"
                              >
                                <Mic className="h-5 w-5" />
                                Start Recording
                              </motion.button>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={stopRecording}
                                className="flex items-center gap-2 rounded-xl bg-slate-700 px-6 py-3 font-medium text-slate-200 transition-all hover:bg-slate-600"
                              >
                                <Pause className="h-5 w-5" />
                                Stop Recording
                              </motion.button>
                            )}
                          </div>

                          {/* Live Transcript Preview */}
                          <div className="mt-6 max-h-48 space-y-3 overflow-y-auto">
                            {(isRecording
                              ? currentTranscript
                              : selectedMeeting.transcript.slice(-5)
                            ).map((segment, index) => (
                              <motion.div
                                key={segment.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-3 rounded-lg border border-slate-700/30 bg-slate-800/30 p-3"
                              >
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-medium text-white text-xs">
                                  {segment.speakerName[0]}
                                </div>
                                <div className="flex-1">
                                  <div className="mb-1 flex items-center gap-2">
                                    <span className="font-medium text-slate-300 text-sm">
                                      {segment.speakerName}
                                    </span>
                                    <span className="text-slate-500 text-xs">
                                      {formatTime(segment.timestamp)}
                                    </span>
                                    {segment.isActionItem && (
                                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                                        Action Item
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-slate-400 text-sm">
                                    {segment.text}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                      backgroundColor: getSentimentColor(
                                        segment.sentiment,
                                      ),
                                    }}
                                  />
                                  <span className="text-slate-500 text-xs">
                                    {segment.confidence}%
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* AI Status */}
                        <div className="space-y-6">
                          <motion.div
                            variants={itemVariants}
                            className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl"
                          >
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                              <Sparkles className="h-5 w-5 text-amber-400" />
                              AI Processing Status
                            </h3>
                            <div className="space-y-4">
                              {[
                                {
                                  label: "Speech Recognition",
                                  status: "active",
                                  progress: 98,
                                },
                                {
                                  label: "Action Item Extraction",
                                  status: "active",
                                  progress: 92,
                                },
                                {
                                  label: "Sentiment Analysis",
                                  status: "active",
                                  progress: 95,
                                },
                                {
                                  label: "Key Decision Detection",
                                  status: "processing",
                                  progress: 78,
                                },
                                {
                                  label: "Topic Classification",
                                  status: "pending",
                                  progress: 0,
                                },
                              ].map((item) => (
                                <div key={item.label} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">
                                      {item.label}
                                    </span>
                                    <span
                                      className={`text-xs ${
                                        item.status === "active"
                                          ? "text-emerald-400"
                                          : item.status === "processing"
                                            ? "text-amber-400"
                                            : "text-slate-500"
                                      }`}
                                    >
                                      {item.status === "active"
                                        ? "Active"
                                        : item.status === "processing"
                                          ? "Processing..."
                                          : "Pending"}
                                    </span>
                                  </div>
                                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                                    <motion.div
                                      className={`h-full rounded-full ${
                                        item.status === "active"
                                          ? "bg-emerald-500"
                                          : item.status === "processing"
                                            ? "bg-amber-500"
                                            : "bg-slate-600"
                                      }`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${item.progress}%` }}
                                      transition={{
                                        duration: 1,
                                        ease: "easeOut",
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>

                          <motion.div
                            variants={itemVariants}
                            className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl"
                          >
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                              <Activity className="h-5 w-5 text-cyan-400" />
                              Real-Time Metrics
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              {[
                                {
                                  label: "Words Transcribed",
                                  value: "1,247",
                                  change: "+24",
                                },
                                {
                                  label: "Action Items Found",
                                  value: "3",
                                  change: "+1",
                                },
                                {
                                  label: "Key Decisions",
                                  value: "2",
                                  change: "0",
                                },
                                {
                                  label: "Sentiment Score",
                                  value: "+0.8",
                                  change: "+0.2",
                                },
                              ].map((metric) => (
                                <div
                                  key={metric.label}
                                  className="rounded-xl bg-slate-800/50 p-3"
                                >
                                  <p className="mb-1 text-slate-500 text-xs">
                                    {metric.label}
                                  </p>
                                  <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-2xl text-white">
                                      {metric.value}
                                    </span>
                                    <span
                                      className={`text-xs ${
                                        metric.change.startsWith("+")
                                          ? "text-emerald-400"
                                          : metric.change === "0"
                                            ? "text-slate-400"
                                            : "text-rose-400"
                                      }`}
                                    >
                                      {metric.change}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Transcript Tab */}
                  {activeTab === "transcript" && (
                    <motion.div
                      key="transcript"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Search & Filter */}
                      <motion.div
                        variants={itemVariants}
                        className="flex gap-3"
                      >
                        <div className="relative flex-1">
                          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search transcript..."
                            className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-2.5 pr-4 pl-10 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                          />
                        </div>
                        <button className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-slate-400 text-sm transition-colors hover:text-slate-200">
                          <Filter className="h-4 w-4" />
                          Filter
                        </button>
                        <button className="rounded-xl bg-slate-800 px-4 py-2.5 text-slate-400 text-sm transition-colors hover:text-slate-200">
                          <Download className="h-4 w-4" />
                        </button>
                      </motion.div>

                      {/* Transcript Content */}
                      <motion.div variants={cardVariants}>
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl">
                          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
                            {selectedMeeting.transcript.map(
                              (segment, index) => (
                                <motion.div
                                  key={segment.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className={`group rounded-xl p-4 transition-all ${
                                    segment.isHighlighted
                                      ? "border border-amber-500/20 bg-amber-500/5"
                                      : "border border-slate-700/30 bg-slate-800/30 hover:border-slate-600"
                                  }`}
                                >
                                  <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-medium text-sm text-white">
                                        {segment.speakerName[0]}
                                      </div>
                                      <span className="mt-1 text-[10px] text-slate-500">
                                        {formatTime(segment.timestamp)}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="mb-2 flex items-center gap-3">
                                        <span className="font-medium text-slate-200">
                                          {segment.speakerName}
                                        </span>
                                        <div
                                          className="h-2 w-2 rounded-full"
                                          style={{
                                            backgroundColor: getSentimentColor(
                                              segment.sentiment,
                                            ),
                                          }}
                                        />
                                        <span className="text-slate-500 text-xs capitalize">
                                          {segment.sentiment}
                                        </span>
                                        {segment.isActionItem && (
                                          <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                                            <ListTodo className="h-3 w-3" />
                                            Action Item
                                          </span>
                                        )}
                                        {segment.isHighlighted && (
                                          <span className="flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-400">
                                            <Lightbulb className="h-3 w-3" />
                                            Key Point
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-slate-300 leading-relaxed">
                                        {segment.text}
                                      </p>
                                      <div className="mt-3 flex items-center gap-3">
                                        <span className="text-slate-500 text-xs">
                                          Confidence: {segment.confidence}%
                                        </span>
                                        <button className="flex items-center gap-1 text-slate-500 text-xs transition-colors hover:text-slate-300">
                                          <Share2 className="h-3 w-3" />
                                          Share
                                        </button>
                                        <button className="flex items-center gap-1 text-slate-500 text-xs transition-colors hover:text-slate-300">
                                          <MoreHorizontal className="h-3 w-3" />
                                          More
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ),
                            )}
                            <div ref={transcriptEndRef} />
                          </div>
                        </div>
                      </motion.div>

                      {/* Quick Actions */}
                      <motion.div
                        variants={itemVariants}
                        className="flex gap-3"
                      >
                        <button className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm text-violet-400 transition-all hover:bg-violet-500/20">
                          <Wand2 className="h-4 w-4" />
                          Extract Action Items
                        </button>
                        <button className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-amber-400 text-sm transition-all hover:bg-amber-500/20">
                          <Lightbulb className="h-4 w-4" />
                          Highlight Key Points
                        </button>
                        <button className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-emerald-400 text-sm transition-all hover:bg-emerald-500/20">
                          <Target className="h-4 w-4" />
                          Find Decisions
                        </button>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Analytics Tab */}
                  {activeTab === "analytics" && (
                    <motion.div
                      key="analytics"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Sentiment Analysis */}
                      <motion.div variants={itemVariants}>
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl">
                          <h3 className="mb-6 flex items-center gap-2 font-semibold text-lg text-slate-200">
                            <Activity className="h-5 w-5 text-violet-400" />
                            Sentiment Analysis
                          </h3>
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Sentiment Breakdown */}
                            <div className="space-y-4">
                              {[
                                {
                                  label: "Positive",
                                  value: selectedMeeting.sentiment.positive,
                                  color: "#22c55e",
                                  icon: ThumbsUp,
                                },
                                {
                                  label: "Neutral",
                                  value: selectedMeeting.sentiment.neutral,
                                  color: "#6b7280",
                                  icon: UserCircle,
                                },
                                {
                                  label: "Negative",
                                  value: selectedMeeting.sentiment.negative,
                                  color: "#ef4444",
                                  icon: ThumbsDown,
                                },
                              ].map((item) => (
                                <div
                                  key={item.label}
                                  className="flex items-center gap-3"
                                >
                                  <div
                                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                                    style={{
                                      backgroundColor: `${item.color}20`,
                                    }}
                                  >
                                    <item.icon
                                      className="h-5 w-5"
                                      style={{ color: item.color }}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="mb-1 flex items-center justify-between">
                                      <span className="text-slate-400 text-sm">
                                        {item.label}
                                      </span>
                                      <span className="font-medium text-slate-200 text-sm">
                                        {item.value}%
                                      </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                      <motion.div
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: item.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{
                                          duration: 1,
                                          ease: "easeOut",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Sentiment Timeline */}
                            <div className="md:col-span-2">
                              <div className="relative h-48 overflow-hidden rounded-xl bg-slate-800/50 p-4">
                                <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
                                  {selectedMeeting.sentiment.timeline.map(
                                    (point, i) => (
                                      <motion.div
                                        key={i}
                                        className="flex w-12 flex-col items-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.2 }}
                                      >
                                        <div
                                          className="w-full rounded-t-lg"
                                          style={{
                                            height: `${Math.abs(point.score) * 100}px`,
                                            backgroundColor:
                                              point.score > 0
                                                ? "#22c55e"
                                                : "#ef4444",
                                            opacity: 0.6,
                                          }}
                                        />
                                        <span className="mt-2 text-[10px] text-slate-500">
                                          {formatTime(point.timestamp)}
                                        </span>
                                      </motion.div>
                                    ),
                                  )}
                                </div>
                                <div className="absolute top-4 left-4">
                                  <span className="text-slate-500 text-xs">
                                    Sentiment Timeline
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Insights */}
                          <div className="mt-6 rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 p-4">
                            <h4 className="mb-3 flex items-center gap-2 font-medium text-slate-300 text-sm">
                              <Lightbulb className="h-4 w-4 text-amber-400" />
                              AI Insights
                            </h4>
                            <ul className="space-y-2">
                              {selectedMeeting.sentiment.insights.map(
                                (insight, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-slate-400 text-sm"
                                  >
                                    <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-400" />
                                    {insight}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>
                      </motion.div>

                      {/* Participation Analytics */}
                      <motion.div variants={itemVariants}>
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl">
                          <h3 className="mb-6 flex items-center gap-2 font-semibold text-lg text-slate-200">
                            <Users className="h-5 w-5 text-cyan-400" />
                            Participation Analytics
                          </h3>
                          <div className="space-y-4">
                            {selectedMeeting.participants.map(
                              (participant, index) => (
                                <motion.div
                                  key={participant.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center gap-4 rounded-xl bg-slate-800/30 p-4"
                                >
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-medium text-white">
                                    {participant.avatar}
                                  </div>
                                  <div className="flex-1">
                                    <div className="mb-2 flex items-center justify-between">
                                      <span className="font-medium text-slate-200">
                                        {participant.name}
                                      </span>
                                      <span className="text-slate-500 text-xs">
                                        {participant.role}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-xs">
                                      <div>
                                        <span className="text-slate-500">
                                          Speaking Time
                                        </span>
                                        <p className="font-medium text-slate-300">
                                          {formatDuration(
                                            participant.speakingTime,
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="text-slate-500">
                                          Messages
                                        </span>
                                        <p className="font-medium text-slate-300">
                                          {participant.messageCount}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="text-slate-500">
                                          Engagement
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700">
                                            <div
                                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                                              style={{
                                                width: `${participant.engagementScore}%`,
                                              }}
                                            />
                                          </div>
                                          <span className="text-slate-300">
                                            {participant.engagementScore}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ),
                            )}
                          </div>
                        </div>
                      </motion.div>

                      {/* Action Items & Decisions */}
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <motion.div variants={cardVariants}>
                          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl">
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                              <ListTodo className="h-5 w-5 text-amber-400" />
                              Action Items
                              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-400 text-xs">
                                {selectedMeeting.actionItems.length}
                              </span>
                            </h3>
                            <div className="space-y-3">
                              {selectedMeeting.actionItems.map(
                                (item, index) => (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-3"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div
                                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded ${
                                          item.status === "completed"
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : item.status === "in-progress"
                                              ? "bg-amber-500/20 text-amber-400"
                                              : "bg-slate-700 text-slate-400"
                                        }`}
                                      >
                                        {item.status === "completed" ? (
                                          <CheckCircle2 className="h-4 w-4" />
                                        ) : item.status === "in-progress" ? (
                                          <RefreshCw className="h-4 w-4" />
                                        ) : (
                                          <div className="h-3 w-3 rounded-full border-2 border-current" />
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-slate-300 text-sm">
                                          {item.text}
                                        </p>
                                        <div className="mt-2 flex items-center gap-3">
                                          <span
                                            className={`rounded px-2 py-0.5 text-xs ${getPriorityColor(item.priority).bg} ${getPriorityColor(item.priority).text}`}
                                          >
                                            {item.priority}
                                          </span>
                                          <span className="text-slate-500 text-xs">
                                            {item.assigneeName}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ),
                              )}
                            </div>
                          </div>
                        </motion.div>

                        <motion.div variants={cardVariants}>
                          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl">
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                              <Target className="h-5 w-5 text-emerald-400" />
                              Key Decisions
                              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-400 text-xs">
                                {selectedMeeting.decisions.length}
                              </span>
                            </h3>
                            <div className="space-y-3">
                              {selectedMeeting.decisions.map(
                                (decision, index) => (
                                  <motion.div
                                    key={decision.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-3"
                                  >
                                    <p className="text-slate-300 text-sm">
                                      {decision.text}
                                    </p>
                                    <div className="mt-2 flex items-center gap-3">
                                      <span className="rounded border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-violet-400 text-xs">
                                        {decision.category}
                                      </span>
                                      <span
                                        className={`rounded px-2 py-0.5 text-xs ${getPriorityColor(decision.impact).bg} ${getPriorityColor(decision.impact).text}`}
                                      >
                                        {decision.impact} impact
                                      </span>
                                      <span className="text-slate-500 text-xs">
                                        {decision.agreedBy.length} agreed
                                      </span>
                                    </div>
                                  </motion.div>
                                ),
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Summary Tab */}
                  {activeTab === "summary" && (
                    <motion.div
                      key="summary"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* AI Generated Summary */}
                      <motion.div variants={itemVariants}>
                        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-slate-900/60 p-6 backdrop-blur-xl">
                          <div className="mb-6 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 font-semibold text-lg text-slate-200">
                              <Sparkles className="h-5 w-5 text-amber-400" />
                              AI-Generated Meeting Summary
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 text-xs">
                                Generated{" "}
                                {selectedMeeting.summary.generatedAt.toLocaleTimeString()}
                              </span>
                              <button className="rounded-lg bg-slate-800 p-2 text-slate-400 transition-colors hover:text-slate-200">
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="prose prose-invert max-w-none">
                            <p className="text-lg text-slate-300 leading-relaxed">
                              {selectedMeeting.summary.overview}
                            </p>
                          </div>

                          {/* Key Points */}
                          <div className="mt-6">
                            <h4 className="mb-3 flex items-center gap-2 font-medium text-slate-400 text-sm">
                              <Lightbulb className="h-4 w-4 text-amber-400" />
                              Key Points
                            </h4>
                            <ul className="space-y-2">
                              {selectedMeeting.summary.keyPoints.map(
                                (point, index) => (
                                  <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-3 rounded-lg bg-slate-800/30 p-3"
                                  >
                                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 font-medium text-violet-400 text-xs">
                                      {index + 1}
                                    </span>
                                    <span className="text-slate-300">
                                      {point}
                                    </span>
                                  </motion.li>
                                ),
                              )}
                            </ul>
                          </div>

                          {/* Topics */}
                          <div className="mt-6">
                            <h4 className="mb-3 flex items-center gap-2 font-medium text-slate-400 text-sm">
                              <FolderOpen className="h-4 w-4 text-cyan-400" />
                              Topics Discussed
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedMeeting.summary.topics.map((topic) => (
                                <span
                                  key={topic}
                                  className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-300 text-sm"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Meeting Minutes */}
                      <motion.div variants={itemVariants}>
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl">
                          <div className="mb-6 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 font-semibold text-lg text-slate-200">
                              <FileText className="h-5 w-5 text-emerald-400" />
                              Auto-Generated Meeting Minutes
                            </h3>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => exportSummary("pdf")}
                                className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-400 transition-all hover:bg-violet-500/20"
                              >
                                <Download className="h-4 w-4" />
                                Export PDF
                              </button>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    generateMeetingMinutes(selectedMeeting),
                                  )
                                }
                                className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-slate-400 text-sm transition-colors hover:text-slate-200"
                              >
                                <Copy className="h-4 w-4" />
                                Copy Text
                              </button>
                            </div>
                          </div>

                          <div className="overflow-x-auto rounded-xl bg-slate-950 p-6 font-mono text-slate-400 text-sm">
                            <pre className="whitespace-pre-wrap">
                              {generateMeetingMinutes(selectedMeeting)}
                            </pre>
                          </div>
                        </div>
                      </motion.div>

                      {/* Follow-up Tasks */}
                      <motion.div variants={itemVariants}>
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl">
                          <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                            <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                            Follow-up Tasks Generated
                            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-cyan-400 text-xs">
                              {selectedMeeting.tasks.length}
                            </span>
                          </h3>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {selectedMeeting.tasks.map((task, index) => (
                              <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4 transition-colors hover:border-slate-600"
                              >
                                <div className="mb-2 flex items-start justify-between">
                                  <h4 className="font-medium text-slate-200">
                                    {task.title}
                                  </h4>
                                  <span
                                    className={`rounded px-2 py-0.5 text-xs ${getPriorityColor(task.priority).bg} ${getPriorityColor(task.priority).text}`}
                                  >
                                    {task.priority}
                                  </span>
                                </div>
                                <p className="mb-3 text-slate-400 text-sm">
                                  {task.description}
                                </p>
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                                      {task.assigneeName[0]}
                                    </div>
                                    <span className="text-slate-500">
                                      {task.assigneeName}
                                    </span>
                                  </div>
                                  <span className="text-slate-500">
                                    <Clock className="mr-1 inline h-3 w-3" />
                                    Due {task.dueDate.toLocaleDateString()}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      {/* Search History */}
                      <motion.div variants={itemVariants}>
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl">
                          <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                            <Archive className="h-5 w-5 text-violet-400" />
                            Searchable Meeting History
                          </h3>
                          <div className="relative mb-4">
                            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search across all meetings..."
                              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 pr-4 pl-10 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                            />
                          </div>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {meetings.slice(0, 3).map((meeting) => (
                              <motion.div
                                key={meeting.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedMeeting(meeting)}
                                className="cursor-pointer rounded-xl border border-slate-700/30 bg-slate-800/30 p-4 transition-all hover:border-slate-600"
                              >
                                <div className="mb-2 flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-slate-500" />
                                  <span className="text-slate-500 text-xs">
                                    {meeting.startTime.toLocaleDateString()}
                                  </span>
                                </div>
                                <h4 className="mb-1 line-clamp-1 font-medium text-slate-200 text-sm">
                                  {meeting.title}
                                </h4>
                                <p className="line-clamp-2 text-slate-400 text-xs">
                                  {meeting.summary.overview}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-800/50">
                  <Video className="h-12 w-12 text-slate-500" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-300 text-xl">
                  Select a Meeting
                </h3>
                <p className="max-w-sm text-slate-500">
                  Choose a meeting from the sidebar to view its transcript,
                  analytics, and AI-generated summary.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Meeting Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6"
            >
              <h3 className="mb-4 font-semibold text-white text-xl">
                Create New Meeting
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-slate-400 text-sm">
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter meeting title..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-slate-400 text-sm">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter meeting description..."
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-slate-400 text-sm">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-slate-400 text-sm">
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl bg-slate-800 px-4 py-2.5 font-medium text-slate-400 transition-colors hover:text-slate-200"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 font-medium text-white transition-all hover:from-violet-500 hover:to-fuchsia-500"
                >
                  Create Meeting
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIMeetingSummarizer;
