"""Tests for the FastAPI application."""

from fastapi.testclient import TestClient

from myclosetb_backend.main import app


client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_items_endpoint() -> None:
    response = client.get("/items/42")
    assert response.status_code == 200
    assert response.json()["item_id"] == 42


def test_metrics_endpoint() -> None:
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "requests_total" in response.text
