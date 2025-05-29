import { useEffect, useState } from "react";
import api from "../../Services/api";
import { Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useAuthStore.getState().token;

  const fetchBooks = async () => {
    try {
      const res = await api.get(`/admin/books`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await api.delete(`/admin/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  const handleEdit = (book) => {
    setEditingBook({ ...book });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (files) {
      setEditingBook((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setEditingBook((prev) => ({
        ...prev,
        [name]: Array.isArray(prev[name])
          ? value.split(",").map((s) => s.trim())
          : value,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.entries(editingBook).forEach(([key, value]) => {
        if (
          [
            "_id",
            "__v",
            "createdAt",
            "updatedAt",
            "readCount",
            "ratingsCount",
            "averageRating",
            "cloudinaryPublicId",
            "ratings",
            "embedding",
          ].includes(key)
        )
          return;

        if (
          (key === "thumbnail" || key === "pdfLink") &&
          value instanceof File
        ) {
          formData.append(key === "pdfLink" ? "pdf" : key, value);
        } else if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      });

      await api.put(`/admin/books/${editingBook._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setEditingBook(null);
      setIsModalOpen(false);
      fetchBooks();
    } catch (err) {
      console.error("Error updating book:", err);
    }
  };

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      (book.title && book.title.toLowerCase().includes(query)) ||
      (book.authors &&
        (Array.isArray(book.authors)
          ? book.authors.some((a) => a.toLowerCase().includes(query))
          : book.authors.toLowerCase().includes(query))) ||
      (book.categories &&
        (Array.isArray(book.categories)
          ? book.categories.some((c) => c.toLowerCase().includes(query))
          : book.categories.toLowerCase().includes(query)))
    );
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        📚 Book Management
      </h2>

      <input
        type="text"
        placeholder="Search by title, author, or category"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-xl mb-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500"
      />

      {isModalOpen && editingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl animate-fadeIn">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Edit Book
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(editingBook).map(([key, value]) => {
                if (
                  [
                    "_id",
                    "__v",
                    "createdAt",
                    "updatedAt",
                    "readCount",
                    "ratingsCount",
                    "averageRating",
                    "cloudinaryPublicId",
                    "ratings",
                    "embedding",
                  ].includes(key)
                )
                  return null;

                return (
                  <div key={key}>
                    <label className="block mb-1 text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                    {key === "thumbnail" || key === "pdfLink" ? (
                      <input
                        type="file"
                        name={key}
                        accept={key === "thumbnail" ? "image/*" : ".pdf"}
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      />
                    ) : (
                      <input
                        type="text"
                        name={key}
                        value={Array.isArray(value) ? value.join(", ") : value}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md shadow font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-400 text-white rounded-md shadow font-semibold transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {filteredBooks.length ? (
          filteredBooks.map((book) => (
            <div
            key={book._id}
            className="border p-3 rounded shadow flex flex-col sm:flex-row gap-4 items-start justify-between"
          >
            <div className="flex gap-4 items-start w-full sm:w-auto">
              <img
                src={book.thumbnail || "/assets/default-thumbnail.jpg"}
                alt={book.title}
                className="w-28 h-36 object-cover rounded border"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold break-words">{book.title}</h3>
                <p className="break-words">
                  <strong>Description:</strong> {book.description}
                </p>
                <p>
                  <strong>Rating:</strong> {book.averageRating} ({book.ratingsCount} ratings)
                </p>
                <p>
                  <strong>Read Count:</strong> {book.readCount}
                </p>
              </div>
            </div>
          
            <div className="flex sm:flex-col gap-2 items-start sm:items-end w-full sm:w-auto">
            
                <button
                  onClick={() => handleEdit(book)}
                  className="p-2 text-green-800 rounded hover:bg-green-100"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="p-2 text-red-600 rounded hover:bg-red-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
             
              {book.pdfLink && (
                <Link
                  to={`/readbook/${book.bookId || book._id}`}
                  className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm"
                >
                  Read
                </Link>
              )}
            </div>
          </div>
          
          ))
        ) : (
          <p className="text-gray-600">No books found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default BookManager;
