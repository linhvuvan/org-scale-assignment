# be

Node.js / Express / TypeScript backend.

## Getting started

```bash
docker compose up -d   # start Postgres
npm run db:push        # sync schema to DB (first time or after schema changes in dev)
npm run dev            # start dev server with hot-reload
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot-reload (nodemon + ts-node) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output from `dist/` |

## Database commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Read `src/db/schema.ts`, diff against last snapshot, write a SQL migration file to `drizzle/`. Run whenever the schema changes. |
| `npm run db:migrate` | Execute pending SQL migration files against the database. The production-safe way to evolve the schema — files are reviewable and committed to git. |
| `npm run db:push` | Sync the schema directly to the DB without migration files. Fast for early prototyping, not safe once you have data you care about. |
| `npm run db:studio` | Open a local web UI to browse and edit the database. |

## API

### Campaigns

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/campaigns` | List all campaigns |
| `POST` | `/campaigns` | Create a new campaign |
| `DELETE` | `/campaigns/:id` | Delete a draft campaign |

#### Status codes

| Code | Meaning |
|------|---------|
| `200` | OK — request succeeded, body contains data |
| `201` | Created — resource created, body contains the new resource |
| `204` | No Content — request succeeded, no body (e.g. successful delete) |
| `400` | Bad Request — request body failed validation |
| `401` | Unauthorized — missing or invalid auth token |
| `404` | Not Found — resource does not exist |
| `409` | Conflict — operation not allowed in the current state (e.g. deleting a non-draft campaign) |
