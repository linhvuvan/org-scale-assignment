# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Layout

Two sub-projects sharing a git root:
- `be/` — Express 5 + TypeScript backend (Node 24)
- `fe/` — React 19 + Vite + TypeScript frontend

---

## Backend (`be/`)

### Commands
```bash
cd be
npm run dev          # nodemon dev server (port 3000)
npm run build        # tsc compile → dist/
npm start            # run compiled dist/index.js
npm test             # vitest run (all tests)
npm run db:generate  # generate Drizzle migration files
npm run db:migrate   # apply migrations
npm run db:push      # push schema directly (dev shortcut)
npm run db:studio    # open Drizzle Studio UI
```

### Stack
Express 5 · Drizzle ORM · PostgreSQL (postgres-js driver) · Zod · JWT (HTTP-only cookie) · bcryptjs · Vitest · Supertest

### Architecture

**Layers:** `routes/` → `controllers/` → `db/` + `business-logic/`

**`pipe()` pattern** (`src/utils/pipe.ts`) — the core controller idiom. Each handler is composed of typed "steps"; steps accumulate context and can short-circuit with a 401/400 response by returning `null`.

```typescript
await pipe(req, res,
  bodyRequired(schema),   // validates body, adds ctx.body
  authRequired,           // verifies JWT cookie, adds ctx.user
  async ({ ctx }) => { /* terminal handler */ }
);
```

**Middleware steps** live in `src/middleware/`: `authRequired`, `bodyRequired(zodSchema)`, `validateParams`, `campaignRequired`, `userRequired`, `errorHandler`.

**Database** (`src/db/`): `schema.ts` defines all Drizzle tables; `users.ts` / `campaigns.ts` export typed query functions. Tables: `users`, `campaigns`, `recipients`, `campaign_recipients`.

**Auth flow**: POST `/auth/register` or `/auth/login` → bcrypt verify → sign JWT (8h, `JWT_SECRET`) → set HTTP-only cookie named `token`.

### Environment variables
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://app:app@localhost:5432/app
JWT_SECRET=your-secret-here
```
Copy `.env.example` → `.env`. A `docker-compose.yml` is provided to spin up PostgreSQL locally.

---

## Frontend (`fe/`)

### Commands
```bash
cd fe
npm run dev      # Vite dev server (port 5173)
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run preview  # preview production build
```

### Stack
React 19 · React Router DOM 7 · SWR 2 · Tailwind CSS 4 · Vite 8 · TypeScript 6

### Architecture

**Directory layout:**
- `src/pages/` — full-page route components (Login, Register, Home, Campaigns)
- `src/components/` — reusable UI; `common/` for primitives (Button, Input, Badge, etc.)
- `src/hooks/` — SWR-backed data hooks; mutations use `useSWRMutation`
- `src/entities/` — shared TypeScript types (e.g. `Campaign`)
- `src/config/env.ts` — exports `API_URL` from `VITE_API_URL` (defaults to `http://localhost:3000`)
- `src/3rd-parties/fetcher.ts` — `getFetcher` / `postFetcher` helpers; both include `credentials: "include"` for cookie auth

**Routing** (`App.tsx`): BrowserRouter wrapping `<ProtectedRoute>` (requires `isLoggedIn`) and `<GuestRoute>` (requires `!isLoggedIn`). Auth state is a boolean in localStorage under key `"logged_in"`, read via `useLoggedIn()`.

**Data fetching pattern:**
```typescript
// Read
const { campaigns, isLoading, errorMessage } = useGetCampaigns(page)
// Mutation
const { login, isMutating, errorMessage } = useLogin()
```
Errors are set explicitly via `useState` in the `catch` block of mutation hooks.

### Environment variables
```
VITE_API_URL=http://localhost:3000
```
