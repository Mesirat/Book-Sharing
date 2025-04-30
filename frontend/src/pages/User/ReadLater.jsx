import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
import Cards from "../../components/Cards"; 

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

      <Cards
        books={displayBooks}
        onLike={readLater.length > 0 ? handleLike : undefined}
        onRemove={readLater.length > 0 ? handleRemove : undefined}
        showActions={readLater.length > 0}
      />
    </div>
  );
};

export default ReadLater;
