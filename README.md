# MyclosetB

[![CI](https://github.com/your-org/MyclosetB/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/MyclosetB/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](backend/tests)
[![Lint](https://img.shields.io/badge/lint-ruff%20%26%20eslint-blue.svg)](.github/workflows/ci.yml)
[![SAST](https://img.shields.io/badge/SAST-bandit%20%26%20npm%20audit-critical.svg)](.github/workflows/ci.yml)

A full-stack starter kit prepared for continuous integration, observability, and container-based deployments. The repository contains a FastAPI backend and a Vite + React frontend with consistent quality gates across linting, testing, coverage, and security analysis.

## Contents

- [Scope](#scope)
- [Roadmap](#roadmap)
- [User stories](#user-stories)
- [Supabase considerations](#supabase-considerations)
- [Backend](#backend)
- [Frontend](#frontend)
- [Quality gates](#quality-gates)
- [Continuous integration](#continuous-integration)
- [Deployment](#deployment)
- [Environment variables](#environment-variables)
- [Monitoring and observability](#monitoring-and-observability)

## Scope

MyclosetB pairs a Vite-powered React frontend with Supabase-managed services to deliver a cohesive wardrobe management experienc
e.

- **Presentation layer:** React (TypeScript) is responsible for all web-facing experiences, including wardrobe dashboards, item 
creation forms, and media galleries.
- **Backend services:** Supabase provides Postgres for persistent storage, Row Level Security-backed Auth for sign-in/sign-up f
lows, and Storage buckets for handling garment imagery and other assets.
- **API integration:** The existing FastAPI service focuses on orchestration, domain-specific logic, and any integrations requi
ring custom server-side functionality that sits alongside Supabase-managed capabilities.

## Roadmap

1. Model wardrobe entities (users, items, outfits, media assets) in Supabase Postgres and expose typed client hooks in the Reac
   t app.
2. Implement Supabase Auth flows (email/password and OAuth providers) with React context handling session refresh and protected 
   routes.
3. Deliver CRUD operations for wardrobe items, leveraging Supabase Row Level Security policies for tenant isolation.
4. Integrate Supabase Storage for image uploads from the React UI, including responsive rendering and cache-friendly URLs.
5. Validate this document and the proposed Supabase-centric stack with the broader product, design, and engineering stakeholders
   to confirm consensus before advancing to execution.

## User stories

- **Authentication:** As a registered user, I want to log in with Supabase Auth so that my wardrobe data stays private and my se
  ssion can persist securely across devices.
- **Wardrobe management:** As a stylist, I want to create, update, and delete clothing items stored in Supabase Postgres so that
  my inventory always reflects the latest catalog.
- **Media handling:** As a user, I want to upload outfit photos to Supabase Storage from the React interface so that each wardro
  be item has rich visual context.

## Supabase considerations

**Advantages**

- Unified platform covering Postgres, Auth, and Storage reduces operational overhead and accelerates initial delivery.
- Native JavaScript client SDK integrates smoothly with React, enabling real-time updates and simplified session management.
- Built-in security primitives (Row Level Security, policies, Auth hooks) provide granular access control without bespoke infrast
  ructure.

**Potential limitations**

- Multi-region availability and custom networking options may lag behind bespoke cloud deployments, impacting organizations with
  strict residency requirements.
- Storage egress and invocation costs can rise with high-volume media usage, necessitating monitoring and potential CDN strategi
  es.
- Some advanced database extensions or complex migration workflows might require workarounds compared to managing Postgres dire
  ctly.

## Backend

Located under [`backend/`](backend/), the FastAPI service ships with:

- Structured JSON logging powered by `structlog`.
- Automatic Sentry instrumentation (errors and traces) when `BACKEND_SENTRY_DSN` is set.
- Built-in Prometheus counters and histograms exposed from `/metrics` for traffic and latency analysis.
- Unit tests executed with `pytest` and coverage reporting managed by `coverage.py`.

Run the service locally:

```bash
cd backend
pip install -e .[dev]
uvicorn myclosetb_backend.main:app --reload
```

Execute quality checks:

```bash
ruff check src tests
coverage run -m pytest
coverage report
bandit -r src/myclosetb_backend -ll
```

## Frontend

The frontend in [`frontend/`](frontend/) is a Vite-powered React app wired for monitoring and automated testing.

- Sentry browser SDK initialised via environment variables.
- Structured console breadcrumbs for user interactions and optional metrics export via `navigator.sendBeacon`.
- Linting handled by ESLint (`standard` configuration) and unit tests executed by Vitest with coverage reports.

Local development workflow:

```bash
cd frontend
npm install
npm run dev
```

Quality gates:

```bash
npm run lint
npm run test
npm run coverage
npm run build
```

## Quality gates

| Area                | Backend command                                 | Frontend command            |
| ------------------- | ------------------------------------------------ | --------------------------- |
| Lint                | `ruff check src tests`                           | `npm run lint`              |
| Tests               | `coverage run -m pytest`                         | `npm run test`              |
| Coverage report     | `coverage report`                                | `npm run coverage`          |
| Static security     | `bandit -r src/myclosetb_backend -ll`            | `npm audit --audit-level=high` (run locally) |
| Build               | `python -m build`                                | `npm run build`             |

## Continuous integration

The [`ci.yml`](.github/workflows/ci.yml) workflow orchestrates two jobs:

1. **Backend quality gates** – installs the FastAPI package, runs Ruff linting, executes the pytest suite under coverage, runs Bandit for SAST, and validates that the project builds wheels.
2. **Frontend quality gates** – installs npm dependencies, runs ESLint, executes Vitest with coverage reporting, and builds the production bundle.

Artifacts such as coverage details are emitted directly in the job logs, making it easy to track regressions from pull requests.

## Deployment

Container-based deployment assets live in [`deploy/`](deploy/):

- `backend.Dockerfile` builds the FastAPI app and launches it with Uvicorn.
- `frontend.Dockerfile` compiles the React bundle and serves it through Nginx.
- `docker-compose.yml` wires both services together for local smoke tests or single-node deployments.
- `deploy.sh` provides a helper script that builds and starts the stack using Docker Compose (either the plugin or standalone binary).

To launch locally:

```bash
cp .env.example .env
cd deploy
./deploy.sh
```

Once running, the backend is available on <http://localhost:8000> and the frontend on <http://localhost:3000>. Adapt these Dockerfiles for your chosen cloud platform (e.g., GitHub Container Registry + AWS ECS, Fly.io, or Azure Container Apps).

## Supabase database & auth

Database migrations, row level security (RLS) policies, and RPC helpers live under [`supabase/migrations/`](supabase/migrations/).
Run them locally with the Supabase CLI:

```bash
supabase start
supabase db reset
supabase db execute --file supabase/tests/schema_validation.sql
```

Authentication is handled via Supabase Auth (email login plus optional social providers). Role claims in the JWT govern privileged
operations (for example, managing global categories). Refer to [`docs/backend/supabase-auth.md`](docs/backend/supabase-auth.md) for
expected claims, default roles, and manual test procedures.

## Environment variables

All configurable values are versioned in [`.env.example`](.env.example). Copy this file to `.env` and adjust per environment. Key variables include Sentry DSNs, log levels, and optional metric ingestion endpoints for the frontend.

## Monitoring and observability

- **Structured logging** – Both backend (Structlog) and frontend (structured `console.info` calls) emit machine-readable logs to simplify log aggregation.
- **Error tracking** – Sentry is initialised automatically in both tiers when DSNs are provided, capturing exceptions and performance traces.
- **Metrics** – Prometheus counters/histograms measure request rate and latency on the backend, while the frontend tracks page views and interactions with the option to stream them to a backend endpoint via the `VITE_METRICS_ENDPOINT` variable.

These building blocks let you plug the stack into a monitoring pipeline quickly while maintaining coverage, static analysis, and security scanning from the first commit.
