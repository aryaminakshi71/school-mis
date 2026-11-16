/**
 * Staff Router
 *
 * oRPC router for staff management.
 */

import { dailyWorks, staff } from "@school/storage";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../lib/db.js";
import { APIError, ErrorCode } from "../../lib/errors.js";
import { orgAuthed, pub } from "../../procedures/index.js";

export const staffRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/staff",
      summary: "Get all staff",
      tags: ["Staff"],
    })
    .output(z.array(z.any()))
    .handler(async () => {
      const db = getDb();
      const allStaff = await db
        .select()
        .from(staff)
        .orderBy(desc(staff.createdAt));

      return allStaff.map((s) => ({
        id: s.id,
        employeeId: s.employeeId || "",
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email || "",
        phone: s.phone || "",
        designation: s.designation || "",
        department: s.department || "",
        status: s.status ? "active" : "inactive",
        createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : "",
      }));
    }),

  get: pub
    .route({
      method: "GET",
      path: "/staff/{id}",
      summary: "Get single staff",
      tags: ["Staff"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id } = input;

      const staffMember = await db
        .select()
        .from(staff)
        .where(eq(staff.id, id))
        .limit(1);

      if (!staffMember.length) {
        throw new APIError(ErrorCode.NOT_FOUND, "Staff member not found", 404);
      }

      const s = staffMember[0];
      return {
        id: s.id,
        employeeId: s.employeeId || "",
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email || "",
        phone: s.phone || "",
        designation: s.designation || "",
        department: s.department || "",
        dateOfBirth: s.dateOfBirth
          ? new Date(s.dateOfBirth).toISOString().split("T")[0]
          : "",
        address: s.address || "",
        photo: s.photo || "",
        status: s.status ? "active" : "inactive",
        createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : "",
      };
    }),

  create: orgAuthed
    .route({
      method: "POST",
      path: "/staff",
      summary: "Create staff",
      tags: ["Staff"],
    })
    .input(
      z.object({
        employeeId: z.string().optional(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        designation: z.string().optional(),
        department: z.string().optional(),
        dateOfBirth: z.string().optional(),
        address: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const newStaff = await db.insert(staff).values(input).returning();
      return newStaff[0];
    }),

  update: orgAuthed
    .route({
      method: "PUT",
      path: "/staff/{id}",
      summary: "Update staff",
      tags: ["Staff"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        designation: z.string().optional(),
        department: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id, ...updateData } = input;
      const updatedStaff = await db
        .update(staff)
        .set(updateData)
        .where(eq(staff.id, id))
        .returning();
      return updatedStaff[0];
    }),

  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/staff/{id}",
      summary: "Delete staff",
      tags: ["Staff"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input }) => {
      const db = getDb();
      await db.delete(staff).where(eq(staff.id, input.id));
      return { success: true };
    }),

  // Staff portal endpoints
  getMyProfile: pub
    .route({
      method: "GET",
      path: "/staff/me",
      summary: "Get current staff profile",
      tags: ["Staff", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      // For now, return first staff member as current user
      const staffMember = await db
        .select()
        .from(staff)
        .limit(1)
        .then((rows) => rows[0]);

      if (!staffMember) {
        throw new APIError(ErrorCode.NOT_FOUND, "Staff member not found", 404);
      }

      const tasks = await db
        .select()
        .from(dailyWorks)
        .where(eq(dailyWorks.teacherId, staffMember.id));

      const tasksCompleted = tasks.filter(
        (t) => t.status === "completed",
      ).length;
      const totalTasks = tasks.length;
      const performance = totalTasks
        ? Math.round((tasksCompleted / totalTasks) * 100)
        : 0;

      const uniqueDays = new Set(
        tasks.map((t) =>
          t.workDate ? new Date(t.workDate).toISOString().split("T")[0] : "",
        ),
      );
      const attendance = uniqueDays.size;

      return {
        id: staffMember.id,
        employeeId: staffMember.employeeId || "",
        firstName: staffMember.firstName,
        lastName: staffMember.lastName,
        email: staffMember.email || "",
        phone: staffMember.phone || "",
        designation: staffMember.designation || "",
        department: staffMember.department || "",
        dateOfBirth: staffMember.dateOfBirth
          ? new Date(staffMember.dateOfBirth).toISOString().split("T")[0]
          : "",
        address: staffMember.address || "",
        photo: staffMember.photo || "",
        salary: 35000 + tasksCompleted * 250,
        attendance,
        tasksCompleted,
        performance,
      };
    }),

  getMyTasks: pub
    .route({
      method: "GET",
      path: "/staff/me/tasks",
      summary: "Get tasks for current staff member",
      tags: ["Staff", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      const staffMember = await db
        .select()
        .from(staff)
        .limit(1)
        .then((rows) => rows[0]);

      if (!staffMember) {
        return { tasks: [] };
      }

      const tasks = await db
        .select()
        .from(dailyWorks)
        .where(eq(dailyWorks.teacherId, staffMember.id))
        .orderBy(desc(dailyWorks.workDate))
        .limit(50);

      return { tasks };
    }),

  getMyAttendance: pub
    .route({
      method: "GET",
      path: "/staff/me/attendance",
      summary: "Get attendance for current staff member",
      tags: ["Staff", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      const staffMember = await db
        .select()
        .from(staff)
        .limit(1)
        .then((rows) => rows[0]);

      if (!staffMember) {
        return {
          attendance: {
            present: 0,
            absent: 0,
            total: 0,
            percentage: 0,
            monthly: [],
          },
        };
      }

      const tasks = await db
        .select()
        .from(dailyWorks)
        .where(eq(dailyWorks.teacherId, staffMember.id));

      const uniqueDates = Array.from(
        new Set(
          tasks.map((t) =>
            t.workDate ? new Date(t.workDate).toISOString().split("T")[0] : "",
          ),
        ),
      ).filter(Boolean);

      const total = uniqueDates.length;
      const present = total;
      const absent = 0;
      const percentage = total ? 100 : 0;

      const monthly = uniqueDates.reduce<
        Record<
          string,
          { month: string; present: number; absent: number; total: number }
        >
      >((acc, date) => {
        const month = new Date(date).toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        acc[month] = acc[month] || { month, present: 0, absent: 0, total: 0 };
        acc[month].present += 1;
        acc[month].total += 1;
        return acc;
      }, {});

      return {
        attendance: {
          present,
          absent,
          total,
          percentage,
          monthly: Object.values(monthly),
        },
      };
    }),

  getAttendance: pub
    .route({
      method: "GET",
      path: "/staff/attendance",
      summary: "Get staff attendance summary",
      tags: ["Staff", "Portal"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      const allStaff = await db
        .select()
        .from(staff)
        .orderBy(desc(staff.createdAt));

      const staffIds = allStaff.map((s) => s.id);
      if (!staffIds.length) {
        return { attendance: [] };
      }

      const attendanceSummary = await db
        .select({
          staffId: dailyWorks.teacherId,
          presentDays: sql<number>`count(distinct ${dailyWorks.workDate})`,
          lastWorkDate: sql<string>`max(${dailyWorks.workDate})`,
          lastCheckIn: sql<string>`max(${dailyWorks.createdAt})`,
        })
        .from(dailyWorks)
        .where(inArray(dailyWorks.teacherId, staffIds))
        .groupBy(dailyWorks.teacherId);

      const today = new Date().toISOString().split("T")[0];
      const todayRecords = await db
        .select({
          staffId: dailyWorks.teacherId,
          createdAt: dailyWorks.createdAt,
        })
        .from(dailyWorks)
        .where(
          and(
            inArray(dailyWorks.teacherId, staffIds),
            eq(dailyWorks.workDate, today),
          ),
        )
        .orderBy(desc(dailyWorks.createdAt));

      const todayStatusMap = new Map<string, string>();
      const checkInMap = new Map<string, string>();
      todayRecords.forEach((r) => {
        if (r.staffId && !todayStatusMap.has(r.staffId)) {
          todayStatusMap.set(r.staffId, "Present");
          const checkInTime = r.createdAt
            ? new Date(r.createdAt as unknown as string).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )
            : "-";
          checkInMap.set(r.staffId, checkInTime);
        }
      });

      const attendance = allStaff.map((s) => {
        const stats = attendanceSummary.find((row) => row.staffId === s.id);
        const present = stats?.presentDays || 0;
        const percentage = present
          ? Math.min(100, Math.round((present / 22) * 100))
          : 0;
        const status =
          percentage >= 95
            ? "excellent"
            : percentage >= 85
              ? "regular"
              : "warning";

        return {
          id: s.id,
          employeeId: s.employeeId || "",
          name: `${s.firstName} ${s.lastName}`,
          designation: s.designation || "",
          department: s.department || "",
          present,
          absent: 0,
          leave: 0,
          percentage,
          status,
          todayStatus: todayStatusMap.get(s.id) || "Absent",
          checkIn: checkInMap.get(s.id) || "-",
        };
      });

      return { attendance };
    }),
};
