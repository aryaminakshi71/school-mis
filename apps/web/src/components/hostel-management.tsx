import { AnimatePresence, motion } from "framer-motion";
import { Bed, Building2, Check, Clock, Plus, Search, X } from "lucide-react";
import { useState } from "react";

export type RoomType = "single" | "double" | "triple" | "dormitory";
export type HostelStatus = "available" | "occupied" | "maintenance";

export interface HostelRoom {
  id: string;
  roomNumber: string;
  floor: number;
  type: RoomType;
  capacity: number;
  occupants: string[];
  status: HostelStatus;
  amenities: string[];
  monthlyRent: number;
}

export interface HostelStudent {
  id: string;
  name: string;
  class: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate?: Date;
  contactNumber: string;
  parentContact: string;
  address: string;
  emergencyContact: string;
  medicalInfo?: string;
}

export interface VisitorLog {
  id: string;
  visitorName: string;
  contactNumber: string;
  purpose: string;
  studentId: string;
  studentName: string;
  checkInTime: Date;
  checkOutTime?: Date;
  relationship: string;
}

interface HostelManagementProps {
  onAllocateRoom: (studentId: string, roomId: string) => Promise<void>;
  onDeallocateRoom: (studentId: string) => Promise<void>;
  onRegisterVisitor: (
    visitor: Omit<VisitorLog, "id" | "checkInTime">,
  ) => Promise<void>;
}

export function HostelManagement({
  onAllocateRoom,
  onDeallocateRoom,
  onRegisterVisitor,
}: HostelManagementProps) {
  const [activeTab, setActiveTab] = useState<"rooms" | "students" | "visitors">(
    "rooms",
  );
  const [rooms, setRooms] = useState<HostelRoom[]>([
    {
      id: "1",
      roomNumber: "101",
      floor: 1,
      type: "double",
      capacity: 2,
      occupants: ["s1", "s2"],
      status: "occupied",
      amenities: ["AC", "WiFi", "Attached Bath"],
      monthlyRent: 8000,
    },
    {
      id: "2",
      roomNumber: "102",
      floor: 1,
      type: "single",
      capacity: 1,
      occupants: [],
      status: "available",
      amenities: ["AC", "WiFi", "Attached Bath"],
      monthlyRent: 12000,
    },
    {
      id: "3",
      roomNumber: "201",
      floor: 2,
      type: "triple",
      capacity: 3,
      occupants: ["s3"],
      status: "occupied",
      amenities: ["Fan", "WiFi", "Common Bath"],
      monthlyRent: 5000,
    },
    {
      id: "4",
      roomNumber: "202",
      floor: 2,
      type: "dormitory",
      capacity: 6,
      occupants: ["s4", "s5", "s6", "s7"],
      status: "occupied",
      amenities: ["Fan", "Common Bath"],
      monthlyRent: 3000,
    },
  ]);

  const [students, setStudents] = useState<HostelStudent[]>([
    {
      id: "s1",
      name: "Rahul Sharma",
      class: "10-A",
      roomId: "1",
      checkInDate: new Date("2024-06-01"),
      contactNumber: "9876543210",
      parentContact: "9876543211",
      address: "Delhi",
      emergencyContact: "9876543212",
    },
    {
      id: "s2",
      name: "Priya Patel",
      class: "10-A",
      roomId: "1",
      checkInDate: new Date("2024-06-01"),
      contactNumber: "9876543220",
      parentContact: "9876543221",
      address: "Mumbai",
      emergencyContact: "9876543222",
    },
    {
      id: "s3",
      name: "Ananya Gupta",
      class: "9-B",
      roomId: "3",
      checkInDate: new Date("2024-08-15"),
      contactNumber: "9876543230",
      parentContact: "9876543231",
      address: "Bangalore",
      emergencyContact: "9876543232",
    },
  ]);

  const [visitors, setVisitors] = useState<VisitorLog[]>([
    {
      id: "v1",
      visitorName: "Mr. Sharma",
      contactNumber: "9876543211",
      purpose: "Parent Visit",
      studentId: "s1",
      studentName: "Rahul Sharma",
      checkInTime: new Date(),
      relationship: "Father",
    },
  ]);

  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<HostelRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = rooms.filter(
    (r) =>
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getRoomTypeColor = (type: RoomType) => {
    const colors = {
      single: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
      double: "bg-green-100 text-green-700 dark:bg-green-900/30",
      triple: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30",
      dormitory: "bg-purple-100 text-purple-700 dark:bg-purple-900/30",
    };
    return colors[type];
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                Hostel Management
              </h2>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Room allocation, visitor logs, and student tracking
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {["rooms", "students", "visitors"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`rounded-lg px-4 py-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "rooms" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-primary dark:border-gray-700"
                />
              </div>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>{" "}
                  Available
                </span>
                <span className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>{" "}
                  Occupied
                </span>
                <span className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>{" "}
                  Maintenance
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {filteredRooms.map((room) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    room.status === "available"
                      ? "border-green-200 bg-green-50 dark:bg-green-900/10"
                      : room.status === "occupied"
                        ? "border-blue-200 bg-blue-50 dark:bg-blue-900/10"
                        : "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10"
                  }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-lg dark:text-gray-100">
                      Room {room.roomNumber}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs capitalize ${getRoomTypeColor(room.type)}`}
                    >
                      {room.type}
                    </span>
                  </div>
                  <p className="mb-2 text-gray-500 text-sm dark:text-gray-400">
                    Floor {room.floor}
                  </p>
                  <div className="mb-3 flex items-center gap-2">
                    <Bed className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700 text-sm dark:text-gray-300">
                      {room.occupants.length} / {room.capacity} occupied
                    </span>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-1">
                    {room.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-white px-2 py-0.5 text-xs dark:bg-gray-800"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <p className="font-medium text-gray-900 text-sm dark:text-gray-100">
                    ₹{room.monthlyRent.toLocaleString()}/month
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Hostel Residents ({students.length})
              </h3>
              <button
                onClick={() => setShowAllocateModal(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Allocate Room
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                      Class
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                      Room
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                      Check-in
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {students.map((student) => {
                    const room = rooms.find((r) => r.id === student.roomId);
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {student.name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {student.address}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700 text-sm dark:text-gray-300">
                          {student.class}
                        </td>
                        <td className="px-4 py-3 text-gray-700 text-sm dark:text-gray-300">
                          {room?.roomNumber || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-700 text-sm dark:text-gray-300">
                          {student.contactNumber}
                        </td>
                        <td className="px-4 py-3 text-gray-700 text-sm dark:text-gray-300">
                          {student.checkInDate.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => onDeallocateRoom(student.id)}
                            className="text-red-600 text-sm hover:text-red-700"
                          >
                            Deallocate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "visitors" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Visitor Log ({visitors.length})
              </h3>
              <button
                onClick={() => setShowVisitorModal(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Register Visitor
              </button>
            </div>

            <div className="space-y-3">
              {visitors.map((visitor) => (
                <motion.div
                  key={visitor.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {visitor.visitorName}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        Visiting: {visitor.studentName} ({visitor.relationship})
                      </p>
                      <p className="text-gray-500 text-sm">
                        Purpose: {visitor.purpose}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-gray-600 text-sm dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          In: {visitor.checkInTime.toLocaleTimeString()}
                        </span>
                        {visitor.checkOutTime && (
                          <span className="flex items-center gap-1">
                            <Check className="h-4 w-4 text-green-500" />
                            Out: {visitor.checkOutTime.toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {!visitor.checkOutTime && (
                      <button
                        onClick={() => {
                          setVisitors((prev) =>
                            prev.map((v) =>
                              v.id === visitor.id
                                ? { ...v, checkOutTime: new Date() }
                                : v,
                            ),
                          );
                        }}
                        className="rounded-lg bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                      >
                        Check Out
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Room Detail Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg dark:text-gray-100">
                  Room {selectedRoom.roomNumber} Details
                </h3>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-gray-500 text-xs">Type</p>
                    <p className="font-medium capitalize">
                      {selectedRoom.type}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-gray-500 text-xs">Floor</p>
                    <p className="font-medium">{selectedRoom.floor}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-gray-500 text-xs">Capacity</p>
                    <p className="font-medium">{selectedRoom.capacity} beds</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-gray-500 text-xs">Occupied</p>
                    <p className="font-medium">
                      {selectedRoom.occupants.length} students
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-medium text-gray-700 text-sm dark:text-gray-300">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-primary/10 px-3 py-1 text-primary text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedRoom.occupants.length > 0 && (
                  <div>
                    <p className="mb-2 font-medium text-gray-700 text-sm dark:text-gray-300">
                      Current Occupants
                    </p>
                    <div className="space-y-2">
                      {selectedRoom.occupants.map((occupantId, idx) => {
                        const student = students.find(
                          (s) => s.id === occupantId,
                        );
                        return student ? (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
                          >
                            <span className="text-sm">{student.name}</span>
                            <span className="text-gray-500 text-xs">
                              {student.class}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div className="border-gray-200 border-t pt-4 dark:border-gray-700">
                  <p className="font-bold text-gray-900 text-lg dark:text-gray-100">
                    ₹{selectedRoom.monthlyRent.toLocaleString()}
                    <span className="font-normal text-gray-500 text-sm">
                      /month
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HostelManagement;
