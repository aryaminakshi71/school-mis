/**
 * Birthday Router
 *
 * API routes for birthday calendar
 */

import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { orgAuthed } from "../../procedures";
import { getDb, schema } from "../../lib/db";

export const birthdaysRouter = {
  /**
   * Get upcoming birthdays
   */
  upcoming: orgAuthed
    .route({
      method: "GET",
      path: "/birthdays/upcoming",
      summary: "Get upcoming birthdays",
      tags: ["Birthdays"],
    })
    .input(
      z.object({
        days: z.number().int().min(1).optional().default(30),
        role: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const today = new Date();
      const futureDate = new Date(
        today.getTime() + (input.days || 30) * 24 * 60 * 60 * 1000,
      );

      const students = await db
        .select({
          id: schema.students.id,
          name: sql`CONCAT(${schema.students.firstName}, ' ', ${schema.students.lastName})`,
          dateOfBirth: schema.students.dateOfBirth,
          photo: schema.students.photo,
          class: schema.classes,
        })
        .from(schema.students)
        .leftJoin(
          schema.classes,
          eq(schema.students.classId, schema.classes.id),
        )
        .where(
          and(
            eq(schema.students.status, true),
            sql`EXTRACT(MONTH FROM ${schema.students.dateOfBirth}) BETWEEN ${today.getMonth() + 1} AND ${futureDate.getMonth() + 1}`,
          ),
        )
        .orderBy(
          sql`EXTRACT(MONTH FROM ${schema.students.dateOfBirth})`,
          sql`EXTRACT(DAY FROM ${schema.students.dateOfBirth})`,
        );

      return { birthdays: students };
    }),

  /**
   * Get birthdays by month
   */
  byMonth: orgAuthed
    .route({
      method: "GET",
      path: "/birthdays/month/:month",
      summary: "Get birthdays by month",
      tags: ["Birthdays"],
    })
    .input(z.object({ month: z.number().min(1).max(12) }))
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const students = await db
        .select({
          id: schema.students.id,
          name: sql`CONCAT(${schema.students.firstName}, ' ', ${schema.students.lastName})`,
          dateOfBirth: schema.students.dateOfBirth,
          photo: schema.students.photo,
          class: schema.classes,
        })
        .from(schema.students)
        .leftJoin(
          schema.classes,
          eq(schema.students.classId, schema.classes.id),
        )
        .where(
          and(
            eq(schema.students.status, true),
            sql`EXTRACT(MONTH FROM ${schema.students.dateOfBirth}) = ${input.month}`,
          ),
        )
        .orderBy(sql`EXTRACT(DAY FROM ${schema.students.dateOfBirth})`);

      const teachers = await db
        .select({
          id: schema.teachers.id,
          name: sql`CONCAT(${schema.teachers.firstName}, ' ', ${schema.teachers.lastName})`,
          dateOfBirth: schema.teachers.dateOfBirth,
          photo: schema.teachers.photo,
          subjectSpecialization: schema.teachers.subjectSpecialization,
        })
        .from(schema.teachers)
        .where(
          and(
            eq(schema.teachers.status, true),
            sql`EXTRACT(MONTH FROM ${schema.teachers.dateOfBirth}) = ${input.month}`,
          ),
        )
        .orderBy(sql`EXTRACT(DAY FROM ${schema.teachers.dateOfBirth})`);

      return {
        students: students.map((s) => ({ ...s, type: "student" })),
        teachers: teachers.map((t) => ({ ...t, type: "teacher" })),
      };
    }),

  /**
   * Get today's birthdays
   */
  today: orgAuthed
    .route({
      method: "GET",
      path: "/birthdays/today",
      summary: "Get today's birthdays",
      tags: ["Birthdays"],
    })
    .output(z.any())
    .handler(async ({ context }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();

      const students = await db
        .select({
          id: schema.students.id,
          name: sql`CONCAT(${schema.students.firstName}, ' ', ${schema.students.lastName})`,
          dateOfBirth: schema.students.dateOfBirth,
          photo: schema.students.photo,
          class: schema.classes,
        })
        .from(schema.students)
        .leftJoin(
          schema.classes,
          eq(schema.students.classId, schema.classes.id),
        )
        .where(
          and(
            eq(schema.students.status, true),
            sql`EXTRACT(MONTH FROM ${schema.students.dateOfBirth}) = ${month}`,
            sql`EXTRACT(DAY FROM ${schema.students.dateOfBirth}) = ${day}`,
          ),
        );

      const teachers = await db
        .select({
          id: schema.teachers.id,
          name: sql`CONCAT(${schema.teachers.firstName}, ' ', ${schema.teachers.lastName})`,
          dateOfBirth: schema.teachers.dateOfBirth,
          photo: schema.teachers.photo,
          subjectSpecialization: schema.teachers.subjectSpecialization,
        })
        .from(schema.teachers)
        .where(
          and(
            eq(schema.teachers.status, true),
            sql`EXTRACT(MONTH FROM ${schema.teachers.dateOfBirth}) = ${month}`,
            sql`EXTRACT(DAY FROM ${schema.teachers.dateOfBirth}) = ${day}`,
          ),
        );

      return {
        students: students.map((s) => ({ ...s, type: "student" })),
        teachers: teachers.map((t) => ({ ...t, type: "teacher" })),
      };
    }),
};
