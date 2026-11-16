import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Shield,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentCategory =
  | "safety"
  | "security"
  | "medical"
  | "disciplinary"
  | "property"
  | "bullying"
  | "other";
export type IncidentStatus =
  | "reported"
  | "under-investigation"
  | "pending-action"
  | "resolved"
  | "closed"
  | "escalated";

export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: string;
  incidentDate: Date;
  reportedAt: Date;
  reporterId: string;
  reporterName: string;
  reporterType: "student" | "teacher" | "staff" | "parent" | "visitor";
  reporterContact?: string;
  witnesses?: Witness[];
  involvedParties?: InvolvedParty[];
  attachments?: Attachment[];
  evidence?: Evidence[];
  immediateAction?: string;
  assignedTo?: string;
  assignedToName?: string;
  investigationNotes?: InvestigationNote[];
  resolution?: Resolution;
  followUpRequired?: boolean;
  followUpDate?: Date;
  parentNotified?: boolean;
  policeNotified?: boolean;
  medicalAttention?: boolean;
  isAnonymous?: boolean;
}

export interface Witness {
  id: string;
  name: string;
  contact?: string;
  statement?: string;
  type: "student" | "teacher" | "staff" | "other";
}

export interface InvolvedParty {
  id: string;
  name: string;
  role: "victim" | "perpetrator" | "witness" | "bystander" | "reporter";
  type: "student" | "teacher" | "staff" | "visitor";
  studentId?: string;
  contact?: string;
  statement?: string;
  actionTaken?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "audio";
  url: string;
  uploadedAt: Date;
  size: number;
}

export interface Evidence {
  id: string;
  description: string;
  type: "physical" | "digital" | "testimonial" | "documentation";
  collectedBy?: string;
  collectedAt?: Date;
  location?: string;
  status: "collected" | "analyzed" | "stored" | "disposed";
}

export interface InvestigationNote {
  id: string;
  note: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  type: "observation" | "interview" | "evidence" | "conclusion" | "action";
}

export interface Resolution {
  date: Date;
  summary: string;
  actions: string[];
  preventiveMeasures: string[];
  lessonsLearned: string[];
  closedBy: string;
  closedByName: string;
}

interface IncidentReportingSystemProps {
  userRole?: "admin" | "teacher" | "student" | "staff" | "safety-officer";
  userId?: string;
  onCreateReport?: (
    report: Omit<IncidentReport, "id" | "status" | "reportedAt">,
  ) => Promise<string>;
  onUpdateStatus?: (
    incidentId: string,
    status: IncidentStatus,
    notes?: string,
  ) => Promise<void>;
  onAssignInvestigator?: (
    incidentId: string,
    investigatorId: string,
  ) => Promise<void>;
  onAddInvestigationNote?: (
    incidentId: string,
    note: Omit<InvestigationNote, "id" | "createdAt">,
  ) => Promise<void>;
  onResolveIncident?: (
    incidentId: string,
    resolution: Resolution,
  ) => Promise<void>;
  onUploadEvidence?: (
    incidentId: string,
    evidence: Omit<Evidence, "id" | "collectedAt">,
  ) => Promise<void>;
}

export function IncidentReportingSystem({
  userRole = "teacher",
  userId = "T001",
  onCreateReport,
  onUpdateStatus,
  onAssignInvestigator,
  onAddInvestigationNote,
  onResolveIncident,
  onUploadEvidence,
}: IncidentReportingSystemProps) {
  const [activeTab, setActiveTab] = useState<
    "all" | "reported" | "investigating" | "resolved"
  >("all");
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentReport | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<
    IncidentSeverity | "all"
  >("all");
  const [filterCategory, setFilterCategory] = useState<
    IncidentCategory | "all"
  >("all");
  const [showInvestigationPanel, setShowInvestigationPanel] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newNoteType, setNewNoteType] =
    useState<InvestigationNote["type"]>("observation");

  const [incidents, setIncidents] = useState<IncidentReport[]>([
    {
      id: "I001",
      title: "Student altercation on playground",
      description:
        "Two students engaged in a physical altercation during recess. Teachers intervened immediately. Both students were separated and given time to cool down.",
      category: "disciplinary",
      severity: "medium",
      status: "under-investigation",
      location: "Main Playground",
      incidentDate: new Date(Date.now() - 86400000),
      reportedAt: new Date(Date.now() - 82800000),
      reporterId: "T002",
      reporterName: "Ms. Jennifer Martinez",
      reporterType: "teacher",
      reporterContact: "j.martinez@school.edu",
      witnesses: [
        {
          id: "W1",
          name: "Student A",
          type: "student",
          statement: "I saw them arguing and then pushing each other.",
        },
        {
          id: "W2",
          name: "Mr. Robert Chen",
          type: "teacher",
          statement: "I was on duty and broke up the fight immediately.",
        },
      ],
      involvedParties: [
        {
          id: "P1",
          name: "Student B",
          role: "perpetrator",
          type: "student",
          studentId: "S101",
        },
        {
          id: "P2",
          name: "Student C",
          role: "victim",
          type: "student",
          studentId: "S102",
        },
      ],
      immediateAction:
        "Both students separated, parents contacted, counseling scheduled.",
      assignedTo: "S001",
      assignedToName: "Dr. Sarah Johnson (Principal)",
      investigationNotes: [
        {
          id: "N1",
          note: "Initial interviews conducted with both students separately.",
          createdBy: "S001",
          createdByName: "Dr. Sarah Johnson",
          createdAt: new Date(Date.now() - 80000000),
          type: "interview",
        },
        {
          id: "N2",
          note: "Reviewed playground CCTV footage from incident time.",
          createdBy: "S001",
          createdByName: "Dr. Sarah Johnson",
          createdAt: new Date(Date.now() - 79200000),
          type: "evidence",
        },
      ],
      parentNotified: true,
      medicalAttention: false,
      policeNotified: false,
      followUpRequired: true,
      followUpDate: new Date(Date.now() + 604800000),
    },
    {
      id: "I002",
      title: "Laboratory equipment damage",
      description:
        "Chemical spill occurred during chemistry practical due to improper handling of reagents. No injuries reported, but equipment damaged.",
      category: "safety",
      severity: "high",
      status: "pending-action",
      location: "Chemistry Lab A",
      incidentDate: new Date(Date.now() - 172800000),
      reportedAt: new Date(Date.now() - 169200000),
      reporterId: "T003",
      reporterName: "Dr. Michael Stevens",
      reporterType: "teacher",
      reporterContact: "m.stevens@school.edu",
      witnesses: [{ id: "W3", name: "Lab Assistant", type: "staff" }],
      involvedParties: [
        {
          id: "P3",
          name: "Student D",
          role: "perpetrator",
          type: "student",
          studentId: "S201",
        },
      ],
      immediateAction:
        "Area evacuated, spill contained by safety officer, damaged equipment quarantined.",
      assignedTo: "S002",
      assignedToName: "Safety Officer Thompson",
      investigationNotes: [
        {
          id: "N3",
          note: "Safety protocol review shows student not following goggles requirement.",
          createdBy: "S002",
          createdByName: "Safety Officer Thompson",
          createdAt: new Date(Date.now() - 165600000),
          type: "observation",
        },
      ],
      parentNotified: true,
      medicalAttention: false,
      policeNotified: false,
      followUpRequired: true,
      followUpDate: new Date(Date.now() + 259200000),
    },
    {
      id: "I003",
      title: "Bullying incident - verbal harassment",
      description:
        "Student reported ongoing verbal bullying by peers. Incident occurred in cafeteria during lunch period.",
      category: "bullying",
      severity: "medium",
      status: "reported",
      location: "Cafeteria",
      incidentDate: new Date(Date.now() - 259200000),
      reportedAt: new Date(Date.now() - 255600000),
      reporterId: "S301",
      reporterName: "Anonymous Student",
      reporterType: "student",
      isAnonymous: true,
      witnesses: [],
      involvedParties: [
        {
          id: "P4",
          name: "Student E",
          role: "victim",
          type: "student",
          studentId: "S301",
        },
      ],
      immediateAction: "Anonymous report submitted through safety portal.",
      parentNotified: false,
      medicalAttention: false,
      policeNotified: false,
      followUpRequired: true,
    },
    {
      id: "I004",
      title: "Medical emergency - student fainted",
      description:
        "Student fainted during morning assembly. School nurse attended immediately, vitals checked, parents contacted.",
      category: "medical",
      severity: "high",
      status: "resolved",
      location: "Main Auditorium",
      incidentDate: new Date(Date.now() - 432000000),
      reportedAt: new Date(Date.now() - 428400000),
      reporterId: "N001",
      reporterName: "Nurse Amanda Wilson",
      reporterType: "staff",
      reporterContact: "a.wilson@school.edu",
      immediateAction:
        "Student moved to infirmary, vitals monitored, parents notified, 911 called as precaution.",
      assignedTo: "N001",
      assignedToName: "Nurse Amanda Wilson",
      parentNotified: true,
      medicalAttention: true,
      policeNotified: false,
      resolution: {
        date: new Date(Date.now() - 396000000),
        summary:
          "Student recovered fully. Medical examination showed dehydration and lack of breakfast.",
        actions: [
          "Parents contacted",
          "Student monitored for 2 hours",
          "Medical report filed",
        ],
        preventiveMeasures: [
          "Reminder to students about proper nutrition",
          "Counseling provided",
        ],
        lessonsLearned: [
          "Quick response protocol worked effectively",
          "Emergency contact info up to date",
        ],
        closedBy: "N001",
        closedByName: "Nurse Amanda Wilson",
      },
    },
  ]);

  const categoryIcons: Record<IncidentCategory, string> = {
    safety: "⚠️",
    security: "🔒",
    medical: "🏥",
    disciplinary: "📋",
    property: "🏢",
    bullying: "🚫",
    other: "❓",
  };

  const severityConfig: Record<
    IncidentSeverity,
    { color: string; bg: string; label: string }
  > = {
    low: { color: "text-green-700", bg: "bg-green-100", label: "Low" },
    medium: { color: "text-amber-700", bg: "bg-amber-100", label: "Medium" },
    high: { color: "text-orange-700", bg: "bg-orange-100", label: "High" },
    critical: { color: "text-red-700", bg: "bg-red-100", label: "Critical" },
  };

  const statusConfig: Record<IncidentStatus, { color: string; label: string }> =
    {
      reported: { color: "bg-blue-500", label: "Reported" },
      "under-investigation": { color: "bg-amber-500", label: "Investigating" },
      "pending-action": { color: "bg-orange-500", label: "Pending Action" },
      resolved: { color: "bg-green-500", label: "Resolved" },
      closed: { color: "bg-slate-500", label: "Closed" },
      escalated: { color: "bg-red-500", label: "Escalated" },
    };

  const [newReport, setNewReport] = useState<Partial<IncidentReport>>({
    title: "",
    description: "",
    category: "other",
    severity: "low",
    location: "",
    incidentDate: new Date(),
    reporterId: userId,
    reporterName: "Current User",
    reporterType:
      userRole === "teacher"
        ? "teacher"
        : userRole === "student"
          ? "student"
          : "staff",
    isAnonymous: false,
    immediateAction: "",
    parentNotified: false,
    medicalAttention: false,
    policeNotified: false,
  });

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      filterSeverity === "all" || incident.severity === filterSeverity;
    const matchesCategory =
      filterCategory === "all" || incident.category === filterCategory;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "reported" && incident.status === "reported") ||
      (activeTab === "investigating" &&
        (incident.status === "under-investigation" ||
          incident.status === "pending-action")) ||
      (activeTab === "resolved" &&
        (incident.status === "resolved" || incident.status === "closed"));
    return matchesSearch && matchesSeverity && matchesCategory && matchesTab;
  });

  const handleCreateReport = async () => {
    if (!newReport.title || !newReport.description || !newReport.location)
      return;

    const report = {
      ...newReport,
      title: newReport.title!,
      description: newReport.description!,
      location: newReport.location!,
      reporterId: userId,
      reporterName: "Current User",
      reporterType:
        userRole === "teacher"
          ? "teacher"
          : userRole === "student"
            ? "student"
            : "staff",
    } as Omit<IncidentReport, "id" | "status" | "reportedAt">;

    const id = onCreateReport ? await onCreateReport(report) : `I${Date.now()}`;

    setIncidents((prev) => [
      {
        ...report,
        id,
        status: "reported",
        reportedAt: new Date(),
      } as IncidentReport,
      ...prev,
    ]);

    setShowReportForm(false);
    setNewReport({
      title: "",
      description: "",
      category: "other",
      severity: "low",
      location: "",
      incidentDate: new Date(),
      reporterId: userId,
      reporterName: "Current User",
      reporterType:
        userRole === "teacher"
          ? "teacher"
          : userRole === "student"
            ? "student"
            : "staff",
      isAnonymous: false,
      immediateAction: "",
      parentNotified: false,
      medicalAttention: false,
      policeNotified: false,
    });
  };

  const handleUpdateStatus = async (
    incidentId: string,
    status: IncidentStatus,
  ) => {
    if (onUpdateStatus) {
      await onUpdateStatus(incidentId, status);
    }

    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, status } : i)),
    );
  };

  const handleAddNote = async () => {
    if (!selectedIncident || !newNote.trim()) return;

    const note: InvestigationNote = {
      id: `N${Date.now()}`,
      note: newNote,
      createdBy: userId,
      createdByName: "Current User",
      createdAt: new Date(),
      type: newNoteType,
    };

    if (onAddInvestigationNote) {
      await onAddInvestigationNote(selectedIncident.id, {
        note: newNote,
        createdBy: userId,
        createdByName: "Current User",
        type: newNoteType,
      });
    }

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === selectedIncident.id
          ? {
              ...i,
              investigationNotes: [...(i.investigationNotes || []), note],
            }
          : i,
      ),
    );

    setSelectedIncident((prev) =>
      prev
        ? {
            ...prev,
            investigationNotes: [...(prev.investigationNotes || []), note],
          }
        : null,
    );

    setNewNote("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Shield className="h-8 w-8 text-indigo-600" />
            Incident Reporting
          </h2>
          <p className="mt-1 text-slate-600">
            Report, track, and manage safety incidents
          </p>
        </div>
        <button
          onClick={() => setShowReportForm(true)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
        >
          <AlertTriangle className="h-5 w-5" />
          Report Incident
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Reported",
            count: incidents.filter((i) => i.status === "reported").length,
            color: "bg-blue-500",
          },
          {
            label: "Investigating",
            count: incidents.filter(
              (i) =>
                i.status === "under-investigation" ||
                i.status === "pending-action",
            ).length,
            color: "bg-amber-500",
          },
          {
            label: "Resolved",
            count: incidents.filter(
              (i) => i.status === "resolved" || i.status === "closed",
            ).length,
            color: "bg-green-500",
          },
          {
            label: "Critical",
            count: incidents.filter((i) => i.severity === "critical").length,
            color: "bg-red-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${stat.color}`} />
              <span className="text-slate-600 text-sm">{stat.label}</span>
            </div>
            <p className="font-bold text-2xl text-slate-900">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "all", label: "All Incidents" },
          { id: "reported", label: "New Reports" },
          { id: "investigating", label: "Under Investigation" },
          { id: "resolved", label: "Resolved" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 border-b-2 text-indigo-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterSeverity}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFilterSeverity(e.target.value as any)
          }
          className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Severities</option>
          {Object.entries(severityConfig).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
        <select
          value={filterCategory}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFilterCategory(e.target.value as any)
          }
          className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Categories</option>
          {Object.entries(categoryIcons).map(([key, icon]) => (
            <option key={key} value={key}>
              {icon} {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="divide-y divide-slate-200">
          <AnimatePresence mode="popLayout">
            {filteredIncidents.map((incident) => (
              <motion.div
                key={incident.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => setSelectedIncident(incident)}
                className="cursor-pointer p-6 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-semibold text-lg text-slate-900">
                        {incident.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${severityConfig[incident.severity].bg} ${severityConfig[incident.severity].color}`}
                      >
                        {severityConfig[incident.severity].label}
                      </span>
                      <div
                        className={`h-2 w-2 rounded-full ${statusConfig[incident.status].color}`}
                      />
                      <span className="text-slate-500 text-xs">
                        {statusConfig[incident.status].label}
                      </span>
                    </div>
                    <p className="mb-3 line-clamp-2 text-slate-600 text-sm">
                      {incident.description}
                    </p>
                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {incident.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {incident.incidentDate.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {incident.isAnonymous
                          ? "Anonymous"
                          : incident.reporterName}
                      </span>
                      {incident.assignedToName && (
                        <span className="flex items-center gap-1 text-indigo-600">
                          <Shield className="h-4 w-4" />
                          Assigned to: {incident.assignedToName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(userRole === "admin" || userRole === "safety-officer") &&
                      incident.status === "reported" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(
                              incident.id,
                              "under-investigation",
                            );
                          }}
                          className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white transition-colors hover:bg-indigo-700"
                        >
                          Start Investigation
                        </button>
                      )}
                    <span className="text-2xl">
                      {categoryIcons[incident.category]}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredIncidents.length === 0 && (
            <div className="p-12 text-center">
              <Shield className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <p className="text-slate-500">No incidents found</p>
            </div>
          )}
        </div>
      </div>

      {showReportForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowReportForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b bg-red-50 p-6">
              <h3 className="flex items-center gap-2 font-bold text-red-900 text-xl">
                <AlertTriangle className="h-6 w-6" />
                Report New Incident
              </h3>
              <p className="text-red-700">
                Provide detailed information about the incident
              </p>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Incident Title *
                </label>
                <input
                  type="text"
                  value={newReport.title || ""}
                  onChange={(e) =>
                    setNewReport({ ...newReport, title: e.target.value })
                  }
                  placeholder="Brief title describing the incident"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Category *
                  </label>
                  <select
                    value={newReport.category}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        category: e.target.value as IncidentCategory,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {Object.entries(categoryIcons).map(([key, icon]) => (
                      <option key={key} value={key}>
                        {icon} {key.charAt(0).toUpperCase() + key.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Severity *
                  </label>
                  <select
                    value={newReport.severity}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        severity: e.target.value as IncidentSeverity,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {Object.entries(severityConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Location *
                </label>
                <input
                  type="text"
                  value={newReport.location || ""}
                  onChange={(e) =>
                    setNewReport({ ...newReport, location: e.target.value })
                  }
                  placeholder="Where did the incident occur?"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Date & Time of Incident *
                </label>
                <input
                  type="datetime-local"
                  value={
                    newReport.incidentDate
                      ? new Date(newReport.incidentDate)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      incidentDate: new Date(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Description *
                </label>
                <textarea
                  value={newReport.description || ""}
                  onChange={(e) =>
                    setNewReport({ ...newReport, description: e.target.value })
                  }
                  placeholder="Provide detailed description of what happened..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Immediate Action Taken
                </label>
                <textarea
                  value={newReport.immediateAction || ""}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      immediateAction: e.target.value,
                    })
                  }
                  placeholder="What steps were taken immediately after the incident?"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newReport.parentNotified}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        parentNotified: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-slate-700 text-sm">
                    Parents/Guardians Notified
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newReport.medicalAttention}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        medicalAttention: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-slate-700 text-sm">
                    Medical Attention Required
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newReport.policeNotified}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        policeNotified: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-slate-700 text-sm">
                    Police/External Authorities Notified
                  </span>
                </label>
              </div>

              {userRole === "student" && (
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                  <input
                    type="checkbox"
                    checked={newReport.isAnonymous}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        isAnonymous: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 text-sm">
                    Submit anonymously
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              <button
                onClick={handleCreateReport}
                disabled={
                  !newReport.title ||
                  !newReport.description ||
                  !newReport.location
                }
                className="flex-1 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                Submit Report
              </button>
              <button
                onClick={() => setShowReportForm(false)}
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
          onClick={() => {
            setSelectedIncident(null);
            setShowInvestigationPanel(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="font-bold text-2xl text-slate-900">
                      {selectedIncident.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${severityConfig[selectedIncident.severity].bg} ${severityConfig[selectedIncident.severity].color}`}
                    >
                      {severityConfig[selectedIncident.severity].label} Priority
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-white text-xs ${statusConfig[selectedIncident.status].color}`}
                    >
                      {statusConfig[selectedIncident.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="text-xl">
                        {categoryIcons[selectedIncident.category]}
                      </span>
                      {selectedIncident.category.charAt(0).toUpperCase() +
                        selectedIncident.category.slice(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedIncident.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedIncident.incidentDate.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedIncident(null);
                    setShowInvestigationPanel(false);
                  }}
                  className="rounded-full p-2 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Reported By</p>
                  <p className="font-semibold text-slate-900">
                    {selectedIncident.isAnonymous
                      ? "Anonymous"
                      : selectedIncident.reporterName}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {selectedIncident.reporterType}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Reported At</p>
                  <p className="font-semibold text-slate-900">
                    {selectedIncident.reportedAt.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="mb-1 text-slate-500 text-sm">Assigned To</p>
                  <p className="font-semibold text-slate-900">
                    {selectedIncident.assignedToName || "Unassigned"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-slate-900">
                  Incident Description
                </h4>
                <p className="rounded-lg bg-slate-50 p-4 text-slate-700">
                  {selectedIncident.description}
                </p>
              </div>

              {selectedIncident.immediateAction && (
                <div>
                  <h4 className="mb-2 font-semibold text-slate-900">
                    Immediate Action Taken
                  </h4>
                  <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-slate-700">
                    {selectedIncident.immediateAction}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {selectedIncident.parentNotified && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-blue-700 text-sm">
                    <Phone className="h-3 w-3" />
                    Parents Notified
                  </span>
                )}
                {selectedIncident.medicalAttention && (
                  <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-red-700 text-sm">
                    Medical Attention Required
                  </span>
                )}
                {selectedIncident.policeNotified && (
                  <span className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-purple-700 text-sm">
                    Authorities Notified
                  </span>
                )}
                {selectedIncident.followUpRequired && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-700 text-sm">
                    <Clock className="h-3 w-3" />
                    Follow-up:{" "}
                    {selectedIncident.followUpDate?.toLocaleDateString()}
                  </span>
                )}
              </div>

              {selectedIncident.witnesses &&
                selectedIncident.witnesses.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-semibold text-slate-900">
                      Witnesses
                    </h4>
                    <div className="space-y-2">
                      {selectedIncident.witnesses.map((witness) => (
                        <div
                          key={witness.id}
                          className="rounded-lg bg-slate-50 p-3"
                        >
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-medium text-slate-900">
                              {witness.name}
                            </span>
                            <span className="text-slate-500 text-xs capitalize">
                              {witness.type}
                            </span>
                          </div>
                          {witness.statement && (
                            <p className="text-slate-600 text-sm italic">
                              "{witness.statement}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedIncident.involvedParties &&
                selectedIncident.involvedParties.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-semibold text-slate-900">
                      Involved Parties
                    </h4>
                    <div className="space-y-2">
                      {selectedIncident.involvedParties.map((party) => (
                        <div
                          key={party.id}
                          className="rounded-lg bg-slate-50 p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-900">
                              {party.name}
                            </span>
                            <span
                              className={`rounded px-2 py-0.5 text-xs capitalize ${
                                party.role === "victim"
                                  ? "bg-red-100 text-red-700"
                                  : party.role === "perpetrator"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {party.role}
                            </span>
                          </div>
                          {party.actionTaken && (
                            <p className="mt-1 text-slate-600 text-sm">
                              Action: {party.actionTaken}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {(userRole === "admin" || userRole === "safety-officer") && (
                <div className="border-slate-200 border-t pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">
                      Investigation Notes
                    </h4>
                    <button
                      onClick={() =>
                        setShowInvestigationPanel(!showInvestigationPanel)
                      }
                      className="text-indigo-600 text-sm hover:text-indigo-800"
                    >
                      {showInvestigationPanel ? "Hide Panel" : "Add Note"}
                    </button>
                  </div>

                  {showInvestigationPanel && (
                    <div className="mb-4 rounded-lg bg-slate-50 p-4">
                      <div className="space-y-3">
                        <select
                          value={newNoteType}
                          onChange={(e) =>
                            setNewNoteType(e.target.value as any)
                          }
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                        >
                          <option value="observation">Observation</option>
                          <option value="interview">Interview</option>
                          <option value="evidence">Evidence</option>
                          <option value="conclusion">Conclusion</option>
                          <option value="action">Action Taken</option>
                        </select>
                        <textarea
                          value={newNote}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>,
                          ) => setNewNote(e.target.value)}
                          placeholder="Enter investigation note..."
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          rows={3}
                        />
                        <button
                          onClick={handleAddNote}
                          disabled={!newNote.trim()}
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                        >
                          Add Note
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedIncident.investigationNotes &&
                  selectedIncident.investigationNotes.length > 0 ? (
                    <div className="space-y-2">
                      {selectedIncident.investigationNotes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-lg border border-indigo-100 bg-indigo-50 p-3"
                        >
                          <div className="mb-1 flex items-center justify-between">
                            <span
                              className={`rounded px-2 py-0.5 text-xs capitalize ${
                                note.type === "interview"
                                  ? "bg-blue-100 text-blue-700"
                                  : note.type === "evidence"
                                    ? "bg-purple-100 text-purple-700"
                                    : note.type === "action"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {note.type}
                            </span>
                            <span className="text-slate-500 text-xs">
                              {note.createdByName} •{" "}
                              {note.createdAt.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-700 text-sm">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm italic">
                      No investigation notes yet
                    </p>
                  )}
                </div>
              )}

              {selectedIncident.resolution && (
                <div className="border-slate-200 border-t pt-6">
                  <h4 className="mb-4 flex items-center gap-2 font-semibold text-green-900">
                    <CheckCircle className="h-5 w-5" />
                    Resolution
                  </h4>
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="mb-3 text-slate-700">
                      {selectedIncident.resolution.summary}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="mb-1 font-medium text-slate-900">
                          Actions Taken:
                        </p>
                        <ul className="list-inside list-disc text-slate-600">
                          {selectedIncident.resolution.actions.map(
                            (action, idx) => (
                              <li key={idx}>{action}</li>
                            ),
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1 font-medium text-slate-900">
                          Preventive Measures:
                        </p>
                        <ul className="list-inside list-disc text-slate-600">
                          {selectedIncident.resolution.preventiveMeasures.map(
                            (measure, idx) => (
                              <li key={idx}>{measure}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                    <p className="mt-3 text-slate-500 text-sm">
                      Resolved by {selectedIncident.resolution.closedByName} on{" "}
                      {selectedIncident.resolution.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 border-slate-200 border-t p-6">
              {(userRole === "admin" || userRole === "safety-officer") &&
                !selectedIncident.resolution && (
                  <>
                    {selectedIncident.status === "reported" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            selectedIncident.id,
                            "under-investigation",
                          )
                        }
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                      >
                        Start Investigation
                      </button>
                    )}
                    {selectedIncident.status === "under-investigation" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            selectedIncident.id,
                            "pending-action",
                          )
                        }
                        className="rounded-lg bg-amber-600 px-4 py-2 text-white transition-colors hover:bg-amber-700"
                      >
                        Mark Pending Action
                      </button>
                    )}
                    {(selectedIncident.status === "under-investigation" ||
                      selectedIncident.status === "pending-action") && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedIncident.id, "resolved")
                        }
                        className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedIncident.id, "escalated")
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                    >
                      Escalate
                    </button>
                  </>
                )}
              <button
                onClick={() => {
                  setSelectedIncident(null);
                  setShowInvestigationPanel(false);
                }}
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
