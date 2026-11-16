/**
 * Students Router
 *
 * oRPC router for student management with full CRUD operations.
 */

import { randomUUID } from "crypto";
import {
  assignmentSubmissions,
  assignments,
  attendance,
  bookIssues,
  circulars,
  classes,
  drivers,
  examSchedules,
  feePayments,
  libraryBooks,
  reportCardDetails,
  reportCards,
  students,
  subjects,
  teachers,
  transportRoutes,
  vehicles,
} from "@school/storage";
import { getOrCache } from "@school/storage/redis";
import { and, desc, eq, inArray, like, sql } from "drizzle-orm";
import { z } from "zod";
import { StudentsListResponseSchema } from "../../contracts/school.js";
import { getDb } from "../../lib/db.js";
import { APIError, ErrorCode } from "../../lib/errors.js";
import { orgAuthed, pub } from "../../procedures/index.js";

export const studentsRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/students",
      summary: "Get all students",
      tags: ["Students"],
    })
    .input(
      z.object({
        classId: z.string().uuid().optional(),
        sessionId: z.string().uuid().optional(),
        search: z.string().optional(),
        status: z.boolean().optional(),
        page: z.number().int().min(1).optional().default(1),
        limit: z.number().int().min(1).max(100).optional().default(20),
      }),
    )
    .output(StudentsListResponseSchema)
    .handler(async ({ input }) => {
      const db = getDb();
      const { classId, sessionId, search, page, limit } = input;
      const offset = (page - 1) * limit;

      // Cache key for list queries
      const cacheKey = `students:list:${JSON.stringify(input)}`;

      // Use cache for list queries (5 min TTL)
      return getOrCache(
        cacheKey,
        async () => {
          const conditions = [];
          if (classId) conditions.push(eq(students.classId, classId));
          if (sessionId) conditions.push(eq(students.sessionId, sessionId));
          if (search) {
            conditions.push(like(students.firstName, `%${search}%`));
          }

          const allStudents = await db
            .select({
              id: students.id,
              admissionNumber: students.admissionNumber,
              firstName: students.firstName,
              lastName: students.lastName,
              email: students.email,
              phone: students.phone,
              gender: students.gender,
              classId: students.classId,
              className: classes.name,
              section: classes.section,
              fatherName: students.fatherName,
              fatherPhone: students.fatherPhone,
              status: students.status,
              createdAt: students.createdAt,
            })
            .from(students)
            .leftJoin(classes, eq(students.classId, classes.id))
            .where(and(...conditions))
            .orderBy(desc(students.createdAt))
            .limit(limit)
            .offset(offset);

          const [{ count }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(students)
            .where(and(...conditions));

          // Fetch attendance summary for all students in this page in one query
          const studentIds = allStudents.map((s) => s.id);
          const attendanceSummary: Record<
            string,
            { total: number; present: number }
          > = {};

          if (studentIds.length) {
            const attendanceRows = await db
              .select({
                studentId: attendance.studentId,
                total: sql<number>`count(*)`,
                present: sql<number>`count(case when ${attendance.status} = 'present' then 1 end)`,
              })
              .from(attendance)
              .where(inArray(attendance.studentId, studentIds))
              .groupBy(attendance.studentId);

            attendanceRows.forEach((row) => {
              attendanceSummary[row.studentId] = {
                total: row.total,
                present: row.present,
              };
            });
          }

          return {
            students: allStudents.map((s) => {
              const attendance = attendanceSummary[s.id] || {
                total: 0,
                present: 0,
              };
              const percentage = attendance.total
                ? Math.round(
                    (attendance.present / attendance.total) * 100 * 10,
                  ) / 10
                : 0;

              return {
                id: s.id,
                admissionNumber: s.admissionNumber ?? "",
                firstName: s.firstName,
                lastName: s.lastName,
                email: s.email ?? "",
                phone: s.phone ?? "",
                classId: s.classId ?? undefined,
                className: s.className ?? "",
                fatherName: s.fatherName ?? "",
                fatherPhone: s.fatherPhone ?? "",
                gender: s.gender ?? undefined,
                createdAt: s.createdAt
                  ? new Date(s.createdAt).toISOString()
                  : "",
                status: s.status ? "active" : "inactive",
                rollNumber: s.admissionNumber
                  ? parseInt(s.admissionNumber.split("-").pop() || "0")
                  : 0,
                attendance: percentage,
              };
            }),
            pagination: {
              page,
              limit,
              total: Number(count) || 0,
              totalPages: Math.ceil((Number(count) || 0) / limit),
            },
          };
        },
        300, // 5 minutes
      );
    }),

  get: pub
    .route({
      method: "GET",
      path: "/students/{id}",
      summary: "Get single student",
      tags: ["Students"],
    })
    .input(
      z.object({
        params: z.object({ id: z.string().uuid() }),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.id, input.params.id));
      return student;
    }),

  create: orgAuthed
    .route({
      method: "POST",
      path: "/students",
      summary: "Create student",
      tags: ["Students"],
    })
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional(),
        dateOfBirth: z.string().optional(),
        gender: z.string().optional(),
        address: z.string().optional(),
        classId: z.string().uuid().optional(),
        sessionId: z.string().uuid().optional(),
        fatherName: z.string().optional(),
        fatherPhone: z.string().optional(),
        motherName: z.string().optional(),
        motherPhone: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const id = randomUUID();
      const admissionNumber = `STU-${Date.now().toString().slice(-6)}`;

      const [student] = await db
        .insert(students)
        .values({
          id,
          admissionNumber,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email || null,
          phone: input.phone || null,
          dateOfBirth: input.dateOfBirth || null,
          gender: input.gender || null,
          address: input.address || null,
          classId: input.classId || null,
          sessionId: input.sessionId || null,
          fatherName: input.fatherName || null,
          fatherPhone: input.fatherPhone || null,
          motherName: input.motherName || null,
          motherPhone: input.motherPhone || null,
        })
        .returning();

      return student;
    }),

  update: orgAuthed
    .route({
      method: "PUT",
      path: "/students/{id}",
      summary: "Update student",
      tags: ["Students"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        classId: z.string().uuid().optional(),
        fatherName: z.string().optional(),
        fatherPhone: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;

      const [student] = await db
        .update(students)
        .set(data)
        .where(eq(students.id, id))
        .returning();

      return student;
    }),

  remove: orgAuthed
    .route({
      method: "DELETE",
      path: "/students/{id}",
      summary: "Delete student",
      tags: ["Students"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean(), id: z.string().uuid() }))
    .handler(async ({ input }) => {
      const db = getDb();

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(attendance)
        .where(eq(attendance.studentId, input.id));

      if (count > 0) {
        throw new APIError(ErrorCode.CONFLICT, "Cannot delete student", 409, {
          dependencies: { attendance: count },
        });
      }

      await db.delete(students).where(eq(students.id, input.id));
      return { success: true, id: input.id };
    }),

  bulkAssignClass: orgAuthed
    .route({
      method: "POST",
      path: "/students/bulk/assign-class",
      summary: "Bulk assign students to a class",
      tags: ["Students"],
    })
    .input(
      z.object({
        studentIds: z.array(z.string().uuid()).min(1),
        classId: z.string().uuid(),
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
        assigned: z.number(),
        class: z.object({ id: z.string(), name: z.string() }),
      }),
    )
    .handler(async ({ input }) => {
      const db = getDb();

      const [cls] = await db
        .select({ id: classes.id, name: classes.name })
        .from(classes)
        .where(eq(classes.id, input.classId))
        .limit(1);

      if (!cls) {
        throw new Error("Class not found");
      }

      const result = await db
        .update(students)
        .set({ classId: input.classId, updatedAt: new Date() })
        .where(sql`${students.id} IN (${input.studentIds})`)
        .returning();

      return {
        success: true,
        assigned: result.length,
        class: { id: cls.id, name: cls.name },
      };
    }),

  // Student Portal Endpoints
  getMyProfile: pub
    .route({
      method: "GET",
      path: "/students/me",
      summary: "Get current student's profile",
      tags: ["Students", "Portal"],
    })
    .output(z.any())
    .handler(async ({ context }) => {
      // In a real implementation, use authenticated user context to identify the student.
      // For now, return the first student record.
      const db = getDb();
      const [student] = await db
        .select({
          id: students.id,
          admissionNumber: students.admissionNumber,
          firstName: students.firstName,
          lastName: students.lastName,
          email: students.email,
          phone: students.phone,
          dateOfBirth: students.dateOfBirth,
          gender: students.gender,
          address: students.address,
          city: students.city,
          state: students.state,
          pincode: students.pincode,
          bloodGroup: students.bloodGroup,
          classId: students.classId,
          className: classes.name,
          section: classes.section,
          fatherName: students.fatherName,
          fatherPhone: students.fatherPhone,
          motherName: students.motherName,
          motherPhone: students.motherPhone,
          status: students.status,
          createdAt: students.createdAt,
        })
        .from(students)
        .leftJoin(classes, eq(students.classId, classes.id))
        .limit(1);

      if (!student) {
        throw new APIError(
          ErrorCode.NOT_FOUND,
          "Student profile not found",
          404,
        );
      }

      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        admissionNumber: student.admissionNumber,
        class: student.className,
        section: student.section,
        rollNumber: student.admissionNumber?.split("-").pop() || "",
        email: student.email,
        phone: student.phone,
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: student.gender,
        address: [student.address, student.city, student.state, student.pincode]
          .filter(Boolean)
          .join(", "),
        bloodGroup: student.bloodGroup || "N/A",
        fatherName: student.fatherName,
        fatherPhone: student.fatherPhone,
        motherName: student.motherName,
        motherPhone: student.motherPhone,
        createdAt: student.createdAt
          ? new Date(student.createdAt).toISOString()
          : "",
        status: student.status ? "active" : "inactive",
      };
    }),

  getMyAttendance: pub
    .route({
      method: "GET",
      path: "/students/me/attendance",
      summary: "Get current student's attendance",
      tags: ["Students", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      // Get first student for demo
      const [student] = await db.select().from(students).limit(1);

      if (!student) {
        return {
          attendance: { present: 0, absent: 0, total: 0, percentage: 0 },
        };
      }

      // Get attendance summary for the student
      const attendanceRecords = await db
        .select()
        .from(attendance)
        .where(eq(attendance.studentId, student.id));

      const present = attendanceRecords.filter(
        (r) => r.status === "present",
      ).length;
      const absent = attendanceRecords.filter(
        (r) => r.status === "absent",
      ).length;
      const total = attendanceRecords.length;
      const percentage =
        total > 0 ? Math.round((present / total) * 100 * 10) / 10 : 0;

      return {
        attendance: {
          present,
          absent,
          total,
          percentage,
        },
      };
    }),

  getMyGrades: pub
    .route({
      method: "GET",
      path: "/students/me/grades",
      summary: "Get current student's grades",
      tags: ["Students", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      const [student] = await db.select().from(students).limit(1);

      if (!student) {
        return { subjects: [] };
      }

      const reportCard = await db
        .select()
        .from(reportCards)
        .where(eq(reportCards.studentId, student.id))
        .orderBy(desc(reportCards.createdAt))
        .limit(1)
        .then((rows) => rows[0]);

      if (!reportCard) {
        return { subjects: [] };
      }

      const details = await db
        .select()
        .from(reportCardDetails)
        .where(eq(reportCardDetails.reportCardId, reportCard.id));

      return {
        subjects: details.map((d) => ({
          id: d.id,
          subject: d.subjectId || "",
          marks: Number(d.obtainedMarks || 0),
          maxMarks: Number(d.maxMarks || 0),
          grade: d.grade || "",
          examType: reportCard.examType || "",
          date: reportCard.createdAt
            ? new Date(reportCard.createdAt).toISOString()
            : "",
        })),
      };
    }),

  getMyFees: pub
    .route({
      method: "GET",
      path: "/students/me/fees",
      summary: "Get current student's fee status",
      tags: ["Students", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      const [student] = await db.select().from(students).limit(1);

      if (!student) {
        return {
          fees: {
            total: 0,
            paid: 0,
            pending: 0,
            status: "unknown",
          },
        };
      }

      const payments = await db
        .select()
        .from(feePayments)
        .where(eq(feePayments.studentId, student.id));

      const paid = payments
        .filter((p) => p.status === "paid" || p.status === "completed")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
      const pending = payments
        .filter((p) => p.status !== "paid" && p.status !== "completed")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
      const total = paid + pending;

      return {
        fees: {
          total,
          paid,
          pending,
          status: pending > 0 ? "pending" : "paid",
          paymentHistory: payments.map((p) => ({
            date: p.paymentDate ? new Date(p.paymentDate).toISOString() : "",
            amount: Number(p.amount || 0),
            status: p.status,
            transactionId: p.transactionId || "",
          })),
        },
      };
    }),

  // Parent-specific endpoints
  getMyChildren: pub
    .route({
      method: "GET",
      path: "/students/children",
      summary: "Get children of the current parent",
      tags: ["Students", "Portal", "Parent"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      // For now, return all students as mock children
      // In real implementation, this would filter by parent relationship
      const children = await db
        .select({
          id: students.id,
          admissionNumber: students.admissionNumber,
          firstName: students.firstName,
          lastName: students.lastName,
          email: students.email,
          phone: students.phone,
          classId: students.classId,
          className: classes.name,
          rollNumber: students.admissionNumber,
          fatherName: students.fatherName,
          fatherPhone: students.fatherPhone,
          motherName: students.motherName,
          motherPhone: students.motherPhone,
          createdAt: students.createdAt,
        })
        .from(students)
        .leftJoin(classes, eq(students.classId, classes.id))
        .limit(10); // Mock: return first 10 students

      return { children };
    }),

  getChildAttendance: pub
    .route({
      method: "GET",
      path: "/students/child/:id/attendance",
      summary: "Get attendance for a specific child",
      tags: ["Students", "Portal", "Parent"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id } = input;

      const records = await db
        .select({
          status: attendance.status,
          className: classes.name,
          date: attendance.date,
        })
        .from(attendance)
        .leftJoin(classes, eq(attendance.classId, classes.id))
        .where(eq(attendance.studentId, id))
        .orderBy(desc(attendance.date))
        .limit(50);

      const present = records.filter((r) => r.status === "present").length;
      const absent = records.filter((r) => r.status === "absent").length;
      const total = records.length;
      const percentage = total
        ? Math.round((present / total) * 100 * 10) / 10
        : 0;

      const recent = records.slice(0, 3).map((r) => ({
        className: r.className || "—",
        percentage: r.status === "present" ? 100 : 0,
      }));

      return [
        {
          className: "Overall",
          present,
          absent,
          total,
          percentage,
        },
        ...recent,
      ];
    }),

  getChildGrades: pub
    .route({
      method: "GET",
      path: "/students/child/:id/grades",
      summary: "Get grades for a specific child",
      tags: ["Students", "Portal", "Parent"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id } = input;

      const reportCard = await db
        .select()
        .from(reportCards)
        .where(eq(reportCards.studentId, id))
        .orderBy(desc(reportCards.createdAt))
        .limit(1)
        .then((rows) => rows[0]);

      if (!reportCard) {
        return { grades: [] };
      }

      const details = await db
        .select({
          subjectId: reportCardDetails.subjectId,
          subjectName: subjects.name,
          teacherName: sql<string>`concat(${teachers.firstName}, ' ', ${teachers.lastName})`,
          maxMarks: reportCardDetails.maxMarks,
          obtainedMarks: reportCardDetails.obtainedMarks,
          grade: reportCardDetails.grade,
        })
        .from(reportCardDetails)
        .leftJoin(subjects, eq(reportCardDetails.subjectId, subjects.id))
        .leftJoin(teachers, eq(subjects.teacherId, teachers.id))
        .where(eq(reportCardDetails.reportCardId, reportCard.id));

      return {
        grades: details.map((d) => ({
          subject: d.subjectName || "Unknown",
          marks: Number(d.obtainedMarks || 0),
          maxMarks: Number(d.maxMarks || 0),
          grade: d.grade || "",
          teacher: d.teacherName || "",
        })),
      };
    }),

  getChildFees: pub
    .route({
      method: "GET",
      path: "/students/child/:id/fees",
      summary: "Get fee status for a specific child",
      tags: ["Students", "Portal", "Parent"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id } = input;

      const payments = await db
        .select()
        .from(feePayments)
        .where(eq(feePayments.studentId, id));

      const paid = payments
        .filter((p) => p.status === "paid" || p.status === "completed")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
      const pending = payments
        .filter((p) => p.status !== "paid" && p.status !== "completed")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
      const total = paid + pending;

      return {
        fees: {
          total,
          paid,
          pending,
          status: pending > 0 ? "pending" : "paid",
          paymentHistory: payments.map((p) => ({
            date: p.paymentDate ? new Date(p.paymentDate).toISOString() : "",
            amount: Number(p.amount || 0),
            status: p.status,
            transactionId: p.transactionId || "",
          })),
        },
      };
    }),

  getChildHomework: pub
    .route({
      method: "GET",
      path: "/students/child/:id/homework",
      summary: "Get homework for a specific child",
      tags: ["Students", "Portal", "Parent"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id } = input;

      // Get student's class
      const [student] = await db
        .select({ classId: students.classId })
        .from(students)
        .where(eq(students.id, id));

      if (!student?.classId) {
        return { homework: [] };
      }

      const homework = await db
        .select({
          id: assignments.id,
          title: assignments.title,
          description: assignments.description,
          subject: subjects.name,
          dueDate: assignments.dueDate,
          teacherName: sql<string>`concat(${teachers.firstName}, ' ', ${teachers.lastName})`,
          status: sql<string>`CASE WHEN ${assignmentSubmissions.id} IS NOT NULL THEN 'submitted' ELSE 'pending' END`,
        })
        .from(assignments)
        .leftJoin(subjects, eq(assignments.subjectId, subjects.id))
        .leftJoin(teachers, eq(assignments.teacherId, teachers.id))
        .leftJoin(
          assignmentSubmissions,
          and(
            eq(assignmentSubmissions.assignmentId, assignments.id),
            eq(assignmentSubmissions.studentId, id),
          ),
        )
        .where(eq(assignments.classId, student.classId))
        .orderBy(desc(assignments.dueDate))
        .limit(10);

      return {
        homework: homework.map((hw) => ({
          id: hw.id,
          subject: hw.subject || "Unknown",
          title: hw.title,
          description: hw.description || "",
          dueDate: hw.dueDate
            ? new Date(hw.dueDate).toISOString().split("T")[0]
            : "",
          teacher: hw.teacherName || "",
          status: hw.status,
        })),
      };
    }),

  getChildExams: pub
    .route({
      method: "GET",
      path: "/students/child/:id/exams",
      summary: "Get exam schedule for a specific child",
      tags: ["Students", "Portal", "Parent"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id } = input;

      // Get student's class
      const [student] = await db
        .select({ classId: students.classId })
        .from(students)
        .where(eq(students.id, id));

      if (!student?.classId) {
        return { exams: [] };
      }

      const exams = await db
        .select({
          id: examSchedules.id,
          title: examSchedules.title,
          examType: examSchedules.examType,
          subject: subjects.name,
          examDate: examSchedules.examDate,
          startTime: examSchedules.startTime,
          endTime: examSchedules.endTime,
          totalMarks: examSchedules.totalMarks,
          roomNumber: examSchedules.roomNumber,
        })
        .from(examSchedules)
        .leftJoin(subjects, eq(examSchedules.subjectId, subjects.id))
        .where(eq(examSchedules.classId, student.classId))
        .orderBy(examSchedules.examDate, examSchedules.startTime);

      return {
        exams: exams.map((exam) => ({
          id: exam.id,
          name: exam.title,
          subject: exam.subject || "Unknown",
          date: exam.examDate
            ? new Date(exam.examDate).toISOString().split("T")[0]
            : "",
          time: `${exam.startTime} - ${exam.endTime}`,
          marks: exam.totalMarks || 0,
          maxMarks: exam.totalMarks || 100,
          room: exam.roomNumber || "",
          status:
            new Date(exam.examDate || Date.now()) > new Date()
              ? "Upcoming"
              : "Completed",
        })),
      };
    }),

  getChildLibraryBooks: pub
    .route({
      method: "GET",
      path: "/students/child/:id/library",
      summary: "Get library books for a specific child",
      tags: ["Students", "Portal", "Parent"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id } = input;

      const books = await db
        .select({
          id: bookIssues.id,
          title: libraryBooks.title,
          author: libraryBooks.author,
          issueDate: bookIssues.issueDate,
          dueDate: bookIssues.dueDate,
          status: bookIssues.status,
        })
        .from(bookIssues)
        .leftJoin(libraryBooks, eq(bookIssues.bookId, libraryBooks.id))
        .where(eq(bookIssues.studentId, id))
        .orderBy(desc(bookIssues.issueDate))
        .limit(5);

      return {
        books: books.map((book) => ({
          id: book.id,
          title: book.title || "Unknown",
          author: book.author || "Unknown",
          issueDate: book.issueDate
            ? new Date(book.issueDate).toISOString().split("T")[0]
            : "",
          dueDate: book.dueDate
            ? new Date(book.dueDate).toISOString().split("T")[0]
            : "",
          status: book.status === "issued" ? "Active" : book.status,
        })),
      };
    }),

  getChildTransport: pub
    .route({
      method: "GET",
      path: "/students/child/:id/transport",
      summary: "Get transport details for a specific child",
      tags: ["Students", "Portal", "Parent"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id } = input;

      // Get student's transport route
      const [student] = await db
        .select({
          transportRouteId: students.transportRouteId,
          address: students.address,
        })
        .from(students)
        .where(eq(students.id, id));

      if (!student?.transportRouteId) {
        return { transport: null };
      }

      const [route] = await db
        .select({
          routeName: transportRoutes.routeName,
          routeNumber: transportRoutes.routeNumber,
          startPoint: transportRoutes.startPoint,
          endPoint: transportRoutes.endPoint,
          vehicleNumber: vehicles.vehicleNumber,
          driverName: sql<string>`concat(${drivers.firstName}, ' ', ${drivers.lastName})`,
          driverPhone: drivers.phone,
        })
        .from(transportRoutes)
        .leftJoin(vehicles, eq(transportRoutes.id, vehicles.routeId))
        .leftJoin(drivers, eq(vehicles.id, drivers.vehicleId))
        .where(eq(transportRoutes.id, student.transportRouteId))
        .limit(1);

      if (!route) {
        return { transport: null };
      }

      return {
        transport: {
          route: route.routeName || route.routeNumber || "Unknown Route",
          stop: student.address || "Student Address",
          pickupTime: "07:15 AM", // Mock time - in real app, this would be stored
          dropTime: "04:30 PM", // Mock time - in real app, this would be stored
          driverName: route.driverName || "Unknown",
          driverPhone: route.driverPhone || "",
          vehicleNumber: route.vehicleNumber || "",
        },
      };
    }),

  getChildNotices: pub
    .route({
      method: "GET",
      path: "/students/child/:id/notices",
      summary: "Get notices for a specific child",
      tags: ["Students", "Portal", "Parent"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id } = input;

      // Get notices targeted at students, parents, or all
      const notices = await db
        .select({
          id: circulars.id,
          title: circulars.title,
          content: circulars.content,
          date: circulars.date,
          type: circulars.type,
          priority: circulars.priority,
        })
        .from(circulars)
        .where(
          sql`${circulars.targetAudience}::jsonb ? 'students' OR ${circulars.targetAudience}::jsonb ? 'parents' OR ${circulars.targetAudience}::jsonb ? 'all'`,
        )
        .orderBy(desc(circulars.date))
        .limit(10);

      return {
        notices: notices.map((notice) => ({
          id: notice.id,
          title: notice.title,
          date: notice.date
            ? new Date(notice.date).toISOString().split("T")[0]
            : "",
          message: notice.content || "",
          priority: notice.priority || "normal",
        })),
      };
    }),

  getChildTeachers: pub
    .route({
      method: "GET",
      path: "/students/child/:id/teachers",
      summary: "Get teachers for a specific child",
      tags: ["Students", "Portal", "Parent"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id } = input;

      // Get student's class
      const [student] = await db
        .select({ classId: students.classId })
        .from(students)
        .where(eq(students.id, id));

      if (!student?.classId) {
        return { teachers: [] };
      }

      const teacherList = await db
        .select({
          id: teachers.id,
          name: sql<string>`concat(${teachers.firstName}, ' ', ${teachers.lastName})`,
          subject: subjects.name,
          phone: teachers.phone,
          email: teachers.email,
        })
        .from(subjects)
        .leftJoin(teachers, eq(subjects.teacherId, teachers.id))
        .where(eq(subjects.classId, student.classId));

      return {
        teachers: teacherList.map((teacher) => ({
          id: teacher.id,
          name: teacher.name || "Unknown",
          subject: teacher.subject || "Unknown",
          phone: teacher.phone || "",
          email: teacher.email || "",
        })),
      };
    }),
};
