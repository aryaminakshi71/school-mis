import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Battery,
  Bus,
  Clock,
  Edit2,
  Fuel,
  Info,
  MapPin,
  MoreVertical,
  Navigation,
  Plus,
  Route,
  Search,
  Shield,
  Signal,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";

interface BusRoute {
  id: string;
  name: string;
  routeNumber: string;
  stops: BusStop[];
  totalDistance: number;
  estimatedTime: number;
  active: boolean;
}

interface BusStop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  arrivalTime: string;
  students: number;
}

interface Bus {
  id: string;
  number: string;
  model: string;
  capacity: number;
  driver: Driver;
  attendant?: Attendant;
  routeId: string;
  status: "active" | "maintenance" | "inactive";
  fuelLevel: number;
  lastMaintenance: string;
  nextMaintenance: string;
  gpsLocation?: {
    lat: number;
    lng: number;
    lastUpdated: string;
  };
  students: number;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  photo?: string;
  rating: number;
}

interface Attendant {
  id: string;
  name: string;
  phone: string;
  photo?: string;
}

interface TransportStudent {
  id: string;
  name: string;
  class: string;
  photo?: string;
  stopId: string;
  parentPhone: string;
  busId: string;
  feePaid: boolean;
  pickupTime?: string;
  dropTime?: string;
}

interface Alert {
  id: string;
  type: "delay" | "breakdown" | "accident" | "route_change" | "maintenance";
  busId: string;
  message: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
  resolved: boolean;
}

interface TransportManagementProps {
  className?: string;
}

const defaultRoutes: BusRoute[] = [
  {
    id: "1",
    name: "North Route",
    routeNumber: "R001",
    stops: [
      {
        id: "s1",
        name: "City Center",
        address: "Main Square",
        latitude: 28.6139,
        longitude: 77.209,
        arrivalTime: "07:00",
        students: 12,
      },
      {
        id: "s2",
        name: "Green Park",
        address: "Park Road",
        latitude: 28.62,
        longitude: 77.215,
        arrivalTime: "07:15",
        students: 8,
      },
      {
        id: "s3",
        name: "Metro Station",
        address: "Metro Gate 2",
        latitude: 28.625,
        longitude: 77.22,
        arrivalTime: "07:30",
        students: 15,
      },
    ],
    totalDistance: 12.5,
    estimatedTime: 45,
    active: true,
  },
  {
    id: "2",
    name: "South Route",
    routeNumber: "R002",
    stops: [
      {
        id: "s4",
        name: "Market Area",
        address: "Main Market",
        latitude: 28.58,
        longitude: 77.2,
        arrivalTime: "07:05",
        students: 10,
      },
      {
        id: "s5",
        name: "Residential Complex",
        address: "Phase 2",
        latitude: 28.575,
        longitude: 77.195,
        arrivalTime: "07:20",
        students: 18,
      },
      {
        id: "s6",
        name: "School Zone",
        address: "Education Hub",
        latitude: 28.57,
        longitude: 77.19,
        arrivalTime: "07:35",
        students: 22,
      },
    ],
    totalDistance: 15.2,
    estimatedTime: 50,
    active: true,
  },
];

const defaultBuses: Bus[] = [
  {
    id: "1",
    number: "BUS-101",
    model: "Tata Starbus",
    capacity: 40,
    driver: {
      id: "d1",
      name: "Rajesh Kumar",
      phone: "+91-98765-43210",
      licenseNumber: "DL-0123456789",
      rating: 4.8,
    },
    attendant: {
      id: "a1",
      name: "Sunita Devi",
      phone: "+91-98765-43211",
    },
    routeId: "1",
    status: "active",
    fuelLevel: 75,
    lastMaintenance: "2024-02-15",
    nextMaintenance: "2024-04-15",
    gpsLocation: {
      lat: 28.615,
      lng: 77.21,
      lastUpdated: new Date().toISOString(),
    },
    students: 35,
  },
  {
    id: "2",
    number: "BUS-102",
    model: "Ashok Leyland",
    capacity: 50,
    driver: {
      id: "d2",
      name: "Mohan Singh",
      phone: "+91-98765-43212",
      licenseNumber: "DL-0987654321",
      rating: 4.6,
    },
    routeId: "2",
    status: "active",
    fuelLevel: 60,
    lastMaintenance: "2024-03-01",
    nextMaintenance: "2024-05-01",
    gpsLocation: {
      lat: 28.58,
      lng: 77.195,
      lastUpdated: new Date().toISOString(),
    },
    students: 42,
  },
  {
    id: "3",
    number: "BUS-103",
    model: "Volvo 8400",
    capacity: 45,
    driver: {
      id: "d3",
      name: "Suresh Patel",
      phone: "+91-98765-43213",
      licenseNumber: "DL-1122334455",
      rating: 4.9,
    },
    routeId: "1",
    status: "maintenance",
    fuelLevel: 30,
    lastMaintenance: "2024-03-25",
    nextMaintenance: "2024-03-28",
    students: 0,
  },
];

const defaultStudents: TransportStudent[] = [
  {
    id: "1",
    name: "Rahul Kumar",
    class: "10-A",
    stopId: "s1",
    parentPhone: "+91-99999-11111",
    busId: "1",
    feePaid: true,
    pickupTime: "07:00",
    dropTime: "15:30",
  },
  {
    id: "2",
    name: "Priya Sharma",
    class: "9-B",
    stopId: "s2",
    parentPhone: "+91-99999-22222",
    busId: "1",
    feePaid: true,
    pickupTime: "07:15",
    dropTime: "15:30",
  },
  {
    id: "3",
    name: "Amit Singh",
    class: "8-A",
    stopId: "s4",
    parentPhone: "+91-99999-33333",
    busId: "2",
    feePaid: false,
    pickupTime: "07:05",
    dropTime: "15:45",
  },
];

const defaultAlerts: Alert[] = [
  {
    id: "1",
    type: "delay",
    busId: "1",
    message: "Bus running 15 minutes late due to traffic",
    severity: "medium",
    timestamp: new Date().toISOString(),
    resolved: false,
  },
  {
    id: "2",
    type: "maintenance",
    busId: "3",
    message: "Scheduled maintenance completed",
    severity: "low",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    resolved: true,
  },
];

export function TransportManagement({ className }: TransportManagementProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "buses" | "routes" | "students" | "tracking"
  >("overview");
  const [routes, setRoutes] = useState<BusRoute[]>(defaultRoutes);
  const [buses, setBuses] = useState<Bus[]>(defaultBuses);
  const [students, setStudents] = useState<TransportStudent[]>(defaultStudents);
  const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [showAddBusModal, setShowAddBusModal] = useState(false);

  const totalStudents = students.length;
  const totalBuses = buses.length;
  const activeBuses = buses.filter((b) => b.status === "active").length;
  const totalRoutes = routes.length;
  const pendingFees = students.filter((s) => !s.feePaid).length;

  const filteredBuses = buses.filter(
    (bus) =>
      bus.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.driver.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      maintenance:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      inactive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getAlertIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      delay: Clock,
      breakdown: AlertTriangle,
      accident: AlertCircle,
      route_change: Route,
      maintenance: Wrench,
    };
    return icons[type] || Info;
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <Bus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
              Transport Management
            </h2>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Fleet tracking & student transportation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddBusModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Bus
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Total Buses
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                {totalBuses}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Bus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-green-600 text-xs">{activeBuses} Active</span>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-yellow-600">
              {totalBuses - activeBuses} Inactive
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Students Transported
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                {totalStudents}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-red-600 text-xs">
              {pendingFees} Pending Fees
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Active Routes
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                {totalRoutes}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Route className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-gray-500 text-xs">Avg. 45 min per route</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Fleet Health
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                85%
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-yellow-600">
              1 Bus in maintenance
            </span>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.filter((a) => !a.resolved).length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-900 dark:text-red-400">
              Active Alerts
            </h3>
          </div>
          <div className="space-y-2">
            {alerts
              .filter((a) => !a.resolved)
              .map((alert) => {
                const Icon = getAlertIcon(alert.type);
                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 rounded-lg bg-white p-3 dark:bg-gray-800"
                  >
                    <div
                      className={`rounded-lg p-2 ${
                        alert.severity === "high"
                          ? "bg-red-100 text-red-600"
                          : alert.severity === "medium"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm dark:text-white">
                        {alert.message}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Bus {buses.find((b) => b.id === alert.busId)?.number} •{" "}
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setAlerts(
                          alerts.map((a) =>
                            a.id === alert.id ? { ...a, resolved: true } : a,
                          ),
                        );
                      }}
                      className="rounded-lg bg-green-100 px-3 py-1 text-green-700 text-xs hover:bg-green-200"
                    >
                      Resolve
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {[
          { id: "overview", label: "Overview", icon: Bus },
          { id: "buses", label: "Fleet", icon: Bus },
          { id: "routes", label: "Routes", icon: Route },
          { id: "students", label: "Students", icon: Users },
          { id: "tracking", label: "Live Tracking", icon: Navigation },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "bg-white text-primary shadow-sm dark:bg-gray-700"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            {/* Bus Status */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Bus className="h-5 w-5 text-primary" />
                Fleet Status
              </h3>
              <div className="space-y-3">
                {buses.map((bus) => (
                  <div
                    key={bus.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Bus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {bus.number}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {bus.driver.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Fuel className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 text-sm dark:text-gray-400">
                          {bus.fuelLevel}%
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 font-medium text-xs ${getStatusColor(
                          bus.status,
                        )}`}
                      >
                        {bus.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Clock className="h-5 w-5 text-primary" />
                Today's Schedule
              </h3>
              <div className="space-y-3">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {route.name}
                      </p>
                      <span className="text-gray-500 text-xs">
                        {route.routeNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 text-sm dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {route.stops.length} stops
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {route.estimatedTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {route.stops.reduce(
                          (acc, stop) => acc + stop.students,
                          0,
                        )}{" "}
                        students
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "buses" && (
          <motion.div
            key="buses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <div className="border-gray-200 border-b p-4 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search buses..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                      }
                      className="w-full rounded-lg border-0 bg-gray-100 py-2 pr-4 pl-9 text-sm dark:bg-gray-700"
                    />
                  </div>
                  <select className="rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm dark:bg-gray-700">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBuses.map((bus) => (
                  <div
                    key={bus.id}
                    className="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                          <Bus className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {bus.number}
                            </h4>
                            <span
                              className={`rounded-full px-2 py-0.5 font-medium text-xs ${getStatusColor(
                                bus.status,
                              )}`}
                            >
                              {bus.status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm dark:text-gray-400">
                            {bus.model} • Capacity: {bus.capacity}
                          </p>
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Driver: {bus.driver.name}
                            </span>
                            {bus.attendant && (
                              <span className="text-gray-600 dark:text-gray-400">
                                Attendant: {bus.attendant.name}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <Fuel className="h-4 w-4" />
                              {bus.fuelLevel}%
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <Wrench className="h-4 w-4" />
                              Next:{" "}
                              {new Date(
                                bus.nextMaintenance,
                              ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <Users className="h-4 w-4" />
                              {bus.students} students
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Edit2 className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "tracking" && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Navigation className="h-5 w-5 text-primary" />
                Live GPS Tracking
              </h3>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <Signal className="h-4 w-4" />
                  GPS Active
                </span>
              </div>
            </div>

            {/* Simulated Map View */}
            <div className="relative h-96 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700">
              {/* Simulated Map Grid */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
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
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Bus Markers */}
              {buses
                .filter((b) => b.status === "active" && b.gpsLocation)
                .map((bus) => (
                  <motion.div
                    key={bus.id}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 70 + 15}%`,
                      top: `${Math.random() * 70 + 15}%`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-lg dark:border-gray-800">
                        <Bus className="h-5 w-5 text-white" />
                      </div>
                      <div className="-bottom-8 -translate-x-1/2 absolute left-1/2 whitespace-nowrap rounded-lg bg-white px-2 py-1 text-xs shadow-lg dark:bg-gray-800">
                        <p className="font-medium">{bus.number}</p>
                        <p className="text-gray-500">{bus.students} students</p>
                      </div>
                      {/* Pulse Effect */}
                      <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-30" />
                    </div>
                  </motion.div>
                ))}

              {/* Route Lines (Simulated) */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full">
                <path
                  d="M 100 200 Q 200 100 300 200 T 500 200"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  className="opacity-50"
                />
                <path
                  d="M 150 300 Q 300 250 450 300"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  className="opacity-50"
                />
              </svg>

              {/* Stops */}
              {routes
                .flatMap((r) => r.stops)
                .map((stop, idx) => (
                  <div
                    key={stop.id}
                    className="absolute h-3 w-3 rounded-full border-2 border-white bg-gray-400 dark:border-gray-800"
                    style={{
                      left: `${20 + idx * 15}%`,
                      top: `${30 + (idx % 2) * 40}%`,
                    }}
                    title={stop.name}
                  />
                ))}
            </div>

            {/* Bus List with Live Status */}
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Active Buses
              </h4>
              {buses
                .filter((b) => b.status === "active")
                .map((bus) => (
                  <div
                    key={bus.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                          <Bus className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="-bottom-1 -right-1 absolute h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-800" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm dark:text-white">
                          {bus.number}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {bus.driver.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Battery className="h-4 w-4" />
                        {bus.fuelLevel}%
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Signal className="h-4 w-4" />
                        Live
                      </div>
                      <span className="text-gray-500">
                        Updated {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
