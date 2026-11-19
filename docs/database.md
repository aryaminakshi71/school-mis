# Database setup

SchoolAI has its own Neon database. It must not share one with NucleoAI.

## Why

Both apps used to point at the same Neon database (`neondb`). Both define a
`public.sessions` table with different columns:

- NucleoAI: `id, expires_at, token, created_at, updated_at, ip_address,
  user_agent, user_id, active_organization_id` (auth sessions)
- SchoolAI: `id, name, start_date, end_date, is_active, status, created_at,
  updated_at` (academic terms)

Whichever app migrated last owned the table, so the other one silently broke.
The auth tables (`users`, `organizations`, `members`, `invitations`) collided
the same way.

## Current setup

- Database: `school_mis` in the same Neon project as `neondb`
- `DATABASE_URL` in `.env` points at `/school_mis`
- Schema: 62 tables, pushed with `drizzle-kit push`
- Seed data: students, classes, teachers, subjects, fee structures, attendance

## Recreating it

```bash
# 1. Create the database (needs CREATEDB on the role)
psql "$DATABASE_URL" -c "CREATE DATABASE school_mis"

# 2. Point DATABASE_URL at /school_mis, then push the schema
bun run db:push

# 3. Seed
bun run packages/storage/src/seed.ts
```

`drizzle-kit push` prompts for confirmation when it runs without a TTY. Run it
from a terminal, or drive it through a pty.

## Notes

- The old `neondb` database is untouched. NucleoAI still uses it.
- `db:seed` in the root `package.json` points at a script that does not exist
  in `@school/api`; run `packages/storage/src/seed.ts` directly instead.
- The seed script does not create users. Sign up through the app to get an
  account.
