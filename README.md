# Vacation App

Full-stack app for requesting and managing vacation time.

- **Backend**: Express + TypeORM REST API (PostgreSQL)
- **Frontend**: Vue 3 + Vite SPA

## What it does

- Users can create vacation requests.
- A user with role **`validator`** can approve/reject pending requests and remove requests.
- The frontend communicates with the backend via HTTP on `http://localhost:3000`.

## Create new user requester/validator

<img width="1414" height="590" alt="Screenshot 2026-05-09 at 21 32 28" src="https://github.com/user-attachments/assets/54f543c2-396e-4e02-a7d5-2156764b020f" />

## Switch between users add validator options

<img width="1426" height="838" alt="Screenshot 2026-05-09 at 21 35 44" src="https://github.com/user-attachments/assets/672469e5-105f-4c61-a6fe-e250796a77f4" />

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




