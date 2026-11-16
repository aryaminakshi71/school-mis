import { api } from "@/lib/api";
import type { User, UserRole } from "@/lib/auth-context";

type SessionLinkOverrides = Partial<
  Pick<User, "name" | "childId"> & { studentId?: string; teacherId?: string }
>;

const formatStudentName = (student?: {
  firstName?: string;
  lastName?: string;
}) => `${student?.firstName ?? ""} ${student?.lastName ?? ""}`.trim();

const formatTeacherName = (teacher?: {
  firstName?: string;
  lastName?: string;
}) => `${teacher?.firstName ?? ""} ${teacher?.lastName ?? ""}`.trim();

export async function resolvePortalIdentity(
  role: UserRole,
  email?: string,
): Promise<SessionLinkOverrides> {
  try {
    if (role === "student" || role === "parent") {
      const students = await api.students.list();
      const linkedStudent =
        students.find((student) => student.email && student.email === email) ||
        students[0];

      if (!linkedStudent) return {};

      const studentName = formatStudentName(linkedStudent);

      if (role === "student") {
        return {
          name: studentName || "Student User",
          studentId: linkedStudent.id,
        };
      }

      return {
        name: studentName ? `Parent of ${studentName}` : "Parent User",
        childId: linkedStudent.id,
      };
    }

    if (role === "teacher" || role === "staff") {
      const teachers = await api.teachers.list();
      const linkedTeacher =
        teachers.find((teacher) => teacher.email && teacher.email === email) ||
        teachers[0];

      if (!linkedTeacher) return {};

      return {
        name: formatTeacherName(linkedTeacher) || "Teacher User",
        teacherId: linkedTeacher.id,
      };
    }

    return {};
  } catch {
    return {};
  }
}
