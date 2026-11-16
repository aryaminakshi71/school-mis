import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  static async registerForPushNotifications() {
    if (Platform.OS === "web") return null;

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  }

  static async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput,
  ) {
    if (Platform.OS === "web") return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: "default",
        priority: Notifications.AndroidImportance.HIGH,
      },
      trigger: trigger || null,
    });
  }

  static async sendPushNotification(
    expoPushToken: string,
    title: string,
    body: string,
    data?: any,
  ) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  // Web Push Notifications
  static async subscribeToWebPush() {
    if (Platform.OS !== "web") return null;

    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return null;
    }

    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VAPID_PUBLIC_KEY,
      });

      return subscription;
    }

    return null;
  }

  static async sendWebPushNotification(
    subscription: PushSubscription,
    payload: any,
  ) {
    await fetch("/api/notifications/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription, payload }),
    });
  }

  // Schedule recurring reminders
  static async scheduleFeeReminder(
    studentId: string,
    dueDate: Date,
    amount: number,
  ) {
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - 3); // 3 days before

    await this.scheduleLocalNotification(
      "Fee Payment Reminder",
      `Fee payment of ₹${amount} is due in 3 days`,
      { type: "fee_reminder", studentId, amount },
      { date: reminderDate },
    );
  }

  static async scheduleAttendanceAlert(studentId: string, attendance: number) {
    if (attendance < 75) {
      await this.scheduleLocalNotification(
        "Attendance Alert",
        `Your attendance is ${attendance}%. Please improve to avoid academic issues.`,
        { type: "attendance_alert", studentId, attendance },
      );
    }
  }
}

export default NotificationService;
