export default function AppStudents() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-6">
          <a href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span>School MIS</span>
          </a>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-muted">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-background border-r min-h-[calc(100vh-4rem)] hidden md:block p-4">
          <nav className="space-y-1">
            {[
              { icon: "📊", label: "Dashboard", href: "/app" },
              {
                icon: "👥",
                label: "Students",
                href: "/app/students",
                active: true,
              },
              { icon: "👨‍🏫", label: "Teachers", href: "/app/teachers" },
              { icon: "📚", label: "Classes", href: "/app/classes" },
              { icon: "📅", label: "Attendance", href: "/app/attendance" },
              { icon: "💰", label: "Fees", href: "/app/fees" },
              { icon: "📝", label: "Exams", href: "/app/exams" },
              { icon: "🚌", label: "Transport", href: "/app/transport" },
              { icon: "📚", label: "Library", href: "/app/library" },
              { icon: "📊", label: "Reports", href: "/app/reports" },
              { icon: "⚙️", label: "Settings", href: "/app/settings" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${item.active ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Students</h1>
              <p className="text-muted-foreground">
                Manage your student records
              </p>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
              + Add Student
            </button>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b flex items-center gap-4">
              <input
                type="text"
                placeholder="Search students..."
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <select className="px-4 py-2 border rounded-lg">
                <option>All Classes</option>
                <option>Class 9-A</option>
                <option>Class 9-B</option>
                <option>Class 10-A</option>
              </select>
            </div>
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Admission No.
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Class
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Parent Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    adm: "ADM001",
                    name: "John Smith",
                    class: "Class 9-A",
                    parent: "Robert Smith",
                    phone: "555-0101",
                    status: "Active",
                  },
                  {
                    adm: "ADM002",
                    name: "Emma Wilson",
                    class: "Class 9-A",
                    parent: "Michael Wilson",
                    phone: "555-0102",
                    status: "Active",
                  },
                  {
                    adm: "ADM003",
                    name: "James Brown",
                    class: "Class 9-B",
                    parent: "David Brown",
                    phone: "555-0103",
                    status: "Active",
                  },
                  {
                    adm: "ADM004",
                    name: "Sophia Davis",
                    class: "Class 10-A",
                    parent: "William Davis",
                    phone: "555-0104",
                    status: "Active",
                  },
                  {
                    adm: "ADM005",
                    name: "Oliver Martinez",
                    class: "Class 10-A",
                    parent: "Carlos Martinez",
                    phone: "555-0105",
                    status: "Inactive",
                  },
                ].map((student, i) => (
                  <tr key={i} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm">{student.adm}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {student.name}
                    </td>
                    <td className="px-4 py-3 text-sm">{student.class}</td>
                    <td className="px-4 py-3 text-sm">{student.parent}</td>
                    <td className="px-4 py-3 text-sm">{student.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${student.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-primary hover:underline text-sm">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
