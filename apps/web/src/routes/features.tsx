import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
});

const features = [
  {
    icon: "👥",
    title: "Student Management",
    shortDesc: "Complete student profiles, admission, documents",
    details: [
      {
        title: "Student Profiles",
        desc: "Comprehensive profiles with personal details, medical info, emergency contacts, and documents.",
      },
      {
        title: "Admission Management",
        desc: "Online application forms, document upload, entrance exam results, and enrollment workflow.",
      },
      {
        title: "Document Management",
        desc: "Store and manage student documents including IDs, certificates, transcripts, and more.",
      },
      {
        title: "Transfer Management",
        desc: "Handle student transfers between classes, sections, or branches with full history tracking.",
      },
    ],
  },
  {
    icon: "📅",
    title: "Attendance Management",
    shortDesc: "Automated tracking with notifications",
    details: [
      {
        title: "Daily Attendance",
        desc: "Mark attendance quickly with bulk entry, late tracking, and absence alerts.",
      },
      {
        title: "Auto-Tracking",
        desc: "Biometric integration and RFID for seamless attendance logging.",
      },
      {
        title: "Notifications",
        desc: "Instant SMS/email alerts to parents for absent students.",
      },
      {
        title: "Reports",
        desc: "Generate attendance reports by class, student, or date range.",
      },
    ],
  },
  {
    icon: "💰",
    title: "Fees Management",
    shortDesc: "Online payments and invoicing",
    details: [
      {
        title: "Online Payments",
        desc: "Accept payments via credit card, bank transfer, and digital wallets.",
      },
      {
        title: "Invoice Generation",
        desc: "Automatically generate and send invoices to parents.",
      },
      {
        title: "Fee Structure",
        desc: "Configure different fee heads, discounts, and payment plans.",
      },
      {
        title: "Payment Reports",
        desc: "Track collections, pending fees, and financial summaries.",
      },
    ],
  },
  {
    icon: "👨‍🏫",
    title: "Staff Management",
    shortDesc: "Teachers, attendance, payroll, performance",
    details: [
      {
        title: "Staff Directory",
        desc: "Complete profiles with qualifications, experience, and contact details.",
      },
      {
        title: "Leave Management",
        desc: "Track leaves, approvals, and leave balances for all staff.",
      },
      {
        title: "Payroll",
        desc: "Automated salary calculation, payslip generation, and tax deductions.",
      },
      {
        title: "Performance",
        desc: "Track teacher performance with reviews and ratings.",
      },
    ],
  },
  {
    icon: "🏫",
    title: "Class Management",
    shortDesc: "Sections, timetable, room allocation",
    details: [
      {
        title: "Class & Sections",
        desc: "Create classes, sections, and assign class teachers.",
      },
      {
        title: "Timetable",
        desc: "Generate conflict-free timetables with subject and teacher allocation.",
      },
      {
        title: "Room Allocation",
        desc: "Manage classrooms and prevent booking conflicts.",
      },
      {
        title: "Subject Management",
        desc: "Define subjects, credit hours, and syllabi.",
      },
    ],
  },
  {
    icon: "📚",
    title: "Library System",
    shortDesc: "Books, issue/return, notifications",
    details: [
      {
        title: "Book Catalog",
        desc: "Maintain a complete inventory of library books and resources.",
      },
      {
        title: "Issue & Return",
        desc: "Track book loans with due dates and overdue alerts.",
      },
      {
        title: "Member Management",
        desc: "Manage student and staff library memberships.",
      },
      {
        title: "Reports",
        desc: "Generate reports on popular books, overdue items, and fines.",
      },
    ],
  },
  {
    icon: "📲",
    title: "SMS & Notifications",
    shortDesc: "Bulk SMS, alerts, announcements",
    details: [
      {
        title: "Bulk SMS",
        desc: "Send messages to all parents or selected groups instantly.",
      },
      {
        title: "Event Alerts",
        desc: "Notify about events, holidays, and school activities.",
      },
      {
        title: "Attendance Alerts",
        desc: "Automatic notifications for student absences.",
      },
      {
        title: "Fee Reminders",
        desc: "Send payment due date reminders automatically.",
      },
    ],
  },
  {
    icon: "📈",
    title: "Reports & Analytics",
    shortDesc: "Attendance, fees, academic reports",
    details: [
      {
        title: "Academic Reports",
        desc: "Generate report cards, transcripts, and progress cards.",
      },
      {
        title: "Attendance Reports",
        desc: "Daily, monthly, and yearly attendance summaries.",
      },
      {
        title: "Fee Reports",
        desc: "Collection reports, pending fee lists, and financial statements.",
      },
      {
        title: "Analytics Dashboard",
        desc: "Visual insights into school performance and trends.",
      },
    ],
  },
  {
    icon: "📝",
    title: "Exams & Results",
    shortDesc: "Question banks, schedule, gradebooks",
    details: [
      {
        title: "Exam Schedule",
        desc: "Create and publish exam timetables with room assignments.",
      },
      {
        title: "Question Banks",
        desc: "Maintain a repository of questions for assessments.",
      },
      {
        title: "Gradebook",
        desc: "Record marks and calculate grades automatically.",
      },
      {
        title: "Results",
        desc: "Publish results, generate report cards, and handle re-evaluation.",
      },
    ],
  },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-blue-600">
            School MIS
          </a>
          <div className="flex gap-4">
            <a href="/features" className="text-blue-600 font-medium">
              Features
            </a>
            <a href="/pricing" className="text-gray-600 hover:text-blue-600">
              Pricing
            </a>
            <a href="/login" className="text-gray-600 hover:text-blue-600">
              Login
            </a>
          </div>
        </nav>
      </header>
      <main className="pt-16">
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-center mb-4">
            Powerful Features
          </h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            School MIS provides all the tools you need to efficiently manage
            your educational institution.
          </p>
          <div className="grid gap-12">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="text-5xl">{feature.icon}</div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">
                        {feature.title}
                      </h2>
                      <p className="text-gray-600 mb-6">{feature.shortDesc}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {feature.details.map((detail) => (
                          <div
                            key={detail.title}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <h3 className="font-semibold mb-1">
                              {detail.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {detail.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
