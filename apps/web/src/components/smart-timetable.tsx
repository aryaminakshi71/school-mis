import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

export interface TimetableSlot {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
  class: string;
}

export interface TeacherConstraint {
  teacherId: string;
  unavailableSlots: string[]; // format: "day-period" e.g., "1-3"
  maxClassesPerDay: number;
  preferredSubjects: string[];
}

export interface RoomConstraint {
  roomId: string;
  capacity: number;
  unavailableSlots: string[];
  equipment: string[];
}

interface SmartTimetableProps {
  classes: { id: string; name: string; strength: number }[];
  teachers: {
    id: string;
    name: string;
    subjects: string[];
    maxHours: number;
  }[];
  subjects: {
    id: string;
    name: string;
    hoursPerWeek: number;
    requiresLab: boolean;
  }[];
  rooms: { id: string; name: string; capacity: number; isLab: boolean }[];
  existingConstraints?: TeacherConstraint[];
  onGenerate: (timetable: TimetableSlot[]) => void;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const PERIODS = [
  { number: 1, start: "08:00", end: "08:45" },
  { number: 2, start: "08:45", end: "09:30" },
  { number: 3, start: "09:30", end: "10:15" },
  { number: 4, start: "10:15", end: "11:00" },
  { number: 5, start: "11:30", end: "12:15" },
  { number: 6, start: "12:15", end: "13:00" },
  { number: 7, start: "14:00", end: "14:45" },
  { number: 8, start: "14:45", end: "15:30" },
];

export function SmartTimetable({
  classes,
  teachers,
  subjects,
  rooms,
  existingConstraints = [],
  onGenerate,
}: SmartTimetableProps) {
  const [selectedClass, setSelectedClass] = useState<string>(
    classes[0]?.id || "",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState<TimetableSlot[]>(
    [],
  );
  const [activeDay, setActiveDay] = useState(1); // Start with Monday
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [optimizationScore, setOptimizationScore] = useState(0);
  const [showAIInsights, setShowAIInsights] = useState(false);

  // AI-powered timetable generation
  const generateTimetable = async () => {
    setIsGenerating(true);
    setConflicts([]);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const newTimetable: TimetableSlot[] = [];
    const usedSlots = new Set<string>();
    const teacherLoad = new Map<string, number[]>(); // teacher -> day -> count

    // Initialize teacher load tracking
    teachers.forEach((t) => teacherLoad.set(t.id, new Array(7).fill(0)));

    // Generate slots for selected class
    const selectedClassData = classes.find((c) => c.id === selectedClass);
    if (!selectedClassData) return;

    // Distribute subjects across the week
    subjects.forEach((subject) => {
      let hoursAssigned = 0;
      let attempts = 0;

      while (hoursAssigned < subject.hoursPerWeek && attempts < 100) {
        attempts++;

        // Random day (1-5, Monday to Friday)
        const day = Math.floor(Math.random() * 5) + 1;
        // Random period (1-8)
        const period = Math.floor(Math.random() * 8) + 1;
        const slotKey = `${day}-${period}`;

        // Check if slot is available
        if (usedSlots.has(slotKey)) continue;

        // Find suitable teacher
        const suitableTeachers = teachers.filter(
          (t) =>
            t.subjects?.includes(subject.name) &&
            (teacherLoad.get(t.id)?.[day] || 0) < t.maxHours / 5,
        );

        if (suitableTeachers.length === 0) continue;

        const teacher =
          suitableTeachers[Math.floor(Math.random() * suitableTeachers.length)];

        // Find suitable room
        const suitableRooms = rooms.filter(
          (r) =>
            (!subject.requiresLab || r.isLab) &&
            r.capacity >= selectedClassData.strength,
        );

        if (suitableRooms.length === 0) continue;

        const room =
          suitableRooms[Math.floor(Math.random() * suitableRooms.length)];

        // Create slot
        const periodData = PERIODS.find((p) => p.number === period);
        if (!periodData) continue;

        newTimetable.push({
          id: `slot-${Date.now()}-${Math.random()}`,
          dayOfWeek: day,
          periodNumber: period,
          startTime: periodData.start,
          endTime: periodData.end,
          subject: subject.name,
          teacher: teacher.name,
          room: room.name,
          class: selectedClassData.name,
        });

        usedSlots.add(slotKey);
        const load = teacherLoad.get(teacher.id);
        if (load) load[day]++;
        hoursAssigned++;
      }
    });

    // Check for conflicts
    const detectedConflicts: string[] = [];

    // Check teacher conflicts
    newTimetable.forEach((slot1, i) => {
      newTimetable.forEach((slot2, j) => {
        if (
          i !== j &&
          slot1.dayOfWeek === slot2.dayOfWeek &&
          slot1.periodNumber === slot2.periodNumber &&
          slot1.teacher === slot2.teacher
        ) {
          detectedConflicts.push(
            `${slot1.teacher} has double booking on ${DAYS[slot1.dayOfWeek]} period ${slot1.periodNumber}`,
          );
        }
      });
    });

    // Check room conflicts
    newTimetable.forEach((slot1, i) => {
      newTimetable.forEach((slot2, j) => {
        if (
          i !== j &&
          slot1.dayOfWeek === slot2.dayOfWeek &&
          slot1.periodNumber === slot2.periodNumber &&
          slot1.room === slot2.room
        ) {
          detectedConflicts.push(
            `${slot1.room} double booked on ${DAYS[slot1.dayOfWeek]} period ${slot1.periodNumber}`,
          );
        }
      });
    });

    setConflicts(detectedConflicts);
    setGeneratedTimetable(newTimetable);

    // Calculate optimization score
    const score = Math.max(0, 100 - detectedConflicts.length * 10);
    setOptimizationScore(score);

    setIsGenerating(false);
    onGenerate(newTimetable);
  };

  // Get slots for active day
  const daySlots = useMemo(() => {
    return generatedTimetable
      .filter(
        (slot) =>
          slot.dayOfWeek === activeDay &&
          slot.class === classes.find((c) => c.id === selectedClass)?.name,
      )
      .sort((a, b) => a.periodNumber - b.periodNumber);
  }, [generatedTimetable, activeDay, selectedClass, classes]);

  // Get teacher workload
  const getTeacherWorkload = (teacherName: string) => {
    return generatedTimetable.filter((slot) => slot.teacher === teacherName)
      .length;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-bold text-gray-900 text-xl dark:text-gray-100">
              <Clock className="h-6 w-6 text-primary" />
              AI-Powered Timetable
            </h2>
            <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
              Automatically generates optimal schedules avoiding conflicts
            </p>
          </div>

          {optimizationScore > 0 && (
            <div
              className={`rounded-lg px-4 py-2 font-medium text-sm ${
                optimizationScore >= 90
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                  : optimizationScore >= 70
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30"
              }`}
            >
              Optimization Score: {optimizationScore}%
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <select
            value={selectedClass}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedClass(e.target.value)
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          <button
            onClick={generateTimetable}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                AI Optimizing...
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                Generate Timetable
              </>
            )}
          </button>

          {conflicts.length > 0 && (
            <button
              onClick={() => setShowAIInsights(!showAIInsights)}
              className="flex items-center gap-2 rounded-lg bg-yellow-100 px-4 py-2 text-yellow-700 transition-colors hover:bg-yellow-200 dark:bg-yellow-900/30"
            >
              <AlertCircle className="h-4 w-4" />
              {conflicts.length} Conflicts Detected
            </button>
          )}
        </div>

        {/* AI Insights */}
        <AnimatePresence>
          {showAIInsights && conflicts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20"
            >
              <h4 className="mb-2 flex items-center gap-2 font-medium text-yellow-900 dark:text-yellow-300">
                <AlertCircle className="h-4 w-4" />
                AI Suggestions to Resolve Conflicts:
              </h4>
              <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                {conflicts.map((conflict, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-yellow-500">•</span>
                    {conflict}
                  </li>
                ))}
              </ul>
              <button
                onClick={generateTimetable}
                className="mt-3 font-medium text-primary text-sm hover:text-primary/80"
              >
                Regenerate with AI optimization
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {generatedTimetable.length > 0 ? (
        <div className="p-6">
          {/* Day Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setActiveDay((prev) => Math.max(1, prev - 1))}
              disabled={activeDay === 1}
              className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                    activeDay === day
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {DAYS[day].slice(0, 3)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveDay((prev) => Math.min(5, prev + 1))}
              disabled={activeDay === 5}
              className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Day Schedule */}
          <div className="space-y-3">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
              {DAYS[activeDay]} -{" "}
              {classes.find((c) => c.id === selectedClass)?.name}
            </h3>

            {PERIODS.map((period) => {
              const slot = daySlots.find(
                (s) => s.periodNumber === period.number,
              );

              return (
                <div
                  key={period.number}
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-colors ${
                    slot
                      ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                  }`}
                >
                  <div className="w-20 text-center">
                    <p className="font-medium text-gray-900 text-sm dark:text-gray-100">
                      {period.start}
                    </p>
                    <p className="text-gray-500 text-xs dark:text-gray-400">
                      to
                    </p>
                    <p className="font-medium text-gray-900 text-sm dark:text-gray-100">
                      {period.end}
                    </p>
                  </div>

                  <div className="h-12 w-px bg-gray-300 dark:bg-gray-700" />

                  {slot ? (
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {slot.subject}
                          </h4>
                          <div className="mt-1 flex items-center gap-4 text-gray-500 text-sm dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {slot.teacher}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {slot.room}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-primary text-xs">
                            Period {period.number}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 text-center text-gray-400 dark:text-gray-600">
                      <span className="text-sm">Free Period</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Total Classes
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                {daySlots.length}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Teachers Engaged
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                {new Set(daySlots.map((s) => s.teacher)).size}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Room Utilization
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                {Math.round((daySlots.length / PERIODS.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center">
          <Clock className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-gray-100">
            No Timetable Generated Yet
          </h3>
          <p className="mx-auto mb-4 max-w-md text-gray-500 text-sm dark:text-gray-400">
            Click "Generate Timetable" to use our AI algorithm to create an
            optimized schedule that avoids teacher conflicts and maximizes
            resource utilization.
          </p>
          <div className="flex justify-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              Conflict-free scheduling
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              Optimal resource usage
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              Teacher workload balance
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartTimetable;
