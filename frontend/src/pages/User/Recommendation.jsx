import React, { useState, useEffect } from "react";
import axios from "axios";
import Cards from "../../components/Cards.jsx";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";

const Recommendation = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
            withCredentials: true
        });
        setBooks(response.data);
       
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

    fetchHybridRecommendations();
  }, [user]);

  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-center py-4">
          <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-600 text-lg">Loading recommendations...</p>
      </div>
    );

  return books.length > 0 ? (
    <div className="grid min-h-screen w-full justify-center items-center overflow-hidden px-8">
      <div className="text-start mb-6">
        <h1 className="text-4xl md:text-5xl font-sans">Suggested Reads</h1>
        <p className="text-lg mt-4 text-gray-600">
          Handpicked selections just for you, inspired by your reading tastes
        </p>
      </div>
      <Cards books={books} />
    </div>
  ) : (
    ""
  );
};

export default Recommendation;
