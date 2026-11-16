import {
  BarChart,
  DoughnutChart,
  LineChart,
  PieChart,
} from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { usePerformanceMonitoring } from "@/lib/performance-utils";
import { useAnalytics } from "@/lib/services/analytics.service";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BookOpen,
  Calendar,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";

export function AnalyticsDashboard() {
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => api.students.list(),
  });

  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => api.teachers.list(),
  });

  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => api.attendance.list(),
  });

  const { data: grades, isLoading: gradesLoading } = useQuery({
    queryKey: ["grades"],
    queryFn: () => api.grades.list(),
  });

  const { data: fees, isLoading: feesLoading } = useQuery({
    queryKey: ["fees"],
    queryFn: () => api.fees.list(),
  });

  const analytics = useAnalytics();
  const performanceMetrics = usePerformanceMonitoring();

  const dashboardData = useMemo(() => {
    if (!students || !teachers || !attendance || !grades || !fees) return null;

    return {
      overview: {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalAttendance: attendance.length,
        totalGrades: grades.length,
        totalFees: fees.length,
      },
      attendanceTrends: analytics.getAttendanceTrends(attendance),
      gradeDistribution: analytics.getGradeDistribution(grades),
      feeCollection: analytics.getFeeCollectionTrends(fees),
      studentGrowth: analytics.getStudentGrowthTrends(students),
      performanceMetrics: performanceMetrics,
    };
  }, [
    students,
    teachers,
    attendance,
    grades,
    fees,
    analytics,
    performanceMetrics,
  ]);

  const isLoading =
    studentsLoading ||
    teachersLoading ||
    attendanceLoading ||
    gradesLoading ||
    feesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-1 h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const {
    overview,
    attendanceTrends,
    gradeDistribution,
    feeCollection,
    studentGrowth,
    performanceMetrics: dashboardPerformanceMetrics,
  } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{overview.totalStudents}</div>
            <p className="text-muted-foreground text-xs">
              {studentGrowth.trend === "up" ? "+" : ""}
              {studentGrowth.percentage}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Teachers
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{overview.totalTeachers}</div>
            <p className="text-muted-foreground text-xs">
              Active faculty members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Attendance Rate
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {attendanceTrends.averageRate}%
            </div>
            <p className="text-muted-foreground text-xs">
              {attendanceTrends.trend === "up" ? (
                <Badge variant="secondary" className="text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />+
                  {attendanceTrends.percentage}%
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-red-600">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  {attendanceTrends.percentage}%
                </Badge>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Fee Collection
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ${feeCollection.totalCollected.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {feeCollection.collectionRate}% collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription>
            Core Web Vitals and application performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="font-medium text-sm">First Contentful Paint</p>
              <p className="font-bold text-2xl">
                {performanceMetrics.fcp?.toFixed(0) || "N/A"}ms
              </p>
              <Badge
                variant={
                  performanceMetrics.fcp && performanceMetrics.fcp < 1800
                    ? "secondary"
                    : "destructive"
                }
              >
                {performanceMetrics.fcp && performanceMetrics.fcp < 1800
                  ? "Good"
                  : "Needs Improvement"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-sm">Largest Contentful Paint</p>
              <p className="font-bold text-2xl">
                {performanceMetrics.lcp?.toFixed(0) || "N/A"}ms
              </p>
              <Badge
                variant={
                  performanceMetrics.lcp && performanceMetrics.lcp < 2500
                    ? "secondary"
                    : "destructive"
                }
              >
                {performanceMetrics.lcp && performanceMetrics.lcp < 2500
                  ? "Good"
                  : "Needs Improvement"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-sm">First Input Delay</p>
              <p className="font-bold text-2xl">
                {performanceMetrics.fid?.toFixed(0) || "N/A"}ms
              </p>
              <Badge
                variant={
                  performanceMetrics.fid && performanceMetrics.fid < 100
                    ? "secondary"
                    : "destructive"
                }
              >
                {performanceMetrics.fid && performanceMetrics.fid < 100
                  ? "Good"
                  : "Needs Improvement"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-sm">Cumulative Layout Shift</p>
              <p className="font-bold text-2xl">
                {performanceMetrics.cls?.toFixed(3) || "N/A"}
              </p>
              <Badge
                variant={
                  performanceMetrics.cls && performanceMetrics.cls < 0.1
                    ? "secondary"
                    : "destructive"
                }
              >
                {performanceMetrics.cls && performanceMetrics.cls < 0.1
                  ? "Good"
                  : "Needs Improvement"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Tabs */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance Trends</TabsTrigger>
          <TabsTrigger value="grades">Grade Distribution</TabsTrigger>
          <TabsTrigger value="fees">Fee Collection</TabsTrigger>
          <TabsTrigger value="growth">Student Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance Rate</CardTitle>
                <CardDescription>
                  Attendance percentage over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={{
                    labels: attendanceTrends.monthly.map((item) => item.month),
                    datasets: [
                      {
                        label: "Attendance Rate (%)",
                        data: attendanceTrends.monthly.map((item) => item.rate),
                        borderColor: "rgb(59, 130, 246)",
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance by Class</CardTitle>
                <CardDescription>
                  Average attendance rate per class
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={{
                    labels: attendanceTrends.byClass.map((item) => item.class),
                    datasets: [
                      {
                        label: "Attendance Rate (%)",
                        data: attendanceTrends.byClass.map((item) => item.rate),
                        backgroundColor: "rgba(34, 197, 94, 0.8)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>
                  Distribution of grades across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={{
                    labels: gradeDistribution.grades.map((item) => item.grade),
                    datasets: [
                      {
                        data: gradeDistribution.grades.map(
                          (item) => item.count,
                        ),
                        backgroundColor: [
                          "rgba(34, 197, 94, 0.8)",
                          "rgba(59, 130, 246, 0.8)",
                          "rgba(251, 191, 36, 0.8)",
                          "rgba(239, 68, 68, 0.8)",
                          "rgba(168, 85, 247, 0.8)",
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom" as const,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Grades by Subject</CardTitle>
                <CardDescription>
                  Average performance across different subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={{
                    labels: gradeDistribution.bySubject.map(
                      (item) => item.subject,
                    ),
                    datasets: [
                      {
                        label: "Average Grade",
                        data: gradeDistribution.bySubject.map(
                          (item) => item.avgMarks,
                        ),
                        backgroundColor: "rgba(168, 85, 247, 0.8)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fee Collection Trends</CardTitle>
                <CardDescription>
                  Monthly fee collection over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={{
                    labels: feeCollection.monthly.map((item) => item.month),
                    datasets: [
                      {
                        label: "Amount Collected ($)",
                        data: feeCollection.monthly.map((item) => item.amount),
                        borderColor: "rgb(34, 197, 94)",
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outstanding Fees</CardTitle>
                <CardDescription>Outstanding fees by category</CardDescription>
              </CardHeader>
              <CardContent>
                <DoughnutChart
                  data={{
                    labels: feeCollection.outstanding.map((item) => item.class),
                    datasets: [
                      {
                        data: feeCollection.outstanding.map(
                          (item) => item.amount,
                        ),
                        backgroundColor: [
                          "rgba(239, 68, 68, 0.8)",
                          "rgba(251, 191, 36, 0.8)",
                          "rgba(59, 130, 246, 0.8)",
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom" as const,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollment Growth</CardTitle>
              <CardDescription>
                Student enrollment trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={{
                  labels: studentGrowth.monthly.map((item) => item.month),
                  datasets: [
                    {
                      label: "New Enrollments",
                      data: studentGrowth.monthly.map((item) => item.count),
                      borderColor: "rgb(168, 85, 247)",
                      backgroundColor: "rgba(168, 85, 247, 0.1)",
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
