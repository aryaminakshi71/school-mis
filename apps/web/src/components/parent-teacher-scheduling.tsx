import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  MapPin,
  Plus,
  Search,
  Star,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  teacherId: string;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  avatar?: string;
  rating: number;
  availableSlots: TimeSlot[];
  preferredMode: "in-person" | "video" | "both";
  room?: string;
}

interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  children: Student[];
}

interface Student {
  id: string;
  name: string;
  class: string;
  rollNumber: string;
  photo?: string;
}

interface Meeting {
  id: string;
  teacherId: string;
  teacherName: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: "in-person" | "video";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  room?: string;
  meetLink?: string;
  notes?: string;
  agenda?: string[];
  rating?: number;
  feedback?: string;
}

interface ParentTeacherSchedulingProps {
  className?: string;
}

const defaultTeachers: Teacher[] = [
  {
    id: "t1",
    name: "Mrs. Sharma",
    subject: "Mathematics",
    rating: 4.8,
    preferredMode: "both",
    room: "Room 101",
    availableSlots: [
      {
        id: "s1",
        startTime: "09:00",
        endTime: "09:30",
        available: true,
        teacherId: "t1",
      },
      {
        id: "s2",
        startTime: "09:30",
        endTime: "10:00",
        available: false,
        teacherId: "t1",
      },
      {
        id: "s3",
        startTime: "10:00",
        endTime: "10:30",
        available: true,
        teacherId: "t1",
      },
      {
        id: "s4",
        startTime: "14:00",
        endTime: "14:30",
        available: true,
        teacherId: "t1",
      },
      {
        id: "s5",
        startTime: "15:00",
        endTime: "15:30",
        available: true,
        teacherId: "t1",
      },
    ],
  },
  {
    id: "t2",
    name: "Mr. Patel",
    subject: "Science",
    rating: 4.6,
    preferredMode: "video",
    availableSlots: [
      {
        id: "s6",
        startTime: "10:00",
        endTime: "10:30",
        available: true,
        teacherId: "t2",
      },
      {
        id: "s7",
        startTime: "11:00",
        endTime: "11:30",
        available: true,
        teacherId: "t2",
      },
      {
        id: "s8",
        startTime: "14:30",
        endTime: "15:00",
        available: false,
        teacherId: "t2",
      },
    ],
  },
  {
    id: "t3",
    name: "Ms. Gupta",
    subject: "English",
    rating: 4.9,
    preferredMode: "in-person",
    room: "Room 203",
    availableSlots: [
      {
        id: "s9",
        startTime: "09:00",
        endTime: "09:30",
        available: true,
        teacherId: "t3",
      },
      {
        id: "s10",
        startTime: "13:00",
        endTime: "13:30",
        available: true,
        teacherId: "t3",
      },
      {
        id: "s11",
        startTime: "16:00",
        endTime: "16:30",
        available: true,
        teacherId: "t3",
      },
    ],
  },
];

const defaultMeetings: Meeting[] = [
  {
    id: "m1",
    teacherId: "t1",
    teacherName: "Mrs. Sharma",
    parentId: "p1",
    parentName: "Mr. Kumar",
    studentId: "s1",
    studentName: "Rahul Kumar",
    date: "2024-03-30",
    startTime: "09:00",
    endTime: "09:30",
    mode: "in-person",
    status: "scheduled",
    room: "Room 101",
    agenda: [
      "Discuss math performance",
      "Review test scores",
      "Plan improvement strategy",
    ],
  },
  {
    id: "m2",
    teacherId: "t2",
    teacherName: "Mr. Patel",
    parentId: "p2",
    parentName: "Mrs. Sharma",
    studentId: "s2",
    studentName: "Priya Sharma",
    date: "2024-03-28",
    startTime: "10:00",
    endTime: "10:30",
    mode: "video",
    status: "completed",
    meetLink: "https://meet.school-mis.com/ptm-002",
    notes:
      "Student showing good progress in Science. Recommended additional lab practice.",
    rating: 5,
  },
];

const currentParent: Parent = {
  id: "p1",
  name: "Mr. Kumar",
  email: "parent@example.com",
  phone: "+91-98765-43210",
  children: [
    { id: "s1", name: "Rahul Kumar", class: "10-A", rollNumber: "101" },
    { id: "s2", name: "Priya Kumar", class: "8-B", rollNumber: "45" },
  ],
};

export function ParentTeacherScheduling({
  className,
}: ParentTeacherSchedulingProps) {
  const [activeTab, setActiveTab] = useState<"book" | "upcoming" | "past">(
    "book",
  );
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("2024-03-30");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedMode, setSelectedMode] = useState<"in-person" | "video">(
    "in-person",
  );
  const [meetings, setMeetings] = useState<Meeting[]>(defaultMeetings);
  const [teachers, setTeachers] = useState<Teacher[]>(defaultTeachers);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [agenda, setAgenda] = useState<string>("");
  const [selectedChild, setSelectedChild] = useState<Student>(
    currentParent.children[0],
  );
  const [searchQuery, setSearchQuery] = useState("");

  const upcomingMeetings = meetings.filter((m) => m.status === "scheduled");
  const pastMeetings = meetings.filter(
    (m) => m.status === "completed" || m.status === "cancelled",
  );

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const bookMeeting = () => {
    if (!selectedTeacher || !selectedSlot) return;

    const newMeeting: Meeting = {
      id: Date.now().toString(),
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      parentId: currentParent.id,
      parentName: currentParent.name,
      studentId: selectedChild.id,
      studentName: selectedChild.name,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      mode: selectedMode,
      status: "scheduled",
      room: selectedMode === "in-person" ? selectedTeacher.room : undefined,
      meetLink:
        selectedMode === "video"
          ? `https://meet.school-mis.com/ptm-${Date.now()}`
          : undefined,
      agenda: agenda.split("\n").filter((item) => item.trim()),
    };

    setMeetings([...meetings, newMeeting]);

    // Mark slot as unavailable
    setTeachers(
      teachers.map((t) =>
        t.id === selectedTeacher.id
          ? {
              ...t,
              availableSlots: t.availableSlots.map((s) =>
                s.id === selectedSlot.id ? { ...s, available: false } : s,
              ),
            }
          : t,
      ),
    );

    setShowBookingModal(false);
    setShowSuccessModal(true);
    setSelectedTeacher(null);
    setSelectedSlot(null);
    setAgenda("");
  };

  const cancelMeeting = (id: string) => {
    const meeting = meetings.find((m) => m.id === id);
    if (meeting) {
      // Make slot available again
      setTeachers(
        teachers.map((t) =>
          t.id === meeting.teacherId
            ? {
                ...t,
                availableSlots: t.availableSlots.map((s) =>
                  s.startTime === meeting.startTime &&
                  s.endTime === meeting.endTime
                    ? { ...s, available: true }
                    : s,
                ),
              }
            : t,
        ),
      );
    }
    setMeetings(
      meetings.map((m) => (m.id === id ? { ...m, status: "cancelled" } : m)),
    );
  };

  const getModeIcon = (mode: string) => {
    return mode === "video" ? Video : MapPin;
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <CalendarDays className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
              PTM Scheduling
            </h2>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Book parent-teacher meetings easily
            </p>
          </div>
        </div>

        {/* Child Selector */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm dark:text-gray-400">For:</span>
          <select
            value={selectedChild.id}
            onChange={(e) =>
              setSelectedChild(
                currentParent.children.find((c) => c.id === e.target.value)!,
              )
            }
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
          >
            {currentParent.children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} ({child.class})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-500 text-sm">Upcoming Meetings</p>
          <p className="font-bold text-2xl text-gray-900 dark:text-white">
            {upcomingMeetings.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-500 text-sm">Past Meetings</p>
          <p className="font-bold text-2xl text-gray-600 dark:text-gray-400">
            {pastMeetings.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-500 text-sm">Teachers Available</p>
          <p className="font-bold text-2xl text-green-600">{teachers.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {[
          { id: "book", label: "Book New Meeting", icon: Plus },
          {
            id: "upcoming",
            label: `Upcoming (${upcomingMeetings.length})`,
            icon: Calendar,
          },
          { id: "past", label: "Past Meetings", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "bg-white text-indigo-600 shadow-sm dark:bg-gray-700"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "book" && (
          <motion.div
            key="book"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Search */}
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search teachers by name or subject..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Teachers Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTeachers.map((teacher) => (
                <motion.div
                  key={teacher.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setShowBookingModal(true);
                  }}
                  className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 font-semibold text-white">
                      {teacher.name[0]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {teacher.name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {teacher.subject} Teacher
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span className="font-medium text-sm">
                          {teacher.rating}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            teacher.preferredMode === "video"
                              ? "bg-blue-100 text-blue-700"
                              : teacher.preferredMode === "in-person"
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {teacher.preferredMode === "both"
                            ? "Video or In-person"
                            : teacher.preferredMode}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-500 text-sm">
                        {
                          teacher.availableSlots.filter((s) => s.available)
                            .length
                        }{" "}
                        slots available
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "upcoming" && (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {upcomingMeetings.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <Calendar className="mx-auto mb-4 h-16 w-16 opacity-30" />
                <p className="font-medium text-lg">No upcoming meetings</p>
                <p className="text-sm">
                  Book a meeting with your child's teacher
                </p>
              </div>
            ) : (
              upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 font-semibold text-white">
                        {meeting.teacherName[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Meeting with {meeting.teacherName}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {meeting.studentName}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-gray-600 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {meeting.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {meeting.startTime} - {meeting.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            {(() => {
                              const Icon = getModeIcon(meeting.mode);
                              return <Icon className="h-4 w-4" />;
                            })()}
                            {meeting.mode === "video"
                              ? "Video Call"
                              : meeting.room}
                          </span>
                        </div>
                        {meeting.agenda && meeting.agenda.length > 0 && (
                          <div className="mt-3">
                            <p className="mb-1 text-gray-500 text-sm">
                              Agenda:
                            </p>
                            <ul className="list-inside list-disc text-gray-600 text-sm">
                              {meeting.agenda.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {meeting.mode === "video" && meeting.meetLink && (
                        <button className="rounded-lg bg-blue-100 px-3 py-2 text-blue-700 text-sm hover:bg-blue-200">
                          Join Meeting
                        </button>
                      )}
                      <button
                        onClick={() => cancelMeeting(meeting.id)}
                        className="rounded-lg bg-red-100 px-3 py-2 text-red-700 text-sm hover:bg-red-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === "past" && (
          <motion.div
            key="past"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {pastMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className={`rounded-xl border bg-white p-4 dark:bg-gray-800 ${
                  meeting.status === "cancelled"
                    ? "border-red-200 bg-red-50/50 dark:border-red-800"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-500 dark:bg-gray-700">
                      {meeting.teacherName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Meeting with {meeting.teacherName}
                        </h4>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            meeting.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {meeting.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {meeting.studentName}
                      </p>
                      <p className="text-gray-500 text-sm">{meeting.date}</p>
                      {meeting.notes && (
                        <div className="mt-2 rounded bg-gray-50 p-2 text-sm dark:bg-gray-700/50">
                          <span className="font-medium">Notes:</span>{" "}
                          {meeting.notes}
                        </div>
                      )}
                      {meeting.rating && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className="text-gray-500 text-sm">
                            Your rating:
                          </span>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < meeting.rating!
                                  ? "fill-current text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {meeting.status === "completed" && !meeting.rating && (
                    <button className="rounded-lg bg-yellow-100 px-3 py-2 text-sm text-yellow-700">
                      Rate Meeting
                    </button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedTeacher && (
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
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white dark:bg-gray-800"
            >
              <div className="sticky top-0 flex items-center justify-between border-gray-200 border-b bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div>
                  <h3 className="font-semibold text-lg">
                    Book Meeting with {selectedTeacher.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {selectedTeacher.subject} Teacher
                  </p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-4">
                {/* Date Selection */}
                <div>
                  <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSelectedDate(e.target.value)
                    }
                    className="w-full rounded-lg border-0 bg-gray-100 px-4 py-2 dark:bg-gray-700"
                  />
                </div>

                {/* Mode Selection */}
                <div>
                  <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                    Meeting Mode
                  </label>
                  <div className="flex gap-2">
                    {(selectedTeacher.preferredMode === "in-person" ||
                      selectedTeacher.preferredMode === "both") && (
                      <button
                        onClick={() => setSelectedMode("in-person")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 transition-all ${
                          selectedMode === "in-person"
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <MapPin className="h-5 w-5" />
                        In-person{" "}
                        {selectedTeacher.room && `(${selectedTeacher.room})`}
                      </button>
                    )}
                    {(selectedTeacher.preferredMode === "video" ||
                      selectedTeacher.preferredMode === "both") && (
                      <button
                        onClick={() => setSelectedMode("video")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 transition-all ${
                          selectedMode === "video"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <Video className="h-5 w-5" />
                        Video Call
                      </button>
                    )}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedTeacher.availableSlots
                      .filter((slot) => slot.available)
                      .map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-lg border-2 p-3 text-sm transition-all ${
                            selectedSlot?.id === slot.id
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                              : "border-gray-200 hover:border-indigo-300 dark:border-gray-700"
                          }`}
                        >
                          <div className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-gray-500 text-xs">30 min</div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Agenda */}
                <div>
                  <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                    Meeting Agenda (Optional)
                  </label>
                  <textarea
                    value={agenda}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setAgenda(e.target.value)
                    }
                    placeholder="What would you like to discuss?&#10;1. Academic progress&#10;2. Behavior concerns&#10;3. Future goals"
                    rows={4}
                    className="w-full resize-none rounded-lg border-0 bg-gray-100 px-4 py-2 dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 border-gray-200 border-t bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <button
                  onClick={bookMeeting}
                  disabled={!selectedSlot}
                  className="w-full rounded-xl bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {selectedSlot ? "Confirm Booking" : "Select a Time Slot"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
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
              className="w-full max-w-sm rounded-2xl bg-white p-6 text-center dark:bg-gray-800"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 text-xl dark:text-white">
                Meeting Booked!
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Your parent-teacher meeting has been scheduled successfully.
                You'll receive a confirmation email shortly.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab("upcoming");
                }}
                className="w-full rounded-xl bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700"
              >
                View My Meetings
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
