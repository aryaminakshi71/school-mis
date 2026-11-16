import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  DollarSign,
  GraduationCap,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardStats {
  students: { total: number; active: number };
  teachers: { total: number };
  classes: { total: number };
  attendance: { today: { date: string; present: number; absent: number } };
  fees: { collected: number; pending: number };
  library: { totalBooks: number; issuedBooks: number; availableBooks: number };
}

interface Alert {
  type: string;
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  studentId?: string;
  metadata?: any;
}

interface Activity {
  id: string;
  action: string;
  actorEmail: string | null;
  createdAt: string;
  statusCode: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: Activity[];
}

interface MetricsData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }>;
}

interface AlertsData {
  alerts: Alert[];
  total: number;
}

export function MonitoringDashboard() {
  const { toast } = useToast();
  const [periodDays, setPeriodDays] = useState("7");

  const { data: dashboard, isLoading: isDashboardLoading } =
    useQuery<DashboardData>({
      queryKey: ["monitoring-dashboard"],
      queryFn: async () => {
        return api.monitoring.dashboard() as Promise<DashboardData>;
      },
    });

  const { data: metrics } = useQuery<MetricsData>({
    queryKey: ["monitoring-metrics", periodDays],
    queryFn: async () => {
      return api.monitoring.metrics(periodDays) as Promise<MetricsData>;
    },
  });

  const { data: alertsData } = useQuery<AlertsData>({
    queryKey: ["monitoring-alerts"],
    queryFn: async () => {
      return api.monitoring.alerts() as Promise<AlertsData>;
    },
  });

  const stats = dashboard?.stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Monitoring Dashboard</h1>
        <Select value={periodDays} onValueChange={setPeriodDays}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {stats?.students?.total || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats?.students?.active || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {stats?.teachers?.total || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              Across {stats?.classes?.total || 0} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Today's Attendance
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {stats?.attendance?.today?.present || 0} /
              {(stats?.attendance?.today?.present || 0) +
                (stats?.attendance?.today?.absent || 0)}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats?.attendance?.today?.absent || 0} absent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Fees Collected
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ₹{(stats?.fees?.collected || 0).toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              ₹{(stats?.fees?.pending || 0).toLocaleString()} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {metrics?.datasets?.[0]?.data?.length &&
            metrics.labels.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={metrics.datasets[0].data.map((value, index) => ({
                    date: metrics.labels?.[index] || "",
                    value,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="present"
                    stroke="#22c55e"
                    name="Present"
                  />
                  <Line
                    type="monotone"
                    dataKey="absent"
                    stroke="#ef4444"
                    name="Absent"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No attendance data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee Collection Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {metrics?.datasets?.[1]?.data?.length &&
            metrics.labels.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.datasets[1].data.map((value, index) => ({
                    date: metrics.labels?.[index] || "",
                    amount: value,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="amount"
                    fill="#3b82f6"
                    name="Amount Collected"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No fee data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alerts & Notifications
          </CardTitle>
          <span className="text-muted-foreground text-sm">
            {alertsData?.total || 0} alerts
          </span>
        </CardHeader>
        <CardContent>
          {alertsData?.alerts?.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              No alerts at the moment
            </div>
          ) : (
            <div className="space-y-2">
              {alertsData?.alerts
                ?.slice(0, 5)
                .map((alert: Alert, index: number) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${
                      alert.severity === "critical"
                        ? "border-red-200 bg-red-50"
                        : alert.severity === "warning"
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-blue-200 bg-blue-50"
                    }`}
                  >
                    {alert.severity === "critical" ? (
                      <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
                    ) : alert.severity === "warning" ? (
                      <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-500" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-5 w-5 text-blue-500" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {alert.message}
                      </p>
                      {alert.metadata && (
                        <div className="mt-1 text-muted-foreground text-xs">
                          {alert.type === "low_attendance" && (
                            <span>
                              Present: {alert.metadata.presentDays} /{" "}
                              {alert.metadata.totalDays} days
                            </span>
                          )}
                          {alert.type === "fee_pending" && (
                            <span>
                              Pending: ₹{alert.metadata.pendingAmount}
                            </span>
                          )}
                          {alert.type === "library_overdue" && (
                            <span>
                              Due: {alert.metadata.dueDate} (
                              {alert.metadata.daysOverdue} days)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboard?.recentActivity?.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              No recent activity
            </div>
          ) : (
            <div className="space-y-2">
              {dashboard?.recentActivity
                ?.slice(0, 10)
                .map((activity: Activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between border-b p-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-muted-foreground text-sm">
                        by {activity.actorEmail || "System"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs ${
                          activity.statusCode >= 200 &&
                          activity.statusCode < 300
                            ? "bg-green-100 text-green-800"
                            : activity.statusCode >= 400
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {activity.statusCode}
                      </span>
                      <p className="mt-1 text-muted-foreground text-xs">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Library Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Library Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="font-bold text-2xl">
                {stats?.library?.totalBooks || 0}
              </p>
              <p className="text-muted-foreground text-sm">Total Books</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="font-bold text-2xl">
                {stats?.library?.issuedBooks || 0}
              </p>
              <p className="text-muted-foreground text-sm">Issued</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="font-bold text-2xl">
                {stats?.library?.availableBooks || 0}
              </p>
              <p className="text-muted-foreground text-sm">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
