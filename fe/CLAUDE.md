# CLAUDE.md

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@import "tailwindcss"` in index.css — no config file)
- react-router-dom for routing
- SWR (`useSWRMutation`) for POST/mutations

## Backend
- Express API at `http://localhost:4000`
- Auth: `POST /register`, `POST /login`

## Scripts
- `npm run dev` — start dev server
- `npm run build` — type-check + build
- `npm run lint` — ESLint

## TypeScript
Strict: `noUnusedLocals` and `noUnusedParameters` are on. Every import and param must be used.

## Code style
- `||` over `??` for fallback defaults
- `/* */` block comments, never stacked `//` lines
- No comments unless the WHY is non-obvious
