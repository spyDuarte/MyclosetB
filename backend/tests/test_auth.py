import pytest


@pytest.mark.asyncio
async def test_register_and_login(client):
    response = await client.post(
        "/api/auth/register",
        json={"email": "user@example.com", "password": "secret", "full_name": "Test User"},
    )
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["email"] == "user@example.com"
    assert "id" in data

    token_response = await client.post(
        "/api/auth/token",
        data={"username": "user@example.com", "password": "secret"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert token_response.status_code == 200, token_response.text
    token_data = token_response.json()
    assert token_data["token_type"] == "bearer"
    assert "access_token" in token_data

    me_response = await client.get(
        "/api/auth/me", headers={"Authorization": f"Bearer {token_data['access_token']}"}
    )
    assert me_response.status_code == 200
    me_data = me_response.json()
    assert me_data["email"] == "user@example.com"
