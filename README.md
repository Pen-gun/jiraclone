# Jira Clone

A Jira-inspired project management app built with Next.js App Router, TypeScript, Hono, Prisma, and a shadcn-style component system.

Current milestone: authentication, onboarding, and first workspace creation flow with database-backed sessions.

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
- Workspace create/list endpoints under `/api/workspaces` (stored in `Workspace` + `WorkspaceMember` models)
- Workspace invite flow (`join` + `reset-invite-code`) under `/api/workspaces`
- Session table with cookie-based auth token (`auth_token`)
- Server-side auth gate on the home page
- Client-side current-user fetch via React Query
- Logout endpoint that clears session record and cookie
- OpenAPI spec and Swagger UI available at `/api/openapi.json` and `/api/docs`
- Prisma domain models for `Workspace`, `Project`, `Task`, and `Comment`

## Repository Layout

```text
app/
  (auth)/
    layout.tsx
    onboarding/page.tsx
    sign-in/page.tsx
    sign-up/page.tsx
  (dashboard)/
    layout.tsx
    loading.tsx
    page.tsx
    workspaces/[workspaceId]/page.tsx
  api/[...route]/route.ts
  layout.tsx

features/
  action.ts
  schemas.ts
  auth/
    api/
      use-current.ts
      use-login.ts
      use-logout.tsx
      use-onboarding.ts
      use-register.ts
    components/
    constant.ts
    server/route.ts
  workspaces/
    api/use-create-workspace.ts
    components/create-workspace-form.tsx
    schemas.ts
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

## API Documentation

- OpenAPI JSON: `/api/openapi.json`
- Swagger UI: `/api/docs`

## Auth Architecture

1. Login and register create a `Session` row and set `auth_token` cookie.
2. Hono `sessionMiddleware` reads the cookie and resolves the current user.
3. `GET /api/auth/me` uses the middleware for client-side user fetch.
4. `features/action.ts` performs server-side user resolution directly through Prisma for page gating.
5. Logout deletes the session record and clears the cookie.

## Workspace Flow (Current)

1. `CreateWorkspaceForm` validates input with Zod.
2. `useCreateWorkspace` posts to `/api/workspaces`.
3. Hono route validates payload and requires `sessionMiddleware`.
4. Route creates a `Workspace` row and a `WorkspaceMember` row with `ADMIN` role for the creator.
5. On success, form resets and `workspaces` query key is invalidated.

## Workspace Invite Flow (Current)

1. Workspace admin can reset invite code via `POST /api/workspaces/:workspaceId/reset-invite-code`.
2. Invite links use `/workspaces/:workspaceId/join/:invitecode`.
3. Join flow posts `inviteCode` to `POST /api/workspaces/:workspaceId/join`.
4. Route validates code, prevents duplicate membership, then creates a `WorkspaceMember` row with `MEMBER` role.

## Known Gaps

- Passwords are still stored and compared in plain text.
- Tests are not implemented yet.
- Workspace and Project both exist in Prisma; Project CRUD/UI is still pending.
- Localhost login issues can occur if cookie security flags are not environment-aware.
- Home redirects to `/workspaces/create` when no workspaces exist, but that page route is not implemented yet.

## Next Milestones

1. Security hardening
- Add password hashing (bcrypt or argon2)
- Move cookie security flags to environment-aware defaults
- Add session rotation and revoke-all support

2. Product foundation
- Keep Workspace and Project naming consistent across Prisma and UI
- Add list/read/update/delete APIs for projects and tasks
- Build first board/list UI for tasks

3. Quality pass
- Add integration tests for auth endpoints
- Add end-to-end auth happy-path test
- Add CI lint/typecheck gates
