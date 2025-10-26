import pytest


async def auth_headers(client):
    await client.post(
        "/api/auth/register",
        json={"email": "user@example.com", "password": "secret", "full_name": "Graph User"},
    )
    token_response = await client.post(
        "/api/auth/token",
        data={"username": "user@example.com", "password": "secret"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token_response.raise_for_status()
    token = token_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_outfit_event_flow_and_graphql(client):
    headers = await auth_headers(client)

    item_a = await client.post(
        "/api/items/",
        json={"name": "Camisa", "category": "Top", "color": "Branco", "season": "Verão"},
        headers=headers,
    )
    item_b = await client.post(
        "/api/items/",
        json={"name": "Saia", "category": "Bottom", "color": "Azul", "season": "Verão"},
        headers=headers,
    )
    item_a_id = item_a.json()["id"]
    item_b_id = item_b.json()["id"]

    outfit_resp = await client.post(
        "/api/outfits/",
        json={"name": "Look Praia", "description": "Ideal para praia", "item_ids": [item_a_id, item_b_id]},
        headers=headers,
    )
    assert outfit_resp.status_code == 201
    outfit_id = outfit_resp.json()["id"]

    event_resp = await client.post(
        "/api/events/",
        json={
            "name": "Festa na Praia",
            "event_type": "Praia",
            "date": "2024-03-10",
            "outfit_ids": [outfit_id],
        },
        headers=headers,
    )
    assert event_resp.status_code == 201

    recommendations = await client.get("/api/events/recommendations/Praia", headers=headers)
    assert recommendations.status_code == 200
    assert len(recommendations.json()) >= 1

    graphql_query = {
        "query": "{ me { email outfits { name items { name } } events { name eventType } } }"
    }
    graphql_response = await client.post("/graphql", json=graphql_query, headers=headers)
    assert graphql_response.status_code == 200
    body = graphql_response.json()
    assert body["data"]["me"]["email"] == "user@example.com"
    assert body["data"]["me"]["outfits"][0]["name"] == "Look Praia"
