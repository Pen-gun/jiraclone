# Project management system inspired by jira

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
- Workspace member list/update/remove endpoints under `/api/members`
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
  members/
    api/
      use-delete-member.ts
      use-get-members.ts
      use-update-method.ts
    components/manage-members-form.tsx
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

## Member Management Flow (Current)

1. Workspace members page renders `ManageMembersForm`.
2. `useGetMembers` fetches members for `workspaceId` from `GET /api/members`.
3. `useUpdateMember` updates role through `PATCH /api/members/:memberId` with `workspaceId` query.
4. `useDeleteMember` removes non-admin members through `DELETE /api/members/:memberId` with `workspaceId` query.

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

4. make it public
- Deploy it so it can be accessed publicly
- then automate through github action
- ci/cd fully

## Deployment & DevOps

This project is container-first and designed to be automated from source -> image -> registry -> host. Below are recommended and implemented DevOps practices for building, testing, publishing, and deploying the application.

### Container images
- Multi-stage Dockerfile (stages: deps, dev, build, runner) to keep final images small and reproducible.
- Final runtime image targets a lightweight Node base (alpine variant) and runs via a custom `entrypoint.sh` that injects environment-aware configuration.
- Build artifacts (Prisma client, Next.js build output) are produced in the `build` stage and copied to the runner stage.

### Local orchestration (Docker Compose)
- `docker-compose.yml` defines `app` and `postgres` services for local development and CI smoke tests.
- Uses a custom bridge network so services resolve consistently by service name.
- Profiles and `.env` files allow toggling development vs. production behavior (volumes, hot-reload, minimized services).

### CI/CD (GitHub Actions)
- Workflows live under `.github/workflows/` and are responsible for:
  - Installing dependencies and running lint/type checks.
  - Running unit/integration tests (if present).
  - Building multi-stage Docker image and tagging with commit SHA and semantic tags (when applicable).
  - Pushing images to GitHub Container Registry (GHCR) or other registries.
  - Optionally deploying to targets (ssh + docker-compose, Kubernetes, or other orchestrators).
- Recommended workflow steps and best practices:
  - Cache node_modules and Docker build layers for faster runs.
  - Run `npx prisma generate` and include Prisma artifacts in the build context.
  - Gate deployments with an integration test job or required approvals on protected branches.
  - Add `depends-on` style jobs to ensure build → test → publish → deploy ordering.

### Registry & image tagging
- Push images to GHCR as `ghcr.io/<org>/<repo>:<sha>` and `ghcr.io/<org>/<repo>:latest` or semantic tags.
- Keep immutable tags (SHA) for traceability and use lightweight tags for convenience.

### Secrets & environment variables
- Store secrets in GitHub Actions Secrets (or a vault):
  - `GHCR_TOKEN` / `CR_PAT` — push access to the image registry.
  - `SSH_PRIVATE_KEY`, `SERVER_USER`, `SERVER_HOST` — for ssh-based deploys.
  - `DATABASE_URL`, `NEXT_PUBLIC_API_URL`, and any other runtime config for the target environment.
- Use environment-specific secrets (e.g., `DATABASE_URL_PROD`) and inject them at deploy-time rather than hard-coding.

### Database migrations in CI/CD
- Run migrations as a separate deploy step using `npx prisma migrate deploy` (preferred for non-interactive deploys).
- For blue/green or rolling deploys, consider using a dedicated migration job that runs before container replacement.

### Deployment targets (examples)
- SSH + Docker Compose (simple, home lab):
  - Push image to GHCR.
  - SSH to host and `docker-compose pull && docker-compose up -d`.
  - Run `npx prisma migrate deploy` on the host if needed.
- Kubernetes: use `kubectl` or a GitOps approach (ArgoCD/Flux) to update image tags and rollout.
- Cloud services: adapt workflow to provider (ECS, GCP Cloud Run, Azure App Service) and use provider-specific deployment actions.

### Healthchecks, monitoring & alerts
- Expose a simple `/health` endpoint for liveness/readiness checks.
- Add monitoring and alerting (Prometheus + Grafana, or third-party like Datadog) for uptime, response time, and error rates.
- Use log aggregation (e.g., Loki/ELK) or provider logs to centralize server-side errors.

### Rollback & safe deployments
- Keep image tags immutable and deploy by tag to enable quick rollback to a known-good SHA.
- For `docker-compose` deployments, keep a short downtime by pulling the previous image and restarting the service.
- In Kubernetes, use `kubectl rollout undo` to revert a deployment.

### CI checks and quality gates
- Run `npm run lint` and TypeScript typechecks in CI on every PR.
- Add tests to gate merges: unit tests, integration tests, and a small end-to-end smoke test that runs in a disposable container environment.

### Recommended GitHub Actions secrets (minimum)
- `GHCR_TOKEN` — push/pull permissions for GitHub Container Registry.
- `SSH_PRIVATE_KEY`, `SERVER_USER`, `SERVER_HOST` — for ssh deploy jobs.
- `PROD_DATABASE_URL` — used only by the production deploy job and never printed.
- `NEXTAUTH_SECRET` or similar tokens used by auth/session logic.

### Quick deploy checklist
1. Push code and open PR (CI runs lint/type/tests).
2. Merge to `main` (CI builds image and pushes to registry).
3. Deploy job runs (or manual deploy) which:
   - pulls image on target host,
   - runs `npx prisma migrate deploy` (if migration needed),
   - restarts services.
4. Verify `/health` and smoke endpoints.

### Next (in progress)
- Fully automating build → push → deploy on every push to `main` with required integration test gates.
- Integration tests before deployment gate.
