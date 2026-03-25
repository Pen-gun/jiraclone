# Jira Clone

A Jira-inspired project management app built with Next.js App Router, TypeScript, Hono, Prisma, and a shadcn-style component system.

Current milestone: authentication and onboarding flow with database-backed sessions.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Hono for API routes
- Prisma + PostgreSQL
- TanStack React Query
- React Hook Form + Zod
- shadcn UI primitives

## Current Features

- Sign in, sign up, onboarding, and root dashboard experience
- Auth API endpoints under `/api/auth`
- Session table with cookie-based auth token (`auth_token`)
- Server-side auth gate on the home page
- Client-side current-user fetch via React Query
- Logout endpoint that clears session record and cookie

## Repository Layout

```text
app/
  (auth)/
    layout.tsx
    onboarding/page.tsx
    sign-in/page.tsx
    sign-up/page.tsx
  api/[...route]/route.ts
  layout.tsx
  page.tsx

features/
  action.ts
  schemas.ts
  api/
    use-current.ts
    use-login.ts
    use-logout.tsx
    use-onboarding.ts
    use-register.ts
  auth/
    components/
    constant.ts
    server/route.ts

lib/
  prismaHelper.ts
  rcp.ts
  session-middelware.ts

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

Create `.env` and `.env.local` for local development.

Typical values:

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

Open http://localhost:3000.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Auth Architecture

1. Login and register create a `Session` row and set `auth_token` cookie.
2. Hono `sessionMiddleware` reads the cookie and resolves the current user.
3. `GET /api/auth/me` uses the middleware for client-side user fetch.
4. `features/action.ts` performs server-side user resolution directly through Prisma for page gating.
5. Logout deletes the session record and clears the cookie.

## Known Gaps

- Passwords are still stored and compared in plain text.
- Tests are not implemented yet.
- Core Jira domain entities are not implemented yet.

## Next Milestones

1. Security hardening
- Add password hashing (bcrypt or argon2)
- Move cookie security flags to environment-aware defaults
- Add session rotation and revoke-all support

2. Product foundation
- Add Workspace, Project, and Issue schema
- Build CRUD APIs for project and issue workflows
- Build first board/list UI

3. Quality pass
- Add integration tests for auth endpoints
- Add end-to-end auth happy-path test
- Add CI lint/typecheck gates
