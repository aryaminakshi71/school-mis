import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Brain,
  Clock,
  Eye,
  Fingerprint,
  Gauge,
  Lightbulb,
  RefreshCw,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";

export type AttentionLevel =
  | "high"
  | "medium"
  | "low"
  | "distracted"
  | "fatigued";
export type LearningMode = "visual" | "auditory" | "kinesthetic" | "reading";
export type DifficultyAdjustment =
  | "increase"
  | "decrease"
  | "maintain"
  | "pause";
export type ContentFormat =
  | "video"
  | "interactive"
  | "reading"
  | "audio"
  | "hands-on";

export interface NeuroAdaptiveSession {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  topic: string;
  startTime: Date;
  endTime?: Date;
  currentDifficulty: number;
  targetDifficulty: number;
  attentionHistory: AttentionSnapshot[];
  cognitiveLoadHistory: CognitiveLoadSnapshot[];
  adaptations: AdaptationEvent[];
  contentSequence: ContentBlock[];
  performanceMetrics: PerformanceMetrics;
  learningProfile: LearningProfile;
}

export interface AttentionSnapshot {
  timestamp: Date;
  level: AttentionLevel;
  eyeTrackingData?: {
    gazeX: number;
    gazeY: number;
    blinkRate: number;
    fixationDuration: number;
  };
  headPosition?: {
    tilt: number;
    orientation: string;
  };
  confidence: number;
}

export interface CognitiveLoadSnapshot {
  timestamp: Date;
  loadLevel: number;
  workingMemoryUtilization: number;
  mentalFatigue: number;
  confusionIndicators: string[];
  responseTime: number;
  errorRate: number;
}

export interface AdaptationEvent {
  id: string;
  timestamp: Date;
  trigger: string;
  action: DifficultyAdjustment | ContentFormat | "break" | "encouragement";
  reason: string;
  effectiveness: number;
  beforeMetrics: {
    attention: AttentionLevel;
    cognitiveLoad: number;
    engagement: number;
  };
  afterMetrics: {
    attention: AttentionLevel;
    cognitiveLoad: number;
    engagement: number;
  };
}

export interface ContentBlock {
  id: string;
  type: ContentFormat;
  content: string;
  difficulty: number;
  estimatedTime: number;
  prerequisites: string[];
  learningObjectives: string[];
  interactivityLevel: number;
  multimedia: string[];
  completed: boolean;
  timeSpent: number;
  engagementScore: number;
}

export interface PerformanceMetrics {
  comprehensionRate: number;
  retentionRate: number;
  completionRate: number;
  averageResponseTime: number;
  errorPatterns: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface LearningProfile {
  dominantMode: LearningMode;
  secondaryModes: LearningMode[];
  optimalSessionLength: number;
  bestTimeOfDay: string;
  attentionSpan: number;
  difficultyTolerance: number;
  preferredPace: "slow" | "medium" | "fast";
  breaksNeeded: number;
}

interface NeuroAdaptiveLearningProps {
  userRole?: "student" | "teacher" | "admin" | "ai-researcher";
  userId?: string;
  onStartSession?: (config: {
    studentId: string;
    subject: string;
    topic: string;
  }) => Promise<string>;
  onLogAttention?: (
    sessionId: string,
    data: Omit<AttentionSnapshot, "timestamp">,
  ) => Promise<void>;
  onLogCognitiveLoad?: (
    sessionId: string,
    data: Omit<CognitiveLoadSnapshot, "timestamp">,
  ) => Promise<void>;
  onAdaptContent?: (
    sessionId: string,
    adaptation: Omit<
      AdaptationEvent,
      "id" | "timestamp" | "effectiveness" | "afterMetrics"
    >,
  ) => Promise<void>;
}

export function NeuroAdaptiveLearning({
  userRole = "student",
  userId = "S001",
  onStartSession,
  onLogAttention,
  onLogCognitiveLoad,
  onAdaptContent,
}: NeuroAdaptiveLearningProps) {
  const [activeTab, setActiveTab] = useState<
    "active" | "history" | "profile" | "analytics"
  >("active");
  const [currentSession, setCurrentSession] =
    useState<NeuroAdaptiveSession | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [adaptationLog, setAdaptationLog] = useState<AdaptationEvent[]>([]);
  const [currentAttention, setCurrentAttention] =
    useState<AttentionLevel>("high");
  const [cognitiveLoad, setCognitiveLoad] = useState(45);
  const [currentDifficulty, setCurrentDifficulty] = useState(7);
  const [engagementScore, setEngagementScore] = useState(85);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const monitoringRef = useRef<NodeJS.Timeout | null>(null);

  const [learningProfile] = useState<LearningProfile>({
    dominantMode: "visual",
    secondaryModes: ["kinesthetic", "auditory"],
    optimalSessionLength: 25,
    bestTimeOfDay: "morning",
    attentionSpan: 12,
    difficultyTolerance: 7.5,
    preferredPace: "medium",
    breaksNeeded: 3,
  });

  const [pastSessions] = useState<NeuroAdaptiveSession[]>([
    {
      id: "NAS001",
      studentId: "S001",
      studentName: "Emma Johnson",
      subject: "Mathematics",
      topic: "Calculus - Derivatives",
      startTime: new Date(Date.now() - 86400000),
      endTime: new Date(Date.now() - 86310000),
      currentDifficulty: 8,
      targetDifficulty: 9,
      attentionHistory: [
        {
          timestamp: new Date(Date.now() - 86400000),
          level: "high",
          confidence: 0.92,
        },
        {
          timestamp: new Date(Date.now() - 86370000),
          level: "medium",
          confidence: 0.85,
        },
        {
          timestamp: new Date(Date.now() - 86340000),
          level: "high",
          confidence: 0.94,
        },
      ],
      cognitiveLoadHistory: [
        {
          timestamp: new Date(Date.now() - 86400000),
          loadLevel: 45,
          workingMemoryUtilization: 60,
          mentalFatigue: 20,
          confusionIndicators: [],
          responseTime: 2.3,
          errorRate: 0.05,
        },
        {
          timestamp: new Date(Date.now() - 86370000),
          loadLevel: 65,
          workingMemoryUtilization: 75,
          mentalFatigue: 35,
          confusionIndicators: ["hesitation"],
          responseTime: 3.1,
          errorRate: 0.12,
        },
      ],
      adaptations: [
        {
          id: "A1",
          timestamp: new Date(Date.now() - 86370000),
          trigger: "Cognitive load exceeded threshold",
          action: "decrease",
          reason: "Student showing signs of confusion",
          effectiveness: 0.87,
          beforeMetrics: {
            attention: "medium",
            cognitiveLoad: 65,
            engagement: 70,
          },
          afterMetrics: {
            attention: "high",
            cognitiveLoad: 45,
            engagement: 88,
          },
        },
      ],
      contentSequence: [],
      performanceMetrics: {
        comprehensionRate: 0.87,
        retentionRate: 0.82,
        completionRate: 1.0,
        averageResponseTime: 2.5,
        errorPatterns: [],
        strengths: [
          "Visual pattern recognition",
          "Step-by-step problem solving",
        ],
        weaknesses: ["Abstract concept visualization"],
      },
      learningProfile,
    },
  ]);

  const [currentContent, setCurrentContent] = useState<ContentBlock>({
    id: "CB001",
    type: "interactive",
    content: "Understanding Derivatives through Visual Exploration",
    difficulty: 7,
    estimatedTime: 8,
    prerequisites: ["Basic Algebra", "Functions"],
    learningObjectives: ["Visualize rate of change", "Apply derivative rules"],
    interactivityLevel: 85,
    multimedia: ["interactive-graph", "animation"],
    completed: false,
    timeSpent: 0,
    engagementScore: 0,
  });

  const startMonitoring = () => {
    setIsMonitoring(true);
    setSessionStartTime(new Date());

    monitoringRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);

      const randomAttention: AttentionLevel =
        Math.random() > 0.7
          ? Math.random() > 0.5
            ? "medium"
            : "high"
          : "high";
      setCurrentAttention(randomAttention);

      const loadChange = Math.random() > 0.5 ? 2 : -2;
      setCognitiveLoad((prev) => Math.max(20, Math.min(80, prev + loadChange)));

      const difficultyChange = Math.random() > 0.8 ? 0.1 : 0;
      setCurrentDifficulty((prev) => Math.min(10, prev + difficultyChange));

      const engagementChange = Math.random() > 0.5 ? 1 : -1;
      setEngagementScore((prev) =>
        Math.max(60, Math.min(95, prev + engagementChange)),
      );

      if (cognitiveLoad > 70 && Math.random() > 0.9) {
        const newAdaptation: AdaptationEvent = {
          id: `ADAPT${Date.now()}`,
          timestamp: new Date(),
          trigger: "High cognitive load detected",
          action: "decrease",
          reason: "Reducing complexity to prevent cognitive overload",
          effectiveness: 0,
          beforeMetrics: {
            attention: currentAttention,
            cognitiveLoad,
            engagement: engagementScore,
          },
          afterMetrics: {
            attention: "high",
            cognitiveLoad: cognitiveLoad - 15,
            engagement: engagementScore + 5,
          },
        };
        setAdaptationLog((prev) => [newAdaptation, ...prev].slice(0, 10));
        setCognitiveLoad((prev) => prev - 15);
      }
    }, 2000);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (monitoringRef.current) {
      clearInterval(monitoringRef.current);
      monitoringRef.current = null;
    }
    setElapsedTime(0);
  };

  const getAttentionColor = (level: AttentionLevel) => {
    switch (level) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-orange-500";
      case "distracted":
        return "bg-red-500";
      case "fatigued":
        return "bg-purple-500";
      default:
        return "bg-slate-500";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Brain className="h-8 w-8 text-indigo-600" />
            Neuro-Adaptive Learning
          </h2>
          <p className="mt-1 text-slate-600">
            AI-powered real-time learning adaptation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-slate-600 transition-colors hover:text-indigo-600"
          >
            <Settings className="h-6 w-6" />
          </button>
          {!isMonitoring ? (
            <button
              onClick={startMonitoring}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <Eye className="h-5 w-5" />
              Start Adaptive Session
            </button>
          ) : (
            <button
              onClick={stopMonitoring}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
            >
              <Clock className="h-5 w-5" />
              End Session ({formatTime(elapsedTime)})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          {
            label: "Attention",
            value: currentAttention.toUpperCase(),
            color: getAttentionColor(currentAttention),
            icon: Eye,
          },
          {
            label: "Cognitive Load",
            value: `${cognitiveLoad}%`,
            color:
              cognitiveLoad > 70
                ? "bg-red-500"
                : cognitiveLoad > 50
                  ? "bg-amber-500"
                  : "bg-green-500",
            icon: Gauge,
          },
          {
            label: "Difficulty",
            value: currentDifficulty.toFixed(1),
            color: "bg-purple-500",
            icon: TrendingUp,
          },
          {
            label: "Engagement",
            value: `${engagementScore}%`,
            color: engagementScore > 80 ? "bg-green-500" : "bg-amber-500",
            icon: Activity,
          },
          {
            label: "Adaptations",
            value: adaptationLog.length.toString(),
            color: "bg-blue-500",
            icon: RefreshCw,
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            animate={isMonitoring ? { scale: [1, 1.02, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon
                className={`h-4 w-4 ${stat.color.replace("bg-", "text-")}`}
              />
              <span className="text-slate-600 text-sm">{stat.label}</span>
            </div>
            <p className="font-bold text-2xl text-slate-900">{stat.value}</p>
            <div className="mt-2 h-1 w-full rounded-full bg-slate-200">
              <div
                className={`h-1 rounded-full ${stat.color}`}
                style={{ width: "60%" }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "active", label: "Active Session", icon: Eye },
          { id: "history", label: "Session History", icon: Clock },
          { id: "profile", label: "Learning Profile", icon: Fingerprint },
          { id: "analytics", label: "Neural Analytics", icon: Brain },
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

      {activeTab === "active" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-900">
                <Target className="h-5 w-5 text-indigo-600" />
                Current Content
              </h3>
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                <h4 className="mb-2 font-semibold text-indigo-900">
                  {currentContent.content}
                </h4>
                <p className="mb-3 text-indigo-700 text-sm">
                  Subject: Mathematics • Difficulty Level:{" "}
                  {currentContent.difficulty}/10
                </p>
                <div className="mb-3 flex flex-wrap gap-2">
                  {currentContent.learningObjectives.map((obj, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-indigo-100 px-2 py-1 text-indigo-700 text-xs"
                    >
                      {obj}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-indigo-600 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {currentContent.estimatedTime} min estimated
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    {currentContent.interactivityLevel}% interactive
                  </span>
                </div>
              </div>

              {isMonitoring && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Eye className="h-5 w-5" />
                    <span className="font-medium">
                      Real-time Monitoring Active
                    </span>
                  </div>
                  <p className="mt-1 text-green-700 text-sm">
                    AI is monitoring attention patterns, cognitive load, and
                    adapting content difficulty automatically.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-900">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Recent Adaptations
              </h3>
              <div className="max-h-64 space-y-3 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {adaptationLog.length === 0 ? (
                    <div className="py-8 text-center text-slate-500">
                      <RefreshCw className="mx-auto mb-2 h-12 w-12 opacity-30" />
                      <p>No adaptations yet</p>
                      <p className="text-sm">
                        Start a session to see real-time AI adjustments
                      </p>
                    </div>
                  ) : (
                    adaptationLog.map((adapt) => (
                      <motion.div
                        key={adapt.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="rounded-lg border border-amber-200 bg-amber-50 p-3"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-medium text-amber-900 capitalize">
                            {adapt.action}
                          </span>
                          <span className="text-amber-600 text-xs">
                            {adapt.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-amber-800 text-sm">{adapt.reason}</p>
                        <div className="mt-2 flex items-center gap-4 text-amber-700 text-xs">
                          <span>
                            Load: {adapt.beforeMetrics.cognitiveLoad}% →{" "}
                            {adapt.afterMetrics.cognitiveLoad}%
                          </span>
                          <span>
                            Engagement: {adapt.beforeMetrics.engagement}% →{" "}
                            {adapt.afterMetrics.engagement}%
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="mb-4 font-semibold text-lg text-slate-900">
              Learning Mode Detection
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                {
                  mode: "Visual",
                  percentage: 85,
                  icon: Eye,
                  color: "bg-blue-500",
                },
                {
                  mode: "Auditory",
                  percentage: 45,
                  icon: Activity,
                  color: "bg-green-500",
                },
                {
                  mode: "Kinesthetic",
                  percentage: 70,
                  icon: Zap,
                  color: "bg-amber-500",
                },
                {
                  mode: "Reading",
                  percentage: 60,
                  icon: Lightbulb,
                  color: "bg-purple-500",
                },
              ].map((learning) => (
                <div key={learning.mode} className="text-center">
                  <div className="relative mx-auto mb-3 h-20 w-20">
                    <svg className="-rotate-90 h-full w-full transform">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${learning.percentage * 2.26} 226`}
                        className={learning.color.replace("bg-", "text-")}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <learning.icon
                        className={`h-6 w-6 ${learning.color.replace("bg-", "text-")}`}
                      />
                    </div>
                  </div>
                  <p className="font-medium text-slate-900">{learning.mode}</p>
                  <p className="font-bold text-2xl text-slate-700">
                    {learning.percentage}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          {pastSessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {session.subject} - {session.topic}
                  </h3>
                  <p className="text-slate-600">
                    {session.startTime.toLocaleDateString()} •{" "}
                    {session.startTime.toLocaleTimeString()} -{" "}
                    {session.endTime?.toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl text-indigo-600">
                    {(
                      session.performanceMetrics.comprehensionRate * 100
                    ).toFixed(0)}
                    %
                  </p>
                  <p className="text-slate-500 text-sm">Comprehension</p>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-4 gap-4">
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-slate-500 text-sm">Retention</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {(session.performanceMetrics.retentionRate * 100).toFixed(
                      0,
                    )}
                    %
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-slate-500 text-sm">Adaptations</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {session.adaptations.length}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-slate-500 text-sm">Avg Difficulty</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {session.currentDifficulty}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-slate-500 text-sm">Response Time</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {session.performanceMetrics.averageResponseTime}s
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {session.performanceMetrics.strengths.map((strength) => (
                  <span
                    key={strength}
                    className="rounded-full bg-green-100 px-3 py-1 text-green-700 text-sm"
                  >
                    ✓ {strength}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="mb-4 font-semibold text-lg text-slate-900">
              Personalized Learning Profile
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="rounded-lg bg-indigo-50 p-4">
                  <p className="mb-1 text-indigo-600 text-sm">
                    Dominant Learning Mode
                  </p>
                  <p className="font-bold text-2xl text-indigo-900 capitalize">
                    {learningProfile.dominantMode}
                  </p>
                </div>
                <div className="rounded-lg bg-indigo-50 p-4">
                  <p className="mb-1 text-indigo-600 text-sm">
                    Optimal Session Length
                  </p>
                  <p className="font-bold text-2xl text-indigo-900">
                    {learningProfile.optimalSessionLength} minutes
                  </p>
                </div>
                <div className="rounded-lg bg-indigo-50 p-4">
                  <p className="mb-1 text-indigo-600 text-sm">
                    Best Study Time
                  </p>
                  <p className="font-bold text-2xl text-indigo-900 capitalize">
                    {learningProfile.bestTimeOfDay}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-600 text-sm">Attention Span</p>
                  <p className="font-bold text-2xl text-slate-900">
                    {learningProfile.attentionSpan} minutes
                  </p>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{
                        width: `${(learningProfile.attentionSpan / 30) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-600 text-sm">
                    Difficulty Tolerance
                  </p>
                  <p className="font-bold text-2xl text-slate-900">
                    {learningProfile.difficultyTolerance}/10
                  </p>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{
                        width: `${(learningProfile.difficultyTolerance / 10) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-600 text-sm">Preferred Pace</p>
                  <p className="font-bold text-2xl text-slate-900 capitalize">
                    {learningProfile.preferredPace}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <h3 className="font-bold text-slate-900 text-xl">
                Adaptive Settings
              </h3>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Eye Tracking</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded text-indigo-600"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">
                  Cognitive Load Monitoring
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded text-indigo-600"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">
                  Auto Difficulty Adjustment
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded text-indigo-600"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Break Reminders</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded text-indigo-600"
                  defaultChecked
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Sensitivity Level
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="7"
                  className="w-full"
                />
              </div>
            </div>
            <div className="border-slate-200 border-t p-6">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
