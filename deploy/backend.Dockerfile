FROM python:3.11-slim AS base

WORKDIR /app

COPY backend/pyproject.toml backend/README.md ./
COPY backend/src ./src

RUN pip install --upgrade pip && \
    pip install .[dev]

COPY backend/tests ./tests

CMD ["uvicorn", "myclosetb_backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
