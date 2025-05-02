import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const API_URL = "http://localhost:5000";

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/books`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await axios.delete(`${API_URL}/admin/books/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  const handleEdit = (book) => {
    setEditingBook({ ...book });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/admin/books/${editingBook._id}`, editingBook, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      console.error("Error updating book:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Book Management</h2>

      {editingBook && (
        <div className="border p-4 mb-4 bg-gray-100 rounded">
          <h3 className="font-semibold text-lg mb-2">Edit Book</h3>
          {Object.entries(editingBook).map(([key, value]) => {
            if (["_id", "__v", "createdAt", "updatedAt"].includes(key)) return null;

            return (
              <div key={key} className="mb-2">
                <label className="block mb-1 font-medium">
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                </label>

                {Array.isArray(value) ? (
                  <input
                    type="text"
                    value={value.join(", ")}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        [key]: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, [key]: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                )}
              </div>
            );
          })}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleUpdate}
              className="px-4 py-1 bg-green-600 text-white rounded"
            >
              Update
            </button>
            <button
              onClick={() => setEditingBook(null)}
              className="px-4 py-1 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {books.map((book) => (
          <div
            key={book._id}
            className="border p-3 rounded shadow flex gap-4 items-start"
          >
            <img
              src={book.thumbnail || "/assets/default-thumbnail.jpg"}
              alt={book.title}
              className="w-28 h-36 object-cover rounded border"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p><strong>Authors:</strong> {book.authors?.join(", ") || "N/A"}</p>
              <p><strong>Publisher:</strong> {book.publisher}</p>
              <p><strong>Published Year:</strong> {book.publishedYear}</p>
              <p><strong>Description:</strong> {book.description}</p>
              <p><strong>Categories:</strong> {book.categories?.join(", ") || "None"}</p>
              <p><strong>Rating:</strong> {book.averageRating} ({book.ratingsCount} ratings)</p>
              <p><strong>Read Count:</strong> {book.readCount}</p>
              {book.pdfLink && (
                <Link
                to={`/readbook/${book._id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Read Now
              </Link>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(book)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookManager;
