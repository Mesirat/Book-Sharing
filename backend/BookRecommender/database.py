import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_all_books():
    """Get all books in the books collection."""
    books = list(db["books"].find({}))
    print(f"📚 get_all_books: {len(books)} books found")
    return books

def get_user_liked_books(user_id):
    """
    Get liked books array for a specific user by user_id (string).
    Returns empty list if no liked books found or user doesn't exist.
    """
    try:
        user_obj_id = ObjectId(user_id)
    except Exception as e:
        print(f"Invalid user_id {user_id}: {e}")
        return []

    user_doc = db["likedbooks"].find_one({"_id": user_obj_id})
    if user_doc and "likedBooks" in user_doc:
        liked_books = user_doc["likedBooks"]
    else:
        liked_books = []
    
    return liked_books

def get_user_search_logs(user_id, limit=20):
    """
    Get recent search queries from the user's search logs.
    Returns a list of searchQuery strings ordered by searchedAt descending.
    """
    try:
        user_obj_id = ObjectId(user_id)
    except Exception as e:
        print(f"Invalid user_id {user_id}: {e}")
        return []

    pipeline = [
        {"$match": {"_id": user_obj_id}},
        {"$unwind": "$logs"},
        {"$sort": {"logs.searchedAt": -1}},
        {"$limit": limit},
        {"$project": {"searchQuery": "$logs.searchQuery", "_id": 0}},
    ]
    results = db["searchlogs"].aggregate(pipeline)
    search_queries = [doc["searchQuery"] for doc in results]
    
    return search_queries
