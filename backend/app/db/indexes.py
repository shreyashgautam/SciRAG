from app.db.mongodb import get_database
from app.core.logging import logger


async def create_all_indexes():
    db = get_database()
    if db is None:
        logger.warning("Skipping index creation: MongoDB not connected.")
        return

    try:
        # Users indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("created_at")

        # Papers indexes
        await db.papers.create_index([("owner_id", 1), ("created_at", -1)])
        await db.papers.create_index("status")
        await db.papers.create_index("doi")

        # Chunks indexes (Crucial for fast scoped retrieval and user isolation)
        await db.chunks.create_index([("owner_id", 1), ("paper_id", 1)])
        await db.chunks.create_index("chunk_index")

        # Collections indexes
        await db.collections.create_index([("owner_id", 1), ("name", 1)])

        # Conversations & Messages indexes
        await db.conversations.create_index([("user_id", 1), ("updated_at", -1)])
        await db.messages.create_index([("conversation_id", 1), ("created_at", 1)])

        # Citations indexes
        await db.citations.create_index([("paper_id", 1), ("page", 1)])

        # Research Jobs
        await db.research_jobs.create_index([("user_id", 1), ("paper_id", 1)])

        # Evaluations
        await db.evaluation_results.create_index([("user_id", 1), ("created_at", -1)])

        logger.info("Successfully created all required MongoDB indexes.")
    except Exception as e:
        logger.error(f"Error creating MongoDB indexes: {e}")
