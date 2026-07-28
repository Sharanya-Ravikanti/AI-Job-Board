import uuid

from fastapi.testclient import TestClient

from app.main import app


def test_user_registration_and_login():
    client = TestClient(app)
    unique_suffix = uuid.uuid4().hex[:8]
    payload = {
        "username": f"tester_{unique_suffix}",
        "email": f"tester_{unique_suffix}@example.com",
        "password": "StrongPass123!",
    }

    register_response = client.post("/api/auth/register", json=payload)
    assert register_response.status_code == 201, register_response.text

    login_response = client.post(
        "/api/auth/login",
        json={"username": payload["username"], "password": payload["password"]},
    )
    assert login_response.status_code == 200, login_response.text
    assert "access_token" in login_response.json()
