"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Flame,
  Focus,
  GitBranch,
  MapPin,
  MessageCircle,
  Mic,
  PieChart,
  Plus,
  Search,
  Shield,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock Data Types
interface BehaviorPattern {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  avatar: string;
  patterns: {
    category: string;
    frequency: number;
    trend: "up" | "down" | "stable";
    severity: "low" | "medium" | "high";
    lastOccurrence: string;
  }[];
  overallScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
}

interface LearningStyle {
  studentId: string;
  studentName: string;
  avatar: string;
  visual: number;
  auditory: number;
  kinesthetic: number;
  reading: number;
  social: number;
  solitary: number;
  dominantStyle: string;
  confidence: number;
}

interface EngagementMetrics {
  date: string;
  classAttention: number;
  participation: number;
  taskCompletion: number;
  collaboration: number;
  focusDuration: number;
  interactions: number;
}

interface RiskAlert {
  id: string;
  studentId: string;
  studentName: string;
  type: "disruptive" | "absence" | "decline" | "isolation" | "conflict";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  timestamp: string;
  acknowledged: boolean;
  recommendedAction: string;
}

interface PositiveReinforcement {
  id: string;
  studentId: string;
  studentName: string;
  avatar: string;
  type: string;
  points: number;
  badge: string;
  timestamp: string;
  teacher: string;
  category: "academic" | "behavioral" | "social" | "effort";
}

interface CohortComparison {
  cohort: string;
  size: number;
  avgEngagement: number;
  avgAttention: number;
  behaviorScore: number;
  improvementRate: number;
  riskStudents: number;
  highPerformers: number;
}

interface PredictiveInsight {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  trend: "up" | "down" | "stable";
  timeframe: string;
  factors: string[];
}

interface HeatmapData {
  hour: string;
  day: string;
  value: number;
  activity: string;
}

// Mock Data
const mockBehaviorPatterns: BehaviorPattern[] = [
  {
    id: "1",
    studentId: "ST001",
    studentName: "Alex Chen",
    grade: "10th Grade",
    avatar: "AC",
    patterns: [
      {
        category: "Class Participation",
        frequency: 85,
        trend: "up",
        severity: "low",
        lastOccurrence: "Today",
      },
      {
        category: "Task Completion",
        frequency: 92,
        trend: "stable",
        severity: "low",
        lastOccurrence: "Yesterday",
      },
      {
        category: "Peer Interaction",
        frequency: 78,
        trend: "up",
        severity: "low",
        lastOccurrence: "2 days ago",
      },
    ],
    overallScore: 85,
    riskLevel: "low",
  },
  {
    id: "2",
    studentId: "ST002",
    studentName: "Jordan Smith",
    grade: "11th Grade",
    avatar: "JS",
    patterns: [
      {
        category: "Disruptive Behavior",
        frequency: 12,
        trend: "down",
        severity: "high",
        lastOccurrence: "3 days ago",
      },
      {
        category: "Attention Span",
        frequency: 45,
        trend: "stable",
        severity: "medium",
        lastOccurrence: "Today",
      },
      {
        category: "Homework Submission",
        frequency: 38,
        trend: "down",
        severity: "high",
        lastOccurrence: "1 week ago",
      },
    ],
    overallScore: 42,
    riskLevel: "high",
  },
  {
    id: "3",
    studentId: "ST003",
    studentName: "Maria Garcia",
    grade: "9th Grade",
    avatar: "MG",
    patterns: [
      {
        category: "Social Engagement",
        frequency: 95,
        trend: "up",
        severity: "low",
        lastOccurrence: "Today",
      },
      {
        category: "Leadership",
        frequency: 88,
        trend: "up",
        severity: "low",
        lastOccurrence: "Yesterday",
      },
      {
        category: "Helping Others",
        frequency: 91,
        trend: "stable",
        severity: "low",
        lastOccurrence: "Today",
      },
    ],
    overallScore: 91,
    riskLevel: "low",
  },
  {
    id: "4",
    studentId: "ST004",
    studentName: "Tyler Williams",
    grade: "10th Grade",
    avatar: "TW",
    patterns: [
      {
        category: "Absence Pattern",
        frequency: 8,
        trend: "up",
        severity: "high",
        lastOccurrence: "2 days ago",
      },
      {
        category: "Late Arrivals",
        frequency: 15,
        trend: "up",
        severity: "medium",
        lastOccurrence: "Today",
      },
      {
        category: "Withdrawal",
        frequency: 6,
        trend: "up",
        severity: "high",
        lastOccurrence: "Yesterday",
      },
    ],
    overallScore: 28,
    riskLevel: "critical",
  },
  {
    id: "5",
    studentId: "ST005",
    studentName: "Sophie Brown",
    grade: "12th Grade",
    avatar: "SB",
    patterns: [
      {
        category: "Academic Excellence",
        frequency: 96,
        trend: "stable",
        severity: "low",
        lastOccurrence: "Today",
      },
      {
        category: "Mentoring",
        frequency: 87,
        trend: "up",
        severity: "low",
        lastOccurrence: "Yesterday",
      },
      {
        category: "Initiative",
        frequency: 93,
        trend: "up",
        severity: "low",
        lastOccurrence: "Today",
      },
    ],
    overallScore: 92,
    riskLevel: "low",
  },
  {
    id: "6",
    studentId: "ST006",
    studentName: "David Kim",
    grade: "10th Grade",
    avatar: "DK",
    patterns: [
      {
        category: "Conflict Incidents",
        frequency: 7,
        trend: "stable",
        severity: "medium",
        lastOccurrence: "3 days ago",
      },
      {
        category: "Academic Decline",
        frequency: 52,
        trend: "down",
        severity: "medium",
        lastOccurrence: "1 week ago",
      },
      {
        category: "Attention",
        frequency: 61,
        trend: "stable",
        severity: "medium",
        lastOccurrence: "Today",
      },
    ],
    overallScore: 55,
    riskLevel: "medium",
  },
];

const mockLearningStyles: LearningStyle[] = [
  {
    studentId: "ST001",
    studentName: "Alex Chen",
    avatar: "AC",
    visual: 75,
    auditory: 60,
    kinesthetic: 85,
    reading: 70,
    social: 80,
    solitary: 55,
    dominantStyle: "Kinesthetic",
    confidence: 92,
  },
  {
    studentId: "ST002",
    studentName: "Jordan Smith",
    avatar: "JS",
    visual: 65,
    auditory: 80,
    kinesthetic: 45,
    reading: 55,
    social: 70,
    solitary: 60,
    dominantStyle: "Auditory",
    confidence: 88,
  },
  {
    studentId: "ST003",
    studentName: "Maria Garcia",
    avatar: "MG",
    visual: 70,
    auditory: 65,
    kinesthetic: 60,
    reading: 50,
    social: 95,
    solitary: 40,
    dominantStyle: "Social",
    confidence: 94,
  },
  {
    studentId: "ST004",
    studentName: "Tyler Williams",
    avatar: "TW",
    visual: 85,
    auditory: 45,
    kinesthetic: 70,
    reading: 80,
    social: 35,
    solitary: 90,
    dominantStyle: "Solitary",
    confidence: 89,
  },
  {
    studentId: "ST005",
    studentName: "Sophie Brown",
    avatar: "SB",
    visual: 90,
    auditory: 75,
    kinesthetic: 65,
    reading: 95,
    social: 70,
    solitary: 80,
    dominantStyle: "Reading/Writing",
    confidence: 96,
  },
];

const mockEngagementData: EngagementMetrics[] = [
  {
    date: "Mon",
    classAttention: 78,
    participation: 65,
    taskCompletion: 82,
    collaboration: 70,
    focusDuration: 45,
    interactions: 24,
  },
  {
    date: "Tue",
    classAttention: 82,
    participation: 72,
    taskCompletion: 85,
    collaboration: 75,
    focusDuration: 52,
    interactions: 28,
  },
  {
    date: "Wed",
    classAttention: 75,
    participation: 68,
    taskCompletion: 78,
    collaboration: 68,
    focusDuration: 48,
    interactions: 22,
  },
  {
    date: "Thu",
    classAttention: 85,
    participation: 78,
    taskCompletion: 88,
    collaboration: 80,
    focusDuration: 55,
    interactions: 32,
  },
  {
    date: "Fri",
    classAttention: 80,
    participation: 75,
    taskCompletion: 86,
    collaboration: 77,
    focusDuration: 50,
    interactions: 30,
  },
];

const mockRiskAlerts: RiskAlert[] = [
  {
    id: "1",
    studentId: "ST004",
    studentName: "Tyler Williams",
    type: "absence",
    severity: "critical",
    description: "Absent 8 days in the last 2 weeks",
    timestamp: "2 days ago",
    acknowledged: false,
    recommendedAction: "Schedule parent conference immediately",
  },
  {
    id: "2",
    studentId: "ST002",
    studentName: "Jordan Smith",
    type: "decline",
    severity: "high",
    description: "Homework completion dropped from 75% to 38%",
    timestamp: "3 days ago",
    acknowledged: false,
    recommendedAction: "Academic support intervention",
  },
  {
    id: "3",
    studentId: "ST006",
    studentName: "David Kim",
    type: "conflict",
    severity: "medium",
    description: "3 conflict incidents reported this week",
    timestamp: "Yesterday",
    acknowledged: true,
    recommendedAction: "Counselor meeting scheduled",
  },
  {
    id: "4",
    studentId: "ST007",
    studentName: "Emma Wilson",
    type: "isolation",
    severity: "medium",
    description: "Reduced social interaction over past month",
    timestamp: "4 days ago",
    acknowledged: false,
    recommendedAction: "Peer buddy program enrollment",
  },
];

const mockPositiveReinforcements: PositiveReinforcement[] = [
  {
    id: "1",
    studentId: "ST005",
    studentName: "Sophie Brown",
    avatar: "SB",
    type: "Academic Excellence",
    points: 50,
    badge: "Star Scholar",
    timestamp: "Today",
    teacher: "Ms. Johnson",
    category: "academic",
  },
  {
    id: "2",
    studentId: "ST003",
    studentName: "Maria Garcia",
    avatar: "MG",
    type: "Helping Classmates",
    points: 30,
    badge: "Kindness Champion",
    timestamp: "Yesterday",
    teacher: "Mr. Davis",
    category: "social",
  },
  {
    id: "3",
    studentId: "ST001",
    studentName: "Alex Chen",
    avatar: "AC",
    type: "Perfect Attendance",
    points: 25,
    badge: "Reliable Rockstar",
    timestamp: "2 days ago",
    teacher: "Ms. Johnson",
    category: "behavioral",
  },
  {
    id: "4",
    studentId: "ST008",
    studentName: "Lucas Martinez",
    avatar: "LM",
    type: "Improvement",
    points: 40,
    badge: "Growth Mindset",
    timestamp: "Today",
    teacher: "Ms. Chen",
    category: "effort",
  },
  {
    id: "5",
    studentId: "ST009",
    studentName: "Zoe Anderson",
    avatar: "ZA",
    type: "Leadership",
    points: 35,
    badge: "Team Leader",
    timestamp: "Yesterday",
    teacher: "Mr. Brown",
    category: "social",
  },
  {
    id: "6",
    studentId: "ST010",
    studentName: "Ryan Lee",
    avatar: "RL",
    type: "Creative Thinking",
    points: 45,
    badge: "Innovator",
    timestamp: "Today",
    teacher: "Ms. Johnson",
    category: "academic",
  },
];

const mockCohortComparisons: CohortComparison[] = [
  {
    cohort: "9th Grade",
    size: 142,
    avgEngagement: 78,
    avgAttention: 72,
    behaviorScore: 82,
    improvementRate: 15,
    riskStudents: 18,
    highPerformers: 32,
  },
  {
    cohort: "10th Grade",
    size: 138,
    avgEngagement: 82,
    avgAttention: 76,
    behaviorScore: 85,
    improvementRate: 12,
    riskStudents: 14,
    highPerformers: 38,
  },
  {
    cohort: "11th Grade",
    size: 145,
    avgEngagement: 75,
    avgAttention: 70,
    behaviorScore: 80,
    improvementRate: 8,
    riskStudents: 22,
    highPerformers: 28,
  },
  {
    cohort: "12th Grade",
    size: 140,
    avgEngagement: 85,
    avgAttention: 82,
    behaviorScore: 88,
    improvementRate: 10,
    riskStudents: 10,
    highPerformers: 45,
  },
];

const mockPredictiveInsights: PredictiveInsight[] = [
  {
    metric: "Class Engagement",
    current: 78,
    predicted: 85,
    confidence: 88,
    trend: "up",
    timeframe: "Next Month",
    factors: [
      "New teaching methods",
      "Peer mentoring program",
      "Gamification elements",
    ],
  },
  {
    metric: "Behavioral Incidents",
    current: 24,
    predicted: 18,
    confidence: 82,
    trend: "down",
    timeframe: "Next Month",
    factors: [
      "Early warning system",
      "Counselor availability",
      "Restorative practices",
    ],
  },
  {
    metric: "At-Risk Students",
    current: 64,
    predicted: 52,
    confidence: 79,
    trend: "down",
    timeframe: "Next Quarter",
    factors: ["Intervention programs", "Family engagement", "Academic support"],
  },
  {
    metric: "Positive Reinforcements",
    current: 180,
    predicted: 245,
    confidence: 91,
    trend: "up",
    timeframe: "Next Month",
    factors: ["Points system launch", "Badge program", "Peer recognition"],
  },
];

const mockHeatmapData: HeatmapData[] = [
  { hour: "8 AM", day: "Mon", value: 85, activity: "High Focus" },
  { hour: "8 AM", day: "Tue", value: 82, activity: "High Focus" },
  { hour: "8 AM", day: "Wed", value: 78, activity: "Medium Focus" },
  { hour: "8 AM", day: "Thu", value: 88, activity: "High Focus" },
  { hour: "8 AM", day: "Fri", value: 80, activity: "Medium Focus" },
  { hour: "10 AM", day: "Mon", value: 75, activity: "Medium Focus" },
  { hour: "10 AM", day: "Tue", value: 79, activity: "Medium Focus" },
  { hour: "10 AM", day: "Wed", value: 72, activity: "Medium Focus" },
  { hour: "10 AM", day: "Thu", value: 81, activity: "High Focus" },
  { hour: "10 AM", day: "Fri", value: 77, activity: "Medium Focus" },
  { hour: "12 PM", day: "Mon", value: 65, activity: "Low Focus" },
  { hour: "12 PM", day: "Tue", value: 68, activity: "Medium Focus" },
  { hour: "12 PM", day: "Wed", value: 62, activity: "Low Focus" },
  { hour: "12 PM", day: "Thu", value: 70, activity: "Medium Focus" },
  { hour: "12 PM", day: "Fri", value: 66, activity: "Low Focus" },
  { hour: "2 PM", day: "Mon", value: 72, activity: "Medium Focus" },
  { hour: "2 PM", day: "Tue", value: 75, activity: "Medium Focus" },
  { hour: "2 PM", day: "Wed", value: 70, activity: "Medium Focus" },
  { hour: "2 PM", day: "Thu", value: 78, activity: "Medium Focus" },
  { hour: "2 PM", day: "Fri", value: 74, activity: "Medium Focus" },
];

const trendData = [
  { month: "Aug", positive: 82, negative: 18, neutral: 45 },
  { month: "Sep", positive: 80, negative: 20, neutral: 42 },
  { month: "Oct", positive: 83, negative: 17, neutral: 48 },
  { month: "Nov", positive: 85, negative: 15, neutral: 52 },
  { month: "Dec", positive: 87, negative: 13, neutral: 55 },
  { month: "Jan", positive: 84, negative: 16, neutral: 50 },
  { month: "Feb", positive: 88, negative: 12, neutral: 58 },
];

// Utility Functions
const getRiskColor = (level: string) => {
  switch (level) {
    case "critical":
      return "text-rose-400 bg-rose-400/10 border-rose-400/20";
    case "high":
      return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    case "medium":
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "low":
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    default:
      return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-emerald-400" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-rose-400" />;
    default:
      return (
        <div className="flex h-4 w-4 items-center justify-center text-slate-400">
          —
        </div>
      );
  }
};

const getHeatmapColor = (value: number) => {
  if (value >= 85) return "bg-emerald-500";
  if (value >= 75) return "bg-emerald-400";
  if (value >= 65) return "bg-amber-400";
  if (value >= 55) return "bg-orange-400";
  return "bg-rose-400";
};

const getLearningStyleIcon = (style: string) => {
  switch (style) {
    case "Visual":
      return <Eye className="h-4 w-4" />;
    case "Auditory":
      return <Mic className="h-4 w-4" />;
    case "Kinesthetic":
      return <Activity className="h-4 w-4" />;
    case "Reading/Writing":
      return <BookOpen className="h-4 w-4" />;
    case "Social":
      return <Users className="h-4 w-4" />;
    case "Solitary":
      return <Focus className="h-4 w-4" />;
    default:
      return <Brain className="h-4 w-4" />;
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case "disruptive":
      return <Flame className="h-4 w-4" />;
    case "absence":
      return <Clock className="h-4 w-4" />;
    case "decline":
      return <TrendingDown className="h-4 w-4" />;
    case "isolation":
      return <UserCheck className="h-4 w-4" />;
    case "conflict":
      return <Shield className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getBadgeColor = (category: string) => {
  switch (category) {
    case "academic":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "behavioral":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "social":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "effort":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }
};

// Animated Components
const AnimatedCard = ({
  children,
  className = "",
  delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl ${className}`}
  >
    {children}
  </motion.div>
);

const StatCard = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  delay = 0,
  color = "indigo",
}: any) => (
  <AnimatedCard className="p-6" delay={delay}>
    <div className="flex items-start justify-between">
      <div>
        <p className="mb-1 font-medium text-slate-400 text-sm">{title}</p>
        <p className="font-bold text-3xl text-white">{value}</p>
        <p className="mt-1 text-slate-500 text-sm">{subtitle}</p>
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            {getTrendIcon(trend)}
            <span
              className={`font-medium text-sm ${trend === "up" ? "text-emerald-400" : "text-rose-400"}`}
            >
              {trendValue}
            </span>
          </div>
        )}
      </div>
      <div
        className={`rounded-xl p-3 bg-${color}-500/10 border border-${color}-500/20`}
      >
        <Icon className={`h-6 w-6 text-${color}-400`} />
      </div>
    </div>
  </AnimatedCard>
);

// Dashboard Components
const BehaviorPatternAnalysis = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  return (
    <AnimatedCard className="col-span-2" delay={0.1}>
      <div className="border-slate-800 border-b p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-2">
              <Activity className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">
                Behavior Pattern Analysis
              </h3>
              <p className="text-slate-400 text-sm">
                Real-time behavioral tracking and pattern recognition
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-slate-400 text-sm transition-colors hover:text-white">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search students..."
                className="rounded-lg border border-slate-700 bg-slate-800/50 py-1.5 pr-4 pl-10 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-800">
        {mockBehaviorPatterns.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className={`cursor-pointer p-4 transition-colors ${selectedStudent === student.id ? "bg-slate-800/50" : "hover:bg-slate-800/30"}`}
            onClick={() =>
              setSelectedStudent(
                selectedStudent === student.id ? null : student.id,
              )
            }
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-semibold text-white">
                {student.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-white">
                    {student.studentName}
                  </h4>
                  <span
                    className={`flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium text-xs ${getRiskColor(student.riskLevel)}`}
                  >
                    {student.riskLevel === "low" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    {student.riskLevel.charAt(0).toUpperCase() +
                      student.riskLevel.slice(1)}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{student.grade}</p>
              </div>
              <div className="text-right">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-bold text-2xl text-white">
                    {student.overallScore}
                  </span>
                  <span className="text-slate-400 text-sm">/100</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Activity className="h-3 w-3" />
                  Behavior Score
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-slate-500 transition-transform ${selectedStudent === student.id ? "rotate-90" : ""}`}
              />
            </div>

            <AnimatePresence>
              {selectedStudent === student.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 border-slate-700/50 border-t pt-4"
                >
                  <div className="grid grid-cols-3 gap-4">
                    {student.patterns.map((pattern, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-slate-300 text-sm">
                            {pattern.category}
                          </span>
                          {getTrendIcon(pattern.trend)}
                        </div>
                        <div className="flex items-end justify-between">
                          <span
                            className={`font-bold text-2xl ${pattern.frequency >= 70 ? "text-emerald-400" : pattern.frequency >= 50 ? "text-amber-400" : "text-rose-400"}`}
                          >
                            {pattern.frequency}%
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${pattern.severity === "high" ? "bg-rose-500/20 text-rose-400" : pattern.severity === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}
                          >
                            {pattern.severity}
                          </span>
                        </div>
                        <p className="mt-2 text-slate-500 text-xs">
                          Last: {pattern.lastOccurrence}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex items-center gap-2 rounded-lg bg-indigo-500/20 px-4 py-2 text-indigo-400 text-sm transition-colors hover:bg-indigo-500/30">
                      <BarChart3 className="h-4 w-4" />
                      Detailed Report
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-slate-700/50 px-4 py-2 text-slate-300 text-sm transition-colors hover:bg-slate-700 hover:text-white">
                      <MessageCircle className="h-4 w-4" />
                      Send Feedback
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </AnimatedCard>
  );
};

const LearningStyleIdentification = () => {
  const [selectedStyle, setSelectedStyle] = useState<LearningStyle | null>(
    null,
  );

  const radarData = selectedStyle
    ? [
        { subject: "Visual", A: selectedStyle.visual, fullMark: 100 },
        { subject: "Auditory", A: selectedStyle.auditory, fullMark: 100 },
        { subject: "Kinesthetic", A: selectedStyle.kinesthetic, fullMark: 100 },
        { subject: "Reading", A: selectedStyle.reading, fullMark: 100 },
        { subject: "Social", A: selectedStyle.social, fullMark: 100 },
        { subject: "Solitary", A: selectedStyle.solitary, fullMark: 100 },
      ]
    : [];

  const styleDistribution = [
    { name: "Visual", value: 28, color: "#6366f1" },
    { name: "Auditory", value: 22, color: "#8b5cf6" },
    { name: "Kinesthetic", value: 18, color: "#ec4899" },
    { name: "Reading/Writing", value: 15, color: "#10b981" },
    { name: "Social", value: 12, color: "#f59e0b" },
    { name: "Solitary", value: 5, color: "#64748b" },
  ];

  return (
    <AnimatedCard className="p-6" delay={0.2}>
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-2">
          <Brain className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white">
            Learning Style Identification
          </h3>
          <p className="text-slate-400 text-sm">
            AI-powered learning preference analysis
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={styleDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {styleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#e2e8f0" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {styleDistribution.map((style, index) => (
            <motion.div
              key={style.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-slate-800/50"
              onClick={() =>
                setSelectedStyle(mockLearningStyles[index] || null)
              }
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: style.color }}
                />
                <span className="text-slate-300 text-sm">{style.name}</span>
              </div>
              <span className="font-medium text-sm text-white">
                {style.value}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-slate-800 border-t pt-4">
        <h4 className="mb-3 font-medium text-slate-300 text-sm">
          Student Profiles
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {mockLearningStyles.map((student, index) => (
            <motion.div
              key={student.studentId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`cursor-pointer rounded-xl border p-3 transition-all ${selectedStyle?.studentId === student.studentId ? "border-violet-500/50 bg-violet-500/20" : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600"}`}
              onClick={() =>
                setSelectedStyle(
                  selectedStyle?.studentId === student.studentId
                    ? null
                    : student,
                )
              }
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-500 font-semibold text-sm text-white">
                {student.avatar}
              </div>
              <p className="truncate text-center font-medium text-white text-xs">
                {student.studentName}
              </p>
              <div className="mt-2 flex items-center justify-center gap-1">
                {getLearningStyleIcon(student.dominantStyle)}
                <span className="text-violet-400 text-xs">
                  {student.dominantStyle}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedStyle && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-500 font-semibold text-white">
                {selectedStyle.avatar}
              </div>
              <div>
                <h4 className="font-medium text-white">
                  {selectedStyle.studentName}
                </h4>
                <p className="text-slate-400 text-sm">
                  Dominant: {selectedStyle.dominantStyle}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-2xl text-violet-400">
                {selectedStyle.confidence}%
              </p>
              <p className="text-slate-500 text-xs">Confidence</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar
                  name={selectedStyle.studentName}
                  dataKey="A"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </AnimatedCard>
  );
};

const EngagementMetricsPanel = () => (
  <AnimatedCard className="p-6" delay={0.3}>
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2">
          <Target className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white">
            Engagement & Attention
          </h3>
          <p className="text-slate-400 text-sm">Real-time classroom metrics</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-emerald-400 text-sm">
        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        Live Tracking
      </div>
    </div>

    <div className="mb-4 h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockEngagementData}>
          <defs>
            <linearGradient id="colorAttention" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorParticipation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#e2e8f0" }}
          />
          <Area
            type="monotone"
            dataKey="classAttention"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorAttention)"
            name="Attention"
          />
          <Area
            type="monotone"
            dataKey="participation"
            stroke="#6366f1"
            fillOpacity={1}
            fill="url(#colorParticipation)"
            name="Participation"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Eye className="h-4 w-4 text-emerald-400" />
          <span className="text-slate-400 text-xs">Avg Attention</span>
        </div>
        <p className="font-bold text-2xl text-white">80%</p>
        <p className="text-emerald-400 text-xs">+5% from last week</p>
      </div>
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-400" />
          <span className="text-slate-400 text-xs">Participation</span>
        </div>
        <p className="font-bold text-2xl text-white">72%</p>
        <p className="text-indigo-400 text-xs">+8% from last week</p>
      </div>
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-400" />
          <span className="text-slate-400 text-xs">Focus Duration</span>
        </div>
        <p className="font-bold text-2xl text-white">50m</p>
        <p className="text-amber-400 text-xs">+12m from last week</p>
      </div>
    </div>
  </AnimatedCard>
);

const RiskBehaviorAlerts = () => {
  const [alerts, setAlerts] = useState(mockRiskAlerts);
  const [filter, setFilter] = useState<"all" | "unacknowledged">("all");

  const filteredAlerts = alerts.filter(
    (alert) => filter === "all" || !alert.acknowledged,
  );

  const acknowledgeAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, acknowledged: true } : alert,
      ),
    );
  };

  return (
    <AnimatedCard className="p-6" delay={0.4}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">
              Risk Behavior Alerts
            </h3>
            <p className="text-slate-400 text-sm">
              Early warning system notifications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 font-medium text-sm transition-colors ${filter === "all" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unacknowledged")}
            className={`rounded-lg px-3 py-1.5 font-medium text-sm transition-colors ${filter === "unacknowledged" ? "bg-rose-500/20 text-rose-400" : "text-slate-400 hover:text-white"}`}
          >
            Unacknowledged
          </button>
        </div>
      </div>

      <div className="max-h-80 space-y-3 overflow-y-auto">
        {filteredAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl border p-4 ${alert.acknowledged ? "border-slate-700/30 bg-slate-800/30" : "border-slate-700/50 bg-slate-800/50"}`}
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-lg p-2 ${alert.severity === "critical" ? "bg-rose-500/20 text-rose-400" : alert.severity === "high" ? "bg-orange-500/20 text-orange-400" : "bg-amber-500/20 text-amber-400"}`}
                >
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white">
                    {alert.studentName}
                  </h4>
                  <p className="text-slate-400 text-xs">{alert.timestamp}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 font-medium text-xs ${alert.severity === "critical" ? "bg-rose-500/20 text-rose-400" : alert.severity === "high" ? "bg-orange-500/20 text-orange-400" : "bg-amber-500/20 text-amber-400"}`}
              >
                {alert.severity}
              </span>
            </div>
            <p className="mb-3 text-slate-300 text-sm">{alert.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-xs">
                <span className="text-indigo-400">Action:</span>{" "}
                {alert.recommendedAction}
              </p>
              {!alert.acknowledged && (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="rounded-lg bg-indigo-500/20 px-3 py-1.5 text-indigo-400 text-xs transition-colors hover:bg-indigo-500/30"
                >
                  Acknowledge
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedCard>
  );
};

const PositiveReinforcementTracking = () => (
  <AnimatedCard className="p-6" delay={0.5}>
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2">
          <ThumbsUp className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white">
            Positive Behavior Tracking
          </h3>
          <p className="text-slate-400 text-sm">
            Recognition and rewards system
          </p>
        </div>
      </div>
      <button className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-indigo-600">
        <Plus className="h-4 w-4" />
        Award Points
      </button>
    </div>

    <div className="max-h-80 space-y-3 overflow-y-auto">
      {mockPositiveReinforcements.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-colors hover:border-slate-600"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 font-semibold text-sm text-white">
              {item.avatar}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h4 className="font-medium text-sm text-white">
                  {item.studentName}
                </h4>
                <span
                  className={`rounded-full border px-2 py-0.5 font-medium text-xs ${getBadgeColor(item.category)}`}
                >
                  {item.category}
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                {item.type} • {item.timestamp} • {item.teacher}
              </p>
            </div>
            <div className="text-right">
              <div className="mb-1 flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="font-bold text-amber-400 text-xl">
                  +{item.points}
                </span>
              </div>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-400 text-xs">
                {item.badge}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="mt-4 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="h-5 w-5 text-amber-400" />
          <div>
            <h4 className="font-medium text-sm text-white">
              Total Points Awarded Today
            </h4>
            <p className="text-slate-400 text-xs">Across all students</p>
          </div>
        </div>
        <p className="font-bold text-3xl text-amber-400">245</p>
      </div>
    </div>
  </AnimatedCard>
);

const CohortComparisonAnalytics = () => {
  const [selectedMetric, setSelectedMetric] = useState<
    "engagement" | "attention" | "behavior"
  >("engagement");

  const data = mockCohortComparisons.map((c) => ({
    cohort: c.cohort,
    value:
      selectedMetric === "engagement"
        ? c.avgEngagement
        : selectedMetric === "attention"
          ? c.avgAttention
          : c.behaviorScore,
  }));

  return (
    <AnimatedCard className="p-6" delay={0.6}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">
            <GitBranch className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">
              Cohort Comparison
            </h3>
            <p className="text-slate-400 text-sm">
              Cross-grade behavioral analytics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(["engagement", "attention", "behavior"] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`rounded-lg px-3 py-1.5 font-medium text-sm capitalize transition-colors ${selectedMetric === metric ? "bg-blue-500/20 text-blue-400" : "text-slate-400 hover:text-white"}`}
            >
              {metric}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={12}
              domain={[0, 100]}
            />
            <YAxis
              dataKey="cohort"
              type="category"
              stroke="#94a3b8"
              fontSize={12}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#e2e8f0" }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {mockCohortComparisons.map((cohort, index) => (
          <motion.div
            key={cohort.cohort}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-3"
          >
            <h4 className="mb-2 font-medium text-sm text-white">
              {cohort.cohort}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Students</span>
                <span className="text-white">{cohort.size}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Risk</span>
                <span className="text-rose-400">{cohort.riskStudents}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Top</span>
                <span className="text-emerald-400">
                  {cohort.highPerformers}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedCard>
  );
};

const PredictiveModelingViz = () => (
  <AnimatedCard className="p-6" delay={0.7}>
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-2">
          <Brain className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white">
            Predictive Modeling
          </h3>
          <p className="text-slate-400 text-sm">
            AI-powered behavior forecasting
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-purple-400 text-sm">
        <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
        Model Active
      </div>
    </div>

    <div className="mb-6 grid grid-cols-2 gap-4">
      {mockPredictiveInsights.map((insight, index) => (
        <motion.div
          key={insight.metric}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-slate-300 text-sm">
              {insight.metric}
            </h4>
            {getTrendIcon(insight.trend)}
          </div>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="font-bold text-3xl text-white">
                {insight.predicted}
              </p>
              <p className="text-slate-500 text-xs">Predicted</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-lg text-slate-400">
                {insight.current}
              </p>
              <p className="text-slate-500 text-xs">Current</p>
            </div>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${insight.confidence}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
            <span className="text-purple-400 text-xs">
              {insight.confidence}%
            </span>
          </div>
          <p className="text-slate-500 text-xs">{insight.timeframe}</p>
        </motion.div>
      ))}
    </div>

    <div className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-5 w-5 text-purple-400" />
        <div>
          <h4 className="font-medium text-sm text-white">Model Insights</h4>
          <p className="mt-1 text-slate-400 text-sm">
            Based on historical patterns, engagement is predicted to increase by
            7% next month with the implementation of gamification elements and
            peer mentoring. Early intervention programs show 85% effectiveness
            in reducing at-risk behaviors.
          </p>
        </div>
      </div>
    </div>
  </AnimatedCard>
);

const HeatmapAndTrendAnalysis = () => (
  <AnimatedCard className="p-6" delay={0.8}>
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-pink-500/20 bg-pink-500/10 p-2">
          <MapPin className="h-5 w-5 text-pink-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white">
            Activity Heatmap & Trends
          </h3>
          <p className="text-slate-400 text-sm">
            Time-based behavior intensity analysis
          </p>
        </div>
      </div>
    </div>

    <div className="mb-6">
      <h4 className="mb-3 font-medium text-slate-300 text-sm">
        Weekly Engagement Heatmap
      </h4>
      <div className="grid grid-cols-6 gap-1">
        <div className="text-center text-slate-500 text-xs"></div>
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
          <div key={day} className="py-2 text-center text-slate-400 text-xs">
            {day}
          </div>
        ))}
        {["8 AM", "10 AM", "12 PM", "2 PM"].map((hour) => (
          <React.Fragment key={hour}>
            <div className="py-3 text-slate-400 text-xs">{hour}</div>
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
              const data = mockHeatmapData.find(
                (d) => d.hour === hour && d.day === day,
              );
              return (
                <motion.div
                  key={`${hour}-${day}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`h-10 rounded-md ${getHeatmapColor(data?.value || 50)} cursor-pointer transition-all hover:ring-2 hover:ring-white/50`}
                  title={`${hour} ${day}: ${data?.value}% ${data?.activity}`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-rose-400" />
          <span className="text-slate-400 text-xs">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-amber-400" />
          <span className="text-slate-400 text-xs">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-emerald-400" />
          <span className="text-slate-400 text-xs">High</span>
        </div>
      </div>
    </div>

    <div>
      <h4 className="mb-3 font-medium text-slate-300 text-sm">
        Behavior Trend Analysis
      </h4>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#e2e8f0" }}
            />
            <Line
              type="monotone"
              dataKey="positive"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981" }}
              name="Positive"
            />
            <Line
              type="monotone"
              dataKey="negative"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={{ fill: "#f43f5e" }}
              name="Negative"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="neutral"
              stroke="#64748b"
              strokeWidth={2}
              dot={{ fill: "#64748b" }}
              name="Neutral"
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </AnimatedCard>
);

// Filter Icon Component
const Filter = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

// Main Dashboard Component
export function BehavioralAnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 p-2">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-bold text-3xl text-white">
              Behavioral Analytics Dashboard
            </h1>
          </div>
          <p className="ml-[52px] text-slate-400">
            Comprehensive student behavior analysis, learning style
            identification, and predictive insights
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <StatCard
            title="Behavior Score Avg"
            value="72.3"
            subtitle="School-wide average"
            trend="up"
            trendValue="+4.2%"
            icon={Activity}
            delay={0}
            color="indigo"
          />
          <StatCard
            title="Active Monitoring"
            value="565"
            subtitle="Students tracked"
            trend="up"
            trendValue="+12"
            icon={Eye}
            delay={0.1}
            color="emerald"
          />
          <StatCard
            title="Risk Alerts"
            value="8"
            subtitle="Require attention"
            trend="down"
            trendValue="-3"
            icon={AlertTriangle}
            delay={0.2}
            color="rose"
          />
          <StatCard
            title="Positive Events"
            value="245"
            subtitle="Recognitions today"
            trend="up"
            trendValue="+18%"
            icon={ThumbsUp}
            delay={0.3}
            color="amber"
          />
        </div>

        {/* Main Grid */}
        <div className="mb-6 grid grid-cols-3 gap-6">
          <BehaviorPatternAnalysis />
          <LearningStyleIdentification />
        </div>

        {/* Middle Row */}
        <div className="mb-6 grid grid-cols-2 gap-6">
          <EngagementMetricsPanel />
          <RiskBehaviorAlerts />
        </div>

        {/* Lower Row */}
        <div className="mb-6 grid grid-cols-2 gap-6">
          <PositiveReinforcementTracking />
          <CohortComparisonAnalytics />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-6">
          <PredictiveModelingViz />
          <HeatmapAndTrendAnalysis />
        </div>
      </div>
    </div>
  );
}
