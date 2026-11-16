import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Heart,
  Plus,
  Stethoscope,
  X,
} from "lucide-react";
import { useState } from "react";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export interface MedicalRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  bloodGroup: BloodGroup;
  height: number; // cm
  weight: number; // kg
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  doctorContact: {
    name: string;
    phone: string;
    specialization: string;
  };
  vaccinations: VaccinationRecord[];
  medicalHistory: MedicalHistoryEntry[];
  lastCheckup: Date;
}

export interface VaccinationRecord {
  name: string;
  date: Date;
  dueDate?: Date;
  status: "completed" | "due" | "overdue";
  notes?: string;
}

export interface MedicalHistoryEntry {
  id: string;
  date: Date;
  type: "checkup" | "illness" | "injury" | "emergency";
  description: string;
  treatment?: string;
  prescribedMedications?: string[];
  doctorName?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
}

interface MedicalRecordsProps {
  onAddRecord: (record: Omit<MedicalRecord, "id">) => Promise<void>;
  onUpdateVaccination: (
    studentId: string,
    vaccination: VaccinationRecord,
  ) => Promise<void>;
  onAddMedicalHistory: (
    studentId: string,
    entry: Omit<MedicalHistoryEntry, "id">,
  ) => Promise<void>;
}

export function MedicalRecords({
  onAddRecord,
  onUpdateVaccination,
  onAddMedicalHistory,
}: MedicalRecordsProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: "1",
      studentId: "s1",
      studentName: "Rahul Sharma",
      class: "10-A",
      bloodGroup: "O+",
      height: 165,
      weight: 55,
      allergies: ["Peanuts", "Dust"],
      chronicConditions: ["Asthma (mild)"],
      currentMedications: ["Albuterol inhaler"],
      emergencyContact: {
        name: "Mr. Sharma",
        relation: "Father",
        phone: "9876543210",
      },
      doctorContact: {
        name: "Dr. Patel",
        phone: "9876543211",
        specialization: "Pediatrician",
      },
      vaccinations: [
        {
          name: "COVID-19 (Dose 1)",
          date: new Date("2021-05-15"),
          status: "completed",
        },
        {
          name: "COVID-19 (Dose 2)",
          date: new Date("2021-08-20"),
          status: "completed",
        },
        {
          name: "HPV Vaccine",
          date: new Date("2024-01-10"),
          dueDate: new Date("2024-07-10"),
          status: "due",
        },
      ],
      medicalHistory: [
        {
          id: "h1",
          date: new Date("2024-02-15"),
          type: "illness",
          description: "Seasonal flu",
          treatment: "Rest and fluids",
          doctorName: "Dr. Patel",
        },
        {
          id: "h2",
          date: new Date("2024-01-20"),
          type: "checkup",
          description: "Annual health checkup",
          doctorName: "Dr. Patel",
          followUpRequired: true,
          followUpDate: new Date("2025-01-20"),
        },
      ],
      lastCheckup: new Date("2024-01-20"),
    },
    {
      id: "2",
      studentId: "s2",
      studentName: "Priya Patel",
      class: "10-A",
      bloodGroup: "B+",
      height: 160,
      weight: 52,
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      emergencyContact: {
        name: "Mrs. Patel",
        relation: "Mother",
        phone: "9876543220",
      },
      doctorContact: {
        name: "Dr. Gupta",
        phone: "9876543221",
        specialization: "General Physician",
      },
      vaccinations: [
        {
          name: "COVID-19 (Dose 1)",
          date: new Date("2021-06-10"),
          status: "completed",
        },
        {
          name: "COVID-19 (Dose 2)",
          date: new Date("2021-09-15"),
          status: "completed",
        },
        {
          name: "Tetanus",
          date: new Date("2023-03-05"),
          dueDate: new Date("2028-03-05"),
          status: "completed",
        },
      ],
      medicalHistory: [
        {
          id: "h1",
          date: new Date("2024-03-01"),
          type: "injury",
          description: "Sprained ankle during sports",
          treatment: "Rest, ice, compression",
          doctorName: "Dr. Gupta",
          followUpRequired: false,
        },
      ],
      lastCheckup: new Date("2024-03-10"),
    },
  ]);

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null,
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"records" | "alerts">("records");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter(
    (r) =>
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.class.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getAlerts = () => {
    const alerts: {
      type: "vaccination" | "checkup" | "allergy" | "medication";
      student: string;
      message: string;
      severity: "high" | "medium" | "low";
    }[] = [];

    records.forEach((record) => {
      // Check overdue vaccinations
      record.vaccinations.forEach((vac) => {
        if (
          vac.status === "overdue" ||
          (vac.dueDate &&
            new Date() > vac.dueDate &&
            vac.status !== "completed")
        ) {
          alerts.push({
            type: "vaccination",
            student: record.studentName,
            message: `${vac.name} is overdue`,
            severity: "high",
          });
        }
      });

      // Check missed annual checkups
      const lastCheckup = new Date(record.lastCheckup);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (lastCheckup < oneYearAgo) {
        alerts.push({
          type: "checkup",
          student: record.studentName,
          message: "Annual health checkup is overdue",
          severity: "medium",
        });
      }

      // High severity allergies
      if (record.allergies.some((a) => ["Peanuts", "Shellfish"].includes(a))) {
        alerts.push({
          type: "allergy",
          student: record.studentName,
          message: `Severe allergies: ${record.allergies.join(", ")}`,
          severity: "high",
        });
      }
    });

    return alerts;
  };

  const getBMI = (height: number, weight: number) => {
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-yellow-600" };
    if (bmi < 25) return { label: "Normal", color: "text-green-600" };
    if (bmi < 30) return { label: "Overweight", color: "text-orange-600" };
    return { label: "Obese", color: "text-red-600" };
  };

  const alerts = getAlerts();

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                Medical Records
              </h2>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Student health records and infirmary log
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("records")}
              className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "records"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              Records
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "alerts"
                  ? "bg-red-500 text-white"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              Alerts
              {alerts.length > 0 && (
                <span className="rounded-full bg-white px-2 py-0.5 text-xs dark:bg-gray-800">
                  {alerts.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "records" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative max-w-md flex-1">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-4 focus:ring-2 focus:ring-primary dark:border-gray-700"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Add Record
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredRecords.map((record) => {
                const bmi = parseFloat(getBMI(record.height, record.weight));
                const bmiCategory = getBMICategory(bmi);

                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedRecord(record)}
                    className="cursor-pointer rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {record.studentName}
                        </h3>
                        <p className="text-gray-500 text-sm">{record.class}</p>
                      </div>
                      <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-700 text-sm dark:bg-red-900/30 dark:text-red-300">
                        {record.bloodGroup}
                      </span>
                    </div>

                    <div className="mb-3 grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <p className="text-gray-500 text-xs">Height</p>
                        <p className="font-medium">{record.height} cm</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 text-xs">Weight</p>
                        <p className="font-medium">{record.weight} kg</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 text-xs">BMI</p>
                        <p className={`font-medium ${bmiCategory.color}`}>
                          {bmi}
                        </p>
                      </div>
                    </div>

                    {record.allergies.length > 0 && (
                      <div className="mb-2">
                        <p className="mb-1 text-gray-500 text-xs">Allergies:</p>
                        <div className="flex flex-wrap gap-1">
                          {record.allergies.map((allergy, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 border-gray-200 border-t pt-2 text-gray-600 text-sm dark:border-gray-700 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Stethoscope className="h-4 w-4" />
                        {record.medicalHistory.length} visits
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Last checkup: {record.lastCheckup.toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-4">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
              Health Alerts ({alerts.length})
            </h3>

            {alerts.length === 0 ? (
              <div className="rounded-xl bg-green-50 p-8 text-center dark:bg-green-900/20">
                <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
                <p className="text-gray-600 dark:text-gray-400">
                  No health alerts at this time!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`rounded-xl border-l-4 p-4 ${
                      alert.severity === "high"
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          alert.severity === "high"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {alert.student}
                        </p>
                        <p className="text-gray-600 text-sm dark:text-gray-400">
                          {alert.message}
                        </p>
                        <span className="mt-1 inline-block text-gray-500 text-xs capitalize">
                          {alert.type}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
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
              className="max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            >
              <div className="border-gray-200 border-b p-6 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                      {selectedRecord.studentName}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {selectedRecord.class}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
                    <p className="text-gray-500 text-xs">Blood Group</p>
                    <p className="font-bold text-red-600 text-xl">
                      {selectedRecord.bloodGroup}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
                    <p className="text-gray-500 text-xs">Height</p>
                    <p className="font-bold text-lg">
                      {selectedRecord.height} cm
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
                    <p className="text-gray-500 text-xs">Weight</p>
                    <p className="font-bold text-lg">
                      {selectedRecord.weight} kg
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
                    <p className="text-gray-500 text-xs">BMI</p>
                    <p className="font-bold text-lg">
                      {getBMI(selectedRecord.height, selectedRecord.weight)}
                    </p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-red-900 dark:text-red-300">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency Contact
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {selectedRecord.emergencyContact.name} (
                      {selectedRecord.emergencyContact.relation})
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedRecord.emergencyContact.phone}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Doctor:</span>{" "}
                      {selectedRecord.doctorContact.name} (
                      {selectedRecord.doctorContact.specialization})
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Doctor Phone:</span>{" "}
                      {selectedRecord.doctorContact.phone}
                    </p>
                  </div>
                </div>

                {/* Allergies & Conditions */}
                {selectedRecord.allergies.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                      Allergies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        >
                          ⚠️ {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRecord.chronicConditions.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                      Chronic Conditions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.chronicConditions.map(
                        (condition, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-orange-100 px-3 py-1 text-orange-700 text-sm dark:bg-orange-900/30 dark:text-orange-300"
                          >
                            <Activity className="mr-1 inline h-3 w-3" />
                            {condition}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Vaccinations */}
                <div>
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                    Vaccinations
                  </h4>
                  <div className="space-y-2">
                    {selectedRecord.vaccinations.map((vac, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                      >
                        <div>
                          <p className="font-medium">{vac.name}</p>
                          <p className="text-gray-500 text-xs">
                            {vac.status === "completed"
                              ? `Completed: ${vac.date.toLocaleDateString()}`
                              : `Due: ${vac.dueDate?.toLocaleDateString()}`}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            vac.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : vac.status === "due"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {vac.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                    Medical History
                  </h4>
                  <div className="space-y-2">
                    {selectedRecord.medicalHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span
                            className={`rounded px-2 py-0.5 text-xs ${
                              entry.type === "emergency"
                                ? "bg-red-100 text-red-700"
                                : entry.type === "injury"
                                  ? "bg-orange-100 text-orange-700"
                                  : entry.type === "illness"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {entry.type}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {entry.date.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-medium">{entry.description}</p>
                        {entry.treatment && (
                          <p className="text-gray-600 text-sm dark:text-gray-400">
                            Treatment: {entry.treatment}
                          </p>
                        )}
                        {entry.doctorName && (
                          <p className="text-gray-600 text-sm dark:text-gray-400">
                            Doctor: {entry.doctorName}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MedicalRecords;
