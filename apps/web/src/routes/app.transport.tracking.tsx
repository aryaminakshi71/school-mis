import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-foreground">
            Live GPS Tracking
          </h1>
          <p className="text-muted-foreground">
            Real-time vehicle tracking with GPS
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={mapType}
            onChange={(e) =>
              setMapType(e.target.value as "street" | "satellite")
            }
            className="rounded-lg border px-4 py-2"
          >
            <option value="street">Street View</option>
            <option value="satellite">Satellite</option>
          </select>
          <button className="rounded-lg bg-success px-4 py-2 text-success-foreground hover:bg-success">
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-primary/10 p-4">
          <p className="font-medium text-primary text-sm">Total Vehicles</p>
          <p className="font-bold text-2xl text-primary">{stats.total}</p>
        </div>
        <div className="rounded-lg bg-success/15 p-4">
          <p className="font-medium text-sm text-success">On Time</p>
          <p className="font-bold text-2xl text-success">{stats.onTime}</p>
        </div>
        <div className="rounded-lg bg-warning/15 p-4">
          <p className="font-medium text-sm text-warning">Delayed</p>
          <p className="font-bold text-2xl text-warning">{stats.delayed}</p>
        </div>
        <div className="rounded-lg bg-muted p-4">
          <p className="font-medium text-foreground text-sm">Stopped</p>
          <p className="font-bold text-2xl text-foreground">{stats.stopped}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm lg:col-span-2">
          <div className="border-b bg-muted p-4">
            <h2 className="font-bold text-foreground">Live Map</h2>
            <p className="text-muted-foreground text-sm">
              Real-time vehicle locations
            </p>
          </div>
          <div className="relative h-96 bg-muted">
            {/* Map placeholder - in production, integrate with Google Maps or Mapbox */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-6xl">🗺️</div>
                <p className="font-medium text-muted-foreground">
                  Interactive Map
                </p>
                <p className="text-muted-foreground text-sm">
                  Google Maps / Mapbox Integration
                </p>
                <p className="mt-2 text-muted-foreground text-xs">
                  Coordinates: {vehicles[0]?.latitude.toFixed(4)},{" "}
                  {vehicles[0]?.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Vehicle markers */}
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="-translate-x-1/2 -translate-y-1/2 absolute transform cursor-pointer"
                style={{
                  left: `${((vehicle.longitude - 77.2) / 0.05) * 100}%`,
                  top: `${((28.65 - vehicle.latitude) / 0.05) * 100}%`,
                }}
                onClick={() => setSelectedVehicle(vehicle.id)}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-background text-sm shadow-lg ${
                    vehicle.status === "on-time"
                      ? "bg-success"
                      : vehicle.status === "delayed"
                        ? "bg-warning"
                        : "bg-foreground"
                  }`}
                >
                  🚌
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <div className="border-b bg-muted p-4">
            <h2 className="font-bold text-foreground">Vehicles</h2>
            <p className="text-muted-foreground text-sm">
              Click to view details
            </p>
          </div>
          <div className="max-h-96 divide-y overflow-auto">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`cursor-pointer p-4 transition-colors hover:bg-muted ${
                  selectedVehicle === vehicle.id
                    ? "border-primary border-l-4 bg-primary/5"
                    : ""
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{vehicle.vehicleNumber}</span>
                  <span
                    className={`rounded-full px-2 py-1 font-medium text-xs ${
                      vehicle.status === "on-time"
                        ? "bg-success/15 text-success"
                        : vehicle.status === "delayed"
                          ? "bg-warning/15 text-warning"
                          : "bg-muted text-foreground"
                    }`}
                  >
                    {vehicle.status === "on-time"
                      ? "On Time"
                      : vehicle.status === "delayed"
                        ? "Delayed"
                        : "Stopped"}
                  </span>
                </div>
                <div className="text-muted-foreground text-sm">
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
        <div className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-foreground">Vehicle Details</h2>
          {(() => {
            const vehicle = vehicles.find((v) => v.id === selectedVehicle);
            if (!vehicle) return null;
            return (
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Vehicle Number
                  </p>
                  <p className="font-medium text-lg">{vehicle.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Driver</p>
                  <p className="font-medium text-lg">{vehicle.driver}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Current Speed</p>
                  <p className="font-medium text-lg">{vehicle.speed} km/h</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Location</p>
                  <p className="font-medium">
                    {vehicle.latitude.toFixed(6)},{" "}
                    {vehicle.longitude.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Route</p>
                  <p className="font-medium">{vehicle.route}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Last Update</p>
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
