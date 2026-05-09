# Vacation App Backend

The **backend server** is the REST API that powers the Vacation app.

It exposes endpoints to:
- manage **users** (create/list/delete, plus a dev seed)
- manage **vacation requests** (create requests, list them, and approve/reject)

Under the hood it uses **Express** to handle HTTP requests and **TypeORM** to persist data in **PostgreSQL**.

Express + TypeORM (PostgreSQL) REST API for managing users and vacation requests.


## Tech stack
- Node.js / TypeScript
- Express (REST)
- TypeORM
- PostgreSQL
- Jest + Supertest (tests)

## Project structure
- `src/app.ts` – Express app wiring (routes + middleware)
- `src/index.ts` – DB initialization + server start
- `src/data-source.ts` – TypeORM data source configuration
- `src/entity/` – TypeORM entities (`User`, `VacationRequest`)
- `src/routes/` – API routes
  - `user.routes.ts`
  - `request.routes.ts`
- `src/tests/` – integration tests

## Prerequisites
- PostgreSQL running locally
- Node.js installed

## Database configuration
Edit `src/data-source.ts`:
- `host`, `port`
- `username`, `password`
- `database`

Current defaults:
- host: `localhost`
- port: `5432`
- username: `postgres`
- password: *(empty string)*
- database: `vacation_db`

> Note: `synchronize: true` is enabled (TypeORM will auto-create tables). For production, consider migrations instead.

## Setup
```bash
cd vacation-app/backend
npm install
```

## Run the server (dev)
```bash
npm run dev
```

Server starts on: `http://localhost:3000`

## API
All endpoints are prefixed with:
- `POST /requests`
- `GET /requests`
- `PATCH /requests/:id`
- `DELETE /requests/:id`

### Requests
#### Create request
`POST /requests`

Body:
```json
{
  "userId": 1,
  "startDate": "2026-06-01",
  "endDate": "2026-06-05",
  "reason": "Vacation"
}
```

#### Get all requests
`GET /requests`

#### Update status (approve/reject)
`PATCH /requests/:id`

Body:
```json
{
  "status": "approved",
  "comments": "Optional comment"
}
```

Allowed statuses (see `RequestStatus`):
- `pending`
- `approved`
- `rejected`

#### Delete request
`DELETE /requests/:id`

### Users
#### Get all users
`GET /users`

#### Create user
`POST /users`

Body example:
```json
{
  "name": "Charlie",
  "role": "requester"
}
```

Allowed roles (see `UserRole`):
- `requester`
- `validator`

#### Delete user
`DELETE /users/:id`

#### Seed users (dev)
`POST /users/seed`

Creates:
- Alice (`requester`)
- Bob (`validator`)

## Testing
Run Jest tests:
```bash
npm test
```

## Notes / examples (curl)
### Create request
```bash
curl -X POST http://localhost:3000/requests \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "startDate": "2026-06-01",
    "endDate": "2026-06-05",
    "reason": "Vacation"
  }'
```

### Approve request
```bash
curl -X PATCH http://localhost:3000/requests/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"approved","comments":"Enjoy your time off"}'
```

