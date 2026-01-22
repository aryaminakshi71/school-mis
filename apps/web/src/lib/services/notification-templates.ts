export type NotificationChannel = "sms" | "whatsapp" | "email" | "push";
export type NotificationType =
  | "attendance"
  | "fee_reminder"
  | "fee_payment"
  | "exam_schedule"
  | "exam_results"
  | "assignment"
  | "homework"
  | "circular"
  | "holiday"
  | "event"
  | "transport"
  | "general";

export interface NotificationPayload {
  to: string;
  subject?: string;
  message: string;
  channel: NotificationChannel;
  type?: NotificationType;
  data?: Record<string, any>;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  smsTemplate?: string;
  whatsappTemplate?: string;
  emailSubject?: string;
  emailBody?: string;
  variables: string[];
}

const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate> = {
  ATTENDANCE_ABSENT: {
    id: "ATTENDANCE_ABSENT",
    name: "Attendance Absence Alert",
    type: "attendance",
    smsTemplate:
      "Dear Parent, your ward {{student_name}} was absent on {{date}} from {{school_name}}. Please inform the school.",
    whatsappTemplate:
      "Dear Parent,\n\nYour ward {{student_name}} was absent on {{date}} from {{school_name}}.\n\nPlease inform the school.\n\n- {{school_name}}",
    emailSubject: "Attendance Alert - {{student_name}}",
    emailBody: `
      <h2>Attendance Alert</h2>
      <p>Dear Parent,</p>
      <p>Your ward <strong>{{student_name}}</strong> was absent on <strong>{{date}}</strong> from {{school_name}}.</p>
      <p>Please inform the school.</p>
      <p>- {{school_name}}</p>
    `,
    variables: ["student_name", "date", "school_name"],
  },
  ATTENDANCE_PRESENT: {
    id: "ATTENDANCE_PRESENT",
    name: "Attendance Present Update",
    type: "attendance",
    smsTemplate:
      "Dear Parent, your ward {{student_name}} was present on {{date}} at {{school_name}}.",
    variables: ["student_name", "date", "school_name"],
  },
  FEE_REMINDER: {
    id: "FEE_REMINDER",
    name: "Fee Payment Reminder",
    type: "fee_reminder",
    smsTemplate:
      "Dear Parent, Fee payment of Rs. {{amount}} for {{student_name}} is due on {{due_date}}. Please pay at {{school_name}}.",
    whatsappTemplate: `Dear Parent,

Fee payment reminder for {{student_name}}:

Amount: Rs. {{amount}}
Due Date: {{due_date}}

Please pay at {{school_name}} or through online mode.

- {{school_name}}`,
    emailSubject: "Fee Payment Reminder - {{student_name}}",
    emailBody: `
      <h2>Fee Payment Reminder</h2>
      <p>Dear Parent,</p>
      <p>This is a reminder for the fee payment of <strong>{{student_name}}</strong>.</p>
      <ul>
        <li><strong>Amount:</strong> Rs. {{amount}}</li>
        <li><strong>Due Date:</strong> {{due_date}}</li>
      </ul>
      <p>Please pay at {{school_name}} or through online mode.</p>
      <p>- {{school_name}}</p>
    `,
    variables: ["student_name", "amount", "due_date", "school_name"],
  },
  FEE_RECEIPT: {
    id: "FEE_RECEIPT",
    name: "Fee Payment Confirmation",
    type: "fee_payment",
    smsTemplate:
      "Dear Parent, Fee of Rs. {{amount}} for {{student_name}} has been received. Receipt No: {{receipt_number}}. Thank you.",
    whatsappTemplate: `Dear Parent,

Fee Payment Confirmation:

Student: {{student_name}}
Amount: Rs. {{amount}}
Receipt No: {{receipt_number}}

Thank you for your payment.

- {{school_name}}`,
    emailSubject: "Fee Receipt - {{student_name}}",
    variables: ["student_name", "amount", "receipt_number", "school_name"],
  },
  EXAM_SCHEDULE: {
    id: "EXAM_SCHEDULE",
    name: "Exam Schedule Notification",
    type: "exam_schedule",
    smsTemplate:
      "{{student_name}}: Exam {{exam_name}} scheduled on {{date}} at {{time}} for {{class_name}}.",
    whatsappTemplate: `Exam Schedule:

{{exam_name}}
Class: {{class_name}}
Date: {{date}}
Time: {{time}}
Venue: {{venue}}

- {{school_name}}`,
    emailSubject: "Exam Schedule - {{exam_name}}",
    variables: [
      "student_name",
      "exam_name",
      "date",
      "time",
      "class_name",
      "venue",
      "school_name",
    ],
  },
  EXAM_RESULTS: {
    id: "EXAM_RESULTS",
    name: "Exam Results Notification",
    type: "exam_results",
    smsTemplate:
      "Dear Parent, {{student_name}}'s result for {{exam_name}} is out. Total: {{total_marks}}/{{max_marks}}. Grade: {{grade}}.",
    whatsappTemplate: `Exam Results:

Student: {{student_name}}
Exam: {{exam_name}}
Total Marks: {{total_marks}}/{{max_marks}}
Grade: {{grade}}
Percentage: {{percentage}}%

- {{school_name}}`,
    emailSubject: "Exam Results - {{exam_name}}",
    variables: [
      "student_name",
      "exam_name",
      "total_marks",
      "max_marks",
      "grade",
      "percentage",
      "school_name",
    ],
  },
  ASSIGNMENT: {
    id: "ASSIGNMENT",
    name: "New Assignment Notification",
    type: "assignment",
    smsTemplate:
      '{{student_name}}: New assignment "{{assignment_title}}" for {{subject}}. Due: {{due_date}}.',
    emailSubject: "New Assignment - {{assignment_title}}",
    variables: [
      "student_name",
      "assignment_title",
      "subject",
      "due_date",
      "school_name",
    ],
  },
  HOMEWORK: {
    id: "HOMEWORK",
    name: "Homework Notification",
    type: "homework",
    smsTemplate:
      "{{student_name}}: Homework for {{subject}} given on {{date}}. Due: {{due_date}}.",
    variables: ["student_name", "subject", "date", "due_date", "school_name"],
  },
  CIRCULAR: {
    id: "CIRCULAR",
    name: "Circular Notification",
    type: "circular",
    smsTemplate:
      "Important circular from {{school_name}}: {{circular_title}}. Date: {{date}}.",
    whatsappTemplate: `📢 Important Circular

{{circular_title}}

Date: {{date}}

{{circular_content}}

- {{school_name}}`,
    emailSubject: "Circular - {{circular_title}}",
    variables: ["school_name", "circular_title", "date", "circular_content"],
  },
  HOLIDAY: {
    id: "HOLIDAY",
    name: "Holiday Announcement",
    type: "holiday",
    smsTemplate:
      "{{school_name}} will remain closed on {{holiday_name}} ({{date}}) on account of {{reason}}.",
    whatsappTemplate: `🏖️ Holiday Announcement

{{school_name}} will remain closed on:

{{holiday_name}}
Date: {{date}}
Reason: {{reason}}

- {{school_name}}`,
    emailSubject: "Holiday Notice - {{holiday_name}}",
    variables: ["school_name", "holiday_name", "date", "reason"],
  },
  TRANSPORT_ARRIVAL: {
    id: "TRANSPORT_ARRIVAL",
    name: "Transport Arrival Update",
    type: "transport",
    smsTemplate:
      "{{student_name}}: School bus has reached {{location}}. Estimated arrival at stop: {{time}}.",
    variables: ["student_name", "location", "time", "school_name"],
  },
  TRANSPORT_DELAY: {
    id: "TRANSPORT_DELAY",
    name: "Transport Delay Notification",
    type: "transport",
    smsTemplate:
      "{{student_name}}: School bus is delayed due to {{reason}}. New estimated arrival: {{time}}.",
    variables: ["student_name", "reason", "time", "school_name"],
  },
};

export function getTemplate(
  templateId: string,
): NotificationTemplate | undefined {
  return NOTIFICATION_TEMPLATES[templateId];
}

export function getTemplatesByType(
  type: NotificationType,
): NotificationTemplate[] {
  return Object.values(NOTIFICATION_TEMPLATES).filter((t) => t.type === type);
}

export function replaceVariables(
  template: string,
  variables: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match;
  });
}

export function validateTemplate(
  template: string,
  variables: string[],
): { valid: boolean; missing: string[] } {
  const foundVariables =
    template.match(/\{\{(\w+)\}\}/g)?.map((v) => v.slice(2, -2)) || [];
  const missing = variables.filter((v) => !foundVariables.includes(v));
  return { valid: missing.length === 0, missing };
}
