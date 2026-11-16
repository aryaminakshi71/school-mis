import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  Calendar,
  ChevronDown,
  DollarSign,
  Download,
  Filter,
  Lightbulb,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface PredictionData {
  month: string;
  actual?: number;
  predicted: number;
  confidence: number;
}

export interface RiskStudent {
  id: string;
  name: string;
  class: string;
  riskScore: number;
  riskFactors: string[];
  suggestedActions: string[];
  attendance: number;
  grades: number;
  lastActive: Date;
}

export interface AIInsight {
  id: string;
  type: "prediction" | "anomaly" | "trend" | "recommendation";
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  category: "academic" | "financial" | "attendance" | "behavior";
  timestamp: Date;
}

interface PredictiveAnalyticsProps {
  studentData: any[];
  feeData: any[];
  attendanceData: any[];
  onStudentIntervention: (studentId: string) => void;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const generateMockPredictions = (): PredictionData[] => [
  { month: "Jan", actual: 85, predicted: 84, confidence: 0.92 },
  { month: "Feb", actual: 87, predicted: 88, confidence: 0.89 },
  { month: "Mar", actual: 84, predicted: 85, confidence: 0.91 },
  { month: "Apr", actual: 89, predicted: 90, confidence: 0.88 },
  { month: "May", actual: 91, predicted: 92, confidence: 0.93 },
  { month: "Jun", actual: 88, predicted: 89, confidence: 0.9 },
  { month: "Jul", predicted: 90, confidence: 0.85 },
  { month: "Aug", predicted: 92, confidence: 0.82 },
  { month: "Sep", predicted: 94, confidence: 0.78 },
];

const generateRiskStudents = (): RiskStudent[] => [
  {
    id: "1",
    name: "Rahul Sharma",
    class: "10-A",
    riskScore: 78,
    riskFactors: [
      "Declining attendance",
      "Missed 3 assignments",
      "Low participation",
    ],
    suggestedActions: [
      "Parent meeting",
      "Extra tutoring",
      "Attendance monitoring",
    ],
    attendance: 65,
    grades: 58,
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "Priya Patel",
    class: "9-B",
    riskScore: 65,
    riskFactors: [
      "Fee payment delayed",
      "Low grades in Math",
      "Irregular submissions",
    ],
    suggestedActions: [
      "Financial aid check",
      "Math remedial classes",
      "Counseling",
    ],
    attendance: 72,
    grades: 62,
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Ananya Gupta",
    class: "10-A",
    riskScore: 82,
    riskFactors: [
      "Sudden attendance drop",
      "No submissions this week",
      "Not participating",
    ],
    suggestedActions: ["Home visit", "Counseling session", "Medical check"],
    attendance: 45,
    grades: 70,
    lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

const generateInsights = (): AIInsight[] => [
  {
    id: "1",
    type: "prediction",
    title: "Fee collection expected to drop 15%",
    description:
      "Based on historical patterns and current economic indicators, next quarter fee collection may decrease by 15%. Early intervention recommended.",
    confidence: 0.87,
    impact: "high",
    category: "financial",
    timestamp: new Date(),
  },
  {
    id: "2",
    type: "anomaly",
    title: "Unusual attendance spike detected",
    description:
      "Class 10-A shows 23% higher attendance than average. This correlates with recent teaching methodology changes by Mrs. Gupta.",
    confidence: 0.94,
    impact: "medium",
    category: "attendance",
    timestamp: new Date(),
  },
  {
    id: "3",
    type: "trend",
    title: "Mathematics performance trending upward",
    description:
      "AI analysis shows consistent 8% month-over-month improvement in Math scores across all 10th grade sections.",
    confidence: 0.91,
    impact: "medium",
    category: "academic",
    timestamp: new Date(),
  },
  {
    id: "4",
    type: "recommendation",
    title: "Optimal exam scheduling suggestion",
    description:
      "Analysis of past 5 years suggests scheduling main exams between Oct 15-25 results in 12% better performance.",
    confidence: 0.83,
    impact: "low",
    category: "academic",
    timestamp: new Date(),
  },
];

export function PredictiveAnalytics({
  studentData,
  feeData,
  attendanceData,
  onStudentIntervention,
}: PredictiveAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "students" | "insights"
  >("overview");
  const [predictions] = useState<PredictionData[]>(generateMockPredictions());
  const [riskStudents] = useState<RiskStudent[]>(generateRiskStudents());
  const [insights] = useState<AIInsight[]>(generateInsights());
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(
    null,
  );

  const categoryIcons = {
    academic: BookOpen,
    financial: DollarSign,
    attendance: Calendar,
    behavior: Users,
  };

  const impactColors = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  };

  const typeLabels = {
    prediction: "Prediction",
    anomaly: "Anomaly",
    trend: "Trend",
    recommendation: "Recommendation",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                AI-Powered Predictive Analytics
              </h2>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                ML-driven insights for proactive decision making
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "students", label: "At-Risk Students", icon: AlertTriangle },
            { id: "insights", label: "AI Insights", icon: Lightbulb },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 dark:from-purple-900/20 dark:to-purple-900/30">
                  <p className="text-purple-600 text-sm dark:text-purple-400">
                    Predicted Accuracy
                  </p>
                  <p className="font-bold text-2xl text-purple-900 dark:text-purple-300">
                    94.2%
                  </p>
                  <p className="text-purple-600 text-xs dark:text-purple-400">
                    +2.3% vs last month
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-900/20 dark:to-blue-900/30">
                  <p className="text-blue-600 text-sm dark:text-blue-400">
                    Active Predictions
                  </p>
                  <p className="font-bold text-2xl text-blue-900 dark:text-blue-300">
                    127
                  </p>
                  <p className="text-blue-600 text-xs dark:text-blue-400">
                    Across all modules
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4 dark:from-green-900/20 dark:to-green-900/30">
                  <p className="text-green-600 text-sm dark:text-green-400">
                    Success Rate
                  </p>
                  <p className="font-bold text-2xl text-green-900 dark:text-green-300">
                    89.5%
                  </p>
                  <p className="text-green-600 text-xs dark:text-green-400">
                    Predictions validated
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-4 dark:from-orange-900/20 dark:to-orange-900/30">
                  <p className="text-orange-600 text-sm dark:text-orange-400">
                    Data Points
                  </p>
                  <p className="font-bold text-2xl text-orange-900 dark:text-orange-300">
                    12.4K
                  </p>
                  <p className="text-orange-600 text-xs dark:text-orange-400">
                    Analyzed daily
                  </p>
                </div>
              </div>

              {/* Performance Prediction Chart */}
              <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                  Academic Performance Forecast
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={predictions}>
                      <defs>
                        <linearGradient
                          id="colorPredicted"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorPredicted)"
                        name="Predicted"
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                        name="Actual"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-gray-500 text-sm dark:text-gray-400">
                  <Brain className="mr-1 inline h-4 w-4" />
                  AI predicts continued upward trend with 87% confidence based
                  on current trajectories
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "students" && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  At-Risk Students ({riskStudents.length} detected)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">
                    Risk Score Threshold:
                  </span>
                  <select className="rounded-lg border border-gray-300 px-3 py-1 text-sm dark:border-gray-700">
                    <option>High (70+)</option>
                    <option>Medium (50+)</option>
                    <option>Low (30+)</option>
                  </select>
                </div>
              </div>

              {riskStudents.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-xl border-2 p-4 ${
                    student.riskScore >= 75
                      ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10"
                      : student.riskScore >= 60
                        ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/10"
                        : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {student.name}
                        </h4>
                        <span className="text-gray-500 text-sm">
                          {student.class}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 font-medium text-xs ${
                            student.riskScore >= 75
                              ? "bg-red-200 text-red-800"
                              : student.riskScore >= 60
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-blue-200 text-blue-800"
                          }`}
                        >
                          Risk Score: {student.riskScore}
                        </span>
                      </div>

                      <div className="mb-3 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-gray-500 text-xs">Attendance</p>
                          <p
                            className={`font-medium ${student.attendance < 60 ? "text-red-600" : "text-gray-900"}`}
                          >
                            {student.attendance}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Grades</p>
                          <p
                            className={`font-medium ${student.grades < 60 ? "text-red-600" : "text-gray-900"}`}
                          >
                            {student.grades}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Last Active</p>
                          <p className="font-medium text-gray-900">
                            {Math.floor(
                              (Date.now() - student.lastActive.getTime()) /
                                (1000 * 60 * 60 * 24),
                            )}{" "}
                            days ago
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="mb-1 font-medium text-gray-700 text-xs dark:text-gray-300">
                            Risk Factors:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {student.riskFactors.map((factor, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-white px-2 py-1 text-gray-700 text-xs dark:bg-gray-700 dark:text-gray-300"
                              >
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="mb-1 font-medium text-gray-700 text-xs dark:text-gray-300">
                            AI Suggestions:
                          </p>
                          <ul className="space-y-1 text-gray-600 text-sm dark:text-gray-400">
                            {student.suggestedActions.map((action, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <Lightbulb className="h-3 w-3 text-yellow-500" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onStudentIntervention(student.id)}
                      className="ml-4 rounded-lg bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-primary/90"
                    >
                      Intervene
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  AI-Generated Insights
                </h3>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select className="rounded-lg border border-gray-300 px-3 py-1 text-sm dark:border-gray-700">
                    <option>All Categories</option>
                    <option>Academic</option>
                    <option>Financial</option>
                    <option>Attendance</option>
                  </select>
                </div>
              </div>

              {insights.map((insight) => {
                const Icon = categoryIcons[insight.category];
                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedInsight(insight)}
                    className="cursor-pointer rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-medium text-primary text-xs uppercase">
                            {insight.category}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${impactColors[insight.impact]}`}
                          >
                            {insight.impact} impact
                          </span>
                          <span className="text-gray-400 text-xs">
                            {typeLabels[insight.type]}
                          </span>
                        </div>
                        <h4 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                          {insight.title}
                        </h4>
                        <p className="text-gray-600 text-sm dark:text-gray-400">
                          {insight.description}
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                          <span className="text-gray-500 text-xs">
                            Confidence: {(insight.confidence * 100).toFixed(0)}%
                          </span>
                          <span className="text-gray-400 text-xs">
                            {insight.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PredictiveAnalytics;
