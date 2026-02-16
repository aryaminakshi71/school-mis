/**
 * Transport Management - Routes, Vehicles, and Tracking
 */

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
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Bus,
  Clock,
  Loader2,
  Map,
  Navigation,
  Plus,
  Route as RouteIcon,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
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
        estimatedTime: routeForm.estimatedTime
          ? Number(routeForm.estimatedTime)
          : null,
        fare: routeForm.fare ? Number(routeForm.fare) : null,
      });
      toast.success("Route added successfully");
      setIsRouteDialogOpen(false);
      setRouteForm({
        routeName: "",
        startPoint: "",
        endPoint: "",
        distance: "",
        estimatedTime: "",
        fare: "",
      });
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
      setVehicleForm({
        vehicleNumber: "",
        vehicleType: "Bus",
        capacity: "",
        driverName: "",
        driverPhone: "",
        routeId: "",
      });
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
    <div className="fade-in animate-in space-y-6 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground tracking-tight">
            Transport Management
          </h1>
          <p className="text-muted-foreground">
            Manage routes, vehicles and tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={isVehicleDialogOpen}
            onOpenChange={setIsVehicleDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Bus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Vehicle</DialogTitle>
                <DialogDescription>
                  Add a new vehicle to the fleet.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddVehicle} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vehicle Number *</Label>
                    <Input
                      placeholder="HR-01-XXXX"
                      value={vehicleForm.vehicleNumber}
                      onChange={(e) =>
                        setVehicleForm({
                          ...vehicleForm,
                          vehicleNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Select
                      value={vehicleForm.vehicleType}
                      onValueChange={(val) =>
                        setVehicleForm({ ...vehicleForm, vehicleType: val })
                      }
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
                    onChange={(e) =>
                      setVehicleForm({
                        ...vehicleForm,
                        capacity: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Driver Name *</Label>
                    <Input
                      placeholder="Driver name"
                      value={vehicleForm.driverName}
                      onChange={(e) =>
                        setVehicleForm({
                          ...vehicleForm,
                          driverName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Driver Phone</Label>
                    <Input
                      placeholder="Phone number"
                      value={vehicleForm.driverPhone}
                      onChange={(e) =>
                        setVehicleForm({
                          ...vehicleForm,
                          driverPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assigned Route</Label>
                  <Select
                    value={vehicleForm.routeId}
                    onValueChange={(val) =>
                      setVehicleForm({ ...vehicleForm, routeId: val })
                    }
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsVehicleDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
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
                <DialogDescription>
                  Create a new transport route.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddRoute} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Route Name *</Label>
                  <Input
                    placeholder="Route A"
                    value={routeForm.routeName}
                    onChange={(e) =>
                      setRouteForm({ ...routeForm, routeName: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Point *</Label>
                    <Input
                      placeholder="City Center"
                      value={routeForm.startPoint}
                      onChange={(e) =>
                        setRouteForm({
                          ...routeForm,
                          startPoint: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Point *</Label>
                    <Input
                      placeholder="School"
                      value={routeForm.endPoint}
                      onChange={(e) =>
                        setRouteForm({ ...routeForm, endPoint: e.target.value })
                      }
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
                      onChange={(e) =>
                        setRouteForm({ ...routeForm, distance: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Est. Time (min)</Label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={routeForm.estimatedTime}
                      onChange={(e) =>
                        setRouteForm({
                          ...routeForm,
                          estimatedTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fare (₹)</Label>
                    <Input
                      type="number"
                      placeholder="1500"
                      value={routeForm.fare}
                      onChange={(e) =>
                        setRouteForm({ ...routeForm, fare: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRouteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Route
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <RouteIcon className="h-5 w-5 text-primary" />
            </div>
            <p className="font-medium text-primary text-sm">Total Routes</p>
          </div>
          <p className="font-bold text-2xl text-primary">{stats.totalRoutes}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15">
              <Bus className="h-5 w-5 text-success" />
            </div>
            <p className="font-medium text-sm text-success">Active Vehicles</p>
          </div>
          <p className="font-bold text-2xl text-success">
            {stats.activeVehicles}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/15">
              <Users className="h-5 w-5 text-warning" />
            </div>
            <p className="font-medium text-sm text-warning">Students Using</p>
          </div>
          <p className="font-bold text-2xl text-warning">
            {stats.totalStudents}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <p className="font-medium text-primary text-sm">On Time %</p>
          </div>
          <p className="font-bold text-2xl text-primary">
            {stats.onTimePercentage}%
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("routes")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${activeTab === "routes" ? "border-primary border-b-2 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <RouteIcon className="h-4 w-4" />
            Routes
          </button>
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${activeTab === "vehicles" ? "border-primary border-b-2 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Bus className="h-4 w-4" />
            Vehicles
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${activeTab === "tracking" ? "border-primary border-b-2 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Navigation className="h-4 w-4" />
            Live Tracking
          </button>
        </div>

        {activeTab === "routes" && (
          <div className="overflow-x-auto">
            {routes.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <RouteIcon className="mx-auto mb-3 h-10 w-10 opacity-20" />
                <p>No routes defined yet.</p>
                <p className="text-sm">Click "Add Route" to create one.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                      Start Point
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                      End Point
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                      Distance
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                      Fare
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route) => (
                    <tr key={route.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-sm">
                        {route.routeName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-sm">
                        {route.startPoint}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-sm">
                        {route.endPoint}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-sm">
                        {route.distance ? `${route.distance} km` : "-"}
                      </td>
                      <td className="px-4 py-3 font-medium text-primary text-sm">
                        {route.fare ? `₹${route.fare}` : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
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
              <div className="py-12 text-center text-muted-foreground">
                <Bus className="mx-auto mb-3 h-10 w-10 opacity-20" />
                <p>No vehicles registered yet.</p>
                <p className="text-sm">Click "Add Vehicle" to add one.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                      Capacity
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                      Driver
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-sm">
                        {vehicle.vehicleNumber}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-sm">
                        {vehicle.vehicleType}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-sm">
                        {vehicle.capacity || "-"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-sm">
                        {vehicle.driverName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 font-medium text-xs ${vehicle.status === "active" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}
                        >
                          {vehicle.status === "active"
                            ? "Active"
                            : "Maintenance"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">
                          Track
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
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
            <div className="mb-4 flex items-center justify-between">
              <div className="mr-4 flex h-64 flex-1 items-center justify-center rounded-lg bg-muted">
                <div className="text-center text-muted-foreground">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted-foreground/20">
                    <Map className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="mb-2">Live map view with GPS tracking</p>
                  <Link
                    to="/app/transport/tracking"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                  >
                    Open Full Tracking
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="w-80 space-y-4">
                {mockTracking.map((track, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Bus className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{track.vehicle}</p>
                        <p className="text-muted-foreground text-sm">
                          Driver: {track.driver}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{track.speed} km/h</p>
                      <span
                        className={`rounded-full px-2 py-1 font-medium text-xs ${track.status === "on-time" ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}
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
