# Neat Project Development Guidelines

This document provides essential information for developers working on the Neat project.

## Build/Configuration Instructions

### Prerequisites

- Node.js >= 18
- Bun 1.2.9 or later
- Docker and Docker Compose for local development

### Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the required services using Docker Compose:
   ```bash
   docker-compose up -d
   ```
   This will start:
   - PostgreSQL database on port 5432
   - Valkey (Redis-compatible) cache on port 6379
   - Grafana OTEL-LGTM monitoring stack on ports 3000, 4317, and 4318

4. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://neat_usr:neat_password@127.0.0.1:5432/neat_db
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_secret_key_here
   ```

### Development Workflow

1. Start the development server:
   ```bash
   bun run dev
   ```
   This will start the API server in watch mode on port 4000.

2. Build the project:
   ```bash
   bun run build
   ```

## Testing Information

### Running Tests

The project uses Bun's built-in test runner. To run tests:

```bash
# Run all tests
cd apps/api && bun test

# Run a specific test file
cd apps/api && bun test test/type.test.ts
```

### Writing Tests

1. Create test files in the `apps/api/test` directory with a `.test.ts` suffix
2. Use Bun's test API:

```typescript
import { describe, expect, test } from 'bun:test';
import { functionToTest } from '../src/path/to/file';

describe('functionToTest', () => {
  test('should do something', () => {
    const result = functionToTest(input);
    expect(result).toBe(expectedOutput);
  });
});
```

### Test Example

Here's a simple test for the `notEmpty` utility function:

```typescript
import { describe, expect, test } from 'bun:test';
import { notEmpty } from '../src/core/type';

describe('notEmpty', () => {
  test('should return true for non-null, non-undefined values', () => {
    expect(notEmpty('string')).toBe(true);
    expect(notEmpty(0)).toBe(true);
    expect(notEmpty(false)).toBe(true);
    expect(notEmpty({})).toBe(true);
    expect(notEmpty([])).toBe(true);
  });

  test('should return false for null or undefined values', () => {
    expect(notEmpty(null)).toBe(false);
    expect(notEmpty(undefined)).toBe(false);
  });
});
```

## Additional Development Information

### Project Structure

The project follows a monorepo structure using Turborepo:
- `apps/`: Contains applications
  - `api/`: The main API application
- `packages/`: Contains shared packages
- `modules/`: Contains domain modules

### Code Style and Architecture

1. **Clean Architecture**: The project follows clean architecture principles with clear separation of concerns:
   - `api/`: API routes and controllers
   - `application/`: Application use cases
   - `domain/`: Domain entities and business logic
   - `infra/`: Infrastructure concerns (repositories, external services)

2. **Functional Programming**: The project uses functional programming patterns:
   - `neverthrow` for Result types
   - `fp-ts` for Option types
   - Pure functions with explicit error handling

3. **API Framework**: The project uses Elysia as the web framework:
   - Routes are defined in `*route.ts` files
   - Middleware is used for cross-cutting concerns like authentication

### Error Handling

The project uses a structured approach to error handling:
- Domain errors are represented as specific exception classes
- Results are wrapped in `Result` or `ResultAsync` types from neverthrow
- Options are used for nullable values

### Database Access

- PostgreSQL is used as the database
- Kysely and Drizzle ORM are used for database access
- Migrations are handled using Umzug

### Caching

- Redis (via Valkey) is used for caching
- Session data and tokens are stored in Redis

### Observability

- OpenTelemetry is used for tracing
- Grafana OTEL-LGTM stack is used for monitoring
