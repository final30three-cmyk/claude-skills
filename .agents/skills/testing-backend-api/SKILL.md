---
name: testing-backend-api
description: Test the backend API (Express + TypeScript + JWT) end-to-end. Use when verifying auth, CRUD, or middleware changes in backend-api/.
---

# Testing the Backend API

## Prerequisites

- Node.js 18+
- pnpm installed globally
- No external services needed (in-memory repositories)

## Setup

```bash
cd backend-api
pnpm install
pnpm --filter @backend-api/shared build
pnpm dev
```

Server starts on port 3000. Verify with `GET /health` returning `{"status":"ok"}`.

## Running E2E Tests

A test script exists at `backend-api/e2e-test.mjs`. Run with:

```bash
cd backend-api
node e2e-test.mjs
```

This tests all 15 core flows (44 assertions). The server must be running with fresh state (restart to clear in-memory data between runs).

## Key Testing Notes

### Product Creation Payload

The product DTO requires `categoryId` (must be a valid UUID):

```json
{
  "name": "Widget",
  "description": "A test widget",
  "price": 29.99,
  "stock": 10,
  "categoryId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Omitting `categoryId` returns 400 VALIDATION_ERROR.

### Rate Limiting

Auth endpoints have aggressive rate limiting. If you hit 429 errors during testing, restart the server to reset the in-memory rate limit counters.

### Auth Flow

1. Register: `POST /api/auth/register` with `{email, password, name}` → 201 with tokens
2. Login: `POST /api/auth/login` with `{email, password}` → 200 with tokens
3. Refresh: `POST /api/auth/refresh` with `{refreshToken}` → 200 with new token pair
4. Use `Authorization: Bearer <accessToken>` header for protected endpoints

### RBAC

- Default registered users have `role: "user"`
- Admin-only endpoints (GET /api/users, DELETE /api/users/:id) return 403 for non-admin users
- There is no admin registration endpoint; admin users would need to be seeded or role changed in the repository

### Error Response Shape

All errors follow: `{"error": "message", "code": "CODE", "field": "fieldName|null"}`

Standard codes: VALIDATION_ERROR, CONFLICT, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, RATE_LIMIT_AUTH

### In-Memory State

All data is stored in-memory. Restarting the server clears all users, products, and rate limit counters. Tests must register a fresh user on each run.

## Testing on Windows

On Windows, avoid `curl` alias (PowerShell aliases it to `Invoke-WebRequest`). Use either:
- `curl.exe` (actual curl binary) — but JSON escaping is tricky in PowerShell
- Node.js scripts with `fetch()` (recommended, avoids all escaping issues)
- `Invoke-RestMethod` for simple GET requests

## Devin Secrets Needed

None — the API uses hardcoded dev secrets (`dev-secret-change-me`) in development mode.
