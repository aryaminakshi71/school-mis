/**
 * Comprehensive School Management System - Feature List
 *
 * This document defines all modules and sub-features for a complete school MIS.
 */

// Core Modules with Sub-features

export const SCHOOL_MIS_MODULES = {
  // 1. STUDENT MANAGEMENT
  studentManagement: {
    name: "Student Management",
    icon: "users",
    subFeatures: [
      {
        name: "Admission/Enrollment",
        path: "/app/students/admission",
        description: "Online application, document upload, enrollment process",
      },
      {
        name: "Student Profile",
        path: "/app/students/profile",
        description: "Personal info, family details, medical records",
      },
      {
        name: "Attendance",
        path: "/app/students/attendance",
        description: "Daily attendance, leave requests, absence alerts",
      },
      {
        name: "Performance",
        path: "/app/students/performance",
        description: "Grades, progress reports, report cards",
      },
      {
        name: "Discipline",
        path: "/app/students/discipline",
        description: "Behavior records, violations, awards",
      },
      {
        name: "Transfer/Withdrawal",
        path: "/app/students/transfer",
        description: "Transfer certificates, exit process",
      },
      {
        name: "Alumni",
        path: "/app/students/alumni",
        description: "Alumni database, tracking, reunions",
      },
    ],
  },

  // 2. STAFF MANAGEMENT
  staffManagement: {
    name: "Staff Management",
    icon: "graduation-cap",
    subFeatures: [
      {
        name: "Recruitment",
        path: "/app/staff/recruitment",
        description: "Job postings, applications, interviews, hiring",
      },
      {
        name: "Staff Profile",
        path: "/app/staff/profile",
        description: "Personal info, qualifications, experience",
      },
      {
        name: "Attendance",
        path: "/app/staff/attendance",
        description: "Biometric integration, leave tracking",
      },
      {
        name: "Payroll/Salary",
        path: "/app/staff/payroll",
        description: "Salary structure, payslips, deductions, TDS",
      },
      {
        name: "Leave Management",
        path: "/app/staff/leave",
        description: "Leave requests, approvals, balances",
      },
      {
        name: "Performance",
        path: "/app/staff/performance",
        description: "Appraisals, KPIs, promotions",
      },
      {
        name: "Training",
        path: "/app/staff/training",
        description: "Professional development, workshops",
      },
    ],
  },

  // 3. ACADEMIC MANAGEMENT
  academicManagement: {
    name: "Academic Management",
    icon: "book-open",
    subFeatures: [
      {
        name: "Classes/Grades",
        path: "/app/academics/classes",
        description: "Grade levels, sections, class details",
      },
      {
        name: "Subjects",
        path: "/app/academics/subjects",
        description: "Subject allocation, syllabi",
      },
      {
        name: "Timetable",
        path: "/app/academics/timetable",
        description: "Schedule creation, period management",
      },
      {
        name: "Exams",
        path: "/app/academics/exams",
        description: "Exam scheduling, hall allocation",
      },
      {
        name: "Marks/Grades",
        path: "/app/academics/marks",
        description: "Mark entry, grade calculation, results",
      },
      {
        name: "Assignments",
        path: "/app/academics/assignments",
        description: "Homework, projects, submissions",
      },
      {
        name: "Certificates",
        path: "/app/academics/certificates",
        description: "TC, bonafide, character certificates",
      },
    ],
  },

  // 4. FEE & FINANCE
  feeFinance: {
    name: "Fee & Finance",
    icon: "dollar-sign",
    subFeatures: [
      {
        name: "Fee Structure",
        path: "/app/fees/structure",
        description: "Fee heads, categories, discounts",
      },
      {
        name: "Fee Collection",
        path: "/app/fees/collection",
        description: "Online/offline collection, receipts",
      },
      {
        name: "Online Payment",
        path: "/app/fees/payment",
        description: "Payment gateway integration",
      },
      {
        name: "Expense Management",
        path: "/app/fees/expenses",
        description: "School expenses, approvals",
      },
      {
        name: "Salary Payment",
        path: "/app/fees/salary",
        description: "Staff salary disbursement",
      },
      {
        name: "Budget",
        path: "/app/fees/budget",
        description: "Annual budget planning",
      },
      {
        name: "Reports",
        path: "/app/fees/reports",
        description: "Financial statements, audits",
      },
    ],
  },

  // 5. LIBRARY
  library: {
    name: "Library",
    icon: "library",
    subFeatures: [
      {
        name: "Book Catalog",
        path: "/app/library/books",
        description: "ISBN lookup, categories, accession",
      },
      {
        name: "Issue/Return",
        path: "/app/library/issue",
        description: "Book issue, return tracking",
      },
      {
        name: "Due Dates",
        path: "/app/library/due",
        description: "Overdue alerts, renewals",
      },
      {
        name: "Fines",
        path: "/app/library/fines",
        description: "Late fees, damage charges",
      },
      {
        name: "Library Cards",
        path: "/app/library/cards",
        description: "Student/staff cards",
      },
    ],
  },

  // 6. TRANSPORT
  transport: {
    name: "Transport",
    icon: "bus",
    subFeatures: [
      {
        name: "Routes",
        path: "/app/transport/routes",
        description: "Route planning, stops",
      },
      {
        name: "Vehicles",
        path: "/app/transport/vehicles",
        description: "Fleet management, maintenance",
      },
      {
        name: "Drivers",
        path: "/app/transport/drivers",
        description: "Driver details, licenses",
      },
      {
        name: "Allocation",
        path: "/app/transport/allocation",
        description: "Student-vehicle assignment",
      },
      {
        name: "Tracking",
        path: "/app/transport/tracking",
        description: "GPS tracking, live location",
      },
      {
        name: "Attendance",
        path: "/app/transport/attendance",
        description: "Pick/drop attendance",
      },
    ],
  },

  // 7. PARENT PORTAL
  parentPortal: {
    name: "Parent Portal",
    icon: "users",
    subFeatures: [
      {
        name: "Dashboard",
        path: "/app/parent-portal/dashboard",
        description: "Overview of child's progress",
      },
      {
        name: "Attendance",
        path: "/app/parent-portal/attendance",
        description: "View attendance records",
      },
      {
        name: "Fees",
        path: "/app/parent-portal/fees",
        description: "Fee status, payment history",
      },
      {
        name: "Results",
        path: "/app/parent-portal/results",
        description: "Exam results, grades",
      },
      {
        name: "Homework",
        path: "/app/parent-portal/homework",
        description: "View assignments",
      },
      {
        name: "Events",
        path: "/app/parent-portal/events",
        description: "School events calendar",
      },
      {
        name: "Communication",
        path: "/app/parent-portal/messages",
        description: "Chat with teachers",
      },
    ],
  },

  // 8. NOTIFICATIONS (SMS/WhatsApp)
  notifications: {
    name: "Notifications",
    icon: "message-square",
    subFeatures: [
      {
        name: "SMS",
        path: "/app/notifications/sms",
        description: "Send SMS to parents/staff",
      },
      {
        name: "WhatsApp",
        path: "/app/notifications/whatsapp",
        description: "WhatsApp message templates",
      },
      {
        name: "Email",
        path: "/app/notifications/email",
        description: "Email campaigns",
      },
      {
        name: "Templates",
        path: "/app/notifications/templates",
        description: "Pre-defined message templates",
      },
      {
        name: "Schedule",
        path: "/app/notifications/schedule",
        description: "Automated notifications",
      },
      {
        name: "Logs",
        path: "/app/notifications/logs",
        description: "Delivery reports",
      },
    ],
  },

  // 9. INVENTORY & PURCHASE
  inventory: {
    name: "Inventory & Purchase",
    icon: "package",
    subFeatures: [
      {
        name: "Items",
        path: "/app/inventory/items",
        description: "Inventory catalog",
      },
      {
        name: "Purchase",
        path: "/app/inventory/purchase",
        description: "Purchase orders, vendors",
      },
      {
        name: "Stock",
        path: "/app/inventory/stock",
        description: "Stock levels, alerts",
      },
      {
        name: "Issuance",
        path: "/app/inventory/issuance",
        description: "Item distribution",
      },
      {
        name: "Reports",
        path: "/app/inventory/reports",
        description: "Inventory reports",
      },
    ],
  },

  // 10. EXAMS & RESULTS
  exams: {
    name: "Exams & Results",
    icon: "file-text",
    subFeatures: [
      {
        name: "Exam Types",
        path: "/app/exams/types",
        description: "FA, SA, UT, Board exams",
      },
      {
        name: "Schedule",
        path: "/app/exams/schedule",
        description: "Exam timetable",
      },
      {
        name: "Hall Allocation",
        path: "/app/exams/halls",
        description: "Exam room assignment",
      },
      {
        name: "Mark Entry",
        path: "/app/exams/marks",
        description: "Grade entry system",
      },
      {
        name: "Results",
        path: "/app/exams/results",
        description: "Result generation, publishing",
      },
      {
        name: "Report Cards",
        path: "/app/exams/reports",
        description: "Printable report cards",
      },
    ],
  },

  // 11. SETTINGS & CONFIGURATION
  settings: {
    name: "Settings",
    icon: "settings",
    subFeatures: [
      {
        name: "School Info",
        path: "/app/settings/school",
        description: "School profile, logo",
      },
      {
        name: "Academic Year",
        path: "/app/settings/academic-year",
        description: "Session management",
      },
      {
        name: "Roles & Permissions",
        path: "/app/settings/roles",
        description: "RBAC configuration",
      },
      {
        name: "SMS Settings",
        path: "/app/settings/sms",
        description: "SMS gateway config",
      },
      {
        name: "Payment Settings",
        path: "/app/settings/payment",
        description: "Payment gateway",
      },
      {
        name: "Backup",
        path: "/app/settings/backup",
        description: "Data backup/restore",
      },
    ],
  },

  // 12. REPORTS & ANALYTICS
  reports: {
    name: "Reports & Analytics",
    icon: "bar-chart",
    subFeatures: [
      {
        name: "Student Reports",
        path: "/app/reports/students",
        description: "Enrollment, attendance reports",
      },
      {
        name: "Staff Reports",
        path: "/app/reports/staff",
        description: "Payroll, attendance reports",
      },
      {
        name: "Financial Reports",
        path: "/app/reports/financial",
        description: "Fee collection, expenses",
      },
      {
        name: "Academic Reports",
        path: "/app/reports/academic",
        description: "Result analysis, rankings",
      },
      {
        name: "Custom Reports",
        path: "/app/reports/custom",
        description: "Custom report builder",
      },
      {
        name: "Dashboards",
        path: "/app/reports/dashboards",
        description: "Visual analytics",
      },
    ],
  },

  // 13. HOSTEL/DORMITORY (Optional)
  hostel: {
    name: "Hostel",
    icon: "home",
    subFeatures: [
      {
        name: "Rooms",
        path: "/app/hostel/rooms",
        description: "Room allocation, bed management",
      },
      {
        name: "Students",
        path: "/app/hostel/students",
        description: "Hostel students list",
      },
      {
        name: "Attendance",
        path: "/app/hostel/attendance",
        description: "Night attendance",
      },
      {
        name: "Mess/Food",
        path: "/app/hostel/mess",
        description: "Mess menu, food tracking",
      },
      {
        name: "Complaints",
        path: "/app/hostel/complaints",
        description: "Student complaints",
      },
    ],
  },

  // 14. FRONT OFFICE / RECEPTION
  frontOffice: {
    name: "Front Office",
    icon: "phone",
    subFeatures: [
      {
        name: "Visitors",
        path: "/app/front-office/visitors",
        description: "Visitor logs",
      },
      {
        name: "Phone Logs",
        path: "/app/front-office/phone",
        description: "Call records",
      },
      {
        name: "Enquiry",
        path: "/app/front-office/enquiry",
        description: "Admission enquiries",
      },
      {
        name: "Postal",
        path: "/app/front-office/postal",
        description: "Dispatch/Receive mail",
      },
    ],
  },

  // 15. ALUMNI
  alumni: {
    name: "Alumni",
    icon: "users",
    subFeatures: [
      {
        name: "Database",
        path: "/app/alumni/database",
        description: "Alumni records",
      },
      {
        name: "Events",
        path: "/app/alumni/events",
        description: "Reunion events",
      },
      {
        name: "Donations",
        path: "/app/alumni/donations",
        description: "Contribution tracking",
      },
      {
        name: "Jobs",
        path: "/app/alumni/jobs",
        description: "Placement assistance",
      },
    ],
  },
};

// Export for use in the application
export default SCHOOL_MIS_MODULES;
