/**
 * API Application
 *
 * Hono app with oRPC integration for Node.js server.
 */

import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import type { AppContext } from "./context.js";
import { loggerMiddleware } from "./middleware/logger.js";
import { initSentry } from "./lib/sentry.js";
import { initDatadog } from "./lib/datadog.js";
import { rateLimitRedis } from "./middleware/rate-limit-redis.js";
import { setSecurityHeaders } from "./lib/security.js";
import { appRouter } from "./routers/index.js";
import { getDb } from "./lib/db.js";
import {
  students,
  classes,
  teachers,
  attendance,
  feePayments,
  studentFeeAllocations,
  sessions,
  feeCategories,
  feeStructures,
} from "@school/storage";
import { eq, like, and, desc, sql } from "drizzle-orm";

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

  // Rate limiting middleware
  app.use("/api/*", rateLimitRedis({ limiterType: "api" }));
  app.use("/api/auth/*", rateLimitRedis({ limiterType: "auth" }));

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
        .select({ count: students.id })
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
      env: process.env as unknown as AppContext["env"],
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

  // Scalar API Documentation UI
  app.get("/api/docs", async (c: any) => {
    const { Scalar } = await import("@scalar/hono-api-reference");
    return Scalar({
      spec: {
        url: "/api/openapi.json",
      },
      theme: "purple",
    })(c);
  });

  return app;
}

// Default app instance
export const api = createApp();
