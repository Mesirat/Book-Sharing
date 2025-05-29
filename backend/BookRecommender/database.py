from pymongo import MongoClient

MONGO_URI = "mongodb+srv://mesiratbelete216:mesiratbelete@cluster0.nw0r1pz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "test"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_all_books():
    books = list(db["books"].find({}))
    print(f"📚 get_all_books: {len(books)} books found")
    return books

def get_user_liked_books(user_id):
    return list(db["likedbooks"].find({"userId": user_id}))

def get_user_search_logs(user_id, limit=20):
    pipeline = [
        {"$match": {"userId": user_id}},
        {"$unwind": "$logs"},
        {"$sort": {"logs.searchedAt": -1}},
        {"$limit": limit},
        {"$project": {"searchQuery": "$logs.searchQuery", "_id": 0}}
    ]
    results = db["searchlogs"].aggregate(pipeline)
    return [doc["searchQuery"] for doc in results]
