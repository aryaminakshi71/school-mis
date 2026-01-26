import type {
  NotificationPayload,
  NotificationResult,
} from "./notification-templates";
import {
  smsLogs,
  smsTemplates,
} from "@school/storage";
import { db } from "@school/storage";

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  messagingServiceSid?: string;
}

const getTwilioConfig = (): TwilioConfig => ({
  accountSid: process.env.TWILIO_ACCOUNT_SID || "",
  authToken: process.env.TWILIO_AUTH_TOKEN || "",
  phoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
  messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
});

export const smsService = {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const config = getTwilioConfig();

    if (!config.accountSid || !config.authToken || !config.phoneNumber) {
      console.warn("SMS service not configured. Skipping SMS.");
      return { success: false, error: "SMS service not configured" };
    }

    try {
      const message = await this.sendSMS(
        config.accountSid,
        config.authToken,
        config.phoneNumber,
        payload.to,
        payload.message,
      );

      await this.logSMS({
        recipientType: "general",
        recipientId: payload.to,
        phoneNumber: payload.to,
        message: payload.message,
        templateId: payload.type,
        status: message.sid ? "sent" : "failed",
        gatewayResponse: JSON.stringify(message),
        sentAt: new Date(),
      });

      return {
        success: true,
        messageId: message.sid,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      await this.logSMS({
        recipientType: "general",
        recipientId: payload.to,
        phoneNumber: payload.to,
        message: payload.message,
        templateId: payload.type,
        status: "failed",
        errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  async sendSMS(
    accountSid: string,
    authToken: string,
    from: string,
    to: string,
    body: string,
  ): Promise<{ sid: string; status: string }> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: to,
        From: from,
        Body: body,
      }).toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send SMS");
    }

    return {
      sid: data.sid,
      status: data.status,
    };
  },

  async sendBulk(
    payloads: NotificationPayload[],
  ): Promise<{
    success: number;
    failed: number;
    results: NotificationResult[];
  }> {
    const results: NotificationResult[] = [];
    let success = 0;
    let failed = 0;

    for (const payload of payloads) {
      const result = await this.send(payload);
      results.push(result);
      if (result.success) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed, results };
  },

  async logSMS(data: {
    recipientType: string;
    recipientId: string;
    phoneNumber: string;
    message: string;
    templateId?: string;
    status: string;
    gatewayResponse?: string;
    sentAt?: Date;
    errorMessage?: string;
  }): Promise<void> {
    try {
      await db.insert(smsLogs).values({
        recipientType: data.recipientType,
        recipientId: data.recipientId,
        phoneNumber: data.phoneNumber,
        message: data.message,
        templateId: data.templateId,
        status: data.status,
        gatewayResponse: data.gatewayResponse,
        sentAt: data.sentAt,
        errorMessage: data.errorMessage,
      });
    } catch (error) {
      console.error("Failed to log SMS:", error);
    }
  },

  async getTemplates(): Promise<(typeof smsTemplates.$inferSelect)[]> {
    try {
      return await db.select().from(smsTemplates);
    } catch {
      return [];
    }
  },

  async createTemplate(data: typeof smsTemplates.$inferInsert): Promise<void> {
    await db.insert(smsTemplates).values(data);
  },

  async sendTemplatedSMS(
    to: string,
    templateId: string,
    variables: Record<string, string>,
  ): Promise<NotificationResult> {
    try {
      const [template] = await db
        .select()
        .from(smsTemplates)
        .where(eq(smsTemplates.id, templateId))
        .limit(1);

      if (!template) {
        return { success: false, error: "Template not found" };
      }

      let message = template.content;
      for (const [key, value] of Object.entries(variables)) {
        message = message.replace(new RegExp(`{{${key}}}`, "g"), value);
      }

      return this.send({
        to,
        message,
        channel: "sms",
        type: template.type as any,
      });
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to send templated SMS",
      };
    }
  },
};

export const eq = (a: any, b: any) => a === b;

export default smsService;
