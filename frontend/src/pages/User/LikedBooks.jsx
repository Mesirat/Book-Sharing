import { useEffect, useState } from "react";
import axios from "axios";
import { Loader, LoaderCircle } from "lucide-react";
import Cards from "../../components/Cards";  

const API_URL = "http://localhost:5000/books";
const POPULAR_BOOKS_API_URL = "http://localhost:5000/books/popularbooks";

const LikedBooks = () => {
  const [likedBooks, setLikedBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedBooks = async () => {
      try {
        const response = await axios.get(`${API_URL}/likedbooks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
        const response = await axios.get(POPULAR_BOOKS_API_URL);
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
