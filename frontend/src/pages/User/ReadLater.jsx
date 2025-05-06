import { useEffect, useState } from "react";
import api from "../../Services/api";
import { Loader } from "lucide-react";
import Cards from "../../components/Cards"; 
import { useAuthStore } from "../../store/authStore";



const ReadLater = () => {
  const [readLater, setReadLater] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const token = useAuthStore.getState().token;
  useEffect(() => {
    const fetchReadLater = async () => {
      try {
        const response = await api.get(`/books/ReadLater`, {
          headers: {
            Authorization: `Bearer ${token}`,
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
        const response = await api.get("/books/popularbooks");
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
      await api.put(`/books/Likebook`, book, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleRemove(book.bookId);
    } catch (error) {
      console.error("Error liking book:", error.message);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      const response = await api.put(
        `/books/ReadLater`,
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
