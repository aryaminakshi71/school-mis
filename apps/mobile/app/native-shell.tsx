import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  type AttendanceDraft,
  type AttendanceStatus,
  type BulkStudentClassAssignmentInput,
  type ClassRecord,
  type ClassUpsertInput,
  type GradeRecord,
  type GradeUpsertInput,
  type SessionRecord,
  type StudentRecord,
  type StudentUpsertInput,
  type SubjectRecord,
  type SubjectUpsertInput,
  type TeacherRecord,
  type TeacherUpsertInput,
  assignStudentsToClass,
  buildApiBaseUrl,
  buildAttendanceSavePayload,
  deleteClassRecord,
  deleteGradeRecord,
  deleteStudentRecord,
  deleteSubjectRecord,
  deleteTeacherRecord,
  filterStudents,
  formatDisplayDate,
  formatLocalDate,
  getAttendanceRate,
  getInitials,
  saveAttendanceSubmission,
  saveClassRecord,
  saveGradeRecord,
  saveStudentRecord,
  saveSubjectRecord,
  saveTeacherRecord,
} from "./mobile-data";

type AppConfig = {
  schoolName?: string;
  schoolShortName?: string;
  webUrl?: string;
};

type SchoolSettings = {
  schoolName: string;
  shortName: string;
  schoolAddress: string;
  phoneNumber?: string;
  supportEmail?: string;
  websiteUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  receiptFooter?: string;
  mobileAppName?: string;
};

type AttendanceRecord = {
  id: string;
  studentId: string;
  date: string;
  status: string;
  studentName?: string;
  className?: string;
};

type DashboardSnapshot = {
  totalStudents: number;
  totalTeachers: number;
  presentToday: number;
  absentToday: number;
  attendanceRate: number;
  latestNotice: string;
};

type CacheEnvelope<T> = {
  cachedAt: string;
  data: T;
};

type QueryState<T> = {
  data: T;
  isLoading: boolean;
  isRefreshing: boolean;
  source: "live" | "cache" | "empty";
  error: string | null;
  refresh: () => Promise<void>;
};

type TabId = "home" | "attendance" | "students" | "grades" | "profile";

type StudentFormState = {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  classId: string;
};

type GradeFormState = {
  id?: string;
  studentId: string;
  classId: string;
  subjectId: string;
  examType: string;
  obtainedMarks: string;
  maxMarks: string;
  grade: string;
};

type TeacherFormState = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
};

type ClassFormState = {
  id?: string;
  name: string;
  section: string;
  capacity: string;
};

type SubjectFormState = {
  id?: string;
  name: string;
  code: string;
  classId: string;
  teacherId: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as AppConfig;
const DEFAULT_BRANDING: SchoolSettings = {
  schoolName: extra.schoolName || "School MIS",
  shortName: extra.schoolShortName || extra.schoolName || "SM",
  schoolAddress: "",
  phoneNumber: "",
  supportEmail: "",
  websiteUrl: extra.webUrl || "",
  logoUrl: "",
  primaryColor: "#0f766e",
  secondaryColor: "#f59e0b",
  receiptFooter: "",
  mobileAppName: extra.schoolName || "School MIS",
};

const CACHE_KEYS = {
  branding: "mobile.branding",
  dashboard: "mobile.dashboard",
  attendance: "mobile.attendance",
  students: "mobile.students",
  classes: "mobile.classes",
  subjects: "mobile.subjects",
  activeSession: "mobile.active-session",
  grades: "mobile.grades",
  teachers: "mobile.teachers",
  academicClasses: "mobile.academic-classes",
  academicSubjects: "mobile.academic-subjects",
} as const;

const EMPTY_STUDENT_FORM: StudentFormState = {
  firstName: "",
  lastName: "",
  phone: "",
  classId: "",
};

const EMPTY_GRADE_FORM: GradeFormState = {
  studentId: "",
  classId: "",
  subjectId: "",
  examType: "Midterm",
  obtainedMarks: "",
  maxMarks: "100",
  grade: "",
};

const EMPTY_TEACHER_FORM: TeacherFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  qualification: "",
};

const EMPTY_CLASS_FORM: ClassFormState = {
  name: "",
  section: "",
  capacity: "40",
};

const EMPTY_SUBJECT_FORM: SubjectFormState = {
  name: "",
  code: "",
  classId: "",
  teacherId: "",
};

const GRADE_EXAM_TYPES = ["Midterm", "Final", "Quiz", "Assignment"] as const;

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: "home", label: "Home", icon: "▣" },
  { id: "attendance", label: "Attendance", icon: "◔" },
  { id: "students", label: "Students", icon: "◉" },
  { id: "grades", label: "Grades", icon: "△" },
  { id: "profile", label: "Profile", icon: "◎" },
];

async function readCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return (JSON.parse(raw) as CacheEnvelope<T>).data;
  } catch {
    return null;
  }
}

async function writeCache<T>(key: string, data: T): Promise<void> {
  try {
    const payload: CacheEnvelope<T> = {
      cachedAt: new Date().toISOString(),
      data,
    };
    await AsyncStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Cache is best-effort only.
  }
}

async function apiGet<T>(apiBaseUrl: string, path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

function useCachedQuery<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  initialData: T,
  deps: ReadonlyArray<unknown> = [],
): QueryState<T> {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [source, setSource] = useState<"live" | "cache" | "empty">("empty");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const cached = await readCache<T>(cacheKey);
      if (cached !== null && isMounted) {
        setData(cached);
        setSource("cache");
        setIsLoading(false);
      }

      try {
        const fresh = await fetcher();
        if (!isMounted) return;
        setData(fresh);
        setSource("live");
        setError(null);
        setIsLoading(false);
        await writeCache(cacheKey, fresh);
      } catch (fetchError) {
        if (!isMounted) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load data",
        );
        setIsLoading(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [cacheKey, ...deps]);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await fetcher();
      setData(fresh);
      setSource("live");
      setError(null);
      await writeCache(cacheKey, fresh);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : "Unable to refresh",
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  return { data, isLoading, isRefreshing, source, error, refresh };
}

function LoadingState({ label }: { label: string }) {
  return (
    <View style={styles.centerState}>
      <ActivityIndicator size="large" color="#0f766e" />
      <Text style={styles.centerStateText}>{label}</Text>
    </View>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.centerStateCompact}>
      <Text style={styles.centerStateText}>{text}</Text>
    </View>
  );
}

function InlineNotice({
  text,
  tone = "warning",
}: {
  text: string;
  tone?: "warning" | "success";
}) {
  return (
    <View style={[styles.notice, tone === "success" && styles.noticeSuccess]}>
      <Text
        style={[
          styles.noticeText,
          tone === "success" && styles.noticeSuccessText,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statPillLabel}>{label}</Text>
      <Text style={styles.statPillValue}>{value}</Text>
    </View>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );
}

export default function NativeShell() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [studentSearch, setStudentSearch] = useState("");
  const [attendanceDraft, setAttendanceDraft] = useState<AttendanceDraft>({});
  const [attendanceSaveMessage, setAttendanceSaveMessage] = useState<
    string | null
  >(null);
  const [attendanceSaveError, setAttendanceSaveError] = useState<string | null>(
    null,
  );
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [studentFormVisible, setStudentFormVisible] = useState(false);
  const [studentForm, setStudentForm] =
    useState<StudentFormState>(EMPTY_STUDENT_FORM);
  const [studentBulkMode, setStudentBulkMode] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [bulkClassId, setBulkClassId] = useState("");
  const [bulkStudentMessage, setBulkStudentMessage] = useState<string | null>(
    null,
  );
  const [bulkStudentError, setBulkStudentError] = useState<string | null>(null);
  const [studentSaveMessage, setStudentSaveMessage] = useState<string | null>(
    null,
  );
  const [studentSaveError, setStudentSaveError] = useState<string | null>(null);
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [isBulkAssigningStudents, setIsBulkAssigningStudents] = useState(false);
  const [gradeFormVisible, setGradeFormVisible] = useState(false);
  const [gradeForm, setGradeForm] = useState<GradeFormState>(EMPTY_GRADE_FORM);
  const [gradeStudentSearch, setGradeStudentSearch] = useState("");
  const [gradeSaveMessage, setGradeSaveMessage] = useState<string | null>(null);
  const [gradeSaveError, setGradeSaveError] = useState<string | null>(null);
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [teacherFormVisible, setTeacherFormVisible] = useState(false);
  const [teacherForm, setTeacherForm] =
    useState<TeacherFormState>(EMPTY_TEACHER_FORM);
  const [teacherSaveMessage, setTeacherSaveMessage] = useState<string | null>(
    null,
  );
  const [teacherSaveError, setTeacherSaveError] = useState<string | null>(null);
  const [isSavingTeacher, setIsSavingTeacher] = useState(false);
  const [isDeletingTeacher, setIsDeletingTeacher] = useState(false);
  const [classSearch, setClassSearch] = useState("");
  const [classFormVisible, setClassFormVisible] = useState(false);
  const [classForm, setClassForm] = useState<ClassFormState>(EMPTY_CLASS_FORM);
  const [classSaveMessage, setClassSaveMessage] = useState<string | null>(null);
  const [classSaveError, setClassSaveError] = useState<string | null>(null);
  const [isSavingClass, setIsSavingClass] = useState(false);
  const [isDeletingClass, setIsDeletingClass] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjectFormVisible, setSubjectFormVisible] = useState(false);
  const [subjectForm, setSubjectForm] =
    useState<SubjectFormState>(EMPTY_SUBJECT_FORM);
  const [subjectSaveMessage, setSubjectSaveMessage] = useState<string | null>(
    null,
  );
  const [subjectSaveError, setSubjectSaveError] = useState<string | null>(null);
  const [isSavingSubject, setIsSavingSubject] = useState(false);
  const [isDeletingSubject, setIsDeletingSubject] = useState(false);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);
  const [isDeletingGrade, setIsDeletingGrade] = useState(false);
  const webUrl = extra.webUrl || "http://localhost:5173";
  const apiBaseUrl = useMemo(() => buildApiBaseUrl(webUrl), [webUrl]);

  const brandingQuery = useCachedQuery<SchoolSettings>(
    CACHE_KEYS.branding,
    async () => {
      const response = await apiGet<{ settings: SchoolSettings }>(
        apiBaseUrl,
        "/school-settings",
      );
      return response.settings;
    },
    DEFAULT_BRANDING,
    [apiBaseUrl],
  );

  const studentsQuery = useCachedQuery<StudentRecord[]>(
    CACHE_KEYS.students,
    async () => {
      const response = await apiGet<{ students: StudentRecord[] }>(
        apiBaseUrl,
        "/students?limit=50",
      );
      return response.students ?? [];
    },
    [],
    [apiBaseUrl],
  );

  const classesQuery = useCachedQuery<ClassRecord[]>(
    CACHE_KEYS.academicClasses,
    async () => {
      const response = await apiGet<{ classes: ClassRecord[] }>(
        apiBaseUrl,
        "/classes",
      );
      return response.classes ?? [];
    },
    [],
    [apiBaseUrl],
  );

  const subjectsQuery = useCachedQuery<SubjectRecord[]>(
    CACHE_KEYS.academicSubjects,
    async () => {
      const response = await apiGet<{ subjects: SubjectRecord[] }>(
        apiBaseUrl,
        "/subjects",
      );
      return response.subjects ?? [];
    },
    [],
    [apiBaseUrl],
  );

  const activeSessionQuery = useCachedQuery<SessionRecord | null>(
    CACHE_KEYS.activeSession,
    async () => {
      const response = await apiGet<{ session: SessionRecord | null }>(
        apiBaseUrl,
        "/sessions/active",
      );
      return response.session ?? null;
    },
    null,
    [apiBaseUrl],
  );

  const attendanceQuery = useCachedQuery<AttendanceRecord[]>(
    CACHE_KEYS.attendance,
    async () => {
      const response = await apiGet<{ attendance: AttendanceRecord[] }>(
        apiBaseUrl,
        "/attendance/history?days=7",
      );
      return response.attendance ?? [];
    },
    [],
    [apiBaseUrl],
  );

  const gradesQuery = useCachedQuery<GradeRecord[]>(
    CACHE_KEYS.grades,
    async () => {
      const response = await apiGet<{ grades: GradeRecord[] }>(
        apiBaseUrl,
        "/grades",
      );
      return response.grades ?? [];
    },
    [],
    [apiBaseUrl],
  );

  const teachersQuery = useCachedQuery<TeacherRecord[]>(
    CACHE_KEYS.teachers,
    async () => {
      const response = await apiGet<{ teachers: TeacherRecord[] }>(
        apiBaseUrl,
        "/teachers",
      );
      return response.teachers ?? [];
    },
    [],
    [apiBaseUrl],
  );

  const dashboardQuery = useCachedQuery<DashboardSnapshot>(
    CACHE_KEYS.dashboard,
    async () => {
      const [studentsRes, teachersRes, attendanceRes] = await Promise.all([
        apiGet<{ students: StudentRecord[] }>(
          apiBaseUrl,
          "/students?limit=100",
        ),
        apiGet<{ teachers: TeacherRecord[] }>(apiBaseUrl, "/teachers"),
        apiGet<{ attendance: AttendanceRecord[] }>(
          apiBaseUrl,
          "/attendance?date=" + new Date().toISOString().slice(0, 10),
        ),
      ]);

      const todayAttendance = attendanceRes.attendance ?? [];
      return {
        totalStudents: studentsRes.students?.length ?? 0,
        totalTeachers: teachersRes.teachers?.length ?? 0,
        presentToday: todayAttendance.filter(
          (record) => record.status === "present",
        ).length,
        absentToday: todayAttendance.filter(
          (record) => record.status === "absent",
        ).length,
        attendanceRate: getAttendanceRate(todayAttendance),
        latestNotice:
          todayAttendance.length > 0
            ? "Attendance sync is active and recording live classroom presence."
            : "Connect attendance capture to surface live notices here.",
      };
    },
    {
      totalStudents: 0,
      totalTeachers: 0,
      presentToday: 0,
      absentToday: 0,
      attendanceRate: 0,
      latestNotice: "Loading school operations...",
    },
    [apiBaseUrl],
  );

  const branding = brandingQuery.data;
  const filteredStudents = useMemo(
    () => filterStudents(studentsQuery.data, studentSearch),
    [studentSearch, studentsQuery.data],
  );
  const attendanceRoster = useMemo(
    () => studentsQuery.data.slice(0, 8),
    [studentsQuery.data],
  );
  const attendanceDate = useMemo(() => formatLocalDate(new Date()), []);
  const filteredGradeStudents = useMemo(
    () => filterStudents(studentsQuery.data, gradeStudentSearch).slice(0, 12),
    [gradeStudentSearch, studentsQuery.data],
  );
  const filteredTeachers = useMemo(() => {
    const normalizedQuery = teacherSearch.trim().toLowerCase();
    if (!normalizedQuery) return teachersQuery.data;

    return teachersQuery.data.filter((teacher) => {
      const haystack = [
        teacher.firstName,
        teacher.lastName,
        teacher.email,
        teacher.subjectSpecialization,
        teacher.employeeId,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [teacherSearch, teachersQuery.data]);
  const filteredClasses = useMemo(() => {
    const normalizedQuery = classSearch.trim().toLowerCase();
    if (!normalizedQuery) return classesQuery.data;

    return classesQuery.data.filter((cls) => {
      const haystack = [cls.name, cls.section, String(cls.capacity || "")]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [classSearch, classesQuery.data]);
  const filteredSubjects = useMemo(() => {
    const normalizedQuery = subjectSearch.trim().toLowerCase();
    if (!normalizedQuery) return subjectsQuery.data;

    return subjectsQuery.data.filter((subject) => {
      const classLabel = classesQuery.data.find(
        (cls) => cls.id === subject.classId,
      )?.name;
      const haystack = [subject.name, subject.code, classLabel]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [subjectSearch, subjectsQuery.data, classesQuery.data]);

  const beginStudentCreate = () => {
    setStudentBulkMode(false);
    setSelectedStudentIds([]);
    setBulkClassId("");
    setStudentForm(EMPTY_STUDENT_FORM);
    setStudentFormVisible(true);
    setStudentSaveError(null);
    setStudentSaveMessage(null);
  };

  const beginGradeCreate = () => {
    setGradeForm(EMPTY_GRADE_FORM);
    setGradeStudentSearch("");
    setGradeFormVisible(true);
    setGradeSaveError(null);
    setGradeSaveMessage(null);
  };

  const beginTeacherCreate = () => {
    setTeacherForm(EMPTY_TEACHER_FORM);
    setTeacherFormVisible(true);
    setTeacherSaveError(null);
    setTeacherSaveMessage(null);
  };

  const beginClassCreate = () => {
    setClassForm(EMPTY_CLASS_FORM);
    setClassFormVisible(true);
    setClassSaveError(null);
    setClassSaveMessage(null);
  };

  const beginSubjectCreate = () => {
    setSubjectForm(EMPTY_SUBJECT_FORM);
    setSubjectFormVisible(true);
    setSubjectSaveError(null);
    setSubjectSaveMessage(null);
  };

  const beginGradeEdit = (grade: GradeRecord) => {
    setGradeForm({
      id: grade.id,
      studentId: grade.studentId,
      classId: grade.classId,
      subjectId: grade.subjectId,
      examType: grade.examType,
      obtainedMarks: String(grade.score),
      maxMarks: String(grade.maxScore),
      grade: grade.grade || "",
    });
    setGradeStudentSearch(grade.studentName);
    setGradeFormVisible(true);
    setGradeSaveError(null);
    setGradeSaveMessage(null);
  };

  const beginStudentEdit = (student: StudentRecord) => {
    setStudentBulkMode(false);
    setStudentForm({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone || "",
      classId: student.classId || "",
    });
    setStudentFormVisible(true);
    setStudentSaveError(null);
    setStudentSaveMessage(null);
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((current) =>
      current.includes(studentId)
        ? current.filter((id) => id !== studentId)
        : [...current, studentId],
    );
  };

  const toggleBulkStudentMode = () => {
    setStudentBulkMode((current) => !current);
    setSelectedStudentIds([]);
    setBulkClassId("");
    setBulkStudentError(null);
    setBulkStudentMessage(null);
    setStudentFormVisible(false);
  };

  const beginTeacherEdit = (teacher: TeacherRecord) => {
    setTeacherForm({
      id: teacher.id,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email || "",
      phone: teacher.phone || "",
      subject: teacher.subjectSpecialization || "",
      qualification: teacher.qualification || "",
    });
    setTeacherFormVisible(true);
    setTeacherSaveError(null);
    setTeacherSaveMessage(null);
  };

  const beginClassEdit = (cls: ClassRecord) => {
    setClassForm({
      id: cls.id,
      name: cls.name,
      section: cls.section || "",
      capacity: String(cls.capacity || 40),
    });
    setClassFormVisible(true);
    setClassSaveError(null);
    setClassSaveMessage(null);
  };

  const beginSubjectEdit = (subject: SubjectRecord) => {
    setSubjectForm({
      id: subject.id,
      name: subject.name,
      code: subject.code || "",
      classId: subject.classId || "",
      teacherId: subject.teacherId || "",
    });
    setSubjectFormVisible(true);
    setSubjectSaveError(null);
    setSubjectSaveMessage(null);
  };

  const setAttendanceStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceDraft((current) => ({
      ...current,
      [studentId]: current[studentId] === status ? undefined : status,
    }));
  };

  const submitAttendance = async () => {
    const payload = buildAttendanceSavePayload(
      attendanceRoster,
      attendanceDraft,
      attendanceDate,
    );

    if (payload.records.length === 0) {
      setAttendanceSaveError(
        "Choose at least one student before saving attendance.",
      );
      setAttendanceSaveMessage(null);
      return;
    }

    setIsSavingAttendance(true);
    setAttendanceSaveError(null);
    setAttendanceSaveMessage(null);

    try {
      const result = await saveAttendanceSubmission(apiBaseUrl, payload);
      setAttendanceSaveMessage(
        `Saved ${result.saved} attendance record${result.saved === 1 ? "" : "s"} for ${formatDisplayDate(attendanceDate)}.`,
      );
      setAttendanceDraft({});
      await Promise.all([attendanceQuery.refresh(), dashboardQuery.refresh()]);
    } catch (error) {
      setAttendanceSaveError(
        error instanceof Error ? error.message : "Unable to save attendance.",
      );
    } finally {
      setIsSavingAttendance(false);
    }
  };

  const submitStudent = async () => {
    const payload: StudentUpsertInput = {
      id: studentForm.id,
      firstName: studentForm.firstName.trim(),
      lastName: studentForm.lastName.trim(),
      phone: studentForm.phone.trim(),
      classId: studentForm.classId || undefined,
    };

    if (!payload.firstName || !payload.lastName) {
      setStudentSaveError("First name and last name are required.");
      setStudentSaveMessage(null);
      return;
    }

    setIsSavingStudent(true);
    setStudentSaveError(null);
    setStudentSaveMessage(null);

    try {
      const saved = await saveStudentRecord(apiBaseUrl, payload);
      setStudentSaveMessage(
        `${saved.firstName} ${saved.lastName} has been ${payload.id ? "updated" : "created"}.`,
      );
      setStudentFormVisible(false);
      setStudentForm(EMPTY_STUDENT_FORM);
      await Promise.all([studentsQuery.refresh(), dashboardQuery.refresh()]);
    } catch (error) {
      setStudentSaveError(
        error instanceof Error ? error.message : "Unable to save student.",
      );
    } finally {
      setIsSavingStudent(false);
    }
  };

  const submitBulkStudentAssignment = async () => {
    const payload: BulkStudentClassAssignmentInput = {
      studentIds: selectedStudentIds,
      classId: bulkClassId,
    };

    if (payload.studentIds.length === 0) {
      setBulkStudentError("Select at least one student for bulk assignment.");
      setBulkStudentMessage(null);
      return;
    }

    if (!payload.classId) {
      setBulkStudentError("Choose a destination class first.");
      setBulkStudentMessage(null);
      return;
    }

    setIsBulkAssigningStudents(true);
    setBulkStudentError(null);
    setBulkStudentMessage(null);

    try {
      const result = await assignStudentsToClass(apiBaseUrl, payload);
      setBulkStudentMessage(
        `Moved ${result.assigned} student${result.assigned === 1 ? "" : "s"} to the selected class.`,
      );
      setSelectedStudentIds([]);
      setBulkClassId("");
      setStudentBulkMode(false);
      await Promise.all([studentsQuery.refresh(), dashboardQuery.refresh()]);
    } catch (error) {
      setBulkStudentError(
        error instanceof Error
          ? error.message
          : "Unable to bulk assign students.",
      );
    } finally {
      setIsBulkAssigningStudents(false);
    }
  };

  const submitGrade = async () => {
    const parsedMaxMarks = Number(gradeForm.maxMarks);
    const parsedObtainedMarks = Number(gradeForm.obtainedMarks);
    const payload: GradeUpsertInput = {
      id: gradeForm.id,
      studentId: gradeForm.studentId,
      classId: gradeForm.classId,
      sessionId: gradeForm.id ? undefined : activeSessionQuery.data?.id,
      examType: gradeForm.examType.trim(),
      subjectId: gradeForm.subjectId,
      maxMarks: parsedMaxMarks,
      obtainedMarks: parsedObtainedMarks,
      grade: gradeForm.grade.trim() || undefined,
    };

    if (
      !payload.studentId ||
      !payload.classId ||
      !payload.subjectId ||
      !payload.examType
    ) {
      setGradeSaveError("Student, class, subject, and exam type are required.");
      setGradeSaveMessage(null);
      return;
    }

    if (!gradeForm.id && !payload.sessionId) {
      setGradeSaveError(
        "No active academic session is available for grade entry.",
      );
      setGradeSaveMessage(null);
      return;
    }

    if (
      !Number.isFinite(parsedMaxMarks) ||
      !Number.isFinite(parsedObtainedMarks)
    ) {
      setGradeSaveError("Marks must be valid numbers.");
      setGradeSaveMessage(null);
      return;
    }

    setIsSavingGrade(true);
    setGradeSaveError(null);
    setGradeSaveMessage(null);

    try {
      await saveGradeRecord(apiBaseUrl, payload);
      setGradeSaveMessage(
        `Grade has been ${payload.id ? "updated" : "recorded"} successfully.`,
      );
      setGradeFormVisible(false);
      setGradeForm(EMPTY_GRADE_FORM);
      setGradeStudentSearch("");
      await gradesQuery.refresh();
    } catch (error) {
      setGradeSaveError(
        error instanceof Error ? error.message : "Unable to save grade.",
      );
    } finally {
      setIsSavingGrade(false);
    }
  };

  const submitTeacher = async () => {
    const payload: TeacherUpsertInput = {
      id: teacherForm.id,
      firstName: teacherForm.firstName.trim(),
      lastName: teacherForm.lastName.trim(),
      email: teacherForm.email.trim(),
      phone: teacherForm.phone.trim(),
      subject: teacherForm.subject.trim(),
      qualification: teacherForm.qualification.trim(),
      status: true,
    };

    if (!payload.firstName || !payload.lastName || !payload.email) {
      setTeacherSaveError("First name, last name, and email are required.");
      setTeacherSaveMessage(null);
      return;
    }

    setIsSavingTeacher(true);
    setTeacherSaveError(null);
    setTeacherSaveMessage(null);

    try {
      const saved = await saveTeacherRecord(apiBaseUrl, payload);
      setTeacherSaveMessage(
        `${saved.firstName} ${saved.lastName} has been ${payload.id ? "updated" : "created"}.`,
      );
      setTeacherFormVisible(false);
      setTeacherForm(EMPTY_TEACHER_FORM);
      await Promise.all([teachersQuery.refresh(), dashboardQuery.refresh()]);
    } catch (error) {
      setTeacherSaveError(
        error instanceof Error ? error.message : "Unable to save teacher.",
      );
    } finally {
      setIsSavingTeacher(false);
    }
  };

  const submitClass = async () => {
    const parsedCapacity = Number(classForm.capacity);
    const payload: ClassUpsertInput = {
      id: classForm.id,
      name: classForm.name.trim(),
      section: classForm.section.trim() || undefined,
      capacity: Number.isFinite(parsedCapacity) ? parsedCapacity : undefined,
    };

    if (!payload.name) {
      setClassSaveError("Class name is required.");
      setClassSaveMessage(null);
      return;
    }

    setIsSavingClass(true);
    setClassSaveError(null);
    setClassSaveMessage(null);

    try {
      const saved = await saveClassRecord(apiBaseUrl, payload);
      setClassSaveMessage(
        `${saved.name}${saved.section ? `-${saved.section}` : ""} has been ${payload.id ? "updated" : "created"}.`,
      );
      setClassFormVisible(false);
      setClassForm(EMPTY_CLASS_FORM);
      await Promise.all([classesQuery.refresh(), dashboardQuery.refresh()]);
    } catch (error) {
      setClassSaveError(
        error instanceof Error ? error.message : "Unable to save class.",
      );
    } finally {
      setIsSavingClass(false);
    }
  };

  const submitSubject = async () => {
    const payload: SubjectUpsertInput = {
      id: subjectForm.id,
      name: subjectForm.name.trim(),
      code: subjectForm.code.trim() || undefined,
      classId: subjectForm.classId || undefined,
      teacherId: subjectForm.teacherId || undefined,
      isActive: true,
    };

    if (!payload.name) {
      setSubjectSaveError("Subject name is required.");
      setSubjectSaveMessage(null);
      return;
    }

    setIsSavingSubject(true);
    setSubjectSaveError(null);
    setSubjectSaveMessage(null);

    try {
      const saved = await saveSubjectRecord(apiBaseUrl, payload);
      setSubjectSaveMessage(
        `${saved.name} has been ${payload.id ? "updated" : "created"}.`,
      );
      setSubjectFormVisible(false);
      setSubjectForm(EMPTY_SUBJECT_FORM);
      await subjectsQuery.refresh();
    } catch (error) {
      setSubjectSaveError(
        error instanceof Error ? error.message : "Unable to save subject.",
      );
    } finally {
      setIsSavingSubject(false);
    }
  };

  const confirmDelete = (label: string, onConfirm: () => void) => {
    Alert.alert(
      `Delete ${label}`,
      `This will permanently remove the ${label.toLowerCase()} record.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onConfirm },
      ],
    );
  };

  const removeStudent = () => {
    if (!studentForm.id) return;

    confirmDelete("student", () => {
      void (async () => {
        setIsDeletingStudent(true);
        setStudentSaveError(null);
        try {
          await deleteStudentRecord(apiBaseUrl, studentForm.id!);
          setStudentSaveMessage("Student has been deleted.");
          setStudentFormVisible(false);
          setStudentForm(EMPTY_STUDENT_FORM);
          await Promise.all([
            studentsQuery.refresh(),
            dashboardQuery.refresh(),
          ]);
        } catch (error) {
          setStudentSaveError(
            error instanceof Error
              ? error.message
              : "Unable to delete student.",
          );
        } finally {
          setIsDeletingStudent(false);
        }
      })();
    });
  };

  const removeGrade = () => {
    if (!gradeForm.id) return;

    confirmDelete("grade", () => {
      void (async () => {
        setIsDeletingGrade(true);
        setGradeSaveError(null);
        try {
          await deleteGradeRecord(apiBaseUrl, gradeForm.id!);
          setGradeSaveMessage("Grade has been deleted.");
          setGradeFormVisible(false);
          setGradeForm(EMPTY_GRADE_FORM);
          setGradeStudentSearch("");
          await gradesQuery.refresh();
        } catch (error) {
          setGradeSaveError(
            error instanceof Error ? error.message : "Unable to delete grade.",
          );
        } finally {
          setIsDeletingGrade(false);
        }
      })();
    });
  };

  const removeTeacher = () => {
    if (!teacherForm.id) return;

    confirmDelete("teacher", () => {
      void (async () => {
        setIsDeletingTeacher(true);
        setTeacherSaveError(null);
        try {
          await deleteTeacherRecord(apiBaseUrl, teacherForm.id!);
          setTeacherSaveMessage("Teacher has been deleted.");
          setTeacherFormVisible(false);
          setTeacherForm(EMPTY_TEACHER_FORM);
          await Promise.all([
            teachersQuery.refresh(),
            dashboardQuery.refresh(),
          ]);
        } catch (error) {
          setTeacherSaveError(
            error instanceof Error
              ? error.message
              : "Unable to delete teacher.",
          );
        } finally {
          setIsDeletingTeacher(false);
        }
      })();
    });
  };

  const removeClass = () => {
    if (!classForm.id) return;

    confirmDelete("class", () => {
      void (async () => {
        setIsDeletingClass(true);
        setClassSaveError(null);
        try {
          await deleteClassRecord(apiBaseUrl, classForm.id!);
          setClassSaveMessage("Class has been deleted.");
          setClassFormVisible(false);
          setClassForm(EMPTY_CLASS_FORM);
          await Promise.all([classesQuery.refresh(), dashboardQuery.refresh()]);
        } catch (error) {
          setClassSaveError(
            error instanceof Error ? error.message : "Unable to delete class.",
          );
        } finally {
          setIsDeletingClass(false);
        }
      })();
    });
  };

  const removeSubject = () => {
    if (!subjectForm.id) return;

    confirmDelete("subject", () => {
      void (async () => {
        setIsDeletingSubject(true);
        setSubjectSaveError(null);
        try {
          await deleteSubjectRecord(apiBaseUrl, subjectForm.id!);
          setSubjectSaveMessage("Subject has been deleted.");
          setSubjectFormVisible(false);
          setSubjectForm(EMPTY_SUBJECT_FORM);
          await subjectsQuery.refresh();
        } catch (error) {
          setSubjectSaveError(
            error instanceof Error
              ? error.message
              : "Unable to delete subject.",
          );
        } finally {
          setIsDeletingSubject(false);
        }
      })();
    });
  };

  const refreshActiveTab = async () => {
    switch (activeTab) {
      case "home":
        await Promise.all([brandingQuery.refresh(), dashboardQuery.refresh()]);
        break;
      case "attendance":
        await attendanceQuery.refresh();
        break;
      case "students":
        await Promise.all([studentsQuery.refresh(), classesQuery.refresh()]);
        break;
      case "grades":
        await Promise.all([
          gradesQuery.refresh(),
          subjectsQuery.refresh(),
          activeSessionQuery.refresh(),
          studentsQuery.refresh(),
          classesQuery.refresh(),
        ]);
        break;
      case "profile":
        await Promise.all([
          brandingQuery.refresh(),
          teachersQuery.refresh(),
          classesQuery.refresh(),
          subjectsQuery.refresh(),
        ]);
        break;
    }
  };

  const activeSource =
    activeTab === "home"
      ? dashboardQuery.source
      : activeTab === "attendance"
        ? attendanceQuery.source
        : activeTab === "students"
          ? studentsQuery.source
          : activeTab === "grades"
            ? gradesQuery.source
            : brandingQuery.source;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.appFrame}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.kicker}>Native School App</Text>
            <Text style={styles.screenTitle}>
              {branding.mobileAppName || branding.schoolName}
            </Text>
          </View>
          <View style={styles.topBarBadge}>
            <Text style={styles.topBarBadgeText}>{activeSource}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {activeTab === "home" ? (
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              refreshControl={
                <RefreshControl
                  refreshing={dashboardQuery.isRefreshing}
                  onRefresh={refreshActiveTab}
                />
              }
            >
              {dashboardQuery.isLoading && dashboardQuery.source === "empty" ? (
                <LoadingState label="Loading operational snapshot" />
              ) : (
                <>
                  <View style={styles.heroCard}>
                    <View style={styles.heroBadge}>
                      <Text style={styles.heroBadgeText}>
                        {getInitials(branding.shortName || branding.schoolName)}
                      </Text>
                    </View>
                    <View style={styles.heroContent}>
                      <Text style={styles.heroTitle}>
                        {branding.schoolName}
                      </Text>
                      <Text
                        style={[styles.heroSubtitle, styles.heroSubtitleLeft]}
                      >
                        {branding.schoolAddress ||
                          "School profile is syncing from the MIS."}
                      </Text>
                      <Text style={styles.heroMeta}>
                        {branding.supportEmail ||
                          branding.phoneNumber ||
                          "Support contacts not set yet"}
                      </Text>
                    </View>
                  </View>

                  {dashboardQuery.error ? (
                    <InlineNotice text={dashboardQuery.error} />
                  ) : null}

                  <View style={styles.metricGrid}>
                    <MetricCard
                      label="Students"
                      value={dashboardQuery.data.totalStudents}
                    />
                    <MetricCard
                      label="Teachers"
                      value={dashboardQuery.data.totalTeachers}
                    />
                    <MetricCard
                      label="Present Today"
                      value={dashboardQuery.data.presentToday}
                    />
                    <MetricCard
                      label="Attendance Rate"
                      value={`${dashboardQuery.data.attendanceRate}%`}
                    />
                  </View>

                  <View style={styles.surfaceCard}>
                    <Text style={styles.sectionHeading}>
                      Operational signal
                    </Text>
                    <Text style={styles.primaryParagraph}>
                      {dashboardQuery.data.latestNotice}
                    </Text>
                    <View style={styles.inlineStatsRow}>
                      <StatPill
                        label="Absent"
                        value={dashboardQuery.data.absentToday}
                      />
                      <StatPill
                        label="Data source"
                        value={dashboardQuery.source}
                      />
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          ) : null}

          {activeTab === "attendance" ? (
            <FlatList
              style={styles.listArea}
              contentContainerStyle={styles.listContent}
              data={attendanceQuery.data}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={attendanceQuery.isRefreshing}
                  onRefresh={refreshActiveTab}
                />
              }
              ListHeaderComponent={
                <View style={styles.headerBlock}>
                  <Text style={styles.sectionHeading}>Attendance timeline</Text>
                  <View style={styles.surfaceCard}>
                    <Text style={styles.rowTitle}>
                      Mark attendance for today
                    </Text>
                    <Text style={styles.rowSubtitle}>
                      Capture live classroom attendance without leaving the
                      native app.
                    </Text>
                    {attendanceSaveMessage ? (
                      <InlineNotice
                        text={attendanceSaveMessage}
                        tone="success"
                      />
                    ) : null}
                    {attendanceSaveError ? (
                      <InlineNotice text={attendanceSaveError} />
                    ) : null}
                    {attendanceRoster.length === 0 ? (
                      <EmptyState text="No students available yet for attendance capture." />
                    ) : (
                      <View style={styles.attendanceComposerList}>
                        {attendanceRoster.map((student) => {
                          const currentStatus = attendanceDraft[student.id];
                          return (
                            <View
                              key={student.id}
                              style={styles.attendanceComposerRow}
                            >
                              <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>
                                  {student.firstName} {student.lastName}
                                </Text>
                                <Text style={styles.rowSubtitle}>
                                  {student.className || "Unassigned"}
                                  {student.section ? `-${student.section}` : ""}
                                </Text>
                              </View>
                              <View style={styles.attendanceStatusGroup}>
                                {(
                                  [
                                    ["present", "P"],
                                    ["absent", "A"],
                                    ["late", "L"],
                                  ] as const
                                ).map(([status, label]) => (
                                  <Pressable
                                    key={status}
                                    style={[
                                      styles.statusToggle,
                                      currentStatus === status &&
                                        styles.statusToggleActive,
                                    ]}
                                    onPress={() =>
                                      setAttendanceStatus(student.id, status)
                                    }
                                  >
                                    <Text
                                      style={[
                                        styles.statusToggleText,
                                        currentStatus === status &&
                                          styles.statusToggleTextActive,
                                      ]}
                                    >
                                      {label}
                                    </Text>
                                  </Pressable>
                                ))}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}
                    <Pressable
                      style={[
                        styles.primaryAction,
                        (isSavingAttendance || attendanceRoster.length === 0) &&
                          styles.primaryActionDisabled,
                      ]}
                      onPress={() => {
                        void submitAttendance();
                      }}
                      disabled={
                        isSavingAttendance || attendanceRoster.length === 0
                      }
                    >
                      <Text style={styles.primaryActionText}>
                        {isSavingAttendance
                          ? "Saving attendance..."
                          : "Save today's attendance"}
                      </Text>
                    </Pressable>
                  </View>
                  {attendanceQuery.error ? (
                    <InlineNotice text={attendanceQuery.error} />
                  ) : null}
                </View>
              }
              ListEmptyComponent={
                attendanceQuery.isLoading &&
                attendanceQuery.source === "empty" ? (
                  <LoadingState label="Loading attendance timeline" />
                ) : (
                  <EmptyState text="No attendance records available yet." />
                )
              }
              renderItem={({ item }) => (
                <View style={styles.rowCard}>
                  <View style={styles.rowContent}>
                    <Text style={styles.rowTitle}>
                      {item.studentName || "Unknown student"}
                    </Text>
                    <Text style={styles.rowSubtitle}>
                      {item.className || "Unassigned class"} •{" "}
                      {formatDisplayDate(item.date)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === "present"
                        ? styles.statusSuccess
                        : item.status === "absent"
                          ? styles.statusDanger
                          : styles.statusNeutral,
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>{item.status}</Text>
                  </View>
                </View>
              )}
            />
          ) : null}

          {activeTab === "students" ? (
            <FlatList
              style={styles.listArea}
              contentContainerStyle={styles.listContent}
              data={filteredStudents}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={studentsQuery.isRefreshing}
                  onRefresh={refreshActiveTab}
                />
              }
              ListHeaderComponent={
                <View style={styles.headerBlock}>
                  <Text style={styles.sectionHeading}>Student directory</Text>
                  <View style={styles.inlineStatsRow}>
                    <Pressable
                      style={styles.secondaryAction}
                      onPress={beginStudentCreate}
                    >
                      <Text style={styles.secondaryActionText}>
                        New student
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.secondaryAction,
                        studentBulkMode && styles.secondaryActionActive,
                      ]}
                      onPress={toggleBulkStudentMode}
                    >
                      <Text
                        style={[
                          styles.secondaryActionText,
                          studentBulkMode && styles.secondaryActionTextActive,
                        ]}
                      >
                        {studentBulkMode ? "Cancel bulk" : "Bulk assign"}
                      </Text>
                    </Pressable>
                  </View>
                  <TextInput
                    value={studentSearch}
                    onChangeText={setStudentSearch}
                    placeholder="Search by name, admission number, or class"
                    placeholderTextColor="#7c8b85"
                    style={styles.searchInput}
                  />
                  {bulkStudentMessage ? (
                    <InlineNotice text={bulkStudentMessage} tone="success" />
                  ) : null}
                  {bulkStudentError ? (
                    <InlineNotice text={bulkStudentError} />
                  ) : null}
                  {studentBulkMode ? (
                    <View style={styles.surfaceCard}>
                      <Text style={styles.rowTitle}>Bulk assign class</Text>
                      <Text style={styles.rowSubtitle}>
                        Select students below, then choose the destination
                        class.
                      </Text>
                      <View style={styles.inlineStatsRow}>
                        <StatPill
                          label="Selected"
                          value={selectedStudentIds.length}
                        />
                      </View>
                      <View style={styles.classChipRow}>
                        {classesQuery.data.map((cls) => {
                          const classLabel = `${cls.name}${cls.section ? `-${cls.section}` : ""}`;
                          const isSelected = bulkClassId === cls.id;

                          return (
                            <Pressable
                              key={cls.id}
                              style={[
                                styles.classChip,
                                isSelected && styles.classChipSelected,
                              ]}
                              onPress={() => setBulkClassId(cls.id)}
                            >
                              <Text
                                style={[
                                  styles.classChipText,
                                  isSelected && styles.classChipTextSelected,
                                ]}
                              >
                                {classLabel}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                      <Pressable
                        style={[
                          styles.primaryAction,
                          isBulkAssigningStudents &&
                            styles.primaryActionDisabled,
                        ]}
                        onPress={() => {
                          void submitBulkStudentAssignment();
                        }}
                        disabled={isBulkAssigningStudents}
                      >
                        <Text style={styles.primaryActionText}>
                          {isBulkAssigningStudents
                            ? "Assigning students..."
                            : "Assign selected students"}
                        </Text>
                      </Pressable>
                    </View>
                  ) : null}
                  {studentSaveMessage ? (
                    <InlineNotice text={studentSaveMessage} tone="success" />
                  ) : null}
                  {studentSaveError ? (
                    <InlineNotice text={studentSaveError} />
                  ) : null}
                  {studentFormVisible ? (
                    <View style={styles.surfaceCard}>
                      <Text style={styles.rowTitle}>
                        {studentForm.id ? "Edit student" : "Create student"}
                      </Text>
                      <TextInput
                        value={studentForm.firstName}
                        onChangeText={(value) =>
                          setStudentForm((current) => ({
                            ...current,
                            firstName: value,
                          }))
                        }
                        placeholder="First name"
                        placeholderTextColor="#7c8b85"
                        style={styles.searchInput}
                      />
                      <TextInput
                        value={studentForm.lastName}
                        onChangeText={(value) =>
                          setStudentForm((current) => ({
                            ...current,
                            lastName: value,
                          }))
                        }
                        placeholder="Last name"
                        placeholderTextColor="#7c8b85"
                        style={styles.searchInput}
                      />
                      <TextInput
                        value={studentForm.phone}
                        onChangeText={(value) =>
                          setStudentForm((current) => ({
                            ...current,
                            phone: value,
                          }))
                        }
                        placeholder="Phone number"
                        placeholderTextColor="#7c8b85"
                        style={styles.searchInput}
                      />
                      <View style={styles.classChipRow}>
                        {classesQuery.data.map((cls) => {
                          const classLabel = `${cls.name}${cls.section ? `-${cls.section}` : ""}`;
                          const isSelected = studentForm.classId === cls.id;

                          return (
                            <Pressable
                              key={cls.id}
                              style={[
                                styles.classChip,
                                isSelected && styles.classChipSelected,
                              ]}
                              onPress={() =>
                                setStudentForm((current) => ({
                                  ...current,
                                  classId:
                                    current.classId === cls.id ? "" : cls.id,
                                }))
                              }
                            >
                              <Text
                                style={[
                                  styles.classChipText,
                                  isSelected && styles.classChipTextSelected,
                                ]}
                              >
                                {classLabel}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                      <View style={styles.inlineStatsRow}>
                        {studentForm.id ? (
                          <Pressable
                            style={[
                              styles.destructiveAction,
                              isDeletingStudent && styles.primaryActionDisabled,
                            ]}
                            onPress={removeStudent}
                            disabled={isDeletingStudent}
                          >
                            <Text style={styles.destructiveActionText}>
                              {isDeletingStudent
                                ? "Deleting..."
                                : "Delete student"}
                            </Text>
                          </Pressable>
                        ) : null}
                        <Pressable
                          style={styles.secondaryAction}
                          onPress={() => {
                            setStudentFormVisible(false);
                            setStudentForm(EMPTY_STUDENT_FORM);
                          }}
                        >
                          <Text style={styles.secondaryActionText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          style={[
                            styles.primaryActionInline,
                            isSavingStudent && styles.primaryActionDisabled,
                          ]}
                          onPress={() => {
                            void submitStudent();
                          }}
                          disabled={isSavingStudent}
                        >
                          <Text style={styles.primaryActionText}>
                            {isSavingStudent
                              ? "Saving..."
                              : studentForm.id
                                ? "Update student"
                                : "Create student"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : null}
                  {studentsQuery.error ? (
                    <InlineNotice text={studentsQuery.error} />
                  ) : null}
                </View>
              }
              ListEmptyComponent={
                studentsQuery.isLoading && studentsQuery.source === "empty" ? (
                  <LoadingState label="Loading student directory" />
                ) : (
                  <EmptyState text="No students match the current filter." />
                )
              }
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.rowCard,
                    studentBulkMode &&
                      selectedStudentIds.includes(item.id) &&
                      styles.rowCardSelected,
                  ]}
                  onPress={() =>
                    studentBulkMode
                      ? toggleStudentSelection(item.id)
                      : beginStudentEdit(item)
                  }
                >
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarCircleText}>
                      {getInitials(`${item.firstName} ${item.lastName}`)}
                    </Text>
                  </View>
                  <View style={styles.rowContent}>
                    <Text style={styles.rowTitle}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={styles.rowSubtitle}>
                      {item.className || "Unassigned"}
                      {item.section ? `-${item.section}` : ""}
                    </Text>
                  </View>
                  {studentBulkMode ? (
                    <View
                      style={[
                        styles.selectionBadge,
                        selectedStudentIds.includes(item.id) &&
                          styles.selectionBadgeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.selectionBadgeText,
                          selectedStudentIds.includes(item.id) &&
                            styles.selectionBadgeTextActive,
                        ]}
                      >
                        {selectedStudentIds.includes(item.id) ? "Yes" : "Pick"}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.trailingMeta}>
                      {item.admissionNumber || "No ID"}
                    </Text>
                  )}
                </Pressable>
              )}
            />
          ) : null}

          {activeTab === "grades" ? (
            <FlatList
              style={styles.listArea}
              contentContainerStyle={styles.listContent}
              data={gradesQuery.data}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={gradesQuery.isRefreshing}
                  onRefresh={refreshActiveTab}
                />
              }
              ListHeaderComponent={
                <View style={styles.headerBlock}>
                  <Text style={styles.sectionHeading}>Assessment overview</Text>
                  <View style={styles.inlineStatsRow}>
                    <Pressable
                      style={styles.secondaryAction}
                      onPress={beginGradeCreate}
                    >
                      <Text style={styles.secondaryActionText}>New grade</Text>
                    </Pressable>
                    {activeSessionQuery.data ? (
                      <StatPill
                        label="Active session"
                        value={
                          activeSessionQuery.data.name ||
                          activeSessionQuery.data.academicYear ||
                          "Ready"
                        }
                      />
                    ) : null}
                  </View>
                  {gradeSaveMessage ? (
                    <InlineNotice text={gradeSaveMessage} tone="success" />
                  ) : null}
                  {gradeSaveError ? (
                    <InlineNotice text={gradeSaveError} />
                  ) : null}
                  {gradeFormVisible ? (
                    <View style={styles.surfaceCard}>
                      <Text style={styles.rowTitle}>
                        {gradeForm.id ? "Edit grade" : "Record grade"}
                      </Text>
                      <TextInput
                        value={gradeStudentSearch}
                        onChangeText={setGradeStudentSearch}
                        placeholder="Search student"
                        placeholderTextColor="#7c8b85"
                        style={styles.searchInput}
                      />
                      <View style={styles.classChipRow}>
                        {filteredGradeStudents.map((student) => {
                          const isSelected = gradeForm.studentId === student.id;
                          return (
                            <Pressable
                              key={student.id}
                              style={[
                                styles.classChip,
                                isSelected && styles.classChipSelected,
                              ]}
                              onPress={() =>
                                setGradeForm((current) => ({
                                  ...current,
                                  studentId: student.id,
                                  classId: student.classId || current.classId,
                                }))
                              }
                            >
                              <Text
                                style={[
                                  styles.classChipText,
                                  isSelected && styles.classChipTextSelected,
                                ]}
                              >
                                {student.firstName} {student.lastName}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                      <View style={styles.classChipRow}>
                        {classesQuery.data.map((cls) => {
                          const label = `${cls.name}${cls.section ? `-${cls.section}` : ""}`;
                          const isSelected = gradeForm.classId === cls.id;
                          return (
                            <Pressable
                              key={cls.id}
                              style={[
                                styles.classChip,
                                isSelected && styles.classChipSelected,
                              ]}
                              onPress={() =>
                                setGradeForm((current) => ({
                                  ...current,
                                  classId: cls.id,
                                }))
                              }
                            >
                              <Text
                                style={[
                                  styles.classChipText,
                                  isSelected && styles.classChipTextSelected,
                                ]}
                              >
                                {label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                      <View style={styles.classChipRow}>
                        {subjectsQuery.data.map((subject) => {
                          const isSelected = gradeForm.subjectId === subject.id;
                          return (
                            <Pressable
                              key={subject.id}
                              style={[
                                styles.classChip,
                                isSelected && styles.classChipSelected,
                              ]}
                              onPress={() =>
                                setGradeForm((current) => ({
                                  ...current,
                                  subjectId: subject.id,
                                }))
                              }
                            >
                              <Text
                                style={[
                                  styles.classChipText,
                                  isSelected && styles.classChipTextSelected,
                                ]}
                              >
                                {subject.name}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                      <View style={styles.classChipRow}>
                        {GRADE_EXAM_TYPES.map((examType) => {
                          const isSelected = gradeForm.examType === examType;
                          return (
                            <Pressable
                              key={examType}
                              style={[
                                styles.classChip,
                                isSelected && styles.classChipSelected,
                              ]}
                              onPress={() =>
                                setGradeForm((current) => ({
                                  ...current,
                                  examType,
                                }))
                              }
                            >
                              <Text
                                style={[
                                  styles.classChipText,
                                  isSelected && styles.classChipTextSelected,
                                ]}
                              >
                                {examType}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                      <View style={styles.inlineInputRow}>
                        <TextInput
                          value={gradeForm.obtainedMarks}
                          onChangeText={(value) =>
                            setGradeForm((current) => ({
                              ...current,
                              obtainedMarks: value,
                            }))
                          }
                          keyboardType="numeric"
                          placeholder="Score"
                          placeholderTextColor="#7c8b85"
                          style={[styles.searchInput, styles.halfInput]}
                        />
                        <TextInput
                          value={gradeForm.maxMarks}
                          onChangeText={(value) =>
                            setGradeForm((current) => ({
                              ...current,
                              maxMarks: value,
                            }))
                          }
                          keyboardType="numeric"
                          placeholder="Max marks"
                          placeholderTextColor="#7c8b85"
                          style={[styles.searchInput, styles.halfInput]}
                        />
                      </View>
                      <TextInput
                        value={gradeForm.grade}
                        onChangeText={(value) =>
                          setGradeForm((current) => ({
                            ...current,
                            grade: value,
                          }))
                        }
                        placeholder="Grade override (optional)"
                        placeholderTextColor="#7c8b85"
                        style={styles.searchInput}
                      />
                      <View style={styles.inlineStatsRow}>
                        {gradeForm.id ? (
                          <Pressable
                            style={[
                              styles.destructiveAction,
                              isDeletingGrade && styles.primaryActionDisabled,
                            ]}
                            onPress={removeGrade}
                            disabled={isDeletingGrade}
                          >
                            <Text style={styles.destructiveActionText}>
                              {isDeletingGrade ? "Deleting..." : "Delete grade"}
                            </Text>
                          </Pressable>
                        ) : null}
                        <Pressable
                          style={styles.secondaryAction}
                          onPress={() => {
                            setGradeFormVisible(false);
                            setGradeForm(EMPTY_GRADE_FORM);
                            setGradeStudentSearch("");
                          }}
                        >
                          <Text style={styles.secondaryActionText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          style={[
                            styles.primaryActionInline,
                            isSavingGrade && styles.primaryActionDisabled,
                          ]}
                          onPress={() => {
                            void submitGrade();
                          }}
                          disabled={isSavingGrade}
                        >
                          <Text style={styles.primaryActionText}>
                            {isSavingGrade
                              ? "Saving..."
                              : gradeForm.id
                                ? "Update grade"
                                : "Save grade"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : null}
                  {gradesQuery.error ? (
                    <InlineNotice text={gradesQuery.error} />
                  ) : null}
                </View>
              }
              ListEmptyComponent={
                gradesQuery.isLoading && gradesQuery.source === "empty" ? (
                  <LoadingState label="Loading grade insights" />
                ) : (
                  <EmptyState text="No grade records are available yet." />
                )
              }
              renderItem={({ item }) => (
                <Pressable
                  style={styles.surfaceCard}
                  onPress={() => beginGradeEdit(item)}
                >
                  <Text style={styles.rowTitle}>{item.subject}</Text>
                  <Text style={styles.rowSubtitle}>
                    {item.studentName} • {item.className} • {item.examType}
                  </Text>
                  <View style={styles.inlineStatsRow}>
                    <StatPill
                      label="Score"
                      value={`${item.score}/${item.maxScore}`}
                    />
                    <StatPill label="Grade" value={item.grade} />
                    <StatPill
                      label="Date"
                      value={formatDisplayDate(item.date)}
                    />
                  </View>
                </Pressable>
              )}
            />
          ) : null}

          {activeTab === "profile" ? (
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              refreshControl={
                <RefreshControl
                  refreshing={brandingQuery.isRefreshing}
                  onRefresh={refreshActiveTab}
                />
              }
            >
              <View style={styles.heroCardCompact}>
                <View style={styles.avatarCircleLarge}>
                  <Text style={styles.avatarCircleLargeText}>
                    {getInitials(branding.shortName || branding.schoolName)}
                  </Text>
                </View>
                <Text style={styles.heroTitle}>
                  {branding.mobileAppName || branding.schoolName}
                </Text>
                <Text style={styles.heroSubtitle}>
                  {branding.supportEmail || "Support email not configured"}
                </Text>
              </View>

              {brandingQuery.error ? (
                <InlineNotice text={brandingQuery.error} />
              ) : null}

              <View style={styles.surfaceCard}>
                <Text style={styles.sectionHeading}>School identity</Text>
                <ProfileRow label="School name" value={branding.schoolName} />
                <ProfileRow label="Short name" value={branding.shortName} />
                <ProfileRow
                  label="Address"
                  value={branding.schoolAddress || "Not set"}
                />
                <ProfileRow
                  label="Phone"
                  value={branding.phoneNumber || "Not set"}
                />
                <ProfileRow
                  label="Website"
                  value={branding.websiteUrl || "Not set"}
                />
              </View>

              <View style={styles.surfaceCard}>
                <Text style={styles.sectionHeading}>Teacher directory</Text>
                <View style={styles.inlineStatsRow}>
                  <Pressable
                    style={styles.secondaryAction}
                    onPress={beginTeacherCreate}
                  >
                    <Text style={styles.secondaryActionText}>New teacher</Text>
                  </Pressable>
                  <StatPill
                    label="Teachers"
                    value={teachersQuery.data.length}
                  />
                </View>
                <TextInput
                  value={teacherSearch}
                  onChangeText={setTeacherSearch}
                  placeholder="Search by name, email, or subject"
                  placeholderTextColor="#7c8b85"
                  style={styles.searchInput}
                />
                {teacherSaveMessage ? (
                  <InlineNotice text={teacherSaveMessage} tone="success" />
                ) : null}
                {teacherSaveError ? (
                  <InlineNotice text={teacherSaveError} />
                ) : null}
                {teachersQuery.error ? (
                  <InlineNotice text={teachersQuery.error} />
                ) : null}
                {teacherFormVisible ? (
                  <View style={styles.surfaceCardNested}>
                    <Text style={styles.rowTitle}>
                      {teacherForm.id ? "Edit teacher" : "Create teacher"}
                    </Text>
                    <TextInput
                      value={teacherForm.firstName}
                      onChangeText={(value) =>
                        setTeacherForm((current) => ({
                          ...current,
                          firstName: value,
                        }))
                      }
                      placeholder="First name"
                      placeholderTextColor="#7c8b85"
                      style={styles.searchInput}
                    />
                    <TextInput
                      value={teacherForm.lastName}
                      onChangeText={(value) =>
                        setTeacherForm((current) => ({
                          ...current,
                          lastName: value,
                        }))
                      }
                      placeholder="Last name"
                      placeholderTextColor="#7c8b85"
                      style={styles.searchInput}
                    />
                    <TextInput
                      value={teacherForm.email}
                      onChangeText={(value) =>
                        setTeacherForm((current) => ({
                          ...current,
                          email: value,
                        }))
                      }
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholder="Email address"
                      placeholderTextColor="#7c8b85"
                      style={styles.searchInput}
                    />
                    <TextInput
                      value={teacherForm.phone}
                      onChangeText={(value) =>
                        setTeacherForm((current) => ({
                          ...current,
                          phone: value,
                        }))
                      }
                      placeholder="Phone number"
                      placeholderTextColor="#7c8b85"
                      style={styles.searchInput}
                    />
                    <TextInput
                      value={teacherForm.subject}
                      onChangeText={(value) =>
                        setTeacherForm((current) => ({
                          ...current,
                          subject: value,
                        }))
                      }
                      placeholder="Subject specialization"
                      placeholderTextColor="#7c8b85"
                      style={styles.searchInput}
                    />
                    <TextInput
                      value={teacherForm.qualification}
                      onChangeText={(value) =>
                        setTeacherForm((current) => ({
                          ...current,
                          qualification: value,
                        }))
                      }
                      placeholder="Qualification"
                      placeholderTextColor="#7c8b85"
                      style={styles.searchInput}
                    />
                    <View style={styles.inlineStatsRow}>
                      {teacherForm.id ? (
                        <Pressable
                          style={[
                            styles.destructiveAction,
                            isDeletingTeacher && styles.primaryActionDisabled,
                          ]}
                          onPress={removeTeacher}
                          disabled={isDeletingTeacher}
                        >
                          <Text style={styles.destructiveActionText}>
                            {isDeletingTeacher
                              ? "Deleting..."
                              : "Delete teacher"}
                          </Text>
                        </Pressable>
                      ) : null}
                      <Pressable
                        style={styles.secondaryAction}
                        onPress={() => {
                          setTeacherFormVisible(false);
                          setTeacherForm(EMPTY_TEACHER_FORM);
                        }}
                      >
                        <Text style={styles.secondaryActionText}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.primaryActionInline,
                          isSavingTeacher && styles.primaryActionDisabled,
                        ]}
                        onPress={() => {
                          void submitTeacher();
                        }}
                        disabled={isSavingTeacher}
                      >
                        <Text style={styles.primaryActionText}>
                          {isSavingTeacher
                            ? "Saving..."
                            : teacherForm.id
                              ? "Update teacher"
                              : "Create teacher"}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}
                {teachersQuery.isLoading && teachersQuery.source === "empty" ? (
                  <LoadingState label="Loading teachers" />
                ) : filteredTeachers.length === 0 ? (
                  <EmptyState text="No teachers match the current filter." />
                ) : (
                  <View style={styles.profileList}>
                    {filteredTeachers.slice(0, 10).map((teacher) => (
                      <Pressable
                        key={teacher.id}
                        style={styles.rowCard}
                        onPress={() => beginTeacherEdit(teacher)}
                      >
                        <View style={styles.avatarCircle}>
                          <Text style={styles.avatarCircleText}>
                            {getInitials(
                              `${teacher.firstName} ${teacher.lastName}`,
                            )}
                          </Text>
                        </View>
                        <View style={styles.rowContent}>
                          <Text style={styles.rowTitle}>
                            {teacher.firstName} {teacher.lastName}
                          </Text>
                          <Text style={styles.rowSubtitle}>
                            {teacher.subjectSpecialization || "Subject not set"}
                          </Text>
                        </View>
                        <Text style={styles.trailingMeta}>
                          {teacher.employeeId || "Teacher"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.surfaceCard}>
                <Text style={styles.sectionHeading}>Academic setup</Text>
                <View style={styles.inlineStatsRow}>
                  <Pressable
                    style={styles.secondaryAction}
                    onPress={beginClassCreate}
                  >
                    <Text style={styles.secondaryActionText}>New class</Text>
                  </Pressable>
                  <Pressable
                    style={styles.secondaryAction}
                    onPress={beginSubjectCreate}
                  >
                    <Text style={styles.secondaryActionText}>New subject</Text>
                  </Pressable>
                </View>
                <TextInput
                  value={classSearch}
                  onChangeText={setClassSearch}
                  placeholder="Search classes"
                  placeholderTextColor="#7c8b85"
                  style={styles.searchInput}
                />
                {classSaveMessage ? (
                  <InlineNotice text={classSaveMessage} tone="success" />
                ) : null}
                {classSaveError ? <InlineNotice text={classSaveError} /> : null}
                {classFormVisible ? (
                  <View style={styles.surfaceCardNested}>
                    <Text style={styles.rowTitle}>
                      {classForm.id ? "Edit class" : "Create class"}
                    </Text>
                    <TextInput
                      value={classForm.name}
                      onChangeText={(value) =>
                        setClassForm((current) => ({ ...current, name: value }))
                      }
                      placeholder="Class name"
                      placeholderTextColor="#7c8b85"
                      style={styles.searchInput}
                    />
                    <View style={styles.inlineInputRow}>
                      <TextInput
                        value={classForm.section}
                        onChangeText={(value) =>
                          setClassForm((current) => ({
                            ...current,
                            section: value,
                          }))
                        }
                        placeholder="Section"
                        placeholderTextColor="#7c8b85"
                        style={[styles.searchInput, styles.halfInput]}
                      />
                      <TextInput
                        value={classForm.capacity}
                        onChangeText={(value) =>
                          setClassForm((current) => ({
                            ...current,
                            capacity: value,
                          }))
                        }
                        keyboardType="numeric"
                        placeholder="Capacity"
                        placeholderTextColor="#7c8b85"
                        style={[styles.searchInput, styles.halfInput]}
                      />
                    </View>
                    <View style={styles.inlineStatsRow}>
                      {classForm.id ? (
                        <Pressable
                          style={[
                            styles.destructiveAction,
                            isDeletingClass && styles.primaryActionDisabled,
                          ]}
                          onPress={removeClass}
                          disabled={isDeletingClass}
                        >
                          <Text style={styles.destructiveActionText}>
                            {isDeletingClass ? "Deleting..." : "Delete class"}
                          </Text>
                        </Pressable>
                      ) : null}
                      <Pressable
                        style={styles.secondaryAction}
                        onPress={() => {
                          setClassFormVisible(false);
                          setClassForm(EMPTY_CLASS_FORM);
                        }}
                      >
                        <Text style={styles.secondaryActionText}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.primaryActionInline,
                          isSavingClass && styles.primaryActionDisabled,
                        ]}
                        onPress={() => {
                          void submitClass();
                        }}
                        disabled={isSavingClass}
                      >
                        <Text style={styles.primaryActionText}>
                          {isSavingClass
                            ? "Saving..."
                            : classForm.id
                              ? "Update class"
                              : "Create class"}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}
                {classesQuery.error ? (
                  <InlineNotice text={classesQuery.error} />
                ) : null}
                {classesQuery.isLoading && classesQuery.source === "empty" ? (
                  <LoadingState label="Loading classes" />
                ) : filteredClasses.length === 0 ? (
                  <EmptyState text="No classes match the current filter." />
                ) : (
                  <View style={styles.profileList}>
                    {filteredClasses.slice(0, 8).map((cls) => (
                      <Pressable
                        key={cls.id}
                        style={styles.rowCard}
                        onPress={() => beginClassEdit(cls)}
                      >
                        <View style={styles.avatarCircle}>
                          <Text style={styles.avatarCircleText}>
                            {getInitials(`${cls.name} ${cls.section || ""}`)}
                          </Text>
                        </View>
                        <View style={styles.rowContent}>
                          <Text style={styles.rowTitle}>
                            {cls.name}
                            {cls.section ? `-${cls.section}` : ""}
                          </Text>
                          <Text style={styles.rowSubtitle}>
                            {`${cls.students ?? 0} students • capacity ${cls.capacity ?? 40}`}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                )}

                <TextInput
                  value={subjectSearch}
                  onChangeText={setSubjectSearch}
                  placeholder="Search subjects"
                  placeholderTextColor="#7c8b85"
                  style={styles.searchInput}
                />
                {subjectSaveMessage ? (
                  <InlineNotice text={subjectSaveMessage} tone="success" />
                ) : null}
                {subjectSaveError ? (
                  <InlineNotice text={subjectSaveError} />
                ) : null}
                {subjectFormVisible ? (
                  <View style={styles.surfaceCardNested}>
                    <Text style={styles.rowTitle}>
                      {subjectForm.id ? "Edit subject" : "Create subject"}
                    </Text>
                    <TextInput
                      value={subjectForm.name}
                      onChangeText={(value) =>
                        setSubjectForm((current) => ({
                          ...current,
                          name: value,
                        }))
                      }
                      placeholder="Subject name"
                      placeholderTextColor="#7c8b85"
                      style={styles.searchInput}
                    />
                    <TextInput
                      value={subjectForm.code}
                      onChangeText={(value) =>
                        setSubjectForm((current) => ({
                          ...current,
                          code: value,
                        }))
                      }
                      placeholder="Subject code"
                      placeholderTextColor="#7c8b85"
                      style={styles.searchInput}
                    />
                    <View style={styles.classChipRow}>
                      {classesQuery.data.map((cls) => {
                        const label = `${cls.name}${cls.section ? `-${cls.section}` : ""}`;
                        const isSelected = subjectForm.classId === cls.id;
                        return (
                          <Pressable
                            key={cls.id}
                            style={[
                              styles.classChip,
                              isSelected && styles.classChipSelected,
                            ]}
                            onPress={() =>
                              setSubjectForm((current) => ({
                                ...current,
                                classId:
                                  current.classId === cls.id ? "" : cls.id,
                              }))
                            }
                          >
                            <Text
                              style={[
                                styles.classChipText,
                                isSelected && styles.classChipTextSelected,
                              ]}
                            >
                              {label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                    <View style={styles.classChipRow}>
                      {teachersQuery.data.map((teacher) => {
                        const isSelected = subjectForm.teacherId === teacher.id;
                        return (
                          <Pressable
                            key={teacher.id}
                            style={[
                              styles.classChip,
                              isSelected && styles.classChipSelected,
                            ]}
                            onPress={() =>
                              setSubjectForm((current) => ({
                                ...current,
                                teacherId:
                                  current.teacherId === teacher.id
                                    ? ""
                                    : teacher.id,
                              }))
                            }
                          >
                            <Text
                              style={[
                                styles.classChipText,
                                isSelected && styles.classChipTextSelected,
                              ]}
                            >
                              {teacher.firstName} {teacher.lastName}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                    <View style={styles.inlineStatsRow}>
                      {subjectForm.id ? (
                        <Pressable
                          style={[
                            styles.destructiveAction,
                            isDeletingSubject && styles.primaryActionDisabled,
                          ]}
                          onPress={removeSubject}
                          disabled={isDeletingSubject}
                        >
                          <Text style={styles.destructiveActionText}>
                            {isDeletingSubject
                              ? "Deleting..."
                              : "Delete subject"}
                          </Text>
                        </Pressable>
                      ) : null}
                      <Pressable
                        style={styles.secondaryAction}
                        onPress={() => {
                          setSubjectFormVisible(false);
                          setSubjectForm(EMPTY_SUBJECT_FORM);
                        }}
                      >
                        <Text style={styles.secondaryActionText}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.primaryActionInline,
                          isSavingSubject && styles.primaryActionDisabled,
                        ]}
                        onPress={() => {
                          void submitSubject();
                        }}
                        disabled={isSavingSubject}
                      >
                        <Text style={styles.primaryActionText}>
                          {isSavingSubject
                            ? "Saving..."
                            : subjectForm.id
                              ? "Update subject"
                              : "Create subject"}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}
                {subjectsQuery.error ? (
                  <InlineNotice text={subjectsQuery.error} />
                ) : null}
                {subjectsQuery.isLoading && subjectsQuery.source === "empty" ? (
                  <LoadingState label="Loading subjects" />
                ) : filteredSubjects.length === 0 ? (
                  <EmptyState text="No subjects match the current filter." />
                ) : (
                  <View style={styles.profileList}>
                    {filteredSubjects.slice(0, 10).map((subject) => {
                      const subjectClass = classesQuery.data.find(
                        (cls) => cls.id === subject.classId,
                      );
                      return (
                        <Pressable
                          key={subject.id}
                          style={styles.rowCard}
                          onPress={() => beginSubjectEdit(subject)}
                        >
                          <View style={styles.avatarCircle}>
                            <Text style={styles.avatarCircleText}>
                              {getInitials(subject.name)}
                            </Text>
                          </View>
                          <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>{subject.name}</Text>
                            <Text style={styles.rowSubtitle}>
                              {subject.code || "No code"}
                              {subjectClass
                                ? ` • ${subjectClass.name}${subjectClass.section ? `-${subjectClass.section}` : ""}`
                                : ""}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>

              <Pressable
                style={styles.primaryAction}
                onPress={() => {
                  void Linking.openURL(webUrl).catch(() => {});
                }}
              >
                <Text style={styles.primaryActionText}>
                  Open full web workspace
                </Text>
              </Pressable>
            </ScrollView>
          ) : null}
        </View>

        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[styles.tabIcon, isActive && styles.tabTextActive]}
                >
                  {tab.icon}
                </Text>
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3efe6" },
  appFrame: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: "#f8f4eb",
    borderBottomWidth: 1,
    borderBottomColor: "#d8d1c3",
  },
  kicker: {
    color: "#7a6e56",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  screenTitle: {
    color: "#18221f",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 3,
  },
  topBarBadge: {
    backgroundColor: "#e8dfcf",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  topBarBadgeText: {
    color: "#5d533f",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  content: { flex: 1 },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 18, gap: 16 },
  listArea: { flex: 1 },
  listContent: { padding: 18, paddingBottom: 28, gap: 12 },
  heroCard: {
    backgroundColor: "#102a43",
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    gap: 14,
  },
  heroCardCompact: {
    backgroundColor: "#102a43",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    gap: 10,
  },
  heroBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBadgeText: { color: "#102a43", fontSize: 22, fontWeight: "900" },
  heroContent: { flex: 1 },
  heroTitle: { color: "#f7fafc", fontSize: 22, fontWeight: "800" },
  heroSubtitle: {
    color: "#d7e6f5",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
    textAlign: "center",
  },
  heroSubtitleLeft: { textAlign: "left" },
  heroMeta: { color: "#9bb7d3", fontSize: 13, marginTop: 8 },
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metricCard: {
    width: "47%",
    backgroundColor: "#fffaf1",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eadfcd",
  },
  metricValue: { color: "#14211d", fontSize: 24, fontWeight: "800" },
  metricLabel: { color: "#766c58", fontSize: 13, marginTop: 6 },
  surfaceCard: {
    backgroundColor: "#fffaf1",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eadfcd",
    gap: 10,
  },
  surfaceCardNested: {
    backgroundColor: "#f7f0e2",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e3d5bc",
    gap: 10,
  },
  sectionHeading: { color: "#1a2420", fontSize: 18, fontWeight: "800" },
  primaryParagraph: { color: "#4c5a55", fontSize: 15, lineHeight: 22 },
  inlineStatsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statPill: {
    backgroundColor: "#efe5d4",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statPillLabel: {
    color: "#7b6e59",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statPillValue: {
    color: "#1c2723",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },
  headerBlock: { gap: 12, marginBottom: 4 },
  notice: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff1c9",
  },
  noticeText: { color: "#5f4f20", fontSize: 13, lineHeight: 18 },
  noticeSuccess: { backgroundColor: "#d9f6e1" },
  noticeSuccessText: { color: "#155e39" },
  rowCard: {
    backgroundColor: "#fffaf1",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eadfcd",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowCardSelected: {
    borderColor: "#0f766e",
    backgroundColor: "#eef8f6",
  },
  rowContent: { flex: 1 },
  rowTitle: { color: "#1a2420", fontSize: 16, fontWeight: "700" },
  rowSubtitle: { color: "#766c58", fontSize: 13, marginTop: 4 },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  statusSuccess: { backgroundColor: "#d4f5df" },
  statusDanger: { backgroundColor: "#ffe0dd" },
  statusNeutral: { backgroundColor: "#ece5da" },
  statusBadgeText: {
    color: "#24302c",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#0f766e",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircleText: { color: "#ffffff", fontSize: 14, fontWeight: "800" },
  avatarCircleLarge: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircleLargeText: { color: "#102a43", fontSize: 24, fontWeight: "900" },
  trailingMeta: { color: "#5d533f", fontSize: 12, fontWeight: "700" },
  selectionBadge: {
    borderRadius: 999,
    backgroundColor: "#efe5d4",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectionBadgeActive: {
    backgroundColor: "#0f766e",
  },
  selectionBadgeText: {
    color: "#5d533f",
    fontSize: 12,
    fontWeight: "700",
  },
  selectionBadgeTextActive: {
    color: "#ffffff",
  },
  searchInput: {
    backgroundColor: "#fffaf1",
    borderWidth: 1,
    borderColor: "#d9cfbe",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#17211d",
    fontSize: 14,
  },
  profileRow: { gap: 4, paddingVertical: 4 },
  profileList: { gap: 10 },
  profileLabel: {
    color: "#7a6e56",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  profileValue: { color: "#1a2420", fontSize: 15, lineHeight: 21 },
  primaryAction: {
    backgroundColor: "#0f766e",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryActionInline: {
    backgroundColor: "#0f766e",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 13,
    alignItems: "center",
  },
  primaryActionDisabled: {
    opacity: 0.55,
  },
  primaryActionText: { color: "#ffffff", fontSize: 15, fontWeight: "800" },
  secondaryAction: {
    backgroundColor: "#efe5d4",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    alignItems: "center",
  },
  secondaryActionActive: {
    backgroundColor: "#0f766e",
  },
  secondaryActionText: {
    color: "#403726",
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryActionTextActive: {
    color: "#ffffff",
  },
  destructiveAction: {
    backgroundColor: "#f8d7d3",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    alignItems: "center",
  },
  destructiveActionText: {
    color: "#8f2016",
    fontSize: 14,
    fontWeight: "700",
  },
  classChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  classChip: {
    backgroundColor: "#efe5d4",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  classChipSelected: {
    backgroundColor: "#0f766e",
  },
  classChipText: {
    color: "#4d4330",
    fontSize: 13,
    fontWeight: "700",
  },
  classChipTextSelected: {
    color: "#ffffff",
  },
  inlineInputRow: {
    flexDirection: "row",
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  attendanceComposerList: {
    gap: 10,
  },
  attendanceComposerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  attendanceStatusGroup: {
    flexDirection: "row",
    gap: 8,
  },
  statusToggle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#efe5d4",
    alignItems: "center",
    justifyContent: "center",
  },
  statusToggleActive: {
    backgroundColor: "#0f766e",
  },
  statusToggleText: {
    color: "#5d533f",
    fontSize: 13,
    fontWeight: "800",
  },
  statusToggleTextActive: {
    color: "#ffffff",
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  centerStateCompact: { paddingVertical: 32, alignItems: "center" },
  centerStateText: { color: "#6f6758", fontSize: 14, textAlign: "center" },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fffaf1",
    borderTopWidth: 1,
    borderTopColor: "#d8d1c3",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 14,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 10,
    gap: 4,
  },
  tabButtonActive: { backgroundColor: "#e8dfcf" },
  tabIcon: { color: "#8c816b", fontSize: 16, fontWeight: "800" },
  tabText: { color: "#8c816b", fontSize: 12, fontWeight: "700" },
  tabTextActive: { color: "#17211d" },
});
