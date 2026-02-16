import type {
  NotificationPayload,
  NotificationResult,
} from "./notification-templates";

interface WhatsAppConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
  sandboxNumber: string;
}

const getWhatsAppConfig = (): WhatsAppConfig => ({
  accountSid: process.env.TWILIO_ACCOUNT_SID || "",
  authToken: process.env.TWILIO_AUTH_TOKEN || "",
  whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || "",
  sandboxNumber: process.env.TWILIO_WHATSAPP_SANDBOX_NUMBER || "",
});

export const whatsappService = {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const config = getWhatsAppConfig();

    if (!config.accountSid || !config.authToken || !config.whatsappNumber) {
      console.warn("WhatsApp service not configured. Skipping WhatsApp.");
      return { success: false, error: "WhatsApp service not configured" };
    }

    try {
      const message = await this.sendWhatsApp(
        config.accountSid,
        config.authToken,
        config.whatsappNumber,
        payload.to,
        payload.message,
      );

      return {
        success: true,
        messageId: message.sid,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  async sendWhatsApp(
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
        To: `whatsapp:${to}`,
        From: from,
        Body: body,
      }).toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send WhatsApp message");
    }

    return {
      sid: data.sid,
      status: data.status,
    };
  },

  async sendTemplatedMessage(
    to: string,
    templateName: string,
    variables: Record<string, string>,
  ): Promise<NotificationResult> {
    const templates: Record<string, string> = {
      FEE_REMINDER: `Dear Parent,

This is a reminder for the fee payment of *{{student_name}}*.

📊 *Fee Details:*
- Amount: ₹{{amount}}
- Due Date: {{due_date}}

Please complete the payment at your earliest convenience.

Best regards,
{{school_name}}`,
      ATTENDANCE_ALERT: `Dear Parent,

⚠️ *Attendance Alert*

Your ward *{{student_name}}* was absent on {{date}} from {{school_name}}.

Please inform the school if there is a valid reason.

Best regards,
{{school_name}}`,
      EXAM_RESULTS: `🎓 *Exam Results*

Student: *{{student_name}}*
Exam: *{{exam_name}}*
Total Marks: *{{total_marks}}/{{max_marks}}*
Grade: *{{grade}}*
Percentage: *{{percentage}}%*

Keep up the good work! 🌟

- {{school_name}}`,
      HOLIDAY_ANNOUNCEMENT: `🏖️ *Holiday Announcement*

{{school_name}} will remain closed on:

📅 *{{holiday_name}}*
Date: {{date}}
Reason: {{reason}}

Have a wonderful holiday!

- {{school_name}}`,
      CIRCULAR: `📢 *Circular*

*{{circular_title}}*

Date: {{date}}

{{circular_content}}

- {{school_name}}`,
    };

    const template = templates[templateName];
    if (!template) {
      return { success: false, error: `Template '${templateName}' not found` };
    }

    let message = template;
    for (const [key, value] of Object.entries(variables)) {
      message = message.replace(new RegExp(`{{${key}}}`, "g"), value);
    }

    return this.send({
      to,
      message,
      channel: "whatsapp",
    });
  },

  async sendBulk(payloads: NotificationPayload[]): Promise<{
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
      if (result.success) success++;
      else failed++;
    }

    return { success, failed, results };
  },
};

export default whatsappService;
