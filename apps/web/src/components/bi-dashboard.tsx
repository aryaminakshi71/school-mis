import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Database,
  Download,
  FileSpreadsheet,
  Filter,
  Maximize2,
  Presentation,
  RefreshCw,
  Settings,
  Share2,
} from "lucide-react";
import { useState } from "react";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
    type?: "bar" | "line" | "pie";
  }[];
}

interface DashboardWidget {
  id: string;
  title: string;
  type: "chart" | "metric" | "table" | "kpi";
  chartType?: "bar" | "line" | "pie" | "doughnut" | "radar";
  data?: ChartData;
  value?: number;
  change?: number;
  description?: string;
  position: { x: number; y: number; w: number; h: number };
}

interface BIDashboardProps {
  className?: string;
}

const defaultWidgets: DashboardWidget[] = [
  {
    id: "1",
    title: "Student Enrollment Trends",
    type: "chart",
    chartType: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "New Admissions",
          data: [45, 52, 48, 61, 55, 67],
          color: "#3b82f6",
          type: "line",
        },
        {
          label: "Withdrawals",
          data: [5, 3, 4, 6, 2, 4],
          color: "#ef4444",
          type: "line",
        },
      ],
    },
    position: { x: 0, y: 0, w: 6, h: 4 },
  },
  {
    id: "2",
    title: "Fee Collection by Class",
    type: "chart",
    chartType: "bar",
    data: {
      labels: [
        "Class 6",
        "Class 7",
        "Class 8",
        "Class 9",
        "Class 10",
        "Class 11",
        "Class 12",
      ],
      datasets: [
        {
          label: "Collected",
          data: [95, 92, 88, 94, 96, 91, 93],
          color: "#10b981",
          type: "bar",
        },
        {
          label: "Pending",
          data: [5, 8, 12, 6, 4, 9, 7],
          color: "#f59e0b",
          type: "bar",
        },
      ],
    },
    position: { x: 6, y: 0, w: 6, h: 4 },
  },
  {
    id: "3",
    title: "Academic Performance Distribution",
    type: "chart",
    chartType: "pie",
    data: {
      labels: [
        "Excellent (>90%)",
        "Good (75-90%)",
        "Average (60-75%)",
        "Below Average (<60%)",
      ],
      datasets: [
        {
          label: "Students",
          data: [245, 412, 318, 125],
          color: "#8b5cf6",
          type: "pie",
        },
      ],
    },
    position: { x: 0, y: 4, w: 4, h: 4 },
  },
  {
    id: "4",
    title: "Teacher Workload Analysis",
    type: "chart",
    chartType: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Average Classes/Day",
          data: [5.2, 5.8, 5.4, 5.6, 5.1, 3.2],
          color: "#06b6d4",
          type: "bar",
        },
      ],
    },
    position: { x: 4, y: 4, w: 4, h: 4 },
  },
  {
    id: "5",
    title: "Key Performance Indicators",
    type: "kpi",
    value: 94.5,
    change: 2.3,
    description: "Overall Attendance Rate",
    position: { x: 8, y: 4, w: 4, h: 2 },
  },
  {
    id: "6",
    title: "Resource Utilization",
    type: "kpi",
    value: 87.2,
    change: -1.5,
    description: "Classroom Occupancy",
    position: { x: 8, y: 6, w: 4, h: 2 },
  },
];

// Simple SVG Chart Components
const LineChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 80 - 10;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((v - min) / range) * 80 - 10;
        return <circle key={i} cx={x} cy={y} r="2" fill={color} />;
      })}
    </svg>
  );
};

const BarChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {data.map((v, i) => {
        const height = (v / max) * 80;
        const x = (i / data.length) * 90 + 5;
        return (
          <rect
            key={i}
            x={x}
            y={100 - height - 10}
            width={80 / data.length}
            height={height}
            fill={color}
            rx="2"
          />
        );
      })}
    </svg>
  );
};

const PieChart = ({ data, colors }: { data: number[]; colors: string[] }) => {
  const total = data.reduce((a, b) => a + b, 0);
  let currentAngle = 0;

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {data.map((v, i) => {
        const angle = (v / total) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = ((startAngle + angle) * Math.PI) / 180;

        const x1 = 50 + 40 * Math.cos(startRad);
        const y1 = 50 + 40 * Math.sin(startRad);
        const x2 = 50 + 40 * Math.cos(endRad);
        const y2 = 50 + 40 * Math.sin(endRad);

        const largeArc = angle > 180 ? 1 : 0;

        return (
          <path
            key={i}
            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={colors[i % colors.length]}
          />
        );
      })}
    </svg>
  );
};

export function BIDashboard({ className }: BIDashboardProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets);
  const [timeRange, setTimeRange] = useState("month");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const exportDashboard = (format: "pdf" | "excel" | "image") => {
    // Implementation would trigger download
  };

  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case "chart":
        return (
          <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1">
              {widget.chartType === "line" && widget.data && (
                <div className="flex h-full gap-2">
                  {widget.data.datasets.map((dataset, idx) => (
                    <div key={idx} className="flex-1">
                      <LineChart data={dataset.data} color={dataset.color} />
                    </div>
                  ))}
                </div>
              )}
              {widget.chartType === "bar" && widget.data && (
                <div className="flex h-full gap-2">
                  {widget.data.datasets.map((dataset, idx) => (
                    <div key={idx} className="flex-1">
                      <BarChart data={dataset.data} color={dataset.color} />
                    </div>
                  ))}
                </div>
              )}
              {widget.chartType === "pie" && widget.data && (
                <div className="flex h-full items-center justify-center">
                  <div className="h-32 w-32">
                    <PieChart
                      data={widget.data.datasets[0].data}
                      colors={["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]}
                    />
                  </div>
                  <div className="ml-4 space-y-1 text-xs">
                    {widget.data.labels.map((label, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded"
                          style={{
                            backgroundColor: [
                              "#10b981",
                              "#3b82f6",
                              "#f59e0b",
                              "#ef4444",
                            ][idx],
                          }}
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {widget.data && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {widget.data.datasets.map((dataset, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: dataset.color }}
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      {dataset.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "kpi":
        return (
          <div className="flex h-full flex-col justify-center">
            <div className="font-bold text-3xl text-gray-900 dark:text-white">
              {widget.value}%
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span
                className={`font-medium text-sm ${
                  (widget.change || 0) >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {(widget.change || 0) >= 0 ? "+" : ""}
                {widget.change}%
              </span>
              <span className="text-gray-500 text-xs dark:text-gray-400">
                vs last month
              </span>
            </div>
            <div className="mt-1 text-gray-500 text-xs dark:text-gray-400">
              {widget.description}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-bold text-2xl text-gray-900 dark:text-white">
            <BarChart3 className="h-6 w-6 text-primary" />
            Business Intelligence Dashboard
          </h2>
          <p className="text-gray-600 text-sm dark:text-gray-400">
            Real-time analytics and insights
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setTimeRange(e.target.value)
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
            title="Refresh Data"
          >
            <RefreshCw
              className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>

          {/* Export Options */}
          <div className="group relative">
            <button className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary text-sm transition-colors hover:bg-primary/20">
              <Download className="h-4 w-4" />
              Export
            </button>
            <div className="invisible absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => exportDashboard("pdf")}
                className="w-full px-4 py-2 text-left text-sm first:rounded-t-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-2">
                  <Presentation className="h-4 w-4" />
                  Export as PDF
                </div>
              </button>
              <button
                onClick={() => exportDashboard("excel")}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Export as Excel
                </div>
              </button>
              <button
                onClick={() => exportDashboard("image")}
                className="w-full px-4 py-2 text-left text-sm last:rounded-b-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Export as Image
                </div>
              </button>
            </div>
          </div>

          {/* Full Screen */}
          <button
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            title="Full Screen"
          >
            <Maximize2 className="h-5 w-5" />
          </button>

          {/* Settings */}
          <button
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            title="Dashboard Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid auto-rows-min grid-cols-12 gap-4">
        {widgets.map((widget) => (
          <motion.div
            key={widget.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`col-span-${widget.position.w}row-span-${widget.position.h} cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 ${
              selectedWidget === widget.id ? "ring-2 ring-primary" : ""
            }`}
            style={{
              gridColumn: `span ${widget.position.w} / span ${widget.position.w}`,
              gridRow: `span ${widget.position.h} / span ${widget.position.h}`,
              minHeight: widget.position.h * 100,
            }}
            onClick={() => setSelectedWidget(widget.id)}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm dark:text-white">
                {widget.title}
              </h3>
              <div className="flex items-center gap-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Filter className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {renderWidget(widget)}
          </motion.div>
        ))}
      </div>

      {/* Data Source Info */}
      <div className="flex items-center justify-between border-gray-200 border-t pt-4 text-gray-500 text-xs dark:border-gray-700 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            Data Source: School MIS Database
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Last Updated: {new Date().toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Auto-refresh: Every 5 minutes</span>
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Live Connection
          </span>
        </div>
      </div>
    </div>
  );
}
