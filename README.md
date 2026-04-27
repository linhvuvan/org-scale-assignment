# Campaign Manager

Email campaign platform to create, schedule, and send campaigns to recipients.

## Monorepo layout

| Directory | Stack                                             |
| --------- | ------------------------------------------------- |
| `be/`     | Express 5 · TypeScript · Drizzle ORM · PostgreSQL |
| `fe/`     | React 19 · Vite · SWR · Tailwind CSS              |

## Prerequisites

- Node 24
- Docker (for PostgreSQL)

## Quick start (Docker Compose)

```bash
docker compose up -d
```

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3000 |

## Seed data

On first `docker compose up`, the backend automatically seeds the database with demo data:

| | |
|---|---|
| Email | `demo@example.com` |
| Password | `password` |

5 campaigns are created (2 draft, 1 scheduled, 2 sent) with 10 recipients and realistic stats.
To reseed, stop the stack and drop the volume: `docker compose down -v`.

## Manual setup

**Backend**

```bash
cd be
npm install
npm run db:push   # first time only
npm run dev
```

**Frontend**

```bash
cd fe
npm install
npm run dev
```

## Environment variables

**`be/.env`**

| Variable          | Default                                 | Description                  |
| ----------------- | --------------------------------------- | ---------------------------- |
| `PORT`            | `3000`                                  | HTTP port                    |
| `NODE_ENV`        | `development`                           | Node environment             |
| `DATABASE_URL`    | `postgres://app:app@localhost:5432/app` | PostgreSQL connection string |
| `JWT_SECRET`      | —                                       | Secret used to sign JWTs     |
| `FRONTEND_ORIGIN` | `http://localhost:5173`                 | CORS allowed origin          |

**`fe/.env`**

| Variable       | Default                 | Description      |
| -------------- | ----------------------- | ---------------- |
| `VITE_API_URL` | `http://localhost:3000` | Backend base URL |

## API reference

| Method   | Path                      | Auth   | Description                |
| -------- | ------------------------- | ------ | -------------------------- |
| `GET`    | `/health`                 | —      | Health check               |
| `POST`   | `/auth/register`          | —      | Register, sets cookie      |
| `POST`   | `/auth/login`             | —      | Log in, sets cookie        |
| `POST`   | `/auth/logout`            | cookie | Clear cookie               |
| `GET`    | `/campaigns`              | cookie | List campaigns (paginated) |
| `POST`   | `/campaigns`              | cookie | Create draft campaign      |
| `GET`    | `/campaigns/:id`          | cookie | Get campaign + stats       |
| `PATCH`  | `/campaigns/:id`          | cookie | Update draft campaign      |
| `POST`   | `/campaigns/:id/schedule` | cookie | Schedule campaign          |
| `POST`   | `/campaigns/:id/send`     | cookie | Send scheduled campaign    |
| `DELETE` | `/campaigns/:id`          | cookie | Delete draft campaign      |

## Tests

```bash
cd be && npm test
```

Integration tests run against a real database (separate test DB configured in `docker-compose.yml`).

## Database commands

```bash
npm run db:generate   # generate migration files from schema changes
npm run db:migrate    # apply pending migrations
npm run db:push       # sync schema directly (dev only)
npm run db:seed       # seed demo data (skips if DB is not empty)
npm run db:studio     # open Drizzle Studio UI
```

## How I Used Claude Code

### What I delegated

- **Auth:** Setting up JWT cookie auth end-to-end — bcrypt hashing, token signing, the `authRequired` middleware step, and the login/register/logout routes.
- **Campaign API:** Backend routes, controllers, and Drizzle query functions for campaign CRUD, scheduling, and sending — including the paginated list endpoint.
- **Frontend data layer:** All SWR hooks (`useGetCampaigns`, `useCreateCampaign`, `useDeleteCampaign`, etc.) and the `fetcher` helpers with cookie credentials.
- **UI:** Page and component implementation — login, register, campaign list, campaign detail, and new campaign pages using React and Tailwind CSS.

### Real prompts I used

> "create an api that create new campaign with pagination"

> "add JWT auth with HTTP-only cookies — register and login should set a cookie, logout should clear it"

> "build SWR hooks for the campaign list and detail pages"

### Where Claude Code was wrong

It tended to bundle multiple functions with different purposes into the same file — no clear separation of concerns, and little regard for readability or long-term maintainability. The code worked, but it was not organized in a way that would be easy to navigate or extend. Each instance required an explicit correction to get proper file boundaries.

### What I would not let Claude Code do

I kept architecture decisions for myself. The `pipe()` middleware composition pattern, the layered route → controller → db structure, and the overall monorepo layout were all things I designed and handed Claude Code as constraints to work within — not questions I asked it to answer. Letting an AI define your architecture means you may not understand what you're building or how to change it later.
