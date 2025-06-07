
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cards from "../../components/Cards.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 4;

const Recommendation = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const token = useAuthStore.getState().token;

  useEffect(() => {
    const fetchHybridRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://127.0.0.1:8000/recommend/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setBooks(response.data);
        setCurrentPage(1); 
      } catch (err) {
        console.error(err);
        const errorMessage =
          err.response?.data?.message ||
          "Failed to load recommendations. Please try again later.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id && token) {
      fetchHybridRecommendations();
    }
  }, [user, token]);

  
  const totalPages = Math.ceil(books.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentBooks = books.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (error)
    return <div className="text-red-500 text-center mt-6">{error}</div>;

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-center py-4">
          <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 mx-auto" />
        </div>
        <p className="mt-4 text-gray-600 text-lg">Loading recommendations...</p>
      </div>
    );

  if (books.length === 0)
    return (
      <div className="text-center mt-10 text-gray-500">
        No recommendations available yet.
      </div>
    );

  return (
    <div className="min-h-screen w-full px-8 py-6">
      <div className="mb-6 text-start">
        <h1 className="text-4xl md:text-5xl font-sans">Suggested Reads</h1>
        <p className="text-lg mt-4 text-gray-600">
          Handpicked selections just for you, inspired by your reading tastes
        </p>
      </div>

      <Cards books={currentBooks} />

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center items-center space-x-3">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ChevronLeft />
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
        <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Recommendation;
