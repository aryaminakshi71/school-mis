/**
 * Database Seeding Script
 * Run with: bun run scripts/seed.ts
 */

import { getDb } from "../apps/api/src/lib/db.js";
import {
  students,
  classes,
  teachers,
  sessions,
  attendance,
  studentFeeAllocations,
  feeStructures,
  feeCategories,
} from "@school/storage";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

async function seed() {
  console.log("🌱 Starting database seeding...\n");

  const db = getDb();

  try {
    // Check if data already exists
    const existingClasses = await db.select().from(classes).limit(1);
    if (existingClasses.length > 0) {
      console.log("⚠️  Data already exists. Skipping seed.");
      console.log("   To re-seed, clear the database first.");
      return;
    }

    // Create active session
    console.log("📅 Creating session...");
    const sessionId = randomUUID();
    await db.insert(sessions).values({
      id: sessionId,
      name: "2025-2026",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2026-03-31"),
      isActive: true,
      status: "active",
    });

    // Create classes
    console.log("📚 Creating classes...");
    const classData = [
      { name: "Class 9", section: "A", capacity: 40 },
      { name: "Class 9", section: "B", capacity: 40 },
      { name: "Class 10", section: "A", capacity: 40 },
      { name: "Class 10", section: "B", capacity: 35 },
      { name: "Class 11", section: "A", capacity: 35 },
    ];

    const classIds: string[] = [];
    for (const cls of classData) {
      const id = randomUUID();
      await db.insert(classes).values({
        id,
        ...cls,
        sessionId,
      });
      classIds.push(id);
    }
    console.log(`   Created ${classData.length} classes`);

    // Create teachers
    console.log("👨‍🏫 Creating teachers...");
    const teacherData = [
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah@school.edu",
        phone: "555-0101",
        subject: "Mathematics",
      },
      {
        firstName: "Michael",
        lastName: "Chen",
        email: "michael@school.edu",
        phone: "555-0102",
        subject: "Physics",
      },
      {
        firstName: "Emily",
        lastName: "Davis",
        email: "emily@school.edu",
        phone: "555-0103",
        subject: "Chemistry",
      },
      {
        firstName: "Robert",
        lastName: "Wilson",
        email: "robert@school.edu",
        phone: "555-0104",
        subject: "English",
      },
      {
        firstName: "Jennifer",
        lastName: "Brown",
        email: "jennifer@school.edu",
        phone: "555-0105",
        subject: "Biology",
      },
    ];

    const teacherIds: string[] = [];
    for (const t of teacherData) {
      const id = randomUUID();
      await db.insert(teachers).values({
        id,
        employeeId: `TCH-${Date.now().toString().slice(-6)}`,
        ...t,
        subjectSpecialization: t.subject,
        status: true,
      });
      teacherIds.push(id);
    }
    console.log(`   Created ${teacherData.length} teachers`);

    // Create students
    console.log("👥 Creating students...");
    const studentData = [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john@email.com",
        classId: classIds[0],
        fatherName: "James Smith",
        fatherPhone: "555-1001",
      },
      {
        firstName: "Emma",
        lastName: "Wilson",
        email: "emma@email.com",
        classId: classIds[0],
        fatherName: "Robert Wilson",
        fatherPhone: "555-1002",
      },
      {
        firstName: "James",
        lastName: "Brown",
        email: "james@email.com",
        classId: classIds[0],
        fatherName: "William Brown",
        fatherPhone: "555-1003",
      },
      {
        firstName: "Sophia",
        lastName: "Davis",
        email: "sophia@email.com",
        classId: classIds[1],
        fatherName: "Michael Davis",
        fatherPhone: "555-1004",
      },
      {
        firstName: "Oliver",
        lastName: "Martinez",
        email: "oliver@email.com",
        classId: classIds[1],
        fatherName: "Carlos Martinez",
        fatherPhone: "555-1005",
      },
      {
        firstName: "Ava",
        lastName: "Johnson",
        email: "ava@email.com",
        classId: classIds[2],
        fatherName: "David Johnson",
        fatherPhone: "555-1006",
      },
      {
        firstName: "Isabella",
        lastName: "Garcia",
        email: "isabella@email.com",
        classId: classIds[2],
        fatherName: "Maria Garcia",
        fatherPhone: "555-1007",
      },
      {
        firstName: "Liam",
        lastName: "Rodriguez",
        email: "liam@email.com",
        classId: classIds[2],
        fatherName: "Juan Rodriguez",
        fatherPhone: "555-1008",
      },
    ];

    const studentIds: string[] = [];
    for (const s of studentData) {
      const id = randomUUID();
      await db.insert(students).values({
        id,
        admissionNumber: `STU-${Date.now().toString().slice(-6)}`,
        ...s,
        sessionId,
        status: true,
      });
      studentIds.push(id);
    }
    console.log(`   Created ${studentData.length} students`);

    // Create fee categories
    console.log("💰 Creating fee structure...");
    const categoryId = randomUUID();
    await db.insert(feeCategories).values({
      id: categoryId,
      name: "Tuition Fee",
      type: "tuition",
      isRecurring: true,
      frequency: "monthly",
    });

    // Create fee structures
    for (const classId of classIds) {
      await db.insert(feeStructures).values({
        id: randomUUID(),
        categoryId,
        classId,
        sessionId,
        amount: 5000,
        dueDate: new Date("2026-01-15"),
      });
    }

    // Create student fee allocations
    for (const studentId of studentIds) {
      await db.insert(studentFeeAllocations).values({
        id: randomUUID(),
        studentId,
        feeStructureId:
          (await db.select().from(feeStructures).limit(1))[0]?.id || null,
        amount: 5000,
        status: Math.random() > 0.5 ? "completed" : "pending",
      });
    }
    console.log("   Created fee structure and allocations");

    // Create attendance records
    console.log("📋 Creating attendance records...");
    const today = new Date().toISOString().split("T")[0];
    for (const studentId of studentIds) {
      await db.insert(attendance).values({
        id: randomUUID(),
        studentId,
        classId: studentIds.indexOf(studentId) < 4 ? classIds[0] : classIds[1],
        sessionId,
        date: today,
        status: ["present", "present", "present", "absent", "late"][
          Math.floor(Math.random() * 5)
        ] as any,
      });
    }
    console.log("   Created attendance records for today");

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\nTest Credentials:");
    console.log("  Admin: admin@school.edu / admin123");
    console.log("  Teacher: teacher@school.edu / teacher123");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed().catch(console.error);
