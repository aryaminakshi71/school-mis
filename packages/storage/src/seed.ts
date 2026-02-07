/**
 * Database Seed Script
 * Run this to populate the database with sample data
 *
 * Usage: bun run packages/storage/src/seed.ts
 */

import { db, schema } from "./db";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const toDateStr = (d: Date) => d.toISOString().split("T")[0];
const toTimeStr = (d: Date) => d.toTimeString().split(" ")[0];

const {
  sessions,
  classes,
  students,
  teachers,
  staff,
  subjects,
  feeCategories,
  feeStructures,
  studentFeeAllocations,
  feePayments,
  attendance,
  libraryBooks,
  bookIssues,
  transportRoutes,
  vehicles,
  drivers,
  holidays,
  assignments,
  dailyWorks,
  examSchedules,
  circulars,
} = schema;

const currentDate = new Date();

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // 0. Cleanup
    console.log("🧹 Cleaning up database...");
    // Truncate main tables with CASCADE to clean up all related data
    await db.execute(
      sql`TRUNCATE TABLE "sessions", "teachers", "transport_routes", "fee_categories", "holidays", "library_books", "circulars", "vehicles", "drivers" RESTART IDENTITY CASCADE`,
    );

    // 1. Create Session
    console.log("📚 Creating session...");
    const sessionId = uuidv4();
    await db.insert(sessions).values({
      id: sessionId,
      name: "2025-2026",
      startDate: "2025-04-01",
      endDate: "2026-03-31",
      isActive: true,
      status: "active",
    });

    // 2. Create Classes
    console.log("🏫 Creating classes...");
    const classIds: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const classId = uuidv4();
      classIds.push(classId);
      await db.insert(classes).values({
        id: classId,
        name: `Class ${i}`,
        section: ["A", "B", "C"][i % 3] || "A",
        sessionId,
        capacity: 40,
      });
    }

    // 3. Create Teachers
    console.log("👨‍🏫 Creating teachers...");
    const teacherIds: string[] = [];
    const subjectsList = [
      "Mathematics",
      "Physics",
      "Chemistry",
      "English",
      "Hindi",
      "Biology",
      "Physical Education",
      "Computer Science",
      "Social Science",
      "Art",
    ];
    for (let i = 0; i < 15; i++) {
      const teacherId = uuidv4();
      teacherIds.push(teacherId);
      await db.insert(teachers).values({
        id: teacherId,
        employeeId: `TCH-${String(i + 1).padStart(3, "0")}`,
        firstName: [
          "Rajesh",
          "Priya",
          "Amit",
          "Ananya",
          "Vikram",
          "Sneha",
          "Rahul",
          "Kavya",
          "Mohit",
          "Nisha",
          "Suresh",
          "Meera",
          "Raj",
          "Pooja",
          "Arun",
        ][i],
        lastName: [
          "Kumar",
          "Sharma",
          "Singh",
          "Gupta",
          "Patel",
          "Reddy",
          "Das",
          "Nair",
          "Agarwal",
          "Shah",
          "Kumar",
          "Desai",
          "Mehta",
          "Iyer",
          "Menon",
        ][i],
        email: `teacher${i + 1}@school.edu`,
        phone: `+91 98765${String(43000 + i).padEnd(5, "0")}`,
        qualification: "M.Sc, B.Ed",
        experience: 3 + (i % 10),
        subjectSpecialization: subjectsList[i % subjectsList.length],
        status: true,
      });
    }

    // 4. Create Students
    console.log("📝 Creating students...");
    const studentIds: string[] = [];
    const maleNames = [
      "Aryan",
      "Arjun",
      "Vivaan",
      "Aditya",
      "Sai",
      "Rohan",
      "Karthik",
      "Harsh",
      "Dhruv",
      "Krishna",
      "Yash",
      "Amit",
      "Sahil",
      "Nakul",
      "Parth",
    ];
    const femaleNames = [
      "Ananya",
      "Diya",
      "Saanvi",
      "Prisha",
      "Ananya",
      "Ishita",
      "Pooja",
      "Srishti",
      "Riya",
      "Aadhya",
      "Mira",
      "Navya",
      "Anvi",
      "Tanvi",
      "Rhea",
    ];
    const surnames = [
      "Sharma",
      "Gupta",
      "Patel",
      "Singh",
      "Reddy",
      "Kumar",
      "Das",
      "Nair",
      "Agarwal",
      "Shah",
    ];

    for (let i = 0; i < 50; i++) {
      const studentId = uuidv4();
      studentIds.push(studentId);
      const gender = i % 2 === 0 ? "Male" : "Female";
      const firstName =
        gender === "Male"
          ? maleNames[i % maleNames.length]
          : femaleNames[i % femaleNames.length];
      const classIndex = i % classIds.length;

      await db.insert(students).values({
        id: studentId,
        admissionNumber: `ADM-${String(i + 1).padStart(4, "0")}`,
        firstName,
        lastName: surnames[i % surnames.length],
        email: `${firstName.toLowerCase()}.${surnames[i % surnames.length].toLowerCase()}${i}@student.com`,
        phone: `+91 98765${String(42000 + i).padEnd(5, "0")}`,
        dateOfBirth: toDateStr(
          new Date(2010 + (i % 5), i % 12, (i % 28) + 1),
        ),
        gender,
        bloodGroup: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"][i % 8],
        classId: classIds[classIndex],
        sessionId,
        fatherName: `${surnames[i % surnames.length]} Father`,
        fatherPhone: `+91 98765${String(42000 + i).padEnd(5, "0")}`,
        motherName: `${surnames[i % surnames.length]} Mother`,
        motherPhone: `+91 98765${String(43000 + i).padEnd(5, "0")}`,
        status: true,
      });
    }

    // 5. Create Subjects
    console.log("📖 Creating subjects...");
    for (const classId of classIds) {
      for (let j = 0; j < 5; j++) {
        await db.insert(subjects).values({
          name: subjectsList[j],
          code: `SUB-${classIds.indexOf(classId) + 1}-${j + 1}`,
          classId,
          teacherId: teacherIds[j % teacherIds.length],
        });
      }
    }

    // 6. Create Fee Categories
    console.log("💰 Creating fee categories...");
    const categoryTuition = uuidv4();
    const categoryTransport = uuidv4();
    const categoryExam = uuidv4();

    await db.insert(feeCategories).values([
      {
        id: categoryTuition,
        name: "Tuition Fee",
        type: "tuition",
        isRecurring: true,
        frequency: "monthly",
      },
      {
        id: categoryTransport,
        name: "Transport Fee",
        type: "transport",
        isRecurring: true,
        frequency: "monthly",
      },
      { id: categoryExam, name: "Exam Fee", type: "exam", isRecurring: false },
    ]);

    // 7. Create Fee Structures
    console.log("📊 Creating fee structures...");
    for (const classId of classIds) {
      const classNum = classIds.indexOf(classId) + 1;
      await db.insert(feeStructures).values([
        {
          categoryId: categoryTuition,
          classId,
          sessionId,
          amount: (5000 + classNum * 500).toString(),
          dueDate: toDateStr(
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              15,
            ),
          ),
        },
        {
          categoryId: categoryTransport,
          classId,
          sessionId,
          amount: "2000",
          dueDate: toDateStr(
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              15,
            ),
          ),
        },
        {
          categoryId: categoryExam,
          classId,
          sessionId,
          amount: "1500",
          dueDate: "2025-12-15",
        },
      ]);
    }

    // 8. Create Attendance Records
    console.log("✅ Creating attendance records...");
    for (const studentId of studentIds) {
      for (let d = 0; d < 30; d++) {
        const date = new Date();
        date.setDate(date.getDate() - d);
        if (date.getDay() === 0) continue;

        const status = Math.random() > 0.1 ? "present" : "absent";
        await db.insert(attendance).values({
          studentId,
          classId: classIds[studentIds.indexOf(studentId) % classIds.length],
          sessionId,
          date: toDateStr(date),
          status,
          checkInTime:
            status === "present"
              ? toTimeStr(new Date(date.setHours(7, 45)))
              : null,
        });
      }
    }

    // 9. Create Library Books
    console.log("📚 Creating library books...");
    const bookTitles = [
      "The Adventures of Sherlock Holmes",
      "Harry Potter and the Philosopher's Stone",
      "The Diary of a Young Girl",
      "A Brief History of Time",
      "The Alchemist",
      "To Kill a Mockingbird",
      "1984",
      "The Great Gatsby",
      "Pride and Prejudice",
      "The Catcher in the Rye",
      "The Hobbit",
      "Fahrenheit 451",
      "Brave New World",
      "Animal Farm",
      "The Lord of the Rings",
    ];

    for (let i = 0; i < 50; i++) {
      await db.insert(libraryBooks).values({
        bookNumber: `LIB-${String(i + 1).padStart(4, "0")}`,
        title: bookTitles[i % bookTitles.length],
        author: `Author ${i + 1}`,
        publisher: "Publisher Inc",
        category: ["Fiction", "Science", "Biography", "History", "Reference"][
          i % 5
        ],
        totalCopies: 5,
        availableCopies: 5 - (i % 3),
        price: (200 + i * 10).toString(),
        status: "available",
      } as any);
    }

    // 10. Create Transport Routes
    console.log("🚌 Creating transport routes...");
    const route1 = uuidv4();
    const route2 = uuidv4();
    const route3 = uuidv4();

    await db.insert(transportRoutes).values([
      {
        id: route1,
        routeNumber: "R001",
        routeName: "North Campus",
        startPoint: "Sector 15",
        endPoint: "City Centre",
        distance: "15.5",
        estimatedTime: 45,
      },
      {
        id: route2,
        routeNumber: "R002",
        routeName: "South Campus",
        startPoint: "DLF Phase 1",
        endPoint: "Golf Course Road",
        distance: "12.0",
        estimatedTime: 35,
      },
      {
        id: route3,
        routeNumber: "R003",
        routeName: "East Corridor",
        startPoint: "Indirapuram",
        endPoint: "Vasundhara",
        distance: "18.5",
        estimatedTime: 50,
      },
    ]);

    // 11. Create Vehicles
    console.log("🚍 Creating vehicles...");
    const vehicleIds: string[] = [];
    for (let i = 0; i < 5; i++) {
      const vehicleId = uuidv4();
      vehicleIds.push(vehicleId);
      await db.insert(vehicles).values({
        id: vehicleId,
        vehicleNumber: `HR-26-A-${String(1000 + i).padStart(4, "0")}`,
        vehicleType: i < 3 ? "bus" : "van",
        capacity: i < 3 ? 50 : 25,
        routeId: [route1, route2, route3, route1, route2][i],
        status: "active",
      });
    }

    // 12. Create Drivers
    console.log("👮 Creating drivers...");
    for (let i = 0; i < 5; i++) {
      await db.insert(drivers).values({
        employeeId: `DRV-${String(i + 1).padStart(3, "0")}`,
        firstName: ["Suresh", "Ramesh", "Mukesh", "Dinesh", "Ganesh"][i],
        lastName: "Kumar",
        phone: `+91 98765${String(44000 + i).padEnd(5, "0")}`,
        licenseNumber: `DL${String(10000000 + i)}`,
        vehicleId: vehicleIds[i],
        status: true,
      });
    }

    // 13. Create Holidays
    console.log("🎉 Creating holidays...");
    await db.insert(holidays).values([
      {
        title: "Independence Day",
        date: "2025-08-15",
        type: "national",
        isRecurring: true,
      },
      {
        title: "Republic Day",
        date: "2026-01-26",
        type: "national",
        isRecurring: true,
      },
      {
        title: "Diwali Vacation",
        date: "2025-11-12",
        type: "festival",
        isRecurring: true,
      },
      {
        title: "Christmas",
        date: "2025-12-25",
        type: "festival",
        isRecurring: true,
      },
      {
        title: "Summer Vacation",
        date: "2025-05-25",
        type: "vacation",
        isRecurring: true,
      },
    ]);

    // 14. Create Sample Assignments
    console.log("📋 Creating assignments...");
    for (let i = 0; i < 20; i++) {
      await db.insert(assignments).values({
        title: `Assignment ${i + 1}`,
        description: "Complete the given exercises and submit before due date",
        classId: classIds[i % classIds.length],
        subjectId: (await db
          .select()
          .from(subjects)
          .limit(1)
          .then((r) => r[0]?.id))!,
        teacherId: teacherIds[i % teacherIds.length],
        dueDate: new Date(Date.now() + (7 - i) * 24 * 60 * 60 * 1000),
        maxMarks: 100,
        status: "active",
      });
    }

    // 15. Create Sample Circulars
    console.log("📢 Creating circulars...");
    await db.insert(circulars).values([
      {
        title: "Parent-Teacher Meeting",
        content:
          "PTM scheduled for next Saturday at 10 AM. All parents are requested to attend.",
        circularNumber: "CIR-001",
        date: toDateStr(new Date()),
        type: "general",
        priority: "normal",
        status: "published",
      },
      {
        title: "Holiday Notice - Independence Day",
        content:
          "School will remain closed on August 15th, 2025 on account of Independence Day.",
        circularNumber: "CIR-002",
        date: "2025-08-10",
        type: "holiday",
        priority: "urgent",
        status: "published",
      },
      {
        title: "Annual Sports Day",
        content:
          "Annual sports day will be held on February 5th, 2026. Parents are cordially invited.",
        circularNumber: "CIR-003",
        date: "2025-08-01",
        type: "event",
        priority: "normal",
        status: "published",
      },
    ]);

    console.log("✅ Database seed completed successfully!");
    console.log(`📊 Summary:
    - 1 Session created
    - ${classIds.length} Classes created
    - ${teacherIds.length} Teachers created
    - ${studentIds.length} Students created
    - 5 Subjects per class
    - 3 Fee Categories
    - 30 Fee Structures
    - 30 days attendance records per student
    - 50 Library books
    - 3 Transport routes
    - 5 Vehicles
    - 5 Drivers
    - 5 Holidays
    - 20 Assignments
    - 3 Circulars`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

seed().catch(console.error);
