# MyclosetB

[![CI](https://github.com/your-org/MyclosetB/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/MyclosetB/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](backend/tests)
[![Lint](https://img.shields.io/badge/lint-ruff%20%26%20eslint-blue.svg)](.github/workflows/ci.yml)
[![SAST](https://img.shields.io/badge/SAST-bandit%20%26%20npm%20audit-critical.svg)](.github/workflows/ci.yml)

A full-stack starter kit prepared for continuous integration, observability, and container-based deployments. The repository contains a FastAPI backend and a Vite + React frontend with consistent quality gates across linting, testing, coverage, and security analysis.

## Contents

- [Backend](#backend)
- [Frontend](#frontend)
- [Quality gates](#quality-gates)
- [Continuous integration](#continuous-integration)
- [Deployment](#deployment)
- [Environment variables](#environment-variables)
- [Monitoring and observability](#monitoring-and-observability)

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

The [`ci.yml`](.github/workflows/ci.yml) workflow orchestrates three jobs:

1. **Backend quality gates** – installs the FastAPI package, runs Ruff linting, executes the pytest suite under coverage, runs Bandit for SAST, and validates that the project builds wheels.
2. **Frontend quality gates** – installs npm dependencies, runs ESLint, executes Vitest with and without coverage, and builds the production bundle.
3. **Supabase schema lint** – provisions the Supabase CLI and runs `supabase db lint` against the SQL migrations stored in [`supabase/migrations/`](supabase/migrations/), ensuring pull requests never introduce invalid SQL.

Artifacts such as coverage details are emitted directly in the job logs, making it easy to track regressions from pull requests while keeping the database schema healthy.

## Deployment

Container-based deployment assets live in [`deploy/`](deploy/) and remain useful for smoke testing locally:

- `backend.Dockerfile` builds the FastAPI app and launches it with Uvicorn.
- `frontend.Dockerfile` compiles the React bundle and serves it through Nginx.
- `docker-compose.yml` wires both services together for local smoke tests or single-node deployments.
- `deploy.sh` provides a helper script that builds and starts the stack using Docker Compose (either the plugin or standalone binary).

### Managed Supabase project

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) locally and authenticate once with `supabase login`.
2. Link the repository to your hosted project: `supabase link --project-ref <your-project-ref>` (the reference is visible in the Supabase dashboard URL).
3. Push schema changes with `supabase db push` whenever new SQL files are committed to [`supabase/migrations/`](supabase/migrations/). This applies the migrations to your managed database.
4. Use `supabase db lint` locally before opening a pull request to catch issues early—the same command runs automatically in CI.
5. Review request logs and database activity in the Supabase dashboard under **Observability → Logs** to verify the deploy.

### Frontend hosting (Vercel or Netlify)

1. Create a new project from this repository in Vercel or Netlify.
2. Add the environment variables from [`.env.example`](.env.example)—specifically `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project (Project Settings → API)—plus any monitoring endpoints you rely on (e.g., `VITE_SENTRY_DSN`).
3. Configure the build command as `npm run build` and the publish directory as `frontend/dist`.
4. Trigger the first deploy; subsequent pushes to `main` (or the branch configured in your hosting provider) will redeploy automatically.

Backend APIs can remain on your preferred infrastructure (Docker Compose, Kubernetes, Fly.io, etc.)—just expose the base URL through `VITE_API_URL`.

## Environment variables

All configurable values are versioned in [`.env.example`](.env.example). Copy this file to `.env` and adjust per environment. Key variables include:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` – retrieved from Supabase **Project Settings → API** and required for the frontend client to talk to Supabase services.
- `VITE_SENTRY_DSN` and `VITE_METRICS_ENDPOINT` – optional observability integrations for browser telemetry.
- `VITE_API_URL` – base URL that proxies requests to the backend API when deployed to hosting platforms.

## Monitoring and observability

- **Supabase logs** – Managed projects expose query, auth, and storage logs directly in the Supabase dashboard. Use them to validate migrations (`supabase db push`) and monitor production incidents.
- **Structured logging** – Both backend (Structlog) and frontend (structured `console.info` calls) emit machine-readable logs to simplify log aggregation.
- **Error tracking** – The frontend initialises Sentry automatically via [`frontend/src/monitoring.js`](frontend/src/monitoring.js) when `VITE_SENTRY_DSN` is set, capturing errors and traces. The backend already supports Sentry through `BACKEND_SENTRY_DSN`.
- **Metrics** – Prometheus counters/histograms measure request rate and latency on the backend, while the frontend tracks page views and interactions with the option to stream them to a backend endpoint via the `VITE_METRICS_ENDPOINT` variable.

These building blocks let you plug the stack into a monitoring pipeline quickly while maintaining coverage, static analysis, security scanning, and database linting from the first commit.
