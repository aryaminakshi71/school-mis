/**
 * Attendance Router
 *
 * oRPC router for attendance management.
 */

import { z } from "zod";
import { orgAuthed, pub } from "../../procedures/index.js";

export const attendanceRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/attendance",
      summary: "Get attendance records",
      tags: ["Attendance"],
    })
    .input(
      z.object({
        classId: z.string().uuid().optional(),
        sessionId: z.string().uuid().optional(),
        date: z.string().optional(),
        studentId: z.string().uuid().optional(),
        status: z.enum(["present", "absent", "late", "excused"]).optional(),
        page: z.number().int().optional().default(1),
        limit: z.number().int().optional().default(50),
      }),
    )
    .output(
      z.object({
        records: z.array(z.any()),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
    )
    .handler(async ({ input }) => ({
      records: [],
      pagination: {
        page: input.page,
        limit: input.limit,
        total: 0,
        totalPages: 0,
      },
    })),

  summary: pub
    .route({
      method: "GET",
      path: "/attendance/summary",
      summary: "Get attendance summary",
      tags: ["Attendance"],
    })
    .input(
      z.object({
        classId: z.string().uuid(),
        sessionId: z.string().uuid(),
        month: z.number().int().optional(),
        year: z.number().int().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async () => []),

  get: pub
    .route({
      method: "GET",
      path: "/attendance/{id}",
      summary: "Get single attendance record",
      tags: ["Attendance"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),

  mark: orgAuthed
    .route({
      method: "POST",
      path: "/attendance",
      summary: "Mark attendance",
      tags: ["Attendance"],
    })
    .input(
      z.object({
        studentId: z.string().uuid(),
        classId: z.string().uuid(),
        sessionId: z.string().uuid(),
        date: z.string(),
        status: z.enum(["present", "absent", "late", "excused"]),
        checkInTime: z.string().optional(),
        checkOutTime: z.string().optional(),
        remarks: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),

  bulk: orgAuthed
    .route({
      method: "POST",
      path: "/attendance/bulk",
      summary: "Mark bulk attendance",
      tags: ["Attendance"],
    })
    .input(
      z.object({
        classId: z.string().uuid(),
        sessionId: z.string().uuid(),
        date: z.string(),
        records: z.array(
          z.object({
            studentId: z.string().uuid(),
            status: z.enum(["present", "absent", "late", "excused"]),
            remarks: z.string().optional(),
          }),
        ),
      }),
    )
    .output(z.object({ inserted: z.number(), records: z.array(z.any()) }))
    .handler(async ({ input }) => ({
      inserted: input.records.length,
      records: [],
    })),
};
