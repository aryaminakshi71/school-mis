/**
 * Mock Data API for Development
 *
 * This file provides mock data for all modules until the database is connected.
 * Replace these with actual database queries when connected.
 */

import { v4 as uuid } from "uuid";

// Types
export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  classId: string;
  className: string;
  rollNumber: number;
  fatherName: string;
  fatherPhone: string;
  attendance: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qualification: string;
  subject: string;
  salary: number;
  attendance: number;
  status: "active" | "on_leave" | "inactive";
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  section: string;
  capacity: number;
  studentCount: number;
  classTeacher: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  paymentMethod: string;
  status: "paid" | "pending" | "overdue";
  date: string;
}

export interface Exam {
  id: string;
  name: string;
  className: string;
  subject: string;
  date: string;
  status: "scheduled" | "completed" | "pending_results";
}

export interface AttendanceRecord {
  id: string;
  className: string;
  total: number;
  present: number;
  absent: number;
  percentage: number;
  date: string;
}

// Mock Data Stores
let students: Student[] = [
  {
    id: uuid(),
    admissionNumber: "STU001",
    firstName: "Aryan",
    lastName: "Sharma",
    email: "aryan@email.com",
    phone: "+91 98765 43210",
    classId: "1",
    className: "Class 10-A",
    rollNumber: 15,
    fatherName: "Rajesh Sharma",
    fatherPhone: "+91 98765 43211",
    attendance: 95,
    status: "active",
    createdAt: "2025-01-01",
  },
  {
    id: uuid(),
    admissionNumber: "STU002",
    firstName: "Priya",
    lastName: "Patel",
    email: "priya@email.com",
    phone: "+91 98765 43212",
    classId: "2",
    className: "Class 9-B",
    rollNumber: 22,
    fatherName: "Suresh Patel",
    fatherPhone: "+91 98765 43213",
    attendance: 92,
    status: "active",
    createdAt: "2025-01-02",
  },
  {
    id: uuid(),
    admissionNumber: "STU003",
    firstName: "Rahul",
    lastName: "Singh",
    email: "rahul@email.com",
    phone: "+91 98765 43214",
    classId: "3",
    className: "Class 11-A",
    rollNumber: 8,
    fatherName: "Amit Singh",
    fatherPhone: "+91 98765 43215",
    attendance: 88,
    status: "active",
    createdAt: "2025-01-03",
  },
  {
    id: uuid(),
    admissionNumber: "STU004",
    firstName: "Ananya",
    lastName: "Gupta",
    email: "ananya@email.com",
    phone: "+91 98765 43216",
    classId: "4",
    className: "Class 8-A",
    rollNumber: 31,
    fatherName: "Ravi Gupta",
    fatherPhone: "+91 98765 43217",
    attendance: 97,
    status: "active",
    createdAt: "2025-01-04",
  },
  {
    id: uuid(),
    admissionNumber: "STU005",
    firstName: "Vikram",
    lastName: "Kumar",
    email: "vikram@email.com",
    phone: "+91 98765 43218",
    classId: "5",
    className: "Class 12-B",
    rollNumber: 45,
    fatherName: "Sanjay Kumar",
    fatherPhone: "+91 98765 43219",
    attendance: 91,
    status: "active",
    createdAt: "2025-01-05",
  },
];

let teachers: Teacher[] = [
  {
    id: uuid(),
    employeeId: "TCH001",
    firstName: "Dr. Rajesh",
    lastName: "Kumar",
    email: "rajesh@school.edu",
    phone: "+91 98765 43220",
    qualification: "M.Sc, B.Ed",
    subject: "Mathematics",
    salary: 65000,
    attendance: 98,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: uuid(),
    employeeId: "TCH002",
    firstName: "Mrs. Priya",
    lastName: "Sharma",
    email: "priya@school.edu",
    phone: "+91 98765 43221",
    qualification: "M.Sc, B.Ed",
    subject: "Science",
    salary: 55000,
    attendance: 95,
    status: "active",
    createdAt: "2024-01-02",
  },
  {
    id: uuid(),
    employeeId: "TCH003",
    firstName: "Mr. Amit",
    lastName: "Singh",
    email: "amit@school.edu",
    phone: "+91 98765 43222",
    qualification: "M.P.Ed",
    subject: "Physical Education",
    salary: 45000,
    attendance: 92,
    status: "active",
    createdAt: "2024-01-03",
  },
  {
    id: uuid(),
    employeeId: "TCH004",
    firstName: "Ms. Ananya",
    lastName: "Gupta",
    email: "ananya@school.edu",
    phone: "+91 98765 43223",
    qualification: "M.A, B.Ed",
    subject: "English",
    salary: 40000,
    attendance: 97,
    status: "active",
    createdAt: "2024-01-04",
  },
];

let classes: Class[] = [
  {
    id: "1",
    name: "Class 10",
    section: "A",
    capacity: 45,
    studentCount: 42,
    classTeacher: "Dr. Rajesh Kumar",
  },
  {
    id: "2",
    name: "Class 10",
    section: "B",
    capacity: 45,
    studentCount: 40,
    classTeacher: "Mrs. Priya Sharma",
  },
  {
    id: "3",
    name: "Class 11",
    section: "A",
    capacity: 40,
    studentCount: 38,
    classTeacher: "Mr. Amit Singh",
  },
  {
    id: "4",
    name: "Class 8",
    section: "A",
    capacity: 45,
    studentCount: 40,
    classTeacher: "Ms. Ananya Gupta",
  },
  {
    id: "5",
    name: "Class 12",
    section: "B",
    capacity: 40,
    studentCount: 35,
    classTeacher: "Dr. Rajesh Kumar",
  },
];

let feePayments: FeePayment[] = [
  {
    id: uuid(),
    studentId: "1",
    studentName: "Aryan Sharma",
    className: "Class 10-A",
    amount: 45000,
    paymentMethod: "Online",
    status: "paid",
    date: "2026-01-20",
  },
  {
    id: uuid(),
    studentId: "2",
    studentName: "Priya Patel",
    className: "Class 9-B",
    amount: 38000,
    paymentMethod: "Cash",
    status: "paid",
    date: "2026-01-20",
  },
  {
    id: uuid(),
    studentId: "3",
    studentName: "Rahul Singh",
    className: "Class 11-A",
    amount: 52000,
    paymentMethod: "Online",
    status: "paid",
    date: "2026-01-19",
  },
  {
    id: uuid(),
    studentId: "4",
    studentName: "Ananya Gupta",
    className: "Class 8-A",
    amount: 35000,
    paymentMethod: "Pending",
    status: "pending",
    date: "2026-01-19",
  },
  {
    id: uuid(),
    studentId: "5",
    studentName: "Vikram Kumar",
    className: "Class 12-B",
    amount: 55000,
    paymentMethod: "Online",
    status: "overdue",
    date: "2026-01-18",
  },
];

let exams: Exam[] = [
  {
    id: uuid(),
    name: "Mathematics UT-3",
    className: "Class 10",
    subject: "Mathematics",
    date: "2026-01-25",
    status: "scheduled",
  },
  {
    id: uuid(),
    name: "Science UT-3",
    className: "Class 10",
    subject: "Science",
    date: "2026-01-27",
    status: "scheduled",
  },
  {
    id: uuid(),
    name: "English Half-Yearly",
    className: "Class 12",
    subject: "English",
    date: "2026-01-30",
    status: "pending_results",
  },
];

let attendanceRecords: AttendanceRecord[] = [
  {
    id: uuid(),
    className: "Class 10-A",
    total: 42,
    present: 40,
    absent: 2,
    percentage: 95.2,
    date: "2026-01-21",
  },
  {
    id: uuid(),
    className: "Class 10-B",
    total: 40,
    present: 38,
    absent: 2,
    percentage: 95.0,
    date: "2026-01-21",
  },
  {
    id: uuid(),
    className: "Class 9-A",
    total: 38,
    present: 37,
    absent: 1,
    percentage: 97.4,
    date: "2026-01-21",
  },
  {
    id: uuid(),
    className: "Class 9-B",
    total: 36,
    present: 34,
    absent: 2,
    percentage: 94.4,
    date: "2026-01-21",
  },
  {
    id: uuid(),
    className: "Class 8-A",
    total: 40,
    present: 39,
    absent: 1,
    percentage: 97.5,
    date: "2026-01-21",
  },
];

// API Functions
export const api = {
  // Students
  students: {
    list: async () => students,
    get: async (id: string) => students.find((s) => s.id === id),
    create: async (data: Omit<Student, "id" | "createdAt">) => {
      const newStudent = {
        ...data,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };
      students.push(newStudent);
      return newStudent;
    },
    update: async (id: string, data: Partial<Student>) => {
      const index = students.findIndex((s) => s.id === id);
      if (index !== -1) {
        students[index] = { ...students[index], ...data };
        return students[index];
      }
      return null;
    },
    delete: async (id: string) => {
      const index = students.findIndex((s) => s.id === id);
      if (index !== -1) {
        students.splice(index, 1);
        return true;
      }
      return false;
    },
  },

  // Teachers
  teachers: {
    list: async () => teachers,
    get: async (id: string) => teachers.find((t) => t.id === id),
    create: async (data: Omit<Teacher, "id" | "createdAt">) => {
      const newTeacher = {
        ...data,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };
      teachers.push(newTeacher);
      return newTeacher;
    },
    update: async (id: string, data: Partial<Teacher>) => {
      const index = teachers.findIndex((t) => t.id === id);
      if (index !== -1) {
        teachers[index] = { ...teachers[index], ...data };
        return teachers[index];
      }
      return null;
    },
    delete: async (id: string) => {
      const index = teachers.findIndex((t) => t.id === id);
      if (index !== -1) {
        teachers.splice(index, 1);
        return true;
      }
      return false;
    },
  },

  // Classes
  classes: {
    list: async () => classes,
    get: async (id: string) => classes.find((c) => c.id === id),
  },

  // Fees
  fees: {
    list: async () => feePayments,
    collect: async (data: Omit<FeePayment, "id">) => {
      const newPayment = { ...data, id: uuid() };
      feePayments.push(newPayment);
      return newPayment;
    },
    getStats: async () => ({
      totalCollected: feePayments
        .filter((f) => f.status === "paid")
        .reduce((sum, f) => sum + f.amount, 0),
      pending: feePayments
        .filter((f) => f.status === "pending")
        .reduce((sum, f) => sum + f.amount, 0),
      overdue: feePayments
        .filter((f) => f.status === "overdue")
        .reduce((sum, f) => sum + f.amount, 0),
    }),
  },

  // Exams
  exams: {
    list: async () => exams,
    create: async (data: Omit<Exam, "id">) => {
      const newExam = { ...data, id: uuid() };
      exams.push(newExam);
      return newExam;
    },
  },

  // Attendance
  attendance: {
    list: async () => attendanceRecords,
    getByDate: async (date: string) =>
      attendanceRecords.filter((a) => a.date === date),
  },

  // Dashboard Stats
  dashboard: {
    getStats: async () => ({
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalClasses: classes.length,
      todayAttendance: attendanceRecords[0]?.percentage || 0,
      monthlyFeeCollection: feePayments
        .filter((f) => f.status === "paid")
        .reduce((sum, f) => sum + f.amount, 0),
      pendingFeePayments: feePayments.filter(
        (f) => f.status === "pending" || f.status === "overdue",
      ).length,
    }),
  },
};

export default api;
