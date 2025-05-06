import { useEffect, useState } from "react";
import api from "../../Services/api";
import { Loader, LoaderCircle } from "lucide-react";
import Cards from "../../components/Cards";  
import { useAuthStore } from "../../store/authStore";


const LikedBooks = () => {
  const [likedBooks, setLikedBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const token = useAuthStore.getState().token;
  useEffect(() => {
    const fetchLikedBooks = async () => {
      try {
        const response = await api.get(`/books/likedbooks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikedBooks(response.data.likedBooks);
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message || "Failed to fetch liked books");
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
        const response = await api.get("/books/popularbooks");
        setPopularBooks(response.data.books);
      } catch (error) {
        console.error("Failed to fetch popular books.");
      }
    };

    fetchLikedBooks();
    fetchPopularBooks();
  }, []);

  if (loading) {
    return  <div className="flex justify-center items-center h-60">
    <Loader className="animate-spin text-blue-500 w-10 h-10" />
  </div>;
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold">Error: {error}</div>;
  }

  return (
    <div className="w-full container mx-auto ">
      <h2 className="text-3xl font-bold mb-6 px-4">Liked Books</h2>

      {likedBooks.length === 0 ? (
        <>
          <p className="text-center text-gray-700 mb-6">You haven’t liked any books yet. Here are some popular ones you might enjoy:</p>
          <Cards books={popularBooks} /> 
        </>
      ) : (
        <Cards books={likedBooks} /> 
      )}
    </div>
  );
};

export default LikedBooks;
