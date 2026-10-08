def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data


def test_register_existing_email(client):
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "password123"}
    )
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "anotherpassword"}
    )
    assert response.status_code == 400


def test_login_user(client):
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "password123"}
    )
    response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"