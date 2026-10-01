# Dots-test-task

URL shortener REST API built with Node.js, TypeScript, Express and PostgreSQL.

## Run with Docker

```bash
docker compose --profile app up --build
```

The API is available at http://localhost:3000.

## Run locally

Requires Node.js 22+ and Docker (for PostgreSQL).

```bash
docker compose up -d db
npm install
npm run migrate
npm run dev
```

The database connection string is taken from `DATABASE_URL`
(default `postgres://shortener:shortener@localhost:5432/shortener`) and the port from `PORT` (default `3000`).
Both can be set in a `.env` file (see `.env.example`).

## Migrations

The database schema is defined by the SQL files in `migrations/`, which are applied in filename order.
`npm run migrate` applies only the migrations that have not been applied yet, each one in its own transaction.
Applied migrations are recorded in the `schema_migrations` table.
In Docker, the app container runs the migrations automatically before it starts.

To change the schema, add a new file such as `migrations/002_add_something.sql`.

## Postman

A Postman collection with all requests is in `postman_collection.json` (import it into Postman or run `npx newman run postman_collection.json`).

## API

| Method | Endpoint       | Response                                                    |
| ------ | -------------- | ----------------------------------------------------------- |
| POST   | `/shorten`     | `201 { "code": "abc123" }`, body `{ "url": "https://..." }` |
| GET    | `/:code`       | `302` redirect to the original URL                          |
| GET    | `/stats/:code` | `200 { "code", "url", "visits" }`                           |

Errors are returned as JSON `{ "error": "..." }` with status `400` (invalid input) or `404` (unknown code).

```bash
curl -X POST localhost:3000/shorten -H "Content-Type: application/json" -d '{"url":"https://example.com"}'
curl -i localhost:3000/<code>
curl localhost:3000/stats/<code>
```

## Structure

```
migrations/                       SQL migrations
src/
  config/                         environment variables and database pool
  schemas/                        Zod request schemas
  middlewares/validate.ts         request body validation
  controllers/link.controller.ts  HTTP handlers
  models/link.model.ts            data access (PostgreSQL)
  helpers/generate-code.ts        short code generation
  errors.ts                       error definitions
  routes.ts                       routing
  app.ts                          express app and error handler
  main.ts                         entry point
  migrate.ts                      migration runner
```
