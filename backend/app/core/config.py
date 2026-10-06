import os
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "SciRAG"
    APP_ENV: str = "development"
    API_PREFIX: str = "/api/v1"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # MongoDB Atlas
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DATABASE: str = "scirag"

    # JWT Authentication
    JWT_SECRET: str = "scirag_dev_jwt_secret_change_in_production_key_32chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Grok / xAI API
    XAI_API_KEY: str = Field(default="", description="xAI API key for Grok models")
    XAI_BASE_URL: str = "https://api.x.ai/v1"
    XAI_MODEL: str = "grok-2-latest"

    # Cloudinary Storage
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    CLOUDINARY_UPLOAD_FOLDER: str = "scirag/papers"

    # Embedding & Reranker Models
    EMBEDDING_MODEL: str = "BAAI/bge-large-en-v1.5"
    RERANKER_MODEL: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    EMBEDDING_DIMENSION: int = 1024

    # GROBID Service URL
    GROBID_URL: str = "http://localhost:8070"

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    # Limits & Parameters
    MAX_UPLOAD_SIZE_MB: int = 25
    CHUNK_SIZE: int = 400
    CHUNK_OVERLAP: int = 50

    TOP_K_DENSE: int = 10
    TOP_K_BM25: int = 10
    TOP_K_HYBRID: int = 10
    TOP_K_RERANK: int = 5
    RERANK_THRESHOLD: float = 0.35

    MAX_AGENT_ITERATIONS: int = 3
    MAX_CONTEXT_TOKENS: int = 4000

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return ["http://localhost:3000"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
