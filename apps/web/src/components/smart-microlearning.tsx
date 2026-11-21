import { type Variants, AnimatePresence, motion  } from "framer-motion";
import {
  Award,
  Bell,
  BookOpen,
  Bookmark,
  Brain,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Flame,
  GraduationCap,
  Lock,
  Play,
  RotateCcw,
  Share2,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useCallback, useState } from "react";

// Types
interface MicroLesson {
  id: string;
  title: string;
  subject: string;
  topic: string;
  duration: number; // minutes
  difficulty: "beginner" | "intermediate" | "advanced";
  content: string;
  completed: boolean;
  lastReviewed?: Date;
  nextReview?: Date;
  retention: number; // 0-100
  streakBonus: boolean;
  points: number;
  tags: string[];
  type: "video" | "article" | "quiz" | "flashcard" | "interactive";
}

interface LearningPath {
  id: string;
  name: string;
  subject: string;
  description: string;
  lessons: string[]; // lesson IDs
  progress: number;
  estimatedHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: string;
  color: string;
  locked: boolean;
}

interface StreakData {
  current: number;
  longest: number;
  lastActive: Date;
  weekProgress: boolean[];
  points: number;
  level: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "reminder" | "achievement" | "streak" | "review";
  timestamp: Date;
  read: boolean;
}

// Mock Data
const mockLessons: MicroLesson[] = [
  {
    id: "1",
    title: "Introduction to Photosynthesis",
    subject: "Biology",
    topic: "Plant Biology",
    duration: 3,
    difficulty: "beginner",
    content:
      "Plants convert sunlight into energy through photosynthesis. The process occurs in chloroplasts using chlorophyll.",
    completed: true,
    lastReviewed: new Date(Date.now() - 86400000 * 2),
    nextReview: new Date(Date.now() + 86400000),
    retention: 85,
    streakBonus: true,
    points: 50,
    tags: ["biology", "plants", "energy"],
    type: "interactive",
  },
  {
    id: "2",
    title: "Cellular Respiration Basics",
    subject: "Biology",
    topic: "Cell Biology",
    duration: 4,
    difficulty: "intermediate",
    content:
      "Cellular respiration breaks down glucose to produce ATP, the energy currency of cells. Mitochondria play a key role.",
    completed: true,
    lastReviewed: new Date(Date.now() - 86400000 * 3),
    nextReview: new Date(Date.now() + 86400000 * 2),
    retention: 72,
    streakBonus: false,
    points: 75,
    tags: ["biology", "cells", "energy"],
    type: "video",
  },
  {
    id: "3",
    title: "Quadratic Equations",
    subject: "Mathematics",
    topic: "Algebra",
    duration: 5,
    difficulty: "intermediate",
    content:
      "Quadratic equations follow the form ax² + bx + c = 0. The quadratic formula provides solutions for any quadratic equation.",
    completed: false,
    retention: 0,
    streakBonus: false,
    points: 100,
    tags: ["math", "algebra", "equations"],
    type: "interactive",
  },
  {
    id: "4",
    title: "World War II: Causes & Effects",
    subject: "History",
    topic: "Modern History",
    duration: 4,
    difficulty: "intermediate",
    content:
      "World War II began in 1939, triggered by Germany's invasion of Poland. The war reshaped global politics and led to the UN.",
    completed: true,
    lastReviewed: new Date(Date.now() - 86400000 * 5),
    nextReview: new Date(Date.now() + 86400000 * 3),
    retention: 68,
    streakBonus: false,
    points: 80,
    tags: ["history", "ww2", "politics"],
    type: "article",
  },
  {
    id: "5",
    title: "Chemical Bonding",
    subject: "Chemistry",
    topic: "Atomic Structure",
    duration: 3,
    difficulty: "beginner",
    content:
      "Atoms form chemical bonds to achieve stable electron configurations. Ionic and covalent bonds are the main types.",
    completed: false,
    retention: 0,
    streakBonus: false,
    points: 60,
    tags: ["chemistry", "atoms", "bonds"],
    type: "flashcard",
  },
  {
    id: "6",
    title: "Shakespeare's Macbeth",
    subject: "English Literature",
    topic: "Classic Literature",
    duration: 5,
    difficulty: "advanced",
    content:
      "Macbeth explores themes of ambition, guilt, and fate. The play is one of Shakespeare's darkest tragedies.",
    completed: false,
    retention: 0,
    streakBonus: false,
    points: 120,
    tags: ["literature", "shakespeare", "drama"],
    type: "quiz",
  },
  {
    id: "7",
    title: "Newton's Laws of Motion",
    subject: "Physics",
    topic: "Classical Mechanics",
    duration: 4,
    difficulty: "intermediate",
    content:
      "Newton's three laws describe the relationship between forces and motion, fundamental to classical physics.",
    completed: true,
    lastReviewed: new Date(Date.now() - 86400000),
    nextReview: new Date(Date.now() + 86400000),
    retention: 92,
    streakBonus: true,
    points: 90,
    tags: ["physics", "mechanics", "newton"],
    type: "interactive",
  },
  {
    id: "8",
    title: "French Revolution",
    subject: "History",
    topic: "European History",
    duration: 4,
    difficulty: "intermediate",
    content:
      "The French Revolution (1789-1799) overthrew the monarchy and established principles of liberty and equality.",
    completed: false,
    retention: 0,
    streakBonus: false,
    points: 85,
    tags: ["history", "france", "revolution"],
    type: "video",
  },
];

const mockPaths: LearningPath[] = [
  {
    id: "path1",
    name: "Biology Fundamentals",
    subject: "Biology",
    description: "Master the basics of biology from cells to ecosystems",
    lessons: ["1", "2"],
    progress: 50,
    estimatedHours: 12,
    difficulty: "beginner",
    icon: "🧬",
    color: "from-emerald-400 to-teal-600",
    locked: false,
  },
  {
    id: "path2",
    name: "Algebra Mastery",
    subject: "Mathematics",
    description: "From linear equations to complex algebraic concepts",
    lessons: ["3"],
    progress: 25,
    estimatedHours: 20,
    difficulty: "intermediate",
    icon: "📐",
    color: "from-blue-400 to-indigo-600",
    locked: false,
  },
  {
    id: "path3",
    name: "World History Explorer",
    subject: "History",
    description: "Journey through major historical events and their impact",
    lessons: ["4", "8"],
    progress: 40,
    estimatedHours: 15,
    difficulty: "intermediate",
    icon: "🏛️",
    color: "from-amber-400 to-orange-600",
    locked: false,
  },
  {
    id: "path4",
    name: "Chemistry Essentials",
    subject: "Chemistry",
    description: "Understanding matter, atoms, and chemical reactions",
    lessons: ["5"],
    progress: 15,
    estimatedHours: 18,
    difficulty: "beginner",
    icon: "⚗️",
    color: "from-purple-400 to-violet-600",
    locked: false,
  },
  {
    id: "path5",
    name: "Physics Foundations",
    subject: "Physics",
    description: "Classical mechanics, thermodynamics, and electromagnetism",
    lessons: ["7"],
    progress: 35,
    estimatedHours: 25,
    difficulty: "intermediate",
    icon: "⚡",
    color: "from-rose-400 to-pink-600",
    locked: false,
  },
  {
    id: "path6",
    name: "Literature Deep Dive",
    subject: "English Literature",
    description: "Explore classic and contemporary literary works",
    lessons: ["6"],
    progress: 10,
    estimatedHours: 30,
    difficulty: "advanced",
    icon: "📚",
    color: "from-fuchsia-400 to-purple-600",
    locked: true,
  },
];

const mockStreak: StreakData = {
  current: 12,
  longest: 45,
  lastActive: new Date(),
  weekProgress: [true, true, true, true, false, true, false],
  points: 2450,
  level: 8,
};

const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Daily Streak Alert!",
    message: "You're on a 12-day streak! Complete a lesson to keep it going.",
    type: "streak",
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: "n2",
    title: "Review Time",
    message:
      "Photosynthesis lesson needs review. Spaced repetition suggests today!",
    type: "review",
    timestamp: new Date(Date.now() - 7200000),
    read: false,
  },
  {
    id: "n3",
    title: "Achievement Unlocked!",
    message: "Biology Beginner: Complete 5 biology lessons",
    type: "achievement",
    timestamp: new Date(Date.now() - 86400000),
    read: true,
  },
  {
    id: "n4",
    title: "New Lesson Available",
    message:
      "Genetics 101: A new interactive lesson is now available in Biology",
    type: "reminder",
    timestamp: new Date(Date.now() - 172800000),
    read: true,
  },
];

const subjects = [
  {
    id: "all",
    name: "All Subjects",
    icon: BookOpen,
    color: "from-slate-400 to-slate-600",
  },
  {
    id: "Biology",
    name: "Biology",
    icon: Brain,
    color: "from-emerald-400 to-teal-600",
  },
  {
    id: "Mathematics",
    name: "Mathematics",
    icon: Trophy,
    color: "from-blue-400 to-indigo-600",
  },
  {
    id: "History",
    name: "History",
    icon: Calendar,
    color: "from-amber-400 to-orange-600",
  },
  {
    id: "Chemistry",
    name: "Chemistry",
    icon: Zap,
    color: "from-purple-400 to-violet-600",
  },
  {
    id: "Physics",
    name: "Physics",
    icon: Sparkles,
    color: "from-rose-400 to-pink-600",
  },
  {
    id: "English Literature",
    name: "Literature",
    icon: GraduationCap,
    color: "from-fuchsia-400 to-purple-600",
  },
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const cardVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 17 },
  },
  tap: { scale: 0.98 },
};

const pulseVariants: Variants = {
  initial: { scale: 1, opacity: 0.6 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 2, repeat: Infinity },
  },
};

// Components
function StreakFlame({
  streak,
  size = "md",
}: { streak: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      animate={{
        rotate: [0, -5, 5, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 2,
      }}
    >
      <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-yellow-500 opacity-60 blur-md" />
      <div className="absolute inset-1 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500">
        <Flame className={`${iconSizes[size]} text-white`} />
      </div>
      {size === "lg" && (
        <div className="-bottom-1 -translate-x-1/2 absolute left-1/2 rounded-full bg-white px-2 py-0.5 font-bold text-xs shadow-lg dark:bg-gray-800">
          {streak}
        </div>
      )}
    </motion.div>
  );
}

function RetentionRing({
  percentage,
  size = 48,
}: { percentage: number; size?: number }) {
  const circumference = 2 * Math.PI * ((size - 8) / 2);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 8) / 2}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 8) / 2}
          fill="none"
          stroke={
            percentage > 80
              ? "#10b981"
              : percentage > 60
                ? "#f59e0b"
                : "#ef4444"
          }
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-bold text-xs ${percentage > 80 ? "text-emerald-600" : percentage > 60 ? "text-amber-600" : "text-red-600"}`}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
}

function WeekCalendar({ progress }: { progress: boolean[] }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="flex gap-1">
      {progress.map((active, idx) => (
        <motion.div
          key={idx}
          className={`flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs ${
            active
              ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md"
              : "bg-gray-100 text-gray-400 dark:bg-gray-800"
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: idx * 0.05, type: "spring", stiffness: 500 }}
        >
          {days[idx]}
        </motion.div>
      ))}
    </div>
  );
}

function LessonCard({
  lesson,
  onClick,
  onComplete,
  isReview = false,
}: {
  lesson: MicroLesson;
  onClick: () => void;
  onComplete: () => void;
  isReview?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const typeIcons = {
    video: Play,
    article: BookOpen,
    quiz: Trophy,
    flashcard: Brain,
    interactive: Zap,
  };

  const TypeIcon = typeIcons[lesson.type];

  return (
    <motion.div
      layout
      variants={itemVariants}
      className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${lesson.completed ? "opacity-75" : ""}
      `}
      whileHover="hover"
      whileTap="tap"
      initial="initial"
    >
      {/* Subject indicator strip */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b ${subjects.find((s) => s.name === lesson.subject)?.color || "from-gray-400 to-gray-600"}`}
      />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">
                {lesson.subject}
              </span>
              {isReview && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 text-xs dark:bg-amber-900/30 dark:text-amber-400">
                  Review
                </span>
              )}
              {lesson.streakBonus && (
                <motion.span
                  className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-400 to-red-500 px-2 py-0.5 text-white text-xs"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Flame className="h-3 w-3" />+
                  {Math.round(lesson.points * 0.5)}
                </motion.span>
              )}
            </div>
            <h3 className="mb-1 font-bold text-gray-900 leading-tight dark:text-white">
              {lesson.title}
            </h3>
            <p className="mb-2 line-clamp-2 text-gray-500 text-sm dark:text-gray-400">
              {lesson.content}
            </p>

            <div className="flex items-center gap-3 text-gray-400 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lesson.duration} min
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {lesson.points} pts
              </div>
              <div className="flex items-center gap-1">
                <TypeIcon className="h-3 w-3" />
                {lesson.type}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            {lesson.completed ? (
              <RetentionRing percentage={lesson.retention} size={48} />
            ) : (
              <motion.button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setIsPlaying(true);
                  setTimeout(() => {
                    setIsPlaying(false);
                    onComplete();
                  }, 1000);
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent" />
                  </motion.div>
                ) : (
                  <Play className="ml-0.5 h-5 w-5 text-white" fill="white" />
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {lesson.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-gray-600 text-xs dark:bg-gray-700 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Progress bar for completed */}
        {lesson.completed && (
          <motion.div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className={`h-full rounded-full ${lesson.retention > 80 ? "bg-emerald-500" : lesson.retention > 60 ? "bg-amber-500" : "bg-red-500"}`}
              initial={{ width: 0 }}
              animate={{ width: `${lesson.retention}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>
        )}
      </div>

      {/* Hover overlay with quick actions */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center gap-2 bg-black/5 dark:bg-black/20"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800"
            >
              <Bookmark className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800"
            >
              <Share2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PathCard({
  path,
  onClick,
}: { path: LearningPath; onClick: () => void }) {
  return (
    <motion.div
      variants={itemVariants}
      className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${path.locked ? "opacity-60" : ""}
      `}
      whileHover={!path.locked ? { scale: 1.02, y: -2 } : {}}
      whileTap={!path.locked ? { scale: 0.98 } : {}}
      onClick={!path.locked ? onClick : undefined}
    >
      <div className="flex items-start gap-4">
        <div
          className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${path.color} flex items-center justify-center text-2xl shadow-lg`}
        >
          {path.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-0.5 font-bold text-gray-900 dark:text-white">
            {path.name}
          </h3>
          <p className="mb-2 line-clamp-2 text-gray-500 text-sm dark:text-gray-400">
            {path.description}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              {path.estimatedHours}h
            </span>
            <span
              className={`rounded-md px-2 py-0.5 ${
                path.difficulty === "beginner"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : path.difficulty === "intermediate"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
              }`}
            >
              {path.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-gray-500">{path.progress}% complete</span>
          <span className="text-gray-400">{path.lessons.length} lessons</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${path.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${path.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {path.locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px] dark:bg-gray-900/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            <Lock className="h-6 w-6 text-gray-500" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function NotificationCard({
  notification,
  onDismiss,
}: { notification: Notification; onDismiss: () => void }) {
  const typeStyles = {
    reminder:
      "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    achievement:
      "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    streak:
      "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    review:
      "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
  };

  const typeIcons = {
    reminder: Bell,
    achievement: Trophy,
    streak: Flame,
    review: RotateCcw,
  };

  const TypeIcon = typeIcons[notification.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={`rounded-xl border p-3 ${typeStyles[notification.type]} flex gap-3`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-800">
        <TypeIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900 text-sm dark:text-white">
          {notification.title}
        </p>
        <p className="line-clamp-2 text-gray-600 text-xs dark:text-gray-400">
          {notification.message}
        </p>
        <p className="mt-1 text-gray-400 text-xs">
          {new Date(notification.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

function X({ className }: { className?: string }) {
  return (
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function SpacedRepetitionViz({ lessons }: { lessons: MicroLesson[] }) {
  const reviewLessons = lessons.filter(
    (l) =>
      l.nextReview &&
      new Date(l.nextReview) <= new Date(Date.now() + 86400000 * 7),
  );

  const days = [
    "Today",
    "Tomorrow",
    "Day 3",
    "Day 4",
    "Day 5",
    "Day 6",
    "Day 7",
  ];
  const counts = days.map(
    (_, idx) =>
      lessons.filter((l) => {
        if (!l.nextReview) return false;
        const diff = Math.floor(
          (new Date(l.nextReview).getTime() - Date.now()) / 86400000,
        );
        return diff === idx;
      }).length,
  );

  const maxCount = Math.max(...counts, 1);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            <Brain className="h-5 w-5 text-indigo-500" />
            Spaced Repetition
          </h3>
          <p className="text-gray-500 text-xs">Optimized review schedule</p>
        </div>
        <div className="text-right">
          <span className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">
            {reviewLessons.length}
          </span>
          <p className="text-gray-500 text-xs">due this week</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex h-24 items-end justify-between gap-2">
        {counts.map((count, idx) => (
          <div key={idx} className="flex flex-1 flex-col items-center gap-1">
            <motion.div
              className={`w-full rounded-t-lg ${count > 0 ? "bg-gradient-to-t from-indigo-500 to-indigo-400" : "bg-gray-100 dark:bg-gray-700"}`}
              initial={{ height: 0 }}
              animate={{ height: `${(count / maxCount) * 100}%` }}
              transition={{ delay: idx * 0.05, duration: 0.5, type: "spring" }}
            />
            <span className="font-medium text-[10px] text-gray-500">
              {count}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between">
        {days.map((day, idx) => (
          <span
            key={idx}
            className="flex-1 text-center text-[10px] text-gray-400"
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

// Main Component
export function SmartMicrolearning({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<"lessons" | "paths" | "stats">(
    "lessons",
  );
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [lessons, setLessons] = useState(mockLessons);
  const [paths] = useState(mockPaths);
  const [streak, setStreak] = useState(mockStreak);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<MicroLesson | null>(
    null,
  );
  const [lessonProgress, setLessonProgress] = useState(0);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Calculate stats
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l) => l.completed).length;
  const averageRetention =
    lessons
      .filter((l) => l.completed)
      .reduce((acc, l) => acc + l.retention, 0) / (completedLessons || 1);
  const todayLessons = lessons.filter((l) => !l.completed).slice(0, 3);
  const reviewLessons = lessons.filter(
    (l) => l.completed && l.nextReview && new Date(l.nextReview) <= new Date(),
  );

  // Filter lessons
  const filteredLessons = lessons.filter((lesson) => {
    if (selectedSubject === "all") return true;
    return lesson.subject === selectedSubject;
  });

  const completeLesson = useCallback((lessonId: string) => {
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === lessonId) {
          const newRetention = 100;
          const points =
            l.points + (l.streakBonus ? Math.round(l.points * 0.5) : 0);
          return {
            ...l,
            completed: true,
            retention: newRetention,
            lastReviewed: new Date(),
            nextReview: new Date(Date.now() + 86400000), // Review tomorrow
          };
        }
        return l;
      }),
    );
    setStreak((prev) => ({
      ...prev,
      points: prev.points + 50,
    }));
    setCompletedCount((prev) => prev + 1);
  }, []);

  const startLesson = (lesson: MicroLesson) => {
    setSelectedLesson(lesson);
    setLessonProgress(0);
    setShowLessonModal(true);

    // Simulate lesson progress
    const interval = setInterval(() => {
      setLessonProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${className || ""}`}
    >
      {/* Mobile Preview Toggle */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="rounded-full border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => setMobilePreview(!mobilePreview)}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 font-medium text-sm shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <Smartphone className="h-4 w-4" />
          {mobilePreview ? "Desktop View" : "Mobile Preview"}
        </button>
      </div>

      {/* Push Notification Simulation */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <div className="fixed top-4 left-4 z-50 max-w-sm space-y-2">
            {notifications.slice(0, 2).map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onDismiss={() => dismissNotification(notification.id)}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div
        className={`mx-auto transition-all duration-500 ${mobilePreview ? "max-w-md" : "max-w-6xl"} p-4 md:p-6`}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/25 shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
                  Smart Microlearning
                </h1>
                <p className="text-gray-500 text-sm">
                  Bite-sized learning for busy minds
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Streak indicator */}
              <motion.div
                className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                whileHover={{ scale: 1.02 }}
              >
                <StreakFlame streak={streak.current} size="sm" />
                <div>
                  <span className="font-bold text-gray-900 text-lg dark:text-white">
                    {streak.current}
                  </span>
                  <span className="ml-1 text-gray-500 text-xs">day streak</span>
                </div>
              </motion.div>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl border border-gray-100 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <span className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 font-bold text-white text-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Points/Level */}
              <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-2 text-white shadow-lg shadow-orange-500/25">
                <Trophy className="h-4 w-4" />
                <span className="font-bold">
                  {streak.points.toLocaleString()}
                </span>
                <span className="text-xs opacity-80">Lvl {streak.level}</span>
              </div>
            </div>
          </div>

          {/* Week progress */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <span className="font-medium text-gray-500 text-sm">
              Weekly Progress
            </span>
            <WeekCalendar progress={streak.weekProgress} />
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {[
            {
              id: "lessons",
              name: "Lessons",
              icon: BookOpen,
              count: todayLessons.length + reviewLessons.length,
            },
            {
              id: "paths",
              name: "Learning Paths",
              icon: Target,
              count: paths.length,
            },
            { id: "stats", name: "My Progress", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-500 text-white shadow-indigo-500/25 shadow-lg"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
              {tab.count && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${activeTab === tab.id ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "lessons" && (
            <motion.div
              key="lessons"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Subject Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm transition-all ${
                      selectedSubject === subject.id
                        ? `bg-gradient-to-r ${subject.color} text-white shadow-md`
                        : "border border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    <subject.icon className="h-4 w-4" />
                    {subject.name}
                  </button>
                ))}
              </div>

              {/* Review Section */}
              {reviewLessons.length > 0 && (
                <motion.div variants={itemVariants} className="space-y-3">
                  <h2 className="flex items-center gap-2 font-bold text-gray-900 text-lg dark:text-white">
                    <RotateCcw className="h-5 w-5 text-emerald-500" />
                    Due for Review ({reviewLessons.length})
                  </h2>
                  <div className="space-y-3">
                    {reviewLessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        onClick={() => startLesson(lesson)}
                        onComplete={() => completeLesson(lesson.id)}
                        isReview
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Today's Lessons */}
              <motion.div variants={itemVariants} className="space-y-3">
                <h2 className="flex items-center gap-2 font-bold text-gray-900 text-lg dark:text-white">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Recommended Today
                </h2>
                <div className="space-y-3">
                  {filteredLessons
                    .filter((l) => !l.completed)
                    .slice(0, 4)
                    .map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        onClick={() => startLesson(lesson)}
                        onComplete={() => completeLesson(lesson.id)}
                      />
                    ))}
                </div>
              </motion.div>

              {/* Completed Lessons */}
              {filteredLessons.filter((l) => l.completed).length > 0 && (
                <motion.div variants={itemVariants} className="space-y-3">
                  <h2 className="flex items-center gap-2 font-bold text-gray-900 text-lg dark:text-white">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    Completed (
                    {filteredLessons.filter((l) => l.completed).length})
                  </h2>
                  <div className="space-y-3">
                    {filteredLessons
                      .filter((l) => l.completed)
                      .map((lesson) => (
                        <LessonCard
                          key={lesson.id}
                          lesson={lesson}
                          onClick={() => startLesson(lesson)}
                          onComplete={() => {}}
                        />
                      ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "paths" && (
            <motion.div
              key="paths"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {paths.map((path) => (
                <PathCard key={path.id} path={path} onClick={() => {}} />
              ))}
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              key="stats"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  {
                    label: "Total Lessons",
                    value: totalLessons,
                    icon: BookOpen,
                    color: "from-blue-400 to-indigo-600",
                  },
                  {
                    label: "Completed",
                    value: completedLessons,
                    icon: CheckCircle,
                    color: "from-emerald-400 to-teal-600",
                  },
                  {
                    label: "Avg Retention",
                    value: `${Math.round(averageRetention)}%`,
                    icon: Brain,
                    color: "from-purple-400 to-violet-600",
                  },
                  {
                    label: "Current Streak",
                    value: `${streak.current} days`,
                    icon: Flame,
                    color: "from-orange-400 to-red-500",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div
                      className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} mb-3 flex items-center justify-center`}
                    >
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="font-bold text-2xl text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Spaced Repetition Visualization */}
              <SpacedRepetitionViz lessons={lessons} />

              {/* Achievements */}
              <motion.div
                variants={itemVariants}
                className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                  <Award className="h-5 w-5 text-amber-500" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      title: "Week Warrior",
                      desc: "7-day learning streak",
                      unlocked: true,
                      icon: Flame,
                    },
                    {
                      title: "Biology Beginner",
                      desc: "Complete 5 biology lessons",
                      unlocked: completedLessons >= 5,
                      icon: Brain,
                    },
                    {
                      title: "Math Master",
                      desc: "Achieve 90% retention in math",
                      unlocked: false,
                      icon: Trophy,
                    },
                    {
                      title: "Explorer",
                      desc: "Try 3 different subjects",
                      unlocked:
                        new Set(
                          lessons
                            .filter((l) => l.completed)
                            .map((l) => l.subject),
                        ).size >= 3,
                      icon: Target,
                    },
                  ].map((achievement, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 rounded-xl p-3 ${achievement.unlocked ? "bg-amber-50 dark:bg-amber-900/20" : "bg-gray-50 opacity-60 dark:bg-gray-700/50"}`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${achievement.unlocked ? "bg-amber-400 text-white" : "bg-gray-300 text-gray-500 dark:bg-gray-600"}`}
                      >
                        <achievement.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm dark:text-white">
                          {achievement.title}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {achievement.desc}
                        </p>
                      </div>
                      {achievement.unlocked ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Lock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lesson Modal */}
      <AnimatePresence>
        {showLessonModal && selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowLessonModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-800"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className={`relative bg-gradient-to-br p-6 ${subjects.find((s) => s.name === selectedLesson.subject)?.color || "from-indigo-500 to-purple-600"}`}
              >
                <button
                  onClick={() => setShowLessonModal(false)}
                  className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="mb-2 flex items-center gap-3 text-sm text-white/80">
                  <span className="font-semibold uppercase tracking-wider">
                    {selectedLesson.subject}
                  </span>
                  <span>•</span>
                  <span>{selectedLesson.topic}</span>
                </div>
                <h2 className="mb-2 font-bold text-2xl text-white">
                  {selectedLesson.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedLesson.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {selectedLesson.points} points
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6 flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                  <Play className="h-16 w-16 text-gray-400" />
                </div>

                <h3 className="mb-3 font-bold text-gray-900 text-lg dark:text-white">
                  Quick Summary
                </h3>
                <p className="mb-6 text-gray-600 leading-relaxed dark:text-gray-300">
                  {selectedLesson.content}
                </p>

                {/* Progress simulation */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between text-gray-500 text-sm">
                    <span>Lesson Progress</span>
                    <span>{lessonProgress}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <motion.div
                      className={`h-full rounded-full ${lessonProgress === 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${lessonProgress}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6 flex gap-2">
                  {selectedLesson.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 text-sm dark:bg-gray-700 dark:text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      completeLesson(selectedLesson.id);
                      setShowLessonModal(false);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-semibold text-white shadow-emerald-500/25 shadow-lg"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Mark Complete
                  </button>
                  <button className="rounded-xl bg-gray-100 px-4 py-3 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    <Bookmark className="h-5 w-5" />
                  </button>
                  <button className="rounded-xl bg-gray-100 px-4 py-3 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 border-gray-200 border-l bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-xl dark:text-white">
                Notifications
              </h2>
              <button
                onClick={() => setShowNotifications(false)}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onDismiss={() => dismissNotification(notification.id)}
                />
              ))}
              {notifications.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <Bell className="mx-auto mb-3 h-12 w-12 opacity-30" />
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Celebration */}
      <AnimatePresence>
        {completedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="-translate-x-1/2 fixed bottom-6 left-1/2 z-50"
          >
            <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-white shadow-2xl">
              <Trophy className="h-6 w-6" />
              <div>
                <p className="font-bold">+50 Points!</p>
                <p className="text-xs opacity-90">Lesson completed</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
