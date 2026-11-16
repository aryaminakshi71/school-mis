/**
 * Teachers Router
 *
 * oRPC router for teacher management.
 */

import {
  attendance,
  classes,
  reportCards,
  students,
  subjects,
  teachers,
} from "@school/storage";
import { desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { TeachersListResponseSchema } from "../../contracts/school.js";
import { getDb } from "../../lib/db.js";
import { APIError, ErrorCode } from "../../lib/errors.js";
import { orgAuthed, pub } from "../../procedures/index.js";

export const teachersRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/teachers",
      summary: "Get all teachers",
      tags: ["Teachers"],
    })
    .output(TeachersListResponseSchema)
    .handler(async () => {
      const db = getDb();
      const allTeachers = await db
        .select()
        .from(teachers)
        .orderBy(desc(teachers.createdAt));

      const teachersWithStats = await Promise.all(
        allTeachers.map(async (t) => {
          const classRows = await db
            .select({ id: classes.id })
            .from(classes)
            .where(eq(classes.classTeacherId, t.id));

          const classIds = classRows.map((c) => c.id);

          let attendancePercentage = 0;
          if (classIds.length) {
            const attendanceSummary = await db
              .select({
                total: sql<number>`count(*)`,
                present: sql<number>`count(case when ${attendance.status} = 'present' then 1 end)`,
              })
              .from(attendance)
              .where(inArray(attendance.classId, classIds));

            const total = attendanceSummary[0]?.total || 0;
            const present = attendanceSummary[0]?.present || 0;
            attendancePercentage = total
              ? Math.round((present / total) * 100 * 10) / 10
              : 0;
          }

          return {
            id: t.id,
            employeeId: t.employeeId ?? "",
            firstName: t.firstName,
            lastName: t.lastName,
            email: t.email ?? "",
            phone: t.phone ?? "",
            qualification: t.qualification ?? "",
            subject: t.subjectSpecialization ?? "",
            createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : "",
            status: (t.status ? "active" : "inactive") as
              | "active"
              | "on_leave"
              | "inactive",
            salary: 45000 + (t.experience ?? 0) * 1200,
            attendance: attendancePercentage,
          };
        }),
      );

      return { teachers: teachersWithStats };
    }),

  get: pub
    .route({
      method: "GET",
      path: "/teachers/{id}",
      summary: "Get single teacher",
      tags: ["Teachers"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),

  create: orgAuthed
    .route({
      method: "POST",
      path: "/teachers",
      summary: "Create teacher",
      tags: ["Teachers"],
    })
    .input(
      z.object({
        employeeId: z.string().optional(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        qualification: z.string().optional(),
        experience: z.number().int().optional(),
        subjectSpecialization: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),

  update: orgAuthed
    .route({
      method: "PUT",
      path: "/teachers/{id}",
      summary: "Update teacher",
      tags: ["Teachers"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        qualification: z.string().optional(),
        experience: z.number().int().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => input),

  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/teachers/{id}",
      summary: "Delete teacher",
      tags: ["Teachers"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input }) => {
      const db = getDb();

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(subjects)
        .where(eq(subjects.teacherId, input.id));

      if (count > 0) {
        throw new APIError(ErrorCode.CONFLICT, "Cannot delete teacher", 409, {
          dependencies: { subjects: count },
        });
      }

      await db.delete(teachers).where(eq(teachers.id, input.id));
      return { success: true };
    }),

  // Teacher portal endpoints
  getMyProfile: pub
    .route({
      method: "GET",
      path: "/teachers/me",
      summary: "Get current teacher's profile",
      tags: ["Teachers", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      // For now, return first teacher as current user
      const teacher = await db
        .select()
        .from(teachers)
        .limit(1)
        .then((rows) => rows[0]);

      if (!teacher) {
        throw new APIError(ErrorCode.NOT_FOUND, "Teacher not found", 404);
      }

      const teacherClasses = await db
        .select({ id: classes.id })
        .from(classes)
        .where(eq(classes.classTeacherId, teacher.id));

      const classIds = teacherClasses.map((c) => c.id);

      const studentsCount = classIds.length
        ? await db
            .select({ count: sql<number>`count(*)` })
            .from(students)
            .where(inArray(students.classId, classIds))
            .then((rows) => Number(rows[0]?.count || 0))
        : 0;

      let attendancePercentage = 0;
      if (classIds.length) {
        const attendanceSummary = await db
          .select({
            total: sql<number>`count(*)`,
            present: sql<number>`count(case when ${attendance.status} = 'present' then 1 end)`,
          })
          .from(attendance)
          .where(inArray(attendance.classId, classIds));

        const total = attendanceSummary[0]?.total || 0;
        const present = attendanceSummary[0]?.present || 0;
        attendancePercentage = total
          ? Math.round((present / total) * 100 * 10) / 10
          : 0;
      }

      return {
        id: teacher.id,
        employeeId: teacher.employeeId || "",
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email || "",
        phone: teacher.phone || "",
        qualification: teacher.qualification || "",
        subject: teacher.subjectSpecialization || "",
        salary: 45000 + (teacher.experience ?? 0) * 1200,
        attendance: attendancePercentage,
        classes: classIds.length,
        students: studentsCount,
      };
    }),

  getMyClasses: pub
    .route({
      method: "GET",
      path: "/teachers/me/classes",
      summary: "Get classes taught by current teacher",
      tags: ["Teachers", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      const teacher = await db
        .select()
        .from(teachers)
        .limit(1)
        .then((rows) => rows[0]);

      if (!teacher) {
        return { classes: [] };
      }

      const teacherClasses = await db
        .select()
        .from(classes)
        .where(eq(classes.classTeacherId, teacher.id));

      const classesWithCounts = await Promise.all(
        teacherClasses.map(async (c) => {
          const [{ count }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(students)
            .where(eq(students.classId, c.id));

          return {
            id: c.id,
            name: c.name,
            section: c.section || "",
            students: Number(count || 0),
            subject: "", // optional
          };
        }),
      );

      return { classes: classesWithCounts };
    }),

  getMyStudents: pub
    .route({
      method: "GET",
      path: "/teachers/me/students",
      summary: "Get students taught by current teacher",
      tags: ["Teachers", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      const teacher = await db
        .select()
        .from(teachers)
        .limit(1)
        .then((rows) => rows[0]);

      if (!teacher) {
        return { students: [] };
      }

      const teacherClassIds = (
        await db
          .select({ id: classes.id })
          .from(classes)
          .where(eq(classes.classTeacherId, teacher.id))
      ).map((c) => c.id);

      if (!teacherClassIds.length) {
        return { students: [] };
      }

      const teacherStudents = await db
        .select({
          id: students.id,
          firstName: students.firstName,
          lastName: students.lastName,
          className: classes.name,
        })
        .from(students)
        .leftJoin(classes, eq(students.classId, classes.id))
        .where(inArray(students.classId, teacherClassIds))
        .limit(50);

      return { students: teacherStudents };
    }),

  performance: pub
    .route({
      method: "GET",
      path: "/teachers/performance",
      summary: "Get teaching performance insights",
      tags: ["Teachers", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      // This is a simple service endpoint to power performance dashboards
      return {
        performance: [
          {
            id: "EMP-001",
            name: "Ramesh Kumar",
            designation: "Senior Teacher",
            department: "Mathematics",
            rating: 4.8,
            studentsFeedback: 4.7,
            peerReview: 4.9,
            attendance: 96,
            lastAppraisal: "2025-07-15",
            nextAppraisal: "2026-07-15",
            status: "excellent",
          },
          {
            id: "EMP-002",
            name: "Priya Sharma",
            designation: "Teacher",
            department: "Science",
            rating: 4.5,
            studentsFeedback: 4.6,
            peerReview: 4.4,
            attendance: 98,
            lastAppraisal: "2025-08-20",
            nextAppraisal: "2026-08-20",
            status: "good",
          },
          {
            id: "EMP-003",
            name: "Amit Patel",
            designation: "Head of Department",
            department: "English",
            rating: 4.2,
            studentsFeedback: 4.0,
            peerReview: 4.3,
            attendance: 94,
            lastAppraisal: "2025-06-10",
            nextAppraisal: "2026-06-10",
            status: "average",
          },
          {
            id: "EMP-004",
            name: "Sneha Gupta",
            designation: "Teacher",
            department: "Mathematics",
            rating: 4.9,
            studentsFeedback: 4.9,
            peerReview: 4.8,
            attendance: 99,
            lastAppraisal: "2025-09-01",
            nextAppraisal: "2026-09-01",
            status: "excellent",
          },
          {
            id: "EMP-005",
            name: "Vikram Singh",
            designation: "Teacher",
            department: "Sports",
            rating: 3.8,
            studentsFeedback: 3.9,
            peerReview: 3.7,
            attendance: 88,
            lastAppraisal: "2025-05-25",
            nextAppraisal: "2026-05-25",
            status: "needs_improvement",
          },
        ],
        appraisalCycles: [
          {
            id: "AP-2026-Q1",
            name: "Annual Appraisal 2026",
            startDate: "2026-01-01",
            endDate: "2026-03-31",
            status: "active",
            completed: 25,
            total: 50,
          },
          {
            id: "AP-2025-Q4",
            name: "Quarterly Review Q4 2025",
            startDate: "2025-10-01",
            endDate: "2025-12-31",
            status: "completed",
            completed: 48,
            total: 48,
          },
          {
            id: "AP-2025-Q3",
            name: "Quarterly Review Q3 2025",
            startDate: "2025-07-01",
            endDate: "2025-09-30",
            status: "completed",
            completed: 46,
            total: 46,
          },
        ],
      };
    }),

  recruitment: pub
    .route({
      method: "GET",
      path: "/teachers/recruitment",
      summary: "Get recruitment dashboard data",
      tags: ["Teachers", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      return {
        jobPostings: [
          {
            id: "JOB-101",
            title: "Math Teacher",
            department: "Mathematics",
            location: "Main Campus",
            type: "Full-time",
            postedAt: "2026-02-15",
            status: "open",
          },
          {
            id: "JOB-102",
            title: "Science Teacher",
            department: "Science",
            location: "North Campus",
            type: "Full-time",
            postedAt: "2026-02-20",
            status: "open",
          },
        ],
        applications: [
          {
            id: "APP-201",
            candidate: "Anjali Verma",
            position: "Math Teacher",
            status: "review",
            appliedAt: "2026-02-22",
          },
          {
            id: "APP-202",
            candidate: "Rohan Mehta",
            position: "Science Teacher",
            status: "interview",
            appliedAt: "2026-02-25",
          },
        ],
      };
    }),

  training: pub
    .route({
      method: "GET",
      path: "/teachers/training",
      summary: "Get training and certification data",
      tags: ["Teachers", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      return {
        programs: [
          {
            id: "TR-001",
            title: "Advanced Teaching Methods",
            duration: "4 weeks",
            provider: "EduPro",
            status: "ongoing",
            startDate: "2026-03-01",
            endDate: "2026-03-28",
          },
          {
            id: "TR-002",
            title: "Student Psychology",
            duration: "3 weeks",
            provider: "EduPro",
            status: "completed",
            startDate: "2025-11-01",
            endDate: "2025-11-21",
          },
        ],
        certifications: [
          {
            id: "CERT-101",
            name: "Certified Educator Level 2",
            issuedBy: "National Board",
            issuedOn: "2025-08-15",
            expiresOn: "2028-08-14",
          },
        ],
        skills: [
          { name: "Classroom Management", level: "Advanced" },
          { name: "Curriculum Planning", level: "Advanced" },
          { name: "Assessment Design", level: "Intermediate" },
        ],
      };
    }),

  leave: pub
    .route({
      method: "GET",
      path: "/teachers/leave",
      summary: "Get leave requests and balances",
      tags: ["Teachers", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      return {
        leaveBalance: {
          total: 30,
          taken: 8,
          remaining: 22,
        },
        requests: [
          {
            id: "LV-001",
            type: "Sick Leave",
            startDate: "2026-03-10",
            endDate: "2026-03-12",
            status: "approved",
          },
          {
            id: "LV-002",
            type: "Casual Leave",
            startDate: "2026-04-05",
            endDate: "2026-04-06",
            status: "pending",
          },
        ],
      };
    }),

  getClassStats: pub
    .route({
      method: "GET",
      path: "/teachers/me/class-stats",
      summary: "Get class statistics for current teacher",
      tags: ["Teachers", "Portal"],
    })
    .output(z.any())
    .handler(async ({ context }) => {
      const db = getDb();
      // For demo, get first teacher and their classes
      const [teacher] = await db.select().from(teachers).limit(1);

      if (!teacher) {
        return { classStats: [] };
      }

      // Get teacher's classes
      const teacherClasses = await db
        .select({ id: classes.id, name: classes.name })
        .from(classes)
        .where(eq(classes.classTeacherId, teacher.id));

      const classStats = await Promise.all(
        teacherClasses.map(async (cls) => {
          // Get students in class
          const classStudents = await db
            .select({ id: students.id })
            .from(students)
            .where(eq(students.classId, cls.id));

          const studentIds = classStudents.map((s) => s.id);

          // Calculate attendance percentage
          let attendancePercentage = 0;
          if (studentIds.length) {
            const attendanceSummary = await db
              .select({
                total: sql<number>`count(*)`,
                present: sql<number>`count(case when ${attendance.status} = 'present' then 1 end)`,
              })
              .from(attendance)
              .where(inArray(attendance.studentId, studentIds));

            const total = attendanceSummary[0]?.total || 0;
            const present = attendanceSummary[0]?.present || 0;
            attendancePercentage = total
              ? Math.round((present / total) * 100 * 10) / 10
              : 0;
          }

          // Calculate average grade
          let averageGrade = 0;
          if (studentIds.length) {
            const grades = await db
              .select({ percentage: reportCards.percentage })
              .from(reportCards)
              .where(inArray(reportCards.studentId, studentIds));

            if (grades.length) {
              const totalPercentage = grades.reduce(
                (sum, g) => sum + Number(g.percentage || 0),
                0,
              );
              averageGrade =
                Math.round((totalPercentage / grades.length) * 10) / 10;
            }
          }

          return {
            id: cls.id,
            name: cls.name,
            students: studentIds.length,
            avgGrade: averageGrade,
            attendance: attendancePercentage,
          };
        }),
      );

      return { classStats };
    }),
};
