import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function PricingPage() {
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
            <a href="/pricing" className="text-blue-600 font-medium">
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
            Simple, Transparent Pricing
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Choose the plan that fits your school
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$99/mo",
                features: ["500 students", "Core features", "Email support"],
                popular: false,
              },
              {
                name: "Professional",
                price: "$199/mo",
                features: ["2000 students", "All features", "SMS integration"],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: ["Unlimited", "On-premise", "Dedicated support"],
                popular: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`bg-white p-8 rounded-lg shadow border-2 ${p.popular ? "border-blue-500" : "border-gray-100"}`}
              >
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="text-3xl font-bold my-4">{p.price}</p>
                <ul className="space-y-2 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/signup"
                  className={`block text-center py-3 rounded-lg ${p.popular ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
