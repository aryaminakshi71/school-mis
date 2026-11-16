import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Building,
  Camera,
  CheckCircle,
  Clock,
  Download,
  Filter,
  History,
  MoreVertical,
  Phone,
  PieChart,
  Plus,
  ScanLine,
  Search,
  TrendingUp,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface Visitor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  purpose: string;
  meetingWith: string;
  department: string;
  photo?: string;
  idProof: {
    type: string;
    number: string;
  };
  checkIn: string;
  checkOut?: string;
  status: "checked-in" | "checked-out" | "overstayed";
  badgeNumber: string;
  vehicleNumber?: string;
  belongings?: string[];
  approvedBy?: string;
}

interface VisitorStats {
  totalToday: number;
  currentlyIn: number;
  avgVisitDuration: number;
  pendingApproval: number;
  overstayed: number;
}

interface VisitorLog {
  date: string;
  visitors: number;
  purpose: Record<string, number>;
}

interface VisitorManagementProps {
  className?: string;
}

const defaultVisitors: Visitor[] = [
  {
    id: "1",
    name: "Rajesh Sharma",
    phone: "+91-98765-43210",
    email: "rajesh@example.com",
    purpose: "Parent Teacher Meeting",
    meetingWith: "Mrs. Gupta",
    department: "Academic",
    checkIn: "2024-03-28T09:30:00",
    status: "checked-in",
    badgeNumber: "V-2024-001",
    idProof: { type: "Aadhaar", number: "XXXX-XXXX-1234" },
    approvedBy: "Principal",
  },
  {
    id: "2",
    name: "Priya Patel",
    phone: "+91-98765-43211",
    purpose: "Admission Inquiry",
    meetingWith: "Admission Officer",
    department: "Administration",
    checkIn: "2024-03-28T10:15:00",
    checkOut: "2024-03-28T11:00:00",
    status: "checked-out",
    badgeNumber: "V-2024-002",
    idProof: { type: "Driving License", number: "DL-12345678" },
  },
  {
    id: "3",
    name: "Amit Kumar",
    phone: "+91-98765-43212",
    purpose: "Vendor - IT Services",
    meetingWith: "IT Manager",
    department: "IT",
    checkIn: "2024-03-28T08:00:00",
    status: "overstayed",
    badgeNumber: "V-2024-003",
    vehicleNumber: "DL-01-AB-1234",
    idProof: { type: "Company ID", number: "EMP-456" },
    belongings: ["Laptop", "Tool Kit"],
  },
  {
    id: "4",
    name: "Sunita Devi",
    phone: "+91-98765-43213",
    purpose: "Parent Visit",
    meetingWith: "Class Teacher",
    department: "Academic",
    checkIn: "2024-03-28T14:00:00",
    status: "checked-in",
    badgeNumber: "V-2024-004",
    idProof: { type: "Voter ID", number: "ABC1234567" },
  },
];

const purposeStats = [
  { name: "Parent Visit", count: 45, color: "#3b82f6" },
  { name: "Admission Inquiry", count: 23, color: "#10b981" },
  { name: "Vendor/Supplier", count: 12, color: "#f59e0b" },
  { name: "Guest Lecture", count: 8, color: "#8b5cf6" },
  { name: "Maintenance", count: 15, color: "#ec4899" },
  { name: "Other", count: 7, color: "#6b7280" },
];

const hourlyData = [
  { hour: "8AM", visitors: 5 },
  { hour: "9AM", visitors: 15 },
  { hour: "10AM", visitors: 25 },
  { hour: "11AM", visitors: 30 },
  { hour: "12PM", visitors: 20 },
  { hour: "1PM", visitors: 12 },
  { hour: "2PM", visitors: 18 },
  { hour: "3PM", visitors: 22 },
  { hour: "4PM", visitors: 15 },
  { hour: "5PM", visitors: 8 },
];

export function VisitorManagement({ className }: VisitorManagementProps) {
  const [activeTab, setActiveTab] = useState<
    "current" | "history" | "analytics"
  >("current");
  const [visitors, setVisitors] = useState<Visitor[]>(defaultVisitors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const totalToday = visitors.length;
  const currentlyIn = visitors.filter(
    (v) => v.status === "checked-in" || v.status === "overstayed",
  ).length;
  const overstayed = visitors.filter((v) => v.status === "overstayed").length;
  const checkedOut = visitors.filter((v) => v.status === "checked-out").length;

  const filteredVisitors = visitors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone.includes(searchQuery) ||
      v.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCheckOut = (id: string) => {
    setVisitors(
      visitors.map((v) =>
        v.id === id
          ? { ...v, status: "checked-out", checkOut: new Date().toISOString() }
          : v,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "checked-in":
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "checked-out":
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      overstayed:
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const calculateDuration = (checkIn: string, checkOut?: string) => {
    const start = new Date(checkIn);
    const end = checkOut ? new Date(checkOut) : new Date();
    const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
              Visitor Management
            </h2>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Track and manage all visitors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQRScanner(true)}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ScanLine className="h-4 w-4" />
            Scan QR
          </button>
          <button
            onClick={() => setShowCheckInModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Visitor
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Today's Visitors
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                {totalToday}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Currently In
              </p>
              <p className="font-bold text-2xl text-green-600 dark:text-green-400">
                {currentlyIn}
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
                Overstayed
              </p>
              <p className="font-bold text-2xl text-red-600 dark:text-red-400">
                {overstayed}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Checked Out
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                {checkedOut}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <History className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {[
          { id: "current", label: "Current Visitors", icon: Users },
          { id: "history", label: "History", icon: History },
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

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "current" && (
          <motion.div
            key="current"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Search & Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or badge number..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                <Filter className="h-5 w-5" />
                Filter
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                <Download className="h-5 w-5" />
                Export
              </button>
            </div>

            {/* Visitors List */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredVisitors.map((visitor) => (
                  <motion.div
                    key={visitor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-teal-500 font-semibold text-lg text-white">
                          {visitor.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {visitor.name}
                            </h4>
                            <span
                              className={`rounded-full px-2 py-0.5 font-medium text-xs ${getStatusColor(
                                visitor.status,
                              )}`}
                            >
                              {visitor.status.replace("-", " ")}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-600 text-sm dark:text-gray-400">
                            {visitor.purpose}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-500 text-sm">
                            <span className="flex items-center gap-1">
                              <BadgeCheck className="h-4 w-4" />
                              Badge: {visitor.badgeNumber}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {visitor.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Meeting: {visitor.meetingWith}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {visitor.department}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <span className="text-gray-500">
                              Check-in:{" "}
                              {new Date(visitor.checkIn).toLocaleTimeString()}
                            </span>
                            {visitor.checkOut && (
                              <span className="text-gray-500">
                                Check-out:{" "}
                                {new Date(
                                  visitor.checkOut,
                                ).toLocaleTimeString()}
                              </span>
                            )}
                            <span className="font-medium text-primary">
                              Duration:{" "}
                              {calculateDuration(
                                visitor.checkIn,
                                visitor.checkOut,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(visitor.status === "checked-in" ||
                          visitor.status === "overstayed") && (
                          <button
                            onClick={() => handleCheckOut(visitor.id)}
                            className="rounded-lg bg-green-100 px-4 py-2 text-green-700 text-sm transition-colors hover:bg-green-200"
                          >
                            Check Out
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedVisitor(visitor)}
                          className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
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
            {/* Purpose Distribution */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <PieChart className="h-5 w-5 text-primary" />
                Visit Purpose Distribution
              </h3>
              <div className="space-y-3">
                {purposeStats.map((stat) => (
                  <div key={stat.name} className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 text-sm dark:text-white">
                          {stat.name}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {stat.count}
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(stat.count / 110) * 100}%`,
                            backgroundColor: stat.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hourly Traffic */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <BarChart3 className="h-5 w-5 text-primary" />
                Hourly Visitor Traffic
              </h3>
              <div className="flex h-48 items-end gap-2">
                {hourlyData.map((data) => (
                  <div
                    key={data.hour}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className="group relative w-full rounded-t-lg bg-primary/20"
                      style={{ height: `${(data.visitors / 30) * 100}%` }}
                    >
                      <div
                        className="absolute right-0 bottom-0 left-0 rounded-t-lg bg-primary transition-all"
                        style={{ height: "100%" }}
                      />
                      <div className="-top-8 -translate-x-1/2 absolute left-1/2 rounded bg-gray-800 px-2 py-1 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
                        {data.visitors}
                      </div>
                    </div>
                    <span className="text-gray-500 text-xs">{data.hour}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 md:col-span-2 md:grid-cols-4">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm opacity-90">
                    Avg. Visit Duration
                  </span>
                </div>
                <p className="font-bold text-2xl">45 min</p>
                <p className="mt-1 text-xs opacity-75">+5% from last week</p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-4 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm opacity-90">
                    Check-in Efficiency
                  </span>
                </div>
                <p className="font-bold text-2xl">98%</p>
                <p className="mt-1 text-xs opacity-75">Under 2 minutes</p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm opacity-90">Peak Hour</span>
                </div>
                <p className="font-bold text-2xl">11 AM</p>
                <p className="mt-1 text-xs opacity-75">30 visitors/hour</p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5" />
                  <span className="text-sm opacity-90">Weekly Growth</span>
                </div>
                <p className="font-bold text-2xl">+12%</p>
                <p className="mt-1 text-xs opacity-75">vs previous week</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                  Scan Visitor Badge
                </h3>
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-4 flex aspect-square items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                <div className="text-center">
                  <ScanLine className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Point camera at QR code
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-700">
                  <Camera className="h-5 w-5" />
                  <span>Camera</span>
                </button>
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="flex-1 rounded-xl bg-primary px-4 py-3 text-white"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
