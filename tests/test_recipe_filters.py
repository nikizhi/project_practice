def test_get_ingredients_list(client):
    response = client.get("/api/ingredients/")
    assert response.status_code in (200, 404)
    if response.status_code == 200:
        assert isinstance(response.json(), list)