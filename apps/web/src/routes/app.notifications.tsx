import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Phone,
  Send,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/app/notifications")({
  component: NotificationsPage,
});

interface NotificationTemplate {
  id: string;
  name: string;
  preview: string;
  variables: string[];
}

interface NotificationLog {
  id: string;
  type: string;
  template: string;
  recipients: number;
  status: "sent" | "failed" | "scheduled";
  sentAt: string;
  messagePreview: string;
}

function NotificationsPage() {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<"send" | "history" | "templates">(
    "send",
  );
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [sendingTo, setSendingTo] = useState("all");

  const canSend = hasPermission("users", "create");

  const templates: NotificationTemplate[] = [
    {
      id: "fee_reminder",
      name: "Fee Reminder",
      preview: "Dear Parent, Your ward's fee of ₹{amount} is due on {date}.",
      variables: ["amount", "date", "studentName"],
    },
    {
      id: "attendance_alert",
      name: "Attendance Alert",
      preview: "Dear Parent, Your ward {studentName} was absent on {date}.",
      variables: ["studentName", "date"],
    },
    {
      id: "exam_notification",
      name: "Exam Notification",
      preview: "{examName} is scheduled on {date} for class {className}.",
      variables: ["examName", "date", "className"],
    },
    {
      id: "event_reminder",
      name: "Event Reminder",
      preview: "{eventName} will be held on {date} at {venue}.",
      variables: ["eventName", "date", "venue"],
    },
    {
      id: "general",
      name: "General Message",
      preview: "{message}",
      variables: ["message"],
    },
  ];

  const mockHistory: NotificationLog[] = [
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
    {
      id: "4",
      type: "sms",
      template: "general",
      recipients: 156,
      status: "failed",
      sentAt: "2026-01-18 11:00:00",
      messagePreview: "School will remain closed on Monday...",
    },
  ];

  const handleSend = async () => {
    if (!message) {
      toast.error("Please enter a message");
      return;
    }

    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: "Sending notification...",
      success: "Notification sent successfully!",
      error: "Failed to send notification",
    });
  };

  const stats = {
    totalSent: mockHistory
      .filter((n) => n.status === "sent")
      .reduce((sum, n) => sum + n.recipients, 0),
    scheduled: mockHistory
      .filter((n) => n.status === "scheduled")
      .reduce((sum, n) => sum + n.recipients, 0),
    failed: mockHistory
      .filter((n) => n.status === "failed")
      .reduce((sum, n) => sum + n.recipients, 0),
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-foreground">Notifications</h1>
        <p className="text-muted-foreground">
          Send SMS, WhatsApp, and email notifications
        </p>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Sent</p>
                <p className="font-bold text-2xl">{stats.totalSent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/15">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Scheduled</p>
                <p className="font-bold text-2xl">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Failed</p>
                <p className="font-bold text-2xl">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Success Rate</p>
                <p className="font-bold text-2xl">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("send")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${
              activeTab === "send"
                ? "border-primary border-b-2 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Send className="h-4 w-4" />
            Send
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${
              activeTab === "history"
                ? "border-primary border-b-2 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-4 w-4" />
            History
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${
              activeTab === "templates"
                ? "border-primary border-b-2 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" />
            Templates
          </button>
        </div>

        {activeTab === "send" && (
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block font-medium text-foreground text-sm">
                    Channel
                  </label>
                  <div className="flex gap-2">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-success/15 px-4 py-2 font-medium text-success">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 font-medium text-primary">
                      <Phone className="h-4 w-4" />
                      SMS
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-medium text-foreground text-sm">
                    Send To
                  </label>
                  <select
                    value={sendingTo}
                    onChange={(e) => setSendingTo(e.target.value)}
                    className="w-full rounded-lg border px-4 py-2"
                  >
                    <option value="all">All Parents</option>
                    <option value="class">By Class</option>
                    <option value="individual">Individual Parent</option>
                    <option value="teachers">All Teachers</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-medium text-foreground text-sm">
                    Template (Optional)
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => {
                      setSelectedTemplate(e.target.value);
                      const template = templates.find(
                        (t) => t.id === e.target.value,
                      );
                      if (template) {
                        setMessage(template.preview);
                      }
                    }}
                    className="w-full rounded-lg border px-4 py-2"
                  >
                    <option value="">Select a template</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block font-medium text-foreground text-sm">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your message..."
                  />
                  <p className="mt-1 text-muted-foreground text-sm">
                    {message.length}/160 characters
                  </p>
                </div>

                <Button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="flex w-full items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Notification
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                    Template
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                    Recipients
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                    Message Preview
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                    Sent At
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((log) => (
                  <tr key={log.id} className="border-t hover:bg-muted">
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 font-medium text-xs ${
                          log.type === "whatsapp"
                            ? "bg-success/15 text-success"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {log.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">
                      {log.template.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {log.recipients}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted-foreground text-sm">
                      {log.messagePreview}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 font-medium text-xs ${
                          log.status === "sent"
                            ? "bg-success/15 text-success"
                            : log.status === "scheduled"
                              ? "bg-warning/15 text-warning"
                              : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {log.status.charAt(0).toUpperCase() +
                          log.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-sm">
                      {log.sentAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="cursor-pointer rounded-lg border p-4 transition-colors hover:border-primary/30"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setMessage(template.preview);
                    setActiveTab("send");
                  }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium text-foreground">
                      {template.name}
                    </h3>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="rounded bg-muted p-2 text-muted-foreground text-sm">
                    {template.preview}
                  </p>
                  <p className="mt-2 text-muted-foreground text-xs">
                    Variables: {template.variables.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
