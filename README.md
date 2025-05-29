# Neat Project

A modern, clean architecture backend API built with Elysia and NextJS.



## Features

- **Clean Architecture**: Clear separation of concerns with domain-driven design
- **Functional Programming**: Using fp-ts and neverthrow for robust error handling
- **High Performance**: Built with Bun runtime for optimal performance
- **Observability**: Integrated with OpenTelemetry for comprehensive monitoring
- **Type Safety**: Fully typed with TypeScript
- **Database Access**: Using Kysely and Drizzle ORM for type-safe database operations
- **Caching**: Redis-based caching for improved performance
- **Authentication**: JWT-based authentication system

## Prerequisites

- Node.js >= 18
- Bun 1.2.9 or later
- Docker and Docker Compose for local development

## Getting Started

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/neat.git
   cd neat
   ```

2. Install dependencies
   ```bash
   bun install
   ```

3. Start the required services using Docker Compose
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

### Development

Start the development server:
```bash
bun run dev
```

This will start the API server in watch mode on port 4000.

### Building

Build the project:
```bash
bun run build
```

## Testing

The project uses Bun's built-in test runner:

```bash
# Run all tests
cd apps/api && bun test

# Run a specific test file
cd apps/api && bun test test/type.test.ts
```

## Project Structure

The project follows a monorepo structure using Turborepo:
- `apps/`: Contains applications
  - `api/`: The main API application
  - `front/`: The frontend application
- `packages/`: Contains shared packages
- `modules/`: Contains domain modules

## Architecture

### Clean Architecture

The project follows clean architecture principles with clear separation of concerns:
- `api/`: API routes and controllers
- `application/`: Application use cases
- `domain/`: Domain entities and business logic
- `infra/`: Infrastructure concerns (repositories, external services)

### Functional Programming

The project uses functional programming patterns:
- `neverthrow` for Result types
- `fp-ts` for Option types
- Pure functions with explicit error handling

### API Framework

The project uses Elysia as the web framework:
- Routes are defined in `*route.ts` files
- Middleware is used for cross-cutting concerns like authentication

## Error Handling

The project uses a structured approach to error handling:
- Domain errors are represented as specific exception classes
- Results are wrapped in `Result` or `ResultAsync` types from neverthrow
- Options are used for nullable values

## Database Access

- PostgreSQL is used as the database
- Kysely and Drizzle ORM are used for database access
- Migrations are handled using Umzug

## Caching

- Redis (via Valkey) is used for caching
- Session data and tokens are stored in Redis

## Observability

- OpenTelemetry is used for tracing
- Grafana OTEL-LGTM stack is used for monitoring

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
