# Bun + SQLite + Drizzle API

This backend is intentionally standalone. It does not hook into the React app yet.
Tables are created automatically on boot for local learning.

## Setup

1) Install deps from the `react-app` folder:
```
bun install
```

2) (Optional) Set a database file:
```
DB_FILE_NAME=file:backend/data/app.sqlite
```

3) Start the API:
```
bun run api:dev
```

## Seed data

```
bun run api:seed
```

## Migrations (Drizzle Kit)

```
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

## Endpoints

- `GET /api/health`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `GET /api/posts`
- `GET /api/posts/:id`
- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/seed` (one-time demo data)
