"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Award,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  Flag,
  GraduationCap,
  Heart,
  Home,
  Mail,
  MessageCircle,
  Phone,
  PhoneCall,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import React, { useState } from "react";

// Mock Data Types
interface RiskIndicator {
  id: string;
  name: string;
  value: number;
  trend: "up" | "down" | "stable";
  threshold: number;
  category: "attendance" | "grades" | "behavior" | "engagement";
}

interface AtRiskStudent {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  riskScore: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  confidence: number;
  indicators: RiskIndicator[];
  lastContact: string;
  counselor: string;
  interventions: number;
  familyEngagement: number;
}

interface Intervention {
  id: string;
  studentId: string;
  type: string;
  startDate: string;
  status: "active" | "completed" | "pending";
  effectiveness: number;
  notes: string;
  counselor: string;
}

interface CaseNote {
  id: string;
  studentId: string;
  date: string;
  counselor: string;
  content: string;
  type: "meeting" | "phone" | "email" | "note";
}

interface RetentionTrend {
  month: string;
  retentionRate: number;
  dropoutRisk: number;
  interventions: number;
}

// Mock Data
const mockAtRiskStudents: AtRiskStudent[] = [
  {
    id: "1",
    name: "Marcus Johnson",
    grade: "11th Grade",
    avatar: "MJ",
    riskScore: 87,
    riskLevel: "critical",
    confidence: 94,
    indicators: [
      {
        id: "1",
        name: "Attendance",
        value: 62,
        trend: "down",
        threshold: 80,
        category: "attendance",
      },
      {
        id: "2",
        name: "GPA",
        value: 1.8,
        trend: "down",
        threshold: 2.0,
        category: "grades",
      },
      {
        id: "3",
        name: "Behavior Incidents",
        value: 8,
        trend: "up",
        threshold: 3,
        category: "behavior",
      },
    ],
    lastContact: "2 days ago",
    counselor: "Dr. Sarah Chen",
    interventions: 3,
    familyEngagement: 45,
  },
  {
    id: "2",
    name: "Sofia Rodriguez",
    grade: "10th Grade",
    avatar: "SR",
    riskScore: 72,
    riskLevel: "high",
    confidence: 88,
    indicators: [
      {
        id: "1",
        name: "Attendance",
        value: 58,
        trend: "down",
        threshold: 80,
        category: "attendance",
      },
      {
        id: "2",
        name: "GPA",
        value: 2.4,
        trend: "stable",
        threshold: 2.0,
        category: "grades",
      },
      {
        id: "3",
        name: "Engagement",
        value: 45,
        trend: "down",
        threshold: 60,
        category: "engagement",
      },
    ],
    lastContact: "5 days ago",
    counselor: "Mr. James Wilson",
    interventions: 2,
    familyEngagement: 30,
  },
  {
    id: "3",
    name: "Aiden Park",
    grade: "12th Grade",
    avatar: "AP",
    riskScore: 68,
    riskLevel: "high",
    confidence: 85,
    indicators: [
      {
        id: "1",
        name: "Attendance",
        value: 75,
        trend: "stable",
        threshold: 80,
        category: "attendance",
      },
      {
        id: "2",
        name: "GPA",
        value: 1.9,
        trend: "down",
        threshold: 2.0,
        category: "grades",
      },
      {
        id: "3",
        name: "Behavior Incidents",
        value: 4,
        trend: "stable",
        threshold: 3,
        category: "behavior",
      },
    ],
    lastContact: "1 week ago",
    counselor: "Dr. Sarah Chen",
    interventions: 1,
    familyEngagement: 60,
  },
  {
    id: "4",
    name: "Emma Thompson",
    grade: "9th Grade",
    avatar: "ET",
    riskScore: 45,
    riskLevel: "medium",
    confidence: 76,
    indicators: [
      {
        id: "1",
        name: "Attendance",
        value: 82,
        trend: "down",
        threshold: 80,
        category: "attendance",
      },
      {
        id: "2",
        name: "GPA",
        value: 2.1,
        trend: "stable",
        threshold: 2.0,
        category: "grades",
      },
      {
        id: "3",
        name: "Engagement",
        value: 55,
        trend: "down",
        threshold: 60,
        category: "engagement",
      },
    ],
    lastContact: "3 days ago",
    counselor: "Ms. Lisa Martinez",
    interventions: 1,
    familyEngagement: 70,
  },
  {
    id: "5",
    name: "Liam O'Brien",
    grade: "11th Grade",
    avatar: "LO",
    riskScore: 38,
    riskLevel: "medium",
    confidence: 72,
    indicators: [
      {
        id: "1",
        name: "Attendance",
        value: 85,
        trend: "stable",
        threshold: 80,
        category: "attendance",
      },
      {
        id: "2",
        name: "GPA",
        value: 2.2,
        trend: "down",
        threshold: 2.0,
        category: "grades",
      },
      {
        id: "3",
        name: "Behavior Incidents",
        value: 2,
        trend: "stable",
        threshold: 3,
        category: "behavior",
      },
    ],
    lastContact: "4 days ago",
    counselor: "Mr. James Wilson",
    interventions: 0,
    familyEngagement: 80,
  },
  {
    id: "6",
    name: "Zara Hassan",
    grade: "10th Grade",
    avatar: "ZH",
    riskScore: 92,
    riskLevel: "critical",
    confidence: 96,
    indicators: [
      {
        id: "1",
        name: "Attendance",
        value: 45,
        trend: "down",
        threshold: 80,
        category: "attendance",
      },
      {
        id: "2",
        name: "GPA",
        value: 1.5,
        trend: "down",
        threshold: 2.0,
        category: "grades",
      },
      {
        id: "3",
        name: "Behavior Incidents",
        value: 12,
        trend: "up",
        threshold: 3,
        category: "behavior",
      },
    ],
    lastContact: "Yesterday",
    counselor: "Dr. Sarah Chen",
    interventions: 4,
    familyEngagement: 20,
  },
];

const mockInterventions: Intervention[] = [
  {
    id: "1",
    studentId: "1",
    type: "Academic Support",
    startDate: "2024-01-15",
    status: "active",
    effectiveness: 72,
    notes: "Tutoring sessions 3x/week. Showing improvement in math.",
    counselor: "Dr. Sarah Chen",
  },
  {
    id: "2",
    studentId: "1",
    type: "Family Meeting",
    startDate: "2024-01-20",
    status: "completed",
    effectiveness: 45,
    notes: "Parent attended. Discussed attendance concerns.",
    counselor: "Dr. Sarah Chen",
  },
  {
    id: "3",
    studentId: "2",
    type: "Counseling Sessions",
    startDate: "2024-02-01",
    status: "active",
    effectiveness: 60,
    notes: "Weekly check-ins. Addressing social anxiety.",
    counselor: "Mr. James Wilson",
  },
  {
    id: "4",
    studentId: "3",
    type: "Mentorship Program",
    startDate: "2024-01-10",
    status: "active",
    effectiveness: 65,
    notes: "Paired with senior mentor. Good rapport.",
    counselor: "Dr. Sarah Chen",
  },
  {
    id: "5",
    studentId: "6",
    type: "Crisis Intervention",
    startDate: "2024-02-15",
    status: "active",
    effectiveness: 40,
    notes: "Emergency family conference scheduled.",
    counselor: "Dr. Sarah Chen",
  },
  {
    id: "6",
    studentId: "6",
    type: "Attendance Contract",
    startDate: "2024-02-10",
    status: "active",
    effectiveness: 35,
    notes: "Signed by student and parent. Monitoring closely.",
    counselor: "Dr. Sarah Chen",
  },
];

const mockCaseNotes: CaseNote[] = [
  {
    id: "1",
    studentId: "1",
    date: "2024-02-20",
    counselor: "Dr. Sarah Chen",
    content:
      "Marcus attended tutoring today. He seemed more engaged and asked questions about quadratic equations. His tutor reports he's making progress but still needs consistent attendance to catch up.",
    type: "meeting",
  },
  {
    id: "2",
    studentId: "1",
    date: "2024-02-18",
    counselor: "Dr. Sarah Chen",
    content:
      "Spoke with Marcus's mother. She reports family issues at home affecting his focus. She's willing to attend a family conference next week.",
    type: "phone",
  },
  {
    id: "3",
    studentId: "2",
    date: "2024-02-19",
    counselor: "Mr. James Wilson",
    content:
      "Sofia missed her counseling session today. Called home but no answer. Will follow up tomorrow.",
    type: "note",
  },
];

const retentionTrends: RetentionTrend[] = [
  { month: "Aug", retentionRate: 96.2, dropoutRisk: 3.8, interventions: 12 },
  { month: "Sep", retentionRate: 95.8, dropoutRisk: 4.2, interventions: 18 },
  { month: "Oct", retentionRate: 95.1, dropoutRisk: 4.9, interventions: 24 },
  { month: "Nov", retentionRate: 94.5, dropoutRisk: 5.5, interventions: 31 },
  { month: "Dec", retentionRate: 94.2, dropoutRisk: 5.8, interventions: 28 },
  { month: "Jan", retentionRate: 93.8, dropoutRisk: 6.2, interventions: 35 },
  { month: "Feb", retentionRate: 93.5, dropoutRisk: 6.5, interventions: 42 },
];

// Utility functions
const getRiskLevelColor = (level: string) => {
  switch (level) {
    case "critical":
      return "text-rose-400 bg-rose-400/10 border-rose-400/20";
    case "high":
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "medium":
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    case "low":
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    default:
      return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  }
};

const getRiskLevelBadge = (level: string) => {
  switch (level) {
    case "critical":
      return <AlertOctagon className="h-4 w-4" />;
    case "high":
      return <AlertTriangle className="h-4 w-4" />;
    case "medium":
      return <AlertCircle className="h-4 w-4" />;
    case "low":
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-3 w-3 text-rose-400" />;
    case "down":
      return <TrendingDown className="h-3 w-3 text-emerald-400" />;
    default:
      return <div className="h-3 w-3 text-slate-400">—</div>;
  }
};

// Components
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
  trend,
  trendValue,
  icon: Icon,
  delay = 0,
}: {
  title: string;
  value: string;
  trend: "up" | "down";
  trendValue: string;
  icon: any;
  delay?: number;
}) => (
  <AnimatedCard className="p-6" delay={delay}>
    <div className="flex items-start justify-between">
      <div>
        <p className="mb-1 font-medium text-slate-400 text-sm">{title}</p>
        <p className="font-bold text-3xl text-white">{value}</p>
        <div className="mt-2 flex items-center gap-1">
          {trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-rose-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-emerald-400" />
          )}
          <span
            className={`font-medium text-sm ${trend === "up" ? "text-rose-400" : "text-emerald-400"}`}
          >
            {trendValue}
          </span>
          <span className="text-slate-500 text-sm">vs last month</span>
        </div>
      </div>
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3">
        <Icon className="h-6 w-6 text-indigo-400" />
      </div>
    </div>
  </AnimatedCard>
);

const MLModelInsights = () => (
  <AnimatedCard className="p-6" delay={0.1}>
    <div className="mb-6 flex items-center gap-3">
      <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-2">
        <Brain className="h-5 w-5 text-violet-400" />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-white">ML Model Insights</h3>
        <p className="text-slate-400 text-sm">
          Real-time predictions powered by AI
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2 text-emerald-400 text-sm">
        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        Live
      </div>
    </div>

    <div className="mb-6 grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
        <p className="mb-1 text-slate-400 text-sm">Model Accuracy</p>
        <p className="font-bold text-2xl text-white">94.2%</p>
        <div className="mt-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-amber-400 text-sm">High Confidence</span>
        </div>
      </div>
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
        <p className="mb-1 text-slate-400 text-sm">Predictions Today</p>
        <p className="font-bold text-2xl text-white">127</p>
        <div className="mt-2 flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-indigo-400" />
          <span className="text-indigo-400 text-sm">Updated hourly</span>
        </div>
      </div>
    </div>

    <div className="space-y-3">
      <h4 className="mb-3 font-medium text-slate-300 text-sm">
        Top Risk Factors
      </h4>
      {[
        { factor: "Chronic Absenteeism", weight: 0.34, impact: "High" },
        { factor: "Failing Grades", weight: 0.28, impact: "High" },
        { factor: "Behavioral Issues", weight: 0.18, impact: "Medium" },
        { factor: "Low Family Engagement", weight: 0.12, impact: "Medium" },
        { factor: "Course Difficulty", weight: 0.08, impact: "Low" },
      ].map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="w-6 text-slate-500 text-sm">{index + 1}</span>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-slate-300 text-sm">{item.factor}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${item.impact === "High" ? "bg-rose-500/20 text-rose-400" : item.impact === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-slate-500/20 text-slate-400"}`}
              >
                {item.impact}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.weight * 100}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
              />
            </div>
          </div>
          <span className="text-slate-400 text-sm">
            {(item.weight * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  </AnimatedCard>
);

const EarlyWarningSystem = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const warningCategories = [
    {
      id: "attendance",
      name: "Attendance Alerts",
      icon: Clock,
      color: "rose",
      alerts: 24,
      threshold: "Below 70%",
      students: ["Marcus Johnson", "Sofia Rodriguez", "Zara Hassan"],
    },
    {
      id: "grades",
      name: "Grade Warnings",
      icon: GraduationCap,
      color: "amber",
      alerts: 18,
      threshold: "GPA < 2.0",
      students: ["Aiden Park", "Zara Hassan", "Marcus Johnson"],
    },
    {
      id: "behavior",
      name: "Behavior Flags",
      icon: ShieldAlert,
      color: "violet",
      alerts: 12,
      threshold: "3+ Incidents",
      students: ["Zara Hassan", "Marcus Johnson"],
    },
    {
      id: "engagement",
      name: "Low Engagement",
      icon: Activity,
      color: "blue",
      alerts: 31,
      threshold: "Score < 50",
      students: ["Sofia Rodriguez", "Emma Thompson"],
    },
  ];

  return (
    <AnimatedCard className="p-6" delay={0.2}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">
              Early Warning System
            </h3>
            <p className="text-slate-400 text-sm">
              Real-time alerts across all indicators
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl text-white">85</span>
          <span className="text-slate-400 text-sm">total alerts</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {warningCategories.map((category, index) => {
          const Icon = category.icon;
          const isExpanded = expanded === category.id;

          return (
            <motion.div
              key={category.id}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
                isExpanded
                  ? "border-slate-600 bg-slate-800/80"
                  : "border-slate-700/50 bg-slate-800/40 hover:border-slate-600"
              }`}
              onClick={() => setExpanded(isExpanded ? null : category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div
                  className={`rounded-lg p-2 bg-${category.color}-500/10 border border-${category.color}-500/20`}
                >
                  <Icon className={`h-4 w-4 text-${category.color}-400`} />
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`font-bold text-lg text-${category.color}-400`}
                  >
                    {category.alerts}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
              <h4 className="mb-1 font-medium text-sm text-white">
                {category.name}
              </h4>
              <p className="text-slate-500 text-xs">{category.threshold}</p>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 border-slate-700/50 border-t pt-3"
                  >
                    <p className="mb-2 text-slate-400 text-xs">
                      Affected Students:
                    </p>
                    <div className="space-y-1">
                      {category.students.map((student, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-slate-300 text-sm"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                          {student}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </AnimatedCard>
  );
};

const AtRiskStudentsList = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium">(
    "all",
  );

  const filteredStudents = mockAtRiskStudents.filter((student) =>
    filter === "all" ? true : student.riskLevel === filter,
  );

  return (
    <AnimatedCard className="col-span-2" delay={0.3}>
      <div className="border-slate-800 border-b p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2">
              <Users className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">
                At-Risk Students
              </h3>
              <p className="text-slate-400 text-sm">
                Students identified by ML model with confidence scores
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1.5 font-medium text-sm transition-colors ${
                filter === "all"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("critical")}
              className={`rounded-lg px-3 py-1.5 font-medium text-sm transition-colors ${
                filter === "critical"
                  ? "bg-rose-500/20 text-rose-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilter("high")}
              className={`rounded-lg px-3 py-1.5 font-medium text-sm transition-colors ${
                filter === "high"
                  ? "bg-amber-500/20 text-amber-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              High
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-2 pr-4 pl-10 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2 text-slate-400 text-sm transition-colors hover:text-white">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-800">
        {filteredStudents.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className={`cursor-pointer p-4 transition-colors ${
              selectedStudent === student.id
                ? "bg-slate-800/50"
                : "hover:bg-slate-800/30"
            }`}
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
                  <h4 className="font-medium text-white">{student.name}</h4>
                  <span
                    className={`flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium text-xs ${getRiskLevelColor(student.riskLevel)}`}
                  >
                    {getRiskLevelBadge(student.riskLevel)}
                    {student.riskLevel.charAt(0).toUpperCase() +
                      student.riskLevel.slice(1)}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  {student.grade} • Counselor: {student.counselor}
                </p>
              </div>
              <div className="text-right">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-bold text-2xl text-white">
                    {student.riskScore}%
                  </span>
                  <span className="text-slate-400 text-sm">risk</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Brain className="h-3 w-3" />
                  {student.confidence}% confidence
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
                    <div>
                      <h5 className="mb-3 text-slate-400 text-xs uppercase tracking-wider">
                        Risk Indicators
                      </h5>
                      <div className="space-y-2">
                        {student.indicators.map((indicator) => (
                          <div
                            key={indicator.id}
                            className="flex items-center justify-between"
                          >
                            <span className="text-slate-300 text-sm">
                              {indicator.name}
                            </span>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(indicator.trend)}
                              <span className="font-medium text-sm text-white">
                                {indicator.value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-3 text-slate-400 text-xs uppercase tracking-wider">
                        Intervention Status
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">
                            Active Interventions
                          </span>
                          <span className="font-medium text-indigo-400 text-sm">
                            {student.interventions}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">
                            Last Contact
                          </span>
                          <span className="text-slate-400 text-sm">
                            {student.lastContact}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">
                            Family Engagement
                          </span>
                          <span
                            className={`font-medium text-sm ${student.familyEngagement < 40 ? "text-rose-400" : student.familyEngagement < 70 ? "text-amber-400" : "text-emerald-400"}`}
                          >
                            {student.familyEngagement}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-3 text-slate-400 text-xs uppercase tracking-wider">
                        Quick Actions
                      </h5>
                      <div className="space-y-2">
                        <button className="flex w-full items-center gap-2 rounded-lg bg-slate-700/50 px-3 py-2 text-slate-300 text-sm transition-colors hover:bg-slate-700 hover:text-white">
                          <MessageCircle className="h-4 w-4" />
                          Send Message
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-lg bg-slate-700/50 px-3 py-2 text-slate-300 text-sm transition-colors hover:bg-slate-700 hover:text-white">
                          <Phone className="h-4 w-4" />
                          Call Family
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-lg bg-indigo-500/20 px-3 py-2 text-indigo-400 text-sm transition-colors hover:bg-indigo-500/30">
                          <FileText className="h-4 w-4" />
                          Add Case Note
                        </button>
                      </div>
                    </div>
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

const InterventionTracking = () => (
  <AnimatedCard className="p-6" delay={0.4}>
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2">
          <Target className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white">
            Intervention Tracking
          </h3>
          <p className="text-slate-400 text-sm">
            Monitor progress and effectiveness
          </p>
        </div>
      </div>
      <button className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-indigo-600">
        + New Intervention
      </button>
    </div>

    <div className="space-y-3">
      {mockInterventions.map((intervention, index) => {
        const student = mockAtRiskStudents.find(
          (s) => s.id === intervention.studentId,
        );
        return (
          <motion.div
            key={intervention.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 transition-colors hover:border-slate-600"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-lg px-2 py-1 font-medium text-xs ${
                    intervention.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : intervention.status === "completed"
                        ? "bg-slate-500/20 text-slate-400"
                        : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {intervention.status.charAt(0).toUpperCase() +
                    intervention.status.slice(1)}
                </div>
                <span className="font-medium text-white">
                  {intervention.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Effectiveness:</span>
                <span
                  className={`font-medium ${
                    intervention.effectiveness >= 70
                      ? "text-emerald-400"
                      : intervention.effectiveness >= 50
                        ? "text-amber-400"
                        : "text-rose-400"
                  }`}
                >
                  {intervention.effectiveness}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-slate-400">
                  <span className="text-slate-500">Student:</span>{" "}
                  <span className="text-slate-300">{student?.name}</span>
                </span>
                <span className="text-slate-400">
                  <span className="text-slate-500">Started:</span>{" "}
                  <span className="text-slate-300">
                    {intervention.startDate}
                  </span>
                </span>
              </div>
              <span className="text-slate-500">{intervention.counselor}</span>
            </div>

            <p className="mt-3 text-slate-400 text-sm">{intervention.notes}</p>

            <div className="mt-3">
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${intervention.effectiveness}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className={`h-full rounded-full ${
                    intervention.effectiveness >= 70
                      ? "bg-emerald-500"
                      : intervention.effectiveness >= 50
                        ? "bg-amber-500"
                        : "bg-rose-500"
                  }`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </AnimatedCard>
);

const RetentionAnalytics = () => (
  <AnimatedCard className="p-6" delay={0.5}>
    <div className="mb-6 flex items-center gap-3">
      <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-2">
        <BarChart3 className="h-5 w-5 text-indigo-400" />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-white">
          Retention Analytics
        </h3>
        <p className="text-slate-400 text-sm">
          Year-over-year trends and predictions
        </p>
      </div>
    </div>

    <div className="relative mb-6 h-48">
      <svg
        className="h-full w-full"
        viewBox="0 0 400 150"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={150 - (y / 100) * 120}
            x2="400"
            y2={150 - (y / 100) * 120}
            stroke="rgba(51, 65, 85, 0.5)"
            strokeWidth="1"
          />
        ))}

        {/* Retention rate line */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d={`M 0 ${150 - (retentionTrends[0].retentionRate / 100) * 120} ${retentionTrends
            .map(
              (t, i) =>
                `L ${(i / (retentionTrends.length - 1)) * 400} ${150 - (t.retentionRate / 100) * 120}`,
            )
            .join(" ")}`}
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Dropout risk line */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          d={`M 0 ${150 - (retentionTrends[0].dropoutRisk / 20) * 120} ${retentionTrends
            .map(
              (t, i) =>
                `L ${(i / (retentionTrends.length - 1)) * 400} ${150 - (t.dropoutRisk / 20) * 120}`,
            )
            .join(" ")}`}
          fill="none"
          stroke="#f43f5e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="5,5"
        />

        {/* Data points */}
        {retentionTrends.map((trend, i) => (
          <g key={i}>
            <circle
              cx={(i / (retentionTrends.length - 1)) * 400}
              cy={150 - (trend.retentionRate / 100) * 120}
              r="4"
              fill="#6366f1"
            />
            <circle
              cx={(i / (retentionTrends.length - 1)) * 400}
              cy={150 - (trend.dropoutRisk / 20) * 120}
              r="4"
              fill="#f43f5e"
            />
          </g>
        ))}
      </svg>

      {/* Y-axis labels */}
      <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-between py-2 text-slate-500 text-xs">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>

      {/* X-axis labels */}
      <div className="absolute right-0 bottom-0 left-8 flex justify-between pt-2 text-slate-500 text-xs">
        {retentionTrends.map((t) => (
          <span key={t.month}>{t.month}</span>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
        <div className="mb-1 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-indigo-500" />
          <span className="text-slate-400 text-sm">Retention Rate</span>
        </div>
        <p className="font-bold text-white text-xl">93.5%</p>
        <p className="text-rose-400 text-xs">-2.7% from Aug</p>
      </div>
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
        <div className="mb-1 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500" />
          <span className="text-slate-400 text-sm">Dropout Risk</span>
        </div>
        <p className="font-bold text-white text-xl">6.5%</p>
        <p className="text-rose-400 text-xs">+2.7% from Aug</p>
      </div>
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
        <div className="mb-1 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <span className="text-slate-400 text-sm">Interventions</span>
        </div>
        <p className="font-bold text-white text-xl">42</p>
        <p className="text-emerald-400 text-xs">+20% this month</p>
      </div>
    </div>

    <div className="mt-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 p-4">
      <div className="flex items-start gap-3">
        <Brain className="mt-0.5 h-5 w-5 text-indigo-400" />
        <div>
          <h4 className="font-medium text-sm text-white">ML Prediction</h4>
          <p className="mt-1 text-slate-400 text-sm">
            Based on current trends, retention rate is projected to stabilize at
            92-93% by end of semester. Recommended action: Increase family
            engagement interventions for high-risk students.
          </p>
        </div>
      </div>
    </div>
  </AnimatedCard>
);

const CaseManagement = () => (
  <AnimatedCard className="p-6" delay={0.6}>
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2">
          <FileText className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white">Case Management</h3>
          <p className="text-slate-400 text-sm">Counselor notes and meetings</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-400 text-sm">Active Cases:</span>
        <span className="font-bold text-2xl text-white">24</span>
      </div>
    </div>

    <div className="space-y-4">
      {mockCaseNotes.map((note, index) => {
        const student = mockAtRiskStudents.find((s) => s.id === note.studentId);
        const icons = {
          meeting: Calendar,
          phone: PhoneCall,
          email: Mail,
          note: FileText,
        };
        const Icon = icons[note.type];

        return (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-slate-700/50 p-2">
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      {student?.name}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 text-sm capitalize">
                      {note.type}
                    </span>
                  </div>
                  <span className="text-slate-500 text-sm">{note.date}</span>
                </div>
                <p className="text-slate-400 text-sm">{note.content}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-slate-500 text-xs">
                    By {note.counselor}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>

    <button className="mt-4 w-full rounded-xl border border-slate-700 border-dashed py-3 font-medium text-slate-500 text-sm transition-colors hover:border-slate-600 hover:text-slate-300">
      View All Case Notes
    </button>
  </AnimatedCard>
);

const FamilyEngagement = () => {
  const engagementMetrics = [
    { label: "Response Rate", value: 68, target: 80, icon: Mail },
    { label: "Meeting Attendance", value: 52, target: 75, icon: Users },
    { label: "Phone Contact", value: 84, target: 90, icon: Phone },
    { label: "Home Visits", value: 23, target: 40, icon: Home },
  ];

  return (
    <AnimatedCard className="p-6" delay={0.7}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2">
            <Heart className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">
              Family Engagement
            </h3>
            <p className="text-slate-400 text-sm">
              Metrics and communication tracking
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-400" />
          <span className="font-bold text-lg text-white">58%</span>
          <span className="text-slate-400 text-sm">overall</span>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        {engagementMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const percentage = (metric.value / metric.target) * 100;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-300 text-sm">{metric.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">
                    {metric.value}%
                  </span>
                  <span className="text-slate-500 text-sm">
                    / {metric.target}% target
                  </span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  className={`h-full rounded-full ${
                    percentage >= 90
                      ? "bg-emerald-500"
                      : percentage >= 70
                        ? "bg-amber-500"
                        : "bg-rose-500"
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-xl border border-rose-500/20 bg-gradient-to-r from-rose-500/10 to-orange-500/10 p-4">
        <div className="flex items-start gap-3">
          <Flag className="mt-0.5 h-5 w-5 text-rose-400" />
          <div>
            <h4 className="font-medium text-sm text-white">Engagement Alert</h4>
            <p className="mt-1 text-slate-400 text-sm">
              12 at-risk students have family engagement scores below 30%.
              Priority outreach recommended for Marcus Johnson and Zara Hassan.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-800/50 p-3 text-slate-300 text-sm transition-colors hover:bg-slate-800">
          <Phone className="h-4 w-4" />
          Bulk Call
        </button>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-800/50 p-3 text-slate-300 text-sm transition-colors hover:bg-slate-800">
          <Mail className="h-4 w-4" />
          Send Update
        </button>
      </div>
    </AnimatedCard>
  );
};

// Main Component
export function PredictiveDropoutPrevention() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[600px] w-[600px] rounded-full bg-rose-500/5 blur-3xl" />
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
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-bold text-3xl text-white">
              Predictive Dropout Prevention
            </h1>
          </div>
          <p className="ml-[52px] text-slate-400">
            AI-powered early warning system to identify and support at-risk
            students
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <StatCard
            title="At-Risk Students"
            value="47"
            trend="up"
            trendValue="+12%"
            icon={AlertTriangle}
            delay={0}
          />
          <StatCard
            title="Active Interventions"
            value="124"
            trend="up"
            trendValue="+8%"
            icon={Target}
            delay={0.1}
          />
          <StatCard
            title="Model Accuracy"
            value="94.2%"
            trend="up"
            trendValue="+2.1%"
            icon={Brain}
            delay={0.2}
          />
          <StatCard
            title="Students Saved"
            value="31"
            trend="up"
            trendValue="+15%"
            icon={UserCheck}
            delay={0.3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="mb-6 grid grid-cols-3 gap-6">
          <MLModelInsights />
          <EarlyWarningSystem />
          <RetentionAnalytics />
        </div>

        {/* At-Risk Students & Interventions */}
        <div className="mb-6 grid grid-cols-3 gap-6">
          <AtRiskStudentsList />
          <InterventionTracking />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-6">
          <CaseManagement />
          <FamilyEngagement />
        </div>
      </div>
    </div>
  );
}
