# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (HMR)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

## Environment

`VITE_API_URL` — backend base URL, defaults to `http://localhost:3000`. Defined in [src/config/env.ts](src/config/env.ts).

## Architecture

React 19 + TypeScript + Vite SPA.

**Routing** ([src/App.tsx](src/App.tsx)): React Router v7 with two custom guards:
- `ProtectedRoute` — redirects to `/login` if `localStorage.logged_in` is not set
- `GuestRoute` — redirects to `/` if already logged in

**Auth flow**: Login/register POST to `${API_URL}/auth/*` via `useSWRMutation`. On success, login sets `localStorage.logged_in = "true"`; logout clears it.

**API pattern**: All mutations use `useSWRMutation` from SWR. Errors are set explicitly via `useState` in the catch block. Global SWR config in `App.tsx` sets `shouldRetryOnError: false`.

**Hooks** ([src/hooks/](src/hooks/)): One file per hook. Mutation hooks wrap `useSWRMutation` + error state and return a boolean (e.g. `register()`, `login()`) so the component owns navigation and other side effects (e.g. `localStorage`).

**Shared fetcher** ([src/3rd-parties/fetcher.ts](src/3rd-parties/fetcher.ts)): `postFetcher<T>` — generic JSON POST for `useSWRMutation`. Throws `new Error(message || "Something went wrong")` on non-ok responses. Third-party/infrastructure utilities live in `src/3rd-parties/`.

**Styling**: Tailwind CSS v4 via the Vite plugin (`@import "tailwindcss"` in [src/index.css](src/index.css)).
