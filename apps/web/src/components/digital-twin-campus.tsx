"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bell,
  Building2,
  Clock,
  Filter,
  Layers,
  Menu,
  Settings,
  Thermometer,
  Users,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Building {
  id: string;
  name: string;
  type: "academic" | "dormitory" | "library" | "dining" | "sports" | "admin";
  occupancy: number;
  maxCapacity: number;
  energyUsage: number;
  temperature: number;
  airQuality: number;
  noiseLevel: number;
  alerts: string[];
  coordinates: { x: number; y: number };
  floors: number;
  area: number;
  maintenanceScheduled: boolean;
}

interface Sensor {
  id: string;
  type: "occupancy" | "energy" | "environmental" | "security";
  location: string;
  buildingId: string;
  value: number;
  status: "normal" | "warning" | "critical";
  lastUpdate: Date;
}

interface CampusStats {
  totalOccupancy: number;
  totalCapacity: number;
  energyConsumption: number;
  avgTemperature: number;
  avgAirQuality: number;
  activeAlerts: number;
  maintenanceCount: number;
}

const mockBuildings: Building[] = [
  {
    id: "b1",
    name: "Engineering Complex",
    type: "academic",
    occupancy: 847,
    maxCapacity: 1200,
    energyUsage: 2340,
    temperature: 22.5,
    airQuality: 92,
    noiseLevel: 45,
    alerts: [],
    coordinates: { x: 35, y: 25 },
    floors: 5,
    area: 45000,
    maintenanceScheduled: false,
  },
  {
    id: "b2",
    name: "Student Center",
    type: "dining",
    occupancy: 523,
    maxCapacity: 800,
    energyUsage: 1680,
    temperature: 23.1,
    airQuality: 88,
    noiseLevel: 62,
    alerts: [],
    coordinates: { x: 55, y: 40 },
    floors: 3,
    area: 28000,
    maintenanceScheduled: false,
  },
  {
    id: "b3",
    name: "Library",
    type: "library",
    occupancy: 312,
    maxCapacity: 500,
    energyUsage: 1450,
    temperature: 21.8,
    airQuality: 95,
    noiseLevel: 28,
    alerts: ["HVAC optimization needed"],
    coordinates: { x: 20, y: 55 },
    floors: 4,
    area: 32000,
    maintenanceScheduled: true,
  },
  {
    id: "b4",
    name: "Science Hall",
    type: "academic",
    occupancy: 445,
    maxCapacity: 600,
    energyUsage: 2890,
    temperature: 20.9,
    airQuality: 90,
    noiseLevel: 52,
    alerts: [],
    coordinates: { x: 70, y: 20 },
    floors: 4,
    area: 38000,
    maintenanceScheduled: false,
  },
  {
    id: "b5",
    name: "Dormitory A",
    type: "dormitory",
    occupancy: 892,
    maxCapacity: 950,
    energyUsage: 1920,
    temperature: 22.3,
    airQuality: 85,
    noiseLevel: 38,
    alerts: ["Water pressure low - Floor 3"],
    coordinates: { x: 15, y: 15 },
    floors: 8,
    area: 55000,
    maintenanceScheduled: true,
  },
  {
    id: "b6",
    name: "Athletics Center",
    type: "sports",
    occupancy: 156,
    maxCapacity: 400,
    energyUsage: 2150,
    temperature: 19.5,
    airQuality: 89,
    noiseLevel: 58,
    alerts: [],
    coordinates: { x: 80, y: 65 },
    floors: 2,
    area: 42000,
    maintenanceScheduled: false,
  },
  {
    id: "b7",
    name: "Administration",
    type: "admin",
    occupancy: 78,
    maxCapacity: 150,
    energyUsage: 980,
    temperature: 22.0,
    airQuality: 94,
    noiseLevel: 35,
    alerts: [],
    coordinates: { x: 45, y: 70 },
    floors: 3,
    area: 18000,
    maintenanceScheduled: false,
  },
  {
    id: "b8",
    name: "Arts Building",
    type: "academic",
    occupancy: 234,
    maxCapacity: 350,
    energyUsage: 1350,
    temperature: 21.5,
    airQuality: 93,
    noiseLevel: 48,
    alerts: [],
    coordinates: { x: 60, y: 50 },
    floors: 3,
    area: 25000,
    maintenanceScheduled: false,
  },
];

const mockSensors: Sensor[] = [
  {
    id: "s1",
    type: "occupancy",
    location: "Engineering - Floor 2",
    buildingId: "b1",
    value: 156,
    status: "normal",
    lastUpdate: new Date(),
  },
  {
    id: "s2",
    type: "energy",
    location: "Library - Main Hall",
    buildingId: "b3",
    value: 1450,
    status: "warning",
    lastUpdate: new Date(),
  },
  {
    id: "s3",
    type: "environmental",
    location: "Dorm A - Room 304",
    buildingId: "b5",
    value: 22.3,
    status: "normal",
    lastUpdate: new Date(),
  },
  {
    id: "s4",
    type: "security",
    location: "Admin - Lobby",
    buildingId: "b7",
    value: 1,
    status: "normal",
    lastUpdate: new Date(),
  },
  {
    id: "s5",
    type: "occupancy",
    location: "Student Center - Cafeteria",
    buildingId: "b2",
    value: 523,
    status: "normal",
    lastUpdate: new Date(),
  },
  {
    id: "s6",
    type: "energy",
    location: "Science Hall - Lab 101",
    buildingId: "b4",
    value: 2890,
    status: "critical",
    lastUpdate: new Date(),
  },
];

const mockHistoricalData = {
  occupancy: [
    720, 680, 750, 820, 890, 940, 980, 1020, 1100, 1050, 920, 850, 780, 720,
    680, 650, 620, 580, 550, 520, 480, 450, 420, 380,
  ],
  energy: [
    15000, 14800, 15200, 15800, 16200, 16800, 17500, 18200, 19000, 18500, 17800,
    17200, 16800, 16200, 15800, 15400, 15000, 14600, 14200, 13800, 13500, 13200,
    12800, 12500,
  ],
};

function getOccupancyColor(rate: number): string {
  if (rate < 50) return "#10b981";
  if (rate < 75) return "#f59e0b";
  if (rate < 90) return "#f97316";
  return "#ef4444";
}

function getStatusIcon(status: string) {
  switch (status) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    default:
      return <Activity className="h-4 w-4 text-emerald-500" />;
  }
}

function getBuildingIcon(type: string) {
  switch (type) {
    case "academic":
      return <Building2 className="h-5 w-5" />;
    case "dormitory":
      return <Building2 className="h-5 w-5" />;
    case "library":
      return <Layers className="h-5 w-5" />;
    case "dining":
      return <Users className="h-5 w-5" />;
    case "sports":
      return <Activity className="h-5 w-5" />;
    case "admin":
      return <Building2 className="h-5 w-5" />;
    default:
      return <Building2 className="h-5 w-5" />;
  }
}

export default function DigitalTwinCampus() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null,
  );
  const [buildings, setBuildings] = useState<Building[]>(mockBuildings);
  const [sensors] = useState<Sensor[]>(mockSensors);
  const [filterType, setFilterType] = useState<string>("all");
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [timeRange, setTimeRange] = useState("realtime");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuildings((prev) =>
        prev.map((building) => ({
          ...building,
          occupancy: Math.max(
            0,
            Math.min(
              building.maxCapacity,
              building.occupancy + Math.floor(Math.random() * 20) - 10,
            ),
          ),
          energyUsage: Math.max(
            0,
            building.energyUsage + Math.floor(Math.random() * 50) - 25,
          ),
          temperature: parseFloat(
            (building.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1),
          ),
          airQuality: Math.max(
            0,
            Math.min(
              100,
              building.airQuality + Math.floor(Math.random() * 4) - 2,
            ),
          ),
        })),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredBuildings =
    filterType === "all"
      ? buildings
      : buildings.filter((b) => b.type === filterType);

  const stats: CampusStats = {
    totalOccupancy: buildings.reduce((sum, b) => sum + b.occupancy, 0),
    totalCapacity: buildings.reduce((sum, b) => sum + b.maxCapacity, 0),
    energyConsumption: buildings.reduce((sum, b) => sum + b.energyUsage, 0),
    avgTemperature:
      buildings.reduce((sum, b) => sum + b.temperature, 0) / buildings.length,
    avgAirQuality:
      buildings.reduce((sum, b) => sum + b.airQuality, 0) / buildings.length,
    activeAlerts: buildings.filter((b) => b.alerts.length > 0).length,
    maintenanceCount: buildings.filter((b) => b.maintenanceScheduled).length,
  };

  const occupancyRate = (stats.totalOccupancy / stats.totalCapacity) * 100;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-100">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        .font-display {
          font-family: 'Space Grotesk', sans-serif;
        }
        .font-body {
          font-family: 'Inter', sans-serif;
        }
      `,
        }}
      />

      <header className="fixed top-0 right-0 left-0 z-50 border-slate-800 border-b bg-slate-900/80 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600"
              >
                <Layers className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h1 className="font-display font-semibold text-white text-xl tracking-tight">
                  Digital Twin Campus
                </h1>
                <p className="font-body text-slate-400 text-xs">
                  Real-time Campus Intelligence System
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-6 md:flex">
              <div className="flex items-center gap-2 font-body text-slate-400 text-sm">
                <Clock className="h-4 w-4" />
                <span>
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <span className="text-slate-600">|</span>
                <span>{currentTime.toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-lg bg-slate-800/50 p-2 transition-colors hover:bg-slate-700/50">
                  <Bell className="h-4 w-4 text-slate-400" />
                </button>
                <button className="rounded-lg bg-slate-800/50 p-2 transition-colors hover:bg-slate-700/50">
                  <Settings className="h-4 w-4 text-slate-400" />
                </button>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-600">
                  <span className="font-medium text-white text-xs">AD</span>
                </div>
              </div>
            </div>

            <button
              className="rounded-lg bg-slate-800/50 p-2 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-slate-400" />
              ) : (
                <Menu className="h-5 w-5 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        <aside className="fixed top-20 bottom-0 left-0 hidden w-80 overflow-y-auto border-slate-800 border-r bg-slate-900/50 lg:block">
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-400" />
                  <span className="font-body text-slate-400 text-xs uppercase tracking-wider">
                    Occupancy
                  </span>
                </div>
                <p className="font-display font-semibold text-2xl text-white">
                  {stats.totalOccupancy.toLocaleString()}
                </p>
                <p className="mt-1 text-slate-500 text-xs">
                  of {stats.totalCapacity.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="font-body text-slate-400 text-xs uppercase tracking-wider">
                    Energy
                  </span>
                </div>
                <p className="font-display font-semibold text-2xl text-white">
                  {(stats.energyConsumption / 1000).toFixed(1)}k
                </p>
                <p className="mt-1 text-slate-500 text-xs">kWh today</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-rose-400" />
                  <span className="font-body text-slate-400 text-xs uppercase tracking-wider">
                    Avg Temp
                  </span>
                </div>
                <p className="font-display font-semibold text-2xl text-white">
                  {stats.avgTemperature.toFixed(1)}°C
                </p>
                <p className="mt-1 text-slate-500 text-xs">Campus average</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Wind className="h-4 w-4 text-emerald-400" />
                  <span className="font-body text-slate-400 text-xs uppercase tracking-wider">
                    Air Quality
                  </span>
                </div>
                <p className="font-display font-semibold text-2xl text-white">
                  {Math.round(stats.avgAirQuality)} AQI
                </p>
                <p className="mt-1 text-slate-500 text-xs">Good</p>
              </motion.div>
            </div>

            <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
              <h3 className="mb-4 flex items-center gap-2 font-display font-medium text-sm text-white">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Active Alerts ({stats.activeAlerts})
              </h3>
              <div className="space-y-3">
                {buildings
                  .filter((b) => b.alerts.length > 0)
                  .map((building) =>
                    building.alerts.map((alert, idx) => (
                      <motion.div
                        key={`${building.id}-${idx}`}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3"
                      >
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                        <div>
                          <p className="font-body text-sm text-white">
                            {alert}
                          </p>
                          <p className="mt-1 text-slate-500 text-xs">
                            {building.name}
                          </p>
                        </div>
                      </motion.div>
                    )),
                  )}
                {stats.activeAlerts === 0 && (
                  <p className="py-4 text-center font-body text-slate-500 text-sm">
                    No active alerts
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
              <h3 className="mb-4 flex items-center gap-2 font-display font-medium text-sm text-white">
                <Settings className="h-4 w-4 text-cyan-500" />
                Maintenance ({stats.maintenanceCount})
              </h3>
              <div className="space-y-2">
                {buildings
                  .filter((b) => b.maintenanceScheduled)
                  .map((building) => (
                    <div
                      key={building.id}
                      className="flex items-center gap-3 rounded-lg bg-slate-700/30 p-2"
                    >
                      <div className="h-2 w-2 rounded-full bg-cyan-500" />
                      <span className="font-body text-slate-300 text-sm">
                        {building.name}
                      </span>
                    </div>
                  ))}
                {stats.maintenanceCount === 0 && (
                  <p className="py-4 text-center font-body text-slate-500 text-sm">
                    No scheduled maintenance
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
              <h3 className="mb-4 font-display font-medium text-sm text-white">
                Energy Trend (24h)
              </h3>
              <div className="flex h-32 items-end gap-1">
                {mockHistoricalData.energy.map((value, idx) => {
                  const height = (value / 20000) * 100;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: idx * 0.02 }}
                      className="flex-1 cursor-pointer rounded-t bg-gradient-to-t from-cyan-500/30 to-cyan-400/60 transition-all hover:from-cyan-500/50 hover:to-cyan-400/80"
                      title={`${value.toLocaleString()} kWh`}
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between font-body text-slate-500 text-xs">
                <span>00:00</span>
                <span>12:00</span>
                <span>23:00</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:ml-80">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 p-1">
                <button
                  onClick={() => setTimeRange("realtime")}
                  className={`rounded-md px-3 py-1.5 font-body text-sm transition-all ${
                    timeRange === "realtime"
                      ? "bg-cyan-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Real-time
                </button>
                <button
                  onClick={() => setTimeRange("1h")}
                  className={`rounded-md px-3 py-1.5 font-body text-sm transition-all ${
                    timeRange === "1h"
                      ? "bg-cyan-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  1H
                </button>
                <button
                  onClick={() => setTimeRange("24h")}
                  className={`rounded-md px-3 py-1.5 font-body text-sm transition-all ${
                    timeRange === "24h"
                      ? "bg-cyan-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  24H
                </button>
                <button
                  onClick={() => setTimeRange("7d")}
                  className={`rounded-md px-3 py-1.5 font-body text-sm transition-all ${
                    timeRange === "7d"
                      ? "bg-cyan-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  7D
                </button>
              </div>

              <div className="h-6 w-px bg-slate-700" />

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={filterType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFilterType(e.target.value)
                  }
                  className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 font-body text-slate-300 text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="all">All Buildings</option>
                  <option value="academic">Academic</option>
                  <option value="dormitory">Dormitories</option>
                  <option value="library">Library</option>
                  <option value="dining">Dining</option>
                  <option value="sports">Sports</option>
                  <option value="admin">Administration</option>
                </select>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <div
                    className={`h-5 w-10 rounded-full transition-colors ${
                      showHeatmap ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                    onClick={() => setShowHeatmap(!showHeatmap)}
                  >
                    <div
                      className={`h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                        showHeatmap ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="font-body text-slate-400 text-sm">
                    Heatmap
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <div
                    className={`h-5 w-10 rounded-full transition-colors ${
                      showSensors ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                    onClick={() => setShowSensors(!showSensors)}
                  >
                    <div
                      className={`h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                        showSensors ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="font-body text-slate-400 text-sm">
                    Sensors
                  </span>
                </label>
              </div>
            </div>

            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <div className="absolute inset-0 opacity-30">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(148, 163, 184, 0.15) 1px, transparent 0)`,
                    backgroundSize: "40px 40px",
                  }}
                />
              </div>

              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <linearGradient
                    id="roadGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgba(71, 85, 105, 0.3)" />
                    <stop offset="100%" stopColor="rgba(71, 85, 105, 0.1)" />
                  </linearGradient>
                </defs>

                <path
                  d="M 10 50 Q 30 30 50 50 T 90 50"
                  stroke="url(#roadGradient)"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M 30 10 L 30 90"
                  stroke="url(#roadGradient)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M 60 10 L 60 90"
                  stroke="url(#roadGradient)"
                  strokeWidth="2"
                  fill="none"
                />

                {filteredBuildings.map((building, index) => {
                  const occupancyRate =
                    (building.occupancy / building.maxCapacity) * 100;
                  const color = showHeatmap
                    ? getOccupancyColor(occupancyRate)
                    : "#3b82f6";

                  return (
                    <motion.g
                      key={building.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedBuilding(building)}
                      className="cursor-pointer"
                    >
                      <motion.rect
                        x={building.coordinates.x - 8}
                        y={building.coordinates.y - 6}
                        width="16"
                        height="12"
                        rx="2"
                        fill={color}
                        fillOpacity={0.6}
                        stroke={color}
                        strokeWidth="0.5"
                        whileHover={{ scale: 1.2 }}
                        className="cursor-pointer"
                      />
                      <text
                        x={building.coordinates.x}
                        y={building.coordinates.y - 10}
                        textAnchor="middle"
                        fill="white"
                        fontSize="3"
                        className="pointer-events-none font-body"
                      >
                        {building.name}
                      </text>

                      {building.alerts.length > 0 && (
                        <motion.circle
                          cx={building.coordinates.x + 8}
                          cy={building.coordinates.y - 6}
                          r="2"
                          fill="#ef4444"
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}

                      {building.maintenanceScheduled && (
                        <circle
                          cx={building.coordinates.x - 8}
                          cy={building.coordinates.y - 6}
                          r="2"
                          fill="#06b6d4"
                        />
                      )}
                    </motion.g>
                  );
                })}

                {showSensors &&
                  sensors.map((sensor, index) => {
                    const building = buildings.find(
                      (b) => b.id === sensor.buildingId,
                    );
                    if (!building) return null;

                    return (
                      <motion.g
                        key={sensor.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <circle
                          cx={
                            building.coordinates.x + (index % 2 === 0 ? 4 : -4)
                          }
                          cy={
                            building.coordinates.y + (index % 2 === 0 ? 4 : -4)
                          }
                          r="1.5"
                          fill={
                            sensor.status === "critical"
                              ? "#ef4444"
                              : sensor.status === "warning"
                                ? "#f59e0b"
                                : "#10b981"
                          }
                        />
                        <motion.circle
                          cx={
                            building.coordinates.x + (index % 2 === 0 ? 4 : -4)
                          }
                          cy={
                            building.coordinates.y + (index % 2 === 0 ? 4 : -4)
                          }
                          r="3"
                          fill="none"
                          stroke={
                            sensor.status === "critical"
                              ? "#ef4444"
                              : sensor.status === "warning"
                                ? "#f59e0b"
                                : "#10b981"
                          }
                          strokeWidth="0.3"
                          animate={{ r: [3, 6, 3], opacity: [0.8, 0, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.g>
                    );
                  })}
              </svg>

              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-3 backdrop-blur-md">
                  <p className="mb-2 font-body text-slate-400 text-xs uppercase tracking-wider">
                    Occupancy Rate
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded"
                      style={{
                        backgroundColor: getOccupancyColor(occupancyRate),
                      }}
                    />
                    <span className="font-display font-semibold text-lg text-white">
                      {occupancyRate.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-3 backdrop-blur-md">
                  <p className="mb-2 font-body text-slate-400 text-xs uppercase tracking-wider">
                    Legend
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded bg-emerald-500" />
                      <span className="font-body text-slate-400 text-xs">
                        &lt;50% Occupancy
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded bg-amber-500" />
                      <span className="font-body text-slate-400 text-xs">
                        50-75% Occupancy
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded bg-orange-500" />
                      <span className="font-body text-slate-400 text-xs">
                        75-90% Occupancy
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded bg-red-500" />
                      <span className="font-body text-slate-400 text-xs">
                        &gt;90% Occupancy
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {filteredBuildings.map((building) => {
                const occupancyRate =
                  (building.occupancy / building.maxCapacity) * 100;

                return (
                  <motion.div
                    key={building.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedBuilding(building)}
                    className={`cursor-pointer rounded-xl border bg-slate-800/50 p-4 transition-all ${
                      selectedBuilding?.id === building.id
                        ? "border-cyan-500 bg-slate-800"
                        : "border-slate-700/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-slate-700/50 p-2 text-cyan-400">
                          {getBuildingIcon(building.type)}
                        </div>
                        <div>
                          <h3 className="font-display font-medium text-sm text-white">
                            {building.name}
                          </h3>
                          <p className="font-body text-slate-500 text-xs capitalize">
                            {building.type}
                          </p>
                        </div>
                      </div>
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: getOccupancyColor(occupancyRate),
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-body text-slate-500">
                          Occupancy
                        </span>
                        <span className="font-body text-white">
                          {building.occupancy} / {building.maxCapacity}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: getOccupancyColor(occupancyRate),
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${occupancyRate}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 border-slate-700/50 border-t pt-3">
                      <div className="flex items-center gap-1.5">
                        <Thermometer className="h-3 w-3 text-slate-500" />
                        <span className="font-body text-slate-400 text-xs">
                          {building.temperature}°C
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-slate-500" />
                        <span className="font-body text-slate-400 text-xs">
                          {(building.energyUsage / 1000).toFixed(1)}kW
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedBuilding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBuilding(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            >
              <div className="border-slate-800 border-b p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-3">
                      {getBuildingIcon(selectedBuilding.type)}
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-white text-xl">
                        {selectedBuilding.name}
                      </h2>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-body text-slate-400 text-sm capitalize">
                          {selectedBuilding.type}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="font-body text-slate-400 text-sm">
                          {selectedBuilding.floors} floors
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="font-body text-slate-400 text-sm">
                          {selectedBuilding.area.toLocaleString()} m²
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBuilding(null)}
                    className="rounded-lg p-2 transition-colors hover:bg-slate-800"
                  >
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-cyan-400" />
                      <span className="font-body text-slate-500 text-xs uppercase">
                        Occupancy
                      </span>
                    </div>
                    <p className="font-display font-semibold text-2xl text-white">
                      {selectedBuilding.occupancy}
                    </p>
                    <p className="mt-1 font-body text-slate-500 text-xs">
                      of {selectedBuilding.maxCapacity} max
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span className="font-body text-slate-500 text-xs uppercase">
                        Energy
                      </span>
                    </div>
                    <p className="font-display font-semibold text-2xl text-white">
                      {selectedBuilding.energyUsage.toLocaleString()}
                    </p>
                    <p className="mt-1 font-body text-slate-500 text-xs">
                      kWh today
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-rose-400" />
                      <span className="font-body text-slate-500 text-xs uppercase">
                        Temperature
                      </span>
                    </div>
                    <p className="font-display font-semibold text-2xl text-white">
                      {selectedBuilding.temperature}°C
                    </p>
                    <p className="mt-1 font-body text-slate-500 text-xs">
                      Indoor avg
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Wind className="h-4 w-4 text-emerald-400" />
                      <span className="font-body text-slate-500 text-xs uppercase">
                        Air Quality
                      </span>
                    </div>
                    <p className="font-display font-semibold text-2xl text-white">
                      {selectedBuilding.airQuality}
                    </p>
                    <p className="mt-1 font-body text-slate-500 text-xs">
                      AQI score
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-display font-medium text-sm text-white">
                      <Activity className="h-4 w-4 text-cyan-500" />
                      Environmental Metrics
                    </h3>
                    <div className="space-y-3">
                      <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-body text-slate-400 text-sm">
                            Noise Level
                          </span>
                          <span className="font-body text-sm text-white">
                            {selectedBuilding.noiseLevel} dB
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500"
                            style={{
                              width: `${(selectedBuilding.noiseLevel / 80) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-body text-slate-400 text-sm">
                            Humidity
                          </span>
                          <span className="font-body text-sm text-white">
                            45%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                            style={{ width: "45%" }}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-body text-slate-400 text-sm">
                            CO2 Level
                          </span>
                          <span className="font-body text-sm text-white">
                            420 ppm
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            style={{ width: "42%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-display font-medium text-sm text-white">
                      <Layers className="h-4 w-4 text-cyan-500" />
                      Occupancy by Floor
                    </h3>
                    <div className="space-y-2">
                      {Array.from(
                        { length: selectedBuilding.floors },
                        (_, i) => {
                          const floor = selectedBuilding.floors - i;
                          const floorOccupancy = Math.floor(
                            (selectedBuilding.occupancy /
                              selectedBuilding.floors) *
                              (0.8 + Math.random() * 0.4),
                          );
                          const floorCapacity = Math.floor(
                            selectedBuilding.maxCapacity /
                              selectedBuilding.floors,
                          );
                          const rate = (floorOccupancy / floorCapacity) * 100;

                          return (
                            <div
                              key={floor}
                              className="flex items-center gap-3"
                            >
                              <span className="w-12 font-body text-slate-500 text-xs">
                                Floor {floor}
                              </span>
                              <div className="relative h-6 flex-1 overflow-hidden rounded-lg bg-slate-800/50">
                                <motion.div
                                  className="absolute inset-y-0 left-0 rounded-lg"
                                  style={{
                                    backgroundColor: getOccupancyColor(rate),
                                  }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${rate}%` }}
                                  transition={{ duration: 0.5, delay: i * 0.1 }}
                                />
                                <span className="absolute inset-0 flex items-center justify-center font-body text-white text-xs">
                                  {floorOccupancy}
                                </span>
                              </div>
                              <span className="w-16 text-right font-body text-slate-500 text-xs">
                                {rate.toFixed(0)}%
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>

                {selectedBuilding.alerts.length > 0 && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                    <h3 className="mb-3 flex items-center gap-2 font-display font-medium text-red-400 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      Active Alerts
                    </h3>
                    <div className="space-y-2">
                      {selectedBuilding.alerts.map((alert, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 font-body text-red-300 text-sm"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          <span>{alert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBuilding.maintenanceScheduled && (
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-display font-medium text-cyan-400 text-sm">
                      <Settings className="h-4 w-4" />
                      Maintenance Scheduled
                    </h3>
                    <p className="font-body text-cyan-300 text-sm">
                      Routine maintenance is scheduled for this building. Some
                      areas may be temporarily inaccessible.
                    </p>
                  </div>
                )}

                <div className="border-slate-800 border-t pt-4">
                  <h3 className="mb-3 font-display font-medium text-sm text-white">
                    Sensor Network
                  </h3>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {sensors
                      .filter((s) => s.buildingId === selectedBuilding.id)
                      .map((sensor) => (
                        <div
                          key={sensor.id}
                          className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3"
                        >
                          {getStatusIcon(sensor.status)}
                          <div>
                            <p className="font-body text-slate-400 text-xs capitalize">
                              {sensor.type}
                            </p>
                            <p className="font-body text-sm text-white">
                              {sensor.value}
                              {sensor.type === "energy"
                                ? " kWh"
                                : sensor.type === "occupancy"
                                  ? " people"
                                  : sensor.type === "environmental"
                                    ? "°C"
                                    : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    {sensors.filter((s) => s.buildingId === selectedBuilding.id)
                      .length === 0 && (
                      <p className="col-span-full font-body text-slate-500 text-sm">
                        No active sensors in this building
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
