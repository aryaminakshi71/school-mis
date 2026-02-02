# School Management Information System (MIS)

A comprehensive school management system for managing students, staff, academics, and administrative tasks.

## ✨ Features

- Student management
- Staff and teacher management
- Academic records and grades
- Attendance tracking
- Timetable management
- Fee management
- Library management
- Parent portal
- Reports and analytics
- Multi-school support

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ or Bun 1.3+
- PostgreSQL database
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/aryaminakshi71/school-mis.git
cd school-mis

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
bun run db:migrate

# Start development server
bun run dev
```

## 📚 Tech Stack

- **Frontend**: React with TanStack Router
- **Backend**: Hono API with oRPC
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Deployment**: Cloudflare Pages + Workers
- **Package Manager**: Bun
- **Testing**: Playwright, Vitest

## 🏗️ Project Structure

```
school-mis/
├── apps/
│   ├── web/          # Frontend application
│   └── api/          # Backend API
├── packages/         # Shared packages
│   ├── auth/         # Authentication package
│   ├── storage/      # Database package
│   ├── env/          # Environment configuration
│   └── core/         # Core utilities
└── ...
```

## 🔧 Development

```bash
# Run development server
bun run dev

# Run type checking
bun run typecheck

# Run tests
bun run test

# Run unit tests
bun run test:unit

# Run integration tests
bun run test:integration

# Run E2E tests
bun run test:e2e

# Run E2E tests with UI
bun run test:e2e:ui
```

## 📦 Deployment

### Cloudflare Pages (Frontend)

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `bun run build --filter=@school/web`
   - Output directory: `apps/web/dist`
3. Add environment variables in Cloudflare dashboard

### Cloudflare Workers (Backend)

The API can be deployed to Cloudflare Workers if needed. See deployment documentation for details.

## 📝 Environment Variables

See `.env.example` for required environment variables.

## 🧪 Testing

The project includes comprehensive tests:

```bash
# Run all tests
bun run test

# Run unit tests only
bun run test:unit

# Run integration tests
bun run test:integration

# Run E2E tests
bun run test:e2e
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/aryaminakshi71/school-mis)
- [Documentation](https://github.com/aryaminakshi71/school-mis/wiki)

## 👤 Author

Arya Labs

---

Made with ❤️ by Arya Labs
