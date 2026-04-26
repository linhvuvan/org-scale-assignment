# fe

React 19 + Vite + TypeScript frontend.

## Getting started

```bash
npm run dev      # Vite dev server at http://localhost:5173
```

Requires the backend to be running at `http://localhost:3000` (or set `VITE_API_URL`).

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build to `dist/` |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## Environment variables

```
VITE_API_URL=http://localhost:3000
```

## Pages

| Route | Component | Access |
|-------|-----------|--------|
| `/login` | `Login` | Guest only |
| `/register` | `Register` | Guest only |
| `/campaigns` | `Campaigns` | Auth required |
| `/campaigns/new` | `NewCampaign` | Auth required |
| `/campaigns/:id` | `CampaignDetail` | Auth required |

All other routes redirect to `/login`.

## Key patterns

**Auth state** is a boolean in localStorage (`"logged_in"`), managed by `useLoggedIn()` from `src/hooks/useLocalStorage.ts`.

**Data fetching** uses SWR for reads and `useSWRMutation` for writes. Errors are captured explicitly via `useState` in each hook's `catch` block.

**Fetchers** (`src/3rd-parties/fetcher.ts`): `getFetcher`, `postFetcher<T>`, `deleteFetcher` — all send `credentials: "include"` for cookie auth. Any `401` response clears `localStorage` and redirects to `/login?error=session_expired`.
