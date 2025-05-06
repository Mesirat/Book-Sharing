import { useEffect, useState } from "react";
import api from "../../Services/api";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Cookies from 'js-cookie';
import { useAuthStore } from "../../store/authStore";
const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState(""); // Filter by category
  const [selectedAuthor, setSelectedAuthor] = useState(""); // Filter by author
  const API_URL = "http://localhost:5000";
 
  const token = useAuthStore.getState().token;


const fetchBooks = async () => {
  try {
    const res = await api.get(`/admin/books`, {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
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
      await api.put(
        `/admin/books/${editingBook._id}`,
        editingBook,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      console.error("Error updating book:", err);
    }
  };

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();

    const isTitleMatch = book.title && book.title.toLowerCase().includes(query);
    const isAuthorMatch =
      book.authors && Array.isArray(book.authors)
        ? book.authors.some((author) => author.toLowerCase().includes(query))
        : book.authors && book.authors.toLowerCase().includes(query);
    const isCategoryMatch =
      book.categories && Array.isArray(book.categories)
        ? book.categories.some((category) =>
            category.toLowerCase().includes(query)
          )
        : book.categories && book.categories.toLowerCase().includes(query);

    return isTitleMatch || isAuthorMatch || isCategoryMatch;
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Book Management</h2>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by title, author, or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {editingBook && (
        <div className="border p-4 mb-4 bg-gray-100 rounded">
          <h3 className="font-semibold text-lg mb-2">Edit Book</h3>
          {Object.entries(editingBook).map(([key, value]) => {
            if (["_id", "__v", "createdAt", "updatedAt"].includes(key))
              return null;

            return (
              <div key={key} className="mb-2">
                <label className="block mb-1 font-medium">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())}
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
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book._id}
              className="border p-3 rounded shadow flex gap-4 items-start justify-between"
            >
              <div className="flex gap-4 items-start">
                <img
                  src={book.thumbnail || "/assets/default-thumbnail.jpg"}
                  alt={book.title}
                  className="w-28 h-36 object-cover rounded border"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p>
                    <strong>Description:</strong> {book.description}
                  </p>
                  <p>
                    <strong>Rating:</strong> {book.averageRating} (
                    {book.ratingsCount} ratings)
                  </p>
                  <p>
                    <strong>Read Count:</strong> {book.readCount}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => handleEdit(book)}
                    className="px-3 py-1 text-green-800 rounded"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="px-3 py-1 text-red-600 rounded"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {book.pdfLink && (
                  <Link
                    to={`/readbook/${book._id}`}
                    className="mt-16 px-4 py-2 bg-gray-800 text-white rounded hover:underline"
                  >
                    Read Now
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No books found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default BookManager;
