def test_fridge_and_matching(client, auth_headers, admin_auth_headers):
    ing_res = client.post(
        "/api/ingredients/",
        json={"name": "Картофель", "unit": "г", "category": "Овощи"},
        headers=admin_auth_headers
    )
    ing_id = ing_res.json()["id"]

    inv_res = client.post(
        "/api/inventory/",
        json={"ingredient_id": ing_id, "amount": 500},
        headers=auth_headers
    )
    assert inv_res.status_code == 201

    recipe_res = client.post(
        "/api/recipes/",
        json={
            "title": "Жареная картошка",
            "description": "Просто и вкусно",
            "instructions": "Пожарить картошку",
            "cooking_time_minutes": 20,
            "ingredients": [{"ingredient_id": ing_id, "amount": 300}]
        },
        headers=admin_auth_headers
    )
    assert recipe_res.status_code == 201

    match_res = client.get("/api/match/my-fridge", headers=auth_headers)
    assert match_res.status_code == 200
    matches = match_res.json()
    assert len(matches) > 0
    assert matches[0]["match_percentage"] == 100.0