import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Droplets,
  Lightbulb,
  Lock,
  RefreshCw,
  Shield,
  Thermometer,
  Tv,
  User,
  Wifi,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export type DeviceType =
  | "hvac"
  | "lighting"
  | "security"
  | "energy"
  | "water"
  | "air-quality"
  | "occupancy"
  | "projector"
  | "computer"
  | "door";
export type DeviceStatus =
  | "online"
  | "offline"
  | "warning"
  | "error"
  | "maintenance";
export type ZoneType =
  | "classroom"
  | "library"
  | "lab"
  | "gym"
  | "cafeteria"
  | "office"
  | "outdoor"
  | "auditorium";

export interface SmartDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  zone: ZoneType;
  room: string;
  floor: number;
  building: string;
  batteryLevel?: number;
  signalStrength: number;
  lastSeen: Date;
  firmwareVersion: string;
  isActive: boolean;
  autoMode: boolean;
  schedule?: DeviceSchedule;
  readings?: SensorReading[];
  alerts?: DeviceAlert[];
  maintenanceHistory?: MaintenanceRecord[];
}

export interface SensorReading {
  timestamp: Date;
  type: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
}

export interface DeviceSchedule {
  enabled: boolean;
  timezone: string;
  events: ScheduleEvent[];
}

export interface ScheduleEvent {
  id: string;
  name: string;
  days: number[];
  time: string;
  action: string;
  value: any;
}

export interface DeviceAlert {
  id: string;
  type: "warning" | "critical" | "info";
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface MaintenanceRecord {
  id: string;
  type: "routine" | "repair" | "calibration" | "firmware";
  description: string;
  performedBy: string;
  date: Date;
  nextDue?: Date;
  cost?: number;
}

export interface EnergyUsage {
  timestamp: Date;
  building: string;
  totalKwh: number;
  peakKw: number;
  cost: number;
  devices: DeviceEnergy[];
}

export interface DeviceEnergy {
  deviceId: string;
  deviceName: string;
  kwh: number;
  percentage: number;
}

export interface EnvironmentalData {
  zone: ZoneType;
  temperature: number;
  humidity: number;
  co2: number;
  pm25: number;
  noise: number;
  occupancy: number;
  lightingLevel: number;
  timestamp: Date;
}

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: RuleTrigger;
  actions: RuleAction[];
  lastTriggered?: Date;
  triggerCount: number;
}

export interface RuleTrigger {
  type: "time" | "sensor" | "occupancy" | "weather" | "manual";
  condition: string;
  threshold?: number;
  deviceId?: string;
}

export interface RuleAction {
  deviceId: string;
  action: string;
  value: any;
  delay?: number;
}

interface IoTSmartCampusProps {
  userRole?: "admin" | "facilities" | "teacher" | "student";
  onUpdateDevice?: (
    deviceId: string,
    updates: Partial<SmartDevice>,
  ) => Promise<void>;
  onCreateAutomationRule?: (
    rule: Omit<AutomationRule, "id" | "lastTriggered" | "triggerCount">,
  ) => Promise<string>;
  onAcknowledgeAlert?: (alertId: string) => Promise<void>;
  onScheduleMaintenance?: (
    deviceId: string,
    maintenance: Omit<MaintenanceRecord, "id" | "date">,
  ) => Promise<void>;
}

export function IoTSmartCampus({
  userRole = "admin",
  onUpdateDevice,
  onCreateAutomationRule,
  onAcknowledgeAlert,
  onScheduleMaintenance,
}: IoTSmartCampusProps) {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "devices" | "energy" | "environment" | "automation"
  >("dashboard");
  const [selectedDevice, setSelectedDevice] = useState<SmartDevice | null>(
    null,
  );
  const [selectedZone, setSelectedZone] = useState<ZoneType | "all">("all");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("all");
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAutomationForm, setShowAutomationForm] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const [devices, setDevices] = useState<SmartDevice[]>([
    {
      id: "DEV001",
      name: "HVAC Unit - Main Building Floor 2",
      type: "hvac",
      status: "online",
      zone: "classroom",
      room: "Multiple Classrooms",
      floor: 2,
      building: "Main Building",
      signalStrength: 92,
      lastSeen: new Date(),
      firmwareVersion: "2.4.1",
      isActive: true,
      autoMode: true,
      readings: [
        {
          timestamp: new Date(),
          type: "temperature",
          value: 72,
          unit: "°F",
          status: "normal",
        },
        {
          timestamp: new Date(),
          type: "humidity",
          value: 45,
          unit: "%",
          status: "normal",
        },
        {
          timestamp: new Date(),
          type: "power",
          value: 850,
          unit: "W",
          status: "normal",
        },
      ],
    },
    {
      id: "DEV002",
      name: "Smart Lighting - Library Main Hall",
      type: "lighting",
      status: "online",
      zone: "library",
      room: "Main Hall",
      floor: 1,
      building: "Library",
      signalStrength: 88,
      lastSeen: new Date(),
      firmwareVersion: "1.8.3",
      isActive: true,
      autoMode: true,
      schedule: {
        enabled: true,
        timezone: "America/New_York",
        events: [
          {
            id: "S1",
            name: "Open",
            days: [1, 2, 3, 4, 5],
            time: "07:00",
            action: "turn_on",
            value: 80,
          },
          {
            id: "S2",
            name: "Close",
            days: [1, 2, 3, 4, 5],
            time: "20:00",
            action: "turn_off",
            value: 0,
          },
        ],
      },
      readings: [
        {
          timestamp: new Date(),
          type: "brightness",
          value: 80,
          unit: "%",
          status: "normal",
        },
      ],
    },
    {
      id: "DEV003",
      name: "Security Camera - North Entrance",
      type: "security",
      status: "online",
      zone: "outdoor",
      room: "North Entrance",
      floor: 1,
      building: "Campus",
      signalStrength: 95,
      lastSeen: new Date(),
      firmwareVersion: "3.2.0",
      isActive: true,
      autoMode: false,
      alerts: [],
    },
    {
      id: "DEV004",
      name: "Air Quality Sensor - Science Lab",
      type: "air-quality",
      status: "warning",
      zone: "lab",
      room: "Science Lab A",
      floor: 2,
      building: "Science Building",
      signalStrength: 76,
      lastSeen: new Date(Date.now() - 300000),
      firmwareVersion: "1.5.2",
      isActive: true,
      autoMode: true,
      readings: [
        {
          timestamp: new Date(),
          type: "co2",
          value: 1200,
          unit: "ppm",
          status: "warning",
        },
        {
          timestamp: new Date(),
          type: "pm25",
          value: 15,
          unit: "μg/m³",
          status: "normal",
        },
        {
          timestamp: new Date(),
          type: "voc",
          value: 450,
          unit: "ppb",
          status: "normal",
        },
      ],
      alerts: [
        {
          id: "ALT001",
          type: "warning",
          message: "CO2 levels elevated in Science Lab A",
          timestamp: new Date(Date.now() - 600000),
          resolved: false,
        },
      ],
    },
    {
      id: "DEV005",
      name: "Smart Thermostat - Gymnasium",
      type: "hvac",
      status: "online",
      zone: "gym",
      room: "Gymnasium",
      floor: 1,
      building: "Sports Complex",
      signalStrength: 89,
      lastSeen: new Date(),
      firmwareVersion: "2.1.0",
      isActive: true,
      autoMode: true,
      readings: [
        {
          timestamp: new Date(),
          type: "temperature",
          value: 68,
          unit: "°F",
          status: "normal",
        },
        {
          timestamp: new Date(),
          type: "humidity",
          value: 55,
          unit: "%",
          status: "normal",
        },
      ],
    },
    {
      id: "DEV006",
      name: "Energy Monitor - Cafeteria",
      type: "energy",
      status: "online",
      zone: "cafeteria",
      room: "Main Cafeteria",
      floor: 1,
      building: "Student Center",
      signalStrength: 91,
      lastSeen: new Date(),
      firmwareVersion: "1.3.0",
      isActive: true,
      autoMode: true,
      readings: [
        {
          timestamp: new Date(),
          type: "power",
          value: 12500,
          unit: "W",
          status: "normal",
        },
        {
          timestamp: new Date(),
          type: "voltage",
          value: 240,
          unit: "V",
          status: "normal",
        },
      ],
    },
    {
      id: "DEV007",
      name: "Smart Projector - Auditorium",
      type: "projector",
      status: "offline",
      zone: "auditorium",
      room: "Main Auditorium",
      floor: 1,
      building: "Arts Center",
      signalStrength: 0,
      lastSeen: new Date(Date.now() - 86400000),
      firmwareVersion: "2.0.1",
      isActive: false,
      autoMode: false,
      alerts: [
        {
          id: "ALT002",
          type: "critical",
          message: "Projector offline - check network connection",
          timestamp: new Date(Date.now() - 86400000),
          resolved: false,
        },
      ],
    },
    {
      id: "DEV008",
      name: "Occupancy Sensor - Office 203",
      type: "occupancy",
      status: "online",
      zone: "office",
      room: "Admin Office 203",
      floor: 2,
      building: "Admin Building",
      batteryLevel: 78,
      signalStrength: 85,
      lastSeen: new Date(),
      firmwareVersion: "1.2.5",
      isActive: true,
      autoMode: true,
      readings: [
        {
          timestamp: new Date(),
          type: "occupancy",
          value: 3,
          unit: "people",
          status: "normal",
        },
        {
          timestamp: new Date(),
          type: "motion",
          value: 12,
          unit: "events/hr",
          status: "normal",
        },
      ],
    },
  ]);

  const [environmentalData] = useState<EnvironmentalData[]>([
    {
      zone: "classroom",
      temperature: 72,
      humidity: 45,
      co2: 800,
      pm25: 8,
      noise: 45,
      occupancy: 28,
      lightingLevel: 85,
      timestamp: new Date(),
    },
    {
      zone: "library",
      temperature: 70,
      humidity: 42,
      co2: 600,
      pm25: 6,
      noise: 35,
      occupancy: 45,
      lightingLevel: 90,
      timestamp: new Date(),
    },
    {
      zone: "gym",
      temperature: 68,
      humidity: 55,
      co2: 900,
      pm25: 10,
      noise: 65,
      occupancy: 60,
      lightingLevel: 95,
      timestamp: new Date(),
    },
    {
      zone: "cafeteria",
      temperature: 71,
      humidity: 48,
      co2: 1100,
      pm25: 12,
      noise: 70,
      occupancy: 120,
      lightingLevel: 88,
      timestamp: new Date(),
    },
    {
      zone: "lab",
      temperature: 69,
      humidity: 40,
      co2: 1200,
      pm25: 15,
      noise: 50,
      occupancy: 20,
      lightingLevel: 92,
      timestamp: new Date(),
    },
  ]);

  const [energyData] = useState<EnergyUsage[]>([
    {
      timestamp: new Date(Date.now() - 86400000),
      building: "All Buildings",
      totalKwh: 2850,
      peakKw: 145,
      cost: 342,
      devices: [
        {
          deviceId: "DEV001",
          deviceName: "HVAC Main Building",
          kwh: 850,
          percentage: 29.8,
        },
        {
          deviceId: "DEV006",
          deviceName: "Cafeteria",
          kwh: 650,
          percentage: 22.8,
        },
        {
          deviceId: "DEV005",
          deviceName: "Gymnasium",
          kwh: 420,
          percentage: 14.7,
        },
      ],
    },
  ]);

  const [automationRules] = useState<AutomationRule[]>([
    {
      id: "RULE001",
      name: "After Hours Energy Saver",
      enabled: true,
      trigger: { type: "time", condition: "20:00" },
      actions: [
        { deviceId: "DEV002", action: "turn_off", value: 0 },
        { deviceId: "DEV001", action: "set_eco_mode", value: true, delay: 300 },
      ],
      lastTriggered: new Date(Date.now() - 43200000),
      triggerCount: 245,
    },
    {
      id: "RULE002",
      name: "CO2 Auto Ventilation",
      enabled: true,
      trigger: { type: "sensor", condition: "co2 > 1000", deviceId: "DEV004" },
      actions: [
        { deviceId: "DEV001", action: "increase_ventilation", value: 80 },
      ],
      lastTriggered: new Date(Date.now() - 1800000),
      triggerCount: 18,
    },
    {
      id: "RULE003",
      name: "Unoccupied Room Lighting",
      enabled: true,
      trigger: {
        type: "occupancy",
        condition: "no_motion_30min",
        deviceId: "DEV008",
      },
      actions: [{ deviceId: "DEV002", action: "dim", value: 20 }],
      lastTriggered: new Date(Date.now() - 7200000),
      triggerCount: 89,
    },
  ]);

  const deviceTypeIcons: Record<DeviceType, any> = {
    hvac: Thermometer,
    lighting: Lightbulb,
    security: Shield,
    energy: Zap,
    water: Droplets,
    "air-quality": Wind,
    occupancy: User,
    projector: Tv,
    computer: Cpu,
    door: Lock,
  };

  const deviceStatusColors: Record<DeviceStatus, string> = {
    online: "bg-green-100 text-green-700",
    offline: "bg-red-100 text-red-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-red-200 text-red-800",
    maintenance: "bg-blue-100 text-blue-700",
  };

  const alertTypeColors = {
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    critical: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZone === "all" || device.zone === selectedZone;
    const matchesBuilding =
      selectedBuilding === "all" || device.building === selectedBuilding;
    return matchesSearch && matchesZone && matchesBuilding;
  });

  const handleDeviceToggle = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId ? { ...d, isActive: !d.isActive } : d,
      ),
    );
  };

  const handleAcknowledgeAlert = (deviceId: string, alertId: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              alerts: d.alerts?.map((a) =>
                a.id === alertId
                  ? { ...a, resolved: true, resolvedAt: new Date() }
                  : a,
              ),
            }
          : d,
      ),
    );
  };

  const getStatusIcon = (status: DeviceStatus) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "offline":
        return <X className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "maintenance":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Cpu className="h-8 w-8 text-indigo-600" />
            IoT Smart Campus
          </h2>
          <p className="mt-1 text-slate-600">
            Intelligent building management and automation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-sm">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <button
            onClick={() => setLastUpdate(new Date())}
            className="p-2 text-slate-600 transition-colors hover:text-indigo-600"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          {
            label: "Online Devices",
            value: devices.filter((d) => d.status === "online").length,
            total: devices.length,
            color: "bg-green-500",
            icon: Wifi,
          },
          {
            label: "Active Alerts",
            value: devices.reduce(
              (sum, d) =>
                sum + (d.alerts?.filter((a) => !a.resolved).length || 0),
              0,
            ),
            color: "bg-amber-500",
            icon: AlertTriangle,
          },
          {
            label: "Daily Energy",
            value: `${energyData[0]?.totalKwh || 0} kWh`,
            color: "bg-blue-500",
            icon: Zap,
          },
          {
            label: "Avg Temperature",
            value: `${Math.round(environmentalData.reduce((sum, d) => sum + d.temperature, 0) / environmentalData.length)}°F`,
            color: "bg-red-500",
            icon: Thermometer,
          },
          {
            label: "Automation Rules",
            value: automationRules.filter((r) => r.enabled).length,
            total: automationRules.length,
            color: "bg-purple-500",
            icon: Activity,
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
            <p className="font-bold text-2xl text-slate-900">
              {stat.value}
              {stat.total && (
                <span className="font-normal text-base text-slate-400">
                  /{stat.total}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "dashboard", label: "Dashboard", icon: Activity },
          { id: "devices", label: "Devices", icon: Cpu },
          { id: "energy", label: "Energy", icon: Zap },
          { id: "environment", label: "Environment", icon: Thermometer },
          { id: "automation", label: "Automation", icon: RefreshCw },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 border-b-2 text-indigo-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-900">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Active Alerts
              </h3>
              <div className="space-y-3">
                {devices
                  .flatMap((d) =>
                    (d.alerts || [])
                      .filter((a) => !a.resolved)
                      .map((a) => ({
                        ...a,
                        deviceName: d.name,
                        deviceId: d.id,
                      })),
                  )
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-lg border p-4 ${alertTypeColors[alert.type]}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm opacity-80">
                            {alert.deviceName} •{" "}
                            {alert.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleAcknowledgeAlert(alert.deviceId, alert.id)
                          }
                          className="rounded bg-white/50 px-3 py-1 text-sm transition-colors hover:bg-white"
                        >
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  ))}
                {devices.filter((d) => d.alerts?.some((a) => !a.resolved))
                  .length === 0 && (
                  <div className="py-8 text-center text-slate-500">
                    <CheckCircle className="mx-auto mb-2 h-12 w-12 text-green-500" />
                    <p>No active alerts</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-900">
                <Wind className="h-5 w-5 text-blue-500" />
                Environmental Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Avg Temperature</p>
                  <p className="font-bold text-2xl text-slate-900">
                    {Math.round(
                      environmentalData.reduce(
                        (sum, d) => sum + d.temperature,
                        0,
                      ) / environmentalData.length,
                    )}
                    °F
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Avg Humidity</p>
                  <p className="font-bold text-2xl text-slate-900">
                    {Math.round(
                      environmentalData.reduce(
                        (sum, d) => sum + d.humidity,
                        0,
                      ) / environmentalData.length,
                    )}
                    %
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Avg CO2</p>
                  <p className="font-bold text-2xl text-slate-900">
                    {Math.round(
                      environmentalData.reduce((sum, d) => sum + d.co2, 0) /
                        environmentalData.length,
                    )}{" "}
                    ppm
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Total Occupancy</p>
                  <p className="font-bold text-2xl text-slate-900">
                    {environmentalData.reduce((sum, d) => sum + d.occupancy, 0)}{" "}
                    people
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="mb-4 font-semibold text-lg text-slate-900">
              Device Status Overview
            </h3>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(
                devices.reduce(
                  (acc, device) => {
                    acc[device.status] = (acc[device.status] || 0) + 1;
                    return acc;
                  },
                  {} as Record<DeviceStatus, number>,
                ),
              ).map(([status, count]) => (
                <div key={status} className="text-center">
                  <div
                    className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full ${deviceStatusColors[status as DeviceStatus]}`}
                  >
                    {getStatusIcon(status as DeviceStatus)}
                  </div>
                  <p className="font-bold text-2xl text-slate-900">{count}</p>
                  <p className="text-slate-500 text-sm capitalize">{status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "devices" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search devices..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedZone}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedZone(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Zones</option>
              {[
                "classroom",
                "library",
                "lab",
                "gym",
                "cafeteria",
                "office",
                "outdoor",
                "auditorium",
              ].map((zone) => (
                <option key={zone} value={zone}>
                  {zone.charAt(0).toUpperCase() + zone.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={selectedBuilding}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedBuilding(e.target.value)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Buildings</option>
              {Array.from(new Set(devices.map((d) => d.building))).map(
                (building) => (
                  <option key={building} value={building}>
                    {building}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredDevices.map((device) => {
                const Icon = deviceTypeIcons[device.type] || Activity;
                return (
                  <motion.div
                    key={device.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg"
                  >
                    <div className="p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`rounded-lg p-2 ${deviceStatusColors[device.status]}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-sm">
                              {device.name}
                            </h3>
                            <p className="text-slate-500 text-xs">
                              {device.building} • Floor {device.floor}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`h-2 w-2 rounded-full ${
                            device.status === "online"
                              ? "bg-green-500"
                              : device.status === "warning"
                                ? "bg-amber-500"
                                : device.status === "offline"
                                  ? "bg-red-500"
                                  : "bg-slate-500"
                          }`}
                        />
                      </div>

                      <div className="mb-3 flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${deviceStatusColors[device.status]}`}
                        >
                          {device.status}
                        </span>
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Wifi className="h-3 w-3" />
                          {device.signalStrength}%
                        </div>
                      </div>

                      {device.readings && device.readings.length > 0 && (
                        <div className="mb-3 space-y-1">
                          {device.readings.slice(0, 2).map((reading, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-slate-600 capitalize">
                                {reading.type}
                              </span>
                              <span
                                className={`font-medium ${
                                  reading.status === "normal"
                                    ? "text-green-600"
                                    : reading.status === "warning"
                                      ? "text-amber-600"
                                      : "text-red-600"
                                }`}
                              >
                                {reading.value} {reading.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={device.isActive}
                            onChange={() => handleDeviceToggle(device.id)}
                            className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-slate-700 text-sm">Active</span>
                        </label>
                        <button
                          onClick={() => {
                            setSelectedDevice(device);
                            setShowDeviceDetails(true);
                          }}
                          className="text-indigo-600 text-sm hover:text-indigo-800"
                        >
                          Details →
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

      {activeTab === "environment" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {environmentalData.map((data) => (
            <motion.div
              key={data.zone}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
            >
              <h3 className="mb-4 font-bold text-lg text-slate-900 capitalize">
                {data.zone}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <Thermometer className="mx-auto mb-1 h-5 w-5 text-red-500" />
                  <p className="text-slate-500 text-sm">Temperature</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {data.temperature}°F
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <Droplets className="mx-auto mb-1 h-5 w-5 text-blue-500" />
                  <p className="text-slate-500 text-sm">Humidity</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {data.humidity}%
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <Wind className="mx-auto mb-1 h-5 w-5 text-green-500" />
                  <p className="text-slate-500 text-sm">CO2</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {data.co2} ppm
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <Activity className="mx-auto mb-1 h-5 w-5 text-purple-500" />
                  <p className="text-slate-500 text-sm">PM2.5</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {data.pm25}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <User className="mx-auto mb-1 h-5 w-5 text-amber-500" />
                  <p className="text-slate-500 text-sm">Occupancy</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {data.occupancy}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <Lightbulb className="mx-auto mb-1 h-5 w-5 text-yellow-500" />
                  <p className="text-slate-500 text-sm">Lighting</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {data.lightingLevel}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "energy" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="mb-4 font-semibold text-lg text-slate-900">
              Energy Usage - Last 24 Hours
            </h3>
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-slate-50 p-4 text-center">
                <p className="text-slate-500 text-sm">Total Consumption</p>
                <p className="font-bold text-3xl text-slate-900">
                  {energyData[0]?.totalKwh || 0} kWh
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-center">
                <p className="text-slate-500 text-sm">Peak Load</p>
                <p className="font-bold text-3xl text-slate-900">
                  {energyData[0]?.peakKw || 0} kW
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-center">
                <p className="text-slate-500 text-sm">Estimated Cost</p>
                <p className="font-bold text-3xl text-green-600">
                  ${energyData[0]?.cost || 0}
                </p>
              </div>
            </div>

            <h4 className="mb-3 font-medium text-slate-900">
              Top Energy Consumers
            </h4>
            <div className="space-y-3">
              {energyData[0]?.devices.map((device, idx) => (
                <div
                  key={device.deviceId}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 text-sm">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-900">
                      {device.deviceName}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {device.kwh} kWh
                    </p>
                    <p className="text-slate-500 text-sm">
                      {device.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "automation" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-900">
              Automation Rules
            </h3>
            <button
              onClick={() => setShowAutomationForm(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
            >
              + New Rule
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {automationRules.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {rule.name}
                    </h4>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        rule.enabled
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      className="peer sr-only"
                      readOnly
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                  </label>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">Trigger:</span>
                    <span className="font-medium text-slate-700 capitalize">
                      {rule.trigger.type}
                    </span>
                    <span className="text-slate-600">
                      ({rule.trigger.condition})
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">Actions: </span>
                    <span className="text-slate-700">
                      {rule.actions.length} device
                      {rule.actions.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-slate-200 border-t pt-3 text-slate-500 text-xs">
                  <span>
                    Last triggered:{" "}
                    {rule.lastTriggered?.toLocaleString() || "Never"}
                  </span>
                  <span>Triggered {rule.triggerCount} times</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {showDeviceDetails && selectedDevice && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDeviceDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg p-3 ${deviceStatusColors[selectedDevice.status]}`}
                  >
                    {(() => {
                      const Icon =
                        deviceTypeIcons[selectedDevice.type] || Activity;
                      return <Icon className="h-6 w-6" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl">
                      {selectedDevice.name}
                    </h3>
                    <p className="text-slate-600">
                      {selectedDevice.building} • {selectedDevice.room}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeviceDetails(false)}
                  className="rounded-full p-2 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="mb-1 text-slate-500 text-sm">Status</p>
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-sm ${deviceStatusColors[selectedDevice.status]}`}
                  >
                    {selectedDevice.status.toUpperCase()}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="mb-1 text-slate-500 text-sm">Signal</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {selectedDevice.signalStrength}%
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="mb-1 text-slate-500 text-sm">Firmware</p>
                  <p className="font-bold text-slate-900 text-xl">
                    {selectedDevice.firmwareVersion}
                  </p>
                </div>
              </div>

              {selectedDevice.readings &&
                selectedDevice.readings.length > 0 && (
                  <div>
                    <h4 className="mb-3 font-semibold text-slate-900">
                      Current Readings
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedDevice.readings.map((reading, idx) => (
                        <div key={idx} className="rounded-lg bg-slate-50 p-3">
                          <p className="text-slate-500 text-sm capitalize">
                            {reading.type}
                          </p>
                          <p
                            className={`font-bold text-xl ${
                              reading.status === "normal"
                                ? "text-green-600"
                                : reading.status === "warning"
                                  ? "text-amber-600"
                                  : "text-red-600"
                            }`}
                          >
                            {reading.value} {reading.unit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedDevice.alerts && selectedDevice.alerts.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-slate-900">Alerts</h4>
                  <div className="space-y-2">
                    {selectedDevice.alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`rounded-lg border p-3 ${alertTypeColors[alert.type]} ${
                          alert.resolved ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-sm opacity-80">
                              {alert.timestamp.toLocaleString()}
                            </p>
                          </div>
                          {!alert.resolved && (
                            <button
                              onClick={() =>
                                handleAcknowledgeAlert(
                                  selectedDevice.id,
                                  alert.id,
                                )
                              }
                              className="rounded bg-white/50 px-3 py-1 text-sm transition-colors hover:bg-white"
                            >
                              Acknowledge
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDevice.isActive}
                    onChange={() => handleDeviceToggle(selectedDevice.id)}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700">Device Active</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDevice.autoMode}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                    readOnly
                  />
                  <span className="text-slate-700">Auto Mode</span>
                </label>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
