export type StudentRecord = {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber?: string;
  phone?: string;
  classId?: string;
  className?: string;
  section?: string;
};

export type ClassRecord = {
  id: string;
  name: string;
  section?: string;
  capacity?: number;
  students?: number;
  classTeacher?: string | null;
};

export type SubjectRecord = {
  id: string;
  name: string;
  code?: string;
  classId?: string;
  teacherId?: string;
  isActive?: boolean;
};

export type SessionRecord = {
  id: string;
  name?: string;
  academicYear?: string;
};

export type TeacherRecord = {
  id: string;
  employeeId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  subjectSpecialization?: string;
  qualification?: string;
  status?: boolean;
};

export type GradeRecord = {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subject: string;
  examType: string;
  classId: string;
  className: string;
  score: number;
  maxScore: number;
  grade: string;
  date: string;
};

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type AttendanceDraft = Record<string, AttendanceStatus | undefined>;

export function buildApiBaseUrl(webUrl: string): string {
  try {
    return new URL("/api", webUrl).toString().replace(/\/$/, "");
  } catch {
    return `${webUrl.replace(/\/$/, "")}/api`;
  }
}

export function getInitials(value: string): string {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "SM"
  );
}

export function formatDisplayDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getAttendanceRate(records: Array<{ status: string }>): number {
  if (records.length === 0) return 0;
  const present = records.filter(
    (record) => record.status === "present",
  ).length;
  return Math.round((present / records.length) * 100);
}

export function filterStudents(
  students: StudentRecord[],
  query: string,
): StudentRecord[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return students;

  return students.filter((student) => {
    const haystack = [
      student.firstName,
      student.lastName,
      student.admissionNumber,
      student.className,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function buildAttendanceSavePayload(
  students: StudentRecord[],
  draft: AttendanceDraft,
  date: string,
) {
  return {
    date,
    records: students
      .filter((student) => draft[student.id])
      .map((student) => ({
        studentId: student.id,
        classId: student.classId,
        status: draft[student.id] as AttendanceStatus,
      })),
  };
}

export async function saveAttendanceSubmission(
  apiBaseUrl: string,
  payload: ReturnType<typeof buildAttendanceSavePayload>,
): Promise<{ success: boolean; saved: number }> {
  const response = await fetch(`${apiBaseUrl}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    saved?: number;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(
      body.error || `Attendance save failed (${response.status})`,
    );
  }

  return {
    success: body.success ?? true,
    saved: body.saved ?? payload.records.length,
  };
}

export type StudentUpsertInput = {
  id?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  classId?: string;
};

export type BulkStudentClassAssignmentInput = {
  studentIds: string[];
  classId: string;
};

export async function saveStudentRecord(
  apiBaseUrl: string,
  payload: StudentUpsertInput,
): Promise<StudentRecord> {
  const response = await fetch(
    payload.id
      ? `${apiBaseUrl}/students/${payload.id}`
      : `${apiBaseUrl}/students`,
    {
      method: payload.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone || null,
        classId: payload.classId || null,
      }),
    },
  );

  const body = (await response.json().catch(() => ({}))) as {
    error?: string;
  } & StudentRecord;

  if (!response.ok) {
    throw new Error(body.error || `Student save failed (${response.status})`);
  }

  return body;
}

export async function assignStudentsToClass(
  apiBaseUrl: string,
  payload: BulkStudentClassAssignmentInput,
): Promise<{ success: boolean; assigned: number }> {
  const response = await fetch(`${apiBaseUrl}/students/bulk/assign-class`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    assigned?: number;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(
      body.error || `Bulk class assignment failed (${response.status})`,
    );
  }

  return {
    success: body.success ?? true,
    assigned: body.assigned ?? payload.studentIds.length,
  };
}

export type GradeUpsertInput = {
  id?: string;
  studentId: string;
  classId: string;
  sessionId?: string;
  examType: string;
  subjectId: string;
  maxMarks: number;
  obtainedMarks: number;
  grade?: string;
};

export async function saveGradeRecord(
  apiBaseUrl: string,
  payload: GradeUpsertInput,
): Promise<{ success?: boolean; grade: GradeRecord }> {
  const response = await fetch(
    payload.id ? `${apiBaseUrl}/grades/${payload.id}` : `${apiBaseUrl}/grades`,
    {
      method: payload.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: payload.studentId,
        classId: payload.classId,
        sessionId: payload.sessionId,
        examType: payload.examType,
        subjectId: payload.subjectId,
        maxMarks: payload.maxMarks,
        obtainedMarks: payload.obtainedMarks,
        grade: payload.grade || undefined,
      }),
    },
  );

  const body = (await response.json().catch(() => ({}))) as {
    error?: string;
    success?: boolean;
    grade: GradeRecord;
  };

  if (!response.ok) {
    throw new Error(body.error || `Grade save failed (${response.status})`);
  }

  return body;
}

export type TeacherUpsertInput = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject?: string;
  qualification?: string;
  status?: boolean;
};

export async function saveTeacherRecord(
  apiBaseUrl: string,
  payload: TeacherUpsertInput,
): Promise<TeacherRecord> {
  const response = await fetch(
    payload.id
      ? `${apiBaseUrl}/teachers/${payload.id}`
      : `${apiBaseUrl}/teachers`,
    {
      method: payload.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone || null,
        subject: payload.subject || null,
        qualification: payload.qualification || null,
        status: payload.status ?? true,
      }),
    },
  );

  const body = (await response.json().catch(() => ({}))) as {
    error?: string;
  } & TeacherRecord;

  if (!response.ok) {
    throw new Error(body.error || `Teacher save failed (${response.status})`);
  }

  return body;
}

export type ClassUpsertInput = {
  id?: string;
  name: string;
  section?: string;
  capacity?: number;
};

export async function saveClassRecord(
  apiBaseUrl: string,
  payload: ClassUpsertInput,
): Promise<ClassRecord> {
  const response = await fetch(
    payload.id
      ? `${apiBaseUrl}/classes/${payload.id}`
      : `${apiBaseUrl}/classes`,
    {
      method: payload.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        section: payload.section || null,
        capacity: payload.capacity,
      }),
    },
  );

  const body = (await response.json().catch(() => ({}))) as {
    error?: string;
  } & ClassRecord;

  if (!response.ok) {
    throw new Error(body.error || `Class save failed (${response.status})`);
  }

  return body;
}

export type SubjectUpsertInput = {
  id?: string;
  name: string;
  code?: string;
  classId?: string;
  teacherId?: string;
  isActive?: boolean;
};

export async function saveSubjectRecord(
  apiBaseUrl: string,
  payload: SubjectUpsertInput,
): Promise<SubjectRecord> {
  const response = await fetch(
    payload.id
      ? `${apiBaseUrl}/subjects/${payload.id}`
      : `${apiBaseUrl}/subjects`,
    {
      method: payload.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        code: payload.code || null,
        classId: payload.classId || null,
        teacherId: payload.teacherId || null,
        isActive: payload.isActive ?? true,
      }),
    },
  );

  const body = (await response.json().catch(() => ({}))) as {
    error?: string;
  } & SubjectRecord;

  if (!response.ok) {
    throw new Error(body.error || `Subject save failed (${response.status})`);
  }

  return body;
}

async function deleteRecord(apiBaseUrl: string, path: string, label: string) {
  const response = await fetch(`${apiBaseUrl}${path}`, { method: "DELETE" });
  const body = (await response.json().catch(() => ({}))) as { error?: string };

  if (!response.ok) {
    throw new Error(
      body.error || `${label} delete failed (${response.status})`,
    );
  }

  return body;
}

export function deleteStudentRecord(apiBaseUrl: string, id: string) {
  return deleteRecord(apiBaseUrl, `/students/${id}`, "Student");
}

export function deleteGradeRecord(apiBaseUrl: string, id: string) {
  return deleteRecord(apiBaseUrl, `/grades/${id}`, "Grade");
}

export function deleteTeacherRecord(apiBaseUrl: string, id: string) {
  return deleteRecord(apiBaseUrl, `/teachers/${id}`, "Teacher");
}

export function deleteClassRecord(apiBaseUrl: string, id: string) {
  return deleteRecord(apiBaseUrl, `/classes/${id}`, "Class");
}

export function deleteSubjectRecord(apiBaseUrl: string, id: string) {
  return deleteRecord(apiBaseUrl, `/subjects/${id}`, "Subject");
}
