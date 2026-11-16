"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  CheckCircle,
  ChevronDown,
  FileCheck,
  Fingerprint,
  Globe,
  History,
  Key,
  QrCode,
  RefreshCw,
  ScanLine,
  Share2,
  Shield,
  UserCircle,
  Verified,
  X,
} from "lucide-react";
import { useState } from "react";

interface DID {
  id: string;
  type: string;
  status: "active" | "revoked" | "pending";
  createdAt: Date;
  lastUsed: Date;
  credentials: Credential[];
  devices: Device[];
  recovery: RecoveryContact[];
}

interface Credential {
  id: string;
  type: string;
  issuer: string;
  issuedAt: Date;
  expiresAt: Date;
  verified: boolean;
  claims: Record<string, string>;
}

interface Device {
  id: string;
  name: string;
  type: "mobile" | "desktop" | "hardware";
  trusted: boolean;
  lastSync: Date;
  publicKey: string;
}

interface RecoveryContact {
  id: string;
  type: "email" | "phone" | "social" | "guardian";
  value: string;
  verified: boolean;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: Date;
  status: "success" | "warning" | "error";
  details: string;
}

interface VerifierRequest {
  id: string;
  institution: string;
  requestedClaims: string[];
  status: "pending" | "approved" | "rejected";
  timestamp: Date;
}

const mockDIDs: DID[] = [
  {
    id: "did:ethr:0x1234...5678",
    type: "Student Identity",
    status: "active",
    createdAt: new Date("2024-01-15"),
    lastUsed: new Date(),
    credentials: [
      {
        id: "cred-1",
        type: "Academic Credential",
        issuer: "Cambridge University",
        issuedAt: new Date("2024-06-15"),
        expiresAt: new Date("2029-06-15"),
        verified: true,
        claims: {
          degree: "Bachelor of Science in Computer Science",
          grade: "First Class Honours",
          gpa: "3.8/4.0",
        },
      },
      {
        id: "cred-2",
        type: "Skills Badge",
        issuer: "Google Cloud",
        issuedAt: new Date("2024-03-10"),
        expiresAt: new Date("2027-03-10"),
        verified: true,
        claims: {
          skill: "Cloud Architecture",
          level: "Professional",
          certification: "Professional Cloud Architect",
        },
      },
    ],
    devices: [
      {
        id: "dev-1",
        name: "iPhone 15 Pro",
        type: "mobile",
        trusted: true,
        lastSync: new Date(),
        publicKey: "0xabc...xyz",
      },
      {
        id: "dev-2",
        name: "Ledger Nano X",
        type: "hardware",
        trusted: true,
        lastSync: new Date(Date.now() - 86400000),
        publicKey: "0xdef...uvw",
      },
    ],
    recovery: [
      {
        id: "rec-1",
        type: "email",
        value: "student@university.edu",
        verified: true,
      },
      {
        id: "rec-2",
        type: "guardian",
        value: "Parent Guardian",
        verified: true,
      },
    ],
  },
];

const mockActivity: ActivityLog[] = [
  {
    id: "1",
    action: "DID Created",
    timestamp: new Date(Date.now() - 86400000 * 30),
    status: "success",
    details: "New decentralized identity issued",
  },
  {
    id: "2",
    action: "Credential Verified",
    timestamp: new Date(Date.now() - 86400000 * 7),
    status: "success",
    details: "Academic credential verified by MIT",
  },
  {
    id: "3",
    action: "Identity Shared",
    timestamp: new Date(Date.now() - 86400000 * 2),
    status: "success",
    details: "Shared with Stanford Admissions",
  },
  {
    id: "4",
    action: "Recovery Attempt",
    timestamp: new Date(Date.now() - 3600000),
    status: "warning",
    details: "Recovery email verification pending",
  },
];

const mockRequests: VerifierRequest[] = [
  {
    id: "req-1",
    institution: "Google Recruiting",
    requestedClaims: ["Academic Credential", "Skills Badge"],
    status: "pending",
    timestamp: new Date(),
  },
  {
    id: "req-2",
    institution: "MIT Admissions",
    requestedClaims: ["Academic Credential"],
    status: "approved",
    timestamp: new Date(Date.now() - 86400000),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -5,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

export default function DecentralizedIdentityPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "credentials" | "devices" | "verifiers" | "activity"
  >("overview");
  const [selectedDID, setSelectedDID] = useState<DID>(mockDIDs[0]);
  const [expandedCredential, setExpandedCredential] = useState<string | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "success":
      case "approved":
        return "bg-emerald-500";
      case "pending":
      case "warning":
        return "bg-amber-500";
      case "revoked":
      case "error":
      case "rejected":
        return "bg-rose-500";
      default:
        return "bg-slate-500";
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <ScanLine className="h-4 w-4" />;
      case "hardware":
        return <Key className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-indigo-900/30 via-violet-900/20 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-cyan-900/20 via-blue-900/30 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -60, 0],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoOTksIDEwMiwgMjQxLCAwLjAzKSIvPjwvc3ZnPg==')] opacity-40" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 border-indigo-500/20 border-b bg-slate-900/50 px-8 py-6 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-indigo-500/30 shadow-lg"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Fingerprint className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <h1 className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text font-black text-3xl text-transparent tracking-tight">
                Decentralized Identity
              </h1>
              <p className="text-slate-400 text-sm">
                Self-sovereign identity • Verifiable credentials •
                Zero-knowledge proofs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQRModal(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-slate-300 backdrop-blur transition-all hover:border-slate-600 hover:text-slate-100"
            >
              <QrCode className="h-4 w-4" />
              <span className="font-medium text-sm">QR Share</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 font-semibold text-white shadow-indigo-500/30 shadow-lg"
            >
              <Shield className="h-4 w-4" />
              <span>Create DID</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-8 py-8">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="scrollbar-hide mb-8 flex gap-2 overflow-x-auto pb-2"
        >
          {[
            { id: "overview", label: "Overview", icon: UserCircle },
            { id: "credentials", label: "Credentials", icon: BadgeCheck },
            { id: "devices", label: "Devices", icon: ScanLine },
            { id: "verifiers", label: "Verifiers", icon: Share2 },
            { id: "activity", label: "Activity", icon: History },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 font-medium transition-all ${
                activeTab === tab.id
                  ? "border border-indigo-500/40 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-300"
                  : "border border-slate-700/40 bg-slate-800/40 text-slate-400 hover:border-slate-600/60 hover:text-slate-200"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Identity Card */}
            <motion.div
              variants={itemVariants}
              className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-8 backdrop-blur-xl"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500">
                    <Fingerprint className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-2xl text-slate-100">
                      {selectedDID.type}
                    </h2>
                    <p className="mt-1 font-mono text-slate-400 text-sm">
                      {selectedDID.id}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${getStatusColor(selectedDID.status)}`}
                      />
                      <span className="text-slate-300 text-sm capitalize">
                        {selectedDID.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200"
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4">
                  <p className="mb-1 text-slate-400 text-xs uppercase tracking-wider">
                    Created
                  </p>
                  <p className="font-semibold text-slate-100">
                    {selectedDID.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4">
                  <p className="mb-1 text-slate-400 text-xs uppercase tracking-wider">
                    Last Used
                  </p>
                  <p className="font-semibold text-slate-100">
                    {selectedDID.lastUsed.toLocaleDateString()}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4">
                  <p className="mb-1 text-slate-400 text-xs uppercase tracking-wider">
                    Credentials
                  </p>
                  <p className="font-semibold text-slate-100">
                    {selectedDID.credentials.length} active
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                {
                  label: "Total Credentials",
                  value: selectedDID.credentials.length,
                  icon: BadgeCheck,
                  color: "from-indigo-500 to-violet-500",
                },
                {
                  label: "Trusted Devices",
                  value: selectedDID.devices.filter((d) => d.trusted).length,
                  icon: ScanLine,
                  color: "from-violet-500 to-fuchsia-500",
                },
                {
                  label: "Recovery Methods",
                  value: selectedDID.recovery.length,
                  icon: Shield,
                  color: "from-fuchsia-500 to-rose-500",
                },
                {
                  label: "Pending Verifiers",
                  value: mockRequests.filter((r) => r.status === "pending")
                    .length,
                  icon: Share2,
                  color: "from-cyan-500 to-blue-500",
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl border border-slate-700/40 bg-slate-800/40 p-5 backdrop-blur"
                >
                  <div
                    className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} mb-3 flex items-center justify-center`}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-bold text-2xl text-slate-100">
                    {stat.value}
                  </p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl border border-slate-700/40 bg-slate-800/40 p-6 backdrop-blur"
            >
              <h3 className="mb-4 font-semibold text-lg text-slate-100">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { label: "Add Credential", icon: BadgeCheck },
                  { label: "Link Device", icon: ScanLine },
                  { label: "Backup Keys", icon: Key },
                  { label: "Verify Identity", icon: CheckCircle },
                ].map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 transition-all hover:bg-slate-800/60"
                  >
                    <action.icon className="h-6 w-6 text-indigo-400" />
                    <span className="text-slate-300 text-sm">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Credentials Tab */}
        {activeTab === "credentials" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <h2 className="font-bold text-2xl text-slate-100">
                Verifiable Credentials
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/20 px-4 py-2 font-medium text-indigo-300 text-sm"
              >
                <BadgeCheck className="h-4 w-4" />
                Import Credential
              </motion.button>
            </motion.div>

            {selectedDID.credentials.map((credential) => (
              <motion.div
                key={credential.id}
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="overflow-hidden rounded-2xl border border-slate-700/40 bg-slate-800/40 backdrop-blur"
              >
                <motion.div
                  variants={cardHover}
                  className="cursor-pointer p-6"
                  onClick={() =>
                    setExpandedCredential(
                      expandedCredential === credential.id
                        ? null
                        : credential.id,
                    )
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${credential.verified ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-gradient-to-br from-amber-500 to-orange-500"}`}
                      >
                        <FileCheck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-slate-100">
                          {credential.type}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Issued by {credential.issuer}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-slate-500 text-xs">
                          <span>
                            Issued: {credential.issuedAt.toLocaleDateString()}
                          </span>
                          <span>
                            Expires: {credential.expiresAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {credential.verified && (
                        <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 font-medium text-emerald-400 text-xs">
                          <Verified className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                      <motion.div
                        animate={{
                          rotate:
                            expandedCredential === credential.id ? 180 : 0,
                        }}
                      >
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {expandedCredential === credential.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-slate-700/40 border-t"
                    >
                      <div className="bg-slate-900/30 p-6">
                        <h4 className="mb-3 font-semibold text-slate-300 text-sm uppercase tracking-wider">
                          Claims
                        </h4>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {Object.entries(credential.claims).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="rounded-xl border border-slate-700/40 bg-slate-800/60 p-3"
                              >
                                <p className="mb-1 text-slate-500 text-xs uppercase">
                                  {key}
                                </p>
                                <p className="font-medium text-slate-200">
                                  {value}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                        <div className="mt-4 flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 rounded-xl border border-indigo-500/30 bg-indigo-500/20 py-2.5 font-medium text-indigo-300 text-sm"
                          >
                            Share Credential
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 rounded-xl border border-slate-600/50 bg-slate-700/50 py-2.5 font-medium text-slate-300 text-sm"
                          >
                            Download JSON
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Devices Tab */}
        {activeTab === "devices" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <h2 className="font-bold text-2xl text-slate-100">
                Trusted Devices
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/20 px-4 py-2 font-medium text-indigo-300 text-sm"
              >
                <ScanLine className="h-4 w-4" />
                Add Device
              </motion.button>
            </motion.div>

            <div className="grid gap-4">
              {selectedDID.devices.map((device) => (
                <motion.div
                  key={device.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between rounded-2xl border border-slate-700/40 bg-slate-800/40 p-6 backdrop-blur"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${device.trusted ? "bg-gradient-to-br from-indigo-500 to-violet-500" : "bg-slate-700"}`}
                    >
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-100">
                        {device.name}
                      </h3>
                      <p className="font-mono text-slate-400 text-sm">
                        {device.publicKey}
                      </p>
                      <p className="mt-1 text-slate-500 text-xs">
                        Last sync: {device.lastSync.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 font-medium text-xs ${device.trusted ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}
                    >
                      {device.trusted ? "Trusted" : "Pending"}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:text-rose-400"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Verifiers Tab */}
        {activeTab === "verifiers" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div variants={itemVariants}>
              <h2 className="mb-2 font-bold text-2xl text-slate-100">
                Verifier Requests
              </h2>
              <p className="text-slate-400 text-sm">
                Manage requests from institutions to verify your credentials
              </p>
            </motion.div>

            <div className="grid gap-4">
              {mockRequests.map((request) => (
                <motion.div
                  key={request.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl border border-slate-700/40 bg-slate-800/40 p-6 backdrop-blur"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-slate-100">
                          {request.institution}
                        </h3>
                        <p className="mt-1 text-slate-400 text-sm">
                          Requesting: {request.requestedClaims.join(", ")}
                        </p>
                        <p className="mt-2 text-slate-500 text-xs">
                          {request.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 font-medium text-xs ${getStatusColor(request.status) === "bg-emerald-500" ? "bg-emerald-500/20 text-emerald-400" : request.status === "pending" ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400"}`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400"
                          >
                            <Check className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400"
                          >
                            <X className="h-4 w-4" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div variants={itemVariants}>
              <h2 className="mb-2 font-bold text-2xl text-slate-100">
                Activity Log
              </h2>
              <p className="text-slate-400 text-sm">
                Track all identity-related activities
              </p>
            </motion.div>

            <div className="overflow-hidden rounded-2xl border border-slate-700/40 bg-slate-800/40 backdrop-blur">
              <div className="border-slate-700/40 border-b bg-slate-800/60 p-4">
                <div className="grid grid-cols-12 gap-4 font-semibold text-slate-400 text-xs uppercase tracking-wider">
                  <div className="col-span-4">Action</div>
                  <div className="col-span-4">Details</div>
                  <div className="col-span-2">Time</div>
                  <div className="col-span-2">Status</div>
                </div>
              </div>
              <div className="divide-y divide-slate-700/40">
                {mockActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    variants={itemVariants}
                    className="p-4 transition-colors hover:bg-slate-800/30"
                  >
                    <div className="grid grid-cols-12 items-center gap-4">
                      <div className="col-span-4 flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${getStatusColor(activity.status)}`}
                        />
                        <span className="font-medium text-slate-200">
                          {activity.action}
                        </span>
                      </div>
                      <div className="col-span-4 text-slate-400 text-sm">
                        {activity.details}
                      </div>
                      <div className="col-span-2 text-slate-500 text-xs">
                        {activity.timestamp.toLocaleDateString()}
                      </div>
                      <div className="col-span-2">
                        <span
                          className={`rounded-full px-2 py-1 font-medium text-xs ${activity.status === "success" ? "bg-emerald-500/20 text-emerald-400" : activity.status === "warning" ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400"}`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* QR Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8"
            >
              <h3 className="mb-4 font-bold text-slate-100 text-xl">
                Share Your Identity
              </h3>
              <div className="mb-4 rounded-2xl bg-white p-6">
                <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl bg-slate-900">
                  <QrCode className="h-32 w-32 text-slate-100" />
                </div>
              </div>
              <p className="mb-6 text-center text-slate-400 text-sm">
                Scan this QR code to share your decentralized identity securely
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowQRModal(false)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 font-medium text-slate-300"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create DID Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-xl">
                    Create New DID
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Generate a new decentralized identity
                  </p>
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div>
                  <label className="mb-2 block text-slate-400 text-sm">
                    Identity Type
                  </label>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-200">
                    <option>Student Identity</option>
                    <option>Professional Identity</option>
                    <option>Academic Credential</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-slate-400 text-sm">
                    Blockchain Network
                  </label>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-200">
                    <option>Ethereum (did:ethr)</option>
                    <option>Polygon</option>
                    <option>Solana</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-3 font-medium text-slate-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-3 font-medium text-white"
                >
                  Create DID
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
