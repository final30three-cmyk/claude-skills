# Backend API

Production-ready REST API built with **Express + TypeScript + Zod + JWT**.

## Project Structure

```
backend-api/
  apps/api/              Express API application
    src/
      config/            Environment-aware configuration
      routes/            HTTP routing
      controllers/       Request/response handling
      services/          Business logic
      repositories/      Data access (in-memory, swap for DB)
      middleware/        Auth, validation, rate limiting, errors
      dto/               Zod validation schemas
      models/            Entity definitions
      tests/             Unit + integration tests
  packages/shared/       Shared types, utilities, error classes
  config/                Reserved for external config overrides
  agent.yaml             AI agent configuration
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Development server (hot reload)
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

## API Endpoints

### Health
| Method | Path      | Auth | Description  |
|--------|-----------|------|--------------|
| GET    | `/health` | No   | Health check |

### Auth
| Method | Path                 | Auth | Description       |
|--------|----------------------|------|-------------------|
| POST   | `/api/auth/register` | No   | Register new user |
| POST   | `/api/auth/login`    | No   | Login             |
| POST   | `/api/auth/refresh`  | No   | Refresh tokens    |

### Products (requires auth)
| Method | Path                | Auth | Description      |
|--------|---------------------|------|------------------|
| GET    | `/api/products`     | Yes  | List products    |
| GET    | `/api/products/:id` | Yes  | Get product      |
| POST   | `/api/products`     | Yes  | Create product   |
| PUT    | `/api/products/:id` | Yes  | Update product   |
| DELETE | `/api/products/:id` | Yes  | Delete product   |

### Users (requires auth)
| Method | Path              | Auth  | Description       |
|--------|-------------------|-------|-------------------|
| GET    | `/api/users/me`   | User  | Get current user  |
| GET    | `/api/users`      | Admin | List all users    |
| GET    | `/api/users/:id`  | User  | Get user by ID    |
| PUT    | `/api/users/:id`  | User  | Update user       |
| DELETE | `/api/users/:id`  | Admin | Delete user       |

## Authentication

JWT Bearer tokens. Register or login to get an access + refresh token pair.

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"Test User"}'

# Use the access token
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer <accessToken>"
```

## Testing

```bash
pnpm test              # All tests
pnpm test:unit         # Unit tests only
pnpm test:integration  # Integration tests only
```

## Scripts

| Command          | Description                    |
|------------------|--------------------------------|
| `pnpm dev`       | Start dev server (hot reload)  |
| `pnpm build`     | Build all packages             |
| `pnpm start`     | Start production server        |
| `pnpm lint`      | Run ESLint                     |
| `pnpm typecheck` | Run TypeScript type checking   |
| `pnpm test`      | Run all tests                  |
