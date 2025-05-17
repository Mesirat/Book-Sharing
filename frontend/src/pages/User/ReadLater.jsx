import { useEffect, useState } from "react";
import api from "../../Services/api";
import { Loader } from "lucide-react";
import Cards from "../../components/Cards";
import { useAuthStore } from "../../store/authStore";

const ReadLater = () => {
  const [readLater, setReadLater] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useAuthStore.getState().token;
  useEffect(() => {
    const fetchReadLater = async (currentPage = 1) => {
      try {
        const response = await api.get(`/books/ReadLater?page=${currentPage}&limi=8`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReadLater(response.data.laterReads);
        setTotalPages(response.data.totalPages);
        setPage(currentPage);
      } catch (error) {
        if (error.response) {
          setError(
            error.response.data.message || "Failed to fetch laterReads"
          );
        } else if (error.request) {
          setError("Network error. Please try again later.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchPopularBooks = async () => {
      try {
        const response = await api.get("/books/topRead", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPopularBooks(response.data);
      } catch (err) {
        setError("Failed to fetch popular books.");
      }
    };

    fetchReadLater(page);
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
      {readLater.length > 0 ? (
        <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">📖 Your Later Read Books</h2>
        <p className="text-lg text-gray-600">Easily access the books you've saved to read later.</p>
      </div>
      
      ) : (
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">📚 Your Library is Empty</h2>
          <p className="text-lg text-gray-600">
            Check out some popular books to get started!
          </p>
        </div>
      )}

      <Cards
        books={displayBooks}
        onLike={readLater.length > 0 ? handleLike : undefined}
        onRemove={readLater.length > 0 ? handleRemove : undefined}
        showActions={readLater.length > 0}
      />
        {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-4 py-2 font-semibold">{`Page ${page} of ${totalPages}`}</span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
    </div>
  );
};

export default ReadLater;
