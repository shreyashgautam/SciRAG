import asyncio
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
from app.core.logging import logger

client: Optional[AsyncIOMotorClient] = None
database: Optional[AsyncIOMotorDatabase] = None
is_connected: bool = False


async def connect_db() -> Optional[AsyncIOMotorDatabase]:
    global client, database, is_connected
    if not settings.MONGODB_URI:
        logger.warning("MONGODB_URI not configured. Running in isolated fallback mode.")
        return None

    try:
        # Connect with 5-second timeout for graceful non-blocking startup
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        database = client[settings.MONGODB_DATABASE]
        # Ping the deployment
        await client.admin.command('ping')
        is_connected = True
        logger.info(f"Connected to MongoDB Atlas database: {settings.MONGODB_DATABASE}")
        return database
    except Exception as e:
        logger.warning(f"Could not connect to MongoDB ({e}). Backend will run with fallback handling.")
        is_connected = False
        return None


async def close_db():
    global client, database, is_connected
    if client:
        client.close()
        is_connected = False
        logger.info("MongoDB connection closed.")


def get_database() -> Optional[AsyncIOMotorDatabase]:
    return database


def get_collection(name: str):
    if database is not None and is_connected:
        return database[name]
    return None
