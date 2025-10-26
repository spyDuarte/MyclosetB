# MyclosetB Backend

This package exposes a small FastAPI service instrumented with structured logging, Sentry error tracking, and Prometheus metrics. It is packaged as an installable Python distribution so that CI can build wheels and reuse the resulting artifacts when deploying.

## Development

```bash
pip install -e .[dev]
uvicorn myclosetb_backend.main:app --reload
```

Run the automated quality gates with:

```bash
ruff check src tests
coverage run -m pytest
bandit -r src/myclosetb_backend
```
