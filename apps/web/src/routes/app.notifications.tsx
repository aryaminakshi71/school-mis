import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MessageSquare,
  Send,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Users,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600">
          Send SMS, WhatsApp, and email notifications
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold">{stats.totalSent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden shadow-sm mb-6">
        <div className="border-b flex">
          <button
            onClick={() => setActiveTab("send")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
              activeTab === "send"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
              activeTab === "history"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            History
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
              activeTab === "templates"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            Templates
          </button>
        </div>

        {activeTab === "send" && (
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel
                  </label>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-lg font-medium flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </button>
                    <button className="flex-1 py-2 px-4 bg-blue-100 text-blue-700 rounded-lg font-medium flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      SMS
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Send To
                  </label>
                  <select
                    value={sendingTo}
                    onChange={(e) => setSendingTo(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="all">All Parents</option>
                    <option value="class">By Class</option>
                    <option value="individual">Individual Parent</option>
                    <option value="teachers">All Teachers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-4 py-2 border rounded-lg"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your message..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {message.length}/160 characters
                  </p>
                </div>

                <Button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Notification
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Template
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Recipients
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Message Preview
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Sent At
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((log) => (
                  <tr key={log.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.type === "whatsapp"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
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
                        <Users className="w-4 h-4" />
                        {log.recipients}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {log.messagePreview}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.status === "sent"
                            ? "bg-green-100 text-green-700"
                            : log.status === "scheduled"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {log.status.charAt(0).toUpperCase() +
                          log.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
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
            <div className="grid md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setMessage(template.preview);
                    setActiveTab("send");
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {template.name}
                    </h3>
                    <FileText className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {template.preview}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
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
