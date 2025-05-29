import pickle

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

print("Keys in model:", list(model.keys()))

knn_model = model.get("knn_model")
print("KNN model type:", type(knn_model))

vectorizer = model.get("vectorizer")
print("Vectorizer type:", type(vectorizer))

embeddings_matrix = model.get("embeddings_matrix")
print("Embeddings matrix shape:", embeddings_matrix.shape if embeddings_matrix is not None else None)

book_id_to_index = model.get("book_id_to_index")
print(f"Number of books in model: {len(book_id_to_index)}")

# Example: print first 3 book IDs and their indices
for i, (book_id, idx) in enumerate(book_id_to_index.items()):
    print(f"Book ID: {book_id}, Index: {idx}")
    if i >= 29:
        break
