# MyclosetB Architecture

## Overview
MyclosetB is organized as a full-stack JavaScript/TypeScript-ready platform built on top of an Express backend and a React frontend. The stack was chosen to maximize developer velocity, leverage a rich ecosystem of libraries, and share tooling (ESLint, EditorConfig) across the entire code base.

The repository is structured into three top-level workspaces:

- `backend/`: Node.js + Express REST API responsible for core business logic and integrations with future data stores.
- `frontend/`: React single-page application delivered via Vite for a fast local development experience and optimized production builds.
- `docs/`: Living documentation that captures architectural decisions, diagrams, and API contracts.

## Component Architecture
The following diagram summarizes the high-level component layout and runtime interactions.

```mermaid
flowchart LR
    subgraph Client
        Browser[Web Browser]
    end

    subgraph Frontend
        ReactApp[React SPA]\n(Vite)
    end

    subgraph Backend
        ExpressAPI[Express REST API]
        Auth[Authentication Module]
        Services[Domain Services]
    end

    subgraph Platform
        Queue[(Async Jobs)]
        Database[(Relational DB)]
    end

    Browser -->|HTTPS| ReactApp
    ReactApp -->|JSON over HTTPS| ExpressAPI
    ExpressAPI --> Auth
    ExpressAPI --> Services
    Services -->|SQL/ORM| Database
    Services -->|Publish Events| Queue
```

## Request Lifecycle
1. Users interact with the React application hosted in the browser.
2. The SPA calls the Express REST API via HTTPS using JSON payloads.
3. The API validates and authenticates requests (JWT or session tokens planned) before delegating to domain services.
4. Domain services orchestrate data persistence using a relational database (PostgreSQL planned) and publish events to asynchronous job queues for background processing.
5. Responses are returned to the SPA, where React updates the UI in real time.

## Integration Plan
- **Authentication**: Integrate Passport.js or a lightweight custom middleware backed by JWTs.
- **Database Layer**: Use Prisma ORM to manage PostgreSQL models, migrations, and type-safe queries.
- **Async Processing**: Adopt BullMQ (Redis-backed) queues for email notifications, media processing, and synchronization with external wardrobe services.
- **Frontend State Management**: Utilize React Query for server cache synchronization and context providers for UI state.

## Development Workflow
- Vite provides hot module replacement for the frontend; `npm run dev` in `frontend/` serves the app at `http://localhost:5173`.
- Express backend runs with `npm start` in `backend/`, defaulting to port `4000` and exposing a `/health` endpoint for monitoring.
- Shared linting rules ensure consistent formatting and code quality, while `.editorconfig` keeps indentation and newline rules aligned across editors.

## Deployment Targets
- **Frontend**: Built static assets can be served via a CDN (e.g., Cloudflare) or integrated into a containerized environment behind a reverse proxy.
- **Backend**: Containerized Node service deployed to Kubernetes or serverless platform with environment-specific configuration for database URLs and third-party integrations.

## Next Steps
1. Scaffold API routes for wardrobe management, outfit recommendations, and user profiles.
2. Introduce automated tests (Jest for backend, Vitest/React Testing Library for frontend).
3. Configure CI pipelines to run linting, tests, and build verification.
4. Define database schema migrations and seed scripts to bootstrap development environments.
