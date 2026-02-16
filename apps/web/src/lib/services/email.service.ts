import type {
  NotificationPayload,
  NotificationResult,
} from "./notification-templates";

interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
}

const getSMTPConfig = (): SMTPConfig => ({
  host: process.env.SMTP_HOST || "",
  port: parseInt(process.env.SMTP_PORT || "587"),
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS || "",
  fromEmail: process.env.FROM_EMAIL || "noreply@school.com",
  fromName: process.env.FROM_NAME || "School MIS",
});

export const emailService = {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const config = getSMTPConfig();

    if (!config.host || !config.user || !config.pass) {
      console.warn("Email service not configured. Skipping email.");
      return { success: false, error: "Email service not configured" };
    }

    try {
      const result = await this.sendEmail(
        {
          host: config.host,
          port: config.port,
          user: config.user,
          pass: config.pass,
        },
        {
          from: `${config.fromName} <${config.fromEmail}>`,
          to: payload.to,
          subject: payload.subject || "Notification from School MIS",
          text: payload.message,
          html: payload.message,
        },
      );

      return {
        success: true,
        messageId: result.messageId,
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

  async sendEmail(
    smtp: { host: string; port: number; user: string; pass: string },
    email: {
      from: string;
      to: string;
      subject: string;
      text: string;
      html: string;
    },
  ): Promise<{ messageId: string }> {
    const nodemailer = await import("nodemailer");

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    const info = await transporter.sendMail({
      from: email.from,
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    return {
      messageId: info.messageId,
    };
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

  async sendTemplatedEmail(
    to: string,
    templateName: string,
    variables: Record<string, string>,
    customSubject?: string,
  ): Promise<NotificationResult> {
    const templates: Record<string, { subject: string; body: string }> = {
      FEE_REMINDER: {
        subject: `Fee Payment Reminder - ${variables["student_name"] || "Student"}`,
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏫 School MIS</h1>
                <p>Fee Payment Reminder</p>
              </div>
              <div class="content">
                <p>Dear Parent,</p>
                <div class="highlight">
                  <strong>Fee Payment Reminder for ${variables["student_name"]}</strong>
                </div>
                <p>This is a friendly reminder for the fee payment:</p>
                <ul>
                  <li><strong>Amount:</strong> ₹${variables["amount"]}</li>
                  <li><strong>Due Date:</strong> ${variables["due_date"]}</li>
                </ul>
                <p>Please complete the payment at the earliest to avoid any inconvenience.</p>
                <a href="#" class="button">Pay Now</a>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${variables["school_name"]}. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      ATTENDANCE_ALERT: {
        subject: `Attendance Alert - ${variables["student_name"]}`,
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .alert-box { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 15px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚠️ Attendance Alert</h1>
              </div>
              <div class="content">
                <p>Dear Parent,</p>
                <div class="alert-box">
                  <strong>Your ward ${variables["student_name"]} was absent on ${variables["date"]}</strong>
                </div>
                <p>Please inform the school if there is a valid reason for the absence.</p>
                <p>If your ward is unwell, please ensure proper rest and recovery.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${variables["school_name"]}. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      EXAM_RESULTS: {
        subject: `Exam Results - ${variables["exam_name"]}`,
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .results-box { background: white; border: 2px solid #38ef7d; padding: 20px; border-radius: 10px; margin: 20px 0; }
              .grade { font-size: 36px; font-weight: bold; color: #38ef7d; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 Exam Results</h1>
                <p>${variables["exam_name"]}</p>
              </div>
              <div class="content">
                <p>Dear Parent,</p>
                <div class="results-box">
                  <p><strong>Student:</strong> ${variables["student_name"]}</p>
                  <p><strong>Total Marks:</strong> ${variables["total_marks"]}/${variables["max_marks"]}</p>
                  <p><strong>Percentage:</strong> ${variables["percentage"]}%</p>
                  <p class="grade">Grade: ${variables["grade"]}</p>
                </div>
                <p>Keep up the good work! 🌟</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${variables["school_name"]}. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
    };

    const template = templates[templateName];
    if (!template) {
      return { success: false, error: `Template '${templateName}' not found` };
    }

    return this.send({
      to,
      subject: customSubject || template.subject,
      message: template.body,
      channel: "email",
    });
  },
};

export default emailService;
