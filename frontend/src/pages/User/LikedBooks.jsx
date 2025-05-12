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
        const response = await api.get("/books/mostLiked",{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setPopularBooks(response.data);
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
     {likedBooks.length > 0 ? (
  <div className="text-center mb-6">
    <h2 className="text-3xl font-bold mb-2">❤️ Your Liked Books</h2>
    <p className="text-lg text-gray-600">All the books you've liked in one place.</p>
  </div>
) : (
  <div className="text-center mb-6">
    <h2 className="text-3xl font-bold mb-2">📚 No Liked Books Yet</h2>
    <p className="text-lg text-gray-600">You haven’t liked any books yet. Here are some popular ones you might enjoy:</p>
  </div>
)}

    </div>
  );
};

export default LikedBooks;
