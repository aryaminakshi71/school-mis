import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Dumbbell,
  FileText,
  Lightbulb,
  MousePointer,
  Music,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Tv,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface StudentProfile {
  id: string;
  name: string;
  class: string;
  subjects: string[];
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading";
  pace: "slow" | "medium" | "fast";
  interests: string[];
  weakAreas: string[];
  strongAreas: string[];
  attendance: number;
  avgScore: number;
  lastAssessment: string;
}

interface LearningPath {
  id: string;
  subject: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number;
  resources: Resource[];
  quizzes: Quiz[];
  completed: boolean;
  progress: number;
  aiRecommended: boolean;
  adaptive: boolean;
}

interface Resource {
  id: string;
  type: "video" | "article" | "interactive" | "pdf";
  title: string;
  url: string;
  duration: number;
  completed: boolean;
}

interface Quiz {
  id: string;
  title: string;
  questions: number;
  difficulty: string;
  estimatedTime: number;
  completed: boolean;
  score?: number;
}

interface AIInsight {
  id: string;
  type: "strength" | "weakness" | "opportunity" | "warning";
  subject: string;
  message: string;
  recommendation: string;
  confidence: number;
  actionable: boolean;
}

interface PersonalizedLearningProps {
  studentId?: string;
  className?: string;
}

const defaultStudent: StudentProfile = {
  id: "STU001",
  name: "Rahul Kumar",
  class: "10-A",
  subjects: ["Mathematics", "Science", "English", "Social Studies"],
  learningStyle: "visual",
  pace: "medium",
  interests: ["Technology", "Space", "Robotics"],
  weakAreas: ["Algebra", "Geometry"],
  strongAreas: ["Physics", "Chemistry"],
  attendance: 94,
  avgScore: 78.5,
  lastAssessment: "2024-03-20",
};

const defaultLearningPaths: LearningPath[] = [
  {
    id: "1",
    subject: "Mathematics",
    topic: "Quadratic Equations",
    difficulty: "intermediate",
    estimatedTime: 120,
    resources: [
      {
        id: "r1",
        type: "video",
        title: "Introduction to Quadratic Equations",
        url: "#",
        duration: 15,
        completed: true,
      },
      {
        id: "r2",
        type: "interactive",
        title: "Interactive Graph Plotting",
        url: "#",
        duration: 20,
        completed: false,
      },
      {
        id: "r3",
        type: "article",
        title: "Real-world Applications",
        url: "#",
        duration: 10,
        completed: false,
      },
    ],
    quizzes: [
      {
        id: "q1",
        title: "Basic Concepts Check",
        questions: 10,
        difficulty: "easy",
        estimatedTime: 15,
        completed: true,
        score: 8,
      },
      {
        id: "q2",
        title: "Problem Solving Practice",
        questions: 15,
        difficulty: "medium",
        estimatedTime: 25,
        completed: false,
      },
    ],
    completed: false,
    progress: 35,
    aiRecommended: true,
    adaptive: true,
  },
  {
    id: "2",
    subject: "Science",
    topic: "Photosynthesis Process",
    difficulty: "beginner",
    estimatedTime: 90,
    resources: [
      {
        id: "r4",
        type: "video",
        title: "Photosynthesis Animation",
        url: "#",
        duration: 12,
        completed: false,
      },
      {
        id: "r5",
        type: "interactive",
        title: "Virtual Lab: Photosynthesis",
        url: "#",
        duration: 30,
        completed: false,
      },
    ],
    quizzes: [
      {
        id: "q3",
        title: "Process Steps Quiz",
        questions: 8,
        difficulty: "easy",
        estimatedTime: 12,
        completed: false,
      },
    ],
    completed: false,
    progress: 0,
    aiRecommended: true,
    adaptive: false,
  },
  {
    id: "3",
    subject: "English",
    topic: "Essay Writing Skills",
    difficulty: "advanced",
    estimatedTime: 150,
    resources: [
      {
        id: "r6",
        type: "article",
        title: "Essay Structure Guide",
        url: "#",
        duration: 20,
        completed: false,
      },
      {
        id: "r7",
        type: "video",
        title: "Writing Techniques Masterclass",
        url: "#",
        duration: 25,
        completed: false,
      },
    ],
    quizzes: [
      {
        id: "q4",
        title: "Grammar Check",
        questions: 20,
        difficulty: "medium",
        estimatedTime: 20,
        completed: false,
      },
    ],
    completed: false,
    progress: 0,
    aiRecommended: false,
    adaptive: true,
  },
];

const defaultInsights: AIInsight[] = [
  {
    id: "1",
    type: "warning",
    subject: "Mathematics",
    message: "Performance in Algebra has declined by 15% over the last 3 weeks",
    recommendation:
      "Start personalized algebra refresher course with visual aids",
    confidence: 87,
    actionable: true,
  },
  {
    id: "2",
    type: "strength",
    subject: "Science",
    message: "Excellent grasp of Physics concepts - top 10% in class",
    recommendation: "Consider advanced physics elective or science competition",
    confidence: 92,
    actionable: true,
  },
  {
    id: "3",
    type: "opportunity",
    subject: "English",
    message:
      "Creative writing scores improved significantly after recent practice",
    recommendation:
      "Join school creative writing club or submit to literary magazine",
    confidence: 78,
    actionable: true,
  },
  {
    id: "4",
    type: "weakness",
    subject: "Social Studies",
    message: "Difficulty with chronological understanding of historical events",
    recommendation: "Use timeline-based visual learning resources",
    confidence: 85,
    actionable: true,
  },
];

const getLearningStyleIcon = (style: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    visual: Brain,
    auditory: Music,
    kinesthetic: Dumbbell,
    reading: BookOpen,
  };
  return icons[style] || Brain;
};

const getInsightColor = (type: string) => {
  const colors: Record<string, string> = {
    strength:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    weakness: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    opportunity:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
};

export function PersonalizedLearning({
  studentId,
  className,
}: PersonalizedLearningProps) {
  const [student, setStudent] = useState<StudentProfile>(defaultStudent);
  const [learningPaths, setLearningPaths] =
    useState<LearningPath[]>(defaultLearningPaths);
  const [insights, setInsights] = useState<AIInsight[]>(defaultInsights);
  const [activeTab, setActiveTab] = useState<
    "paths" | "insights" | "analytics"
  >("paths");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showPathDetail, setShowPathDetail] = useState<LearningPath | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const completedPaths = learningPaths.filter((p) => p.completed).length;
  const inProgressPaths = learningPaths.filter(
    (p) => !p.completed && p.progress > 0,
  ).length;
  const avgProgress = Math.round(
    learningPaths.reduce((acc, p) => acc + p.progress, 0) /
      learningPaths.length,
  );
  const aiRecommendedCount = learningPaths.filter(
    (p) => p.aiRecommended,
  ).length;

  const filteredPaths = selectedSubject
    ? learningPaths.filter((p) => p.subject === selectedSubject)
    : learningPaths;

  const generateNewPath = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPath: LearningPath = {
        id: Math.random().toString(36).substr(2, 9),
        subject: "Mathematics",
        topic: "Advanced Trigonometry",
        difficulty: "advanced",
        estimatedTime: 180,
        resources: [
          {
            id: "r-new-1",
            type: "video",
            title: "AI-Generated: Trig Fundamentals",
            url: "#",
            duration: 20,
            completed: false,
          },
          {
            id: "r-new-2",
            type: "interactive",
            title: "Interactive Trig Calculator",
            url: "#",
            duration: 25,
            completed: false,
          },
        ],
        quizzes: [
          {
            id: "q-new-1",
            title: "Trig Basics",
            questions: 12,
            difficulty: "medium",
            estimatedTime: 18,
            completed: false,
          },
        ],
        completed: false,
        progress: 0,
        aiRecommended: true,
        adaptive: true,
      };
      setLearningPaths([...learningPaths, newPath]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
              AI Personalized Learning
            </h2>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Adaptive learning paths powered by AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateNewPath}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGenerating ? "Generating..." : "Generate AI Path"}
          </button>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 font-bold text-white text-xl">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                {student.name}
              </h3>
              <p className="text-gray-500">{student.class}</p>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
              <div className="mb-1 flex items-center justify-center gap-1 text-gray-500 text-sm">
                {(() => {
                  const Icon = getLearningStyleIcon(student.learningStyle);
                  return <Icon className="h-4 w-4" />;
                })()}
                Learning Style
              </div>
              <p className="font-semibold text-gray-900 capitalize dark:text-white">
                {student.learningStyle}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
              <div className="mb-1 flex items-center justify-center gap-1 text-gray-500 text-sm">
                <Clock className="h-4 w-4" />
                Pace
              </div>
              <p className="font-semibold text-gray-900 capitalize dark:text-white">
                {student.pace}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
              <div className="mb-1 flex items-center justify-center gap-1 text-gray-500 text-sm">
                <TrendingUp className="h-4 w-4" />
                Average Score
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {student.avgScore}%
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
              <div className="mb-1 flex items-center justify-center gap-1 text-gray-500 text-sm">
                <Target className="h-4 w-4" />
                Attendance
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {student.attendance}%
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {student.interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Active Paths
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                {learningPaths.length}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Completed
              </p>
              <p className="font-bold text-2xl text-green-600 dark:text-green-400">
                {completedPaths}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                In Progress
              </p>
              <p className="font-bold text-2xl text-yellow-600 dark:text-yellow-400">
                {inProgressPaths}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                AI Recommended
              </p>
              <p className="font-bold text-2xl text-violet-600 dark:text-violet-400">
                {aiRecommendedCount}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-xl border border-violet-200 bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-4 dark:border-violet-800">
        <div className="mb-3 flex items-center gap-2">
          <Brain className="h-5 w-5 text-violet-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            AI Insights & Recommendations
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {insights.map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg p-3 ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{insight.subject}</p>
                  <p className="mt-1 text-sm">{insight.message}</p>
                  <p className="mt-2 text-xs opacity-80">
                    {insight.recommendation}
                  </p>
                  {insight.actionable && (
                    <button className="mt-2 font-medium text-xs underline">
                      Take Action
                    </button>
                  )}
                </div>
                <span className="text-xs opacity-70">
                  {insight.confidence}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {[
          { id: "paths", label: "Learning Paths", icon: BookOpen },
          { id: "insights", label: "Detailed Insights", icon: Lightbulb },
          { id: "analytics", label: "Progress Analytics", icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "bg-white text-violet-600 shadow-sm dark:bg-gray-700"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "paths" && (
          <motion.div
            key="paths"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Subject Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedSubject(null)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                  !selectedSubject
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                All Subjects
              </button>
              {student.subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() =>
                    setSelectedSubject(
                      selectedSubject === subject ? null : subject,
                    )
                  }
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                    selectedSubject === subject
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>

            {/* Learning Paths */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredPaths.map((path) => (
                <motion.div
                  key={path.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setShowPathDetail(path)}
                  className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {path.topic}
                        </h4>
                        {path.aiRecommended && (
                          <span className="flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-violet-700 text-xs dark:bg-violet-900/30 dark:text-violet-400">
                            <Sparkles className="h-3 w-3" />
                            AI
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">{path.subject}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 font-medium text-xs ${
                        path.difficulty === "beginner"
                          ? "bg-green-100 text-green-700"
                          : path.difficulty === "intermediate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {path.difficulty}
                    </span>
                  </div>

                  <div className="mb-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium">{path.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {Math.round(path.estimatedTime / 60)}h
                      </span>
                      <span>{path.resources.length} resources</span>
                      <span>{path.quizzes.length} quizzes</span>
                    </div>
                    {path.adaptive && (
                      <span className="flex items-center gap-1 text-violet-600">
                        <Zap className="h-4 w-4" />
                        Adaptive
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Subject Performance
              </h3>
              <div className="space-y-4">
                {student.subjects.map((subject) => {
                  const score =
                    subject === "Mathematics"
                      ? 72
                      : subject === "Science"
                        ? 88
                        : 80;
                  return (
                    <div key={subject}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-gray-700 text-sm dark:text-gray-300">
                          {subject}
                        </span>
                        <span className="font-medium text-sm">{score}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Learning Activity
              </h3>
              <div className="flex h-48 items-end gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, idx) => {
                    const height = [40, 65, 45, 80, 55, 30, 50][idx];
                    return (
                      <div
                        key={day}
                        className="flex flex-1 flex-col items-center gap-2"
                      >
                        <div
                          className="group relative w-full rounded-t-lg bg-violet-100 dark:bg-violet-900/30"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute inset-0 rounded-t-lg bg-violet-500 opacity-50 transition-opacity group-hover:opacity-70" />
                          <div className="-top-8 -translate-x-1/2 absolute left-1/2 rounded bg-gray-800 px-2 py-1 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
                            {height} min
                          </div>
                        </div>
                        <span className="text-gray-500 text-xs">{day}</span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Path Detail Modal */}
      <AnimatePresence>
        {showPathDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white dark:bg-gray-800"
            >
              <div className="sticky top-0 flex items-center justify-between border-gray-200 border-b bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div>
                  <h3 className="font-bold text-gray-900 text-xl dark:text-white">
                    {showPathDetail.topic}
                  </h3>
                  <p className="text-gray-500">{showPathDetail.subject}</p>
                </div>
                <button
                  onClick={() => setShowPathDetail(null)}
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 p-4">
                {/* Progress */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">Overall Progress</span>
                    <span className="font-bold text-violet-600">
                      {showPathDetail.progress}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                      style={{ width: `${showPathDetail.progress}%` }}
                    />
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                    Learning Resources
                  </h4>
                  <div className="space-y-2">
                    {showPathDetail.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              resource.type === "video"
                                ? "bg-red-100 text-red-600"
                                : resource.type === "interactive"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-green-100 text-green-600"
                            }`}
                          >
                            {resource.type === "video" ? (
                              <Tv className="h-4 w-4" />
                            ) : resource.type === "interactive" ? (
                              <MousePointer className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {resource.title}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {resource.duration} min
                            </p>
                          </div>
                        </div>
                        <button
                          className={`rounded-lg px-3 py-1 text-sm ${
                            resource.completed
                              ? "bg-green-100 text-green-700"
                              : "bg-violet-100 text-violet-700"
                          }`}
                        >
                          {resource.completed ? "Completed" : "Start"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quizzes */}
                <div>
                  <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                    Practice Quizzes
                  </h4>
                  <div className="space-y-2">
                    {showPathDetail.quizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                      >
                        <div>
                          <p className="font-medium text-sm">{quiz.title}</p>
                          <p className="text-gray-500 text-xs">
                            {quiz.questions} questions • {quiz.difficulty} •{" "}
                            {quiz.estimatedTime} min
                          </p>
                          {quiz.score !== undefined && (
                            <p className="mt-1 text-green-600 text-xs">
                              Score: {quiz.score}/{quiz.questions}
                            </p>
                          )}
                        </div>
                        <button
                          className={`rounded-lg px-3 py-1 text-sm ${
                            quiz.completed
                              ? "bg-green-100 text-green-700"
                              : "bg-violet-100 text-violet-700"
                          }`}
                        >
                          {quiz.completed ? "Review" : "Take Quiz"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
