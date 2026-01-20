import { Button, Card, Check } from "@/components/ui";

const stats = [
  { label: "Total Students", value: "1,248", change: "+12%", positive: true },
  {
    label: "Attendance Today",
    value: "96.5%",
    change: "+2.3%",
    positive: true,
  },
  { label: "Fee Collection", value: "$124,500", change: "+8%", positive: true },
  { label: "Active Staff", value: "86", change: "+3", positive: true },
];

const recentActivities = [
  {
    type: "student",
    message: "New student registered: John Smith",
    time: "5 min ago",
  },
  {
    type: "payment",
    message: "Fee payment received: $500 from Emma Wilson",
    time: "15 min ago",
  },
  {
    type: "attendance",
    message: "Morning attendance marked for Class 10-A",
    time: "1 hour ago",
  },
  {
    type: "exam",
    message: "Final exam results published for Class 9",
    time: "2 hours ago",
  },
  {
    type: "communication",
    message: "Parent notification sent: Class 8 parent-teacher meeting",
    time: "3 hours ago",
  },
];

export default function AppDashboard() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* App Header */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span>School MIS</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-muted">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                A
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">Principal</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r min-h-[calc(100vh-4rem)] hidden md:block">
          <nav className="p-4 space-y-1">
            {[
              { icon: "📊", label: "Dashboard", href: "/app", active: true },
              { icon: "👥", label: "Students", href: "/app/students" },
              { icon: "👨‍🏫", label: "Teachers", href: "/app/teachers" },
              { icon: "📚", label: "Classes", href: "/app/classes" },
              { icon: "📅", label: "Attendance", href: "/app/attendance" },
              { icon: "💰", label: "Fees", href: "/app/fees" },
              { icon: "📝", label: "Exams", href: "/app/exams" },
              { icon: "🚌", label: "Transport", href: "/app/transport" },
              { icon: "📚", label: "Library", href: "/app/library" },
              { icon: "📊", label: "Reports", href: "/app/reports" },
              { icon: "⚙️", label: "Settings", href: "/app/settings" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening at your school.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <span
                    className={`text-sm ${stat.positive ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.change}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                      {activity.type === "student" && "👤"}
                      {activity.type === "payment" && "💳"}
                      {activity.type === "attendance" && "📅"}
                      {activity.type === "exam" && "📝"}
                      {activity.type === "communication" && "📧"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Add Student",
                    icon: "👤",
                    color: "bg-blue-100 text-blue-700",
                  },
                  {
                    label: "Mark Attendance",
                    icon: "📅",
                    color: "bg-green-100 text-green-700",
                  },
                  {
                    label: "Send Notice",
                    icon: "📧",
                    color: "bg-purple-100 text-purple-700",
                  },
                  {
                    label: "Create Fee",
                    icon: "💰",
                    color: "bg-yellow-100 text-yellow-700",
                  },
                  {
                    label: "Schedule Exam",
                    icon: "📝",
                    color: "bg-red-100 text-red-700",
                  },
                  {
                    label: "View Reports",
                    icon: "📊",
                    color: "bg-indigo-100 text-indigo-700",
                  },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
