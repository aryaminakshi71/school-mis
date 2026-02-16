import { toast } from "sonner";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  icon?: string;
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, string>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private permission: NotificationPermission = "default";

  constructor() {
    if (typeof window !== "undefined") {
      this.loadNotifications();
      this.requestPermission();
    }
  }

  private loadNotifications() {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("school_notifications");
    if (saved) {
      try {
        this.notifications = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      } catch {
        this.notifications = [];
      }
    }
  }

  private saveNotifications() {
    localStorage.setItem(
      "school_notifications",
      JSON.stringify(this.notifications),
    );
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    this.permission = await Notification.requestPermission();
    return this.permission === "granted";
  }

  hasPermission(): boolean {
    return this.permission === "granted";
  }

  addListener(listener: (notifications: Notification[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  addNotification(
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();

    this.showToast(newNotification);
    if (this.permission === "granted") {
      this.showPushNotification(newNotification);
    }

    return newNotification;
  }

  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.saveNotifications();
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveNotifications();
  }

  clearAll() {
    this.notifications = [];
    this.saveNotifications();
  }

  private showToast(notification: Notification) {
    const toastOptions: any = {
      description: notification.message,
    };

    if (notification.link) {
      toastOptions.action = {
        label: "View",
        onClick: () => (window.location.href = notification.link!),
      };
    }

    switch (notification.type) {
      case "success":
        toast.success(notification.title, toastOptions);
        break;
      case "error":
        toast.error(notification.title, toastOptions);
        break;
      case "warning":
        toast.warning(notification.title, toastOptions);
        break;
      default:
        toast(notification.title, toastOptions);
    }
  }

  private showPushNotification(notification: Notification) {
    if (this.permission !== "granted") return;

    const pushNotification: PushNotification = {
      title: notification.title,
      body: notification.message,
      icon: notification.icon || "/icons/notification-icon.png",
      badge: "/icons/badge-icon.png",
      data: {
        url: notification.link || "/app/notifications",
        id: notification.id,
      },
    };

    try {
      new Notification(pushNotification.title, {
        body: pushNotification.body,
        icon: pushNotification.icon,
        badge: pushNotification.badge,
        tag: notification.id,
        data: pushNotification.data,
      });
    } catch (error) {
      console.error("Failed to show push notification:", error);
    }
  }

  showSuccess(title: string, message: string, options?: { link?: string }) {
    return this.addNotification({
      type: "success",
      title,
      message,
      ...options,
    });
  }

  showError(title: string, message: string, options?: { link?: string }) {
    return this.addNotification({ type: "error", title, message, ...options });
  }

  showWarning(title: string, message: string, options?: { link?: string }) {
    return this.addNotification({
      type: "warning",
      title,
      message,
      ...options,
    });
  }

  showInfo(title: string, message: string, options?: { link?: string }) {
    return this.addNotification({ type: "info", title, message, ...options });
  }
}

export const notificationService = new NotificationService();

export function useNotifications() {
  return {
    notifications: notificationService.getNotifications(),
    unreadCount: notificationService.getUnreadCount(),
    addNotification:
      notificationService.addNotification.bind(notificationService),
    markAsRead: notificationService.markAsRead.bind(notificationService),
    markAllAsRead: notificationService.markAllAsRead.bind(notificationService),
    deleteNotification:
      notificationService.deleteNotification.bind(notificationService),
    clearAll: notificationService.clearAll.bind(notificationService),
    hasPermission: notificationService.hasPermission.bind(notificationService),
    requestPermission:
      notificationService.requestPermission.bind(notificationService),
  };
}

export default notificationService;
