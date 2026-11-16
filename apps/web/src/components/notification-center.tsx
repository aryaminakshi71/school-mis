import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Archive,
  Bell,
  BellOff,
  Calendar,
  CheckCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  Info,
  Mail,
  Megaphone,
  Pin,
  Search,
  Settings,
  Smartphone,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "announcement";
  category:
    | "academic"
    | "fee"
    | "attendance"
    | "exam"
    | "general"
    | "emergency";
  priority: "low" | "medium" | "high";
  sender?: {
    name: string;
    role: string;
    avatar?: string;
  };
  timestamp: string;
  read: boolean;
  archived: boolean;
  pinned: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: Record<string, boolean>;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationCenterProps {
  className?: string;
}

const defaultNotifications: Notification[] = [
  {
    id: "1",
    title: "Fee Payment Reminder",
    message:
      "Your child Rahul Kumar's tuition fee of ₹12,500 is due on April 5, 2024. Please make the payment to avoid late charges.",
    type: "warning",
    category: "fee",
    priority: "high",
    sender: {
      name: "Accounts Department",
      role: "Finance",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    archived: false,
    pinned: true,
    actionUrl: "/app/fees/payment",
    actionText: "Pay Now",
  },
  {
    id: "2",
    title: "Exam Schedule Updated",
    message:
      "The Mathematics examination for Class 10 has been rescheduled to April 10, 2024 at 9:00 AM. Please check the updated timetable.",
    type: "info",
    category: "exam",
    priority: "high",
    sender: {
      name: "Examination Department",
      role: "Academic",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    archived: false,
    pinned: false,
    actionUrl: "/app/exams/schedule",
    actionText: "View Schedule",
  },
  {
    id: "3",
    title: "Attendance Alert",
    message:
      "Priya Sharma has been absent for 3 consecutive days. Please contact the class teacher if there are any concerns.",
    type: "error",
    category: "attendance",
    priority: "medium",
    sender: {
      name: "Mrs. Gupta",
      role: "Class Teacher",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
    archived: false,
    pinned: false,
    actionUrl: "/app/attendance",
    actionText: "View Details",
  },
  {
    id: "4",
    title: "Annual Day Celebration",
    message:
      "Join us for the Annual Day Celebration on March 30, 2024 at 5:00 PM in the school auditorium. Cultural performances and prize distribution.",
    type: "announcement",
    category: "general",
    priority: "medium",
    sender: {
      name: "Principal",
      role: "Administration",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    archived: false,
    pinned: true,
    actionUrl: "/app/events/annual-day",
    actionText: "Learn More",
  },
  {
    id: "5",
    title: "Assignment Submitted",
    message:
      "Your Science project has been successfully submitted and is under review. Expected grading date: April 2, 2024.",
    type: "success",
    category: "academic",
    priority: "low",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    archived: false,
    pinned: false,
  },
  {
    id: "6",
    title: "Bus Route Change",
    message:
      "Due to road construction, Bus Route 12 will take an alternate path. Pickup time adjusted to 7:15 AM.",
    type: "warning",
    category: "general",
    priority: "high",
    sender: {
      name: "Transport Department",
      role: "Operations",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    read: true,
    archived: true,
    pinned: false,
  },
];

const defaultPreferences: NotificationPreferences = {
  email: true,
  push: true,
  sms: false,
  categories: {
    academic: true,
    fee: true,
    attendance: true,
    exam: true,
    general: true,
    emergency: true,
  },
  quietHours: {
    enabled: true,
    start: "22:00",
    end: "07:00",
  },
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: AlertCircle,
    announcement: Megaphone,
  };
  return icons[type] || Info;
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    success:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    announcement:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    academic: CheckCircle,
    fee: AlertCircle,
    attendance: User,
    exam: Calendar,
    general: Info,
    emergency: AlertCircle,
  };
  return icons[category] || Info;
};

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(defaultNotifications);
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(defaultPreferences);
  const [activeTab, setActiveTab] = useState<
    "all" | "unread" | "pinned" | "archived"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const unreadCount = notifications.filter(
    (n) => !n.read && !n.archived,
  ).length;
  const pinnedCount = notifications.filter(
    (n) => n.pinned && !n.archived,
  ).length;
  const archivedCount = notifications.filter((n) => n.archived).length;

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || notification.category === selectedCategory;
    const matchesTab =
      activeTab === "all"
        ? !notification.archived
        : activeTab === "unread"
          ? !notification.read && !notification.archived
          : activeTab === "pinned"
            ? notification.pinned && !notification.archived
            : notification.archived;

    return matchesSearch && matchesCategory && matchesTab;
  });

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) =>
        activeTab === "all" || (activeTab === "unread" && !n.read)
          ? { ...n, read: true }
          : n,
      ),
    );
  };

  const togglePin = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    );
  };

  const toggleArchive = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, archived: !n.archived } : n,
      ),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`flex h-full flex-col ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-gray-200 border-b p-4 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 font-medium text-white text-xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-xl dark:text-white">
              Notifications
            </h2>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              {unreadCount} unread • {notifications.length} total
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-gray-600 text-sm transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}
          <button
            onClick={() => setShowPreferences(true)}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-gray-200 border-b p-2 dark:border-gray-800">
        {[
          {
            id: "all",
            label: "All",
            count: notifications.filter((n) => !n.archived).length,
          },
          { id: "unread", label: "Unread", count: unreadCount },
          { id: "pinned", label: "Pinned", count: pinnedCount },
          { id: "archived", label: "Archived", count: archivedCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 border-gray-200 border-b p-4 dark:border-gray-800">
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="w-full rounded-xl border-0 bg-gray-100 py-2.5 pr-4 pl-10 text-sm focus:ring-2 focus:ring-primary dark:bg-gray-800"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-3 py-1.5 font-medium text-xs transition-colors ${
              !selectedCategory
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            All
          </button>
          {["academic", "fee", "attendance", "exam", "general"].map(
            (category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category,
                  )
                }
                className={`rounded-full px-3 py-1.5 font-medium text-xs capitalize transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {category}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <BellOff className="mb-4 h-16 w-16 opacity-30" />
            <p className="font-medium text-lg">
              {activeTab === "unread"
                ? "No unread notifications"
                : activeTab === "archived"
                  ? "No archived notifications"
                  : "No notifications"}
            </p>
            <p className="text-sm">
              {searchQuery
                ? "Try adjusting your search"
                : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredNotifications.map((notification) => {
              const TypeIcon = getTypeIcon(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => {
                    markAsRead(notification.id);
                    setSelectedNotification(notification);
                  }}
                  className={`cursor-pointer p-4 transition-colors ${
                    notification.read
                      ? "bg-white dark:bg-gray-900"
                      : "bg-blue-50/50 dark:bg-blue-900/10"
                  } hover:bg-gray-50 dark:hover:bg-gray-800/50`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${getTypeColor(
                        notification.type,
                      )}`}
                    >
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`font-semibold text-gray-900 dark:text-white ${
                                !notification.read ? "text-base" : "text-sm"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            {notification.pinned && (
                              <Pin className="h-3.5 w-3.5 fill-current text-primary" />
                            )}
                            {notification.priority === "high" && (
                              <span className="rounded bg-red-100 px-1.5 py-0.5 text-red-700 text-xs dark:bg-red-900/30 dark:text-red-400">
                                High
                              </span>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-gray-600 text-sm dark:text-gray-400">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePin(notification.id);
                            }}
                            className={`rounded-lg p-1.5 transition-colors ${
                              notification.pinned
                                ? "text-primary"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            <Pin
                              className={`h-4 w-4 ${notification.pinned ? "fill-current" : ""}`}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleArchive(notification.id);
                            }}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:text-gray-600"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-500 text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.sender && (
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {notification.sender.name}
                            </span>
                          )}
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 capitalize dark:bg-gray-700">
                            {notification.category}
                          </span>
                        </div>
                        {notification.actionUrl && (
                          <button className="flex items-center gap-1 text-primary text-xs hover:underline">
                            {notification.actionText || "View"}
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
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
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white dark:bg-gray-800"
            >
              <div className="sticky top-0 z-10 border-gray-200 border-b bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                    Notification Preferences
                  </h3>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 p-4">
                {/* Channels */}
                <div>
                  <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                    Notification Channels
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        key: "email",
                        label: "Email Notifications",
                        icon: Mail,
                      },
                      { key: "push", label: "Push Notifications", icon: Bell },
                      {
                        key: "sms",
                        label: "SMS Notifications",
                        icon: Smartphone,
                      },
                    ].map((channel) => (
                      <label
                        key={channel.key}
                        className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <channel.icon className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-900 dark:text-white">
                            {channel.label}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={
                            preferences[
                              channel.key as keyof NotificationPreferences
                            ] as boolean
                          }
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              [channel.key]: e.target.checked,
                            })
                          }
                          className="h-5 w-5 rounded text-primary focus:ring-primary"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                    Categories
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(preferences.categories).map(
                      ([category, enabled]) => (
                        <label
                          key={category}
                          className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                        >
                          <span className="text-gray-900 capitalize dark:text-white">
                            {category}
                          </span>
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                categories: {
                                  ...preferences.categories,
                                  [category]: e.target.checked,
                                },
                              })
                            }
                            className="h-5 w-5 rounded text-primary focus:ring-primary"
                          />
                        </label>
                      ),
                    )}
                  </div>
                </div>

                {/* Quiet Hours */}
                <div>
                  <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                    Quiet Hours
                  </h4>
                  <label className="mb-3 flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <span className="text-gray-900 dark:text-white">
                      Enable Quiet Hours
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.quietHours.enabled}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          quietHours: {
                            ...preferences.quietHours,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="h-5 w-5 rounded text-primary focus:ring-primary"
                    />
                  </label>
                  {preferences.quietHours.enabled && (
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-gray-600 text-sm dark:text-gray-400">
                          Start
                        </label>
                        <input
                          type="time"
                          value={preferences.quietHours.start}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              quietHours: {
                                ...preferences.quietHours,
                                start: e.target.value,
                              },
                            })
                          }
                          className="mt-1 w-full rounded-lg border-0 bg-gray-100 px-3 py-2 dark:bg-gray-700"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-gray-600 text-sm dark:text-gray-400">
                          End
                        </label>
                        <input
                          type="time"
                          value={preferences.quietHours.end}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              quietHours: {
                                ...preferences.quietHours,
                                end: e.target.value,
                              },
                            })
                          }
                          className="mt-1 w-full rounded-lg border-0 bg-gray-100 px-3 py-2 dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 border-gray-200 border-t bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="w-full rounded-xl bg-primary py-2.5 text-white transition-colors hover:bg-primary/90"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
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
              className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800"
            >
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${getTypeColor(
                      selectedNotification.type,
                    )}`}
                  >
                    {(() => {
                      const Icon = getTypeIcon(selectedNotification.type);
                      return <Icon className="h-6 w-6" />;
                    })()}
                  </div>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium text-xs ${getTypeColor(
                      selectedNotification.type,
                    )}`}
                  >
                    {selectedNotification.type}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 text-xs capitalize dark:bg-gray-700 dark:text-gray-400">
                    {selectedNotification.category}
                  </span>
                  {selectedNotification.priority === "high" && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-700 text-xs dark:bg-red-900/30 dark:text-red-400">
                      High Priority
                    </span>
                  )}
                </div>

                <h3 className="mb-3 font-bold text-gray-900 text-xl dark:text-white">
                  {selectedNotification.title}
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  {selectedNotification.message}
                </p>

                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 text-sm dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatTimestamp(selectedNotification.timestamp)}
                    </span>
                  </div>
                  {selectedNotification.sender && (
                    <div className="flex items-center gap-3 text-gray-600 text-sm dark:text-gray-400">
                      <User className="h-4 w-4" />
                      <span>
                        From: {selectedNotification.sender.name} (
                        {selectedNotification.sender.role})
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {selectedNotification.actionUrl && (
                    <button
                      onClick={() => setSelectedNotification(null)}
                      className="flex-1 rounded-xl bg-primary py-2.5 text-white transition-colors hover:bg-primary/90"
                    >
                      {selectedNotification.actionText || "Take Action"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      toggleArchive(selectedNotification.id);
                      setSelectedNotification(null);
                    }}
                    className="rounded-xl bg-gray-100 px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    {selectedNotification.archived ? "Unarchive" : "Archive"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
