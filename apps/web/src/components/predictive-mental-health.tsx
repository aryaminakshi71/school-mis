import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Brain,
  CheckCircle,
  ChevronDown,
  Frown,
  Heart,
  LineChart,
  Meh,
  Smile,
} from "lucide-react";
import { useState } from "react";

export type MentalHealthRiskLevel = "low" | "moderate" | "high" | "critical";
export type IndicatorType =
  | "behavioral"
  | "academic"
  | "social"
  | "physiological"
  | "digital";

export interface MentalHealthPrediction {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  riskLevel: MentalHealthRiskLevel;
  riskScore: number;
  confidence: number;
  predictedAt: Date;
  validUntil: Date;
  indicators: MentalHealthIndicator[];
  factors: RiskFactor[];
  recommendations: Recommendation[];
  alertStatus: "active" | "acknowledged" | "resolved" | "monitoring";
  assignedCounselor?: string;
  interventions: Intervention[];
  privacyLevel: "standard" | "elevated" | "urgent";
}

export interface MentalHealthIndicator {
  id: string;
  type: IndicatorType;
  metric: string;
  value: number;
  baseline: number;
  deviation: number;
  trend: "improving" | "stable" | "declining";
  severity: "low" | "medium" | "high";
  lastUpdated: Date;
  dataPoints: number;
}

export interface RiskFactor {
  id: string;
  category: string;
  description: string;
  weight: number;
  impact: number;
  evidence: string[];
  timeframe: string;
}

export interface Recommendation {
  id: string;
  priority: number;
  category: "counseling" | "academic" | "medical" | "lifestyle" | "social";
  action: string;
  description: string;
  resources: string[];
  timeframe: string;
  expectedOutcome: string;
  assignedTo?: string;
}

export interface Intervention {
  id: string;
  type: string;
  description: string;
  startedAt: Date;
  completedAt?: Date;
  status: "planned" | "in-progress" | "completed" | "cancelled";
  outcome?: string;
  effectiveness?: number;
}

interface PredictiveMentalHealthProps {
  userRole?: "admin" | "counselor" | "teacher" | "parent" | "student";
  userId?: string;
  onFlagStudent?: (
    studentId: string,
    prediction: Omit<
      MentalHealthPrediction,
      "id" | "predictedAt" | "validUntil"
    >,
  ) => Promise<string>;
  onUpdateIntervention?: (
    predictionId: string,
    intervention: Intervention,
  ) => Promise<void>;
  onAcknowledgeAlert?: (predictionId: string) => Promise<void>;
  onViewStudentProfile?: (studentId: string) => Promise<void>;
}

export function PredictiveMentalHealthMonitoring({
  userRole = "counselor",
  userId = "C001",
  onFlagStudent,
  onUpdateIntervention,
  onAcknowledgeAlert,
}: PredictiveMentalHealthProps) {
  const [activeTab, setActiveTab] = useState<
    "alerts" | "dashboard" | "trends" | "interventions"
  >("alerts");
  const [selectedPrediction, setSelectedPrediction] =
    useState<MentalHealthPrediction | null>(null);
  const [filterRiskLevel, setFilterRiskLevel] = useState<
    MentalHealthRiskLevel | "all"
  >("all");
  const [showInterventionForm, setShowInterventionForm] = useState(false);

  const [predictions] = useState<MentalHealthPrediction[]>([
    {
      id: "PMH001",
      studentId: "S001",
      studentName: "Alex Rivera",
      grade: "10",
      riskLevel: "high",
      riskScore: 78,
      confidence: 0.89,
      predictedAt: new Date(Date.now() - 86400000),
      validUntil: new Date(Date.now() + 604800000),
      alertStatus: "active",
      privacyLevel: "elevated",
      indicators: [
        {
          id: "I1",
          type: "behavioral",
          metric: "Sleep Pattern Changes",
          value: 35,
          baseline: 65,
          deviation: -46,
          trend: "declining",
          severity: "high",
          lastUpdated: new Date(),
          dataPoints: 14,
        },
        {
          id: "I2",
          type: "academic",
          metric: "Assignment Completion Rate",
          value: 42,
          baseline: 88,
          deviation: -52,
          trend: "declining",
          severity: "high",
          lastUpdated: new Date(),
          dataPoints: 21,
        },
        {
          id: "I3",
          type: "social",
          metric: "Social Interactions",
          value: 28,
          baseline: 75,
          deviation: -63,
          trend: "declining",
          severity: "medium",
          lastUpdated: new Date(),
          dataPoints: 30,
        },
      ],
      factors: [
        {
          id: "F1",
          category: "Academic Stress",
          description: "Multiple overdue assignments and declining test scores",
          weight: 0.3,
          impact: 8.5,
          evidence: ["3 late assignments", "Test scores dropped 15%"],
          timeframe: "Last 3 weeks",
        },
        {
          id: "F2",
          category: "Sleep Disruption",
          description: "Significant changes in sleep patterns detected",
          weight: 0.25,
          impact: 7.8,
          evidence: ["Late night activity", "Early morning absence"],
          timeframe: "Last 2 weeks",
        },
      ],
      recommendations: [
        {
          id: "R1",
          priority: 1,
          category: "counseling",
          action: "Schedule urgent counseling session",
          description:
            "One-on-one session with school counselor within 48 hours",
          resources: ["School Counseling Center", "Crisis Hotline"],
          timeframe: "Within 48 hours",
          expectedOutcome: "Immediate emotional support and assessment",
        },
        {
          id: "R2",
          priority: 2,
          category: "academic",
          action: "Academic support plan",
          description: "Coordinate with teachers for flexible deadlines",
          resources: ["Academic Support Team", "Study Skills Workshop"],
          timeframe: "Within 1 week",
          expectedOutcome: "Reduced academic pressure",
        },
      ],
      interventions: [],
    },
    {
      id: "PMH002",
      studentId: "S002",
      studentName: "Jordan Kim",
      grade: "11",
      riskLevel: "moderate",
      riskScore: 52,
      confidence: 0.76,
      predictedAt: new Date(Date.now() - 172800000),
      validUntil: new Date(Date.now() + 518400000),
      alertStatus: "acknowledged",
      privacyLevel: "standard",
      indicators: [
        {
          id: "I4",
          type: "behavioral",
          metric: "Mood Variability",
          value: 58,
          baseline: 70,
          deviation: -17,
          trend: "declining",
          severity: "medium",
          lastUpdated: new Date(),
          dataPoints: 28,
        },
        {
          id: "I5",
          type: "academic",
          metric: "Class Participation",
          value: 65,
          baseline: 82,
          deviation: -21,
          trend: "stable",
          severity: "low",
          lastUpdated: new Date(),
          dataPoints: 14,
        },
      ],
      factors: [
        {
          id: "F3",
          category: "Social Isolation",
          description: "Decreased peer interactions detected",
          weight: 0.2,
          impact: 6.5,
          evidence: [
            "Lunch alone patterns",
            "Reduced group work participation",
          ],
          timeframe: "Last month",
        },
      ],
      recommendations: [
        {
          id: "R3",
          priority: 1,
          category: "social",
          action: "Peer support program",
          description: "Connect with peer mentor program",
          resources: ["Peer Mentor Network", "Social Skills Group"],
          timeframe: "Within 2 weeks",
          expectedOutcome: "Increased social connections",
        },
      ],
      interventions: [
        {
          id: "INT1",
          type: "Counseling Session",
          description: "Initial assessment completed",
          startedAt: new Date(Date.now() - 86400000),
          status: "completed",
          outcome: "Student receptive to support",
        },
      ],
    },
    {
      id: "PMH003",
      studentId: "S003",
      studentName: "Taylor Chen",
      grade: "12",
      riskLevel: "low",
      riskScore: 23,
      confidence: 0.82,
      predictedAt: new Date(Date.now() - 259200000),
      validUntil: new Date(Date.now() + 432000000),
      alertStatus: "monitoring",
      privacyLevel: "standard",
      indicators: [
        {
          id: "I6",
          type: "behavioral",
          metric: "Overall Well-being",
          value: 85,
          baseline: 80,
          deviation: 6,
          trend: "improving",
          severity: "low",
          lastUpdated: new Date(),
          dataPoints: 60,
        },
      ],
      factors: [],
      recommendations: [
        {
          id: "R4",
          priority: 3,
          category: "lifestyle",
          action: "Maintain wellness routine",
          description: "Continue current healthy habits and stress management",
          resources: ["Wellness Resources"],
          timeframe: "Ongoing",
          expectedOutcome: "Continued positive mental health",
        },
      ],
      interventions: [],
    },
  ]);

  const [dashboardStats] = useState({
    totalStudents: 1250,
    studentsMonitored: 1185,
    activeAlerts: 12,
    highRisk: 3,
    moderateRisk: 8,
    lowRisk: 1174,
    interventionsActive: 15,
    resolvedThisMonth: 23,
    avgResponseTime: "4.2 hours",
  });

  const [trendData] = useState({
    monthlyRiskDistribution: [
      { month: "Jan", high: 5, moderate: 12, low: 1188 },
      { month: "Feb", high: 4, moderate: 10, low: 1191 },
      { month: "Mar", high: 3, moderate: 8, low: 1174 },
    ],
    interventionSuccessRate: 0.87,
    earlyDetectionRate: 0.94,
    parentEngagement: 0.78,
  });

  const riskLevelColors: Record<MentalHealthRiskLevel, string> = {
    low: "bg-green-100 text-green-700 border-green-200",
    moderate: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    critical: "bg-red-100 text-red-700 border-red-200",
  };

  const riskLevelIcons: Record<MentalHealthRiskLevel, any> = {
    low: Smile,
    moderate: Meh,
    high: Frown,
    critical: AlertCircle,
  };

  const filteredPredictions = predictions.filter(
    (p) => filterRiskLevel === "all" || p.riskLevel === filterRiskLevel,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Brain className="h-8 w-8 text-pink-600" />
            Predictive Mental Health Monitoring
          </h2>
          <p className="mt-1 text-slate-600">
            AI-powered early detection of mental health concerns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-100 px-4 py-2 text-green-700">
            <span className="font-semibold">
              {dashboardStats.studentsMonitored}
            </span>{" "}
            students monitored
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          {
            label: "Active Alerts",
            value: dashboardStats.activeAlerts,
            color: "bg-red-500",
            icon: AlertCircle,
          },
          {
            label: "High Risk",
            value: dashboardStats.highRisk,
            color: "bg-orange-500",
            icon: Frown,
          },
          {
            label: "Moderate Risk",
            value: dashboardStats.moderateRisk,
            color: "bg-amber-500",
            icon: Meh,
          },
          {
            label: "Interventions",
            value: dashboardStats.interventionsActive,
            color: "bg-blue-500",
            icon: Heart,
          },
          {
            label: "Resolved",
            value: dashboardStats.resolvedThisMonth,
            color: "bg-green-500",
            icon: CheckCircle,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon
                className={`h-4 w-4 ${stat.color.replace("bg-", "text-")}`}
              />
              <span className="text-slate-600 text-sm">{stat.label}</span>
            </div>
            <p className="font-bold text-2xl text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "alerts", label: "Risk Alerts", icon: AlertCircle },
          { id: "dashboard", label: "Dashboard", icon: Activity },
          { id: "trends", label: "Trends", icon: LineChart },
          { id: "interventions", label: "Interventions", icon: Heart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-pink-600 border-b-2 text-pink-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "alerts" && (
        <>
          <div className="flex gap-4">
            <select
              value={filterRiskLevel}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterRiskLevel(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredPredictions.map((prediction) => {
                const Icon = riskLevelIcons[prediction.riskLevel];
                return (
                  <motion.div
                    key={prediction.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onClick={() => setSelectedPrediction(prediction)}
                    className={`cursor-pointer overflow-hidden rounded-xl border-2 bg-white shadow-md transition-shadow hover:shadow-lg ${
                      riskLevelColors[prediction.riskLevel].split(" ")[2]
                    }`}
                  >
                    <div className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`rounded-full p-3 ${riskLevelColors[prediction.riskLevel].split(" ")[0]}`}
                          >
                            <Icon
                              className={`h-6 w-6 ${riskLevelColors[prediction.riskLevel].split(" ")[1]}`}
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-xl">
                              {prediction.studentName}
                            </h3>
                            <p className="text-slate-600">
                              Grade {prediction.grade} • ID:{" "}
                              {prediction.studentId}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`rounded-full px-3 py-1 font-medium text-sm ${riskLevelColors[prediction.riskLevel]}`}
                          >
                            {prediction.riskLevel.toUpperCase()} RISK
                          </span>
                          <p className="mt-2 font-bold text-2xl text-slate-900">
                            {prediction.riskScore}%
                          </p>
                          <p className="text-slate-500 text-sm">
                            AI Confidence:{" "}
                            {(prediction.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 grid grid-cols-3 gap-4">
                        {prediction.indicators.slice(0, 3).map((indicator) => (
                          <div
                            key={indicator.id}
                            className="rounded-lg bg-slate-50 p-3"
                          >
                            <p className="text-slate-500 text-sm">
                              {indicator.metric}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="font-bold text-lg text-slate-900">
                                {indicator.value}%
                              </span>
                              <span
                                className={`text-xs ${
                                  indicator.trend === "improving"
                                    ? "text-green-600"
                                    : indicator.trend === "declining"
                                      ? "text-red-600"
                                      : "text-amber-600"
                                }`}
                              >
                                {indicator.trend === "improving"
                                  ? "↑"
                                  : indicator.trend === "declining"
                                    ? "↓"
                                    : "→"}{" "}
                                {Math.abs(indicator.deviation)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-1 text-xs ${
                              prediction.alertStatus === "active"
                                ? "bg-red-100 text-red-700"
                                : prediction.alertStatus === "acknowledged"
                                  ? "bg-blue-100 text-blue-700"
                                  : prediction.alertStatus === "monitoring"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {prediction.alertStatus.toUpperCase()}
                          </span>
                          <span className="text-slate-500 text-sm">
                            {prediction.interventions.length} intervention
                            {prediction.interventions.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <button className="font-medium text-pink-600 text-sm hover:text-pink-800">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      )}

      {selectedPrediction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedPrediction(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div
              className={`border-b p-6 ${riskLevelColors[selectedPrediction.riskLevel].split(" ")[0]}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const Icon = riskLevelIcons[selectedPrediction.riskLevel];
                    return (
                      <Icon
                        className={`h-8 w-8 ${riskLevelColors[selectedPrediction.riskLevel].split(" ")[1]}`}
                      />
                    );
                  })()}
                  <div>
                    <h3 className="font-bold text-2xl text-slate-900">
                      {selectedPrediction.studentName}
                    </h3>
                    <p className="text-slate-600">
                      Risk Assessment #{selectedPrediction.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPrediction(null)}
                  className="rounded-full p-2 transition-colors hover:bg-white/50"
                >
                  <ChevronDown className="h-6 w-6 rotate-180" />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-slate-500 text-sm">Risk Score</p>
                  <p className="font-bold text-3xl text-slate-900">
                    {selectedPrediction.riskScore}%
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-slate-500 text-sm">AI Confidence</p>
                  <p className="font-bold text-3xl text-slate-900">
                    {(selectedPrediction.confidence * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-slate-500 text-sm">Indicators</p>
                  <p className="font-bold text-3xl text-slate-900">
                    {selectedPrediction.indicators.length}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-slate-900">
                  Risk Factors
                </h4>
                <div className="space-y-3">
                  {selectedPrediction.factors.map((factor) => (
                    <div
                      key={factor.id}
                      className="rounded-lg border border-red-200 bg-red-50 p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h5 className="font-medium text-red-900">
                          {factor.category}
                        </h5>
                        <span className="rounded bg-red-100 px-2 py-1 text-red-700 text-sm">
                          Impact: {factor.impact}/10
                        </span>
                      </div>
                      <p className="mb-2 text-red-800">{factor.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {factor.evidence.map((evidence, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-white px-2 py-1 text-red-700 text-xs"
                          >
                            {evidence}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-red-600 text-sm">
                        {factor.timeframe}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-slate-900">
                  Recommended Actions
                </h4>
                <div className="space-y-3">
                  {selectedPrediction.recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="rounded-lg border border-blue-200 bg-blue-50 p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded bg-blue-600 px-2 py-1 text-white text-xs">
                          Priority {rec.priority}
                        </span>
                        <span className="text-blue-600 text-sm capitalize">
                          {rec.category}
                        </span>
                      </div>
                      <h5 className="mb-1 font-medium text-blue-900">
                        {rec.action}
                      </h5>
                      <p className="text-blue-800 text-sm">{rec.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-blue-600 text-sm">
                        <span>⏱ {rec.timeframe}</span>
                        <span>🎯 {rec.expectedOutcome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPrediction.interventions.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-slate-900">
                    Active Interventions
                  </h4>
                  <div className="space-y-2">
                    {selectedPrediction.interventions.map((intervention) => (
                      <div
                        key={intervention.id}
                        className="rounded-lg bg-green-50 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-green-900">
                            {intervention.type}
                          </span>
                          <span
                            className={`rounded px-2 py-1 text-xs ${
                              intervention.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : intervention.status === "in-progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {intervention.status}
                          </span>
                        </div>
                        <p className="text-green-700 text-sm">
                          {intervention.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
