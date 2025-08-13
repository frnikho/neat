# NEAT - Modern Fullstack Application

NEAT is a fullstack application built with a modern tech stack including Bun, Elysia, React, and TypeScript, organized as a monorepo using Turborepo.

## Project Structure

The project is organized as a monorepo with the following key components:

```
├── apps/
│ ├── api/ - Backend API built with Elysia and Bun
│ └── web/ - Frontend built with React and Vite
├── packages/
│ ├── api-client/ - Type-safe API client
│ └── types/ - Shared TypeScript types
├── .github/ - GitHub workflows
└── docker-compose.yml - Local development infrastructure
```


## Tech Stack

### Backend (API)
- **Runtime**: Bun
- **Framework**: Elysia
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Cache**: Redis (Valkey)
- **Authentication**: JWT
- **File Storage**: S3-compatible

### Frontend (Web)
- **Framework**: React 19
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **Form Handling**: TanStack Form
- **Animation**: Framer Motion

## Features

### Core Functionality
- User authentication (login/register)
- Role-based access control
- File uploads and management
- Application settings system
- Dashboard with responsive sidebar

### Technical Highlights
- Type-safe API client
- Monorepo architecture with Turborepo
- Dockerized deployment
- CI/CD workflows
- Comprehensive error handling
- Database migrations

## Getting Started

### Prerequisites
- Bun v1.2.19+
- Docker
- PostgreSQL
- Redis

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

### Development
Start all services:
```bash
bun run dev
```

This will:

- Start the API server
- Start the web frontend
- Watch and build Tailwind CSS
