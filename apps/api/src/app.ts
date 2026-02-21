/**
 * API Application
 *
 * Hono app with oRPC integration for Node.js server.
 */

import { OpenAPIGenerator } from "@orpc/openapi";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod";
import {
  attendance,
  auditLogs,
  classes,
  expenses,
  feeCategories,
  feePayments,
  feeStructures,
  libraryBooks,
  bookIssues as libraryTransactions,
  reportCardDetails,
  reportCards,
  sessions,
  studentFeeAllocations,
  students,
  subjects,
  teachers,
  transportRoutes,
  vehicles as transportVehicles,
} from "@school/storage";
import { and, desc, eq, like, sql } from "drizzle-orm";
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
 * Create Hono app with all routes
 */
export function createApp() {
  const app = new Hono();

  // Initialize monitoring
  initSentry();
  initDatadog();

  // Global middleware
  app.use(
    "*",
    cors({ origin: (origin: string | null) => origin, credentials: true }),
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
        docs: "/api/openapi.json",
        auth: "/api/auth/login",
      },
      message: "API server is running. Use /api/* endpoints.",
    });
  });

  // AI assistant routes
  app.post("/api/ai/student/performance", async (c: any) => {
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
  });

  app.post("/api/ai/attendance/analyze", async (c: any) => {
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
  });

  // Rate limiting middleware
  app.use("/api/*", rateLimitRedis({ limiterType: "api" }));
  app.use("/api/auth/*", rateLimitRedis({ limiterType: "auth" }));

  // Audit log read endpoint (basic "trust pack" feature).
  app.get("/api/audit/logs", async (c: any) => {
    // This app currently uses demo auth; require a token in production.
    if (c.env?.NODE_ENV === "production" && !c.req.header("Authorization")) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const db = getDb(c.env);
    const limitRaw = c.req.query("limit");
    const limit = Math.max(1, Math.min(200, Number(limitRaw || 50) || 50));

    const rows = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);

    return c.json({ logs: rows });
  });

  // Direct REST endpoints for Students (bypassing oRPC for now)
  app.get("/api/students", async (c: any) => {
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
        students: allStudents,
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
  });

  app.post("/api/students", async (c: any) => {
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
  });

  app.put("/api/students/:id", async (c: any) => {
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
  });

  app.delete("/api/students/:id", async (c: any) => {
    try {
      const db = getDb(c.env);
      const id = c.req.param("id");

      await db.delete(students).where(eq(students.id, id));

      return c.json({ success: true, id });
    } catch (error) {
      console.error("Error deleting student:", error);
      return c.json({ error: "Failed to delete student" }, 500);
    }
  });

  app.get("/api/students/:id", async (c: any) => {
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
  });

  // Teachers endpoints
  app.get("/api/teachers", async (c: any) => {
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
  });

  app.put("/api/teachers/:id", async (c: any) => {
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
  });

  app.delete("/api/teachers/:id", async (c: any) => {
    try {
      const db = getDb(c.env);
      const id = c.req.param("id");

      await db.delete(teachers).where(eq(teachers.id, id));

      return c.json({ success: true, id });
    } catch (error) {
      console.error("Error deleting teacher:", error);
      return c.json({ error: "Failed to delete teacher" }, 500);
    }
  });

  app.get("/api/teachers/:id", async (c: any) => {
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
  });

  app.post("/api/teachers", async (c: any) => {
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
  });

  // Classes endpoints
  app.get("/api/classes", async (c: any) => {
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
  });

  app.post("/api/classes", async (c: any) => {
    try {
      const db = getDb(c.env);
      const data = await c.req.json();
      const { randomUUID } = await import("crypto");
      const id = randomUUID();

      const [cls] = await db
        .insert(classes)
        .values({
          id,
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
  });

  app.put("/api/classes/:id", async (c: any) => {
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
  });

  app.delete("/api/classes/:id", async (c: any) => {
    try {
      const db = getDb(c.env);
      const id = c.req.param("id");

      await db.delete(classes).where(eq(classes.id, id));

      return c.json({ success: true, id });
    } catch (error) {
      console.error("Error deleting class:", error);
      return c.json({ error: "Failed to delete class" }, 500);
    }
  });

  app.get("/api/classes/list", async (c: any) => {
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
  });

  // Attendance endpoints
  app.get("/api/attendance", async (c: any) => {
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
        })
        .from(attendance)
        .where(and(...conditions));

      const attendanceWithNames = await Promise.all(
        attendanceRecords.map(async (record) => {
          const [student] = await db
            .select({
              firstName: students.firstName,
              lastName: students.lastName,
            })
            .from(students)
            .where(eq(students.id, record.studentId))
            .limit(1);

          const [cls] = await db
            .select({ name: classes.name })
            .from(classes)
            .where(eq(classes.id, record.classId || ""))
            .limit(1);

          return {
            ...record,
            studentName: student
              ? `${student.firstName} ${student.lastName}`
              : "Unknown",
            className: cls?.name || "Unknown",
          };
        }),
      );

      return c.json({
        attendance: attendanceRecords.length > 0 ? attendanceWithNames : [],
      });
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return c.json({ error: "Failed to fetch attendance" }, 500);
    }
  });

  app.post("/api/attendance", async (c: any) => {
    try {
      const db = getDb(c.env);
      const data = await c.req.json();

      const activeSession = await db
        .select()
        .from(sessions)
        .where(eq(sessions.isActive, true))
        .limit(1);

      const sessionId = activeSession[0]?.id;

      const results = [];
      for (const record of data.records || []) {
        const [saved] = await db
          .insert(attendance)
          .values({
            studentId: record.studentId,
            classId: record.classId || data.classId,
            sessionId: sessionId!,
            date: data.date,
            status: record.status,
            remarks: record.remarks || null,
          })
          .onConflictDoUpdate({
            target: [attendance.studentId, attendance.date],
            set: { status: record.status, remarks: record.remarks || null },
          })
          .returning();
        results.push(saved);
      }

      return c.json({ success: true, saved: results.length });
    } catch (error) {
      console.error("Error saving attendance:", error);
      return c.json({ error: "Failed to save attendance" }, 500);
    }
  });

  // Fee Structure Endpoints
  app.get("/api/fee-structures", async (c: any) => {
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
  });

  app.post("/api/fee-structures", async (c: any) => {
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
  });

  app.get("/api/fee-categories", async (c: any) => {
    try {
      const db = getDb(c.env);
      const categories = await db.select().from(feeCategories);
      return c.json({ categories });
    } catch (error) {
      return c.json({ error: "Failed to fetch categories" }, 500);
    }
  });

  app.post("/api/fee-categories", async (c: any) => {
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
  });

  // Fees endpoints
  app.get("/api/fees", async (c: any) => {
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
  });

  app.post("/api/fees", async (c: any) => {
    try {
      const db = getDb(c.env);
      const data = await c.req.json();
      const { randomUUID } = await import("crypto");
      const id = randomUUID();

      const [allocation] = await db
        .insert(studentFeeAllocations)
        .values({
          id,
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
  });

  app.post("/api/fees/:id/pay", async (c: any) => {
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
  });

  // Expense Endpoints
  app.get("/api/expenses", async (c: any) => {
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
  });

  app.post("/api/expenses", async (c: any) => {
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
  });

  app.get("/api/expenses/stats", async (c: any) => {
    try {
      const db = getDb(c.env);
      const allExpenses = await db.select().from(expenses);
      const total = allExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      return c.json({ totalExpenses: total });
    } catch (error) {
      return c.json({ totalExpenses: 0 });
    }
  });

  // Grades / Report Cards Endpoints
  app.get("/api/grades", async (c: any) => {
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
            date: new Date().toISOString().split("T")[0], // Placeholder
          };
        }),
      );

      return c.json({ grades: enrichedGrades });
    } catch (error) {
      console.error("Error fetching grades:", error);
      return c.json({ grades: [] });
    }
  });

  app.post("/api/grades", async (c: any) => {
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
  });

  app.get("/api/subjects", async (c: any) => {
    try {
      const db = getDb(c.env);
      const allSubjects = await db.select().from(subjects);
      return c.json({ subjects: allSubjects });
    } catch (error) {
      return c.json({ subjects: [] });
    }
  });

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

  // Transport API
  app.get("/api/transport/routes", async (c: any) => {
    try {
      const db = getDb(c.env);
      const routes = await db.select().from(transportRoutes);
      return c.json({ routes });
    } catch (error) {
      console.error("Error fetching transport routes:", error);
      return c.json({ routes: [] });
    }
  });

  app.post("/api/transport/routes", async (c: any) => {
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
  });

  app.get("/api/transport/vehicles", async (c: any) => {
    try {
      const db = getDb(c.env);
      const vehicles = await db.select().from(transportVehicles);
      return c.json({ vehicles });
    } catch (error) {
      return c.json({ vehicles: [] });
    }
  });

  app.post("/api/transport/vehicles", async (c: any) => {
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
  });

  // Library API
  app.get("/api/library/books", async (c: any) => {
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
  });

  app.post("/api/library/books", async (c: any) => {
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
  });

  app.get("/api/library/transactions", async (c: any) => {
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
  });

  app.post("/api/library/issue", async (c: any) => {
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
  });

  app.post("/api/library/return", async (c: any) => {
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
  });

  // Notifications API
  app.post("/api/notifications/send", async (c: any) => {
    try {
      const data = await c.req.json();

      // Log notification (in production, integrate with SMS/Email providers)
      console.log("📱 Notification sent:", {
        type: data.type,
        studentId: data.studentId,
        message: getNotificationMessage(data),
        timestamp: new Date().toISOString(),
      });

      return c.json({ success: true, message: "Notification sent" });
    } catch (error) {
      console.error("Error sending notification:", error);
      return c.json({ error: "Failed to send notification" }, 500);
    }
  });

  app.get("/api/notifications", async (c: any) => {
    try {
      // Return mock notifications
      return c.json({
        notifications: [
          {
            id: "1",
            type: "fee",
            title: "Fee Payment Received",
            message: "Payment of ₹5,000 received from John Smith",
            time: "2 hours ago",
            read: false,
          },
          {
            id: "2",
            type: "attendance",
            title: "Low Attendance Alert",
            message: "James Brown has attendance below 75%",
            time: "4 hours ago",
            read: false,
          },
          {
            id: "3",
            type: "exam",
            title: "Exam Scheduled",
            message: "Math exam scheduled for Class 10-A on Jan 25",
            time: "1 day ago",
            read: true,
          },
        ],
      });
    } catch (error) {
      return c.json({ error: "Failed to fetch notifications" }, 500);
    }
  });

  // Auth endpoints (simple session-based auth)
  app.post("/api/auth/login", async (c: any) => {
    try {
      const { email, password } = await c.req.json();

      // Simple demo credentials
      if (email === "admin@school.edu" && password === "admin123") {
        const user = {
          id: "1",
          name: "Admin User",
          email,
          role: "admin" as const,
        };

        return c.json(user);
      }

      if (email === "teacher@school.edu" && password === "teacher123") {
        const user = {
          id: "2",
          name: "Teacher User",
          email,
          role: "teacher" as const,
        };

        return c.json(user);
      }

      return c.json({ error: "Invalid credentials" }, 401);
    } catch (error) {
      console.error("Error during login:", error);
      return c.json({ error: "Login failed" }, 500);
    }
  });

  app.post("/api/auth/logout", async (c: any) => {
    return c.json({ success: true });
  });

  app.get("/api/auth/me", async (c: any) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    // Return demo user for now
    return c.json({
      id: "1",
      name: "Admin User",
      email: "admin@school.edu",
      role: "admin",
    });
  });

  // oRPC handler for other routes
  const rpcHandler = new RPCHandler(appRouter, {
    interceptors: [
      onError((error: unknown) => {
        console.error("[RPC Error]", error);
      }),
    ],
  });

  app.use("/api/rpc/*", async (c: any, next: any) => {
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
      const method = c.req.method?.toUpperCase?.() ?? "GET";
      const shouldAudit =
        method !== "GET" &&
        method !== "HEAD" &&
        !c.req.path.startsWith("/api/audit/");

      if (shouldAudit) {
        try {
          const db = getDb(c.env);
          const url = new URL(c.req.url);
          const rpcPath = url.pathname.startsWith("/api/rpc")
            ? url.pathname.slice("/api/rpc".length) || "/"
            : url.pathname;

          const ip =
            c.req.header("cf-connecting-ip") ||
            (c.req.header("x-forwarded-for") || "").split(",")[0]?.trim() ||
            null;

          await db.insert(auditLogs).values({
            actorUserId: null,
            actorEmail: null,
            organizationId: null,
            action: `${method} ${rpcPath}`,
            requestMethod: method,
            requestPath: rpcPath,
            statusCode: response.status,
            ipAddress: ip,
            userAgent: c.req.header("user-agent") || null,
            metadata: {
              requestId: initialContext.requestId,
            },
          });
        } catch (err) {
          console.error("[AuditLog] Failed to write audit log", err);
        }
      }

      return c.newResponse(response.body, response);
    }

    await next();
  });

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
        { name: "System", description: "System endpoints" },
      ],
    });

    return c.json(spec);
  });

  // API Documentation - redirect to OpenAPI JSON endpoint
  // Note: Scalar API Reference has type definition issues in current version
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
