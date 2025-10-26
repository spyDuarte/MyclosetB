"""Metrics helpers for the backend service."""

from prometheus_client import Counter, Histogram

from .config import settings

REQUEST_COUNTER = Counter(
    "requests_total",
    "Total number of HTTP requests handled",
    ["app", "method", "path", "status_code"],
)

REQUEST_LATENCY = Histogram(
    "request_duration_seconds",
    "Time spent processing requests",
    ["app", "method", "path", "status_code"],
)

APP_LABEL = {"app": settings.metrics_namespace}


def count_request(method: str, path: str, status_code: int) -> None:
    """Increment the request counter with the provided labels."""

    REQUEST_COUNTER.labels(method=method, path=path, status_code=str(status_code), **APP_LABEL).inc()


def observe_latency(method: str, path: str, status_code: int, duration_seconds: float) -> None:
    """Observe how long a request took to process."""

    REQUEST_LATENCY.labels(
        method=method,
        path=path,
        status_code=str(status_code),
        **APP_LABEL,
    ).observe(duration_seconds)
