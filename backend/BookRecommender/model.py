import os
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
model_data = {}

def train_model(books):
    global model_data

    print(f"📚 Training model on {len(books)} books")

    corpus = []
    book_id_to_index = {}
    index_to_book_id = {}

    for book in books:
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

def recommend(liked_books, search_terms, top_k=10, model_data=model_data):
    if not model_data:
        print("⚠️ Model not loaded or trained")
        return []

    vectorizer = model_data["vectorizer"]
    knn_model = model_data["knn_model"]
    embeddings = model_data["embeddings_matrix"]
    book_id_to_index = model_data["book_id_to_index"]
    index_to_book_id = model_data["index_to_book_id"]

    # Get indices of liked books in embedding matrix
    liked_indices = [book_id_to_index.get(str(book["bookId"])) for book in liked_books if str(book["bookId"]) in book_id_to_index]
    liked_indices = [i for i in liked_indices if i is not None]

    liked_vectors = embeddings[liked_indices] if liked_indices else None

    search_query_vector = None
    if search_terms:
        query_text = " ".join(search_terms)
        try:
            search_query_vector = vectorizer.transform([query_text])
        except Exception as e:
            print(f"❌ Search vectorizer transform failed: {e}")

    combined_vector = None
    if liked_vectors is not None and search_query_vector is not None:
        combined_vector = (liked_vectors.mean(axis=0) + search_query_vector) / 2
    elif liked_vectors is not None:
        combined_vector = liked_vectors.mean(axis=0)
    elif search_query_vector is not None:
        combined_vector = search_query_vector
    else:
        print("⚠️ No liked books or search queries available for recommendation.")
        return []

    # Convert combined_vector from sparse matrix to numpy ndarray (2D array)
    combined_vector = combined_vector.toarray() if hasattr(combined_vector, "toarray") else combined_vector
    combined_vector = np.asarray(combined_vector)

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
        
    else:
        print("⚠️ Model file not found. Training required.")
