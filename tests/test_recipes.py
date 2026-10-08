def test_get_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to RecipeGeni API" in response.json()["message"]


def test_lifespan_ingredients_seeding(client):
    response = client.get("/api/ingredients/")
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data, list)