import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWebSocket } from "@/lib/websocket-context";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  DollarSign,
  TrendingUp,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect } from "react";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendance: number;
  monthlyFeeCollection: number;
  pendingFeePayments: number;
}

export const RealTimeDashboard = () => {
  const { isConnected, connectionQuality, subscribeToUpdates } = useWebSocket();

  // Subscribe to dashboard updates when component mounts
  useEffect(() => {
    subscribeToUpdates([
      "dashboard_update",
      "attendance_update",
      "fee_payment_update",
    ]);
  }, [subscribeToUpdates]);

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      const response = await fetch("/api/dashboard/stats", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to load dashboard stats");
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  const attendancePercentage = stats
    ? Math.round((stats.todayAttendance / stats.totalStudents) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-1 h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="mb-4 flex items-center gap-2">
        {isConnected ? (
          <Wifi
            className={`h-4 w-4 ${connectionQuality === "good" ? "text-green-500" : "text-yellow-500"}`}
          />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        <span className="text-muted-foreground text-sm">
          {isConnected
            ? `Live updates ${connectionQuality === "good" ? "active" : "slow"}`
            : "Offline - updates paused"}
        </span>
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
              {stats?.totalStudents.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Across {stats?.totalClasses} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Today's Attendance
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{attendancePercentage}%</div>
            <p className="text-muted-foreground text-xs">
              {stats?.todayAttendance}/{stats?.totalStudents} present
            </p>
            <Badge
              variant={
                attendancePercentage >= 90
                  ? "default"
                  : attendancePercentage >= 80
                    ? "secondary"
                    : "destructive"
              }
              className="mt-1"
            >
              {attendancePercentage >= 90
                ? "Excellent"
                : attendancePercentage >= 80
                  ? "Good"
                  : "Needs Attention"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Monthly Collection
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ₹{stats?.monthlyFeeCollection.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Pending Payments
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ₹{stats?.pendingFeePayments.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats?.pendingFeePayments
                ? Math.round(
                    (stats.pendingFeePayments / stats.monthlyFeeCollection) *
                      100,
                  )
                : 0}
              % of monthly collection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Live Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  Attendance marked for Class 10-A
                </p>
                <p className="text-muted-foreground text-xs">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  Grade submitted for Mathematics exam
                </p>
                <p className="text-muted-foreground text-xs">5 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  Fee payment received: ₹2,500
                </p>
                <p className="text-muted-foreground text-xs">8 minutes ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
