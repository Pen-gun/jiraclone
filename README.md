# Jira Clone

A production-oriented Jira-style project management app built with Next.js App Router, TypeScript, and shadcn-based UI primitives.

This repository currently focuses on authentication UI and form architecture, with server-side auth workflows in progress.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn UI components + Radix primitives
- React Hook Form
- Zod
- @hookform/resolvers

## Current Scope

Implemented:
- Auth route group with dedicated layout.
- Sign-in and sign-up cards.
- Client-side form validation with React Hook Form + Zod.
- Field-level error rendering via shadcn Field primitives.
- Password confirmation validation on sign-up.

In progress:
- Server-side sign-up integration.
- API error mapping and generic error states.

## Project Structure

```text
app/
	layout.tsx
	page.tsx
	(auth)/
		layout.tsx
		sign-in/page.tsx
		sign-up/page.tsx

components/
	dotted-seperator.tsx
	ui/
		button.tsx
		card.tsx
		input.tsx
		field.tsx
		...

features/
	auth/
		components/
			sign-in-card.tsx
			sign-up-card.tsx

lib/
	utils.ts
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run local development server

```bash
npm run dev
```

Open http://localhost:3000.

## Available Scripts

```bash
npm run dev     # Start development server
npm run build   # Create production build
npm run start   # Run production server
npm run lint    # Run ESLint
```

## Form Architecture

Auth forms use the following pattern:

1. Zod schema defines data shape and constraints.
2. useForm initializes form state with zodResolver.
3. Controller binds custom Input components.
4. Field and FieldError (from ui/field) render accessible validation state.

Why this pattern:
- Keeps validation logic centralized and type-safe.
- Works cleanly with custom UI components.
- Avoids tight coupling to a single form abstraction layer.

## Validation and Error Handling Status

Client-side validation:
- Complete for sign-in and sign-up.

Field-level errors:
- Complete using FieldError.

Server-side/API errors:
- Not implemented yet.
- Next step is to add submit try/catch, map known field errors with setError, and show a generic top-level message for unknown failures.

## Engineering Standards

- Keep feature logic in features/* and shared primitives in components/ui/*.
- Maintain schema-driven validation for all forms.
- Prefer explicit response contracts for API routes.
- Add loading and disabled states for async form submissions.
- Do not merge auth changes without error-state coverage.

## Recommended Next Milestone

1. Add sign-up API endpoint or server action.
2. Wire sign-up submit to backend.
3. Handle response cases:
	 - success
	 - field errors (email/password)
	 - generic server error
4. Add pending state for submit button.
5. Add smoke test for sign-up happy and failure paths.

## Notes

- This codebase intentionally uses shadcn Field primitives rather than shadcn Form/FormMessage wrappers.
- If needed, both approaches can coexist as long as one clear pattern is enforced per feature.
