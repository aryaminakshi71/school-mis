import { Button, ArrowRight, Check } from "@/components/ui";

export function LandingHero() {
  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-24">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now with AI-powered analytics
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            The Complete School Management System
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your school's operations with our all-in-one platform.
            Manage students, staff, finances, and communications from a single
            dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <a href="/features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none h-20 -mt-20"></div>
          <div className="rounded-xl border shadow-2xl overflow-hidden bg-card">
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="p-6 bg-muted/20">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Students", value: "1,248", change: "+12%" },
                  { label: "Attendance Rate", value: "96.5%", change: "+2.3%" },
                  { label: "Fee Collection", value: "$124K", change: "+8%" },
                  { label: "Active Staff", value: "86", change: "+3" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-background rounded-lg p-4 border"
                  >
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                ))}
              </div>
              <div className="h-48 bg-background rounded-lg border flex items-center justify-center text-muted-foreground">
                Interactive Dashboard Preview
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Trusted by 500+ schools worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
            {[
              "School District",
              "Academy",
              "Institute",
              "University",
              "College",
            ].map((name) => (
              <div
                key={name}
                className="text-xl font-bold text-muted-foreground"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
