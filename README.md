# Jira Clone

A Jira-inspired project management app built with Next.js App Router, TypeScript, Hono, Prisma, and a shadcn-style component system.

The current milestone delivers a working authentication and onboarding flow backed by database sessions.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Hono (API routes)
- Prisma + PostgreSQL
- React Query
- React Hook Form + Zod
- shadcn UI primitives

## Implemented

- Auth pages: sign in, sign up, onboarding, dashboard
- API routes for login, register, onboarding, logout, and current user
- Database-backed sessions (session table + cookie session id)
- Form validation and field-level errors with Zod + React Hook Form
- Query-based dashboard user fetch and logout cache cleanup

## In Progress

- Authentication hardening (password hashing, better cookie policy by environment)
- Consistent API error shaping across all hooks and components
- Route guards (server/client redirects by auth state)
- Domain layer for projects, boards, and issues

## Repository Layout

```text
app/
  (auth)/
    dashBoard/page.tsx
    onboarding/page.tsx
    sign-in/page.tsx
    sign-up/page.tsx
  api/[...route]/route.ts

features/
  api/
    use-dashboard.ts
    use-login.ts
    use-logout.tsx
    use-onboarding.ts
    use-register.ts
  auth/
    components/
    server/route.ts
  schemas.ts

lib/
  prismaHelper.ts
  rcp.ts

prisma/
  schema.prisma
  migrations/
```

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

Create a `.env` file with the variables required by Prisma and your API base URL.

Typical local values:

```bash
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

3. Generate Prisma client and run migrations

```bash
npx prisma generate
npx prisma migrate dev
```

4. Start development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Auth Flow

1. User submits credentials from sign-in or sign-up form.
2. API route validates payload via Zod validator.
3. Server creates/looks up user and creates a session row.
4. Server sets a cookie containing session id.
5. Dashboard uses `/api/auth/me` through React Query.
6. Logout deletes session row and clears cookie.

## Engineering Conventions

- Keep domain UI and data logic under `features/*`.
- Keep reusable primitives under `components/ui/*`.
- Keep form schemas centralized in `features/schemas.ts`.
- Prefer typed API contracts (`InferRequestType`, `InferResponseType`).
- Keep mutations fail-fast on non-2xx responses.

## Known Gaps

- Passwords are not hashed yet.
- Tests are not added yet.
- Core Jira entities are not implemented yet.

## Next Milestones

1. Security pass
- Hash passwords (bcrypt/argon2)
- Normalize cookie policy for local vs production
- Add session rotation and revoke-all support

2. Product foundation
- Add Workspace, Project, Issue schema
- Build CRUD APIs for Project and Issue
- Add first board/list UI

3. Quality pass
- Add integration tests for auth routes
- Add e2e happy-path auth flow
- Add lint/typecheck in CI
