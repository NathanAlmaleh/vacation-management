# Vacation App

Full-stack app for requesting and managing vacation time.

- **Backend**: Express + TypeORM REST API (PostgreSQL)
- **Frontend**: Vue 3 + Vite SPA

## What it does

- Users can create vacation requests.
- A user with role **`validator`** can approve/reject pending requests and remove requests.
- The frontend communicates with the backend via HTTP on `http://localhost:3000`.

## Prerequisites

- Node.js installed
- PostgreSQL running locally

## Quick start

From the repo root:

```bash
# install deps (both apps)
npm install
```

Start both servers (concurrently):

```bash
npm run dev
```

Typical URLs:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## Database setup

Backend TypeORM configuration is in:

- `backend/src/data-source.ts`

Defaults:

- database: `vacation_db`
- host: `localhost`
- port: `5432`
- username: `postgres`
- password: _(empty string)_

TypeORM uses `synchronize: true` (auto-creates tables). For production, prefer migrations.

## Backend (details)

See: `vacation-app/backend/README.md`

## Frontend (details)

See: `vacation-app/frontend/README.md`

## Useful dev scripts

### Start full stack

```bash
npm run dev
```

### Run tests

```bash
npm run test:backend
npm run test:frontend
npm test
```

### Format

```bash
npm run format
npm run format:check
```
