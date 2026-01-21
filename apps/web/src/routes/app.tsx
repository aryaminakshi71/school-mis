import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-blue-600">
            School MIS
          </a>
          <div className="flex gap-4">
            <a href="/app" className="text-blue-600 font-medium">
              Dashboard
            </a>
            <a
              href="/app/students"
              className="text-gray-600 hover:text-blue-600"
            >
              Students
            </a>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Admin</span>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-lg">
            <p className="opacity-80">Total Students</p>
            <p className="text-3xl font-bold">1,234</p>
            <p className="opacity-80 text-sm">+12% from last month</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-lg">
            <p className="opacity-80">Attendance Today</p>
            <p className="text-3xl font-bold">94.5%</p>
            <p className="opacity-80 text-sm">1,166 present</p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg">
            <p className="opacity-80">Fee Collection</p>
            <p className="text-3xl font-bold">$45,230</p>
            <p className="opacity-80 text-sm">85% collected</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <a
            href="/app/students"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Manage Students
          </a>
          <button className="bg-white text-gray-700 px-6 py-3 rounded-lg border hover:bg-gray-50">
            Record Attendance
          </button>
          <button className="bg-white text-gray-700 px-6 py-3 rounded-lg border hover:bg-gray-50">
            Send Notification
          </button>
        </div>
      </main>
    </div>
  );
}
