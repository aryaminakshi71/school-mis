import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export interface PushNotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  priority?: "default" | "high" | "low";
  sound?: boolean;
  vibrate?: boolean;
}

class PushNotificationService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Request permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Failed to get push notification permissions!");
      return;
    }

    // Configure Android channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#047857",
      });

      await Notifications.setNotificationChannelAsync("urgent", {
        name: "Urgent",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 200, 500],
        lightColor: "#dc2626",
        sound: "notification.wav",
      });
    }

    this.isInitialized = true;
  }

  async scheduleNotification({
    title,
    body,
    data,
    priority = "default",
    sound = true,
    vibrate = true,
  }: PushNotificationData & {
    trigger?: Notifications.NotificationTriggerInput;
  }) {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: sound ? "default" : undefined,
        priority:
          priority === "high"
            ? Notifications.AndroidNotificationPriority.HIGH
            : priority === "low"
              ? Notifications.AndroidNotificationPriority.LOW
              : Notifications.AndroidNotificationPriority.DEFAULT,
      },
      trigger: null, // Send immediately
    });

    return notificationId;
  }

  async scheduleLocalNotification(
    notification: PushNotificationData,
    trigger: Notifications.NotificationTriggerInput,
  ) {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: notification.sound !== false ? "default" : undefined,
      },
      trigger,
    });

    return notificationId;
  }

  async cancelNotification(notificationId: string) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Handle incoming notifications
  setNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void,
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  setNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void,
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Store notification preferences
  async setNotificationPreferences(preferences: {
    attendance: boolean;
    grades: boolean;
    announcements: boolean;
    events: boolean;
    urgent: boolean;
  }) {
    await AsyncStorage.setItem(
      "notificationPreferences",
      JSON.stringify(preferences),
    );
  }

  async getNotificationPreferences() {
    const stored = await AsyncStorage.getItem("notificationPreferences");
    return stored
      ? JSON.parse(stored)
      : {
          attendance: true,
          grades: true,
          announcements: true,
          events: true,
          urgent: true,
        };
  }

  // Send school-specific notifications
  async sendAttendanceNotification(
    studentName: string,
    status: "present" | "absent" | "late",
  ) {
    const preferences = await this.getNotificationPreferences();
    if (!preferences.attendance) return;

    const statusText =
      status === "present"
        ? "marked present"
        : status === "late"
          ? "marked late"
          : "marked absent";

    await this.scheduleNotification({
      title: "Attendance Update",
      body: `${studentName} has been ${statusText}`,
      data: { type: "attendance", studentName, status },
      priority: status === "absent" ? "high" : "default",
    });
  }

  async sendGradeNotification(
    studentName: string,
    subject: string,
    grade: string,
  ) {
    const preferences = await this.getNotificationPreferences();
    if (!preferences.grades) return;

    await this.scheduleNotification({
      title: "Grade Posted",
      body: `${studentName} received ${grade} in ${subject}`,
      data: { type: "grade", studentName, subject, grade },
      priority: "default",
    });
  }

  async sendAnnouncementNotification(
    title: string,
    message: string,
    urgent = false,
  ) {
    const preferences = await this.getNotificationPreferences();
    if (!preferences.announcements && !urgent) return;
    if (urgent && !preferences.urgent) return;

    await this.scheduleNotification({
      title: urgent ? "Urgent Announcement" : "School Announcement",
      body: message,
      data: { type: "announcement", title, message, urgent },
      priority: urgent ? "high" : "default",
    });
  }

  async sendEventNotification(
    eventTitle: string,
    eventDate: string,
    reminderHours = 24,
  ) {
    const preferences = await this.getNotificationPreferences();
    if (!preferences.events) return;

    // Schedule reminder notification
    const eventDateTime = new Date(eventDate);
    const reminderTime = new Date(
      eventDateTime.getTime() - reminderHours * 60 * 60 * 1000,
    );

    if (reminderTime > new Date()) {
      await this.scheduleLocalNotification(
        {
          title: "Upcoming Event",
          body: `${eventTitle} starts in ${reminderHours} hours`,
          data: { type: "event", eventTitle, eventDate },
        },
        { type: "date", date: reminderTime } as any,
      );
    }
  }

  // Get push token for server-side notifications
  async getPushToken() {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  }
}

export const pushNotificationService = new PushNotificationService();
