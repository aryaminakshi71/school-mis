/**
 * Transport Management - Routes, Vehicles, and Tracking
 */

import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

type RouteTab = "routes" | "vehicles" | "tracking";

function TransportPage() {
  const [activeTab, setActiveTab] = useState<RouteTab>("routes");
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [routeForm, setRouteForm] = useState({
    routeName: "",
    startPoint: "",
    endPoint: "",
    distance: "",
    estimatedTime: "",
    fare: "",
  });

  const [vehicleForm, setVehicleForm] = useState({
    vehicleNumber: "",
    vehicleType: "Bus",
    capacity: "",
    driverName: "",
    driverPhone: "",
    routeId: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [routesData, vehiclesData] = await Promise.all([
        api.transport.routes.list(),
        api.transport.vehicles.list(),
      ]);
      setRoutes(routesData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error("Failed to fetch transport data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeForm.routeName || !routeForm.startPoint || !routeForm.endPoint) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await api.transport.routes.create({
        ...routeForm,
        distance: routeForm.distance ? Number(routeForm.distance) : null,
        estimatedTime: routeForm.estimatedTime ? Number(routeForm.estimatedTime) : null,
        fare: routeForm.fare ? Number(routeForm.fare) : null,
      });
      toast.success("Route added successfully");
      setIsRouteDialogOpen(false);
      setRouteForm({ routeName: "", startPoint: "", endPoint: "", distance: "", estimatedTime: "", fare: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to add route");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.vehicleNumber || !vehicleForm.driverName) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await api.transport.vehicles.create({
        ...vehicleForm,
        capacity: vehicleForm.capacity ? Number(vehicleForm.capacity) : null,
      });
      toast.success("Vehicle added successfully");
      setIsVehicleDialogOpen(false);
      setVehicleForm({ vehicleNumber: "", vehicleType: "Bus", capacity: "", driverName: "", driverPhone: "", routeId: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to add vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  // Mock tracking data (would be real-time in production)
  const mockTracking = [
    {
      vehicle: vehicles[0]?.vehicleNumber || "HR-01-1234",
      driver: vehicles[0]?.driverName || "Raj Kumar",
      location: "Main Road, 2km away",
      speed: 45,
      status: "on-time",
    },
    {
      vehicle: vehicles[1]?.vehicleNumber || "HR-01-5678",
      driver: vehicles[1]?.driverName || "Amit Singh",
      location: "Station Road, 5km away",
      speed: 38,
      status: "delayed",
    },
  ];

  const stats = {
    totalRoutes: routes.length,
    activeVehicles: vehicles.filter((v) => v.status === "active").length,
    totalStudents: 156,
    onTimePercentage: 94,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Transport Management
          </h1>
          <p className="text-muted-foreground">Manage routes, vehicles and tracking</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Bus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Vehicle</DialogTitle>
                <DialogDescription>Add a new vehicle to the fleet.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddVehicle} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vehicle Number *</Label>
                    <Input
                      placeholder="HR-01-XXXX"
                      value={vehicleForm.vehicleNumber}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Select
                      value={vehicleForm.vehicleType}
                      onValueChange={(val) => setVehicleForm({ ...vehicleForm, vehicleType: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bus">Bus</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Mini Bus">Mini Bus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={vehicleForm.capacity}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Driver Name *</Label>
                    <Input
                      placeholder="Driver name"
                      value={vehicleForm.driverName}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, driverName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Driver Phone</Label>
                    <Input
                      placeholder="Phone number"
                      value={vehicleForm.driverPhone}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, driverPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assigned Route</Label>
                  <Select
                    value={vehicleForm.routeId}
                    onValueChange={(val) => setVehicleForm({ ...vehicleForm, routeId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.routeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsVehicleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Vehicle
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isRouteDialogOpen} onOpenChange={setIsRouteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Route</DialogTitle>
                <DialogDescription>Create a new transport route.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddRoute} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Route Name *</Label>
                  <Input
                    placeholder="Route A"
                    value={routeForm.routeName}
                    onChange={(e) => setRouteForm({ ...routeForm, routeName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Point *</Label>
                    <Input
                      placeholder="City Center"
                      value={routeForm.startPoint}
                      onChange={(e) => setRouteForm({ ...routeForm, startPoint: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Point *</Label>
                    <Input
                      placeholder="School"
                      value={routeForm.endPoint}
                      onChange={(e) => setRouteForm({ ...routeForm, endPoint: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Distance (km)</Label>
                    <Input
                      type="number"
                      placeholder="5.5"
                      value={routeForm.distance}
                      onChange={(e) => setRouteForm({ ...routeForm, distance: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Est. Time (min)</Label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={routeForm.estimatedTime}
                      onChange={(e) => setRouteForm({ ...routeForm, estimatedTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fare (₹)</Label>
                    <Input
                      type="number"
                      placeholder="1500"
                      value={routeForm.fare}
                      onChange={(e) => setRouteForm({ ...routeForm, fare: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsRouteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Route
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4 shadow-sm">
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
        <div className="bg-card rounded-lg border p-4 shadow-sm">
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
        <div className="bg-card rounded-lg border p-4 shadow-sm">
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
        <div className="bg-card rounded-lg border p-4 shadow-sm">
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

      <div className="bg-card rounded-lg border overflow-hidden shadow-sm">
        <div className="border-b flex">
          <button
            onClick={() => setActiveTab("routes")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${activeTab === "routes" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <RouteIcon className="w-4 h-4" />
            Routes
          </button>
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${activeTab === "vehicles" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Bus className="w-4 h-4" />
            Vehicles
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${activeTab === "tracking" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Navigation className="w-4 h-4" />
            Live Tracking
          </button>
        </div>

        {activeTab === "routes" && (
          <div className="overflow-x-auto">
            {routes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <RouteIcon className="mx-auto h-10 w-10 mb-3 opacity-20" />
                <p>No routes defined yet.</p>
                <p className="text-sm">Click "Add Route" to create one.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Start Point
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      End Point
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Distance
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Fare
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route) => (
                    <tr key={route.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium">
                        {route.routeName}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {route.startPoint}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {route.endPoint}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {route.distance ? `${route.distance} km` : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-primary">
                        {route.fare ? `₹${route.fare}` : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "vehicles" && (
          <div className="overflow-x-auto">
            {vehicles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bus className="mx-auto h-10 w-10 mb-3 opacity-20" />
                <p>No vehicles registered yet.</p>
                <p className="text-sm">Click "Add Vehicle" to add one.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Capacity
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Driver
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium">
                        {vehicle.vehicleNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {vehicle.vehicleType}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {vehicle.capacity || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {vehicle.driverName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${vehicle.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {vehicle.status === "active" ? "Active" : "Maintenance"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">Track</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "tracking" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-muted rounded-lg h-64 flex-1 flex items-center justify-center mr-4">
                <div className="text-center text-muted-foreground">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                    <Map className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="mb-2">Live map view with GPS tracking</p>
                  <Link
                    to="/app/transport/tracking"
                    className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                  >
                    Open Full Tracking
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="space-y-4 w-80">
                {mockTracking.map((track, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bus className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{track.vehicle}</p>
                        <p className="text-sm text-muted-foreground">
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

export const Route = createFileRoute("/app/transport/")({
  component: TransportPage,
});
