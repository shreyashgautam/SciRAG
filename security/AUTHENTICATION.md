# SciRAG Authentication Architecture

This document specifies the real authentication architecture implemented in the SciRAG backend.

---

## 1. Implemented Architecture
- **API Endpoints**:
  - `POST /api/v1/auth/register` (Account creation with hashed password)
  - `POST /api/v1/auth/login` (Credential validation, issues JWT access and refresh tokens)
  - `POST /api/v1/auth/refresh` (Issues fresh access token)
  - `GET /api/v1/auth/me` (Profile of authenticated researcher)
  - `POST /api/v1/auth/logout` (Session invalidation)
- **Token Mechanism**:
  - Standard JSON Web Tokens (JWT) signed via HMAC-SHA256 (`HS256`).
  - Access Token TTL: 30 minutes.
  - Refresh Token TTL: 7 days.
  - Payload contains `sub` (User ID), `email`, and `role`. Sensitive passwords and secrets are never embedded in tokens.
- **Password Protection**:
  - Encrypted using **Argon2id** and **Bcrypt** with salt rounds via `passlib[bcrypt,argon2]`.
- **Authorization Dependency**:
  - FastAPI dependency `get_current_user` extracts `Authorization: Bearer <token>`, validates signature and expiration, and retrieves user record.
  - Endpoints enforce `owner_id = current_user.id` to ensure absolute tenant isolation.
- **Frontend Storage & State**:
  - Tokens stored in browser secure local storage and dispatched via `ApiClient` Bearer headers.
  - Route guards protect `/dashboard`, `/library`, `/chat`, `/compare`, `/collections`, and `/settings`.
