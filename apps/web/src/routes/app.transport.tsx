import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bus,
  Plus,
  MapPin,
  Wrench,
  Users,
  Clock,
  Route as RouteIcon,
  Settings,
  Eye,
  Navigation,
  ArrowRight,
  Map,
} from "lucide-react";

type RouteTab = "routes" | "vehicles" | "tracking";

function TransportPage() {
  const [activeTab, setActiveTab] = useState<RouteTab>("routes");

  const mockRoutes = [
    {
      id: "1",
      name: "Route A",
      startPoint: "City Center",
      endPoint: "School",
      distance: 5.2,
      stops: 8,
    },
    {
      id: "2",
      name: "Route B",
      startPoint: "North Colony",
      endPoint: "School",
      distance: 8.5,
      stops: 12,
    },
    {
      id: "3",
      name: "Route C",
      startPoint: "East View",
      endPoint: "School",
      distance: 6.8,
      stops: 10,
    },
  ];

  const mockVehicles = [
    {
      id: "1",
      number: "HR-01-1234",
      type: "Bus",
      capacity: 50,
      status: "active",
      driver: "Raj Kumar",
    },
    {
      id: "2",
      number: "HR-01-5678",
      type: "Bus",
      capacity: 45,
      status: "active",
      driver: "Amit Singh",
    },
    {
      id: "3",
      number: "HR-01-9012",
      type: "Van",
      capacity: 15,
      status: "maintenance",
      driver: "Suresh Yadav",
    },
  ];

  const mockTracking = [
    {
      vehicle: "HR-01-1234",
      driver: "Raj Kumar",
      location: "Main Road, 2km away",
      speed: 45,
      status: "on-time",
    },
    {
      vehicle: "HR-01-5678",
      driver: "Amit Singh",
      location: "Station Road, 5km away",
      speed: 38,
      status: "delayed",
    },
  ];

  const stats = {
    totalRoutes: mockRoutes.length,
    activeVehicles: mockVehicles.filter((v) => v.status === "active").length,
    totalStudents: 156,
    onTimePercentage: 94,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transport Management
          </h1>
          <p className="text-gray-600">Manage routes, vehicles and tracking</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Route
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <RouteIcon className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-blue-700 text-sm font-medium">Total Routes</p>
          </div>
          <p className="text-2xl font-bold text-blue-800">
            {stats.totalRoutes}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Bus className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-green-700 text-sm font-medium">
              Active Vehicles
            </p>
          </div>
          <p className="text-2xl font-bold text-green-800">
            {stats.activeVehicles}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-yellow-700 text-sm font-medium">
              Students Using
            </p>
          </div>
          <p className="text-2xl font-bold text-yellow-800">
            {stats.totalStudents}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-purple-700 text-sm font-medium">On Time %</p>
          </div>
          <p className="text-2xl font-bold text-purple-800">
            {stats.onTimePercentage}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
        <div className="border-b flex">
          <button
            onClick={() => setActiveTab("routes")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${activeTab === "routes" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            <RouteIcon className="w-4 h-4" />
            Routes
          </button>
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${activeTab === "vehicles" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            <Bus className="w-4 h-4" />
            Vehicles
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${activeTab === "tracking" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            <Navigation className="w-4 h-4" />
            Live Tracking
          </button>
        </div>

        {activeTab === "routes" && (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Route
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Start Point
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  End Point
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Distance
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Stops
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockRoutes.map((route) => (
                <tr key={route.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">
                    {route.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {route.startPoint}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {route.endPoint}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {route.distance} km
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {route.stops} stops
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm mr-3">
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "vehicles" && (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Vehicle
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Capacity
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Driver
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">
                    {vehicle.number}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {vehicle.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {vehicle.capacity}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {vehicle.driver}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${vehicle.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {vehicle.status === "active" ? "Active" : "Maintenance"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm mr-3">
                      Track
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "tracking" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-100 rounded-lg h-64 flex-1 flex items-center justify-center mr-4">
                <div className="text-center text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                    <Map className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="mb-2">Live map view with GPS tracking</p>
                  <a
                    href="/app/transport/tracking"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                  >
                    Open Full Tracking
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="space-y-4 w-80">
                {mockTracking.map((track, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bus className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{track.vehicle}</p>
                        <p className="text-sm text-gray-600">
                          Driver: {track.driver}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{track.speed} km/h</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${track.status === "on-time" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {track.status === "on-time" ? "On Time" : "Delayed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/app/transport")({
  component: TransportPage,
});
