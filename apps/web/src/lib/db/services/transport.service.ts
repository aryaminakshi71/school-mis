import { db, gpsTracking, transportRoutes, vehicles } from "@school/storage";
import { asc, desc, eq } from "drizzle-orm";
import { fromPgDate } from "../date-utils";

export interface TransportRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  distance?: number;
  estimatedTime?: number;
  status: string;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  capacity: number;
  routeId?: string;
  status: string;
  insuranceExpiry?: Date;
  fitnessExpiry?: Date;
}

export interface GPSLocation {
  id: string;
  vehicleId: string;
  driverId?: string;
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp: Date;
  location?: string;
}

const mapRouteRow = (
  row: typeof transportRoutes.$inferSelect,
): TransportRoute => ({
  id: row.id,
  routeNumber: row.routeNumber || "",
  routeName: row.routeName,
  startPoint: row.startPoint,
  endPoint: row.endPoint,
  distance: row.distance ? Number(row.distance) : undefined,
  estimatedTime: row.estimatedTime || undefined,
  status: row.status || "active",
  createdAt: row.createdAt || new Date(),
});

const mapVehicleRow = (row: typeof vehicles.$inferSelect): Vehicle => ({
  id: row.id,
  vehicleNumber: row.vehicleNumber || "",
  vehicleType: row.vehicleType,
  capacity: row.capacity,
  routeId: row.routeId || undefined,
  status: row.status || "active",
  insuranceExpiry: fromPgDate(row.insuranceExpiry),
  fitnessExpiry: fromPgDate(row.fitnessExpiry),
});

const mapLocationRow = (row: typeof gpsTracking.$inferSelect): GPSLocation => ({
  id: row.id,
  vehicleId: row.vehicleId,
  driverId: row.driverId || undefined,
  latitude: Number(row.latitude),
  longitude: Number(row.longitude),
  speed: row.speed ? Number(row.speed) : undefined,
  timestamp: row.timestamp || new Date(),
  location: row.location || undefined,
});

export const transportService = {
  async listRoutes(): Promise<TransportRoute[]> {
    const result = await db
      .select()
      .from(transportRoutes)
      .orderBy(asc(transportRoutes.routeNumber));
    return result.map(mapRouteRow);
  },

  async getRoute(id: string): Promise<TransportRoute | null> {
    const result = await db
      .select()
      .from(transportRoutes)
      .where(eq(transportRoutes.id, id))
      .limit(1);
    return result[0] ? mapRouteRow(result[0]) : null;
  },

  async listVehicles(): Promise<Vehicle[]> {
    const result = await db
      .select()
      .from(vehicles)
      .orderBy(asc(vehicles.vehicleNumber));
    return result.map(mapVehicleRow);
  },

  async getVehicleLocation(vehicleId: string): Promise<GPSLocation | null> {
    const result = await db
      .select()
      .from(gpsTracking)
      .where(eq(gpsTracking.vehicleId, vehicleId))
      .orderBy(desc(gpsTracking.timestamp))
      .limit(1);

    return result[0] ? mapLocationRow(result[0]) : null;
  },

  async updateVehicleLocation(
    vehicleId: string,
    latitude: number,
    longitude: number,
    speed?: number,
    location?: string,
  ): Promise<GPSLocation> {
    const result = await db
      .insert(gpsTracking)
      .values({
        vehicleId,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        speed: speed?.toString(),
        location,
      })
      .returning();

    const created = result[0];
    if (!created) {
      throw new Error("Failed to update vehicle location");
    }

    return mapLocationRow(created);
  },

  async getStudentRoute(_studentId: string): Promise<TransportRoute | null> {
    // Student-to-route relation is not modeled in current schema.
    return null;
  },
};
