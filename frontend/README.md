# Vacation App Frontend

Frontend web application for the Vacation app (Vue 3 + Vite).

It lets you:
- connect/select a user
- browse vacation requests
- create a vacation request
- approve/reject pending requests (validator)
- remove requests (validator)

The UI talks to the backend REST API running on `http://localhost:3000`.

## Tech stack
- Vue 3
- TypeScript
- Vite
- Vue Router
- Axios

## Requirements
- Node.js installed
- Backend server running (for API calls)

## Setup
```bash
cd vacation-app/frontend
npm install
```

## Run
```bash
npm run dev
```

App URL (default Vite): `http://localhost:5173`

## Configuration
API base URL is configured in:
- `src/services/api.ts`

Currently:
- `baseURL: 'http://localhost:3000'`

If your backend runs elsewhere, update it accordingly.

## What the frontend does (user flow)

### Submit a vacation request
1. Go to **Requests** (`/requests`).
2. Use the connected user (shown in the header). The connected user is selected on the **Users** page (`/users`).
3. Fill in **start date**, **end date**, and **reason**.
4. Click **Submit request**.
5. The frontend calls `POST /requests` on the backend, then refreshes the dashboard.

### Approve / Reject (validator)
- If the connected user has role `validator`, the dashboard shows **Approve** and **Reject** actions.
- Clicking these calls `PATCH /requests/:id` with `status: approved | rejected`.

### Remove requests (validator)
- Validators can also remove requests via `DELETE /requests/:id`.

## Routes / UI pages
- `/requests` → `src/views/Requests.vue`
  - Request submission form
  - Requests dashboard (list)
  - Approve/Reject for `validator`
  - Remove for `validator`
- `/users` → `src/views/Users.vue`
  - “Navbar”/navigation is handled by `src/components/Sidebar.vue`
  - UI lets you add/select users using the backend `GET/POST /users` endpoints

## Navbar / navigation
Navigation is rendered by `src/components/Sidebar.vue` and routes are defined in `src/router/index.ts`.

## Key source files
- `src/services/api.ts` – Axios instance
- `src/composables/useCurrentUser.ts` – connected user state
- `src/composables/useRequests.ts` – requests API + actions
- `src/composables/useUsers.ts` – users API + actions
- `src/views/Requests.vue` / `src/views/Users.vue` – main pages

## Development Notes
- Role checks in the UI:
  - `validator` can approve/reject pending requests
  - `validator` can remove requests

## Testing
Run frontend unit tests:
```bash
npm run test:unit
```

Run frontend E2E tests:
```bash
npm run test:e2e
```

Run both frontend unit and E2E tests:
```bash
npm run test:frontend
```

