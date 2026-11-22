# Chirpy

A small Twitter/X-style backend API, written from scratch in TypeScript on Express 5, backed by PostgreSQL via Drizzle ORM. Users sign up, log in, and post short messages ("chirps"); auth is handled with JWTs and rotating refresh tokens.

## Why look at this

There's no framework magic hiding the pieces — this project builds each layer explicitly: request validation and custom error classes, an error-handling middleware chain, password hashing, JWT issuing/verification, refresh-token rotation, and Postgres migrations via Drizzle. If you're looking for a compact, readable reference for how those pieces fit together in a real Express + Postgres app, this is it.

## Features

- User accounts (sign up, log in, update email/password)
- JWT authentication with short-lived access tokens and long-lived, revocable refresh tokens
- Posting, listing, and deleting chirps, with basic profanity filtering
- Filtering and sorting chirps by author (`?authorId=`) and date (`?sort=asc|desc`)
- A dev-only admin reset endpoint and a basic hit-count metrics page
- A webhook endpoint for upgrading a user to "Chirpy Red"

## API

| Method | Path                  | Description                                   |
|--------|-----------------------|------------------------------------------------|
| GET    | `/api/healthz`         | Readiness check                                |
| POST   | `/api/users`           | Create a user                                  |
| GET    | `/api/users`           | List all users                                 |
| PUT    | `/api/users`           | Update the authenticated user (requires auth)  |
| POST   | `/api/login`           | Log in, get a JWT + refresh token               |
| POST   | `/api/refresh`         | Exchange a refresh token for a new JWT          |
| POST   | `/api/revoke`          | Revoke a refresh token                         |
| POST   | `/api/chirps`          | Create a chirp (requires auth)                 |
| GET    | `/api/chirps`          | List chirps (`?authorId=`, `?sort=asc\|desc`)  |
| GET    | `/api/chirps/:id`      | Get a single chirp                             |
| DELETE | `/api/chirps/:id`      | Delete a chirp (author only, requires auth)    |
| POST   | `/api/polka/webhooks`  | Upgrade a user to Chirpy Red (requires API key) |
| POST   | `/admin/reset`         | Delete all users (dev environment only)        |
| GET    | `/admin/metrics`       | Basic hit-count page                           |

Routes marked "requires auth" expect `Authorization: Bearer <jwt>`. The webhook expects `Authorization: ApiKey <key>`.

## Running it locally

**Prerequisites:** Node.js, and a PostgreSQL server running locally.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:
   ```bash
   DB_URL=postgres://user:password@localhost:5432/chirpy?sslmode=disable
   PLATFORM=dev
   SECRET=some-long-random-string
   POLKA_KEY=some-shared-webhook-key
   PORT=8080
   ```
   - `DB_URL` — your Postgres connection string
   - `PLATFORM` — set to `dev` to enable `/admin/reset`; anything else disables it (returns 403)
   - `SECRET` — used to sign and verify JWTs
   - `POLKA_KEY` — the key the `/api/polka/webhooks` endpoint expects via `Authorization: ApiKey <value>`
   - `PORT` — optional, defaults to `8080` if unset

3. Start the dev server:
   ```bash
   npm run dev
   ```
   Pending database migrations run automatically on startup — no separate migration step needed.

4. Run the test suite:
   ```bash
   npm test
   ```

For a production build: `npm run build && npm start`.
