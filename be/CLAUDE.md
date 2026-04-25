# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server with hot-reload (nodemon + ts-node)
npm run build    # compile TypeScript to dist/
npm start        # run compiled output from dist/
npm run db:push     # sync schema to DB without migration files (dev)
npm run db:generate # generate SQL migration file from schema diff
npm run db:migrate  # run pending migration files against the DB
npm run db:studio   # open Drizzle Studio UI
```

## Database (local)

```bash
docker compose up -d  # start Postgres (postgres:17-alpine, port 5432)
```

Credentials: `postgres://app:app@localhost:5432/app` — set via `DATABASE_URL` in `.env`.

## Architecture

Entry point is `src/index.ts` — it reads config and starts the HTTP listener. Express app wiring (middleware, route registration) lives in `src/app.ts`, which is kept separate so it can be imported in tests without binding a port.

**Request flow:** `src/index.ts` → `src/app.ts` → `src/routes/*.route.ts` → `src/controllers/<resource>/<resource>.controller.ts`

**Key conventions:**

- All `process.env` access is centralized in `src/config/env.ts`. Never read `process.env` directly elsewhere — add new variables there and export them via the `env` object.
- Each resource has its own subfolder under `src/controllers/` (e.g. `src/controllers/health/`).
- Use `||` not `??` for fallback defaults (e.g. `process.env.PORT || "3000"`).
- `express.json()` and `express.urlencoded()` are registered in `app.ts` — no `body-parser` package needed. `cookie-parser` is installed and registered in `app.ts`; auth cookies are set with `httpOnly: true`, `secure` in production only, and `sameSite: "lax"`. Cookie name and session duration constants (`AUTH_COOKIE`, `SESSION_DURATION`, `SESSION_MAX_AGE_MS`) live in `src/config/constants.ts`.
- `tsconfig.json` extends `@tsconfig/node24` — keep compiler options minimal and don't duplicate settings already provided by that base.
- Use `type` (not `interface`) for all type definitions.
- Entity types live in `src/entities/<entity>.ts`. When a DB insert omits fields set by the DB (e.g. `createdAt` via `defaultNow()`), define a companion insert type there too — e.g. `export type NewUser = Omit<User, "createdAt">`.
- Business logic goes in `src/business-logic/<resource>.ts` — no Express types, pure functions, easy to unit test. Controllers own HTTP concerns (validation, status codes) and delegate construction/logic to business-logic.
- Use Zod (`zod` package) for all request body validation. Export schemas from the controller file.
- All handlers use `pipe()` from `src/utils/pipe.ts` with composable `Step` functions — never inline auth or validation boilerplate. `pipe()` chains steps sequentially, accumulates context, and short-circuits on `null`. Steps live in `src/middleware/<name>.ts`.
- Body validation goes inside `pipe()` via `bodyRequired(schema)` from `src/middleware/validate.ts`, not at the route level via `validateBody`. Access the validated body as `ctx.body` (typed by Zod inference), not `req.body`. Do not use the `Request` generic to type the body.
- Authentication is a `pipe()` step: add `authRequired` from `src/middleware/auth.ts` as the first step. It reads the cookie, verifies the JWT, and puts `{ user: { id, email } }` in ctx, or returns 401. Never inline the cookie/JWT check in a controller.
- Resource guards (e.g. `campaignRequired(id)`, `draftCampaignRequired`, `emailAvailableRequired`, `userRequired`) are `Step` functions in `src/middleware/`. Each checks a condition, short-circuits with an error response, or adds data to ctx.
- Terminal functions in `pipe()` always close over the outer handler's `res` — do not use the terminal's own `req`/`res` params. Omit trailing unused params; use `_` prefix for non-trailing unused ones: `async (_, __, ctx) => {}` when ctx is needed, `async () => {}` when nothing is needed.
- Shared utility types live in `src/types/<name>.ts`. Shared utility functions live in `src/utils/<name>.ts` (e.g. `safeTry` in `src/utils/safeTry.ts` wraps a throwing thunk into `[Error, null] | [null, T]`).
- Use `crypto.randomUUID()` (built-in Node.js) to generate entity IDs — no extra package needed.
- Custom middleware lives in `src/middleware/<name>.ts`.
- Business logic functions that take multiple params use a single input object and destructure it (e.g. `createUser({ id, email, name, passwordHash })`).
- All constants live in `src/config/constants.ts`.
- Third-party library wrappers live in `src/3rd-parties/<lib>.ts`. Each file exports a single named object (matching the lib name) whose methods are the only surface the rest of the code calls — never import the raw library elsewhere. Example: `export const bcrypt = { hashPassword, verifyPassword }`, `export const jwt = { signToken }`, `export const db = drizzle(client, { schema })`.
- Database schema lives in `src/db/schema.ts` (Drizzle table definitions). DB query functions for each resource live in `src/db/<resource>.ts` — controllers import these instead of calling `db` directly. Pure query operators (e.g. `eq`, `and` from `drizzle-orm`) may be imported directly in `src/db/` files; only the `db` client itself is wrapped in `src/3rd-parties/drizzle.ts`.
- Migration files generated by `drizzle-kit` go in `drizzle/` at the project root (never compiled by `tsc`).
- Always use `/* */` block style instead of `//`.
