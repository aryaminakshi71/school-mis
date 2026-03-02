import { classes, db } from "@school/storage";
import { asc, count, eq } from "drizzle-orm";

export interface Class {
  id: string;
  name: string;
  section?: string;
  capacity?: number;
  classTeacherId?: string;
  createdAt: Date;
}

const mapClassRow = (row: typeof classes.$inferSelect): Class => ({
  id: row.id,
  name: row.name,
  section: row.section || undefined,
  capacity: row.capacity || undefined,
  classTeacherId: row.classTeacherId || undefined,
  createdAt: row.createdAt || new Date(),
});

export const classesService = {
  async list(): Promise<Class[]> {
    const result = await db.select().from(classes).orderBy(asc(classes.name));
    return result.map(mapClassRow);
  },

  async get(id: string): Promise<Class | null> {
    const result = await db
      .select()
      .from(classes)
      .where(eq(classes.id, id))
      .limit(1);
    return result[0] ? mapClassRow(result[0]) : null;
  },

  async create(data: Omit<Class, "id" | "createdAt">): Promise<Class> {
    const result = await db
      .insert(classes)
      .values({
        name: data.name,
        section: data.section,
        capacity: data.capacity,
        classTeacherId: data.classTeacherId,
      })
      .returning();

    const created = result[0];
    if (!created) {
      throw new Error("Failed to create class");
    }

    return mapClassRow(created);
  },

  async update(id: string, data: Partial<Class>): Promise<Class | null> {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.section !== undefined) updateData.section = data.section;
    if (data.capacity !== undefined) updateData.capacity = data.capacity;
    if (data.classTeacherId !== undefined)
      updateData.classTeacherId = data.classTeacherId;

    const result = await db
      .update(classes)
      .set(updateData)
      .where(eq(classes.id, id))
      .returning();
    return result[0] ? mapClassRow(result[0]) : null;
  },

  async count(): Promise<number> {
    const result = await db.select({ count: count() }).from(classes);
    return Number(result[0]?.count || 0);
  },
};
