interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

export default {
  async fetch(
    request: Request,
    env: Record<string, string> = {},
    _ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      try {
        const apiResponse = await fetch(
          `http://localhost:3000${url.pathname}${url.search}`,
          {
            method: request.method,
            headers: request.headers,
            body: request.body,
          },
        );
        return apiResponse;
      } catch (error) {
        return new Response(JSON.stringify({ error: "API unavailable" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const accept = request.headers.get("accept") || "";

    if (accept.includes("text/html")) {
      const html = generateHTML(url.pathname);
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};

function generateHTML(pathname: string): string {
  const title = getPageTitle(pathname);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - School MIS</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    header { background: #fff; border-bottom: 1px solid #e5e7eb; position: fixed; top: 0; left: 0; right: 0; z-index: 50; }
    .header-content { display: flex; align-items: center; justify-content: space-between; height: 64px; }
    .logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 1.25rem; }
    .logo-icon { width: 32px; height: 32px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; }
    nav { display: flex; gap: 32px; }
    nav a { color: #6b7280; text-decoration: none; font-weight: 500; transition: color 0.2s; }
    nav a:hover, nav a.active { color: #3b82f6; }
    main { padding-top: 96px; padding-bottom: 64px; min-height: 100vh; }
    .hero { text-align: center; padding: 80px 20px; }
    .hero h1 { font-size: 3rem; font-weight: 800; margin-bottom: 24px; color: #111; }
    .hero p { font-size: 1.25rem; color: #6b7280; max-width: 600px; margin: 0 auto 40px; }
    .btn { display: inline-flex; align-items: center; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; transition: all 0.2s; cursor: pointer; border: none; }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-primary:hover { background: #2563eb; }
    .btn-secondary { background: #f3f4f6; color: #374151; }
    .btn-secondary:hover { background: #e5e7eb; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; padding: 60px 20px; }
    .feature-card { padding: 32px; border-radius: 12px; background: #fff; border: 1px solid #e5e7eb; }
    .feature-icon { width: 48px; height: 48px; background: #eff6ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 24px; }
    .feature h3 { font-size: 1.25rem; margin-bottom: 8px; }
    .feature p { color: #6b7280; }
    .pricing { padding: 60px 20px; text-align: center; }
    .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1000px; margin: 40px auto; }
    .pricing-card { padding: 40px 32px; border-radius: 16px; border: 1px solid #e5e7eb; text-align: left; }
    .pricing-card.popular { border-color: #3b82f6; box-shadow: 0 4px 24px rgba(59, 130, 246, 0.15); }
    .pricing-card h3 { font-size: 1.5rem; margin-bottom: 8px; }
    .price { font-size: 2.5rem; font-weight: 800; margin: 16px 0; }
    .price span { font-size: 1rem; font-weight: 400; color: #6b7280; }
    .features-list { list-style: none; margin: 24px 0; }
    .features-list li { padding: 8px 0; color: #4b5563; }
    .features-list li::before { content: "✓"; color: #10b981; margin-right: 8px; }
    footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 40px 20px; text-align: center; color: #6b7280; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 500; }
    .form-group input { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; }
    .form-group input:focus { outline: none; border-color: #3b82f6; }
    .auth-form { max-width: 400px; margin: 40px auto; padding: 40px; background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; }
    .auth-form h1 { font-size: 1.5rem; margin-bottom: 24px; text-align: center; }
    .auth-form .btn { width: 100%; justify-content: center; margin-top: 8px; }
    .auth-form .footer { text-align: center; margin-top: 24px; color: #6b7280; }
    .auth-form .footer a { color: #3b82f6; text-decoration: none; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 40px; }
    .stat-card { padding: 24px; border-radius: 12px; color: white; }
    .stat-card.blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .stat-card.green { background: linear-gradient(135deg, #10b981, #059669); }
    .stat-card.yellow { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .stat-card p:first-of-type { opacity: 0.8; margin-bottom: 8px; }
    .stat-card p:last-of-type { font-size: 2.5rem; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 16px; text-align: left; font-weight: 600; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
    td { padding: 16px; border-bottom: 1px solid #e5e7eb; }
    .badge { background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem; }
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <a href="/" class="logo">
        <div class="logo-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <span>School MIS</span>
      </a>
      <nav>
        <a href="/" class="${pathname === "/" ? "active" : ""}">Home</a>
        <a href="/features" class="${pathname === "/features" ? "active" : ""}">Features</a>
        <a href="/pricing" class="${pathname === "/pricing" ? "active" : ""}">Pricing</a>
        <a href="/faq" class="${pathname === "/faq" ? "active" : ""}">FAQ</a>
        <a href="/about" class="${pathname === "/about" ? "active" : ""}">About</a>
      </nav>
      <div style="display: flex; gap: 12px;">
        <a href="/login" class="btn btn-secondary">Log In</a>
        <a href="/signup" class="btn btn-primary">Sign Up</a>
      </div>
    </div>
  </header>

  <main>
    ${generatePageContent(pathname)}
  </main>

  <footer>
    <p>&copy; 2026 School MIS. All rights reserved.</p>
    <p style="margin-top: 8px;">
      <a href="/privacy" style="color: #6b7280; margin: 0 12px;">Privacy</a>
      <a href="/terms" style="color: #6b7280; margin: 0 12px;">Terms</a>
    </p>
  </footer>
</body>
</html>`;
}

function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    "/": "Modern School Management",
    "/features": "Features",
    "/pricing": "Pricing",
    "/faq": "FAQ",
    "/about": "About Us",
    "/login": "Log In",
    "/signup": "Sign Up",
    "/app": "Dashboard",
  };
  return titles[pathname] || "School MIS";
}

function generatePageContent(pathname: string): string {
  switch (pathname) {
    case "/":
      return `
        <div class="hero">
          <h1>Modern School Management</h1>
          <p>Streamline your school's operations with our comprehensive management information system.</p>
          <div style="display: flex; gap: 16px; justify-content: center;">
            <a href="/signup" class="btn btn-primary">Get Started Free</a>
            <a href="/features" class="btn btn-secondary">View Features</a>
          </div>
        </div>
        <div class="container">
          <div class="features">
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Student Management</h3>
              <p>Complete student lifecycle management from admission to graduation.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📅</div>
              <h3>Attendance Tracking</h3>
              <p>Automated attendance with real-time notifications to parents.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💰</div>
              <h3>Fee Management</h3>
              <p>Online payments, invoicing, and financial reporting.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📝</div>
              <h3>Exam & Results</h3>
              <p>Complete exam management with automated grade calculation.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🚌</div>
              <h3>Transport Tracking</h3>
              <p>GPS-based transport tracking with parent notifications.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>Parent Portal</h3>
              <p>Real-time updates on attendance, fees, and academic progress.</p>
            </div>
          </div>
        </div>
      `;
    case "/features":
      return `
        <div class="container" style="text-align: center; padding: 60px 20px;">
          <h1 style="font-size: 2.5rem; margin-bottom: 16px;">Powerful Features</h1>
          <p style="color: #6b7280; font-size: 1.25rem; max-width: 600px; margin: 0 auto 48px;">Everything you need to manage your school efficiently</p>
          <div class="features" style="text-align: left;">
            <div class="feature-card">
              <div class="feature-icon">👥</div>
              <h3>Student Information</h3>
              <p>Complete student profiles, admission management, and document storage.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">👨‍🏫</div>
              <h3>Staff Management</h3>
              <p>Teacher profiles, attendance, payroll, and performance tracking.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🏫</div>
              <h3>Class Management</h3>
              <p>Section management, timetable scheduling, and room allocation.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📚</div>
              <h3>Library System</h3>
              <p>Book catalog, issue/return tracking, and overdue notifications.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📲</div>
              <h3>SMS & Notifications</h3>
              <p>Bulk SMS, alerts, and announcements to parents and staff.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📈</div>
              <h3>Reports & Analytics</h3>
              <p>Comprehensive reports on attendance, fees, and academics.</p>
            </div>
          </div>
        </div>
      `;
    case "/pricing":
      return `
        <div class="pricing">
          <h1>Simple, Transparent Pricing</h1>
          <p style="color: #6b7280; margin-top: 8px;">Choose the plan that fits your school</p>
          <div class="pricing-grid">
            <div class="pricing-card">
              <h3>Starter</h3>
              <div class="price">$99<span>/month</span></div>
              <p style="color: #6b7280;">Perfect for small schools up to 500 students</p>
              <ul class="features-list">
                <li>Up to 500 students</li>
                <li>All core features</li>
                <li>Email support</li>
                <li>5 admin accounts</li>
              </ul>
              <a href="/signup" class="btn btn-secondary" style="width: 100%; justify-content: center;">Get Started</a>
            </div>
            <div class="pricing-card popular">
              <h3>Professional</h3>
              <div class="price">$199<span>/month</span></div>
              <p style="color: #6b7280;">For growing schools up to 2000 students</p>
              <ul class="features-list">
                <li>Up to 2000 students</li>
                <li>All core features</li>
                <li>Priority support</li>
                <li>15 admin accounts</li>
                <li>SMS integration</li>
              </ul>
              <a href="/signup" class="btn btn-primary" style="width: 100%; justify-content: center;">Get Started</a>
            </div>
            <div class="pricing-card">
              <h3>Enterprise</h3>
              <div class="price">Custom</div>
              <p style="color: #6b7280;">For large institutions</p>
              <ul class="features-list">
                <li>Unlimited students</li>
                <li>All features</li>
                <li>Dedicated support</li>
                <li>Unlimited accounts</li>
                <li>Custom integrations</li>
              </ul>
              <a href="/contact" class="btn btn-secondary" style="width: 100%; justify-content: center;">Contact Sales</a>
            </div>
          </div>
        </div>
      `;
    case "/faq":
      return `
        <div class="container" style="max-width: 800px; padding: 60px 20px;">
          <h1 style="text-align: center; margin-bottom: 48px;">Frequently Asked Questions</h1>
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <div style="padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h3 style="margin-bottom: 12px;">How long does it take to set up?</h3>
              <p style="color: #6b7280;">Most schools are up and running within a week.</p>
            </div>
            <div style="padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h3 style="margin-bottom: 12px;">Can I import existing student data?</h3>
              <p style="color: #6b7280;">Yes! We support CSV imports and our team can help migrate your data.</p>
            </div>
            <div style="padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h3 style="margin-bottom: 12px;">Is my data secure?</h3>
              <p style="color: #6b7280;">Absolutely. We use bank-level encryption and regular backups.</p>
            </div>
          </div>
        </div>
      `;
    case "/about":
      return `
        <div class="container" style="max-width: 800px; padding: 60px 20px;">
          <h1 style="margin-bottom: 32px;">About School MIS</h1>
          <p style="font-size: 1.125rem; color: #4b5563; margin-bottom: 24px;">
            School MIS is a comprehensive school management solution designed to help educational institutions streamline their operations.
          </p>
          <h2 style="margin: 48px 0 24px;">Our Mission</h2>
          <p style="font-size: 1.125rem; color: #4b5563;">
            To empower schools with technology that makes administration effortless.
          </p>
        </div>
      `;
    case "/login":
      return `
        <div class="auth-form">
          <h1>Welcome Back</h1>
          <form>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="you@school.edu">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" placeholder="••••••••">
            </div>
            <a href="/app" class="btn btn-primary">Log In</a>
          </form>
          <div class="footer">
            <a href="/forgot-password">Forgot password?</a>
            <p style="margin-top: 16px;">Don't have an account? <a href="/signup">Sign up</a></p>
          </div>
        </div>
      `;
    case "/signup":
      return `
        <div class="auth-form">
          <h1>Create Account</h1>
          <form>
            <div class="form-group">
              <label for="schoolName">School Name</label>
              <input type="text" id="schoolName" placeholder="Springfield High School">
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="admin@school.edu">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" placeholder="••••••••">
            </div>
            <a href="/app" class="btn btn-primary">Create Account</a>
          </form>
          <div class="footer">
            <p>Already have an account? <a href="/login">Log in</a></p>
          </div>
        </div>
      `;
    case "/app":
      return `
        <div class="container" style="padding: 40px 20px;">
          <h1 style="margin-bottom: 32px;">Dashboard</h1>
          <div class="stats-grid">
            <div class="stat-card blue">
              <p>Total Students</p>
              <p>1,234</p>
              <p style="opacity: 0.8; font-size: 0.875rem;">+12% from last month</p>
            </div>
            <div class="stat-card green">
              <p>Attendance Today</p>
              <p>94.5%</p>
              <p style="opacity: 0.8; font-size: 0.875rem;">1,166 present</p>
            </div>
            <div class="stat-card yellow">
              <p>Fee Collection</p>
              <p>$45,230</p>
              <p style="opacity: 0.8; font-size: 0.875rem;">85% collected</p>
            </div>
          </div>
          <h2 style="margin-bottom: 24px;">Quick Actions</h2>
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <a href="/app/students" class="btn btn-primary">Manage Students</a>
            <button class="btn btn-secondary">Record Attendance</button>
            <button class="btn btn-secondary">Send Notification</button>
          </div>
        </div>
      `;
    case "/app/students":
      return `
        <div class="container" style="padding: 40px 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
            <h1>Students</h1>
            <button class="btn btn-primary">+ Add Student</button>
          </div>
          <div style="background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Roll No</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>Class 10-A</td>
                  <td>101</td>
                  <td><span class="badge">Active</span></td>
                  <td><button style="color: #3b82f6; background: none; border: none; cursor: pointer;">View</button></td>
                </tr>
                <tr>
                  <td>Jane Smith</td>
                  <td>Class 10-A</td>
                  <td>102</td>
                  <td><span class="badge">Active</span></td>
                  <td><button style="color: #3b82f6; background: none; border: none; cursor: pointer;">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    default:
      return `
        <div class="container" style="text-align: center; padding: 80px 20px;">
          <h1 style="font-size: 3rem; margin-bottom: 16px;">404</h1>
          <p style="color: #6b7280; font-size: 1.25rem; margin-bottom: 32px;">Page not found</p>
          <a href="/" class="btn btn-primary">Go Home</a>
        </div>
      `;
  }
}
