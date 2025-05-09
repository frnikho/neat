# Contributing to Neat Project

Thank you for considering contributing to the Neat Project! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js >= 18
- Bun 1.2.9 or later
- Docker and Docker Compose

### Development Environment Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/neat.git
   cd neat
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Start the required services:
   ```bash
   docker-compose up -d
   ```
5. Create a `.env` file with the necessary environment variables (see README.md)
6. Start the development server:
   ```bash
   bun run dev
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/issue-you-are-fixing
   ```

2. Make your changes following the coding standards and architecture guidelines

3. Write tests for your changes

4. Run tests to ensure everything works:
   ```bash
   cd apps/api && bun test
   ```

5. Commit your changes with a descriptive commit message

6. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a Pull Request from your fork to the main repository

## Coding Standards

### Architecture

The project follows clean architecture principles with clear separation of concerns:
- `api/`: API routes and controllers
- `application/`: Application use cases
- `domain/`: Domain entities and business logic
- `infra/`: Infrastructure concerns (repositories, external services)

### Functional Programming

We use functional programming patterns:
- Use `neverthrow` for Result types
- Use `fp-ts` for Option types
- Write pure functions with explicit error handling
- Avoid side effects in domain logic

### Naming Conventions

- Use descriptive names for variables, functions, and classes
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use kebab-case for file names

### File Organization

- Place files in the appropriate directories according to the clean architecture principles
- Group related files together
- Keep files focused on a single responsibility

## Testing Guidelines

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

### Test Coverage

- Aim for high test coverage, especially for domain logic
- Write unit tests for individual functions and components
- Write integration tests for API endpoints

## Pull Request Process

1. Ensure your code follows the coding standards
2. Update the documentation if necessary
3. Include tests for your changes
4. Ensure all tests pass
5. Your PR will be reviewed by maintainers, who may request changes
6. Once approved, your PR will be merged

## Reporting Bugs

When reporting bugs, please include:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Any relevant logs or error messages
- Your environment (OS, Node.js version, Bun version, etc.)

## Feature Requests

When suggesting features, please include:
- A clear and descriptive title
- A detailed description of the proposed feature
- Any relevant examples or use cases
- If possible, an implementation approach

## Documentation

- Keep documentation up-to-date
- Document public APIs and important functions
- Use JSDoc comments for code documentation

## License

By contributing to this project, you agree that your contributions will be licensed under the project's license.