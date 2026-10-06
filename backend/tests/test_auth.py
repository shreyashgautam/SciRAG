import pytest
from app.core.security import create_access_token, decode_token, get_password_hash, verify_password


def test_password_hashing():
    raw = "scientific_secret_password_123"
    hashed = get_password_hash(raw)
    assert hashed != raw
    assert verify_password(raw, hashed) is True
    assert verify_password("wrong_password", hashed) is False


def test_jwt_generation_and_decoding():
    payload = {"sub": "usr-test-123", "email": "researcher@university.edu", "role": "user"}
    token = create_access_token(payload)
    assert isinstance(token, str)
    decoded = decode_token(token)
    assert decoded is not None
    assert decoded["sub"] == "usr-test-123"
    assert decoded["email"] == "researcher@university.edu"
    assert decoded["type"] == "access"
