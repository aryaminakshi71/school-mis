import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  Activity,
  Activity as ActivityIcon,
  AlertTriangle,
  Ban,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileSearch,
  Filter,
  Fingerprint,
  Fingerprint as FingerprintIcon,
  Globe,
  History,
  Keyboard,
  Mic,
  Pause,
  PieChart,
  Radar,
  Radio,
  Scan,
  Settings,
  Shield,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCheck,
  Volume2,
  Webcam,
  Wind,
  X,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface ProctoringSession {
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  examTitle: string;
  startTime: Date;
  status: "monitoring" | "paused" | "completed" | "flagged";
  trustScore: number;
  anomalies: Anomaly[];
  biometrics: BiometricData;
  behaviorMetrics: BehaviorMetrics;
}

interface Anomaly {
  id: string;
  timestamp: Date;
  type:
    | "eye_movement"
    | "tab_switch"
    | "copy_paste"
    | "keystroke"
    | "face_absence"
    | "voice_detected"
    | "multiple_faces"
    | "suspicious_object";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  evidence?: string;
  screenshotUrl?: string;
  resolved: boolean;
}

interface BiometricData {
  faceVerified: boolean;
  identityMatch: number;
  lastFaceSeen: Date;
  faceConfidence: number;
  gazeDirection: "center" | "left" | "right" | "up" | "down" | "unknown";
  blinkRate: number;
  headPose: { pitch: number; yaw: number; roll: number };
}

interface BehaviorMetrics {
  tabSwitches: number;
  copyPasteEvents: number;
  keystrokePattern: "normal" | "irregular" | "suspicious";
  averageTypingSpeed: number;
  idleTime: number;
  mouseMovement: number;
  focusScore: number;
}

interface ForensicReport {
  sessionId: string;
  totalAnomalies: number;
  criticalEvents: number;
  finalTrustScore: number;
  recommendation: "pass" | "review" | "fail";
  timeline: Anomaly[];
  summary: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const radarVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const scanLineVariants = {
  animate: {
    y: ["0%", "100%", "0%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const mockSession: ProctoringSession = {
  id: "proc-001",
  studentId: "stu-12345",
  studentName: "Alexandra Chen",
  examId: "exam-789",
  examTitle: "Advanced Mathematics Final",
  startTime: new Date(Date.now() - 45 * 60 * 1000),
  status: "monitoring",
  trustScore: 87,
  anomalies: [
    {
      id: "anom-1",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: "tab_switch",
      severity: "medium",
      description: 'Switched to browser tab: "Google Search"',
      resolved: true,
    },
    {
      id: "anom-2",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: "eye_movement",
      severity: "low",
      description: "Gaze directed away from screen for 3.2 seconds",
      resolved: true,
    },
    {
      id: "anom-3",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: "copy_paste",
      severity: "high",
      description: "Copy-paste action detected (Ctrl+C, Ctrl+V sequence)",
      resolved: false,
    },
  ],
  biometrics: {
    faceVerified: true,
    identityMatch: 94,
    lastFaceSeen: new Date(),
    faceConfidence: 91,
    gazeDirection: "center",
    blinkRate: 18,
    headPose: { pitch: 2, yaw: -5, roll: 1 },
  },
  behaviorMetrics: {
    tabSwitches: 2,
    copyPasteEvents: 3,
    keystrokePattern: "normal",
    averageTypingSpeed: 45,
    idleTime: 124,
    mouseMovement: 2847,
    focusScore: 88,
  },
};

const anomalyTypeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  eye_movement: {
    icon: <Eye className="h-4 w-4" />,
    color: "#f59e0b",
    label: "Eye Movement",
  },
  tab_switch: {
    icon: <Globe className="h-4 w-4" />,
    color: "#3b82f6",
    label: "Tab Switch",
  },
  copy_paste: {
    icon: <Copy className="h-4 w-4" />,
    color: "#ef4444",
    label: "Copy-Paste",
  },
  keystroke: {
    icon: <Keyboard className="h-4 w-4" />,
    color: "#8b5cf6",
    label: "Keystroke",
  },
  face_absence: {
    icon: <UserCheck className="h-4 w-4" />,
    color: "#dc2626",
    label: "Face Absence",
  },
  voice_detected: {
    icon: <Mic className="h-4 w-4" />,
    color: "#ec4899",
    label: "Voice",
  },
  multiple_faces: {
    icon: <Users className="h-4 w-4" />,
    color: "#dc2626",
    label: "Multiple Faces",
  },
  suspicious_object: {
    icon: <Scan className="h-4 w-4" />,
    color: "#f97316",
    label: "Suspicious Object",
  },
};

const severityConfig: Record<
  string,
  { color: string; bgColor: string; label: string }
> = {
  low: { color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.1)", label: "Low" },
  medium: {
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
    label: "Medium",
  },
  high: { color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.1)", label: "High" },
  critical: {
    color: "#dc2626",
    bgColor: "rgba(220, 38, 38, 0.15)",
    label: "Critical",
  },
};

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function AIAntiCheating() {
  const [activeTab, setActiveTab] = useState<"live" | "forensics" | "settings">(
    "live",
  );
  const [session, setSession] = useState<ProctoringSession>(mockSession);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [scanning, setScanning] = useState(true);
  const [gazePoints, setGazePoints] = useState<
    Array<{ x: number; y: number; timestamp: number }>
  >([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [trustScoreAnimation, setTrustScoreAnimation] = useState(
    session.trustScore,
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isMonitoring) {
      controls.start("animate");
    } else {
      controls.stop();
    }
  }, [isMonitoring, controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isMonitoring && scanning) {
        setGazePoints((prev) => {
          const newPoint = {
            x: 30 + Math.random() * 40,
            y: 30 + Math.random() * 40,
            timestamp: Date.now(),
          };
          return [...prev.slice(-20), newPoint];
        });

        setSession((prev) => ({
          ...prev,
          trustScore: Math.max(
            0,
            Math.min(100, prev.trustScore + (Math.random() - 0.5) * 2),
          ),
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring, scanning]);

  useEffect(() => {
    const animation = setInterval(() => {
      setTrustScoreAnimation((prev) => {
        const diff = session.trustScore - prev;
        if (Math.abs(diff) < 0.5) return session.trustScore;
        return prev + diff * 0.1;
      });
    }, 50);

    return () => clearInterval(animation);
  }, [session.trustScore]);

  const handleResolveAnomaly = (anomalyId: string) => {
    setSession((prev) => ({
      ...prev,
      anomalies: prev.anomalies.map((a) =>
        a.id === anomalyId ? { ...a, resolved: true } : a,
      ),
    }));
    setSelectedAnomaly(null);
  };

  const generateForensicReport = (): ForensicReport => {
    const criticalEvents = session.anomalies.filter(
      (a) => a.severity === "critical",
    ).length;
    const recommendation: "pass" | "review" | "fail" =
      session.trustScore > 85
        ? "pass"
        : session.trustScore > 60
          ? "review"
          : "fail";

    return {
      sessionId: session.id,
      totalAnomalies: session.anomalies.length,
      criticalEvents,
      finalTrustScore: session.trustScore,
      recommendation,
      timeline: session.anomalies,
      summary: `Session completed with ${session.anomalies.length} anomalies detected. Trust score: ${session.trustScore.toFixed(1)}%. ${criticalEvents} critical events occurred.`,
    };
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#f59e0b";
    if (score >= 40) return "#ef4444";
    return "#dc2626";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "monitoring":
        return <Activity className="h-5 w-5 text-emerald-400" />;
      case "paused":
        return <Pause className="h-5 w-5 text-amber-400" />;
      case "flagged":
        return <AlertTriangle className="h-5 w-5 text-rose-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-slate-100">
      <motion.div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 shadow-2xl shadow-indigo-500/30">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-indigo-500 opacity-40 blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              <div>
                <h1 className="bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text font-bold text-3xl text-transparent tracking-tight md:text-4xl">
                  NeuralGuard Pro
                </h1>
                <p className="mt-1 text-slate-400 text-sm md:text-base">
                  AI-Powered Examination Security & Proctoring System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.div
                className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium text-sm ${
                  isMonitoring
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                }`}
                animate={isMonitoring ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className={`h-2 w-2 rounded-full ${isMonitoring ? "bg-emerald-400" : "bg-amber-400"}`}
                  animate={isMonitoring ? { scale: [1, 1.5, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                {isMonitoring ? "Live Monitoring Active" : "Monitoring Paused"}
              </motion.div>
              <div className="font-mono text-slate-500 text-sm">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <motion.div
            className="space-y-4 lg:w-80"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="relative">
              <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-semibold text-lg text-slate-200">
                    <UserCheck className="h-5 w-5 text-indigo-400" />
                    Identity Verification
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowIdentityModal(true)}
                    className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400 transition-colors hover:bg-indigo-500/20"
                  >
                    <Scan className="h-4 w-4" />
                  </motion.button>
                </div>

                <div className="group relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-slate-800">
                  <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-slate-900/90" />

                  {cameraActive ? (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                        <div className="text-center">
                          <Webcam className="mx-auto mb-2 h-12 w-12 text-slate-600" />
                          <p className="text-slate-500 text-sm">Camera Feed</p>
                        </div>
                      </div>

                      <motion.div
                        className="absolute inset-x-0 z-20 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                        variants={scanLineVariants}
                        animate={scanning ? "animate" : ""}
                      />

                      <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                        <motion.div
                          className="h-3 w-3 rounded-full bg-rose-500"
                          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="rounded-full bg-rose-500/10 px-2 py-1 font-medium text-rose-400 text-xs backdrop-blur-sm">
                          REC
                        </span>
                      </div>

                      <div className="absolute right-4 bottom-4 left-4 z-30">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-700">
                            <motion.div
                              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                              animate={{ width: ["0%", "100%", "0%"] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                          </div>
                          <span className="font-mono text-slate-400 text-xs">
                            {session.biometrics.faceConfidence}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 text-xs">
                          <Fingerprint className="h-3 w-3 text-indigo-400" />
                          <span className="truncate">
                            {session.studentName}
                          </span>
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
                        <motion.div
                          className="rounded-md border border-emerald-500/30 bg-emerald-500/20 px-2 py-1 font-medium text-emerald-400 text-xs"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          Face Verified
                        </motion.div>
                        <motion.div
                          className="rounded-md border border-indigo-500/30 bg-indigo-500/20 px-2 py-1 font-medium text-indigo-400 text-xs"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          ID Match: {session.biometrics.identityMatch}%
                        </motion.div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                      <div className="text-center">
                        <EyeOff className="mx-auto mb-2 h-12 w-12 text-slate-600" />
                        <p className="text-slate-500 text-sm">
                          Camera Disabled
                        </p>
                      </div>
                    </div>
                  )}

                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-xl border-2 border-indigo-500/30"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                    <p className="mb-1 text-slate-400 text-xs">
                      Gaze Direction
                    </p>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-cyan-400" />
                      <span className="font-medium text-slate-200 text-sm capitalize">
                        {session.biometrics.gazeDirection}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                    <p className="mb-1 text-slate-400 text-xs">Blink Rate</p>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-violet-400" />
                      <span className="font-medium text-slate-200 text-sm">
                        {session.biometrics.blinkRate}/min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                  <ActivityIcon className="h-5 w-5 text-rose-400" />
                  Trust Score
                </h2>
                <div className="relative flex items-center justify-center py-4">
                  <svg className="-rotate-90 h-40 w-40 transform">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke={getTrustScoreColor(trustScoreAnimation)}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      initial={{ strokeDashoffset: `${2 * Math.PI * 70}` }}
                      animate={{
                        strokeDashoffset: `${2 * Math.PI * 70 * (1 - trustScoreAnimation / 100)}`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="font-bold text-4xl"
                      style={{ color: getTrustScoreColor(trustScoreAnimation) }}
                    >
                      {Math.round(trustScoreAnimation)}
                    </motion.span>
                    <span className="mt-1 text-slate-400 text-xs">/ 100</span>
                  </div>
                </div>
                <div className="mt-2 flex justify-center gap-2">
                  <span
                    className="rounded-full border px-3 py-1 font-medium text-xs"
                    style={{
                      backgroundColor: `${getTrustScoreColor(trustScoreAnimation)}15`,
                      borderColor: `${getTrustScoreColor(trustScoreAnimation)}40`,
                      color: getTrustScoreColor(trustScoreAnimation),
                    }}
                  >
                    {trustScoreAnimation >= 80
                      ? "Excellent"
                      : trustScoreAnimation >= 60
                        ? "Caution"
                        : "At Risk"}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                  <Clock className="h-5 w-5 text-amber-400" />
                  Session Info
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-slate-800 border-b py-2">
                    <span className="text-slate-400 text-sm">Duration</span>
                    <span className="font-mono text-slate-200 text-sm">
                      {Math.floor(
                        (Date.now() - session.startTime.getTime()) / 60000,
                      )}
                      m{" "}
                      {Math.floor(
                        ((Date.now() - session.startTime.getTime()) % 60000) /
                          1000,
                      )}
                      s
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-slate-800 border-b py-2">
                    <span className="text-slate-400 text-sm">Exam</span>
                    <span className="max-w-[60%] truncate text-right text-slate-200 text-sm">
                      {session.examTitle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-slate-800 border-b py-2">
                    <span className="text-slate-400 text-sm">Student ID</span>
                    <span className="font-mono text-slate-200 text-sm">
                      {session.studentId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-400 text-sm">Status</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(session.status)}
                      <span className="text-slate-200 text-sm capitalize">
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="flex-1 space-y-6">
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {["live", "forensics", "settings"].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`relative rounded-xl px-6 py-3 font-medium transition-all ${
                    activeTab === tab
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab === "live" && <Activity className="h-4 w-4" />}
                    {tab === "forensics" && <FileSearch className="h-4 w-4" />}
                    {tab === "settings" && <Settings className="h-4 w-4" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {activeTab === "live" && (
                <motion.div
                  key="live"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        icon: <Eye className="h-6 w-6" />,
                        title: "Eye Tracking",
                        value: "Active",
                        subtext: `${gazePoints.length} points tracked`,
                        color: "from-cyan-500 to-blue-500",
                        bgColor: "from-cyan-500/10 to-blue-500/10",
                        borderColor: "border-cyan-500/30",
                      },
                      {
                        icon: <Globe className="h-6 w-6" />,
                        title: "Browser Monitor",
                        value: session.behaviorMetrics.tabSwitches.toString(),
                        subtext: "Tab switches detected",
                        color: "from-amber-500 to-orange-500",
                        bgColor: "from-amber-500/10 to-orange-500/10",
                        borderColor: "border-amber-500/30",
                      },
                      {
                        icon: <Copy className="h-6 w-6" />,
                        title: "Copy-Paste Guard",
                        value:
                          session.behaviorMetrics.copyPasteEvents.toString(),
                        subtext: "Events blocked",
                        color: "from-rose-500 to-pink-500",
                        bgColor: "from-rose-500/10 to-pink-500/10",
                        borderColor: "border-rose-500/30",
                      },
                      {
                        icon: <Keyboard className="h-6 w-6" />,
                        title: "Keystroke AI",
                        value: session.behaviorMetrics.keystrokePattern,
                        subtext: `${session.behaviorMetrics.averageTypingSpeed} WPM avg`,
                        color: "from-violet-500 to-purple-500",
                        bgColor: "from-violet-500/10 to-purple-500/10",
                        borderColor: "border-violet-500/30",
                      },
                    ].map((card, index) => (
                      <motion.div
                        key={card.title}
                        variants={itemVariants}
                        className={`group relative overflow-hidden rounded-2xl border ${card.borderColor} cursor-pointer bg-slate-900/60 p-5 backdrop-blur-xl`}
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                        />
                        <div className="relative z-10">
                          <div
                            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.color} mb-4 flex items-center justify-center shadow-lg`}
                          >
                            <span className="h-6 w-6 text-white">
                              {card.icon}
                            </span>
                          </div>
                          <h3 className="mb-1 font-medium text-slate-400 text-sm">
                            {card.title}
                          </h3>
                          <p className="mb-1 font-bold text-2xl text-white capitalize">
                            {card.value}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {card.subtext}
                          </p>
                        </div>
                        <motion.div
                          className="-bottom-20 -right-20 absolute h-40 w-40 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: index * 0.5,
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <motion.div
                      variants={cardVariants}
                      className="lg:col-span-2"
                    >
                      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                        <div className="mb-6 flex items-center justify-between">
                          <h2 className="flex items-center gap-2 font-semibold text-lg text-slate-200">
                            <Radar className="h-5 w-5 text-cyan-400" />
                            Real-Time Behavior Analysis
                          </h2>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs">
                              Live Feed
                            </span>
                            <motion.div
                              className="h-2 w-2 rounded-full bg-cyan-400"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [1, 0.5, 1],
                              }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          </div>
                        </div>

                        <div className="relative h-80 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative h-full w-full">
                              <svg className="absolute inset-0 h-full w-full">
                                <defs>
                                  <pattern
                                    id="grid"
                                    width="40"
                                    height="40"
                                    patternUnits="userSpaceOnUse"
                                  >
                                    <path
                                      d="M 40 0 L 0 0 0 40"
                                      fill="none"
                                      stroke="rgba(99, 102, 241, 0.1)"
                                      strokeWidth="1"
                                    />
                                  </pattern>
                                </defs>
                                <rect
                                  width="100%"
                                  height="100%"
                                  fill="url(#grid)"
                                />
                              </svg>

                              <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                variants={radarVariants}
                                animate="animate"
                              >
                                <div className="h-64 w-64 rounded-full border border-cyan-500/20" />
                                <div className="absolute h-48 w-48 rounded-full border border-cyan-500/15" />
                                <div className="absolute h-32 w-32 rounded-full border border-cyan-500/10" />
                              </motion.div>

                              {gazePoints.map((point, index) => (
                                <motion.div
                                  key={index}
                                  className="absolute h-3 w-3 rounded-full bg-cyan-400 shadow-cyan-400/50 shadow-lg"
                                  style={{
                                    left: `${point.x}%`,
                                    top: `${point.y}%`,
                                    transform: "translate(-50%, -50%)",
                                  }}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{
                                    scale: 1,
                                    opacity:
                                      1 - (gazePoints.length - index) * 0.05,
                                  }}
                                  transition={{ duration: 0.3 }}
                                />
                              ))}

                              <div className="absolute top-4 left-4 space-y-2">
                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                                  Gaze Point
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                  <div className="h-2 w-2 rounded-full bg-violet-400" />
                                  Head Position
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-4">
                          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                            <p className="mb-1 text-slate-400 text-xs">
                              Focus Score
                            </p>
                            <div className="flex items-end gap-2">
                              <span className="font-bold text-2xl text-white">
                                {session.behaviorMetrics.focusScore}%
                              </span>
                              <span className="mb-1 text-emerald-400 text-xs">
                                ↑ 2.4%
                              </span>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
                              <motion.div
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${session.behaviorMetrics.focusScore}%`,
                                }}
                                transition={{ duration: 1 }}
                              />
                            </div>
                          </div>
                          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                            <p className="mb-1 text-slate-400 text-xs">
                              Idle Time
                            </p>
                            <div className="flex items-end gap-2">
                              <span className="font-bold text-2xl text-white">
                                {Math.floor(
                                  session.behaviorMetrics.idleTime / 60,
                                )}
                                m
                              </span>
                              <span className="mb-1 text-slate-500 text-xs">
                                {session.behaviorMetrics.idleTime % 60}s
                              </span>
                            </div>
                            <p className="mt-2 text-slate-500 text-xs">
                              Total inactive time
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                            <p className="mb-1 text-slate-400 text-xs">
                              Mouse Activity
                            </p>
                            <div className="flex items-end gap-2">
                              <span className="font-bold text-2xl text-white">
                                {session.behaviorMetrics.mouseMovement.toLocaleString()}
                              </span>
                              <span className="mb-1 text-slate-500 text-xs">
                                px
                              </span>
                            </div>
                            <p className="mt-2 text-slate-500 text-xs">
                              Distance traveled
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={cardVariants}>
                      <div className="h-full rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                        <div className="mb-6 flex items-center justify-between">
                          <h2 className="flex items-center gap-2 font-semibold text-lg text-slate-200">
                            <Mic className="h-5 w-5 text-pink-400" />
                            Audio Monitor
                          </h2>
                          <motion.div
                            className="h-2 w-2 rounded-full bg-emerald-400"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          />
                        </div>

                        <div className="relative mb-4 h-40 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-24 items-end gap-1">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-3 rounded-full bg-gradient-to-t from-pink-500 to-violet-500"
                                  animate={{
                                    height: [20, 40 + Math.random() * 60, 20],
                                  }}
                                  transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.05,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 rounded-md border border-emerald-500/30 bg-slate-900/80 px-2 py-1 font-medium text-emerald-400 text-xs">
                            Normal
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                            <div className="flex items-center gap-2">
                              <Volume2 className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-300 text-sm">
                                Ambient Level
                              </span>
                            </div>
                            <span className="font-medium text-slate-200 text-sm">
                              28 dB
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                            <div className="flex items-center gap-2">
                              <Wind className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-300 text-sm">
                                Noise Filter
                              </span>
                            </div>
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-400 text-xs">
                              Active
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                            <div className="flex items-center gap-2">
                              <Radio className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-300 text-sm">
                                Voice Detection
                              </span>
                            </div>
                            <span className="rounded-full border border-slate-600 bg-slate-700 px-2 py-1 text-slate-400 text-xs">
                              None
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div variants={cardVariants}>
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                      <div className="mb-6 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 font-semibold text-lg text-slate-200">
                          <AlertTriangle className="h-5 w-5 text-amber-400" />
                          Anomaly Detection Log
                          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-400 text-xs">
                            {session.anomalies.length}
                          </span>
                        </h2>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-slate-300 text-sm transition-colors hover:bg-slate-700"
                          >
                            <Filter className="h-4 w-4" />
                            Filter
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-slate-300 text-sm transition-colors hover:bg-slate-700"
                          >
                            <Download className="h-4 w-4" />
                            Export
                          </motion.button>
                        </div>
                      </div>

                      <div className="custom-scrollbar max-h-96 space-y-3 overflow-y-auto">
                        <AnimatePresence>
                          {session.anomalies.length === 0 ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="py-12 text-center"
                            >
                              <ShieldCheck className="mx-auto mb-3 h-12 w-12 text-emerald-500" />
                              <p className="text-slate-400">
                                No anomalies detected
                              </p>
                              <p className="mt-1 text-slate-500 text-sm">
                                Session is proceeding normally
                              </p>
                            </motion.div>
                          ) : (
                            session.anomalies.map((anomaly, index) => {
                              const typeConfig =
                                anomalyTypeConfig[anomaly.type];
                              const severityConfig_item =
                                severityConfig[anomaly.severity];
                              return (
                                <motion.div
                                  key={anomaly.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  transition={{ delay: index * 0.1 }}
                                  className={`group relative cursor-pointer rounded-xl border p-4 transition-all ${
                                    anomaly.resolved
                                      ? "border-slate-700/30 bg-slate-800/30 opacity-60"
                                      : "border-slate-700/50 bg-slate-800/60 hover:border-slate-600"
                                  }`}
                                  onClick={() => setSelectedAnomaly(anomaly)}
                                  whileHover={{ x: 5 }}
                                >
                                  <div className="flex items-start gap-4">
                                    <div
                                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                                      style={{
                                        backgroundColor: `${typeConfig.color}20`,
                                        color: typeConfig.color,
                                      }}
                                    >
                                      {typeConfig.icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="mb-1 flex items-center gap-2">
                                        <span className="font-medium text-slate-200">
                                          {typeConfig.label}
                                        </span>
                                        <span
                                          className="rounded-full border px-2 py-0.5 font-medium text-xs"
                                          style={{
                                            backgroundColor:
                                              severityConfig_item.bgColor,
                                            borderColor:
                                              severityConfig_item.color,
                                            color: severityConfig_item.color,
                                          }}
                                        >
                                          {severityConfig_item.label}
                                        </span>
                                        {anomaly.resolved && (
                                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-400 text-xs">
                                            Resolved
                                          </span>
                                        )}
                                      </div>
                                      <p className="mb-2 text-slate-400 text-sm">
                                        {anomaly.description}
                                      </p>
                                      <div className="flex items-center gap-3 text-slate-500 text-xs">
                                        <span className="font-mono">
                                          {anomaly.timestamp.toLocaleTimeString()}
                                        </span>
                                        <span>•</span>
                                        <span>ID: {anomaly.id}</span>
                                      </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-600 transition-colors group-hover:text-slate-400" />
                                  </div>
                                </motion.div>
                              );
                            })
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "forensics" && (
                <motion.div
                  key="forensics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="flex items-center gap-2 font-semibold text-lg text-slate-200">
                        <FileSearch className="h-5 w-5 text-indigo-400" />
                        Forensic Analysis Report
                      </h2>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-indigo-500"
                        >
                          <Download className="h-4 w-4" />
                          Generate PDF
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 text-sm transition-colors hover:bg-slate-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                        <p className="mb-1 text-slate-400 text-xs">
                          Total Anomalies
                        </p>
                        <p className="font-bold text-3xl text-white">
                          {generateForensicReport().totalAnomalies}
                        </p>
                        <p className="mt-1 text-slate-500 text-xs">
                          Across session
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                        <p className="mb-1 text-slate-400 text-xs">
                          Critical Events
                        </p>
                        <p className="font-bold text-3xl text-rose-400">
                          {generateForensicReport().criticalEvents}
                        </p>
                        <p className="mt-1 text-slate-500 text-xs">
                          Require attention
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                        <p className="mb-1 text-slate-400 text-xs">
                          Final Trust Score
                        </p>
                        <p className="font-bold text-3xl text-slate-200">
                          {generateForensicReport().finalTrustScore.toFixed(1)}%
                        </p>
                        <p className="mt-1 text-slate-500 text-xs">
                          Session integrity
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                        <p className="mb-1 text-slate-400 text-xs">
                          Recommendation
                        </p>
                        <p
                          className={`font-bold text-3xl capitalize ${
                            generateForensicReport().recommendation === "pass"
                              ? "text-emerald-400"
                              : generateForensicReport().recommendation ===
                                  "review"
                                ? "text-amber-400"
                                : "text-rose-400"
                          }`}
                        >
                          {generateForensicReport().recommendation}
                        </p>
                        <p className="mt-1 text-slate-500 text-xs">
                          AI-verdict
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                      <h3 className="mb-2 font-medium text-slate-300 text-sm">
                        AI Summary
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {generateForensicReport().summary}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 font-medium text-slate-300 text-sm">
                        <History className="h-4 w-4 text-indigo-400" />
                        Event Timeline
                      </h3>
                      <div className="relative space-y-4 pl-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-px before:bg-slate-700">
                        {session.anomalies.map((anomaly, index) => {
                          const typeConfig = anomalyTypeConfig[anomaly.type];
                          return (
                            <div key={anomaly.id} className="relative">
                              <div
                                className="-left-6 absolute h-4 w-4 rounded-full border-2 bg-slate-900"
                                style={{ borderColor: typeConfig.color }}
                              />
                              <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                                <div className="mb-1 flex items-center justify-between">
                                  <span className="font-medium text-slate-200 text-sm">
                                    {typeConfig.label}
                                  </span>
                                  <span className="font-mono text-slate-500 text-xs">
                                    {anomaly.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-slate-400 text-xs">
                                  {anomaly.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                      <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                        <PieChart className="h-5 w-5 text-violet-400" />
                        Anomaly Distribution
                      </h3>
                      <div className="flex h-64 items-center justify-center">
                        <div className="relative h-48 w-48">
                          {Object.entries(
                            session.anomalies.reduce(
                              (acc, a) => {
                                acc[a.type] = (acc[a.type] || 0) + 1;
                                return acc;
                              },
                              {} as Record<string, number>,
                            ),
                          ).map(([type, count], index, arr) => {
                            const typeConfig = anomalyTypeConfig[type];
                            const total = session.anomalies.length;
                            const percentage = (count / total) * 100;
                            const startAngle = arr
                              .slice(0, index)
                              .reduce((acc, _, i) => {
                                const prevCount = Object.values(
                                  session.anomalies.reduce(
                                    (a, anom) => {
                                      a[anom.type] = (a[anom.type] || 0) + 1;
                                      return a;
                                    },
                                    {} as Record<string, number>,
                                  ),
                                )[i];
                                return acc + (prevCount / total) * 360;
                              }, 0);
                            const endAngle =
                              startAngle + (percentage / 100) * 360;

                            return (
                              <div
                                key={type}
                                className="absolute inset-0"
                                style={{
                                  background: `conic-gradient(from ${startAngle}deg, ${typeConfig.color} 0deg ${(percentage / 100) * 360}deg, transparent ${(percentage / 100) * 360}deg 360deg)`,
                                  borderRadius: "50%",
                                  mask: "radial-gradient(transparent 60%, black 61%)",
                                  WebkitMask:
                                    "radial-gradient(transparent 60%, black 61%)",
                                }}
                              />
                            );
                          })}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <p className="font-bold text-3xl text-white">
                                {session.anomalies.length}
                              </p>
                              <p className="text-slate-400 text-xs">Total</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {Object.entries(
                          session.anomalies.reduce(
                            (acc, a) => {
                              acc[a.type] = (acc[a.type] || 0) + 1;
                              return acc;
                            },
                            {} as Record<string, number>,
                          ),
                        ).map(([type, count]) => {
                          const typeConfig = anomalyTypeConfig[type];
                          return (
                            <div
                              key={type}
                              className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/50 px-2 py-1"
                            >
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: typeConfig.color }}
                              />
                              <span className="text-slate-300 text-xs">
                                {typeConfig.label}
                              </span>
                              <span className="text-slate-500 text-xs">
                                ({count})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                      <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                        <TrendingUp className="h-5 w-5 text-cyan-400" />
                        Trust Score Trend
                      </h3>
                      <div className="relative h-64">
                        <svg className="h-full w-full" viewBox="0 0 400 200">
                          <defs>
                            <linearGradient
                              id="trustGradient"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#6366f1"
                                stopOpacity="0.4"
                              />
                              <stop
                                offset="100%"
                                stopColor="#6366f1"
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>
                          <path
                            d={`M0,${200 - (session.trustScore / 100) * 180} Q100,${200 - ((session.trustScore + 10) / 100) * 180} 200,${200 - ((session.trustScore - 5) / 100) * 180} T400,${200 - (session.trustScore / 100) * 180}`}
                            fill="url(#trustGradient)"
                            stroke="#6366f1"
                            strokeWidth="2"
                          />
                          <path
                            d={`M0,${200 - (session.trustScore / 100) * 180} Q100,${200 - ((session.trustScore + 10) / 100) * 180} 200,${200 - ((session.trustScore - 5) / 100) * 180} T400,${200 - (session.trustScore / 100) * 180}`}
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute right-0 bottom-0 left-0 flex justify-between px-4 text-slate-500 text-xs">
                          <span>Start</span>
                          <span>15m</span>
                          <span>30m</span>
                          <span>45m</span>
                          <span>Now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                    <h2 className="mb-6 flex items-center gap-2 font-semibold text-lg text-slate-200">
                      <Settings className="h-5 w-5 text-slate-400" />
                      Proctoring Configuration
                    </h2>

                    <div className="space-y-6">
                      <div className="border-slate-700/50 border-b pb-6">
                        <h3 className="mb-4 flex items-center gap-2 font-medium text-slate-300 text-sm">
                          <Shield className="h-4 w-4 text-indigo-400" />
                          Security Settings
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <label className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-colors hover:border-slate-600">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 transition-colors group-hover:bg-indigo-500/20">
                                <Eye className="h-5 w-5 text-indigo-400" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-200 text-sm">
                                  Eye Tracking
                                </p>
                                <p className="text-slate-500 text-xs">
                                  Monitor gaze patterns
                                </p>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                            />
                          </label>

                          <label className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-colors hover:border-slate-600">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 transition-colors group-hover:bg-rose-500/20">
                                <Ban className="h-5 w-5 text-rose-400" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-200 text-sm">
                                  Copy-Paste Block
                                </p>
                                <p className="text-slate-500 text-xs">
                                  Prevent clipboard usage
                                </p>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-rose-600 focus:ring-rose-500"
                            />
                          </label>

                          <label className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-colors hover:border-slate-600">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 transition-colors group-hover:bg-amber-500/20">
                                <Globe className="h-5 w-5 text-amber-400" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-200 text-sm">
                                  Tab Monitoring
                                </p>
                                <p className="text-slate-500 text-xs">
                                  Detect browser switches
                                </p>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-amber-600 focus:ring-amber-500"
                            />
                          </label>

                          <label className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-colors hover:border-slate-600">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 transition-colors group-hover:bg-violet-500/20">
                                <FingerprintIcon className="h-5 w-5 text-violet-400" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-200 text-sm">
                                  Identity Verification
                                </p>
                                <p className="text-slate-500 text-xs">
                                  Facial recognition
                                </p>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="border-slate-700/50 border-b pb-6">
                        <h3 className="mb-4 flex items-center gap-2 font-medium text-slate-300 text-sm">
                          <Mic className="h-4 w-4 text-pink-400" />
                          Audio Settings
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 text-sm">
                              Voice Detection Sensitivity
                            </span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              defaultValue="75"
                              className="h-2 w-48 cursor-pointer appearance-none rounded-lg bg-slate-700 accent-pink-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 text-sm">
                              Ambient Noise Filter
                            </span>
                            <select className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                              <option>High</option>
                              <option>Medium</option>
                              <option>Low</option>
                              <option>Off</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-4 flex items-center gap-2 font-medium text-slate-300 text-sm">
                          <BellIcon className="h-4 w-4 text-cyan-400" />
                          Alert Configuration
                        </h3>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-cyan-600 focus:ring-cyan-500"
                            />
                            <span className="text-slate-300 text-sm">
                              Email notifications for critical anomalies
                            </span>
                          </label>
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-cyan-600 focus:ring-cyan-500"
                            />
                            <span className="text-slate-300 text-sm">
                              Real-time dashboard alerts
                            </span>
                          </label>
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-cyan-600 focus:ring-cyan-500"
                            />
                            <span className="text-slate-300 text-sm">
                              SMS alerts for critical events
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {selectedAnomaly && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              onClick={() => setSelectedAnomaly(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-slate-700/50 border-b p-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${anomalyTypeConfig[selectedAnomaly.type].color}20`,
                        color: anomalyTypeConfig[selectedAnomaly.type].color,
                      }}
                    >
                      {anomalyTypeConfig[selectedAnomaly.type].icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {anomalyTypeConfig[selectedAnomaly.type].label}
                      </h3>
                      <span
                        className="rounded-full border px-2 py-0.5 text-xs"
                        style={{
                          backgroundColor:
                            severityConfig[selectedAnomaly.severity].bgColor,
                          borderColor:
                            severityConfig[selectedAnomaly.severity].color,
                          color: severityConfig[selectedAnomaly.severity].color,
                        }}
                      >
                        {severityConfig[selectedAnomaly.severity].label}{" "}
                        Severity
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedAnomaly(null)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                <div className="space-y-4 p-6">
                  <div>
                    <p className="mb-2 text-slate-400 text-sm">Description</p>
                    <p className="text-slate-200">
                      {selectedAnomaly.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                      <p className="mb-1 text-slate-400 text-xs">Timestamp</p>
                      <p className="font-mono text-slate-200 text-sm">
                        {selectedAnomaly.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                      <p className="mb-1 text-slate-400 text-xs">Anomaly ID</p>
                      <p className="font-mono text-slate-200 text-sm">
                        {selectedAnomaly.id}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-indigo-400" />
                      <span className="font-medium text-slate-300 text-sm">
                        AI Analysis
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      NeuralGuard AI has analyzed this event and determined it
                      to be a{" "}
                      <span className="text-slate-200">
                        {selectedAnomaly.severity} severity
                      </span>{" "}
                      anomaly. The system detected this pattern with{" "}
                      <span className="text-slate-200">
                        {Math.round(85 + Math.random() * 14)}% confidence
                      </span>
                      .
                    </p>
                  </div>

                  {selectedAnomaly.resolved ? (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span className="text-emerald-400 text-sm">
                        This anomaly has been resolved
                      </span>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleResolveAnomaly(selectedAnomaly.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-500"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Mark as Resolved
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showIdentityModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
              onClick={() => setShowIdentityModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="mb-6 text-center">
                    <motion.div
                      className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 shadow-2xl shadow-indigo-500/30"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Scan className="h-10 w-10 text-white" />
                    </motion.div>
                    <h3 className="mb-2 font-bold text-2xl text-white">
                      Identity Verification
                    </h3>
                    <p className="text-slate-400">
                      Verifying student identity...
                    </p>
                  </div>

                  <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-3">
                      <span className="text-slate-400 text-sm">
                        Student Name
                      </span>
                      <span className="font-medium text-sm text-white">
                        {session.studentName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-3">
                      <span className="text-slate-400 text-sm">Student ID</span>
                      <span className="font-mono text-sm text-white">
                        {session.studentId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-3">
                      <span className="text-slate-400 text-sm">Face Match</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-700">
                          <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${session.biometrics.identityMatch}%`,
                            }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                          />
                        </div>
                        <span className="font-medium text-emerald-400 text-sm">
                          {session.biometrics.identityMatch}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowIdentityModal(false)}
                    className="w-full rounded-xl bg-slate-800 py-3 font-medium text-white transition-colors hover:bg-slate-700"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>
    </div>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export default AIAntiCheating;
