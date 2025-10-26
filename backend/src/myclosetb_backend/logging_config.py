"""Logging helpers for the backend service."""

from __future__ import annotations

import logging
from typing import Any, Dict

import structlog


def configure_logging(level: str = "INFO") -> None:
    """Configure structlog and the standard logging module."""

    timestamper = structlog.processors.TimeStamper(fmt="iso")

    shared_processors = [
        timestamper,
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
    ]

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            *shared_processors,
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(getattr(logging, level.upper(), 20)),
        cache_logger_on_first_use=True,
    )

    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(message)s",
    )


def get_logger(**context: Dict[str, Any]) -> structlog.BoundLogger:
    """Return a structured logger with contextual information bound to it."""

    logger = structlog.get_logger()
    if context:
        return logger.bind(**context)
    return logger
