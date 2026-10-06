import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.mongodb import connect_db, close_db
from app.db.indexes import create_all_indexes
from app.core.logging import logger


async def main():
    logger.info("Running index initialization script for SciRAG MongoDB Atlas...")
    db = await connect_db()
    if db is None:
        logger.error("Could not connect to MongoDB database.")
        return
    await create_all_indexes()
    await close_db()
    logger.info("Index setup complete.")


if __name__ == "__main__":
    asyncio.run(main())
