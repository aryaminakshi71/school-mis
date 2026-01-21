import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-blue-600">
            School MIS
          </a>
          <div className="flex gap-4">
            <a href="/features" className="text-gray-600 hover:text-blue-600">
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
        <section className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            School Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete school administration solution
          </p>
          <a
            href="/signup"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </a>
        </section>
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <a
              href="/features"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all block"
            >
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Student Management</h3>
              <p className="text-gray-600">
                Complete student lifecycle management
              </p>
            </a>
            <a
              href="/features"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all block"
            >
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Attendance</h3>
              <p className="text-gray-600">
                Automated tracking with notifications
              </p>
            </a>
            <a
              href="/features"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all block"
            >
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Fees</h3>
              <p className="text-gray-600">Online payments and invoicing</p>
            </a>
          </div>
          <div className="text-center mt-8">
            <a
              href="/features"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              View All Features →
            </a>
          </div>
        </section>
      </main>
      <footer className="bg-gray-50 border-t py-8 text-center text-gray-600">
        <p>&copy; 2026 School MIS. All rights reserved.</p>
      </footer>
    </div>
  );
}
