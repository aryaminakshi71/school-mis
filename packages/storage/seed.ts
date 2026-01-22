/**
 * Database Seed Script
 * Run with: cd packages/storage && bun run db:seed
 */

import { db } from "./src/db/index";
import {
  users,
  userPasswords,
  sessions,
  classes,
  feeCategories,
  feeStructures,
} from "./src/db/schema/school";
import { createHmac, randomBytes } from "crypto";

const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hash = createHmac("sha256", salt).update(password).digest("hex");
  return `${salt}:${hash}`;
};

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("⚠️  Data already exists. Skipping seed.");
      console.log("   To re-seed, delete all tables first.");
      return;
    }

    const [session] = await db
      .insert(sessions)
      .values({
        name: "2025-2026",
        startDate: new Date("2025-04-01"),
        endDate: new Date("2026-03-31"),
        isActive: true,
        status: "active",
      } as any)
      .returning();

    console.log("✅ Created session:", session.name);

    const classData = [
      { name: "Class 1", section: "A", capacity: 30 },
      { name: "Class 2", section: "A", capacity: 30 },
      { name: "Class 3", section: "A", capacity: 30 },
      { name: "Class 4", section: "A", capacity: 30 },
      { name: "Class 5", section: "A", capacity: 30 },
      { name: "Class 6", section: "A", capacity: 35 },
      { name: "Class 7", section: "A", capacity: 35 },
      { name: "Class 8", section: "A", capacity: 35 },
      { name: "Class 9", section: "A", capacity: 40 },
      { name: "Class 10", section: "A", capacity: 40 },
    ];

    const createdClasses = await db
      .insert(classes)
      .values(
        classData.map(
          (c) =>
            ({
              name: c.name,
              section: c.section,
              capacity: c.capacity,
              sessionId: session.id,
            }) as any,
        ),
      )
      .returning();

    console.log(`✅ Created ${createdClasses.length} classes`);

    const [tuitionCategory] = await db
      .insert(feeCategories)
      .values({
        name: "Tuition Fee",
        type: "tuition",
        isRecurring: true,
        frequency: "monthly",
      } as any)
      .returning();

    const [transportCategory] = await db
      .insert(feeCategories)
      .values({
        name: "Transport Fee",
        type: "transport",
        isRecurring: true,
        frequency: "monthly",
      } as any)
      .returning();

    console.log("✅ Created fee categories");

    const feeStructureData = createdClasses.map((cls: any, index: number) => ({
      categoryId: tuitionCategory.id,
      classId: cls.id,
      sessionId: session.id,
      amount: (5000 + index * 500).toString(),
      dueDate: new Date(),
      lateFee: "0",
    }));

    await db.insert(feeStructures).values(feeStructureData as any);
    console.log("✅ Created fee structures");

    const demoUsers = [
      {
        email: "admin@school.com",
        name: "Admin User",
        password: "admin123",
        role: "admin" as const,
      },
      {
        email: "teacher@school.com",
        name: "John Smith",
        password: "teacher123",
        role: "teacher" as const,
      },
      {
        email: "student@school.com",
        name: "Rahul Sharma",
        password: "student123",
        role: "student" as const,
      },
      {
        email: "parent@school.com",
        name: "Rajesh Sharma",
        password: "parent123",
        role: "parent" as const,
      },
      {
        email: "accountant@school.com",
        name: "Priya Patel",
        password: "accountant123",
        role: "accountant" as const,
      },
    ];

    for (const user of demoUsers) {
      const [createdUser] = await db
        .insert(users)
        .values({
          email: user.email,
          name: user.name,
          password: hashPassword(user.password),
          role: user.role,
          isActive: true,
        } as any)
        .returning();

      await db.insert(userPasswords).values({
        userId: createdUser.id,
        passwordHash: hashPassword(user.password),
      } as any);
    }

    console.log("✅ Created demo users:");
    console.log("   - admin@school.com / admin123");
    console.log("   - teacher@school.com / teacher123");
    console.log("   - student@school.com / student123");
    console.log("   - parent@school.com / parent123");
    console.log("   - accountant@school.com / accountant123");

    console.log("");
    console.log("🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

seed().catch(console.error);
