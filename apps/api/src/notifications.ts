import { Hono } from "hono";
import { z } from "zod";

const notifications = new Hono();

const SendNotificationSchema = z.object({
  type: z.enum(["sms", "whatsapp", "email", "push"]),
  recipients: z.array(
    z.object({
      id: z.string(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      whatsapp: z.string().optional(),
    }),
  ),
  template: z.enum([
    "fee_reminder",
    "attendance_alert",
    "exam_notification",
    "event_reminder",
    "general",
  ]),
  message: z.string(),
  scheduledAt: z.string().datetime().optional(),
});

interface NotificationLog {
  id: string;
  type: string;
  template: string;
  recipients: number;
  status: "sent" | "failed" | "scheduled";
  sentAt: string;
  messagePreview: string;
}

const notificationLogs: NotificationLog[] = [
  {
    id: "1",
    type: "whatsapp",
    template: "fee_reminder",
    recipients: 45,
    status: "sent",
    sentAt: "2026-01-20 10:30:00",
    messagePreview: "Dear Parent, Fee payment of ₹15,000 is due...",
  },
  {
    id: "2",
    type: "sms",
    template: "attendance_alert",
    recipients: 12,
    status: "sent",
    sentAt: "2026-01-19 14:00:00",
    messagePreview: "Your ward was absent today. Please inform...",
  },
  {
    id: "3",
    type: "whatsapp",
    template: "exam_notification",
    recipients: 89,
    status: "scheduled",
    sentAt: "2026-01-25 09:00:00",
    messagePreview: "Unit Test scheduled for Mathematics...",
  },
];

notifications.get("/notifications", (c) => {
  return c.json({ notifications: notificationLogs });
});

notifications.post("/send", async (c) => {
  try {
    const body = await c.req.json();
    const validated = SendNotificationSchema.parse(body);

    const { type, recipients, template, message } = validated;

    const providerResponses = [];

    if (type === "whatsapp") {
      for (const recipient of recipients) {
        if (recipient.whatsapp) {
          providerResponses.push({
            recipient: recipient.id,
            status: "delivered",
            provider: "whatsapp",
            messageId: `WA-${Date.now()}-${recipient.id}`,
          });
        }
      }
    }

    if (type === "sms") {
      for (const recipient of recipients) {
        if (recipient.phone) {
          providerResponses.push({
            recipient: recipient.id,
            status: "delivered",
            provider: "sms",
            messageId: `SMS-${Date.now()}-${recipient.id}`,
          });
        }
      }
    }

    const log: NotificationLog = {
      id: String(Date.now()),
      type,
      template,
      recipients: recipients.length,
      status: validated.scheduledAt ? "scheduled" : "sent",
      sentAt: validated.scheduledAt || new Date().toISOString(),
      messagePreview: message.substring(0, 50) + "...",
    };

    notificationLogs.unshift(log);

    return c.json({
      success: true,
      sent: providerResponses.length,
      failed: 0,
      logId: log.id,
      message: `${type} sent to ${providerResponses.length} recipients`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    return c.json({ error: "Failed to send notification" }, 500);
  }
});

notifications.get("/templates", (c) => {
  const templates = [
    {
      id: "fee_reminder",
      name: "Fee Reminder",
      preview:
        "Dear Parent, Your ward's fee of ₹{amount} is due on {date}. Please pay...",
      variables: ["amount", "date", "studentName"],
    },
    {
      id: "attendance_alert",
      name: "Attendance Alert",
      preview:
        "Dear Parent, Your ward {studentName} was absent on {date}. Please inform...",
      variables: ["studentName", "date"],
    },
    {
      id: "exam_notification",
      name: "Exam Notification",
      preview:
        "Dear Parent, {examName} is scheduled on {date} for class {className}...",
      variables: ["examName", "date", "className"],
    },
    {
      id: "event_reminder",
      name: "Event Reminder",
      preview: "Dear Parents, {eventName} will be held on {date} at {venue}...",
      variables: ["eventName", "date", "venue"],
    },
    {
      id: "general",
      name: "General Message",
      preview: "{message}",
      variables: ["message"],
    },
  ];

  return c.json({ templates });
});

notifications.post("/whatsapp/send", async (c) => {
  const body = await c.req.json();
  const { phone, message, templateName } = body;

  if (!phone || !message) {
    return c.json({ error: "Phone and message required" }, 400);
  }

  return c.json({
    success: true,
    messageId: `WA-${Date.now()}`,
    status: "sent",
    provider: "whatsapp",
    timestamp: new Date().toISOString(),
  });
});

notifications.post("/sms/send", async (c) => {
  const body = await c.req.json();
  const { phone, message } = body;

  if (!phone || !message) {
    return c.json({ error: "Phone and message required" }, 400);
  }

  return c.json({
    success: true,
    messageId: `SMS-${Date.now()}`,
    status: "sent",
    provider: "sms",
    timestamp: new Date().toISOString(),
  });
});

export default notifications;
