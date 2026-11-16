import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  Bus,
  Calendar,
  Check,
  Clock,
  Eye,
  FileText,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

export type QuickActionType =
  | "approve-leave"
  | "mark-attendance"
  | "verify-payment"
  | "assign-teacher"
  | "send-reminder"
  | "view-details"
  | "acknowledge";

export interface QuickAction {
  id: string;
  type: QuickActionType;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
  danger?: boolean;
}

export interface NotificationWithAction {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  entityType:
    | "student"
    | "teacher"
    | "fee"
    | "attendance"
    | "transport"
    | "leave"
    | "exam";
  entityId: string;
  actions: QuickAction[];
  metadata?: Record<string, any>;
}

const mockNotifications: NotificationWithAction[] = [
  {
    id: "1",
    title: "Leave Request Pending",
    message: "Rahul Sharma has requested leave from Oct 15-17, 2025",
    type: "warning",
    timestamp: new Date(),
    entityType: "leave",
    entityId: "leave-1",
    actions: [
      {
        id: "approve",
        type: "approve-leave",
        label: "Approve",
        icon: <Check className="h-4 w-4" />,
        primary: true,
      },
      {
        id: "reject",
        type: "approve-leave",
        label: "Reject",
        icon: <X className="h-4 w-4" />,
        danger: true,
      },
      {
        id: "view",
        type: "view-details",
        label: "View Details",
        icon: <Eye className="h-4 w-4" />,
      },
    ],
    metadata: {
      studentName: "Rahul Sharma",
      fromDate: "2025-10-15",
      toDate: "2025-10-17",
      reason: "Family function",
    },
  },
  {
    id: "2",
    title: "Fee Payment Received",
    message: "₹12,500 received from Priya Patel (Grade 9-B)",
    type: "success",
    timestamp: new Date(Date.now() - 3600000),
    entityType: "fee",
    entityId: "fee-123",
    actions: [
      {
        id: "verify",
        type: "verify-payment",
        label: "Verify",
        icon: <Check className="h-4 w-4" />,
        primary: true,
      },
      {
        id: "receipt",
        type: "view-details",
        label: "Send Receipt",
        icon: <FileText className="h-4 w-4" />,
      },
    ],
    metadata: {
      amount: 12500,
      studentName: "Priya Patel",
      paymentMethod: "UPI",
      transactionId: "TXN123456",
    },
  },
  {
    id: "3",
    title: "Absent Alert",
    message: "Ananya Gupta (Grade 10-A) is absent today without prior notice",
    type: "error",
    timestamp: new Date(Date.now() - 7200000),
    entityType: "attendance",
    entityId: "att-456",
    actions: [
      {
        id: "mark",
        type: "mark-attendance",
        label: "Mark Present",
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        id: "notify",
        type: "send-reminder",
        label: "Notify Parent",
        icon: <Bell className="h-4 w-4" />,
      },
      {
        id: "view",
        type: "view-details",
        label: "View History",
        icon: <Eye className="h-4 w-4" />,
      },
    ],
    metadata: {
      studentName: "Ananya Gupta",
      class: "10-A",
      consecutiveDays: 2,
    },
  },
  {
    id: "4",
    title: "Teacher Substitution Needed",
    message:
      "Mr. Rajesh Kumar (Math) is on leave today. Substitute required for 3 classes.",
    type: "warning",
    timestamp: new Date(Date.now() - 10800000),
    entityType: "teacher",
    entityId: "tch-001",
    actions: [
      {
        id: "assign",
        type: "assign-teacher",
        label: "Assign Substitute",
        icon: <User className="h-4 w-4" />,
        primary: true,
      },
      {
        id: "view",
        type: "view-details",
        label: "View Schedule",
        icon: <Eye className="h-4 w-4" />,
      },
    ],
    metadata: {
      teacherName: "Rajesh Kumar",
      subject: "Mathematics",
      classes: ["10-A", "10-B", "9-A"],
    },
  },
  {
    id: "5",
    title: "Bus Delay Alert",
    message: "Bus Route 5 is running 15 minutes late due to traffic",
    type: "info",
    timestamp: new Date(Date.now() - 1800000),
    entityType: "transport",
    entityId: "bus-5",
    actions: [
      {
        id: "notify",
        type: "send-reminder",
        label: "Notify Parents",
        icon: <Bus className="h-4 w-4" />,
      },
      {
        id: "ack",
        type: "acknowledge",
        label: "Acknowledge",
        icon: <Check className="h-4 w-4" />,
      },
    ],
    metadata: {
      route: "Route 5",
      delay: "15 minutes",
      reason: "Traffic congestion",
    },
  },
];

const typeIcons = {
  info: <AlertCircle className="h-5 w-5 text-blue-500" />,
  success: <Check className="h-5 w-5 text-green-500" />,
  warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
};

const typeColors = {
  info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  success:
    "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  warning:
    "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
};

interface NotificationQuickActionsProps {
  onAction: (
    notificationId: string,
    actionId: string,
    actionType: QuickActionType,
  ) => Promise<void>;
  maxNotifications?: number;
}

export function NotificationQuickActions({
  onAction,
  maxNotifications = 5,
}: NotificationQuickActionsProps) {
  const [notifications, setNotifications] =
    useState<NotificationWithAction[]>(mockNotifications);
  const [processing, setProcessing] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const handleAction = async (
    notification: NotificationWithAction,
    action: QuickAction,
  ) => {
    setProcessing(`${notification.id}-${action.id}`);
    try {
      await onAction(notification.id, action.id, action.type);

      // Remove notification if primary action
      if (action.primary) {
        setDismissed((prev) => [...prev, notification.id]);
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleDismiss = (id: string) => {
    setDismissed((prev) => [...prev, id]);
  };

  const visibleNotifications = notifications
    .filter((n) => !dismissed.includes(n.id))
    .slice(0, maxNotifications);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-medium text-gray-900 text-sm dark:text-gray-100">
          <Bell className="h-4 w-4" />
          Quick Actions ({visibleNotifications.length})
        </h3>
        {visibleNotifications.length > 0 && (
          <button
            onClick={() => setDismissed(notifications.map((n) => n.id))}
            className="text-gray-500 text-xs hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Dismiss All
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {visibleNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center text-gray-400 dark:text-gray-600"
          >
            <Bell className="mx-auto mb-2 h-10 w-10 opacity-50" />
            <p className="text-sm">No pending notifications</p>
          </motion.div>
        ) : (
          visibleNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`rounded-xl border p-4 ${typeColors[notification.type]}`}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{typeIcons[notification.type]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm dark:text-gray-100">
                        {notification.title}
                      </h4>
                      <p className="mt-0.5 text-gray-600 text-sm dark:text-gray-400">
                        {notification.message}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDismiss(notification.id)}
                      className="rounded p-1 text-gray-400 hover:bg-black/5 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Metadata */}
                  {notification.metadata && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(notification.metadata).map(
                        ([key, value]) => (
                          <span
                            key={key}
                            className="inline-flex items-center rounded bg-white/50 px-2 py-0.5 text-xs dark:bg-black/20"
                          >
                            {key}: {value}
                          </span>
                        ),
                      )}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="mt-2 flex items-center gap-1 text-gray-500 text-xs dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    {formatTime(notification.timestamp)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {notification.actions.map((action) => {
                  const isProcessing =
                    processing === `${notification.id}-${action.id}`;

                  return (
                    <button
                      key={action.id}
                      onClick={() => handleAction(notification, action)}
                      disabled={isProcessing}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-sm transition-all ${
                        action.primary
                          ? "bg-primary text-white hover:bg-primary/90"
                          : action.danger
                            ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {isProcessing ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        action.icon
                      )}
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>

      {notifications.filter((n) => !dismissed.includes(n.id)).length >
        maxNotifications && (
        <button className="w-full py-2 text-primary text-sm transition-colors hover:text-primary/80">
          View{" "}
          {notifications.filter((n) => !dismissed.includes(n.id)).length -
            maxNotifications}{" "}
          more notifications
        </button>
      )}
    </div>
  );
}

export default NotificationQuickActions;
