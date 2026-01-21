import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
});

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
          <h1 className="text-3xl font-bold text-center mb-12">
            Powerful Features
          </h1>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "👥",
                title: "Student Management",
                desc: "Complete student profiles, admission, documents",
              },
              {
                icon: "👨‍🏫",
                title: "Staff Management",
                desc: "Teachers, attendance, payroll, performance",
              },
              {
                icon: "🏫",
                title: "Class Management",
                desc: "Sections, timetable, room allocation",
              },
              {
                icon: "📚",
                title: "Library System",
                desc: "Books, issue/return, notifications",
              },
              {
                icon: "📲",
                title: "SMS & Notifications",
                desc: "Bulk SMS, alerts, announcements",
              },
              {
                icon: "📈",
                title: "Reports & Analytics",
                desc: "Attendance, fees, academic reports",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
