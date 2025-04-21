import { useEffect, useState } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

const API_URL = "http://localhost:5000/users";  // Ensure the endpoint is correct

const ReadLater = () => {
  const [readLater, setReadLater] = useState([]);
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
        if (error.response) {
          // API error response
          setError(error.response.data.message || "Failed to fetch liked books");
        } else if (error.request) {
          // Network error
          setError("Network error. Please try again later.");
        } else {
          // Unexpected error
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReadLater();
  }, []);

  if (loading) {
    return <LoaderCircle className="animate-spin" size={32} />;
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Later Read Books</h2>
      {ReadLater.length === 0 ? (
        <p className="text-center text-gray-700">No books added for later reading.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ReadLater.map((book) => (
            <div key={book.bookId || book.id} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <img
                src={book.thumbnail || "/fallback-image.jpg"} 
                alt={book.title || "Book Cover"}
                className="h-48 w-full object-cover rounded"
              />
              <h3 className="text-lg font-bold mt-4">{book.title || "Unknown Title"}</h3>
              <p className="text-gray-600 mt-2">{book.author || "Unknown Author"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadLater;
