import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock, storageTables } = vi.hoisted(() => ({
  dbMock: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  storageTables: {
    students: {
      id: "id",
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      phone: "phone",
      classId: "classId",
      admissionNumber: "admissionNumber",
      fatherName: "fatherName",
      fatherPhone: "fatherPhone",
      createdAt: "createdAt",
    },
    teachers: {
      id: "id",
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      phone: "phone",
      employeeId: "employeeId",
      qualification: "qualification",
      subjectSpecialization: "subjectSpecialization",
      createdAt: "createdAt",
    },
    classes: {
      id: "id",
      name: "name",
      section: "section",
      capacity: "capacity",
      classTeacherId: "classTeacherId",
      createdAt: "createdAt",
    },
    feePayments: {
      id: "id",
      studentId: "studentId",
      allocationId: "allocationId",
      amount: "amount",
      paymentDate: "paymentDate",
      paymentMethod: "paymentMethod",
      status: "status",
      receiptNumber: "receiptNumber",
    },
    examSchedules: {
      id: "id",
      title: "title",
      examType: "examType",
      classId: "classId",
      subjectId: "subjectId",
      examDate: "examDate",
      startTime: "startTime",
      endTime: "endTime",
      totalMarks: "totalMarks",
    },
    attendance: {
      studentId: "studentId",
      classId: "classId",
      sessionId: "sessionId",
      date: "date",
      status: "status",
    },
    libraryBooks: {
      id: "id",
      title: "title",
      author: "author",
      isbn: "isbn",
      category: "category",
      createdAt: "createdAt",
    },
    bookIssues: {
      id: "id",
      studentId: "studentId",
      status: "status",
      issueDate: "issueDate",
      dueDate: "dueDate",
    },
    transportRoutes: {
      id: "id",
      routeNumber: "routeNumber",
    },
    vehicles: {
      id: "id",
      vehicleNumber: "vehicleNumber",
      insuranceExpiry: "insuranceExpiry",
      fitnessExpiry: "fitnessExpiry",
    },
    gpsTracking: {
      id: "id",
      vehicleId: "vehicleId",
      timestamp: "timestamp",
      latitude: "latitude",
      longitude: "longitude",
      speed: "speed",
      location: "location",
      driverId: "driverId",
    },
  },
}));

vi.mock("@school/storage", () => ({
  db: dbMock,
  ...storageTables,
}));

vi.mock("drizzle-orm", () => ({
  and: vi.fn((...args) => args),
  asc: vi.fn((arg) => arg),
  count: vi.fn(() => "count"),
  desc: vi.fn((arg) => arg),
  eq: vi.fn((a, b) => ({ a, b })),
  gte: vi.fn((a, b) => ({ a, b })),
  like: vi.fn((a, b) => ({ a, b })),
  lte: vi.fn((a, b) => ({ a, b })),
  or: vi.fn((...args) => args),
  sql: vi.fn((strings: TemplateStringsArray, ...values: unknown[]) => ({
    strings,
    values,
  })),
}));

import {
  attendanceService,
  classesService,
  dashboardService,
  examsService,
  feesService,
  libraryService,
  studentsService,
  teachersService,
  transportService,
} from "./index";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("db modular services behavior", () => {
  it("studentsService.list maps rows", async () => {
    const rows = [
      {
        id: "s1",
        firstName: "Ada",
        lastName: "Lovelace",
        email: null,
        phone: null,
        classId: null,
        admissionNumber: "ADM-1",
        fatherName: null,
        fatherPhone: null,
        createdAt: new Date("2026-03-02T00:00:00.000Z"),
      },
    ];

    dbMock.select.mockReturnValueOnce({
      from: () => ({
        orderBy: async () => rows,
      }),
    });

    const result = await studentsService.list();
    expect(result[0]?.admissionNumber).toBe("ADM-1");
  });

  it("teachersService.count returns numeric count", async () => {
    dbMock.select.mockReturnValueOnce({
      from: async () => [{ count: 7 }],
    });

    const result = await teachersService.count();
    expect(result).toBe(7);
  });

  it("classesService.create returns mapped class", async () => {
    dbMock.insert.mockReturnValueOnce({
      values: () => ({
        returning: async () => [
          {
            id: "c1",
            name: "Class 9",
            section: "A",
            capacity: 40,
            classTeacherId: null,
            createdAt: new Date("2026-03-02T00:00:00.000Z"),
          },
        ],
      }),
    });

    const created = await classesService.create({
      name: "Class 9",
      section: "A",
      capacity: 40,
      classTeacherId: undefined,
    });

    expect(created.id).toBe("c1");
  });

  it("feesService.create persists allocationId", async () => {
    const valuesSpy = vi.fn(() => ({
      returning: async () => [
        {
          id: "f1",
          studentId: "s1",
          amount: "500",
          paymentDate: new Date("2026-03-02T00:00:00.000Z"),
          paymentMethod: "cash",
          status: "pending",
          receiptNumber: "R-1",
        },
      ],
    }));

    dbMock.insert.mockReturnValueOnce({ values: valuesSpy });

    await feesService.create({
      studentId: "s1",
      allocationId: "a1",
      amount: 500,
      paymentDate: new Date("2026-03-02T00:00:00.000Z"),
      paymentMethod: "cash",
      status: "pending",
    });

    expect(valuesSpy).toHaveBeenCalledWith(
      expect.objectContaining({ allocationId: "a1" }),
    );
  });

  it("examsService.upcoming maps examDate to Date", async () => {
    dbMock.select.mockReturnValueOnce({
      from: () => ({
        where: () => ({
          orderBy: () => ({
            limit: async () => [
              {
                id: "e1",
                title: "Midterm",
                examType: "midterm",
                classId: null,
                subjectId: null,
                examDate: "2026-03-20",
                startTime: "09:00",
                endTime: "11:00",
                totalMarks: 100,
              },
            ],
          }),
        }),
      }),
    });

    const result = await examsService.upcoming(1);
    expect(result[0]?.examDate).toBeInstanceOf(Date);
  });

  it("attendanceService.mark stores date as pg string", async () => {
    const valuesSpy = vi.fn(async () => undefined);
    dbMock.insert.mockReturnValueOnce({ values: valuesSpy });

    await attendanceService.mark({
      studentId: "s1",
      classId: "c1",
      sessionId: "sess1",
      date: new Date("2026-03-02T10:00:00.000Z"),
      status: "present",
    });

    expect(valuesSpy).toHaveBeenCalledWith(
      expect.objectContaining({ date: "2026-03-02" }),
    );
  });

  it("libraryService.getStudentBooks maps issue dates", async () => {
    dbMock.select.mockReturnValueOnce({
      from: () => ({
        where: () => ({
          orderBy: async () => [
            {
              id: "i1",
              bookId: "b1",
              studentId: "s1",
              staffId: null,
              issueDate: "2026-03-01",
              dueDate: "2026-03-08",
              returnDate: null,
              condition: null,
              fine: "0",
              status: "issued",
            },
          ],
        }),
      }),
    });

    const books = await libraryService.getStudentBooks("s1");
    expect(books[0]?.issueDate).toBeInstanceOf(Date);
  });

  it("transportService.updateVehicleLocation maps numeric fields", async () => {
    dbMock.insert.mockReturnValueOnce({
      values: () => ({
        returning: async () => [
          {
            id: "g1",
            vehicleId: "v1",
            driverId: null,
            latitude: "12.34",
            longitude: "56.78",
            speed: "40",
            timestamp: new Date("2026-03-02T00:00:00.000Z"),
            location: "Campus",
          },
        ],
      }),
    });

    const loc = await transportService.updateVehicleLocation(
      "v1",
      12.34,
      56.78,
      40,
      "Campus",
    );

    expect(loc.latitude).toBe(12.34);
    expect(loc.longitude).toBe(56.78);
  });

  it("dashboardService.getStats combines counts and fees", async () => {
    vi.spyOn(feesService, "getStats").mockResolvedValueOnce({
      totalCollected: 12000,
      pending: 500,
    });

    dbMock.select
      .mockReturnValueOnce({ from: async () => [{ count: 100 }] })
      .mockReturnValueOnce({ from: async () => [{ count: 12 }] })
      .mockReturnValueOnce({ from: async () => [{ count: 8 }] })
      .mockReturnValueOnce({
        from: () => ({
          where: async () => [{ total: 9000 }],
        }),
      });

    const stats = await dashboardService.getStats();

    expect(stats.totalStudents).toBe(100);
    expect(stats.totalTeachers).toBe(12);
    expect(stats.totalClasses).toBe(8);
    expect(stats.monthlyFeeCollection).toBe(9000);
    expect(stats.pendingFeePayments).toBe(500);
  });
});
