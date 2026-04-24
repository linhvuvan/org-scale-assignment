# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server with hot-reload (nodemon + ts-node)
npm run build    # compile TypeScript to dist/
npm start        # run compiled output from dist/
```

## Architecture

Entry point is `src/index.ts` — it reads config and starts the HTTP listener. Express app wiring (middleware, route registration) lives in `src/app.ts`, which is kept separate so it can be imported in tests without binding a port.

**Request flow:** `src/index.ts` → `src/app.ts` → `src/routes/*.route.ts` → `src/controllers/<resource>/<resource>.controller.ts`

**Key conventions:**

- All `process.env` access is centralized in `src/config/env.ts`. Never read `process.env` directly elsewhere — add new variables there and export them via the `env` object.
- Each resource has its own subfolder under `src/controllers/` (e.g. `src/controllers/health/`).
- Use `||` not `??` for fallback defaults (e.g. `process.env.PORT || "3000"`).
- `express.json()` and `express.urlencoded()` are registered in `app.ts` — no `body-parser` package needed. `cookie-parser` is not installed; add it explicitly if cookie-based auth is introduced.
- `tsconfig.json` extends `@tsconfig/node24` — keep compiler options minimal and don't duplicate settings already provided by that base.
- Use `type` (not `interface`) for all type definitions.
- Entity types live in `src/entities/<entity>.ts`.
- Business logic goes in `src/business-logic/<resource>.ts` — no Express types, pure functions, easy to unit test. Controllers own HTTP concerns (validation, status codes, in-memory store) and delegate construction/logic to business-logic.
- Use Zod (`zod` package) for all request body validation via `schema.safeParse(req.body)`.
- Business logic functions that take multiple params use a single input object and destructure it (e.g. `createUser({ email, name, passwordHash })`).
- All constants live in `src/config/constants.ts`.
- Third-party library wrappers live in `src/3rd-parties/<lib>.ts`. Each file exports a single named object (matching the lib name) whose methods are the only surface the rest of the code calls — never import the raw library elsewhere. Example: `export const bcrypt = { hashPassword, verifyPassword }`, `export const jwt = { signToken }`.
