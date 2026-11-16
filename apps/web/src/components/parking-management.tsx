import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  MapPin,
  ParkingSquare,
  Search,
  Shield,
  X,
} from "lucide-react";
import { useState } from "react";

export type ParkingType =
  | "student"
  | "teacher"
  | "visitor"
  | "handicap"
  | "ev"
  | "staff"
  | "temporary";
export type ParkingStatus =
  | "available"
  | "occupied"
  | "reserved"
  | "maintenance"
  | "blocked";
export type PermitStatus = "active" | "expired" | "suspended" | "pending";

export interface ParkingSpot {
  id: string;
  number: string;
  type: ParkingType;
  status: ParkingStatus;
  zone: string;
  building: string;
  floor?: number;
  isCovered: boolean;
  hasEVCharging: boolean;
  isAccessible: boolean;
  currentVehicle?: Vehicle;
  reservation?: Reservation;
  lastUpdated: Date;
  coordinates?: { lat: number; lng: number };
}

export interface Vehicle {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerType: "student" | "teacher" | "staff" | "visitor";
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  year: number;
  permitId?: string;
}

export interface ParkingPermit {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerType: "student" | "teacher" | "staff" | "visitor";
  type: ParkingType;
  status: PermitStatus;
  startDate: Date;
  expiryDate: Date;
  zone: string;
  building: string;
  spots: string[];
  fee: number;
  paymentStatus: "paid" | "pending" | "overdue";
  violations: ParkingViolation[];
}

export interface ParkingViolation {
  id: string;
  vehicleId: string;
  licensePlate: string;
  spotId: string;
  type:
    | "expired-permit"
    | "wrong-zone"
    | "no-permit"
    | "overtime"
    | "handicap-without-badge"
    | "fire-lane"
    | "other";
  description: string;
  date: Date;
  fine: number;
  status: "pending" | "paid" | "appealed" | "dismissed";
  photo?: string;
  issuedBy: string;
}

export interface Reservation {
  id: string;
  spotId: string;
  userId: string;
  userName: string;
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  purpose: string;
  status: "active" | "completed" | "cancelled" | "expired";
  createdAt: Date;
}

export interface ParkingAnalytics {
  date: Date;
  totalSpots: number;
  occupiedSpots: number;
  peakHour: string;
  peakOccupancy: number;
  revenue: number;
  violations: number;
}

interface ParkingManagementProps {
  userRole?: "admin" | "security" | "teacher" | "student" | "staff";
  userId?: string;
  onAssignPermit?: (
    permit: Omit<ParkingPermit, "id" | "status" | "violations">,
  ) => Promise<string>;
  onReserveSpot?: (
    reservation: Omit<Reservation, "id" | "status" | "createdAt">,
  ) => Promise<string>;
  onRecordViolation?: (
    violation: Omit<ParkingViolation, "id" | "date" | "status">,
  ) => Promise<void>;
  onUpdateSpotStatus?: (spotId: string, status: ParkingStatus) => Promise<void>;
}

export function ParkingManagement({
  userRole = "student",
  userId = "S001",
  onAssignPermit,
  onReserveSpot,
  onRecordViolation,
  onUpdateSpotStatus,
}: ParkingManagementProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "spots" | "permits" | "violations" | "reservations"
  >("overview");
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [selectedPermit, setSelectedPermit] = useState<ParkingPermit | null>(
    null,
  );
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterZone, setFilterZone] = useState<string>("all");
  const [filterType, setFilterType] = useState<ParkingType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ParkingStatus | "all">(
    "all",
  );

  const [spots, setSpots] = useState<ParkingSpot[]>([
    {
      id: "P001",
      number: "A-101",
      type: "student",
      status: "occupied",
      zone: "Zone A",
      building: "Main Building",
      isCovered: false,
      hasEVCharging: false,
      isAccessible: false,
      lastUpdated: new Date(),
    },
    {
      id: "P002",
      number: "A-102",
      type: "student",
      status: "available",
      zone: "Zone A",
      building: "Main Building",
      isCovered: false,
      hasEVCharging: false,
      isAccessible: false,
      lastUpdated: new Date(),
    },
    {
      id: "P003",
      number: "A-103",
      type: "student",
      status: "available",
      zone: "Zone A",
      building: "Main Building",
      isCovered: false,
      hasEVCharging: false,
      isAccessible: true,
      lastUpdated: new Date(),
    },
    {
      id: "P004",
      number: "B-201",
      type: "teacher",
      status: "occupied",
      zone: "Zone B",
      building: "Academic Block",
      isCovered: true,
      hasEVCharging: true,
      isAccessible: false,
      lastUpdated: new Date(),
    },
    {
      id: "P005",
      number: "B-202",
      type: "teacher",
      status: "available",
      zone: "Zone B",
      building: "Academic Block",
      isCovered: true,
      hasEVCharging: false,
      isAccessible: false,
      lastUpdated: new Date(),
    },
    {
      id: "P006",
      number: "V-001",
      type: "visitor",
      status: "available",
      zone: "Visitor Zone",
      building: "Main Entrance",
      isCovered: false,
      hasEVCharging: false,
      isAccessible: true,
      lastUpdated: new Date(),
    },
    {
      id: "P007",
      number: "H-001",
      type: "handicap",
      status: "occupied",
      zone: "Zone A",
      building: "Main Building",
      isCovered: false,
      hasEVCharging: false,
      isAccessible: true,
      lastUpdated: new Date(),
    },
    {
      id: "P008",
      number: "EV-001",
      type: "ev",
      status: "available",
      zone: "EV Zone",
      building: "Science Building",
      isCovered: true,
      hasEVCharging: true,
      isAccessible: false,
      lastUpdated: new Date(),
    },
    {
      id: "P009",
      number: "EV-002",
      type: "ev",
      status: "maintenance",
      zone: "EV Zone",
      building: "Science Building",
      isCovered: true,
      hasEVCharging: true,
      isAccessible: false,
      lastUpdated: new Date(),
    },
  ]);

  const [permits] = useState<ParkingPermit[]>([
    {
      id: "PERM001",
      ownerId: "S001",
      ownerName: "Emma Johnson",
      ownerType: "student",
      type: "student",
      status: "active",
      startDate: new Date(Date.now() - 2592000000),
      expiryDate: new Date(Date.now() + 23328000000),
      zone: "Zone A",
      building: "Main Building",
      spots: ["P001"],
      fee: 150,
      paymentStatus: "paid",
      violations: [],
    },
    {
      id: "PERM002",
      ownerId: "T001",
      ownerName: "Dr. Sarah Chen",
      ownerType: "teacher",
      type: "teacher",
      status: "active",
      startDate: new Date(Date.now() - 15552000000),
      expiryDate: new Date(Date.now() + 18144000000),
      zone: "Zone B",
      building: "Academic Block",
      spots: ["P004"],
      fee: 0,
      paymentStatus: "paid",
      violations: [],
    },
  ]);

  const [violations] = useState<ParkingViolation[]>([
    {
      id: "VIO001",
      vehicleId: "VEH001",
      licensePlate: "ABC-1234",
      spotId: "P002",
      type: "expired-permit",
      description: "Vehicle parked with expired permit",
      date: new Date(Date.now() - 172800000),
      fine: 50,
      status: "pending",
      issuedBy: "Security Officer Johnson",
    },
  ]);

  const [reservations] = useState<Reservation[]>([
    {
      id: "RES001",
      spotId: "P008",
      userId: "S002",
      userName: "Marcus Chen",
      vehicleId: "VEH002",
      startTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 7200000),
      purpose: "After-school club meeting",
      status: "active",
      createdAt: new Date(Date.now() - 86400000),
    },
  ]);

  const [analytics] = useState<ParkingAnalytics>({
    date: new Date(),
    totalSpots: 120,
    occupiedSpots: 87,
    peakHour: "12:00 PM",
    peakOccupancy: 85,
    revenue: 2250,
    violations: 3,
  });

  const statusColors: Record<ParkingStatus, string> = {
    available: "bg-green-500",
    occupied: "bg-red-500",
    reserved: "bg-blue-500",
    maintenance: "bg-amber-500",
    blocked: "bg-slate-500",
  };

  const typeLabels: Record<ParkingType, string> = {
    student: "Student",
    teacher: "Teacher",
    visitor: "Visitor",
    handicap: "Handicap",
    ev: "EV Charging",
    staff: "Staff",
    temporary: "Temporary",
  };

  const filteredSpots = spots.filter((spot) => {
    const matchesSearch =
      spot.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = filterZone === "all" || spot.zone === filterZone;
    const matchesType = filterType === "all" || spot.type === filterType;
    const matchesStatus =
      filterStatus === "all" || spot.status === filterStatus;
    return matchesSearch && matchesZone && matchesType && matchesStatus;
  });

  const zones = Array.from(new Set(spots.map((s) => s.zone)));
  const occupancyRate = Math.round(
    (analytics.occupiedSpots / analytics.totalSpots) * 100,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Car className="h-8 w-8 text-blue-600" />
            Parking Management
          </h2>
          <p className="mt-1 text-slate-600">
            Smart parking system and permits
          </p>
        </div>
        {userRole === "student" && (
          <button
            onClick={() => setShowReserveModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Calendar className="h-5 w-5" />
            Reserve Spot
          </button>
        )}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          {
            label: "Total Spots",
            value: analytics.totalSpots,
            color: "bg-slate-500",
            icon: ParkingSquare,
          },
          {
            label: "Available",
            value: analytics.totalSpots - analytics.occupiedSpots,
            color: "bg-green-500",
            icon: CheckCircle,
          },
          {
            label: "Occupied",
            value: analytics.occupiedSpots,
            color: "bg-red-500",
            icon: Car,
          },
          {
            label: "Occupancy",
            value: `${occupancyRate}%`,
            color: "bg-blue-500",
            icon: ArrowRightLeft,
          },
          {
            label: "Active Permits",
            value: permits.filter((p) => p.status === "active").length,
            color: "bg-purple-500",
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
          { id: "overview", label: "Overview", icon: ParkingSquare },
          { id: "spots", label: "Parking Spots", icon: MapPin },
          { id: "permits", label: "My Permits", icon: Shield },
          { id: "violations", label: "Violations", icon: AlertTriangle },
          { id: "reservations", label: "Reservations", icon: Calendar },
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
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="mb-4 font-semibold text-lg text-slate-900">
              Zone Availability
            </h3>
            <div className="space-y-3">
              {zones.map((zone) => {
                const zoneSpots = spots.filter((s) => s.zone === zone);
                const available = zoneSpots.filter(
                  (s) => s.status === "available",
                ).length;
                const total = zoneSpots.length;
                const percentage = (available / total) * 100;
                return (
                  <div key={zone}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium text-slate-700 text-sm">
                        {zone}
                      </span>
                      <span className="text-slate-500 text-sm">
                        {available}/{total} available
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="mb-4 font-semibold text-lg text-slate-900">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {spots.slice(0, 5).map((spot) => (
                <div
                  key={spot.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${statusColors[spot.status]}`}
                    />
                    <span className="font-medium text-slate-900">
                      Spot {spot.number}
                    </span>
                    <span className="text-slate-500 text-sm">{spot.zone}</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      spot.status === "available"
                        ? "bg-green-100 text-green-700"
                        : spot.status === "occupied"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {spot.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "spots" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search spots..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterZone}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterZone(e.target.value)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Zones</option>
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterType(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {Object.entries(typeLabels).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterStatus(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
            <AnimatePresence mode="popLayout">
              {filteredSpots.map((spot) => (
                <motion.div
                  key={spot.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setSelectedSpot(spot)}
                  className={`aspect-square cursor-pointer rounded-xl border-2 transition-all hover:scale-105 ${
                    spot.status === "available"
                      ? "border-green-500 bg-green-50"
                      : spot.status === "occupied"
                        ? "border-red-500 bg-red-50"
                        : spot.status === "reserved"
                          ? "border-blue-500 bg-blue-50"
                          : "border-amber-500 bg-amber-50"
                  }`}
                >
                  <div className="flex h-full flex-col items-center justify-center p-2">
                    <span
                      className={`font-bold text-lg ${
                        spot.status === "available"
                          ? "text-green-700"
                          : spot.status === "occupied"
                            ? "text-red-700"
                            : spot.status === "reserved"
                              ? "text-blue-700"
                              : "text-amber-700"
                      }`}
                    >
                      {spot.number}
                    </span>
                    <span className="text-slate-500 text-xs capitalize">
                      {spot.type}
                    </span>
                    {spot.hasEVCharging && (
                      <span className="text-green-600 text-xs">⚡</span>
                    )}
                    {spot.isAccessible && (
                      <span className="text-blue-600 text-xs">♿</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {activeTab === "permits" && (
        <div className="space-y-4">
          {permits.map((permit) => (
            <motion.div
              key={permit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <h3 className="font-bold text-lg text-slate-900">
                      Permit #{permit.id}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        permit.status === "active"
                          ? "bg-green-100 text-green-700"
                          : permit.status === "expired"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {permit.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    {typeLabels[permit.type]} Permit
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl text-slate-900">
                    {permit.fee === 0 ? "Free" : `$${permit.fee}`}
                  </p>
                  <p
                    className={`text-sm ${permit.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}
                  >
                    {permit.paymentStatus === "paid"
                      ? "✓ Paid"
                      : "Payment Pending"}
                  </p>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Zone</p>
                  <p className="font-semibold text-slate-900">{permit.zone}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Valid From</p>
                  <p className="font-semibold text-slate-900">
                    {permit.startDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Expires</p>
                  <p className="font-semibold text-slate-900">
                    {permit.expiryDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              {permit.violations.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="font-medium text-red-700">
                    ⚠ {permit.violations.length} parking violation
                    {permit.violations.length > 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "violations" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-slate-200 border-b bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Parking Violations</h3>
          </div>
          <div className="divide-y divide-slate-200">
            {violations.map((violation) => (
              <div key={violation.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="font-semibold text-slate-900">
                        {violation.type.replace("-", " ").toUpperCase()}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          violation.status === "pending"
                            ? "bg-red-100 text-red-700"
                            : violation.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {violation.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mb-2 text-slate-700">
                      {violation.description}
                    </p>
                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                      <span>Plate: {violation.licensePlate}</span>
                      <span>Spot: {violation.spotId}</span>
                      <span>{violation.date.toLocaleDateString()}</span>
                    </div>
                    <p className="mt-1 text-slate-500 text-sm">
                      Issued by: {violation.issuedBy}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600 text-xl">
                      ${violation.fine}
                    </p>
                    {violation.status === "pending" && (
                      <button className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700">
                        Pay Fine
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reservations" && (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">
                      Reservation #{reservation.id}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        reservation.status === "active"
                          ? "bg-blue-100 text-blue-700"
                          : reservation.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {reservation.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="mb-2 text-slate-600">
                    Spot: {reservation.spotId}
                  </p>
                  <p className="mb-1 text-slate-700">{reservation.purpose}</p>
                  <div className="flex items-center gap-4 text-slate-500 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {reservation.startTime.toLocaleTimeString()} -{" "}
                      {reservation.endTime.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                {reservation.status === "active" && (
                  <button className="rounded-lg px-4 py-2 text-red-600 transition-colors hover:bg-red-50">
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedSpot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedSpot(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xl">
                  Spot {selectedSpot.number}
                </h3>
                <button
                  onClick={() => setSelectedSpot(null)}
                  className="rounded-full p-2 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div
                  className={`h-4 w-4 rounded-full ${statusColors[selectedSpot.status]}`}
                />
                <span className="font-medium text-slate-900 capitalize">
                  {selectedSpot.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Zone</p>
                  <p className="font-semibold text-slate-900">
                    {selectedSpot.zone}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Type</p>
                  <p className="font-semibold text-slate-900">
                    {typeLabels[selectedSpot.type]}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Building</p>
                  <p className="font-semibold text-slate-900">
                    {selectedSpot.building}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Last Updated</p>
                  <p className="font-semibold text-slate-900">
                    {selectedSpot.lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSpot.hasEVCharging && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-green-700 text-sm">
                    EV Charging
                  </span>
                )}
                {selectedSpot.isAccessible && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 text-sm">
                    Accessible
                  </span>
                )}
                {selectedSpot.isCovered && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 text-sm">
                    Covered
                  </span>
                )}
              </div>
              {selectedSpot.status === "available" && (
                <button
                  onClick={() => {
                    setSelectedSpot(null);
                    setShowReserveModal(true);
                  }}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700"
                >
                  Reserve This Spot
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {showReserveModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowReserveModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <h3 className="font-bold text-slate-900 text-xl">
                Reserve Parking Spot
              </h3>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g., After-school club meeting"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              <button
                onClick={() => setShowReserveModal(false)}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Reserve Spot
              </button>
              <button
                onClick={() => setShowReserveModal(false)}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
