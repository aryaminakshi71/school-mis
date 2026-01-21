import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/app/transport/tracking")({
  component: TrackingPage,
});

interface VehicleLocation {
  id: string;
  vehicleNumber: string;
  driver: string;
  route: string;
  latitude: number;
  longitude: number;
  speed: number;
  status: "on-time" | "delayed" | "stopped";
  lastUpdate: string;
}

function TrackingPage() {
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([
    {
      id: "1",
      vehicleNumber: "HR-01-1234",
      driver: "Raj Kumar",
      route: "Route A",
      latitude: 28.6139,
      longitude: 77.209,
      speed: 45,
      status: "on-time",
      lastUpdate: new Date().toISOString(),
    },
    {
      id: "2",
      vehicleNumber: "HR-01-5678",
      driver: "Amit Singh",
      route: "Route B",
      latitude: 28.62,
      longitude: 77.215,
      speed: 38,
      status: "delayed",
      lastUpdate: new Date().toISOString(),
    },
    {
      id: "3",
      vehicleNumber: "HR-01-9012",
      driver: "Suresh Yadav",
      route: "Route C",
      latitude: 28.63,
      longitude: 77.22,
      speed: 0,
      status: "stopped",
      lastUpdate: new Date().toISOString(),
    },
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [mapType, setMapType] = useState<"street" | "satellite">("street");

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => ({
          ...v,
          latitude: v.latitude + (Math.random() - 0.5) * 0.001,
          longitude: v.longitude + (Math.random() - 0.5) * 0.001,
          speed:
            v.status === "stopped" ? 0 : Math.floor(Math.random() * 30) + 20,
          lastUpdate: new Date().toISOString(),
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: vehicles.length,
    onTime: vehicles.filter((v) => v.status === "on-time").length,
    delayed: vehicles.filter((v) => v.status === "delayed").length,
    stopped: vehicles.filter((v) => v.status === "stopped").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Live GPS Tracking
          </h1>
          <p className="text-gray-600">Real-time vehicle tracking with GPS</p>
        </div>
        <div className="flex gap-2">
          <select
            value={mapType}
            onChange={(e) =>
              setMapType(e.target.value as "street" | "satellite")
            }
            className="px-4 py-2 border rounded-lg"
          >
            <option value="street">Street View</option>
            <option value="satellite">Satellite</option>
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-blue-700 text-sm font-medium">Total Vehicles</p>
          <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-700 text-sm font-medium">On Time</p>
          <p className="text-2xl font-bold text-green-800">{stats.onTime}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-yellow-700 text-sm font-medium">Delayed</p>
          <p className="text-2xl font-bold text-yellow-800">{stats.delayed}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-700 text-sm font-medium">Stopped</p>
          <p className="text-2xl font-bold text-gray-800">{stats.stopped}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border overflow-hidden shadow-sm">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-900">Live Map</h2>
            <p className="text-sm text-gray-600">Real-time vehicle locations</p>
          </div>
          <div className="relative h-96 bg-gray-100">
            {/* Map placeholder - in production, integrate with Google Maps or Mapbox */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-500 font-medium">Interactive Map</p>
                <p className="text-sm text-gray-400">
                  Google Maps / Mapbox Integration
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Coordinates: {vehicles[0]?.latitude.toFixed(4)},{" "}
                  {vehicles[0]?.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Vehicle markers */}
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((vehicle.longitude - 77.2) / 0.05) * 100}%`,
                  top: `${((28.65 - vehicle.latitude) / 0.05) * 100}%`,
                }}
                onClick={() => setSelectedVehicle(vehicle.id)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${
                    vehicle.status === "on-time"
                      ? "bg-green-500"
                      : vehicle.status === "delayed"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                  }`}
                >
                  🚌
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-900">Vehicles</h2>
            <p className="text-sm text-gray-600">Click to view details</p>
          </div>
          <div className="divide-y max-h-96 overflow-auto">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedVehicle === vehicle.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{vehicle.vehicleNumber}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === "on-time"
                        ? "bg-green-100 text-green-700"
                        : vehicle.status === "delayed"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {vehicle.status === "on-time"
                      ? "On Time"
                      : vehicle.status === "delayed"
                        ? "Delayed"
                        : "Stopped"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Driver: {vehicle.driver}</p>
                  <p>Route: {vehicle.route}</p>
                  <p className="mt-1">Speed: {vehicle.speed} km/h</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedVehicle && (
        <div className="mt-6 bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Vehicle Details</h2>
          {(() => {
            const vehicle = vehicles.find((v) => v.id === selectedVehicle);
            if (!vehicle) return null;
            return (
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Vehicle Number</p>
                  <p className="font-medium text-lg">{vehicle.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Driver</p>
                  <p className="font-medium text-lg">{vehicle.driver}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Speed</p>
                  <p className="font-medium text-lg">{vehicle.speed} km/h</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {vehicle.latitude.toFixed(6)},{" "}
                    {vehicle.longitude.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-medium">{vehicle.route}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Update</p>
                  <p className="font-medium">
                    {new Date(vehicle.lastUpdate).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
