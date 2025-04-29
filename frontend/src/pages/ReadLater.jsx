import { useEffect, useState } from "react";
import axios from "axios";
import { LoaderCircle, Heart, Trash2, Loader } from "lucide-react";

const API_URL = "http://localhost:5000/books";
const POPULAR_BOOKS_API_URL = "http://localhost:5000/books/popularbooks";

const ReadLater = () => {
  const [readLater, setReadLater] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReadLater = async () => {
      try {
        const response = await axios.get(`${API_URL}/ReadLater`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setReadLater(response.data.laterReads);
      } catch (error) {
        setError("Failed to fetch Read Later books.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPopularBooks = async () => {
      try {
        const response = await axios.get(POPULAR_BOOKS_API_URL);
        setPopularBooks(response.data.books);
      } catch (err) {
        setError("Failed to fetch popular books.");
      }
    };

    fetchReadLater();
    fetchPopularBooks();
  }, []);

  const handleLike = async (book) => {
    try {
      await axios.put(`${API_URL}/Likebook`, book, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      handleRemove(book.bookId);
    } catch (error) {
      console.error("Error liking book:", error.message);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      const response = await axios.put(
        `${API_URL}/ReadLater`,
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setReadLater(response.data.laterReads);
    } catch (error) {
      console.error("Error removing book:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  }

  const displayBooks = readLater.length > 0 ? readLater : popularBooks;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {readLater.length > 0
          ? "Your Later Read Books"
          : "No books saved yet. Check out these popular books!"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayBooks.map((book) => (
          <div
            key={book.bookId || book.id}
            className="border p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 relative group"
          >
            <img
              src={book.thumbnail || "/fallback-image.jpg"}
              alt={book.title || "Book Cover"}
              className="h-48 w-full object-cover rounded"
            />
            <h3 className="text-lg font-bold mt-4">
              {book.title || "Unknown Title"}
            </h3>
            <p className="text-gray-600 mt-2">
              {book.author || "Unknown Author"}
            </p>

            {readLater.length > 0 && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleLike(book)}
                  title="Move to Liked"
                  className="bg-white p-1 rounded-full hover:bg-pink-100"
                >
                  <Heart className="text-pink-500" size={20} />
                </button>
                <button
                  onClick={() => handleRemove(book.bookId)}
                  title="Remove from Later Read"
                  className="bg-white p-1 rounded-full hover:bg-red-100"
                >
                  <Trash2 className="text-red-500" size={20} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadLater;
