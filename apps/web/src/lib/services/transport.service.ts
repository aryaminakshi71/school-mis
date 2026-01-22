export interface Bus {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  currentOccupancy: number;
  routeId: string;
  status: "active" | "inactive" | "maintenance";
  lastLocation?: GeoLocation;
  lastUpdated?: Date;
}

export interface Route {
  id: string;
  name: string;
  stops: RouteStop[];
  driverId: string;
  busId: string;
  morningPickupTime: string;
  eveningDropTime: string;
  isActive: boolean;
}

export interface RouteStop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  pickupTime: string;
  dropTime: string;
  students: string[];
  order: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
}

export interface StudentTransportInfo {
  studentId: string;
  routeId: string;
  stopId: string;
  pickupEnabled: boolean;
  dropEnabled: boolean;
  status: "active" | "inactive" | "pending";
}

export interface Notification {
  id: string;
  type: "delay" | "arrival" | "emergency" | "update";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  routeId?: string;
  busId?: string;
}

const MOCK_BUSES: Bus[] = [
  {
    id: "bus1",
    vehicleNumber: "HR-26-A-1234",
    driverName: "Suresh Kumar",
    driverPhone: "+91 98765 43210",
    capacity: 50,
    currentOccupancy: 35,
    routeId: "route1",
    status: "active",
  },
  {
    id: "bus2",
    vehicleNumber: "HR-26-A-5678",
    driverName: "Ramesh Gupta",
    driverPhone: "+91 98765 43211",
    capacity: 45,
    currentOccupancy: 28,
    routeId: "route2",
    status: "active",
  },
  {
    id: "bus3",
    vehicleNumber: "HR-26-B-9012",
    driverName: "Mukesh Singh",
    driverPhone: "+91 98765 43212",
    capacity: 40,
    currentOccupancy: 22,
    routeId: "route3",
    status: "active",
  },
];

const MOCK_ROUTES: Route[] = [
  {
    id: "route1",
    name: "North Campus",
    stops: [
      {
        id: "stop1",
        name: "Sector 15 Main Market",
        address: "Main Market, Sector 15",
        latitude: 28.4256,
        longitude: 77.0385,
        pickupTime: "07:15 AM",
        dropTime: "04:30 PM",
        students: ["s1", "s2", "s3"],
        order: 1,
      },
      {
        id: "stop2",
        name: "City Centre",
        address: "City Centre, Sector 16",
        latitude: 28.4212,
        longitude: 77.0423,
        pickupTime: "07:30 AM",
        dropTime: "04:15 PM",
        students: ["s4", "s5"],
        order: 2,
      },
      {
        id: "stop3",
        name: "Railway Station",
        address: "Near Railway Station",
        latitude: 28.4156,
        longitude: 77.0489,
        pickupTime: "07:45 AM",
        dropTime: "04:00 PM",
        students: ["s6"],
        order: 3,
      },
    ],
    driverId: "bus1",
    busId: "bus1",
    morningPickupTime: "07:15 AM",
    eveningDropTime: "04:30 PM",
    isActive: true,
  },
  {
    id: "route2",
    name: "South Campus",
    stops: [
      {
        id: "stop4",
        name: "DLF Phase 1",
        address: "DLF Phase 1",
        latitude: 28.4689,
        longitude: 77.0745,
        pickupTime: "07:00 AM",
        dropTime: "04:45 PM",
        students: ["s7", "s8"],
        order: 1,
      },
      {
        id: "stop5",
        name: "Golf Course Road",
        address: "Golf Course Road",
        latitude: 28.4723,
        longitude: 77.0789,
        pickupTime: "07:20 AM",
        dropTime: "04:25 PM",
        students: ["s9"],
        order: 2,
      },
    ],
    driverId: "bus2",
    busId: "bus2",
    morningPickupTime: "07:00 AM",
    eveningDropTime: "04:45 PM",
    isActive: true,
  },
  {
    id: "route3",
    name: "East Corridor",
    stops: [
      {
        id: "stop6",
        name: "Indirapuram",
        address: "Indirapuram",
        latitude: 28.6355,
        longitude: 77.3721,
        pickupTime: "06:45 AM",
        dropTime: "05:00 PM",
        students: ["s10", "s11"],
        order: 1,
      },
      {
        id: "stop7",
        name: "Vasundhara",
        address: "Vasundhara",
        latitude: 28.6389,
        longitude: 77.3656,
        pickupTime: "07:00 AM",
        dropTime: "04:45 PM",
        students: ["s12"],
        order: 2,
      },
    ],
    driverId: "bus3",
    busId: "bus3",
    morningPickupTime: "06:45 AM",
    eveningDropTime: "05:00 PM",
    isActive: true,
  },
];

class TransportService {
  private buses: Bus[] = [];
  private routes: Route[] = [];
  private notifications: Notification[] = [];
  private studentTransport: Map<string, StudentTransportInfo> = new Map();
  private locationUpdateInterval: number | null = null;
  private listeners: Set<(data: { buses: Bus[]; routes: Route[] }) => void> =
    new Set();

  constructor() {
    this.loadFromStorage();
    this.startLocationSimulation();
  }

  private loadFromStorage() {
    const savedBuses = localStorage.getItem("transport_buses");
    const savedRoutes = localStorage.getItem("transport_routes");
    const savedNotifications = localStorage.getItem("transport_notifications");
    const savedStudentTransport = localStorage.getItem("student_transport");

    this.buses = savedBuses ? JSON.parse(savedBuses) : MOCK_BUSES;
    this.routes = savedRoutes ? JSON.parse(savedRoutes) : MOCK_ROUTES;
    this.notifications = savedNotifications
      ? JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }))
      : [];

    if (savedStudentTransport) {
      try {
        const parsed = JSON.parse(savedStudentTransport);
        Object.entries(parsed).forEach(([key, value]) => {
          this.studentTransport.set(key, value as StudentTransportInfo);
        });
      } catch {
        this.initializeMockStudentTransport();
      }
    } else {
      this.initializeMockStudentTransport();
    }
  }

  private initializeMockStudentTransport() {
    const mockData: Record<string, StudentTransportInfo> = {
      s1: {
        studentId: "s1",
        routeId: "route1",
        stopId: "stop1",
        pickupEnabled: true,
        dropEnabled: true,
        status: "active",
      },
      s2: {
        studentId: "s2",
        routeId: "route1",
        stopId: "stop1",
        pickupEnabled: true,
        dropEnabled: true,
        status: "active",
      },
      s3: {
        studentId: "s3",
        routeId: "route1",
        stopId: "stop1",
        pickupEnabled: true,
        dropEnabled: true,
        status: "active",
      },
      s7: {
        studentId: "s7",
        routeId: "route2",
        stopId: "stop4",
        pickupEnabled: true,
        dropEnabled: true,
        status: "active",
      },
    };
    Object.entries(mockData).forEach(([key, value]) => {
      this.studentTransport.set(key, value);
    });
    this.saveStudentTransport();
  }

  private saveToStorage() {
    localStorage.setItem("transport_buses", JSON.stringify(this.buses));
    localStorage.setItem("transport_routes", JSON.stringify(this.routes));
    localStorage.setItem(
      "transport_notifications",
      JSON.stringify(this.notifications),
    );
  }

  private saveStudentTransport() {
    const data: Record<string, StudentTransportInfo> = {};
    this.studentTransport.forEach((value, key) => {
      data[key] = value;
    });
    localStorage.setItem("student_transport", JSON.stringify(data));
  }

  private startLocationSimulation() {
    if (typeof window === "undefined") return;

    this.locationUpdateInterval = window.setInterval(() => {
      this.buses = this.buses.map((bus) => {
        if (bus.status !== "active") return bus;

        const baseLat = 28.42 + Math.random() * 0.05;
        const baseLng = 77.04 + Math.random() * 0.05;

        return {
          ...bus,
          lastLocation: {
            latitude: baseLat + (Math.random() - 0.5) * 0.01,
            longitude: baseLng + (Math.random() - 0.5) * 0.01,
            speed: 30 + Math.random() * 20,
            heading: Math.random() * 360,
            accuracy: 5 + Math.random() * 10,
          },
          lastUpdated: new Date(),
        };
      });
      this.notifyListeners();
    }, 5000);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) =>
      listener({ buses: this.buses, routes: this.routes }),
    );
  }

  addListener(listener: (data: { buses: Bus[]; routes: Route[] }) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getBuses(): Bus[] {
    return [...this.buses];
  }

  getBusById(id: string): Bus | undefined {
    return this.buses.find((b) => b.id === id);
  }

  getRoutes(): Route[] {
    return [...this.routes];
  }

  getRouteById(id: string): Route | undefined {
    return this.routes.find((r) => r.id === id);
  }

  getRouteByBusId(busId: string): Route | undefined {
    return this.routes.find((r) => r.busId === busId);
  }

  getStudentTransportInfo(studentId: string): StudentTransportInfo | undefined {
    return this.studentTransport.get(studentId);
  }

  getStudentRouteInfo(
    studentId: string,
  ): {
    route: Route | undefined;
    stop: RouteStop | undefined;
    bus: Bus | undefined;
  } | null {
    const transportInfo = this.studentTransport.get(studentId);
    if (!transportInfo) return null;

    const route = this.getRouteById(transportInfo.routeId);
    const stop = route?.stops.find((s) => s.id === transportInfo.stopId);
    const bus = this.getBusById(route?.busId || "");

    return { route, stop, bus };
  }

  updateBusLocation(busId: string, location: GeoLocation) {
    const bus = this.buses.find((b) => b.id === busId);
    if (bus) {
      bus.lastLocation = location;
      bus.lastUpdated = new Date();
      this.notifyListeners();
    }
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  estimateArrivalTime(
    busId: string,
    stopId: string,
  ): { minutes: number; distance: number } | null {
    const bus = this.buses.find((b) => b.id === busId);
    const route = this.getRouteByBusId(busId);
    if (!bus || !route || !bus.lastLocation) return null;

    const stop = route.stops.find((s) => s.id === stopId);
    if (!stop) return null;

    const distance = this.calculateDistance(
      bus.lastLocation.latitude,
      bus.lastLocation.longitude,
      stop.latitude,
      stop.longitude,
    );

    const speed = bus.lastLocation.speed || 30;
    const minutes = Math.ceil((distance / speed) * 60);

    return { minutes, distance: Math.round(distance * 100) / 100 };
  }

  getAllNotifications(): Notification[] {
    return [...this.notifications].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  getUnreadNotifications(): Notification[] {
    return this.notifications.filter((n) => !n.read);
  }

  addNotification(
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    this.notifications.unshift(newNotification);
    this.saveToStorage();
    return newNotification;
  }

  markNotificationAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
    }
  }

  markAllNotificationsAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.saveToStorage();
  }

  getRouteMapData(): Array<{
    routeId: string;
    stops: Array<{ lat: number; lng: number; name: string }>;
    busLocation?: GeoLocation;
  }> {
    return this.routes.map((route) => {
      const bus = this.buses.find((b) => b.id === route.busId);
      return {
        routeId: route.id,
        stops: route.stops.map((s) => ({
          lat: s.latitude,
          lng: s.longitude,
          name: s.name,
        })),
        busLocation: bus?.lastLocation,
      };
    });
  }

  getTransportSummary(): {
    activeBuses: number;
    totalStudents: number;
    totalRoutes: number;
    activeNotifications: number;
  } {
    return {
      activeBuses: this.buses.filter((b) => b.status === "active").length,
      totalStudents: Array.from(this.studentTransport.values()).filter(
        (s) => s.status === "active",
      ).length,
      totalRoutes: this.routes.filter((r) => r.isActive).length,
      activeNotifications: this.getUnreadNotifications().length,
    };
  }

  updateStudentTransport(
    studentId: string,
    info: Partial<StudentTransportInfo>,
  ) {
    const existing = this.studentTransport.get(studentId);
    if (existing) {
      this.studentTransport.set(studentId, { ...existing, ...info });
    } else {
      this.studentTransport.set(studentId, info as StudentTransportInfo);
    }
    this.saveStudentTransport();
  }

  cleanup() {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
    }
  }
}

export const transportService = new TransportService();

export function useTransport() {
  return {
    buses: transportService.getBuses(),
    routes: transportService.getRoutes(),
    getBusById: transportService.getBusById.bind(transportService),
    getRouteById: transportService.getRouteById.bind(transportService),
    getRouteByBusId: transportService.getRouteByBusId.bind(transportService),
    getStudentTransportInfo:
      transportService.getStudentTransportInfo.bind(transportService),
    getStudentRouteInfo:
      transportService.getStudentRouteInfo.bind(transportService),
    estimateArrivalTime:
      transportService.estimateArrivalTime.bind(transportService),
    getAllNotifications:
      transportService.getAllNotifications.bind(transportService),
    getUnreadNotifications:
      transportService.getUnreadNotifications.bind(transportService),
    addNotification: transportService.addNotification.bind(transportService),
    markNotificationAsRead:
      transportService.markNotificationAsRead.bind(transportService),
    markAllNotificationsAsRead:
      transportService.markAllNotificationsAsRead.bind(transportService),
    getRouteMapData: transportService.getRouteMapData.bind(transportService),
    getTransportSummary:
      transportService.getTransportSummary.bind(transportService),
    updateStudentTransport:
      transportService.updateStudentTransport.bind(transportService),
  };
}

export default transportService;
