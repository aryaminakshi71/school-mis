/**
 * Students Router
 *
 * oRPC router for student management with full CRUD operations.
 */

import { z } from "zod";
import { pub, orgAuthed } from "../../procedures/index.js";
import { getDb } from "../../lib/db.js";
import { students, classes } from "@school/storage";
import { eq, like, and, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

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
    .output(
      z.object({
        students: z.array(z.any()),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
    )
    .handler(async ({ input }) => {
      const db = getDb();
      const { classId, sessionId, search, page, limit } = input;
      const offset = (page - 1) * limit;

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

      return {
        students: allStudents,
        pagination: {
          page,
          limit,
          total: Number(count) || 0,
          totalPages: Math.ceil((Number(count) || 0) / limit),
        },
      };
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
      await db.delete(students).where(eq(students.id, input.id));
      return { success: true, id: input.id };
    }),
};
