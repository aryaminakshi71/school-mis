import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit2,
  FileText,
  Filter,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Share2,
  Star,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  description?: string;
  type: "academic" | "sports" | "cultural" | "meeting" | "other";
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  image?: string;
  isPublic: boolean;
  requiresRegistration: boolean;
  attachments?: string[];
}

interface EventManagementProps {
  className?: string;
}

const defaultEvents: Event[] = [
  {
    id: "1",
    title: "Annual Sports Day 2024",
    description:
      "Annual sports competition with various track and field events. All students and parents are invited.",
    type: "sports",
    startDate: "2024-04-15T09:00:00",
    endDate: "2024-04-15T17:00:00",
    location: "School Grounds",
    organizer: "Sports Department",
    attendees: 450,
    maxAttendees: 500,
    status: "upcoming",
    isPublic: true,
    requiresRegistration: true,
  },
  {
    id: "2",
    title: "Science Exhibition",
    description:
      "Students showcase their science projects and innovations. Open for all classes.",
    type: "academic",
    startDate: "2024-04-05T10:00:00",
    endDate: "2024-04-05T16:00:00",
    location: "Science Block Hall",
    organizer: "Science Club",
    attendees: 200,
    status: "upcoming",
    isPublic: true,
    requiresRegistration: false,
  },
  {
    id: "3",
    title: "Parent-Teacher Meeting",
    description:
      "Quarterly PTM for Class 10 students to discuss academic progress.",
    type: "meeting",
    startDate: "2024-03-30T14:00:00",
    endDate: "2024-03-30T18:00:00",
    location: "Conference Hall",
    organizer: "Academic Coordinator",
    attendees: 85,
    maxAttendees: 120,
    status: "ongoing",
    isPublic: false,
    requiresRegistration: true,
  },
  {
    id: "4",
    title: "Annual Day Celebration",
    description:
      "Cultural performances, prize distribution, and annual report presentation.",
    type: "cultural",
    startDate: "2024-03-25T17:00:00",
    endDate: "2024-03-25T21:00:00",
    location: "School Auditorium",
    organizer: "Cultural Committee",
    attendees: 600,
    maxAttendees: 800,
    status: "completed",
    isPublic: true,
    requiresRegistration: false,
  },
  {
    id: "5",
    title: "Workshop: AI in Education",
    description:
      "Interactive workshop on implementing AI tools in classroom teaching.",
    type: "academic",
    startDate: "2024-04-10T10:00:00",
    endDate: "2024-04-10T13:00:00",
    location: "Computer Lab",
    organizer: "IT Department",
    attendees: 30,
    maxAttendees: 40,
    status: "upcoming",
    isPublic: true,
    requiresRegistration: true,
  },
];

const eventTypes = [
  { id: "academic", label: "Academic", color: "#3b82f6", icon: FileText },
  { id: "sports", label: "Sports", color: "#10b981", icon: Users },
  { id: "cultural", label: "Cultural", color: "#f59e0b", icon: Star },
  { id: "meeting", label: "Meeting", color: "#8b5cf6", icon: Users },
  { id: "other", label: "Other", color: "#6b7280", icon: Calendar },
];

export function EventManagement({ className }: EventManagementProps) {
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "ongoing" | "past" | "calendar"
  >("upcoming");
  const [events, setEvents] = useState<Event[]>(defaultEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "upcoming")
      return matchesSearch && event.status === "upcoming";
    if (activeTab === "ongoing")
      return matchesSearch && event.status === "ongoing";
    if (activeTab === "past")
      return (
        matchesSearch &&
        (event.status === "completed" || event.status === "cancelled")
      );
    return matchesSearch;
  });

  const upcomingCount = events.filter((e) => e.status === "upcoming").length;
  const ongoingCount = events.filter((e) => e.status === "ongoing").length;
  const completedCount = events.filter((e) => e.status === "completed").length;

  const getEventTypeIcon = (type: string) => {
    const eventType = eventTypes.find((t) => t.id === type);
    return eventType?.icon || Calendar;
  };

  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find((t) => t.id === type);
    return eventType?.color || "#6b7280";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      ongoing:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      completed:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
              Event Management
            </h2>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              {upcomingCount} upcoming • {ongoingCount} ongoing •{" "}
              {completedCount} completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {[
          {
            id: "upcoming",
            label: `Upcoming (${upcomingCount})`,
            icon: Calendar,
          },
          {
            id: "ongoing",
            label: `Ongoing (${ongoingCount})`,
            icon: CheckCircle,
          },
          { id: "past", label: "Past Events", icon: Clock },
          { id: "calendar", label: "Calendar View", icon: Calendar },
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

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <Filter className="h-5 w-5" />
            Filter
          </button>
          <div className="flex items-center rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 transition-colors ${viewMode === "list" ? "bg-white shadow-sm dark:bg-gray-700" : ""}`}
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition-colors ${viewMode === "grid" ? "bg-white shadow-sm dark:bg-gray-700" : ""}`}
            >
              <Calendar className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {filteredEvents.map((event) => {
              const EventIcon = getEventTypeIcon(event.type);
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedEvent(event)}
                  className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex gap-4">
                    <div
                      className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${getEventTypeColor(event.type)}20`,
                      }}
                    >
                      <EventIcon
                        className="h-8 w-8"
                        style={{ color: getEventTypeColor(event.type) }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                              {event.title}
                            </h3>
                            <span
                              className={`rounded-full px-2 py-0.5 font-medium text-xs ${getStatusColor(
                                event.status,
                              )}`}
                            >
                              {event.status}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-gray-600 text-sm dark:text-gray-400">
                            {event.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Edit2 className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-gray-600 text-sm dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(event.startDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTime(event.startDate)} -{" "}
                          {formatTime(event.endDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendees}
                          {event.maxAttendees && ` / ${event.maxAttendees}`}{" "}
                          attendees
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className="rounded-full px-2 py-1 font-medium text-xs"
                          style={{
                            backgroundColor: `${getEventTypeColor(event.type)}20`,
                            color: getEventTypeColor(event.type),
                          }}
                        >
                          {eventTypes.find((t) => t.id === event.type)?.label}
                        </span>
                        <span className="text-gray-500 text-xs">
                          by {event.organizer}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredEvents.map((event) => {
              const EventIcon = getEventTypeIcon(event.type);
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedEvent(event)}
                  className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div
                    className="flex h-32 items-center justify-center"
                    style={{
                      backgroundColor: `${getEventTypeColor(event.type)}10`,
                    }}
                  >
                    <EventIcon
                      className="h-16 w-16"
                      style={{ color: getEventTypeColor(event.type) }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-0.5 font-medium text-xs ${getStatusColor(
                          event.status,
                        )}`}
                      >
                        {event.status}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {formatDate(event.startDate)}
                      </span>
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-gray-600 text-sm dark:text-gray-400">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
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
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <span
                      className={`rounded-full px-3 py-1 font-medium text-xs ${getStatusColor(
                        selectedEvent.status,
                      )}`}
                    >
                      {selectedEvent.status}
                    </span>
                    <h2 className="mt-2 font-bold text-2xl text-gray-900 dark:text-white">
                      {selectedEvent.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  {selectedEvent.description}
                </p>

                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-500 text-sm">Date</p>
                      <p className="font-medium">
                        {formatDate(selectedEvent.startDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-500 text-sm">Time</p>
                      <p className="font-medium">
                        {formatTime(selectedEvent.startDate)} -{" "}
                        {formatTime(selectedEvent.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-500 text-sm">Location</p>
                      <p className="font-medium">{selectedEvent.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-500 text-sm">Attendees</p>
                      <p className="font-medium">
                        {selectedEvent.attendees}
                        {selectedEvent.maxAttendees &&
                          ` / ${selectedEvent.maxAttendees}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-gray-200 border-t pt-4 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">Organized by:</span>
                    <span className="font-medium">
                      {selectedEvent.organizer}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-primary transition-colors hover:bg-primary/20">
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                    <button className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90">
                      Register
                    </button>
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
