import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWebSocket } from "@/lib/websocket-context";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  GraduationCap,
  RefreshCw,
  Star,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GradeUpdate {
  studentId: string;
  studentName: string;
  subject: string;
  examType: string;
  obtainedMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  teacherName: string;
  timestamp: Date;
}

interface SubjectStats {
  subject: string;
  averageScore: number;
  totalExams: number;
  recentUpdates: number;
}

export const RealTimeGrades = () => {
  const { isConnected, lastGradeUpdate, subscribeToUpdates } = useWebSocket();
  const [recentUpdates, setRecentUpdates] = useState<GradeUpdate[]>([]);

  // Subscribe to grade updates
  useEffect(() => {
    subscribeToUpdates(["grade_update"]);
  }, [subscribeToUpdates]);

  // Handle live grade updates
  useEffect(() => {
    if (lastGradeUpdate) {
      const update: GradeUpdate = {
        studentId: lastGradeUpdate.studentId,
        studentName: `Student ${lastGradeUpdate.studentId.slice(-4)}`, // Mock name
        subject: `Subject ${lastGradeUpdate.subjectId.slice(-2)}`, // Mock subject
        examType: lastGradeUpdate.examType,
        obtainedMarks: lastGradeUpdate.obtainedMarks,
        maxMarks: lastGradeUpdate.maxMarks,
        percentage: Math.round(
          (lastGradeUpdate.obtainedMarks / lastGradeUpdate.maxMarks) * 100,
        ),
        grade: getGradeFromPercentage(
          (lastGradeUpdate.obtainedMarks / lastGradeUpdate.maxMarks) * 100,
        ),
        teacherName: `Teacher ${lastGradeUpdate.teacherId.slice(-4)}`, // Mock teacher
        timestamp: lastGradeUpdate.timestamp,
      };

      setRecentUpdates((prev) => [update, ...prev.slice(0, 9)]); // Keep last 10 updates
    }
  }, [lastGradeUpdate]);

  const {
    data: subjectStats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["grade-stats"],
    queryFn: async (): Promise<SubjectStats[]> => {
      // Mock data - replace with real API call
      return [
        {
          subject: "Mathematics",
          averageScore: 85,
          totalExams: 12,
          recentUpdates: 3,
        },
        {
          subject: "English",
          averageScore: 78,
          totalExams: 8,
          recentUpdates: 1,
        },
        {
          subject: "Science",
          averageScore: 82,
          totalExams: 10,
          recentUpdates: 2,
        },
        {
          subject: "History",
          averageScore: 75,
          totalExams: 6,
          recentUpdates: 0,
        },
        {
          subject: "Geography",
          averageScore: 80,
          totalExams: 7,
          recentUpdates: 1,
        },
      ];
    },
    refetchInterval: 60000, // Auto-refresh every minute
  });

  const getGradeFromPercentage = (percentage: number): string => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    return "F";
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case "A+":
        return "text-green-600 bg-green-100";
      case "A":
        return "text-green-600 bg-green-100";
      case "B+":
        return "text-blue-600 bg-blue-100";
      case "B":
        return "text-blue-600 bg-blue-100";
      case "C":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-red-600 bg-red-100";
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing grade data...");
  };

  const overallAverage = subjectStats?.length
    ? Math.round(
        subjectStats.reduce((sum, subj) => sum + subj.averageScore, 0) /
          subjectStats.length,
      )
    : 0;

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
          <h2 className="font-bold text-2xl">Live Grade Updates</h2>
          <p className="text-muted-foreground">
            Real-time grade tracking and performance analytics
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
              Overall Average
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{overallAverage}%</div>
            <p className="text-muted-foreground text-xs">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Recent Updates
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {subjectStats?.reduce(
                (sum, subj) => sum + subj.recentUpdates,
                0,
              ) || 0}
            </div>
            <p className="text-muted-foreground text-xs">Grades posted today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {subjectStats?.reduce((sum, subj) => sum + subj.totalExams, 0) ||
                0}
            </div>
            <p className="text-muted-foreground text-xs">This academic year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Top Performers
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {subjectStats?.filter((subj) => subj.averageScore >= 85).length ||
                0}
            </div>
            <p className="text-muted-foreground text-xs">
              Subjects with A+ average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectStats?.map((subject) => (
              <div
                key={subject.subject}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{subject.subject}</h4>
                  <p className="text-muted-foreground text-sm">
                    {subject.totalExams} exams • {subject.recentUpdates} recent
                    updates
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-2xl">
                      {subject.averageScore}%
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Average Score
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant="outline"
                      className={getGradeColor(
                        getGradeFromPercentage(subject.averageScore),
                      )}
                    >
                      {getGradeFromPercentage(subject.averageScore)}
                    </Badge>
                    {subject.recentUpdates > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {subject.recentUpdates} new
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Grade Updates Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Live Grade Updates</CardTitle>
        </CardHeader>
        <CardContent>
          {recentUpdates.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              No recent grade updates
            </p>
          ) : (
            <div className="space-y-3">
              {recentUpdates.map((update, index) => (
                <div
                  key={`${update.studentId}-${update.timestamp.getTime()}`}
                  className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                >
                  <div
                    className={`h-2 w-2 animate-pulse rounded-full bg-blue-500`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {update.studentName} scored{" "}
                      <span className="font-semibold text-blue-600">
                        {update.obtainedMarks}/{update.maxMarks} (
                        {update.percentage}%)
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {update.subject} • {update.examType} • Grade:{" "}
                      <span
                        className={`font-semibold ${getGradeColor(update.grade).split(" ")[0]}`}
                      >
                        {update.grade}
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      By {update.teacherName} •{" "}
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
