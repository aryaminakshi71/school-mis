import { motion } from "framer-motion";
import {
  Clock,
  Key,
  KeyRound,
  Lock,
  MoreVertical,
  Package,
  Search,
  Shield,
  Unlock,
  X,
} from "lucide-react";
import { useState } from "react";

export type AssetType =
  | "locker"
  | "cabinet"
  | "equipment"
  | "key"
  | "laptop"
  | "tablet"
  | "instrument"
  | "sports"
  | "lab-equipment"
  | "key-card";
export type AssetStatus =
  | "available"
  | "assigned"
  | "checked-out"
  | "maintenance"
  | "lost"
  | "damaged"
  | "retired";
export type CheckoutStatus =
  | "pending"
  | "active"
  | "overdue"
  | "returned"
  | "lost";

export interface AssetItem {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  location: string;
  building: string;
  floor?: number;
  room?: string;
  serialNumber?: string;
  barcode?: string;
  purchaseDate?: Date;
  value?: number;
  assignedTo?: string;
  assignedToName?: string;
  condition: "excellent" | "good" | "fair" | "poor";
  lastChecked: Date;
  maintenanceHistory?: MaintenanceRecord[];
  checkoutHistory?: CheckoutRecord[];
  notes?: string;
  specifications?: Record<string, string>;
}

export interface MaintenanceRecord {
  id: string;
  date: Date;
  type: "routine" | "repair" | "inspection" | "upgrade";
  description: string;
  performedBy: string;
  cost?: number;
  nextDue?: Date;
}

export interface CheckoutRecord {
  id: string;
  assetId: string;
  userId: string;
  userName: string;
  userType: "student" | "teacher" | "staff";
  checkoutDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: CheckoutStatus;
  purpose: string;
  conditionOut: string;
  conditionIn?: string;
  approvedBy: string;
  notes?: string;
}

export interface Locker {
  id: string;
  number: string;
  building: string;
  floor: number;
  section: string;
  size: "small" | "medium" | "large";
  status: AssetStatus;
  assignedTo?: string;
  assignedToName?: string;
  assignedDate?: Date;
  combination?: string;
  lastAccessed?: Date;
  history: LockerHistory[];
  condition: "excellent" | "good" | "fair" | "poor";
}

export interface LockerHistory {
  id: string;
  userId: string;
  userName: string;
  action: "assigned" | "returned" | "inspection" | "maintenance";
  date: Date;
  notes?: string;
}

interface KeyLockerManagementProps {
  userRole?: "admin" | "security" | "teacher" | "student" | "staff";
  userId?: string;
  onCheckoutAsset?: (
    assetId: string,
    checkout: Omit<CheckoutRecord, "id" | "checkoutDate" | "status">,
  ) => Promise<void>;
  onReturnAsset?: (
    checkoutId: string,
    condition: string,
    notes?: string,
  ) => Promise<void>;
  onAssignLocker?: (
    lockerId: string,
    userId: string,
    userName: string,
  ) => Promise<void>;
  onRecordMaintenance?: (
    assetId: string,
    maintenance: Omit<MaintenanceRecord, "id" | "date">,
  ) => Promise<void>;
  onUpdateAssetStatus?: (assetId: string, status: AssetStatus) => Promise<void>;
}

export function KeyLockerManagement({
  userRole = "student",
  userId = "S001",
  onCheckoutAsset,
  onReturnAsset,
  onAssignLocker,
  onRecordMaintenance,
  onUpdateAssetStatus,
}: KeyLockerManagementProps) {
  const [activeTab, setActiveTab] = useState<
    "lockers" | "keys" | "equipment" | "history"
  >("lockers");
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBuilding, setFilterBuilding] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<AssetStatus | "all">("all");

  const [lockers, setLockers] = useState<Locker[]>([
    {
      id: "L001",
      number: "A-101",
      building: "Main Building",
      floor: 1,
      section: "West Wing",
      size: "medium",
      status: "assigned",
      assignedTo: "S001",
      assignedToName: "Emma Johnson",
      assignedDate: new Date(Date.now() - 2592000000),
      combination: "12-24-36",
      lastAccessed: new Date(Date.now() - 86400000),
      history: [
        {
          id: "H1",
          userId: "S001",
          userName: "Emma Johnson",
          action: "assigned",
          date: new Date(Date.now() - 2592000000),
        },
      ],
      condition: "good",
    },
    {
      id: "L002",
      number: "A-102",
      building: "Main Building",
      floor: 1,
      section: "West Wing",
      size: "medium",
      status: "available",
      history: [],
      condition: "excellent",
    },
    {
      id: "L003",
      number: "B-205",
      building: "Science Building",
      floor: 2,
      section: "East Wing",
      size: "large",
      status: "assigned",
      assignedTo: "S002",
      assignedToName: "Marcus Chen",
      assignedDate: new Date(Date.now() - 15552000000),
      combination: "08-16-24",
      lastAccessed: new Date(Date.now() - 172800000),
      history: [
        {
          id: "H2",
          userId: "S002",
          userName: "Marcus Chen",
          action: "assigned",
          date: new Date(Date.now() - 15552000000),
        },
      ],
      condition: "good",
    },
    {
      id: "L004",
      number: "A-103",
      building: "Main Building",
      floor: 1,
      section: "West Wing",
      size: "small",
      status: "maintenance",
      history: [
        {
          id: "H3",
          userId: "STAFF001",
          userName: "Maintenance Staff",
          action: "inspection",
          date: new Date(Date.now() - 604800000),
          notes: "Lock mechanism needs repair",
        },
      ],
      condition: "fair",
    },
  ]);

  const [assets] = useState<AssetItem[]>([
    {
      id: "A001",
      name: "Classroom Key Set - Room 205",
      type: "key",
      status: "checked-out",
      location: "Science Building - Room 205",
      building: "Science Building",
      floor: 2,
      room: "205",
      serialNumber: "KEY-205-001",
      barcode: "BC001",
      assignedTo: "T001",
      assignedToName: "Dr. Sarah Chen",
      condition: "excellent",
      lastChecked: new Date(Date.now() - 2592000000),
      checkoutHistory: [
        {
          id: "C1",
          assetId: "A001",
          userId: "T001",
          userName: "Dr. Sarah Chen",
          userType: "teacher",
          checkoutDate: new Date(Date.now() - 2592000000),
          dueDate: new Date(Date.now() + 31536000000),
          status: "active",
          purpose: "Classroom access",
          conditionOut: "excellent",
          approvedBy: "Admin",
        },
      ],
    },
    {
      id: "A002",
      name: "Master Key - Main Building",
      type: "key",
      status: "assigned",
      location: "Security Office",
      building: "Main Building",
      assignedTo: "SEC001",
      assignedToName: "Security Officer Johnson",
      condition: "excellent",
      lastChecked: new Date(),
    },
    {
      id: "A003",
      name: "School Laptop - Dell Latitude",
      type: "laptop",
      status: "available",
      location: "IT Storage Room",
      building: "Admin Building",
      serialNumber: "DL-SN123456",
      barcode: "BC003",
      purchaseDate: new Date(Date.now() - 63072000000),
      value: 1200,
      condition: "good",
      lastChecked: new Date(Date.now() - 604800000),
      specifications: {
        Model: "Dell Latitude 5520",
        CPU: "Intel i5-1135G7",
        RAM: "16GB",
        Storage: "512GB SSD",
        OS: "Windows 11",
      },
    },
    {
      id: "A004",
      name: "Lab Equipment Set - Chemistry",
      type: "lab-equipment",
      status: "checked-out",
      location: "Chemistry Lab",
      building: "Science Building",
      floor: 1,
      room: "Lab A",
      assignedTo: "T002",
      assignedToName: "Mr. David Wilson",
      condition: "good",
      lastChecked: new Date(Date.now() - 1209600000),
      checkoutHistory: [
        {
          id: "C2",
          assetId: "A004",
          userId: "T002",
          userName: "Mr. David Wilson",
          userType: "teacher",
          checkoutDate: new Date(Date.now() - 15552000000),
          dueDate: new Date(Date.now() + 15768000000),
          status: "active",
          purpose: "Chemistry lab teaching",
          conditionOut: "excellent",
          approvedBy: "Admin",
        },
      ],
    },
    {
      id: "A005",
      name: "Locker Master Key",
      type: "key-card",
      status: "assigned",
      location: "Security Office",
      building: "Main Building",
      assignedTo: "SEC002",
      assignedToName: "Security Officer Martinez",
      condition: "excellent",
      lastChecked: new Date(),
    },
  ]);

  const [checkoutHistory] = useState<CheckoutRecord[]>([
    {
      id: "CH001",
      assetId: "A003",
      userId: "S003",
      userName: "Alex Rivera",
      userType: "student",
      checkoutDate: new Date(Date.now() - 2592000000),
      dueDate: new Date(Date.now() - 172800000),
      returnDate: new Date(Date.now() - 86400000),
      status: "returned",
      purpose: "Research project",
      conditionOut: "excellent",
      conditionIn: "good",
      approvedBy: "Mr. Wilson",
      notes: "Minor scratches on case",
    },
    {
      id: "CH002",
      assetId: "A003",
      userId: "S004",
      userName: "Jordan Taylor",
      userType: "student",
      checkoutDate: new Date(Date.now() - 1209600000),
      dueDate: new Date(Date.now() - 432000000),
      status: "overdue",
      purpose: "Programming assignment",
      conditionOut: "excellent",
      approvedBy: "Ms. Garcia",
    },
  ]);

  const statusColors: Record<AssetStatus, string> = {
    available: "bg-green-100 text-green-700",
    assigned: "bg-blue-100 text-blue-700",
    "checked-out": "bg-amber-100 text-amber-700",
    maintenance: "bg-orange-100 text-orange-700",
    lost: "bg-red-100 text-red-700",
    damaged: "bg-red-200 text-red-800",
    retired: "bg-slate-100 text-slate-700",
  };

  const checkoutStatusColors: Record<CheckoutStatus, string> = {
    pending: "bg-slate-100 text-slate-700",
    active: "bg-blue-100 text-blue-700",
    overdue: "bg-red-100 text-red-700",
    returned: "bg-green-100 text-green-700",
    lost: "bg-red-200 text-red-800",
  };

  const filteredLockers = lockers.filter((locker) => {
    const matchesSearch =
      locker.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locker.assignedToName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBuilding =
      filterBuilding === "all" || locker.building === filterBuilding;
    const matchesStatus =
      filterStatus === "all" || locker.status === filterStatus;
    return matchesSearch && matchesBuilding && matchesStatus;
  });

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignedToName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBuilding =
      filterBuilding === "all" || asset.building === filterBuilding;
    const matchesStatus =
      filterStatus === "all" || asset.status === filterStatus;
    return matchesSearch && matchesBuilding && matchesStatus;
  });

  const buildings = Array.from(
    new Set([
      ...lockers.map((l) => l.building),
      ...assets.map((a) => a.building),
    ]),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <KeyRound className="h-8 w-8 text-amber-600" />
            Key & Locker Management
          </h2>
          <p className="mt-1 text-slate-600">
            Track keys, lockers, and equipment
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Total Lockers",
            value: lockers.length,
            color: "bg-amber-500",
            icon: Package,
          },
          {
            label: "Available",
            value: lockers.filter((l) => l.status === "available").length,
            color: "bg-green-500",
            icon: Unlock,
          },
          {
            label: "Assigned",
            value: lockers.filter((l) => l.status === "assigned").length,
            color: "bg-blue-500",
            icon: Lock,
          },
          {
            label: "Assets Tracked",
            value: assets.length,
            color: "bg-purple-500",
            icon: Key,
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
          { id: "lockers", label: "Lockers", icon: Package },
          { id: "keys", label: "Keys & Cards", icon: Key },
          { id: "equipment", label: "Equipment", icon: Shield },
          { id: "history", label: "Checkout History", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-amber-600 border-b-2 text-amber-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={filterBuilding}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFilterBuilding(e.target.value)
          }
          className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Buildings</option>
          {buildings.map((building) => (
            <option key={building} value={building}>
              {building}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFilterStatus(e.target.value as any)
          }
          className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="assigned">Assigned</option>
          <option value="checked-out">Checked Out</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {activeTab === "lockers" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="divide-y divide-slate-200">
            {filteredLockers.map((locker) => (
              <div
                key={locker.id}
                onClick={() => setSelectedLocker(locker)}
                className="cursor-pointer p-6 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-bold text-lg text-slate-900">
                        Locker {locker.number}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${statusColors[locker.status]}`}
                      >
                        {locker.status.toUpperCase()}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600 text-xs capitalize">
                        {locker.size}
                      </span>
                    </div>
                    <p className="mb-1 text-slate-600">
                      {locker.building} • Floor {locker.floor} •{" "}
                      {locker.section}
                    </p>
                    {locker.assignedToName && (
                      <p className="text-slate-500 text-sm">
                        Assigned to:{" "}
                        <span className="font-medium text-slate-700">
                          {locker.assignedToName}
                        </span>
                        {locker.assignedDate &&
                          ` since ${locker.assignedDate.toLocaleDateString()}`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {locker.lastAccessed && (
                      <span className="text-slate-500 text-sm">
                        Last accessed:{" "}
                        {locker.lastAccessed.toLocaleDateString()}
                      </span>
                    )}
                    <button className="p-2 text-slate-400 transition-colors hover:text-slate-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "keys" && (
        <div className="space-y-4">
          {filteredAssets
            .filter((a) => a.type === "key" || a.type === "key-card")
            .map((asset) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      {asset.type === "key" ? (
                        <Key className="h-5 w-5 text-amber-600" />
                      ) : (
                        <Shield className="h-5 w-5 text-blue-600" />
                      )}
                      <h3 className="font-bold text-lg text-slate-900">
                        {asset.name}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${statusColors[asset.status]}`}
                      >
                        {asset.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mb-1 text-slate-600">{asset.location}</p>
                    {asset.serialNumber && (
                      <p className="text-slate-500 text-sm">
                        S/N: {asset.serialNumber}
                      </p>
                    )}
                    {asset.assignedToName && (
                      <p className="text-slate-500 text-sm">
                        Assigned to:{" "}
                        <span className="font-medium text-slate-700">
                          {asset.assignedToName}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm capitalize ${
                        asset.condition === "excellent"
                          ? "bg-green-100 text-green-700"
                          : asset.condition === "good"
                            ? "bg-blue-100 text-blue-700"
                            : asset.condition === "fair"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {asset.condition}
                    </span>
                    <button className="p-2 text-slate-400 transition-colors hover:text-slate-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      )}

      {activeTab === "equipment" && (
        <div className="space-y-4">
          {filteredAssets
            .filter((a) => !["key", "key-card"].includes(a.type))
            .map((asset) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <Package className="h-5 w-5 text-purple-600" />
                      <h3 className="font-bold text-lg text-slate-900">
                        {asset.name}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${statusColors[asset.status]}`}
                      >
                        {asset.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mb-1 text-slate-600">{asset.location}</p>
                    {asset.serialNumber && (
                      <p className="text-slate-500 text-sm">
                        S/N: {asset.serialNumber}
                      </p>
                    )}
                    {asset.assignedToName && (
                      <p className="text-slate-500 text-sm">
                        Assigned to:{" "}
                        <span className="font-medium text-slate-700">
                          {asset.assignedToName}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {asset.value && (
                      <p className="font-bold text-slate-900 text-xl">
                        ${asset.value}
                      </p>
                    )}
                    <span
                      className={`rounded-full px-3 py-1 text-sm capitalize ${
                        asset.condition === "excellent"
                          ? "bg-green-100 text-green-700"
                          : asset.condition === "good"
                            ? "bg-blue-100 text-blue-700"
                            : asset.condition === "fair"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {asset.condition}
                    </span>
                  </div>
                </div>
                {asset.specifications && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-3">
                    <p className="mb-2 font-semibold text-slate-700 text-sm">
                      Specifications
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(asset.specifications).map(
                        ([key, value]) => (
                          <div key={key}>
                            <span className="text-slate-500">{key}: </span>
                            <span className="font-medium text-slate-900">
                              {value}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      )}

      {activeTab === "history" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-slate-200 border-b bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Checkout History</h3>
          </div>
          <div className="divide-y divide-slate-200">
            {checkoutHistory.map((record) => (
              <div key={record.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <Clock className="h-5 w-5 text-slate-400" />
                      <span className="font-semibold text-slate-900">
                        {record.userName}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${checkoutStatusColors[record.status]}`}
                      >
                        {record.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mb-1 text-slate-600">{record.purpose}</p>
                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                      <span>
                        Checked out: {record.checkoutDate.toLocaleDateString()}
                      </span>
                      <span>Due: {record.dueDate.toLocaleDateString()}</span>
                      {record.returnDate && (
                        <span>
                          Returned: {record.returnDate.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {record.notes && (
                      <p className="mt-1 text-slate-500 text-sm">
                        Note: {record.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-sm">Approved by</p>
                    <p className="font-medium text-slate-900">
                      {record.approvedBy}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedLocker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedLocker(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-xl">
                    Locker {selectedLocker.number}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLocker(null)}
                  className="rounded-full p-2 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Status</p>
                  <span
                    className={`rounded-full px-2 py-1 text-sm ${statusColors[selectedLocker.status]}`}
                  >
                    {selectedLocker.status.toUpperCase()}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Size</p>
                  <p className="font-semibold text-slate-900 capitalize">
                    {selectedLocker.size}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Location</p>
                  <p className="font-semibold text-slate-900">
                    {selectedLocker.building}
                  </p>
                  <p className="text-slate-600 text-sm">
                    Floor {selectedLocker.floor}, {selectedLocker.section}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Condition</p>
                  <p className="font-semibold text-slate-900 capitalize">
                    {selectedLocker.condition}
                  </p>
                </div>
              </div>

              {selectedLocker.assignedToName && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="mb-2 font-semibold text-blue-900">
                    Current Assignment
                  </h4>
                  <p className="text-blue-800">
                    {selectedLocker.assignedToName}
                  </p>
                  {selectedLocker.assignedDate && (
                    <p className="text-blue-600 text-sm">
                      Assigned:{" "}
                      {selectedLocker.assignedDate.toLocaleDateString()}
                    </p>
                  )}
                  {selectedLocker.combination && userRole !== "student" && (
                    <p className="mt-1 text-blue-600 text-sm">
                      Combination: {selectedLocker.combination}
                    </p>
                  )}
                  {selectedLocker.lastAccessed && (
                    <p className="text-blue-600 text-sm">
                      Last accessed:{" "}
                      {selectedLocker.lastAccessed.toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {selectedLocker.history.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-slate-900">History</h4>
                  <div className="max-h-40 space-y-2 overflow-y-auto">
                    {selectedLocker.history.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded bg-slate-50 p-2 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900 capitalize">
                            {entry.action}
                          </span>
                          <span className="text-slate-500">
                            {entry.date.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600">{entry.userName}</p>
                        {entry.notes && (
                          <p className="text-slate-500 text-xs">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
