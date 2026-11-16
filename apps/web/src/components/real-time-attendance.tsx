import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWebSocket } from "@/lib/websocket-context";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, RefreshCw, Users, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AttendanceStats {
  classId: string;
  className: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

interface LiveAttendanceUpdate {
  studentId: string;
  studentName: string;
  className: string;
  status: "present" | "absent" | "late";
  timestamp: Date;
  markedBy: string;
}

export const RealTimeAttendance = () => {
  const { isConnected, lastAttendanceUpdate, subscribeToUpdates } =
    useWebSocket();
  const [liveUpdates, setLiveUpdates] = useState<LiveAttendanceUpdate[]>([]);

  // Subscribe to attendance updates
  useEffect(() => {
    subscribeToUpdates(["attendance_update"]);
  }, [subscribeToUpdates]);

  // Handle live attendance updates
  useEffect(() => {
    if (lastAttendanceUpdate) {
      const update: LiveAttendanceUpdate = {
        studentId: lastAttendanceUpdate.studentId,
        studentName: `Student ${lastAttendanceUpdate.studentId.slice(-4)}`, // Mock name
        className: `Class ${lastAttendanceUpdate.classId}`,
        status: lastAttendanceUpdate.status,
        timestamp: lastAttendanceUpdate.timestamp,
        markedBy: lastAttendanceUpdate.markedBy,
      };

      setLiveUpdates((prev) => [update, ...prev.slice(0, 9)]); // Keep last 10 updates
    }
  }, [lastAttendanceUpdate]);

  const {
    data: attendanceStats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["attendance-today"],
    queryFn: async (): Promise<AttendanceStats[]> => {
      // Mock data - replace with real API call
      return [
        {
          classId: "1",
          className: "Class 1-A",
          total: 35,
          present: 33,
          absent: 2,
          late: 0,
          percentage: 94,
        },
        {
          classId: "2",
          className: "Class 1-B",
          total: 32,
          present: 30,
          absent: 1,
          late: 1,
          percentage: 94,
        },
        {
          classId: "3",
          className: "Class 2-A",
          total: 38,
          present: 35,
          absent: 3,
          late: 0,
          percentage: 92,
        },
        {
          classId: "4",
          className: "Class 2-B",
          total: 36,
          present: 32,
          absent: 2,
          late: 2,
          percentage: 89,
        },
        {
          classId: "5",
          className: "Class 3-A",
          total: 40,
          present: 38,
          absent: 1,
          late: 1,
          percentage: 95,
        },
      ];
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const totalStudents =
    attendanceStats?.reduce((sum, cls) => sum + cls.total, 0) || 0;
  const totalPresent =
    attendanceStats?.reduce((sum, cls) => sum + cls.present, 0) || 0;
  const totalAbsent =
    attendanceStats?.reduce((sum, cls) => sum + cls.absent, 0) || 0;
  const totalLate =
    attendanceStats?.reduce((sum, cls) => sum + cls.late, 0) || 0;
  const overallPercentage =
    totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing attendance data...");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Live Attendance</h2>
          <p className="text-muted-foreground">
            Real-time attendance tracking across all classes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Live" : "Offline"}
          </Badge>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Overall Attendance
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{overallPercentage}%</div>
            <p className="text-muted-foreground text-xs">
              {totalPresent}/{totalStudents} present
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalAbsent}</div>
            <p className="text-muted-foreground text-xs">
              {((totalAbsent / totalStudents) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalLate}</div>
            <p className="text-muted-foreground text-xs">
              Marked as late today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Classes Tracked
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {attendanceStats?.length || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              Active classes today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Class-wise Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceStats?.map((classStats) => (
              <div
                key={classStats.classId}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{classStats.className}</h4>
                  <p className="text-muted-foreground text-sm">
                    {classStats.present}/{classStats.total} present
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-2xl">
                      {classStats.percentage}%
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="text-green-600">
                        {classStats.present}P
                      </span>
                      <span className="text-red-600">{classStats.absent}A</span>
                      {classStats.late > 0 && (
                        <span className="text-yellow-600">
                          {classStats.late}L
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`h-3 w-3 rounded-full ${
                      classStats.percentage >= 90
                        ? "bg-green-500"
                        : classStats.percentage >= 80
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Updates Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Live Attendance Updates</CardTitle>
        </CardHeader>
        <CardContent>
          {liveUpdates.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              No recent attendance updates
            </p>
          ) : (
            <div className="space-y-3">
              {liveUpdates.map((update, index) => (
                <div
                  key={`${update.studentId}-${update.timestamp.getTime()}`}
                  className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      update.status === "present"
                        ? "bg-green-500"
                        : update.status === "absent"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    } animate-pulse`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {update.studentName} marked as{" "}
                      <span
                        className={`font-semibold ${
                          update.status === "present"
                            ? "text-green-600"
                            : update.status === "absent"
                              ? "text-red-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {update.status}
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {update.className} •{" "}
                      {update.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
