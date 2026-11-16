import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  CheckCircle,
  Circle,
  Crown,
  Flame,
  Gift,
  Lock,
  Medal,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Unlock,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "academic" | "attendance" | "behavior" | "extracurricular";
  points: number;
  completed: boolean;
  completedAt?: string;
  progress: number;
  maxProgress: number;
}

interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  class: string;
  avatar?: string;
  totalPoints: number;
  badges: number;
  achievements: number;
  streak: number;
  trend: "up" | "down" | "same";
}

interface GamificationSystemProps {
  studentId?: string;
  className?: string;
}

const defaultBadges: Badge[] = [
  {
    id: "1",
    name: "Perfect Attendance",
    description: "Attended school for 30 consecutive days",
    icon: "calendar",
    color: "#10b981",
    points: 100,
    unlocked: true,
    unlockedAt: "2024-03-15",
  },
  {
    id: "2",
    name: "Star Student",
    description: "Scored above 90% in all subjects",
    icon: "star",
    color: "#f59e0b",
    points: 200,
    unlocked: true,
    unlockedAt: "2024-03-20",
  },
  {
    id: "3",
    name: "Quick Learner",
    description: "Complete 5 assignments before deadline",
    icon: "zap",
    color: "#3b82f6",
    points: 150,
    unlocked: false,
    progress: 3,
    maxProgress: 5,
  },
  {
    id: "4",
    name: "Helper",
    description: "Help 10 classmates with their studies",
    icon: "heart",
    color: "#ec4899",
    points: 100,
    unlocked: false,
    progress: 7,
    maxProgress: 10,
  },
  {
    id: "5",
    name: "Sports Champion",
    description: "Win 3 sports events",
    icon: "trophy",
    color: "#8b5cf6",
    points: 300,
    unlocked: false,
    progress: 1,
    maxProgress: 3,
  },
  {
    id: "6",
    name: "Reading Master",
    description: "Read 50 books from the library",
    icon: "book",
    color: "#06b6d4",
    points: 250,
    unlocked: false,
    progress: 23,
    maxProgress: 50,
  },
];

const defaultAchievements: Achievement[] = [
  {
    id: "1",
    title: "Mathematics Wizard",
    description: "Score 100% in 5 consecutive Math tests",
    category: "academic",
    points: 500,
    completed: true,
    completedAt: "2024-03-10",
    progress: 5,
    maxProgress: 5,
  },
  {
    id: "2",
    title: "Science Explorer",
    description: "Complete all Science lab experiments",
    category: "academic",
    points: 400,
    completed: false,
    progress: 8,
    maxProgress: 12,
  },
  {
    id: "3",
    title: "Perfect Week",
    description: "100% attendance for one week",
    category: "attendance",
    points: 100,
    completed: true,
    completedAt: "2024-03-18",
    progress: 7,
    maxProgress: 7,
  },
  {
    id: "4",
    title: "Early Bird",
    description: "Never late to class for a month",
    category: "attendance",
    points: 200,
    completed: false,
    progress: 18,
    maxProgress: 30,
  },
  {
    id: "5",
    title: "Helping Hand",
    description: "Volunteer for 10 school activities",
    category: "behavior",
    points: 300,
    completed: false,
    progress: 4,
    maxProgress: 10,
  },
  {
    id: "6",
    title: "Debate Champion",
    description: "Win inter-school debate competition",
    category: "extracurricular",
    points: 600,
    completed: false,
    progress: 0,
    maxProgress: 1,
  },
];

const defaultLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    studentId: "STU001",
    studentName: "Priya Sharma",
    class: "10-A",
    totalPoints: 2840,
    badges: 12,
    achievements: 8,
    streak: 45,
    trend: "up",
  },
  {
    rank: 2,
    studentId: "STU002",
    studentName: "Rahul Kumar",
    class: "10-A",
    totalPoints: 2650,
    badges: 10,
    achievements: 7,
    streak: 38,
    trend: "same",
  },
  {
    rank: 3,
    studentId: "STU003",
    studentName: "Ananya Patel",
    class: "9-B",
    totalPoints: 2520,
    badges: 9,
    achievements: 6,
    streak: 42,
    trend: "up",
  },
  {
    rank: 4,
    studentId: "STU004",
    studentName: "Vikram Singh",
    class: "10-B",
    totalPoints: 2380,
    badges: 8,
    achievements: 5,
    streak: 25,
    trend: "down",
  },
  {
    rank: 5,
    studentId: "STU005",
    studentName: "Neha Gupta",
    class: "9-A",
    totalPoints: 2210,
    badges: 7,
    achievements: 4,
    streak: 30,
    trend: "up",
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  star: Star,
  target: Target,
  zap: Zap,
  crown: Crown,
  medal: Medal,
  award: Award,
  flame: Flame,
};

export function GamificationSystem({
  studentId,
  className,
}: GamificationSystemProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "badges" | "achievements" | "leaderboard"
  >("overview");
  const [badges, setBadges] = useState<Badge[]>(defaultBadges);
  const [achievements, setAchievements] =
    useState<Achievement[]>(defaultAchievements);
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>(defaultLeaderboard);
  const [showConfetti, setShowConfetti] = useState(false);

  const totalPoints =
    badges.filter((b) => b.unlocked).reduce((sum, b) => sum + b.points, 0) +
    achievements
      .filter((a) => a.completed)
      .reduce((sum, a) => sum + a.points, 0);

  const unlockedBadges = badges.filter((b) => b.unlocked).length;
  const completedAchievements = achievements.filter((a) => a.completed).length;
  const currentStreak = 23;

  useEffect(() => {
    // Simulate checking for new unlocks
    const checkUnlocks = () => {
      const newUnlocks = badges.filter(
        (b) => !b.unlocked && b.progress === b.maxProgress,
      );
      if (newUnlocks.length > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    };

    checkUnlocks();
  }, [badges]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      academic:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      attendance:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      behavior:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      extracurricular:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
              Achievement Center
            </h2>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Track your progress and earn rewards
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 px-4 py-2 text-center dark:from-yellow-900/30 dark:to-orange-900/30">
            <div className="font-bold text-2xl text-orange-600 dark:text-orange-400">
              {totalPoints.toLocaleString()}
            </div>
            <div className="text-gray-600 text-xs dark:text-gray-400">
              Total Points
            </div>
          </div>
          <div className="rounded-xl bg-blue-50 px-4 py-2 text-center dark:bg-blue-900/30">
            <div className="font-bold text-2xl text-blue-600 dark:text-blue-400">
              {unlockedBadges}
            </div>
            <div className="text-gray-600 text-xs dark:text-gray-400">
              Badges
            </div>
          </div>
          <div className="rounded-xl bg-green-50 px-4 py-2 text-center dark:bg-green-900/30">
            <div className="font-bold text-2xl text-green-600 dark:text-green-400">
              {currentStreak}
            </div>
            <div className="text-gray-600 text-xs dark:text-gray-400">
              Day Streak
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {[
          { id: "overview", label: "Overview", icon: Target },
          { id: "badges", label: "Badges", icon: Medal },
          { id: "achievements", label: "Achievements", icon: Award },
          { id: "leaderboard", label: "Leaderboard", icon: Crown },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "bg-white text-primary shadow-sm dark:bg-gray-700"
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
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {/* Recent Badges */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <Medal className="h-5 w-5 text-yellow-500" />
                  Recent Badges
                </h3>
                <button
                  onClick={() => setActiveTab("badges")}
                  className="text-primary text-sm hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {badges
                  .filter((b) => b.unlocked)
                  .slice(0, 3)
                  .map((badge) => {
                    const Icon = iconMap[badge.icon] || Star;
                    return (
                      <div
                        key={badge.id}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                      >
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${badge.color}20` }}
                        >
                          <span style={{ color: badge.color }}>
                            <Icon className="h-5 w-5" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-900 text-sm dark:text-white">
                            {badge.name}
                          </p>
                          <p className="text-gray-500 text-xs dark:text-gray-400">
                            +{badge.points} points
                          </p>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {new Date(badge.unlockedAt!).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Next Achievements */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <Target className="h-5 w-5 text-blue-500" />
                  Next Up
                </h3>
                <button
                  onClick={() => setActiveTab("achievements")}
                  className="text-primary text-sm hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {achievements
                  .filter((a) => !a.completed)
                  .slice(0, 3)
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm dark:text-white">
                            {achievement.title}
                          </p>
                          <p className="text-gray-500 text-xs dark:text-gray-400">
                            {achievement.description}
                          </p>
                        </div>
                        <span className="font-medium text-primary text-xs">
                          +{achievement.points}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                            style={{
                              width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-gray-500 text-xs dark:text-gray-400">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Weekly Progress
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Points Earned
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      +245
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                    <div className="h-full w-3/4 rounded-full bg-green-500" />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Assignments
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      8/10
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                    <div className="h-full w-4/5 rounded-full bg-blue-500" />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Attendance
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      100%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                    <div className="h-full rounded-full bg-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "badges" && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {badges.map((badge) => {
              const Icon = iconMap[badge.icon] || Star;
              return (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-xl border-2 p-6 transition-all ${
                    badge.unlocked
                      ? "border-transparent bg-white shadow-lg dark:bg-gray-800"
                      : "border-gray-200 bg-gray-50 opacity-75 dark:border-gray-700 dark:bg-gray-800/50"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`mb-3 flex h-16 w-16 items-center justify-center rounded-2xl ${
                        badge.unlocked ? "" : "grayscale"
                      }`}
                      style={{
                        backgroundColor: badge.unlocked
                          ? `${badge.color}20`
                          : "#e5e7eb",
                      }}
                    >
                      <span
                        style={{
                          color: badge.unlocked ? badge.color : "#9ca3af",
                        }}
                      >
                        <Icon className="h-8 w-8" />
                      </span>
                    </div>
                    <h4 className="mb-1 font-semibold text-gray-900 text-sm dark:text-white">
                      {badge.name}
                    </h4>
                    <p className="mb-2 line-clamp-2 text-gray-500 text-xs dark:text-gray-400">
                      {badge.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary text-xs">
                        {badge.points} pts
                      </span>
                      {badge.unlocked ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs dark:text-green-400">
                          <Unlock className="h-3 w-3" />
                          Unlocked
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <Lock className="h-3 w-3" />
                          Locked
                        </span>
                      )}
                    </div>
                    {!badge.unlocked && badge.progress !== undefined && (
                      <div className="mt-3 w-full">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                            <div
                              className="h-full rounded-full bg-gray-400"
                              style={{
                                width: `${(badge.progress / (badge.maxProgress || 1)) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-gray-500 text-xs">
                            {badge.progress}/{badge.maxProgress}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === "achievements" && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`rounded-xl border p-4 transition-all ${
                  achievement.completed
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                      achievement.completed
                        ? "bg-green-100 dark:bg-green-900/50"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {achievement.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {achievement.title}
                        </h4>
                        <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 font-medium text-xs ${getCategoryColor(
                            achievement.category,
                          )}`}
                        >
                          {achievement.category}
                        </span>
                        <span className="font-medium text-primary text-sm">
                          +{achievement.points}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                        <div
                          className={`h-full rounded-full transition-all ${
                            achievement.completed
                              ? "bg-green-500"
                              : "bg-gradient-to-r from-blue-500 to-blue-600"
                          }`}
                          style={{
                            width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-gray-500 text-sm dark:text-gray-400">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                      {achievement.completed && achievement.completedAt && (
                        <span className="text-green-600 text-xs dark:text-green-400">
                          Completed{" "}
                          {new Date(
                            achievement.completedAt,
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="border-gray-200 border-b p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Top Performers
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Filter:
                  </span>
                  <select className="rounded-lg border-0 bg-gray-100 text-sm dark:bg-gray-700">
                    <option>All Classes</option>
                    <option>Class 10</option>
                    <option>Class 9</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.studentId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 ${
                    entry.rank <= 3
                      ? "bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-900/10"
                      : ""
                  }`}
                >
                  {/* Rank */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm ${
                      entry.rank === 1
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400"
                        : entry.rank === 2
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                          : entry.rank === 3
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400"
                            : "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                    }`}
                  >
                    {entry.rank}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-semibold text-sm text-white">
                      {entry.studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {entry.studentName}
                      </p>
                      <p className="text-gray-500 text-xs dark:text-gray-400">
                        {entry.class}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden items-center gap-6 text-sm sm:flex">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {entry.totalPoints.toLocaleString()}
                      </div>
                      <div className="text-gray-500 text-xs dark:text-gray-400">
                        Points
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {entry.badges}
                      </div>
                      <div className="text-gray-500 text-xs dark:text-gray-400">
                        Badges
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {entry.streak}
                      </div>
                      <div className="text-gray-500 text-xs dark:text-gray-400">
                        Streak
                      </div>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className="flex items-center gap-1">
                    {entry.trend === "up" && (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                    {entry.trend === "down" && (
                      <TrendingUp className="h-4 w-4 rotate-180 text-red-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Shop Teaser */}
      <div className="mt-8 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
              <Gift className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Reward Shop Coming Soon!</h3>
              <p className="text-white/80">
                Redeem your points for cool rewards, privileges, and special
                perks
              </p>
            </div>
          </div>
          <div className="hidden text-right md:block">
            <div className="font-bold text-3xl">
              {totalPoints.toLocaleString()}
            </div>
            <div className="text-white/80">Points Available</div>
          </div>
        </div>
      </div>
    </div>
  );
}
