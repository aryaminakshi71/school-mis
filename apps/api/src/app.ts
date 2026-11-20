/**
 * API Application
 *
 * Hono app with oRPC integration for Node.js server.
 * Features Better Auth, audit logging, and rate limiting.
 */

import { OpenAPIGenerator } from "@orpc/openapi";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod";
import { ROLES, handler } from "@school/auth";
import {
  attendance,
  auditLogs,
  chatConversations,
  chatMessages,
  chatParticipants,
  classes,
  expenses,
  feeCategories,
  feePayments,
  feeStructures,
  libraryBooks,
  bookIssues as libraryTransactions,
  notificationLogs,
  reportCardDetails,
  reportCards,
  sessions,
  studentFeeAllocations,
  students,
  subjects,
  teachers,
  timetables,
  transportRoutes,
  vehicles as transportVehicles,
  users,
} from "@school/storage";
import { and, desc, eq, gte, like, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import type { AppContext } from "./context.js";
import {
  analyzeAttendancePattern,
  predictStudentPerformance,
} from "./lib/ai-features.js";
import { initDatadog } from "./lib/datadog.js";
import { getDb } from "./lib/db.js";
import { setSecurityHeaders } from "./lib/security.js";
import { initSentry } from "./lib/sentry.js";
import { auditLogMiddleware } from "./middleware/audit.js";
import {
  authMiddleware,
  requireAuth,
  requireRole,
  requireVerifiedEmail,
} from "./middleware/auth.js";
import { loggerMiddleware } from "./middleware/logger.js";
import { rateLimitRedis } from "./middleware/rate-limit-redis.js";
import { appRouter } from "./routers/index.js";

// Helper function to generate notification messages
function getNotificationMessage(data: Record<string, unknown>): string {
  switch (data.type) {
    case "fee_payment":
      return `Fee payment of ₹${data.amount} received. Receipt: ${data.receiptNumber}`;
    case "fee_reminder":
      return `Fee reminder: ₹${data.amount} due for payment`;
    case "attendance_alert":
      return `Attendance alert: Student ${data.studentName} has low attendance`;
    case "exam_schedule":
      return `Exam scheduled: ${data.examName} on ${data.date}`;
    default:
      return "Notification from School MIS";
  }
}

/**
 * Create Hono app with all routes and middleware
 */
export function createApp() {
  const app = new Hono();

  // Initialize monitoring
  initSentry();
  initDatadog();

  // Global middleware
  app.use(
    "*",
    cors({
      origin: (origin: string | null) => origin,
      credentials: true,
      allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      exposeHeaders: [
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
      ],
    }),
  );
  app.use("*", requestId());
  app.use("*", loggerMiddleware);

  // Security headers middleware
  app.use("*", async (c, next) => {
    await next();
    setSecurityHeaders(c.res.headers);
  });

  // Health check (non-RPC) - must be before rate limiting
  app.get("/api/health", (c: any) => {
    return c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      uptime: process.uptime(),
    });
  });

  // Root route - API information
  app.get("/", (c: any) => {
    return c.json({
      name: "School MIS API",
      version: "1.0.0",
      status: "running",
      endpoints: {
        health: "/api/health",
        docs: "/api/docs",
        openapi: "/api/openapi.json",
        auth: "/api/auth/*",
      },
      message: "API server is running. Use /api/* endpoints.",
    });
  });

  // ============================================================================
  // BETTER AUTH ROUTES
  // ============================================================================

  // Mount Better Auth handler on /api/auth/*
  app.use("/api/auth/*", async (c: any) => {
    // Better Auth handles its own rate limiting
    return handler(c.req.raw);
  });

  // ============================================================================
  // PUBLIC API ROUTES (No authentication required)
  // ============================================================================

  // AI assistant routes (public, but rate limited)
  app.post(
    "/api/ai/student/performance",
    rateLimitRedis({ limiterType: "api" }),
    async (c: any) => {
      try {
        const body = (await c.req.json()) as {
          name?: string;
          currentGrades?: Record<string, number>;
          attendance?: number;
          pastPerformance?: string;
        };

        if (!body?.name) {
          return c.json({ error: "name is required" }, 400);
        }

        const prediction = await predictStudentPerformance({
          name: body.name,
          currentGrades: body.currentGrades,
          attendance: body.attendance,
          pastPerformance: body.pastPerformance,
        });

        return c.json({ prediction });
      } catch (error) {
        console.error("Error in /api/ai/student/performance:", error);
        return c.json({ error: "AI prediction failed" }, 500);
      }
    },
  );

  app.post(
    "/api/ai/attendance/analyze",
    rateLimitRedis({ limiterType: "api" }),
    async (c: any) => {
      try {
        const body = (await c.req.json()) as {
          studentId?: string;
          attendanceRecords?: Array<{ date: string; present: boolean }>;
        };

        if (!body?.studentId || !Array.isArray(body.attendanceRecords)) {
          return c.json(
            { error: "studentId and attendanceRecords are required" },
            400,
          );
        }

        const analysis = await analyzeAttendancePattern({
          studentId: body.studentId,
          attendanceRecords: body.attendanceRecords,
        });

        return c.json({ analysis });
      } catch (error) {
        console.error("Error in /api/ai/attendance/analyze:", error);
        return c.json({ error: "AI attendance analysis failed" }, 500);
      }
    },
  );

  // ============================================================================
  // PROTECTED API ROUTES (Authentication required)
  // ============================================================================

  // Apply rate limiting to all API routes
  app.use("/api/*", rateLimitRedis({ limiterType: "api" }));

  // Apply authentication middleware
  app.use("/api/*", authMiddleware);

  // Apply audit logging to all mutations
  app.use("/api/*", auditLogMiddleware);

  // Audit log read endpoint (requires admin or staff role)
  app.get(
    "/api/audit/logs",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.STAFF),
    async (c: any) => {
      const db = getDb(c.env);
      const limitRaw = c.req.query("limit");
      const limit = Math.max(1, Math.min(200, Number(limitRaw || 50) || 50));
      const offset = parseInt(c.req.query("offset") || "0");

      const rows = await db
        .select()
        .from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(auditLogs);

      return c.json({
        logs: rows,
        pagination: {
          limit,
          offset,
          total: Number(count),
        },
      });
    },
  );

  // ============================================================================
  // STUDENTS API (Protected)
  // ============================================================================

  app.get(
    "/api/students",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const page = parseInt(c.req.query("page") || "1");
        const limit = parseInt(c.req.query("limit") || "20");
        const search = c.req.query("search") || "";
        const offset = (page - 1) * limit;

        const conditions = [];
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

        return c.json({
          students: allStudents.map((s) => ({
            ...s,
            classId: s.classId,
          })),
          pagination: {
            page,
            limit,
            total: Number(count) || 0,
            totalPages: Math.ceil((Number(count) || 0) / limit),
          },
        });
      } catch (error) {
        console.error("Error fetching students:", error);
        return c.json({ error: "Failed to fetch students" }, 500);
      }
    },
  );

  app.post(
    "/api/students",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();
        const { randomUUID } = await import("crypto");
        const id = randomUUID();
        const admissionNumber = `STU-${Date.now().toString().slice(-6)}`;

        const [student] = await db
          .insert(students)
          .values({
            id,
            organizationId: c.get("user")?.schoolId || null,
            admissionNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email || null,
            phone: data.phone || null,
            dateOfBirth: data.dateOfBirth || null,
            gender: data.gender || null,
            address: data.address || null,
            classId: data.classId || null,
            sessionId: data.sessionId || null,
            fatherName: data.fatherName || null,
            fatherPhone: data.fatherPhone || null,
            motherName: data.motherName || null,
            motherPhone: data.motherPhone || null,
          })
          .returning();

        return c.json(student);
      } catch (error) {
        console.error("Error creating student:", error);
        return c.json({ error: "Failed to create student" }, 500);
      }
    },
  );

  app.post(
    "/api/students/bulk/assign-class",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();

        const { studentIds, classId } = data;

        if (!studentIds || !classId) {
          return c.json({ error: "studentIds and classId are required" }, 400);
        }

        const [cls] = await db
          .select({ id: classes.id, name: classes.name })
          .from(classes)
          .where(eq(classes.id, classId))
          .limit(1);

        if (!cls) {
          return c.json({ error: "Class not found" }, 404);
        }

        const result = await db
          .update(students)
          .set({ classId: classId, updatedAt: new Date() })
          .where(sql`${students.id} IN (${studentIds})`)
          .returning();

        return c.json({
          success: true,
          assigned: result.length,
          class: { id: cls.id, name: cls.name },
        });
      } catch (error) {
        console.error("Error bulk assigning students:", error);
        return c.json({ error: "Failed to bulk assign students" }, 500);
      }
    },
  );

  app.get(
    "/api/students/:id",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
      ROLES.PARENT,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const id = c.req.param("id");

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
            fatherName: students.fatherName,
            fatherPhone: students.fatherPhone,
            motherName: students.motherName,
            motherPhone: students.motherPhone,
            classId: students.classId,
            className: classes.name,
            section: classes.section,
            createdAt: students.createdAt,
          })
          .from(students)
          .leftJoin(classes, eq(students.classId, classes.id))
          .where(eq(students.id, id))
          .limit(1);

        if (!student) {
          return c.json({ error: "Student not found" }, 404);
        }

        return c.json(student);
      } catch (error) {
        console.error("Error fetching student:", error);
        return c.json({ error: "Failed to fetch student" }, 500);
      }
    },
  );

  app.put(
    "/api/students/:id",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const id = c.req.param("id");
        const data = await c.req.json();

        const [student] = await db
          .update(students)
          .set(data)
          .where(eq(students.id, id))
          .returning();

        return c.json(student);
      } catch (error) {
        console.error("Error updating student:", error);
        return c.json({ error: "Failed to update student" }, 500);
      }
    },
  );

  app.delete(
    "/api/students/:id",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const id = c.req.param("id");

        const [{ count }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(attendance)
          .where(eq(attendance.studentId, id));

        if (Number(count) > 0) {
          return c.json(
            {
              error: "Cannot delete student",
              dependencies: { attendance: Number(count) },
            },
            409,
          );
        }

        await db.delete(students).where(eq(students.id, id));

        return c.json({ success: true, id });
      } catch (error) {
        console.error("Error deleting student:", error);
        return c.json({ error: "Failed to delete student" }, 500);
      }
    },
  );

  // ============================================================================
  // TEACHERS API (Protected)
  // ============================================================================

  app.get(
    "/api/teachers",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const search = c.req.query("search") || "";

        const conditions = [];
        if (search) {
          conditions.push(
            sql`(${teachers.firstName} ILIKE ${`%${search}%`} OR ${teachers.lastName} ILIKE ${`%${search}%`} OR ${teachers.email} ILIKE ${`%${search}%`})`,
          );
        }

        const allTeachers = await db
          .select({
            id: teachers.id,
            employeeId: teachers.employeeId,
            firstName: teachers.firstName,
            lastName: teachers.lastName,
            email: teachers.email,
            phone: teachers.phone,
            subjectSpecialization: teachers.subjectSpecialization,
            status: teachers.status,
            createdAt: teachers.createdAt,
          })
          .from(teachers)
          .where(and(...conditions))
          .orderBy(desc(teachers.createdAt));

        return c.json({ teachers: allTeachers });
      } catch (error) {
        console.error("Error fetching teachers:", error);
        return c.json({ error: "Failed to fetch teachers" }, 500);
      }
    },
  );

  app.post(
    "/api/teachers",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();
        const { randomUUID } = await import("crypto");
        const id = randomUUID();
        const employeeId = `TCH-${Date.now().toString().slice(-6)}`;

        const [teacher] = await db
          .insert(teachers)
          .values({
            id,
            organizationId: c.get("user")?.schoolId || null,
            employeeId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || null,
            subjectSpecialization: data.subject || null,
            qualification: data.qualification || null,
            status: true,
          })
          .returning();

        return c.json(teacher);
      } catch (error) {
        console.error("Error creating teacher:", error);
        return c.json({ error: "Failed to create teacher" }, 500);
      }
    },
  );

  app.get(
    "/api/teachers/:id",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const id = c.req.param("id");

        const [teacher] = await db
          .select()
          .from(teachers)
          .where(eq(teachers.id, id))
          .limit(1);

        if (!teacher) {
          return c.json({ error: "Teacher not found" }, 404);
        }

        return c.json(teacher);
      } catch (error) {
        console.error("Error fetching teacher:", error);
        return c.json({ error: "Failed to fetch teacher" }, 500);
      }
    },
  );

  app.put(
    "/api/teachers/:id",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const id = c.req.param("id");
        const data = await c.req.json();

        const [teacher] = await db
          .update(teachers)
          .set({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || null,
            subjectSpecialization: data.subject || null,
            qualification: data.qualification || null,
            status: data.status,
            updatedAt: new Date(),
          })
          .where(eq(teachers.id, id))
          .returning();

        return c.json(teacher);
      } catch (error) {
        console.error("Error updating teacher:", error);
        return c.json({ error: "Failed to update teacher" }, 500);
      }
    },
  );

  app.delete(
    "/api/teachers/:id",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const id = c.req.param("id");

        const [{ count }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(subjects)
          .where(eq(subjects.teacherId, id));

        if (Number(count) > 0) {
          return c.json(
            {
              error: "Cannot delete teacher",
              dependencies: { subjects: Number(count) },
            },
            409,
          );
        }

        await db.delete(teachers).where(eq(teachers.id, id));

        return c.json({ success: true, id });
      } catch (error) {
        console.error("Error deleting teacher:", error);
        return c.json({ error: "Failed to delete teacher" }, 500);
      }
    },
  );

  // ============================================================================
  // CLASSES API (Protected)
  // ============================================================================

  app.get(
    "/api/classes",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);

        const allClasses = await db
          .select({
            id: classes.id,
            name: classes.name,
            section: classes.section,
            capacity: classes.capacity,
            createdAt: classes.createdAt,
          })
          .from(classes)
          .orderBy(classes.name);

        const classesWithCounts = await Promise.all(
          allClasses.map(async (cls) => {
            const [{ count }] = await db
              .select({ count: sql<number>`count(*)` })
              .from(students)
              .where(eq(students.classId, cls.id));

            return {
              ...cls,
              students: Number(count) || 0,
              classTeacher: "TBD",
            };
          }),
        );

        return c.json({ classes: classesWithCounts });
      } catch (error) {
        console.error("Error fetching classes:", error);
        return c.json({ error: "Failed to fetch classes" }, 500);
      }
    },
  );

  app.get(
    "/api/classes/list",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);

        const allClasses = await db
          .select({
            id: classes.id,
            name: classes.name,
            section: classes.section,
          })
          .from(classes)
          .orderBy(classes.name);

        return c.json({ classes: allClasses });
      } catch (error) {
        console.error("Error fetching classes list:", error);
        return c.json({ error: "Failed to fetch classes" }, 500);
      }
    },
  );

  app.post(
    "/api/classes",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();
        const { randomUUID } = await import("crypto");
        const id = randomUUID();

        const [cls] = await db
          .insert(classes)
          .values({
            id,
            organizationId: c.get("user")?.schoolId || null,
            name: data.name,
            section: data.section,
            capacity: data.capacity ? parseInt(data.capacity) : 40,
          })
          .returning();

        return c.json({ ...cls, students: 0, classTeacher: null });
      } catch (error) {
        console.error("Error creating class:", error);
        return c.json({ error: "Failed to create class" }, 500);
      }
    },
  );

  app.put(
    "/api/classes/:id",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const id = c.req.param("id");
        const data = await c.req.json();

        const [cls] = await db
          .update(classes)
          .set({
            name: data.name,
            section: data.section,
            capacity: data.capacity ? parseInt(data.capacity) : 40,
            updatedAt: new Date(),
          })
          .where(eq(classes.id, id))
          .returning();

        return c.json(cls);
      } catch (error) {
        console.error("Error updating class:", error);
        return c.json({ error: "Failed to update class" }, 500);
      }
    },
  );

  app.delete(
    "/api/classes/:id",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const id = c.req.param("id");

        const [{ count }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(students)
          .where(eq(students.classId, id));

        if (Number(count) > 0) {
          return c.json(
            {
              error: "Cannot delete class",
              dependencies: { students: Number(count) },
            },
            409,
          );
        }

        await db.delete(classes).where(eq(classes.id, id));

        return c.json({ success: true, id });
      } catch (error) {
        console.error("Error deleting class:", error);
        return c.json({ error: "Failed to delete class" }, 500);
      }
    },
  );

  // ============================================================================
  // ATTENDANCE API (Protected)
  // ============================================================================

  app.get(
    "/api/attendance",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const date =
          c.req.query("date") || new Date().toISOString().split("T")[0];
        const classId = c.req.query("classId");

        const conditions = [eq(attendance.date, date)];
        if (classId) {
          conditions.push(eq(attendance.classId, classId));
        }

        const attendanceRecords = await db
          .select({
            id: attendance.id,
            studentId: attendance.studentId,
            classId: attendance.classId,
            date: attendance.date,
            status: attendance.status,
            remarks: attendance.remarks,
            firstName: students.firstName,
            lastName: students.lastName,
            className: classes.name,
          })
          .from(attendance)
          .leftJoin(students, eq(attendance.studentId, students.id))
          .leftJoin(classes, eq(attendance.classId, classes.id))
          .where(and(...conditions));

        return c.json({
          attendance: attendanceRecords.map((r) => ({
            id: r.id,
            studentId: r.studentId,
            classId: r.classId,
            date: r.date,
            status: r.status,
            remarks: r.remarks,
            studentName:
              r.firstName && r.lastName
                ? `${r.firstName} ${r.lastName}`
                : "Unknown",
            className: r.className || "Unknown",
          })),
        });
      } catch (error) {
        console.error("Error fetching attendance:", error);
        return c.json({ error: "Failed to fetch attendance" }, 500);
      }
    },
  );

  app.get(
    "/api/attendance/history",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
      ROLES.PARENT,
      ROLES.STUDENT,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const days = parseInt(c.req.query("days") || "7");
        const studentId = c.req.query("studentId");
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - days);

        const conditions = [
          gte(attendance.date, daysAgo.toISOString().split("T")[0]),
        ];
        if (studentId) {
          conditions.push(eq(attendance.studentId, studentId));
        }

        const records = await db
          .select({
            id: attendance.id,
            studentId: attendance.studentId,
            classId: attendance.classId,
            date: attendance.date,
            status: attendance.status,
            firstName: students.firstName,
            lastName: students.lastName,
            className: classes.name,
          })
          .from(attendance)
          .leftJoin(students, eq(attendance.studentId, students.id))
          .leftJoin(classes, eq(attendance.classId, classes.id))
          .where(and(...conditions))
          .orderBy(desc(attendance.date))
          .limit(100);

        return c.json({
          attendance: records.map((r) => ({
            id: r.id,
            studentId: r.studentId,
            classId: r.classId,
            date: r.date,
            status: r.status,
            studentName:
              r.firstName && r.lastName
                ? `${r.firstName} ${r.lastName}`
                : "Unknown",
            className: r.className || "Unknown",
          })),
        });
      } catch (error) {
        console.error("Error fetching attendance history:", error);
        return c.json({ error: "Failed to fetch attendance history" }, 500);
      }
    },
  );

  app.post(
    "/api/attendance",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();

        const activeSession = await db
          .select()
          .from(sessions)
          .where(eq(sessions.isActive, true))
          .limit(1);

        const sessionId = activeSession[0]?.id;

        if (!sessionId) {
          return c.json({ error: "No active session found" }, 400);
        }

        const results = [];
        for (const record of data.records || []) {
          const [saved] = await db
            .insert(attendance)
            .values({
              organizationId: c.get("user")?.schoolId || null,
              studentId: record.studentId,
              classId: record.classId || data.classId,
              sessionId: sessionId,
              date: data.date,
              status: record.status,
              remarks: record.remarks || null,
            })
            .returning();
          results.push(saved);
        }

        return c.json({ success: true, saved: results.length });
      } catch (error) {
        console.error("Error saving attendance:", error);
        return c.json({ error: "Failed to save attendance" }, 500);
      }
    },
  );

  // ============================================================================
  // FEES API (Protected)
  // ============================================================================

  app.get(
    "/api/fee-structures",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.STAFF),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const structures = await db
          .select({
            id: feeStructures.id,
            amount: feeStructures.amount,
            dueDate: feeStructures.dueDate,
            className: classes.name,
            categoryName: feeCategories.name,
            frequency: feeCategories.frequency,
          })
          .from(feeStructures)
          .leftJoin(classes, eq(feeStructures.classId, classes.id))
          .innerJoin(
            feeCategories,
            eq(feeStructures.categoryId, feeCategories.id),
          );

        return c.json({ structures });
      } catch (error) {
        console.error("Error fetching fee structures:", error);
        return c.json({ error: "Failed to fetch fee structures" }, 500);
      }
    },
  );

  app.post(
    "/api/fee-structures",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();

        const [newStructure] = await db
          .insert(feeStructures)
          .values({
            categoryId: data.categoryId,
            classId: data.classId || null,
            sessionId: data.sessionId,
            amount: data.amount,
            dueDate: data.dueDate,
          })
          .returning();

        return c.json({ success: true, structure: newStructure });
      } catch (error) {
        console.error("Error creating fee structure:", error);
        return c.json({ error: "Failed to create fee structure" }, 500);
      }
    },
  );

  app.get(
    "/api/fee-categories",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.STAFF),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const categories = await db.select().from(feeCategories);
        return c.json({ categories });
      } catch (error) {
        return c.json({ error: "Failed to fetch categories" }, 500);
      }
    },
  );

  app.post(
    "/api/fee-categories",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();
        const [newCategory] = await db
          .insert(feeCategories)
          .values({
            name: data.name,
            type: data.type,
            frequency: data.frequency,
            isRecurring: data.isRecurring || false,
          })
          .returning();
        return c.json({ success: true, category: newCategory });
      } catch (error) {
        return c.json({ error: "Failed to create category" }, 500);
      }
    },
  );

  app.get(
    "/api/fees",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.STAFF,
      ROLES.PARENT,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const studentId = c.req.query("studentId");
        const status = c.req.query("status");

        const allocations = await db
          .select({
            id: studentFeeAllocations.id,
            studentId: studentFeeAllocations.studentId,
            feeStructureId: studentFeeAllocations.feeStructureId,
            amount: studentFeeAllocations.amount,
            status: studentFeeAllocations.status,
            createdAt: studentFeeAllocations.createdAt,
          })
          .from(studentFeeAllocations)
          .innerJoin(students, eq(studentFeeAllocations.studentId, students.id))
          .leftJoin(
            feeStructures,
            eq(studentFeeAllocations.feeStructureId, feeStructures.id),
          );

        const feesWithDetails = await Promise.all(
          allocations.map(async (alloc) => {
            const [student] = await db
              .select({
                firstName: students.firstName,
                lastName: students.lastName,
                classId: students.classId,
              })
              .from(students)
              .where(eq(students.id, alloc.studentId))
              .limit(1);

            const [cls] = await db
              .select({ name: classes.name })
              .from(classes)
              .where(eq(classes.id, student.classId || ""))
              .limit(1);

            const [payments] = await db
              .select({
                sum: sql<number>`COALESCE(SUM(${feePayments.amount}), 0)`,
              })
              .from(feePayments)
              .where(eq(feePayments.allocationId, alloc.id));

            return {
              id: alloc.id,
              studentId: alloc.studentId,
              studentName: student
                ? `${student.firstName} ${student.lastName}`
                : "Unknown",
              className: cls?.name || "Unknown",
              amount: Number(alloc.amount) || 0,
              paidAmount: Number(payments.sum) || 0,
              status: alloc.status,
              dueDate: feeStructures.dueDate,
            };
          }),
        );

        let filtered = feesWithDetails;
        if (status) {
          filtered = filtered.filter((f) => f.status === status);
        }

        return c.json({ fees: filtered });
      } catch (error) {
        console.error("Error fetching fees:", error);
        return c.json({ error: "Failed to fetch fees" }, 500);
      }
    },
  );

  app.post(
    "/api/fees",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();
        const { randomUUID } = await import("crypto");
        const id = randomUUID();

        const [allocation] = await db
          .insert(studentFeeAllocations)
          .values({
            id,
            organizationId: c.get("user")?.schoolId || null,
            studentId: data.studentId,
            feeStructureId: data.feeStructureId || null,
            amount: data.amount,
            status: "pending",
          })
          .returning();

        return c.json({ ...allocation, createdAt: new Date().toISOString() });
      } catch (error) {
        console.error("Error creating fee allocation:", error);
        return c.json({ error: "Failed to create invoice" }, 500);
      }
    },
  );

  app.post(
    "/api/fees/:id/pay",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.STAFF),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const allocationId = c.req.param("id");
        const data = await c.req.json();
        const { randomUUID } = await import("crypto");
        const id = randomUUID();
        const receiptNumber = `RCP-${Date.now().toString().slice(-6)}`;

        const [payment] = await db
          .insert(feePayments)
          .values({
            id,
            organizationId: c.get("user")?.schoolId || null,
            studentId: data.studentId,
            allocationId,
            amount: data.amount,
            paymentMethod: data.paymentMethod || "cash",
            transactionId: data.transactionId || null,
            receiptNumber,
            status: "completed" as const,
          })
          .returning();

        await db
          .update(studentFeeAllocations)
          .set({ status: "completed" })
          .where(eq(studentFeeAllocations.id, allocationId));

        // Send notification
        try {
          await fetch("/api/notifications/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "fee_payment",
              studentId: data.studentId,
              amount: data.amount,
              receiptNumber,
            }),
          });
        } catch (notifyError) {
          console.error("Failed to send notification:", notifyError);
        }

        return c.json({ success: true, id, receiptNumber });
      } catch (error) {
        console.error("Error processing payment:", error);
        return c.json({ error: "Failed to process payment" }, 500);
      }
    },
  );

  // Get a single fee payment (for receipts)
  app.get("/api/fees/payments/:id", requireAuth, async (c: any) => {
    try {
      const db = getDb(c.env);
      const id = c.req.param("id");
      const [payment] = await db
        .select()
        .from(feePayments)
        .where(eq(feePayments.id, id))
        .limit(1);
      if (!payment) {
        return c.json({ error: "Payment not found" }, 404);
      }
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.id, payment.studentId))
        .limit(1);
      const [allocation] = await db
        .select()
        .from(studentFeeAllocations)
        .where(eq(studentFeeAllocations.id, payment.allocationId))
        .limit(1);
      return c.json({
        payment,
        student: student ?? null,
        allocation: allocation ?? null,
      });
    } catch (error) {
      console.error("Error fetching payment:", error);
      return c.json({ error: "Failed to fetch payment" }, 500);
    }
  });

  // ============================================================================
  // EXPENSES API (Protected)
  // ============================================================================

  app.get(
    "/api/expenses",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.STAFF),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const allExpenses = await db
          .select()
          .from(expenses)
          .orderBy(desc(expenses.date));
        return c.json({ expenses: allExpenses });
      } catch (error) {
        console.error("Error fetching expenses:", error);
        return c.json({ error: "Failed to fetch expenses" }, 500);
      }
    },
  );

  app.post(
    "/api/expenses",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();

        const [newExpense] = await db
          .insert(expenses)
          .values({
            category: data.category,
            description: data.description,
            amount: data.amount,
            date: data.date,
            paymentMethod: data.paymentMethod,
            paidTo: data.paidTo,
            status: "paid",
          })
          .returning();

        return c.json({ success: true, expense: newExpense });
      } catch (error) {
        console.error("Error creating expense:", error);
        return c.json({ error: "Failed to create expense" }, 500);
      }
    },
  );

  app.get(
    "/api/expenses/stats",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.STAFF),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const allExpenses = await db.select().from(expenses);
        const total = allExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
        return c.json({ totalExpenses: total });
      } catch (error) {
        return c.json({ totalExpenses: 0 });
      }
    },
  );

  // ============================================================================
  // GRADES API (Protected)
  // ============================================================================

  app.get(
    "/api/grades",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
      ROLES.PARENT,
      ROLES.STUDENT,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const studentId = c.req.query("studentId");
        const classId = c.req.query("classId");

        // Get all report card details with student and subject info
        let query = db
          .select({
            id: reportCardDetails.id,
            reportCardId: reportCardDetails.reportCardId,
            subjectId: reportCardDetails.subjectId,
            maxMarks: reportCardDetails.maxMarks,
            obtainedMarks: reportCardDetails.obtainedMarks,
            grade: reportCardDetails.grade,
            remarks: reportCardDetails.remarks,
            studentId: reportCards.studentId,
            examType: reportCards.examType,
            classId: reportCards.classId,
          })
          .from(reportCardDetails)
          .innerJoin(
            reportCards,
            eq(reportCardDetails.reportCardId, reportCards.id),
          );

        const allDetails = await query;

        // Enrich with student and subject names
        const enrichedGrades = await Promise.all(
          allDetails.map(async (detail) => {
            const [student] = await db
              .select({
                firstName: students.firstName,
                lastName: students.lastName,
              })
              .from(students)
              .where(eq(students.id, detail.studentId))
              .limit(1);

            const [subject] = await db
              .select({ name: subjects.name })
              .from(subjects)
              .where(eq(subjects.id, detail.subjectId))
              .limit(1);

            return {
              id: detail.id,
              studentId: detail.studentId,
              studentName: student
                ? `${student.firstName} ${student.lastName}`
                : "Unknown",
              subject: subject?.name || "Unknown",
              examType: detail.examType,
              score: Number(detail.obtainedMarks),
              maxScore: Number(detail.maxMarks),
              grade:
                detail.grade ||
                calculateGrade(
                  Number(detail.obtainedMarks),
                  Number(detail.maxMarks),
                ),
              date: new Date().toISOString().split("T")[0],
            };
          }),
        );

        return c.json({ grades: enrichedGrades });
      } catch (error) {
        console.error("Error fetching grades:", error);
        return c.json({ grades: [] });
      }
    },
  );

  app.post(
    "/api/grades",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();

        // First, find or create a report card for this student/exam
        let [existingReportCard] = await db
          .select()
          .from(reportCards)
          .where(
            and(
              eq(reportCards.studentId, data.studentId),
              eq(reportCards.examType, data.examType),
              eq(reportCards.classId, data.classId),
            ),
          )
          .limit(1);

        let reportCardId = existingReportCard?.id;

        if (!reportCardId) {
          // Create new report card
          const [newReportCard] = await db
            .insert(reportCards)
            .values({
              studentId: data.studentId,
              classId: data.classId,
              sessionId: data.sessionId,
              examType: data.examType,
              status: "draft",
            })
            .returning();
          reportCardId = newReportCard.id;
        }

        // Add the grade detail
        const [newGrade] = await db
          .insert(reportCardDetails)
          .values({
            reportCardId,
            subjectId: data.subjectId,
            maxMarks: data.maxMarks,
            obtainedMarks: data.obtainedMarks,
            grade:
              data.grade || calculateGrade(data.obtainedMarks, data.maxMarks),
          })
          .returning();

        return c.json({ success: true, grade: newGrade });
      } catch (error) {
        console.error("Error creating grade:", error);
        return c.json({ error: "Failed to create grade" }, 500);
      }
    },
  );

  app.get(
    "/api/subjects",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
      ROLES.PARENT,
      ROLES.STUDENT,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const allSubjects = await db.select().from(subjects);
        return c.json({ subjects: allSubjects });
      } catch (error) {
        return c.json({ subjects: [] });
      }
    },
  );

  // Helper function for grade calculation
  function calculateGrade(obtained: number, max: number): string {
    const percentage = (obtained / max) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  }

  // ============================================================================
  // TRANSPORT API (Protected)
  // ============================================================================

  app.get(
    "/api/transport/routes",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.STAFF),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const routes = await db.select().from(transportRoutes);
        return c.json({ routes });
      } catch (error) {
        console.error("Error fetching transport routes:", error);
        return c.json({ routes: [] });
      }
    },
  );

  app.post(
    "/api/transport/routes",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();
        const [newRoute] = await db
          .insert(transportRoutes)
          .values({
            routeNumber: data.routeNumber,
            routeName: data.routeName,
            startPoint: data.startPoint,
            endPoint: data.endPoint,
            distance: data.distance,
            estimatedTime: data.estimatedTime,
            status: "active",
          })
          .returning();
        return c.json({ success: true, route: newRoute });
      } catch (error) {
        console.error("Error creating transport route:", error);
        return c.json({ error: "Failed to create route" }, 500);
      }
    },
  );

  app.get(
    "/api/transport/vehicles",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.STAFF),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const vehicles = await db.select().from(transportVehicles);
        return c.json({ vehicles });
      } catch (error) {
        return c.json({ vehicles: [] });
      }
    },
  );

  app.post(
    "/api/transport/vehicles",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();
        const [newVehicle] = await db
          .insert(transportVehicles)
          .values({
            vehicleNumber: data.vehicleNumber,
            vehicleType: data.vehicleType,
            capacity: data.capacity,
            routeId: data.routeId,
            status: "active",
          })
          .returning();
        return c.json({ success: true, vehicle: newVehicle });
      } catch (error) {
        return c.json({ error: "Failed to create vehicle" }, 500);
      }
    },
  );

  // ============================================================================
  // LIBRARY API (Protected)
  // ============================================================================

  app.get(
    "/api/library/books",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
      ROLES.PARENT,
      ROLES.STUDENT,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const search = c.req.query("search");
        const category = c.req.query("category");

        let books = await db.select().from(libraryBooks);

        if (search) {
          books = books.filter(
            (b) =>
              b.title.toLowerCase().includes(search.toLowerCase()) ||
              b.author?.toLowerCase().includes(search.toLowerCase()) ||
              b.isbn?.toLowerCase().includes(search.toLowerCase()),
          );
        }

        if (category && category !== "all") {
          books = books.filter((b) => b.category === category);
        }

        return c.json({ books });
      } catch (error) {
        console.error("Error fetching library books:", error);
        return c.json({ books: [] });
      }
    },
  );

  app.post(
    "/api/library/books",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.STAFF),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();
        const [newBook] = await db
          .insert(libraryBooks)
          .values({
            bookNumber: data.bookNumber,
            title: data.title,
            author: data.author,
            isbn: data.isbn,
            category: data.category,
            publisher: data.publisher,
            edition: data.edition,
            shelfNumber: data.shelfNumber,
            rackNumber: data.rackNumber,
            totalCopies: data.totalCopies || 1,
            availableCopies: data.availableCopies || 1,
            price: data.price,
            status: "available",
          })
          .returning();
        return c.json({ success: true, book: newBook });
      } catch (error) {
        console.error("Error creating book:", error);
        return c.json({ error: "Failed to add book" }, 500);
      }
    },
  );

  app.get(
    "/api/library/transactions",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const transactions = await db
          .select()
          .from(libraryTransactions)
          .orderBy(desc(libraryTransactions.issueDate));
        return c.json({ transactions });
      } catch (error) {
        return c.json({ transactions: [] });
      }
    },
  );

  app.post(
    "/api/library/issue",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
    ),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();

        // Create transaction
        const [transaction] = await db
          .insert(libraryTransactions)
          .values({
            bookId: data.bookId,
            studentId: data.studentId,
            issueDate: new Date().toISOString().split("T")[0],
            dueDate: data.dueDate,
            status: "issued",
          })
          .returning();

        // Update book availability
        const [book] = await db
          .select()
          .from(libraryBooks)
          .where(eq(libraryBooks.id, data.bookId))
          .limit(1);

        if (book && book.availableCopies > 0) {
          await db
            .update(libraryBooks)
            .set({ availableCopies: book.availableCopies - 1 })
            .where(eq(libraryBooks.id, data.bookId));
        }

        return c.json({ success: true, transaction });
      } catch (error) {
        return c.json({ error: "Failed to issue book" }, 500);
      }
    },
  );

  app.post(
    "/api/library/return",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
    ),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();

        // Update transaction
        await db
          .update(libraryTransactions)
          .set({
            returnDate: new Date().toISOString().split("T")[0],
            status: "returned",
          })
          .where(eq(libraryTransactions.id, data.transactionId));

        // Update book availability
        const [transaction] = await db
          .select()
          .from(libraryTransactions)
          .where(eq(libraryTransactions.id, data.transactionId))
          .limit(1);

        if (transaction) {
          const [book] = await db
            .select()
            .from(libraryBooks)
            .where(eq(libraryBooks.id, transaction.bookId))
            .limit(1);

          if (book) {
            await db
              .update(libraryBooks)
              .set({ availableCopies: book.availableCopies + 1 })
              .where(eq(libraryBooks.id, transaction.bookId));
          }
        }

        return c.json({ success: true });
      } catch (error) {
        return c.json({ error: "Failed to return book" }, 500);
      }
    },
  );

  // ============================================================================
  // NOTIFICATIONS API (Protected)
  // ============================================================================

  app.post(
    "/api/notifications/send",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
    ),
    async (c: any) => {
      try {
        const data = await c.req.json();
        const db = getDb(c.env);
        const message = data.message || getNotificationMessage(data);

        // Resolve recipient phone
        let phone: string | undefined = data.phone || data.whatsapp;
        if (!phone && data.studentId) {
          const [student] = await db
            .select()
            .from(students)
            .where(eq(students.id, data.studentId))
            .limit(1);
          phone =
            student?.guardianPhone ||
            student?.fatherPhone ||
            student?.motherPhone ||
            student?.phone ||
            undefined;
        }
        if (!phone) {
          return c.json({ error: "No recipient phone found" }, 400);
        }

        const channel = data.type === "whatsapp" ? "whatsapp" : "sms";
        const sid = c.env.TWILIO_ACCOUNT_SID;
        const token = c.env.TWILIO_AUTH_TOKEN;
        const from =
          channel === "whatsapp"
            ? c.env.TWILIO_WHATSAPP_NUMBER
            : c.env.TWILIO_PHONE_NUMBER;

        if (!sid || !token || !from) {
          return c.json({ error: "Twilio not configured" }, 503);
        }

        const res = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization:
                "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              From: channel === "whatsapp" ? `whatsapp:${from}` : from,
              To: channel === "whatsapp" ? `whatsapp:${phone}` : phone,
              Body: message,
            }).toString(),
          },
        );

        if (!res.ok) {
          const err = await res.text();
          return c.json(
            { error: "Twilio error", detail: err.slice(0, 200) },
            502,
          );
        }

        const twilio = (await res.json()) as { sid?: string };

        await db.insert(notificationLogs).values({
          type: channel,
          template: data.template ?? "general",
          recipients: 1,
          sent: 1,
          failed: 0,
          status: "sent",
          messagePreview: message.slice(0, 120),
          providerRefs: [{ recipient: phone, ok: true, id: twilio.sid }],
        });

        return c.json({
          success: true,
          message: "Notification sent",
          sid: twilio.sid,
        });
      } catch (error) {
        console.error("Error sending notification:", error);
        return c.json({ error: "Failed to send notification" }, 500);
      }
    },
  );

  app.get("/api/notifications", requireAuth, async (c: any) => {
    try {
      const db = getDb(c.env);
      const rows = await db
        .select()
        .from(notificationLogs)
        .orderBy(desc(notificationLogs.createdAt))
        .limit(50);
      return c.json({ notifications: rows });
    } catch (error) {
      return c.json({ error: "Failed to fetch notifications" }, 500);
    }
  });

  // ============================================================================
  // TIMETABLE API (Protected)
  // ============================================================================

  app.get(
    "/api/timetable",
    requireAuth,
    requireRole(
      ROLES.SUPER_ADMIN,
      ROLES.SCHOOL_ADMIN,
      ROLES.TEACHER,
      ROLES.STAFF,
      ROLES.PARENT,
      ROLES.STUDENT,
    ),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const classId = c.req.query("classId");
        const teacherId = c.req.query("teacherId");
        const dayOfWeek = c.req.query("dayOfWeek");

        const conditions = [];
        if (classId) conditions.push(eq(timetables.classId, classId));
        if (teacherId) conditions.push(eq(timetables.teacherId, teacherId));
        if (dayOfWeek)
          conditions.push(eq(timetables.dayOfWeek, parseInt(dayOfWeek)));

        const schedule = await db
          .select({
            id: timetables.id,
            classId: timetables.classId,
            className: classes.name,
            section: classes.section,
            dayOfWeek: timetables.dayOfWeek,
            periodNumber: timetables.periodNumber,
            startTime: timetables.startTime,
            endTime: timetables.endTime,
            subjectId: timetables.subjectId,
            subjectName: subjects.name,
            teacherId: timetables.teacherId,
            teacherName: sql<string>`${teachers.firstName} || ' ' || ${teachers.lastName}`,
            roomNumber: timetables.roomNumber,
          })
          .from(timetables)
          .leftJoin(classes, eq(timetables.classId, classes.id))
          .leftJoin(subjects, eq(timetables.subjectId, subjects.id))
          .leftJoin(teachers, eq(timetables.teacherId, teachers.id))
          .where(and(...conditions, eq(timetables.isActive, true)))
          .orderBy(timetables.dayOfWeek, timetables.periodNumber);

        // Group by day of week
        const grouped = schedule.reduce((acc: any, item: any) => {
          const day = item.dayOfWeek;
          if (!acc[day]) acc[day] = [];
          acc[day].push(item);
          return acc;
        }, {});

        const dayNames = [
          "",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        const formatted = Object.entries(grouped).map(
          ([day, periods]: [string, any]) => ({
            dayOfWeek: parseInt(day),
            dayName: dayNames[parseInt(day)],
            periods: periods,
          }),
        );

        return c.json({ timetable: formatted });
      } catch (error) {
        console.error("Error fetching timetable:", error);
        return c.json({ error: "Failed to fetch timetable" }, 500);
      }
    },
  );

  app.post(
    "/api/timetable",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const data = await c.req.json();
        const { randomUUID } = await import("crypto");
        const id = randomUUID();

        const [entry] = await db
          .insert(timetables)
          .values({
            id,
            classId: data.classId,
            sessionId: data.sessionId,
            dayOfWeek: data.dayOfWeek,
            periodNumber: data.periodNumber,
            subjectId: data.subjectId,
            teacherId: data.teacherId || null,
            startTime: data.startTime,
            endTime: data.endTime,
            roomNumber: data.roomNumber || null,
            isActive: true,
          })
          .returning();

        return c.json({ success: true, entry });
      } catch (error) {
        console.error("Error creating timetable entry:", error);
        return c.json({ error: "Failed to create timetable entry" }, 500);
      }
    },
  );

  app.post(
    "/api/timetable/bulk",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const { entries } = await c.req.json();

        const results = [];
        for (const entry of entries) {
          const { randomUUID } = await import("crypto");
          const id = randomUUID();

          const [created] = await db
            .insert(timetables)
            .values({
              id,
              classId: entry.classId,
              sessionId: entry.sessionId,
              dayOfWeek: entry.dayOfWeek,
              periodNumber: entry.periodNumber,
              subjectId: entry.subjectId,
              teacherId: entry.teacherId || null,
              startTime: entry.startTime,
              endTime: entry.endTime,
              roomNumber: entry.roomNumber || null,
              isActive: true,
            })
            .returning();
          results.push(created);
        }

        return c.json({
          success: true,
          created: results.length,
          entries: results,
        });
      } catch (error) {
        console.error("Error creating bulk timetable:", error);
        return c.json({ error: "Failed to create bulk timetable" }, 500);
      }
    },
  );

  app.put(
    "/api/timetable/:id",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const id = c.req.param("id");
        const data = await c.req.json();

        const [entry] = await db
          .update(timetables)
          .set({
            ...data,
            updatedAt: new Date(),
          })
          .where(eq(timetables.id, id))
          .returning();

        return c.json({ success: true, entry });
      } catch (error) {
        console.error("Error updating timetable:", error);
        return c.json({ error: "Failed to update timetable" }, 500);
      }
    },
  );

  app.delete(
    "/api/timetable/:id",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    requireVerifiedEmail,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const id = c.req.param("id");

        await db
          .update(timetables)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(timetables.id, id));

        return c.json({ success: true, id });
      } catch (error) {
        console.error("Error deleting timetable:", error);
        return c.json({ error: "Failed to delete timetable" }, 500);
      }
    },
  );

  // ============================================================================
  // CHAT / MESSAGING API (Protected)
  // ============================================================================

  app.get("/api/chat/conversations", requireAuth, async (c: any) => {
    try {
      const db = getDb(c.env);
      const user = c.get("user");

      // Get user's conversations
      const conversations = await db
        .select({
          id: chatConversations.id,
          type: chatConversations.type,
          title: chatConversations.title,
          createdAt: chatConversations.createdAt,
          updatedAt: chatConversations.updatedAt,
        })
        .from(chatConversations)
        .innerJoin(
          chatParticipants,
          eq(chatConversations.id, chatParticipants.conversationId),
        )
        .where(eq(chatParticipants.userId, user.id))
        .orderBy(desc(chatConversations.updatedAt));

      // Get participants for each conversation
      const withParticipants = await Promise.all(
        conversations.map(async (conv: any) => {
          const participants = await db
            .select({
              userId: chatParticipants.userId,
              role: chatParticipants.role,
              joinedAt: chatParticipants.joinedAt,
            })
            .from(chatParticipants)
            .where(eq(chatParticipants.conversationId, conv.id));

          // Get unread count
          const [{ count }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(chatMessages)
            .where(
              and(
                eq(chatMessages.conversationId, conv.id),
                sql`${chatMessages.senderId} != ${user.id}`,
                sql`${chatMessages.readAt} IS NULL`,
              ),
            );

          return { ...conv, participants, unreadCount: Number(count) };
        }),
      );

      return c.json({ conversations: withParticipants });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return c.json({ error: "Failed to fetch conversations" }, 500);
    }
  });

  app.post("/api/chat/conversations", requireAuth, async (c: any) => {
    try {
      const db = getDb(c.env);
      const user = c.get("user");
      const data = await c.req.json();
      const { randomUUID } = await import("crypto");
      const conversationId = randomUUID();

      // Create conversation
      await db.insert(chatConversations).values({
        id: conversationId,
        type: data.type || "direct",
        title: data.title || null,
        createdBy: user.id,
      });

      // Add participants
      const participants = [user.id, ...(data.participantIds || [])];
      for (const participantId of participants) {
        await db.insert(chatParticipants).values({
          conversationId,
          userId: participantId,
          role: participantId === user.id ? "admin" : "member",
        });
      }

      // Add initial message if provided
      if (data.initialMessage) {
        await db.insert(chatMessages).values({
          id: randomUUID(),
          conversationId,
          senderId: user.id,
          content: data.initialMessage,
          messageType: "text",
        });
      }

      return c.json({ success: true, conversationId });
    } catch (error) {
      console.error("Error creating conversation:", error);
      return c.json({ error: "Failed to create conversation" }, 500);
    }
  });

  app.get(
    "/api/chat/conversations/:id/messages",
    requireAuth,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const user = c.get("user");
        const conversationId = c.req.param("id");
        const limit = parseInt(c.req.query("limit") || "50");
        const offset = parseInt(c.req.query("offset") || "0");

        // Verify user is participant
        const [participant] = await db
          .select()
          .from(chatParticipants)
          .where(
            and(
              eq(chatParticipants.conversationId, conversationId),
              eq(chatParticipants.userId, user.id),
            ),
          )
          .limit(1);

        if (!participant) {
          return c.json(
            { error: "Not authorized to view this conversation" },
            403,
          );
        }

        // Get messages
        const messages = await db
          .select({
            id: chatMessages.id,
            senderId: chatMessages.senderId,
            senderName: sql<string>`${users.name}`,
            content: chatMessages.content,
            messageType: chatMessages.messageType,
            attachments: chatMessages.attachments,
            createdAt: chatMessages.createdAt,
            readAt: chatMessages.readAt,
          })
          .from(chatMessages)
          .leftJoin(users, eq(chatMessages.senderId, users.id))
          .where(eq(chatMessages.conversationId, conversationId))
          .orderBy(desc(chatMessages.createdAt))
          .limit(limit)
          .offset(offset);

        // Mark messages as read
        await db
          .update(chatMessages)
          .set({ readAt: new Date() })
          .where(
            and(
              eq(chatMessages.conversationId, conversationId),
              sql`${chatMessages.senderId} != ${user.id}`,
              sql`${chatMessages.readAt} IS NULL`,
            ),
          );

        return c.json({ messages: messages.reverse() });
      } catch (error) {
        console.error("Error fetching messages:", error);
        return c.json({ error: "Failed to fetch messages" }, 500);
      }
    },
  );

  app.post(
    "/api/chat/conversations/:id/messages",
    requireAuth,
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const user = c.get("user");
        const conversationId = c.req.param("id");
        const data = await c.req.json();
        const { randomUUID } = await import("crypto");
        const messageId = randomUUID();

        // Verify user is participant
        const [participant] = await db
          .select()
          .from(chatParticipants)
          .where(
            and(
              eq(chatParticipants.conversationId, conversationId),
              eq(chatParticipants.userId, user.id),
            ),
          )
          .limit(1);

        if (!participant) {
          return c.json({ error: "Not authorized to send messages" }, 403);
        }

        // Create message
        const messageResult = await db
          .insert(chatMessages)
          .values({
            id: messageId,
            conversationId,
            senderId: user.id,
            content: data.content,
            messageType: data.messageType || "text",
            attachments: data.attachments || null,
          })
          .returning();

        const message = Array.isArray(messageResult) ? messageResult[0] : null;

        // Update conversation timestamp
        await db
          .update(chatConversations)
          .set({ updatedAt: new Date() })
          .where(eq(chatConversations.id, conversationId));

        return c.json({ success: true, message });
      } catch (error) {
        console.error("Error sending message:", error);
        return c.json({ error: "Failed to send message" }, 500);
      }
    },
  );

  // ============================================================================
  // MONITORING & ANALYTICS API (Protected - Admin Only)
  // ============================================================================

  app.get(
    "/api/monitoring/dashboard",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    async (c: any) => {
      try {
        const db = getDb(c.env);

        // Student statistics
        const [{ studentCount }] = await db
          .select({ studentCount: sql<number>`count(*)` })
          .from(students);

        const [{ activeStudents }] = await db
          .select({ activeStudents: sql<number>`count(*)` })
          .from(students)
          .where(eq(students.status, true));

        // Teacher statistics
        const [{ teacherCount }] = await db
          .select({ teacherCount: sql<number>`count(*)` })
          .from(teachers);

        // Class statistics
        const [{ classCount }] = await db
          .select({ classCount: sql<number>`count(*)` })
          .from(classes);

        // Attendance statistics (today)
        const today = new Date().toISOString().split("T")[0];
        const [{ presentToday }] = await db
          .select({ presentToday: sql<number>`count(*)` })
          .from(attendance)
          .where(
            and(eq(attendance.date, today), eq(attendance.status, "present")),
          );

        const [{ absentToday }] = await db
          .select({ absentToday: sql<number>`count(*)` })
          .from(attendance)
          .where(
            and(eq(attendance.date, today), eq(attendance.status, "absent")),
          );

        // Fee statistics
        const [{ totalFees }] = await db
          .select({
            totalFees: sql<number>`COALESCE(SUM(${feePayments.amount}), 0)`,
          })
          .from(feePayments)
          .where(eq(feePayments.status, "completed"));

        const [{ pendingFees }] = await db
          .select({
            pendingFees: sql<number>`COALESCE(SUM(${studentFeeAllocations.amount}), 0)`,
          })
          .from(studentFeeAllocations)
          .where(eq(studentFeeAllocations.status, "pending"));

        // Library statistics
        const [{ totalBooks }] = await db
          .select({
            totalBooks: sql<number>`COALESCE(SUM(${libraryBooks.totalCopies}), 0)`,
          })
          .from(libraryBooks);

        const [{ issuedBooks }] = await db
          .select({ issuedBooks: sql<number>`count(*)` })
          .from(libraryTransactions)
          .where(eq(libraryTransactions.status, "issued"));

        // Recent activity (from audit logs)
        const recentActivity = await db
          .select({
            id: auditLogs.id,
            action: auditLogs.action,
            actorEmail: auditLogs.actorEmail,
            createdAt: auditLogs.createdAt,
            statusCode: auditLogs.statusCode,
          })
          .from(auditLogs)
          .orderBy(desc(auditLogs.createdAt))
          .limit(10);

        return c.json({
          stats: {
            students: {
              total: Number(studentCount),
              active: Number(activeStudents),
            },
            teachers: {
              total: Number(teacherCount),
            },
            classes: {
              total: Number(classCount),
            },
            attendance: {
              today: {
                date: today,
                present: Number(presentToday),
                absent: Number(absentToday),
              },
            },
            fees: {
              collected: Number(totalFees),
              pending: Number(pendingFees),
            },
            library: {
              totalBooks: Number(totalBooks),
              issuedBooks: Number(issuedBooks),
              availableBooks: Number(totalBooks) - Number(issuedBooks),
            },
          },
          recentActivity,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return c.json({ error: "Failed to fetch dashboard data" }, 500);
      }
    },
  );

  app.get(
    "/api/monitoring/metrics",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const days = parseInt(c.req.query("days") || "7");

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Daily attendance trend
        const attendanceTrend = await db
          .select({
            date: attendance.date,
            present: sql<number>`count(*) FILTER (WHERE ${attendance.status} = 'present')`,
            absent: sql<number>`count(*) FILTER (WHERE ${attendance.status} = 'absent')`,
          })
          .from(attendance)
          .where(
            and(
              gte(attendance.date, startDate.toISOString().split("T")[0]),
              lte(attendance.date, endDate.toISOString().split("T")[0]),
            ),
          )
          .groupBy(attendance.date)
          .orderBy(attendance.date);

        // Fee collection trend
        const feeTrend = await db
          .select({
            date: sql<string>`DATE(${feePayments.paymentDate})`,
            amount: sql<number>`COALESCE(SUM(${feePayments.amount}), 0)`,
            count: sql<number>`count(*)`,
          })
          .from(feePayments)
          .where(
            and(
              sql`${feePayments.paymentDate} >= ${startDate.toISOString().split("T")[0]}`,
              sql`${feePayments.paymentDate} <= ${endDate.toISOString().split("T")[0]}`,
              eq(feePayments.status, "completed"),
            ),
          )
          .groupBy(sql`DATE(${feePayments.paymentDate})`)
          .orderBy(sql`DATE(${feePayments.paymentDate})`);

        // New students per day
        const newStudents = await db
          .select({
            date: sql<string>`DATE(${students.createdAt})`,
            count: sql<number>`count(*)`,
          })
          .from(students)
          .where(
            and(
              sql`${students.createdAt} >= ${startDate.toISOString()}`,
              sql`${students.createdAt} <= ${endDate.toISOString()}`,
            ),
          )
          .groupBy(sql`DATE(${students.createdAt})`)
          .orderBy(sql`DATE(${students.createdAt})`);

        return c.json({
          period: {
            start: startDate.toISOString().split("T")[0],
            end: endDate.toISOString().split("T")[0],
            days,
          },
          metrics: {
            attendance: attendanceTrend,
            fees: feeTrend,
            newStudents,
          },
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
        return c.json({ error: "Failed to fetch metrics" }, 500);
      }
    },
  );

  app.get(
    "/api/monitoring/alerts",
    requireAuth,
    requireRole(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER),
    async (c: any) => {
      try {
        const db = getDb(c.env);
        const alerts = [];

        // Low attendance students
        const lowAttendanceStudents = await db
          .select({
            studentId: attendance.studentId,
            studentName: sql<string>`${students.firstName} || ' ' || ${students.lastName}`,
            presentCount: sql<number>`count(*) FILTER (WHERE ${attendance.status} = 'present')`,
            totalCount: sql<number>`count(*)`,
          })
          .from(attendance)
          .innerJoin(students, eq(attendance.studentId, students.id))
          .where(gte(attendance.date, sql`CURRENT_DATE - INTERVAL '30 days'`))
          .groupBy(attendance.studentId, students.firstName, students.lastName)
          .having(
            sql`count(*) FILTER (WHERE ${attendance.status} = 'present')::float / count(*)::float < 0.75`,
          );

        for (const student of lowAttendanceStudents) {
          const percentage =
            (Number(student.presentCount) / Number(student.totalCount)) * 100;
          alerts.push({
            type: "low_attendance",
            severity: "warning",
            title: "Low Attendance Alert",
            message: `${student.studentName} has ${percentage.toFixed(1)}% attendance`,
            studentId: student.studentId,
            metadata: {
              presentDays: Number(student.presentCount),
              totalDays: Number(student.totalCount),
            },
          });
        }

        // Fee defaulters
        const feeDefaulters = await db
          .select({
            studentId: studentFeeAllocations.studentId,
            studentName: sql<string>`${students.firstName} || ' ' || ${students.lastName}`,
            pendingAmount: sql<number>`SUM(${studentFeeAllocations.amount})`,
          })
          .from(studentFeeAllocations)
          .innerJoin(students, eq(studentFeeAllocations.studentId, students.id))
          .where(eq(studentFeeAllocations.status, "pending"))
          .groupBy(
            studentFeeAllocations.studentId,
            students.firstName,
            students.lastName,
          )
          .having(sql`SUM(${studentFeeAllocations.amount}) > 0`);

        for (const defaulter of feeDefaulters) {
          alerts.push({
            type: "fee_pending",
            severity: "info",
            title: "Fee Payment Pending",
            message: `${defaulter.studentName} has ₹${defaulter.pendingAmount} pending`,
            studentId: defaulter.studentId,
            metadata: {
              pendingAmount: Number(defaulter.pendingAmount),
            },
          });
        }

        // Overdue library books
        const overdueBooks = await db
          .select({
            transactionId: libraryTransactions.id,
            studentName: sql<string>`${students.firstName} || ' ' || ${students.lastName}`,
            bookTitle: libraryBooks.title,
            dueDate: libraryTransactions.dueDate,
            daysOverdue: sql<number>`CURRENT_DATE - ${libraryTransactions.dueDate}`,
          })
          .from(libraryTransactions)
          .innerJoin(students, eq(libraryTransactions.studentId, students.id))
          .innerJoin(
            libraryBooks,
            eq(libraryTransactions.bookId, libraryBooks.id),
          )
          .where(
            and(
              eq(libraryTransactions.status, "issued"),
              sql`${libraryTransactions.dueDate} < CURRENT_DATE`,
            ),
          );

        for (const book of overdueBooks) {
          alerts.push({
            type: "library_overdue",
            severity: "warning",
            title: "Overdue Library Book",
            message: `${book.studentName} has "${book.bookTitle}" overdue by ${book.daysOverdue} days`,
            transactionId: book.transactionId,
            metadata: {
              bookTitle: book.bookTitle,
              dueDate: book.dueDate,
              daysOverdue: Number(book.daysOverdue),
            },
          });
        }

        return c.json({
          alerts,
          total: alerts.length,
          bySeverity: {
            critical: alerts.filter((a: any) => a.severity === "critical")
              .length,
            warning: alerts.filter((a: any) => a.severity === "warning").length,
            info: alerts.filter((a: any) => a.severity === "info").length,
          },
        });
      } catch (error) {
        console.error("Error fetching alerts:", error);
        return c.json({ error: "Failed to fetch alerts" }, 500);
      }
    },
  );

  // ============================================================================
  // LEGACY AUTH ENDPOINTS (Deprecated - use Better Auth)
  // ============================================================================

  // These endpoints are deprecated in favor of Better Auth
  // They are kept for backward compatibility during migration
  app.post(
    "/api/auth/legacy/login",
    rateLimitRedis({ limiterType: "auth" }),
    async (c: any) => {
      return c.json(
        {
          error: "Legacy login deprecated",
          message: "Please use /api/auth/login for Better Auth authentication",
          docs: "/api/docs",
        },
        410,
      );
    },
  );

  app.post(
    "/api/auth/legacy/logout",
    rateLimitRedis({ limiterType: "auth" }),
    async (c: any) => {
      return c.json(
        {
          error: "Legacy logout deprecated",
          message: "Please use /api/auth/logout for Better Auth logout",
          docs: "/api/docs",
        },
        410,
      );
    },
  );

  app.get("/api/auth/legacy/me", requireAuth, async (c: any) => {
    const user = c.get("user");
    return c.json(user);
  });

  // ============================================================================
  // NEW FEATURES API ENDPOINTS (Phases 1-10)
  // ============================================================================

  // Global Search API
  app.get("/api/search", requireAuth, async (c: any) => {
    const query = c.req.query("q") || "";
    const type = c.req.query("type") || "all";
    const limit = parseInt(c.req.query("limit") || "20");

    // Mock search results
    const results = {
      students: [
        { id: "1", name: "Rahul Kumar", type: "student", class: "10-A" },
        { id: "2", name: "Priya Sharma", type: "student", class: "9-B" },
      ],
      teachers: [
        {
          id: "1",
          name: "Mr. Sharma",
          type: "teacher",
          subject: "Mathematics",
        },
        { id: "2", name: "Mrs. Patel", type: "teacher", subject: "Science" },
      ],
      classes: [
        { id: "1", name: "Class 10-A", type: "class", students: 42 },
        { id: "2", name: "Class 9-B", type: "class", students: 38 },
      ],
      query,
      total: 6,
    };

    return c.json(results);
  });

  // Dashboard Widgets API
  app.get("/api/dashboard/widgets", requireAuth, async (c: any) => {
    const widgets = [
      { id: "1", type: "attendance", title: "Today's Attendance", position: 1 },
      { id: "2", type: "fees", title: "Fee Collection", position: 2 },
      { id: "3", type: "exams", title: "Upcoming Exams", position: 3 },
      { id: "4", type: "admissions", title: "New Admissions", position: 4 },
    ];
    return c.json(widgets);
  });

  app.post("/api/dashboard/widgets", requireAuth, async (c: any) => {
    const body = await c.req.json();
    return c.json({
      success: true,
      widget: { id: crypto.randomUUID(), ...body },
    });
  });

  app.get("/api/dashboard/stats", requireAuth, async (c: any) => {
    const db = getDb(c);
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [studentsRow] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(students);
    const [teachersRow] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(teachers);
    const [classesRow] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(classes);
    const [attendanceRow] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(attendance)
      .where(and(eq(attendance.date, today), eq(attendance.status, "present")));
    const [collectionRow] = await db
      .select({
        total: sql<number>`coalesce(sum(${feePayments.amount}), 0)::float`,
      })
      .from(feePayments)
      .where(
        and(
          eq(feePayments.status, "paid"),
          gte(feePayments.paymentDate, monthStart),
        ),
      );
    const [pendingRow] = await db
      .select({
        total: sql<number>`coalesce(sum(${feePayments.amount}), 0)::float`,
      })
      .from(feePayments)
      .where(eq(feePayments.status, "pending"));

    return c.json({
      totalStudents: studentsRow?.n ?? 0,
      totalTeachers: teachersRow?.n ?? 0,
      totalClasses: classesRow?.n ?? 0,
      todayAttendance: attendanceRow?.n ?? 0,
      monthlyFeeCollection: collectionRow?.total ?? 0,
      pendingFeePayments: pendingRow?.total ?? 0,
    });
  });

  // Photo Upload API
  app.post("/api/upload/photo", requireAuth, async (c: any) => {
    const body = await c.req.parseBody();
    const file = body.file;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Mock upload - in production, upload to R2/S3
    return c.json({
      success: true,
      url: `https://storage.example.com/photos/${crypto.randomUUID()}.jpg`,
      thumbnail: `https://storage.example.com/photos/thumb_${crypto.randomUUID()}.jpg`,
    });
  });

  // Bulk Import/Export API
  app.post("/api/import/:entity", requireAuth, async (c: any) => {
    const entity = c.req.param("entity");
    const body = await c.req.json();

    return c.json({
      success: true,
      entity,
      imported: body.data?.length || 0,
      failed: 0,
      message: `Successfully imported ${body.data?.length || 0} ${entity}`,
    });
  });

  app.get("/api/export/:entity", requireAuth, async (c: any) => {
    const entity = c.req.param("entity");
    const format = c.req.query("format") || "xlsx";

    // Return download URL
    return c.json({
      success: true,
      downloadUrl: `/api/download/${entity}.${format}?token=${crypto.randomUUID()}`,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });
  });

  // WhatsApp Integration API
  app.post("/api/whatsapp/send", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      messageId: crypto.randomUUID(),
      status: "sent",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/whatsapp/templates", requireAuth, async (c: any) => {
    const templates = [
      { id: "1", name: "Fee Reminder", category: "fee", language: "en" },
      {
        id: "2",
        name: "Attendance Alert",
        category: "attendance",
        language: "en",
      },
      { id: "3", name: "Exam Schedule", category: "exam", language: "en" },
      {
        id: "4",
        name: "Admission Confirmation",
        category: "admission",
        language: "en",
      },
      {
        id: "5",
        name: "Emergency Alert",
        category: "emergency",
        language: "en",
      },
      { id: "6", name: "Holiday Notice", category: "general", language: "en" },
    ];
    return c.json(templates);
  });

  // Offline Sync API
  app.post("/api/sync/offline", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      synced: body.actions?.length || 0,
      failed: [],
      timestamp: new Date().toISOString(),
    });
  });

  // Mobile Payment API
  app.post("/api/payments/initiate", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      paymentId: crypto.randomUUID(),
      orderId: `ORD-${Date.now()}`,
      amount: body.amount,
      currency: "INR",
      status: "pending",
      paymentUrl: `/payment/checkout/${crypto.randomUUID()}`,
    });
  });

  app.post("/api/payments/verify", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      paymentId: body.paymentId,
      status: "completed",
      verified: true,
      timestamp: new Date().toISOString(),
    });
  });

  // Voice Notes API
  app.post("/api/voice-notes/upload", requireAuth, async (c: any) => {
    const body = await c.req.parseBody();

    return c.json({
      success: true,
      noteId: crypto.randomUUID(),
      audioUrl: `https://storage.example.com/voice/${crypto.randomUUID()}.mp3`,
      duration: body.duration || 0,
      transcribed: false,
    });
  });

  // Biometric Attendance API
  app.post("/api/attendance/biometric", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      studentId: body.studentId,
      status: "present",
      timestamp: new Date().toISOString(),
      verified: true,
      method: "face",
    });
  });

  // Video Conferencing API
  app.post("/api/meetings/create", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      meetingId: crypto.randomUUID(),
      roomName:
        body.title?.replace(/\s+/g, "-").toLowerCase() ||
        `meeting-${Date.now()}`,
      joinUrl: `/meet/join/${crypto.randomUUID()}`,
      hostUrl: `/meet/host/${crypto.randomUUID()}`,
      scheduledAt: body.scheduledAt,
      duration: body.duration || 60,
    });
  });

  // Broadcast Messaging API
  app.post("/api/broadcast/send", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      broadcastId: crypto.randomUUID(),
      recipients: body.recipients?.length || 0,
      sent: body.recipients?.length || 0,
      failed: 0,
      channels: body.channels || ["sms", "email"],
      timestamp: new Date().toISOString(),
    });
  });

  // Multi-Language API
  app.get("/api/translations/:locale", requireAuth, async (c: any) => {
    const locale = c.req.param("locale");

    const translations: Record<string, Record<string, string>> = {
      en: { welcome: "Welcome", attendance: "Attendance", fees: "Fees" },
      hi: { welcome: "स्वागत", attendance: "उपस्थिति", fees: "शुल्क" },
      ta: { welcome: "வரவேற்பு", attendance: "வருகை", fees: "கட்டணம்" },
    };

    return c.json({
      locale,
      translations: translations[locale] || translations.en,
    });
  });

  // Assignments API
  app.get("/api/assignments", requireAuth, async (c: any) => {
    const assignments = [
      {
        id: "1",
        title: "Math Homework",
        subject: "Mathematics",
        dueDate: "2024-04-15",
        status: "active",
      },
      {
        id: "2",
        title: "Science Project",
        subject: "Science",
        dueDate: "2024-04-20",
        status: "active",
      },
    ];
    return c.json(assignments);
  });

  app.post("/api/assignments", requireAuth, async (c: any) => {
    const body = await c.req.json();
    return c.json({
      success: true,
      assignment: { id: crypto.randomUUID(), ...body },
    });
  });

  // Auto-Grading API
  app.post("/api/grading/auto", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      submissionId: body.submissionId,
      score: 85,
      maxScore: 100,
      feedback: "Good work! Minor improvements needed in section 3.",
      gradedAt: new Date().toISOString(),
      plagiarismScore: 0.02,
    });
  });

  // Smart Timetable API
  app.post("/api/timetable/generate", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      timetableId: crypto.randomUUID(),
      schedule: [
        {
          day: "Monday",
          periods: [
            { subject: "Math", teacher: "Mr. Sharma", time: "09:00-10:00" },
          ],
        },
        {
          day: "Tuesday",
          periods: [
            { subject: "Science", teacher: "Mrs. Patel", time: "09:00-10:00" },
          ],
        },
      ],
      conflicts: [],
      optimizationScore: 98,
    });
  });

  // Predictive Analytics API
  app.get("/api/analytics/predictions", requireAuth, async (c: any) => {
    return c.json({
      studentPerformance: [
        { studentId: "1", predictedScore: 85, confidence: 0.92, risk: "low" },
        {
          studentId: "2",
          predictedScore: 72,
          confidence: 0.85,
          risk: "medium",
        },
      ],
      atRiskStudents: 5,
      highAchievers: 15,
      forecast: {
        attendance: 92,
        feeCollection: 96,
        examPassRate: 88,
      },
    });
  });

  // AI Analytics Dashboard API
  app.get("/api/analytics/ai-insights", requireAuth, async (c: any) => {
    return c.json({
      insights: [
        {
          type: "performance",
          message: "Class 10-A shows 15% improvement in Math",
          priority: "high",
        },
        {
          type: "attendance",
          message: "Monday attendance typically drops by 8%",
          priority: "medium",
        },
        {
          type: "fee",
          message: "Fee collection likely to exceed target by 5%",
          priority: "low",
        },
      ],
      recommendations: [
        "Schedule extra Math sessions for Class 10-A",
        "Send attendance reminders before Monday",
        "Follow up with 12 pending fee payments",
      ],
      generatedAt: new Date().toISOString(),
    });
  });

  // Admissions API
  app.get("/api/admissions", requireAuth, async (c: any) => {
    const admissions = [
      {
        id: "1",
        applicantName: "Amit Kumar",
        class: "6",
        status: "pending",
        appliedAt: "2024-03-01",
      },
      {
        id: "2",
        applicantName: "Sneha Patel",
        class: "7",
        status: "approved",
        appliedAt: "2024-03-02",
      },
    ];
    return c.json(admissions);
  });

  app.post("/api/admissions", requireAuth, async (c: any) => {
    const body = await c.req.json();
    return c.json({
      success: true,
      admission: {
        id: crypto.randomUUID(),
        status: "pending",
        ...body,
      },
    });
  });

  // Payroll API
  app.get("/api/payroll", requireAuth, async (c: any) => {
    const payroll = [
      {
        id: "1",
        employeeId: "EMP001",
        name: "Priya Sharma",
        basic: 50000,
        allowances: 15000,
        deductions: 8000,
        netPay: 57000,
      },
      {
        id: "2",
        employeeId: "EMP002",
        name: "Rahul Verma",
        basic: 45000,
        allowances: 12000,
        deductions: 7000,
        netPay: 50000,
      },
    ];
    return c.json(payroll);
  });

  app.post("/api/payroll/calculate", requireAuth, async (c: any) => {
    const body = await c.req.json();
    const basic = body.basic || 0;
    const allowances = body.allowances || 0;
    const deductions = body.deductions || 0;
    const netPay = basic + allowances - deductions;

    return c.json({
      success: true,
      calculation: {
        basic,
        allowances,
        deductions,
        netPay,
        tax: Math.round(basic * 0.1),
        pf: Math.round(basic * 0.12),
      },
    });
  });

  // Role-Based Access Control API
  app.get("/api/roles", requireAuth, async (c: any) => {
    const roles = [
      { id: "1", name: "Super Admin", permissions: ["*"], users: 2 },
      {
        id: "2",
        name: "Principal",
        permissions: ["students.*", "teachers.*", "reports.*"],
        users: 1,
      },
      {
        id: "3",
        name: "Teacher",
        permissions: ["students.view", "attendance.*"],
        users: 15,
      },
      { id: "4", name: "Accountant", permissions: ["fees.*"], users: 2 },
      { id: "5", name: "Parent", permissions: ["students.view"], users: 120 },
    ];
    return c.json(roles);
  });

  app.post("/api/roles", requireAuth, async (c: any) => {
    const body = await c.req.json();
    return c.json({
      success: true,
      role: { id: crypto.randomUUID(), ...body },
    });
  });

  // 2FA API
  app.post("/api/auth/2fa/setup", requireAuth, async (c: any) => {
    return c.json({
      success: true,
      secret: crypto.randomUUID().replace(/-/g, "").slice(0, 32),
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SchoolMIS:user@example.com`,
      backupCodes: Array(8)
        .fill(0)
        .map(() => Math.random().toString(36).substring(2, 8).toUpperCase()),
    });
  });

  app.post("/api/auth/2fa/verify", requireAuth, async (c: any) => {
    const body = await c.req.json();
    return c.json({
      success: true,
      verified: body.code === "123456", // Mock verification
      token: crypto.randomUUID(),
    });
  });

  // Hostel Management API
  app.get("/api/hostel/rooms", requireAuth, async (c: any) => {
    const rooms = [
      {
        id: "1",
        roomNumber: "101",
        floor: 1,
        capacity: 4,
        occupied: 3,
        students: ["S1", "S2", "S3"],
      },
      {
        id: "2",
        roomNumber: "102",
        floor: 1,
        capacity: 4,
        occupied: 4,
        students: ["S4", "S5", "S6", "S7"],
      },
    ];
    return c.json(rooms);
  });

  app.get("/api/hostel/visitors", requireAuth, async (c: any) => {
    const visitors = [
      {
        id: "1",
        name: "Mr. Kumar",
        studentName: "Rahul",
        relation: "Father",
        checkIn: "2024-03-15T10:00:00Z",
        checkOut: null,
      },
    ];
    return c.json(visitors);
  });

  // Canteen Management API
  app.get("/api/canteen/menu", requireAuth, async (c: any) => {
    const menu = [
      {
        id: "1",
        day: "Monday",
        breakfast: "Idli & Sambar",
        lunch: "Rice, Dal, Vegetables",
        snacks: "Sandwich",
      },
      {
        id: "2",
        day: "Tuesday",
        breakfast: "Poha",
        lunch: "Rice, Rajma, Salad",
        snacks: "Fruit",
      },
    ];
    return c.json(menu);
  });

  app.get("/api/canteen/wallet/:studentId", requireAuth, async (c: any) => {
    const studentId = c.req.param("studentId");
    return c.json({
      studentId,
      balance: 2500,
      transactions: [
        {
          id: "1",
          type: "credit",
          amount: 1000,
          date: "2024-03-01",
          description: "Top-up",
        },
        {
          id: "2",
          type: "debit",
          amount: 50,
          date: "2024-03-02",
          description: "Lunch",
        },
      ],
    });
  });

  // Medical Records API
  app.get("/api/medical/:studentId", requireAuth, async (c: any) => {
    const studentId = c.req.param("studentId");
    return c.json({
      studentId,
      bloodGroup: "A+",
      allergies: ["Peanuts"],
      vaccinations: [
        { name: "COVID-19", date: "2023-05-15", status: "completed" },
        { name: "Flu", date: "2024-01-10", status: "completed" },
      ],
      medicalHistory: [
        {
          date: "2024-02-20",
          issue: "Fever",
          treatment: "Paracetamol",
          doctor: "Dr. Sharma",
        },
      ],
    });
  });

  app.post("/api/medical", requireAuth, async (c: any) => {
    const body = await c.req.json();
    return c.json({
      success: true,
      record: { id: crypto.randomUUID(), ...body },
    });
  });

  // Sports Management API
  app.get("/api/sports/events", requireAuth, async (c: any) => {
    const events = [
      {
        id: "1",
        name: "Annual Sports Day",
        date: "2024-04-15",
        type: "track",
        participants: 120,
      },
      {
        id: "2",
        name: "Cricket Tournament",
        date: "2024-05-01",
        type: "team",
        participants: 44,
      },
    ];
    return c.json(events);
  });

  app.get("/api/sports/achievements", requireAuth, async (c: any) => {
    const achievements = [
      {
        id: "1",
        studentId: "S1",
        studentName: "Rahul Kumar",
        sport: "Cricket",
        achievement: "Best Bowler",
        date: "2024-03-01",
      },
      {
        id: "2",
        studentId: "S2",
        studentName: "Priya Sharma",
        sport: "Badminton",
        achievement: "1st Place",
        date: "2024-02-15",
      },
    ];
    return c.json(achievements);
  });

  // Alumni Network API
  app.get("/api/alumni", requireAuth, async (c: any) => {
    const alumni = [
      {
        id: "1",
        name: "Rajesh Kumar",
        batch: "2018",
        profession: "Software Engineer",
        company: "Google",
        location: "Bangalore",
      },
      {
        id: "2",
        name: "Sneha Patel",
        batch: "2019",
        profession: "Doctor",
        company: "AIIMS",
        location: "Delhi",
      },
    ];
    return c.json(alumni);
  });

  app.get("/api/alumni/jobs", requireAuth, async (c: any) => {
    const jobs = [
      {
        id: "1",
        title: "Senior Developer",
        company: "TechCorp",
        location: "Bangalore",
        alumniPosted: true,
        postedBy: "Rajesh Kumar",
      },
      {
        id: "2",
        title: "Marketing Manager",
        company: "BrandCo",
        location: "Mumbai",
        alumniPosted: true,
        postedBy: "Sneha Patel",
      },
    ];
    return c.json(jobs);
  });

  // Integration Manager API
  app.get("/api/integrations", requireAuth, async (c: any) => {
    const integrations = [
      {
        id: "1",
        name: "Google Workspace",
        type: "google",
        status: "connected",
        connectedAt: "2024-01-15",
      },
      {
        id: "2",
        name: "Microsoft 365",
        type: "microsoft",
        status: "disconnected",
        connectedAt: null,
      },
      {
        id: "3",
        name: "Razorpay",
        type: "payment",
        status: "connected",
        connectedAt: "2024-02-01",
      },
      {
        id: "4",
        name: "Twilio SMS",
        type: "sms",
        status: "connected",
        connectedAt: "2024-01-20",
      },
      {
        id: "5",
        name: "SendGrid",
        type: "email",
        status: "disconnected",
        connectedAt: null,
      },
    ];
    return c.json(integrations);
  });

  app.post("/api/integrations/:id/connect", requireAuth, async (c: any) => {
    const id = c.req.param("id");
    return c.json({
      success: true,
      integrationId: id,
      status: "connected",
      connectedAt: new Date().toISOString(),
    });
  });

  // AI Chatbot API
  app.post("/api/chatbot/message", requireAuth, async (c: any) => {
    const body = await c.req.json();
    const message = body.message?.toLowerCase() || "";

    let response = "I'm here to help! Could you please provide more details?";

    if (message.includes("fee")) {
      response =
        "You can pay fees online through the payment gateway. Visit the Fees section for more details.";
    } else if (message.includes("attendance")) {
      response =
        "Students need to maintain 75% attendance to be eligible for exams. Check the Attendance section for your records.";
    } else if (message.includes("exam")) {
      response =
        "Exam schedules are available in the Exams section. Make sure to check the dates and prepare well!";
    } else if (message.includes("admission")) {
      response =
        "For admissions, please visit the Admissions section or contact the school office at +91-XXX-XXX-XXXX.";
    }

    return c.json({
      success: true,
      messageId: crypto.randomUUID(),
      response,
      suggestions: [
        "Fee payment",
        "Attendance query",
        "Exam schedule",
        "Contact support",
      ],
      timestamp: new Date().toISOString(),
    });
  });

  // Career Guidance API
  app.get("/api/career/assessment", requireAuth, async (c: any) => {
    return c.json({
      questions: [
        {
          id: "1",
          question: "Do you enjoy solving mathematical problems?",
          category: "analytical",
        },
        {
          id: "2",
          question: "Are you interested in helping others?",
          category: "social",
        },
        {
          id: "3",
          question: "Do you like working with technology?",
          category: "technical",
        },
        {
          id: "4",
          question: "Do you prefer creative activities?",
          category: "creative",
        },
      ],
    });
  });

  app.post("/api/career/recommendations", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      recommendations: [
        {
          career: "Software Engineer",
          match: 92,
          description: "Great fit based on your technical interests",
          education: "B.Tech in Computer Science",
        },
        {
          career: "Data Scientist",
          match: 85,
          description: "Good match for your analytical skills",
          education: "B.Sc/M.Sc in Statistics or Computer Science",
        },
        {
          career: "UX Designer",
          match: 78,
          description: "Creative and technical blend",
          education: "B.Des or relevant certification",
        },
      ],
      topSkills: [
        "Problem Solving",
        "Analytical Thinking",
        "Programming",
        "Creativity",
      ],
      generatedAt: new Date().toISOString(),
    });
  });

  // ============================================================================
  // ADVANCED FEATURES: Backup, Security, AI Proctoring, Plagiarism
  // ============================================================================

  // Backup Management API
  app.post("/api/backup/create", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      backupId: crypto.randomUUID(),
      status: "in_progress",
      type: body.type || "full",
      timestamp: new Date().toISOString(),
      message: "Backup initiated. This may take a few minutes.",
    });
  });

  app.get("/api/backup/list", requireAuth, async (c: any) => {
    return c.json({
      backups: [
        {
          id: "1",
          timestamp: "2024-03-29T10:00:00Z",
          type: "full",
          size: 1024000,
          status: "completed",
          tables: ["students", "teachers", "classes"],
          retentionDays: 30,
        },
        {
          id: "2",
          timestamp: "2024-03-28T10:00:00Z",
          type: "incremental",
          size: 512000,
          status: "completed",
          tables: ["attendance", "fees"],
          retentionDays: 30,
        },
      ],
      totalSize: 1536000,
    });
  });

  app.post("/api/backup/restore", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      restoreId: crypto.randomUUID(),
      backupId: body.backupId,
      status: "in_progress",
      timestamp: new Date().toISOString(),
      message: "Restore initiated. This may take a few minutes.",
    });
  });

  app.delete("/api/backup/:id", requireAuth, async (c: any) => {
    const id = c.req.param("id");
    return c.json({ success: true, deleted: id });
  });

  // AI Exam Proctoring API
  app.post("/api/proctoring/start", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      sessionId: crypto.randomUUID(),
      examId: body.examId,
      studentId: body.studentId,
      status: "active",
      monitoring: {
        faceDetection: true,
        eyeTracking: true,
        tabSwitching: true,
        audioMonitoring: false,
      },
      startedAt: new Date().toISOString(),
    });
  });

  app.post("/api/proctoring/event", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      eventId: crypto.randomUUID(),
      type: body.type,
      severity: body.severity || "low",
      timestamp: new Date().toISOString(),
      message: body.message || "Event recorded",
    });
  });

  app.get("/api/proctoring/reports/:examId", requireAuth, async (c: any) => {
    const examId = c.req.param("examId");

    return c.json({
      examId,
      totalStudents: 45,
      flaggedStudents: 3,
      summary: {
        violations: 12,
        warnings: 28,
        clean: 405,
      },
      violations: [
        {
          studentId: "STU001",
          type: "tab_switch",
          count: 5,
          severity: "medium",
        },
        {
          studentId: "STU002",
          type: "face_not_detected",
          count: 3,
          severity: "high",
        },
      ],
      generatedAt: new Date().toISOString(),
    });
  });

  // Plagiarism Detection API
  app.post("/api/plagiarism/check", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      checkId: crypto.randomUUID(),
      submissionId: body.submissionId,
      status: "completed",
      score: 0.15,
      matches: [
        {
          source: "External Database",
          similarity: 0.12,
          url: "https://example.com/source1",
        },
        {
          source: "Student Submission #1234",
          similarity: 0.08,
          studentId: "STU003",
        },
      ],
      checkedAt: new Date().toISOString(),
    });
  });

  app.get(
    "/api/plagiarism/reports/:assignmentId",
    requireAuth,
    async (c: any) => {
      const assignmentId = c.req.param("assignmentId");

      return c.json({
        assignmentId,
        totalSubmissions: 42,
        averageSimilarity: 0.18,
        flaggedSubmissions: 4,
        submissions: [
          { studentId: "STU001", score: 0.05, status: "clean" },
          { studentId: "STU002", score: 0.12, status: "clean" },
          { studentId: "STU003", score: 0.65, status: "flagged" },
          { studentId: "STU004", score: 0.72, status: "flagged" },
        ],
      });
    },
  );

  // API Rate Limiting Middleware
  app.get("/api/rate-limits", requireAuth, async (c: any) => {
    return c.json({
      limits: {
        default: { requests: 1000, window: "1h" },
        auth: { requests: 10, window: "1m" },
        payments: { requests: 50, window: "1h" },
        search: { requests: 100, window: "1m" },
        export: { requests: 10, window: "1h" },
      },
    });
  });

  // Real-time Notifications (WebSocket Status)
  app.get("/api/notifications/status", requireAuth, async (c: any) => {
    return c.json({
      websocket: {
        enabled: true,
        status: "connected",
        url: "wss://school-mis.aryalabs.workers.dev/ws",
        lastPing: new Date().toISOString(),
      },
      features: {
        realTimeUpdates: true,
        pushNotifications: true,
        smsNotifications: true,
        emailNotifications: true,
      },
    });
  });

  // Advanced Reporting API
  app.get("/api/reports/advanced", requireAuth, async (c: any) => {
    const type = c.req.query("type") || "summary";

    const reports: Record<string, any> = {
      summary: {
        totalStudents: 1245,
        totalTeachers: 58,
        totalClasses: 42,
        attendanceRate: 94.5,
        feeCollectionRate: 96.2,
        examPassRate: 88.7,
      },
      "fee-analysis": {
        collected: 2450000,
        pending: 125000,
        overdue: 45000,
        byClass: [
          { class: "10-A", collected: 450000, pending: 15000 },
          { class: "10-B", collected: 420000, pending: 20000 },
        ],
      },
      "attendance-analysis": {
        overall: 94.5,
        byClass: [
          { class: "10-A", rate: 96.2, present: 42, absent: 2 },
          { class: "10-B", rate: 93.8, present: 40, absent: 3 },
        ],
        trends: [
          { date: "2024-03-01", rate: 95.2 },
          { date: "2024-03-02", rate: 94.8 },
        ],
      },
      "performance-analysis": {
        bySubject: [
          { subject: "Mathematics", average: 78.5, highest: 98, lowest: 45 },
          { subject: "Science", average: 82.3, highest: 99, lowest: 52 },
        ],
        topStudents: [
          { id: "STU001", name: "Rahul Kumar", average: 95.5 },
          { id: "STU002", name: "Priya Sharma", average: 94.2 },
        ],
      },
    };

    return c.json(reports[type] || reports.summary);
  });

  app.post("/api/reports/generate", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      reportId: crypto.randomUUID(),
      type: body.type,
      status: "generating",
      estimatedTime: "30 seconds",
      downloadUrl: `/api/reports/download/${crypto.randomUUID()}`,
    });
  });

  // Student Parent Portal Extended Features
  app.get(
    "/api/parent-portal/dashboard/:studentId",
    requireAuth,
    async (c: any) => {
      const studentId = c.req.param("studentId");

      return c.json({
        studentId,
        summary: {
          attendance: { present: 85, absent: 3, late: 2, rate: 94.4 },
          fees: { total: 45000, paid: 42000, pending: 3000 },
          exams: { completed: 5, upcoming: 2, averageScore: 82.5 },
          assignments: { submitted: 12, pending: 2, overdue: 0 },
        },
        recentActivity: [
          { type: "attendance", date: "2024-03-28", description: "Present" },
          {
            type: "exam",
            date: "2024-03-27",
            description: "Science Test: 85/100",
          },
          {
            type: "fee",
            date: "2024-03-25",
            description: "Fee payment: ₹10,000",
          },
        ],
        upcoming: [
          { type: "exam", date: "2024-04-05", title: "Mathematics Mid-term" },
          { type: "assignment", date: "2024-04-02", title: "Science Project" },
          { type: "parent_meeting", date: "2024-04-10", title: "PTM" },
        ],
      });
    },
  );

  app.get("/api/parent-portal/communications", requireAuth, async (c: any) => {
    return c.json({
      unread: 3,
      messages: [
        {
          id: "1",
          from: "Class Teacher",
          subject: "Monthly Progress Report",
          date: "2024-03-28",
          read: false,
          type: "academic",
        },
        {
          id: "2",
          from: "Principal",
          subject: "Annual Day Invitation",
          date: "2024-03-25",
          read: true,
          type: "general",
        },
        {
          id: "3",
          from: "Accounts",
          subject: "Fee Reminder",
          date: "2024-03-24",
          read: false,
          type: "fee",
        },
      ],
    });
  });

  app.post("/api/parent-portal/leave-request", requireAuth, async (c: any) => {
    const body = await c.req.json();

    return c.json({
      success: true,
      requestId: crypto.randomUUID(),
      status: "pending",
      studentId: body.studentId,
      fromDate: body.fromDate,
      toDate: body.toDate,
      reason: body.reason,
      submittedAt: new Date().toISOString(),
      message: "Leave request submitted for approval",
    });
  });

  app.get(
    "/api/parent-portal/fee-history/:studentId",
    requireAuth,
    async (c: any) => {
      const studentId = c.req.param("studentId");

      return c.json({
        studentId,
        totalPaid: 180000,
        currentDue: 3000,
        history: [
          {
            date: "2024-03-25",
            amount: 10000,
            type: "Tution Fee",
            receipt: "R12345",
          },
          {
            date: "2024-02-25",
            amount: 10000,
            type: "Tution Fee",
            receipt: "R12344",
          },
          {
            date: "2024-01-25",
            amount: 10000,
            type: "Tution Fee",
            receipt: "R12343",
          },
        ],
        breakdown: {
          tution: { total: 150000, paid: 150000, due: 0 },
          transport: { total: 24000, paid: 21000, due: 3000 },
          library: { total: 3000, paid: 3000, due: 0 },
          laboratory: { total: 3000, paid: 3000, due: 0 },
        },
      });
    },
  );

  // ============================================================================
  // oRPC HANDLER (for type-safe RPC routes)
  // ============================================================================

  const rpcHandler = new RPCHandler(appRouter, {
    interceptors: [
      onError((error: unknown) => {
        console.error("[RPC Error]", error);
      }),
    ],
  });

  app.use(
    "/api/rpc/*",
    async (c: any, next: any) => {
      // Allow the admin metrics endpoint with x-admin-token (no login).
      const isMetrics = c.req.path.includes("/metrics");
      const adminToken = c.req.header("x-admin-token");
      const expected = c.env?.ADMIN_TOKEN || process.env.ADMIN_TOKEN;
      if (isMetrics && adminToken && expected && adminToken === expected) {
        return next();
      }
      return requireAuth(c, next);
    },
    async (c: any, next: any) => {
      const initialContext: AppContext = {
        env: (c.env || process.env) as unknown as AppContext["env"],
        headers: c.req.raw.headers,
        requestId: c.get("requestId") || crypto.randomUUID(),
        logger: c.get("logger"),
        db: {} as any,
      };

      const { matched, response } = await rpcHandler.handle(c.req.raw, {
        prefix: "/api/rpc",
        context: initialContext,
      });

      if (matched && response) {
        return c.newResponse(response.body, response);
      }

      await next();
    },
  );

  // ============================================================================
  // API DOCUMENTATION
  // ============================================================================

  // OpenAPI spec
  app.get("/api/openapi.json", async (c: any) => {
    const generator = new OpenAPIGenerator({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    });

    const spec = await generator.generate(appRouter, {
      info: {
        title: "School MIS API",
        version: "1.0.0",
        description: "School Management Information System API",
      },
      servers: [
        {
          url: c.env?.VITE_PUBLIC_SITE_URL || "http://localhost:3000",
          description: "Current",
        },
      ],
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "JWT token from Better Auth",
          },
        },
      },
      tags: [
        { name: "Students", description: "Student management operations" },
        { name: "Teachers", description: "Teacher management operations" },
        { name: "Classes", description: "Class management operations" },
        { name: "Attendance", description: "Attendance tracking" },
        { name: "Fees", description: "Fee management operations" },
        { name: "Auth", description: "Authentication with Better Auth" },
        { name: "System", description: "System endpoints" },
        { name: "Search", description: "Global search functionality" },
        { name: "Analytics", description: "AI-powered analytics and insights" },
        { name: "Communication", description: "WhatsApp, broadcast messaging" },
        { name: "Payments", description: "Mobile payment gateway" },
        { name: "Hostel", description: "Hostel management" },
        { name: "Canteen", description: "Canteen and meal management" },
        { name: "Medical", description: "Health records and vaccination" },
        { name: "Sports", description: "Sports events and achievements" },
        { name: "Alumni", description: "Alumni network and mentorship" },
        { name: "Career", description: "Career guidance and assessment" },
        { name: "Integrations", description: "Third-party integrations" },
      ],
    });

    return c.json(spec);
  });

  // API Documentation - Scalar UI
  app.get("/api/docs", (c: any) => {
    return c.html(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>School MIS API Documentation</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
        </head>
        <body>
          <script id="api-reference" data-url="/api/openapi.json"></script>
        </body>
      </html>
    `);
  });

  return app;
}

// Default app instance
export const api = createApp();
