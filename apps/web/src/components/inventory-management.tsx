import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Armchair,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Building,
  CheckCircle,
  Clock,
  Computer,
  Download,
  Edit2,
  Fan,
  Filter,
  Lightbulb,
  MapPin,
  MoreVertical,
  Package,
  Plus,
  QrCode,
  Search,
  Tag,
  Tv,
  User,
  Wrench,
} from "lucide-react";
import { useState } from "react";

interface Asset {
  id: string;
  name: string;
  category: string;
  assetCode: string;
  serialNumber?: string;
  location: string;
  department: string;
  assignedTo?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  status: "active" | "maintenance" | "retired" | "lost";
  condition: "excellent" | "good" | "fair" | "poor";
  warrantyExpiry?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  qrCode?: string;
  image?: string;
  specifications?: Record<string, string>;
}

interface AssetCategory {
  id: string;
  name: string;
  count: number;
  value: number;
  icon: string;
}

interface MaintenanceRecord {
  id: string;
  assetId: string;
  type: "preventive" | "corrective" | "upgrade";
  description: string;
  cost: number;
  performedBy: string;
  date: string;
  nextDue?: string;
}

interface InventoryManagementProps {
  className?: string;
}

const defaultAssets: Asset[] = [
  {
    id: "1",
    name: "Dell Laptop - Latitude 5420",
    category: "IT Equipment",
    assetCode: "IT-LAP-001",
    serialNumber: "SN123456789",
    location: "Room 101",
    department: "Computer Lab",
    assignedTo: "Mr. Sharma",
    purchaseDate: "2023-06-15",
    purchasePrice: 75000,
    currentValue: 65000,
    status: "active",
    condition: "good",
    warrantyExpiry: "2026-06-15",
    lastMaintenance: "2024-02-15",
    nextMaintenance: "2024-08-15",
    specifications: {
      Processor: "Intel i5",
      RAM: "16GB",
      Storage: "512GB SSD",
    },
  },
  {
    id: "2",
    name: "Smart Board 75 inch",
    category: "Electronics",
    assetCode: "ELE-SB-002",
    serialNumber: "SB987654321",
    location: "Room 201",
    department: "Classroom",
    purchaseDate: "2023-08-20",
    purchasePrice: 150000,
    currentValue: 140000,
    status: "active",
    condition: "excellent",
    warrantyExpiry: "2026-08-20",
    specifications: {
      Size: "75 inches",
      Resolution: "4K",
      Touch: "Multi-touch 20 points",
    },
  },
  {
    id: "3",
    name: "Office Chair - Executive",
    category: "Furniture",
    assetCode: "FUR-CHR-003",
    location: "Principal Office",
    department: "Administration",
    assignedTo: "Principal",
    purchaseDate: "2023-01-10",
    purchasePrice: 12000,
    currentValue: 10000,
    status: "active",
    condition: "good",
  },
  {
    id: "4",
    name: "Projector - Epson EB",
    category: "Electronics",
    assetCode: "ELE-PROJ-004",
    serialNumber: "PRJ456789123",
    location: "Room 105",
    department: "AV Room",
    purchaseDate: "2022-12-05",
    purchasePrice: 45000,
    currentValue: 35000,
    status: "maintenance",
    condition: "fair",
    lastMaintenance: "2024-01-20",
    nextMaintenance: "2024-03-28",
  },
  {
    id: "5",
    name: "Chemistry Lab Equipment Set",
    category: "Lab Equipment",
    assetCode: "LAB-CHE-005",
    location: "Chemistry Lab",
    department: "Science",
    purchaseDate: "2023-03-15",
    purchasePrice: 85000,
    currentValue: 80000,
    status: "active",
    condition: "excellent",
    specifications: {
      Type: "Complete Set",
      Items: "Beakers, Flasks, Burners",
      Capacity: "25 students",
    },
  },
];

const categories: AssetCategory[] = [
  {
    id: "1",
    name: "IT Equipment",
    count: 85,
    value: 4250000,
    icon: "computer",
  },
  { id: "2", name: "Electronics", count: 45, value: 2100000, icon: "tv" },
  { id: "3", name: "Furniture", count: 120, value: 1500000, icon: "armchair" },
  { id: "4", name: "Lab Equipment", count: 60, value: 3200000, icon: "flask" },
  { id: "5", name: "Library", count: 35, value: 800000, icon: "book" },
  { id: "6", name: "Sports", count: 50, value: 950000, icon: "ball" },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  computer: Computer,
  tv: Tv,
  armchair: Armchair,
  book: BookOpen,
  fan: Fan,
  lightbulb: Lightbulb,
};

export function InventoryManagement({ className }: InventoryManagementProps) {
  const [activeTab, setActiveTab] = useState<
    "assets" | "maintenance" | "analytics"
  >("assets");
  const [assets, setAssets] = useState<Asset[]>(defaultAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const totalAssets = assets.length;
  const totalValue = assets.reduce((acc, asset) => acc + asset.currentValue, 0);
  const inMaintenance = assets.filter((a) => a.status === "maintenance").length;
  const activeAssets = assets.filter((a) => a.status === "active").length;

  const filteredAssets = assets.filter(
    (asset) =>
      (asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serialNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())) &&
      (!selectedCategory || asset.category === selectedCategory),
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      maintenance:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      retired: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      excellent: "bg-green-100 text-green-700",
      good: "bg-blue-100 text-blue-700",
      fair: "bg-yellow-100 text-yellow-700",
      poor: "bg-red-100 text-red-700",
    };
    return colors[condition] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
              Asset Inventory
            </h2>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              {totalAssets} assets • ₹{(totalValue / 100000).toFixed(2)}L total
              value
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <QrCode className="h-4 w-4" />
            Scan QR
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Total Assets
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                {totalAssets}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">Active</p>
              <p className="font-bold text-2xl text-green-600 dark:text-green-400">
                {activeAssets}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                In Maintenance
              </p>
              <p className="font-bold text-2xl text-yellow-600 dark:text-yellow-400">
                {inMaintenance}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Wrench className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Total Value
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                ₹{(totalValue / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Package;
          return (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.name ? null : category.name,
                )
              }
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                selectedCategory === category.name
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="font-bold text-gray-900 text-lg dark:text-white">
                  {category.count}
                </span>
              </div>
              <p className="font-medium text-gray-900 text-sm dark:text-white">
                {category.name}
              </p>
              <p className="text-gray-500 text-xs">
                ₹{(category.value / 100000).toFixed(1)}L
              </p>
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {[
          { id: "assets", label: "All Assets", icon: Package },
          { id: "maintenance", label: "Maintenance", icon: Wrench },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
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

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets by name, code, or serial number..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <Filter className="h-5 w-5" />
            Filter
          </button>
          <div className="flex items-center rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 transition-colors ${viewMode === "list" ? "bg-white shadow-sm dark:bg-gray-700" : ""}`}
            >
              <Package className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition-colors ${viewMode === "grid" ? "bg-white shadow-sm dark:bg-gray-700" : ""}`}
            >
              <Building className="h-5 w-5" />
            </button>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <Download className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Assets List */}
      <AnimatePresence mode="wait">
        {activeTab === "assets" && (
          <motion.div
            key="assets"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {asset.name}
                          </h4>
                          <span
                            className={`rounded-full px-2 py-0.5 font-medium text-xs ${getStatusColor(asset.status)}`}
                          >
                            {asset.status}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 font-medium text-xs ${getConditionColor(asset.condition)}`}
                          >
                            {asset.condition}
                          </span>
                        </div>
                        <p className="mt-1 font-medium text-primary text-sm">
                          {asset.assetCode}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-600 text-sm dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {asset.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {asset.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {asset.department}
                          </span>
                          {asset.assignedTo && (
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {asset.assignedTo}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="text-gray-500">
                            Purchase: ₹{asset.purchasePrice.toLocaleString()}
                          </span>
                          <span className="text-gray-500">
                            Current: ₹{asset.currentValue.toLocaleString()}
                          </span>
                          {asset.nextMaintenance && (
                            <span className="text-yellow-600">
                              Next Maintenance:{" "}
                              {new Date(
                                asset.nextMaintenance,
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                        <QrCode className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Edit2 className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {/* Value by Category */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <BarChart3 className="h-5 w-5 text-primary" />
                Asset Value by Category
              </h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 text-sm dark:text-white">
                          {category.name}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ₹{(category.value / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${(category.value / 5000000) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance Overview */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Wrench className="h-5 w-5 text-primary" />
                Maintenance Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Scheduled
                      </p>
                      <p className="text-gray-500 text-xs">Next 7 days</p>
                    </div>
                  </div>
                  <span className="font-bold text-2xl text-yellow-600">12</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/50">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Overdue
                      </p>
                      <p className="text-gray-500 text-xs">
                        Require immediate attention
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-2xl text-red-600">3</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Completed
                      </p>
                      <p className="text-gray-500 text-xs">This month</p>
                    </div>
                  </div>
                  <span className="font-bold text-2xl text-green-600">28</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 md:col-span-2 md:grid-cols-4">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5" />
                  <span className="text-sm opacity-90">Appreciation</span>
                </div>
                <p className="font-bold text-2xl">5.2%</p>
                <p className="mt-1 text-xs opacity-75">Asset value growth</p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-4 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm opacity-90">Avg. Lifespan</span>
                </div>
                <p className="font-bold text-2xl">4.5 years</p>
                <p className="mt-1 text-xs opacity-75">Across all assets</p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  <span className="text-sm opacity-90">Maintenance Cost</span>
                </div>
                <p className="font-bold text-2xl">₹2.4L</p>
                <p className="mt-1 text-xs opacity-75">This year</p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <ArrowDownRight className="h-5 w-5" />
                  <span className="text-sm opacity-90">Depreciation</span>
                </div>
                <p className="font-bold text-2xl">15%</p>
                <p className="mt-1 text-xs opacity-75">Annual rate</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
