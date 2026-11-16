import { LineChart } from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Brain,
  Clock,
  Coffee,
  Eye,
  Gauge,
  History,
  Lightbulb,
  Pause,
  Play,
  RefreshCw,
  Settings,
  Sparkles,
  Target,
  Thermometer,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type LoadLevel = "low" | "optimal" | "high" | "critical";
export type FatigueLevel = "fresh" | "moderate" | "tired" | "exhausted";
export type BreakType = "short" | "medium" | "long" | "extended";

export interface CognitiveLoadSnapshot {
  timestamp: Date;
  loadLevel: number;
  workingMemoryUtilization: number;
  mentalFatigue: number;
  confusionIndicators: string[];
  responseTime: number;
  errorRate: number;
  taskComplexity: number;
  attentionScore: number;
}

export interface EyeTrackingData {
  timestamp: Date;
  gazeX: number;
  gazeY: number;
  blinkRate: number;
  fixationDuration: number;
  saccadeSpeed: number;
  pupilDilation: number;
  readingPattern: "linear" | "scanning" | "regression" | "skimming";
}

export interface BreakRecommendation {
  id: string;
  timestamp: Date;
  breakType: BreakType;
  duration: number;
  reason: string;
  urgency: "low" | "medium" | "high" | "critical";
  suggestedActivities: string[];
  estimatedRecovery: number;
}

export interface LoadMetrics {
  currentLoad: number;
  averageLoad: number;
  peakLoad: number;
  loadTrend: "increasing" | "decreasing" | "stable";
  sessionDuration: number;
  breaksTaken: number;
  tasksCompleted: number;
  efficiencyScore: number;
}

export interface AdaptiveAdjustment {
  id: string;
  timestamp: Date;
  trigger: string;
  action: "simplify" | "pause" | "speed_up" | "add_break" | "change_format";
  reason: string;
  effectiveness: number;
}

interface CognitiveLoadMonitorProps {
  userRole?: "student" | "teacher" | "admin" | "researcher";
  userId?: string;
  sessionId?: string;
  onLoadAlert?: (level: LoadLevel, message: string) => void;
  onBreakRecommended?: (recommendation: BreakRecommendation) => void;
  onAdaptiveAdjustment?: (adjustment: AdaptiveAdjustment) => void;
}

export function CognitiveLoadMonitor({
  userRole = "student",
  userId = "S001",
  sessionId = "session-001",
  onLoadAlert,
  onBreakRecommended,
  onAdaptiveAdjustment,
}: CognitiveLoadMonitorProps) {
  const [activeTab, setActiveTab] = useState<
    "realtime" | "history" | "insights"
  >("realtime");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Real-time metrics
  const [currentLoad, setCurrentLoad] = useState(45);
  const [workingMemoryUtil, setWorkingMemoryUtil] = useState(60);
  const [mentalFatigue, setMentalFatigue] = useState(25);
  const [attentionScore, setAttentionScore] = useState(85);
  const [efficiencyScore, setEfficiencyScore] = useState(78);

  // Eye tracking simulation
  const [eyeTracking, setEyeTracking] = useState<EyeTrackingData>({
    timestamp: new Date(),
    gazeX: 50,
    gazeY: 50,
    blinkRate: 15,
    fixationDuration: 250,
    saccadeSpeed: 120,
    pupilDilation: 3.5,
    readingPattern: "linear",
  });

  // Historical data
  const [loadHistory, setLoadHistory] = useState<CognitiveLoadSnapshot[]>([]);
  const [breakRecommendations, setBreakRecommendations] = useState<
    BreakRecommendation[]
  >([]);
  const [adaptations, setAdaptations] = useState<AdaptiveAdjustment[]>([]);

  const monitoringRef = useRef<NodeJS.Timeout | null>(null);
  const eyeTrackingRef = useRef<NodeJS.Timeout | null>(null);

  // Generate mock historical data
  useEffect(() => {
    const mockHistory: CognitiveLoadSnapshot[] = [];
    const now = Date.now();

    for (let i = 30; i >= 0; i--) {
      const baseLoad = 40 + Math.sin(i * 0.3) * 20;
      mockHistory.push({
        timestamp: new Date(now - i * 60000),
        loadLevel: Math.max(20, Math.min(80, baseLoad + Math.random() * 15)),
        workingMemoryUtilization: Math.max(
          40,
          Math.min(90, 55 + Math.sin(i * 0.2) * 15),
        ),
        mentalFatigue: Math.min(60, i * 1.5 + Math.random() * 10),
        confusionIndicators: baseLoad > 60 ? ["hesitation", "re-reading"] : [],
        responseTime: 2 + Math.random() * 1.5,
        errorRate: baseLoad > 60 ? 0.08 : 0.03,
        taskComplexity: 6 + Math.random() * 3,
        attentionScore: Math.max(70, 95 - i * 0.5),
      });
    }
    setLoadHistory(mockHistory);

    // Mock break recommendations
    setBreakRecommendations([
      {
        id: "BR001",
        timestamp: new Date(now - 1800000),
        breakType: "short",
        duration: 5,
        reason: "Cognitive load reached moderate level",
        urgency: "medium",
        suggestedActivities: ["Stretch", "Deep breathing", "Eye rest"],
        estimatedRecovery: 15,
      },
      {
        id: "BR002",
        timestamp: new Date(now - 3600000),
        breakType: "medium",
        duration: 15,
        reason: "Mental fatigue accumulation detected",
        urgency: "high",
        suggestedActivities: ["Walk", "Hydrate", "Mindful meditation"],
        estimatedRecovery: 35,
      },
    ]);

    // Mock adaptations
    setAdaptations([
      {
        id: "AD001",
        timestamp: new Date(now - 2400000),
        trigger: "High cognitive load detected",
        action: "simplify",
        reason: "Reducing task complexity to prevent overload",
        effectiveness: 0.85,
      },
      {
        id: "AD002",
        timestamp: new Date(now - 1200000),
        trigger: "Decreased attention score",
        action: "add_break",
        reason: "Scheduling brief pause to restore focus",
        effectiveness: 0.92,
      },
    ]);
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
    setElapsedTime(0);

    // Main monitoring loop
    monitoringRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);

      // Simulate cognitive load fluctuations
      const loadChange = Math.random() > 0.5 ? 2 : -2;
      setCurrentLoad((prev) => {
        const newLoad = Math.max(20, Math.min(85, prev + loadChange));

        // Check for critical load
        if (newLoad > 70 && onLoadAlert) {
          onLoadAlert("high", "Cognitive load approaching critical threshold");
        }

        return newLoad;
      });

      // Working memory utilization
      setWorkingMemoryUtil((prev) =>
        Math.max(35, Math.min(85, prev + (Math.random() - 0.5) * 5)),
      );

      // Mental fatigue accumulation
      setMentalFatigue((prev) =>
        Math.min(70, prev + 0.2 + Math.random() * 0.3),
      );

      // Attention score variation
      setAttentionScore((prev) =>
        Math.max(65, Math.min(95, prev + (Math.random() - 0.5) * 3)),
      );

      // Efficiency calculation
      setEfficiencyScore((prev) => {
        const fatigueImpact = mentalFatigue * 0.3;
        const loadImpact = currentLoad > 60 ? (currentLoad - 60) * 0.5 : 0;
        return Math.max(
          50,
          Math.min(95, 90 - fatigueImpact - loadImpact + Math.random() * 5),
        );
      });

      // Add to history every 30 seconds
      if (elapsedTime % 30 === 0) {
        setLoadHistory((prev) => {
          const newSnapshot: CognitiveLoadSnapshot = {
            timestamp: new Date(),
            loadLevel: currentLoad,
            workingMemoryUtilization: workingMemoryUtil,
            mentalFatigue,
            confusionIndicators: currentLoad > 60 ? ["slight hesitation"] : [],
            responseTime: 2 + Math.random(),
            errorRate: currentLoad > 60 ? 0.06 : 0.02,
            taskComplexity: 6 + Math.random() * 2,
            attentionScore,
          };
          return [...prev.slice(-60), newSnapshot];
        });
      }

      // Generate break recommendations
      if (mentalFatigue > 45 && Math.random() > 0.85) {
        const newRecommendation: BreakRecommendation = {
          id: `BR${Date.now()}`,
          timestamp: new Date(),
          breakType: mentalFatigue > 55 ? "medium" : "short",
          duration: mentalFatigue > 55 ? 15 : 5,
          reason:
            mentalFatigue > 55
              ? "Significant mental fatigue detected"
              : "Moderate fatigue - preventive break recommended",
          urgency: mentalFatigue > 55 ? "high" : "medium",
          suggestedActivities:
            mentalFatigue > 55
              ? ["Walk", "Hydrate", "Meditation", "Power nap"]
              : ["Stretch", "Eye rest", "Deep breathing"],
          estimatedRecovery: mentalFatigue > 55 ? 35 : 15,
        };
        setBreakRecommendations((prev) =>
          [newRecommendation, ...prev].slice(0, 10),
        );
        if (onBreakRecommended) onBreakRecommended(newRecommendation);
      }

      // Generate adaptive adjustments
      if (currentLoad > 70 && Math.random() > 0.9) {
        const newAdaptation: AdaptiveAdjustment = {
          id: `ADAPT${Date.now()}`,
          timestamp: new Date(),
          trigger: "Cognitive load exceeded threshold",
          action: "simplify",
          reason:
            "Automatically reducing complexity to maintain optimal learning",
          effectiveness: 0,
        };
        setAdaptations((prev) => [newAdaptation, ...prev].slice(0, 10));
        if (onAdaptiveAdjustment) onAdaptiveAdjustment(newAdaptation);
      }
    }, 1000);

    // Eye tracking simulation
    eyeTrackingRef.current = setInterval(() => {
      setEyeTracking((prev) => ({
        timestamp: new Date(),
        gazeX: 30 + Math.random() * 40,
        gazeY: 20 + Math.random() * 60,
        blinkRate: 12 + Math.random() * 8,
        fixationDuration: 200 + Math.random() * 150,
        saccadeSpeed: 80 + Math.random() * 80,
        pupilDilation: 3.0 + Math.random() * 1.0,
        readingPattern: Math.random() > 0.7 ? "scanning" : "linear",
      }));
    }, 2000);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (monitoringRef.current) clearInterval(monitoringRef.current);
    if (eyeTrackingRef.current) clearInterval(eyeTrackingRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getLoadColor = (load: number) => {
    if (load < 40) return "bg-green-500";
    if (load < 60) return "bg-amber-500";
    if (load < 75) return "bg-orange-500";
    return "bg-red-500";
  };

  const getLoadLevel = (load: number): LoadLevel => {
    if (load < 40) return "low";
    if (load < 60) return "optimal";
    if (load < 75) return "high";
    return "critical";
  };

  const getFatigueColor = (fatigue: number) => {
    if (fatigue < 30) return "text-green-600";
    if (fatigue < 50) return "text-amber-600";
    if (fatigue < 65) return "text-orange-600";
    return "text-red-600";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  // Prepare chart data
  const chartData = {
    labels: loadHistory.slice(-20).map((h) =>
      h.timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    ),
    datasets: [
      {
        label: "Cognitive Load",
        data: loadHistory.slice(-20).map((h) => h.loadLevel),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
      },
      {
        label: "Working Memory",
        data: loadHistory.slice(-20).map((h) => h.workingMemoryUtilization),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Mental Fatigue",
        data: loadHistory.slice(-20).map((h) => h.mentalFatigue),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Brain className="h-8 w-8 text-indigo-600" />
            Cognitive Load Monitor
          </h2>
          <p className="mt-1 text-slate-600">
            Real-time cognitive state tracking and optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-slate-600 transition-colors hover:text-indigo-600"
          >
            <Settings className="h-6 w-6" />
          </button>
          {!isMonitoring ? (
            <button
              onClick={startMonitoring}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <Play className="h-5 w-5" />
              Start Monitoring
            </button>
          ) : (
            <button
              onClick={stopMonitoring}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
            >
              <Pause className="h-5 w-5" />
              Stop ({formatTime(elapsedTime)})
            </button>
          )}
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {/* Cognitive Load Gauge */}
        <Card
          className={
            isMonitoring ? "ring-2 ring-indigo-500 ring-opacity-50" : ""
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-medium text-sm">
              <Gauge className="h-4 w-4" />
              Cognitive Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-3xl text-slate-900">
              {currentLoad.toFixed(0)}%
            </div>
            <Badge className={`mt-2 ${getLoadColor(currentLoad)} text-white`}>
              {getLoadLevel(currentLoad)}
            </Badge>
            <Progress value={currentLoad} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Working Memory */}
        <Card
          className={
            isMonitoring ? "ring-2 ring-emerald-500 ring-opacity-50" : ""
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-medium text-sm">
              <Zap className="h-4 w-4" />
              Working Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-3xl text-slate-900">
              {workingMemoryUtil.toFixed(0)}%
            </div>
            <p className="mt-2 text-slate-500 text-sm">Utilization</p>
            <Progress value={workingMemoryUtil} className="mt-1 h-2" />
          </CardContent>
        </Card>

        {/* Mental Fatigue */}
        <Card
          className={isMonitoring ? "ring-2 ring-red-500 ring-opacity-50" : ""}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-medium text-sm">
              <Thermometer className="h-4 w-4" />
              Mental Fatigue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`font-bold text-3xl ${getFatigueColor(mentalFatigue)}`}
            >
              {mentalFatigue.toFixed(0)}%
            </div>
            <p className="mt-2 text-slate-500 text-sm">
              {mentalFatigue < 30
                ? "Fresh"
                : mentalFatigue < 50
                  ? "Moderate"
                  : "High"}
            </p>
            <Progress value={mentalFatigue} className="mt-1 h-2" />
          </CardContent>
        </Card>

        {/* Attention Score */}
        <Card
          className={isMonitoring ? "ring-2 ring-blue-500 ring-opacity-50" : ""}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-medium text-sm">
              <Target className="h-4 w-4" />
              Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-3xl text-slate-900">
              {attentionScore.toFixed(0)}%
            </div>
            <p className="mt-2 text-slate-500 text-sm">Focus Score</p>
            <Progress value={attentionScore} className="mt-1 h-2" />
          </CardContent>
        </Card>

        {/* Efficiency */}
        <Card
          className={
            isMonitoring ? "ring-2 ring-amber-500 ring-opacity-50" : ""
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-medium text-sm">
              <Sparkles className="h-4 w-4" />
              Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-3xl text-slate-900">
              {efficiencyScore.toFixed(0)}%
            </div>
            <p className="mt-2 text-slate-500 text-sm">Performance</p>
            <Progress value={efficiencyScore} className="mt-1 h-2" />
          </CardContent>
        </Card>

        {/* Session Time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-medium text-sm">
              <Clock className="h-4 w-4" />
              Session Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-3xl text-slate-900">
              {formatTime(elapsedTime)}
            </div>
            <p className="mt-2 text-slate-500 text-sm">
              {isMonitoring ? "Active" : "Paused"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Real-time
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Real-time Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Live Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Live Cognitive Metrics
                </CardTitle>
                <CardDescription>
                  Real-time cognitive load, working memory, and fatigue levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart data={chartData} options={{ responsive: true }} />
              </CardContent>
            </Card>

            {/* Eye Tracking Simulation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Eye Tracking Simulation
                </CardTitle>
                <CardDescription>
                  Simulated biometric data for attention analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Gaze Visualization */}
                <div className="relative h-48 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-1 opacity-20">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div key={i} className="bg-slate-300" />
                    ))}
                  </div>
                  <div
                    className="absolute h-6 w-6 rounded-full border-2 border-white bg-indigo-500 shadow-lg transition-all duration-500"
                    style={{
                      left: `${eyeTracking.gazeX}%`,
                      top: `${eyeTracking.gazeY}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                  <div
                    className="absolute h-12 w-12 rounded-full border-2 border-indigo-400 opacity-50 transition-all duration-500"
                    style={{
                      left: `${eyeTracking.gazeX}%`,
                      top: `${eyeTracking.gazeY}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>

                {/* Eye Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-slate-600 text-sm">Blink Rate</p>
                    <p className="font-bold text-xl">
                      {eyeTracking.blinkRate.toFixed(0)}/min
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-slate-600 text-sm">Fixation Duration</p>
                    <p className="font-bold text-xl">
                      {eyeTracking.fixationDuration.toFixed(0)}ms
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-slate-600 text-sm">Saccade Speed</p>
                    <p className="font-bold text-xl">
                      {eyeTracking.saccadeSpeed.toFixed(0)}°/s
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-slate-600 text-sm">Reading Pattern</p>
                    <p className="font-bold text-xl capitalize">
                      {eyeTracking.readingPattern}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Break Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                Break Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered suggestions to optimize cognitive recovery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {breakRecommendations.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-slate-500">
                    <Coffee className="mx-auto mb-2 h-12 w-12 opacity-30" />
                    <p>No break recommendations yet</p>
                    <p className="text-sm">
                      Continue monitoring to receive personalized suggestions
                    </p>
                  </div>
                ) : (
                  breakRecommendations.slice(0, 6).map((rec) => (
                    <div
                      key={rec.id}
                      className={`rounded-lg border p-4 ${getUrgencyColor(rec.urgency)}`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {rec.breakType} Break
                        </Badge>
                        <span className="font-medium text-sm">
                          {rec.duration} min
                        </span>
                      </div>
                      <p className="mb-3 text-sm">{rec.reason}</p>
                      <div className="space-y-1">
                        <p className="font-medium text-xs">
                          Suggested activities:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {rec.suggestedActivities.map((activity, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-white bg-opacity-50 px-2 py-1 text-xs"
                            >
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-xs opacity-75">
                        Est. recovery: {rec.estimatedRecovery}%
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historical Load Patterns
              </CardTitle>
              <CardDescription>
                30-minute cognitive load history with trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={{
                  labels: loadHistory.map((h) =>
                    h.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  ),
                  datasets: [
                    {
                      label: "Cognitive Load",
                      data: loadHistory.map((h) => h.loadLevel),
                      borderColor: "rgb(99, 102, 241)",
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      tension: 0.4,
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Average Load
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl">
                  {(
                    loadHistory.reduce((a, b) => a + b.loadLevel, 0) /
                    (loadHistory.length || 1)
                  ).toFixed(1)}
                  %
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Peak Load</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl">
                  {Math.max(...loadHistory.map((h) => h.loadLevel), 0).toFixed(
                    0,
                  )}
                  %
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Breaks Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl">
                  {breakRecommendations.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Adaptations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-2xl">{adaptations.length}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Adaptive Adjustments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Adaptive Learning Adjustments
                </CardTitle>
                <CardDescription>
                  System adaptations based on cognitive state
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adaptations.length === 0 ? (
                    <div className="py-8 text-center text-slate-500">
                      <RefreshCw className="mx-auto mb-2 h-12 w-12 opacity-30" />
                      <p>No adaptations yet</p>
                      <p className="text-sm">
                        Continue monitoring to see AI-driven adjustments
                      </p>
                    </div>
                  ) : (
                    adaptations.map((adapt) => (
                      <div
                        key={adapt.id}
                        className="rounded-lg border border-indigo-200 bg-indigo-50 p-3"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-2 font-medium text-indigo-900 capitalize">
                            <Badge variant="secondary">
                              {adapt.action.replace("_", " ")}
                            </Badge>
                          </span>
                          <span className="text-indigo-600 text-xs">
                            {adapt.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-indigo-800 text-sm">
                          {adapt.reason}
                        </p>
                        <p className="mt-1 text-indigo-600 text-xs">
                          Trigger: {adapt.trigger}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Cognitive Insights
                </CardTitle>
                <CardDescription>
                  Personalized recommendations for optimal learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                    <TrendingUp className="mt-0.5 h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">
                        Peak Performance Window
                      </p>
                      <p className="text-green-700 text-sm">
                        Your cognitive efficiency is highest between 9 AM - 11
                        AM. Schedule complex tasks during this window.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <Timer className="mt-0.5 h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-900">
                        Optimal Session Length
                      </p>
                      <p className="text-amber-700 text-sm">
                        Based on your patterns, 25-minute focused sessions with
                        5-minute breaks maximize retention.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <Brain className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        Load Management
                      </p>
                      <p className="text-blue-700 text-sm">
                        Your cognitive load tends to spike after 45 minutes.
                        Consider micro-breaks to maintain optimal performance.
                      </p>
                    </div>
                  </div>
                  {mentalFatigue > 50 && (
                    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-900">
                          Fatigue Alert
                        </p>
                        <p className="text-red-700 text-sm">
                          Current fatigue levels suggest taking a break soon to
                          prevent cognitive decline.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Settings Modal */}
      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <h3 className="font-bold text-slate-900 text-xl">
                Monitor Settings
              </h3>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Eye Tracking Simulation</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded text-indigo-600"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Cognitive Load Alerts</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded text-indigo-600"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">
                  Auto Break Recommendations
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded text-indigo-600"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Adaptive Adjustments</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded text-indigo-600"
                  defaultChecked
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Sensitivity Level
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="7"
                  className="w-full"
                />
              </div>
            </div>
            <div className="border-slate-200 border-t p-6">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CognitiveLoadMonitor;
