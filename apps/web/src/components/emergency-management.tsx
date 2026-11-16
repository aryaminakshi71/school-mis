import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Siren as SirenIcon,
  ThumbsUp,
  X,
} from "lucide-react";
import { useState } from "react";

export type EmergencyType =
  | "medical"
  | "fire"
  | "security"
  | "natural-disaster"
  | "lockdown"
  | "evacuation"
  | "utility-failure"
  | "intruder"
  | "bomb-threat"
  | "other";
export type EmergencySeverity = "low" | "medium" | "high" | "critical";
export type EmergencyStatus = "active" | "contained" | "resolved" | "cancelled";
export type DrillStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface EmergencyIncident {
  id: string;
  type: EmergencyType;
  severity: EmergencySeverity;
  status: EmergencyStatus;
  title: string;
  description: string;
  location: string;
  building: string;
  floor?: number;
  room?: string;
  reportedAt: Date;
  reportedBy: string;
  reportedByName: string;
  assignedResponder?: string;
  assignedResponderName?: string;
  actions: EmergencyAction[];
  updates: EmergencyUpdate[];
  affectedAreas: string[];
  evacuations?: EvacuationOrder[];
  lockdowns?: LockdownOrder[];
  resolvedAt?: Date;
  lessonsLearned?: string[];
  media?: string[];
}

export interface EmergencyAction {
  id: string;
  action: string;
  performedBy: string;
  performedByName: string;
  timestamp: Date;
  status: "completed" | "in-progress" | "pending";
  notes?: string;
}

export interface EmergencyUpdate {
  id: string;
  message: string;
  timestamp: Date;
  sentBy: string;
  channels: ("app" | "sms" | "email" | "pa" | "phone")[];
  recipients: number;
}

export interface EvacuationOrder {
  id: string;
  building: string;
  floor?: number;
  assemblyPoint: string;
  status: "ordered" | "in-progress" | "complete";
  orderedAt: Date;
  completedAt?: Date;
  headCount?: number;
  missingPersons?: string[];
}

export interface LockdownOrder {
  id: string;
  building: string;
  floor?: number;
  room?: string;
  status: "ordered" | "in-progress" | "complete" | "lifted";
  orderedAt: Date;
  liftedAt?: Date;
}

export interface EmergencyDrill {
  id: string;
  type: EmergencyType;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number;
  status: DrillStatus;
  building: string;
  floors: number[];
  participants: number;
  actualDuration?: number;
  effectiveness: number;
  feedback: DrillFeedback[];
  improvements: string[];
  completedAt?: Date;
}

export interface DrillFeedback {
  id: string;
  userId: string;
  userName: string;
  userType: "student" | "teacher" | "staff";
  rating: number;
  comments: string;
  timestamp: Date;
  improvements: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  type: "internal" | "external";
  priority: number;
  isActive: boolean;
}

export interface EmergencyResource {
  id: string;
  name: string;
  type:
    | "aed"
    | "first-aid"
    | "fire-extinguisher"
    | "emergency-kit"
    | "defibrillator"
    | "epipen"
    | "other";
  location: string;
  building: string;
  floor: number;
  room?: string;
  status: "available" | "in-use" | "maintenance" | "expired";
  lastChecked: Date;
  nextCheck: Date;
  quantity: number;
  notes?: string;
}

interface EmergencyManagementProps {
  userRole?:
    | "admin"
    | "security"
    | "teacher"
    | "student"
    | "emergency-coordinator";
  userId?: string;
  onReportIncident?: (
    incident: Omit<
      EmergencyIncident,
      "id" | "status" | "reportedAt" | "actions" | "updates"
    >,
  ) => Promise<string>;
  onUpdateIncidentStatus?: (
    incidentId: string,
    status: EmergencyStatus,
  ) => Promise<void>;
  onAddIncidentUpdate?: (
    incidentId: string,
    update: Omit<EmergencyUpdate, "id" | "timestamp" | "recipients">,
  ) => Promise<void>;
  onScheduleDrill?: (
    drill: Omit<
      EmergencyDrill,
      | "id"
      | "status"
      | "participants"
      | "effectiveness"
      | "feedback"
      | "improvements"
    >,
  ) => Promise<string>;
  onCompleteDrill?: (
    drillId: string,
    feedback: DrillFeedback,
    improvements: string[],
  ) => Promise<void>;
  onTriggerAlert?: (alert: {
    type: EmergencyType;
    severity: EmergencySeverity;
    message: string;
    affectedAreas: string[];
  }) => Promise<void>;
}

export function EmergencyManagement({
  userRole = "student",
  userId = "S001",
  onReportIncident,
  onUpdateIncidentStatus,
  onAddIncidentUpdate,
  onScheduleDrill,
  onCompleteDrill,
  onTriggerAlert,
}: EmergencyManagementProps) {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "incidents" | "drills" | "resources" | "contacts"
  >("dashboard");
  const [selectedIncident, setSelectedIncident] =
    useState<EmergencyIncident | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [filterType, setFilterType] = useState<EmergencyType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<EmergencyStatus | "all">(
    "all",
  );

  const [incidents] = useState<EmergencyIncident[]>([
    {
      id: "EM001",
      type: "medical",
      severity: "medium",
      status: "resolved",
      title: "Student Fainted in Cafeteria",
      description:
        "A student fainted during lunch period. School nurse responded immediately. Student recovered after brief rest.",
      location: "Main Cafeteria",
      building: "Student Center",
      floor: 1,
      reportedAt: new Date(Date.now() - 604800000),
      reportedBy: "S001",
      reportedByName: "Emma Johnson",
      assignedResponder: "N001",
      assignedResponderName: "Nurse Sarah Wilson",
      actions: [
        {
          id: "A1",
          action: "Nurse dispatched to cafeteria",
          performedBy: "N001",
          performedByName: "Nurse Sarah Wilson",
          timestamp: new Date(Date.now() - 604800000 + 120000),
          status: "completed",
        },
        {
          id: "A2",
          action: "Parents contacted",
          performedBy: "ADM001",
          performedByName: "Admin Office",
          timestamp: new Date(Date.now() - 604800000 + 300000),
          status: "completed",
        },
      ],
      updates: [
        {
          id: "U1",
          message:
            "Medical response in progress at cafeteria. Please avoid the area.",
          timestamp: new Date(Date.now() - 604800000 + 60000),
          sentBy: "Security",
          channels: ["app", "pa"],
          recipients: 450,
        },
        {
          id: "U2",
          message:
            "Incident resolved. Student is stable and parents have been notified.",
          timestamp: new Date(Date.now() - 604800000 + 900000),
          sentBy: "Nurse Sarah Wilson",
          channels: ["app"],
          recipients: 450,
        },
      ],
      affectedAreas: ["Cafeteria"],
      resolvedAt: new Date(Date.now() - 604800000 + 900000),
      lessonsLearned: [
        "Quick response protocol worked well",
        "Emergency contact information was up to date",
      ],
    },
    {
      id: "EM002",
      type: "fire",
      severity: "high",
      status: "contained",
      title: "Small Fire in Science Lab",
      description:
        "Small chemical fire in Science Lab B. Fire extinguished immediately by teacher. No injuries reported.",
      location: "Science Lab B",
      building: "Science Building",
      floor: 2,
      room: "Lab B",
      reportedAt: new Date(Date.now() - 1209600000),
      reportedBy: "T002",
      reportedByName: "Mr. David Chen",
      assignedResponder: "FIRE001",
      assignedResponderName: "Fire Safety Officer",
      actions: [
        {
          id: "A3",
          action: "Fire extinguisher used",
          performedBy: "T002",
          performedByName: "Mr. David Chen",
          timestamp: new Date(Date.now() - 1209600000 + 60000),
          status: "completed",
        },
        {
          id: "A4",
          action: "Fire department called",
          performedBy: "SEC001",
          performedByName: "Security",
          timestamp: new Date(Date.now() - 1209600000 + 120000),
          status: "completed",
        },
        {
          id: "A5",
          action: "Evacuation of Science Building",
          performedBy: "SEC001",
          performedByName: "Security",
          timestamp: new Date(Date.now() - 1209600000 + 180000),
          status: "completed",
        },
      ],
      updates: [
        {
          id: "U3",
          message:
            "FIRE ALERT: Science Building evacuation in progress. Proceed to assembly point immediately.",
          timestamp: new Date(Date.now() - 1209600000 + 180000),
          sentBy: "Security",
          channels: ["app", "pa", "sms"],
          recipients: 680,
        },
        {
          id: "U4",
          message:
            "Fire contained. All clear given. Science Building remains closed pending inspection.",
          timestamp: new Date(Date.now() - 1209600000 + 2700000),
          sentBy: "Fire Safety Officer",
          channels: ["app", "pa"],
          recipients: 680,
        },
      ],
      affectedAreas: ["Science Building", "Science Lab B"],
      evacuations: [
        {
          id: "EV1",
          building: "Science Building",
          assemblyPoint: "North Field",
          status: "complete",
          orderedAt: new Date(Date.now() - 1209600000 + 180000),
          completedAt: new Date(Date.now() - 1209600000 + 900000),
          headCount: 245,
        },
      ],
    },
  ]);

  const [drills] = useState<EmergencyDrill[]>([
    {
      id: "D001",
      type: "fire",
      scheduledDate: new Date(Date.now() + 604800000),
      scheduledTime: "10:00 AM",
      duration: 15,
      status: "scheduled",
      building: "All Buildings",
      floors: [1, 2, 3],
      participants: 0,
      effectiveness: 0,
      feedback: [],
      improvements: [],
    },
    {
      id: "D002",
      type: "lockdown",
      scheduledDate: new Date(Date.now() - 2592000000),
      scheduledTime: "2:00 PM",
      duration: 10,
      status: "completed",
      building: "Main Building",
      floors: [1, 2],
      participants: 320,
      actualDuration: 8,
      effectiveness: 85,
      completedAt: new Date(Date.now() - 2592000000 + 480000),
      feedback: [
        {
          id: "F1",
          userId: "T001",
          userName: "Ms. Johnson",
          userType: "teacher",
          rating: 4,
          comments: "Good coordination",
          timestamp: new Date(Date.now() - 2592000000 + 600000),
          improvements: [],
        },
      ],
      improvements: [
        "Better communication between floors",
        "Improve lock engagement time",
      ],
    },
  ]);

  const [contacts] = useState<EmergencyContact[]>([
    {
      id: "C1",
      name: "Campus Security",
      role: "24/7 Emergency Response",
      phone: "555-0911",
      email: "security@school.edu",
      type: "internal",
      priority: 1,
      isActive: true,
    },
    {
      id: "C2",
      name: "School Nurse",
      role: "Medical Emergency",
      phone: "555-0912",
      email: "nurse@school.edu",
      type: "internal",
      priority: 2,
      isActive: true,
    },
    {
      id: "C3",
      name: "Fire Department",
      role: "External Emergency",
      phone: "911",
      email: "",
      type: "external",
      priority: 1,
      isActive: true,
    },
    {
      id: "C4",
      name: "Police Department",
      role: "External Emergency",
      phone: "911",
      email: "",
      type: "external",
      priority: 1,
      isActive: true,
    },
    {
      id: "C5",
      name: "Poison Control",
      role: "Medical Emergency",
      phone: "1-800-222-1222",
      email: "",
      type: "external",
      priority: 2,
      isActive: true,
    },
  ]);

  const [resources] = useState<EmergencyResource[]>([
    {
      id: "R1",
      name: "AED Unit",
      type: "aed",
      location: "Main Lobby",
      building: "Main Building",
      floor: 1,
      status: "available",
      lastChecked: new Date(Date.now() - 86400000),
      nextCheck: new Date(Date.now() + 2592000000),
      quantity: 1,
      notes: "Battery good",
    },
    {
      id: "R2",
      name: "First Aid Kit",
      type: "first-aid",
      location: "Nurse Station",
      building: "Main Building",
      floor: 1,
      room: "101",
      status: "available",
      lastChecked: new Date(Date.now() - 86400000),
      nextCheck: new Date(Date.now() + 2592000000),
      quantity: 3,
    },
    {
      id: "R3",
      name: "Fire Extinguisher",
      type: "fire-extinguisher",
      location: "Hallway East",
      building: "Science Building",
      floor: 2,
      status: "available",
      lastChecked: new Date(Date.now() - 604800000),
      nextCheck: new Date(Date.now() + 7776000000),
      quantity: 2,
    },
  ]);

  const [newIncident, setNewIncident] = useState<Partial<EmergencyIncident>>({
    type: "medical",
    severity: "medium",
  });

  const typeColors: Record<EmergencyType, string> = {
    medical: "bg-red-100 text-red-700",
    fire: "bg-orange-100 text-orange-700",
    security: "bg-blue-100 text-blue-700",
    "natural-disaster": "bg-amber-100 text-amber-700",
    lockdown: "bg-purple-100 text-purple-700",
    evacuation: "bg-green-100 text-green-700",
    "utility-failure": "bg-slate-100 text-slate-700",
    intruder: "bg-red-200 text-red-800",
    "bomb-threat": "bg-red-200 text-red-800",
    other: "bg-gray-100 text-gray-700",
  };

  const severityColors: Record<EmergencySeverity, string> = {
    low: "bg-green-500",
    medium: "bg-amber-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  };

  const statusColors: Record<EmergencyStatus, string> = {
    active: "bg-red-100 text-red-700",
    contained: "bg-amber-100 text-amber-700",
    resolved: "bg-green-100 text-green-700",
    cancelled: "bg-slate-100 text-slate-700",
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesType = filterType === "all" || incident.type === filterType;
    const matchesStatus =
      filterStatus === "all" || incident.status === filterStatus;
    return matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <SirenIcon className="h-8 w-8 text-red-600" />
            Emergency Management
          </h2>
          <p className="mt-1 text-slate-600">
            Safety protocols, drills, and incident response
          </p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
        >
          <AlertTriangle className="h-5 w-5" />
          Report Emergency
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          {
            label: "Active Incidents",
            value: incidents.filter((i) => i.status === "active").length,
            color: "bg-red-500",
            icon: SirenIcon,
          },
          {
            label: "Drills This Year",
            value: drills.filter((d) => d.status === "completed").length,
            color: "bg-green-500",
            icon: Activity,
          },
          {
            label: "Resources",
            value: resources.length,
            color: "bg-blue-500",
            icon: Heart,
          },
          {
            label: "Avg Response Time",
            value: "2.3 min",
            color: "bg-amber-500",
            icon: Clock,
          },
          {
            label: "Safety Score",
            value: "94%",
            color: "bg-purple-500",
            icon: ThumbsUp,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon
                className={`h-4 w-4 ${stat.color.replace("bg-", "text-")}`}
              />
              <span className="text-slate-600 text-sm">{stat.label}</span>
            </div>
            <p className="font-bold text-2xl text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "dashboard", label: "Dashboard", icon: Activity },
          { id: "incidents", label: "Incidents", icon: AlertTriangle },
          { id: "drills", label: "Drills", icon: BookOpen },
          { id: "resources", label: "Resources", icon: Heart },
          { id: "contacts", label: "Contacts", icon: Phone },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-red-600 border-b-2 text-red-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 font-semibold text-lg text-slate-900">
                Recent Incidents
              </h3>
              <div className="space-y-3">
                {incidents.slice(0, 3).map((incident) => (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className="cursor-pointer rounded-lg border border-slate-200 p-4 transition-colors hover:border-red-300"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${typeColors[incident.type]}`}
                      >
                        {incident.type.replace("-", " ").toUpperCase()}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${statusColors[incident.status]}`}
                      >
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-medium text-slate-900">
                      {incident.title}
                    </h4>
                    <p className="text-slate-500 text-sm">
                      {incident.reportedAt.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 font-semibold text-lg text-slate-900">
                Emergency Contacts
              </h3>
              <div className="space-y-3">
                {contacts.slice(0, 5).map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {contact.name}
                      </p>
                      <p className="text-slate-600 text-sm">{contact.role}</p>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
                    >
                      Call
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="mb-4 font-semibold text-lg text-slate-900">
              Emergency Resources Status
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="font-medium text-slate-900">
                      {resource.name}
                    </span>
                  </div>
                  <p className="mb-2 text-slate-600 text-sm">
                    {resource.location}
                  </p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      resource.status === "available"
                        ? "bg-green-100 text-green-700"
                        : resource.status === "in-use"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {resource.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "incidents" && (
        <>
          <div className="mb-6 flex gap-4">
            <select
              value={filterType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterType(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Types</option>
              {Object.keys(typeColors).map((type) => (
                <option key={type} value={type}>
                  {type.replace("-", " ").toUpperCase()}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterStatus(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="contained">Contained</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-bold text-lg text-slate-900">
                          {incident.title}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${typeColors[incident.type]}`}
                        >
                          {incident.type.replace("-", " ").toUpperCase()}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${statusColors[incident.status]}`}
                        >
                          {incident.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="mb-2 text-slate-600">
                        {incident.description}
                      </p>
                      <div className="flex items-center gap-4 text-slate-500 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {incident.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {incident.reportedAt.toLocaleString()}
                        </span>
                        <span>Reported by: {incident.reportedByName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`h-3 w-3 rounded-full ${severityColors[incident.severity]} mb-1`}
                      />
                      <span className="text-slate-500 text-xs uppercase">
                        {incident.severity}
                      </span>
                    </div>
                  </div>

                  {incident.actions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-semibold text-slate-900">
                        Actions Taken
                      </h4>
                      <div className="space-y-2">
                        {incident.actions.slice(0, 3).map((action) => (
                          <div
                            key={action.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{action.action}</span>
                            <span className="text-slate-500">
                              - {action.performedByName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-slate-200 border-t pt-4">
                    <div className="flex items-center gap-2">
                      {incident.updates.length > 0 && (
                        <span className="text-slate-500 text-sm">
                          {incident.updates.length} update
                          {incident.updates.length > 1 ? "s" : ""}
                        </span>
                      )}
                      {incident.evacuations &&
                        incident.evacuations.length > 0 && (
                          <span className="rounded bg-green-100 px-2 py-1 text-green-700 text-xs">
                            Evacuation Ordered
                          </span>
                        )}
                    </div>
                    <button
                      onClick={() => setSelectedIncident(incident)}
                      className="rounded-lg px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeTab === "drills" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-900">
              Emergency Drills
            </h3>
            <button
              onClick={() => setShowDrillModal(true)}
              className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Schedule Drill
            </button>
          </div>

          {drills.map((drill) => (
            <motion.div
              key={drill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-red-600" />
                    <h3 className="font-bold text-lg text-slate-900">
                      {drill.type.replace("-", " ").toUpperCase()} Drill
                    </h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        drill.status === "scheduled"
                          ? "bg-blue-100 text-blue-700"
                          : drill.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {drill.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600">{drill.building}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-slate-900">
                    {drill.scheduledDate.toLocaleDateString()}
                  </p>
                  <p className="text-slate-600">{drill.scheduledTime}</p>
                </div>
              </div>

              {drill.status === "completed" && (
                <div className="mb-4 grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <p className="text-slate-500 text-sm">Participants</p>
                    <p className="font-bold text-slate-900 text-xl">
                      {drill.participants}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <p className="text-slate-500 text-sm">Duration</p>
                    <p className="font-bold text-slate-900 text-xl">
                      {drill.actualDuration} min
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <p className="text-slate-500 text-sm">Effectiveness</p>
                    <p className="font-bold text-green-600 text-xl">
                      {drill.effectiveness}%
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {contact.name}
                  </h3>
                  <p className="text-slate-600 text-sm">{contact.role}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    contact.type === "internal"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {contact.type.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 text-slate-700 hover:text-red-600"
                >
                  <Phone className="h-4 w-4" />
                  {contact.phone}
                </a>
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-slate-700 hover:text-red-600"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {contact.email}
                  </a>
                )}
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="mt-4 block w-full rounded-lg bg-red-600 px-4 py-2 text-center text-white transition-colors hover:bg-red-700"
              >
                Call Now
              </a>
            </motion.div>
          ))}
        </div>
      )}

      {showReportModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowReportModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b bg-red-50 p-6">
              <h3 className="flex items-center gap-2 font-bold text-red-900 text-xl">
                <AlertTriangle className="h-6 w-6" />
                Report Emergency
              </h3>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Type *
                  </label>
                  <select
                    value={newIncident.type}
                    onChange={(e) =>
                      setNewIncident({
                        ...newIncident,
                        type: e.target.value as EmergencyType,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="medical">Medical Emergency</option>
                    <option value="fire">Fire</option>
                    <option value="security">Security</option>
                    <option value="intruder">Intruder</option>
                    <option value="lockdown">Lockdown</option>
                    <option value="evacuation">Evacuation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Severity *
                  </label>
                  <select
                    value={newIncident.severity}
                    onChange={(e) =>
                      setNewIncident({
                        ...newIncident,
                        severity: e.target.value as EmergencySeverity,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Title *
                </label>
                <input
                  type="text"
                  value={newIncident.title || ""}
                  onChange={(e) =>
                    setNewIncident({ ...newIncident, title: e.target.value })
                  }
                  placeholder="Brief description of the emergency"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Location *
                </label>
                <input
                  type="text"
                  value={newIncident.location || ""}
                  onChange={(e) =>
                    setNewIncident({ ...newIncident, location: e.target.value })
                  }
                  placeholder="Building, floor, room"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Description *
                </label>
                <textarea
                  value={newIncident.description || ""}
                  onChange={(e) =>
                    setNewIncident({
                      ...newIncident,
                      description: e.target.value,
                    })
                  }
                  placeholder="Provide details about the situation..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
              >
                Report Emergency
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedIncident && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedIncident(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="font-bold text-2xl text-slate-900">
                      {selectedIncident.title}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 ${typeColors[selectedIncident.type]}`}
                    >
                      {selectedIncident.type.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${severityColors[selectedIncident.severity]}`}
                    />
                    <span className="text-slate-600 text-sm uppercase">
                      {selectedIncident.severity} Severity
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="rounded-full p-2 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Status</p>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${statusColors[selectedIncident.status]}`}
                  >
                    {selectedIncident.status.toUpperCase()}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Location</p>
                  <p className="font-semibold text-slate-900">
                    {selectedIncident.location}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Reported</p>
                  <p className="font-semibold text-slate-900">
                    {selectedIncident.reportedAt.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Reported By</p>
                  <p className="font-semibold text-slate-900">
                    {selectedIncident.reportedByName}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-slate-900">
                  Description
                </h4>
                <p className="rounded-lg bg-slate-50 p-4 text-slate-700">
                  {selectedIncident.description}
                </p>
              </div>

              {selectedIncident.actions.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-slate-900">
                    Actions Taken
                  </h4>
                  <div className="space-y-2">
                    {selectedIncident.actions.map((action) => (
                      <div
                        key={action.id}
                        className="rounded-lg bg-slate-50 p-3"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-slate-900">
                              {action.action}
                            </p>
                            <p className="text-slate-500 text-sm">
                              {action.performedByName} •{" "}
                              {action.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedIncident.updates.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-slate-900">
                    Updates & Communications
                  </h4>
                  <div className="space-y-2">
                    {selectedIncident.updates.map((update) => (
                      <div
                        key={update.id}
                        className="rounded-lg border border-blue-200 bg-blue-50 p-3"
                      >
                        <p className="text-slate-700">{update.message}</p>
                        <p className="mt-1 text-slate-500 text-sm">
                          {update.sentBy} • {update.timestamp.toLocaleString()}{" "}
                          • Sent to {update.recipients} people
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedIncident.evacuations &&
                selectedIncident.evacuations.length > 0 && (
                  <div>
                    <h4 className="mb-3 font-semibold text-slate-900">
                      Evacuation Orders
                    </h4>
                    {selectedIncident.evacuations.map((evac) => (
                      <div
                        key={evac.id}
                        className="rounded-lg border border-green-200 bg-green-50 p-4"
                      >
                        <p className="font-medium text-green-900">
                          {evac.building}
                        </p>
                        <p className="text-green-700 text-sm">
                          Assembly Point: {evac.assemblyPoint}
                        </p>
                        {evac.headCount && (
                          <p className="text-green-700 text-sm">
                            Head Count: {evac.headCount}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              {selectedIncident.lessonsLearned &&
                selectedIncident.lessonsLearned.length > 0 && (
                  <div>
                    <h4 className="mb-3 font-semibold text-slate-900">
                      Lessons Learned
                    </h4>
                    <ul className="space-y-1">
                      {selectedIncident.lessonsLearned.map((lesson, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-slate-700"
                        >
                          <span className="text-amber-500">•</span>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function Siren(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 18v-6a5 5 0 1 1 10 0v6" />
      <path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
      <path d="M12 7V3" />
      <path d="M17 8l2.1-2.1" />
      <path d="M4.9 5.9 7 8" />
    </svg>
  );
}
