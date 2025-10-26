#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required to run this deployment script" >&2
  exit 1
fi

if ! command -v docker-compose >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose is required to run this deployment script" >&2
  exit 1
fi

cd "$PROJECT_ROOT/deploy"

if docker compose version >/dev/null 2>&1; then
  docker compose build
  docker compose up -d
else
  docker-compose build
  docker-compose up -d
fi

echo "Deployment started. Backend available on http://localhost:8000 and frontend on http://localhost:3000."
