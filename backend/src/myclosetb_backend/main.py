"""FastAPI application exposing health checks and metrics."""

from __future__ import annotations

import time
from typing import Dict

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, PlainTextResponse
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

from .config import settings
from .logging_config import configure_logging, get_logger
from .metrics import count_request, observe_latency

configure_logging(settings.log_level)

if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.environment,
        traces_sample_rate=settings.sentry_traces_sample_rate,
    )

app = FastAPI(title="MyclosetB Backend", version="0.1.0")

if settings.sentry_dsn:
    app.add_middleware(SentryAsgiMiddleware)

logger = get_logger(service="backend", environment=settings.environment)


@app.middleware("http")
async def log_and_measure_requests(request: Request, call_next):  # type: ignore[override]
    """Log incoming requests and collect Prometheus metrics."""

    start_time = time.perf_counter()
    logger.info("request.received", method=request.method, path=request.url.path)

    try:
        response = await call_next(request)
        return response
    except Exception as exc:  # pragma: no cover - forwarded to FastAPI exception handling
        logger.exception("request.failed", method=request.method, path=request.url.path)
        raise exc
    finally:
        duration = time.perf_counter() - start_time
        status_code = getattr(locals().get("response"), "status_code", 500)
        count_request(request.method, request.url.path, status_code)
        observe_latency(request.method, request.url.path, status_code, duration)
        logger.info(
            "request.completed",
            method=request.method,
            path=request.url.path,
            status_code=status_code,
            duration_ms=round(duration * 1000, 2),
        )


@app.get("/health", response_model=Dict[str, str])
def health() -> Dict[str, str]:
    """Expose a basic health check."""

    return {"status": "ok"}


@app.get("/metrics")
def metrics() -> PlainTextResponse:
    """Expose Prometheus metrics for scraping."""

    payload = generate_latest()
    return PlainTextResponse(payload, media_type=CONTENT_TYPE_LATEST)


@app.exception_handler(Exception)
async def handle_exceptions(_: Request, exc: Exception) -> JSONResponse:
    """Fallback exception handler that returns a structured error payload."""

    logger.error("request.exception", error=str(exc))
    return JSONResponse(status_code=500, content={"detail": "internal_server_error"})


@app.get("/items/{item_id}")
async def read_item(item_id: int) -> Dict[str, int]:
    """Return a payload with the requested item identifier."""

    logger.info("items.read", item_id=item_id)
    return {"item_id": item_id}
