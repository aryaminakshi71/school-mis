# School MIS Setup Guide

A comprehensive school management information system built with modern technologies.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Neon PostgreSQL Setup](#neon-postgresql-setup)
3. [Installation](#installation)
4. [Database Migration](#database-migration)
5. [Demo Data Seeding](#demo-data-seeding)
6. [Notification Services Setup](#notification-services-setup)
7. [Running the Application](#running-the-application)
8. [API Testing](#api-testing)
9. [Default Credentials](#default-credentials)

---

## Prerequisites

- **Bun** - JavaScript runtime and package manager
  - Install: https://bun.sh
- **Neon PostgreSQL** - Cloud PostgreSQL database (free tier available)
- **Node.js** - v18 or higher (for some tools)

Verify installation:

```bash
bun --version
```

---

## Neon PostgreSQL Setup

### Step 1: Create Neon Account

1. Go to https://console.neon.tech
2. Sign up for a free account (GitHub, Google, or email)
3. Verify your email address

### Step 2: Create a New Project

1. Click "Create Project"
2. Enter project name: `school-mis`
3. Select the region closest to your users
4. Click "Create Project"

### Step 3: Get Connection String

1. Wait for the project to be ready (usually a few seconds)
2. Click "Connection Details" tab
3. Copy the connection string (it looks like this):

```
postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/school_mis?sslmode=require
```

### Step 4: Configure Environment Variable

1. Open `.env` file in the project root
2. Replace the placeholder:

```env
# Before
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST].neon.tech/school_mis?sslmode=require"

# After (paste your actual connection string)
DATABASE_URL="postgresql://john:AbCdEf123@ep-something-12345.us-east-1.aws.neon.tech/school_mis?sslmode=require"
```

---

## Installation

### Step 1: Install Dependencies

```bash
# Install web dependencies
cd apps/web
bun install

# Install storage dependencies
cd ../packages/storage
bun install

# Return to root
cd ../..
```

### Step 2: Generate Database Types (Optional)

```bash
cd packages/storage
bun run db:generate
cd ../..
```

---

## Database Migration

### Run Migrations

```bash
cd packages/storage
bun run db:migrate
```

This will create all the necessary tables:

- `users` - User accounts
- `user_passwords` - Password hashes
- `user_sessions` - JWT sessions
- `sessions` - Academic sessions
- `classes` - Class sections
- `students` - Student records
- `teachers` - Teacher records
- `staff` - Staff records
- `subjects` - Subjects
- `fee_categories` - Fee categories
- `fee_structures` - Fee structures
- `fee_payments` - Payment records
- `attendance` - Attendance records
- And many more...

### Push Schema (Development Only)

For rapid development, you can push schema changes directly:

```bash
cd packages/storage
bun run db:push
cd ../..
```

---

## Demo Data Seeding

### Seed Demo Data

```bash
cd packages/storage
bun run db:seed
cd ../..
```

This creates:

- 1 Academic Session (2025-2026)
- 10 Classes (Class 1 to Class 10)
- 3 Fee Categories (Tuition, Transport, Exam)
- Fee Structures for all classes
- 5 Demo Users

---

## Notification Services Setup

### Email (SMTP)

#### Option 1: SendGrid (Recommended)

1. Create account at https://app.sendgrid.com
2. Go to Settings > API Keys
3. Create a new API Key with "Mail Send" permissions
4. Copy the API key

Update `.env`:

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="SG.your-api-key-here"
FROM_EMAIL="noreply@yourschool.com"
FROM_NAME="School MIS"
```

#### Option 2: Gmail

1. Enable 2-Factor Authentication on your Google Account
2. Go to https://myaccount.google.com/homepasswords
3. Create an "App Password" for "Mail"
4. Use the 16-digit password

Update `.env`:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-digit-app-password"
FROM_EMAIL="your-email@gmail.com"
```

### SMS (Twilio)

1. Create account at https://www.twilio.com
2. Get a phone number from Twilio
3. Copy Account SID and Auth Token from the Console

Update `.env`:

```env
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### WhatsApp (Twilio)

1. Go to Twilio Console > Messaging > Try WhatsApp
2. Send a message to opt-in to the sandbox
3. Or request a WhatsApp Business number

Update `.env`:

```env
TWILIO_WHATSAPP_NUMBER="whatsapp:+1234567890"
TWILIO_WHATSAPP_SANDBOX_NUMBER="+14155238886"
```

---

## Running the Application

### Start Development Server

```bash
cd apps/web
bun run dev
```

The application will be available at:

- **Web App**: http://localhost:3008
- **API**: http://localhost:3008/api

---

## API Testing

### Authentication Endpoints

All API requests go to `http://localhost:3008/api/auth`

#### 1. Login

```bash
curl -X POST http://localhost:3008/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "login", "email": "admin@school.com", "password": "admin123"}'
```

**Response:**

```json
{
  "user": {
    "id": "admin-001",
    "name": "Admin User",
    "email": "admin@school.com",
    "role": "admin",
    "avatar": "https://..."
  },
  "accessToken": "mock-access-token-...",
  "refreshToken": "mock-refresh-token-..."
}
```

#### 2. Get Current User

```bash
curl -X POST http://localhost:3008/api/auth \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"action": "me"}'
```

#### 3. Refresh Token

```bash
curl -X POST http://localhost:3008/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "refresh", "refreshToken": "YOUR_REFRESH_TOKEN"}'
```

#### 4. Logout

```bash
curl -X POST http://localhost:3008/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "logout", "refreshToken": "YOUR_REFRESH_TOKEN"}'
```

#### 5. Register

```bash
curl -X POST http://localhost:3008/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "name": "New User",
    "email": "newuser@school.com",
    "password": "password123",
    "role": "teacher"
  }'
```

---

## Default Credentials

| Role       | Email                 | Password      |
| ---------- | --------------------- | ------------- |
| Admin      | admin@school.edu      | admin123      |
| Teacher    | teacher@school.com    | teacher123    |
| Student    | student@school.com    | student123    |
| Parent     | parent@school.com     | parent123     |
| Accountant | accountant@school.com | accountant123 |

---

## Troubleshooting

### Database Connection Issues

1. Check if Neon project is active
2. Verify connection string format
3. Ensure IP is allowlisted (Neon allows all by default)
4. Check SSL requirement (`?sslmode=require`)

### Migration Failures

1. Delete `migrations` folder and run `bun run db:generate`
2. Check for syntax errors in schema files
3. Ensure DATABASE_URL is correct

### Authentication Issues

1. Clear browser cookies
2. Try incognito window
3. Check console for JWT errors
4. Verify credentials match exactly

### Notification Failures

1. Check credentials are correct
2. Verify account has sufficient credits
3. Check Twilio console for error logs
4. Ensure phone numbers include country code

---

## Project Structure

```
school-mis/
├── apps/
│   └── web/                 # React frontend
│       └── src/
│           ├── lib/
│           │   ├── services/    # Auth, SMS, Email, etc.
│           │   ├── db-service.ts
│           │   └── auth-context.tsx
│           └── routes/
│               ├── api/auth/    # Auth endpoints
│               └── app/         # Page routes
├── packages/
│   └── storage/             # Database layer
│       └── src/
│           └── db/
│               └── schema/
│                   └── school/  # Table schemas
├── scripts/                 # Setup scripts
├── .env                     # Environment variables
└── README.md
```

---

## Support

For issues and questions:

- Create an issue at https://github.com/your-repo/issues
- Check existing issues first
- Include error logs and environment details
