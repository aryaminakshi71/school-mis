/**
 * Birthdays Router
 *
 * oRPC router for birthday tracking.
 */

import { z } from "zod";
import { orgAuthed, pub } from "../../procedures/index.js";

export const birthdaysRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/birthdays",
      summary: "Get birthdays",
      tags: ["Birthdays"],
    })
    .input(
      z.object({
        month: z.number().optional(),
        type: z.enum(["student", "teacher", "staff"]).optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async () => []),
  upcoming: pub
    .route({
      method: "GET",
      path: "/birthdays/upcoming",
      summary: "Get upcoming birthdays",
      tags: ["Birthdays"],
    })
    .input(z.object({ days: z.number().optional().default(7) }))
    .output(z.array(z.any()))
    .handler(async () => []),
  byMonth: pub
    .route({
      method: "GET",
      path: "/birthdays/month/{month}",
      summary: "Get birthdays by month",
      tags: ["Birthdays"],
    })
    .input(z.object({ month: z.number() }))
    .output(z.array(z.any()))
    .handler(async () => []),
};

export const healthRouter = {
  listRecords: pub
    .route({
      method: "GET",
      path: "/health-records",
      summary: "Get health records",
      tags: ["Health"],
    })
    .input(
      z.object({
        studentId: z.string().uuid().optional(),
        visitType: z.string().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async () => []),
  getRecord: pub
    .route({
      method: "GET",
      path: "/health-records/{id}",
      summary: "Get health record",
      tags: ["Health"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),
  createRecord: orgAuthed
    .route({
      method: "POST",
      path: "/health-records",
      summary: "Create health record",
      tags: ["Health"],
    })
    .input(
      z.object({
        studentId: z.string().uuid(),
        visitDate: z.string(),
        visitType: z.string(),
        symptoms: z.string().optional(),
        diagnosis: z.string().optional(),
        treatment: z.string().optional(),
        doctorName: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ ...input, id: "new-id" })),
  getSummary: pub
    .route({
      method: "GET",
      path: "/health-records/{studentId}/summary",
      summary: "Get health summary",
      tags: ["Health"],
    })
    .input(
      z.object({
        studentId: z.string().uuid(),
        sessionId: z.string().uuid().optional(),
      }),
    )
    .output(z.any())
    .handler(async () => null),
};

export const circularsRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/circulars",
      summary: "Get circulars",
      tags: ["Circulars"],
    })
    .input(
      z.object({ type: z.string().optional(), status: z.string().optional() }),
    )
    .output(z.array(z.any()))
    .handler(async () => []),
  get: pub
    .route({
      method: "GET",
      path: "/circulars/{id}",
      summary: "Get circular",
      tags: ["Circulars"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),
  create: orgAuthed
    .route({
      method: "POST",
      path: "/circulars",
      summary: "Create circular",
      tags: ["Circulars"],
    })
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        type: z.string(),
        targetAudience: z.array(z.string()).optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ ...input, id: "new-id" })),
  publish: orgAuthed
    .route({
      method: "PUT",
      path: "/circulars/{id}/publish",
      summary: "Publish circular",
      tags: ["Circulars"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => ({
      id: input.id,
      status: "published",
      publishedAt: new Date().toISOString(),
    })),
};

export const galleryRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/gallery",
      summary: "Get gallery albums",
      tags: ["Gallery"],
    })
    .input(z.object({ category: z.string().optional() }))
    .output(z.array(z.any()))
    .handler(async () => []),
  get: pub
    .route({
      method: "GET",
      path: "/gallery/{id}",
      summary: "Get gallery album",
      tags: ["Gallery"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),
  getImages: pub
    .route({
      method: "GET",
      path: "/gallery/{id}/images",
      summary: "Get gallery images",
      tags: ["Gallery"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.array(z.any()))
    .handler(async () => []),
  create: orgAuthed
    .route({
      method: "POST",
      path: "/gallery",
      summary: "Create gallery album",
      tags: ["Gallery"],
    })
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
        category: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ ...input, id: "new-id" })),
  addImage: orgAuthed
    .route({
      method: "POST",
      path: "/gallery/{id}/images",
      summary: "Add image to gallery",
      tags: ["Gallery"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        imageUrl: z.string(),
        caption: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({
      ...input,
      id: "new-id",
      galleryId: input.id,
    })),
};

export const gatePassRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/gate-passes",
      summary: "Get gate passes",
      tags: ["GatePass"],
    })
    .input(
      z.object({
        studentId: z.string().uuid().optional(),
        status: z.string().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async () => []),
  get: pub
    .route({
      method: "GET",
      path: "/gate-passes/{id}",
      summary: "Get gate pass",
      tags: ["GatePass"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),
  request: orgAuthed
    .route({
      method: "POST",
      path: "/gate-passes",
      summary: "Request gate pass",
      tags: ["GatePass"],
    })
    .input(
      z.object({
        studentId: z.string().uuid(),
        reason: z.string(),
        exitDate: z.string(),
        exitTime: z.string(),
        expectedReturnDate: z.string().optional(),
        expectedReturnTime: z.string().optional(),
        guardianName: z.string().optional(),
        guardianPhone: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({
      id: "new-id",
      ...input,
      status: "pending",
    })),
  approve: orgAuthed
    .route({
      method: "PUT",
      path: "/gate-passes/{id}/approve",
      summary: "Approve gate pass",
      tags: ["GatePass"],
    })
    .input(z.object({ id: z.string().uuid(), remarks: z.string().optional() }))
    .output(z.any())
    .handler(async ({ input }) => ({
      id: input.id,
      status: "approved",
      approvedAt: new Date().toISOString(),
    })),
  reject: orgAuthed
    .route({
      method: "PUT",
      path: "/gate-passes/{id}/reject",
      summary: "Reject gate pass",
      tags: ["GatePass"],
    })
    .input(z.object({ id: z.string().uuid(), remarks: z.string().optional() }))
    .output(z.any())
    .handler(async ({ input }) => ({
      id: input.id,
      status: "rejected",
      remarks: input.remarks,
    })),
  markReturned: orgAuthed
    .route({
      method: "PUT",
      path: "/gate-passes/{id}/return",
      summary: "Mark as returned",
      tags: ["GatePass"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => ({
      id: input.id,
      status: "returned",
      actualReturnDate: new Date().toISOString(),
    })),
};

export const smsRouter = {
  listTemplates: pub
    .route({
      method: "GET",
      path: "/sms/templates",
      summary: "Get SMS templates",
      tags: ["SMS"],
    })
    .output(z.array(z.any()))
    .handler(async () => []),
  createTemplate: orgAuthed
    .route({
      method: "POST",
      path: "/sms/templates",
      summary: "Create SMS template",
      tags: ["SMS"],
    })
    .input(
      z.object({
        name: z.string(),
        templateId: z.string(),
        content: z.string(),
        type: z.string(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ ...input, id: "new-id" })),
  listLogs: pub
    .route({
      method: "GET",
      path: "/sms/logs",
      summary: "Get SMS logs",
      tags: ["SMS"],
    })
    .input(
      z.object({ status: z.string().optional(), date: z.string().optional() }),
    )
    .output(z.array(z.any()))
    .handler(async () => []),
  send: orgAuthed
    .route({
      method: "POST",
      path: "/sms/send",
      summary: "Send SMS",
      tags: ["SMS"],
    })
    .input(
      z.object({
        templateId: z.string().optional(),
        message: z.string(),
        recipientType: z.enum(["student", "parent", "teacher", "staff", "all"]),
        recipientIds: z.array(z.string()).optional(),
      }),
    )
    .output(
      z.object({
        sent: z.number(),
        failed: z.number(),
        logs: z.array(z.any()),
      }),
    )
    .handler(async ({ input }) => ({ sent: 0, failed: 0, logs: [] })),
};

export const directoryRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/directory",
      summary: "Get directory",
      tags: ["Directory"],
    })
    .input(
      z.object({
        role: z.string().optional(),
        department: z.string().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async () => []),
  get: pub
    .route({
      method: "GET",
      path: "/directory/{id}",
      summary: "Get directory entry",
      tags: ["Directory"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),
  create: orgAuthed
    .route({
      method: "POST",
      path: "/directory",
      summary: "Add to directory",
      tags: ["Directory"],
    })
    .input(
      z.object({
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        role: z.string(),
        department: z.string().optional(),
        designation: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ ...input, id: "new-id" })),
  update: orgAuthed
    .route({
      method: "PUT",
      path: "/directory/{id}",
      summary: "Update directory entry",
      tags: ["Directory"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        phone: z.string().optional(),
        department: z.string().optional(),
        designation: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => input),
  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/directory/{id}",
      summary: "Delete directory entry",
      tags: ["Directory"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async () => ({ success: true })),
};
