// Mock data for the School MIS

export interface Student {
    id: string
    name: string
    email: string
    grade: string
    section: string
    rollNumber: string
    phone: string
    address: string
    parentName: string
    parentPhone: string
    enrollmentDate: string
    status: "active" | "inactive"
}

export interface Teacher {
    id: string
    name: string
    email: string
    subject: string
    phone: string
}

export interface AttendanceRecord {
    id: string
    studentId: string
    studentName: string
    date: string
    status: "present" | "absent" | "late" | "excused"
    grade: string
    section: string
}

export interface GradeRecord {
    id: string
    studentId: string
    studentName: string
    subject: string
    examType: string
    score: number
    maxScore: number
    grade: string
    date: string
}

export interface ClassSchedule {
    id: string
    day: string
    startTime: string
    endTime: string
    subject: string
    teacher: string
    room: string
    grade: string
    section: string
}

// Mock Students
export const students: Student[] = [
    {
        id: "1",
        name: "Emma Thompson",
        email: "emma.thompson@school.edu",
        grade: "10",
        section: "A",
        rollNumber: "10A001",
        phone: "(555) 123-4567",
        address: "123 Oak Street, Springfield",
        parentName: "Robert Thompson",
        parentPhone: "(555) 123-4568",
        enrollmentDate: "2023-09-01",
        status: "active",
    },
    {
        id: "2",
        name: "James Wilson",
        email: "james.wilson@school.edu",
        grade: "10",
        section: "A",
        rollNumber: "10A002",
        phone: "(555) 234-5678",
        address: "456 Maple Avenue, Springfield",
        parentName: "Sarah Wilson",
        parentPhone: "(555) 234-5679",
        enrollmentDate: "2023-09-01",
        status: "active",
    },
    {
        id: "3",
        name: "Sophia Martinez",
        email: "sophia.martinez@school.edu",
        grade: "10",
        section: "B",
        rollNumber: "10B001",
        phone: "(555) 345-6789",
        address: "789 Pine Road, Springfield",
        parentName: "Carlos Martinez",
        parentPhone: "(555) 345-6790",
        enrollmentDate: "2023-09-01",
        status: "active",
    },
    {
        id: "4",
        name: "Liam Anderson",
        email: "liam.anderson@school.edu",
        grade: "9",
        section: "A",
        rollNumber: "9A001",
        phone: "(555) 456-7890",
        address: "321 Elm Street, Springfield",
        parentName: "Jennifer Anderson",
        parentPhone: "(555) 456-7891",
        enrollmentDate: "2023-09-01",
        status: "active",
    },
    {
        id: "5",
        name: "Olivia Brown",
        email: "olivia.brown@school.edu",
        grade: "9",
        section: "A",
        rollNumber: "9A002",
        phone: "(555) 567-8901",
        address: "654 Cedar Lane, Springfield",
        parentName: "Michael Brown",
        parentPhone: "(555) 567-8902",
        enrollmentDate: "2023-09-01",
        status: "active",
    },
    {
        id: "6",
        name: "Noah Davis",
        email: "noah.davis@school.edu",
        grade: "9",
        section: "B",
        rollNumber: "9B001",
        phone: "(555) 678-9012",
        address: "987 Birch Drive, Springfield",
        parentName: "Amanda Davis",
        parentPhone: "(555) 678-9013",
        enrollmentDate: "2023-09-01",
        status: "active",
    },
    {
        id: "7",
        name: "Ava Johnson",
        email: "ava.johnson@school.edu",
        grade: "11",
        section: "A",
        rollNumber: "11A001",
        phone: "(555) 789-0123",
        address: "147 Walnut Street, Springfield",
        parentName: "David Johnson",
        parentPhone: "(555) 789-0124",
        enrollmentDate: "2022-09-01",
        status: "active",
    },
    {
        id: "8",
        name: "William Garcia",
        email: "william.garcia@school.edu",
        grade: "11",
        section: "A",
        rollNumber: "11A002",
        phone: "(555) 890-1234",
        address: "258 Spruce Avenue, Springfield",
        parentName: "Maria Garcia",
        parentPhone: "(555) 890-1235",
        enrollmentDate: "2022-09-01",
        status: "active",
    },
]

// Mock Teachers
export const teachers: Teacher[] = [
    { id: "1", name: "Dr. Sarah Miller", email: "sarah.miller@school.edu", subject: "Mathematics", phone: "(555) 111-2222" },
    { id: "2", name: "Mr. John Smith", email: "john.smith@school.edu", subject: "English", phone: "(555) 222-3333" },
    { id: "3", name: "Ms. Emily Chen", email: "emily.chen@school.edu", subject: "Science", phone: "(555) 333-4444" },
    { id: "4", name: "Mr. Robert Lee", email: "robert.lee@school.edu", subject: "History", phone: "(555) 444-5555" },
    { id: "5", name: "Mrs. Lisa Park", email: "lisa.park@school.edu", subject: "Physics", phone: "(555) 555-6666" },
]

// Mock Attendance Records
export const attendanceRecords: AttendanceRecord[] = [
    { id: "1", studentId: "1", studentName: "Emma Thompson", date: "2026-01-25", status: "present", grade: "10", section: "A" },
    { id: "2", studentId: "2", studentName: "James Wilson", date: "2026-01-25", status: "present", grade: "10", section: "A" },
    { id: "3", studentId: "3", studentName: "Sophia Martinez", date: "2026-01-25", status: "absent", grade: "10", section: "B" },
    { id: "4", studentId: "4", studentName: "Liam Anderson", date: "2026-01-25", status: "late", grade: "9", section: "A" },
    { id: "5", studentId: "5", studentName: "Olivia Brown", date: "2026-01-25", status: "present", grade: "9", section: "A" },
    { id: "6", studentId: "6", studentName: "Noah Davis", date: "2026-01-25", status: "excused", grade: "9", section: "B" },
    { id: "7", studentId: "7", studentName: "Ava Johnson", date: "2026-01-25", status: "present", grade: "11", section: "A" },
    { id: "8", studentId: "8", studentName: "William Garcia", date: "2026-01-25", status: "present", grade: "11", section: "A" },
]

// Mock Grade Records
export const gradeRecords: GradeRecord[] = [
    { id: "1", studentId: "1", studentName: "Emma Thompson", subject: "Mathematics", examType: "Midterm", score: 92, maxScore: 100, grade: "A", date: "2026-01-15" },
    { id: "2", studentId: "1", studentName: "Emma Thompson", subject: "English", examType: "Midterm", score: 88, maxScore: 100, grade: "B+", date: "2026-01-15" },
    { id: "3", studentId: "2", studentName: "James Wilson", subject: "Mathematics", examType: "Midterm", score: 78, maxScore: 100, grade: "C+", date: "2026-01-15" },
    { id: "4", studentId: "2", studentName: "James Wilson", subject: "English", examType: "Midterm", score: 95, maxScore: 100, grade: "A", date: "2026-01-15" },
    { id: "5", studentId: "3", studentName: "Sophia Martinez", subject: "Mathematics", examType: "Midterm", score: 85, maxScore: 100, grade: "B", date: "2026-01-15" },
    { id: "6", studentId: "3", studentName: "Sophia Martinez", subject: "Science", examType: "Midterm", score: 91, maxScore: 100, grade: "A-", date: "2026-01-15" },
    { id: "7", studentId: "4", studentName: "Liam Anderson", subject: "History", examType: "Midterm", score: 87, maxScore: 100, grade: "B+", date: "2026-01-15" },
    { id: "8", studentId: "5", studentName: "Olivia Brown", subject: "Physics", examType: "Midterm", score: 94, maxScore: 100, grade: "A", date: "2026-01-15" },
]

// Mock Class Schedules
export const classSchedules: ClassSchedule[] = [
    { id: "1", day: "Monday", startTime: "08:00", endTime: "08:45", subject: "Mathematics", teacher: "Dr. Sarah Miller", room: "Room 101", grade: "10", section: "A" },
    { id: "2", day: "Monday", startTime: "08:50", endTime: "09:35", subject: "English", teacher: "Mr. John Smith", room: "Room 102", grade: "10", section: "A" },
    { id: "3", day: "Monday", startTime: "09:40", endTime: "10:25", subject: "Science", teacher: "Ms. Emily Chen", room: "Lab 1", grade: "10", section: "A" },
    { id: "4", day: "Monday", startTime: "10:40", endTime: "11:25", subject: "History", teacher: "Mr. Robert Lee", room: "Room 103", grade: "10", section: "A" },
    { id: "5", day: "Monday", startTime: "11:30", endTime: "12:15", subject: "Physics", teacher: "Mrs. Lisa Park", room: "Lab 2", grade: "10", section: "A" },
    { id: "6", day: "Tuesday", startTime: "08:00", endTime: "08:45", subject: "English", teacher: "Mr. John Smith", room: "Room 102", grade: "10", section: "A" },
    { id: "7", day: "Tuesday", startTime: "08:50", endTime: "09:35", subject: "Mathematics", teacher: "Dr. Sarah Miller", room: "Room 101", grade: "10", section: "A" },
    { id: "8", day: "Tuesday", startTime: "09:40", endTime: "10:25", subject: "Physics", teacher: "Mrs. Lisa Park", room: "Lab 2", grade: "10", section: "A" },
    { id: "9", day: "Wednesday", startTime: "08:00", endTime: "08:45", subject: "Science", teacher: "Ms. Emily Chen", room: "Lab 1", grade: "10", section: "A" },
    { id: "10", day: "Wednesday", startTime: "08:50", endTime: "09:35", subject: "History", teacher: "Mr. Robert Lee", room: "Room 103", grade: "10", section: "A" },
    { id: "11", day: "Thursday", startTime: "08:00", endTime: "08:45", subject: "Mathematics", teacher: "Dr. Sarah Miller", room: "Room 101", grade: "10", section: "A" },
    { id: "12", day: "Friday", startTime: "08:00", endTime: "08:45", subject: "English", teacher: "Mr. John Smith", room: "Room 102", grade: "10", section: "A" },
]

// Dashboard statistics
export const dashboardStats = {
    totalStudents: 847,
    totalTeachers: 52,
    totalClasses: 32,
    attendanceRate: 94.5,
    studentChange: "+12",
    teacherChange: "+3",
    classChange: "+2",
    attendanceChange: "+2.3%",
}

// Recent activities
export const recentActivities = [
    { id: "1", action: "New student enrolled", details: "Emma Thompson joined Grade 10-A", time: "2 hours ago", type: "enrollment" },
    { id: "2", action: "Grades submitted", details: "Math midterm results for Grade 10", time: "4 hours ago", type: "grades" },
    { id: "3", action: "Attendance marked", details: "Grade 9-A attendance completed", time: "5 hours ago", type: "attendance" },
    { id: "4", action: "Schedule updated", details: "Physics lab moved to Lab 2", time: "Yesterday", type: "schedule" },
    { id: "5", action: "Parent meeting scheduled", details: "PTA meeting on Jan 30", time: "Yesterday", type: "meeting" },
]
