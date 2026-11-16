import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  Clock,
  Cpu,
  FileKey,
  Globe,
  Key,
  Lock,
  MessageSquare,
  Network,
  RefreshCcw,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Signal,
  Terminal,
  Timer,
  Unlock,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type EncryptionAlgorithm =
  | "CRYSTALS-Kyber"
  | "CRYSTALS-Dilithium"
  | "SPHINCS+"
  | "FALCON"
  | "BIKE"
  | "HQC"
  | "Classic-McEliece"
  | "FrodoKEM";

export type SecurityLevel = "Level 1" | "Level 3" | "Level 5" | "AES-256";

export type ProtocolStatus =
  | "active"
  | "inactive"
  | "compromised"
  | "upgrading";

export type ThreatLevel = "low" | "medium" | "high" | "critical";

export type MessageStatus =
  | "encrypted"
  | "decrypted"
  | "verifying"
  | "delivered";

export interface QKDSession {
  id: string;
  name: string;
  status: "active" | "establishing" | "error" | "closed";
  keyRate: number;
  distance: number;
  errorRate: number;
  sessionKey: string;
  startTime: Date;
  lastKeyExchange: Date;
  totalKeysExchanged: number;
  securityLevel: SecurityLevel;
  quantumChannel: "fiber" | "satellite" | "free-space";
}

export interface EncryptionKey {
  id: string;
  name: string;
  algorithm: EncryptionAlgorithm;
  type: "public" | "private" | "shared";
  createdAt: Date;
  expiresAt: Date;
  status: "active" | "expired" | "revoked" | "scheduled-rotation";
  fingerprint: string;
  size: number;
  usageCount: number;
  lastUsed: Date | null;
  rotationDue: Date | null;
}

export interface SecurityProtocol {
  id: string;
  name: string;
  version: string;
  status: ProtocolStatus;
  description: string;
  lastUpdated: Date;
  coverage: number;
  vulnerabilities: number;
  compliance: string[];
}

export interface ThreatDetection {
  id: string;
  timestamp: Date;
  level: ThreatLevel;
  type: string;
  source: string;
  description: string;
  status: "active" | "mitigated" | "investigating";
  affectedSystems: string[];
  mitigation: string;
}

export interface SecureMessage {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  encryptedContent: string;
  status: MessageStatus;
  algorithm: EncryptionAlgorithm;
  timestamp: Date;
  keyId: string;
  quantumResistant: boolean;
}

interface QuantumSecureCommunicationsProps {
  userRole?: "admin" | "security-officer" | "user" | "auditor";
  organizationId?: string;
  onSendSecureMessage?: (
    message: Omit<SecureMessage, "id" | "timestamp" | "status">,
  ) => Promise<void>;
  onRotateKeys?: () => Promise<void>;
  onEnableProtocol?: (protocolId: string) => Promise<void>;
  onDisableProtocol?: (protocolId: string) => Promise<void>;
  onExportKeys?: (keyId: string) => Promise<string>;
  onDeleteKey?: (keyId: string) => Promise<void>;
}

export function QuantumSecureCommunications({
  userRole = "security-officer",
  organizationId = "ORG-001",
  onSendSecureMessage,
  onRotateKeys,
  onEnableProtocol,
  onDisableProtocol,
  onExportKeys,
  onDeleteKey,
}: QuantumSecureCommunicationsProps) {
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "qkd"
    | "encryption"
    | "protocols"
    | "threats"
    | "messaging"
    | "keys"
  >("dashboard");
  const [selectedQKDSession, setSelectedQKDSession] =
    useState<QKDSession | null>(null);
  const [selectedKey, setSelectedKey] = useState<EncryptionKey | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showKeyRotationModal, setShowKeyRotationModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAlgorithm, setFilterAlgorithm] = useState<
    EncryptionAlgorithm | "all"
  >("all");
  const [isAnimatingQKD, setIsAnimatingQKD] = useState(false);
  const [qkdProgress, setQkdProgress] = useState(0);

  // Mock data states
  const [qkdSessions, setQkdSessions] = useState<QKDSession[]>([
    {
      id: "QKD-001",
      name: "Main Campus - HQ",
      status: "active",
      keyRate: 1250,
      distance: 12.5,
      errorRate: 0.002,
      sessionKey: "0x8f4a...b2c1",
      startTime: new Date(Date.now() - 86400000 * 7),
      lastKeyExchange: new Date(Date.now() - 300000),
      totalKeysExchanged: 456789,
      securityLevel: "Level 5",
      quantumChannel: "fiber",
    },
    {
      id: "QKD-002",
      name: "Satellite Uplink Alpha",
      status: "active",
      keyRate: 890,
      distance: 1200,
      errorRate: 0.008,
      sessionKey: "0x7e3d...a9f2",
      startTime: new Date(Date.now() - 86400000 * 3),
      lastKeyExchange: new Date(Date.now() - 180000),
      totalKeysExchanged: 234567,
      securityLevel: "Level 3",
      quantumChannel: "satellite",
    },
    {
      id: "QKD-003",
      name: "Research Lab - Dr. Chen",
      status: "establishing",
      keyRate: 0,
      distance: 2.3,
      errorRate: 0,
      sessionKey: "pending...",
      startTime: new Date(Date.now() - 120000),
      lastKeyExchange: new Date(),
      totalKeysExchanged: 0,
      securityLevel: "Level 5",
      quantumChannel: "fiber",
    },
  ]);

  const [encryptionKeys, setEncryptionKeys] = useState<EncryptionKey[]>([
    {
      id: "KEY-001",
      name: "Primary Kyber Key",
      algorithm: "CRYSTALS-Kyber",
      type: "public",
      createdAt: new Date(Date.now() - 2592000000),
      expiresAt: new Date(Date.now() + 5184000000),
      status: "active",
      fingerprint: "SHA256:8f4a...b2c1",
      size: 1568,
      usageCount: 12345,
      lastUsed: new Date(Date.now() - 3600000),
      rotationDue: new Date(Date.now() + 432000000),
    },
    {
      id: "KEY-002",
      name: "Backup Dilithium Signature",
      algorithm: "CRYSTALS-Dilithium",
      type: "private",
      createdAt: new Date(Date.now() - 15552000000),
      expiresAt: new Date(Date.now() + 10368000000),
      status: "active",
      fingerprint: "SHA256:7e3d...a9f2",
      size: 2528,
      usageCount: 8921,
      lastUsed: new Date(Date.now() - 7200000),
      rotationDue: new Date(Date.now() + 2592000000),
    },
    {
      id: "KEY-003",
      name: "Legacy RSA Key",
      algorithm: "CRYSTALS-Kyber",
      type: "public",
      createdAt: new Date(Date.now() - 31536000000),
      expiresAt: new Date(Date.now() - 86400000 * 30),
      status: "expired",
      fingerprint: "SHA256:6c2b...d8e3",
      size: 2048,
      usageCount: 45678,
      lastUsed: new Date(Date.now() - 86400000),
      rotationDue: null,
    },
    {
      id: "KEY-004",
      name: "Emergency SPHINCS+ Key",
      algorithm: "SPHINCS+",
      type: "public",
      createdAt: new Date(Date.now() - 604800000),
      expiresAt: new Date(Date.now() + 7776000000),
      status: "active",
      fingerprint: "SHA256:5a1c...f7g4",
      size: 496,
      usageCount: 123,
      lastUsed: new Date(Date.now() - 86400000),
      rotationDue: new Date(Date.now() + 6912000000),
    },
  ]);

  const [securityProtocols, setSecurityProtocols] = useState<
    SecurityProtocol[]
  >([
    {
      id: "PROTO-001",
      name: "NIST PQC Standard Suite",
      version: "v3.2",
      status: "active",
      description: "Post-quantum cryptographic algorithms approved by NIST",
      lastUpdated: new Date(Date.now() - 2592000000),
      coverage: 98,
      vulnerabilities: 0,
      compliance: ["FIPS 203", "FIPS 204", "FIPS 205"],
    },
    {
      id: "PROTO-002",
      name: "Quantum Key Distribution Protocol",
      version: "v2.1",
      status: "active",
      description: "BB84 and E91 protocols for quantum key exchange",
      lastUpdated: new Date(Date.now() - 1209600000),
      coverage: 95,
      vulnerabilities: 0,
      compliance: ["ITU-T Y.3800", "ETSI GS QKD 014"],
    },
    {
      id: "PROTO-003",
      name: "Zero-Trust Architecture",
      version: "v1.5",
      status: "upgrading",
      description: "Never trust, always verify security model",
      lastUpdated: new Date(Date.now() - 604800000),
      coverage: 87,
      vulnerabilities: 2,
      compliance: ["NIST SP 800-207"],
    },
    {
      id: "PROTO-004",
      name: "Homomorphic Encryption Layer",
      version: "v1.0",
      status: "active",
      description: "Computation on encrypted data without decryption",
      lastUpdated: new Date(Date.now() - 432000000),
      coverage: 72,
      vulnerabilities: 1,
      compliance: ["ISO/IEC 18033"],
    },
  ]);

  const [threats, setThreats] = useState<ThreatDetection[]>([
    {
      id: "THREAT-001",
      timestamp: new Date(Date.now() - 3600000),
      level: "medium",
      type: "Side-Channel Analysis",
      source: "External IP: 192.168.45.67",
      description: "Potential timing attack detected on encryption endpoints",
      status: "mitigated",
      affectedSystems: ["Gateway-A", "Key-Server-02"],
      mitigation: "Countermeasures deployed, additional noise added",
    },
    {
      id: "THREAT-002",
      timestamp: new Date(Date.now() - 7200000),
      level: "low",
      type: "Quantum Interference",
      source: "Satellite Link Alpha",
      description: "Slight photon loss anomaly detected in QKD channel",
      status: "investigating",
      affectedSystems: ["QKD-Satellite-Alpha"],
      mitigation: "Channel diagnostics in progress",
    },
    {
      id: "THREAT-003",
      timestamp: new Date(Date.now() - 86400000),
      level: "high",
      type: "Man-in-the-Middle Attempt",
      source: "Network Node: Router-15",
      description: "Suspicious certificate injection attempt blocked",
      status: "mitigated",
      affectedSystems: ["Router-15", "Firewall-Cluster-3"],
      mitigation: "Automatic key rotation triggered, incident logged",
    },
  ]);

  const [secureMessages, setSecureMessages] = useState<SecureMessage[]>([
    {
      id: "MSG-001",
      sender: "Dr. Sarah Chen",
      recipient: "Security Team",
      subject: "QKD Session Setup",
      content: "New quantum secure channel established for the research lab.",
      encryptedContent: "🔐 [Quantum Encrypted Content]",
      status: "delivered",
      algorithm: "CRYSTALS-Kyber",
      timestamp: new Date(Date.now() - 1800000),
      keyId: "KEY-001",
      quantumResistant: true,
    },
    {
      id: "MSG-002",
      sender: "Admin System",
      recipient: "Dr. Sarah Chen",
      subject: "Key Rotation Alert",
      content: "Automatic key rotation completed. New keys are active.",
      encryptedContent: "🔐 [Quantum Encrypted Content]",
      status: "encrypted",
      algorithm: "CRYSTALS-Dilithium",
      timestamp: new Date(Date.now() - 7200000),
      keyId: "KEY-002",
      quantumResistant: true,
    },
    {
      id: "MSG-003",
      sender: "Threat Detection",
      recipient: "Security Team",
      subject: "Alert: Potential Interference",
      content:
        "Unusual quantum channel interference detected on satellite link.",
      encryptedContent: "🔐 [Quantum Encrypted Content]",
      status: "verifying",
      algorithm: "SPHINCS+",
      timestamp: new Date(Date.now() - 3600000),
      keyId: "KEY-004",
      quantumResistant: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState({
    recipient: "",
    subject: "",
    content: "",
    algorithm: "CRYSTALS-Kyber" as EncryptionAlgorithm,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // QKD Animation Effect
  useEffect(() => {
    if (isAnimatingQKD && activeTab === "qkd") {
      const interval = setInterval(() => {
        setQkdProgress((prev) => {
          if (prev >= 100) {
            setIsAnimatingQKD(false);
            return 0;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAnimatingQKD, activeTab]);

  // Canvas visualization for quantum bits
  useEffect(() => {
    if (activeTab === "qkd" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const particles: {
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
        size: number;
      }[] = [];
      const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];

      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 1,
        });
      }

      let animationId: number;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Draw connections
          particles.forEach((p2, j) => {
            if (i !== j) {
              const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
              if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(59, 130, 246, ${1 - dist / 100})`;
                ctx.stroke();
              }
            }
          });
        });

        animationId = requestAnimationFrame(animate);
      };

      animate();

      return () => cancelAnimationFrame(animationId);
    }
  }, [activeTab]);

  const algorithmColors: Record<EncryptionAlgorithm, string> = {
    "CRYSTALS-Kyber": "bg-blue-100 text-blue-700 border-blue-200",
    "CRYSTALS-Dilithium": "bg-purple-100 text-purple-700 border-purple-200",
    "SPHINCS+": "bg-green-100 text-green-700 border-green-200",
    FALCON: "bg-amber-100 text-amber-700 border-amber-200",
    BIKE: "bg-pink-100 text-pink-700 border-pink-200",
    HQC: "bg-indigo-100 text-indigo-700 border-indigo-200",
    "Classic-McEliece": "bg-teal-100 text-teal-700 border-teal-200",
    FrodoKEM: "bg-cyan-100 text-cyan-700 border-cyan-200",
  };

  const threatLevelColors: Record<ThreatLevel, string> = {
    low: "bg-blue-100 text-blue-700 border-blue-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    critical: "bg-red-100 text-red-700 border-red-200",
  };

  const protocolStatusColors: Record<ProtocolStatus, string> = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    inactive: "bg-gray-100 text-gray-700 border-gray-200",
    compromised: "bg-red-100 text-red-700 border-red-200",
    upgrading: "bg-amber-100 text-amber-700 border-amber-200",
  };

  const qkdStatusColors: Record<QKDSession["status"], string> = {
    active: "bg-emerald-500",
    establishing: "bg-amber-500 animate-pulse",
    error: "bg-red-500",
    closed: "bg-gray-400",
  };

  const keyStatusColors: Record<EncryptionKey["status"], string> = {
    active: "bg-emerald-100 text-emerald-700",
    expired: "bg-gray-100 text-gray-700",
    revoked: "bg-red-100 text-red-700",
    "scheduled-rotation": "bg-amber-100 text-amber-700",
  };

  const filteredKeys = encryptionKeys.filter((key) => {
    const matchesSearch =
      key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.fingerprint.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAlgorithm =
      filterAlgorithm === "all" || key.algorithm === filterAlgorithm;
    return matchesSearch && matchesAlgorithm;
  });

  const handleSendMessage = async () => {
    if (onSendSecureMessage) {
      await onSendSecureMessage({
        sender: "Current User",
        recipient: newMessage.recipient,
        subject: newMessage.subject,
        content: newMessage.content,
        encryptedContent: "🔐 [Encrypting...]",
        algorithm: newMessage.algorithm,
        keyId: "KEY-NEW",
        quantumResistant: true,
      });
    }

    const newMsg: SecureMessage = {
      id: `MSG-${Date.now()}`,
      sender: "Current User",
      recipient: newMessage.recipient,
      subject: newMessage.subject,
      content: newMessage.content,
      encryptedContent: "🔐 [Quantum Encrypted Content]",
      status: "encrypted",
      algorithm: newMessage.algorithm,
      timestamp: new Date(),
      keyId: `KEY-${Date.now()}`,
      quantumResistant: true,
    };

    setSecureMessages((prev) => [newMsg, ...prev]);
    setNewMessage({
      recipient: "",
      subject: "",
      content: "",
      algorithm: "CRYSTALS-Kyber",
    });
    setShowNewMessageModal(false);
  };

  const handleRotateKeys = async () => {
    if (onRotateKeys) {
      await onRotateKeys();
    }
    // Simulate key rotation
    setEncryptionKeys((prev) =>
      prev.map((key) => ({
        ...key,
        status: key.status === "expired" ? "revoked" : key.status,
      })),
    );
    setShowKeyRotationModal(false);
  };

  const handleQKDSimulation = () => {
    setIsAnimatingQKD(true);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 text-[var(--foreground)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-lg">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="-top-1 -right-1 absolute h-4 w-4 rounded-full border-2 border-white bg-emerald-500"
              />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text font-bold text-3xl text-transparent">
                Quantum-Secure Communications
              </h1>
              <p className="mt-1 flex items-center gap-2 text-[var(--muted-foreground)]">
                <Zap className="h-4 w-4 text-amber-500" />
                Post-Quantum Cryptography & Quantum Key Distribution
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-100 px-4 py-2 text-emerald-700">
              <Activity className="h-4 w-4" />
              <span className="font-medium">System Secure</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 text-blue-700">
              <Globe className="h-4 w-4" />
              <span className="font-medium">{organizationId}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid grid-cols-6 gap-4"
      >
        {[
          {
            label: "Active QKD Sessions",
            value: qkdSessions.filter((s) => s.status === "active").length,
            icon: Network,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Encryption Keys",
            value: encryptionKeys.filter((k) => k.status === "active").length,
            icon: Key,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Secure Messages",
            value: secureMessages.length,
            icon: MessageSquare,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Active Threats",
            value: threats.filter(
              (t) => t.status === "active" || t.status === "investigating",
            ).length,
            icon: ShieldAlert,
            color: "text-red-600",
            bg: "bg-red-50",
          },
          {
            label: "Security Protocols",
            value: securityProtocols.filter((p) => p.status === "active")
              .length,
            icon: Shield,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Keys Exchanged",
            value: qkdSessions
              .reduce((acc, s) => acc + s.totalKeysExchanged, 0)
              .toLocaleString(),
            icon: ArrowLeftRight,
            color: "text-cyan-600",
            bg: "bg-cyan-50",
          },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`h-10 w-10 ${stat.bg} ${stat.color} mb-3 flex items-center justify-center rounded-lg`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="font-bold text-2xl text-[var(--foreground)]">
              {stat.value}
            </p>
            <p className="text-[var(--muted-foreground)] text-sm">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-1"
      >
        {[
          { id: "dashboard", label: "Dashboard", icon: Activity },
          { id: "qkd", label: "QKD Sessions", icon: Network },
          { id: "encryption", label: "Encryption", icon: Lock },
          { id: "protocols", label: "Protocols", icon: Shield },
          { id: "threats", label: "Threat Detection", icon: AlertTriangle },
          { id: "messaging", label: "Secure Messaging", icon: MessageSquare },
          { id: "keys", label: "Key Management", icon: Key },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Encryption Status */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-[var(--foreground)] text-lg">
                <Lock className="h-5 w-5 text-blue-600" />
                Post-Quantum Algorithm Status
              </h3>
              <div className="space-y-4">
                {Object.entries(algorithmColors).map(([algorithm, color]) => {
                  const activeKeys = encryptionKeys.filter(
                    (k) => k.algorithm === algorithm && k.status === "active",
                  ).length;
                  const totalKeys = encryptionKeys.filter(
                    (k) => k.algorithm === algorithm,
                  ).length;
                  const percentage =
                    totalKeys > 0 ? (activeKeys / totalKeys) * 100 : 0;
                  return (
                    <div key={algorithm} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${color}`}
                          >
                            {algorithm}
                          </span>
                          <span className="text-[var(--muted-foreground)] text-sm">
                            {activeKeys} active
                          </span>
                        </div>
                        <span className="font-medium text-[var(--foreground)] text-sm">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full rounded-full ${color.split(" ")[0].replace("bg-", "bg-").replace("100", "500")}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-[var(--foreground)] text-lg">
                <Signal className="h-5 w-5 text-purple-600" />
                QKD Channel Status
              </h3>
              <div className="space-y-4">
                {qkdSessions.map((session, idx) => (
                  <div
                    key={session.id}
                    className="rounded-lg bg-[var(--muted)] p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${qkdStatusColors[session.status]}`}
                        />
                        <span className="font-medium text-[var(--foreground)]">
                          {session.name}
                        </span>
                      </div>
                      <span className="text-[var(--muted-foreground)] text-xs">
                        {session.securityLevel}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-[var(--muted-foreground)]">
                        Key Rate:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {session.keyRate} kbps
                        </span>
                      </div>
                      <div className="text-[var(--muted-foreground)]">
                        Distance:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {session.distance} km
                        </span>
                      </div>
                      <div className="text-[var(--muted-foreground)]">
                        Error:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {(session.errorRate * 100).toFixed(3)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-[var(--foreground)] text-lg">
              <Clock className="h-5 w-5 text-emerald-600" />
              Recent Security Activity
            </h3>
            <div className="space-y-3">
              {[
                ...secureMessages,
                ...threats.map((t) => ({ ...t, type: "threat" as const })),
              ]
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime(),
                )
                .slice(0, 5)
                .map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 rounded-lg bg-[var(--muted)] p-3"
                  >
                    {"type" in item && item.type === "threat" ? (
                      <>
                        <ShieldAlert className="h-5 w-5 text-red-500" />
                        <div className="flex-1">
                          <p className="font-medium text-[var(--foreground)]">
                            Security Alert: {item.type}
                          </p>
                          <p className="text-[var(--muted-foreground)] text-sm">
                            {item.description}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${threatLevelColors[item.level]}`}
                        >
                          {item.level.toUpperCase()}
                        </span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium text-[var(--foreground)]">
                            {(item as SecureMessage).subject}
                          </p>
                          <p className="text-[var(--muted-foreground)] text-sm">
                            From {(item as SecureMessage).sender} to{" "}
                            {(item as SecureMessage).recipient}
                          </p>
                        </div>
                        <span className="text-[var(--muted-foreground)] text-xs">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* QKD Sessions Tab */}
      {activeTab === "qkd" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--foreground)] text-xl">
              Quantum Key Distribution Sessions
            </h2>
            <button
              onClick={handleQKDSimulation}
              disabled={isAnimatingQKD}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isAnimatingQKD ? "animate-spin" : ""}`}
              />
              {isAnimatingQKD
                ? "Establishing Connection..."
                : "Simulate QKD Exchange"}
            </button>
          </div>

          {isAnimatingQKD && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6"
            >
              <h3 className="mb-4 font-semibold text-lg">
                QKD Key Exchange in Progress
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">
                    Photon Exchange
                  </span>
                  <span className="font-medium">{qkdProgress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[var(--muted)]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${qkdProgress}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)]">
                      Base Reconciliation
                    </p>
                    <p className="font-medium text-[var(--foreground)]">
                      {Math.floor(qkdProgress * 0.8)}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)]">
                      Privacy Amplification
                    </p>
                    <p className="font-medium text-[var(--foreground)]">
                      {Math.floor(qkdProgress * 0.6)}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)]">
                      Error Correction
                    </p>
                    <p className="font-medium text-[var(--foreground)]">
                      {Math.floor(qkdProgress * 0.9)}%
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {qkdSessions.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedQKDSession(session)}
                className="group cursor-pointer rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 ${qkdStatusColors[session.status]} flex items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <Network className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--foreground)]">
                        {session.name}
                      </h3>
                      <p className="text-[var(--muted-foreground)] text-sm">
                        {session.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${session.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {session.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)] text-xs">
                      Key Rate
                    </p>
                    <p className="font-bold text-[var(--foreground)] text-lg">
                      {session.keyRate.toLocaleString()}{" "}
                      <span className="font-normal text-sm">kbps</span>
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)] text-xs">
                      Distance
                    </p>
                    <p className="font-bold text-[var(--foreground)] text-lg">
                      {session.distance}{" "}
                      <span className="font-normal text-sm">km</span>
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)] text-xs">
                      Error Rate
                    </p>
                    <p className="font-bold text-[var(--foreground)] text-lg">
                      {(session.errorRate * 100).toFixed(3)}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)] text-xs">
                      Total Keys
                    </p>
                    <p className="font-bold text-[var(--foreground)] text-lg">
                      {session.totalKeysExchanged.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--muted-foreground)]">
                      Channel:
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 text-xs capitalize">
                      {session.quantumChannel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-purple-700">
                      {session.securityLevel}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quantum Visualization */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-[var(--foreground)] text-lg">
              <Cpu className="h-5 w-5 text-purple-600" />
              Quantum Bit Visualization
            </h3>
            <canvas
              ref={canvasRef}
              width={800}
              height={300}
              className="h-[300px] w-full rounded-lg bg-gradient-to-br from-slate-900 to-slate-800"
            />
            <p className="mt-2 text-[var(--muted-foreground)] text-sm">
              Real-time visualization of quantum entanglement and photon states
              during key distribution
            </p>
          </div>
        </motion.div>
      )}

      {/* Encryption Tab */}
      {activeTab === "encryption" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(algorithmColors).map(([algorithm, color], idx) => (
              <motion.div
                key={algorithm}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm"
              >
                <div
                  className={`h-10 w-10 ${color.split(" ")[0]} mb-3 flex items-center justify-center rounded-lg`}
                >
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-1 font-semibold text-[var(--foreground)] text-sm">
                  {algorithm}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${color}`}>
                    {
                      encryptionKeys.filter(
                        (k) =>
                          k.algorithm === algorithm && k.status === "active",
                      ).length
                    }{" "}
                    Active
                  </span>
                </div>
                <p className="mt-2 text-[var(--muted-foreground)] text-xs">
                  {algorithm === "CRYSTALS-Kyber" &&
                    "Lattice-based KEM for key encapsulation"}
                  {algorithm === "CRYSTALS-Dilithium" &&
                    "Lattice-based digital signatures"}
                  {algorithm === "SPHINCS+" && "Hash-based signature scheme"}
                  {algorithm === "FALCON" && "Fast lattice-based signatures"}
                  {algorithm === "BIKE" && "Bit-flipping key encapsulation"}
                  {algorithm === "HQC" && "Hamming quasi-cyclic codes"}
                  {algorithm === "Classic-McEliece" && "Code-based encryption"}
                  {algorithm === "FrodoKEM" && "Learning with errors scheme"}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-[var(--foreground)] text-lg">
              <Terminal className="h-5 w-5 text-indigo-600" />
              Encryption Algorithm Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-[var(--border)] border-b">
                    <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)] text-sm">
                      Algorithm
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)] text-sm">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)] text-sm">
                      Security Level
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)] text-sm">
                      Key Size
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)] text-sm">
                      Performance
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)] text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      alg: "CRYSTALS-Kyber",
                      type: "KEM",
                      level: "NIST Level 5",
                      size: "1,568 - 3,168 bytes",
                      perf: "Fast",
                      status: "Standardized",
                    },
                    {
                      alg: "CRYSTALS-Dilithium",
                      type: "Signature",
                      level: "NIST Level 3",
                      size: "2,420 - 4,595 bytes",
                      perf: "Fast",
                      status: "Standardized",
                    },
                    {
                      alg: "SPHINCS+",
                      type: "Signature",
                      level: "NIST Level 5",
                      size: "8,056 - 49,216 bytes",
                      perf: "Moderate",
                      status: "Standardized",
                    },
                    {
                      alg: "FALCON",
                      type: "Signature",
                      level: "NIST Level 5",
                      size: "1,281 - 2,565 bytes",
                      perf: "Very Fast",
                      status: "Standardized",
                    },
                    {
                      alg: "Classic-McEliece",
                      type: "KEM",
                      level: "NIST Level 5",
                      size: "1,280,639 bytes",
                      perf: "Slow",
                      status: "Alternative",
                    },
                    {
                      alg: "BIKE",
                      type: "KEM",
                      level: "NIST Level 5",
                      size: "2,771 - 5,469 bytes",
                      perf: "Fast",
                      status: "Alternative",
                    },
                    {
                      alg: "HQC",
                      type: "KEM",
                      level: "NIST Level 5",
                      size: "2,249 - 7,245 bytes",
                      perf: "Moderate",
                      status: "Alternative",
                    },
                  ].map((row, idx) => (
                    <motion.tr
                      key={row.alg}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-[var(--border)] border-b transition-colors hover:bg-[var(--muted)]"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${algorithmColors[row.alg as EncryptionAlgorithm] || "bg-gray-100 text-gray-700"}`}
                        >
                          {row.alg}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--foreground)] text-sm">
                        {row.type}
                      </td>
                      <td className="px-4 py-3 text-[var(--foreground)] text-sm">
                        {row.level}
                      </td>
                      <td className="px-4 py-3 font-mono text-[var(--foreground)] text-sm">
                        {row.size}
                      </td>
                      <td className="px-4 py-3 text-[var(--foreground)] text-sm">
                        {row.perf}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${row.status === "Standardized" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Protocols Tab */}
      {activeTab === "protocols" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {securityProtocols.map((protocol, idx) => (
            <motion.div
              key={protocol.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-12 w-12 ${protocolStatusColors[protocol.status].split(" ")[0]} flex items-center justify-center rounded-xl`}
                  >
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="font-semibold text-[var(--foreground)]">
                        {protocol.name}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${protocolStatusColors[protocol.status]}`}
                      >
                        {protocol.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mb-2 text-[var(--muted-foreground)] text-sm">
                      {protocol.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-[var(--muted-foreground)]">
                        Version:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {protocol.version}
                        </span>
                      </span>
                      <span className="text-[var(--muted-foreground)]">
                        Last Updated:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {protocol.lastUpdated.toLocaleDateString()}
                        </span>
                      </span>
                      <span className="text-[var(--muted-foreground)]">
                        Coverage:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {protocol.coverage}%
                        </span>
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {protocol.compliance.map((standard) => (
                        <span
                          key={standard}
                          className="rounded-full bg-indigo-100 px-2 py-1 text-indigo-700 text-xs"
                        >
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {userRole === "admin" && (
                    <>
                      {protocol.status === "active" ? (
                        <button
                          onClick={() => onDisableProtocol?.(protocol.id)}
                          className="rounded-lg border border-red-300 px-3 py-1.5 text-red-600 text-sm transition-colors hover:bg-red-50"
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          onClick={() => onEnableProtocol?.(protocol.id)}
                          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-emerald-600"
                        >
                          Enable
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Threats Tab */}
      {activeTab === "threats" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="mb-6 grid grid-cols-4 gap-4">
            {[
              {
                level: "low",
                count: threats.filter(
                  (t) => t.level === "low" && t.status !== "mitigated",
                ).length,
                color: "blue",
              },
              {
                level: "medium",
                count: threats.filter(
                  (t) => t.level === "medium" && t.status !== "mitigated",
                ).length,
                color: "amber",
              },
              {
                level: "high",
                count: threats.filter(
                  (t) => t.level === "high" && t.status !== "mitigated",
                ).length,
                color: "orange",
              },
              {
                level: "critical",
                count: threats.filter(
                  (t) => t.level === "critical" && t.status !== "mitigated",
                ).length,
                color: "red",
              },
            ].map((stat) => (
              <div
                key={stat.level}
                className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-xl p-4`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-${stat.color}-700 font-semibold capitalize`}
                  >
                    {stat.level}
                  </span>
                  <AlertTriangle className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
                <p className="mt-2 font-bold text-3xl text-[var(--foreground)]">
                  {stat.count}
                </p>
                <p className="text-[var(--muted-foreground)] text-sm">
                  Active Threats
                </p>
              </div>
            ))}
          </div>

          {threats.map((threat, idx) => (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`border bg-[var(--card)] ${threat.level === "critical" ? "border-red-300" : "border-[var(--card-border)]"} rounded-xl p-6 shadow-sm`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-12 w-12 ${threatLevelColors[threat.level].split(" ")[0]} flex items-center justify-center rounded-xl`}
                  >
                    {threat.level === "critical" ? (
                      <ShieldAlert className="h-6 w-6 text-white" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="font-semibold text-[var(--foreground)]">
                        {threat.type}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${threatLevelColors[threat.level]}`}
                      >
                        {threat.level.toUpperCase()}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          threat.status === "mitigated"
                            ? "bg-emerald-100 text-emerald-700"
                            : threat.status === "investigating"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {threat.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mb-2 text-[var(--muted-foreground)] text-sm">
                      {threat.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-[var(--muted-foreground)]">
                        Source:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {threat.source}
                        </span>
                      </span>
                      <span className="text-[var(--muted-foreground)]">
                        Detected:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {threat.timestamp.toLocaleString()}
                        </span>
                      </span>
                    </div>
                    {threat.affectedSystems.length > 0 && (
                      <div className="mt-2">
                        <span className="text-[var(--muted-foreground)] text-xs">
                          Affected Systems:
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {threat.affectedSystems.map((sys) => (
                            <span
                              key={sys}
                              className="rounded-full bg-red-100 px-2 py-0.5 text-red-700 text-xs"
                            >
                              {sys}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {threat.mitigation && (
                      <div className="mt-3 rounded-lg bg-[var(--muted)] p-3">
                        <p className="text-[var(--muted-foreground)] text-xs">
                          Mitigation Action:
                        </p>
                        <p className="text-[var(--foreground)] text-sm">
                          {threat.mitigation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Messaging Tab */}
      {activeTab === "messaging" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--foreground)] text-xl">
              Secure Message Center
            </h2>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white transition-opacity hover:opacity-90"
            >
              <Send className="h-4 w-4" />
              New Secure Message
            </button>
          </div>

          <div className="space-y-4">
            {secureMessages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`h-12 w-12 ${message.quantumResistant ? "bg-emerald-500" : "bg-blue-500"} flex flex-shrink-0 items-center justify-center rounded-xl`}
                  >
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="truncate font-semibold text-[var(--foreground)]">
                        {message.subject}
                      </h3>
                      <span className="text-[var(--muted-foreground)] text-xs">
                        {message.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-2 flex items-center gap-4 text-[var(--muted-foreground)] text-sm">
                      <span>
                        From:{" "}
                        <span className="text-[var(--foreground)]">
                          {message.sender}
                        </span>
                      </span>
                      <span>
                        To:{" "}
                        <span className="text-[var(--foreground)]">
                          {message.recipient}
                        </span>
                      </span>
                    </div>
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${algorithmColors[message.algorithm]}`}
                      >
                        {message.algorithm}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          message.status === "delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : message.status === "encrypted"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {message.status.toUpperCase()}
                      </span>
                      {message.quantumResistant && (
                        <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-purple-700 text-xs">
                          <Shield className="h-3 w-3" />
                          Quantum-Resistant
                        </span>
                      )}
                    </div>
                    <p className="rounded-lg bg-[var(--muted)] p-3 font-mono text-[var(--muted-foreground)] text-sm">
                      {message.encryptedContent}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Key Management Tab */}
      {activeTab === "keys" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search keys..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] py-2 pr-4 pl-10 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterAlgorithm}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilterAlgorithm(e.target.value as any)
                }
                className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Algorithms</option>
                {Object.keys(algorithmColors).map((alg) => (
                  <option key={alg} value={alg}>
                    {alg}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowKeyRotationModal(true)}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-white transition-colors hover:bg-amber-600"
              >
                <RefreshCcw className="h-4 w-4" />
                Rotate Keys
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredKeys.map((key, idx) => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedKey(key)}
                className="cursor-pointer rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-12 ${keyStatusColors[key.status].split(" ")[0]} flex items-center justify-center rounded-xl`}
                    >
                      {key.type === "public" ? (
                        <Unlock className="h-6 w-6 text-white" />
                      ) : (
                        <Lock className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-3">
                        <h3 className="font-semibold text-[var(--foreground)]">
                          {key.name}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${keyStatusColors[key.status]}`}
                        >
                          {key.status.replace("-", " ").toUpperCase()}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${algorithmColors[key.algorithm]}`}
                        >
                          {key.algorithm}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[var(--muted-foreground)] text-xs">
                        <span>
                          ID:{" "}
                          <span className="font-medium text-[var(--foreground)]">
                            {key.id}
                          </span>
                        </span>
                        <span>
                          Size:{" "}
                          <span className="font-medium text-[var(--foreground)]">
                            {key.size} bytes
                          </span>
                        </span>
                        <span>
                          Type:{" "}
                          <span className="font-medium text-[var(--foreground)] capitalize">
                            {key.type}
                          </span>
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-[var(--muted-foreground)] text-xs">
                        <span>
                          Created:{" "}
                          <span className="font-medium text-[var(--foreground)]">
                            {key.createdAt.toLocaleDateString()}
                          </span>
                        </span>
                        <span>
                          Expires:{" "}
                          <span className="font-medium text-[var(--foreground)]">
                            {key.expiresAt.toLocaleDateString()}
                          </span>
                        </span>
                        <span>
                          Usage:{" "}
                          <span className="font-medium text-[var(--foreground)]">
                            {key.usageCount.toLocaleString()}
                          </span>
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-[var(--muted-foreground)] text-xs">
                        {key.fingerprint}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {key.rotationDue && (
                      <div className="flex items-center gap-1 text-amber-600 text-xs">
                        <Timer className="h-3 w-3" />
                        Rotation due: {key.rotationDue.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showNewMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowNewMessageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[var(--card)] shadow-2xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="border-[var(--card-border)] border-b p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[var(--foreground)] text-xl">
                    New Secure Message
                  </h3>
                  <button
                    onClick={() => setShowNewMessageModal(false)}
                    className="rounded-full p-2 transition-colors hover:bg-[var(--muted)]"
                  >
                    <XCircle className="h-5 w-5 text-[var(--muted-foreground)]" />
                  </button>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <label className="mb-2 block font-medium text-[var(--foreground)] text-sm">
                    Recipient
                  </label>
                  <input
                    type="text"
                    value={newMessage.recipient}
                    onChange={(e) =>
                      setNewMessage({
                        ...newMessage,
                        recipient: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter recipient name or ID"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-medium text-[var(--foreground)] text-sm">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) =>
                      setNewMessage({ ...newMessage, subject: e.target.value })
                    }
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Message subject"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-medium text-[var(--foreground)] text-sm">
                    Encryption Algorithm
                  </label>
                  <select
                    value={newMessage.algorithm}
                    onChange={(e) =>
                      setNewMessage({
                        ...newMessage,
                        algorithm: e.target.value as EncryptionAlgorithm,
                      })
                    }
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.keys(algorithmColors).map((alg) => (
                      <option key={alg} value={alg}>
                        {alg}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block font-medium text-[var(--foreground)] text-sm">
                    Message Content
                  </label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) =>
                      setNewMessage({ ...newMessage, content: e.target.value })
                    }
                    rows={4}
                    className="w-full resize-none rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your secure message..."
                  />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm">
                    Message will be encrypted with post-quantum cryptography
                  </span>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={
                    !newMessage.recipient ||
                    !newMessage.subject ||
                    !newMessage.content
                  }
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Send className="mr-2 inline h-5 w-5" />
                  Send Secure Message
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showKeyRotationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowKeyRotationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-[var(--card)] shadow-2xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="border-[var(--card-border)] border-b p-6">
                <div className="flex items-center gap-3 text-amber-600">
                  <RefreshCcw className="h-6 w-6" />
                  <h3 className="font-bold text-[var(--foreground)] text-xl">
                    Key Rotation
                  </h3>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <p className="text-[var(--muted-foreground)]">
                  This will rotate all active encryption keys. New keys will be
                  generated and old keys will be marked for archival.
                </p>
                <div className="rounded-lg bg-amber-50 p-4">
                  <p className="text-amber-800 text-sm">
                    ⚠️ Key rotation may briefly interrupt secure communications.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowKeyRotationModal(false)}
                    className="flex-1 rounded-lg border border-[var(--card-border)] py-2 text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRotateKeys}
                    className="flex-1 rounded-lg bg-amber-500 py-2 text-white transition-colors hover:bg-amber-600"
                  >
                    Rotate Keys
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedKey(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-[var(--card)] shadow-2xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="border-[var(--card-border)] border-b p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[var(--foreground)] text-xl">
                    Key Details
                  </h3>
                  <button
                    onClick={() => setSelectedKey(null)}
                    className="rounded-full p-2 transition-colors hover:bg-[var(--muted)]"
                  >
                    <XCircle className="h-5 w-5 text-[var(--muted-foreground)]" />
                  </button>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`h-12 w-12 ${keyStatusColors[selectedKey.status].split(" ")[0]} flex items-center justify-center rounded-xl`}
                  >
                    <Key className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)]">
                      {selectedKey.name}
                    </h4>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${keyStatusColors[selectedKey.status]}`}
                    >
                      {selectedKey.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">
                      Algorithm:
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${algorithmColors[selectedKey.algorithm]}`}
                    >
                      {selectedKey.algorithm}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">
                      Type:
                    </span>
                    <span className="font-medium text-[var(--foreground)] capitalize">
                      {selectedKey.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">
                      Size:
                    </span>
                    <span className="font-medium text-[var(--foreground)]">
                      {selectedKey.size} bytes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">
                      Created:
                    </span>
                    <span className="font-medium text-[var(--foreground)]">
                      {selectedKey.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">
                      Expires:
                    </span>
                    <span className="font-medium text-[var(--foreground)]">
                      {selectedKey.expiresAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">
                      Usage Count:
                    </span>
                    <span className="font-medium text-[var(--foreground)]">
                      {selectedKey.usageCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-[var(--card-border)] border-t pt-3">
                    <span className="mb-1 block text-[var(--muted-foreground)]">
                      Fingerprint:
                    </span>
                    <code className="block rounded-lg bg-[var(--muted)] p-2 font-mono text-[var(--foreground)] text-xs">
                      {selectedKey.fingerprint}
                    </code>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => onExportKeys?.(selectedKey.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600"
                  >
                    <FileKey className="h-4 w-4" />
                    Export
                  </button>
                  {userRole === "admin" && (
                    <button
                      onClick={() => {
                        onDeleteKey?.(selectedKey.id);
                        setSelectedKey(null);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 py-2 text-red-600 transition-colors hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedQKDSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedQKDSession(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl bg-[var(--card)] shadow-2xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="border-[var(--card-border)] border-b p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[var(--foreground)] text-xl">
                    QKD Session Details
                  </h3>
                  <button
                    onClick={() => setSelectedQKDSession(null)}
                    className="rounded-full p-2 transition-colors hover:bg-[var(--muted)]"
                  >
                    <XCircle className="h-5 w-5 text-[var(--muted-foreground)]" />
                  </button>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`h-12 w-12 ${qkdStatusColors[selectedQKDSession.status]} flex items-center justify-center rounded-xl`}
                  >
                    <Network className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)]">
                      {selectedQKDSession.name}
                    </h4>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 text-xs">
                      {selectedQKDSession.id}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)] text-xs">
                      Status
                    </p>
                    <p className="font-semibold text-[var(--foreground)] capitalize">
                      {selectedQKDSession.status}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)] text-xs">
                      Security Level
                    </p>
                    <p className="font-semibold text-purple-600">
                      {selectedQKDSession.securityLevel}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)] text-xs">
                      Key Rate
                    </p>
                    <p className="font-semibold text-[var(--foreground)]">
                      {selectedQKDSession.keyRate.toLocaleString()} kbps
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)] text-xs">
                      Distance
                    </p>
                    <p className="font-semibold text-[var(--foreground)]">
                      {selectedQKDSession.distance} km
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)] text-xs">
                      Error Rate
                    </p>
                    <p className="font-semibold text-[var(--foreground)]">
                      {(selectedQKDSession.errorRate * 100).toFixed(3)}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--muted)] p-3">
                    <p className="text-[var(--muted-foreground)] text-xs">
                      Channel Type
                    </p>
                    <p className="font-semibold text-[var(--foreground)] capitalize">
                      {selectedQKDSession.quantumChannel}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-[var(--muted)] p-3">
                  <p className="mb-1 text-[var(--muted-foreground)] text-xs">
                    Current Session Key
                  </p>
                  <code className="font-mono text-[var(--foreground)] text-sm">
                    {selectedQKDSession.sessionKey}
                  </code>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">
                    Session Started:{" "}
                    {selectedQKDSession.startTime.toLocaleString()}
                  </span>
                  <span className="text-[var(--muted-foreground)]">
                    Total Keys:{" "}
                    {selectedQKDSession.totalKeysExchanged.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QuantumSecureCommunications;
