import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

export type FacilityType =
  | "classroom"
  | "lab"
  | "auditorium"
  | "sports"
  | "meeting"
  | "library"
  | "cafeteria"
  | "outdoor";

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  capacity: number;
  location: string;
  amenities: string[];
  images: string[];
  availability: FacilityAvailability;
  rules?: string[];
  equipment?: string[];
  floorPlan?: string;
}

export interface FacilityAvailability {
  openingHours: string;
  closingHours: string;
  daysAvailable: number[];
  blackoutDates: Date[];
  maintenanceSchedule?: MaintenanceWindow[];
}

export interface MaintenanceWindow {
  startDate: Date;
  endDate: Date;
  description: string;
}

export interface BookingRequest {
  id: string;
  facilityId: string;
  facilityName: string;
  requesterId: string;
  requesterName: string;
  requesterType: "student" | "teacher" | "staff" | "external";
  purpose: string;
  eventType: string;
  startTime: Date;
  endTime: Date;
  attendees: number;
  equipment: string[];
  setupRequirements?: string;
  catering?: CateringRequest;
  status: "pending" | "approved" | "rejected" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  conflictWith?: string[];
}

export interface CateringRequest {
  required: boolean;
  mealType?: "breakfast" | "lunch" | "dinner" | "snacks";
  attendeeCount: number;
  dietaryRestrictions?: string[];
  specialRequests?: string;
}

interface FacilityBookingSystemProps {
  userRole?: "admin" | "teacher" | "student" | "staff";
  onCreateBooking?: (
    booking: Omit<BookingRequest, "id" | "status" | "createdAt">,
  ) => Promise<string>;
  onApproveBooking?: (
    bookingId: string,
    approved: boolean,
    reason?: string,
  ) => Promise<void>;
  onCancelBooking?: (bookingId: string) => Promise<void>;
  onUpdateFacility?: (
    facilityId: string,
    updates: Partial<Facility>,
  ) => Promise<void>;
}

export function FacilityBookingSystem({
  userRole = "teacher",
  onCreateBooking,
  onApproveBooking,
  onCancelBooking,
  onUpdateFacility,
}: FacilityBookingSystemProps) {
  const [activeTab, setActiveTab] = useState<
    "facilities" | "bookings" | "calendar"
  >("facilities");
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null,
  );
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<FacilityType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<
    BookingRequest["status"] | "all"
  >("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showBookingDetails, setShowBookingDetails] =
    useState<BookingRequest | null>(null);

  const [facilities, setFacilities] = useState<Facility[]>([
    {
      id: "F001",
      name: "Science Lab A",
      type: "lab",
      capacity: 30,
      location: "Building 1, Floor 2",
      amenities: [
        "Microscopes",
        "Fume Hoods",
        "Safety Equipment",
        "Smart Board",
        "Projector",
      ],
      images: [],
      availability: {
        openingHours: "08:00",
        closingHours: "18:00",
        daysAvailable: [1, 2, 3, 4, 5],
        blackoutDates: [],
      },
      equipment: ["Chemical Storage", "Safety Shower", "Eyewash Station"],
      rules: [
        "Safety goggles mandatory",
        "No food or drinks",
        "Proper lab attire required",
      ],
    },
    {
      id: "F002",
      name: "Main Auditorium",
      type: "auditorium",
      capacity: 500,
      location: "Central Block, Ground Floor",
      amenities: [
        "Stage",
        "Professional Lighting",
        "Sound System",
        "Projector",
        "Wheelchair Access",
      ],
      images: [],
      availability: {
        openingHours: "07:00",
        closingHours: "22:00",
        daysAvailable: [0, 1, 2, 3, 4, 5, 6],
        blackoutDates: [],
      },
      equipment: ["Podium", "Wireless Microphones", "LED Screen"],
    },
    {
      id: "F003",
      name: "Computer Lab B",
      type: "lab",
      capacity: 40,
      location: "Building 2, Floor 1",
      amenities: [
        "40 Workstations",
        "High-Speed Internet",
        "Printer",
        "Smart Board",
        "Air Conditioning",
      ],
      images: [],
      availability: {
        openingHours: "08:00",
        closingHours: "20:00",
        daysAvailable: [1, 2, 3, 4, 5, 6],
        blackoutDates: [],
      },
    },
    {
      id: "F004",
      name: "Basketball Court",
      type: "sports",
      capacity: 20,
      location: "Sports Complex, Outdoor",
      amenities: [
        "Full-Size Court",
        "Scoreboard",
        "Floodlights",
        "Bench Seating",
        "Equipment Storage",
      ],
      images: [],
      availability: {
        openingHours: "06:00",
        closingHours: "21:00",
        daysAvailable: [0, 1, 2, 3, 4, 5, 6],
        blackoutDates: [],
      },
    },
    {
      id: "F005",
      name: "Conference Room Alpha",
      type: "meeting",
      capacity: 20,
      location: "Admin Building, Floor 3",
      amenities: [
        "Video Conferencing",
        "Whiteboard",
        "Projector",
        "Coffee Station",
        "Comfortable Seating",
      ],
      images: [],
      availability: {
        openingHours: "08:00",
        closingHours: "18:00",
        daysAvailable: [1, 2, 3, 4, 5],
        blackoutDates: [],
      },
    },
  ]);

  const [bookings, setBookings] = useState<BookingRequest[]>([
    {
      id: "B001",
      facilityId: "F001",
      facilityName: "Science Lab A",
      requesterId: "T001",
      requesterName: "Dr. Sarah Johnson",
      requesterType: "teacher",
      purpose: "Chemistry Practical Exam",
      eventType: "Examination",
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 90000000),
      attendees: 25,
      equipment: ["Safety Equipment", "Chemical Set A"],
      status: "approved",
      priority: "high",
      createdAt: new Date(Date.now() - 172800000),
      approvedBy: "Admin",
      approvedAt: new Date(Date.now() - 86400000),
    },
    {
      id: "B002",
      facilityId: "F002",
      facilityName: "Main Auditorium",
      requesterId: "S001",
      requesterName: "Student Council",
      requesterType: "student",
      purpose: "Annual Cultural Festival",
      eventType: "Cultural Event",
      startTime: new Date(Date.now() + 604800000),
      endTime: new Date(Date.now() + 612000000),
      attendees: 400,
      equipment: ["Stage Setup", "Sound System"],
      status: "pending",
      priority: "medium",
      createdAt: new Date(Date.now() - 86400000),
    },
  ]);

  const [newBooking, setNewBooking] = useState<Partial<BookingRequest>>({
    facilityId: "",
    requesterId: "",
    requesterName: "",
    requesterType: "teacher",
    purpose: "",
    eventType: "",
    attendees: 10,
    equipment: [],
    priority: "medium",
  });

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" || facility.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.startTime);
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleCreateBooking = async () => {
    if (
      !selectedFacility ||
      !newBooking.purpose ||
      !newBooking.startTime ||
      !newBooking.endTime
    )
      return;

    const booking: Omit<BookingRequest, "id" | "status" | "createdAt"> = {
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      requesterId: "T001",
      requesterName: "Dr. Sarah Johnson",
      requesterType: "teacher",
      purpose: newBooking.purpose!,
      eventType: newBooking.eventType || "Meeting",
      startTime: newBooking.startTime!,
      endTime: newBooking.endTime!,
      attendees: newBooking.attendees || 10,
      equipment: newBooking.equipment || [],
      setupRequirements: newBooking.setupRequirements,
      catering: newBooking.catering,
      priority: newBooking.priority || "medium",
      approvedBy: newBooking.approvedBy,
      approvedAt: newBooking.approvedAt,
      rejectionReason: newBooking.rejectionReason,
      conflictWith: newBooking.conflictWith,
    };

    const id = onCreateBooking
      ? await onCreateBooking(booking)
      : `B${Date.now()}`;

    setBookings((prev) => [
      ...prev,
      {
        ...booking,
        id,
        status: "pending",
        createdAt: new Date(),
      } as BookingRequest,
    ]);

    setShowBookingForm(false);
    setNewBooking({
      facilityId: "",
      requesterId: "",
      requesterName: "",
      requesterType: "teacher",
      purpose: "",
      eventType: "",
      attendees: 10,
      equipment: [],
      priority: "medium",
    });
  };

  const handleApproveBooking = async (bookingId: string, approved: boolean) => {
    if (onApproveBooking) {
      await onApproveBooking(bookingId, approved);
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: approved ? "approved" : "rejected",
              approvedBy: approved ? userRole : undefined,
              approvedAt: approved ? new Date() : undefined,
            }
          : b,
      ),
    );
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (onCancelBooking) {
      await onCancelBooking(bookingId);
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b)),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "cancelled":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-blue-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-slate-500";
    }
  };

  const facilityTypeIcons: Record<FacilityType, string> = {
    classroom: "🏫",
    lab: "🔬",
    auditorium: "🎭",
    sports: "⚽",
    meeting: "🤝",
    library: "📚",
    cafeteria: "🍽️",
    outdoor: "🌳",
  };

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-3xl text-slate-900">
            Facility Booking
          </h2>
          <p className="mt-1 text-slate-600">
            Reserve classrooms, labs, and event spaces
          </p>
        </div>
        <div className="flex items-center gap-3">
          {userRole === "admin" && (
            <button className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-200">
              <Plus className="h-4 w-4" />
              Add Facility
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "facilities", label: "Facilities", icon: Building2 },
          { id: "bookings", label: "My Bookings", icon: Calendar },
          { id: "calendar", label: "Calendar View", icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 border-b-2 text-indigo-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "facilities" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search facilities..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedType(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              {Object.entries(facilityTypeIcons).map(([type, icon]) => (
                <option key={type} value={type}>
                  {icon} {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredFacilities.map((facility) => (
                <motion.div
                  key={facility.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg"
                  onClick={() => setSelectedFacility(facility)}
                >
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                    <span className="text-6xl">
                      {facilityTypeIcons[facility.type]}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold text-lg text-slate-900">
                        {facility.name}
                      </h3>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600 text-xs capitalize">
                        {facility.type}
                      </span>
                    </div>
                    <p className="mb-3 flex items-center gap-1 text-slate-500 text-sm">
                      <MapPin className="h-4 w-4" />
                      {facility.location}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Users className="h-4 w-4" />
                        Capacity: {facility.capacity}
                      </span>
                      <span className="text-slate-600">
                        {facility.amenities.length} amenities
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {selectedFacility && !showBookingForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedFacility(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                  <span className="text-8xl">
                    {facilityTypeIcons[selectedFacility.type]}
                  </span>
                  <button
                    onClick={() => setSelectedFacility(null)}
                    className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 font-bold text-2xl text-slate-900">
                        {selectedFacility.name}
                      </h3>
                      <p className="flex items-center gap-1 text-slate-600">
                        <MapPin className="h-4 w-4" />
                        {selectedFacility.location}
                      </p>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700 capitalize">
                      {selectedFacility.type}
                    </span>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="mb-1 text-slate-500 text-sm">Capacity</p>
                      <p className="font-semibold text-slate-900 text-xl">
                        {selectedFacility.capacity} people
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="mb-1 text-slate-500 text-sm">
                        Available Hours
                      </p>
                      <p className="font-semibold text-slate-900 text-xl">
                        {selectedFacility.availability.openingHours} -{" "}
                        {selectedFacility.availability.closingHours}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="mb-2 font-semibold text-slate-900">
                      Amenities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFacility.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedFacility.rules && (
                    <div className="mb-6">
                      <h4 className="mb-2 font-semibold text-slate-900">
                        Rules & Guidelines
                      </h4>
                      <ul className="space-y-1">
                        {selectedFacility.rules.map((rule, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-slate-600 text-sm"
                          >
                            <span className="text-amber-500">•</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
                    >
                      <Calendar className="h-5 w-5" />
                      Book This Facility
                    </button>
                    <button
                      onClick={() => setSelectedFacility(null)}
                      className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showBookingForm && selectedFacility && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowBookingForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="border-slate-200 border-b p-6">
                  <h3 className="font-bold text-slate-900 text-xl">
                    Book {selectedFacility.name}
                  </h3>
                  <p className="text-slate-600">
                    Complete the form to request a booking
                  </p>
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">
                      Purpose
                    </label>
                    <input
                      type="text"
                      value={newBooking.purpose || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewBooking({
                          ...newBooking,
                          purpose: e.target.value,
                        })
                      }
                      placeholder="What is this booking for?"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">
                      Event Type
                    </label>
                    <select
                      value={newBooking.eventType || ""}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewBooking({
                          ...newBooking,
                          eventType: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select event type</option>
                      <option value="Class">Regular Class</option>
                      <option value="Examination">Examination</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Cultural Event">Cultural Event</option>
                      <option value="Sports">Sports Activity</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block font-medium text-slate-700 text-sm">
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        value={
                          newBooking.startTime
                            ? new Date(newBooking.startTime)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewBooking({
                            ...newBooking,
                            startTime: new Date(e.target.value),
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-medium text-slate-700 text-sm">
                        End Time
                      </label>
                      <input
                        type="datetime-local"
                        value={
                          newBooking.endTime
                            ? new Date(newBooking.endTime)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewBooking({
                            ...newBooking,
                            endTime: new Date(e.target.value),
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">
                      Number of Attendees
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedFacility.capacity}
                      value={newBooking.attendees}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewBooking({
                          ...newBooking,
                          attendees: parseInt(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="mt-1 text-slate-500 text-xs">
                      Maximum capacity: {selectedFacility.capacity}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">
                      Priority
                    </label>
                    <select
                      value={newBooking.priority}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewBooking({
                          ...newBooking,
                          priority: e.target.value as any,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  {selectedFacility.amenities.length > 0 && (
                    <div>
                      <label className="mb-2 block font-medium text-slate-700 text-sm">
                        Equipment Needed
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedFacility.amenities.map((amenity) => (
                          <button
                            key={amenity}
                            onClick={() => {
                              const current = newBooking.equipment || [];
                              if (current.includes(amenity)) {
                                setNewBooking({
                                  ...newBooking,
                                  equipment: current.filter(
                                    (a) => a !== amenity,
                                  ),
                                });
                              } else {
                                setNewBooking({
                                  ...newBooking,
                                  equipment: [...current, amenity],
                                });
                              }
                            }}
                            className={`rounded-full px-3 py-1 text-sm transition-colors ${
                              newBooking.equipment?.includes(amenity)
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {amenity}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 border-slate-200 border-t p-6">
                  <button
                    onClick={handleCreateBooking}
                    disabled={
                      !newBooking.purpose ||
                      !newBooking.startTime ||
                      !newBooking.endTime
                    }
                    className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Submit Booking Request
                  </button>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}

      {activeTab === "bookings" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-slate-200 border-b bg-slate-50 p-4">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedStatus(e.target.value as any)
                }
                className="rounded border border-slate-300 px-3 py-1 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            <AnimatePresence mode="popLayout">
              {bookings
                .filter(
                  (b) =>
                    selectedStatus === "all" || b.status === selectedStatus,
                )
                .map((booking) => (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-slate-900">
                            {booking.purpose}
                          </h3>
                          <span
                            className={`rounded-full border px-2 py-1 text-xs ${getStatusColor(booking.status)}`}
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                          <div className="flex items-center gap-1">
                            <div
                              className={`h-2 w-2 rounded-full ${getPriorityColor(booking.priority)}`}
                            />
                            <span className="text-slate-500 text-xs capitalize">
                              {booking.priority} priority
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600 text-sm">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {booking.facilityName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {booking.attendees} attendees
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {booking.startTime.toLocaleDateString()}{" "}
                            {booking.startTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {booking.endTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-500 text-sm">
                          Requested by {booking.requesterName} on{" "}
                          {booking.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {userRole === "admin" &&
                          booking.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleApproveBooking(booking.id, true)
                                }
                                className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleApproveBooking(booking.id, false)
                                }
                                className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </button>
                            </>
                          )}
                        <button
                          onClick={() => setShowBookingDetails(booking)}
                          className="p-2 text-slate-400 transition-colors hover:text-slate-600"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {booking.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="p-2 text-slate-400 transition-colors hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>

            {bookings.length === 0 && (
              <div className="p-12 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p className="text-slate-500">No bookings found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-slate-200 border-b p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xl">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1,
                      ),
                    )
                  }
                  className="rounded-lg p-2 transition-colors hover:bg-slate-100"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date())}
                  className="rounded-lg px-4 py-2 font-medium text-indigo-600 text-sm transition-colors hover:bg-indigo-50"
                >
                  Today
                </button>
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                      ),
                    )
                  }
                  className="rounded-lg p-2 transition-colors hover:bg-slate-100"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-slate-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="bg-slate-50 p-3 text-center font-medium text-slate-600 text-sm"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-32 bg-white" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const date = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                idx + 1,
              );
              const dayBookings = getBookingsForDate(date);
              const isToday =
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={`h-32 cursor-pointer bg-white p-2 transition-colors hover:bg-slate-50 ${
                    isToday ? "ring-2 ring-indigo-500 ring-inset" : ""
                  }`}
                >
                  <div
                    className={`mb-1 font-medium text-sm ${isToday ? "text-indigo-600" : "text-slate-900"}`}
                  >
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    {dayBookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        onClick={() => setShowBookingDetails(booking)}
                        className={`cursor-pointer truncate rounded px-2 py-1 text-xs ${
                          booking.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {booking.purpose}
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="px-2 text-slate-500 text-xs">
                        +{dayBookings.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showBookingDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowBookingDetails(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xl">
                  Booking Details
                </h3>
                <button
                  onClick={() => setShowBookingDetails(null)}
                  className="rounded-full p-2 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${getStatusColor(showBookingDetails.status)}`}
                >
                  {showBookingDetails.status.charAt(0).toUpperCase() +
                    showBookingDetails.status.slice(1)}
                </span>
                <div className="flex items-center gap-1">
                  <div
                    className={`h-3 w-3 rounded-full ${getPriorityColor(showBookingDetails.priority)}`}
                  />
                  <span className="text-slate-600 text-sm capitalize">
                    {showBookingDetails.priority} Priority
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg text-slate-900">
                  {showBookingDetails.purpose}
                </h4>
                <p className="text-slate-600">{showBookingDetails.eventType}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="mb-1 text-slate-500 text-sm">Facility</p>
                  <p className="font-medium text-slate-900">
                    {showBookingDetails.facilityName}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="mb-1 text-slate-500 text-sm">Attendees</p>
                  <p className="font-medium text-slate-900">
                    {showBookingDetails.attendees} people
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-3">
                <p className="mb-1 text-slate-500 text-sm">Date & Time</p>
                <p className="font-medium text-slate-900">
                  {showBookingDetails.startTime.toLocaleDateString()} at{" "}
                  {showBookingDetails.startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {showBookingDetails.endTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <p className="mb-2 text-slate-500 text-sm">Requested By</p>
                <p className="font-medium text-slate-900">
                  {showBookingDetails.requesterName}
                </p>
                <p className="text-slate-600 text-sm">
                  on {showBookingDetails.createdAt.toLocaleDateString()}
                </p>
              </div>

              {showBookingDetails.equipment.length > 0 && (
                <div>
                  <p className="mb-2 text-slate-500 text-sm">
                    Equipment Requested
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {showBookingDetails.equipment.map((item) => (
                      <span
                        key={item}
                        className="rounded bg-indigo-100 px-2 py-1 text-indigo-700 text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {showBookingDetails.approvedBy && (
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="text-green-700 text-sm">
                    Approved by {showBookingDetails.approvedBy} on{" "}
                    {showBookingDetails.approvedAt?.toLocaleDateString()}
                  </p>
                </div>
              )}

              {showBookingDetails.rejectionReason && (
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-red-700 text-sm">
                    Rejected: {showBookingDetails.rejectionReason}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              {userRole === "admin" &&
                showBookingDetails.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        handleApproveBooking(showBookingDetails.id, true);
                        setShowBookingDetails(null);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleApproveBooking(showBookingDetails.id, false);
                        setShowBookingDetails(null);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </>
                )}
              <button
                onClick={() => setShowBookingDetails(null)}
                className="rounded-lg border border-slate-300 px-6 py-2 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
