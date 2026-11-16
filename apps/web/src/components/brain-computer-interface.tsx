"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Battery,
  Brain,
  CheckCircle2,
  Cpu,
  Download,
  Eye,
  EyeOff,
  FileText,
  Fingerprint,
  Keyboard,
  Lock,
  Mic,
  MousePointer2,
  Pause,
  Play,
  RefreshCw,
  Save,
  ScanLine,
  Settings,
  Shield,
  Signal,
  Sparkles,
  Terminal,
  Type,
  Unlock,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import React, { useState, useEffect, useCallback, useRef } from "react";

// Neural signal types
interface NeuralSignal {
  channel: number;
  amplitude: number;
  frequency: number;
  timestamp: number;
  quality: "excellent" | "good" | "fair" | "poor";
}

interface BCIDevice {
  id: string;
  name: string;
  status: "connected" | "disconnected" | "calibrating" | "error";
  batteryLevel: number;
  signalStrength: number;
  channels: number;
  lastConnected: Date | null;
  firmwareVersion: string;
}

interface TrainingModule {
  id: string;
  name: string;
  description: string;
  duration: number;
  completed: boolean;
  progress: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: "motor" | "cognitive" | "communication";
}

interface PrivacySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  critical: boolean;
}

// Neural Waveform Component
const NeuralWaveform: React.FC<{
  channel: number;
  data: number[];
  quality: NeuralSignal["quality"];
}> = ({ channel, data, quality }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Quality-based colors
    const qualityColors = {
      excellent: "#00f0ff",
      good: "#00d4ff",
      fair: "#ffd93d",
      poor: "#ff4757",
    };

    const color = qualityColors[quality];

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw waveform
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);

    for (let i = 0; i < data.length; i++) {
      const x = (i / data.length) * width;
      const y = height / 2 + data[i] * (height / 3);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [data, quality]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={200}
        height={60}
        className="rounded bg-[#0a1628]/50"
      />
      <div className="absolute top-1 left-2 font-mono text-[10px] text-white/40">
        CH{channel.toString().padStart(2, "0")}
      </div>
      <motion.div
        className="absolute top-1 right-2 h-2 w-2 rounded-full"
        style={{
          backgroundColor:
            quality === "excellent"
              ? "#00f0ff"
              : quality === "good"
                ? "#00d4ff"
                : quality === "fair"
                  ? "#ffd93d"
                  : "#ff4757",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
};

// Neural Network Visualization
const NeuralNetworkViz: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const nodeCount = 24;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      ctx.fillStyle = "rgba(10, 22, 40, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Update nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      // Draw connections
      ctx.strokeStyle = "rgba(0, 240, 255, 0.15)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes with pulse effect
      nodes.forEach((node, i) => {
        const pulse = Math.sin(time + i * 0.5) * 0.5 + 0.5;
        const size = 3 + pulse * 2;

        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${0.6 + pulse * 0.4})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${0.1 + pulse * 0.1})`;
        ctx.fill();
      });

      // Draw data packets flowing along connections
      const packetIndex = Math.floor(time * 10) % nodes.length;
      const node = nodes[packetIndex];
      const connections = nodes.filter(
        (n, i) =>
          i !== packetIndex &&
          Math.abs(n.x - node.x) < 100 &&
          Math.abs(n.y - node.y) < 100,
      );

      if (connections.length > 0) {
        const target = connections[0];
        const t = (time * 2) % 1;
        const px = node.x + (target.x - node.x) * t;
        const py = node.y + (target.y - node.y) * t;

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#00f0ff";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={200}
      className="h-full w-full rounded-lg bg-[#0a1628]"
    />
  );
};

// Signal Quality Indicator
const SignalQualityIndicator: React.FC<{
  quality: NeuralSignal["quality"];
}> = ({ quality }) => {
  const qualityConfig = {
    excellent: { color: "#00f0ff", label: "EXCELLENT", bars: 4 },
    good: { color: "#00d4ff", label: "GOOD", bars: 3 },
    fair: { color: "#ffd93d", label: "FAIR", bars: 2 },
    poor: { color: "#ff4757", label: "POOR", bars: 1 },
  };

  const config = qualityConfig[quality];

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-sm"
            style={{
              height: `${(i + 1) * 4}px`,
              backgroundColor:
                i < config.bars ? config.color : "rgba(255,255,255,0.1)",
            }}
            animate={i < config.bars ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>
      <span
        className="font-mono font-semibold text-xs"
        style={{ color: config.color }}
      >
        {config.label}
      </span>
    </div>
  );
};

// Main BCI Component
export default function BrainComputerInterface() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "visualization" | "training" | "privacy" | "accessibility"
  >("overview");
  const [isConnected, setIsConnected] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [thoughtText, setThoughtText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [neuralSignals, setNeuralSignals] = useState<NeuralSignal[]>([]);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState(75);

  // Mock device data
  const [devices] = useState<BCIDevice[]>([
    {
      id: "dev-001",
      name: "NeuralLink Pro V2",
      status: "disconnected",
      batteryLevel: 87,
      signalStrength: 0,
      channels: 64,
      lastConnected: null,
      firmwareVersion: "2.4.1",
    },
    {
      id: "dev-002",
      name: "BrainGate Interface",
      status: "disconnected",
      batteryLevel: 45,
      signalStrength: 0,
      channels: 96,
      lastConnected: new Date("2024-03-20T14:30:00"),
      firmwareVersion: "3.1.0",
    },
    {
      id: "dev-003",
      name: "Emotiv EPOC X",
      status: "disconnected",
      batteryLevel: 92,
      signalStrength: 0,
      channels: 14,
      lastConnected: new Date("2024-03-25T09:15:00"),
      firmwareVersion: "1.8.3",
    },
  ]);

  // Training modules
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([
    {
      id: "mod-001",
      name: "Neural Cursor Control",
      description: "Learn to control the mouse cursor using neural signals",
      duration: 15,
      completed: true,
      progress: 100,
      difficulty: "beginner",
      category: "motor",
    },
    {
      id: "mod-002",
      name: "Thought-to-Text Basics",
      description: "Convert neural patterns into written text",
      duration: 20,
      completed: false,
      progress: 65,
      difficulty: "intermediate",
      category: "communication",
    },
    {
      id: "mod-003",
      name: "Cognitive Focus Training",
      description: "Improve concentration and signal clarity",
      duration: 12,
      completed: false,
      progress: 30,
      difficulty: "beginner",
      category: "cognitive",
    },
    {
      id: "mod-004",
      name: "Multi-Channel Navigation",
      description: "Advanced control using multiple neural pathways",
      duration: 25,
      completed: false,
      progress: 0,
      difficulty: "advanced",
      category: "motor",
    },
    {
      id: "mod-005",
      name: "Neural Command Macros",
      description: "Create and execute complex command sequences",
      duration: 30,
      completed: false,
      progress: 0,
      difficulty: "advanced",
      category: "cognitive",
    },
  ]);

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    {
      id: "priv-001",
      name: "End-to-End Encryption",
      description: "Encrypt all neural data transmission",
      enabled: true,
      critical: true,
    },
    {
      id: "priv-002",
      name: "Local Processing Only",
      description: "Process signals on-device, never transmit raw data",
      enabled: true,
      critical: true,
    },
    {
      id: "priv-003",
      name: "Automatic Data Purge",
      description: "Delete neural recordings after 24 hours",
      enabled: false,
      critical: false,
    },
    {
      id: "priv-004",
      name: "Biometric Authentication",
      description: "Require fingerprint for neural interface access",
      enabled: true,
      critical: true,
    },
    {
      id: "priv-005",
      name: "Thought Pattern Anonymization",
      description: "Remove personally identifiable neural patterns",
      enabled: true,
      critical: true,
    },
  ]);

  // Generate mock neural signal data
  const generateNeuralData = useCallback((channel: number): number[] => {
    const data: number[] = [];
    const baseFreq = 8 + channel * 0.5;
    const now = Date.now() / 1000;

    for (let i = 0; i < 100; i++) {
      const t = now - i * 0.02;
      const signal =
        Math.sin(t * baseFreq) * 0.3 +
        Math.sin(t * baseFreq * 2.5) * 0.2 +
        Math.sin(t * baseFreq * 0.7) * 0.15 +
        (Math.random() - 0.5) * 0.1;
      data.push(signal);
    }

    return data.reverse();
  }, []);

  // Update neural signals
  useEffect(() => {
    if (!isConnected) {
      setNeuralSignals([]);
      return;
    }

    const interval = setInterval(() => {
      const qualities: NeuralSignal["quality"][] = [
        "excellent",
        "good",
        "good",
        "fair",
        "excellent",
      ];

      const newSignals: NeuralSignal[] = Array.from({ length: 8 }, (_, i) => ({
        channel: i + 1,
        amplitude: Math.random() * 2 - 1,
        frequency: 8 + i * 2,
        timestamp: Date.now(),
        quality: qualities[i % qualities.length],
      }));

      setNeuralSignals(newSignals);
    }, 100);

    return () => clearInterval(interval);
  }, [isConnected]);

  // Simulate thought-to-text transcription
  const startTranscription = () => {
    setIsTranscribing(true);
    const phrases = [
      "Hello, this is my first neural message...",
      "I want to navigate to the learning portal",
      "Please open the mathematics module",
      "Can you help me with this assignment?",
      "Save my progress to the cloud",
    ];

    let currentText = "";
    let wordIndex = 0;
    const words =
      phrases[Math.floor(Math.random() * phrases.length)].split(" ");

    const interval = setInterval(() => {
      if (wordIndex >= words.length) {
        clearInterval(interval);
        setIsTranscribing(false);
        return;
      }

      currentText += (wordIndex > 0 ? " " : "") + words[wordIndex];
      setThoughtText(currentText);
      wordIndex++;
    }, 400);
  };

  // Connect/disconnect device
  const toggleConnection = (deviceId: string) => {
    if (isConnected && selectedDevice === deviceId) {
      setIsConnected(false);
      setSelectedDevice(null);
    } else {
      setIsCalibrating(true);
      setSelectedDevice(deviceId);
      setTimeout(() => {
        setIsCalibrating(false);
        setIsConnected(true);
      }, 3000);
    }
  };

  // Update training progress
  const updateTrainingProgress = (moduleId: string, progress: number) => {
    setTrainingModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId
          ? { ...mod, progress, completed: progress >= 100 }
          : mod,
      ),
    );
  };

  // Toggle privacy setting
  const togglePrivacySetting = (settingId: string) => {
    setPrivacySettings((prev) =>
      prev.map((setting) =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting,
      ),
    );
  };

  // Get device status icon
  const getDeviceStatusIcon = (status: BCIDevice["status"]) => {
    switch (status) {
      case "connected":
        return <Wifi className="h-4 w-4 text-[#00f0ff]" />;
      case "disconnected":
        return <WifiOff className="h-4 w-4 text-white/40" />;
      case "calibrating":
        return <RefreshCw className="h-4 w-4 animate-spin text-[#ffd93d]" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-[#ff4757]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] font-sans text-white selection:bg-[#00f0ff]/30">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.03),transparent_50%)]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] p-6">
        {/* Header */}
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="relative"
                animate={isConnected ? { rotate: 360 } : {}}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00f0ff]/30 bg-gradient-to-br from-[#00f0ff]/20 to-[#00d4ff]/10">
                  <Brain className="h-7 w-7 text-[#00f0ff]" />
                </div>
                {isConnected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-[#00f0ff]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <div>
                <h1 className="font-bold text-3xl tracking-tight">
                  <span className="text-white">Neural</span>
                  <span className="text-[#00f0ff]">Interface</span>
                </h1>
                <p className="mt-1 font-mono text-sm text-white/50">
                  BCI v2.4.1 • Medical Grade Support System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <motion.div
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2"
                animate={
                  isConnected ? { borderColor: "rgba(0, 240, 255, 0.3)" } : {}
                }
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    isConnected ? "bg-[#00f0ff]" : "bg-white/30"
                  }`}
                />
                <span className="font-medium text-sm">
                  {isConnected
                    ? "Neural Link Active"
                    : isCalibrating
                      ? "Calibrating..."
                      : "Standby"}
                </span>
                {isConnected && <SignalQualityIndicator quality="excellent" />}
              </motion.div>

              {/* Privacy Toggle */}
              <motion.button
                onClick={() => setPrivacyMode(!privacyMode)}
                className={`rounded-xl border p-2.5 transition-all ${
                  privacyMode
                    ? "border-[#00f0ff]/30 bg-[#00f0ff]/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {privacyMode ? (
                  <Eye className="h-5 w-5 text-[#00f0ff]" />
                ) : (
                  <EyeOff className="h-5 w-5 text-white/50" />
                )}
              </motion.button>

              {/* Settings */}
              <motion.button
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 transition-all hover:border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="h-5 w-5 text-white/70" />
              </motion.button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "visualization", label: "Neural Signals", icon: ScanLine },
              { id: "training", label: "Training", icon: Sparkles },
              { id: "accessibility", label: "Accessibility", icon: Keyboard },
              { id: "privacy", label: "Security", icon: Shield },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium text-sm transition-all ${
                  activeTab === id
                    ? "border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </motion.button>
            ))}
          </nav>
        </motion.header>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              className="grid grid-cols-12 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Device Management */}
              <div className="col-span-12 lg:col-span-4">
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-semibold text-lg">
                      <Cpu className="h-5 w-5 text-[#00f0ff]" />
                      Devices
                    </h2>
                    <span className="rounded bg-white/5 px-2 py-1 font-mono text-white/40 text-xs">
                      {devices.length} Available
                    </span>
                  </div>

                  <div className="space-y-3">
                    {devices.map((device) => (
                      <motion.div
                        key={device.id}
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${
                          selectedDevice === device.id
                            ? "border-[#00f0ff]/30 bg-[#00f0ff]/5"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20"
                        }`}
                        onClick={() => setSelectedDevice(device.id)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                selectedDevice === device.id
                                  ? "bg-[#00f0ff]/10"
                                  : "bg-white/5"
                              }`}
                            >
                              <Brain className="h-5 w-5 text-white/70" />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">
                                {device.name}
                              </h3>
                              <p className="font-mono text-white/40 text-xs">
                                {device.channels} channels • v
                                {device.firmwareVersion}
                              </p>
                            </div>
                          </div>
                          {getDeviceStatusIcon(
                            selectedDevice === device.id && isCalibrating
                              ? "calibrating"
                              : selectedDevice === device.id && isConnected
                                ? "connected"
                                : device.status,
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Battery className="h-3.5 w-3.5 text-white/40" />
                            <span
                              className={
                                device.batteryLevel < 20
                                  ? "text-[#ff4757]"
                                  : "text-white/60"
                              }
                            >
                              {device.batteryLevel}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Signal className="h-3.5 w-3.5 text-white/40" />
                            <span className="text-white/60">
                              {selectedDevice === device.id && isConnected
                                ? "-42 dBm"
                                : "--"}
                            </span>
                          </div>
                        </div>

                        {selectedDevice === device.id && (
                          <motion.button
                            className={`mt-3 w-full rounded-lg py-2 font-medium text-sm transition-all ${
                              isConnected
                                ? "border border-[#ff4757]/30 bg-[#ff4757]/10 text-[#ff4757]"
                                : "border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]"
                            }`}
                            onClick={(
                              e: React.MouseEvent<HTMLButtonElement>,
                            ) => {
                              e.stopPropagation();
                              toggleConnection(device.id);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isCalibrating
                              ? "Calibrating..."
                              : isConnected
                                ? "Disconnect"
                                : "Connect Device"}
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Thought-to-Text Interface */}
              <div className="col-span-12 lg:col-span-5">
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-semibold text-lg">
                      <Terminal className="h-5 w-5 text-[#00f0ff]" />
                      Neural Input
                    </h2>
                    <div className="flex gap-2">
                      <motion.button
                        className="rounded-lg border border-white/10 bg-white/5 p-2 transition-all hover:border-white/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Keyboard className="h-4 w-4 text-white/60" />
                      </motion.button>
                      <motion.button
                        className="rounded-lg border border-white/10 bg-white/5 p-2 transition-all hover:border-white/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Mic className="h-4 w-4 text-white/60" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Text Display Area */}
                  <div className="relative mb-4">
                    <div className="min-h-[200px] rounded-xl border border-white/10 bg-[#0a1628] p-4 font-mono text-sm leading-relaxed">
                      {thoughtText ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {thoughtText}
                          {isTranscribing && (
                            <motion.span
                              className="ml-1 inline-block h-4 w-2 bg-[#00f0ff]"
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                            />
                          )}
                        </motion.span>
                      ) : (
                        <span className="text-white/30 italic">
                          Neural input ready. Think to type...
                        </span>
                      )}
                    </div>

                    {/* Neural Activity Indicator */}
                    {isTranscribing && (
                      <div className="absolute right-4 bottom-4 flex items-center gap-2">
                        <motion.div
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00f0ff]/20"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <Zap className="h-4 w-4 text-[#00f0ff]" />
                        </motion.div>
                        <span className="font-mono text-[#00f0ff] text-xs">
                          Processing...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={startTranscription}
                      disabled={!isConnected || isTranscribing}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium transition-all ${
                        isConnected && !isTranscribing
                          ? "border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff]/20"
                          : "cursor-not-allowed border border-white/10 bg-white/5 text-white/30"
                      }`}
                      whileHover={
                        isConnected && !isTranscribing ? { scale: 1.02 } : {}
                      }
                      whileTap={
                        isConnected && !isTranscribing ? { scale: 0.98 } : {}
                      }
                    >
                      {isTranscribing ? (
                        <>
                          <Pause className="h-4 w-4" />
                          Transcribing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Start Neural Input
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      onClick={() => setThoughtText("")}
                      disabled={!thoughtText}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/50 transition-all hover:border-white/20 hover:text-white disabled:opacity-30"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Type className="h-4 w-4" />
                    </motion.button>

                    <motion.button
                      disabled={!thoughtText}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/50 transition-all hover:border-white/20 hover:text-white disabled:opacity-30"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save className="h-4 w-4" />
                    </motion.button>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      "Hello",
                      "Help me",
                      "Next page",
                      "Save work",
                      "End session",
                    ].map((phrase) => (
                      <motion.button
                        key={phrase}
                        onClick={() => setThoughtText(phrase)}
                        disabled={!isConnected}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/50 text-xs transition-all hover:border-white/20 hover:text-white disabled:opacity-30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {phrase}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="col-span-12 lg:col-span-3">
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="mb-5 flex items-center gap-2 font-semibold text-lg">
                    <Activity className="h-5 w-5 text-[#00f0ff]" />
                    System Status
                  </h2>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Neural Link",
                        value: isConnected ? "Active" : "Inactive",
                        active: isConnected,
                      },
                      {
                        label: "Signal Quality",
                        value: isConnected ? "98.4%" : "--",
                        active: isConnected,
                      },
                      {
                        label: "Latency",
                        value: isConnected ? "12ms" : "--",
                        active: isConnected,
                      },
                      { label: "Sample Rate", value: "2048 Hz", active: true },
                      {
                        label: "Encryption",
                        value: encryptionEnabled ? "AES-256" : "Disabled",
                        active: encryptionEnabled,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-white/50">
                          {stat.label}
                        </span>
                        <span
                          className={`font-medium font-mono text-sm ${stat.active ? "text-[#00f0ff]" : "text-white/30"}`}
                        >
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Neural Network Visualization */}
                  <div className="mt-6 h-32 overflow-hidden rounded-xl border border-white/10 bg-[#0a1628]">
                    <NeuralNetworkViz isActive={isConnected} />
                  </div>

                  {/* Security Badge */}
                  <motion.div
                    className="mt-4 rounded-xl border border-[#00f0ff]/20 bg-[#00f0ff]/5 p-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00f0ff]/10">
                        <Fingerprint className="h-5 w-5 text-[#00f0ff]" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white">
                          HIPAA Compliant
                        </p>
                        <p className="text-white/40 text-xs">
                          Neural data protected
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Visualization Tab */}
          {activeTab === "visualization" && (
            <motion.div
              key="visualization"
              className="grid grid-cols-12 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Channel Overview */}
              <div className="col-span-12">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-semibold text-lg">
                      <ScanLine className="h-5 w-5 text-[#00f0ff]" />
                      Neural Signal Monitor
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-white/40 text-xs">
                        64 Channels • 2048 Hz
                      </span>
                      <div className="flex gap-2">
                        <button className="rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-3 py-1.5 text-[#00f0ff] text-xs">
                          Real-time
                        </button>
                        <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/50 text-xs">
                          Recorded
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Signal Grid */}
                  <div className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8">
                    {neuralSignals.length > 0
                      ? neuralSignals.map((signal) => (
                          <NeuralWaveform
                            key={signal.channel}
                            channel={signal.channel}
                            data={generateNeuralData(signal.channel)}
                            quality={signal.quality}
                          />
                        ))
                      : Array.from({ length: 8 }, (_, i) => (
                          <div
                            key={i}
                            className="flex h-[60px] items-center justify-center rounded border border-white/5 bg-[#0a1628]/50"
                          >
                            <span className="font-mono text-white/20 text-xs">
                              CH{(i + 1).toString().padStart(2, "0")}
                            </span>
                          </div>
                        ))}
                  </div>

                  {/* Frequency Spectrum */}
                  <div className="mt-6 grid grid-cols-4 gap-4">
                    {[
                      {
                        band: "Delta",
                        range: "0.5-4 Hz",
                        color: "#ff6b6b",
                        value: 15,
                      },
                      {
                        band: "Theta",
                        range: "4-8 Hz",
                        color: "#ffd93d",
                        value: 25,
                      },
                      {
                        band: "Alpha",
                        range: "8-13 Hz",
                        color: "#6bcb77",
                        value: 45,
                      },
                      {
                        band: "Beta",
                        range: "13-30 Hz",
                        color: "#00f0ff",
                        value: 35,
                      },
                    ].map((freq) => (
                      <div
                        key={freq.band}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {freq.band}
                          </span>
                          <span className="font-mono text-white/40 text-xs">
                            {freq.range}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: freq.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${freq.value}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <div
                          className="mt-2 text-right font-mono text-xs"
                          style={{ color: freq.color }}
                        >
                          {freq.value} μV²/Hz
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3D Brain Model Placeholder */}
              <div className="col-span-12 lg:col-span-8">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="mb-5 font-semibold text-lg">
                    Cortical Activity Map
                  </h2>
                  <div className="relative flex h-[400px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0a1628]">
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `radial-gradient(circle at 30% 40%, rgba(0,240,255,0.3) 0%, transparent 30%),
                                        radial-gradient(circle at 70% 30%, rgba(0,212,255,0.2) 0%, transparent 25%),
                                        radial-gradient(circle at 50% 60%, rgba(255,217,61,0.2) 0%, transparent 20%)`,
                      }}
                    />
                    <div className="text-center">
                      <Brain className="mx-auto mb-4 h-20 w-20 text-[#00f0ff]/30" />
                      <p className="text-sm text-white/50">
                        3D Neural Activity Visualization
                      </p>
                      <p className="mt-1 text-white/30 text-xs">
                        Real-time cortical mapping active
                      </p>
                    </div>

                    {/* Hotspot Indicators */}
                    {isConnected &&
                      [
                        { x: "25%", y: "35%", intensity: 0.8 },
                        { x: "60%", y: "25%", intensity: 0.6 },
                        { x: "45%", y: "55%", intensity: 0.9 },
                      ].map((spot, i) => (
                        <motion.div
                          key={i}
                          className="absolute h-4 w-4 rounded-full bg-[#00f0ff]"
                          style={{
                            left: spot.x,
                            top: spot.y,
                            opacity: spot.intensity,
                          }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [
                              spot.intensity,
                              spot.intensity * 0.5,
                              spot.intensity,
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                  </div>
                </div>
              </div>

              {/* Signal Stats */}
              <div className="col-span-12 lg:col-span-4">
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="mb-5 font-semibold text-lg">Signal Metrics</h2>

                  <div className="space-y-6">
                    {[
                      {
                        label: "SNR Ratio",
                        value: "24.6 dB",
                        status: "optimal",
                      },
                      {
                        label: "Artifact Rejection",
                        value: "98.2%",
                        status: "optimal",
                      },
                      {
                        label: "Baseline Drift",
                        value: "±0.3 μV",
                        status: "good",
                      },
                      { label: "Impedance", value: "<5 kΩ", status: "optimal" },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm text-white/60">
                            {metric.label}
                          </span>
                          <span
                            className={`font-mono text-sm ${
                              metric.status === "optimal"
                                ? "text-[#00f0ff]"
                                : "text-[#ffd93d]"
                            }`}
                          >
                            {metric.value}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className={`h-full rounded-full ${
                              metric.status === "optimal"
                                ? "bg-[#00f0ff]"
                                : "bg-[#ffd93d]"
                            }`}
                            initial={{ width: 0 }}
                            animate={{
                              width:
                                metric.status === "optimal" ? "90%" : "75%",
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Export Controls */}
                  <div className="mt-8 border-white/10 border-t pt-6">
                    <h3 className="mb-3 font-medium text-sm">Data Export</h3>
                    <div className="space-y-2">
                      <motion.button
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 transition-all hover:border-white/20 hover:text-white"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Download className="h-4 w-4" />
                        Export Session Data (.edf)
                      </motion.button>
                      <motion.button
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 transition-all hover:border-white/20 hover:text-white"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FileText className="h-4 w-4" />
                        Generate Report
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Training Tab */}
          {activeTab === "training" && (
            <motion.div
              key="training"
              className="grid grid-cols-12 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Training Progress Overview */}
              <div className="col-span-12 lg:col-span-4">
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="mb-5 flex items-center gap-2 font-semibold text-lg">
                    <Sparkles className="h-5 w-5 text-[#00f0ff]" />
                    Progress Overview
                  </h2>

                  <div className="space-y-6">
                    {/* Overall Progress */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-white/60">
                          Overall Completion
                        </span>
                        <span className="font-mono text-[#00f0ff] text-lg">
                          {Math.round(
                            trainingModules.reduce(
                              (acc, m) => acc + m.progress,
                              0,
                            ) / trainingModules.length,
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] to-[#00d4ff]"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              trainingModules.reduce(
                                (acc, m) => acc + m.progress,
                                0,
                              ) / trainingModules.length
                            }%`,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    {[
                      {
                        category: "motor",
                        label: "Motor Control",
                        color: "#00f0ff",
                      },
                      {
                        category: "cognitive",
                        label: "Cognitive",
                        color: "#ffd93d",
                      },
                      {
                        category: "communication",
                        label: "Communication",
                        color: "#6bcb77",
                      },
                    ].map((cat) => {
                      const modules = trainingModules.filter(
                        (m) => m.category === cat.category,
                      );
                      const avgProgress =
                        modules.reduce((acc, m) => acc + m.progress, 0) /
                        modules.length;

                      return (
                        <div key={cat.category}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm text-white/60">
                              {cat.label}
                            </span>
                            <span
                              className="font-mono text-sm"
                              style={{ color: cat.color }}
                            >
                              {Math.round(avgProgress)}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: cat.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${avgProgress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 border-white/10 border-t pt-6">
                      <div className="rounded-lg bg-white/5 p-3 text-center">
                        <p className="font-mono text-2xl text-[#00f0ff]">
                          {trainingModules.filter((m) => m.completed).length}
                        </p>
                        <p className="text-white/40 text-xs">Completed</p>
                      </div>
                      <div className="rounded-lg bg-white/5 p-3 text-center">
                        <p className="font-mono text-2xl text-[#ffd93d]">
                          {trainingModules.reduce(
                            (acc, m) => acc + m.duration,
                            0,
                          )}
                        </p>
                        <p className="text-white/40 text-xs">Minutes Total</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Training Modules List */}
              <div className="col-span-12 lg:col-span-8">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-semibold text-lg">Training Modules</h2>
                    <div className="flex gap-2">
                      <button className="rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-3 py-1.5 text-[#00f0ff] text-xs">
                        All
                      </button>
                      <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/50 text-xs">
                        In Progress
                      </button>
                      <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/50 text-xs">
                        Completed
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {trainingModules.map((module) => (
                      <motion.div
                        key={module.id}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-white/20"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Status Icon */}
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                              module.completed
                                ? "bg-[#00f0ff]/10"
                                : module.progress > 0
                                  ? "bg-[#ffd93d]/10"
                                  : "bg-white/5"
                            }`}
                          >
                            {module.completed ? (
                              <CheckCircle2 className="h-6 w-6 text-[#00f0ff]" />
                            ) : (
                              <Brain className="h-6 w-6 text-white/50" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="mb-1 flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-sm">
                                  {module.name}
                                </h3>
                                <p className="mt-0.5 text-white/40 text-xs">
                                  {module.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded border px-2 py-0.5 text-xs ${
                                    module.difficulty === "beginner"
                                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                                      : module.difficulty === "intermediate"
                                        ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                                        : "border-red-500/30 bg-red-500/10 text-red-400"
                                  }`}
                                >
                                  {module.difficulty}
                                </span>
                                <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-white/50 text-xs capitalize">
                                  {module.category}
                                </span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3">
                              <div className="mb-1.5 flex items-center justify-between text-xs">
                                <span className="text-white/40">
                                  {module.progress === 0
                                    ? "Not started"
                                    : module.progress === 100
                                      ? "Complete"
                                      : `${module.progress}% complete`}
                                </span>
                                <span className="text-white/40">
                                  {module.duration} min
                                </span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                  className={`h-full rounded-full ${
                                    module.completed
                                      ? "bg-[#00f0ff]"
                                      : "bg-gradient-to-r from-[#ffd93d] to-[#00f0ff]"
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${module.progress}%` }}
                                  transition={{
                                    duration: 0.8,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Action */}
                          <motion.button
                            className={`rounded-lg px-4 py-2 font-medium text-sm transition-all ${
                              module.completed
                                ? "border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]"
                                : module.progress > 0
                                  ? "border border-[#ffd93d]/30 bg-[#ffd93d]/10 text-[#ffd93d]"
                                  : "border border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {module.completed ? (
                              <span className="flex items-center gap-1.5">
                                <RefreshCw className="h-3.5 w-3.5" />
                                Restart
                              </span>
                            ) : module.progress > 0 ? (
                              <span className="flex items-center gap-1.5">
                                <Play className="h-3.5 w-3.5" />
                                Continue
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <Play className="h-3.5 w-3.5" />
                                Start
                              </span>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Accessibility Tab */}
          {activeTab === "accessibility" && (
            <motion.div
              key="accessibility"
              className="grid grid-cols-12 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Motor Control Panel */}
              <div className="col-span-12 lg:col-span-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="mb-5 flex items-center gap-2 font-semibold text-lg">
                    <MousePointer2 className="h-5 w-5 text-[#00f0ff]" />
                    Neural Motor Control
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Cursor Control */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-medium text-sm">Neural Cursor</h3>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-[#00f0ff]" />
                      </div>
                      <div className="relative h-32 overflow-hidden rounded-lg border border-white/10 bg-[#0a1628]">
                        <motion.div
                          className="absolute h-4 w-4 rounded-full bg-[#00f0ff] shadow-lg"
                          style={{
                            boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)",
                          }}
                          animate={{
                            x: [20, 180, 100, 20],
                            y: [20, 40, 100, 20],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white/20 text-xs">
                            Trackpad Area
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10 py-2 font-medium text-[#00f0ff] text-xs">
                          Calibrate
                        </button>
                        <button className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 font-medium text-white/60 text-xs">
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Gesture Control */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <h3 className="mb-3 font-medium text-sm">
                        Gesture Commands
                      </h3>
                      <div className="space-y-2">
                        {[
                          {
                            gesture: "Blink 2x",
                            action: "Click",
                            active: true,
                          },
                          {
                            gesture: "Think 'Next'",
                            action: "Next Page",
                            active: false,
                          },
                          {
                            gesture: "Think 'Back'",
                            action: "Previous",
                            active: false,
                          },
                          {
                            gesture: "Jaw Clench",
                            action: "Right Click",
                            active: true,
                          },
                        ].map((cmd, i) => (
                          <div
                            key={i}
                            className={`flex items-center justify-between rounded-lg p-2.5 ${
                              cmd.active ? "bg-[#00f0ff]/5" : "bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  cmd.active ? "bg-[#00f0ff]" : "bg-white/30"
                                }`}
                              />
                              <span className="text-xs">{cmd.gesture}</span>
                            </div>
                            <span className="text-white/40 text-xs">
                              {cmd.action}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Voice Output */}
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-medium text-sm">
                        Neural Text-to-Speech
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setVolumeLevel(Math.max(0, volumeLevel - 10))
                          }
                          className="rounded-lg bg-white/5 p-1.5 transition-all hover:bg-white/10"
                        >
                          <VolumeX className="h-4 w-4 text-white/60" />
                        </button>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-[#00f0ff]"
                            style={{ width: `${volumeLevel}%` }}
                          />
                        </div>
                        <button
                          onClick={() =>
                            setVolumeLevel(Math.min(100, volumeLevel + 10))
                          }
                          className="rounded-lg bg-white/5 p-1.5 transition-all hover:bg-white/10"
                        >
                          <Volume2 className="h-4 w-4 text-white/60" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10 py-2.5 font-medium text-[#00f0ff] text-sm">
                        Speak Thought
                      </button>
                      <button className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 font-medium text-sm text-white/60">
                        Configure Voice
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keyboard & Input */}
              <div className="col-span-12 lg:col-span-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="mb-5 flex items-center gap-2 font-semibold text-lg">
                    <Keyboard className="h-5 w-5 text-[#00f0ff]" />
                    Neural Keyboard
                  </h2>

                  {/* Virtual Keyboard Preview */}
                  <div className="rounded-xl border border-white/10 bg-[#0a1628] p-4">
                    <div className="mb-4 min-h-[40px] rounded-lg bg-white/5 p-3 font-mono text-sm">
                      {thoughtText || (
                        <span className="text-white/30">
                          Neural typing area...
                        </span>
                      )}
                    </div>

                    {/* Keyboard Grid */}
                    <div className="grid grid-cols-10 gap-1">
                      {"QWERTYUIOP".split("").map((key) => (
                        <motion.button
                          key={key}
                          className="flex aspect-square items-center justify-center rounded bg-white/10 font-medium text-sm transition-all hover:bg-[#00f0ff]/20"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {key}
                        </motion.button>
                      ))}
                      {"ASDFGHJKL".split("").map((key) => (
                        <motion.button
                          key={key}
                          className="col-span-1 flex aspect-square items-center justify-center rounded bg-white/10 font-medium text-sm transition-all hover:bg-[#00f0ff]/20"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {key}
                        </motion.button>
                      ))}
                      <div className="col-span-10" />
                      {"ZXCVBNM".split("").map((key) => (
                        <motion.button
                          key={key}
                          className="col-span-1 flex aspect-square items-center justify-center rounded bg-white/10 font-medium text-sm transition-all hover:bg-[#00f0ff]/20"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {key}
                        </motion.button>
                      ))}
                      <motion.button
                        className="col-span-3 flex aspect-square items-center justify-center rounded bg-white/10 font-medium text-xs transition-all hover:bg-[#00f0ff]/20"
                        whileHover={{ scale: 1.05 }}
                      >
                        SPACE
                      </motion.button>
                    </div>
                  </div>

                  {/* Input Methods */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { name: "Direct Neural", status: "Active", icon: Zap },
                      { name: "Scan Mode", status: "Ready", icon: ScanLine },
                      { name: "Predictive", status: "On", icon: Sparkles },
                    ].map((method) => (
                      <div
                        key={method.name}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center"
                      >
                        <method.icon className="mx-auto mb-2 h-5 w-5 text-[#00f0ff]" />
                        <p className="font-medium text-xs">{method.name}</p>
                        <p className="text-white/40 text-xs">{method.status}</p>
                      </div>
                    ))}
                  </div>

                  {/* Speed Indicator */}
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Typing Speed</p>
                        <p className="mt-1 font-mono text-2xl text-[#00f0ff]">
                          12 <span className="text-sm text-white/40">WPM</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">Accuracy</p>
                        <p className="mt-1 font-mono text-2xl text-[#6bcb77]">
                          94<span className="text-sm">%</span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] to-[#6bcb77]"
                        initial={{ width: 0 }}
                        animate={{ width: "78%" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Controls */}
              <div className="col-span-12">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                        <AlertCircle className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-lg text-red-400">
                          Emergency Override
                        </h2>
                        <p className="text-sm text-white/50">
                          Immediately disconnect neural interface and return to
                          manual control
                        </p>
                      </div>
                    </div>
                    <motion.button
                      className="rounded-xl border border-red-500/30 bg-red-500/20 px-6 py-3 font-semibold text-red-400 transition-all hover:bg-red-500/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      EMERGENCY STOP
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <motion.div
              key="privacy"
              className="grid grid-cols-12 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Security Overview */}
              <div className="col-span-12 lg:col-span-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="mb-5 flex items-center gap-2 font-semibold text-lg">
                    <Shield className="h-5 w-5 text-[#00f0ff]" />
                    Security Status
                  </h2>

                  <div className="py-6 text-center">
                    <motion.div
                      className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#00f0ff]/10"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Lock className="h-10 w-10 text-[#00f0ff]" />
                    </motion.div>
                    <h3 className="mb-1 font-semibold text-white text-xl">
                      Protected
                    </h3>
                    <p className="text-sm text-white/50">
                      All neural data encrypted
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    {[
                      {
                        label: "Encryption",
                        value: "AES-256-GCM",
                        status: "active",
                      },
                      {
                        label: "Key Exchange",
                        value: "ECDH P-384",
                        status: "active",
                      },
                      {
                        label: "Data at Rest",
                        value: "ChaCha20-Poly1305",
                        status: "active",
                      },
                      {
                        label: "Audit Logging",
                        value: "Enabled",
                        status: "active",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-lg bg-white/5 p-3"
                      >
                        <span className="text-sm text-white/60">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#00f0ff] text-xs">
                            {item.value}
                          </span>
                          <CheckCircle2 className="h-4 w-4 text-[#00f0ff]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Privacy Controls */}
              <div className="col-span-12 lg:col-span-8">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-semibold text-lg">Privacy Controls</h2>
                    <motion.button
                      onClick={() => setEncryptionEnabled(!encryptionEnabled)}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-all ${
                        encryptionEnabled
                          ? "border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]"
                          : "border border-white/10 bg-white/5 text-white/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {encryptionEnabled ? (
                        <>
                          <Lock className="h-4 w-4" />
                          Encryption On
                        </>
                      ) : (
                        <>
                          <Unlock className="h-4 w-4" />
                          Encryption Off
                        </>
                      )}
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {privacySettings.map((setting) => (
                      <motion.div
                        key={setting.id}
                        className={`rounded-xl border p-4 transition-all ${
                          setting.enabled
                            ? "border-[#00f0ff]/20 bg-[#00f0ff]/5"
                            : "border-white/10 bg-white/[0.02]"
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <h3 className="font-medium text-sm">
                                {setting.name}
                              </h3>
                              {setting.critical && (
                                <span className="rounded border border-red-500/30 bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-400">
                                  CRITICAL
                                </span>
                              )}
                            </div>
                            <p className="text-white/40 text-xs">
                              {setting.description}
                            </p>
                          </div>
                          <motion.button
                            onClick={() => togglePrivacySetting(setting.id)}
                            className={`relative h-6 w-12 rounded-full transition-colors ${
                              setting.enabled ? "bg-[#00f0ff]" : "bg-white/20"
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-lg"
                              animate={{
                                left: setting.enabled
                                  ? "calc(100% - 20px)"
                                  : "4px",
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Data Retention */}
                  <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <h3 className="mb-4 font-medium text-sm">
                      Data Retention Policy
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg bg-white/5 p-3">
                        <p className="text-white/40 text-xs">Raw Neural Data</p>
                        <p className="font-mono text-[#00f0ff] text-lg">
                          24 hours
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/5 p-3">
                        <p className="text-white/40 text-xs">
                          Training Records
                        </p>
                        <p className="font-mono text-[#ffd93d] text-lg">
                          90 days
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/5 p-3">
                        <p className="text-white/40 text-xs">
                          Aggregated Stats
                        </p>
                        <p className="font-mono text-[#6bcb77] text-lg">
                          1 year
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Export & Delete */}
                  <div className="mt-4 flex gap-3">
                    <motion.button
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-sm transition-all hover:bg-white/10"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="h-4 w-4" />
                      Export My Data
                    </motion.button>
                    <motion.button
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-3 font-medium text-red-400 text-sm transition-all hover:bg-red-500/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <AlertCircle className="h-4 w-4" />
                      Delete All Data
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
