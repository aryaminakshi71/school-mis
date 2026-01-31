/**
 * Attendance Alerts - Low attendance notifications and parent alerts
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  Bell,
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  Settings,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/app/attendance/alerts")({
  component: AttendanceAlertsPage,
});

const subFeatures = [
  { name: "Dashboard", href: "/app/attendance", icon: Calendar },
  { name: "Student Attendance", href: "/app/attendance/students", icon: Users },
  { name: "Staff Attendance", href: "/app/attendance/staff", icon: Users },
  { name: "Reports", href: "/app/attendance/reports", icon: FileText },
  { name: "Leave Requests", href: "/app/attendance/leave", icon: Clock },
  { name: "Alerts", href: "/app/attendance/alerts", icon: AlertTriangle, active: true },
];

// Mock data for alerts
const alerts = [
  {
    id: "AL-001",
    type: "low_attendance",
    severity: "high",
    student: "Rahul Kumar",
    class: "10-A",
    message: "Attendance below 75% - 5 consecutive absences",
    date: "2026-01-27",
    status: "unread",
    notified: false,
  },
  {
    id: "AL-002",
    type: "consecutive_absent",
    severity: "medium",
    student: "Vikram Singh",
    class: "9-A",
    message: "Absent for 3 consecutive days",
    date: "2026-01-27",
    status: "read",
    notified: true,
  },
  {
    id: "AL-003",
    type: "parent_notification",
    severity: "low",
    student: "Ananya Gupta",
    class: "10-B",
    message: "Daily attendance report sent to parents",
    date: "2026-01-26",
    status: "read",
    notified: true,
  },
  {
    id: "AL-004",
    type: "low_attendance",
    severity: "high",
    student: "Sneha Patel",
    class: "9-B",
    message: "Monthly attendance below 80%",
    date: "2026-01-25",
    status: "unread",
    notified: false,
  },
  {
    id: "AL-005",
    type: "consecutive_absent",
    severity: "medium",
    student: "Amit Sharma",
    class: "8-A",
    message: "Absent for 4 consecutive days",
    date: "2026-01-24",
    status: "read",
    notified: true,
  },
];

// Mock data for notification history
const notificationHistory = [
  { id: "NT-001", type: "SMS", recipient: "Parents of Rahul Kumar", message: "Your ward is absent today", sent: "2026-01-27 09:00", status: "delivered" },
  { id: "NT-002", type: "Email", recipient: "Parents of Vikram Singh", message: "Low attendance alert", sent: "2026-01-26 14:30", status: "delivered" },
  { id: "NT-003", type: "App", recipient: "Parents of Ananya Gupta", message: "Daily attendance summary", sent: "2026-01-26 16:00", status: "read" },
];

function AttendanceAlertsPage() {
  const [activeTab, setActiveTab] = useState("alerts");

  const unreadCount = alerts.filter((a) => a.status === "unread").length;
  const highSeverityCount = alerts.filter((a) => a.severity === "high").length;

  const handleSendNotification = (alertId: string) => {
    toast.success(`Notification sent for alert ${alertId}`);
  };

  const handleMarkAsRead = (alertId: string) => {
    toast.success(`Alert ${alertId} marked as read`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "low_attendance":
        return <AlertTriangle className="h-4 w-4" />;
      case "consecutive_absent":
        return <XCircle className="h-4 w-4" />;
      case "parent_notification":
        return <Mail className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Alerts</h1>
          <p className="text-muted-foreground">Manage attendance alerts and send notifications to parents.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Alert Settings
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Send Alert
          </Button>
        </div>
      </div>

      {/* Sub-features Navigation */}
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {subFeatures.map((feature) => (
            <a
              key={feature.name}
              href={feature.href}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                feature.active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <feature.icon className="h-4 w-4" />
              {feature.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-100">
              <Bell className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highSeverityCount}</div>
            <p className="text-xs text-muted-foreground">Critical alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SMS Sent Today</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100">
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <div className="p-2 rounded-lg bg-green-100">
              <Mail className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "alerts"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Active Alerts
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Notification History
        </button>
      </div>

      {/* Content */}
      {activeTab === "alerts" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Attendance Alerts</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${alert.status === "unread" ? "bg-yellow-50 border-yellow-200" : "bg-gray-50"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{alert.student}</p>
                          <Badge variant="outline" className="text-xs">{alert.class}</Badge>
                          {alert.status === "unread" && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">Alert ID: {alert.id} • {alert.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.notified && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendNotification(alert.id)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Notify
                        </Button>
                      )}
                      {alert.status === "unread" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "history" && (
        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Notification ID</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Recipient</th>
                    <th className="pb-3 font-medium">Message</th>
                    <th className="pb-3 font-medium">Sent At</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationHistory.map((notification) => (
                    <tr key={notification.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{notification.id}</td>
                      <td className="py-3">
                        <Badge variant={notification.type === "SMS" ? "default" : notification.type === "Email" ? "outline" : "secondary"}>
                          {notification.type}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm">{notification.recipient}</td>
                      <td className="py-3 text-sm">{notification.message}</td>
                      <td className="py-3 text-sm">{notification.sent}</td>
                      <td className="py-3">
                        <Badge variant={notification.status === "delivered" ? "success" : notification.status === "read" ? "default" : "outline"}>
                          {notification.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
