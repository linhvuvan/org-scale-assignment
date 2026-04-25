# CLAUDE.md

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@import "tailwindcss"` in index.css — no config file)
- react-router-dom for routing
- SWR (`useSWRMutation`) for POST/mutations

## Backend
- Express API at `http://localhost:4000`
- Auth: `POST /auth/register`, `POST /auth/login`
- Login sets token as an **httpOnly cookie** (JS cannot read it)
- Client-side auth state tracked via `localStorage.getItem("logged_in") === "true"`

## Scripts
- `npm run dev` — start dev server
- `npm run build` — type-check + build
- `npm run lint` — ESLint

## TypeScript
Strict: `noUnusedLocals` and `noUnusedParameters` are on. Every import and param must be used.
- `verbatimModuleSyntax` is on — type-only imports must use `import type` or inline `type` keyword (`import { useState, type Foo }`)
- `React.FormEvent` is deprecated in React 19 — use `React.FormEvent` via the global namespace (no named import), or avoid typed event params when possible
- Route guards use `Outlet` pattern: `ProtectedRoute` (redirect to `/login` if not logged in), `GuestRoute` (redirect to `/` if logged in)

## Code style
- `||` over `??` for fallback defaults
- `/* */` block comments, never stacked `//` lines
- No comments unless the WHY is non-obvious
