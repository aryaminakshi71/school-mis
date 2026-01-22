export type BadgeCategory =
  | "academic"
  | "attendance"
  | "participation"
  | "special"
  | "milestone"
  | "streak";
export type AchievementType = "badge" | "streak" | "level" | "title" | "points";

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: string;
  requirement: string;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  badgeId?: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  points: number;
  completedAt?: Date;
  unlocked: boolean;
}

export interface Streak {
  type: "attendance" | "homework" | "reading" | "exam";
  currentStreak: number;
  longestStreak: number;
  lastUpdated: Date;
  milestones: number[];
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  role: string;
  points: number;
  rank: number;
  badges: number;
  streak: number;
}

export interface UserLevel {
  level: number;
  title: string;
  currentXp: number;
  requiredXp: number;
  progress: number;
}

export interface GamificationStats {
  totalPoints: number;
  totalBadges: number;
  currentLevel: number;
  totalStreak: number;
  rank: number;
  percentile: number;
}

const BADGES: Omit<Badge, "unlockedAt">[] = [
  {
    id: "badge_first_login",
    name: "First Steps",
    description: "Complete your first login",
    category: "milestone",
    icon: "👶",
    requirement: "Log in for the first time",
    points: 10,
    rarity: "common",
  },
  {
    id: "badge_perfect_attendance_week",
    name: "Week Warrior",
    description: "Maintain perfect attendance for a week",
    category: "attendance",
    icon: "📅",
    requirement: "100% attendance for 5 consecutive days",
    points: 50,
    rarity: "common",
  },
  {
    id: "badge_perfect_attendance_month",
    name: "Monthly Master",
    description: "Maintain perfect attendance for a month",
    category: "attendance",
    icon: "🏆",
    requirement: "100% attendance for 20+ days in a month",
    points: 200,
    rarity: "rare",
  },
  {
    id: "badge_homework_champion",
    name: "Homework Hero",
    description: "Submit 10 homework assignments on time",
    category: "participation",
    icon: "📚",
    requirement: "Submit 10 homework assignments before deadline",
    points: 75,
    rarity: "common",
  },
  {
    id: "badge_homework_streak",
    name: "Consistent Learner",
    description: "Submit homework on time for 30 days",
    category: "participation",
    icon: "🔥",
    requirement: "30-day homework submission streak",
    points: 150,
    rarity: "rare",
  },
  {
    id: "badge_top_scorer",
    name: "Top Scorer",
    description: "Score 95%+ in an exam",
    category: "academic",
    icon: "⭐",
    requirement: "Achieve 95% or above in any exam",
    points: 100,
    rarity: "rare",
  },
  {
    id: "badge_perfect_score",
    name: "Perfectionist",
    description: "Score 100% in an exam",
    category: "academic",
    icon: "💯",
    requirement: "Achieve 100% score in any exam",
    points: 250,
    rarity: "epic",
  },
  {
    id: "badge_class_topper",
    name: "Class Topper",
    description: "Rank #1 in your class",
    category: "academic",
    icon: "👑",
    requirement: "Achieve first rank in class average",
    points: 500,
    rarity: "epic",
  },
  {
    id: "badge_math_wizard",
    name: "Math Wizard",
    description: "Score 100% in 5 math exams",
    category: "academic",
    icon: "🧮",
    requirement: "100% score in 5 mathematics exams",
    points: 300,
    rarity: "epic",
  },
  {
    id: "badge_science_star",
    name: "Science Star",
    description: "Complete 20 science experiments",
    category: "participation",
    icon: "🔬",
    requirement: "Participate in 20 science practicals/experiments",
    points: 150,
    rarity: "rare",
  },
  {
    id: "badge_reader",
    name: "Avid Reader",
    description: "Read 10 library books",
    category: "participation",
    icon: "📖",
    requirement: "Borrow and return 10 books from library",
    points: 100,
    rarity: "common",
  },
  {
    id: "badge_early_bird",
    name: "Early Bird",
    description: "Arrive early to school 10 times",
    category: "attendance",
    icon: "🐦",
    requirement: "Arrive at school before 7:30 AM, 10 times",
    points: 75,
    rarity: "common",
  },
  {
    id: "badge_leader",
    name: "Class Leader",
    description: "Be elected as class representative",
    category: "special",
    icon: "📣",
    requirement: "Get elected as class representative",
    points: 200,
    rarity: "rare",
  },
  {
    id: "badge_event_organizer",
    name: "Event Organizer",
    description: "Organize or help in 5 school events",
    category: "special",
    icon: "🎪",
    requirement: "Participate in organizing 5 school events",
    points: 200,
    rarity: "rare",
  },
  {
    id: "badge_mentor",
    name: "Peer Mentor",
    description: "Help 5 classmates improve their grades",
    category: "special",
    icon: "🤝",
    requirement: "Provide academic help to 5 classmates",
    points: 250,
    rarity: "epic",
  },
  {
    id: "badge_100_points",
    name: "Century",
    description: "Earn 100 points",
    category: "milestone",
    icon: "💯",
    requirement: "Earn 100 total points",
    points: 100,
    rarity: "common",
  },
  {
    id: "badge_500_points",
    name: "Half Thousand",
    description: "Earn 500 points",
    category: "milestone",
    icon: "🎯",
    requirement: "Earn 500 total points",
    points: 200,
    rarity: "rare",
  },
  {
    id: "badge_1000_points",
    name: "Millennial",
    description: "Earn 1000 points",
    category: "milestone",
    icon: "🚀",
    requirement: "Earn 1000 total points",
    points: 300,
    rarity: "epic",
  },
  {
    id: "badge_5000_points",
    name: "Legend",
    description: "Earn 5000 points",
    category: "milestone",
    icon: "🏅",
    requirement: "Earn 5000 total points",
    points: 1000,
    rarity: "legendary",
  },
  {
    id: "badge_30_day_streak",
    name: "Unstoppable",
    description: "Maintain a 30-day streak",
    category: "streak",
    icon: "⚡",
    requirement: "Maintain any streak for 30 days",
    points: 300,
    rarity: "epic",
  },
  {
    id: "badge_100_day_streak",
    name: "Century Streak",
    description: "Maintain a 100-day streak",
    category: "streak",
    icon: "🌟",
    requirement: "Maintain any streak for 100 days",
    points: 1000,
    rarity: "legendary",
  },
];

const LEVELS = [
  { level: 1, title: "Newcomer", requiredXp: 0 },
  { level: 2, title: "Beginner", requiredXp: 100 },
  { level: 3, title: "Learner", requiredXp: 250 },
  { level: 4, title: "Explorer", requiredXp: 500 },
  { level: 5, title: "Achiever", requiredXp: 800 },
  { level: 6, title: "Scholar", requiredXp: 1200 },
  { level: 7, title: "Expert", requiredXp: 1700 },
  { level: 8, title: "Master", requiredXp: 2300 },
  { level: 9, title: "Champion", requiredXp: 3000 },
  { level: 10, title: "Legend", requiredXp: 5000 },
];

function calculateXpForLevel(level: number): number {
  return LEVELS[level - 1]?.requiredXp || 0;
}

class GamificationService {
  private achievements: Achievement[] = [];
  private streaks: Map<string, Streak> = new Map();
  private points: number = 0;
  private level: number = 1;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem("gamification_data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.achievements = (data.achievements || []).map((a: any) => ({
          ...a,
          completedAt: a.completedAt ? new Date(a.completedAt) : undefined,
          lastUpdated: new Date(a.lastUpdated),
        }));
        this.streaks = new Map(Object.entries(data.streaks || {}));
        this.points = data.points || 0;
        this.level = data.level || 1;
      } catch {
        this.initializeDefaults();
      }
    } else {
      this.initializeDefaults();
    }
  }

  private initializeDefaults() {
    this.achievements = [];
    this.streaks = new Map([
      [
        "attendance",
        {
          type: "attendance",
          currentStreak: 0,
          longestStreak: 0,
          lastUpdated: new Date(),
          milestones: [7, 30, 100],
        },
      ],
      [
        "homework",
        {
          type: "homework",
          currentStreak: 0,
          longestStreak: 0,
          lastUpdated: new Date(),
          milestones: [7, 30, 50],
        },
      ],
      [
        "reading",
        {
          type: "reading",
          currentStreak: 0,
          longestStreak: 0,
          lastUpdated: new Date(),
          milestones: [7, 14, 30],
        },
      ],
      [
        "exam",
        {
          type: "exam",
          currentStreak: 0,
          longestStreak: 0,
          lastUpdated: new Date(),
          milestones: [5, 10, 20],
        },
      ],
    ]);
    this.points = 0;
    this.level = 1;
    this.saveToStorage();
  }

  private saveToStorage() {
    const data = {
      achievements: this.achievements,
      streaks: Object.fromEntries(this.streaks),
      points: this.points,
      level: this.level,
    };
    localStorage.setItem("gamification_data", JSON.stringify(data));
  }

  getUserLevel(): UserLevel {
    const currentLevelData = LEVELS[this.level - 1];
    const nextLevelData = LEVELS[this.level];
    const currentXp = this.points - calculateXpForLevel(this.level);
    const requiredXp = nextLevelData
      ? calculateXpForLevel(this.level + 1) - calculateXpForLevel(this.level)
      : 0;

    return {
      level: this.level,
      title: currentLevelData?.title || "Newcomer",
      currentXp,
      requiredXp,
      progress: nextLevelData ? (currentXp / requiredXp) * 100 : 100,
    };
  }

  getAllBadges(): Badge[] {
    return BADGES.map((badge) => {
      const unlocked = this.achievements.find(
        (a) => a.badgeId === badge.id && a.unlocked,
      );
      return {
        ...badge,
        unlockedAt: unlocked?.completedAt,
      };
    });
  }

  getUnlockedBadges(): Badge[] {
    return this.getAllBadges().filter((b) => b.unlockedAt);
  }

  getLockedBadges(): Badge[] {
    return this.getAllBadges().filter((b) => !b.unlockedAt);
  }

  unlockBadge(badgeId: string): boolean {
    const badge = BADGES.find((b) => b.id === badgeId);
    if (!badge) return false;

    const existing = this.achievements.find((a) => a.badgeId === badgeId);
    if (existing?.unlocked) return false;

    const achievement: Achievement = {
      id: `ach_${Date.now()}`,
      userId: "current_user",
      type: "badge",
      badgeId,
      title: badge.name,
      description: badge.description,
      progress: 100,
      target: 100,
      points: badge.points,
      completedAt: new Date(),
      unlocked: true,
    };

    this.achievements.push(achievement);
    this.points += badge.points;
    this.checkLevelUp();
    this.saveToStorage();

    return true;
  }

  addPoints(amount: number, reason: string): void {
    this.points += amount;
    this.checkLevelUp();
    this.saveToStorage();

    const achievement: Achievement = {
      id: `ach_${Date.now()}`,
      userId: "current_user",
      type: "points",
      title: "Points Earned",
      description: reason,
      progress: amount,
      target: amount,
      points: amount,
      unlocked: true,
    };
    this.achievements.push(achievement);
  }

  private checkLevelUp(): void {
    for (let l = this.level; l <= LEVELS.length; l++) {
      if (this.points >= calculateXpForLevel(l)) {
        this.level = l;
      }
    }
  }

  updateStreak(type: Streak["type"], active: boolean): void {
    const streak = this.streaks.get(type);
    if (!streak) return;

    const today = new Date().toDateString();
    const lastUpdate = new Date(streak.lastUpdated).toDateString();

    if (today === lastUpdate) return;

    streak.lastUpdated = new Date();

    if (active) {
      streak.currentStreak++;

      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }

      streak.milestones.forEach((milestone) => {
        if (streak.currentStreak === milestone) {
          const badgeId = `badge_${type}_streak_${milestone}`;
          this.unlockBadge(badgeId);
        }
      });
    } else {
      streak.currentStreak = 0;
    }

    this.saveToStorage();
  }

  getStreak(type: Streak["type"]): Streak | undefined {
    return this.streaks.get(type);
  }

  getAllStreaks(): Streak[] {
    return Array.from(this.streaks.values());
  }

  getTotalStreak(): number {
    return Array.from(this.streaks.values()).reduce(
      (sum, s) => sum + s.currentStreak,
      0,
    );
  }

  getAchievements(): Achievement[] {
    return [...this.achievements].sort(
      (a, b) =>
        new Date(b.completedAt || 0).getTime() -
        new Date(a.completedAt || 0).getTime(),
    );
  }

  getRecentAchievements(limit: number = 5): Achievement[] {
    return this.getAchievements().slice(0, limit);
  }

  getLeaderboard(role?: string): LeaderboardEntry[] {
    const mockData: LeaderboardEntry[] = [
      {
        userId: "u1",
        userName: "Aryan Sharma",
        role: "student",
        points: 2450,
        rank: 1,
        badges: 12,
        streak: 45,
      },
      {
        userId: "u2",
        userName: "Priya Patel",
        role: "student",
        points: 2280,
        rank: 2,
        badges: 11,
        streak: 38,
      },
      {
        userId: "u3",
        userName: "Rahul Kumar",
        role: "student",
        points: 2100,
        rank: 3,
        badges: 10,
        streak: 30,
      },
      {
        userId: "u4",
        userName: "Sneha Gupta",
        role: "student",
        points: 1950,
        rank: 4,
        badges: 9,
        streak: 28,
      },
      {
        userId: "u5",
        userName: "Vikash Singh",
        role: "student",
        points: 1800,
        rank: 5,
        badges: 8,
        streak: 25,
      },
      {
        userId: "current_user",
        userName: "John Smith",
        role: "student",
        points: this.points,
        rank: 6,
        badges: this.getUnlockedBadges().length,
        streak: this.getTotalStreak(),
      },
      {
        userId: "u7",
        userName: "Ananya Reddy",
        role: "student",
        points: 1650,
        rank: 7,
        badges: 7,
        streak: 22,
      },
      {
        userId: "u8",
        userName: "Mohit Agarwal",
        role: "student",
        points: 1500,
        rank: 8,
        badges: 6,
        streak: 20,
      },
      {
        userId: "u9",
        userName: "Kavya Nair",
        role: "student",
        points: 1400,
        rank: 9,
        badges: 6,
        streak: 18,
      },
      {
        userId: "u10",
        userName: "Rohan Das",
        role: "student",
        points: 1300,
        rank: 10,
        badges: 5,
        streak: 15,
      },
    ];

    let leaderboard = mockData.filter(
      (entry) => entry.userId !== "current_user",
    );

    const currentUserEntry = mockData.find((e) => e.userId === "current_user");
    if (currentUserEntry) {
      const insertIndex = leaderboard.findIndex(
        (e) => e.points < currentUserEntry.points,
      );
      if (insertIndex !== -1) {
        leaderboard.splice(insertIndex, 0, currentUserEntry);
      } else {
        leaderboard.push(currentUserEntry);
      }

      leaderboard = leaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
    }

    if (role) {
      leaderboard = leaderboard.filter((e) => e.role === role);
    }

    return leaderboard;
  }

  getGamificationStats(): GamificationStats {
    const leaderboard = this.getLeaderboard();
    const currentUserRank =
      leaderboard.findIndex((e) => e.userId === "current_user") + 1;
    const percentile = Math.round(
      ((leaderboard.length - currentUserRank) / leaderboard.length) * 100,
    );

    return {
      totalPoints: this.points,
      totalBadges: this.getUnlockedBadges().length,
      currentLevel: this.level,
      totalStreak: this.getTotalStreak(),
      rank: currentUserRank,
      percentile,
    };
  }

  resetProgress(): void {
    this.initializeDefaults();
  }

  getProgressForBadge(badgeId: string): number {
    const badge = BADGES.find((b) => b.id === badgeId);
    if (!badge) return 0;

    const existing = this.achievements.find((a) => a.badgeId === badgeId);
    if (existing?.unlocked) return 100;

    switch (badgeId) {
      case "badge_top_scorer":
        return this.hasHighScore() ? 100 : 0;
      case "badge_perfect_score":
        return this.hasPerfectScore() ? 100 : 0;
      case "badge_reader":
        return this.getBooksRead() * 10;
      case "badge_homework_champion":
        return this.getHomeworkSubmitted() * 10;
      default:
        return 0;
    }
  }

  private hasHighScore(): boolean {
    return this.achievements.some(
      (a) => a.badgeId === "badge_top_scorer" && a.unlocked,
    );
  }

  private hasPerfectScore(): boolean {
    return this.achievements.some(
      (a) => a.badgeId === "badge_perfect_score" && a.unlocked,
    );
  }

  private getBooksRead(): number {
    return (
      this.achievements.filter((a) => a.title === "Avid Reader" && a.unlocked)
        .length * 10
    );
  }

  private getHomeworkSubmitted(): number {
    return (
      this.achievements.filter((a) => a.title === "Homework Hero" && a.unlocked)
        .length * 10
    );
  }
}

export const gamificationService = new GamificationService();

export function useGamification() {
  return {
    getUserLevel: gamificationService.getUserLevel.bind(gamificationService),
    getAllBadges: gamificationService.getAllBadges.bind(gamificationService),
    getUnlockedBadges:
      gamificationService.getUnlockedBadges.bind(gamificationService),
    getLockedBadges:
      gamificationService.getLockedBadges.bind(gamificationService),
    unlockBadge: gamificationService.unlockBadge.bind(gamificationService),
    addPoints: gamificationService.addPoints.bind(gamificationService),
    updateStreak: gamificationService.updateStreak.bind(gamificationService),
    getStreak: gamificationService.getStreak.bind(gamificationService),
    getAllStreaks: gamificationService.getAllStreaks.bind(gamificationService),
    getAchievements:
      gamificationService.getAchievements.bind(gamificationService),
    getRecentAchievements:
      gamificationService.getRecentAchievements.bind(gamificationService),
    getLeaderboard:
      gamificationService.getLeaderboard.bind(gamificationService),
    getGamificationStats:
      gamificationService.getGamificationStats.bind(gamificationService),
    getProgressForBadge:
      gamificationService.getProgressForBadge.bind(gamificationService),
    resetProgress: gamificationService.resetProgress.bind(gamificationService),
  };
}

export { BADGES, LEVELS };
export default gamificationService;
