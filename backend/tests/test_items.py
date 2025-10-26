import pytest


async def register_and_login(client):
    await client.post(
        "/api/auth/register",
        json={"email": "user@example.com", "password": "secret", "full_name": "Test User"},
    )
    token_response = await client.post(
        "/api/auth/token",
        data={"username": "user@example.com", "password": "secret"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token_response.raise_for_status()
    token_data = token_response.json()
    return token_data["access_token"], {"Authorization": f"Bearer {token_data['access_token']}"}


@pytest.mark.asyncio
async def test_item_crud_and_suggestions(client):
    token, headers = await register_and_login(client)

    create_response = await client.post(
        "/api/items/",
        json={"name": "Jaqueta", "category": "Outerwear", "color": "Azul", "season": "Inverno"},
        headers=headers,
    )
    assert create_response.status_code == 201, create_response.text
    item_id = create_response.json()["id"]

    create_response_2 = await client.post(
        "/api/items/",
        json={"name": "Calça", "category": "Bottom", "color": "Azul", "season": "Inverno"},
        headers=headers,
    )
    assert create_response_2.status_code == 201

    list_response = await client.get("/api/items/", headers=headers)
    assert list_response.status_code == 200
    items = list_response.json()
    assert len(items) == 2

    suggestions = await client.get(f"/api/items/{item_id}/suggestions", headers=headers)
    assert suggestions.status_code == 200
    suggestion_items = suggestions.json()
    assert len(suggestion_items) == 1
    assert suggestion_items[0]["name"] == "Calça"
