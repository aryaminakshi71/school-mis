import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Medal,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";

export type SportCategory =
  | "cricket"
  | "football"
  | "basketball"
  | "badminton"
  | "tennis"
  | "athletics"
  | "swimming"
  | "volleyball";

export interface SportEvent {
  id: string;
  name: string;
  category: SportCategory;
  date: Date;
  venue: string;
  description: string;
  participants: string[];
  maxParticipants: number;
  status: "upcoming" | "ongoing" | "completed";
  results?: EventResult[];
}

export interface EventResult {
  position: number;
  studentId: string;
  studentName: string;
  class: string;
  record?: string;
  points: number;
}

export interface StudentAchievement {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  sport: SportCategory;
  achievement: string;
  level: "school" | "district" | "state" | "national" | "international";
  date: Date;
  certificate?: string;
}

export interface SportsEquipment {
  id: string;
  name: string;
  category: SportCategory;
  quantity: number;
  condition: "excellent" | "good" | "fair" | "poor";
  lastMaintenance?: Date;
  purchaseDate: Date;
}

interface SportsManagementProps {
  onCreateEvent: (
    event: Omit<SportEvent, "id" | "participants">,
  ) => Promise<void>;
  onRegisterParticipant: (eventId: string, studentId: string) => Promise<void>;
  onAddAchievement: (
    achievement: Omit<StudentAchievement, "id">,
  ) => Promise<void>;
  onUpdateResults: (eventId: string, results: EventResult[]) => Promise<void>;
}

const SPORTS: { id: SportCategory; name: string; icon: string }[] = [
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "football", name: "Football", icon: "⚽" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "badminton", name: "Badminton", icon: "🏸" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
  { id: "athletics", name: "Athletics", icon: "🏃" },
  { id: "swimming", name: "Swimming", icon: "🏊" },
  { id: "volleyball", name: "Volleyball", icon: "🏐" },
];

export function SportsManagement({
  onCreateEvent,
  onRegisterParticipant,
  onAddAchievement,
  onUpdateResults,
}: SportsManagementProps) {
  const [activeTab, setActiveTab] = useState<
    "events" | "achievements" | "equipment"
  >("events");
  const [selectedSport, setSelectedSport] = useState<SportCategory | "all">(
    "all",
  );
  const [events, setEvents] = useState<SportEvent[]>([
    {
      id: "1",
      name: "Inter-House Cricket Tournament",
      category: "cricket",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      venue: "School Cricket Ground",
      description: "Annual inter-house cricket competition for classes 8-12",
      participants: ["s1", "s2", "s3"],
      maxParticipants: 22,
      status: "upcoming",
    },
    {
      id: "2",
      name: "District Athletics Meet",
      category: "athletics",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      venue: "District Stadium",
      description: "District level athletics competition",
      participants: ["s4", "s5"],
      maxParticipants: 20,
      status: "completed",
      results: [
        {
          position: 1,
          studentId: "s4",
          studentName: "Rahul Sharma",
          class: "10-A",
          record: "100m - 11.2s",
          points: 10,
        },
        {
          position: 2,
          studentId: "s5",
          studentName: "Priya Patel",
          class: "10-A",
          record: "Long Jump - 4.8m",
          points: 8,
        },
      ],
    },
  ]);

  const [achievements, setAchievements] = useState<StudentAchievement[]>([
    {
      id: "1",
      studentId: "s4",
      studentName: "Rahul Sharma",
      class: "10-A",
      sport: "athletics",
      achievement: "Gold Medal - 100m Sprint",
      level: "district",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      studentId: "s5",
      studentName: "Priya Patel",
      class: "10-A",
      sport: "badminton",
      achievement: "State Champion",
      level: "state",
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [equipment, setEquipment] = useState<SportsEquipment[]>([
    {
      id: "1",
      name: "Cricket Bats",
      category: "cricket",
      quantity: 15,
      condition: "good",
      purchaseDate: new Date("2023-01-15"),
    },
    {
      id: "2",
      name: "Footballs",
      category: "football",
      quantity: 20,
      condition: "excellent",
      purchaseDate: new Date("2023-06-20"),
    },
    {
      id: "3",
      name: "Badminton Rackets",
      category: "badminton",
      quantity: 30,
      condition: "fair",
      lastMaintenance: new Date("2024-01-10"),
      purchaseDate: new Date("2022-08-05"),
    },
  ]);

  const filteredEvents = events.filter(
    (e) => selectedSport === "all" || e.category === selectedSport,
  );

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      school: "bg-gray-100 text-gray-700",
      district: "bg-blue-100 text-blue-700",
      state: "bg-yellow-100 text-yellow-700",
      national: "bg-orange-100 text-orange-700",
      international: "bg-purple-100 text-purple-700",
    };
    return colors[level] || colors.school;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Trophy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                Sports Management
              </h2>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Events, achievements, and equipment tracking
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {["events", "achievements", "equipment"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`rounded-lg px-4 py-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "events" && (
          <div className="space-y-6">
            {/* Sport Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedSport("all")}
                className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                  selectedSport === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                All Sports
              </button>
              {SPORTS.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => setSelectedSport(sport.id)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                    selectedSport === sport.id
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  <span className="mr-1">{sport.icon}</span>
                  {sport.name}
                </button>
              ))}
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {event.name}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-1 text-xs capitalize ${
                            event.status === "upcoming"
                              ? "bg-blue-100 text-blue-700"
                              : event.status === "ongoing"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <p className="mb-3 text-gray-600 text-sm dark:text-gray-400">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-gray-600 text-sm dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.venue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.participants.length}/{event.maxParticipants}{" "}
                          registered
                        </span>
                      </div>

                      {event.results && (
                        <div className="mt-4 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                          <h4 className="mb-2 flex items-center gap-2 font-medium text-emerald-900 dark:text-emerald-300">
                            <Medal className="h-4 w-4" />
                            Results
                          </h4>
                          <div className="space-y-1">
                            {event.results.map((result, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 text-sm"
                              >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 font-bold text-xs text-yellow-700">
                                  #{result.position}
                                </span>
                                <span className="font-medium">
                                  {result.studentName}
                                </span>
                                <span className="text-gray-500">
                                  {result.record}
                                </span>
                                <span className="ml-auto font-medium text-emerald-600">
                                  +{result.points} pts
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {event.status === "upcoming" && (
                      <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90">
                        Register
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-4 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <div className="text-3xl">🏆</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {achievement.studentName}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {achievement.class}
                      </p>
                    </div>
                  </div>
                  <p className="mb-2 font-medium text-gray-800 text-sm dark:text-gray-200">
                    {achievement.achievement}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-1 text-xs uppercase ${getLevelColor(achievement.level)}`}
                    >
                      {achievement.level}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {achievement.date.toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Hall of Fame Stats */}
            <div className="mt-8 rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <TrendingUp className="h-5 w-5" />
                Sports Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="font-bold text-3xl text-primary">
                    {achievements.length}
                  </p>
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    Total Achievements
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-3xl text-emerald-600">
                    {
                      achievements.filter(
                        (a) => a.level === "state" || a.level === "national",
                      ).length
                    }
                  </p>
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    State/National Level
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-3xl text-blue-600">
                    {new Set(achievements.map((a) => a.studentId)).size}
                  </p>
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    Student Athletes
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-3xl text-orange-600">
                    {SPORTS.length}
                  </p>
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    Sports Offered
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "equipment" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {equipment.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.name}
                    </h4>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        item.condition === "excellent"
                          ? "bg-green-100 text-green-700"
                          : item.condition === "good"
                            ? "bg-blue-100 text-blue-700"
                            : item.condition === "fair"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.condition}
                    </span>
                  </div>
                  <p className="mb-3 text-gray-500 text-sm">
                    {SPORTS.find((s) => s.id === item.category)?.name}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Quantity
                      </span>
                      <span className="font-medium">{item.quantity} units</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Purchased
                      </span>
                      <span>{item.purchaseDate.toLocaleDateString()}</span>
                    </div>
                    {item.lastMaintenance && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Last Service
                        </span>
                        <span>{item.lastMaintenance.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SportsManagement;
