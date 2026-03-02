import { db, students } from "@school/storage";
import { count, desc, eq, like, or, sql } from "drizzle-orm";

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  classId?: string;
  admissionNumber: string;
  fatherName?: string;
  fatherPhone?: string;
  createdAt: Date;
}

const mapStudentRow = (row: typeof students.$inferSelect): Student => ({
  id: row.id,
  firstName: row.firstName,
  lastName: row.lastName,
  email: row.email || undefined,
  phone: row.phone || undefined,
  classId: row.classId || undefined,
  admissionNumber: row.admissionNumber || "",
  fatherName: row.fatherName || undefined,
  fatherPhone: row.fatherPhone || undefined,
  createdAt: row.createdAt || new Date(),
});

export const studentsService = {
  async list(limit?: number, offset?: number): Promise<Student[]> {
    const queryBuilder = db
      .select()
      .from(students)
      .orderBy(desc(students.createdAt));

    if (limit !== undefined && offset !== undefined) {
      const result = await queryBuilder.limit(limit).offset(offset);
      return result.map(mapStudentRow);
    }

    if (limit !== undefined) {
      const result = await queryBuilder.limit(limit);
      return result.map(mapStudentRow);
    }

    const result = await queryBuilder;
    return result.map(mapStudentRow);
  },

  async get(id: string): Promise<Student | null> {
    const result = await db
      .select()
      .from(students)
      .where(eq(students.id, id))
      .limit(1);
    return result[0] ? mapStudentRow(result[0]) : null;
  },

  async create(
    data: Omit<Student, "id" | "admissionNumber" | "createdAt">,
  ): Promise<Student> {
    const admissionNumber = `STU${Date.now()}`;
    const result = await db
      .insert(students)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        classId: data.classId,
        admissionNumber,
        fatherName: data.fatherName,
        fatherPhone: data.fatherPhone,
      })
      .returning();

    const created = result[0];
    if (!created) {
      throw new Error("Failed to create student");
    }

    return mapStudentRow(created);
  },

  async update(id: string, data: Partial<Student>): Promise<Student | null> {
    const updateData: Record<string, unknown> = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.classId !== undefined) updateData.classId = data.classId;
    if (data.fatherName !== undefined) updateData.fatherName = data.fatherName;
    if (data.fatherPhone !== undefined)
      updateData.fatherPhone = data.fatherPhone;

    const result = await db
      .update(students)
      .set(updateData)
      .where(eq(students.id, id))
      .returning();
    return result[0] ? mapStudentRow(result[0]) : null;
  },

  async delete(id: string): Promise<boolean> {
    await db.delete(students).where(eq(students.id, id));
    return true;
  },

  async count(): Promise<number> {
    const result = await db.select({ count: count() }).from(students);
    return Number(result[0]?.count || 0);
  },

  async search(term: string): Promise<Student[]> {
    const searchTerm = `%${term}%`;
    const result = await db
      .select()
      .from(students)
      .where(
        or(
          like(students.firstName, searchTerm),
          like(students.lastName, searchTerm),
          like(students.admissionNumber || sql`''`, searchTerm),
          like(students.email || sql`''`, searchTerm),
        ),
      )
      .orderBy(desc(students.createdAt));

    return result.map(mapStudentRow);
  },
};
