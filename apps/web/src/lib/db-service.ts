/**
 * Database Services - Real CRUD Operations
 *
 * This module provides real database queries using Drizzle ORM.
 * Connected to Neon PostgreSQL database.
 */

import { db } from "@school/storage";
import {
  students,
  teachers,
  classes,
  feePayments,
  studentFeeAllocations,
  attendance,
  examSchedules,
  sessions,
  feeCategories,
  feeStructures,
  libraryBooks,
  bookIssues,
  transportRoutes,
  vehicles,
  gpsTracking,
} from "@school/storage";
import { eq, like, and, desc, asc, or, count, sql, gte, lte } from "drizzle-orm";
import { NotFoundError } from "./error-handler";

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

export interface Class {
  id: string;
  name: string;
  section?: string;
  capacity?: number;
  classTeacherId?: string;
  createdAt: Date;
}

export interface FeePayment {
  id: string;
  studentId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod?: string;
  status: "pending" | "completed" | "failed";
  receiptNumber: string;
}

export interface ExamSchedule {
  id: string;
  title: string;
  examType: string;
  classId?: string;
  subjectId?: string;
  examDate: Date;
  startTime: string;
  endTime: string;
  totalMarks?: number;
}

// ============ STUDENTS SERVICE ============

export const studentsService = {
  async list(limit?: number, offset?: number): Promise<Student[]> {
    try {
      const queryBuilder = db.select().from(students).orderBy(desc(students.createdAt));
      
      if (limit !== undefined && offset !== undefined) {
        const result = await queryBuilder.limit(limit).offset(offset);
        return result.map((s) => ({
          id: s.id,
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email || undefined,
          phone: s.phone || undefined,
          classId: s.classId || undefined,
          admissionNumber: s.admissionNumber || "",
          fatherName: s.fatherName || undefined,
          fatherPhone: s.fatherPhone || undefined,
          createdAt: s.createdAt || new Date(),
        }));
      }
      
      if (limit !== undefined) {
        const result = await queryBuilder.limit(limit);
        return result.map((s) => ({
          id: s.id,
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email || undefined,
          phone: s.phone || undefined,
          classId: s.classId || undefined,
          admissionNumber: s.admissionNumber || "",
          fatherName: s.fatherName || undefined,
          fatherPhone: s.fatherPhone || undefined,
          createdAt: s.createdAt || new Date(),
        }));
      }
      
      const result = await queryBuilder;
      return result.map((s) => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email || undefined,
        phone: s.phone || undefined,
        classId: s.classId || undefined,
        admissionNumber: s.admissionNumber || "",
        fatherName: s.fatherName || undefined,
        fatherPhone: s.fatherPhone || undefined,
        createdAt: s.createdAt || new Date(),
      }));
    } catch (error) {
      console.error("Error listing students:", error);
      throw error;
    }
  },

  async get(id: string): Promise<Student | null> {
    try {
      const result = await db
        .select()
        .from(students)
        .where(eq(students.id, id))
        .limit(1);
      
      if (result.length === 0) {
        return null;
      }

      const s = result[0];
      return {
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email || undefined,
        phone: s.phone || undefined,
        classId: s.classId || undefined,
        admissionNumber: s.admissionNumber || "",
        fatherName: s.fatherName || undefined,
        fatherPhone: s.fatherPhone || undefined,
        createdAt: s.createdAt || new Date(),
      };
    } catch (error) {
      console.error("Error getting student:", error);
      throw error;
    }
  },

  async create(
    data: Omit<Student, "id" | "admissionNumber" | "createdAt">,
  ): Promise<Student> {
    try {
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

      if (result.length === 0) {
        throw new Error("Failed to create student");
      }

      const s = result[0];
      return {
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email || undefined,
        phone: s.phone || undefined,
        classId: s.classId || undefined,
        admissionNumber: s.admissionNumber || "",
        fatherName: s.fatherName || undefined,
        fatherPhone: s.fatherPhone || undefined,
        createdAt: s.createdAt || new Date(),
      };
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Student>): Promise<Student | null> {
    try {
      const updateData: Record<string, unknown> = {};
      if (data.firstName !== undefined) updateData.firstName = data.firstName;
      if (data.lastName !== undefined) updateData.lastName = data.lastName;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.classId !== undefined) updateData.classId = data.classId;
      if (data.fatherName !== undefined) updateData.fatherName = data.fatherName;
      if (data.fatherPhone !== undefined) updateData.fatherPhone = data.fatherPhone;

      const result = await db
        .update(students)
        .set(updateData)
        .where(eq(students.id, id))
        .returning();

      if (result.length === 0) {
        return null;
      }

      const s = result[0];
      return {
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email || undefined,
        phone: s.phone || undefined,
        classId: s.classId || undefined,
        admissionNumber: s.admissionNumber || "",
        fatherName: s.fatherName || undefined,
        fatherPhone: s.fatherPhone || undefined,
        createdAt: s.createdAt || new Date(),
      };
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await db.delete(students).where(eq(students.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  },

  async count(): Promise<number> {
    try {
      const result = await db
        .select({ count: count() })
        .from(students);
      return Number(result[0]?.count || 0);
    } catch (error) {
      console.error("Error counting students:", error);
      throw error;
    }
  },

  async search(term: string): Promise<Student[]> {
    try {
      const searchTerm = `%${term}%`;
      const result = await db
        .select()
        .from(students)
        .where(
          or(
            like(students.firstName, searchTerm),
            like(students.lastName, searchTerm),
            like(students.admissionNumber || sql`''`, searchTerm),
            like(students.email || sql`''`, searchTerm)
          )
        )
        .orderBy(desc(students.createdAt));

      return result.map((s) => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email || undefined,
        phone: s.phone || undefined,
        classId: s.classId || undefined,
        admissionNumber: s.admissionNumber || "",
        fatherName: s.fatherName || undefined,
        fatherPhone: s.fatherPhone || undefined,
        createdAt: s.createdAt || new Date(),
      }));
    } catch (error) {
      console.error("Error searching students:", error);
      throw error;
    }
  },
};

// ============ TEACHERS SERVICE ============

export const teachersService = {
  async list(limit?: number, offset?: number): Promise<Teacher[]> {
    try {
      const queryBuilder = db.select().from(teachers).orderBy(desc(teachers.createdAt));
      
      if (limit !== undefined && offset !== undefined) {
        const result = await queryBuilder.limit(limit).offset(offset);
        return result.map((t) => ({
          id: t.id,
          firstName: t.firstName,
          lastName: t.lastName,
          email: t.email || undefined,
          phone: t.phone || undefined,
          employeeId: t.employeeId || "",
          qualification: t.qualification || undefined,
          subjectSpecialization: t.subjectSpecialization || undefined,
          createdAt: t.createdAt || new Date(),
        }));
      }
      
      if (limit !== undefined) {
        const result = await queryBuilder.limit(limit);
        return result.map((t) => ({
          id: t.id,
          firstName: t.firstName,
          lastName: t.lastName,
          email: t.email || undefined,
          phone: t.phone || undefined,
          employeeId: t.employeeId || "",
          qualification: t.qualification || undefined,
          subjectSpecialization: t.subjectSpecialization || undefined,
          createdAt: t.createdAt || new Date(),
        }));
      }
      
      const result = await queryBuilder;
      return result.map((t) => ({
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        email: t.email || undefined,
        phone: t.phone || undefined,
        employeeId: t.employeeId || "",
        qualification: t.qualification || undefined,
        subjectSpecialization: t.subjectSpecialization || undefined,
        createdAt: t.createdAt || new Date(),
      }));
    } catch (error) {
      console.error("Error listing teachers:", error);
      throw error;
    }
  },

  async get(id: string): Promise<Teacher | null> {
    try {
      const result = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, id))
        .limit(1);
      
      if (result.length === 0) return null;

      const t = result[0];
      return {
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        email: t.email || undefined,
        phone: t.phone || undefined,
        employeeId: t.employeeId || "",
        qualification: t.qualification || undefined,
        subjectSpecialization: t.subjectSpecialization || undefined,
        createdAt: t.createdAt || new Date(),
      };
    } catch (error) {
      console.error("Error getting teacher:", error);
      throw error;
    }
  },

  async create(
    data: Omit<Teacher, "id" | "employeeId" | "createdAt">,
  ): Promise<Teacher> {
    try {
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

      if (result.length === 0) {
        throw new Error("Failed to create teacher");
      }

      const t = result[0];
      return {
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        email: t.email || undefined,
        phone: t.phone || undefined,
        employeeId: t.employeeId || "",
        qualification: t.qualification || undefined,
        subjectSpecialization: t.subjectSpecialization || undefined,
        createdAt: t.createdAt || new Date(),
      };
    } catch (error) {
      console.error("Error creating teacher:", error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Teacher>): Promise<Teacher | null> {
    try {
      const updateData: Record<string, unknown> = {};
      if (data.firstName !== undefined) updateData.firstName = data.firstName;
      if (data.lastName !== undefined) updateData.lastName = data.lastName;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.qualification !== undefined) updateData.qualification = data.qualification;
      if (data.subjectSpecialization !== undefined) updateData.subjectSpecialization = data.subjectSpecialization;

      const result = await db
        .update(teachers)
        .set(updateData)
        .where(eq(teachers.id, id))
        .returning();

      if (result.length === 0) return null;

      const t = result[0];
      return {
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        email: t.email || undefined,
        phone: t.phone || undefined,
        employeeId: t.employeeId || "",
        qualification: t.qualification || undefined,
        subjectSpecialization: t.subjectSpecialization || undefined,
        createdAt: t.createdAt || new Date(),
      };
    } catch (error) {
      console.error("Error updating teacher:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await db.delete(teachers).where(eq(teachers.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting teacher:", error);
      throw error;
    }
  },

  async count(): Promise<number> {
    try {
      const result = await db.select({ count: count() }).from(teachers);
      return Number(result[0]?.count || 0);
    } catch (error) {
      console.error("Error counting teachers:", error);
      throw error;
    }
  },
};

// ============ CLASSES SERVICE ============

export const classesService = {
  async list(): Promise<Class[]> {
    try {
      const result = await db
        .select()
        .from(classes)
        .orderBy(asc(classes.name));
      return result.map((c) => ({
        id: c.id,
        name: c.name,
        section: c.section || undefined,
        capacity: c.capacity || undefined,
        classTeacherId: c.classTeacherId || undefined,
        createdAt: c.createdAt || new Date(),
      }));
    } catch (error) {
      console.error("Error listing classes:", error);
      throw error;
    }
  },

  async get(id: string): Promise<Class | null> {
    try {
      const result = await db
        .select()
        .from(classes)
        .where(eq(classes.id, id))
        .limit(1);
      
      if (result.length === 0) return null;

      const c = result[0];
      return {
        id: c.id,
        name: c.name,
        section: c.section || undefined,
        capacity: c.capacity || undefined,
        classTeacherId: c.classTeacherId || undefined,
        createdAt: c.createdAt || new Date(),
      };
    } catch (error) {
      console.error("Error getting class:", error);
      throw error;
    }
  },

  async create(data: Omit<Class, "id" | "createdAt">): Promise<Class> {
    try {
      const result = await db
        .insert(classes)
        .values({
          name: data.name,
          section: data.section,
          capacity: data.capacity,
          classTeacherId: data.classTeacherId,
        })
        .returning();

      if (result.length === 0) {
        throw new Error("Failed to create class");
      }

      const c = result[0];
      return {
        id: c.id,
        name: c.name,
        section: c.section || undefined,
        capacity: c.capacity || undefined,
        classTeacherId: c.classTeacherId || undefined,
        createdAt: c.createdAt || new Date(),
      };
    } catch (error) {
      console.error("Error creating class:", error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Class>): Promise<Class | null> {
    try {
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.section !== undefined) updateData.section = data.section;
      if (data.capacity !== undefined) updateData.capacity = data.capacity;
      if (data.classTeacherId !== undefined) updateData.classTeacherId = data.classTeacherId;

      const result = await db
        .update(classes)
        .set(updateData)
        .where(eq(classes.id, id))
        .returning();

      if (result.length === 0) return null;

      const c = result[0];
      return {
        id: c.id,
        name: c.name,
        section: c.section || undefined,
        capacity: c.capacity || undefined,
        classTeacherId: c.classTeacherId || undefined,
        createdAt: c.createdAt || new Date(),
      };
    } catch (error) {
      console.error("Error updating class:", error);
      throw error;
    }
  },

  async count(): Promise<number> {
    try {
      const result = await db.select({ count: count() }).from(classes);
      return Number(result[0]?.count || 0);
    } catch (error) {
      console.error("Error counting classes:", error);
      throw error;
    }
  },
};

// ============ FEES SERVICE ============

export const feesService = {
  async list(studentId?: string): Promise<FeePayment[]> {
    try {
      let query = db.select().from(feePayments).orderBy(desc(feePayments.paymentDate));
      if (studentId) {
        query = query.where(eq(feePayments.studentId, studentId));
      }
      const result = await query;
      return result.map((f) => ({
        id: f.id,
        studentId: f.studentId,
        amount: Number(f.amount || 0),
        paymentDate: f.paymentDate || new Date(),
        paymentMethod: f.paymentMethod as "cash" | "card" | "online" | "cheque" | undefined,
        status: (f.status || "pending") as "pending" | "completed" | "failed",
        receiptNumber: f.receiptNumber || "",
      }));
    } catch (error) {
      console.error("Error listing fees:", error);
      throw error;
    }
  },

  async getStats(): Promise<{ totalCollected: number; pending: number }> {
    try {
      const [completed, pending] = await Promise.all([
        db
          .select({ total: sql<number>`sum(${feePayments.amount})` })
          .from(feePayments)
          .where(eq(feePayments.status, "completed")),
        db
          .select({ total: sql<number>`sum(${feePayments.amount})` })
          .from(feePayments)
          .where(eq(feePayments.status, "pending")),
      ]);

      return {
        totalCollected: Number(completed[0]?.total || 0),
        pending: Number(pending[0]?.total || 0),
      };
    } catch (error) {
      console.error("Error getting fee stats:", error);
      throw error;
    }
  },

  async create(
    data: Omit<FeePayment, "id" | "receiptNumber">,
  ): Promise<FeePayment> {
    try {
      const receiptNumber = `RCP${Date.now()}`;
      const result = await db
        .insert(feePayments)
        .values({
          studentId: data.studentId,
          amount: data.amount.toString(),
          paymentDate: data.paymentDate,
          paymentMethod: data.paymentMethod,
          status: data.status || "pending",
          receiptNumber,
        })
        .returning();

      if (result.length === 0) {
        throw new Error("Failed to create fee payment");
      }

      const f = result[0];
      return {
        id: f.id,
        studentId: f.studentId,
        amount: Number(f.amount || 0),
        paymentDate: f.paymentDate || new Date(),
        paymentMethod: f.paymentMethod as "cash" | "card" | "online" | "cheque" | undefined,
        status: (f.status || "pending") as "pending" | "completed" | "failed",
        receiptNumber: f.receiptNumber || "",
      };
    } catch (error) {
      console.error("Error creating fee payment:", error);
      throw error;
    }
  },
};

// ============ EXAMS SERVICE ============

export const examsService = {
  async list(classId?: string): Promise<ExamSchedule[]> {
    try {
      let query = db.select().from(examSchedules).orderBy(asc(examSchedules.examDate));
      if (classId) {
        query = query.where(eq(examSchedules.classId || sql`''`, classId));
      }
      const result = await query;
      return result.map((e) => ({
        id: e.id,
        title: e.title || "",
        examType: e.examType || "",
        classId: e.classId || undefined,
        subjectId: e.subjectId || undefined,
        examDate: e.examDate || new Date(),
        startTime: e.startTime || "",
        endTime: e.endTime || "",
        totalMarks: e.totalMarks ? Number(e.totalMarks) : undefined,
      }));
    } catch (error) {
      console.error("Error listing exams:", error);
      throw error;
    }
  },

  async create(data: Omit<ExamSchedule, "id">): Promise<ExamSchedule> {
    try {
      const result = await db
        .insert(examSchedules)
        .values({
          title: data.title,
          examType: data.examType,
          classId: data.classId,
          subjectId: data.subjectId,
          examDate: data.examDate,
          startTime: data.startTime,
          endTime: data.endTime,
          totalMarks: data.totalMarks?.toString(),
        })
        .returning();

      if (result.length === 0) {
        throw new Error("Failed to create exam");
      }

      const e = result[0];
      return {
        id: e.id,
        title: e.title || "",
        examType: e.examType || "",
        classId: e.classId || undefined,
        subjectId: e.subjectId || undefined,
        examDate: e.examDate || new Date(),
        startTime: e.startTime || "",
        endTime: e.endTime || "",
        totalMarks: e.totalMarks ? Number(e.totalMarks) : undefined,
      };
    } catch (error) {
      console.error("Error creating exam:", error);
      throw error;
    }
  },

  async upcoming(limit: number = 10): Promise<ExamSchedule[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const result = await db
        .select()
        .from(examSchedules)
        .where(gte(examSchedules.examDate, today))
        .orderBy(asc(examSchedules.examDate))
        .limit(limit);

      return result.map((e) => ({
        id: e.id,
        title: e.title || "",
        examType: e.examType || "",
        classId: e.classId || undefined,
        subjectId: e.subjectId || undefined,
        examDate: e.examDate || new Date(),
        startTime: e.startTime || "",
        endTime: e.endTime || "",
        totalMarks: e.totalMarks ? Number(e.totalMarks) : undefined,
      }));
    } catch (error) {
      console.error("Error getting upcoming exams:", error);
      throw error;
    }
  },
};

// ============ ATTENDANCE SERVICE ============

export const attendanceService = {
  async mark(
    studentId: string,
    classId: string,
    date: Date,
    status: string,
  ): Promise<void> {
    try {
      await db.insert(attendance).values({
        studentId,
        classId,
        date,
        status: status as "present" | "absent" | "late" | "excused",
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }
  },

  async getByStudent(studentId: string): Promise<any[]> {
    try {
      const result = await db
        .select()
        .from(attendance)
        .where(eq(attendance.studentId, studentId))
        .orderBy(desc(attendance.date));
      return result;
    } catch (error) {
      console.error("Error getting student attendance:", error);
      throw error;
    }
  },

  async getByClass(classId: string, date: Date): Promise<any[]> {
    try {
      const result = await db
        .select()
        .from(attendance)
        .where(and(eq(attendance.classId, classId), eq(attendance.date, date)));
      return result;
    } catch (error) {
      console.error("Error getting class attendance:", error);
      throw error;
    }
  },

  async getSummary(
    studentId: string,
    month: number,
    year: number,
  ): Promise<any> {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const result = await db
        .select()
        .from(attendance)
        .where(
          and(
            eq(attendance.studentId, studentId),
            gte(attendance.date, startDate),
            lte(attendance.date, endDate)
          )
        );

      const present = result.filter((r) => r.status === "present").length;
      const absent = result.filter((r) => r.status === "absent").length;
      const total = result.length;

      return {
        present,
        absent,
        total,
        percentage: total > 0 ? (present / total) * 100 : 0,
      };
    } catch (error) {
      console.error("Error getting attendance summary:", error);
      throw error;
    }
  },
};

// ============ LIBRARY SERVICE ============

export interface LibraryBook {
  id: string;
  bookNumber: string;
  title: string;
  author: string;
  publisher?: string;
  edition?: string;
  isbn?: string;
  category?: string;
  shelfNumber?: string;
  rackNumber?: string;
  totalCopies: number;
  availableCopies: number;
  price?: number;
  status: string;
  createdAt: Date;
}

export interface BookIssue {
  id: string;
  bookId: string;
  studentId?: string;
  staffId?: string;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  condition?: string;
  fine?: number;
  status: string;
}

export const libraryService = {
  async listBooks(limit?: number, offset?: number): Promise<LibraryBook[]> {
    try {
      let query = db.select().from(libraryBooks).orderBy(desc(libraryBooks.createdAt));
      
      if (limit !== undefined) {
        query = query.limit(limit);
      }
      if (offset !== undefined) {
        query = query.offset(offset);
      }
      
      const result = await query;
      return result.map((b) => ({
        id: b.id,
        bookNumber: b.bookNumber || "",
        title: b.title,
        author: b.author,
        publisher: b.publisher || undefined,
        edition: b.edition || undefined,
        isbn: b.isbn || undefined,
        category: b.category || undefined,
        shelfNumber: b.shelfNumber || undefined,
        rackNumber: b.rackNumber || undefined,
        totalCopies: b.totalCopies,
        availableCopies: b.availableCopies,
        price: b.price ? Number(b.price) : undefined,
        status: b.status || "available",
        createdAt: b.createdAt || new Date(),
      }));
    } catch (error) {
      console.error("Error listing books:", error);
      throw error;
    }
  },

  async getBook(id: string): Promise<LibraryBook | null> {
    try {
      const result = await db
        .select()
        .from(libraryBooks)
        .where(eq(libraryBooks.id, id))
        .limit(1);
      
      if (result.length === 0) return null;
      
      const b = result[0];
      return {
        id: b.id,
        bookNumber: b.bookNumber || "",
        title: b.title,
        author: b.author,
        publisher: b.publisher || undefined,
        edition: b.edition || undefined,
        isbn: b.isbn || undefined,
        category: b.category || undefined,
        shelfNumber: b.shelfNumber || undefined,
        rackNumber: b.rackNumber || undefined,
        totalCopies: b.totalCopies,
        availableCopies: b.availableCopies,
        price: b.price ? Number(b.price) : undefined,
        status: b.status || "available",
        createdAt: b.createdAt || new Date(),
      };
    } catch (error) {
      console.error("Error getting book:", error);
      throw error;
    }
  },

  async issueBook(
    bookId: string,
    borrowerId: string,
    borrowerType: "student" | "staff",
    dueDate: Date,
  ): Promise<BookIssue> {
    try {
      // Check book availability
      const book = await this.getBook(bookId);
      if (!book) {
        throw new NotFoundError("Book not found");
      }
      if (book.availableCopies <= 0) {
        throw new Error("Book not available for issue");
      }

      // Create issue record
      const issueData: Record<string, unknown> = {
        bookId,
        issueDate: new Date(),
        dueDate,
        status: "issued",
      };
      
      if (borrowerType === "student") {
        issueData.studentId = borrowerId;
      } else {
        issueData.staffId = borrowerId;
      }

      const result = await db
        .insert(bookIssues)
        .values(issueData)
        .returning();

      // Update available copies
      await db
        .update(libraryBooks)
        .set({ availableCopies: book.availableCopies - 1 })
        .where(eq(libraryBooks.id, bookId));

      const issue = result[0];
      return {
        id: issue.id,
        bookId: issue.bookId,
        studentId: issue.studentId || undefined,
        staffId: issue.staffId || undefined,
        issueDate: issue.issueDate,
        dueDate: issue.dueDate,
        returnDate: issue.returnDate || undefined,
        condition: issue.condition || undefined,
        fine: issue.fine ? Number(issue.fine) : undefined,
        status: issue.status || "issued",
      };
    } catch (error) {
      console.error("Error issuing book:", error);
      throw error;
    }
  },

  async returnBook(issueId: string, condition?: string): Promise<BookIssue> {
    try {
      // Get the issue record
      const issueResult = await db
        .select()
        .from(bookIssues)
        .where(eq(bookIssues.id, issueId))
        .limit(1);

      if (issueResult.length === 0) {
        throw new NotFoundError("Issue record not found");
      }

      const issue = issueResult[0];

      // Update issue record
      const updateData: Record<string, unknown> = {
        returnDate: new Date(),
        status: "returned",
      };
      if (condition) updateData.condition = condition;

      // Calculate fine if overdue
      const today = new Date();
      if (today > issue.dueDate) {
        const daysOverdue = Math.ceil((today.getTime() - issue.dueDate.getTime()) / (1000 * 60 * 60 * 24));
        const fineAmount = daysOverdue * 5; // $5 per day
        updateData.fine = fineAmount.toString();
      }

      const result = await db
        .update(bookIssues)
        .set(updateData)
        .where(eq(bookIssues.id, issueId))
        .returning();

      // Update available copies
      const book = await this.getBook(issue.bookId);
      if (book) {
        await db
          .update(libraryBooks)
          .set({ availableCopies: book.availableCopies + 1 })
          .where(eq(libraryBooks.id, issue.bookId));
      }

      const updated = result[0];
      return {
        id: updated.id,
        bookId: updated.bookId,
        studentId: updated.studentId || undefined,
        staffId: updated.staffId || undefined,
        issueDate: updated.issueDate,
        dueDate: updated.dueDate,
        returnDate: updated.returnDate || undefined,
        condition: updated.condition || undefined,
        fine: updated.fine ? Number(updated.fine) : undefined,
        status: updated.status || "returned",
      };
    } catch (error) {
      console.error("Error returning book:", error);
      throw error;
    }
  },

  async getStudentBooks(studentId: string): Promise<BookIssue[]> {
    try {
      const result = await db
        .select()
        .from(bookIssues)
        .where(and(
          eq(bookIssues.studentId, studentId),
          eq(bookIssues.status, "issued")
        ))
        .orderBy(desc(bookIssues.issueDate));

      return result.map((i) => ({
        id: i.id,
        bookId: i.bookId,
        studentId: i.studentId || undefined,
        staffId: i.staffId || undefined,
        issueDate: i.issueDate,
        dueDate: i.dueDate,
        returnDate: i.returnDate || undefined,
        condition: i.condition || undefined,
        fine: i.fine ? Number(i.fine) : undefined,
        status: i.status || "issued",
      }));
    } catch (error) {
      console.error("Error getting student books:", error);
      throw error;
    }
  },

  async searchBooks(query: string): Promise<LibraryBook[]> {
    try {
      const searchTerm = `%${query}%`;
      const result = await db
        .select()
        .from(libraryBooks)
        .where(
          or(
            like(libraryBooks.title, searchTerm),
            like(libraryBooks.author, searchTerm),
            like(libraryBooks.isbn || sql`''`, searchTerm),
            like(libraryBooks.category || sql`''`, searchTerm)
          )
        )
        .orderBy(desc(libraryBooks.createdAt));

      return result.map((b) => ({
        id: b.id,
        bookNumber: b.bookNumber || "",
        title: b.title,
        author: b.author,
        publisher: b.publisher || undefined,
        edition: b.edition || undefined,
        isbn: b.isbn || undefined,
        category: b.category || undefined,
        shelfNumber: b.shelfNumber || undefined,
        rackNumber: b.rackNumber || undefined,
        totalCopies: b.totalCopies,
        availableCopies: b.availableCopies,
        price: b.price ? Number(b.price) : undefined,
        status: b.status || "available",
        createdAt: b.createdAt || new Date(),
      }));
    } catch (error) {
      console.error("Error searching books:", error);
      throw error;
    }
  },
};

// ============ TRANSPORT SERVICE ============

export interface TransportRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  distance?: number;
  estimatedTime?: number;
  status: string;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  capacity: number;
  routeId?: string;
  status: string;
  insuranceExpiry?: Date;
  fitnessExpiry?: Date;
}

export interface GPSLocation {
  id: string;
  vehicleId: string;
  driverId?: string;
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp: Date;
  location?: string;
}

export const transportService = {
  async listRoutes(): Promise<TransportRoute[]> {
    try {
      const result = await db
        .select()
        .from(transportRoutes)
        .orderBy(asc(transportRoutes.routeNumber));

      return result.map((r) => ({
        id: r.id,
        routeNumber: r.routeNumber || "",
        routeName: r.routeName,
        startPoint: r.startPoint,
        endPoint: r.endPoint,
        distance: r.distance ? Number(r.distance) : undefined,
        estimatedTime: r.estimatedTime || undefined,
        status: r.status || "active",
        createdAt: r.createdAt || new Date(),
      }));
    } catch (error) {
      console.error("Error listing routes:", error);
      throw error;
    }
  },

  async getRoute(id: string): Promise<TransportRoute | null> {
    try {
      const result = await db
        .select()
        .from(transportRoutes)
        .where(eq(transportRoutes.id, id))
        .limit(1);

      if (result.length === 0) return null;

      const r = result[0];
      return {
        id: r.id,
        routeNumber: r.routeNumber || "",
        routeName: r.routeName,
        startPoint: r.startPoint,
        endPoint: r.endPoint,
        distance: r.distance ? Number(r.distance) : undefined,
        estimatedTime: r.estimatedTime || undefined,
        status: r.status || "active",
        createdAt: r.createdAt || new Date(),
      };
    } catch (error) {
      console.error("Error getting route:", error);
      throw error;
    }
  },

  async listVehicles(): Promise<Vehicle[]> {
    try {
      const result = await db
        .select()
        .from(vehicles)
        .orderBy(asc(vehicles.vehicleNumber));

      return result.map((v) => ({
        id: v.id,
        vehicleNumber: v.vehicleNumber || "",
        vehicleType: v.vehicleType,
        capacity: v.capacity,
        routeId: v.routeId || undefined,
        status: v.status || "active",
        insuranceExpiry: v.insuranceExpiry || undefined,
        fitnessExpiry: v.fitnessExpiry || undefined,
      }));
    } catch (error) {
      console.error("Error listing vehicles:", error);
      throw error;
    }
  },

  async getVehicleLocation(vehicleId: string): Promise<GPSLocation | null> {
    try {
      const result = await db
        .select()
        .from(gpsTracking)
        .where(eq(gpsTracking.vehicleId, vehicleId))
        .orderBy(desc(gpsTracking.timestamp))
        .limit(1);

      if (result.length === 0) return null;

      const loc = result[0];
      return {
        id: loc.id,
        vehicleId: loc.vehicleId,
        driverId: loc.driverId || undefined,
        latitude: Number(loc.latitude),
        longitude: Number(loc.longitude),
        speed: loc.speed ? Number(loc.speed) : undefined,
        timestamp: loc.timestamp || new Date(),
        location: loc.location || undefined,
      };
    } catch (error) {
      console.error("Error getting vehicle location:", error);
      throw error;
    }
  },

  async updateVehicleLocation(
    vehicleId: string,
    latitude: number,
    longitude: number,
    speed?: number,
    location?: string
  ): Promise<GPSLocation> {
    try {
      const result = await db
        .insert(gpsTracking)
        .values({
          vehicleId,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          speed: speed?.toString(),
          location,
        })
        .returning();

      const loc = result[0];
      return {
        id: loc.id,
        vehicleId: loc.vehicleId,
        driverId: loc.driverId || undefined,
        latitude: Number(loc.latitude),
        longitude: Number(loc.longitude),
        speed: loc.speed ? Number(loc.speed) : undefined,
        timestamp: loc.timestamp || new Date(),
        location: loc.location || undefined,
      };
    } catch (error) {
      console.error("Error updating vehicle location:", error);
      throw error;
    }
  },

  async getStudentRoute(studentId: string): Promise<TransportRoute | null> {
    try {
      // Find the student's assigned vehicle through student records
      const student = await studentsService.get(studentId);
      if (!student) {
        throw new NotFoundError("Student not found");
      }

      // Note: This assumes students have a transport_route_id field
      // You may need to adjust based on your actual schema
      // For now, returning null as placeholder
      return null;
    } catch (error) {
      console.error("Error getting student route:", error);
      throw error;
    }
  },
};

// ============ DASHBOARD STATS SERVICE ============

export const dashboardService = {
  async getStats(): Promise<{
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    monthlyFeeCollection: number;
    pendingFeePayments: number;
  }> {
    try {
      const [studentsCount, teachersCount, classesCount, feeStats] = await Promise.all([
        db.select({ count: count() }).from(students),
        db.select({ count: count() }).from(teachers),
        db.select({ count: count() }).from(classes),
        feesService.getStats(),
      ]);

      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const monthlyFees = await db
        .select({ total: sql<number>`sum(${feePayments.amount})` })
        .from(feePayments)
        .where(
          and(
            eq(feePayments.status, "completed"),
            gte(feePayments.paymentDate, currentMonth)
          )
        );

      return {
        totalStudents: Number(studentsCount[0]?.count || 0),
        totalTeachers: Number(teachersCount[0]?.count || 0),
        totalClasses: Number(classesCount[0]?.count || 0),
        monthlyFeeCollection: Number(monthlyFees[0]?.total || 0),
        pendingFeePayments: feeStats.pending,
      };
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      throw error;
    }
  },
};

// ============ COMBINED API ============

export const api = {
  students: studentsService,
  teachers: teachersService,
  classes: classesService,
  fees: feesService,
  exams: examsService,
  attendance: attendanceService,
  library: libraryService,
  transport: transportService,
  dashboard: dashboardService,
};

export default api;
