import { db, teachers } from "@school/storage";
import { count, desc, eq } from "drizzle-orm";

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  employeeId: string;
  qualification?: string;
  subjectSpecialization?: string;
  createdAt: Date;
}

const mapTeacherRow = (row: typeof teachers.$inferSelect): Teacher => ({
  id: row.id,
  firstName: row.firstName,
  lastName: row.lastName,
  email: row.email || undefined,
  phone: row.phone || undefined,
  employeeId: row.employeeId || "",
  qualification: row.qualification || undefined,
  subjectSpecialization: row.subjectSpecialization || undefined,
  createdAt: row.createdAt || new Date(),
});

export const teachersService = {
  async list(limit?: number, offset?: number): Promise<Teacher[]> {
    const queryBuilder = db
      .select()
      .from(teachers)
      .orderBy(desc(teachers.createdAt));

    if (limit !== undefined && offset !== undefined) {
      const result = await queryBuilder.limit(limit).offset(offset);
      return result.map(mapTeacherRow);
    }

    if (limit !== undefined) {
      const result = await queryBuilder.limit(limit);
      return result.map(mapTeacherRow);
    }

    const result = await queryBuilder;
    return result.map(mapTeacherRow);
  },

  async get(id: string): Promise<Teacher | null> {
    const result = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, id))
      .limit(1);
    return result[0] ? mapTeacherRow(result[0]) : null;
  },

  async create(
    data: Omit<Teacher, "id" | "employeeId" | "createdAt">,
  ): Promise<Teacher> {
    const employeeId = `EMP${Date.now()}`;
    const result = await db
      .insert(teachers)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        employeeId,
        qualification: data.qualification,
        subjectSpecialization: data.subjectSpecialization,
      })
      .returning();

    const created = result[0];
    if (!created) {
      throw new Error("Failed to create teacher");
    }

    return mapTeacherRow(created);
  },

  async update(id: string, data: Partial<Teacher>): Promise<Teacher | null> {
    const updateData: Record<string, unknown> = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.qualification !== undefined)
      updateData.qualification = data.qualification;
    if (data.subjectSpecialization !== undefined) {
      updateData.subjectSpecialization = data.subjectSpecialization;
    }

    const result = await db
      .update(teachers)
      .set(updateData)
      .where(eq(teachers.id, id))
      .returning();
    return result[0] ? mapTeacherRow(result[0]) : null;
  },

  async delete(id: string): Promise<boolean> {
    await db.delete(teachers).where(eq(teachers.id, id));
    return true;
  },

  async count(): Promise<number> {
    const result = await db.select({ count: count() }).from(teachers);
    return Number(result[0]?.count || 0);
  },
};
