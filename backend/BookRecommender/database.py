from pymongo import MongoClient
from bson import ObjectId

MONGO_URI = "mongodb+srv://mesiratbelete216:mesiratbelete@cluster0.nw0r1pz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "test"

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
    print(f"👍 get_user_liked_books({user_id}): {len(liked_books)} liked books found")
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
    print(f"🔎 get_user_search_logs({user_id}): {len(search_queries)} search queries found")
    return search_queries
