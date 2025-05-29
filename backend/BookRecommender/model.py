import os
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
from bson import ObjectId

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
model_data = {}

def train_model(books):
    global model_data

    print(f"📚 Training model on {len(books)} books")

    corpus, book_id_to_index, index_to_book_id = [], {}, {}

    for i, book in enumerate(books):
        text = f"{book.get('title', '')} {book.get('description', '')}".strip()
        if text:
            corpus.append(text)
            book_id = str(book["_id"])
            book_id_to_index[book_id] = len(corpus) - 1
            index_to_book_id[len(corpus) - 1] = book_id

    if not corpus:
        print("⚠️ No text data to train on.")
        return

    vectorizer = TfidfVectorizer(max_features=220)
    embeddings = vectorizer.fit_transform(corpus)

    knn = NearestNeighbors(metric="cosine", algorithm="brute")
    knn.fit(embeddings)

    model_data = {
        "vectorizer": vectorizer,
        "knn_model": knn,
        "embeddings_matrix": embeddings,
        "book_id_to_index": book_id_to_index,
        "index_to_book_id": index_to_book_id
    }

    save_model()

def recommend(liked_books, search_terms, top_k=10):
    if not model_data:
        return []

    vectorizer = model_data["vectorizer"]
    knn_model = model_data["knn_model"]
    embeddings = model_data["embeddings_matrix"]
    book_id_to_index = model_data["book_id_to_index"]
    index_to_book_id = model_data["index_to_book_id"]

    liked_indices = [book_id_to_index.get(str(book["bookId"])) for book in liked_books if str(book["bookId"]) in book_id_to_index]
    liked_indices = [i for i in liked_indices if i is not None]

    liked_vectors = embeddings[liked_indices] if liked_indices else None

    search_query_vector = None
    if search_terms:
        query_text = " ".join(search_terms)
        try:
            search_query_vector = vectorizer.transform([query_text])
        except:
            pass

    combined_vector = None
    if liked_vectors is not None and search_query_vector is not None:
        combined_vector = (liked_vectors.mean(axis=0) + search_query_vector) / 2
    elif liked_vectors is not None:
        combined_vector = liked_vectors.mean(axis=0)
    elif search_query_vector is not None:
        combined_vector = search_query_vector
    else:
        return []

    distances, indices = knn_model.kneighbors(combined_vector, n_neighbors=top_k + 5)
    recommendations = [index_to_book_id[i] for i in indices[0]]
    return recommendations

def save_model():
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model_data, f)
    print(f"✅ Model saved with {model_data['embeddings_matrix'].shape[0]} books")

def load_model():
    global model_data
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            model_data = pickle.load(f)
        print(f"✅ Loaded model with {model_data['embeddings_matrix'].shape[0]} books")
    else:
        print("⚠️ Model file not found. Training required.")
