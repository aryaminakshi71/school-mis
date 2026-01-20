import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui";

export function MarketingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container">
        <nav className="flex items-center justify-between h-16">
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

          <div className="hidden md:flex items-center gap-8">
            <a
              href="/features"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Features
            </a>
            <a
              href="/pricing"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Pricing
            </a>
            <a
              href="/about"
              className="text-muted-foreground hover:text-foreground transition"
            >
              About
            </a>
            <a
              href="/faq"
              className="text-muted-foreground hover:text-foreground transition"
            >
              FAQ
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="/login">
              <Button variant="ghost">Sign In</Button>
            </a>
            <a href="/signup">
              <Button>Get Started</Button>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
