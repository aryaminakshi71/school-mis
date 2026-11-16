import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  Calendar,
  DollarSign,
  FileText,
  MessageCircle,
  Send,
} from "lucide-react";
import { useState } from "react";

export type MessageTemplate =
  | "fee-reminder"
  | "attendance-alert"
  | "exam-schedule"
  | "general-notice"
  | "birthday-wish"
  | "event-reminder";

export interface WhatsAppMessage {
  id: string;
  template: MessageTemplate;
  recipientType: "parent" | "teacher" | "student";
  recipients: string[];
  variables: Record<string, string>;
  scheduledAt?: Date;
  status: "draft" | "scheduled" | "sent" | "failed";
  sentAt?: Date;
}

const messageTemplates: Record<
  MessageTemplate,
  {
    label: string;
    icon: React.ReactNode;
    description: string;
    variables: string[];
    defaultMessage: string;
  }
> = {
  "fee-reminder": {
    label: "Fee Reminder",
    icon: <DollarSign className="h-5 w-5" />,
    description: "Send fee payment reminders to parents",
    variables: ["studentName", "amount", "dueDate", "parentName"],
    defaultMessage:
      "Dear {{parentName}},\n\nThis is a friendly reminder that the fee payment of ₹{{amount}} for {{studentName}} is due on {{dueDate}}.\n\nPlease make the payment to avoid late fees.\n\nThank you,\nSchool Administration",
  },
  "attendance-alert": {
    label: "Attendance Alert",
    icon: <AlertCircle className="h-5 w-5" />,
    description: "Notify parents about student absence",
    variables: ["studentName", "date", "consecutiveDays", "parentName"],
    defaultMessage:
      "Dear {{parentName}},\n\nWe noticed that {{studentName}} was absent from school on {{date}}.{{#if consecutiveDays}}\n\nThis is {{consecutiveDays}} consecutive days of absence.{{/if}}\n\nPlease contact us if there are any concerns.\n\nRegards,\nSchool Administration",
  },
  "exam-schedule": {
    label: "Exam Schedule",
    icon: <FileText className="h-5 w-5" />,
    description: "Share exam timetable with students/parents",
    variables: ["studentName", "examName", "date", "time", "subject", "class"],
    defaultMessage:
      "Dear Parent,\n\nExam schedule for {{studentName}} ({{class}}):\n\n📚 {{examName}}\n📅 Date: {{date}}\n🕐 Time: {{time}}\n📖 Subject: {{subject}}\n\nPlease ensure your child is well-prepared.\n\nGood luck! 🍀",
  },
  "general-notice": {
    label: "General Notice",
    icon: <Bell className="h-5 w-5" />,
    description: "Send general announcements",
    variables: ["noticeTitle", "noticeBody", "date"],
    defaultMessage:
      "📢 *{{noticeTitle}}*\n\n{{noticeBody}}\n\n📅 Date: {{date}}\n\nRegards,\nSchool Management",
  },
  "birthday-wish": {
    label: "Birthday Wish",
    icon: <MessageCircle className="h-5 w-5" />,
    description: "Send birthday greetings",
    variables: ["studentName", "class", "parentName"],
    defaultMessage:
      "🎉 *Happy Birthday {{studentName}}!* 🎂\n\nWishing you a fantastic birthday filled with joy, laughter, and memorable moments!\n\nFrom all of us at School 🎈🎁",
  },
  "event-reminder": {
    label: "Event Reminder",
    icon: <Calendar className="h-5 w-5" />,
    description: "Remind about upcoming events",
    variables: ["eventName", "date", "time", "venue", "description"],
    defaultMessage:
      "📅 *{{eventName}}*\n\n{{description}}\n\n🗓️ Date: {{date}}\n🕐 Time: {{time}}\n📍 Venue: {{venue}}\n\nLooking forward to your participation!",
  },
};

interface WhatsAppIntegrationProps {
  onSend: (
    message: Omit<WhatsAppMessage, "id" | "status" | "sentAt">,
  ) => Promise<void>;
  availableRecipients: {
    id: string;
    name: string;
    phone: string;
    type: "parent" | "teacher" | "student";
  }[];
}

export function WhatsAppIntegration({
  onSend,
  availableRecipients,
}: WhatsAppIntegrationProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<MessageTemplate | null>(null);
  const [recipientType, setRecipientType] = useState<
    "parent" | "teacher" | "student"
  >("parent");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const filteredRecipients = availableRecipients.filter(
    (r) => r.type === recipientType,
  );

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    const templateDef = messageTemplates[template];
    setMessage(templateDef.defaultMessage);

    // Initialize variables
    const initialVars: Record<string, string> = {};
    templateDef.variables.forEach((v) => {
      initialVars[v] = "";
    });
    setVariables(initialVars);
  };

  const updateVariable = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const generatePreview = () => {
    let preview = message;
    Object.entries(variables).forEach(([key, value]) => {
      preview = preview.replace(
        new RegExp(`{{${key}}}`, "g"),
        value || `{{${key}}}`,
      );
    });
    return preview;
  };

  const handleSend = async () => {
    if (selectedRecipients.length === 0) {
      alert("Please select at least one recipient");
      return;
    }

    setIsSending(true);
    try {
      await onSend({
        template: selectedTemplate!,
        recipientType,
        recipients: selectedRecipients,
        variables,
        scheduledAt: isScheduled ? new Date(scheduledTime) : undefined,
      });

      // Reset form
      setSelectedTemplate(null);
      setSelectedRecipients([]);
      setVariables({});
      setMessage("");
      setIsScheduled(false);
      setScheduledTime("");
    } catch (error) {
      console.error("Send failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  const selectAllRecipients = () => {
    setSelectedRecipients(filteredRecipients.map((r) => r.id));
  };

  const clearAllRecipients = () => {
    setSelectedRecipients([]);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-green-500 px-6 py-4">
        <div className="flex items-center gap-3 text-white">
          <MessageCircle className="h-6 w-6" />
          <div>
            <h2 className="font-semibold text-lg">WhatsApp Messaging</h2>
            <p className="text-green-100 text-sm">
              Send notifications and alerts via WhatsApp
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {!selectedTemplate ? (
          /* Template Selection */
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Choose a message template
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(Object.keys(messageTemplates) as MessageTemplate[]).map(
                (template) => {
                  const def = messageTemplates[template];
                  return (
                    <button
                      key={template}
                      onClick={() => handleTemplateSelect(template)}
                      className="rounded-xl border border-transparent bg-gray-50 p-4 text-left transition-colors hover:border-green-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:border-green-800 dark:hover:bg-gray-700"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        {def.icon}
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {def.label}
                      </h4>
                      <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                        {def.description}
                      </p>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        ) : (
          /* Message Composer */
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-gray-500 text-sm hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ← Back to templates
            </button>

            {/* Recipient Type Selection */}
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                Recipient Type
              </label>
              <div className="flex gap-2">
                {(["parent", "teacher", "student"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setRecipientType(type);
                      setSelectedRecipients([]);
                    }}
                    className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                      recipientType === type
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}s
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Selection */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Select Recipients
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllRecipients}
                    className="text-green-600 text-xs hover:text-green-700 dark:text-green-400"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllRecipients}
                    className="text-gray-500 text-xs hover:text-gray-700 dark:text-gray-400"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                {filteredRecipients.map((recipient) => (
                  <label
                    key={recipient.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRecipients.includes(recipient.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRecipients([
                            ...selectedRecipients,
                            recipient.id,
                          ]);
                        } else {
                          setSelectedRecipients(
                            selectedRecipients.filter(
                              (id) => id !== recipient.id,
                            ),
                          );
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm dark:text-gray-100">
                        {recipient.name}
                      </p>
                      <p className="text-gray-500 text-xs">{recipient.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-gray-500 text-xs">
                {selectedRecipients.length} of {filteredRecipients.length}{" "}
                selected
              </p>
            </div>

            {/* Variables */}
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                Message Variables
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {messageTemplates[selectedTemplate].variables.map(
                  (variable) => (
                    <div key={variable}>
                      <label className="mb-1 block text-gray-500 text-xs capitalize dark:text-gray-400">
                        {variable.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <input
                        type="text"
                        value={variables[variable] || ""}
                        onChange={(e) =>
                          updateVariable(variable, e.target.value)
                        }
                        placeholder={`Enter ${variable}`}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Message Editor */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Message
                </label>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-green-600 text-xs hover:text-green-700 dark:text-green-400"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>

              <textarea
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMessage(e.target.value)
                }
                rows={6}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-gray-900 text-sm focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />

              {/* Preview */}
              <AnimatePresence>
                {showPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
                  >
                    <p className="mb-2 font-medium text-green-700 text-xs dark:text-green-400">
                      Message Preview:
                    </p>
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm dark:text-gray-300">
                      {generatePreview()}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Scheduling */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="schedule"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label
                htmlFor="schedule"
                className="text-gray-700 text-sm dark:text-gray-300"
              >
                Schedule for later
              </label>
            </div>

            <AnimatePresence>
              {isScheduled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setScheduledTime(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isSending || selectedRecipients.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  {isScheduled
                    ? "Schedule Message"
                    : `Send to ${selectedRecipients.length} recipients`}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WhatsAppIntegration;
