import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

interface ChartProps {
  data: any;
  options?: any;
}

export function BarChart({ data, options }: ChartProps) {
  const chartData = data.labels
    ? data.labels.map((label: string, idx: number) => {
        const item: any = { name: label };
        data.datasets?.forEach((dataset: any, dataIdx: number) => {
          item[dataset.label || `Dataset ${dataIdx + 1}`] = dataset.data[idx];
        });
        return item;
      })
    : data;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets &&
          data.datasets.map((dataset: any, idx: number) => (
            <Bar
              key={idx}
              dataKey={dataset.label}
              fill={dataset.backgroundColor || COLORS[idx]}
            />
          ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export function LineChart({ data, options }: ChartProps) {
  const chartData = data.labels
    ? data.labels.map((label: string, idx: number) => {
        const item: any = { name: label };
        data.datasets?.forEach((dataset: any, dataIdx: number) => {
          item[dataset.label || `Dataset ${dataIdx + 1}`] = dataset.data[idx];
        });
        return item;
      })
    : data;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets &&
          data.datasets.map((dataset: any, idx: number) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={dataset.label}
              stroke={dataset.borderColor || COLORS[idx]}
              dot={false}
            />
          ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export function PieChart({ data, options }: ChartProps) {
  const chartData = data.labels
    ? data.labels.map((label: string, idx: number) => ({
        name: label,
        value: data.datasets[0]?.data[idx] || 0,
      }))
    : data;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => entry.name}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((_: any, idx: number) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export function DoughnutChart({ data, options }: ChartProps) {
  const chartData = data.labels
    ? data.labels.map((label: string, idx: number) => ({
        name: label,
        value: data.datasets[0]?.data[idx] || 0,
      }))
    : data;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((_: any, idx: number) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export function RadarChart({ data, options }: ChartProps) {
  const chartData = data.labels
    ? data.labels.map((label: string, idx: number) => ({
        name: label,
        value: data.datasets[0]?.data[idx] || 0,
      }))
    : data;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis />
        <Radar
          name={data.datasets?.[0]?.label || "Data"}
          dataKey="value"
          stroke={COLORS[0]}
          fill={COLORS[0]}
          fillOpacity={0.6}
        />
        <Legend />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
