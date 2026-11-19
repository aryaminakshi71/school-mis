import { db, notificationLogs } from "@school/storage";
import { desc } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

/**
 * Real notification delivery via Twilio (WhatsApp + SMS).
 * Logs every send to the notification_logs table.
 */

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
  template: z.string(),
  message: z.string(),
  scheduledAt: z.string().datetime().optional(),
});

async function sendTwilio(to: string, body: string, whatsapp: boolean) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = whatsapp
    ? process.env.TWILIO_WHATSAPP_NUMBER
    : process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || !from) {
    return { ok: false as const, error: "Twilio not configured" };
  }

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: whatsapp ? `whatsapp:${from}` : from,
        To: whatsapp ? `whatsapp:${to}` : to,
        Body: body,
      }).toString(),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    return { ok: false as const, error: err.slice(0, 200) };
  }

  const data = (await res.json()) as { sid?: string };
  return { ok: true as const, id: data.sid };
}

notifications.get("/notifications", async (c) => {
  try {
    const rows = await db
      .select()
      .from(notificationLogs)
      .orderBy(desc(notificationLogs.createdAt))
      .limit(50);
    return c.json({ notifications: rows });
  } catch (error) {
    return c.json({ notifications: [], error: "database unavailable" }, 503);
  }
});

notifications.post("/send", async (c) => {
  try {
    const body = await c.req.json();
    const input = SendNotificationSchema.parse(body);

    const results: Array<{
      recipient: string;
      ok: boolean;
      id?: string;
      error?: string;
    }> = [];

    for (const r of input.recipients) {
      if (input.type === "whatsapp" && r.whatsapp) {
        results.push({
          recipient: r.id,
          ...(await sendTwilio(r.whatsapp, input.message, true)),
        });
      } else if (input.type === "sms" && r.phone) {
        results.push({
          recipient: r.id,
          ...(await sendTwilio(r.phone, input.message, false)),
        });
      } else {
        results.push({
          recipient: r.id,
          ok: false,
          error: "missing contact for channel",
        });
      }
    }

    const sent = results.filter((r) => r.ok).length;
    const failed = results.length - sent;
    const status = failed === 0 ? "sent" : sent > 0 ? "partial" : "failed";

    try {
      await db.insert(notificationLogs).values({
        type: input.type,
        template: input.template,
        recipients: input.recipients.length,
        sent,
        failed,
        status,
        messagePreview: input.message.slice(0, 120),
        providerRefs: results,
      });
    } catch (err) {
      console.error("Failed to log notification", err);
    }

    return c.json({ success: failed === 0, sent, failed, status, results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 400);
    }
    console.error("Notification send failed", error);
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
  ];
  return c.json({ templates });
});

export default notifications;
