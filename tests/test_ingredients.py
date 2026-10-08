def test_get_ingredients_public(client):
    response = client.get("/api/ingredients/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_ingredient_admin_only(client, auth_headers, admin_auth_headers):
    payload = {"name": "Томат", "unit": "шт", "category": "Овощи"}

    res_user = client.post("/api/ingredients/", json=payload, headers=auth_headers)
    assert res_user.status_code == 403

    res_admin = client.post("/api/ingredients/", json=payload, headers=admin_auth_headers)
    assert res_admin.status_code == 201
    assert res_admin.json()["name"] == "Томат"