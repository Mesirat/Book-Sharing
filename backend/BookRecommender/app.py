from flask import Flask, jsonify
from flask_cors import CORS
from bson import ObjectId
import model  # your ML model module
from database import get_all_books, get_user_liked_books, get_user_search_logs, db
from watcher import start_watcher

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

@app.route("/", methods=["GET"])
def health():
    return "✅ Hybrid Book Recommendation API is running."

@app.route("/recommend/<user_id>", methods=["GET"])
def recommend_route(user_id):
    try:
        if not model.model_data:
            return jsonify({"message": "Model not trained yet."}), 500

        liked_books = get_user_liked_books(user_id)
        search_terms = get_user_search_logs(user_id)

        print(f"👍 User {user_id} liked books:", liked_books)
        print(f"🔎 User {user_id} search logs:", search_terms)

        liked_book_ids = [str(book.get("bookId")) for book in liked_books if "bookId" in book]

        recommended_ids = model.recommend(liked_books, search_terms, model_data=model.model_data)
        if not recommended_ids:
            print("⚠️ No recommendations found.")
            return jsonify([])

        # Remove liked books from the recommendations
        recommended_ids = [bid for bid in recommended_ids if bid not in liked_book_ids]

        try:
            object_ids = [ObjectId(bid) for bid in recommended_ids]
        except Exception as e:
            print("❌ Invalid ObjectId in recommended_ids:", e)
            return jsonify([])

        books = list(db["books"].find({"_id": {"$in": object_ids}}))
        books_map = {str(book["_id"]): book for book in books}

        result = []
        for bid in recommended_ids:
            book = books_map.get(bid)
            if book:
                result.append({
                    "bookId": bid,
                    "title": book.get("title", ""),
                    "authors": book.get("authors", []),
                    "thumbnail": book.get("thumbnail", ""),
                    "description": book.get("description", "")
                })

        return jsonify(result)

    except Exception as e:
        import traceback
        traceback.print_exc()
        print("❌ Recommendation Error:", e)
        return jsonify({"message": str(e)}), 500


if __name__ == "__main__":
    try:
        model.load_model()
    except Exception as e:
        print(f"❌ Load model failed: {e}")

    if not model.model_data:
        books = get_all_books()
        model.train_model(books)

    start_watcher()
    app.run(host="127.0.0.1", port=8000, debug=True, use_reloader=False)
