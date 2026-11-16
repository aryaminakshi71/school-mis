import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Binary,
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Database,
  Eye,
  FileCode,
  Globe,
  Layers,
  Lock,
  Network,
  RefreshCw,
  Scale,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface EdgeDevice {
  id: string;
  name: string;
  type: "mobile" | "tablet" | "desktop" | "iot" | "edge-server";
  status: "online" | "offline" | "training" | "syncing" | "idle";
  contribution: number;
  lastActive: Date;
  dataPoints: number;
  modelAccuracy: number;
  privacyScore: number;
  bandwidth: number;
  location: string;
  isTrusted: boolean;
}

export interface ModelVersion {
  id: string;
  version: string;
  globalRound: number;
  accuracy: number;
  loss: number;
  participants: number;
  createdAt: Date;
  status: "training" | "aggregating" | "ready" | "deployed";
  size: number;
  improvements: string[];
  privacyBudget: number;
}

export interface AggregationRound {
  id: string;
  roundNumber: number;
  startTime: Date;
  endTime?: Date;
  participants: EdgeDevice[];
  globalModelAccuracy: number;
  localModelAccuracies: number[];
  privacyBudgetUsed: number;
  differentialPrivacyApplied: boolean;
  status: "in-progress" | "completed" | "failed";
  aggregationMethod: "fedavg" | "fedprox" | "scaffold" | "secure";
}

export interface PrivacyMetrics {
  epsilon: number;
  delta: number;
  privacyBudgetRemaining: number;
  noiseApplied: number;
  secureAggregation: boolean;
  homomorphicEncryption: boolean;
  differentialPrivacyLevel: "strict" | "moderate" | "relaxed";
  dataAnonymization: boolean;
  kAnonymity: number;
  lDiversity: number;
}

export interface ContributionMetric {
  deviceId: string;
  deviceName: string;
  dataContribution: number;
  modelImprovement: number;
  computeContribution: number;
  privacyPreserved: boolean;
  reputationScore: number;
  rewardTokens: number;
}

interface FederatedLearningProps {
  userRole?: "admin" | "researcher" | "auditor" | "participant";
  onStartRound?: () => Promise<string>;
  onDeployModel?: (modelId: string) => Promise<void>;
  onViewDeviceDetails?: (deviceId: string) => Promise<void>;
  onExportMetrics?: () => Promise<Blob>;
}

export function FederatedLearning({
  userRole = "admin",
  onStartRound,
  onDeployModel,
  onViewDeviceDetails,
  onExportMetrics,
}: FederatedLearningProps) {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "devices" | "models" | "privacy" | "contributions"
  >("dashboard");
  const [selectedModel, setSelectedModel] = useState<ModelVersion | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<EdgeDevice | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [showModelComparison, setShowModelComparison] = useState(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    EdgeDevice["status"] | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const [devices] = useState<EdgeDevice[]>([
    {
      id: "DEV001",
      name: "Science Lab Workstation A",
      type: "desktop",
      status: "training",
      contribution: 14567,
      lastActive: new Date(),
      dataPoints: 8900,
      modelAccuracy: 0.92,
      privacyScore: 98,
      bandwidth: 450,
      location: "Building A - Lab 101",
      isTrusted: true,
    },
    {
      id: "DEV002",
      name: "Library Study Tablet 01",
      type: "tablet",
      status: "online",
      contribution: 8234,
      lastActive: new Date(Date.now() - 300000),
      dataPoints: 4200,
      modelAccuracy: 0.89,
      privacyScore: 95,
      bandwidth: 180,
      location: "Library - Floor 2",
      isTrusted: true,
    },
    {
      id: "DEV003",
      name: "Admin Office Desktop",
      type: "desktop",
      status: "syncing",
      contribution: 12345,
      lastActive: new Date(Date.now() - 60000),
      dataPoints: 6700,
      modelAccuracy: 0.91,
      privacyScore: 99,
      bandwidth: 520,
      location: "Admin Building",
      isTrusted: true,
    },
    {
      id: "DEV004",
      name: "Student Mobile Device #42",
      type: "mobile",
      status: "idle",
      contribution: 5678,
      lastActive: new Date(Date.now() - 3600000),
      dataPoints: 3100,
      modelAccuracy: 0.87,
      privacyScore: 94,
      bandwidth: 95,
      location: "Campus WiFi Zone",
      isTrusted: true,
    },
    {
      id: "DEV005",
      name: "Smart Board System",
      type: "iot",
      status: "training",
      contribution: 9876,
      lastActive: new Date(),
      dataPoints: 5400,
      modelAccuracy: 0.9,
      privacyScore: 97,
      bandwidth: 300,
      location: "Classroom Block B",
      isTrusted: true,
    },
    {
      id: "DEV006",
      name: "Edge Server Node 1",
      type: "edge-server",
      status: "online",
      contribution: 45678,
      lastActive: new Date(),
      dataPoints: 28500,
      modelAccuracy: 0.94,
      privacyScore: 99,
      bandwidth: 1024,
      location: "Data Center",
      isTrusted: true,
    },
    {
      id: "DEV007",
      name: "Faculty Laptop #12",
      type: "desktop",
      status: "offline",
      contribution: 4321,
      lastActive: new Date(Date.now() - 86400000),
      dataPoints: 2300,
      modelAccuracy: 0.88,
      privacyScore: 96,
      bandwidth: 200,
      location: "Faculty Wing",
      isTrusted: true,
    },
    {
      id: "DEV008",
      name: "Classroom Pod Tablet",
      type: "tablet",
      status: "training",
      contribution: 11234,
      lastActive: new Date(),
      dataPoints: 6100,
      modelAccuracy: 0.91,
      privacyScore: 98,
      bandwidth: 220,
      location: "Building C - Room 305",
      isTrusted: true,
    },
  ]);

  const [models] = useState<ModelVersion[]>([
    {
      id: "MODEL001",
      version: "v2.4.1",
      globalRound: 42,
      accuracy: 0.943,
      loss: 0.089,
      participants: 67,
      createdAt: new Date(Date.now() - 3600000),
      status: "ready",
      size: 45.2,
      improvements: [
        "Improved pattern recognition",
        "Better context understanding",
        "Reduced bias",
      ],
      privacyBudget: 0.12,
    },
    {
      id: "MODEL002",
      version: "v2.4.0",
      globalRound: 41,
      accuracy: 0.938,
      loss: 0.095,
      participants: 65,
      createdAt: new Date(Date.now() - 7200000),
      status: "deployed",
      size: 45.1,
      improvements: ["Enhanced privacy protection", "Faster inference"],
      privacyBudget: 0.15,
    },
    {
      id: "MODEL003",
      version: "v2.3.2",
      globalRound: 38,
      accuracy: 0.921,
      loss: 0.112,
      participants: 58,
      createdAt: new Date(Date.now() - 86400000),
      status: "deployed",
      size: 44.8,
      improvements: ["Initial production release"],
      privacyBudget: 0.18,
    },
  ]);

  const [currentRound, setCurrentRound] = useState<AggregationRound>({
    id: "ROUND043",
    roundNumber: 43,
    startTime: new Date(Date.now() - 1800000),
    participants: devices.filter((d) => d.status === "training"),
    globalModelAccuracy: 0.945,
    localModelAccuracies: [0.92, 0.89, 0.91, 0.94, 0.91],
    privacyBudgetUsed: 0.08,
    differentialPrivacyApplied: true,
    status: "in-progress",
    aggregationMethod: "fedavg",
  });

  const [privacyMetrics] = useState<PrivacyMetrics>({
    epsilon: 1.2,
    delta: 1e-5,
    privacyBudgetRemaining: 0.88,
    noiseApplied: 0.45,
    secureAggregation: true,
    homomorphicEncryption: true,
    differentialPrivacyLevel: "strict",
    dataAnonymization: true,
    kAnonymity: 5,
    lDiversity: 3,
  });

  const [contributions] = useState<ContributionMetric[]>([
    {
      deviceId: "DEV006",
      deviceName: "Edge Server Node 1",
      dataContribution: 28500,
      modelImprovement: 12.5,
      computeContribution: 890,
      privacyPreserved: true,
      reputationScore: 98,
      rewardTokens: 245.5,
    },
    {
      deviceId: "DEV001",
      deviceName: "Science Lab Workstation A",
      dataContribution: 8900,
      modelImprovement: 8.3,
      computeContribution: 450,
      privacyPreserved: true,
      reputationScore: 96,
      rewardTokens: 156.2,
    },
    {
      deviceId: "DEV005",
      deviceName: "Smart Board System",
      dataContribution: 5400,
      modelImprovement: 6.7,
      computeContribution: 320,
      privacyPreserved: true,
      reputationScore: 94,
      rewardTokens: 98.7,
    },
    {
      deviceId: "DEV008",
      deviceName: "Classroom Pod Tablet",
      dataContribution: 6100,
      modelImprovement: 7.1,
      computeContribution: 280,
      privacyPreserved: true,
      reputationScore: 95,
      rewardTokens: 112.3,
    },
    {
      deviceId: "DEV003",
      deviceName: "Admin Office Desktop",
      dataContribution: 6700,
      modelImprovement: 7.8,
      computeContribution: 410,
      privacyPreserved: true,
      reputationScore: 97,
      rewardTokens: 134.8,
    },
  ]);

  const startTraining = async () => {
    setIsTraining(true);
    setTrainingProgress(0);

    animationRef.current = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          setIsTraining(false);
          if (animationRef.current) clearInterval(animationRef.current);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesStatus =
        filterStatus === "all" || device.status === filterStatus;
      const matchesSearch =
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [devices, filterStatus, searchQuery]);

  const statusColors: Record<EdgeDevice["status"], string> = {
    online: "bg-green-500",
    offline: "bg-slate-400",
    training: "bg-blue-500",
    syncing: "bg-amber-500",
    idle: "bg-slate-500",
  };

  const deviceTypeIcons: Record<EdgeDevice["type"], React.ReactNode> = {
    mobile: <Wifi className="h-4 w-4" />,
    tablet: <Layers className="h-4 w-4" />,
    desktop: <Cpu className="h-4 w-4" />,
    iot: <Zap className="h-4 w-4" />,
    "edge-server": <Server className="h-4 w-4" />,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-amber-100 text-amber-700";
      case "deployed":
        return "bg-green-100 text-green-700";
      case "training":
        return "bg-blue-100 text-blue-700";
      case "aggregating":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text font-bold text-4xl text-transparent">
              <Network className="h-10 w-10 text-indigo-600" />
              Federated Learning
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
              Decentralized AI training with privacy-preserving analytics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 dark:border-green-800 dark:bg-green-900/20">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800 text-sm dark:text-green-300">
                Privacy Protected
              </span>
            </div>
            {userRole === "admin" && (
              <button
                onClick={startTraining}
                disabled={isTraining}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white shadow-indigo-500/25 shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
              >
                {isTraining ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Training... {trainingProgress}%
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Start Training Round
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-6"
        >
          {[
            {
              label: "Active Devices",
              value: devices.filter((d) => d.status !== "offline").length,
              icon: Cpu,
              color: "from-blue-500 to-cyan-500",
              bgColor: "bg-blue-50 dark:bg-blue-900/20",
            },
            {
              label: "Global Model Accuracy",
              value: `${(currentRound.globalModelAccuracy * 100).toFixed(1)}%`,
              icon: Target,
              color: "from-emerald-500 to-green-500",
              bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
            },
            {
              label: "Privacy Budget Used",
              value: `${(privacyMetrics.privacyBudgetRemaining * 100).toFixed(0)}%`,
              icon: Shield,
              color: "from-amber-500 to-orange-500",
              bgColor: "bg-amber-50 dark:bg-amber-900/20",
            },
            {
              label: "Current Round",
              value: currentRound.roundNumber,
              icon: Layers,
              color: "from-purple-500 to-pink-500",
              bgColor: "bg-purple-50 dark:bg-purple-900/20",
            },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div
                className={`absolute top-0 right-0 h-32 w-32 ${stat.bgColor} -mr-16 -mt-16 rounded-full blur-3xl`}
              />
              <div className="relative z-10">
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} mb-4 flex items-center justify-center`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-slate-500 text-sm dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-1 font-bold text-3xl text-slate-900 dark:text-slate-100">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
          {[
            { id: "dashboard", label: "Training Dashboard", icon: Activity },
            { id: "devices", label: "Edge Devices", icon: Cpu },
            { id: "models", label: "Model Versions", icon: Brain },
            { id: "privacy", label: "Privacy Analytics", icon: Shield },
            { id: "contributions", label: "Contributions", icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Training Visualization */}
            <div className="grid grid-cols-3 gap-6">
              {/* Network Topology */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-slate-100">
                    <Network className="h-5 w-5 text-indigo-600" />
                    Decentralized Network Topology
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                      Training
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Online
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Syncing
                    </span>
                  </div>
                </div>

                <div className="relative h-96 overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                  {/* Central Server */}
                  <motion.div
                    className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 transform"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-indigo-500/30 shadow-xl">
                      <Server className="h-10 w-10 text-white" />
                    </div>
                    <p className="mt-2 text-center font-medium text-slate-600 text-xs dark:text-slate-400">
                      Global Server
                    </p>
                  </motion.div>

                  {/* Edge Devices positioned around server */}
                  {filteredDevices.slice(0, 6).map((device, idx) => {
                    const angle = (idx / 6) * 2 * Math.PI - Math.PI / 2;
                    const radius = 140;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <motion.div
                        key={device.id}
                        className="absolute"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                        }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                      >
                        {/* Connection line */}
                        <svg
                          className="pointer-events-none absolute"
                          style={{
                            width: Math.abs(x) + 40,
                            height: Math.abs(y) + 40,
                            left: x > 0 ? -x - 20 : 20,
                            top: y > 0 ? -y - 20 : 20,
                          }}
                        >
                          <motion.line
                            x1={x > 0 ? 0 : Math.abs(x) + 20}
                            y1={y > 0 ? 0 : Math.abs(y) + 20}
                            x2={x > 0 ? Math.abs(x) + 20 : 0}
                            y2={y > 0 ? Math.abs(y) + 20 : 0}
                            stroke="#6366f1"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            opacity={device.status === "training" ? 1 : 0.3}
                          />
                        </svg>

                        <motion.div
                          className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl shadow-lg transition-all ${
                            device.status === "training"
                              ? "bg-blue-500 text-white"
                              : device.status === "online"
                                ? "bg-green-500 text-white"
                                : device.status === "syncing"
                                  ? "bg-amber-500 text-white"
                                  : "bg-slate-400 text-white"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setSelectedDevice(device)}
                          animate={
                            device.status === "training"
                              ? {
                                  boxShadow: [
                                    "0 0 0 0 rgba(59, 130, 246, 0.4)",
                                    "0 0 0 10px rgba(59, 130, 246, 0)",
                                  ],
                                }
                              : {}
                          }
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          {deviceTypeIcons[device.type]}
                        </motion.div>
                        <p className="mt-1 max-w-20 truncate text-center font-medium text-slate-600 text-xs dark:text-slate-400">
                          {device.name.split(" ")[0]}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Aggregation Dashboard */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <h3 className="mb-6 flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-slate-100">
                  <Layers className="h-5 w-5 text-purple-600" />
                  Aggregation Dashboard
                </h3>

                <div className="space-y-4">
                  <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 dark:border-indigo-800 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-slate-600 text-sm dark:text-slate-400">
                        Round Status
                      </span>
                      <span className="rounded-full bg-indigo-100 px-2 py-1 font-medium text-indigo-700 text-xs dark:bg-indigo-900/50 dark:text-indigo-300">
                        In Progress
                      </span>
                    </div>
                    <p className="font-bold text-2xl text-slate-900 dark:text-slate-100">
                      Round {currentRound.roundNumber}
                    </p>
                    <p className="mt-1 text-slate-500 text-sm dark:text-slate-400">
                      Started {currentRound.startTime.toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700 text-sm dark:text-slate-300">
                          Active Participants
                        </span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {currentRound.participants.length} / {devices.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700 text-sm dark:text-slate-300">
                          Global Accuracy
                        </span>
                      </div>
                      <span className="font-semibold text-emerald-600">
                        {(currentRound.globalModelAccuracy * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700 text-sm dark:text-slate-300">
                          Privacy Budget
                        </span>
                      </div>
                      <span className="font-semibold text-amber-600">
                        {(privacyMetrics.privacyBudgetRemaining * 100).toFixed(
                          0,
                        )}
                        % remaining
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700 text-sm dark:text-slate-300">
                          Method
                        </span>
                      </div>
                      <span className="font-semibold text-slate-900 uppercase dark:text-slate-100">
                        {currentRound.aggregationMethod}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 font-medium text-slate-500 text-xs dark:text-slate-400">
                      Training Progress
                    </p>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(currentRound.participants.length / devices.length) * 100}%`,
                        }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <p className="mt-1 text-right text-slate-500 text-xs dark:text-slate-400">
                      {Math.round(
                        (currentRound.participants.length / devices.length) *
                          100,
                      )}
                      % Complete
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Model Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-slate-100">
                  <Scale className="h-5 w-5 text-indigo-600" />
                  Local vs Global Model Comparison
                </h3>
                <button
                  onClick={() => setShowModelComparison(!showModelComparison)}
                  className="flex items-center gap-2 font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {showModelComparison ? (
                    <>
                      <ChevronUp className="h-4 w-4" /> Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" /> Show Details
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-5 gap-4">
                {currentRound.localModelAccuracies.map((accuracy, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50"
                  >
                    <p className="mb-2 text-slate-500 text-xs dark:text-slate-400">
                      Local Model {idx + 1}
                    </p>
                    <div className="relative h-32">
                      <svg className="-rotate-90 h-full w-full transform">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                          fill="none"
                        />
                        <motion.circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#6366f1"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${accuracy * 314} 314`}
                          initial={{ strokeDasharray: "0 314" }}
                          animate={{ strokeDasharray: `${accuracy * 314} 314` }}
                          transition={{ duration: 1, delay: idx * 0.2 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-bold text-2xl text-slate-900 dark:text-slate-100">
                          {(accuracy * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 dark:border-indigo-700 dark:from-indigo-900/20 dark:to-purple-900/20"
                >
                  <p className="mb-2 font-medium text-indigo-600 text-xs dark:text-indigo-400">
                    Global Model
                  </p>
                  <div className="relative h-32">
                    <svg className="-rotate-90 h-full w-full transform">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#8b5cf6"
                        strokeWidth="8"
                        fill="none"
                        initial={{ strokeDasharray: "0 314" }}
                        animate={{
                          strokeDasharray: `${currentRound.globalModelAccuracy * 314} 314`,
                        }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">
                        {(currentRound.globalModelAccuracy * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <AnimatePresence>
                {showModelComparison && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 border-slate-200 border-t pt-6 dark:border-slate-700"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">
                          Key Differences
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-slate-600 text-sm dark:text-slate-400">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            Global model aggregates knowledge from all devices
                            without exposing raw data
                          </li>
                          <li className="flex items-start gap-2 text-slate-600 text-sm dark:text-slate-400">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            Local models trained on device-specific data with
                            differential privacy
                          </li>
                          <li className="flex items-start gap-2 text-slate-600 text-sm dark:text-slate-400">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            Secure aggregation prevents server from seeing
                            individual model updates
                          </li>
                          <li className="flex items-start gap-2 text-slate-600 text-sm dark:text-slate-400">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            Global model achieves better generalization across
                            diverse data distributions
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">
                          Performance Metrics
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">
                                Accuracy Improvement
                              </span>
                              <span className="font-medium text-emerald-600">
                                +4.2%
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                              <div
                                className="h-2 rounded-full bg-emerald-500"
                                style={{ width: "78%" }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">
                                Privacy Preservation
                              </span>
                              <span className="font-medium text-indigo-600">
                                99.2%
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                              <div
                                className="h-2 rounded-full bg-indigo-500"
                                style={{ width: "99%" }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">
                                Bandwidth Efficiency
                              </span>
                              <span className="font-medium text-amber-600">
                                87.5%
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                              <div
                                className="h-2 rounded-full bg-amber-500"
                                style={{ width: "87%" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === "devices" && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
                <input
                  type="text"
                  placeholder="Search devices..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilterStatus(e.target.value as any)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="training">Training</option>
                <option value="syncing">Syncing</option>
                <option value="idle">Idle</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredDevices.map((device, idx) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedDevice(device)}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-12 w-12 rounded-xl ${statusColors[device.status]} flex items-center justify-center text-white`}
                        >
                          {deviceTypeIcons[device.type]}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                            {device.name}
                          </h4>
                          <p className="text-slate-500 text-sm dark:text-slate-400">
                            {device.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${statusColors[device.status]} ${device.status === "training" ? "animate-pulse" : ""}`}
                        />
                        <span className="font-medium text-slate-500 text-xs capitalize dark:text-slate-400">
                          {device.status}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-700/50">
                        <p className="text-slate-500 text-xs dark:text-slate-400">
                          Data Points
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {device.dataPoints.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-700/50">
                        <p className="text-slate-500 text-xs dark:text-slate-400">
                          Accuracy
                        </p>
                        <p className="font-semibold text-emerald-600">
                          {(device.modelAccuracy * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-700/50">
                        <p className="text-slate-500 text-xs dark:text-slate-400">
                          Privacy Score
                        </p>
                        <p className="font-semibold text-indigo-600">
                          {device.privacyScore}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-700/50">
                        <p className="text-slate-500 text-xs dark:text-slate-400">
                          Bandwidth
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {device.bandwidth} Mbps
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 text-xs dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {device.location}
                      </span>
                      <span>
                        Active {device.lastActive.toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Models Tab */}
        {activeTab === "models" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {models.map((model, idx) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedModel(model)}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-6 w-6 text-indigo-600" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {model.version}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 font-medium text-xs ${getStatusColor(model.status)}`}
                    >
                      {model.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm dark:text-slate-400">
                        Accuracy
                      </span>
                      <span className="font-semibold text-emerald-600">
                        {(model.accuracy * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm dark:text-slate-400">
                        Loss
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {model.loss.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm dark:text-slate-400">
                        Participants
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {model.participants}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm dark:text-slate-400">
                        Privacy Budget
                      </span>
                      <span className="font-semibold text-amber-600">
                        {model.privacyBudget.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="border-slate-200 border-t pt-4 dark:border-slate-700">
                    <p className="mb-2 text-slate-500 text-xs dark:text-slate-400">
                      Improvements
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {model.improvements.map((imp, i) => (
                        <span
                          key={i}
                          className="rounded bg-indigo-50 px-2 py-1 text-indigo-700 text-xs dark:bg-indigo-900/30 dark:text-indigo-300"
                        >
                          {imp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-slate-400 text-xs dark:text-slate-500">
                    Created {model.createdAt.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Privacy Metrics */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <h3 className="mb-6 flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-slate-100">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  Differential Privacy Metrics
                </h3>

                <div className="space-y-6">
                  <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-medium text-slate-600 text-sm dark:text-slate-400">
                        Privacy Budget (ε)
                      </span>
                      <span className="font-bold text-2xl text-indigo-600">
                        {privacyMetrics.epsilon}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{
                          width: `${(privacyMetrics.epsilon / 10) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-slate-500 text-xs dark:text-slate-400">
                      Lower epsilon = stronger privacy guarantee
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                      <p className="mb-1 text-slate-500 text-xs dark:text-slate-400">
                        Delta (δ)
                      </p>
                      <p className="font-bold text-slate-900 text-xl dark:text-slate-100">
                        {privacyMetrics.delta}
                      </p>
                      <p className="mt-1 text-slate-500 text-xs dark:text-slate-400">
                        Failure probability
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                      <p className="mb-1 text-slate-500 text-xs dark:text-slate-400">
                        Noise Applied
                      </p>
                      <p className="font-bold text-slate-900 text-xl dark:text-slate-100">
                        {privacyMetrics.noiseApplied}
                      </p>
                      <p className="mt-1 text-slate-500 text-xs dark:text-slate-400">
                        Gaussian noise
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                    <div className="mb-2 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-900 dark:text-emerald-300">
                        Privacy Budget Remaining
                      </span>
                    </div>
                    <p className="font-bold text-3xl text-emerald-600">
                      {(privacyMetrics.privacyBudgetRemaining * 100).toFixed(0)}
                      %
                    </p>
                    <p className="mt-1 text-emerald-700 text-sm dark:text-emerald-400">
                      Budget resets after{" "}
                      {Math.round(24 - (Date.now() % 86400000) / 3600000)} hours
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Privacy Techniques */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <h3 className="mb-6 flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-slate-100">
                  <Lock className="h-5 w-5 text-indigo-600" />
                  Privacy-Preserving Techniques
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      name: "Secure Aggregation",
                      enabled: privacyMetrics.secureAggregation,
                      description:
                        "Cryptographic protocol ensuring server sees only aggregated updates",
                      icon: Shield,
                    },
                    {
                      name: "Homomorphic Encryption",
                      enabled: privacyMetrics.homomorphicEncryption,
                      description:
                        "Computation on encrypted data without decryption",
                      icon: Lock,
                    },
                    {
                      name: "Data Anonymization",
                      enabled: privacyMetrics.dataAnonymization,
                      description:
                        "k-anonymity and l-diversity applied to training data",
                      icon: Eye,
                    },
                    {
                      name: "Local Differential Privacy",
                      enabled: true,
                      description: "Noise added locally before model upload",
                      icon: Database,
                    },
                  ].map((technique, idx) => (
                    <motion.div
                      key={technique.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex items-start gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${technique.enabled ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-slate-200 dark:bg-slate-600"}`}
                      >
                        <technique.icon
                          className={`h-5 w-5 ${technique.enabled ? "text-emerald-600" : "text-slate-400"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                            {technique.name}
                          </h4>
                          <span
                            className={`rounded-full px-2 py-1 font-medium text-xs ${technique.enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                          >
                            {technique.enabled ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-500 text-sm dark:text-slate-400">
                          {technique.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <Scale className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-amber-900 dark:text-amber-300">
                      Privacy Level
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {["strict", "moderate", "relaxed"].map((level) => (
                      <button
                        key={level}
                        className={`flex-1 rounded-lg py-2 font-medium text-sm transition-colors ${
                          privacyMetrics.differentialPrivacyLevel === level
                            ? "bg-amber-500 text-white"
                            : "bg-white text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Privacy Analytics Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-slate-100">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Privacy-Preserving Analytics
              </h3>

              <div className="grid grid-cols-4 gap-6">
                {[
                  {
                    label: "k-Anonymity",
                    value: privacyMetrics.kAnonymity,
                    description:
                      "Each record indistinguishable from k-1 others",
                  },
                  {
                    label: "l-Diversity",
                    value: privacyMetrics.lDiversity,
                    description: "At least l different sensitive values",
                  },
                  {
                    label: "Data Minimization",
                    value: 94,
                    description: "Only essential data collected",
                  },
                  {
                    label: "Encryption Coverage",
                    value: 100,
                    description: "End-to-end encryption",
                  },
                ].map((metric, idx) => (
                  <div key={metric.label} className="text-center">
                    <div className="relative mx-auto mb-4 h-32 w-32">
                      <svg className="-rotate-90 h-full w-full transform">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                          fill="none"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#6366f1"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(metric.value / (metric.label === "k-Anonymity" ? 10 : metric.label === "l-Diversity" ? 5 : 100)) * 351} 351`}
                          initial={{ strokeDasharray: "0 351" }}
                          animate={{
                            strokeDasharray: `${(metric.value / (metric.label === "k-Anonymity" ? 10 : metric.label === "l-Diversity" ? 5 : 100)) * 351} 351`,
                          }}
                          transition={{ duration: 1, delay: idx * 0.2 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-bold text-2xl text-slate-900 dark:text-slate-100">
                          {metric.value}
                          {metric.label !== "k-Anonymity" &&
                          metric.label !== "l-Diversity"
                            ? "%"
                            : ""}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      {metric.label}
                    </h4>
                    <p className="mt-1 text-slate-500 text-xs dark:text-slate-400">
                      {metric.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Contributions Tab */}
        {activeTab === "contributions" && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 dark:border-indigo-800 dark:from-indigo-900/20 dark:to-purple-900/20"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
                  <Binary className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-slate-900 dark:text-slate-100">
                    Contribution Tracking
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Anonymous contribution metrics without exposing sensitive
                    data
                  </p>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-3 gap-6">
                <div className="rounded-xl bg-white p-4 dark:bg-slate-800">
                  <p className="mb-1 text-slate-500 text-sm dark:text-slate-400">
                    Total Data Points
                  </p>
                  <p className="font-bold text-3xl text-slate-900 dark:text-slate-100">
                    {devices
                      .reduce((sum, d) => sum + d.dataPoints, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4 dark:bg-slate-800">
                  <p className="mb-1 text-slate-500 text-sm dark:text-slate-400">
                    Contributing Devices
                  </p>
                  <p className="font-bold text-3xl text-slate-900 dark:text-slate-100">
                    {devices.filter((d) => d.contribution > 0).length}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4 dark:bg-slate-800">
                  <p className="mb-1 text-slate-500 text-sm dark:text-slate-400">
                    Average Privacy Score
                  </p>
                  <p className="font-bold text-3xl text-emerald-600">
                    {Math.round(
                      devices.reduce((sum, d) => sum + d.privacyScore, 0) /
                        devices.length,
                    )}
                    %
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="border-slate-200 border-b p-6 dark:border-slate-700">
                <h3 className="flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-slate-100">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  Top Contributors
                </h3>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {contributions.map((contribution, idx) => (
                  <motion.div
                    key={contribution.deviceId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-6 p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 font-bold text-white">
                      #{idx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-semibold text-slate-900 dark:text-slate-100">
                        {contribution.deviceName}
                      </h4>
                      <p className="text-slate-500 text-sm dark:text-slate-400">
                        ID: {contribution.deviceId}
                      </p>
                    </div>

                    <div className="hidden grid-cols-4 gap-8 text-center md:grid">
                      <div>
                        <p className="text-slate-500 text-xs dark:text-slate-400">
                          Data Contribution
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {contribution.dataContribution.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs dark:text-slate-400">
                          Model Improvement
                        </p>
                        <p className="font-semibold text-emerald-600">
                          +{contribution.modelImprovement}%
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs dark:text-slate-400">
                          Compute
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {contribution.computeContribution}h
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs dark:text-slate-400">
                          Reputation
                        </p>
                        <p className="font-semibold text-indigo-600">
                          {contribution.reputationScore}/100
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 dark:bg-amber-900/20">
                      <Zap className="h-4 w-4 text-amber-600" />
                      <span className="font-semibold text-amber-700 dark:text-amber-300">
                        {contribution.rewardTokens} tokens
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  Contribution Timeline
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      time: "2 min ago",
                      event: "New data batch processed",
                      device: "DEV001",
                      type: "data",
                    },
                    {
                      time: "5 min ago",
                      event: "Local model update sent",
                      device: "DEV005",
                      type: "model",
                    },
                    {
                      time: "12 min ago",
                      event: "Privacy audit completed",
                      device: "System",
                      type: "audit",
                    },
                    {
                      time: "18 min ago",
                      event: "Secure aggregation round",
                      device: "Server",
                      type: "agg",
                    },
                    {
                      time: "25 min ago",
                      event: "Device reputation updated",
                      device: "DEV006",
                      type: "rep",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={`mt-2 h-2 w-2 rounded-full ${item.type === "data" ? "bg-blue-500" : item.type === "model" ? "bg-green-500" : item.type === "audit" ? "bg-purple-500" : item.type === "agg" ? "bg-amber-500" : "bg-indigo-500"}`}
                      />
                      <div className="flex-1">
                        <p className="text-slate-900 text-sm dark:text-slate-100">
                          {item.event}
                        </p>
                        <p className="text-slate-500 text-xs dark:text-slate-400">
                          {item.device} • {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <Eye className="h-5 w-5 text-indigo-600" />
                  Privacy Guarantees
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                    <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-900 text-sm dark:text-emerald-300">
                        No Raw Data Exposure
                      </p>
                      <p className="text-emerald-700 text-xs dark:text-emerald-400">
                        Only model updates are shared, never raw training data
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                    <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-900 text-sm dark:text-emerald-300">
                        Cryptographic Security
                      </p>
                      <p className="text-emerald-700 text-xs dark:text-emerald-400">
                        Secure aggregation prevents reconstruction attacks
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                    <Database className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-900 text-sm dark:text-emerald-300">
                        Anonymous Contributions
                      </p>
                      <p className="text-emerald-700 text-xs dark:text-emerald-400">
                        Device identities cryptographically protected
                      </p>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        )}

        {/* Device Detail Modal */}
        <AnimatePresence>
          {selectedDevice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedDevice(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-800"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="relative h-32 bg-gradient-to-br from-indigo-600 to-purple-600">
                  <button
                    onClick={() => setSelectedDevice(null)}
                    className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="absolute right-0 bottom-0 left-0 p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="font-bold text-2xl text-white">
                          {selectedDevice.name}
                        </h2>
                        <p className="text-indigo-100">{selectedDevice.id}</p>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 font-medium text-sm ${statusColors[selectedDevice.status]} text-white`}
                      >
                        {selectedDevice.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                      <p className="mb-1 text-slate-500 text-sm dark:text-slate-400">
                        Model Accuracy
                      </p>
                      <p className="font-bold text-2xl text-emerald-600">
                        {(selectedDevice.modelAccuracy * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                      <p className="mb-1 text-slate-500 text-sm dark:text-slate-400">
                        Privacy Score
                      </p>
                      <p className="font-bold text-2xl text-indigo-600">
                        {selectedDevice.privacyScore}%
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                      <p className="mb-1 text-slate-500 text-sm dark:text-slate-400">
                        Data Points
                      </p>
                      <p className="font-bold text-2xl text-slate-900 dark:text-slate-100">
                        {selectedDevice.dataPoints.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                      <p className="mb-1 text-slate-500 text-sm dark:text-slate-400">
                        Total Contribution
                      </p>
                      <p className="font-bold text-2xl text-slate-900 dark:text-slate-100">
                        {selectedDevice.contribution.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700 text-sm dark:text-slate-300">
                          Location
                        </span>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {selectedDevice.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700 text-sm dark:text-slate-300">
                          Bandwidth
                        </span>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {selectedDevice.bandwidth} Mbps
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-700 text-sm dark:text-slate-300">
                          Last Active
                        </span>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {selectedDevice.lastActive.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium text-emerald-900 dark:text-emerald-300">
                        Trusted Device
                      </span>
                    </div>
                    {selectedDevice.isTrusted && (
                      <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm text-white">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Model Detail Modal */}
        <AnimatePresence>
          {selectedModel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedModel(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-800"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="relative h-24 bg-gradient-to-br from-purple-600 to-pink-600">
                  <button
                    onClick={() => setSelectedModel(null)}
                    className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="absolute right-0 bottom-0 left-0 p-6">
                    <h2 className="font-bold text-2xl text-white">
                      Model {selectedModel.version}
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-purple-900 dark:text-purple-300">
                        Global Round {selectedModel.globalRound}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 font-medium text-sm ${getStatusColor(selectedModel.status)}`}
                    >
                      {selectedModel.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                      <p className="text-slate-500 text-xs dark:text-slate-400">
                        Accuracy
                      </p>
                      <p className="font-bold text-emerald-600 text-xl">
                        {(selectedModel.accuracy * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                      <p className="text-slate-500 text-xs dark:text-slate-400">
                        Loss
                      </p>
                      <p className="font-bold text-slate-900 text-xl dark:text-slate-100">
                        {selectedModel.loss.toFixed(3)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                      <p className="text-slate-500 text-xs dark:text-slate-400">
                        Participants
                      </p>
                      <p className="font-bold text-slate-900 text-xl dark:text-slate-100">
                        {selectedModel.participants}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                      <p className="text-slate-500 text-xs dark:text-slate-400">
                        Size
                      </p>
                      <p className="font-bold text-slate-900 text-xl dark:text-slate-100">
                        {selectedModel.size} MB
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-slate-500 text-sm dark:text-slate-400">
                      Improvements
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedModel.improvements.map((imp, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 text-sm dark:bg-indigo-900/30 dark:text-indigo-300"
                        >
                          {imp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs dark:text-slate-500">
                    Created on {selectedModel.createdAt.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FederatedLearning;
