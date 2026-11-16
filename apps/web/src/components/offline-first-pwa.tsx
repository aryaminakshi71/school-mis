import { motion } from "framer-motion";
import {
  Box,
  CheckCircle,
  Cloud,
  Monitor,
  Shield,
  Smartphone,
  Tablet,
  Wifi,
  Zap,
} from "lucide-react";
import { useState } from "react";

export type DeviceType =
  | "desktop"
  | "mobile"
  | "tablet"
  | "laptop"
  | "kiosk"
  | "iot";
export type SyncStatus = "synced" | "pending" | "conflict" | "offline";
export type DataPriority = "critical" | "high" | "medium" | "low";

export interface OfflineCache {
  id: string;
  userId: string;
  deviceType: DeviceType;
  deviceName: string;
  lastSync: Date;
  syncStatus: SyncStatus;
  cachedData: CachedItem[];
  pendingUploads: number;
  storageUsed: number;
  storageQuota: number;
  conflicts: SyncConflict[];
  bandwidth: number;
  priority: DataPriority;
}

export interface CachedItem {
  id: string;
  type: "lesson" | "assignment" | "grade" | "message" | "file" | "attendance";
  title: string;
  data: any;
  cachedAt: Date;
  expiresAt: Date;
  size: number;
  modified: boolean;
  priority: DataPriority;
}

export interface SyncConflict {
  id: string;
  itemId: string;
  type: string;
  localVersion: any;
  serverVersion: any;
  detectedAt: Date;
  resolution?: "local" | "server" | "merge" | "manual";
}

interface OfflineFirstPWAProps {
  userRole?: "admin" | "teacher" | "student" | "it-support";
  userId?: string;
  onSyncData?: (cacheId: string) => Promise<void>;
  onResolveConflict?: (conflictId: string, resolution: string) => Promise<void>;
  onClearCache?: (cacheId: string) => Promise<void>;
}

export function OfflineFirstPWA({
  userRole = "student",
  userId = "S001",
  onSyncData,
  onResolveConflict,
  onClearCache,
}: OfflineFirstPWAProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "devices" | "sync" | "conflicts"
  >("overview");
  const [caches, setCaches] = useState<OfflineCache[]>([
    {
      id: "CACHE001",
      userId: "S001",
      deviceType: "mobile",
      deviceName: "iPhone 15 - Emma",
      lastSync: new Date(Date.now() - 3600000),
      syncStatus: "synced",
      cachedData: [
        {
          id: "C1",
          type: "lesson",
          title: "Calculus - Derivatives",
          data: {},
          cachedAt: new Date(),
          expiresAt: new Date(Date.now() + 86400000),
          size: 2450000,
          modified: false,
          priority: "high",
        },
        {
          id: "C2",
          type: "assignment",
          title: "Biology Lab Report",
          data: {},
          cachedAt: new Date(),
          expiresAt: new Date(Date.now() + 86400000),
          size: 1200000,
          modified: true,
          priority: "critical",
        },
      ],
      pendingUploads: 1,
      storageUsed: 3670000,
      storageQuota: 50000000,
      conflicts: [],
      bandwidth: 45,
      priority: "high",
    },
    {
      id: "CACHE002",
      userId: "S001",
      deviceType: "laptop",
      deviceName: "MacBook Pro - Emma",
      lastSync: new Date(Date.now() - 7200000),
      syncStatus: "offline",
      cachedData: [
        {
          id: "C3",
          type: "grade",
          title: "Transcript Data",
          data: {},
          cachedAt: new Date(),
          expiresAt: new Date(Date.now() + 604800000),
          size: 500000,
          modified: false,
          priority: "medium",
        },
      ],
      pendingUploads: 0,
      storageUsed: 500000,
      storageQuota: 100000000,
      conflicts: [],
      bandwidth: 0,
      priority: "medium",
    },
  ]);

  const [conflicts] = useState<SyncConflict[]>([
    {
      id: "CONF001",
      itemId: "A001",
      type: "assignment",
      localVersion: { title: "Updated Essay", content: "Latest version..." },
      serverVersion: { title: "Essay Draft", content: "Earlier version..." },
      detectedAt: new Date(Date.now() - 1800000),
      resolution: undefined,
    },
  ]);

  const [selectedCache, setSelectedCache] = useState<OfflineCache | null>(null);
  const [isOnline] = useState(navigator.onLine);

  const deviceIcons: Record<DeviceType, any> = {
    desktop: Monitor,
    mobile: Smartphone,
    tablet: Tablet,
    laptop: Box,
    kiosk: Box,
    iot: Wifi,
  };

  const statusColors: Record<SyncStatus, string> = {
    synced: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    conflict: "bg-red-100 text-red-700",
    offline: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Cloud className="h-8 w-8 text-blue-600" />
            Offline-First PWA
          </h2>
          <p className="mt-1 text-slate-600">
            Seamless offline functionality with intelligent sync
          </p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-2 ${isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          <Wifi className="h-5 w-5" />
          <span className="font-medium">
            {isOnline ? "Online" : "Offline Mode"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Synced Devices",
            value: caches.filter((c) => c.syncStatus === "synced").length,
            color: "bg-green-500",
            icon: CheckCircle,
          },
          {
            label: "Offline Devices",
            value: caches.filter((c) => c.syncStatus === "offline").length,
            color: "bg-slate-500",
            icon: Cloud,
          },
          {
            label: "Pending Uploads",
            value: caches.reduce((sum, c) => sum + c.pendingUploads, 0),
            color: "bg-amber-500",
            icon: Zap,
          },
          {
            label: "Conflicts",
            value: conflicts.length,
            color: "bg-red-500",
            icon: Shield,
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
          { id: "overview", label: "Overview", icon: Cloud },
          { id: "devices", label: "Devices", icon: Smartphone },
          { id: "sync", label: "Sync Queue", icon: Zap },
          { id: "conflicts", label: "Conflicts", icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 border-b-2 text-blue-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-6">
          {caches.map((cache) => {
            const Icon = deviceIcons[cache.deviceType];
            return (
              <motion.div
                key={cache.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-3">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {cache.deviceName}
                      </h3>
                      <p className="text-slate-500 text-sm capitalize">
                        {cache.deviceType}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${statusColors[cache.syncStatus]}`}
                  >
                    {cache.syncStatus.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-slate-600 text-sm">
                        Storage Used
                      </span>
                      <span className="font-medium text-slate-900 text-sm">
                        {(cache.storageUsed / 1024 / 1024).toFixed(1)} MB /{" "}
                        {(cache.storageQuota / 1024 / 1024).toFixed(0)} MB
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{
                          width: `${(cache.storageUsed / cache.storageQuota) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      Cached Items:{" "}
                      <span className="font-medium text-slate-900">
                        {cache.cachedData.length}
                      </span>
                    </span>
                    <span className="text-slate-600">
                      Pending:{" "}
                      <span className="font-medium text-amber-600">
                        {cache.pendingUploads}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      Last Sync: {cache.lastSync.toLocaleTimeString()}
                    </span>
                    {cache.bandwidth > 0 && (
                      <span className="flex items-center gap-1 text-green-600">
                        <Zap className="h-4 w-4" /> {cache.bandwidth} Mbps
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === "conflicts" && (
        <div className="space-y-4">
          {conflicts.map((conflict) => (
            <motion.div
              key={conflict.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-red-200 bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-slate-900">
                    Conflict #{conflict.id}
                  </h3>
                  <span className="rounded bg-red-100 px-2 py-1 text-red-700 text-sm">
                    {conflict.type}
                  </span>
                </div>
                <span className="text-slate-500 text-sm">
                  {conflict.detectedAt.toLocaleString()}
                </span>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="mb-1 font-medium text-blue-900 text-sm">
                    Local Version (This Device)
                  </p>
                  <p className="text-blue-800 text-sm">
                    {conflict.localVersion.title}
                  </p>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="mb-1 font-medium text-green-900 text-sm">
                    Server Version
                  </p>
                  <p className="text-green-800 text-sm">
                    {conflict.serverVersion.title}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                  Keep Local
                </button>
                <button className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
                  Use Server
                </button>
                <button className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-50">
                  Merge Both
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
